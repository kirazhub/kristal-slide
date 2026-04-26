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
// TATLI PROMPT'LARI
// ==========================================================
const TATLILAR = {
  kek: {
    dosya: 'kek.png',
    prompt: `cute 3D rendered pink strawberry cake on pure white background, glossy pink frosting with whipped cream swirls, three bright red strawberries on top with green leaves, single birthday candle with small yellow flame, chocolate sponge cake layer visible, kawaii style, mobile match-3 game asset, candy crush style, vibrant saturated colors, shiny glossy highlights, soft cartoon style, centered composition, solid pure white background, clean product photo, no shadows on ground, highly detailed`
  },
  kurabiye: {
    dosya: 'kurabiye.png',
    prompt: `cute 3D rendered chocolate chip cookie on pure white background, golden brown cookie dough with visible dark chocolate chunks, glossy shiny surface, slightly irregular bumpy round edges, kawaii cartoon style, mobile match-3 game asset, candy crush style, warm saturated colors, soft studio lighting, centered composition, solid pure white background, no shadows on ground, highly detailed`
  },
  cilek: {
    dosya: 'cilek.png',
    prompt: `cute 3D rendered red strawberry on pure white background, heart shape, glossy shiny red surface with highlights, tiny yellow seeds visible on skin, fresh green leaves on top with small stem, kawaii cartoon style, mobile match-3 game asset, candy crush style, vibrant red color, juicy appearance, centered composition, solid pure white background, no shadows on ground, highly detailed`
  },
  cikolata: {
    dosya: 'cikolata.png',
    prompt: `cute 3D rendered chocolate bar on pure white background, dark milk chocolate squares in 4x4 grid pattern, glossy shiny surface, slight 3D perspective tilted view, kawaii cartoon style, mobile match-3 game asset, candy crush style, rich brown colors, melty appearance with highlights, centered composition, solid pure white background, no shadows on ground, highly detailed`
  },
  dondurma: {
    dosya: 'dondurma.png',
    prompt: `cute 3D rendered ice cream cone on pure white background, two scoops of ice cream vanilla and blue raspberry flavors, waffle cone with crosshatch texture, colorful rainbow sprinkles on top, red cherry on top with small green leaf, pink strawberry syrup dripping down, kawaii cartoon style, mobile match-3 game asset, candy crush style, vibrant colors, glossy shiny highlights, centered composition, solid pure white background, no shadows on ground, highly detailed`
  },
  lolipop: {
    dosya: 'lolipop.png',
    prompt: `cute 3D rendered purple swirl lollipop candy on pure white background, round disc shape, white spiral pattern swirling from center, glossy shiny surface with bright highlights, white plastic stick, kawaii cartoon style, mobile match-3 game asset, candy crush style, vibrant purple and white colors, shiny candy appearance, centered composition, solid pure white background, no shadows on ground, highly detailed`
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
