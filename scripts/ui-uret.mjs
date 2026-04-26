#!/usr/bin/env node
// ==========================================================
// PASTA ŞEFİ — UI Elemanları Üretici (Leonardo AI)
// ==========================================================
// Kristal oyunu için tüm UI parçalarını AI ile tasarlar:
// - Logo/başlık
// - Altın sayacı kutusu
// - Hedef/bölüm kutusu
// - 3 güç ikonu (çekiç, karıştır, bomba)
//
// Kullanım:
//   node scripts/ui-uret.mjs               → hepsini üret
//   node scripts/ui-uret.mjs logo          → sadece logo
// ==========================================================

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJE_KOK = join(__dirname, '..');

function envOku() {
  const envYol = join(PROJE_KOK, '.env');
  const icerik = readFileSync(envYol, 'utf8');
  const degiskenler = {};
  icerik.split('\n').forEach(satir => {
    const temiz = satir.trim();
    if (!temiz || temiz.startsWith('#')) return;
    const esitlikIndex = temiz.indexOf('=');
    if (esitlikIndex === -1) return;
    degiskenler[temiz.slice(0, esitlikIndex).trim()] = temiz.slice(esitlikIndex + 1).trim();
  });
  return degiskenler;
}

const API_KEY = envOku().LEONARDO_API_KEY;
const API_TABAN = 'https://cloud.leonardo.ai/api/rest/v1';
const MODEL_ID = 'b2614463-296c-462a-9586-aafdb8f00e36';  // FLUX Dev
const STIL_3D = 'debdf72a-91a4-467b-bf61-cc02bdeb69c6';   // 3D Render

const UI_KLASOR = join(PROJE_KOK, 'public', 'ui');
if (!existsSync(UI_KLASOR)) mkdirSync(UI_KLASOR, { recursive: true });

// ==========================================================
// UI ELEMAN PROMPT'LARI
// ==========================================================
const UI_ELEMANLARI = {
  logo: {
    dosya: 'logo.png',
    // Logo yatay: uzun düşük
    en: 1024,
    boy: 512,
    prompt: `3D rendered fantasy game logo text "CRYSTAL KINGDOM" in big bold ornate letters made of shiny metallic gold and crystal gems, each letter has embedded colorful gemstones (diamond, ruby, emerald, sapphire), royal medieval fantasy style, glowing magical aura, mobile game title banner, candy crush saga style logo, bejeweled game style, ultra glossy polished metal and gems, vibrant colors with purple blue magenta gold, sparkles and stars around, centered composition on solid pure white background, no shadow, highly detailed, 8k render`
  },
  altin_kutu: {
    dosya: 'altin-kutu.png',
    en: 512,
    boy: 512,
    prompt: `3D rendered fantasy game UI frame panel, ornate gold metal border frame with gem decorations on corners, horizontal pill shape with rounded edges, shiny polished gold metallic surface with engravings, glowing center area empty ready for number text, royal medieval fantasy style, mobile match-3 game UI asset, candy crush saga style frame, bejeweled game style, ultra glossy, vibrant golden yellow with jewel accents, centered composition on solid pure white background, no shadow, empty inside, highly detailed, 8k render`
  },
  hedef_kutu: {
    dosya: 'hedef-kutu.png',
    en: 768,
    boy: 512,
    prompt: `3D rendered fantasy game UI frame panel, ornate purple-silver metal border frame with gem decorations on corners, horizontal rounded rectangle shape, shiny polished silver metallic surface with purple crystal accents, glowing center area empty ready for text, royal medieval fantasy style, mobile match-3 game UI asset, candy crush saga style frame, bejeweled game style, ultra glossy, vibrant silver and purple with jewel accents, centered composition on solid pure white background, no shadow, empty inside, highly detailed, 8k render`
  },
  guc_cekic: {
    dosya: 'guc-cekic.png',
    en: 512,
    boy: 512,
    prompt: `3D rendered fantasy game power-up icon, magical crystal hammer weapon with shiny metallic silver head and golden handle, glowing blue magical energy around the hammer, sparkles and stars, mobile match-3 game special power icon, candy crush saga style booster icon, bejeweled game style, ultra glossy 3D icon, vibrant silver blue gold colors, centered composition on solid pure white background, no shadow, isolated single item, highly detailed, 8k render`
  },
  guc_karistir: {
    dosya: 'guc-karistir.png',
    en: 512,
    boy: 512,
    prompt: `3D rendered fantasy game power-up icon, two curved circular arrows in swirl pattern forming a shuffle shuffle refresh symbol, shiny metallic gold arrows with glowing magical purple energy, sparkles and stars, mobile match-3 game special power icon, candy crush saga style booster icon, bejeweled game style, ultra glossy 3D icon, vibrant gold purple blue colors, centered composition on solid pure white background, no shadow, isolated single item, highly detailed, 8k render`
  },
  guc_bomba: {
    dosya: 'guc-bomba.png',
    en: 512,
    boy: 512,
    prompt: `3D rendered fantasy game power-up icon, round black bomb with burning fuse on top, red sparks and fire around the fuse, shiny metallic bomb body with highlights, glowing orange magical energy, sparkles and flames, mobile match-3 game special power icon, candy crush saga style booster icon, bejeweled game style, ultra glossy 3D icon, vibrant black red orange colors, centered composition on solid pure white background, no shadow, isolated single item, highly detailed, 8k render`
  }
};

// ==========================================================
// LEONARDO API
// ==========================================================
async function uretimBaslat(prompt, en, boy) {
  const cevap = await fetch(`${API_TABAN}/generations`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'authorization': `Bearer ${API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      modelId: MODEL_ID,
      contrast: 3.5,
      prompt,
      num_images: 1,
      width: en,
      height: boy,
      styleUUID: STIL_3D,
      enhancePrompt: false,
      negative_prompt: 'text errors, misspelled letters, watermark, signature, border frame box, multiple items, blurry, low quality, jpeg artifacts, bad anatomy'
    })
  });
  if (!cevap.ok) {
    throw new Error(`API hatası (${cevap.status}): ${await cevap.text()}`);
  }
  const veri = await cevap.json();
  return veri?.sdGenerationJob?.generationId;
}

async function uretimSonucuBekle(id, maxMs = 90_000) {
  const baslangic = Date.now();
  let deneme = 0;
  while (Date.now() - baslangic < maxMs) {
    deneme++;
    await new Promise(r => setTimeout(r, 4000));
    const cevap = await fetch(`${API_TABAN}/generations/${id}`, {
      headers: { 'accept': 'application/json', 'authorization': `Bearer ${API_KEY}` }
    });
    if (!cevap.ok) continue;
    const veri = await cevap.json();
    const durum = veri?.generations_by_pk?.status;
    console.log(`   ⏳ sorgu ${deneme}: ${durum}`);
    if (durum === 'COMPLETE') {
      return veri.generations_by_pk.generated_images?.[0]?.url;
    }
    if (durum === 'FAILED') throw new Error('Üretim başarısız');
  }
  throw new Error('Zaman aşımı');
}

async function indirVeKaydet(url, hedefYol) {
  const cevap = await fetch(url);
  const buffer = Buffer.from(await cevap.arrayBuffer());
  const gecici = hedefYol + '.tmp.bin';
  writeFileSync(gecici, buffer);
  execSync(`sips -s format png "${gecici}" --out "${hedefYol}"`, { stdio: 'ignore' });
  execSync(`rm -f "${gecici}"`);
  return buffer.length;
}

// ==========================================================
// ANA
// ==========================================================
async function calistir() {
  const istenen = process.argv[2];
  const hedefler = istenen ? { [istenen]: UI_ELEMANLARI[istenen] } : UI_ELEMANLARI;

  if (istenen && !UI_ELEMANLARI[istenen]) {
    console.error(`❌ "${istenen}" yok. Mevcut: ${Object.keys(UI_ELEMANLARI).join(', ')}`);
    process.exit(1);
  }

  console.log(`\n🎨 UI Elemanları Üretici`);
  console.log(`   Çıktı: ${UI_KLASOR}\n`);

  let basarili = 0, hatali = 0;
  for (const [ad, el] of Object.entries(hedefler)) {
    try {
      console.log(`\n🖼  ${ad.toUpperCase()} (${el.en}x${el.boy})...`);
      const id = await uretimBaslat(el.prompt, el.en, el.boy);
      console.log(`   📋 ID: ${id}`);
      const url = await uretimSonucuBekle(id);
      const hedef = join(UI_KLASOR, el.dosya);
      const boyut = await indirVeKaydet(url, hedef);
      console.log(`   ✅ ${hedef} (${(boyut/1024).toFixed(1)} KB)`);
      basarili++;
    } catch (e) {
      console.error(`   ❌ ${ad}: ${e.message}`);
      hatali++;
    }
  }

  console.log(`\n📊 ${basarili} başarılı, ${hatali} hatalı\n`);
}

calistir().catch(e => { console.error('💥', e); process.exit(1); });
