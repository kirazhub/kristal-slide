// ==========================================================
// PASTA ŞEFİ — SVG Tatlı Şekilleri
// Her tatlı için elle çizilmiş, 3D görünümlü SVG.
// Emojiden bağımsız — tüm cihazlarda aynı görünür.
// ==========================================================

// Ortak <defs> — gradyan ve filtreler
// Her SVG'nin içinde kendi defs'i var ki standalone çalışsınlar

/* -------- 🍰 KEK (CAKE) -------- */
const SVG_KEK = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="kekKrema" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#fff0f5"/>
      <stop offset="40%" stop-color="#ff9ec7"/>
      <stop offset="100%" stop-color="#d6336c"/>
    </radialGradient>
    <radialGradient id="kekTaban" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#fff3e0"/>
      <stop offset="60%" stop-color="#e8a87c"/>
      <stop offset="100%" stop-color="#8b4513"/>
    </radialGradient>
    <linearGradient id="kekParilti" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <!-- Taban (bisküvi katmanı) -->
  <ellipse cx="50" cy="72" rx="36" ry="12" fill="#5d2f00" opacity="0.35"/>
  <path d="M 14 70 L 14 58 Q 14 50 50 50 Q 86 50 86 58 L 86 70 Q 86 78 50 78 Q 14 78 14 70 Z" fill="url(#kekTaban)" stroke="#6b3000" stroke-width="1.5"/>
  <ellipse cx="50" cy="58" rx="36" ry="8" fill="#d4a574" opacity="0.4"/>
  <!-- Krema katmanı -->
  <path d="M 18 55 Q 18 38 50 38 Q 82 38 82 55 Q 82 62 50 62 Q 18 62 18 55 Z" fill="url(#kekKrema)" stroke="#c2185b" stroke-width="1.5"/>
  <!-- Krema dalgalı kenarı -->
  <path d="M 18 52 Q 24 48 30 52 Q 36 56 42 52 Q 48 48 54 52 Q 60 56 66 52 Q 72 48 78 52 Q 82 53 82 55" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
  <!-- Parıltı -->
  <ellipse cx="38" cy="44" rx="14" ry="5" fill="url(#kekParilti)" opacity="0.7"/>
  <!-- Çilek tepeleri -->
  <circle cx="35" cy="36" r="5" fill="#e53935"/>
  <circle cx="33" cy="34" r="1.5" fill="#fff" opacity="0.7"/>
  <circle cx="50" cy="32" r="6" fill="#e53935"/>
  <circle cx="47" cy="30" r="2" fill="#fff" opacity="0.7"/>
  <circle cx="65" cy="36" r="5" fill="#e53935"/>
  <circle cx="63" cy="34" r="1.5" fill="#fff" opacity="0.7"/>
  <!-- Çilek yaprakları -->
  <path d="M 48 28 L 50 24 L 52 28 Z" fill="#4caf50"/>
  <!-- Mum -->
  <rect x="48" y="20" width="4" height="12" fill="#fff" stroke="#ff9800" stroke-width="0.5"/>
  <path d="M 50 16 Q 48 20 50 20 Q 52 20 50 16 Z" fill="#ffb300"/>
  <circle cx="50" cy="18" r="1.5" fill="#fff200"/>
</svg>
`;

/* -------- 🍪 KURABİYE (COOKIE) -------- */
const SVG_KURABIYE = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="kurabiyeRenk" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ffd9a3"/>
      <stop offset="40%" stop-color="#d4a574"/>
      <stop offset="100%" stop-color="#6b3000"/>
    </radialGradient>
    <radialGradient id="kurabiyeParilti" cx="30%" cy="20%" r="30%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <!-- Gölge -->
  <ellipse cx="50" cy="85" rx="30" ry="4" fill="#000" opacity="0.25"/>
  <!-- Ana kurabiye -->
  <circle cx="50" cy="50" r="38" fill="url(#kurabiyeRenk)" stroke="#4e2500" stroke-width="2"/>
  <!-- Düzensiz kenar efekti -->
  <circle cx="50" cy="50" r="38" fill="none" stroke="#6b3000" stroke-width="1" stroke-dasharray="3 2" opacity="0.5"/>
  <!-- Çikolata parçaları -->
  <ellipse cx="35" cy="38" rx="5" ry="4" fill="#3e2723" transform="rotate(-20 35 38)"/>
  <ellipse cx="35" cy="38" rx="5" ry="4" fill="#5d4037" transform="rotate(-20 35 38) translate(-1 -1)" opacity="0.6"/>

  <ellipse cx="58" cy="32" rx="4" ry="3" fill="#3e2723" transform="rotate(15 58 32)"/>
  <ellipse cx="58" cy="32" rx="4" ry="3" fill="#5d4037" transform="rotate(15 58 32) translate(-0.5 -0.5)" opacity="0.6"/>

  <ellipse cx="65" cy="55" rx="6" ry="5" fill="#3e2723" transform="rotate(30 65 55)"/>
  <ellipse cx="65" cy="55" rx="6" ry="5" fill="#5d4037" transform="rotate(30 65 55) translate(-1 -1)" opacity="0.6"/>

  <ellipse cx="38" cy="62" rx="5" ry="4" fill="#3e2723" transform="rotate(-10 38 62)"/>
  <ellipse cx="38" cy="62" rx="5" ry="4" fill="#5d4037" transform="rotate(-10 38 62) translate(-0.5 -0.5)" opacity="0.6"/>

  <ellipse cx="55" cy="68" rx="4" ry="3" fill="#3e2723"/>
  <ellipse cx="55" cy="68" rx="4" ry="3" fill="#5d4037" transform="translate(-0.5 -0.5)" opacity="0.6"/>

  <!-- Küçük noktalar -->
  <circle cx="45" cy="48" r="1.5" fill="#4e2500"/>
  <circle cx="52" cy="45" r="1.2" fill="#4e2500"/>
  <circle cx="48" cy="58" r="1.5" fill="#4e2500"/>
  <circle cx="62" cy="42" r="1.2" fill="#4e2500"/>
  <!-- Parıltı -->
  <ellipse cx="38" cy="30" rx="16" ry="10" fill="url(#kurabiyeParilti)"/>
</svg>
`;

/* -------- 🍓 ÇİLEK (STRAWBERRY) -------- */
const SVG_CILEK = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="cilekRenk" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#ff8a80"/>
      <stop offset="50%" stop-color="#e53935"/>
      <stop offset="100%" stop-color="#8b0000"/>
    </radialGradient>
    <linearGradient id="cilekYaprak" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#81c784"/>
      <stop offset="100%" stop-color="#2e7d32"/>
    </linearGradient>
  </defs>
  <!-- Gölge -->
  <ellipse cx="50" cy="88" rx="22" ry="3" fill="#000" opacity="0.3"/>
  <!-- Çilek gövdesi -->
  <path d="M 50 22 Q 28 30 24 50 Q 22 68 38 82 Q 50 90 62 82 Q 78 68 76 50 Q 72 30 50 22 Z" fill="url(#cilekRenk)" stroke="#8b0000" stroke-width="1.5"/>
  <!-- Tohum çukurları (sarı noktalar) -->
  <g fill="#ffeb3b" stroke="#d4a017" stroke-width="0.5">
    <ellipse cx="40" cy="42" rx="1.6" ry="2.2" transform="rotate(-20 40 42)"/>
    <ellipse cx="55" cy="38" rx="1.6" ry="2.2" transform="rotate(10 55 38)"/>
    <ellipse cx="45" cy="52" rx="1.6" ry="2.2" transform="rotate(-10 45 52)"/>
    <ellipse cx="60" cy="50" rx="1.6" ry="2.2" transform="rotate(15 60 50)"/>
    <ellipse cx="38" cy="62" rx="1.6" ry="2.2" transform="rotate(-15 38 62)"/>
    <ellipse cx="52" cy="64" rx="1.6" ry="2.2"/>
    <ellipse cx="65" cy="62" rx="1.6" ry="2.2" transform="rotate(20 65 62)"/>
    <ellipse cx="44" cy="72" rx="1.6" ry="2.2" transform="rotate(-10 44 72)"/>
    <ellipse cx="58" cy="74" rx="1.6" ry="2.2" transform="rotate(15 58 74)"/>
  </g>
  <!-- Parıltı -->
  <ellipse cx="38" cy="38" rx="10" ry="14" fill="#fff" opacity="0.35" transform="rotate(-20 38 38)"/>
  <!-- Yapraklar -->
  <g fill="url(#cilekYaprak)" stroke="#1b5e20" stroke-width="1">
    <path d="M 50 24 Q 40 15 32 18 Q 35 26 45 28 Z"/>
    <path d="M 50 24 Q 50 12 50 10 Q 54 14 54 24 Z"/>
    <path d="M 50 24 Q 60 15 68 18 Q 65 26 55 28 Z"/>
    <path d="M 50 24 Q 45 18 42 22 Q 46 26 50 26 Z"/>
    <path d="M 50 24 Q 55 18 58 22 Q 54 26 50 26 Z"/>
  </g>
  <!-- Sap -->
  <rect x="49" y="8" width="2" height="6" fill="#4e342e"/>
</svg>
`;

/* -------- 🍫 ÇİKOLATA (CHOCOLATE) -------- */
const SVG_CIKOLATA = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cikolataRenk" x1="0%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#8d6e63"/>
      <stop offset="50%" stop-color="#5d4037"/>
      <stop offset="100%" stop-color="#2e1a15"/>
    </linearGradient>
    <linearGradient id="cikolataParilti" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <!-- Gölge -->
  <ellipse cx="50" cy="88" rx="30" ry="3" fill="#000" opacity="0.4"/>
  <!-- Çikolata tableti (eğik) -->
  <g transform="translate(50 50) rotate(-8) translate(-50 -50)">
    <!-- Alt kalınlık -->
    <rect x="18" y="28" width="64" height="48" rx="4" fill="#2e1a15"/>
    <!-- Üst yüzey -->
    <rect x="18" y="22" width="64" height="52" rx="4" fill="url(#cikolataRenk)" stroke="#1a0d0a" stroke-width="1.5"/>
    <!-- Kareler ızgara -->
    <g stroke="#1a0d0a" stroke-width="1.2" fill="none">
      <line x1="34" y1="22" x2="34" y2="74"/>
      <line x1="50" y1="22" x2="50" y2="74"/>
      <line x1="66" y1="22" x2="66" y2="74"/>
      <line x1="18" y1="35" x2="82" y2="35"/>
      <line x1="18" y1="48" x2="82" y2="48"/>
      <line x1="18" y1="61" x2="82" y2="61"/>
    </g>
    <!-- Her karenin iç gölgesi (derinlik hissi) -->
    <g fill="#fff" opacity="0.12">
      <rect x="19" y="23" width="14" height="11"/>
      <rect x="35" y="23" width="14" height="11"/>
      <rect x="51" y="23" width="14" height="11"/>
      <rect x="67" y="23" width="14" height="11"/>
      <rect x="19" y="36" width="14" height="11"/>
      <rect x="35" y="36" width="14" height="11"/>
      <rect x="51" y="36" width="14" height="11"/>
      <rect x="67" y="36" width="14" height="11"/>
    </g>
    <!-- Büyük parıltı -->
    <rect x="18" y="22" width="64" height="20" rx="4" fill="url(#cikolataParilti)"/>
    <!-- Minik parlak nokta -->
    <ellipse cx="28" cy="28" rx="6" ry="2" fill="#fff" opacity="0.6"/>
  </g>
</svg>
`;

/* -------- 🍦 DONDURMA (ICE CREAM) -------- */
const SVG_DONDURMA = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="dondurmaUst" cx="40%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#fff"/>
      <stop offset="50%" stop-color="#b3e5fc"/>
      <stop offset="100%" stop-color="#0277bd"/>
    </radialGradient>
    <linearGradient id="waffle" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffcc80"/>
      <stop offset="100%" stop-color="#8b4513"/>
    </linearGradient>
  </defs>
  <!-- Gölge -->
  <ellipse cx="50" cy="88" rx="18" ry="3" fill="#000" opacity="0.3"/>
  <!-- Külah (waffle) -->
  <path d="M 35 50 L 50 88 L 65 50 Z" fill="url(#waffle)" stroke="#6b3000" stroke-width="1.5"/>
  <!-- Waffle desenli çapraz çizgiler -->
  <g stroke="#6b3000" stroke-width="0.8" opacity="0.6">
    <line x1="40" y1="55" x2="60" y2="55"/>
    <line x1="42" y1="62" x2="58" y2="62"/>
    <line x1="44" y1="69" x2="56" y2="69"/>
    <line x1="46" y1="76" x2="54" y2="76"/>
    <line x1="42" y1="50" x2="48" y2="80"/>
    <line x1="48" y1="50" x2="50" y2="88"/>
    <line x1="54" y1="50" x2="52" y2="80"/>
    <line x1="58" y1="50" x2="54" y2="78"/>
  </g>
  <!-- Dondurma topu 1 (alt) -->
  <circle cx="50" cy="48" r="20" fill="url(#dondurmaUst)" stroke="#01579b" stroke-width="1.5"/>
  <!-- Dondurma topu 2 (üst küçük) -->
  <circle cx="50" cy="32" r="13" fill="url(#dondurmaUst)" stroke="#01579b" stroke-width="1.2"/>
  <!-- Büyük parıltı -->
  <ellipse cx="42" cy="40" rx="8" ry="10" fill="#fff" opacity="0.55"/>
  <ellipse cx="46" cy="26" rx="5" ry="6" fill="#fff" opacity="0.6"/>
  <!-- Çilek şurubu damlaları -->
  <path d="M 40 32 Q 38 40 40 46 Q 44 44 44 36 Z" fill="#e91e63" opacity="0.9"/>
  <path d="M 58 28 Q 60 36 58 42 Q 54 40 54 32 Z" fill="#e91e63" opacity="0.9"/>
  <!-- Renkli sprinkle'lar -->
  <rect x="48" y="22" width="3" height="1.5" fill="#ff1744" transform="rotate(30 48 22)"/>
  <rect x="52" y="26" width="3" height="1.5" fill="#ffeb3b" transform="rotate(-20 52 26)"/>
  <rect x="44" y="26" width="3" height="1.5" fill="#00e676" transform="rotate(45 44 26)"/>
  <rect x="56" y="22" width="3" height="1.5" fill="#651fff" transform="rotate(-30 56 22)"/>
  <!-- Tepede kiraz -->
  <circle cx="50" cy="18" r="4.5" fill="#d32f2f" stroke="#7f0000" stroke-width="0.8"/>
  <circle cx="48" cy="16" r="1.2" fill="#fff" opacity="0.8"/>
  <path d="M 50 14 Q 48 10 46 9" fill="none" stroke="#2e7d32" stroke-width="1.5"/>
</svg>
`;

/* -------- 🍭 ŞEKER (LOLLIPOP) -------- */
const SVG_SEKER = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="sekerMor" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#f3e5f5"/>
      <stop offset="40%" stop-color="#ce93d8"/>
      <stop offset="100%" stop-color="#4a148c"/>
    </radialGradient>
  </defs>
  <!-- Gölge -->
  <ellipse cx="50" cy="88" rx="18" ry="3" fill="#000" opacity="0.3"/>
  <!-- Sopa -->
  <rect x="48.5" y="54" width="3" height="32" fill="#f5f5f5" stroke="#bdbdbd" stroke-width="0.8"/>
  <rect x="48.5" y="54" width="1.2" height="32" fill="#fff" opacity="0.6"/>
  <!-- Şeker topu arka -->
  <circle cx="50" cy="40" r="26" fill="url(#sekerMor)" stroke="#311b92" stroke-width="1.5"/>
  <!-- Spiral desen (beyaz çizgiler) -->
  <g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.85">
    <path d="M 50 14 Q 72 22 74 40 Q 72 58 50 66 Q 28 58 26 40 Q 28 22 50 14"/>
    <path d="M 50 20 Q 66 28 68 40 Q 66 52 50 60 Q 34 52 32 40 Q 34 28 50 20"/>
    <path d="M 50 26 Q 60 32 62 40 Q 60 48 50 54 Q 40 48 38 40 Q 40 32 50 26"/>
    <path d="M 50 32 Q 55 36 56 40 Q 55 44 50 48 Q 45 44 44 40 Q 45 36 50 32"/>
  </g>
  <!-- Ana parıltı -->
  <ellipse cx="40" cy="30" rx="10" ry="12" fill="#fff" opacity="0.55" transform="rotate(-20 40 30)"/>
  <!-- Minik ışık -->
  <circle cx="38" cy="26" r="3" fill="#fff" opacity="0.9"/>
</svg>
`;

// Haritalama — JS tarafından kullanılacak
// Anahtar olarak eski emojiler kalıyor ki kodu değiştirmeyelim
window.SEKILLER = {
  '🍰': SVG_KEK,
  '🍪': SVG_KURABIYE,
  '🍓': SVG_CILEK,
  '🍫': SVG_CIKOLATA,
  '🍦': SVG_DONDURMA,
  '🍭': SVG_SEKER
};
