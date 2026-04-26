// ==========================================================
// SES SİSTEMİ — Web Audio API ile synthesize edilmiş sesler
// ==========================================================
// Harici dosya yok — kod ile üretilir.
// Her ses birkaç oscillator + envelope ile oluşturulur.
// ==========================================================

class SesSistemi {
  constructor() {
    this.ctx = null;
    this.sesAcik = true;
    this.muzikAcik = true;
    this.muzikGain = null;
    this.muzikOscs = [];
    this.muzikAktif = false;
  }

  // iOS Safari sesi kullanıcı etkileşimine kadar bloklar — ilk dokunuşta aç
  baslat() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio desteklenmiyor');
    }
  }

  // Genel amaçlı tone üretici
  tone({ frekans = 440, sure = 0.15, tip = 'sine', hacim = 0.3, frekansSonu = null }) {
    if (!this.ctx || !this.sesAcik) return;
    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = tip;
    osc.frequency.setValueAtTime(frekans, t0);
    if (frekansSonu !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, frekansSonu), t0 + sure);
    }
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(hacim, t0 + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + sure);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + sure + 0.05);
  }

  // ==========================================================
  // OYUN SESLERİ
  // ==========================================================

  // Kristal seçildi — kısa, yumuşak "blip"
  sesSec() {
    this.tone({ frekans: 880, frekansSonu: 1320, sure: 0.06, tip: 'sine', hacim: 0.15 });
  }

  // Kristal değiştirildi — hafif swoosh
  sesDegistir() {
    this.tone({ frekans: 600, frekansSonu: 900, sure: 0.08, tip: 'triangle', hacim: 0.2 });
  }

  // Patlama — puf
  sesPatlama(combo = 1) {
    const base = 200 + combo * 80;
    this.tone({ frekans: base + 400, frekansSonu: base, sure: 0.15, tip: 'square', hacim: 0.15 });
    setTimeout(() => this.tone({ frekans: base / 2, sure: 0.1, tip: 'triangle', hacim: 0.1 }), 20);
  }

  // Combo — artan tonlar
  sesCombo(combo) {
    if (!this.ctx || !this.sesAcik) return;
    const notalar = [523, 659, 784, 988, 1175]; // C-E-G-B-D
    const nota = notalar[Math.min(combo - 2, notalar.length - 1)];
    this.tone({ frekans: nota, sure: 0.3, tip: 'sine', hacim: 0.3 });
    setTimeout(() => this.tone({ frekans: nota * 1.5, sure: 0.25, tip: 'sine', hacim: 0.2 }), 60);
  }

  // Geçersiz hamle — düşük tonlar
  sesHatali() {
    this.tone({ frekans: 200, frekansSonu: 100, sure: 0.2, tip: 'sawtooth', hacim: 0.15 });
  }

  // Bölüm tamamlama — zafer arpeji
  sesZafer() {
    if (!this.ctx || !this.sesAcik) return;
    const notalar = [523, 659, 784, 1047, 1319]; // C-E-G-C-E
    notalar.forEach((n, i) => {
      setTimeout(() => this.tone({ frekans: n, sure: 0.4, tip: 'triangle', hacim: 0.3 }), i * 100);
    });
  }

  // Bölüm başarısız — üzgün iniş
  sesKayip() {
    if (!this.ctx || !this.sesAcik) return;
    this.tone({ frekans: 440, frekansSonu: 220, sure: 0.4, tip: 'triangle', hacim: 0.25 });
    setTimeout(() => this.tone({ frekans: 330, frekansSonu: 165, sure: 0.6, tip: 'sine', hacim: 0.2 }), 150);
  }

  // Düğme tıklaması
  sesTik() {
    this.tone({ frekans: 1200, sure: 0.04, tip: 'sine', hacim: 0.1 });
  }

  // Altın kazanma — cıngıl
  sesAltin() {
    this.tone({ frekans: 1500, frekansSonu: 2000, sure: 0.08, tip: 'sine', hacim: 0.15 });
    setTimeout(() => this.tone({ frekans: 2500, sure: 0.06, tip: 'sine', hacim: 0.1 }), 40);
  }

  // ==========================================================
  // ARKA PLAN MÜZİĞİ — hafif, döngüsel
  // ==========================================================

  muzikBaslat() {
    if (!this.ctx || !this.muzikAcik || this.muzikAktif) return;
    this.muzikAktif = true;
    this.muzikCal();
  }

  muzikDurdur() {
    this.muzikAktif = false;
    this.muzikOscs.forEach(o => {
      try { o.stop(); } catch (e) {}
    });
    this.muzikOscs = [];
  }

  muzikCal() {
    if (!this.muzikAktif || !this.ctx) return;
    // Mistik pad — 4 nota döngü, 8 saniye
    const ctx = this.ctx;
    const melodi = [
      [261.63, 329.63, 392.00], // C major
      [293.66, 369.99, 440.00], // D minor
      [349.23, 440.00, 523.25], // F major
      [196.00, 246.94, 293.66]  // G major
    ];
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.04;
    masterGain.connect(ctx.destination);
    this.muzikGain = masterGain;

    melodi.forEach((akor, i) => {
      const t0 = ctx.currentTime + i * 2;
      akor.forEach(frekans => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = frekans;
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(1, t0 + 0.8);
        g.gain.linearRampToValueAtTime(0.7, t0 + 1.5);
        g.gain.linearRampToValueAtTime(0, t0 + 2);
        osc.connect(g).connect(masterGain);
        osc.start(t0);
        osc.stop(t0 + 2.1);
        this.muzikOscs.push(osc);
      });
    });

    // 8 saniye sonra tekrar
    setTimeout(() => {
      this.muzikOscs = this.muzikOscs.filter(o => {
        try { return false; } catch (e) { return false; }
      });
      if (this.muzikAktif) this.muzikCal();
    }, 8000);
  }

  // ==========================================================
  // AYAR KONTROL
  // ==========================================================

  sesleriAc(ac) {
    this.sesAcik = !!ac;
  }

  muzigiAc(ac) {
    this.muzikAcik = !!ac;
    if (ac) this.muzikBaslat();
    else this.muzikDurdur();
  }

  // Titreşim (mobil)
  titre(sure = 20) {
    if (window.Titresim && window.Titresim.aktif && navigator.vibrate) {
      navigator.vibrate(sure);
    }
  }

  titreCombo(combo) {
    if (!navigator.vibrate || !window.Titresim?.aktif) return;
    navigator.vibrate([30, 20, 50 + combo * 10]);
  }

  titreZafer() {
    if (!navigator.vibrate || !window.Titresim?.aktif) return;
    navigator.vibrate([100, 30, 100, 30, 200]);
  }
}

window.Ses = new SesSistemi();
window.Titresim = { aktif: true };
