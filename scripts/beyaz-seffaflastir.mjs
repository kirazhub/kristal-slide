#!/usr/bin/env node
// ==========================================================
// BEYAZ ARKA PLAN ŞEFFAFLAŞTIRICI
// ==========================================================
// AI'nın ürettiği görsellerin beyaz arka planını şeffaf yapar.
// Böylece oyun tahtasında tatlılar "havada duruyor" gibi görünür.
//
// Kullanım:
//   node scripts/beyaz-seffaflastir.mjs
//
// Dış bağımlılık yok — macOS yerleşik araçlarını kullanır.
// ==========================================================

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = join(__dirname, '..', 'public', 'assets');

// Saf JS PNG decoder/encoder yerine Canvas kullanacağız — ama Node'da Canvas yok.
// Çözüm: ImageMagick'in yerleşik olmadığı ama sips'in geliştirilmiş kardeşi olan
// CoreImage AppleScript veya Python+PIL gerekir. Onun yerine:
// Node 20+'da gelen "node:buffer" ile pure JS PNG düzenleyici yazacağız.

// ==========================================================
// SAF JS PNG PARSER VE ŞEFFAFLAŞTIRICI
// ==========================================================
// PNG formatı: 8 byte signature + chunk'lar (length, type, data, crc)
// Biz IDAT chunk'ını decompress edip, beyaza yakın pikselleri alpha=0 yapıp
// yeniden compress edeceğiz.
// ==========================================================

import { inflateSync, deflateSync } from 'node:zlib';

function pngOku(buffer) {
  // Signature doğrula
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < 8; i++) {
    if (buffer[i] !== sig[i]) throw new Error('Geçersiz PNG');
  }

  const chunks = [];
  let pos = 8;
  while (pos < buffer.length) {
    const length = buffer.readUInt32BE(pos);
    const type = buffer.slice(pos + 4, pos + 8).toString('ascii');
    const data = buffer.slice(pos + 8, pos + 8 + length);
    const crc = buffer.readUInt32BE(pos + 8 + length);
    chunks.push({ type, data, crc });
    pos += 12 + length;
    if (type === 'IEND') break;
  }
  return chunks;
}

function ihdrOku(data) {
  return {
    width:  data.readUInt32BE(0),
    height: data.readUInt32BE(4),
    bitDepth: data[8],
    colorType: data[9],   // 2=RGB, 6=RGBA
    compression: data[10],
    filter: data[11],
    interlace: data[12]
  };
}

// CRC32 hesaplama (PNG için)
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c;
  }
  return t;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunkYaz(type, data) {
  const buf = Buffer.alloc(12 + data.length);
  buf.writeUInt32BE(data.length, 0);
  buf.write(type, 4, 'ascii');
  data.copy(buf, 8);
  const crcInput = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  buf.writeUInt32BE(crc32(crcInput), 8 + data.length);
  return buf;
}

// Paeth filtresi (PNG filtre tipi 4)
function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

// Filtreli scanlineları çöz: her satırın başındaki filtre byte'ına göre
function satirlariCoz(raw, width, height, bpp) {
  const satirUzunluk = width * bpp;
  const out = Buffer.alloc(width * height * bpp);

  let rawPos = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[rawPos++];
    const outPos = y * satirUzunluk;
    const prevPos = outPos - satirUzunluk;

    for (let x = 0; x < satirUzunluk; x++) {
      const cur = raw[rawPos++];
      const left = x >= bpp ? out[outPos + x - bpp] : 0;
      const up = y > 0 ? out[prevPos + x] : 0;
      const upLeft = (y > 0 && x >= bpp) ? out[prevPos + x - bpp] : 0;

      let val;
      switch (filter) {
        case 0: val = cur; break;
        case 1: val = cur + left; break;
        case 2: val = cur + up; break;
        case 3: val = cur + Math.floor((left + up) / 2); break;
        case 4: val = cur + paeth(left, up, upLeft); break;
        default: throw new Error('Bilinmeyen filtre: ' + filter);
      }
      out[outPos + x] = val & 0xff;
    }
  }
  return out;
}

// Filtreli olmayan pikselleri tekrar filtreli hale getir (tüm satırlar filter=0 ile)
function satirlariFiltrele(piksel, width, height, bpp) {
  const satirUzunluk = width * bpp;
  const out = Buffer.alloc((satirUzunluk + 1) * height);
  for (let y = 0; y < height; y++) {
    out[y * (satirUzunluk + 1)] = 0; // filter = None
    piksel.copy(out, y * (satirUzunluk + 1) + 1, y * satirUzunluk, (y + 1) * satirUzunluk);
  }
  return out;
}

// ==========================================================
// BEYAZI ŞEFFAFLAŞTIR
// ==========================================================
function beyaziSeffaflastir(piksel, width, height, rgb2rgba) {
  // rgb2rgba === true ise giriş RGB (3 byte), çıkış RGBA (4 byte) olacak
  const gBpp = rgb2rgba ? 3 : 4;
  const cBpp = 4;
  const sonuc = Buffer.alloc(width * height * cBpp);

  // Beyaz eşiği (240+ olan piksellerin alphası azalır)
  const ESIK_TAM_SEFFAF = 248;    // 248+ tamamen şeffaf
  const ESIK_KISMEN = 225;        // 225-248 arası oransal alpha

  for (let i = 0, j = 0; i < piksel.length; i += gBpp, j += cBpp) {
    const r = piksel[i];
    const g = piksel[i + 1];
    const b = piksel[i + 2];
    const mevcutAlpha = rgb2rgba ? 255 : piksel[i + 3];

    sonuc[j] = r;
    sonuc[j + 1] = g;
    sonuc[j + 2] = b;

    const minRGB = Math.min(r, g, b);
    let yeniAlpha;

    if (minRGB >= ESIK_TAM_SEFFAF) {
      yeniAlpha = 0; // tamamen şeffaf
    } else if (minRGB >= ESIK_KISMEN) {
      // Kenar yumuşatma: oransal alpha
      const oran = (ESIK_TAM_SEFFAF - minRGB) / (ESIK_TAM_SEFFAF - ESIK_KISMEN);
      yeniAlpha = Math.round(255 * oran);
    } else {
      yeniAlpha = 255; // tamamen opak
    }

    sonuc[j + 3] = Math.min(mevcutAlpha, yeniAlpha);
  }
  return sonuc;
}

// ==========================================================
// ANA İŞLEM
// ==========================================================
function dosyayiIsle(dosyaYol) {
  const buffer = readFileSync(dosyaYol);
  const chunks = pngOku(buffer);

  const ihdr = chunks.find(c => c.type === 'IHDR');
  if (!ihdr) throw new Error('IHDR yok');
  const info = ihdrOku(ihdr.data);

  if (info.bitDepth !== 8) {
    throw new Error(`Desteklenmeyen bit derinliği: ${info.bitDepth}`);
  }
  if (info.colorType !== 2 && info.colorType !== 6) {
    throw new Error(`Desteklenmeyen renk tipi: ${info.colorType} (2=RGB, 6=RGBA bekleniyor)`);
  }
  if (info.interlace !== 0) {
    throw new Error('Interlace desteklenmiyor');
  }

  const bpp = info.colorType === 6 ? 4 : 3;

  // Tüm IDAT chunk'ları birleştir
  const idatParcalar = chunks.filter(c => c.type === 'IDAT').map(c => c.data);
  const idatBirlesik = Buffer.concat(idatParcalar);

  // Decompress
  const raw = inflateSync(idatBirlesik);

  // Filtreleri çöz → saf piksel verisi
  const piksel = satirlariCoz(raw, info.width, info.height, bpp);

  // Beyazı şeffaflaştır
  const yeniPiksel = beyaziSeffaflastir(piksel, info.width, info.height, bpp === 3);

  // Yeniden filtrele ve compress et
  const yeniRaw = satirlariFiltrele(yeniPiksel, info.width, info.height, 4);
  const yeniIdat = deflateSync(yeniRaw, { level: 9 });

  // Yeni IHDR — colorType=6 (RGBA)
  const yeniIhdr = Buffer.alloc(13);
  yeniIhdr.writeUInt32BE(info.width, 0);
  yeniIhdr.writeUInt32BE(info.height, 4);
  yeniIhdr[8] = 8;    // bitDepth
  yeniIhdr[9] = 6;    // colorType = RGBA
  yeniIhdr[10] = 0;
  yeniIhdr[11] = 0;
  yeniIhdr[12] = 0;

  // Yeni PNG'yi yaz
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const parcalar = [
    signature,
    chunkYaz('IHDR', yeniIhdr),
    chunkYaz('IDAT', yeniIdat),
    chunkYaz('IEND', Buffer.alloc(0))
  ];
  const yeniPNG = Buffer.concat(parcalar);

  writeFileSync(dosyaYol, yeniPNG);
  const oranPct = ((1 - yeniPNG.length / buffer.length) * 100).toFixed(1);
  console.log(`   ✅ ${dosyaYol.split('/').pop()}: ${(buffer.length/1024).toFixed(1)} KB → ${(yeniPNG.length/1024).toFixed(1)} KB (${oranPct}% küçüldü)`);
}

// ==========================================================
// ÇALIŞTIR
// ==========================================================
console.log('\n🎨 Beyaz arka planları şeffaflaştırılıyor...\n');

const dosyalar = readdirSync(ASSETS).filter(f => f.endsWith('.png'));
let basarili = 0;
let hatali = 0;

for (const dosya of dosyalar) {
  try {
    dosyayiIsle(join(ASSETS, dosya));
    basarili++;
  } catch (e) {
    console.error(`   ❌ ${dosya}: ${e.message}`);
    hatali++;
  }
}

console.log(`\n📊 ${basarili} başarılı, ${hatali} hatalı\n`);
