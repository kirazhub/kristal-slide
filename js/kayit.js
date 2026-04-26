// ==========================================================
// KAYIT SİSTEMİ — LocalStorage ile oyuncu durumu
// ==========================================================

const KAYIT_KEY = 'kristal-kralligi-v1';

const VARSAYILAN = {
  altin: 0,
  enYuksekBolum: 1,          // Oyuncunun açık maksimum bölüm
  bolumYildizlari: {},       // { 1: 3, 2: 2, ... }
  bolumPuanlari: {},         // { 1: 2500, 2: 1800, ... }
  aktifGucler: {             // Oyuncunun envanterindeki güçler
    cekic: 3,
    karistir: 2,
    bomba: 2
  },
  ayarlar: {
    ses: true,
    muzik: true,
    titresim: true
  },
  toplamOynanan: 0,
  toplamCombo: 0,
  ilkGiris: Date.now()
};

function kayitYukle() {
  try {
    const raw = localStorage.getItem(KAYIT_KEY);
    if (!raw) return { ...VARSAYILAN };
    const veri = JSON.parse(raw);
    // Eksik alanları varsayılanla doldur
    return {
      ...VARSAYILAN,
      ...veri,
      aktifGucler: { ...VARSAYILAN.aktifGucler, ...(veri.aktifGucler || {}) },
      ayarlar: { ...VARSAYILAN.ayarlar, ...(veri.ayarlar || {}) }
    };
  } catch (e) {
    console.warn('Kayıt bozuk, sıfırdan başlıyor:', e);
    return { ...VARSAYILAN };
  }
}

function kayitYaz(veri) {
  try {
    localStorage.setItem(KAYIT_KEY, JSON.stringify(veri));
    return true;
  } catch (e) {
    console.error('Kayıt başarısız:', e);
    return false;
  }
}

function kayitSifirla() {
  localStorage.removeItem(KAYIT_KEY);
  return { ...VARSAYILAN };
}

// Bölüm tamamlama — yıldız ve altın güncelle
function bolumTamamla(kayit, bolumNo, yildiz, kazanilanAltin, puan) {
  const oncekiYildiz = kayit.bolumYildizlari[bolumNo] || 0;
  const oncekiPuan = kayit.bolumPuanlari[bolumNo] || 0;

  kayit.altin += kazanilanAltin;
  kayit.bolumYildizlari[bolumNo] = Math.max(oncekiYildiz, yildiz);
  kayit.bolumPuanlari[bolumNo] = Math.max(oncekiPuan, puan);
  kayit.toplamOynanan++;

  // Bir sonraki bölüm açık olsun
  if (yildiz >= 1 && kayit.enYuksekBolum <= bolumNo) {
    kayit.enYuksekBolum = bolumNo + 1;
  }

  kayitYaz(kayit);
  return kayit;
}

window.KayitSistemi = {
  yukle: kayitYukle,
  yaz: kayitYaz,
  sifirla: kayitSifirla,
  bolumTamamla,
  VARSAYILAN
};
