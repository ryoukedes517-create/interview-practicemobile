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
    matchesAnswer: (answer, value) => containsProfileReading(answer, value, "name")
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
    matchesAnswer: (answer, value) => containsProfileValue(answer, value, "nationality")
  },
  {
    key: "schoolName",
    label: "日本語学校名",
    type: "text",
    placeholder: "例：さくら日本語学校",
    autocomplete: "organization",
    matchesAnswer: (answer, value) => containsProfileReading(answer, value, "schoolName")
  }
];

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
const feedbackLanguageEl = $("feedbackLanguage");
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
const retryQuestionBtn = $("retryQuestion");
const nextQuestionBtn = $("nextQuestion");
const scoreCardEl = $("scoreCard");
const totalScoreEl = $("totalScore");
const scoreListEl = $("scoreList");
const feedbackCommentEl = $("feedbackComment");
const improvementAdviceEl = $("improvementAdvice");
const debugPanelEl = $("debugPanel");
const debugOutputEl = $("debugOutput");
const voiceInputBtn = $("voiceInput");
const voiceButtonTextEl = $("voiceButtonText");
const repeatQuestionBtn = $("repeatQuestion");
const voiceStatusEl = $("voiceStatus");
const voiceStatusTextEl = $("voiceStatusText");

let profile = {};
let feedbackLanguage = "ja";
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
let profileMatchDebug = [];
// 開発時は URL の末尾に ?debugProfileMatch を付けると照合内容を表示できます。
const DEBUG_PROFILE_MATCHING = new URLSearchParams(window.location.search).has("debugProfileMatch");
const QUESTION_SPEECH_DELAY = 5000;
const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const IS_MOBILE = IS_IOS || /Android|Mobile/i.test(navigator.userAgent);
const USE_IOS_NATIVE_DICTATION = IS_IOS;

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

function toHiragana(text) {
  return String(text ?? "").replace(/[ァ-ヶ]/g, (character) => (
    String.fromCharCode(character.charCodeAt(0) - 0x60)
  ));
}

const SCHOOL_SPEECH_READINGS = [
  ["日本語教育", "にほんごきょういく"],
  ["日本語学校", "にほんごがっこう"],
  ["専門学校", "せんもんがっこう"],
  ["名古屋", "なごや"],
  ["横浜", "よこはま"],
  ["新宿", "しんじゅく"],
  ["東京", "とうきょう"],
  ["大阪", "おおさか"],
  ["京都", "きょうと"],
  ["神戸", "こうべ"],
  ["福岡", "ふくおか"],
  ["国際", "こくさい"],
  ["中央", "ちゅうおう"],
  ["未来", "みらい"],
  ["文化", "ぶんか"],
  ["外語", "がいご"],
  ["学院", "がくいん"],
  ["学園", "がくえん"],
  ["教育", "きょういく"],
  ["大学", "だいがく"],
  ["日本語", "にほんご"],
  ["学校", "がっこう"],
  ["櫻", "さくら"],
  ["桜", "さくら"]
];

const NATIONALITY_SPEECH_ALIASES = [
  ["ばんぐらでぃっしゅ", "ばんぐらでしゅ"],
  ["ばんぐらでっしゅ", "ばんぐらでしゅ"],
  ["べとなむこく", "べとなむ"],
  ["にほんこく", "にほん"]
];

const NAME_SPEECH_ALIASES = [["関", "せき"]];

function normalizeProfileSpeech(text, fieldKey, profileValue) {
  // 表記ゆれだけを吸収する、発音を変えない正規化です。
  // 似た文字を機械的に近づけず、意味が同じと確認できる語だけを置換します。
  let normalized = toHiragana(String(text ?? "").normalize("NFKC"));
  if (fieldKey === "schoolName") {
    SCHOOL_SPEECH_READINGS.forEach(([spelling, reading]) => {
      normalized = normalized.replaceAll(spelling, reading);
    });
  }
  if (fieldKey === "nationality") {
    NATIONALITY_SPEECH_ALIASES.forEach(([variant, canonical]) => {
      normalized = normalized.replaceAll(variant, canonical);
    });
  }
  if (fieldKey === "name") {
    NAME_SPEECH_ALIASES.forEach(([spelling, reading]) => {
      const expected = String(profileValue ?? "").trim();
      if (expected === spelling || expected === reading) normalized = normalized.replaceAll(spelling, reading);
    });
  }
  return normalized
    .toLowerCase()
    .replace(/[\p{Separator}\p{Punctuation}\p{Format}]/gu, "")
    .replace(/[ーっ]/g, "");
}

function hasProfileValue(text, value, fieldKey) {
  const spelling = normalizeForComparison(value);
  const spokenForm = normalizeProfileSpeech(value, fieldKey, value);
  const normalizedText = normalizeForComparison(text);
  const normalizedSpeech = normalizeProfileSpeech(text, fieldKey, value);

  const directMatch = spelling && normalizedText.includes(spelling);

  // かなだけの値に加え、学校名は辞書で読みへ変換できた場合に限り、
  // 漢字・ひらがな・カタカナを同じ発音として照合します。
  const isKanaOnly = /^[ぁ-ゖ]+$/u.test(spokenForm);
  const isComparableSchoolReading = fieldKey === "schoolName"
    && spokenForm.length > 0
    && !/[\p{Script=Han}]/u.test(spokenForm);
  const phoneticMatch = (isKanaOnly || isComparableSchoolReading)
    && spokenForm.length > 0
    && normalizedSpeech.includes(spokenForm);
  const matched = Boolean(directMatch || phoneticMatch);
  if (DEBUG_PROFILE_MATCHING) {
    profileMatchDebug.push({ field: fieldKey, expected: value, source: text, expectedNormalized: spokenForm, sourceNormalized: normalizedSpeech, matched });
  }
  return matched;
}

function containsProfileValue(answer, value, fieldKey) {
  return hasProfileValue(answer, value, fieldKey)
    || recognitionAlternatives.some((alternative) => hasProfileValue(alternative, value, fieldKey));
}

function containsProfileReading(answer, value, fieldKey) {
  return containsProfileValue(answer, value, fieldKey);
}

function containsAge(answer, value) {
  const normalizedAnswer = String(answer).normalize("NFKC");
  const escapedAge = String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^0-9])${escapedAge}\\s*(?:歳|才)(?=$|[^0-9])`).test(normalizedAnswer);
}

function getIntroductionItems() {
  return PROFILE_FIELDS.map((field) => ({
    key: field.key,
    label: field.label,
    matchesAnswer: (answer) => field.matchesAnswer(answer, profile[field.key])
  }));
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
  profileMatchDebug = [];
  if (current.type === "introduction") return scoreIntroduction(rawAnswer);

  // 第2問以降は元アプリの採点ロジックを変更していません。
  let scores = current.groups.map((keywords, index) => scoreEvidence(answer, keywords, index));
  if (current.salaryPenalty && /給料|給与|賃金/.test(answer)) {
    const hasAnotherReason = hasAny(answer, ["技術", "文化", "経験", "学", "成長", "環境", "仕事", "挑戦"]);
    if (!hasAnotherReason) scores = scores.map((score) => Math.min(score, 10));
  }
  return scores;
}

function renderProfileDebug() {
  if (!DEBUG_PROFILE_MATCHING || questions[currentIndex].type !== "introduction") {
    debugPanelEl.classList.add("hidden");
    return;
  }
  const alternatives = recognitionAlternatives.length ? recognitionAlternatives.join(" ／ ") : "なし";
  const rows = profileMatchDebug.map((entry) => (
    `[${entry.matched ? "一致" : "不一致"}] ${entry.field}\n`
    + `  期待: ${entry.expected}\n`
    + `  認識: ${entry.source}\n`
    + `  正規化（期待）: ${entry.expectedNormalized}\n`
    + `  正規化（認識）: ${entry.sourceNormalized}`
  ));
  debugOutputEl.textContent = `音声認識の代替候補: ${alternatives}\n\n${rows.join("\n\n")}`;
  debugPanelEl.classList.remove("hidden");
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
  debugPanelEl.classList.add("hidden");
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

// 各質問の各採点項目に、評価結果と次に直す一点を対応させます。
// 配列の各要素は [できたこと, 不足していること, 改善アドバイス] です。
const QUESTION_GUIDANCE = {
  ja: [
    null,
    [
      ["日本で働きたい理由を述べています。", "日本で働きたい理由が含まれていません。", "日本で働きたい理由を一つ述べてください。"],
      ["日本で挑戦・成長したい姿勢を示しています。", "日本で挑戦・成長したい姿勢が不足しています。", "日本で挑戦したいことか、成長したいことを一つ加えてください。"],
      ["働きたい理由を具体的に説明しています。", "働きたい理由の具体的な説明が不足しています。", "日本で働きたいと思ったきっかけか経験を一つ加えてください。"],
      ["日本で働く意欲を述べています。", "日本で働く意欲が不足しています。", "日本でどのように働きたいかを一つ述べてください。"]
    ],
    [
      ["当社を志望する理由を述べています。", "当社を志望する理由が含まれていません。", "当社を志望する理由を一つ述べてください。"],
      ["この会社を選んだ理由を述べています。", "この会社を選んだ理由が不足しています。", "会社の理念・商品・サービス・技術のうち、魅力を感じた点を一つ挙げてください。"],
      ["入社に向けた前向きな姿勢を示しています。", "入社に向けた前向きな姿勢が不足しています。", "この会社で挑戦したいことを一つ加えてください。"],
      ["入社後に働き、貢献する意欲を述べています。", "入社後の意欲が不足しています。", "入社後にどのように貢献したいかを一つ述べてください。"]
    ],
    [
      ["一番頑張った仕事や勉強の内容を述べています。", "何を一番頑張ったかが含まれていません。", "一番頑張った仕事・勉強を一つ挙げてください。"],
      ["期間・目標・担当などの具体的な情報を述べています。", "頑張ったことの具体的な情報が不足しています。", "期間・目標・担当のいずれかを一つ加えてください。"],
      ["努力や工夫の内容を述べています。", "どのように努力・工夫したかが不足しています。", "続けた練習や工夫を一つ述べてください。"],
      ["努力による成長や達成を述べています。", "努力した結果や成長が不足しています。", "努力してできるようになったことを一つ述べてください。"]
    ],
    [
      ["自分の強みを述べています。", "自分の強みが含まれていません。", "責任感・協力・継続力など、自分の強みを一つ述べてください。"],
      ["強みが表れた経験を具体的に述べています。", "強みを示す具体例が不足しています。", "学校・仕事・アルバイトで強みが表れた経験を一つ加えてください。"],
      ["強みを仕事でどう活かすか述べています。", "強みの仕事での活かし方が不足しています。", "その強みを仕事でどう活かすかを一つ述べてください。"],
      ["強みを活かして努力・貢献する姿勢を示しています。", "強みを活かす前向きな姿勢が不足しています。", "強みを活かして頑張りたいことを一つ加えてください。"]
    ],
    [
      ["自分の弱みを述べています。", "自分の弱みが含まれていません。", "自分の弱みを一つ述べてください。"],
      ["弱みが表れた場面を具体的に述べています。", "弱みを示す具体例が不足しています。", "その弱みが表れた場面を一つ加えてください。"],
      ["弱みを改善する方法を述べています。", "弱みの改善方法が不足しています。", "練習・準備・確認など、実行している改善方法を一つ述べてください。"],
      ["改善を続ける前向きな姿勢を示しています。", "改善を続ける姿勢が不足しています。", "改善のために続けていることを一つ加えてください。"]
    ],
    [
      ["日本語で働くことへの不安の有無を述べています。", "日本語への不安があるかどうかを答えていません。", "日本語で働くことへの不安があるか、ないかを最初に述べてください。"],
      ["不安がある・ない理由を述べています。", "不安についての理由が不足しています。", "不安がある理由、または不安がない理由を一つ述べてください。"],
      ["勉強・練習・確認などの対策や根拠を述べています。", "不安への対策や根拠が不足しています。", "日本語の不安を減らすために行っていることを一つ述べてください。"],
      ["日本語を学び続ける姿勢を示しています。", "日本語に対する前向きな姿勢が不足しています。", "日本語の勉強を今後どう続けるかを一つ加えてください。"]
    ],
    [
      ["ミスを確認し、直す対応を述べています。", "ミスをした直後の対応が不足しています。", "ミスを確認してすぐに直すことを述べてください。"],
      ["上司や先輩へ報告・相談することを述べています。", "ミスの報告・相談が不足しています。", "ミスを上司・先輩へ報告または相談することを加えてください。"],
      ["原因確認やチェックによる再発防止を述べています。", "ミスの再発防止策が不足しています。", "同じミスを防ぐための確認方法を一つ述べてください。"],
      ["ミスから学び改善する姿勢を示しています。", "ミスを改善につなげる姿勢が不足しています。", "ミスから学んで次に改善することを一つ加えてください。"]
    ],
    [
      ["チームで大切にしていることを述べています。", "チームで大切にしていることが含まれていません。", "協力・報告・相談・尊重など、大切にしていることを一つ述べてください。"],
      ["大切にする理由や具体例を述べています。", "理由や具体例が不足しています。", "それを大切にする理由か経験を一つ加えてください。"],
      ["周囲と協力する姿勢を示しています。", "チームで協力する姿勢が不足しています。", "周囲を助ける、または役割を果たす姿勢を一つ述べてください。"],
      ["話す・聞く・相談する意欲を示しています。", "コミュニケーションへの意欲が不足しています。", "チームでどのように声をかけ、話を聞くかを一つ述べてください。"]
    ],
    [
      ["将来なりたい人材や目標を述べています。", "将来の目標が含まれていません。", "将来どのような人材になりたいかを一つ述べてください。"],
      ["目標とする仕事・技術・役割を具体的に述べています。", "将来像の具体的な内容が不足しています。", "身につけたい技術や担いたい役割を一つ加えてください。"],
      ["目標に向けた勉強・資格・経験などの行動を述べています。", "将来の目標に向けた行動が不足しています。", "目標のために行う勉強・資格取得・経験のいずれかを一つ述べてください。"],
      ["学び続けて成長する意欲を示しています。", "成長を続ける意欲が不足しています。", "今後も身につけたいことを一つ加えてください。"]
    ]
  ],
  vi: [
    null,
    [["Bạn đã nêu lý do muốn làm việc tại Nhật.","Bạn chưa nêu lý do muốn làm việc tại Nhật.","Hãy nêu một lý do bạn muốn làm việc tại Nhật."],["Bạn đã thể hiện mong muốn thử thách hoặc phát triển tại Nhật.","Bạn chưa thể hiện rõ thái độ tích cực.","Hãy thêm một điều bạn muốn thử thách hoặc phát triển tại Nhật."],["Bạn đã giải thích lý do cụ thể.","Lý do chưa có chi tiết cụ thể.","Hãy thêm một trải nghiệm hoặc cơ duyên khiến bạn muốn làm việc tại Nhật."],["Bạn đã thể hiện mong muốn làm việc tại Nhật.","Ý muốn làm việc tại Nhật chưa rõ.","Hãy nêu một cách bạn muốn làm việc hoặc đóng góp tại Nhật."]],
    [["Bạn đã nêu lý do ứng tuyển vào công ty.","Bạn chưa nêu lý do ứng tuyển vào công ty.","Hãy nêu một lý do bạn ứng tuyển vào công ty."],["Bạn đã nêu lý do chọn công ty này.","Lý do chọn công ty này chưa rõ.","Hãy nêu một điểm hấp dẫn về triết lý, sản phẩm, dịch vụ hoặc công nghệ của công ty."],["Bạn đã thể hiện thái độ tích cực đối với việc gia nhập công ty.","Thái độ tích cực đối với việc gia nhập công ty chưa rõ.","Hãy thêm một điều bạn muốn thử thách tại công ty."],["Bạn đã nêu mong muốn làm việc và đóng góp sau khi vào công ty.","Mong muốn sau khi vào công ty chưa rõ.","Hãy nêu một cách bạn muốn đóng góp sau khi vào công ty."]],
    [["Bạn đã nêu việc mình cố gắng nhất.","Bạn chưa nêu rõ việc mình cố gắng nhất.","Hãy nêu một việc hoặc môn học mà bạn đã cố gắng nhất."],["Bạn đã nêu thông tin cụ thể như thời gian, mục tiêu hoặc nhiệm vụ.","Thông tin cụ thể về việc đã cố gắng còn thiếu.","Hãy thêm thời gian, mục tiêu hoặc nhiệm vụ cụ thể."],["Bạn đã nêu cách mình nỗ lực hoặc cải tiến.","Cách bạn nỗ lực hoặc cải tiến chưa rõ.","Hãy nêu một việc luyện tập hoặc cách làm bạn đã duy trì."],["Bạn đã nêu kết quả hoặc sự trưởng thành.","Kết quả hoặc sự trưởng thành chưa rõ.","Hãy nêu một điều bạn làm được nhờ sự nỗ lực đó."]],
    [["Bạn đã nêu điểm mạnh của mình.","Bạn chưa nêu điểm mạnh của mình.","Hãy nêu một điểm mạnh như trách nhiệm, hợp tác hoặc kiên trì."],["Bạn đã nêu trải nghiệm cụ thể thể hiện điểm mạnh.","Ví dụ cụ thể về điểm mạnh còn thiếu.","Hãy thêm một trải nghiệm ở trường, công việc hoặc việc làm thêm thể hiện điểm mạnh."],["Bạn đã nêu cách dùng điểm mạnh trong công việc.","Cách áp dụng điểm mạnh vào công việc còn thiếu.","Hãy nêu một cách bạn sẽ dùng điểm mạnh đó trong công việc."],["Bạn đã thể hiện ý muốn nỗ lực và đóng góp bằng điểm mạnh.","Thái độ tích cực trong việc phát huy điểm mạnh chưa rõ.","Hãy thêm một điều bạn muốn cố gắng bằng điểm mạnh đó."]],
    [["Bạn đã nêu điểm yếu của mình.","Bạn chưa nêu điểm yếu của mình.","Hãy nêu một điểm yếu của bản thân."],["Bạn đã nêu tình huống cụ thể khi điểm yếu xuất hiện.","Ví dụ cụ thể về điểm yếu còn thiếu.","Hãy thêm một tình huống mà điểm yếu đó đã xuất hiện."],["Bạn đã nêu cách cải thiện điểm yếu.","Cách cải thiện điểm yếu còn thiếu.","Hãy nêu một cách bạn đang thực hiện như luyện tập, chuẩn bị hoặc kiểm tra."],["Bạn đã thể hiện thái độ tiếp tục cải thiện.","Thái độ tiếp tục cải thiện chưa rõ.","Hãy thêm một việc bạn đang tiếp tục làm để cải thiện."]],
    [["Bạn đã nói rõ có hay không có lo lắng khi làm việc bằng tiếng Nhật.","Bạn chưa nói rõ mình có lo lắng về tiếng Nhật hay không.","Trước tiên, hãy nói rõ bạn có hay không có lo lắng khi làm việc bằng tiếng Nhật."],["Bạn đã nêu lý do có hoặc không có lo lắng.","Lý do về sự lo lắng còn thiếu.","Hãy nêu một lý do bạn có hoặc không có lo lắng."],["Bạn đã nêu biện pháp hoặc căn cứ như học, luyện tập hay xác nhận.","Biện pháp hoặc căn cứ để xử lý lo lắng còn thiếu.","Hãy nêu một việc bạn đang làm để giảm lo lắng về tiếng Nhật."],["Bạn đã thể hiện ý muốn tiếp tục học tiếng Nhật.","Thái độ tích cực đối với tiếng Nhật chưa rõ.","Hãy thêm một cách bạn sẽ tiếp tục học tiếng Nhật."]],
    [["Bạn đã nêu cách xác nhận và sửa lỗi.","Cách xử lý ngay sau khi mắc lỗi còn thiếu.","Hãy nói rằng bạn sẽ xác nhận và sửa lỗi ngay."],["Bạn đã nêu việc báo cáo hoặc trao đổi với cấp trên.","Việc báo cáo hoặc trao đổi về lỗi còn thiếu.","Hãy thêm việc báo cáo hoặc trao đổi lỗi với cấp trên hay người đi trước."],["Bạn đã nêu cách tìm nguyên nhân và ngăn lỗi lặp lại.","Biện pháp ngăn lỗi tái diễn còn thiếu.","Hãy nêu một cách kiểm tra để ngăn lỗi tương tự."],["Bạn đã thể hiện thái độ học hỏi và cải thiện từ lỗi.","Thái độ biến lỗi thành sự cải thiện chưa rõ.","Hãy thêm một điều bạn sẽ học và cải thiện sau lỗi đó."]],
    [["Bạn đã nêu điều mình coi trọng khi làm việc nhóm.","Bạn chưa nêu điều mình coi trọng khi làm việc nhóm.","Hãy nêu một điều như hợp tác, báo cáo, trao đổi hoặc tôn trọng."],["Bạn đã nêu lý do hoặc ví dụ cụ thể.","Lý do hoặc ví dụ cụ thể còn thiếu.","Hãy thêm một lý do hoặc trải nghiệm cho điều bạn coi trọng."],["Bạn đã thể hiện thái độ hợp tác với mọi người.","Thái độ hợp tác trong nhóm chưa rõ.","Hãy nêu một cách bạn giúp người khác hoặc hoàn thành vai trò của mình."],["Bạn đã thể hiện ý muốn nói, nghe và trao đổi.","Ý muốn giao tiếp trong nhóm chưa rõ.","Hãy nêu một cách bạn chủ động nói chuyện hoặc lắng nghe trong nhóm."]],
    [["Bạn đã nêu mục tiêu hoặc hình mẫu nhân sự trong tương lai.","Bạn chưa nêu mục tiêu tương lai.","Hãy nêu một kiểu nhân sự mà bạn muốn trở thành trong tương lai."],["Bạn đã nêu cụ thể công việc, kỹ năng hoặc vai trò mong muốn.","Hình ảnh tương lai chưa đủ cụ thể.","Hãy thêm một kỹ năng muốn có hoặc một vai trò muốn đảm nhiệm."],["Bạn đã nêu hành động như học tập, lấy chứng chỉ hoặc tích lũy kinh nghiệm.","Hành động để đạt mục tiêu tương lai còn thiếu.","Hãy nêu một việc sẽ làm: học tập, lấy chứng chỉ hoặc tích lũy kinh nghiệm."],["Bạn đã thể hiện mong muốn tiếp tục học hỏi và phát triển.","Mong muốn tiếp tục phát triển chưa rõ.","Hãy thêm một điều bạn muốn tiếp tục học trong tương lai."]]
  ],
  bn: [
    null,
    [["আপনি জাপানে কাজ করতে চাওয়ার কারণ বলেছেন।","জাপানে কাজ করতে চাওয়ার কারণটি নেই।","জাপানে কাজ করতে চাওয়ার একটি কারণ বলুন।"],["আপনি জাপানে চ্যালেঞ্জ নেওয়া বা উন্নতি করার ইচ্ছা দেখিয়েছেন।","চ্যালেঞ্জ নেওয়া বা উন্নতি করার ইতিবাচক মনোভাবটি যথেষ্ট নয়।","জাপানে যে একটি বিষয়ে চ্যালেঞ্জ নিতে বা উন্নতি করতে চান তা যোগ করুন।"],["আপনি কাজ করতে চাওয়ার কারণটি নির্দিষ্টভাবে ব্যাখ্যা করেছেন।","কারণটির নির্দিষ্ট ব্যাখ্যা নেই।","জাপানে কাজ করতে চাওয়ার একটি অভিজ্ঞতা বা প্রেরণা যোগ করুন।"],["আপনি জাপানে কাজ করার ইচ্ছা প্রকাশ করেছেন।","জাপানে কাজ করার ইচ্ছাটি যথেষ্ট স্পষ্ট নয়।","জাপানে কীভাবে কাজ বা অবদান রাখতে চান তা একটি বলুন।"]],
    [["আপনি এই কোম্পানিতে আবেদন করার কারণ বলেছেন।","এই কোম্পানিতে আবেদন করার কারণটি নেই।","এই কোম্পানিতে আবেদন করার একটি কারণ বলুন।"],["আপনি এই কোম্পানি বেছে নেওয়ার কারণ বলেছেন।","এই কোম্পানি বেছে নেওয়ার কারণটি যথেষ্ট নয়।","কোম্পানির নীতি, পণ্য, সেবা বা প্রযুক্তির একটি আকর্ষণীয় দিক বলুন।"],["আপনি কোম্পানিতে যোগ দেওয়ার ইতিবাচক মনোভাব দেখিয়েছেন।","কোম্পানিতে যোগ দেওয়ার ইতিবাচক মনোভাবটি যথেষ্ট নয়।","এই কোম্পানিতে যে একটি বিষয়ে চ্যালেঞ্জ নিতে চান তা যোগ করুন।"],["আপনি যোগ দেওয়ার পর কাজ ও অবদান রাখার ইচ্ছা বলেছেন।","যোগ দেওয়ার পরের ইচ্ছাটি যথেষ্ট নয়।","যোগ দেওয়ার পর কীভাবে অবদান রাখতে চান তা একটি বলুন।"]],
    [["আপনি সবচেয়ে বেশি চেষ্টা করা কাজ বা পড়াশোনার কথা বলেছেন।","কোন কাজে সবচেয়ে বেশি চেষ্টা করেছেন তা নেই।","সবচেয়ে বেশি চেষ্টা করা একটি কাজ বা পড়াশোনার বিষয় বলুন।"],["আপনি সময়কাল, লক্ষ্য বা দায়িত্বের মতো নির্দিষ্ট তথ্য বলেছেন।","চেষ্টার নির্দিষ্ট তথ্য যথেষ্ট নয়।","সময়কাল, লক্ষ্য বা দায়িত্বের একটি নির্দিষ্ট তথ্য যোগ করুন।"],["আপনি প্রচেষ্টা বা কৌশলের কথা বলেছেন।","কীভাবে চেষ্টা বা কৌশল করেছেন তা যথেষ্ট নয়।","নিয়মিত করা একটি অনুশীলন বা কৌশল বলুন।"],["আপনি প্রচেষ্টার ফল বা উন্নতির কথা বলেছেন।","প্রচেষ্টার ফল বা উন্নতি যথেষ্ট নয়।","এই প্রচেষ্টায় যে একটি কাজ করতে পেরেছেন তা বলুন।"]],
    [["আপনি নিজের শক্তির দিক বলেছেন।","নিজের শক্তির দিকটি নেই।","দায়িত্ববোধ, সহযোগিতা বা অধ্যবসায়ের মতো একটি শক্তির দিক বলুন।"],["আপনি শক্তির দিকটি দেখানো একটি নির্দিষ্ট অভিজ্ঞতা বলেছেন।","শক্তির দিকের নির্দিষ্ট উদাহরণ নেই।","স্কুল, কাজ বা খণ্ডকালীন চাকরির এমন একটি অভিজ্ঞতা যোগ করলে শক্তির দিকটি আরও পরিষ্কার হবে।"],["আপনি কাজে শক্তির দিকটি কীভাবে ব্যবহার করবেন তা বলেছেন।","কাজে শক্তির দিকটি ব্যবহারের উপায় নেই।","কাজে এই শক্তির দিকটি কীভাবে ব্যবহার করবেন তা একটি বলুন।"],["আপনি শক্তির দিক ব্যবহার করে চেষ্টা ও অবদান রাখার ইচ্ছা দেখিয়েছেন।","শক্তির দিক ব্যবহারের ইতিবাচক মনোভাবটি যথেষ্ট নয়।","এই শক্তির দিক দিয়ে যে একটি বিষয়ে চেষ্টা করতে চান তা যোগ করুন।"]],
    [["আপনি নিজের দুর্বলতা বলেছেন।","নিজের দুর্বলতাটি নেই।","নিজের একটি দুর্বলতা বলুন।"],["আপনি দুর্বলতা দেখা দেওয়ার একটি নির্দিষ্ট পরিস্থিতি বলেছেন।","দুর্বলতার নির্দিষ্ট উদাহরণ নেই।","যে একটি পরিস্থিতিতে দুর্বলতাটি দেখা দিয়েছিল তা যোগ করুন।"],["আপনি দুর্বলতা উন্নত করার উপায় বলেছেন।","দুর্বলতা উন্নত করার উপায়টি নেই।","অনুশীলন, প্রস্তুতি বা যাচাইয়ের মতো বর্তমানে করা একটি উপায় বলুন।"],["আপনি উন্নতি চালিয়ে যাওয়ার মনোভাব দেখিয়েছেন।","উন্নতি চালিয়ে যাওয়ার মনোভাবটি যথেষ্ট নয়।","উন্নতির জন্য নিয়মিত করা একটি কাজ যোগ করুন।"]],
    [["আপনি জাপানি ভাষায় কাজ নিয়ে উদ্বেগ আছে কি না বলেছেন।","জাপানি ভাষা নিয়ে উদ্বেগ আছে কি না বলেননি।","প্রথমে বলুন জাপানি ভাষায় কাজ করা নিয়ে আপনার উদ্বেগ আছে কি না।"],["আপনি উদ্বেগ থাকা বা না থাকার কারণ বলেছেন।","উদ্বেগের কারণটি যথেষ্ট নয়।","উদ্বেগ থাকা বা না থাকার একটি কারণ বলুন।"],["আপনি পড়াশোনা, অনুশীলন বা যাচাইয়ের মতো ব্যবস্থা বলেছেন।","উদ্বেগ মোকাবিলার ব্যবস্থা বা ভিত্তি যথেষ্ট নয়।","জাপানি ভাষার উদ্বেগ কমাতে বর্তমানে করা একটি কাজ বলুন।"],["আপনি জাপানি ভাষা শেখা চালিয়ে যাওয়ার ইচ্ছা দেখিয়েছেন।","জাপানি ভাষার প্রতি ইতিবাচক মনোভাবটি যথেষ্ট নয়।","জাপানি ভাষা শেখা কীভাবে চালিয়ে যাবেন তা একটি যোগ করুন।"]],
    [["আপনি ভুল যাচাই ও সংশোধনের পদক্ষেপ বলেছেন।","ভুল করার পরপরই কী করবেন তা যথেষ্ট নয়।","ভুলটি যাচাই করে সঙ্গে সঙ্গে সংশোধন করবেন—এটি বলুন।"],["আপনি ঊর্ধ্বতন বা অভিজ্ঞ সহকর্মীকে রিপোর্ট বা পরামর্শ করার কথা বলেছেন।","ভুল রিপোর্ট বা পরামর্শ করার বিষয়টি নেই।","ভুলটি ঊর্ধ্বতন বা অভিজ্ঞ সহকর্মীকে রিপোর্ট বা পরামর্শ করার কথা যোগ করুন।"],["আপনি কারণ খোঁজা ও একই ভুল রোধের উপায় বলেছেন।","একই ভুল পুনরায় রোধের ব্যবস্থা নেই।","একই ভুল ঠেকাতে একটি যাচাই পদ্ধতি বলুন।"],["আপনি ভুল থেকে শেখা ও উন্নতির মনোভাব দেখিয়েছেন।","ভুলকে উন্নতিতে রূপ দেওয়ার মনোভাবটি যথেষ্ট নয়।","ভুল থেকে শিখে পরেরবার যে একটি বিষয় উন্নত করবেন তা যোগ করুন।"]],
    [["আপনি দলে কাজ করার সময় গুরুত্বপূর্ণ একটি বিষয় বলেছেন।","দলে কাজ করার সময় গুরুত্বপূর্ণ বিষয়টি নেই।","সহযোগিতা, রিপোর্ট, পরামর্শ বা সম্মানের মতো একটি গুরুত্বপূর্ণ বিষয় বলুন।"],["আপনি কারণ বা নির্দিষ্ট উদাহরণ বলেছেন।","কারণ বা নির্দিষ্ট উদাহরণটি নেই।","গুরুত্বপূর্ণ মনে করার একটি কারণ বা অভিজ্ঞতা যোগ করুন।"],["আপনি অন্যদের সঙ্গে সহযোগিতার মনোভাব দেখিয়েছেন।","দলে সহযোগিতার মনোভাবটি যথেষ্ট নয়।","অন্যকে সাহায্য করা বা নিজের ভূমিকা পালন করার একটি উপায় বলুন।"],["আপনি কথা বলা, শোনা ও পরামর্শ করার ইচ্ছা দেখিয়েছেন।","দলে যোগাযোগের ইচ্ছাটি যথেষ্ট নয়।","দলে কীভাবে কথা বলবেন বা শুনবেন তার একটি উপায় বলুন।"]],
    [["আপনি ভবিষ্যতের লক্ষ্য বা যে ধরনের কর্মী হতে চান তা বলেছেন।","ভবিষ্যতের লক্ষ্যটি নেই।","ভবিষ্যতে যে ধরনের কর্মী হতে চান তা একটি বলুন।"],["আপনি কাঙ্ক্ষিত কাজ, দক্ষতা বা ভূমিকা নির্দিষ্টভাবে বলেছেন।","ভবিষ্যৎ পরিকল্পনার নির্দিষ্ট তথ্য যথেষ্ট নয়।","যে একটি দক্ষতা অর্জন বা ভূমিকা পালন করতে চান তা যোগ করুন।"],["আপনি পড়াশোনা, যোগ্যতা বা অভিজ্ঞতার মতো পদক্ষেপ বলেছেন।","ভবিষ্যৎ লক্ষ্য অর্জনের পদক্ষেপটি নেই।","পড়াশোনা, যোগ্যতা অর্জন বা অভিজ্ঞতা নেওয়ার একটি পদক্ষেপ বলুন।"],["আপনি শেখা ও উন্নতি চালিয়ে যাওয়ার ইচ্ছা দেখিয়েছেন।","উন্নতি চালিয়ে যাওয়ার ইচ্ছাটি যথেষ্ট নয়।","ভবিষ্যতে শেখা চালিয়ে যেতে চান এমন একটি বিষয় যোগ করুন।"]]
  ]
};

const GUIDANCE_LABELS = {
  ja: { achieved: "できた", missing: "不足", complete: "素晴らしいです。この調子で自信を持って面接に臨みましょう！" },
  vi: { achieved: "Đã làm được", missing: "Còn thiếu", complete: "Tuyệt vời! Cứ giữ phong độ này và tự tin bước vào buổi phỏng vấn nhé!" },
  bn: { achieved: "যা হয়েছে", missing: "যা কম আছে", complete: "দারুণ হয়েছে! এই ধারাবাহিকতা ও আত্মবিশ্বাস আপনাকে সাক্ষাৎকারে আরও ভালো করতে সাহায্য করবে।" }
};

function getIntroductionGuidance(language) {
  const values = PROFILE_FIELDS.map((field) => profile[field.key]);
  const messages = {
    ja: [
      [`名前「${values[0]}」を述べています。`, `名前「${values[0]}」が含まれていません。`, `名前「${values[0]}」を回答に入れてください。`],
      [`年齢「${values[1]}歳」を述べています。`, `年齢「${values[1]}歳」が含まれていません。`, `年齢「${values[1]}歳」を回答に入れてください。`],
      [`国籍「${values[2]}」を述べています。`, `国籍「${values[2]}」が含まれていません。`, `国籍「${values[2]}」を回答に入れてください。`],
      [`日本語学校名「${values[3]}」を述べています。`, `日本語学校名「${values[3]}」が含まれていません。`, `日本語学校名「${values[3]}」を回答に入れてください。`]
    ],
    vi: [
      [`Bạn đã nói tên “${values[0]}”.`, `Bạn chưa nói tên “${values[0]}”.`, `Hãy thêm tên “${values[0]}” vào câu trả lời.`],
      [`Bạn đã nói tuổi “${values[1]}”.`, `Bạn chưa nói tuổi “${values[1]}”.`, `Hãy thêm tuổi “${values[1]}” vào câu trả lời.`],
      [`Bạn đã nói quốc tịch “${values[2]}”.`, `Bạn chưa nói quốc tịch “${values[2]}”.`, `Hãy thêm quốc tịch “${values[2]}” vào câu trả lời.`],
      [`Bạn đã nói tên trường Nhật ngữ “${values[3]}”.`, `Bạn chưa nói tên trường Nhật ngữ “${values[3]}”.`, `Hãy thêm tên trường “${values[3]}” vào câu trả lời.`]
    ],
    bn: [
      [`আপনি নাম “${values[0]}” বলেছেন।`, `নাম “${values[0]}” বলা হয়নি।`, `উত্তরে নাম “${values[0]}” যোগ করুন।`],
      [`আপনি বয়স “${values[1]}” বলেছেন।`, `বয়স “${values[1]}” বলা হয়নি।`, `উত্তরে বয়স “${values[1]}” যোগ করুন।`],
      [`আপনি জাতীয়তা “${values[2]}” বলেছেন।`, `জাতীয়তা “${values[2]}” বলা হয়নি।`, `উত্তরে জাতীয়তা “${values[2]}” যোগ করুন।`],
      [`আপনি জাপানি ভাষা স্কুলের নাম “${values[3]}” বলেছেন।`, `স্কুলের নাম “${values[3]}” বলা হয়নি।`, `উত্তরে স্কুলের নাম “${values[3]}” যোগ করুন।`]
    ]
  };
  return messages[language] || messages.ja;
}

function makeFriendlyAdvice(message, language) {
  if (language === "ja") {
    return message
      .replace(/を回答に入れてください。$/, "が回答にあると、さらに良いですね。")
      .replace(/を最初に述べてください。$/, "を最初に述べると、もっと分かりやすくなりますよ。")
      .replace(/を一つ加えてください。$/, "を一つ加えると、さらに良いですね。")
      .replace(/を一つ述べてください。$/, "を一つ述べると、もっと良くなりますよ。")
      .replace(/を一つ挙げてください。$/, "を一つ挙げると、もっと良くなりますよ。")
      .replace(/ことを加えてください。$/, "ことも加えると、さらに良いですね。")
      .replace(/ことを述べてください。$/, "ことも述べると、もっと良くなりますよ。")
      .replace(/を加えてください。$/, "を加えると、さらに良いですね。")
      .replace(/を述べてください。$/, "を述べると、もっと良くなりますよ。")
      .replace(/してください。$/, "すると、もっと良くなりますよ。");
  }

  if (language === "vi") {
    const suggestion = message
      .replace(/^Hãy /, "")
      .replace(/^Trước tiên, hãy /, "trước tiên, ")
      .replace(/\.$/, "");
    return `Lần sau, bạn thử ${suggestion.charAt(0).toLowerCase()}${suggestion.slice(1)}; câu trả lời sẽ tốt hơn nhé.`;
  }

  return message
    .replace(/বলুন।$/, "বললে উত্তরটি আরও ভালো হবে।")
    .replace(/যোগ করুন।$/, "যোগ করলে উত্তরটি আরও ভালো হবে।")
    .replace(
      /^প্রথমে বলুন জাপানি ভাষায় কাজ করা নিয়ে আপনার উদ্বেগ আছে কি না।$/,
      "জাপানি ভাষায় কাজ করা নিয়ে উদ্বেগ আছে কি না প্রথমে জানালে উত্তরটি আরও পরিষ্কার হবে।"
    );
}

function renderScoreGuidance(scores, maximum) {
  const language = QUESTION_GUIDANCE[feedbackLanguage] ? feedbackLanguage : "ja";
  const labels = GUIDANCE_LABELS[language];
  const guidance = currentIndex === 0
    ? getIntroductionGuidance(language)
    : QUESTION_GUIDANCE[language][currentIndex];
  const achievedThreshold = maximum * 0.8;

  feedbackCommentEl.replaceChildren();
  scores.forEach((score, index) => {
    const achieved = score >= achievedThreshold;
    const item = document.createElement("li");
    item.className = achieved ? "achieved" : "missing";
    item.textContent = `${achieved ? labels.achieved : labels.missing}：${guidance[index][achieved ? 0 : 1]}`;
    feedbackCommentEl.appendChild(item);
  });

  const lowestScore = Math.min(...scores);
  if (scores.every((score) => score >= maximum)) {
    improvementAdviceEl.textContent = labels.complete;
    return;
  }
  const priorityIndex = scores.indexOf(lowestScore);
  improvementAdviceEl.textContent = makeFriendlyAdvice(guidance[priorityIndex][2], language);
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
  const totalScore = Math.round(scores.reduce((sum, score) => sum + score, 0));
  totalScoreEl.textContent = String(totalScore);
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

  renderScoreGuidance(scores, maximum);

  scoreCardEl.classList.remove("hidden");
  renderProfileDebug();
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
  if (USE_IOS_NATIVE_DICTATION) {
    voiceInputBtn.classList.remove("is-listening");
    voiceInputBtn.setAttribute("aria-pressed", "false");
    voiceButtonTextEl.textContent = "音声入力を開く";
    return;
  }

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

  // iPhone SafariのWeb Speech APIは、端末や設定によって
  // service-not-allowedになり得るため、Apple標準のキーボード音声入力を使います。
  if (USE_IOS_NATIVE_DICTATION) {
    recognition = null;
    voiceInputBtn.disabled = false;
    answerInputEl.placeholder = "「音声入力を開く」を押し、キーボード右下のマイクから回答してください。";
    updateVoiceInputButton();
    setVoiceStatus(
      "「音声入力を開く」を押し、キーボード右下のマイクを押してください。",
      "ready"
    );
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

function openIOSNativeDictation() {
  clearTimeout(questionSpeechTimer);
  window.speechSynthesis?.cancel();
  endRecognitionSession();

  if (answerInputEl.disabled) return;

  answerInputEl.focus();
  const end = answerInputEl.value.length;
  try {
    answerInputEl.setSelectionRange(end, end);
  } catch {
    // 選択範囲を変更できない端末ではフォーカスだけを使用します。
  }
  answerInputEl.scrollIntoView({ behavior: "smooth", block: "center" });
  setVoiceStatus(
    "キーボード右下のマイクを押して話してください。終わったら「完了」を押します。",
    "ready"
  );
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
  feedbackLanguage = feedbackLanguageEl.value;
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
  const rawAnswer = answerInputEl.value;
  renderScores(scoreCurrentAnswer(rawAnswer));
});

retryQuestionBtn.addEventListener("click", () => {
  renderQuestion();
  unlockSpeechSynthesis();
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
  if (USE_IOS_NATIVE_DICTATION) {
    openIOSNativeDictation();
    return;
  }
  if (!recognition) return;

  if (isAcceptingSpeech) {
    endRecognitionSession();
    return;
  }

  startRecognitionSession();
});

answerInputEl.addEventListener("input", () => {
  if (USE_IOS_NATIVE_DICTATION && answerInputEl.value.trim()) {
    setVoiceStatus("音声入力の内容を確認し、よければ「採点する」を押してください。", "ready");
  }
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
