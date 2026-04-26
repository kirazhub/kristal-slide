// ==========================================================
// KRİSTAL KRALLIĞI — Ana Oyun Motoru
// Swipe (parmak kaydırma) destekli match-3
// ==========================================================

class Oyun {
  constructor() {
    this.BOYUT = 8;
    this.TATLILAR = ['🍰', '🍪', '🍓', '🍫', '🍦', '🍭'];
    this.PUAN_BASINA = 10;

    this.tahta = [];
    this.secili = null;
    this.meşgul = false;
    this.comboSayaci = 0;
    this.toplamCombo = 0;
    this.puan = 0;
    this.kalanHamle = 0;
    this.toplananHedef = 0;
    this.aktifGuc = null; // 'cekic' | 'karistir' | 'bomba' | null
    this.bolum = null;
    this.bitmis = false;

    // Swipe takibi
    this.dokunusBas = null; // {x, y, s, st}
    this.suruklenenEl = null;

    // DOM referansları
    this.tahtaEl = document.getElementById('tahta');
    this.altinEl = document.getElementById('altinSayi');
    this.hamleEl = document.getElementById('hamleSayi');
    this.hedefMetniEl = document.getElementById('hedefMetni');
    this.bolumNoEl = document.getElementById('bolumNo');
    this.comboPopup = document.getElementById('comboPopup');
    this.gucBtnler = {
      cekic: document.querySelector('[data-guc="cekic"]'),
      karistir: document.querySelector('[data-guc="karistir"]'),
      bomba: document.querySelector('[data-guc="bomba"]')
    };
  }

  // ==========================================================
  // BAŞLATMA — belirli bir bölümü yükle
  // ==========================================================
  baslat(bolumNo) {
    this.bolum = window.BOLUMLER[bolumNo - 1];
    if (!this.bolum) {
      console.error('Bölüm bulunamadı:', bolumNo);
      return;
    }

    this.comboSayaci = 0;
    this.toplamCombo = 0;
    this.puan = 0;
    this.toplananHedef = 0;
    this.kalanHamle = this.bolum.maxHamle;
    this.secili = null;
    this.meşgul = false;
    this.aktifGuc = null;
    this.bitmis = false;

    // Oyuncu envanterinden güçleri yükle
    const kayit = window.KayitSistemi.yukle();
    this.envanter = { ...kayit.aktifGucler };

    this.tahtaOlustur();
    this.cizdir();
    this.arayuzGuncelle();
    this.gucleriGuncelle();

    // Ses / müzik başlat
    window.Ses?.baslat();
    window.Ses?.muzikBaslat();
  }

  // ==========================================================
  // TAHTAYI OLUŞTUR (başlangıçta eşleşme olmamalı)
  // ==========================================================
  tahtaOlustur() {
    this.tahta = [];
    for (let s = 0; s < this.BOYUT; s++) {
      const satir = [];
      for (let st = 0; st < this.BOYUT; st++) {
        satir.push(this.rastgeleTatli(s, st, satir));
      }
      this.tahta.push(satir);
    }
  }

  rastgeleTatli(s, st, suAnkiSatir) {
    const yasak = new Set();
    if (st >= 2 && suAnkiSatir[st - 1] === suAnkiSatir[st - 2]) {
      yasak.add(suAnkiSatir[st - 1]);
    }
    if (s >= 2 && this.tahta[s - 1][st] === this.tahta[s - 2][st]) {
      yasak.add(this.tahta[s - 1][st]);
    }
    const aday = this.TATLILAR.filter(t => !yasak.has(t));
    return aday[Math.floor(Math.random() * aday.length)];
  }

  // ==========================================================
  // ÇİZ
  // ==========================================================
  cizdir() {
    this.tahtaEl.innerHTML = '';
    for (let s = 0; s < this.BOYUT; s++) {
      for (let st = 0; st < this.BOYUT; st++) {
        const h = document.createElement('div');
        h.className = 'hucre';
        h.dataset.s = s;
        h.dataset.st = st;
        h.dataset.tatli = this.tahta[s][st];

        const img = document.createElement('img');
        img.src = 'public/assets/' + this.tatlidanDosya(this.tahta[s][st]);
        img.alt = '';
        img.draggable = false;
        h.appendChild(img);

        if (this.secili && this.secili.s === s && this.secili.st === st) {
          h.classList.add('secili');
        }
        this.tahtaEl.appendChild(h);
      }
    }
  }

  tatlidanDosya(emoji) {
    const ha = {
      '🍰': 'kek.png', '🍪': 'kurabiye.png', '🍓': 'cilek.png',
      '🍫': 'cikolata.png', '🍦': 'dondurma.png', '🍭': 'lolipop.png'
    };
    return ha[emoji] || 'kek.png';
  }

  hucreEl(s, st) {
    return this.tahtaEl.querySelector(`.hucre[data-s="${s}"][data-st="${st}"]`);
  }

  // ==========================================================
  // SWIPE + TIKLAMA KONTROL — hem tıklama hem sürükleme çalışır
  // ==========================================================
  dokunBaslangic(e, s, st) {
    if (this.meşgul || this.bitmis) return;
    e.preventDefault();

    const dokunus = e.touches ? e.touches[0] : e;
    this.dokunusBas = {
      x: dokunus.clientX,
      y: dokunus.clientY,
      s, st,
      el: this.hucreEl(s, st),
      hareket: false
    };
  }

  dokunHareket(e) {
    if (!this.dokunusBas || this.meşgul) return;
    e.preventDefault();

    const dokunus = e.touches ? e.touches[0] : e;
    const dx = dokunus.clientX - this.dokunusBas.x;
    const dy = dokunus.clientY - this.dokunusBas.y;
    const mesafe = Math.sqrt(dx * dx + dy * dy);

    // Eşik: 25 piksel sonra swipe olarak say
    if (!this.dokunusBas.hareket && mesafe > 25) {
      this.dokunusBas.hareket = true;

      // Yön tespit et
      let hedefS, hedefSt;
      if (Math.abs(dx) > Math.abs(dy)) {
        hedefS = this.dokunusBas.s;
        hedefSt = this.dokunusBas.st + (dx > 0 ? 1 : -1);
      } else {
        hedefS = this.dokunusBas.s + (dy > 0 ? 1 : -1);
        hedefSt = this.dokunusBas.st;
      }

      // Geçerli mi?
      if (hedefS >= 0 && hedefS < this.BOYUT && hedefSt >= 0 && hedefSt < this.BOYUT) {
        const a = { s: this.dokunusBas.s, st: this.dokunusBas.st };
        const b = { s: hedefS, st: hedefSt };
        this.secili = null;
        this.dokunusBas = null;

        // Güç modu aktifse farklı davran
        if (this.aktifGuc === 'cekic') {
          this.gucUygula_cekic(a);
          return;
        }

        this.yerDegistirVeKontrolEt(a, b);
      }
    }
  }

  dokunBitis(e) {
    if (!this.dokunusBas) return;

    // Eğer hareket yoksa ve güç aktifse o güce göre davran
    if (!this.dokunusBas.hareket) {
      const { s, st } = this.dokunusBas;

      if (this.aktifGuc === 'cekic') {
        this.gucUygula_cekic({ s, st });
        this.dokunusBas = null;
        return;
      }
      if (this.aktifGuc === 'bomba') {
        this.gucUygula_bomba({ s, st });
        this.dokunusBas = null;
        return;
      }

      // Normal tıklama: seç/komşu seç
      this.hucreyeTiklandi(s, st);
    }

    this.dokunusBas = null;
  }

  hucreyeTiklandi(s, st) {
    if (this.meşgul) return;
    window.Ses?.sesSec();

    if (!this.secili) {
      this.secili = { s, st };
      this.cizdir();
      return;
    }

    if (this.secili.s === s && this.secili.st === st) {
      this.secili = null;
      this.cizdir();
      return;
    }

    const komsu = (Math.abs(this.secili.s - s) + Math.abs(this.secili.st - st)) === 1;
    if (!komsu) {
      this.secili = { s, st };
      this.cizdir();
      return;
    }

    const a = { ...this.secili };
    const b = { s, st };
    this.secili = null;
    this.yerDegistirVeKontrolEt(a, b);
  }

  // ==========================================================
  // YER DEĞİŞTİRME + KONTROL
  // ==========================================================
  async yerDegistirVeKontrolEt(a, b) {
    this.meşgul = true;
    window.Ses?.sesDegistir();
    this.degistir(a, b);
    this.cizdir();
    await this.bekle(180);

    const eslesmeler = this.eslesmeleriBul();
    if (eslesmeler.length === 0) {
      // Geçersiz hamle
      this.degistir(a, b);
      this.cizdir();
      window.Ses?.sesHatali();
      await this.bekle(180);
      this.meşgul = false;
      return;
    }

    // Geçerli hamle — hamle say
    this.kalanHamle--;
    this.comboSayaci = 0;
    await this.patlamaZinciri();

    this.arayuzGuncelle();
    this.bitisKontrol();
    this.meşgul = false;
  }

  degistir(a, b) {
    const tmp = this.tahta[a.s][a.st];
    this.tahta[a.s][a.st] = this.tahta[b.s][b.st];
    this.tahta[b.s][b.st] = tmp;
  }

  // ==========================================================
  // EŞLEŞME
  // ==========================================================
  eslesmeleriBul() {
    const isaretli = Array.from({ length: this.BOYUT }, () => new Array(this.BOYUT).fill(false));

    for (let s = 0; s < this.BOYUT; s++) {
      let bas = 0;
      while (bas < this.BOYUT) {
        const emoji = this.tahta[s][bas];
        let son = bas;
        while (son + 1 < this.BOYUT && this.tahta[s][son + 1] === emoji) son++;
        if (son - bas + 1 >= 3) {
          for (let k = bas; k <= son; k++) isaretli[s][k] = true;
        }
        bas = son + 1;
      }
    }

    for (let st = 0; st < this.BOYUT; st++) {
      let bas = 0;
      while (bas < this.BOYUT) {
        const emoji = this.tahta[bas][st];
        let son = bas;
        while (son + 1 < this.BOYUT && this.tahta[son + 1][st] === emoji) son++;
        if (son - bas + 1 >= 3) {
          for (let k = bas; k <= son; k++) isaretli[k][st] = true;
        }
        bas = son + 1;
      }
    }

    const sonuc = [];
    for (let s = 0; s < this.BOYUT; s++) {
      for (let st = 0; st < this.BOYUT; st++) {
        if (isaretli[s][st]) sonuc.push({ s, st, emoji: this.tahta[s][st] });
      }
    }
    return sonuc;
  }

  async patlamaZinciri() {
    while (true) {
      const eslesmeler = this.eslesmeleriBul();
      if (eslesmeler.length === 0) return;

      this.comboSayaci++;
      if (this.comboSayaci >= 2) {
        this.comboGoster(this.comboSayaci);
        window.Ses?.sesCombo(this.comboSayaci);
        if (this.comboSayaci >= 3) {
          this.toplamCombo++;
          this.sarsilEkrani();
          window.Ses?.titreCombo(this.comboSayaci);
        }
      }

      eslesmeler.forEach(({ s, st, emoji }) => {
        const el = this.hucreEl(s, st);
        if (el) {
          el.classList.add('patliyor');
          this.patlamaParcaciklari(el, emoji);
        }
        // Hedef kristal ise say
        if (this.bolum.tip === 'TOPLA' && emoji === this.bolum.hedefKristalEski) {
          this.toplananHedef++;
        }
      });

      window.Ses?.sesPatlama(this.comboSayaci);
      window.Ses?.titre(20);

      const kazanilanPuan = eslesmeler.length * this.PUAN_BASINA * this.comboSayaci;
      this.puan += kazanilanPuan;

      this.arayuzGuncelle();
      await this.bekle(400);

      eslesmeler.forEach(({ s, st }) => { this.tahta[s][st] = null; });
      this.yercekimi();
      this.cizdir();
      this.tahtaEl.querySelectorAll('.hucre').forEach(el => {
        el.classList.add('dogdu');
        setTimeout(() => el.classList.remove('dogdu'), 400);
      });

      await this.bekle(300);
    }
  }

  yercekimi() {
    for (let st = 0; st < this.BOYUT; st++) {
      let yazmaS = this.BOYUT - 1;
      for (let s = this.BOYUT - 1; s >= 0; s--) {
        if (this.tahta[s][st] !== null) {
          this.tahta[yazmaS][st] = this.tahta[s][st];
          if (yazmaS !== s) this.tahta[s][st] = null;
          yazmaS--;
        }
      }
      for (let s = yazmaS; s >= 0; s--) {
        this.tahta[s][st] = this.TATLILAR[Math.floor(Math.random() * this.TATLILAR.length)];
      }
    }
  }

  // ==========================================================
  // GÜÇLER
  // ==========================================================
  gucSec(guc) {
    if (this.meşgul || this.bitmis) return;
    if ((this.envanter[guc] || 0) <= 0) {
      window.Ses?.sesHatali();
      return;
    }

    window.Ses?.sesTik();

    if (this.aktifGuc === guc) {
      this.aktifGuc = null;
    } else {
      this.aktifGuc = guc;

      // Karıştır hemen uygulanır
      if (guc === 'karistir') {
        this.gucUygula_karistir();
      }
    }
    this.gucleriGuncelle();
  }

  async gucUygula_cekic(hedef) {
    if (this.meşgul) return;
    this.meşgul = true;
    this.envanter.cekic--;
    this.aktifGuc = null;

    const el = this.hucreEl(hedef.s, hedef.st);
    if (el) {
      el.classList.add('patliyor');
      this.patlamaParcaciklari(el, this.tahta[hedef.s][hedef.st]);
    }
    window.Ses?.sesPatlama(1);
    window.Ses?.titre(30);

    // Hedef ise say
    if (this.bolum.tip === 'TOPLA' && this.tahta[hedef.s][hedef.st] === this.bolum.hedefKristalEski) {
      this.toplananHedef++;
    }

    await this.bekle(400);
    this.tahta[hedef.s][hedef.st] = null;
    this.yercekimi();
    this.cizdir();
    await this.bekle(300);

    // Yeni eşleşmeler
    this.comboSayaci = 0;
    await this.patlamaZinciri();

    this.gucleriGuncelle();
    this.arayuzGuncelle();
    this.bitisKontrol();
    this.meşgul = false;
  }

  async gucUygula_bomba(hedef) {
    if (this.meşgul) return;
    this.meşgul = true;
    this.envanter.bomba--;
    this.aktifGuc = null;

    // 3x3 alan
    const patlat = [];
    for (let ds = -1; ds <= 1; ds++) {
      for (let dst = -1; dst <= 1; dst++) {
        const s = hedef.s + ds;
        const st = hedef.st + dst;
        if (s >= 0 && s < this.BOYUT && st >= 0 && st < this.BOYUT) {
          patlat.push({ s, st });
        }
      }
    }

    patlat.forEach(({ s, st }) => {
      const el = this.hucreEl(s, st);
      if (el) {
        el.classList.add('patliyor');
        this.patlamaParcaciklari(el, this.tahta[s][st]);
      }
      if (this.bolum.tip === 'TOPLA' && this.tahta[s][st] === this.bolum.hedefKristalEski) {
        this.toplananHedef++;
      }
    });

    window.Ses?.sesPatlama(3);
    window.Ses?.titre(80);
    this.sarsilEkrani();

    await this.bekle(400);
    patlat.forEach(({ s, st }) => { this.tahta[s][st] = null; });
    this.yercekimi();
    this.cizdir();
    await this.bekle(300);

    this.comboSayaci = 0;
    await this.patlamaZinciri();

    this.gucleriGuncelle();
    this.arayuzGuncelle();
    this.bitisKontrol();
    this.meşgul = false;
  }

  async gucUygula_karistir() {
    if (this.meşgul) return;
    this.meşgul = true;
    this.envanter.karistir--;
    this.aktifGuc = null;

    window.Ses?.sesCombo(2);
    window.Ses?.titre(40);

    // Tüm kristalleri topla, karıştır, yeniden yerleştir
    const hepsi = [];
    for (let s = 0; s < this.BOYUT; s++)
      for (let st = 0; st < this.BOYUT; st++)
        hepsi.push(this.tahta[s][st]);

    // Shuffle
    for (let i = hepsi.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [hepsi[i], hepsi[j]] = [hepsi[j], hepsi[i]];
    }

    let idx = 0;
    for (let s = 0; s < this.BOYUT; s++)
      for (let st = 0; st < this.BOYUT; st++)
        this.tahta[s][st] = hepsi[idx++];

    // Başlangıçta eşleşme olmadığından emin ol (varsa yeniden karıştır — basit yol)
    let deneme = 0;
    while (this.eslesmeleriBul().length > 0 && deneme < 20) {
      for (let i = hepsi.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [hepsi[i], hepsi[j]] = [hepsi[j], hepsi[i]];
      }
      idx = 0;
      for (let s = 0; s < this.BOYUT; s++)
        for (let st = 0; st < this.BOYUT; st++)
          this.tahta[s][st] = hepsi[idx++];
      deneme++;
    }

    this.cizdir();
    this.tahtaEl.querySelectorAll('.hucre').forEach(el => {
      el.classList.add('dogdu');
      setTimeout(() => el.classList.remove('dogdu'), 400);
    });
    await this.bekle(400);

    this.gucleriGuncelle();
    this.meşgul = false;
  }

  gucleriGuncelle() {
    Object.keys(this.gucBtnler).forEach(ad => {
      const btn = this.gucBtnler[ad];
      if (!btn) return;
      const sayac = btn.querySelector('.sayi');
      if (sayac) sayac.textContent = this.envanter[ad] || 0;

      btn.classList.toggle('aktif', this.aktifGuc === ad);
      btn.classList.toggle('tukendi', (this.envanter[ad] || 0) <= 0);
    });
  }

  // ==========================================================
  // EFEKTLER
  // ==========================================================
  patlamaParcaciklari(el, emoji) {
    const rect = el.getBoundingClientRect();
    const renkler = {
      '🍰': ['#ffffff', '#e3f2fd', '#b3e5fc'],
      '🍪': ['#ff1744', '#d50000', '#ff5252'],
      '🍓': ['#00e676', '#00c853', '#69f0ae'],
      '🍫': ['#448aff', '#2962ff', '#82b1ff'],
      '🍦': ['#e040fb', '#aa00ff', '#ea80fc'],
      '🍭': ['#ff9100', '#ffab00', '#ffd54f']
    };
    const palet = renkler[emoji] || ['#fff'];
    const semboller = ['✨', '⭐', '💫', '🌟'];
    for (let i = 0; i < 10; i++) {
      const p = document.createElement('div');
      p.className = 'patlama-parcacik';
      if (i % 2 === 0) {
        p.textContent = semboller[Math.floor(Math.random() * semboller.length)];
      } else {
        p.textContent = '●';
        p.style.color = palet[Math.floor(Math.random() * palet.length)];
        p.style.textShadow = `0 0 8px ${palet[0]}`;
      }
      p.style.left = (rect.left + rect.width / 2) + 'px';
      p.style.top = (rect.top + rect.height / 2) + 'px';
      const aci = (Math.PI * 2 * i) / 10 + Math.random() * 0.3;
      const mesafe = 70 + Math.random() * 50;
      p.style.setProperty('--dx', Math.cos(aci) * mesafe + 'px');
      p.style.setProperty('--dy', Math.sin(aci) * mesafe + 'px');
      p.style.fontSize = (14 + Math.random() * 14) + 'px';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 850);
    }
  }

  comboGoster(sayi) {
    const metinler = {
      2: '✨ GÜZEL ✨', 3: '🔥 SÜPER 🔥', 4: '⭐ HARİKA ⭐', 5: '💥 EFSANE 💥'
    };
    this.comboPopup.textContent = metinler[sayi] || `🌟 İNANILMAZ 🌟`;
    this.comboPopup.classList.remove('goster');
    void this.comboPopup.offsetWidth;
    this.comboPopup.classList.add('goster');
  }

  sarsilEkrani() {
    document.body.classList.add('sarsıl');
    setTimeout(() => document.body.classList.remove('sarsıl'), 380);
  }

  // ==========================================================
  // ARAYÜZ
  // ==========================================================
  arayuzGuncelle() {
    this.altinEl.textContent = this.puan;
    this.hamleEl.textContent = this.kalanHamle;
    this.hamleEl.parentElement.classList.toggle('uyari', this.kalanHamle <= 3);
    this.bolumNoEl.textContent = `BÖLÜM ${this.bolum.numara}`;

    // Hedef metni
    let hedefMetin;
    if (this.bolum.tip === 'TOPLA') {
      hedefMetin = `${this.toplananHedef} / ${this.bolum.hedef} ${window.kristalAdi(this.bolum.hedefKristal)}`;
    } else if (this.bolum.tip === 'PUAN') {
      hedefMetin = `${this.puan.toLocaleString('tr-TR')} / ${this.bolum.hedef.toLocaleString('tr-TR')} PUAN`;
    } else if (this.bolum.tip === 'COMBO') {
      hedefMetin = `${this.toplamCombo} / ${this.bolum.hedef} SÜPER COMBO`;
    }
    this.hedefMetniEl.textContent = hedefMetin;
  }

  // ==========================================================
  // BİTİŞ KONTROLÜ
  // ==========================================================
  bitisKontrol() {
    if (this.bitmis) return;

    const kazandi = this.hedefeUlastiMi();
    const bittiHamle = this.kalanHamle <= 0;

    if (kazandi) {
      this.bitmis = true;
      setTimeout(() => this.kazandi(), 500);
    } else if (bittiHamle) {
      this.bitmis = true;
      setTimeout(() => this.kaybetti(), 500);
    }
  }

  hedefeUlastiMi() {
    if (this.bolum.tip === 'TOPLA') return this.toplananHedef >= this.bolum.hedef;
    if (this.bolum.tip === 'PUAN') return this.puan >= this.bolum.hedef;
    if (this.bolum.tip === 'COMBO') return this.toplamCombo >= this.bolum.hedef;
    return false;
  }

  hesaplaYildiz() {
    const oran = this.bolum.tip === 'PUAN'
      ? this.puan / this.bolum.hedef
      : (this.bolum.tip === 'TOPLA' ? this.toplananHedef : this.toplamCombo) / this.bolum.hedef;

    if (oran >= 1.5) return 3;
    if (oran >= 1.2) return 2;
    if (oran >= 1) return 1;
    return 0;
  }

  kazandi() {
    window.Ses?.sesZafer();
    window.Ses?.titreZafer();

    const yildiz = this.hesaplaYildiz();
    // Kalan hamle bonusu
    const kalanBonus = this.kalanHamle * 50;
    const toplamAltin = Math.round(this.puan / 10) + kalanBonus;

    // Kayda yaz
    const kayit = window.KayitSistemi.yukle();
    window.KayitSistemi.bolumTamamla(kayit, this.bolum.numara, yildiz, toplamAltin, this.puan);

    // Modal göster
    window.Arayuz.kazandiGoster(this.bolum.numara, yildiz, toplamAltin, this.puan);
  }

  kaybetti() {
    window.Ses?.sesKayip();
    window.Arayuz.kaybetGoster(this.bolum.numara);
  }

  // ==========================================================
  // YARDIMCI
  // ==========================================================
  bekle(ms) { return new Promise(r => setTimeout(r, ms)); }
}

window.Oyun = Oyun;
