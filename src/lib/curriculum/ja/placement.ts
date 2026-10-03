import type { PlacementItem } from '../types';

/**
 * 30 items, 5 per CEFR level, ordered from easiest to hardest.
 * A1 ≈ JLPT N5 (kana only), A2 ≈ N4 (N5 kanji only), B1 ≈ N3, B2 ≈ N2, C1 ≈ N1, C2 = beyond N1.
 */
export const placementItems: PlacementItem[] = [
  // ───────── A1 (N5) ─────────
  {
    id: 'p-ja-a1-1',
    cefr: 'A1',
    instruction: 'Choose the correct translation',
    question: 'おなまえはなんですか。',
    options: ['How old are you?', 'What is your name?', 'Where are you from?', 'What is this?'],
    answerIndex: 1,
  },
  {
    id: 'p-ja-a1-2',
    cefr: 'A1',
    instruction: 'Choose the correct particle to complete the sentence',
    question: 'わたし___がくせいです。',
    options: ['を', 'で', 'は', 'に'],
    answerIndex: 2,
  },
  {
    id: 'p-ja-a1-3',
    cefr: 'A1',
    instruction: 'Choose the correct form to complete the sentence',
    question: 'きのう、ともだちとえいがを___。',
    options: ['みます', 'みません', 'みましょう', 'みました'],
    answerIndex: 3,
  },
  {
    id: 'p-ja-a1-4',
    cefr: 'A1',
    instruction: 'Choose the correct word to complete the sentence',
    question: 'へやにねこが___。',
    options: ['います', 'あります', 'です', 'たべます'],
    answerIndex: 0,
  },
  {
    id: 'p-ja-a1-5',
    cefr: 'A1',
    instruction: 'Read and answer the question',
    question:
      'ケンさんは、まいあさしちじにおきます。あさごはんはたべません。でんしゃでがっこうへいきます。\n\nHow does Ken go to school?',
    options: ['By bus', 'By train', 'On foot', 'By bike'],
    answerIndex: 1,
  },

  // ───────── A2 (N4) ─────────
  {
    id: 'p-ja-a2-1',
    cefr: 'A2',
    instruction: 'Choose the best meaning',
    question: '日本へ行ったことがあります。',
    options: [
      'I want to go to Japan someday.',
      'I have never been to Japan.',
      'I have been to Japan.',
      'I am going to Japan next week.',
    ],
    answerIndex: 2,
  },
  {
    id: 'p-ja-a2-2',
    cefr: 'A2',
    instruction: 'Choose the correct reading',
    question: '私は一人で日本へ来ました。\n\nHow is 一人 read in this sentence?',
    options: ['ひとり', 'いちじん', 'ふたり', 'ひとにん'],
    answerIndex: 0,
  },
  {
    id: 'p-ja-a2-3',
    cefr: 'A2',
    instruction: 'Choose the correct word to complete the sentence',
    question: 'たんじょうびに、友だちが私に本を___。',
    options: ['あげました', 'もらいました', 'やりました', 'くれました'],
    answerIndex: 3,
  },
  {
    id: 'p-ja-a2-4',
    cefr: 'A2',
    instruction: 'Choose the correct form to complete the sentence',
    question: 'あしたはテストがあるので、今日はべんきょう___なりません。',
    options: ['しないで', 'しなければ', 'しなくても', 'したら'],
    answerIndex: 1,
  },
  {
    id: 'p-ja-a2-5',
    cefr: 'A2',
    instruction: 'Read and answer the question',
    question:
      '土曜日は友だちと山に行くつもりでしたが、雨だったので、うちでえいがを見ました。\n\nWhat did the writer do on Saturday?',
    options: [
      'Went to the mountains with a friend',
      'Went to the cinema',
      'Watched a movie at home',
      "Studied at a friend's house",
    ],
    answerIndex: 2,
  },

  // ───────── B1 (N3) ─────────
  {
    id: 'p-ja-b1-1',
    cefr: 'B1',
    instruction: 'Choose the correct reading',
    question: '昨日、面白い番組を見ました。\n\nHow is 番組 read?',
    options: ['ばんくみ', 'ばんごう', 'ばんそ', 'ばんぐみ'],
    answerIndex: 3,
  },
  {
    id: 'p-ja-b1-2',
    cefr: 'B1',
    instruction: 'Choose the correct form to complete the sentence',
    question: '電車の中で、だれかに財布を___。\n(Someone stole my wallet on the train.)',
    options: ['盗みました', '盗まれました', '盗ませました', '盗んでもらいました'],
    answerIndex: 1,
  },
  {
    id: 'p-ja-b1-3',
    cefr: 'B1',
    instruction: 'Choose the correct expression to complete the sentence',
    question: '来月から大阪で働く___なりました。',
    options: ['ことに', 'ために', 'わけに', 'はずに'],
    answerIndex: 0,
  },
  {
    id: 'p-ja-b1-4',
    cefr: 'B1',
    instruction: 'Choose the correct honorific (keigo) form',
    question: '先生も明日のパーティーに___か。',
    options: ['まいります', 'うかがいます', 'いらっしゃいます', 'おります'],
    answerIndex: 2,
  },
  {
    id: 'p-ja-b1-5',
    cefr: 'B1',
    instruction: 'Read and answer the question',
    question:
      '山田さんは毎日ジムに通っているのに、なかなかやせないそうです。最近は、食事にも気をつけるようにしているそうです。\n\nWhat is true about Yamada-san?',
    options: [
      'He has stopped going to the gym.',
      'He has lost a lot of weight recently.',
      "He doesn't care about what he eats.",
      "He goes to the gym every day but isn't losing weight.",
    ],
    answerIndex: 3,
  },

  // ───────── B2 (N2) ─────────
  {
    id: 'p-ja-b2-1',
    cefr: 'B2',
    instruction: 'Choose the correct expression to complete the sentence',
    question: '彼は約束を破るような人ではない。何か事情があった___。',
    options: ['に違いない', 'わけがない', 'どころではない', 'おそれがある'],
    answerIndex: 0,
  },
  {
    id: 'p-ja-b2-2',
    cefr: 'B2',
    instruction: 'Choose the most appropriate sentence to write to a client',
    question: '(I will send you the documents tomorrow.)',
    options: [
      '明日、資料を送ってあげます。',
      '明日、資料をお送りになります。',
      '明日、資料をお送りいたします。',
      '明日、資料を送ってくださいます。',
    ],
    answerIndex: 2,
  },
  {
    id: 'p-ja-b2-3',
    cefr: 'B2',
    instruction: 'Choose the best meaning',
    question: 'こんな大事な仕事を、今さら断るわけにはいかない。',
    options: [
      "I'll probably end up turning down such an important job.",
      "I can't very well turn down such an important job at this point.",
      'I have no choice but to turn down such an important job.',
      'I wish I had turned down such an important job.',
    ],
    answerIndex: 1,
  },
  {
    id: 'p-ja-b2-4',
    cefr: 'B2',
    instruction: 'Choose the correct reading',
    question: 'この店は雰囲気がいい。\n\nHow is 雰囲気 read?',
    options: ['ふいんき', 'ぶんいき', 'ふんいけ', 'ふんいき'],
    answerIndex: 3,
  },
  {
    id: 'p-ja-b2-5',
    cefr: 'B2',
    instruction: 'Read and answer the question',
    question:
      '当社では来月より在宅勤務制度を本格的に導入する。ただし、顧客対応を担当する部署については、業務の性質上、当面は従来どおり出社を原則とする。\n\nWhat will happen to customer-facing departments?',
    options: [
      'For now, they will still come to the office as a rule.',
      'They will be the first to start working from home.',
      'They will be closed down next month.',
      'They can choose freely between home and the office.',
    ],
    answerIndex: 0,
  },

  // ───────── C1 (N1) ─────────
  {
    id: 'p-ja-c1-1',
    cefr: 'C1',
    instruction: 'Choose the correct expression to complete the sentence',
    question: 'このような栄誉ある賞をいただき、感謝の念___。',
    options: ['に足りません', 'をおいてありません', 'に堪えません', 'に至りません'],
    answerIndex: 2,
  },
  {
    id: 'p-ja-c1-2',
    cefr: 'C1',
    instruction: 'Choose the correct expression to complete the sentence',
    question: '社長___、この難局を乗り切れる人はいない。',
    options: ['をもって', 'をおいて', 'ならでは', 'とあって'],
    answerIndex: 1,
  },
  {
    id: 'p-ja-c1-3',
    cefr: 'C1',
    instruction: 'Choose the best meaning',
    question: '彼の態度は、反省しているとは言い難い。',
    options: [
      'His attitude clearly shows that he is sorry.',
      'It is hard for him to say that he is sorry.',
      'He said he was sorry, but only with difficulty.',
      'One can hardly say his attitude shows any remorse.',
    ],
    answerIndex: 3,
  },
  {
    id: 'p-ja-c1-4',
    cefr: 'C1',
    instruction: 'Choose the correct reading',
    question: '彼は自分の非を潔く認めた。\n\nHow is 潔く read?',
    options: ['いさぎよく', 'いさましく', 'きよく', 'こころよく'],
    answerIndex: 0,
  },
  {
    id: 'p-ja-c1-5',
    cefr: 'C1',
    instruction: 'Read and answer the question',
    question:
      '新制度の導入に際しては事前に十分な説明がなされたものの、現場の負担増を懸念する声は根強く、市は運用開始を半年延期する方針を固めた。\n\nWhat did the city decide?',
    options: [
      'To cancel the new system altogether',
      'To start on schedule after giving more explanations',
      'To postpone the start of the system by six months',
      'To reduce the workload of front-line staff first',
    ],
    answerIndex: 2,
  },

  // ───────── C2 (beyond N1) ─────────
  {
    id: 'p-ja-c2-1',
    cefr: 'C2',
    instruction: 'Choose the closest meaning',
    question: 'あの人の儲け話は眉唾ものだ。',
    options: [
      'His money-making pitch is very persuasive.',
      'His money-making pitch is too complicated.',
      'His money-making pitch is already well known.',
      'His money-making pitch is dubious and not to be trusted.',
    ],
    answerIndex: 3,
  },
  {
    id: 'p-ja-c2-2',
    cefr: 'C2',
    instruction: 'Choose the four-character idiom that best completes the sentence',
    question: '健康のために始めたジョギングで膝を痛めるとは、___もいいところだ。',
    options: ['本末転倒', '一期一会', '臨機応変', '起死回生'],
    answerIndex: 0,
  },
  {
    id: 'p-ja-c2-3',
    cefr: 'C2',
    instruction: 'Choose the closest meaning',
    question: '援助を頼みに行ったが、けんもほろろに断られた。',
    options: [
      'I went to ask for help and was turned down politely but firmly.',
      'I went to ask for help and was turned down flatly, without any sympathy.',
      'I went to ask for help and was turned down after a long wait.',
      'I went to ask for help and was very nearly given it.',
    ],
    answerIndex: 1,
  },
  {
    id: 'p-ja-c2-4',
    cefr: 'C2',
    instruction: 'Choose the best meaning of this line from classical literature (Hōjōki, 1212)',
    question: 'ゆく河の流れは絶えずして、しかももとの水にあらず。',
    options: [
      'The river has stopped flowing, and its water is gone.',
      'Going to the river, I found that its water had changed color.',
      'The river flows on without ceasing, yet its water is never the same.',
      'The river flows endlessly, so its water always returns to its source.',
    ],
    answerIndex: 2,
  },
  {
    id: 'p-ja-c2-5',
    cefr: 'C2',
    instruction: 'Read and answer the question',
    question:
      '利便性の追求が際限なく続く昨今、待つという営みはもはや無駄の代名詞と化した感がある。だが、待つことを忘れた私たちが、果たしてその分豊かになったと言い切れるだろうか。\n\nWhat is the writer suggesting?',
    options: [
      'Convenience has clearly made our lives richer.',
      'Waiting is a waste of time that we should eliminate.',
      'People today have become more patient than before.',
      'It is doubtful that losing the habit of waiting has made us any richer.',
    ],
    answerIndex: 3,
  },
];
