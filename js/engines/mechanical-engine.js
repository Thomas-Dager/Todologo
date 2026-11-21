// T012 // 4-Stroke Internal Combustion Engine Atlas & Interactive Animator
window.MechanicalEngine = {
  rpm: 60,
  strokePhase: 0, // 0..720 degrees crank angle (4 strokes)
  animFrame: null,
  selectedPart: null,
  drillTarget: null,
  mode: "explore",
  streak: 0,
  hits: 0,
  attempts: 0,

  parts: [
    { id: "cam_in", name: "Intake Camshaft & Valve", region: "Valvetrain (Top End)", x: 42, y: 18, fact: "Opens the intake poppet valve during the downward Intake Stroke (0°–180°) to draw air-fuel charge into the cylinder.", note: "Rotates at exactly half the speed (0.5x RPM) of the crankshaft via timing belt/chain." },
    { id: "spark", name: "Spark Plug", region: "Ignition System", x: 50, y: 15, fact: "Delivers high-voltage arc (20,000–50,000 V) across the electrode gap near Top Dead Center (TDC) of the Compression stroke.", note: "Initiates the flame front for the Power (Expansion) stroke." },
    { id: "cam_ex", name: "Exhaust Camshaft & Valve", region: "Valvetrain (Top End)", x: 58, y: 18, fact: "Opens during the upward Exhaust Stroke (540°–720°) to expel spent combustion gases into the exhaust manifold.", note: "Exposed to extreme thermal loads (>800 °C)." },
    { id: "chamber", name: "Combustion Chamber", region: "Cylinder Head", x: 50, y: 27, fact: "Clearance volume between the cylinder head and piston crown at Top Dead Center (TDC).", note: "Compression ratio is total cylinder volume at BDC divided by clearance volume at TDC." },
    { id: "piston", name: "Piston & Compression Rings", region: "Reciprocating Assembly", x: 50, y: 40, fact: "Cylindrical aluminum component that seals the bore and transfers combustion gas force downward.", note: "Uses top compression ring, scraper ring, and oil control ring." },
    { id: "wristpin", name: "Gudgeon (Wrist) Pin", region: "Reciprocating Joint", x: 50, y: 45, fact: "Hardened steel pivot pin linking the piston boss to the small end of the connecting rod.", note: "Allows the connecting rod to swing angularly as the piston moves linearly." },
    { id: "conrod", name: "Connecting Rod", region: "Kinematic Linkage", x: 47, y: 58, fact: "Forged I-beam or H-beam link converting linear reciprocating piston motion into rotary crankshaft torque.", note: "Experiences both massive compressive combustion loads and tensile inertia loads at high RPM." },
    { id: "crank", name: "Crankshaft Journal & Counterweight", region: "Bottom End", x: 50, y: 76, fact: "Main rotating shaft with offset crankpins that outputs mechanical rotational power to the flywheel and transmission.", note: "Completes two full revolutions (720°) for every complete 4-stroke Otto cycle." }
  ],

  mount(container, tool, mode = "explore") {
    this.mode = mode;
    this.selectedPart = this.parts[0];
    this.drillTarget = this.parts[Math.floor(Math.random() * this.parts.length)];
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    this.render(container);
    this.startLoop(container);
  },

  getCurrentStrokeInfo() {
    const deg = this.strokePhase % 720;
    if (deg < 180) return { name: "01 // INTAKE STROKE (0°–180°)", color: "#3b82f6", desc: "Intake valve OPEN. Piston descends from TDC to BDC, creating vacuum to draw in air-fuel mixture." };
    if (deg < 360) return { name: "02 // COMPRESSION STROKE (180°–360°)", color: "#f59e0b", desc: "Both valves CLOSED. Piston ascends to TDC, compressing the air-fuel charge." };
    if (deg < 540) return { name: "03 // POWER / COMBUSTION STROKE (360°–540°)", color: "#f43f5e", desc: "Spark ignites compressed mixture near TDC. Expanding gases drive piston forcefully down." };
    return { name: "04 // EXHAUST STROKE (540°–720°)", color: "#94a3b8", desc: "Exhaust valve OPEN. Piston ascends from BDC to TDC, scavenging spent exhaust gases." };
  },

  render(container) {
    const isExplore = this.mode === "explore";
    const info = this.getCurrentStrokeInfo();

    const hotspotsSvg = this.parts.map(p => {
      const cx = p.x * 10;
      const cy = p.y * 5;
      const active = isExplore && this.selectedPart && this.selectedPart.id === p.id;
      return `
        <g class="atlas-hotspot ${active ? 'active' : ''}" data-part-id="${p.id}" transform="translate(${cx}, ${cy})">
          <circle class="outer-ring" r="11" cx="0" cy="0"></circle>
          <circle class="inner-dot" r="4.5" cx="0" cy="0"></circle>
        </g>
      `;
    }).join("");

    container.innerHTML = `
      <div class="engine-grid">
        <div class="canvas-panel">
          <div class="panel-header">
            <span class="panel-title">T012 // 4-STROKE OTTO CYCLE ENGINE SIMULATOR</span>
            <span class="mono-code" id="engine-stroke-badge">${info.name}</span>
          </div>

          <div class="interactive-stage">
            <svg class="stage-svg" viewBox="0 0 1000 500">
              <!-- Cylinder Block & Crankcase -->
              <rect x="410" y="95" width="180" height="215" fill="#131b26" stroke="#334155" stroke-width="4" />
              <circle cx="500" cy="380" r="88" fill="#131b26" stroke="#334155" stroke-width="4" />

              <!-- Dynamic Chamber Glow -->
              <rect id="sim-chamber" x="414" y="100" width="172" height="60" fill="rgba(59,130,246,0.2)" />

              <!-- Valves & Spark Plug -->
              <line id="sim-valve-in" x1="445" y1="65" x2="445" y2="105" stroke="#60a5fa" stroke-width="6" />
              <line id="sim-valve-ex" x1="555" y1="65" x2="555" y2="105" stroke="#94a3b8" stroke-width="6" />
              <rect x="494" y="58" width="12" height="40" fill="#e2e8f0" />
              <circle id="sim-spark" cx="500" cy="102" r="8" fill="transparent" />

              <!-- Connecting Rod -->
              <line id="sim-conrod" x1="500" y1="200" x2="500" y2="380" stroke="#94a3b8" stroke-width="14" stroke-linecap="round" />

              <!-- Piston Crown & Skirt -->
              <g id="sim-piston" transform="translate(416, 160)">
                <rect x="0" y="0" width="168" height="64" rx="4" fill="#334155" stroke="#64748b" stroke-width="2" />
                <line x1="0" y1="10" x2="168" y2="10" stroke="#f59e0b" stroke-width="2" />
                <line x1="0" y1="18" x2="168" y2="18" stroke="#94a3b8" stroke-width="2" />
                <circle cx="84" cy="32" r="9" fill="#0f172a" stroke="#cbd5e1" stroke-width="2" />
              </g>

              <!-- Crankshaft Counterweight & Pin -->
              <circle cx="500" cy="380" r="24" fill="#1e293b" stroke="#475569" stroke-width="3" />
              <circle id="sim-crankpin" cx="500" cy="330" r="10" fill="#f59e0b" />

              ${hotspotsSvg}
            </svg>
          </div>

          <div style="display:flex;align-items:center;gap:1rem;margin-top:0.85rem;">
            <span class="mono-code">SIMULATION SPEED</span>
            <input type="range" id="engine-rpm-slider" min="0" max="180" value="${this.rpm}" style="flex:1;" />
            <span class="mono-code" id="engine-deg-readout">0° CRANK</span>
          </div>
        </div>

        <div class="inspector-panel">
          <div class="panel-header">
            <span class="panel-title">${isExplore ? "COMPONENT INSPECTOR" : "ACTIVE MECHANICAL DRILL"}</span>
            <span class="mono-code">SCORE: ${this.hits}/${this.attempts} | STREAK: ${this.streak}</span>
          </div>

          ${isExplore ? `
            <div class="detail-card">
              <div class="detail-region">${this.selectedPart.region}</div>
              <h3>${this.selectedPart.name}</h3>
              <p class="detail-fact">${this.selectedPart.fact}</p>
              <div class="detail-clinical"><strong>Engineering Note:</strong> ${this.selectedPart.note}</div>
            </div>
            <div class="items-roster">
              ${this.parts.map(p => `
                <button class="roster-chip ${p.id === this.selectedPart.id ? 'active' : ''}" data-pick-part="${p.id}">
                  ${p.name}
                </button>
              `).join("")}
            </div>
          ` : `
            <div class="drill-prompt-box">
              <div class="drill-target-label">CLICK THE COMPONENT PIN ON THE ENGINE FOR:</div>
              <div class="drill-target-name">${this.drillTarget.name}</div>
              <p class="detail-fact" style="margin-top:0.35rem;">"${this.drillTarget.fact}"</p>
            </div>
            <div id="engine-feedback"></div>
          `}
        </div>
      </div>
    `;

    const slider = container.querySelector("#engine-rpm-slider");
    if (slider) {
      slider.addEventListener("input", (e) => {
        this.rpm = parseInt(e.target.value, 10);
      });
    }

    container.querySelectorAll("[data-pick-part]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-pick-part");
        this.selectedPart = this.parts.find(p => p.id === id);
        this.render(container);
      });
    });

    container.querySelectorAll(".atlas-hotspot").forEach(pin => {
      pin.addEventListener("click", () => {
        const id = pin.getAttribute("data-part-id");
        const part = this.parts.find(p => p.id === id);
        if (this.mode === "explore") {
          this.selectedPart = part;
          this.render(container);
        } else {
          this.attempts++;
          const fb = container.querySelector("#engine-feedback");
          if (part.id === this.drillTarget.id) {
            this.hits++;
            this.streak++;
            window.AppTelemetry.recordRep("T012", true, this.streak);
            if (fb) fb.innerHTML = `<div class="feedback-banner ok">VERIFIED // ${part.name}</div>`;
            setTimeout(() => {
              this.drillTarget = this.parts[Math.floor(Math.random() * this.parts.length)];
              this.render(container);
            }, 700);
          } else {
            this.streak = 0;
            window.AppTelemetry.recordRep("T012", false, 0);
            if (fb) fb.innerHTML = `<div class="feedback-banner err">MISS // That component is ${part.name}.</div>`;
          }
        }
      });
    });
  },

  startLoop(container) {
    const step = () => {
      if (!document.body.contains(container)) return;
      this.strokePhase = (this.strokePhase + (this.rpm * 0.04)) % 720;
      const rad = (this.strokePhase * Math.PI) / 180;

      // Crank kinematics
      const crankRadius = 46;
      const crankX = 500 + Math.sin(rad) * crankRadius;
      const crankY = 380 - Math.cos(rad) * crankRadius;
      const pistonY = 175 - Math.cos(rad) * crankRadius;

      const pistonEl = container.querySelector("#sim-piston");
      const conrodEl = container.querySelector("#sim-conrod");
      const crankpinEl = container.querySelector("#sim-crankpin");
      const chamberEl = container.querySelector("#sim-chamber");
      const sparkEl = container.querySelector("#sim-spark");
      const badgeEl = container.querySelector("#engine-stroke-badge");
      const degEl = container.querySelector("#engine-deg-readout");

      if (pistonEl && conrodEl && crankpinEl) {
        pistonEl.setAttribute("transform", `translate(416, ${pistonY})`);
        conrodEl.setAttribute("x1", "500");
        conrodEl.setAttribute("y1", String(pistonY + 32));
        conrodEl.setAttribute("x2", String(crankX));
        conrodEl.setAttribute("y2", String(crankY));
        crankpinEl.setAttribute("cx", String(crankX));
        crankpinEl.setAttribute("cy", String(crankY));

        const info = this.getCurrentStrokeInfo();
        if (badgeEl) badgeEl.textContent = info.name;
        if (degEl) degEl.textContent = `${Math.round(this.strokePhase)}° CRANK`;
        if (chamberEl) {
          chamberEl.setAttribute("height", String(Math.max(12, pistonY - 98)));
          chamberEl.setAttribute("fill", info.color + "33");
        }
        if (sparkEl) {
          const isFiring = this.strokePhase >= 352 && this.strokePhase <= 385;
          sparkEl.setAttribute("fill", isFiring ? "#fde047" : "transparent");
        }
      }
      this.animFrame = requestAnimationFrame(step);
    };
    this.animFrame = requestAnimationFrame(step);
  }
};
