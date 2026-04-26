// ==========================================================
// KRİSTAL KRALLIĞI — 100 Bölüm Verisi
// ==========================================================
// Her bölüm: hedef tipi, hedef miktarı, maksimum hamle, yıldız eşikleri
// Hardcore zorluk eğrisi: hızlı artan zorluk, combolar şart
// ==========================================================

// Hedef tipleri:
//   TOPLA    → belirli kristallerden X tane topla
//   PUAN     → N hamlede M puan yap
//   TEMIZLE  → tahtadaki tüm "engeli" temizle (ileride eklenecek, şimdilik puan gibi)
//   COMBO    → N hamlede M combo (x3 veya üstü) yap

const KRISTALLER = ['💎', '❤️', '🔺', '🟦', '⭐', '💧'];
// Eski emoji anahtarları: elmas=🍰 yakut=🍪 zümrüt=🍓 safir=🍫 ametist=🍦 amber=🍭
const EMOJI_ESLEME = {
  '💎': '🍰', '❤️': '🍪', '🔺': '🍓',
  '🟦': '🍫', '⭐': '🍦', '💧': '🍭'
};

// Her 5 bölümde hedef tipi değişir, her 10 bölümde zorluk sıçrar
function bolumUret(numara) {
  // Hardcore zorluk eğrisi
  const grup = Math.floor((numara - 1) / 10); // 0-9
  const bolumdeGrup = ((numara - 1) % 10) + 1; // 1-10

  // Hedef tipi rotasyonu (10 bölümde çeşitlilik)
  const tipler = ['TOPLA', 'TOPLA', 'PUAN', 'TOPLA', 'COMBO', 'TOPLA', 'PUAN', 'TOPLA', 'COMBO', 'TOPLA'];
  const tip = tipler[(numara - 1) % 10];

  // Hedef kristali döndür (her bölümde biri)
  const hedefKristal = KRISTALLER[(numara - 1) % KRISTALLER.length];

  let hedef, maxHamle, ad;

  switch (tip) {
    case 'TOPLA': {
      // Hardcore: başta kolay (15), hızla zorlaş (80'e kadar)
      const baz = 15 + grup * 6;
      hedef = Math.round(baz + bolumdeGrup * 2);
      maxHamle = Math.max(18, 35 - grup * 2 - Math.floor(bolumdeGrup / 2));
      ad = `${hedef} ${kristalAdi(hedefKristal)} topla`;
      break;
    }
    case 'PUAN': {
      // Puan hedefi: 2000'den 25000'e
      hedef = 2000 + grup * 1800 + bolumdeGrup * 200;
      maxHamle = Math.max(16, 28 - grup);
      ad = `${hedef.toLocaleString('tr-TR')} puan yap`;
      break;
    }
    case 'COMBO': {
      // Combo hedefi: 3'ten 15'e
      hedef = 3 + grup + Math.floor(bolumdeGrup / 3);
      maxHamle = Math.max(18, 30 - grup);
      ad = `${hedef} süper combo yap`;
      break;
    }
  }

  // Yıldız eşikleri (hedefin %100, %150, %200'ü kadar altın için)
  const yildizlar = {
    bir: Math.round(hedef * (tip === 'PUAN' ? 1 : 10)),       // 1 yıldız
    iki: Math.round(hedef * (tip === 'PUAN' ? 1.5 : 15)),     // 2 yıldız
    uc: Math.round(hedef * (tip === 'PUAN' ? 2 : 20))         // 3 yıldız
  };

  return {
    numara,
    tip,
    hedef,
    hedefKristal,
    hedefKristalEski: EMOJI_ESLEME[hedefKristal],
    maxHamle,
    ad,
    yildizlar,
    grup
  };
}

function kristalAdi(emoji) {
  const adlar = {
    '💎': 'elmas', '❤️': 'yakut', '🔺': 'zümrüt',
    '🟦': 'safir', '⭐': 'ametist', '💧': 'amber'
  };
  return adlar[emoji] || 'kristal';
}

// 100 bölümü üret
const BOLUMLER = [];
for (let i = 1; i <= 100; i++) {
  BOLUMLER.push(bolumUret(i));
}

// Dışa aktarma (hem browser hem Node için)
if (typeof window !== 'undefined') {
  window.BOLUMLER = BOLUMLER;
  window.KRISTALLER = KRISTALLER;
  window.EMOJI_ESLEME = EMOJI_ESLEME;
  window.kristalAdi = kristalAdi;
}
if (typeof module !== 'undefined') {
  module.exports = { BOLUMLER, KRISTALLER, EMOJI_ESLEME, kristalAdi };
}
