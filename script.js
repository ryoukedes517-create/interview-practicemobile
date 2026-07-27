// ログイン用パスワードは、この1か所だけを変更してください。
const LOGIN_PASSWORD = "interview123";

// プロフィール項目の定義です。
// 今後「職歴」などを増やす場合は、同じ形式の項目をこの配列へ追加してください。
// フォーム、プロフィール表示、自己紹介の採点項目へ自動的に反映されます。
const PROFILE_FIELDS = [
  {
    key: "name",
    label: "名前",
    type: "text",
    placeholder: "例：グエン・ヴァン・アン",
    autocomplete: "name",
    matchesAnswer: (answer, value) => containsProfileReading(answer, value)
  },
  {
    key: "age",
    label: "年齢",
    type: "number",
    placeholder: "例：25",
    inputMode: "numeric",
    min: 15,
    max: 99,
    formatValue: (value) => `${value}歳`,
    matchesAnswer: (answer, value) => containsAge(answer, value)
  },
  {
    key: "nationality",
    label: "国籍",
    type: "text",
    placeholder: "例：ベトナム",
    autocomplete: "country-name",
    matchesAnswer: (answer, value) => containsProfileValue(answer, value)
  },
  {
    key: "schoolName",
    label: "日本語学校名",
    type: "text",
    placeholder: "例：さくら日本語学校",
    autocomplete: "organization",
    matchesAnswer: (answer, value) => containsProfileReading(answer, value)
  }
];

const CLOSING_GREETING_ITEM = {
  key: "closingGreeting",
  label: "最後の挨拶",
  matchesAnswer: (answer) => hasClosingGreetingAtEnd(answer)
};

const questions = [
  {
    category: "第1問・自己紹介",
    question: "自己紹介をしてください。",
    type: "introduction"
  },
  {
    category: "第2問・日本で働く理由",
    question: "なぜ日本で働きたいと思いましたか。",
    criteria: ["日本で働きたい理由", "前向きさ", "理由の具体性", "働く意欲"],
    groups: [
      ["日本", "働", "仕事", "技術", "文化", "経験", "学", "成長", "生活"],
      ["たい", "挑戦", "成長", "頑張", "貢献", "活か", "学び"],
      ["から", "ため", "ので", "きっかけ", "経験", "例えば", "特に"],
      ["働きたい", "頑張", "貢献", "長く", "役に立", "努力"]
    ],
    type: "generic",
    salaryPenalty: true
  },
  {
    category: "第3問・志望動機",
    question: "なぜ当社を志望しましたか。",
    criteria: ["志望理由", "会社を選んだ理由", "前向きさ", "入社後の意欲"],
    groups: [
      ["志望", "魅力", "興味", "共感", "仕事", "事業"],
      ["御社", "貴社", "会社", "理念", "商品", "サービス", "技術", "環境", "業界"],
      ["たい", "挑戦", "成長", "活か", "貢献", "好き"],
      ["入社", "働", "貢献", "頑張", "身につけ", "役に立"]
    ],
    type: "generic"
  },
  {
    category: "第4問・頑張ったこと",
    question: "仕事や勉強で一番頑張ったことは何ですか。",
    criteria: ["頑張った内容", "具体性", "努力した点", "成長"],
    groups: [
      ["仕事", "アルバイト", "学校", "勉強", "日本語", "ボランティア", "部活", "プロジェクト", "頑張"],
      ["とき", "毎日", "年間", "か月", "時間", "例えば", "担当", "目標"],
      ["努力", "練習", "続け", "工夫", "相談", "復習", "準備", "頑張"],
      ["できるよう", "学び", "成長", "身につ", "合格", "達成", "改善"]
    ],
    type: "generic"
  },
  {
    category: "第5問・強み",
    question: "あなたの強みは何ですか。",
    criteria: ["強みの説明", "具体性", "仕事での活かし方", "前向きさ"],
    groups: [
      ["強み", "長所", "まじめ", "責任感", "協力", "継続", "明る", "行動", "聞く", "粘り強"],
      ["例えば", "とき", "経験", "毎日", "以前", "学校", "仕事", "アルバイト"],
      ["仕事", "活か", "役に立", "貢献", "職場", "業務"],
      ["たい", "頑張", "続け", "成長", "努力", "貢献"]
    ],
    type: "generic"
  },
  {
    category: "第6問・弱みと改善",
    question: "あなたの弱みは何ですか。また、どのように改善していますか。",
    criteria: ["弱みの説明", "具体性", "改善方法", "前向きさ"],
    groups: [
      ["弱み", "短所", "苦手", "緊張", "心配", "時間", "慎重", "遠慮"],
      ["とき", "場合", "例えば", "以前", "ことがあり", "すぎ"],
      ["改善", "練習", "準備", "確認", "相談", "メモ", "意識", "計画"],
      ["できるよう", "努力", "続け", "前より", "少しずつ", "心がけ"]
    ],
    type: "generic"
  },
  {
    category: "第7問・日本語への不安",
    question: "日本語で働くことについて不安はありますか。",
    criteria: ["不安の有無", "理由", "改善や根拠", "前向きさ"],
    groups: [
      ["不安", "心配", "ありません", "ないです", "あります"],
      ["から", "ため", "ので", "言葉", "会話", "敬語", "専門用語", "聞き取"],
      ["勉強", "練習", "確認", "質問", "メモ", "経験", "相談"],
      ["頑張", "努力", "続け", "できる", "前向き", "学び"]
    ],
    type: "generic"
  },
  {
    category: "第8問・ミスへの対応",
    question: "仕事でミスをした時、どう対応しますか。",
    criteria: ["対応", "報告や相談", "再発防止", "前向きさ"],
    groups: [
      ["確認", "謝", "直", "対応", "原因", "すぐ"],
      ["報告", "相談", "上司", "先輩", "責任者", "周り"],
      ["再発", "繰り返", "メモ", "見直", "チェック", "原因", "防ぐ"],
      ["学び", "改善", "次", "努力", "責任", "気をつけ"]
    ],
    type: "generic"
  },
  {
    category: "第9問・チームワーク",
    question: "チームで働くときに大切にしていることは何ですか。",
    criteria: ["大切にしていること", "理由や具体例", "協力する姿勢", "コミュニケーション意欲"],
    groups: [
      ["大切", "協力", "報告", "相談", "聞く", "尊重", "思いやり"],
      ["から", "ため", "ので", "例えば", "経験", "とき"],
      ["協力", "助け", "一緒", "チーム", "支え", "役割"],
      ["話", "聞", "伝え", "相談", "報告", "コミュニケーション", "声をかけ"]
    ],
    type: "generic"
  },
  {
    category: "第10問・将来像",
    question: "将来、どのような人材になりたいですか。",
    criteria: ["将来の目標", "具体性", "努力や行動", "成長意欲"],
    groups: [
      ["将来", "人材", "なりたい", "目標", "リーダー", "専門", "信頼", "役に立"],
      ["仕事", "技術", "日本語", "後輩", "お客様", "会社", "チーム", "具体的"],
      ["勉強", "努力", "経験", "資格", "学び", "練習", "挑戦", "行動"],
      ["成長", "できるよう", "なりたい", "高め", "身につけ", "続け"]
    ],
    type: "generic"
  }
];

const $ = (id) => document.getElementById(id);
const loginScreenEl = $("loginScreen");
const loginFormEl = $("loginForm");
const loginPasswordEl = $("loginPassword");
const loginErrorEl = $("loginError");
const profileScreenEl = $("profileScreen");
const interviewScreenEl = $("interviewScreen");
const profileFormEl = $("profileForm");
const profileFieldsEl = $("profileFields");
const profileErrorEl = $("profileError");
const profileSummaryEl = $("profileSummary");
const editProfileBtn = $("editProfile");
const categoryEl = $("category");
const questionTextEl = $("questionText");
const questionNumberEl = $("questionNumber");
const questionTotalEl = $("questionTotal");
const progressBarEl = $("progressBar");
const answerInputEl = $("answerInput");
const scoreAnswerBtn = $("scoreAnswer");
const nextQuestionBtn = $("nextQuestion");
const scoreCardEl = $("scoreCard");
const totalScoreEl = $("totalScore");
const scoreListEl = $("scoreList");
const voiceInputBtn = $("voiceInput");
const voiceButtonTextEl = $("voiceButtonText");
const repeatQuestionBtn = $("repeatQuestion");
const voiceStatusEl = $("voiceStatus");
const voiceStatusTextEl = $("voiceStatusText");

let profile = {};
let currentIndex = 0;
let recognition = null;
let isListening = false;
let isAcceptingSpeech = false;
let recognitionAlternatives = [];
let shouldKeepListening = false;
let recognitionRestartTimer = null;
let questionSpeechTimer = null;
let microphonePermissionGranted = false;
let speechSynthesisUnlocked = false;
let recognitionHadFatalError = false;
const QUESTION_SPEECH_DELAY = 5000;
const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const IS_MOBILE = IS_IOS || /Android|Mobile/i.test(navigator.userAgent);

function showLoginError(message) {
  loginErrorEl.textContent = message;
  loginErrorEl.classList.remove("hidden");
  loginPasswordEl.setAttribute("aria-invalid", "true");
}

function unlockApp() {
  loginScreenEl.classList.add("hidden");
  profileScreenEl.classList.remove("hidden");
  profileFormEl.elements[PROFILE_FIELDS[0].key].focus();
}

function normalize(text) {
  return text.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

function normalizeForComparison(text) {
  const traditionalForms = {
    "髙": "高", "﨑": "崎", "神": "神", "邊": "辺", "邉": "辺",
    "齋": "斉", "齊": "斉", "國": "国", "學": "学", "櫻": "桜",
    "德": "徳", "惠": "恵", "嶋": "島", "濱": "浜", "澤": "沢",
    "瀨": "瀬", "隆": "隆", "龍": "竜"
  };

  return String(text ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (character) => (
      String.fromCharCode(character.charCodeAt(0) - 0x60)
    ))
    .replace(/[髙﨑神邊邉齋齊國學櫻德惠嶋濱澤瀨隆龍]/g, (character) => (
      traditionalForms[character]
    ))
    .replace(/[\p{Separator}\p{Punctuation}\p{Format}ー]/gu, "");
}

function containsProfileValue(answer, value) {
  const normalizedValue = normalizeForComparison(value);
  return normalizedValue.length > 0 && normalizeForComparison(answer).includes(normalizedValue);
}

function containsProfileReading(answer, value) {
  if (containsProfileValue(answer, value)) return true;

  // 音声認識が同じ読みを別の漢字へ変換した場合は、
  // 同じ音声から得られた別候補も確認して採点します。
  return recognitionAlternatives.some((alternative) => (
    containsProfileValue(alternative, value)
  ));
}

function containsAge(answer, value) {
  const normalizedAnswer = String(answer).normalize("NFKC");
  const escapedAge = String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^0-9])${escapedAge}\\s*(?:歳|才)(?=$|[^0-9])`).test(normalizedAnswer);
}

function hasClosingGreetingAtEnd(answer) {
  const normalizedAnswer = normalizeForComparison(answer);
  const greetings = [
    "どうぞよろしくお願いいたします",
    "どうぞよろしくお願いします",
    "よろしくお願いいたします",
    "よろしくお願いします",
    "ありがとうございました",
    "以上です"
  ];
  return greetings.some((greeting) => normalizedAnswer.endsWith(normalizeForComparison(greeting)));
}

function getIntroductionItems() {
  const profileItems = PROFILE_FIELDS.map((field) => ({
    key: field.key,
    label: field.label,
    matchesAnswer: (answer) => field.matchesAnswer(answer, profile[field.key])
  }));
  return [...profileItems, CLOSING_GREETING_ITEM];
}

function hasAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function detailLevel(text) {
  const connectors = ["から", "ため", "ので", "そして", "また", "例えば", "とき", "その結果"];
  const clauses = text.split(/[。！？!?、,]/).filter(Boolean).length;
  return Math.min(2, connectors.filter((word) => text.includes(word)).length + (clauses >= 3 ? 1 : 0));
}

function scoreEvidence(text, keywords, criterionIndex) {
  if (!text) return 0;
  const matches = keywords.filter((keyword) => text.includes(keyword)).length;
  const detail = detailLevel(text);
  if (matches >= 2 && (detail >= 1 || text.length >= 35)) return 25;
  if (matches >= 1 && (detail >= 1 || text.length >= 20)) return 20;
  if (matches >= 1) return 15;
  if (criterionIndex > 0 && text.length >= 45 && detail >= 1) return 10;
  return 5;
}

function scoreIntroduction(text) {
  const items = getIntroductionItems();
  const pointsPerItem = 100 / items.length;
  return items.map((item) => item.matchesAnswer(text) ? pointsPerItem : 0);
}

function scoreCurrentAnswer(rawAnswer) {
  const answer = normalize(rawAnswer);
  const current = questions[currentIndex];
  if (current.type === "introduction") return scoreIntroduction(rawAnswer);

  // 第2問以降は元アプリの採点ロジックを変更していません。
  let scores = current.groups.map((keywords, index) => scoreEvidence(answer, keywords, index));
  if (current.salaryPenalty && /給料|給与|賃金/.test(answer)) {
    const hasAnotherReason = hasAny(answer, ["技術", "文化", "経験", "学", "成長", "環境", "仕事", "挑戦"]);
    if (!hasAnotherReason) scores = scores.map((score) => Math.min(score, 10));
  }
  return scores;
}

function createProfileFields() {
  const fragment = document.createDocumentFragment();

  PROFILE_FIELDS.forEach((field) => {
    const wrapper = document.createElement("div");
    wrapper.className = "form-field";

    const label = document.createElement("label");
    label.htmlFor = `profile-${field.key}`;
    label.innerHTML = `${field.label}<span class="required-mark">必須</span>`;

    const input = document.createElement("input");
    input.id = `profile-${field.key}`;
    input.name = field.key;
    input.type = field.type || "text";
    input.placeholder = field.placeholder || "";
    input.required = true;
    if (field.autocomplete) input.autocomplete = field.autocomplete;
    if (field.inputMode) input.inputMode = field.inputMode;
    if (field.min !== undefined) input.min = String(field.min);
    if (field.max !== undefined) input.max = String(field.max);
    input.addEventListener("input", () => {
      input.setAttribute("aria-invalid", "false");
      profileErrorEl.classList.add("hidden");
    });

    wrapper.append(label, input);
    fragment.appendChild(wrapper);
  });

  profileFieldsEl.appendChild(fragment);
}

function readProfile() {
  const nextProfile = {};
  let firstInvalidInput = null;

  PROFILE_FIELDS.forEach((field) => {
    const input = profileFormEl.elements[field.key];
    const value = input.value.trim();
    const isValid = value !== "" && input.checkValidity();
    input.setAttribute("aria-invalid", String(!isValid));
    if (!isValid && !firstInvalidInput) firstInvalidInput = input;
    nextProfile[field.key] = value;
  });

  if (firstInvalidInput) {
    profileErrorEl.textContent = "すべての項目を正しく入力してください。";
    profileErrorEl.classList.remove("hidden");
    firstInvalidInput.focus();
    return null;
  }
  return nextProfile;
}

function renderProfileSummary() {
  profileSummaryEl.textContent = PROFILE_FIELDS.map((field) => {
    const value = profile[field.key];
    return field.formatValue ? field.formatValue(value) : value;
  }).join(" ／ ");
}

function startInterview() {
  currentIndex = 0;
  profileScreenEl.classList.add("hidden");
  interviewScreenEl.classList.remove("hidden");
  renderProfileSummary();
  renderQuestion();
  unlockSpeechSynthesis();
}

function editProfile() {
  clearTimeout(questionSpeechTimer);
  window.speechSynthesis?.cancel();
  endRecognitionSession();
  PROFILE_FIELDS.forEach((field) => {
    profileFormEl.elements[field.key].value = profile[field.key] || "";
  });
  interviewScreenEl.classList.add("hidden");
  profileScreenEl.classList.remove("hidden");
  profileFormEl.elements[PROFILE_FIELDS[0].key].focus();
}

function renderQuestion() {
  const current = questions[currentIndex];
  endRecognitionSession();
  recognitionAlternatives = [];
  clearTimeout(questionSpeechTimer);
  window.speechSynthesis?.cancel();
  categoryEl.textContent = current.category;
  questionTextEl.textContent = current.question;
  questionNumberEl.textContent = String(currentIndex + 1);
  questionTotalEl.textContent = String(questions.length);
  progressBarEl.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;
  answerInputEl.value = "";
  scoreCardEl.classList.add("hidden");
  answerInputEl.disabled = false;
  scoreAnswerBtn.disabled = false;
  nextQuestionBtn.textContent = currentIndex === questions.length - 1 ? "最初から" : "次の質問へ";
  updateVoiceInputButton();
  if (recognition) {
    setVoiceStatus(
      IS_IOS
        ? "「話す」を押すとSafariの音声認識が始まります。"
        : "「話す」を押すとマイクが始まります。",
      "ready"
    );
  }

  const questionIndex = currentIndex;
  questionSpeechTimer = setTimeout(() => {
    if (
      currentIndex === questionIndex
      && !interviewScreenEl.classList.contains("hidden")
      && scoreCardEl.classList.contains("hidden")
    ) {
      speakQuestion();
    }
  }, QUESTION_SPEECH_DELAY);
}

function formatPoints(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function renderScores(scores) {
  endRecognitionSession();
  clearTimeout(questionSpeechTimer);
  window.speechSynthesis?.cancel();
  const current = questions[currentIndex];
  const isIntroduction = current.type === "introduction";
  const introductionItems = isIntroduction ? getIntroductionItems() : [];
  const criteria = isIntroduction ? introductionItems.map((item) => item.label) : current.criteria;
  const maximum = isIntroduction ? 100 / criteria.length : 25;
  totalScoreEl.textContent = String(Math.round(scores.reduce((sum, score) => sum + score, 0)));
  scoreListEl.replaceChildren();

  criteria.forEach((criterion, index) => {
    const row = document.createElement("div");
    const label = document.createElement("dt");
    const value = document.createElement("dd");
    label.textContent = criterion;
    value.innerHTML = `<strong>${formatPoints(scores[index])}</strong><span>/${formatPoints(maximum)}</span>`;

    if (isIntroduction) {
      const matched = scores[index] > 0;
      const status = document.createElement("span");
      status.className = `match-status ${matched ? "matched" : "missing"}`;
      status.textContent = matched
        ? `一致（+${formatPoints(maximum)}点）`
        : `不一致（-${formatPoints(maximum)}点）`;
      value.appendChild(status);
    }

    row.append(label, value);
    scoreListEl.append(row);
  });

  scoreCardEl.classList.remove("hidden");
  answerInputEl.disabled = true;
  scoreAnswerBtn.disabled = true;
  scoreCardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });

  if (currentIndex === questions.length - 1) {
    endRecognitionSession();
  }
}

function speakQuestion() {
  if (!("speechSynthesis" in window)) {
    setVoiceStatus("このブラウザは音声読み上げに対応していません。", "error");
    return;
  }

  endRecognitionSession();
  const synth = window.speechSynthesis;
  synth.cancel();
  synth.resume();
  const utterance = new SpeechSynthesisUtterance(questionTextEl.textContent);
  utterance.lang = "ja-JP";
  utterance.rate = 0.9;
  const japaneseVoice = synth.getVoices().find((voice) => (
    voice.lang.toLowerCase().startsWith("ja")
  ));
  if (japaneseVoice) utterance.voice = japaneseVoice;
  utterance.addEventListener("start", () => {
    setVoiceStatus("質問を読み上げています。", "ready");
  });
  utterance.addEventListener("end", () => {
    setVoiceStatus("「話す」を押して回答してください。", "ready");
  });
  utterance.addEventListener("error", () => {
    setVoiceStatus("読み上げを開始できませんでした。「質問を聞く」をもう一度押してください。", "error");
  });
  synth.speak(utterance);
}

function unlockSpeechSynthesis() {
  if (speechSynthesisUnlocked || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const primer = new SpeechSynthesisUtterance(" ");
  primer.volume = 0.01;
  primer.lang = "ja-JP";
  synth.speak(primer);
  speechSynthesisUnlocked = true;
}

function setListeningState(listening) {
  isListening = listening;
  updateVoiceInputButton();
}

function updateVoiceInputButton() {
  const isCapturingAnswer = isAcceptingSpeech;
  voiceInputBtn.classList.toggle("is-listening", isCapturingAnswer);
  voiceInputBtn.setAttribute("aria-pressed", String(isCapturingAnswer));
  voiceButtonTextEl.textContent = isCapturingAnswer ? "止める" : "話す";
}

function setVoiceStatus(message, state = "") {
  voiceStatusTextEl.textContent = message;
  voiceStatusEl.classList.toggle("is-ready", state === "ready");
  voiceStatusEl.classList.toggle("is-listening", state === "listening");
  voiceStatusEl.classList.toggle("is-error", state === "error");
}

function isCodexPreview() {
  const userAgent = navigator.userAgent || "";
  const host = window.location.hostname || "";
  return /Codex|Electron/i.test(userAgent)
    || /codex|chatgpt/i.test(host)
    || /^(codex|chatgpt):$/i.test(window.location.protocol);
}

function isLocalAddress() {
  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

function canRequestMicrophone() {
  return window.isSecureContext || isLocalAddress();
}

function showMicrophoneEnvironmentMessage(message = "このプレビューではマイクを使えません。スマホのSafariまたはChromeで開いてください。") {
  setVoiceStatus(message, "error");
}

function setupSpeechRecognition() {
  if (isCodexPreview()) {
    showMicrophoneEnvironmentMessage();
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceInputBtn.disabled = true;
    setVoiceStatus("このブラウザは音声認識に対応していません。回答欄へ直接入力できます。", "error");
    return;
  }
  if (!canRequestMicrophone()) {
    voiceInputBtn.disabled = true;
    setVoiceStatus("マイクを使うには、このページをHTTPSで開いてください。", "error");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "ja-JP";
  recognition.continuous = !IS_MOBILE;
  recognition.interimResults = true;
  recognition.maxAlternatives = 10;
  recognition.addEventListener("start", () => {
    recognitionHadFatalError = false;
    setListeningState(true);
    setVoiceStatus(
      IS_IOS
        ? "Safariで聞き取り中です。回答を話してください。"
        : "聞き取り中です。回答を話してください。",
      "listening"
    );
  });
  recognition.addEventListener("result", (event) => {
    if (!isAcceptingSpeech || answerInputEl.disabled) return;

    let finalText = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i];
      const text = result[0].transcript.trim();
      if (result.isFinal) {
        finalText += text;
        for (let j = 0; j < result.length; j += 1) {
          const alternative = result[j].transcript.trim();
          if (alternative) recognitionAlternatives.push(alternative);
        }
      }
    }
    if (finalText) {
      const current = answerInputEl.value.trimEnd();
      answerInputEl.value = current ? `${current} ${finalText}` : finalText;
      answerInputEl.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  recognition.addEventListener("error", (event) => {
    if (event.error === "aborted") return;

    if (event.error === "no-speech") {
      setVoiceStatus(
        IS_IOS
          ? "音声が聞き取れませんでした。Safariで再接続しています…"
          : "音声が聞き取れませんでした。続けて話してください。",
        "listening"
      );
      return;
    }

    const messages = {
      "not-allowed": "マイクが許可されていません。ブラウザのサイト設定でマイクを許可してください。",
      "service-not-allowed": "音声認識サービスを利用できません。SafariまたはChromeで開き直してください。",
      "audio-capture": "マイクを見つけられません。端末のマイク設定を確認してください。",
      "network": "音声認識サービスへ接続できません。通信環境を確認してください。",
      "language-not-supported": "日本語の音声認識を利用できません。",
      "phrases-not-supported": "この端末では音声認識の設定に対応していません。"
    };

    if (messages[event.error]) {
      recognitionHadFatalError = true;
      shouldKeepListening = false;
      isAcceptingSpeech = false;
      updateVoiceInputButton();
      setVoiceStatus(messages[event.error], "error");
    }
  });
  recognition.addEventListener("end", () => {
    setListeningState(false);
    if (recognitionHadFatalError) return;

    if (shouldKeepListening && isAcceptingSpeech && !answerInputEl.disabled) {
      clearTimeout(recognitionRestartTimer);
      recognitionRestartTimer = setTimeout(() => {
        try {
          recognition.start();
        } catch {
          shouldKeepListening = false;
          isAcceptingSpeech = false;
          updateVoiceInputButton();
          setVoiceStatus(
            IS_IOS
              ? "Safariの音声認識が一区切りで停止しました。「話す」を押すと続きから再開できます。"
              : "音声認識が停止しました。「話す」を押して再開してください。",
            "error"
          );
        }
      }, IS_IOS ? 350 : 150);
    } else if (!answerInputEl.disabled) {
      setVoiceStatus("音声認識を停止しました。", "ready");
    }
  });

  voiceInputBtn.disabled = false;
  setVoiceStatus(
    IS_IOS
      ? "「話す」を押すとSafariの音声認識が始まります。"
      : "「話す」を押すとマイクが始まります。",
    "ready"
  );
}

async function requestMicrophonePermission() {
  if (microphonePermissionGranted) return true;
  if (!navigator.mediaDevices?.getUserMedia) return true;

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  });
  stream.getTracks().forEach((track) => track.stop());
  microphonePermissionGranted = true;
  return true;
}

function beginNativeRecognition() {
  try {
    recognition.start();
  } catch (error) {
    shouldKeepListening = false;
    isAcceptingSpeech = false;
    updateVoiceInputButton();
    showMicrophoneStartError(error);
  }
}

function startRecognitionSession() {
  if (isCodexPreview()) {
    showMicrophoneEnvironmentMessage();
    return;
  }
  if (!recognition || shouldKeepListening || isListening) return;

  clearTimeout(questionSpeechTimer);
  window.speechSynthesis?.cancel();
  isAcceptingSpeech = true;
  shouldKeepListening = true;
  recognitionAlternatives = [];
  recognitionHadFatalError = false;
  updateVoiceInputButton();

  if (IS_IOS) {
    // iPhone Safariは、ユーザーのタップと同じ処理の中で
    // webkitSpeechRecognition.start()を呼ぶ必要があります。
    setVoiceStatus("Safariの音声認識を開始しています…", "ready");
    beginNativeRecognition();
    return;
  }

  setVoiceStatus("マイクの使用許可を確認しています…", "ready");
  requestMicrophonePermission()
    .then(() => beginNativeRecognition())
    .catch((error) => {
    shouldKeepListening = false;
    isAcceptingSpeech = false;
    updateVoiceInputButton();
    showMicrophoneStartError(error);
    });
}

function endRecognitionSession() {
  shouldKeepListening = false;
  isAcceptingSpeech = false;
  clearTimeout(recognitionRestartTimer);
  updateVoiceInputButton();
  if (recognition && isListening) {
    try {
      recognition.stop();
    } catch {
      // すでに停止している場合は何もしません。
    }
  }
}

function showMicrophoneStartError(error) {
  shouldKeepListening = false;
  isAcceptingSpeech = false;
  updateVoiceInputButton();

  if (error?.name === "NotAllowedError" || error?.name === "SecurityError") {
    setVoiceStatus(
      IS_IOS
        ? "Safariの音声認識またはマイクが許可されていません。SafariのWebサイト設定でマイクを「許可」にしてください。"
        : "マイクが許可されていません。端末の設定でこのサイトのマイクを許可してください。",
      "error"
    );
    return;
  }
  if (error?.name === "NotFoundError") {
    setVoiceStatus("使用できるマイクが見つかりません。端末の設定を確認してください。", "error");
    return;
  }
  setVoiceStatus("マイクを開始できませんでした。もう一度「話す」を押してください。", "error");
  voiceInputBtn.disabled = false;
}

loginFormEl.addEventListener("submit", (event) => {
  event.preventDefault();

  if (loginPasswordEl.value !== LOGIN_PASSWORD) {
    showLoginError("パスワードが正しくありません。");
    loginPasswordEl.select();
    return;
  }

  loginErrorEl.classList.add("hidden");
  loginPasswordEl.setAttribute("aria-invalid", "false");
  loginPasswordEl.value = "";
  unlockApp();
});

loginPasswordEl.addEventListener("input", () => {
  loginErrorEl.classList.add("hidden");
  loginPasswordEl.setAttribute("aria-invalid", "false");
});

profileFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const nextProfile = readProfile();
  if (!nextProfile) return;
  profile = nextProfile;
  startInterview();
});

editProfileBtn.addEventListener("click", editProfile);

scoreAnswerBtn.addEventListener("click", () => {
  renderScores(scoreCurrentAnswer(answerInputEl.value));
});

nextQuestionBtn.addEventListener("click", () => {
  currentIndex = currentIndex === questions.length - 1 ? 0 : currentIndex + 1;
  renderQuestion();
  unlockSpeechSynthesis();
});

repeatQuestionBtn.addEventListener("click", () => {
  speechSynthesisUnlocked = true;
  speakQuestion();
});

voiceInputBtn.addEventListener("click", () => {
  if (isCodexPreview()) {
    showMicrophoneEnvironmentMessage();
    return;
  }
  if (!recognition) return;

  if (isAcceptingSpeech) {
    endRecognitionSession();
    return;
  }

  startRecognitionSession();
});

createProfileFields();
questionTotalEl.textContent = String(questions.length);
setupSpeechRecognition();
window.addEventListener("pagehide", endRecognitionSession);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    clearTimeout(questionSpeechTimer);
    window.speechSynthesis?.cancel();
    endRecognitionSession();
  }
});
