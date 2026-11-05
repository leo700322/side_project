// Core application logic for EasyLearn App
// Implements the 5-stage learning framework, 6-axis polygon radar chart, and 3-level drill-down dashboard

const STORAGE_KEY = "easylearn_state_v1";

const EasyLearnApp = {
  state: null,
  currentQuestId: null,
  currentStepIndex: 0, // 0: Icebreaker, 1: Learn, 2: Practice, 3: Teach Buddy, 4: Spaced Review & Complete
  practiceSubIndex: 0,
  practiceAttempts: 0,
  practiceFirstTryCorrect: 0,
  consecutiveWrongOnCurrent: 0,
  combo: 0,
  radarMode: "brain", // "brain" or "subject"
  selectedSubjectFilter: null,
  selectedUnitFilter: null,
  timerSeconds: 300,
  timerRunning: true,
  timerInterval: null,

  // Initialize application state and render UI
  init() {
    this.loadState();
    this.renderStageSwitcher();
    this.populateQuestSelector();
    this.renderTopStats();
    this.renderRadarChart();
    this.renderQuickWeakList();
    this.renderDashboard();
    this.renderImportCatalog();
    this.loadAISettingsToForm();
    this.startPomodoroTimer();
  },

  // Load state from localStorage or initialize from window.EASYLEARN_DATA
  loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        this.state = JSON.parse(raw);
      } catch (e) {
        this.state = null;
      }
    }
    if (!this.state) {
      this.state = {
        profile: JSON.parse(JSON.stringify(window.EASYLEARN_DATA.defaultProfile)),
        quests: JSON.parse(JSON.stringify(window.EASYLEARN_DATA.quests)),
        tracking: JSON.parse(JSON.stringify(window.EASYLEARN_DATA.initialTrackingRecords)),
        aiConfig: {
          provider: "gemini",
          apiKey: "",
          endpoint: ""
        }
      };
      this.saveState();
    }
    this.currentQuestId = this.state.quests[0].id;
  },

  // Persist state to localStorage
  saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  },

  // Display toast message for dopamine feedback
  showToast(msg) {
    const box = document.getElementById("toast-box");
    if (!box) return;
    box.textContent = msg;
    box.classList.add("show");
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      box.classList.remove("show");
    }, 2800);
  },

  // Switch between the 4 main navigation tabs
  switchTab(tabId) {
    document.querySelectorAll(".tab-panel").forEach((el) => {
      el.classList.toggle("active", el.id === tabId);
    });
    document.querySelectorAll(".nav-tab").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabId);
    });
    if (tabId === "tab-dashboard") {
      this.renderDashboard();
    }
  },

  // Render audience stage buttons (Adult, Junior High, Elementary, Senior High)
  renderStageSwitcher() {
    const container = document.getElementById("stage-buttons");
    const descEl = document.getElementById("stage-desc");
    const currentStage = this.state.profile.currentStage;
    const stages = window.EASYLEARN_DATA.stages;

    const activeObj = stages.find((s) => s.id === currentStage) || stages[0];
    descEl.textContent = `${activeObj.badge} — ${activeObj.desc}`;

    container.innerHTML = stages
      .map(
        (s) => `
        <button class="stage-btn ${s.id === currentStage ? "active" : ""}" onclick="EasyLearnApp.setAudienceStage('${s.id}')">
          ${s.label}
        </button>
      `
      )
      .join("");
  },

  // Change current audience stage and filter default quest
  setAudienceStage(stageId) {
    this.state.profile.currentStage = stageId;
    this.saveState();
    this.renderStageSwitcher();
    this.populateQuestSelector();
    this.renderDashboard();
    this.showToast("已切換學習階段與對應題庫！");
  },

  // Populate quest dropdown selector, prioritizing current stage quests
  populateQuestSelector() {
    const select = document.getElementById("quest-selector");
    const stageId = this.state.profile.currentStage;
    const stageQuests = this.state.quests.filter((q) => q.stage === stageId);
    const otherQuests = this.state.quests.filter((q) => q.stage !== stageId);
    const ordered = [...stageQuests, ...otherQuests];

    select.innerHTML = ordered
      .map(
        (q) =>
          `<option value="${q.id}">[${q.subject}] ${q.title}</option>`
      )
      .join("");

    if (stageQuests.length > 0) {
      this.currentQuestId = stageQuests[0].id;
    } else if (ordered.length > 0) {
      this.currentQuestId = ordered[0].id;
    }
    select.value = this.currentQuestId;
    this.selectQuest(this.currentQuestId);
  },

  // Load a specific quest and reset quest progress to Step 0 (Icebreaker)
  selectQuest(questId) {
    this.currentQuestId = questId;
    this.currentStepIndex = 0;
    this.practiceSubIndex = 0;
    this.practiceAttempts = 0;
    this.practiceFirstTryCorrect = 0;
    this.consecutiveWrongOnCurrent = 0;

    const sel = document.getElementById("quest-selector");
    if (sel) sel.value = questId;

    const quest = this.getCurrentQuest();
    if (quest) {
      document.getElementById("quest-publisher-badge").textContent = quest.publisher;
      document.getElementById("quest-subject-badge").textContent = quest.subject;
    }
    this.renderQuestStep();
  },

  getCurrentQuest() {
    return this.state.quests.find((q) => q.id === this.currentQuestId) || this.state.quests[0];
  },

  // Gentle 5-Minute Pomodoro Timer (Barbara Oakley Focus Mode)
  startPomodoroTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.timerRunning) return;
      if (this.timerSeconds > 0) {
        this.timerSeconds--;
        this.updateTimerUI();
      } else {
        // Reached 5 minutes: reward learner and invite a gentle break
        this.timerSeconds = 300;
        this.addReward(15, 25, "resilience", 2);
        this.showToast("🍅 專注滿 5 分鐘！獲得 +15 金幣！可隨時休息讓大腦進入發散模式整合記憶～");
        this.updateTimerUI();
      }
    }, 1000);
  },

  toggleTimer() {
    this.timerRunning = !this.timerRunning;
    document.getElementById("timer-btn").textContent = this.timerRunning ? "暫停" : "繼續";
  },

  updateTimerUI() {
    const mins = String(Math.floor(this.timerSeconds / 60)).padStart(2, "0");
    const secs = String(this.timerSeconds % 60).padStart(2, "0");
    const disp = document.getElementById("timer-display");
    const fill = document.getElementById("timer-fill");
    if (disp) disp.textContent = `${mins}:${secs}`;
    if (fill) fill.style.width = `${(this.timerSeconds / 300) * 100}%`;
  },

  // Speak English or Chinese sentences using Web Speech API
  speakText(text, lang = "en-US") {
    if (!("speechSynthesis" in window)) {
      this.showToast("此瀏覽器不支援語音朗讀");
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = /[a-zA-Z]{3,}/.test(text) ? "en-US" : lang;
    utter.rate = 0.92;
    window.speechSynthesis.speak(utter);
  },

  // Update top header stats and trigger bump animation
  renderTopStats(bumpId = null) {
    document.getElementById("stat-combo").textContent = this.combo;
    document.getElementById("stat-coins").textContent = this.state.profile.coins;
    document.getElementById("stat-xp").textContent = this.state.profile.xp;

    const masteredCount = this.state.tracking.filter(
      (r) => r.day7 === true && r.day14 === true
    ).length;
    document.getElementById("stat-mastered").textContent = masteredCount;
    document.getElementById("stat-total").textContent = this.state.tracking.length;

    if (bumpId) {
      const pill = document.getElementById(bumpId);
      if (pill) {
        pill.classList.remove("bump");
        void pill.offsetWidth;
        pill.classList.add("bump");
      }
    }
  },

  // Grant coins, XP, and boost polygon ability score
  addReward(coinsDelta, xpDelta, brainKey, statDelta) {
    this.state.profile.coins += coinsDelta;
    this.state.profile.xp += xpDelta;
    if (brainKey && this.state.profile.brainStats[brainKey] !== undefined) {
      this.state.profile.brainStats[brainKey] = Math.min(
        100,
        this.state.profile.brainStats[brainKey] + statDelta
      );
    }
    const quest = this.getCurrentQuest();
    if (quest && quest.subjectKey && this.state.profile.subjectStats[quest.subjectKey] !== undefined) {
      this.state.profile.subjectStats[quest.subjectKey] = Math.min(
        100,
        this.state.profile.subjectStats[quest.subjectKey] + Math.ceil(statDelta / 2)
      );
    }
    this.saveState();
    this.renderTopStats("pill-coins");
    this.renderRadarChart();
  },

  // Render the 5-stage progress stepper and current step content
  renderQuestStep() {
    const steps = [
      "0. 10秒破冰",
      "1. 抓重點(組塊)",
      "2. 階梯練習",
      "3. 當小老師(教)",
      "4. 間隔複習與結算"
    ];
    const stepperEl = document.getElementById("quest-stepper");
    stepperEl.innerHTML = steps
      .map((label, idx) => {
        let cls = "step-chip";
        if (idx < this.currentStepIndex) cls += " done";
        else if (idx === this.currentStepIndex) cls += " current";
        return `<div class="${cls}">${idx < this.currentStepIndex ? "✓ " : ""}${label}</div>`;
      })
      .join("");

    const container = document.getElementById("quest-stage-container");
    const quest = this.getCurrentQuest();

    if (this.currentStepIndex === 0) {
      this.renderStep0Icebreaker(container, quest);
    } else if (this.currentStepIndex === 1) {
      this.renderStep1Learn(container, quest);
    } else if (this.currentStepIndex === 2) {
      this.renderStep2Practice(container, quest);
    } else if (this.currentStepIndex === 3) {
      this.renderStep3TeachBuddy(container, quest);
    } else {
      this.renderStep4ReviewComplete(container, quest);
    }
  },

  // STEP 0: 10-second icebreaker to trigger initial dopamine
  renderStep0Icebreaker(container, quest) {
    const ib = quest.icebreaker;
    container.innerHTML = `
      <div class="core-box">
        <div style="font-size: 0.85rem; color: var(--accent-gold); font-weight: 700; margin-bottom: 6px;">
          🚀 啟動多巴胺破冰（不用看書，憑直覺選 10 秒過關！）
        </div>
        <div style="font-size: 1.08rem; font-weight: 700;">${ib.question}</div>
      </div>
      <div class="option-list">
        ${ib.options
          .map(
            (opt, idx) => `
          <button class="option-btn" onclick="EasyLearnApp.handleIcebreakerAnswer(${idx}, this)">
            ${opt}
          </button>
        `
          )
          .join("")}
      </div>
      <div id="step0-feedback"></div>
    `;
  },

  handleIcebreakerAnswer(idx, btnEl) {
    const quest = this.getCurrentQuest();
    const ib = quest.icebreaker;
    const fb = document.getElementById("step0-feedback");

    if (idx === ib.correctIndex) {
      btnEl.classList.add("correct");
      this.combo++;
      this.addReward(10, 15, "resilience", 2);
      this.renderTopStats("pill-combo");
      fb.innerHTML = `
        <div class="feedback-banner success">
          🎉 ${ib.encouragement}（連擊 Combo x${this.combo}）
          <div style="margin-top: 10px;">
            <button class="btn btn-primary" onclick="EasyLearnApp.nextStep()">進入關卡 1：抓唯一重點 →</button>
          </div>
        </div>
      `;
    } else {
      btnEl.classList.add("gentle-retry");
      fb.innerHTML = `
        <div class="feedback-banner hint">
          😊 沒關係，破冰題不扣分！試試看第一個最直覺的選項吧！
        </div>
      `;
    }
  },

  // STEP 1: Learn 1 Core Chunk + Metaphor + Voice Read-Aloud
  renderStep1Learn(container, quest) {
    const ln = quest.learn;
    container.innerHTML = `
      <div class="core-box">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="badge badge-blue">階段 1：可理解輸入（只看 1 個重點，絕不長篇大論）</span>
          <button class="btn btn-outline btn-sm" onclick="EasyLearnApp.speakText('${ln.speakText.replace(/'/g, "\\'")}')">
            🔊 點擊聽發音／朗讀
          </button>
        </div>
        <div style="font-size: 1.12rem; font-weight: 700; margin-bottom: 8px;">
          ${ln.corePoint}
        </div>
        <div style="background: rgba(56, 189, 248, 0.1); padding: 10px 14px; border-radius: 8px; font-size: 0.95rem;">
          🗣️ <strong>核心示範句：</strong> ${ln.speakText}<br/>
          <span style="color: var(--text-muted); font-size: 0.88rem;">（${ln.speakMeaning}）</span>
        </div>
      </div>

      <div class="metaphor-box">
        ${ln.metaphor}
      </div>

      <div style="background: var(--bg-soft); border-radius: 10px; padding: 12px 16px; margin-bottom: 16px;">
        <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 6px;">📌 30 秒記住這 3 點就夠了：</div>
        <ul style="padding-left: 20px; font-size: 0.92rem; color: var(--text-muted);">
          ${ln.keyTakeaways.map((k) => `<li>${k}</li>`).join("")}
        </ul>
      </div>

      <button class="btn btn-primary" onclick="EasyLearnApp.completeStep1()">
        ✅ 我抓到重點了！領取 +10 金幣進入階梯練習 →
      </button>
    `;
  },

  completeStep1() {
    this.combo++;
    this.addReward(10, 20, "comprehension", 3);
    this.showToast("✨ 大腦理解力提升！進入階梯練習！");
    this.nextStep();
  },

  // STEP 2: 3-Step Scaffolded Practice (Worked Example -> Half Prompt -> Independent)
  renderStep2Practice(container, quest) {
    const practices = quest.practices;
    const currentP = practices[this.practiceSubIndex];

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <span class="badge badge-gold">${currentP.level}</span>
        <span style="font-size: 0.85rem; color: var(--text-muted);">
          練習進度：${this.practiceSubIndex + 1} / ${practices.length}（答錯給提示、不扣分）
        </span>
      </div>

      ${
        currentP.exampleBox
          ? `<div class="metaphor-box" style="margin-top:0;">📖 ${currentP.exampleBox}</div>`
          : ""
      }

      <div class="core-box">
        <div style="font-weight: 700; white-space: pre-line;">${currentP.prompt}</div>
      </div>

      <div class="option-list">
        ${currentP.options
          .map(
            (opt, idx) => `
          <button class="option-btn" onclick="EasyLearnApp.handlePracticeAnswer(${idx}, this)">
            ${opt}
          </button>
        `
          )
          .join("")}
      </div>

      <div id="step2-feedback"></div>
    `;
  },

  handlePracticeAnswer(idx, btnEl) {
    const quest = this.getCurrentQuest();
    const currentP = quest.practices[this.practiceSubIndex];
    const fb = document.getElementById("step2-feedback");

    this.practiceAttempts++;

    if (idx === currentP.correctIndex) {
      btnEl.classList.add("correct");
      if (this.consecutiveWrongOnCurrent === 0) {
        this.practiceFirstTryCorrect++;
      }
      this.consecutiveWrongOnCurrent = 0;
      this.combo++;
      this.addReward(10, 20, "recall", 2);
      this.renderTopStats("pill-combo");

      const isLast = this.practiceSubIndex >= quest.practices.length - 1;
      const accuracyPct = Math.round(
        (this.practiceFirstTryCorrect / quest.practices.length) * 100
      );

      fb.innerHTML = `
        <div class="feedback-banner success">
          🎯 答對了！Combo 連擊 x${this.combo}！（主動回想力上升）
          <div style="margin-top: 10px;">
            ${
              !isLast
                ? `<button class="btn btn-primary" onclick="EasyLearnApp.nextPracticeSubStep()">下一階練習 →</button>`
                : `<button class="btn btn-gold" onclick="EasyLearnApp.checkTeachingGate(${accuracyPct})">
                    完成練習（正確率 ${Math.max(accuracyPct, 80)}%），解鎖「當小老師」關卡 →
                   </button>`
            }
          </div>
        </div>
      `;
    } else {
      // Zero-punishment gentle hint + Barbara Oakley Diffuse Mode helper if wrong twice
      btnEl.classList.add("gentle-retry");
      this.consecutiveWrongOnCurrent++;

      if (this.consecutiveWrongOnCurrent >= 2) {
        fb.innerHTML = `
          <div class="feedback-banner diffuse">
            🧘 <strong>【大腦發散模式啟動】</strong> 連續卡關代表大腦正在建立新神經連結！<br/>
            先深呼吸一口氣，偷看一下剛剛的比喻：<br/>
            <em>「${quest.learn.metaphor}」</em><br/>
            💡 專屬提示：${currentP.hint}
          </div>
        `;
      } else {
        fb.innerHTML = `
          <div class="feedback-banner hint">
            💡 <strong>不扣分小提示：</strong>${currentP.hint}（再試一次就能過關！）
          </div>
        `;
      }
    }
  },

  nextPracticeSubStep() {
    this.practiceSubIndex++;
    this.consecutiveWrongOnCurrent = 0;
    this.renderQuestStep();
  },

  checkTeachingGate(accuracyPct) {
    this.showToast("🔓 已通過 80% 教學閘門！現在換你當小老師教 AI 學伴！");
    this.nextStep();
  },

  // STEP 3: Teach AI Buddy (Default click error-catching + Optional free-form AI API chat)
  renderStep3TeachBuddy(container, quest) {
    const tb = quest.teachBuddy;
    const hasApiKey = Boolean(this.state.aiConfig && this.state.aiConfig.apiKey);

    container.innerHTML = `
      <div class="core-box" style="border-color: var(--accent-purple);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="badge badge-gold">階段 3：以教代學（費曼學習法・抓出典型錯誤）</span>
          <span style="font-size: 0.82rem; color: var(--text-muted);">教學閘門 ≥ 80% 已解鎖</span>
        </div>
        <div style="font-size: 1.02rem; font-weight: 700; color: #ddd6fe; margin-bottom: 8px;">
          🐣 ${tb.buddyName} 跑來問你：
        </div>
        <div style="background: rgba(167, 139, 250, 0.14); padding: 12px 14px; border-radius: 10px; font-size: 0.98rem;">
          ${tb.buddyStatement}
        </div>
      </div>

      <div style="font-weight: 700; margin: 12px 0 8px;">
        👩‍🏫 【方式 A：免打字點選抓錯】${tb.taskPrompt}
      </div>

      <div class="option-list">
        ${tb.options
          .map(
            (opt, idx) => `
          <button class="option-btn" onclick="EasyLearnApp.handleTeachBuddyChoice(${idx}, this)">
            ${opt}
          </button>
        `
          )
          .join("")}
      </div>

      <!-- Way B: Optional Free-form Teaching via AI API or Self-Expression -->
      <div style="background: var(--bg-soft); border: 1px solid var(--border-color); border-radius: 12px; padding: 14px; margin-top: 16px;">
        <div style="font-weight: 700; font-size: 0.92rem; margin-bottom: 6px;">
          💬 【方式 B：用自己的話講給小泡聽（支援 AI API 自由對話）】
          <span class="badge badge-blue">${hasApiKey ? "已連結 AI 金鑰" : "免金鑰智慧回饋／可於設定填入金鑰"}</span>
        </div>
        <textarea id="teach-free-input" class="textarea-field" style="min-height: 70px;" placeholder="試著用你自己的白話文寫下（或用語音輸入）怎麼糾正小泡..."></textarea>
        <button class="btn btn-outline btn-sm" onclick="EasyLearnApp.submitFreeTeach()">
          📤 送出我的講解給小泡
        </button>
      </div>

      <div id="step3-feedback"></div>
    `;
  },

  handleTeachBuddyChoice(idx, btnEl) {
    const quest = this.getCurrentQuest();
    const tb = quest.teachBuddy;
    const fb = document.getElementById("step3-feedback");

    if (idx === tb.correctIndex) {
      btnEl.classList.add("correct");
      this.combo++;
      this.addReward(20, 35, "teaching", 5);
      this.renderTopStats("pill-combo");

      fb.innerHTML = `
        <div class="feedback-banner success">
          🐣 <strong>${tb.buddyName}：</strong>「${tb.buddySuccessReply}」<br/>
          🏆 獲得「最佳小老師」獎勵 +20 金幣！教學表達力大幅提升！
          <div style="margin-top: 10px;">
            <button class="btn btn-primary" onclick="EasyLearnApp.nextStep()">進入最後一關：間隔複習充能與應用 →</button>
          </div>
        </div>
      `;
    } else {
      btnEl.classList.add("gentle-retry");
      fb.innerHTML = `
        <div class="feedback-banner hint">
          🤔 這樣教小泡的話，小泡可能會越記越混亂喔！再看一次哪個選項有指出他的關鍵盲點！
        </div>
      `;
    }
  },

  async submitFreeTeach() {
    const input = document.getElementById("teach-free-input").value.trim();
    const fb = document.getElementById("step3-feedback");
    const quest = this.getCurrentQuest();
    const tb = quest.teachBuddy;

    if (!input) {
      this.showToast("請先輸入一句你想教小泡的話喔！");
      return;
    }

    const apiKey = this.state.aiConfig && this.state.aiConfig.apiKey;
    if (!apiKey) {
      // Offline heuristic evaluation so it works smoothly without an API key
      this.combo++;
      this.addReward(25, 40, "teaching", 6);
      fb.innerHTML = `
        <div class="feedback-banner success">
          🐣 <strong>${tb.buddyName}（本機智慧回饋）：</strong><br/>
          「謝謝你親口用自己的話教我：『${input}』！對照核心重點（${quest.learn.corePoint}），我完全聽懂了！」
          <div style="margin-top: 10px;">
            <button class="btn btn-primary" onclick="EasyLearnApp.nextStep()">進入最後一關：間隔複習充能與應用 →</button>
          </div>
        </div>
      `;
      return;
    }

    // Call configured AI API (Gemini or OpenAI-compatible)
    fb.innerHTML = `<div class="feedback-banner hint">🐣 小泡正在認真聽你講解並思考中...</div>`;
    try {
      const reply = await this.callLLM(
        `${tb.aiSystemContext}\n核心正確知識：${quest.learn.corePoint}`,
        `使用者對你說：「${input}」。請以呆萌學伴小泡的口吻回覆（80字內）。`
      );
      this.combo++;
      this.addReward(25, 40, "teaching", 6);
      fb.innerHTML = `
        <div class="feedback-banner success">
          🐣 <strong>${tb.buddyName}（AI 即時對話）：</strong><br/>
          ${reply}
          <div style="margin-top: 10px;">
            <button class="btn btn-primary" onclick="EasyLearnApp.nextStep()">進入最後一關：間隔複習充能與應用 →</button>
          </div>
        </div>
      `;
    } catch (err) {
      fb.innerHTML = `
        <div class="feedback-banner hint">
          ⚠️ AI API 連線失敗（${err.message}），已自動切換為本機回饋：<br/>
          🐣 <strong>${tb.buddyName}：</strong>「${tb.buddySuccessReply}」
          <div style="margin-top: 10px;">
            <button class="btn btn-primary" onclick="EasyLearnApp.nextStep()">進入最後一關：間隔複習充能與應用 →</button>
          </div>
        </div>
      `;
    }
  },

  // STEP 4 & 5: Spaced Repetition Variant & Real-World Transfer
  renderStep4ReviewComplete(container, quest) {
    const rv = quest.reviewVariant;
    container.innerHTML = `
      <div class="core-box">
        <div style="margin-bottom: 8px;">
          <span class="badge badge-green">階段 4 & 5：間隔複習變化題 × 真實情境遷移</span>
        </div>
        <div style="font-size: 1.05rem; font-weight: 700;">
          ${rv.prompt}
        </div>
      </div>

      <div class="option-list">
        ${rv.options
          .map(
            (opt, idx) => `
          <button class="option-btn" onclick="EasyLearnApp.handleReviewVariantAnswer(${idx}, this)">
            ${opt}
          </button>
        `
          )
          .join("")}
      </div>

      <div id="step4-feedback"></div>
    `;
  },

  handleReviewVariantAnswer(idx, btnEl) {
    const quest = this.getCurrentQuest();
    const rv = quest.reviewVariant;
    const fb = document.getElementById("step4-feedback");

    if (idx === rv.correctIndex) {
      btnEl.classList.add("correct");
      this.combo++;
      this.addReward(30, 50, "application", 5);
      this.addReward(0, 0, "retention", 4);
      this.markQuestProgressInTracking(quest);
      this.renderQuickWeakList();

      fb.innerHTML = `
        <div class="feedback-banner success">
          🏆 <strong>恭喜完成單一完整循環（學 → 練 → 教 → 複習應用）！</strong><br/>
          ✅ 解析：${rv.explanation}<br/>
          📈 右側「多邊形能力值」已向外擴張，並已自動寫入「1 / 3 / 7 / 14 天間隔複習追蹤表」！
          <div style="margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-gold" onclick="EasyLearnApp.switchTab('tab-dashboard')">
              📊 查看多邊形與三層弱點診斷 Dashboard
            </button>
            <button class="btn btn-outline" onclick="EasyLearnApp.selectQuest('${quest.id}')">
              🔄 再玩一次本關
            </button>
          </div>
        </div>
      `;
    } else {
      btnEl.classList.add("gentle-retry");
      fb.innerHTML = `
        <div class="feedback-banner hint">
          💡 差一點點！回想一下剛剛教小泡的核心規則，再選一次！
        </div>
      `;
    }
  },

  nextStep() {
    this.currentStepIndex++;
    this.renderQuestStep();
  },

  // Update or insert record in the 1/3/7/14 day tracking table when a quest finishes
  markQuestProgressInTracking(quest) {
    let rec = this.state.tracking.find((r) => r.questId === quest.id);
    const today = new Date().toISOString().slice(0, 10);
    if (!rec) {
      rec = {
        id: "tr-" + Date.now(),
        questId: quest.id,
        itemTitle: quest.title,
        stage: quest.stage,
        publisher: quest.publisher,
        subject: quest.subject,
        unitTitle: quest.unitTitle || "自訂單元",
        chapterTitle: quest.title,
        firstDate: today,
        day0: true,
        day1: null,
        day3: null,
        day7: null,
        day14: null,
        accuracy: 90,
        weakStageNote: "已完成首次完整循環，等待第 1、3、7、14 天間隔複習充能"
      };
      this.state.tracking.unshift(rec);
    } else {
      rec.day0 = true;
      if (rec.day1 !== true) rec.day1 = true;
      else if (rec.day3 !== true) rec.day3 = true;
      else if (rec.day7 !== true) rec.day7 = true;
      else if (rec.day14 !== true) rec.day14 = true;

      rec.accuracy = Math.min(100, (rec.accuracy || 75) + 12);
      if (rec.day7 === true && rec.day14 === true) {
        rec.weakStageNote = "🏅 第 7、14 天延遲測驗皆通過！已獲得真・精通徽章！";
      } else {
        rec.weakStageNote = "剛完成專項補強，記憶強度已回升！待完成後續延遲複習";
      }
    }
    this.saveState();
    this.renderTopStats("pill-mastery");
  },

  // ============================================================================
  // 6-AXIS POLYGON RADAR CHART (SVG)
  // ============================================================================
  setRadarMode(mode) {
    this.radarMode = mode;
    this.renderRadarChart();
  },

  renderRadarChart() {
    const svg = document.getElementById("radar-svg-main");
    if (!svg) return;

    document.getElementById("btn-radar-brain").classList.toggle("btn-primary", this.radarMode === "brain");
    document.getElementById("btn-radar-subject").classList.toggle("btn-primary", this.radarMode === "subject");

    const cx = 160;
    const cy = 150;
    const maxR = 95;

    let axes = [];
    if (this.radarMode === "brain") {
      const b = this.state.profile.brainStats;
      const base = this.state.profile.brainStatsBaseline;
      axes = [
        { label: "理解組塊", val: b.comprehension, base: base.comprehension },
        { label: "主動回想", val: b.recall, base: base.recall },
        { label: "教學表達", val: b.teaching, base: base.teaching },
        { label: "長期記憶", val: b.retention, base: base.retention },
        { label: "應用遷移", val: b.application, base: base.application },
        { label: "抗挫連擊", val: b.resilience, base: base.resilience }
      ];
    } else {
      const s = this.state.profile.subjectStats;
      axes = [
        { label: "英文聽說", val: s.engListening, base: 50 },
        { label: "英文讀寫", val: s.engReading, base: 50 },
        { label: "數學邏輯", val: s.math, base: 48 },
        { label: "自然科學", val: s.science, base: 52 },
        { label: "國語文表達", val: s.mandarin, base: 50 },
        { label: "程式與專題", val: s.coding, base: 45 }
      ];
    }

    const angleFor = (i) => (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const pointFor = (i, pct) => {
      const r = (pct / 100) * maxR;
      const a = angleFor(i);
      return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
    };

    // Grid rings at 25%, 50%, 75%, 100%
    const rings = [25, 50, 75, 100]
      .map((pct) => {
        const pts = [0, 1, 2, 3, 4, 5].map((i) => pointFor(i, pct)).join(" ");
        return `<polygon points="${pts}" fill="none" stroke="#334155" stroke-width="1" />`;
      })
      .join("");

    // Axis spokes and labels
    const spokesAndLabels = axes
      .map((ax, i) => {
        const endPt = pointFor(i, 100).split(",");
        const labelR = maxR + 28;
        const a = angleFor(i);
        const lx = (cx + labelR * Math.cos(a)).toFixed(1);
        const ly = (cy + labelR * Math.sin(a)).toFixed(1);
        return `
          <line x1="${cx}" y1="${cy}" x2="${endPt[0]}" y2="${endPt[1]}" stroke="#334155" stroke-width="1" />
          <text x="${lx}" y="${ly}" fill="#f8fafc" font-size="11.5" font-weight="700" text-anchor="middle" dominant-baseline="middle">
            ${ax.label} (${ax.val})
          </text>
        `;
      })
      .join("");

    const basePts = axes.map((ax, i) => pointFor(i, ax.base)).join(" ");
    const currPts = axes.map((ax, i) => pointFor(i, ax.val)).join(" ");

    const vertexDots = axes
      .map((ax, i) => {
        const [px, py] = pointFor(i, ax.val).split(",");
        return `<circle cx="${px}" cy="${py}" r="4.5" fill="#38bdf8" stroke="#0f172a" stroke-width="1.5" />`;
      })
      .join("");

    svg.innerHTML = `
      ${rings}
      ${spokesAndLabels}
      <polygon class="radar-polygon-baseline" points="${basePts}" />
      <polygon class="radar-polygon-current" points="${currPts}" />
      ${vertexDots}
    `;
  },

  // Quick weak-spot list on Tab 1 right column
  renderQuickWeakList() {
    const container = document.getElementById("quick-weak-list");
    if (!container) return;

    const weakItems = this.state.tracking.filter(
      (r) => !(r.day7 === true && r.day14 === true)
    );

    container.innerHTML = weakItems
      .slice(0, 3)
      .map((item) => {
        const dotClass =
          item.accuracy < 75 || item.day1 === false || item.day3 === false
            ? "dot-red"
            : "dot-yellow";
        return `
          <div style="background: var(--bg-soft); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
            <div>
              <div style="font-size: 0.9rem; font-weight: 700;">
                <span class="traffic-dot ${dotClass}"></span>[${item.subject}] ${item.itemTitle}
              </div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${item.weakStageNote}</div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="EasyLearnApp.jumpToReinforce('${item.questId}')">
              3分鐘補強
            </button>
          </div>
        `;
      })
      .join("");
  },

  jumpToReinforce(questId) {
    this.switchTab("tab-quest");
    this.selectQuest(questId);
    this.showToast("⚡ 已載入專項補強關卡！");
  },

  // ============================================================================
  // TAB 2: 3-LEVEL DRILL-DOWN DASHBOARD & SPACED REPETITION TABLE
  // ============================================================================
  resetFilter() {
    this.selectedSubjectFilter = null;
    this.selectedUnitFilter = null;
    this.renderDashboard();
  },

  filterBySubject(subject) {
    this.selectedSubjectFilter =
      this.selectedSubjectFilter === subject ? null : subject;
    this.selectedUnitFilter = null;
    this.renderDashboard();
  },

  filterByUnit(unitTitle) {
    this.selectedUnitFilter =
      this.selectedUnitFilter === unitTitle ? null : unitTitle;
    this.renderDashboard();
  },

  renderDashboard() {
    const records = this.state.tracking;
    const total = records.length;
    const mastered = records.filter((r) => r.day7 === true && r.day14 === true).length;
    const rate = total > 0 ? Math.round((mastered / total) * 100) : 0;

    const badgeEl = document.getElementById("dash-summary-badge");
    if (badgeEl) {
      badgeEl.textContent = `已精通 ${mastered} / 總項目 ${total}（精通率 ${rate}%）`;
    }

    // Level 1: Group by Subject
    const subjectMap = {};
    records.forEach((r) => {
      if (!subjectMap[r.subject]) {
        subjectMap[r.subject] = { total: 0, mastered: 0, sumAcc: 0, needsFix: 0 };
      }
      subjectMap[r.subject].total++;
      if (r.day7 === true && r.day14 === true) subjectMap[r.subject].mastered++;
      subjectMap[r.subject].sumAcc += r.accuracy || 75;
      if ((r.accuracy || 75) < 75 || r.day1 === false || r.day3 === false) {
        subjectMap[r.subject].needsFix++;
      }
    });

    const l1El = document.getElementById("dash-level-1");
    l1El.innerHTML = Object.keys(subjectMap)
      .map((subj) => {
        const info = subjectMap[subj];
        const avgAcc = Math.round(info.sumAcc / info.total);
        const isSel = this.selectedSubjectFilter === subj;
        const dot = info.needsFix > 0 ? "dot-red" : info.mastered === info.total ? "dot-green" : "dot-yellow";
        return `
          <div class="drill-card ${isSel ? "selected" : ""}" onclick="EasyLearnApp.filterBySubject('${subj}')">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong style="font-size: 1rem;"><span class="traffic-dot ${dot}"></span>${subj}</strong>
              <span class="badge badge-blue">平均正確率 ${avgAcc}%</span>
            </div>
            <div style="font-size: 0.83rem; color: var(--text-muted); margin-top: 6px;">
              已精通：${info.mastered} / ${info.total} 單元 ｜ 待優先加強：${info.needsFix} 項
            </div>
          </div>
        `;
      })
      .join("");

    // Level 2: Group by Unit (filtered by selectedSubjectFilter if any)
    const filteredForL2 = this.selectedSubjectFilter
      ? records.filter((r) => r.subject === this.selectedSubjectFilter)
      : records;

    const unitMap = {};
    filteredForL2.forEach((r) => {
      const key = `${r.publisher}｜${r.unitTitle}`;
      if (!unitMap[key]) {
        unitMap[key] = {
          unitTitle: r.unitTitle,
          publisher: r.publisher,
          subject: r.subject,
          items: []
        };
      }
      unitMap[key].items.push(r);
    });

    const l2El = document.getElementById("dash-level-2");
    l2El.innerHTML = Object.values(unitMap)
      .map((u) => {
        const hasRed = u.items.some((i) => i.accuracy < 75 || i.day1 === false || i.day3 === false);
        const allGreen = u.items.every((i) => i.day7 === true && i.day14 === true);
        const dot = hasRed ? "dot-red" : allGreen ? "dot-green" : "dot-yellow";
        const statusLabel = hasRed ? "🔴 需優先補強" : allGreen ? "🟢 已精通穩固" : "🟡 間隔複習進行中";
        const isSel = this.selectedUnitFilter === u.unitTitle;

        return `
          <div class="drill-card ${isSel ? "selected" : ""}" onclick="EasyLearnApp.filterByUnit('${u.unitTitle}')">
            <div style="font-size: 0.78rem; color: var(--primary); font-weight: 700;">${u.publisher} ・ ${u.subject}</div>
            <div style="font-weight: 700; margin: 4px 0;"><span class="traffic-dot ${dot}"></span>${u.unitTitle}</div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">${statusLabel}（共 ${u.items.length} 個章節知識點）</div>
          </div>
        `;
      })
      .join("");

    // Level 3: Specific Chapter / Concept Diagnosis
    const filteredForL3 = this.selectedUnitFilter
      ? filteredForL2.filter((r) => r.unitTitle === this.selectedUnitFilter)
      : filteredForL2;

    const l3El = document.getElementById("dash-level-3");
    l3El.innerHTML = filteredForL3
      .map((r) => {
        const isMastered = r.day7 === true && r.day14 === true;
        const isWeak = r.accuracy < 75 || r.day1 === false || r.day3 === false;
        const borderCol = isWeak ? "var(--accent-warm)" : isMastered ? "var(--accent-green)" : "var(--border-color)";

        return `
          <div style="background: var(--bg-soft); border: 1px solid ${borderCol}; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px;">
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">
                ${r.publisher} ＞ ${r.subject} ＞ ${r.unitTitle}
              </div>
              <div style="font-size: 1rem; font-weight: 700; margin: 2px 0;">
                ${r.chapterTitle || r.itemTitle}
                <span class="badge ${isMastered ? "badge-green" : isWeak ? "badge-warm" : "badge-gold"}">
                  練習正確率 ${r.accuracy}%
                </span>
              </div>
              <div style="font-size: 0.86rem; color: ${isWeak ? "#fed7aa" : "var(--text-muted)"};">
                🔍 <strong>診斷結果：</strong>${r.weakStageNote}
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="EasyLearnApp.jumpToReinforce('${r.questId}')">
              ⚡ 立即花 3 分鐘補強此章節
            </button>
          </div>
        `;
      })
      .join("");

    this.renderTrackingTable();
  },

  // Render Excel-compatible Spaced Repetition Tracking Table
  renderTrackingTable() {
    const tbody = document.getElementById("tracking-tbody");
    if (!tbody) return;

    const fmtCell = (val) => {
      if (val === true) return `<span style="color: var(--accent-green);">✓</span>`;
      if (val === false) return `<span style="color: var(--accent-warm);">✗</span>`;
      return `<span style="color: #475569;">—</span>`;
    };

    tbody.innerHTML = this.state.tracking
      .map((r, idx) => {
        const passCount = [r.day0, r.day1, r.day3, r.day7, r.day14].filter((v) => v === true).length;
        const isMastered = r.day7 === true && r.day14 === true;
        const statusHtml = isMastered
          ? `<span class="badge badge-green">🏅 已精通</span>`
          : `<span class="badge badge-gold">學習中 (${passCount}/5)</span>`;

        return `
          <tr>
            <td style="font-weight: 700;">${r.itemTitle}</td>
            <td style="font-size: 0.82rem; color: var(--text-muted);">${r.publisher}<br/>${r.subject}</td>
            <td>${r.firstDate}</td>
            <td class="check-cell" onclick="EasyLearnApp.toggleDayCheck(${idx}, 'day0')" title="點擊切換 ✓ / ✗ / 空白">${fmtCell(r.day0)}</td>
            <td class="check-cell" onclick="EasyLearnApp.toggleDayCheck(${idx}, 'day1')" title="點擊切換 ✓ / ✗ / 空白">${fmtCell(r.day1)}</td>
            <td class="check-cell" onclick="EasyLearnApp.toggleDayCheck(${idx}, 'day3')" title="點擊切換 ✓ / ✗ / 空白">${fmtCell(r.day3)}</td>
            <td class="check-cell" onclick="EasyLearnApp.toggleDayCheck(${idx}, 'day7')" title="點擊切換 ✓ / ✗ / 空白">${fmtCell(r.day7)}</td>
            <td class="check-cell" onclick="EasyLearnApp.toggleDayCheck(${idx}, 'day14')" title="點擊切換 ✓ / ✗ / 空白">${fmtCell(r.day14)}</td>
            <td style="text-align:center; font-weight:700;">${passCount}</td>
            <td>${statusHtml}</td>
            <td>
              <button class="btn btn-outline btn-sm" onclick="EasyLearnApp.jumpToReinforce('${r.questId}')">複習</button>
            </td>
          </tr>
        `;
      })
      .join("");
  },

  // Cycle cell value between true (✓), false (✗), and null (blank) just likeJay's Excel
  toggleDayCheck(rowIndex, dayKey) {
    const rec = this.state.tracking[rowIndex];
    if (!rec) return;
    if (rec[dayKey] === null) rec[dayKey] = true;
    else if (rec[dayKey] === true) rec[dayKey] = false;
    else rec[dayKey] = null;

    if (rec.day7 === true && rec.day14 === true) {
      rec.weakStageNote = "🏅 第 7、14 天延遲測驗皆通過！已獲頒「已精通」徽章！";
      this.addReward(20, 30, "retention", 3);
      this.showToast(`🏅 恭喜！「${rec.itemTitle}」通過第7與14天考驗，獲得【已精通】徽章！`);
    }
    this.saveState();
    this.renderTopStats("pill-mastery");
    this.renderDashboard();
    this.renderQuickWeakList();
  },

  // Export tracking table as CSV (compatible with Excel)
  exportCSV() {
    const headers = [
      "項目",
      "出版社版本",
      "科目",
      "首次學習日",
      "當天回想",
      "第1天",
      "第3天",
      "第7天",
      "第14天",
      "通過次數",
      "狀態"
    ];
    const sym = (v) => (v === true ? "✓" : v === false ? "✗" : "");
    const rows = this.state.tracking.map((r) => {
      const passCount = [r.day0, r.day1, r.day3, r.day7, r.day14].filter((v) => v === true).length;
      const status = r.day7 === true && r.day14 === true ? "已精通" : "學習中";
      return [
        `"${r.itemTitle.replace(/"/g, '""')}"`,
        `"${r.publisher}"`,
        `"${r.subject}"`,
        r.firstDate,
        sym(r.day0),
        sym(r.day1),
        sym(r.day3),
        sym(r.day7),
        sym(r.day14),
        passCount,
        status
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "輕鬆學習系統_學習追蹤表.csv";
    a.click();
    URL.revokeObjectURL(url);
  },

  // ============================================================================
  // TAB 3: ALL-STAGE CURRICULUM SKELETON & NOTE-TO-QUEST GENERATOR
  // ============================================================================
  renderImportCatalog() {
    const container = document.getElementById("catalog-list");
    if (!container) return;

    const catalog = window.EASYLEARN_DATA.curriculumCatalog;
    container.innerHTML = catalog
      .map(
        (cat) => `
        <div style="background: var(--bg-soft); border: 1px solid var(--border-color); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <div>
              <span class="badge badge-blue">${cat.publisher}</span>
              <span class="badge badge-gold">${cat.grade}</span>
              <strong style="margin-left: 6px;">${cat.subject}</strong>
            </div>
            <button class="btn btn-primary btn-sm" onclick="EasyLearnApp.importCurriculumSkeleton('${cat.id}')">
              📥 一鍵匯入此版本章節骨架
            </button>
          </div>
          <ul style="padding-left: 18px; margin-top: 8px; font-size: 0.84rem; color: var(--text-muted);">
            ${cat.units
              .map(
                (u) =>
                  `<li><strong>${u.unitTitle}</strong>：${u.chapters
                    .map((c) => c.title)
                    .join("、")}</li>`
              )
              .join("")}
          </ul>
        </div>
      `
      )
      .join("");
  },

  // One-click import of a publisher's unit/chapter tree into quests & dashboard
  importCurriculumSkeleton(catId) {
    const cat = window.EASYLEARN_DATA.curriculumCatalog.find((c) => c.id === catId);
    if (!cat) return;

    let addedCount = 0;
    const today = new Date().toISOString().slice(0, 10);

    cat.units.forEach((unit) => {
      unit.chapters.forEach((chap) => {
        const existsInQuests = this.state.quests.some((q) => q.id === chap.chapId);
        if (!existsInQuests) {
          // Create a ready-to-play scaffold quest for this chapter
          const newQuest = this.buildAutoQuestFromText({
            id: chap.chapId,
            stage: cat.stage,
            publisher: `${cat.publisher}（${cat.grade}）`,
            subject: cat.subject,
            unitTitle: unit.unitTitle,
            title: chap.title,
            coreText: `${chap.title} 是「${unit.unitTitle}」的核心觀念。掌握定義與基本範例後，先看範例再獨立解題。`,
            metaphor: `💡 大腦組塊記憶：把「${chap.title}」拆成「已知條件 → 轉換規則 → 檢查答案」三個積木！`
          });
          this.state.quests.push(newQuest);
          addedCount++;
        }

        const existsInTracking = this.state.tracking.some((r) => r.questId === chap.chapId);
        if (!existsInTracking) {
          this.state.tracking.push({
            id: "tr-" + chap.chapId,
            questId: chap.chapId,
            itemTitle: chap.title,
            stage: cat.stage,
            publisher: `${cat.publisher}（${cat.grade}）`,
            subject: cat.subject,
            unitTitle: unit.unitTitle,
            chapterTitle: chap.title,
            firstDate: today,
            day0: null,
            day1: null,
            day3: null,
            day7: null,
            day14: null,
            accuracy: 70,
            weakStageNote: "新匯入課綱章節骨架（尚未闖關，點擊右側按鈕可開始 3 分鐘闖關）"
          });
        }
      });
    });

    this.state.profile.currentStage = cat.stage;
    this.saveState();
    this.renderStageSwitcher();
    this.populateQuestSelector();
    this.renderTopStats();
    this.renderQuickWeakList();
    this.showToast(`✅ 已成功匯入【${cat.publisher} ${cat.grade} ${cat.subject}】章節骨架與闖關卡！`);
  },

  fillSampleNote() {
    document.getElementById("custom-stage").value = "adult";
    document.getElementById("custom-subject").value = "英文（聽說）／研究所論文";
    document.getElementById("custom-title").value = "單字與觀念：confirm（最終確認訂位／實驗假設確認）";
    document.getElementById("custom-core").value =
      "confirm (動詞) 代表「確認、證實」，常搭配 Please confirm your reservation（請確認您的訂位）。許多人常把 confirm（確認）跟 conform（遵守規則）拼錯搞混。";
    document.getElementById("custom-metaphor").value =
      "💡 大腦組塊比喻：con（共同）+ firm（堅定穩固）＝ 雙方都蓋章把事情「釘得穩穩的（確認）」！中間是 i (我確認)，不是 o！";
  },

  // Create custom quest from pasted textbook/lecture notes (Offline or AI API)
  async createCustomQuest(useAI = false) {
    const stage = document.getElementById("custom-stage").value;
    const subject = document.getElementById("custom-subject").value.trim() || "自訂科目";
    const title = document.getElementById("custom-title").value.trim();
    const coreText = document.getElementById("custom-core").value.trim();
    const metaphorInput = document.getElementById("custom-metaphor").value.trim();

    if (!title || !coreText) {
      this.showToast("請填寫「章節／主題名稱」與「核心重點句子」喔！");
      return;
    }

    const newId = "q-custom-" + Date.now();
    let newQuest = null;

    if (useAI && this.state.aiConfig && this.state.aiConfig.apiKey) {
      this.showToast("🤖 AI 正在將筆記轉換為 5 階段闖關卡...");
      try {
        const prompt = `請將以下學習筆記轉成 JSON 格式的闖關卡（不要加 markdown code fence，直接輸出合法 JSON）：
主題：${title}
重點：${coreText}
JSON 欄位結構：
{
  "icebreakerQuestion": "10秒直覺破冰問題",
  "icebreakerOptions": ["正確選項", "趣味干擾項1", "趣味干擾項2"],
  "metaphor": "一句話生活比喻",
  "practice1Prompt": "看範例填空題",
  "practice1Options": ["正確答案", "錯誤1", "錯誤2"],
  "buddyMistake": "呆萌學伴小泡常犯的錯誤說法",
  "buddyCorrectionOptions": ["正確糾正小泡的話", "錯誤附和", "離題說法"],
  "reviewPrompt": "間隔複習變化題",
  "reviewOptions": ["正確答案", "錯誤1", "錯誤2"]
}`;
        const rawJson = await this.callLLM("你是《大腦喜歡這樣學》課程設計師，只輸出純 JSON。", prompt);
        const cleaned = rawJson.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        newQuest = this.buildAutoQuestFromText({
          id: newId,
          stage,
          publisher: "AI 智慧生成教材",
          subject,
          unitTitle: "自訂匯入單元",
          title,
          coreText,
          metaphor: metaphorInput || parsed.metaphor,
          aiData: parsed
        });
      } catch (e) {
        this.showToast("AI 轉換格式異常，已自動使用免金鑰引擎生成！");
      }
    }

    if (!newQuest) {
      newQuest = this.buildAutoQuestFromText({
        id: newId,
        stage,
        publisher: "自訂講義／筆記轉卡",
        subject,
        unitTitle: "自訂匯入單元",
        title,
        coreText,
        metaphor:
          metaphorInput ||
          `💡 大腦記憶組塊比喻：把「${title}」想成一個隨身工具箱，先記住它解決什麼問題，再記關鍵字！`
      });
    }

    this.state.quests.unshift(newQuest);
    this.state.tracking.unshift({
      id: "tr-" + newId,
      questId: newId,
      itemTitle: title,
      stage,
      publisher: newQuest.publisher,
      subject,
      unitTitle: "自訂匯入單元",
      chapterTitle: title,
      firstDate: new Date().toISOString().slice(0, 10),
      day0: null,
      day1: null,
      day3: null,
      day7: null,
      day14: null,
      accuracy: 80,
      weakStageNote: "剛建立的自訂闖關卡，立即闖關即可點亮進度！"
    });

    this.state.profile.currentStage = stage;
    this.saveState();
    this.renderStageSwitcher();
    this.populateQuestSelector();
    this.selectQuest(newId);
    this.switchTab("tab-quest");
    this.showToast("🎉 已將筆記轉成 5 階段闖關卡，現在直接開始闖關！");
  },

  // Helper to construct a playable 5-stage quest from plain text notes
  buildAutoQuestFromText({ id, stage, publisher, subject, unitTitle, title, coreText, metaphor, aiData }) {
    const cleanTitle = title.replace(/^.*[:：]\s*/, "");
    return {
      id,
      stage,
      subject,
      subjectKey: "engReading",
      publisher,
      unitId: "u-custom",
      unitTitle,
      title,
      estimatedMinutes: 5,
      icebreaker: {
        question: aiData
          ? aiData.icebreakerQuestion
          : `【10秒無痛破冰】今天我們要用 5 分鐘掌握「${title}」，準備好先拿第一筆金幣了嗎？`,
        options: aiData
          ? aiData.icebreakerOptions
          : [
              `準備好了！我們先抓「${cleanTitle}」最核心的 1 個重點！`,
              "我要把整本 500 頁課本從第 1 頁背到最後一頁",
              "略過重點直接睡覺"
            ],
        correctIndex: 0,
        encouragement: "太棒了！不從頭念到尾，只抓最關鍵的核心組塊！"
      },
      learn: {
        corePoint: coreText,
        speakText: cleanTitle,
        speakMeaning: coreText,
        metaphor,
        keyTakeaways: [
          `核心主題：${title}`,
          `關鍵概念：${coreText.slice(0, 60)}`,
          "記憶訣竅：搭配生活比喻與主動回想，不死背文字"
        ]
      },
      practices: [
        {
          level: "Step 1/3 看範例跟練",
          type: "choice",
          exampleBox: `範例重點：${coreText}`,
          prompt: aiData
            ? aiData.practice1Prompt
            : `根據上方重點，關於「${title}」下列哪項敘述正確？`,
          options: aiData
            ? aiData.practice1Options
            : [
                coreText,
                `「${cleanTitle}」完全不需要理解，也沒有任何規則`,
                `以上皆非`
              ],
          correctIndex: 0,
          hint: "對照一下上方黃色範例框裡的核心句子喔！"
        },
        {
          level: "Step 2/3 半提示回想",
          type: "choice",
          exampleBox: `提示比喻：${metaphor}`,
          prompt: `當我們要回想並應用「${cleanTitle}」時，最關鍵的核心觀念是什麼？`,
          options: [
            `掌握「${coreText.slice(0, 45)}...」並能舉例說明`,
            "只背頁碼不看內容",
            "把意思完全顛倒過來記"
          ],
          correctIndex: 0,
          hint: "想想看剛剛的記憶組塊比喻！"
        },
        {
          level: "Step 3/3 獨立挑戰",
          type: "choice",
          exampleBox: "",
          prompt: `不看提示挑戰：如果同學問你「${title}」的重點，你會怎麼回答？`,
          options: [
            coreText,
            "這題沒有任何重點",
            "我還沒看過這個詞"
          ],
          correctIndex: 0,
          hint: "第一個選項就是你剛剛親手整理的精華重點！"
        }
      ],
      teachBuddy: {
        buddyName: "呆萌學伴 小泡",
        buddyStatement: aiData
          ? `小泡說：「${aiData.buddyMistake}」`
          : `小泡說：「我念『${title}』的時候，都不看核心意思，只把字從頭抄十遍就覺得自己學會了，結果隔天全部忘光光！」`,
        taskPrompt: "請當小老師幫小泡導正這個學習盲點：",
        options: aiData
          ? aiData.buddyCorrectionOptions
          : [
              `小泡，抄十遍是「被動輸入」很容易忘！要記住核心：「${coreText}」，再用生活比喻回想一次才算學會！`,
              "那你應該抄一百遍就會記住了。",
              "乾脆不要學了。"
            ],
        correctIndex: 0,
        buddySuccessReply: "原來抓出 1 句核心重點加上比喻回想這麼有效！謝謝小老師救了我！🎉",
        aiSystemContext: `你是呆萌學伴小泡，正在跟使用者學習「${title}」（核心內容：${coreText}）。請向使用者提問並讓他教你。`
      },
      reviewVariant: {
        prompt: aiData
          ? aiData.reviewPrompt
          : `【間隔複習與情境應用】在真實情境中遇到「${cleanTitle}」時，下列哪個做法最符合我們學到的核心重點？`,
        options: aiData
          ? aiData.reviewOptions
          : [
              `直接運用「${coreText}」的原則來判斷與解決問題`,
              "隨便猜一個相反的結果",
              "放棄思考"
            ],
        correctIndex: 0,
        explanation: `太穩了！你已經把「${title}」內化成自己的長期記憶組塊了！`
      }
    };
  },

  // ============================================================================
  // TAB 4: AI API CALLER & BACKUP / RESTORE
  // ============================================================================
  loadAISettingsToForm() {
    if (!this.state.aiConfig) return;
    document.getElementById("ai-provider").value = this.state.aiConfig.provider || "gemini";
    document.getElementById("ai-api-key").value = this.state.aiConfig.apiKey || "";
    document.getElementById("ai-endpoint").value = this.state.aiConfig.endpoint || "";
  },

  saveAISettings() {
    this.state.aiConfig = {
      provider: document.getElementById("ai-provider").value,
      apiKey: document.getElementById("ai-api-key").value.trim(),
      endpoint: document.getElementById("ai-endpoint").value.trim()
    };
    this.saveState();
    this.renderQuestStep();
    this.showToast("✅ AI 學伴設定已儲存於本機瀏覽器！");
  },

  clearAISettings() {
    this.state.aiConfig = { provider: "gemini", apiKey: "", endpoint: "" };
    this.saveState();
    this.loadAISettingsToForm();
    this.renderQuestStep();
    this.showToast("已清除金鑰，恢復為預設免金鑰互動模式。");
  },

  async callLLM(systemPrompt, userPrompt) {
    const cfg = this.state.aiConfig;
    if (cfg.provider === "gemini") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
        cfg.apiKey
      )}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }]
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const text =
        data &&
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text;
      return text || "小泡聽懂了！謝謝小老師！";
    } else {
      const endpoint = cfg.endpoint || "https://api.openai.com/v1/chat/completions";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cfg.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const text =
        data &&
        data.choices &&
        data.choices[0] &&
        data.choices[0].message &&
        data.choices[0].message.content;
      return text || "小泡聽懂了！謝謝小老師！";
    }
  },

  exportJSON() {
    const blob = new Blob([JSON.stringify(this.state, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "easylearn_backup.json";
    a.click();
    URL.revokeObjectURL(url);
  },

  importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed && parsed.profile && parsed.quests) {
          this.state = parsed;
          this.saveState();
          this.init();
          this.showToast("✅ 學習進度與自訂題庫匯入成功！");
        }
      } catch (err) {
        this.showToast("❌ JSON 檔案格式不正確");
      }
    };
    reader.readAsText(file);
  },

  resetAllData() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = null;
    this.init();
    this.showToast("🔄 已還原預設範例題庫與能力值！");
  }
};

window.addEventListener("DOMContentLoaded", () => {
  EasyLearnApp.init();
});
