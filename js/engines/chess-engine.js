// T015 // Chess Opening Trainer ("Play lines against an engine that halts on your first deviation")
window.ChessEngine = {
  openings: [
    {
      id: "ruy",
      name: "Ruy Lopez (Spanish Game) — Morphy Defense",
      desc: "Classical king's pawn opening fighting immediately for central control via pressure on the f6/c6 knights.",
      steps: [
        { from: "e2", to: "e4", san: "1. e4", replyFrom: "e7", replyTo: "e5", replySan: "1... e5", note: "Claim central dark squares and open diagonals for the Queen and King's Bishop." },
        { from: "g1", to: "f3", san: "2. Nf3", replyFrom: "b8", replyTo: "c6", replySan: "2... Nc6", note: "Develop knights before bishops; attack the undefended e5 pawn." },
        { from: "f1", to: "b5", san: "3. Bb5", replyFrom: "a7", replyTo: "a6", replySan: "3... a6", note: "The Ruy Lopez signature move — pinning or pressuring the defender of e5." },
        { from: "b5", to: "a4", san: "4. Ba4", replyFrom: "g8", replyTo: "f6", replySan: "4... Nf6", note: "Maintain the pin along the a4-e8 diagonal while Black counter-attacks e4." }
      ]
    },
    {
      id: "sicilian",
      name: "Open Sicilian Defense — Najdorf Setup",
      desc: "Asymmetrical fight where Black trades a flank c-pawn for White's central d-pawn.",
      steps: [
        { from: "e2", to: "e4", san: "1. e4", replyFrom: "c7", replyTo: "c5", replySan: "1... c5", note: "Black immediately fights for the d4 square from the flank." },
        { from: "g1", to: "f3", san: "2. Nf3", replyFrom: "d7", replyTo: "d6", replySan: "2... d6", note: "Prepare the central d4 pawn break." },
        { from: "d2", to: "d4", san: "3. d4", replyFrom: "c5", replyTo: "d4", replySan: "3... cxd4", note: "Open the center; Black exchanges the c-pawn for White's d-pawn." },
        { from: "f3", to: "d4", san: "4. Nxd4", replyFrom: "g8", replyTo: "f6", replySan: "4... Nf6", note: "Recapture centrally with the Knight and dominate the board." }
      ]
    },
    {
      id: "qgd",
      name: "Queen's Gambit Declined — Orthodox Line",
      desc: "Classical closed d4 opening offering a temporary wing pawn to seize the center.",
      steps: [
        { from: "d2", to: "d4", san: "1. d4", replyFrom: "d7", replyTo: "d5", replySan: "1... d5", note: "Establish a protected central queen's pawn." },
        { from: "c2", to: "c4", san: "2. c4", replyFrom: "e7", replyTo: "e6", replySan: "2... e6", note: "The Queen's Gambit: attack Black's d5 anchor." },
        { from: "b1", to: "c3", san: "3. Nc3", replyFrom: "g8", replyTo: "f6", replySan: "3... Nf6", note: "Add further pressure to d5 and control e4." }
      ]
    }
  ],

  currentOpeningIndex: 0,
  stepIndex: 0,
  selectedSquare: null,
  board: {},
  mode: "explore",
  streak: 0,

  mount(container, tool, mode = "explore") {
    this.mode = mode;
    this.resetBoard();
    this.render(container);
  },

  resetBoard() {
    this.stepIndex = 0;
    this.selectedSquare = null;
    this.board = {
      a8:"♜", b8:"♞", c8:"♝", d8:"♛", e8:"♚", f8:"♝", g8:"♞", h8:"♜",
      a7:"♟", b7:"♟", c7:"♟", d7:"♟", e7:"♟", f7:"♟", g7:"♟", h7:"♟",
      a2:"♙", b2:"♙", c2:"♙", d2:"♙", e2:"♙", f2:"♙", g2:"♙", h2:"♙",
      a1:"♖", b1:"♘", c1:"♗", d1:"♕", e1:"♔", f1:"♗", g1:"♘", h1:"♖"
    };
  },

  render(container) {
    const opening = this.openings[this.currentOpeningIndex];
    const currentStep = opening.steps[this.stepIndex];
    const files = ["a","b","c","d","e","f","g","h"];
    const ranks = ["8","7","6","5","4","3","2","1"];

    let squaresHTML = "";
    ranks.forEach((r, rIdx) => {
      files.forEach((f, fIdx) => {
        const sq = f + r;
        const isLight = (rIdx + fIdx) % 2 === 0;
        const piece = this.board[sq] || "";
        const isSel = this.selectedSquare === sq;
        const isHint = this.mode === "explore" && currentStep && (currentStep.from === sq || currentStep.to === sq);
        squaresHTML += `
          <div class="chess-sq ${isLight ? 'light' : 'dark'} ${isSel ? 'selected' : ''} ${isHint ? 'hint' : ''}" data-sq="${sq}">
            ${piece}
          </div>
        `;
      });
    });

    container.innerHTML = `
      <div class="engine-grid">
        <div class="canvas-panel">
          <div class="panel-header">
            <span class="panel-title">T015 // CHESS OPENING DRILL BOARD</span>
            <span class="mono-code">STEP ${this.stepIndex}/${opening.steps.length}</span>
          </div>
          <div class="chess-board">
            ${squaresHTML}
          </div>
          <div id="chess-feedback" style="margin-top:0.85rem;"></div>
        </div>

        <div class="inspector-panel">
          <div class="panel-header">
            <span class="panel-title">SELECT OPENING LINE</span>
            <span class="mono-code">STREAK: ${this.streak}</span>
          </div>

          <div class="items-roster" style="margin-bottom:1rem;">
            ${this.openings.map((op, idx) => `
              <button class="roster-chip ${idx === this.currentOpeningIndex ? 'active' : ''}" data-op-idx="${idx}">
                ${op.name}
              </button>
            `).join("")}
          </div>

          <div class="detail-card">
            <div class="detail-region">BOOK LINE PROTOCOL</div>
            <h3>${opening.name}</h3>
            <p class="detail-fact">${opening.desc}</p>
            ${currentStep ? `
              <div class="detail-clinical">
                <strong>Current Objective:</strong> ${this.mode === "explore" ? `Play <code>${currentStep.san}</code> (${currentStep.from} &rarr; ${currentStep.to}) — ${currentStep.note}` : `Execute Move #${this.stepIndex + 1} from memory (click source square, then destination square).`}
              </div>
            ` : `
              <div class="feedback-banner ok">BOOK LINE COMPLETED PERFECTLY!</div>
            `}
          </div>

          <button class="btn-secondary full-width" id="btn-reset-chess">RESET BOARD POSITION</button>
        </div>
      </div>
    `;

    container.querySelectorAll("[data-op-idx]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.currentOpeningIndex = parseInt(btn.getAttribute("data-op-idx"), 10);
        this.resetBoard();
        this.render(container);
      });
    });

    container.querySelector("#btn-reset-chess").addEventListener("click", () => {
      this.resetBoard();
      this.render(container);
    });

    container.querySelectorAll(".chess-sq").forEach(sqEl => {
      sqEl.addEventListener("click", () => {
        if (!currentStep) return;
        const sq = sqEl.getAttribute("data-sq");
        if (!this.selectedSquare) {
          if (this.board[sq]) {
            this.selectedSquare = sq;
            this.render(container);
          }
          return;
        }
        if (this.selectedSquare === sq) {
          this.selectedSquare = null;
          this.render(container);
          return;
        }

        // Validate move against book step
        const fb = container.querySelector("#chess-feedback");
        if (this.selectedSquare === currentStep.from && sq === currentStep.to) {
          // Execute White move & Black reply
          this.board[currentStep.to] = this.board[currentStep.from];
          delete this.board[currentStep.from];
          this.board[currentStep.replyTo] = this.board[currentStep.replyFrom];
          delete this.board[currentStep.replyFrom];

          this.selectedSquare = null;
          this.stepIndex++;
          this.streak++;
          window.AppTelemetry.recordRep("T015", true, this.streak);
          this.render(container);
        } else {
          this.streak = 0;
          window.AppTelemetry.recordRep("T015", false, 0);
          this.selectedSquare = null;
          fb.innerHTML = `<div class="feedback-banner err">ENGINE HALT // Book deviation! Expected ${currentStep.san} (${currentStep.from} &rarr; ${currentStep.to}). ${currentStep.note}</div>`;
        }
      });
    });
  }
};
