#!/usr/bin/env node
// ==========================================================
// PASTA ŞEFİ — Leonardo.ai Görsel Üretme Scripti
// ==========================================================
// Kullanım:
//   node scripts/gorsel-uret.mjs          → tüm tatlıları üretir
//   node scripts/gorsel-uret.mjs kek      → sadece keki üretir
//
// Leonardo API akışı:
//   1. POST /generations      → üretim başlat (generationId döner)
//   2. Bekle (5-15 saniye)
//   3. GET  /generations/{id} → durumu sorgula, URL'leri al
//   4. URL'den PNG indir, public/assets/ klasörüne kaydet
// ==========================================================

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// ESM'de __dirname yok, kendimiz üretiyoruz
const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJE_KOK = join(__dirname, '..');

// .env dosyasını elle oku (ekstra paket yükleme gereksin diye dotenv eklemiyoruz)
function envOku() {
  const envYol = join(PROJE_KOK, '.env');
  if (!existsSync(envYol)) {
    console.error('❌ .env dosyası bulunamadı:', envYol);
    process.exit(1);
  }
  const icerik = readFileSync(envYol, 'utf8');
  const degiskenler = {};
  icerik.split('\n').forEach(satir => {
    const temiz = satir.trim();
    if (!temiz || temiz.startsWith('#')) return;
    const esitlikIndex = temiz.indexOf('=');
    if (esitlikIndex === -1) return;
    const anahtar = temiz.slice(0, esitlikIndex).trim();
    const deger = temiz.slice(esitlikIndex + 1).trim();
    degiskenler[anahtar] = deger;
  });
  return degiskenler;
}

const env = envOku();
const API_KEY = env.LEONARDO_API_KEY;

if (!API_KEY || API_KEY === 'buraya_anahtarinizi_yazin') {
  console.error('❌ LEONARDO_API_KEY .env dosyasında tanımlı değil');
  process.exit(1);
}

// ==========================================================
// SABİTLER
// ==========================================================
const API_TABAN = 'https://cloud.leonardo.ai/api/rest/v1';
// FLUX Dev modeli — kaliteli, hızlı, üründe önerilen
const MODEL_ID = 'b2614463-296c-462a-9586-aafdb8f00e36';
// "3D Render" stili — tam istediğimiz canlı 3D oyun tarzı
const STIL_3D = 'debdf72a-91a4-467b-bf61-cc02bdeb69c6';

const CIKTI_KLASOR = join(PROJE_KOK, 'public', 'assets');
if (!existsSync(CIKTI_KLASOR)) mkdirSync(CIKTI_KLASOR, { recursive: true });

// ==========================================================
// KRISTAL (GEM) PROMPT'LARI — Her biri farklı şekil!
// ==========================================================
const TATLILAR = {
  kek: { // 💎 Elmas — klasik elmas kesimi (brilliant cut)
    dosya: 'kek.png',
    prompt: `3D rendered classic brilliant cut diamond gem on pure white background, traditional diamond shape with pointed bottom and flat top crown, multiple triangular facets catching light, clear bright white color with rainbow prism refractions inside, sparkling light reflections, glowing white highlights, mobile match-3 puzzle game asset, candy crush saga style jewel icon, bejeweled game style, ultra glossy glass material, vibrant pure white with silver and rainbow tones, centered composition, solid pure white background, no shadows, highly detailed, 8k render`
  },
  kurabiye: { // ❤️ Yakut — kalp şekli
    dosya: 'kurabiye.png',
    prompt: `3D rendered heart-shaped ruby gem on pure white background, classic heart shape cut gemstone, deep rich red ruby with faceted surfaces, glowing inner fire light, bright red and pink highlights, sparkle and shine, mobile match-3 puzzle game asset, candy crush saga style jewel icon, bejeweled game style, ultra glossy glass material, vibrant deep red heart crystal, centered composition, solid pure white background, no shadows, highly detailed, 8k render`
  },
  cilek: { // 🔺 Zümrüt — üçgen/piramit
    dosya: 'cilek.png',
    prompt: `3D rendered triangular pyramid shaped emerald gem on pure white background, classic triangle cut gemstone with sharp corners and flat triangular top, bright vivid green emerald with faceted surfaces, glowing inner green light, bright lime and white highlights, sparkle and shine, mobile match-3 puzzle game asset, candy crush saga style jewel icon, bejeweled game style, ultra glossy glass material, vibrant emerald green triangular crystal, centered composition, solid pure white background, no shadows, highly detailed, 8k render`
  },
  cikolata: { // 🟦 Safir — klasik kare (princess cut)
    dosya: 'cikolata.png',
    prompt: `3D rendered square princess cut sapphire gem on pure white background, perfect square shape with sharp 90 degree corners and beveled faceted edges, deep royal blue sapphire, multiple facets catching light, glowing inner blue glow, bright cyan and white highlights, sparkle and shine, mobile match-3 puzzle game asset, candy crush saga style jewel icon, bejeweled game style, ultra glossy glass material, vibrant deep blue square crystal, centered composition, solid pure white background, no shadows, highly detailed, 8k render`
  },
  dondurma: { // ⭐ Ametist — yıldız şekli (6 uçlu)
    dosya: 'dondurma.png',
    prompt: `3D rendered six-pointed star-shaped amethyst gem on pure white background, classic star cut gemstone with six sharp points radiating outward, rich purple amethyst with faceted surfaces, glowing inner violet light, bright magenta and white highlights, sparkle and shine, mobile match-3 puzzle game asset, candy crush saga style jewel icon, bejeweled game style, ultra glossy glass material, vibrant purple star crystal, centered composition, solid pure white background, no shadows, highly detailed, 8k render`
  },
  lolipop: { // 💧 Amber — damla/oval şekli
    dosya: 'lolipop.png',
    prompt: `3D rendered teardrop pear-shaped amber topaz gem on pure white background, classic teardrop pear cut gemstone with pointed top and round bottom, bright golden orange amber with faceted surfaces, glowing inner warm light, bright yellow gold and white highlights, sparkle and shine, mobile match-3 puzzle game asset, candy crush saga style jewel icon, bejeweled game style, ultra glossy glass material, vibrant orange gold teardrop crystal, centered composition, solid pure white background, no shadows, highly detailed, 8k render`
  }
};

// ==========================================================
// LEONARDO API ÇAĞRILARI
// ==========================================================

async function uretimBaslat(prompt) {
  console.log('   → üretim isteği gönderiliyor...');
  const cevap = await fetch(`${API_TABAN}/generations`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'authorization': `Bearer ${API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      modelId: MODEL_ID,
      contrast: 3.5,           // Orta kontrast — yumuşak cartoon için uygun
      prompt: prompt,
      num_images: 1,           // Her tatlı için 1 görsel (token tasarrufu)
      width: 1024,
      height: 1024,
      styleUUID: STIL_3D,      // 3D Render stili
      enhancePrompt: false,
      negative_prompt: 'text, watermark, signature, border, frame, multiple items, blurry, low quality'
    })
  });

  if (!cevap.ok) {
    const hata = await cevap.text();
    throw new Error(`API hatası (${cevap.status}): ${hata}`);
  }

  const veri = await cevap.json();
  const id = veri?.sdGenerationJob?.generationId;
  if (!id) throw new Error('Generation ID alınamadı: ' + JSON.stringify(veri));
  return id;
}

async function uretimSonucuBekle(generationId, maxBekleme = 90_000) {
  const baslangic = Date.now();
  let denemeSayi = 0;

  while (Date.now() - baslangic < maxBekleme) {
    denemeSayi++;
    await new Promise(r => setTimeout(r, 4000)); // 4 saniye bekle

    const cevap = await fetch(`${API_TABAN}/generations/${generationId}`, {
      headers: {
        'accept': 'application/json',
        'authorization': `Bearer ${API_KEY}`
      }
    });

    if (!cevap.ok) {
      console.log(`   ⏳ durum sorgusu ${denemeSayi} başarısız (${cevap.status}), tekrar deneniyor...`);
      continue;
    }

    const veri = await cevap.json();
    const uretim = veri?.generations_by_pk;
    const durum = uretim?.status;

    console.log(`   ⏳ durum sorgusu ${denemeSayi}: ${durum || 'bilinmiyor'}`);

    if (durum === 'COMPLETE') {
      const resimler = uretim.generated_images || [];
      if (resimler.length === 0) throw new Error('Üretim tamamlandı ama görsel yok');
      return resimler[0].url;
    }

    if (durum === 'FAILED') {
      throw new Error('Üretim başarısız oldu');
    }
  }
  throw new Error(`Zaman aşımı: ${maxBekleme}ms sonra hâlâ tamamlanmadı`);
}

async function dosyayiIndir(url, hedefYol) {
  console.log(`   ⬇ indiriliyor: ${url.substring(0, 80)}...`);
  const cevap = await fetch(url);
  if (!cevap.ok) throw new Error(`İndirme başarısız: ${cevap.status}`);
  const buffer = Buffer.from(await cevap.arrayBuffer());

  // Leonardo aslında JPEG döndürüyor — sips ile PNG'ye çevir
  const gecici = hedefYol + '.tmp.bin';
  writeFileSync(gecici, buffer);

  const { execSync } = await import('node:child_process');
  // sips ile format çevirimi (macOS yerleşik araç)
  execSync(`sips -s format png "${gecici}" --out "${hedefYol}"`, { stdio: 'ignore' });
  execSync(`rm -f "${gecici}"`);

  const boyutKB = (buffer.length / 1024).toFixed(1);
  console.log(`   ✅ kaydedildi: ${hedefYol} (PNG, ${boyutKB} KB kaynaktan)`);
}

// ==========================================================
// ANA AKIŞ
// ==========================================================

async function birTatliUret(ad, tatli) {
  console.log(`\n🎨 ${ad.toUpperCase()} üretiliyor...`);
  const genId = await uretimBaslat(tatli.prompt);
  console.log(`   📋 Generation ID: ${genId}`);
  const url = await uretimSonucuBekle(genId);
  const hedef = join(CIKTI_KLASOR, tatli.dosya);
  await dosyayiIndir(url, hedef);
  return { ad, hedef, url };
}

async function calistir() {
  const istenen = process.argv[2]; // opsiyonel: tek tatlı seçimi
  const hedefler = istenen
    ? { [istenen]: TATLILAR[istenen] }
    : TATLILAR;

  if (istenen && !TATLILAR[istenen]) {
    console.error(`❌ "${istenen}" diye bir tatlı yok. Mevcut: ${Object.keys(TATLILAR).join(', ')}`);
    process.exit(1);
  }

  console.log(`\n🚀 Pasta Şefi — AI Görsel Üretici`);
  console.log(`   Üretilecek: ${Object.keys(hedefler).join(', ')}`);
  console.log(`   Çıktı klasörü: ${CIKTI_KLASOR}\n`);

  const sonuclar = [];
  const hatalar = [];

  for (const [ad, tatli] of Object.entries(hedefler)) {
    try {
      const sonuc = await birTatliUret(ad, tatli);
      sonuclar.push(sonuc);
    } catch (e) {
      console.error(`   ❌ ${ad} başarısız: ${e.message}`);
      hatalar.push({ ad, hata: e.message });
    }
  }

  console.log(`\n📊 Özet:`);
  console.log(`   ✅ Başarılı: ${sonuclar.length}`);
  console.log(`   ❌ Başarısız: ${hatalar.length}`);
  if (hatalar.length) {
    console.log('\nHatalı olanlar:');
    hatalar.forEach(h => console.log(`   - ${h.ad}: ${h.hata}`));
  }
}

calistir().catch(e => {
  console.error('\n💥 Kritik hata:', e);
  process.exit(1);
});
