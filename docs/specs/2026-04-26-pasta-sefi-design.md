# Pasta Şefi'nin Yükselişi — Tasarım Belgesi

**Tarih:** 26 Nisan 2026
**Durum:** Onaylandı, uygulama planı aşamasına geçilecek

---

## 1. Oyun Özeti

Candy Crush tarzı 3'lü eşleştirme oyunu + pastane kurma/dekorasyon + karakter geliştirme katmanı. Ana eğlence kaynağı: her oyundan sonra biriken altınları pastaneni büyütmek, kostüm almak, tarif açmak için harcama döngüsü.

**Platform:** Önce web tarayıcı (masaüstü + mobil tarayıcı), sonra Capacitor ile Android/iOS uygulamasına dönüştürülecek.

**Hedef kitle:** Candy Crush sevenler + koleksiyon ve ilerleme hissi arayan oyuncular.

---

## 2. Temel Oyun Mekaniği (Match-3)

### Tahta ve Semboller
- 8x8'lik oyun tahtası
- 6 farklı tatlı sembolü: 🍰 (kek), 🍪 (kurabiye), 🍓 (çilek), 🍫 (çikolata), 🍦 (dondurma), 🍭 (şeker)
- Her sembolün bir "malzemesi" var (kek → un, çilek → meyve vb.) — patlayınca o malzemeyi bırakır

### Eşleştirme
- 2 komşu sembol yer değiştirir
- 3 veya daha fazla aynı sembol yan yana/alt alta gelirse patlar
- Patlayınca üstündekiler düşer, yukarıdan yeniler gelir
- **Özel tatlılar:**
  - 4'lü eşleştirme → **çizgi tatlı** (bir satır/sütunu patlatır)
  - L/T şeklinde 5'li → **bomba tatlı** (3x3 alan)
  - Düz 5'li → **renk bombası** (aynı renkten tüm sembolleri patlatır)

### Bölüm Hedefleri
- Tip 1: "N adet X topla" (başlangıç bölümleri)
- Tip 2: "N hamlede K puan yap" (orta seviye)
- Tip 3: "Tepsideki çatlak yumurtaları kır" (engeller)
- Tip 4: "Süre dolmadan bitir" (zor seviye)

### Engeller (ilerideki bölümlerde)
- Buzdolabı bloğu (yanında patlama ile erir)
- Karamel tutkalı (sembolleri kilitler)
- Çikolata duvarı (yayılır, durdurman gerekir)
- Yumurta (çatlaması için 2 kere patlatılmalı)

---

## 3. Pastane ve Karakter Sistemi (Ana fark bu!)

### Ana Ekranlar
1. **Pastane Ekranı** — kendi pastaneni görür, dekore eder, kostüm değiştirirsin
2. **Harita Ekranı** — bölüm bölüm ilerler, yıldızlar kazanırsın

### Pastane Açılma Aşamaları
- Bölüm 1-5: Küçük bir vitrin
- Bölüm 6-10: Masa ve sandalye
- Bölüm 11-15: Fırın açılır
- Bölüm 16-20: Müşteri animasyonları başlar
- Bölüm 20+: 2. kat, yeni dekorasyon kategorileri

### Altınla Satın Alınabilecekler
- **Dekorasyon:** duvar kağıdı, masa örtüsü, çiçek, tablo, halı
- **Ekipman:** büyük fırın (daha çok altın getirir), karıştırıcı (XP bonusu)
- **Kostüm:** klasik şapka, prenses önlük, şef ceketi, eğlenceli takılar

### Pasta Şefi Seviye Sistemi
- Her bölüm 10-50 XP verir (zorluğa göre)
- Seviye atladıkça yeni güç açılır:
  - Sv 2: 🔨 Çekiç (1 sembol kır)
  - Sv 5: 🔀 Karıştır (tahtayı karıştır)
  - Sv 8: 💣 Bomba (3x3 patlat)
- Güçler bölüm başında hazır gelir (sayıları bölüm başarısına göre 1-3)

---

## 4. Tarif Koleksiyonu (Gizli tatmin katmanı)

- Her 5 bölümde bir yeni tarif açılır (görkemli animasyon)
- Toplam 50+ tarif → koleksiyon tutkusu
- Her tarif açıldığında pastanende satılmaya başlar
- **Pasif altın:** Oyun kapalıyken bile tarifler altın biriktirir (son giriş üzerinden hesaplanır, en fazla 12 saat)

---

## 5. Teknik Tasarım

### Teknoloji Yığını
- **Oyun motoru:** Phaser 3 (JavaScript, web tabanlı 2D oyun motoru)
- **Dil:** JavaScript (ES2022+) veya TypeScript
- **Build aracı:** Vite (hızlı, basit)
- **Veri saklama:** LocalStorage (tarayıcı hafızası) — ileride cloud save eklenebilir
- **Görseller:** Başta emoji + ücretsiz ikon setleri; v0.3'te profesyonel sprite'lar
- **Ses:** Freesound.org, Kenney.nl gibi ücretsiz kaynaklar
- **Mobile:** Capacitor (v1.0'da eklenecek)

### Proje Yapısı
```
PastaSefi/
├── docs/specs/           # Tasarım dokümanları
├── src/
│   ├── scenes/           # Phaser sahneleri (MenuScene, GameScene, ShopScene...)
│   ├── systems/          # Oyun sistemleri (Match3, InventoryManager, LevelManager)
│   ├── data/             # Bölüm tanımları, tarif listesi, kostüm listesi
│   ├── ui/               # UI bileşenleri (HUD, düğmeler, modallar)
│   └── main.js           # Giriş noktası
├── public/
│   └── assets/           # Resim, ses dosyaları
├── index.html
├── vite.config.js
└── package.json
```

### Veri Modelleri (LocalStorage)
```
{
  "player": {
    "level": 1,
    "xp": 0,
    "gold": 0,
    "lives": 5,
    "currentLevel": 1,
    "unlockedRecipes": ["basic_cake"],
    "costume": "classic_chef",
    "lastActive": 1714147200000
  },
  "bakery": {
    "decorations": ["default_wall"],
    "equipment": ["basic_oven"],
    "tier": 1
  },
  "stats": {
    "totalLevelsCompleted": 0,
    "bestCombo": 0
  }
}
```

---

## 6. Sürüm Planı

### v0.1 — Oynanabilir Prototip (ilk hedef)
- 8x8 tahta, 6 tatlı, temel eşleştirme çalışıyor
- 5 bölüm (farklı hedef tipleri)
- Altın biriktirme
- Basit bir "pastane ön izlemesi" ekranı
- **Hedef:** Kullanıcı oynayıp "eğlenceli mi?" geri bildirimi verebilir

### v0.2 — Pastane + İlerleme
- Tam pastane dekorasyon ekranı
- 5 kostüm + 10 dekorasyon eşyası satın alma
- Tarif koleksiyonu (10 tarif)
- Pasif altın sistemi
- Seviye/XP sistemi

### v0.3 — Cila ve Derinlik
- Animasyonlar, ses efektleri, müzik
- 25 bölüme çıkarma
- Özel güçler (çekiç, bomba, karıştır)
- Engeller (buzdolabı, karamel, yumurta)

### v1.0 — Mobile Hazır
- Capacitor entegrasyonu
- Touch kontrolü iyileştirmesi
- Google Play Store'a yükleme hazırlığı
- İkon, splash screen, store sayfası

---

## 7. Test Stratejisi

- **Birim testleri:** Match-3 algoritması, XP hesaplama, pasif altın hesaplama gibi saf mantık fonksiyonları (Vitest)
- **Manuel oyun testi:** Her sürüm sonunda kullanıcı "aç oyna, nasıl hissediyorsun?" geri bildirimi verir
- **Eğlence testi:** "Bırakamıyorum" / "sıkıldım" ölçüsü — yaratıcı iş, metrik değil, his

---

## 8. Risk ve Açık Sorular

- **Risk:** Eşleştirme algoritması performansı mobil tarayıcılarda düşük olabilir → erken test
- **Risk:** "Bol ödül" hissi dengesiz olabilir (ya çok cömert ya da cimri) → v0.2 sonunda denge ayarı turu
- **Açık soru:** İleride reklam/para kazanma modeli olacak mı? Şimdilik yok, v1.0 sonrası karar

---

## 9. Onay

- [x] Tasarım kullanıcı tarafından onaylandı (26 Nisan 2026)
- [ ] Uygulama planı yazıldı
- [ ] v0.1 prototip tamamlandı
