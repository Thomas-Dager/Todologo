// Universal Visual Atlas Engine (Explore, Target Drill, Timed Flash Quiz)
window.AtlasEngine = {
  currentTool: null,
  currentMode: "explore",
  selectedItem: null,
  drillTarget: null,
  drillScore: { hits: 0, attempts: 0, streak: 0 },

  mount(container, tool, mode = "explore") {
    this.currentTool = tool;
    this.currentMode = mode;
    this.selectedItem = tool.items[0];
    this.render(container);
    if (mode === "drill" || mode === "quiz") {
      this.nextQuestion(container);
    }
  },

  getDiagramBackgroundSVG(type) {
    if (type === "brain") {
      return `
        <g stroke="#29384f" stroke-width="2" fill="#131c29">
          <path d="M 180 260 C 160 150, 260 80, 460 90 C 660 100, 770 190, 760 280 C 750 340, 620 340, 560 320 C 440 350, 320 330, 260 290 Z" />
          <path d="M 560 315 C 620 310, 720 325, 725 365 C 720 405, 610 405, 575 370 Z" fill="#182334" />
          <path d="M 465 310 L 465 445 L 535 445 L 535 315 Z" fill="#162030" />
          <path d="M 480 92 C 470 165, 495 215, 485 280" fill="none" stroke="#3b82f6" stroke-dasharray="4 4"/>
          <path d="M 330 250 C 430 235, 510 255, 580 280" fill="none" stroke="#3b82f6" stroke-dasharray="4 4"/>
        </g>
      `;
    }
    if (type === "heart") {
      return `
        <g stroke="#3b2635" stroke-width="2.2" fill="#1d1520">
          <path d="M 340 70 L 340 200 M 370 70 L 370 200" stroke="#3b82f6" stroke-width="18" stroke-linecap="round"/>
          <path d="M 490 160 C 490 60, 570 60, 570 160" fill="none" stroke="#f43f5e" stroke-width="22" stroke-linecap="round"/>
          <path d="M 300 210 C 260 180, 440 140, 500 180 C 620 140, 720 220, 680 340 C 630 430, 550 460, 530 470 C 450 450, 330 370, 300 210 Z" />
          <line x1="505" y1="200" x2="525" y2="465" stroke="#473042" stroke-width="8" />
          <line x1="320" y1="275" x2="680" y2="275" stroke="#473042" stroke-width="4" stroke-dasharray="6 4" />
        </g>
      `;
    }
    if (type === "teeth") {
      return `
        <g stroke="#29384f" stroke-width="2" fill="none">
          <path d="M 230 235 C 240 45, 760 45, 770 235" stroke="#334155" stroke-width="34" stroke-linecap="round"/>
          <path d="M 250 285 C 260 465, 740 465, 750 285" stroke="#334155" stroke-width="30" stroke-linecap="round"/>
          <line x1="500" y1="30" x2="500" y2="470" stroke="#1e293b" stroke-dasharray="5 5"/>
          <line x1="180" y1="260" x2="820" y2="260" stroke="#1e293b" stroke-dasharray="5 5"/>
          <text x="500" y="254" fill="#64748b" font-family="JetBrains Mono" font-size="11" text-anchor="middle">MAXILLARY (UPPER) ARCH // MANDIBULAR (LOWER) ARCH</text>
        </g>
      `;
    }
    if (type === "world") {
      return `
        <g fill="#162234" stroke="#283a54" stroke-width="1.5">
          <!-- Stylized Continents Grid -->
          <!-- North America -->
          <path d="M 80 70 L 290 65 L 310 155 L 220 215 L 155 215 L 110 150 Z" />
          <!-- South America -->
          <path d="M 240 245 L 385 265 L 365 435 L 295 450 L 250 330 Z" />
          <!-- Europe -->
          <path d="M 445 70 L 585 65 L 595 160 L 455 165 Z" />
          <!-- Africa -->
          <path d="M 445 180 L 605 185 L 625 320 L 555 415 L 485 330 L 435 250 Z" />
          <!-- Asia -->
          <path d="M 595 65 L 895 75 L 910 235 L 765 295 L 625 225 L 595 160 Z" />
          <!-- Southeast Asia & Oceania -->
          <path d="M 755 280 L 885 285 L 875 330 L 755 320 Z" />
          <path d="M 785 350 L 925 350 L 935 435 L 795 430 Z" />
          <!-- Equator & Prime Meridian -->
          <line x1="0" y1="260" x2="1000" y2="260" stroke="#1e293b" stroke-dasharray="6 6" />
          <line x1="480" y1="0" x2="480" y2="500" stroke="#1e293b" stroke-dasharray="6 6" />
        </g>
      `;
    }
    // Default: Human Body / Skeleton / Muscles / Nerves Silhouette
    return `
      <g stroke="#2a3950" stroke-width="2" fill="#131c29">
        <!-- Head & Neck -->
        <ellipse cx="500" cy="52" rx="34" ry="40" />
        <rect x="486" y="88" width="28" height="22" rx="4" />
        <!-- Torso -->
        <path d="M 380 110 L 620 110 L 590 255 L 410 255 Z" />
        <!-- Pelvis -->
        <path d="M 410 245 L 590 245 L 575 285 L 425 285 Z" fill="#172233" />
        <!-- Left & Right Arms -->
        <path d="M 380 112 L 295 190 L 245 265 L 275 275 L 330 205 L 400 140 Z" />
        <path d="M 620 112 L 705 190 L 755 265 L 725 275 L 670 205 L 600 140 Z" />
        <!-- Left & Right Legs -->
        <path d="M 420 280 L 405 465 L 455 465 L 475 280 Z" />
        <path d="M 580 280 L 595 465 L 545 465 L 525 280 Z" />
        <!-- Anatomical Midline -->
        <line x1="500" y1="10" x2="500" y2="490" stroke="#1e293b" stroke-dasharray="4 4" />
      </g>
    `;
  },

  render(container) {
    const tool = this.currentTool;
    const isExplore = this.currentMode === "explore";
    const isDrill = this.currentMode === "drill";
    const isQuiz = this.currentMode === "quiz";

    const hotspotsSvg = tool.items.map(item => {
      const cx = item.x * 10; // scaled to 1000x500 viewBox
      const cy = item.y * 5;
      const isSelected = isExplore && this.selectedItem && this.selectedItem.id === item.id;
      const isQuizTarget = isQuiz && this.drillTarget && this.drillTarget.id === item.id;
      const activeClass = (isSelected || isQuizTarget) ? "active" : "";
      const showLabel = isExplore && isSelected;

      return `
        <g class="atlas-hotspot ${activeClass}" data-id="${item.id}" transform="translate(${cx}, ${cy})">
          <circle class="outer-ring" r="11" cx="0" cy="0"></circle>
          <circle class="inner-dot" r="4.5" cx="0" cy="0"></circle>
          ${showLabel ? `<text class="hotspot-label" x="15" y="4">${item.name}</text>` : ""}
        </g>
      `;
    }).join("");

    container.innerHTML = `
      <div class="engine-grid">
        <!-- Left Interactive Diagram Stage -->
        <div class="canvas-panel">
          <div class="panel-header">
            <span class="panel-title">INTERACTIVE SPATIAL ATLAS // ${tool.code}</span>
            <span class="mono-code">${tool.items.length} NODES MAPPED</span>
          </div>
          <div class="interactive-stage">
            <svg class="stage-svg" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
              ${this.getDiagramBackgroundSVG(tool.diagramType)}
              ${hotspotsSvg}
            </svg>
          </div>
        </div>

        <!-- Right Inspector / Drill Control Panel -->
        <div class="inspector-panel">
          <div class="panel-header">
            <span class="panel-title">
              ${isExplore ? "MODE 01 // STRUCTURE INSPECTOR" : isDrill ? "MODE 02 // TARGET PINPOINT DRILL" : "MODE 03 // RAPID FLASH IDENTIFICATION"}
            </span>
            <span class="mono-code" id="atlas-session-score">
              REPS: ${this.drillScore.hits}/${this.drillScore.attempts} | STREAK: ${this.drillScore.streak}
            </span>
          </div>

          <div id="atlas-right-body">
            ${this.renderRightBody()}
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
  },

  renderRightBody() {
    const tool = this.currentTool;
    if (this.currentMode === "explore") {
      const item = this.selectedItem || tool.items[0];
      return `
        <div class="detail-card">
          <div class="detail-region">${item.region}</div>
          <h3>${item.name}</h3>
          <p class="detail-fact">${item.fact}</p>
          <div class="detail-clinical">
            <strong>Study / Clinical Note:</strong> ${item.note || "Key anatomical & functional landmark."}
          </div>
        </div>

        <div class="panel-header" style="margin-top:1rem;">
          <span class="panel-title">COMPLETE INDEX (${tool.items.length})</span>
        </div>
        <div class="items-roster">
          ${tool.items.map(i => `
            <button class="roster-chip ${i.id === item.id ? 'active' : ''}" data-roster-id="${i.id}">
              <span>${i.name}</span>
            </button>
          `).join("")}
        </div>
      `;
    }

    if (this.currentMode === "drill") {
      const target = this.drillTarget || tool.items[0];
      return `
        <div class="drill-prompt-box">
          <div class="drill-target-label">CLICK THE PIN ON THE DIAGRAM FOR:</div>
          <div class="drill-target-name">${target.name}</div>
          <div class="detail-region">Hint Region: ${target.region}</div>
        </div>
        <div id="drill-feedback"></div>
        <div class="detail-card" style="margin-top:1rem;">
          <div class="detail-region">FUNCTIONAL CLUE</div>
          <p class="detail-fact">${target.fact}</p>
        </div>
        <button class="btn-secondary full-width" id="btn-skip-drill">SKIP / NEXT TARGET &rarr;</button>
      `;
    }

    if (this.currentMode === "quiz") {
      const target = this.drillTarget || tool.items[0];
      const distractors = tool.items
        .filter(i => i.id !== target.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const options = [target, ...distractors].sort(() => Math.random() - 0.5);

      return `
        <div class="drill-prompt-box">
          <div class="drill-target-label">IDENTIFY THE HIGHLIGHTED PIN &amp; DESCRIPTION:</div>
          <p class="detail-fact" style="color:var(--text-primary); margin-top:0.4rem;">"${target.fact}"</p>
          <div class="detail-region" style="margin-bottom:0;">Region: ${target.region}</div>
        </div>

        <div class="quiz-options-grid">
          ${options.map(opt => `
            <button class="quiz-option-btn" data-opt-id="${opt.id}">
              ${opt.name}
            </button>
          `).join("")}
        </div>
        <div id="drill-feedback"></div>
      `;
    }
  },

  nextQuestion(container) {
    const items = this.currentTool.items;
    const pool = items.length > 1 && this.drillTarget
      ? items.filter(i => i.id !== this.drillTarget.id)
      : items;
    this.drillTarget = pool[Math.floor(Math.random() * pool.length)];
    this.render(container);
  },

  bindEvents(container) {
    // Hotspot clicks
    container.querySelectorAll(".atlas-hotspot").forEach(pin => {
      pin.addEventListener("click", () => {
        const id = pin.getAttribute("data-id");
        const clickedItem = this.currentTool.items.find(i => i.id === id);

        if (this.currentMode === "explore") {
          this.selectedItem = clickedItem;
          this.render(container);
        } else if (this.currentMode === "drill") {
          this.drillScore.attempts++;
          const fb = container.querySelector("#drill-feedback");
          if (clickedItem.id === this.drillTarget.id) {
            this.drillScore.hits++;
            this.drillScore.streak++;
            pin.classList.add("correct");
            window.AppTelemetry.recordRep(this.currentTool.code, true, this.drillScore.streak);
            if (fb) fb.innerHTML = `<div class="feedback-banner ok">CORRECT // ${clickedItem.name} verified! Loading next target...</div>`;
            setTimeout(() => this.nextQuestion(container), 750);
          } else {
            this.drillScore.streak = 0;
            pin.classList.add("wrong");
            window.AppTelemetry.recordRep(this.currentTool.code, false, 0);
            if (fb) fb.innerHTML = `<div class="feedback-banner err">MISS // That node is ${clickedItem.name}. Try again!</div>`;
            container.querySelector("#atlas-session-score").textContent =
              `REPS: ${this.drillScore.hits}/${this.drillScore.attempts} | STREAK: ${this.drillScore.streak}`;
          }
        }
      });
    });

    // Roster chips in Explore mode
    container.querySelectorAll(".roster-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const id = chip.getAttribute("data-roster-id");
        this.selectedItem = this.currentTool.items.find(i => i.id === id);
        this.render(container);
      });
    });

    // Skip button in Drill mode
    const skipBtn = container.querySelector("#btn-skip-drill");
    if (skipBtn) {
      skipBtn.addEventListener("click", () => this.nextQuestion(container));
    }

    // Quiz buttons
    container.querySelectorAll(".quiz-option-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const optId = btn.getAttribute("data-opt-id");
        this.drillScore.attempts++;
        const fb = container.querySelector("#drill-feedback");

        if (optId === this.drillTarget.id) {
          this.drillScore.hits++;
          this.drillScore.streak++;
          btn.classList.add("correct");
          window.AppTelemetry.recordRep(this.currentTool.code, true, this.drillScore.streak);
          if (fb) fb.innerHTML = `<div class="feedback-banner ok">EXACT MATCH // ${this.drillTarget.name}</div>`;
          setTimeout(() => this.nextQuestion(container), 750);
        } else {
          this.drillScore.streak = 0;
          btn.classList.add("wrong");
          window.AppTelemetry.recordRep(this.currentTool.code, false, 0);
          if (fb) fb.innerHTML = `<div class="feedback-banner err">INCORRECT // Correct answer: ${this.drillTarget.name}</div>`;
          setTimeout(() => this.nextQuestion(container), 1200);
        }
      });
    });
  }
};
