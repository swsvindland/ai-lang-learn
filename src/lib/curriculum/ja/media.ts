import type { MediaItem } from '../types';

/**
 * Real Japanese-language media for out-of-app homework, roughly ordered A1 → C2.
 * Availability on streaming platforms varies by country and changes over time.
 */
export const mediaCatalog: MediaItem[] = [
  // ───────── Beginner input, learner resources & apps ─────────
  {
    id: 'm-ja-comprehensible-japanese',
    title: 'Comprehensible Japanese',
    type: 'youtube',
    minLevel: 'A1',
    maxLevel: 'B1',
    region: 'Standard (Tokyo)',
    description:
      'Comprehensible-input videos taught entirely in Japanese with drawings, gestures, and pictures, sorted into levels from Complete Beginner to Intermediate.',
    howToUse:
      "Start with the Complete Beginner playlist and watch without English; don't pause to translate. Aim for 20–30 minutes a day and rewatch any video where you understood less than half.",
    whereToFind: 'YouTube, cijapanese.com',
  },
  {
    id: 'm-ja-nhk-easy-japanese',
    title: 'NHK WORLD-JAPAN: Easy Japanese',
    type: 'app',
    minLevel: 'A1',
    maxLevel: 'A2',
    region: 'Standard (Tokyo)',
    description:
      'Free beginner course from NHK WORLD-JAPAN built around short audio and video skits about a newcomer starting life in Japan, with explanations available in many languages.',
    howToUse:
      'Do one lesson per session: listen to the skit twice before reading the script, then shadow the key phrase of the lesson out loud five times until you can say it without looking.',
    whereToFind: 'NHK WORLD-JAPAN website (Learn Japanese section)',
  },
  {
    id: 'm-ja-irodori',
    title: 'Irodori: Japanese for Life in Japan (いろどり 生活の日本語)',
    type: 'book',
    minLevel: 'A1',
    maxLevel: 'A2',
    region: 'Standard (Tokyo)',
    description:
      'Free coursebooks from the Japan Foundation for adults living or working in Japan, full of audio dialogues about shopping, work, health, and getting around.',
    howToUse:
      "Pick a topic close to this week's unit, listen to its dialogues without the script, then read along and act out one dialogue aloud, swapping in your own name and details.",
    whereToFind: 'Free download from the Japan Foundation (Irodori website)',
  },
  {
    id: 'm-ja-teppei-beginners',
    title: 'Nihongo con Teppei for Beginners',
    type: 'podcast',
    minLevel: 'A1',
    maxLevel: 'A2',
    region: 'Standard (Tokyo)',
    description:
      'Very short episodes in which Teppei talks about everyday topics in slow, simple Japanese, repeating key words so beginners can follow without English.',
    howToUse:
      "Listen to the same episode three days in a row; by the third listen, pause after each sentence and repeat it. Don't worry about catching every word — follow the gist.",
    whereToFind: 'Spotify, Apple Podcasts',
  },
  {
    id: 'm-ja-shimajiro',
    title: 'しまじろうチャンネル (Shimajiro)',
    type: 'youtube',
    minLevel: 'A1',
    maxLevel: 'A2',
    region: 'Standard (Tokyo)',
    description:
      'Official channel of the tiger cub Shimajiro, with songs and short episodes for preschoolers about greetings, manners, colors, and daily routines.',
    howToUse:
      'Watch a short clip and sing along with any song; write down one greeting or set phrase (いただきます, おやすみ…) and use it yourself today.',
    whereToFind: 'YouTube (official しまじろう channel)',
  },
  {
    id: 'm-ja-anpanman',
    title: 'それいけ！アンパンマン (Anpanman)',
    type: 'tv',
    minLevel: 'A1',
    maxLevel: 'A2',
    region: 'Standard (Tokyo)',
    description:
      'Japan\'s best-known toddler cartoon about a superhero whose head is made of bread; the plots are simple and the dialogue is slow, clear, and repetitive.',
    howToUse:
      'Watch one episode with no subtitles and just follow the story from the pictures; on a second watch, mimic the characters\' catchphrases and greetings out loud.',
    whereToFind: 'Japanese TV; streaming and official clips vary by country',
  },
  {
    id: 'm-ja-paprika',
    title: '「パプリカ」 – Foorin',
    type: 'music',
    minLevel: 'A1',
    maxLevel: 'A2',
    region: 'Standard (Tokyo)',
    description:
      'Upbeat children\'s song written by Kenshi Yonezu and sung by a group of kids; hugely popular in Japan and full of simple, singable hiragana lyrics.',
    howToUse:
      'Read the lyrics in hiragana while listening, then sing along until you can keep up with the chorus; circle every word you can already read and look up three you can\'t.',
    whereToFind: 'Spotify, Apple Music, YouTube',
  },
  {
    id: 'm-ja-tadoku-free-readers',
    title: 'Tadoku Free Graded Readers (NPO Tadoku Supporters)',
    type: 'book',
    minLevel: 'A1',
    maxLevel: 'B1',
    region: 'Standard (Tokyo)',
    description:
      'Free illustrated graded readers starting from Level 0 (a few hundred words), published online by the nonprofit behind the tadoku (extensive reading) method.',
    howToUse:
      'Follow the tadoku rules: read a book at an easy level, skip words you don\'t know, and move on if it\'s too hard. Try to finish one book per session and say aloud what happened.',
    whereToFind: 'tadoku.org (free download)',
  },
  {
    id: 'm-ja-graded-readers',
    title: 'Japanese Graded Readers (レベル別日本語多読ライブラリー)',
    type: 'book',
    minLevel: 'A1',
    maxLevel: 'B1',
    region: 'Standard (Tokyo)',
    description:
      'Graded reader series in levels 0–4 with folk tales, biographies, and original stories, illustrated and with audio, written so learners can read without a dictionary.',
    howToUse:
      'Read a story once silently, then listen to the audio while following the text; on a third pass, read one page aloud along with the narrator (shadow reading).',
    whereToFind: 'Bookstores, Amazon, libraries (published by ASK)',
  },
  {
    id: 'm-ja-japanesepod101',
    title: 'JapanesePod101',
    type: 'podcast',
    minLevel: 'A1',
    maxLevel: 'B2',
    region: 'Standard (Tokyo)',
    description:
      'Large library of short audio and video lessons from absolute beginner to advanced, each built around a dialogue, with English explanations and PDF notes.',
    howToUse:
      "Choose lessons at your level that match this week's topic; listen to the dialogue first without notes, then shadow it line by line until you can say it at full speed.",
    whereToFind: 'japanesepod101.com, YouTube, Spotify, Apple Podcasts',
  },

  // ───────── Elementary: easy news, readers & gentle native content ─────────
  {
    id: 'm-ja-nhk-news-web-easy',
    title: 'NHK NEWS WEB EASY',
    type: 'news',
    minLevel: 'A2',
    maxLevel: 'B1',
    region: 'Standard (Tokyo)',
    description:
      'Current news rewritten in simple Japanese by NHK, with furigana on every kanji, audio read by an announcer, and pop-up definitions for harder words.',
    howToUse:
      'Read one article a day: first listen to the audio without the text, then read it with furigana on, and finally read it aloud. Add the five most useful new words to your flashcards.',
    whereToFind: 'NHK NEWS WEB EASY website (www3.nhk.or.jp/news/easy)',
  },
  {
    id: 'm-ja-satori-reader',
    title: 'Satori Reader',
    type: 'app',
    minLevel: 'A2',
    maxLevel: 'B2',
    region: 'Standard (Tokyo)',
    description:
      'Serialized stories and articles written for learners, with adjustable furigana, native-speaker audio, tap-to-define words, and an English translation for every sentence.',
    howToUse:
      'Read one episode of a series per session; try each sentence before tapping the translation, and save five words or grammar points to review the next day.',
    whereToFind: 'satorireader.com, iOS and Android apps (some free episodes, subscription for the rest)',
  },
  {
    id: 'm-ja-organic-japanese',
    title: 'Organic Japanese with Cijin',
    type: 'youtube',
    minLevel: 'A2',
    maxLevel: 'B1',
    region: 'Standard (Tokyo)',
    description:
      'Comprehensible-input videos in which a Japanese teacher talks about daily life, culture, and personal experiences in slow, natural Japanese.',
    howToUse:
      'Watch with Japanese subtitles if available, then rewatch without them. Pick one sentence you liked, pause, and shadow it until it sounds natural.',
    whereToFind: 'YouTube',
  },
  {
    id: 'm-ja-yotsuba',
    title: 'よつばと！ (Yotsuba&!)',
    type: 'book',
    minLevel: 'A2',
    maxLevel: 'B1',
    region: 'Standard (Tokyo)',
    description:
      'Gentle slice-of-life manga by Kiyohiko Azuma about an energetic five-year-old discovering the world; mostly everyday conversation, with furigana on the kanji.',
    howToUse:
      'Read one chapter, using the pictures to guess unknown words before looking them up; copy three lines of dialogue into a notebook and read them aloud with expression.',
    whereToFind: 'Bookstores, Amazon/Kindle, ebook stores (Japanese edition)',
  },
  {
    id: 'm-ja-doraemon',
    title: 'ドラえもん (Doraemon)',
    type: 'tv',
    minLevel: 'A2',
    maxLevel: 'B1',
    region: 'Standard (Tokyo)',
    description:
      'Classic anime about a robot cat from the 22nd century who helps the hapless schoolboy Nobita with futuristic gadgets; short, self-contained stories in everyday Japanese.',
    howToUse:
      'Watch one short story with Japanese subtitles; notice the casual speech between the kids (〜じゃん, 〜よ, 〜てる) and write down how each casual line would sound in polite ます form.',
    whereToFind: 'Japanese TV; streaming availability varies by country',
  },
  {
    id: 'm-ja-shirokuma-cafe',
    title: 'しろくまカフェ (Polar Bear Café)',
    type: 'tv',
    minLevel: 'A2',
    maxLevel: 'B1',
    region: 'Standard (Tokyo)',
    description:
      'Slow-paced, relaxing comedy anime about a polar bear who runs a café frequented by a lazy panda, a penguin, and other animals; calm dialogue full of wordplay.',
    howToUse:
      'Watch with Japanese subtitles and pause at every café order or request; repeat the polite phrases the staff and customers use and practice them as if ordering yourself.',
    whereToFind: 'Streaming availability varies by country',
  },
  {
    id: 'm-ja-totoro',
    title: 'となりのトトロ (My Neighbor Totoro)',
    type: 'movie',
    minLevel: 'A2',
    maxLevel: 'B1',
    region: 'Standard (Tokyo)',
    description:
      'Studio Ghibli film about two sisters who move to the countryside and meet forest spirits; slow-paced, with simple family conversations and a child\'s-eye view.',
    howToUse:
      'Watch with Japanese audio and Japanese subtitles. Split it over two evenings and, after each half, retell the story aloud in five simple Japanese sentences.',
    whereToFind: 'Netflix (outside the US, Canada and Japan), Max (US); availability varies by country',
  },
  {
    id: 'm-ja-kiki',
    title: '魔女の宅急便 (Kiki\'s Delivery Service)',
    type: 'movie',
    minLevel: 'A2',
    maxLevel: 'B1',
    region: 'Standard (Tokyo)',
    description:
      'Studio Ghibli film about a 13-year-old witch who moves to a seaside town and starts a flying delivery service; lots of polite shop talk and everyday requests.',
    howToUse:
      'Watch with Japanese subtitles and note how Kiki talks to customers (polite) versus her cat Jiji (casual); write down three polite request phrases and practice them.',
    whereToFind: 'Netflix (outside the US, Canada and Japan), Max (US); availability varies by country',
  },
  {
    id: 'm-ja-old-enough',
    title: 'はじめてのおつかい (Old Enough!)',
    type: 'tv',
    minLevel: 'A2',
    maxLevel: 'B1',
    region: 'Mixed (families across Japan)',
    description:
      'Long-running reality show in which toddlers run their first errand alone, filmed by hidden cameras, with a warm narrator explaining what is happening.',
    howToUse:
      'Watch one 10–20 minute episode with Japanese subtitles if available; focus on the narrator, then write down the shopping list each child has to remember and say it aloud.',
    whereToFind: 'Netflix (availability varies by country)',
  },
  {
    id: 'm-ja-ue-wo-muite',
    title: '「上を向いて歩こう」 – Kyu Sakamoto',
    type: 'music',
    minLevel: 'A2',
    maxLevel: 'B1',
    region: 'Standard (Tokyo)',
    description:
      'The 1961 classic known abroad as "Sukiyaki"; slow, clear singing and simple lyrics built around the て-form and 〜ように.',
    howToUse:
      'Read the lyrics with a translation, then sing along; find every て-form and dictionary-form verb in the song and say what each one means.',
    whereToFind: 'Spotify, Apple Music, YouTube',
  },
  {
    id: 'm-ja-kurashiru',
    title: 'kurashiru (クラシル) recipe videos',
    type: 'youtube',
    minLevel: 'A2',
    maxLevel: 'B1',
    region: 'Standard (Tokyo)',
    description:
      'Short overhead recipe videos with on-screen Japanese text for ingredients and each cooking step; a fun way to practice reading food and kitchen vocabulary.',
    howToUse:
      'Pick a dish, pause on each step, and read the instructions out loud before the hands do it; then cook it (or explain it) using the verbs 切る, 混ぜる, 焼く, 入れる.',
    whereToFind: 'YouTube (official kurashiru channel), kurashiru app',
  },
  {
    id: 'm-ja-language-reactor',
    title: 'Language Reactor',
    type: 'app',
    minLevel: 'A2',
    maxLevel: 'C2',
    region: 'Mixed',
    description:
      'Browser extension that shows Japanese and English subtitles side by side on Netflix and YouTube, with pop-up dictionary lookups and easy replay of each line.',
    howToUse:
      'Use it with a show from this list: hide the English subtitles, replay any line you miss, and save five sentences per episode to review. Turn English back on only when you are truly lost.',
    whereToFind: 'Chrome Web Store (languagereactor.com)',
  },

  // ───────── Intermediate: learner podcasts, anime, films & readers ─────────
  {
    id: 'm-ja-teppei',
    title: 'Nihongo con Teppei',
    type: 'podcast',
    minLevel: 'B1',
    maxLevel: 'B2',
    region: 'Standard (Tokyo)',
    description:
      'The main Teppei podcast: short daily monologues about life, opinions, and stories in natural Japanese at a slightly slower than native pace.',
    howToUse:
      'Listen during a walk or commute without stopping; afterwards, summarize the episode aloud in three or four Japanese sentences, using one expression Teppei repeated.',
    whereToFind: 'Spotify, Apple Podcasts',
  },
  {
    id: 'm-ja-yuyu-podcast',
    title: 'YUYUの日本語Podcast',
    type: 'podcast',
    minLevel: 'B1',
    maxLevel: 'B2',
    region: 'Standard (Tokyo)',
    description:
      'Podcast for intermediate learners in which Yuyu talks about Japanese culture, everyday life, and the language itself in clear, natural Japanese.',
    howToUse:
      'Listen once for the gist, then replay a two-minute section and shadow it, matching her intonation; note any set phrases she uses to give opinions (〜と思うんですよね).',
    whereToFind: 'Spotify, Apple Podcasts, YouTube',
  },
  {
    id: 'm-ja-miku-real-japanese',
    title: 'Miku Real Japanese',
    type: 'podcast',
    minLevel: 'B1',
    maxLevel: 'B2',
    region: 'Standard (Tokyo)',
    description:
      'Podcast in which Miku talks about Japanese culture, current topics, and how Japanese people really speak, aimed at intermediate learners.',
    howToUse:
      "Write down every casual or 'real-life' expression she explains in an episode, then use two of them in a short message or in your next AI role-play.",
    whereToFind: 'Spotify, Apple Podcasts',
  },
  {
    id: 'm-ja-chibi-maruko-chan',
    title: 'ちびまる子ちゃん (Chibi Maruko-chan)',
    type: 'tv',
    minLevel: 'B1',
    maxLevel: 'B2',
    region: 'Standard (set in Shizuoka)',
    description:
      'Long-running anime about the daily life of a lazy, funny third-grader and her family in 1970s Shizuoka; family arguments, school life, and a sarcastic narrator.',
    howToUse:
      'Watch one 10-minute story with Japanese subtitles and pay attention to the narrator\'s comments; write two sentences describing what Maruko wanted and what went wrong.',
    whereToFind: 'Japanese TV; streaming availability varies by country',
  },
  {
    id: 'm-ja-detective-conan',
    title: '名探偵コナン (Detective Conan) – manga',
    type: 'book',
    minLevel: 'B1',
    maxLevel: 'B2',
    region: 'Standard (Tokyo)',
    description:
      'Long-running mystery manga by Gosho Aoyama about a teen detective shrunk into a child\'s body; furigana on every kanji makes the dense dialogue readable.',
    howToUse:
      'Read one case (usually three chapters) and, before the reveal, write down in Japanese who you think did it and why (〜から／〜ので).',
    whereToFind: 'Bookstores, Amazon/Kindle, ebook stores (Japanese edition)',
  },
  {
    id: 'm-ja-spirited-away',
    title: '千と千尋の神隠し (Spirited Away)',
    type: 'movie',
    minLevel: 'B1',
    maxLevel: 'B2',
    region: 'Standard (Tokyo)',
    description:
      'Studio Ghibli\'s Oscar-winning film about a girl who must work in a bathhouse for spirits to save her parents; a mix of casual speech and old-fashioned workplace language.',
    howToUse:
      'Watch with Japanese subtitles and notice how Chihiro is spoken to by her bosses versus her friends; list five commands or requests and identify their form (〜なさい, 〜て, 〜ろ).',
    whereToFind: 'Netflix (outside the US, Canada and Japan), Max (US); availability varies by country',
  },
  {
    id: 'm-ja-your-name',
    title: '君の名は。 (Your Name.)',
    type: 'movie',
    minLevel: 'B1',
    maxLevel: 'B2',
    region: 'Standard (Tokyo) and Hida dialect (Gifu)',
    description:
      'Makoto Shinkai\'s hit anime film about a Tokyo boy and a country girl who mysteriously swap bodies; contrasts Tokyo speech with the rural Hida dialect.',
    howToUse:
      'Watch with Japanese subtitles and collect the first-person pronouns the characters use (私, 僕, 俺) — notice how they give away the body swaps.',
    whereToFind: 'Streaming availability varies by country',
  },
  {
    id: 'm-ja-laid-back-camp',
    title: 'ゆるキャン△ (Laid-Back Camp)',
    type: 'tv',
    minLevel: 'B1',
    maxLevel: 'B2',
    region: 'Standard (set in Yamanashi)',
    description:
      'Slow, cozy anime about high-school girls camping around Mt. Fuji and Yamanashi; relaxed conversations about food, travel, and the outdoors.',
    howToUse:
      'Watch an episode with Japanese subtitles and mine five words about nature, food, or travel; then plan a (real or imaginary) camping trip in five Japanese sentences.',
    whereToFind: 'Crunchyroll and other services (availability varies by country)',
  },
  {
    id: 'm-ja-midnight-diner',
    title: '深夜食堂 (Midnight Diner: Tokyo Stories)',
    type: 'tv',
    minLevel: 'B1',
    maxLevel: 'C1',
    region: 'Standard (Tokyo)',
    description:
      'Quiet drama set in a tiny late-night diner in Shinjuku where the Master cooks whatever customers ask for; each episode tells one regular\'s story.',
    howToUse:
      'Watch one episode with Japanese subtitles and focus on the opening and ordering scenes; shadow the customers\' orders and the Master\'s short replies.',
    whereToFind: 'Netflix (availability varies by country)',
  },
  {
    id: 'm-ja-the-makanai',
    title: '舞妓さんちのまかないさん (The Makanai: Cooking for the Maiko House)',
    type: 'tv',
    minLevel: 'B1',
    maxLevel: 'B2',
    region: 'Kyoto (Kansai)',
    description:
      'Gentle drama about two girls from Aomori who move to Kyoto to train as maiko; one becomes the house cook. Features soft Kyoto dialect and plenty of home cooking.',
    howToUse:
      'Watch with Japanese subtitles and compare Kyoto forms with standard ones (〜どす = です, 〜はる for respect, おおきに = ありがとう); keep a two-column list.',
    whereToFind: 'Netflix (availability varies by country)',
  },
  {
    id: 'm-ja-totto-chan',
    title: '窓ぎわのトットちゃん (Totto-chan: The Little Girl at the Window)',
    type: 'book',
    minLevel: 'B1',
    maxLevel: 'B2',
    region: 'Standard (Tokyo)',
    description:
      'Tetsuko Kuroyanagi\'s best-selling memoir of her unconventional elementary school in wartime Tokyo, told in short, warm chapters in simple prose.',
    howToUse:
      'Read one short chapter per session without a dictionary on the first pass; then reread it and look up only words that appear more than once.',
    whereToFind: 'Bookstores, Amazon/Kindle (Kodansha)',
  },
  {
    id: 'm-ja-read-real-japanese',
    title: 'Read Real Japanese Fiction / Read Real Japanese Essays',
    type: 'book',
    minLevel: 'B1',
    maxLevel: 'B2',
    region: 'Standard (Tokyo)',
    description:
      'Bilingual readers with short stories or essays by well-known contemporary Japanese writers, with vocabulary and grammar notes and native-speaker audio.',
    howToUse:
      'Read a piece in Japanese first, checking the notes only when stuck; then listen to the recording while following the text, and reread it the next day without notes.',
    whereToFind: 'Bookstores, Amazon (Kodansha USA)',
  },
  {
    id: 'm-ja-lemon',
    title: '「Lemon」 – Kenshi Yonezu (米津玄師)',
    type: 'music',
    minLevel: 'B1',
    maxLevel: 'B2',
    region: 'Standard (Tokyo)',
    description:
      'Emotional hit written as the theme for the 2018 drama アンナチュラル; poetic but clear lyrics about loss and memory.',
    howToUse:
      'Study the lyrics line by line, then sing along; find the conditional and regret forms (such as 夢ならば…よかったでしょう) and translate those lines in your own words.',
    whereToFind: 'Spotify, Apple Music, YouTube',
  },
  {
    id: 'm-ja-maisho',
    title: '毎日小学生新聞 (Mainichi Elementary School Newspaper)',
    type: 'news',
    minLevel: 'B1',
    maxLevel: 'B2',
    region: 'Standard (Tokyo)',
    description:
      'Daily newspaper for elementary-school children from the Mainichi Shimbun, explaining real news with furigana, photos, and simple background notes.',
    howToUse:
      'Read one article a day and write a three-sentence summary in Japanese; note how the paper explains difficult news words in simpler terms.',
    whereToFind: 'Print and digital subscription (Mainichi Shimbun)',
  },
  {
    id: 'm-ja-nihongo-no-mori',
    title: '日本語の森 (Nihongo no Mori)',
    type: 'youtube',
    minLevel: 'B1',
    maxLevel: 'C1',
    region: 'Standard (Tokyo)',
    description:
      'Popular channel of grammar and vocabulary lessons for the JLPT (N5–N1), taught largely in Japanese by energetic teachers.',
    howToUse:
      'Watch a lesson that matches this week\'s grammar point; pause before each example sentence is explained and try to translate it yourself, then write two sentences of your own.',
    whereToFind: 'YouTube',
  },

  // ───────── Upper-intermediate & advanced: native media ─────────
  {
    id: 'm-ja-yoru-ni-kakeru',
    title: '「夜に駆ける」 – YOASOBI',
    type: 'music',
    minLevel: 'B2',
    maxLevel: 'C1',
    region: 'Standard (Tokyo)',
    description:
      'Breakout hit by YOASOBI, a duo that turns short stories into songs; this one is based on the online story 「タナトスの誘惑」 and has fast, dense lyrics.',
    howToUse:
      'Read the original short story first, then listen and match lines of the song to scenes in the story; try to keep up with the fastest verse by reading the lyrics aloud at speed.',
    whereToFind: 'Spotify, Apple Music, YouTube',
  },
  {
    id: 'm-ja-nhk-news-web',
    title: 'NHK NEWS WEB',
    type: 'news',
    minLevel: 'B2',
    maxLevel: 'C2',
    region: 'Standard (Tokyo)',
    description:
      'NHK\'s main news site, with articles and video reports in standard broadcast Japanese covering politics, society, science, and culture.',
    howToUse:
      'Read the same story on NHK NEWS WEB EASY first if one exists, then the full version; underline the formal written expressions (〜とみられる, 〜としている) and reuse two in a summary.',
    whereToFind: 'NHK NEWS WEB website, NHK news app',
  },
  {
    id: 'm-ja-yuru-gengogaku-radio',
    title: 'ゆる言語学ラジオ (Yuru Gengogaku Radio)',
    type: 'podcast',
    minLevel: 'B2',
    maxLevel: 'C2',
    region: 'Standard (Tokyo)',
    description:
      'Hugely popular show in which two hosts chat about linguistics, words, and language trivia in fast, witty, natural Japanese.',
    howToUse:
      'Pick an episode about a Japanese word or expression; listen once for fun, then replay five minutes and write down every filler and discourse marker you hear (要は, ちなみに, いや…).',
    whereToFind: 'YouTube, Spotify, Apple Podcasts',
  },
  {
    id: 'm-ja-hanzawa-naoki',
    title: '半沢直樹 (Hanzawa Naoki)',
    type: 'tv',
    minLevel: 'B2',
    maxLevel: 'C1',
    region: 'Standard (Tokyo)',
    description:
      'Blockbuster TBS drama about a bank employee who fights corrupt superiors, famous for its catchphrase 「倍返しだ！」 and dramatic business keigo.',
    howToUse:
      'Watch with Japanese subtitles and collect honorific and humble expressions from meeting scenes (おっしゃる, 申し上げる, 〜させていただく); note who uses them to whom.',
    whereToFind: 'Streaming availability varies by country',
  },
  {
    id: 'm-ja-convenience-store-woman',
    title: 'コンビニ人間 (Convenience Store Woman) – Sayaka Murata',
    type: 'book',
    minLevel: 'B2',
    maxLevel: 'C1',
    region: 'Standard (Tokyo)',
    description:
      'Akutagawa Prize–winning short novel about a woman who has worked at the same convenience store for 18 years; plain, precise prose and lots of shop phrases.',
    howToUse:
      'Read a chapter per session and mine five words or phrases; mark every set phrase of convenience-store keigo (いらっしゃいませ, かしこまりました) and notice how the narrator describes them.',
    whereToFind: 'Bookstores, Amazon/Kindle (Bunshun Bunko)',
  },
  {
    id: 'm-ja-norwegian-wood',
    title: 'ノルウェイの森 (Norwegian Wood) – Haruki Murakami',
    type: 'book',
    minLevel: 'B2',
    maxLevel: 'C1',
    region: 'Standard (Tokyo)',
    description:
      'Murakami\'s bestselling coming-of-age novel set in late-1960s Tokyo; clear, conversational prose that is a good first full-length literary novel.',
    howToUse:
      'Read ten pages per session; if you have the English translation, compare one page afterwards to check your understanding rather than reading them side by side.',
    whereToFind: 'Bookstores, Amazon/Kindle (Kodansha)',
  },
  {
    id: 'm-ja-barakamon',
    title: 'ばらかもん (Barakamon)',
    type: 'tv',
    minLevel: 'B2',
    maxLevel: 'C1',
    region: 'Goto Islands dialect (Nagasaki) and standard',
    description:
      'Anime about a young Tokyo calligrapher sent to live on a remote island, where the locals and kids speak strong Goto dialect; funny and heartwarming.',
    howToUse:
      'Watch with Japanese subtitles and keep a list of dialect words and endings with their standard equivalents; notice how the main character\'s standard Japanese stands out.',
    whereToFind: 'Streaming availability varies by country',
  },
  {
    id: 'm-ja-shoplifters',
    title: '万引き家族 (Shoplifters)',
    type: 'movie',
    minLevel: 'B2',
    maxLevel: 'C1',
    region: 'Standard (Tokyo)',
    description:
      'Hirokazu Kore-eda\'s Palme d\'Or–winning drama about a poor makeshift family in Tokyo; naturalistic, mumbled everyday speech at native speed.',
    howToUse:
      'Watch with Japanese subtitles and pick one family dinner scene to rewatch three times; transcribe a minute of it and compare with the subtitles.',
    whereToFind: 'Streaming availability varies by country',
  },
  {
    id: 'm-ja-tokyo-story',
    title: '東京物語 (Tokyo Story)',
    type: 'movie',
    minLevel: 'B2',
    maxLevel: 'C2',
    region: 'Standard (Tokyo) and Onomichi (Hiroshima) speech',
    description:
      'Yasujirō Ozu\'s 1953 masterpiece about elderly parents visiting their busy adult children in Tokyo; slow, quiet, and full of polite, old-fashioned speech.',
    howToUse:
      'Watch with Japanese subtitles and note how politeness levels differ between parents, children, and the daughter-in-law; list expressions that sound dated today.',
    whereToFind: 'Criterion Collection, streaming availability varies by country',
  },

  // ───────── Advanced & mastery ─────────
  {
    id: 'm-ja-coten-radio',
    title: 'COTEN RADIO',
    type: 'podcast',
    minLevel: 'C1',
    maxLevel: 'C2',
    region: 'Standard (Tokyo)',
    description:
      'Popular history podcast in which three hosts discuss historical figures and eras in long, lively, unscripted conversations.',
    howToUse:
      'Choose a series on a figure you already know; after each episode, explain the key events aloud for two minutes without notes, using the hosts\' vocabulary.',
    whereToFind: 'Spotify, Apple Podcasts, YouTube',
  },
  {
    id: 'm-ja-m1-grand-prix',
    title: 'M-1グランプリ (M-1 Grand Prix)',
    type: 'youtube',
    minLevel: 'C1',
    maxLevel: 'C2',
    region: 'Mixed (heavy on Kansai)',
    description:
      'Annual manzai (stand-up comedy duo) competition; routines are fast, packed with wordplay and tsukkomi, and many duos perform in Kansai dialect.',
    howToUse:
      'Watch one routine twice: first for fun, then pausing after each joke to explain why it is funny. Note every Kansai form (〜や, 〜へん, なんでやねん) and its standard equivalent.',
    whereToFind: 'YouTube (official M-1グランプリ channel), Japanese TV',
  },
  {
    id: 'm-ja-kokoro',
    title: 'こころ (Kokoro) – Natsume Sōseki',
    type: 'book',
    minLevel: 'C1',
    maxLevel: 'C2',
    region: 'Standard (early 20th-century Tokyo)',
    description:
      'Sōseki\'s 1914 classic novel about a student and his mysterious mentor; slightly old-fashioned prose and kanji usage, and a staple of Japanese school curricula.',
    howToUse:
      'Read the free text on Aozora Bunko a few pages at a time; list older spellings and expressions (e.g., kanji where modern writers use kana) and their modern equivalents.',
    whereToFind: 'Aozora Bunko (free, aozora.gr.jp), bookstores',
  },
  {
    id: 'm-ja-tensei-jingo',
    title: '天声人語 (Tensei Jingo, Asahi Shimbun)',
    type: 'news',
    minLevel: 'C1',
    maxLevel: 'C2',
    region: 'Standard (Tokyo)',
    description:
      'The Asahi Shimbun\'s famous daily front-page column: short, dense essays on current events full of literary allusions and idioms. English translations appear as "Vox Populi, Vox Dei".',
    howToUse:
      'Read one column, summarize it in three Japanese sentences, then compare your understanding with the English translation; copy out one elegant phrase to use in your own writing.',
    whereToFind: 'Asahi Shimbun Digital (subscription), English translations on the Asahi Shimbun English site',
  },
];
