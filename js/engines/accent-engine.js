// T013 // Accent & Phonetics Ear Trainer (Web Speech Synthesis + IPA / Phonological Cues)
window.AccentEngine = {
  accents: [
    { id: "en-GB-rp", name: "Received Pronunciation (Southern UK)", lang: "en-GB", pitch: 1.05, rate: 0.96, region: "United Kingdom", features: "Non-rhotic (drops post-vocalic /r/); TRAP-BATH split (/ɑː/ in 'bath', 'dance'); crisp alveolar /t/.", ipa: "/ˈwɔːtə/ (water), /bɑːθ/ (bath)" },
    { id: "en-US-ga", name: "General American (Midwest / Broadcast US)", lang: "en-US", pitch: 0.98, rate: 1.0, region: "United States", features: "Fully rhotic (/r/ pronounced in all positions); intervocalic /t/ flapping ([ɾ] in 'water', 'butter'); COT-CAUGHT merger in many regions.", ipa: "/ˈwɔɾɚ/ (water), /bæθ/ (bath)" },
    { id: "en-AU", name: "General Australian English", lang: "en-AU", pitch: 1.08, rate: 1.02, region: "Australia", features: "Non-rhotic; Cultivated/General diphthong shift (FACE vowel /eɪ/ shifts toward [æɪ], PRICE toward [ɑe]); high rising terminal intonation.", ipa: "/ˈtədeɪ/ -> [təˈdæɪ] (today)" },
    { id: "en-IE", name: "Hiberno-English (Dublin / Irish)", lang: "en-IE", pitch: 1.1, rate: 1.03, region: "Ireland", features: "Rhotic with postalveolar/velarized /r/; TH-stopping (dental plosives [t̪, d̪] for 'thin/this'); slit fricative /t/ in word-final position.", ipa: "/t̪ɪn/ (thin), /fɪlʲəm/ (film)" },
    { id: "en-ZA", name: "South African English", lang: "en-ZA", pitch: 0.95, rate: 0.98, region: "South Africa", features: "Non-rhotic; KIT-bit split (centralized [ə] vs high front [ɪ]); unaspirated voiceless plosives; monophthongized PRICE vowel.", ipa: "/kɪt/ -> [kət] (kit)" },
    { id: "en-IN", name: "Indian English", lang: "en-IN", pitch: 1.06, rate: 0.98, region: "South Asia", features: "Syllable-timed prosody; retroflex coronal plosives [ʈ, ɖ] for alveolar /t, d/; labiodental approximant [ʋ] for /v, w/.", ipa: "[ʈaɪm] (time), [ˈʋɔːʈər] (water)" }
  ],

  sampleSentences: [
    "Please call Stella and ask her to bring six spoons of fresh snow peas and five thick slabs of blue cheese.",
    "The North Wind and the Sun were disputing which was the stronger, when a traveler came along wrapped in a warm cloak.",
    "Arthur the ratims knew he could not afford to wait in the rain near the dark park car lot."
  ],

  selectedAccent: null,
  drillTarget: null,
  mode: "explore",
  streak: 0,
  hits: 0,
  attempts: 0,

  mount(container, tool, mode = "explore") {
    this.mode = mode;
    this.selectedAccent = this.accents[0];
    this.drillTarget = this.accents[Math.floor(Math.random() * this.accents.length)];
    this.render(container);
  },

  speakSample(accentObj) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const text = this.sampleSentences[Math.floor(Math.random() * this.sampleSentences.length)];
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = accentObj.lang;
    utter.pitch = accentObj.pitch;
    utter.rate = accentObj.rate;

    const voices = window.speechSynthesis.getVoices();
    const matched = voices.find(v => v.lang.toLowerCase().includes(accentObj.lang.toLowerCase()));
    if (matched) utter.voice = matched;
    window.speechSynthesis.speak(utter);
  },

  render(container) {
    const isExplore = this.mode === "explore";
    const activeAcc = isExplore ? this.selectedAccent : this.drillTarget;

    container.innerHTML = `
      <div class="engine-grid">
        <div class="canvas-panel">
          <div class="panel-header">
            <span class="panel-title">T013 // PHONOLOGICAL &amp; DIALECT EAR TRAINER</span>
            <span class="mono-code">${this.accents.length} DIALECT PROFILES</span>
          </div>

          <div class="detail-card" style="text-align:center; padding:2.2rem 1.5rem;">
            <div class="eyebrow">WEB SPEECH SYNTHESIS &amp; PHONETIC ANALYZER</div>
            <h3 style="margin:0.5rem 0;">${isExplore ? activeAcc.name : "Mystery Dialect Sample"}</h3>
            <p class="detail-fact">Click below to synthesize a diagnostic speech passage (Stella / Rainbow / North Wind) and inspect its vowel &amp; consonant shifts.</p>
            <button class="btn-primary" id="btn-play-voice" style="margin-top:0.75rem;">
              &#9654; PLAY VOICE SAMPLE (${isExplore ? activeAcc.lang : "BLIND TEST"})
            </button>
          </div>

          <div class="detail-card">
            <div class="detail-region">PHONOLOGICAL SIGNATURE</div>
            <p class="detail-fact"><strong>Features:</strong> ${activeAcc.features}</p>
            <div class="detail-clinical"><strong>IPA Transcription Marker:</strong> <code>${activeAcc.ipa}</code></div>
          </div>
        </div>

        <div class="inspector-panel">
          <div class="panel-header">
            <span class="panel-title">${isExplore ? "SELECT ACCENT PROFILE" : "IDENTIFY THE DIALECT"}</span>
            <span class="mono-code">SCORE: ${this.hits}/${this.attempts} | STREAK: ${this.streak}</span>
          </div>

          <div class="quiz-options-grid" style="grid-template-columns:1fr;">
            ${this.accents.map(acc => `
              <button class="quiz-option-btn ${isExplore && acc.id === activeAcc.id ? 'correct' : ''}" data-acc-id="${acc.id}">
                <strong>${acc.name}</strong> <span class="mono-code" style="float:right;">${acc.region}</span>
              </button>
            `).join("")}
          </div>
          <div id="accent-feedback"></div>
        </div>
      </div>
    `;

    container.querySelector("#btn-play-voice").addEventListener("click", () => {
      this.speakSample(activeAcc);
    });

    container.querySelectorAll("[data-acc-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-acc-id");
        const picked = this.accents.find(a => a.id === id);

        if (this.mode === "explore") {
          this.selectedAccent = picked;
          this.render(container);
          this.speakSample(picked);
        } else {
          this.attempts++;
          const fb = container.querySelector("#accent-feedback");
          if (picked.id === this.drillTarget.id) {
            this.hits++;
            this.streak++;
            window.AppTelemetry.recordRep("T013", true, this.streak);
            fb.innerHTML = `<div class="feedback-banner ok">CORRECT // ${picked.name} (${picked.region})</div>`;
            setTimeout(() => {
              this.drillTarget = this.accents[Math.floor(Math.random() * this.accents.length)];
              this.render(container);
            }, 850);
          } else {
            this.streak = 0;
            window.AppTelemetry.recordRep("T013", false, 0);
            fb.innerHTML = `<div class="feedback-banner err">MISS // That phonological profile belongs to ${this.drillTarget.name}.</div>`;
          }
        }
      });
    });
  }
};
