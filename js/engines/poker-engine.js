// T014 // Poker Starting Hand Ranges & Pot Odds EV Trainer
window.PokerEngine = {
  ranks: ["A","K","Q","J","T","9","8","7","6","5","4","3","2"],
  scenario: null,
  streak: 0,
  hits: 0,
  attempts: 0,
  mode: "explore",

  // Simplified GTO 6-Max UTG/BTN playable combos
  playableHands: new Set([
    "AA","KK","QQ","JJ","TT","99","88","77","66","55",
    "AKs","AQs","AJs","ATs","A9s","A8s","A5s","A4s",
    "KQs","KJs","KTs","QJs","QTs","JTs","T9s","98s",
    "AKo","AQo","AJo","ATo","KQo","KJo"
  ]),

  mount(container, tool, mode = "explore") {
    this.mode = mode;
    this.generateScenario();
    this.render(container);
  },

  generateScenario() {
    const r1Idx = Math.floor(Math.random() * 13);
    const r2Idx = Math.floor(Math.random() * 13);
    let handLabel = "";
    if (r1Idx === r2Idx) {
      handLabel = this.ranks[r1Idx] + this.ranks[r2Idx];
    } else if (r1Idx < r2Idx) {
      handLabel = this.ranks[r1Idx] + this.ranks[r2Idx] + "s";
    } else {
      handLabel = this.ranks[r2Idx] + this.ranks[r1Idx] + "o";
    }

    const potSize = [60, 80, 100, 120, 150][Math.floor(Math.random() * 5)];
    const callCost = [20, 30, 40, 50][Math.floor(Math.random() * 4)];
    const reqEquity = Math.round((callCost / (potSize + callCost)) * 100);
    const handEquity = this.playableHands.has(handLabel)
      ? Math.floor(32 + Math.random() * 28)
      : Math.floor(12 + Math.random() * 18);

    this.scenario = {
      handLabel,
      potSize,
      callCost,
      reqEquity,
      handEquity,
      shouldPlay: handEquity >= reqEquity
    };
  },

  render(container) {
    const sc = this.scenario;

    let gridHTML = "";
    for (let i = 0; i < 13; i++) {
      for (let j = 0; j < 13; j++) {
        let label = "";
        if (i === j) label = this.ranks[i] + this.ranks[j];
        else if (i < j) label = this.ranks[i] + this.ranks[j] + "s";
        else label = this.ranks[j] + this.ranks[i] + "o";

        const inRange = this.playableHands.has(label);
        const isCurrent = label === sc.handLabel;
        gridHTML += `
          <div class="poker-cell ${inRange ? 'in-range' : ''} ${isCurrent ? 'active-hand' : ''}">
            ${label}
          </div>
        `;
      }
    }

    container.innerHTML = `
      <div class="engine-grid">
        <div class="canvas-panel">
          <div class="panel-header">
            <span class="panel-title">T014 // 169 STARTING HAND RANGE MATRIX (SUITED TOP-RIGHT)</span>
            <span class="mono-code">ACTIVE COMBO: ${sc.handLabel}</span>
          </div>
          <div class="poker-grid">
            ${gridHTML}
          </div>
        </div>

        <div class="inspector-panel">
          <div class="panel-header">
            <span class="panel-title">POT ODDS &amp; EV DECISION ENGINE</span>
            <span class="mono-code">SCORE: ${this.hits}/${this.attempts} | STREAK: ${this.streak}</span>
          </div>

          <div class="drill-prompt-box">
            <div class="drill-target-label">HERO HOLE CARDS // POT ODDS SCENARIO</div>
            <div class="drill-target-name">Hand: ${sc.handLabel} | Est. Equity: ${sc.handEquity}%</div>
            <p class="detail-fact" style="color:var(--text-primary);margin-top:0.35rem;">
              Pot after villain bet is <strong>$${sc.potSize}</strong>. It costs you <strong>$${sc.callCost}</strong> to call.
            </p>
            ${this.mode === "explore" ? `
              <div class="detail-region" style="margin-bottom:0;">
                Formula: Call / (Pot + Call) = ${sc.callCost} / (${sc.potSize} + ${sc.callCost}) = <strong>${sc.reqEquity}% Required Equity</strong>
              </div>
            ` : ""}
          </div>

          <div class="quiz-options-grid">
            <button class="btn-primary" id="btn-poker-call">+EV CALL / RAISE</button>
            <button class="btn-secondary" id="btn-poker-fold">-EV FOLD HAND</button>
          </div>

          <div id="poker-feedback"></div>

          <div class="detail-clinical" style="margin-top:1.1rem;">
            <strong>Math Rule:</strong> Required Equity = <code>Call / (Total Pot + Call)</code>. Whenever your hand equity (${sc.handEquity}%) exceeds the break-even threshold (${sc.reqEquity}%), calling is mathematically profitable (+EV) over the long run.
          </div>
        </div>
      </div>
    `;

    const handleChoice = (choseCall) => {
      this.attempts++;
      const fb = container.querySelector("#poker-feedback");
      if (choseCall === sc.shouldPlay) {
        this.hits++;
        this.streak++;
        window.AppTelemetry.recordRep("T014", true, this.streak);
        fb.innerHTML = `<div class="feedback-banner ok">CORRECT EV // Required Equity: ${sc.reqEquity}% vs. Hand Equity: ${sc.handEquity}%.</div>`;
        setTimeout(() => {
          this.generateScenario();
          this.render(container);
        }, 900);
      } else {
        this.streak = 0;
        window.AppTelemetry.recordRep("T014", false, 0);
        fb.innerHTML = `<div class="feedback-banner err">EV MISTAKE // Calling $${sc.callCost} into $${sc.potSize} requires ${sc.reqEquity}% equity, and your hand has ${sc.handEquity}%.</div>`;
      }
    };

    container.querySelector("#btn-poker-call").addEventListener("click", () => handleChoice(true));
    container.querySelector("#btn-poker-fold").addEventListener("click", () => handleChoice(false));
  }
};
