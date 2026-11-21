// T011 // Blackjack Basic Strategy & Hi-Lo Card Counting Trainer
window.BlackjackEngine = {
  runningCount: 0,
  cardsSeen: 0,
  streak: 0,
  hits: 0,
  attempts: 0,
  dealerCard: null,
  playerCards: [],
  mode: "explore",

  suits: [
    { sym: "♠", red: false },
    { sym: "♥", red: true },
    { sym: "♦", red: true },
    { sym: "♣", red: false }
  ],
  ranks: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],

  mount(container, tool, mode = "explore") {
    this.mode = mode;
    this.dealHand();
    this.render(container);
  },

  randomCard() {
    const rank = this.ranks[Math.floor(Math.random() * this.ranks.length)];
    const suit = this.suits[Math.floor(Math.random() * this.suits.length)];
    let val = parseInt(rank, 10);
    if (["J", "Q", "K"].includes(rank)) val = 10;
    if (rank === "A") val = 11;

    // Hi-Lo tag: 2-6 = +1, 7-9 = 0, 10-A = -1
    let hiLo = 0;
    if (val >= 2 && val <= 6) hiLo = 1;
    else if (val >= 10) hiLo = -1;

    this.runningCount += hiLo;
    this.cardsSeen++;
    return { rank, suit: suit.sym, red: suit.red, val, hiLo };
  },

  dealHand() {
    this.dealerCard = this.randomCard();
    this.playerCards = [this.randomCard(), this.randomCard()];
    // Avoid immediate 21 natural so user always has a decision
    if (this.playerCards[0].val + this.playerCards[1].val === 21) {
      this.playerCards[1] = { rank: "6", suit: "♠", red: false, val: 6, hiLo: 1 };
    }
  },

  // Optimal 6-Deck S17 Basic Strategy Evaluation
  getOptimalMove() {
    const d = this.dealerCard.val; // 2..11
    const c1 = this.playerCards[0];
    const c2 = this.playerCards[1];
    const isPair = c1.val === c2.val;
    const hasAce = c1.rank === "A" || c2.rank === "A";

    // Pair splitting rules
    if (isPair) {
      const p = c1.val;
      if (p === 11 || p === 8) return { move: "SPLIT", code: "P", reason: "Always split Aces and 8s." };
      if (p === 10 || p === 5) {
        // Never split 10s or 5s
      } else if (p === 9 && d !== 7 && d <= 9) {
        return { move: "SPLIT", code: "P", reason: "Split 9s against 2-9 except 7." };
      } else if ((p === 7 && d <= 7) || (p === 6 && d <= 6) || (p === 3 && d <= 7) || (p === 2 && d <= 7)) {
        return { move: "SPLIT", code: "P", reason: `Split ${p}s against weak dealer ${d}.` };
      } else if (p === 4 && (d === 5 || d === 6)) {
        return { move: "SPLIT", code: "P", reason: "Split 4s only vs dealer 5 or 6." };
      }
    }

    // Soft totals (one Ace counted as 11)
    if (hasAce && c1.val + c2.val <= 21) {
      const other = c1.rank === "A" ? c2.val : c1.val;
      const total = 11 + other;
      if (total >= 19) return { move: "STAND", code: "S", reason: `Soft ${total} is a strong pat hand — Stand.` };
      if (total === 18) {
        if (d >= 3 && d <= 6) return { move: "DOUBLE", code: "D", reason: "Soft 18 Doubles against dealer 3-6." };
        if (d === 2 || d === 7 || d === 8) return { move: "STAND", code: "S", reason: "Soft 18 Stands against 2, 7, 8." };
        return { move: "HIT", code: "H", reason: "Soft 18 Hits against dealer 9, 10, or Ace." };
      }
      if (total === 17 && d >= 3 && d <= 6) return { move: "DOUBLE", code: "D", reason: "Soft 17 Doubles vs 3-6, otherwise Hit." };
      if ((total === 16 || total === 15) && d >= 4 && d <= 6) return { move: "DOUBLE", code: "D", reason: `Soft ${total} Doubles vs 4-6.` };
      if ((total === 14 || total === 13) && (d === 5 || d === 6)) return { move: "DOUBLE", code: "D", reason: `Soft ${total} Doubles vs 5-6.` };
      return { move: "HIT", code: "H", reason: `Soft ${total} cannot bust — Hit to improve.` };
    }

    // Hard totals
    let total = c1.val + c2.val;
    if (total === 22) total = 12;
    if (total >= 17) return { move: "STAND", code: "S", reason: `Hard ${total} always Stands.` };
    if (total >= 13 && total <= 16) {
      if (d <= 6) return { move: "STAND", code: "S", reason: `Stand on Hard ${total} vs dealer bust card (${d}).` };
      return { move: "HIT", code: "H", reason: `Hit Hard ${total} against dealer ${d >= 11 ? 'Ace' : d}.` };
    }
    if (total === 12) {
      if (d >= 4 && d <= 6) return { move: "STAND", code: "S", reason: "Stand on Hard 12 vs dealer 4, 5, or 6." };
      return { move: "HIT", code: "H", reason: "Hit Hard 12 against 2, 3, or 7+." };
    }
    if (total === 11) return { move: "DOUBLE", code: "D", reason: "Hard 11 always Doubles for maximum EV." };
    if (total === 10) {
      if (d <= 9) return { move: "DOUBLE", code: "D", reason: "Hard 10 Doubles against dealer 2-9." };
      return { move: "HIT", code: "H", reason: "Hard 10 Hits against dealer 10 or Ace." };
    }
    if (total === 9) {
      if (d >= 3 && d <= 6) return { move: "DOUBLE", code: "D", reason: "Hard 9 Doubles against dealer 3-6." };
      return { move: "HIT", code: "H", reason: "Hard 9 Hits outside 3-6." };
    }
    return { move: "HIT", code: "H", reason: `Hard ${total} always Hits.` };
  },

  renderCardHTML(c) {
    return `
      <div class="Playing-card ${c.red ? 'red' : ''}">
        <div>${c.rank}${c.suit}</div>
        <div class="suit-center">${c.suit}</div>
        <div style="text-align:right;font-size:0.65rem;">HiLo:${c.hiLo > 0 ? '+'+c.hiLo : c.hiLo}</div>
      </div>
    `;
  },

  render(container) {
    const opt = this.getOptimalMove();
    const pTotal = this.playerCards[0].val + this.playerCards[1].val;

    container.innerHTML = `
      <div class="engine-grid">
        <div class="canvas-panel">
          <div class="panel-header">
            <span class="panel-title">T011 // BLACKJACK DECISION &amp; HI-LO TABLE</span>
            <span class="mono-code">RUNNING COUNT: ${this.runningCount > 0 ? '+'+this.runningCount : this.runningCount} (${this.cardsSeen} CARDS)</span>
          </div>

          <div class="bj-table">
            <div style="text-align:center;">
              <div class="eyebrow" style="color:#93c5fd;">DEALER UPCARD</div>
              ${this.renderCardHTML(this.dealerCard)}
            </div>

            <div style="text-align:center;">
              <div class="eyebrow" style="color:#6ee7b7;">PLAYER HAND (TOTAL: ${pTotal})</div>
              <div>
                ${this.renderCardHTML(this.playerCards[0])}
                ${this.renderCardHTML(this.playerCards[1])}
              </div>
            </div>

            <div class="bj-actions">
              <button class="btn-primary" data-move="HIT">HIT [H]</button>
              <button class="btn-primary" data-move="STAND">STAND [S]</button>
              <button class="btn-primary" data-move="DOUBLE">DOUBLE [D]</button>
              <button class="btn-primary" data-move="SPLIT">SPLIT [P]</button>
            </div>
          </div>
          <div id="bj-feedback"></div>
        </div>

        <div class="inspector-panel">
          <div class="panel-header">
            <span class="panel-title">BASIC STRATEGY REFERENCE MATRIX (HARD TOTALS)</span>
            <span class="mono-code">SCORE: ${this.hits}/${this.attempts} | STREAK: ${this.streak}</span>
          </div>
          <p class="detail-fact">
            In <strong>Explore Mode</strong>, the optimal EV play is highlighted below: <strong>${this.mode === "explore" ? opt.move + " — " + opt.reason : "Hidden during Active Drill"}</strong>
          </p>

          <div class="strategy-matrix">
            <div class="strat-cell">HAND</div>
            ${["2","3","4","5","6","7","8","9","10","A"].map(d => `<div class="strat-cell">${d}</div>`).join("")}
            ${[
              ["17+", ["S","S","S","S","S","S","S","S","S","S"]],
              ["13-16",["S","S","S","S","S","H","H","H","H","H"]],
              ["12",  ["H","H","S","S","S","H","H","H","H","H"]],
              ["11",  ["D","D","D","D","D","D","D","D","D","D"]],
              ["10",  ["D","D","D","D","D","D","D","D","H","H"]],
              ["9",   ["H","D","D","D","D","H","H","H","H","H"]],
              ["8-",  ["H","H","H","H","H","H","H","H","H","H"]]
            ].map(row => `
              <div class="strat-cell">${row[0]}</div>
              ${row[1].map(cell => `<div class="strat-cell ${cell}">${cell}</div>`).join("")}
            `).join("")}
          </div>

          <div class="detail-clinical" style="margin-top:1rem;">
            <strong>Hi-Lo Card Counting System:</strong> Low cards (2–6) = <code>+1</code> | Neutral (7–9) = <code>0</code> | High cards (10–A) = <code>-1</code>. Divide Running Count by remaining decks for True Count.
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll("[data-move]").forEach(btn => {
      btn.addEventListener("click", () => {
        const chosen = btn.getAttribute("data-move");
        this.attempts++;
        const fb = container.querySelector("#bj-feedback");
        if (chosen === opt.move) {
          this.hits++;
          this.streak++;
          window.AppTelemetry.recordRep("T011", true, this.streak);
          fb.innerHTML = `<div class="feedback-banner ok">OPTIMAL PLAY // ${opt.move}: ${opt.reason}</div>`;
          setTimeout(() => {
            this.dealHand();
            this.render(container);
          }, 850);
        } else {
          this.streak = 0;
          window.AppTelemetry.recordRep("T011", false, 0);
          fb.innerHTML = `<div class="feedback-banner err">EV ERROR // You chose ${chosen}, but Basic Strategy requires ${opt.move} (${opt.reason})</div>`;
        }
      });
    });
  }
};
