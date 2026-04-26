// ==========================================================
// PASTA ŞEFİ — Tatlı Şekilleri
// Leonardo AI ile üretilmiş PNG görselleri kullanıyor.
// Eski emoji anahtarları korundu (kod uyumluluğu).
// ==========================================================

const TATLI_GORSEL = {
  '🍰': 'public/assets/kek.png',
  '🍪': 'public/assets/kurabiye.png',
  '🍓': 'public/assets/cilek.png',
  '🍫': 'public/assets/cikolata.png',
  '🍦': 'public/assets/dondurma.png',
  '🍭': 'public/assets/lolipop.png'
};

// Oyun kodu şu anda innerHTML ile koyduğu için img etiketi veriyoruz
function tatliHTMLUret(emoji) {
  const yol = TATLI_GORSEL[emoji];
  if (!yol) return '';
  // draggable=false → mobil cihazlarda yanlışlıkla sürüklenmesin
  // alt="" → ekran okuyucu için sessiz
  return `<img src="${yol}" alt="" draggable="false" />`;
}

window.SEKILLER = new Proxy({}, {
  get(_, emoji) {
    return tatliHTMLUret(emoji);
  }
});
