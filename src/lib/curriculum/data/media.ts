import type { MediaItem } from "../types";

/**
 * Real Spanish-language media for out-of-app homework, roughly ordered A1 → C2.
 * Availability on streaming platforms varies by country and changes over time.
 */
export const mediaCatalog: MediaItem[] = [
  // ───────── Learner resources & apps ─────────
  {
    id: "m-dreaming-spanish",
    title: "Dreaming Spanish",
    type: "youtube",
    minLevel: "A1",
    maxLevel: "B2",
    region: "Mixed (Spain and Latin America)",
    description:
      "Comprehensible-input videos sorted from Superbeginner to Advanced, taught entirely in Spanish by guides from many countries using drawings, gestures, and props.",
    howToUse:
      "Start with Superbeginner videos and don't pause to translate; aim for 30 minutes a day and filter by guide to hear a Latin American accent you like.",
    whereToFind: "YouTube, dreamingspanish.com",
  },
  {
    id: "m-language-transfer",
    title: "Language Transfer: Complete Spanish",
    type: "app",
    minLevel: "A1",
    maxLevel: "A2",
    region: "Neutral",
    description:
      "A free audio course (explained in English) that builds Spanish sentences step by step by showing how English and Spanish are connected.",
    howToUse:
      "Do one or two tracks a day and always say your answer out loud before the student on the recording does; replay any track where you hesitated.",
    whereToFind: "Language Transfer app (iOS, Android), languagetransfer.org",
  },
  {
    id: "m-coffee-break-spanish",
    title: "Coffee Break Spanish",
    type: "podcast",
    minLevel: "A1",
    maxLevel: "B1",
    region: "Spain",
    description:
      "Structured lesson podcast from Radio Lingua in which a teacher guides a learner through vocabulary and grammar in short episodes; later seasons move mostly into Spanish.",
    howToUse:
      "Listen to one lesson per day and repeat every phrase aloud during the pauses; note that it teaches Spain's vosotros, which you can recognize but don't need to produce.",
    whereToFind: "Spotify, Apple Podcasts, coffeebreaklanguages.com",
  },
  {
    id: "m-destinos",
    title: "Destinos: An Introduction to Spanish",
    type: "tv",
    minLevel: "A1",
    maxLevel: "B1",
    region: "Mixed (Spain, Argentina, Puerto Rico, Mexico)",
    description:
      "A 52-episode telenovela made for Spanish learners (1992) that follows a lawyer investigating a family mystery across four countries, with recaps that recycle vocabulary.",
    howToUse:
      "Watch one episode, then write three sentences summarizing what Raquel discovered; notice how accents change as the story moves between countries.",
    whereToFind: "Annenberg Learner (learner.org), YouTube",
  },
  {
    id: "m-plaza-sesamo",
    title: "Plaza Sésamo",
    type: "youtube",
    minLevel: "A1",
    maxLevel: "A2",
    region: "Mexico / Latin America",
    description:
      "The Latin American version of Sesame Street, with short, clear segments about numbers, colors, feelings, and everyday routines.",
    howToUse:
      "Watch 5-minute clips and shadow the characters' lines out loud; pick one new word per clip and use it in your own sentence.",
    whereToFind: "YouTube (official Plaza Sésamo channel)",
  },
  {
    id: "m-pocoyo",
    title: "Pocoyó",
    type: "youtube",
    minLevel: "A1",
    maxLevel: "A2",
    region: "Spain",
    description:
      "Gentle animated series for preschoolers from Spain with a slow, clear narrator and very simple vocabulary.",
    howToUse:
      "Watch without subtitles and try to predict what the narrator will say next; repeat his questions aloud and answer them.",
    whereToFind: "YouTube (Pocoyó en español channel)",
  },
  {
    id: "m-peppa-pig",
    title: "Peppa Pig (Latin American Spanish dub)",
    type: "youtube",
    minLevel: "A1",
    maxLevel: "A2",
    region: "Latin America (dub)",
    description:
      "The British children's cartoon dubbed into Latin American Spanish; five-minute episodes about family life, school, and play.",
    howToUse:
      "Watch an episode twice: first for the story, then with Spanish subtitles, writing down every phrase a family member uses to ask for something.",
    whereToFind: "YouTube (search 'Peppa Pig en Español Latino')",
  },
  {
    id: "m-extra-en-espanol",
    title: "Extra en español",
    type: "tv",
    minLevel: "A2",
    maxLevel: "B1",
    region: "Spain",
    description:
      "A 13-episode sitcom made for learners about an American who moves in with Spanish flatmates; slow, exaggerated dialogue with lots of repetition.",
    howToUse:
      "Watch with Spanish subtitles and pause after each scene to summarize it aloud in two sentences; ignore vosotros forms and focus on everyday phrases.",
    whereToFind: "YouTube",
  },
  {
    id: "m-duolingo-spanish-podcast",
    title: "Duolingo Spanish Podcast",
    type: "podcast",
    minLevel: "A2",
    maxLevel: "B1",
    region: "Mixed (mostly Latin America)",
    description:
      "True stories told in slow, clear Spanish by speakers from many countries, with short English narration between segments to keep you on track.",
    howToUse:
      "Listen once normally, then replay the Spanish segments with the transcript and note three phrases you'd like to use when telling your own stories.",
    whereToFind: "Spotify, Apple Podcasts, podcast.duolingo.com",
  },
  {
    id: "m-short-stories-beginners",
    title: "Short Stories in Spanish for Beginners (Olly Richards)",
    type: "book",
    minLevel: "A2",
    maxLevel: "B1",
    region: "Neutral",
    description:
      "Graded reader with eight short stories written for learners, each followed by a summary, glossary, and comprehension questions.",
    howToUse:
      "Read one chapter a day without looking up every word; only check the glossary after finishing, then retell the chapter aloud in your own words.",
    whereToFind: "Bookstores, Amazon/Kindle, Audible (audio edition)",
  },
  {
    id: "m-easy-spanish",
    title: "Easy Spanish",
    type: "youtube",
    minLevel: "A2",
    maxLevel: "B2",
    region: "Mexico and Spain",
    description:
      "Street interviews with real people on everyday topics, with Spanish and English subtitles, from the Easy Languages network.",
    howToUse:
      "Watch once with both subtitle lines, then again covering the English line; write down one answer from an interviewee and adapt it to your own opinion.",
    whereToFind: "YouTube",
  },
  {
    id: "m-espanolistos",
    title: "Españolistos",
    type: "podcast",
    minLevel: "A2",
    maxLevel: "B2",
    region: "Colombia",
    description:
      "Conversational podcast by a Colombian teacher and her American husband about culture, travel, and daily life, spoken almost entirely in clear Spanish.",
    howToUse:
      "Listen at 0.85x speed if needed and pause every few minutes to repeat the last sentence you heard; pay attention to Colombian expressions they explain.",
    whereToFind: "Spotify, Apple Podcasts, espanolistos.com",
  },
  {
    id: "m-news-in-slow-spanish",
    title: "News in Slow Spanish (Latino edition)",
    type: "podcast",
    minLevel: "A2",
    maxLevel: "B2",
    region: "Latin America (a Spain edition also exists)",
    description:
      "Weekly world news read and discussed slowly, with interactive transcripts and grammar segments built around the stories.",
    howToUse:
      "Read the headline first and predict five words you'll hear; after listening, explain the main story aloud in three sentences.",
    whereToFind: "newsinslowspanish.com, app (iOS, Android)",
  },
  {
    id: "m-notes-in-spanish",
    title: "Notes in Spanish",
    type: "podcast",
    minLevel: "A2",
    maxLevel: "B2",
    region: "Spain",
    description:
      "Relaxed, real conversations between a Spanish woman and her English husband about life in Spain, with separate beginner, intermediate, and advanced series.",
    howToUse:
      "Pick the series that matches your level and listen to each episode twice; the second time, jot down any filler words (pues, o sea, bueno) and practice using them.",
    whereToFind: "Spotify, Apple Podcasts, notesinspanish.com",
  },

  // ───────── Kids, family & easier native content ─────────
  {
    id: "m-me-gustas-tu",
    title: "\"Me gustas tú\" – Manu Chao",
    type: "music",
    minLevel: "A2",
    maxLevel: "B1",
    region: "Neutral",
    description:
      "A catchy, repetitive song built almost entirely on the structure me gusta / me gustas, perfect for internalizing gustar.",
    howToUse:
      "Sing along with the lyrics, then write your own verse of five lines using me gusta, me gustan, and me gustas.",
    whereToFind: "Spotify, Apple Music, YouTube",
  },
  {
    id: "m-short-stories-intermediate",
    title: "Short Stories in Spanish for Intermediate Learners (Olly Richards)",
    type: "book",
    minLevel: "B1",
    maxLevel: "B2",
    region: "Neutral",
    description:
      "The next step up in the graded reader series: longer stories with more past tenses and dialogue, plus chapter summaries and glossaries.",
    howToUse:
      "Before each chapter, skim the glossary; afterwards, underline every verb in the preterite or imperfect and explain to yourself why each tense was chosen.",
    whereToFind: "Bookstores, Amazon/Kindle, Audible (audio edition)",
  },
  {
    id: "m-coco",
    title: "Coco (Latin American Spanish dub)",
    type: "movie",
    minLevel: "B1",
    maxLevel: "B2",
    region: "Mexico (dub)",
    description:
      "Pixar's film about a Mexican boy who journeys into the Land of the Dead on Día de Muertos; the Latin American dub features Mexican voice actors and songs.",
    howToUse:
      "Watch with Spanish audio and Spanish subtitles; afterwards, learn the chorus of \"Recuérdame\" and look up the family-related vocabulary.",
    whereToFind: "Disney+ (Spanish – Latin America audio)",
  },
  {
    id: "m-encanto",
    title: "Encanto (Latin American Spanish dub)",
    type: "movie",
    minLevel: "B1",
    maxLevel: "B2",
    region: "Colombia (dub)",
    description:
      "Disney's musical about the Madrigal family in the mountains of Colombia; the Latin American dub has a largely Colombian cast.",
    howToUse:
      "Watch in Spanish with Spanish subtitles, then study the lyrics of \"No se habla de Bruno\" line by line and sing along to practice fast speech.",
    whereToFind: "Disney+ (Spanish – Latin America audio)",
  },
  {
    id: "m-el-chavo",
    title: "El Chavo del Ocho",
    type: "tv",
    minLevel: "B1",
    maxLevel: "B2",
    region: "Mexico",
    description:
      "Classic 1970s Mexican sitcom by Roberto Gómez Bolaños about a poor boy and his neighbors in a vecindad; slapstick humor and recurring catchphrases.",
    howToUse:
      "Watch one episode and collect the catchphrases (\"Fue sin querer queriendo\", \"¡Eso, eso, eso!\"); explain in Spanish what situation each one is used in.",
    whereToFind: "YouTube clips, various streaming services depending on country",
  },
  {
    id: "m-los-simpson",
    title: "Los Simpson (Latin American dub)",
    type: "tv",
    minLevel: "B1",
    maxLevel: "B2",
    region: "Mexico (dub)",
    description:
      "The Simpsons in its famous Mexican-produced Latin American dub, known for adapting jokes with local slang.",
    howToUse:
      "Rewatch an episode you already know in English so you can focus on how jokes and idioms were adapted; note three colloquial phrases per episode.",
    whereToFind: "Disney+ (Spanish – Latin America audio, where available)",
  },
  {
    id: "m-a-dios-le-pido",
    title: "\"A Dios le pido\" – Juanes",
    type: "music",
    minLevel: "B1",
    maxLevel: "B2",
    region: "Colombia",
    description:
      "Colombian rock-pop hit in which almost every line is a wish introduced by que + present subjunctive.",
    howToUse:
      "Print the lyrics and highlight every subjunctive verb; then write four of your own wishes following the same pattern (A Dios le pido que...).",
    whereToFind: "Spotify, Apple Music, YouTube",
  },
  {
    id: "m-hasta-la-raiz",
    title: "\"Hasta la raíz\" – Natalia Lafourcade",
    type: "music",
    minLevel: "B1",
    maxLevel: "B2",
    region: "Mexico",
    description:
      "A clearly sung, poetic song about love and roots by one of Mexico's most acclaimed singer-songwriters.",
    howToUse:
      "Listen first without lyrics and write down every word you catch; then compare with the lyrics and look up the metaphors.",
    whereToFind: "Spotify, Apple Music, YouTube",
  },
  {
    id: "m-gracias-a-la-vida",
    title: "\"Gracias a la vida\" – Violeta Parra (Mercedes Sosa version)",
    type: "music",
    minLevel: "B1",
    maxLevel: "B2",
    region: "Chile / Argentina",
    description:
      "Violeta Parra's classic Latin American folk song, best known in Mercedes Sosa's slow, very clear interpretation.",
    howToUse:
      "Study one verse at a time and list what the singer is thankful for; then write your own verse starting with \"Gracias a la vida, que me ha dado...\".",
    whereToFind: "Spotify, Apple Music, YouTube",
  },
  {
    id: "m-el-principito",
    title: "El principito (Antoine de Saint-Exupéry, translated)",
    type: "book",
    minLevel: "B1",
    maxLevel: "B2",
    region: "Neutral (translation)",
    description:
      "The Spanish translation of The Little Prince: short chapters, simple sentences, and deep ideas, ideal as a first real book.",
    howToUse:
      "Read one chapter a day aloud, and pair it with the Spanish audiobook; keep a notebook of the fox's and the prince's key lines.",
    whereToFind: "Bookstores, libraries, Amazon/Kindle, Audible",
  },
  {
    id: "m-harry-potter",
    title: "Harry Potter y la piedra filosofal (J.K. Rowling, translated)",
    type: "book",
    minLevel: "B1",
    maxLevel: "B2",
    region: "Spain (translation)",
    description:
      "The Spanish translation of the first Harry Potter book, published by Salamandra; familiar plot helps you read long stretches without a dictionary.",
    howToUse:
      "Read a chapter a day without the English book open; guess unknown words from context and only look up words that appear three or more times. Expect some Spain vocabulary and vosotros.",
    whereToFind: "Bookstores, libraries, Amazon/Kindle, Audible",
  },
  {
    id: "m-cuentos-de-la-selva",
    title: "Cuentos de la selva (Horacio Quiroga)",
    type: "book",
    minLevel: "B1",
    maxLevel: "B2",
    region: "Uruguay / Argentina",
    description:
      "Classic short animal fables (1918) set in the jungle of Misiones, originally written for children; short, vivid, and free in the public domain in many countries.",
    howToUse:
      "Read one story per sitting, then retell it aloud in the past tense using both preterite and imperfect.",
    whereToFind: "Libraries, bookstores, free public-domain editions online",
  },
  {
    id: "m-hoy-hablamos",
    title: "Hoy Hablamos",
    type: "podcast",
    minLevel: "B1",
    maxLevel: "C1",
    region: "Spain",
    description:
      "Daily podcast for learners on Spanish culture, history, grammar, and current topics, spoken at natural but clear speed.",
    howToUse:
      "Listen during your commute and pick one grammar or vocabulary episode per week to study with the transcript; shadow a one-minute section.",
    whereToFind: "Spotify, Apple Podcasts, hoyhablamos.com",
  },
  {
    id: "m-espanol-con-juan",
    title: "Español con Juan",
    type: "youtube",
    minLevel: "B1",
    maxLevel: "B2",
    region: "Spain",
    description:
      "Humorous videos by a Spanish teacher explaining grammar, vocabulary, and culture entirely in Spanish.",
    howToUse:
      "Watch one video per topic you're currently studying and pause to answer his questions before he does; turn on Spanish subtitles if needed.",
    whereToFind: "YouTube",
  },
  {
    id: "m-lupa",
    title: "Lupa (Radio Ambulante for learners)",
    type: "app",
    minLevel: "B1",
    maxLevel: "C1",
    region: "Latin America",
    description:
      "Learning app built on real Radio Ambulante episodes, with synchronized transcripts, tap-to-translate, vocabulary, and grammar notes.",
    howToUse:
      "Work through one episode chapter per session: listen without text first, then with the transcript, and save five new words to review the next day.",
    whereToFind: "lupa.app (web, iOS, Android)",
  },

  // ───────── Native TV series ─────────
  {
    id: "m-yo-soy-betty",
    title: "Yo soy Betty, la fea",
    type: "tv",
    minLevel: "B2",
    maxLevel: "C1",
    region: "Colombia",
    description:
      "Iconic 1999 Colombian telenovela about a brilliant but unglamorous secretary at a Bogotá fashion company; clear Colombian Spanish with plenty of office talk and humor.",
    howToUse:
      "Watch with Spanish subtitles and track how characters shift between usted and tú depending on status; note Bogotá expressions in a list.",
    whereToFind: "Netflix (availability varies by country), YouTube clips",
  },
  {
    id: "m-club-de-cuervos",
    title: "Club de Cuervos",
    type: "tv",
    minLevel: "B2",
    maxLevel: "C1",
    region: "Mexico",
    description:
      "Netflix's first Spanish-language original: siblings fight over control of a Mexican soccer club after their father's death. Lots of Mexican slang.",
    howToUse:
      "Watch with Spanish subtitles and keep a slang list (güey, neta, chido); after each episode, explain one power struggle in Spanish.",
    whereToFind: "Netflix",
  },
  {
    id: "m-la-casa-de-las-flores",
    title: "La casa de las flores",
    type: "tv",
    minLevel: "B2",
    maxLevel: "C1",
    region: "Mexico",
    description:
      "Dark comedy about a wealthy Mexico City family, their flower shop, and their secrets; sharp dialogue with upper-middle-class chilango speech.",
    howToUse:
      "Watch with Spanish subtitles and pause at big reveals to predict in Spanish what will happen next using future or conditional forms.",
    whereToFind: "Netflix",
  },
  {
    id: "m-monarca",
    title: "Monarca",
    type: "tv",
    minLevel: "B2",
    maxLevel: "C1",
    region: "Mexico",
    description:
      "Drama about a powerful Mexican family and its tequila empire, full of business talk, family conflict, and political intrigue.",
    howToUse:
      "Watch with Spanish subtitles and write down formal vs. informal ways characters argue; summarize each episode's main conflict in five sentences.",
    whereToFind: "Netflix",
  },
  {
    id: "m-la-casa-de-papel",
    title: "La casa de papel",
    type: "tv",
    minLevel: "B2",
    maxLevel: "C2",
    region: "Spain",
    description:
      "Heist thriller in which a group led by 'el Profesor' takes over the Royal Mint of Spain; fast, emotional Peninsular Spanish.",
    howToUse:
      "Use Spanish audio with Spanish subtitles (not the English dub); rewatch the Profesor's planning scenes and imitate his calm, precise delivery.",
    whereToFind: "Netflix",
  },
  {
    id: "m-elite",
    title: "Élite",
    type: "tv",
    minLevel: "B2",
    maxLevel: "C1",
    region: "Spain",
    description:
      "Teen thriller set in an exclusive Spanish private school, with fast, slangy dialogue among students.",
    howToUse:
      "Watch with Spanish subtitles and collect Spain-specific slang (tío, mola, flipar), labeling it as Spain-only so you don't mix registers.",
    whereToFind: "Netflix",
  },
  {
    id: "m-las-chicas-del-cable",
    title: "Las chicas del cable",
    type: "tv",
    minLevel: "B2",
    maxLevel: "C1",
    region: "Spain",
    description:
      "Period drama about four women working at a telephone company in 1920s Madrid; relatively clear, somewhat formal dialogue.",
    howToUse:
      "Watch with Spanish subtitles and note the formal register (usted, courtesy forms) used at work; compare it with how the friends talk in private.",
    whereToFind: "Netflix",
  },
  {
    id: "m-el-ministerio-del-tiempo",
    title: "El Ministerio del Tiempo",
    type: "tv",
    minLevel: "C1",
    maxLevel: "C2",
    region: "Spain",
    description:
      "Spanish fantasy series about a secret government agency that protects Spain's history, with characters speaking in the styles of different centuries.",
    howToUse:
      "Watch with Spanish subtitles and read a short Spanish Wikipedia article about each episode's historical period beforehand to prime vocabulary.",
    whereToFind: "RTVE Play; other platforms depending on country",
  },
  {
    id: "m-el-marginal",
    title: "El marginal",
    type: "tv",
    minLevel: "C1",
    maxLevel: "C2",
    region: "Argentina",
    description:
      "Gritty prison drama packed with Rioplatense Spanish, voseo, and lunfardo slang; intense and for adult viewers.",
    howToUse:
      "Watch with Spanish subtitles and focus on voseo verb forms (vos tenés, vos sabés); keep a separate lunfardo glossary and don't copy it into formal speech.",
    whereToFind: "Netflix (availability varies by country)",
  },

  // ───────── Films ─────────
  {
    id: "m-diarios-de-motocicleta",
    title: "Diarios de motocicleta",
    type: "movie",
    minLevel: "B2",
    maxLevel: "C1",
    region: "Argentina (plus Chile and Peru)",
    description:
      "Walter Salles's 2004 road movie about a young Ernesto 'Che' Guevara's journey across South America; showcases Argentine and Andean accents.",
    howToUse:
      "Watch with Spanish subtitles and trace the route on a map; after watching, describe how the characters change using the imperfect for background and the preterite for events.",
    whereToFind: "Rental on Apple TV / Amazon, some streaming services",
  },
  {
    id: "m-roma",
    title: "Roma",
    type: "movie",
    minLevel: "B2",
    maxLevel: "C1",
    region: "Mexico",
    description:
      "Alfonso Cuarón's 2018 black-and-white film about a domestic worker in 1970s Mexico City; sparse dialogue in Spanish and some Mixtec.",
    howToUse:
      "Because dialogue is sparse, focus on short exchanges: pause after each one and repeat it with the same intonation.",
    whereToFind: "Netflix",
  },
  {
    id: "m-el-laberinto-del-fauno",
    title: "El laberinto del fauno",
    type: "movie",
    minLevel: "B2",
    maxLevel: "C1",
    region: "Spain",
    description:
      "Guillermo del Toro's 2006 dark fantasy set in post-Civil War Spain, blending a fairy tale with brutal history.",
    howToUse:
      "Watch with Spanish subtitles, then write a 150-word review in Spanish using connectors like sin embargo, además, and por lo tanto.",
    whereToFind: "Rental on Apple TV / Amazon, some streaming services",
  },
  {
    id: "m-relatos-salvajes",
    title: "Relatos salvajes",
    type: "movie",
    minLevel: "B2",
    maxLevel: "C2",
    region: "Argentina",
    description:
      "Damián Szifron's 2014 anthology of six darkly comic revenge stories; each segment is short, making it easy to study one at a time.",
    howToUse:
      "Watch one story per session with Spanish subtitles and retell it aloud with hypotheticals: ¿Qué habrías hecho tú en su lugar?",
    whereToFind: "Rental on Apple TV / Amazon, some streaming services",
  },
  {
    id: "m-el-secreto-de-sus-ojos",
    title: "El secreto de sus ojos",
    type: "movie",
    minLevel: "C1",
    maxLevel: "C2",
    region: "Argentina",
    description:
      "Juan José Campanella's Oscar-winning 2009 crime drama moving between 1970s and 1990s Buenos Aires; dense Rioplatense dialogue.",
    howToUse:
      "Watch with Spanish subtitles and pay attention to voseo and courtroom vocabulary; afterwards, argue in Spanish whether the ending is just.",
    whereToFind: "Rental on Apple TV / Amazon, some streaming services",
  },
  {
    id: "m-y-tu-mama-tambien",
    title: "Y tu mamá también",
    type: "movie",
    minLevel: "C1",
    maxLevel: "C2",
    region: "Mexico",
    description:
      "Alfonso Cuarón's 2001 road movie about two teenagers and an older woman traveling to the coast; very fast, slang-heavy Mexican Spanish (adult content).",
    howToUse:
      "Watch with Spanish subtitles and focus on the narrator's formal voice-over versus the boys' slang; transcribe one minute of each and compare registers.",
    whereToFind: "Rental on Apple TV / Amazon, some streaming services",
  },

  // ───────── YouTube for upper levels ─────────
  {
    id: "m-luisito-comunica",
    title: "Luisito Comunica",
    type: "youtube",
    minLevel: "B2",
    maxLevel: "C1",
    region: "Mexico",
    description:
      "One of the most popular Mexican YouTubers; energetic travel and food vlogs from around the world with lots of casual Mexican expressions.",
    howToUse:
      "Watch with auto-generated Spanish captions and note every colloquial expression; try re-narrating a short segment in more neutral, formal Spanish.",
    whereToFind: "YouTube",
  },
  {
    id: "m-kurzgesagt-es",
    title: "En Pocas Palabras – Kurzgesagt",
    type: "youtube",
    minLevel: "B2",
    maxLevel: "C1",
    region: "Neutral",
    description:
      "The official Spanish-language channel of Kurzgesagt, with animated explainers on science, space, and society.",
    howToUse:
      "Watch once for the idea, then again with Spanish subtitles and write a five-sentence summary using formal connectors (por ende, no obstante, cabe destacar que).",
    whereToFind: "YouTube",
  },

  // ───────── Podcasts for upper levels ─────────
  {
    id: "m-radio-ambulante",
    title: "Radio Ambulante",
    type: "podcast",
    minLevel: "B2",
    maxLevel: "C2",
    region: "Latin America (many countries)",
    description:
      "Award-winning narrative journalism podcast distributed by NPR, telling true stories from across Latin America and the U.S. with speakers from every region.",
    howToUse:
      "Use the free transcripts on the website: listen once without text, then read along; note which country each speaker is from and one accent feature you noticed.",
    whereToFind: "Spotify, Apple Podcasts, radioambulante.org",
  },
  {
    id: "m-el-hilo",
    title: "El hilo",
    type: "podcast",
    minLevel: "B2",
    maxLevel: "C2",
    region: "Latin America",
    description:
      "Weekly news podcast from the Radio Ambulante team that explains one major Latin American story in depth.",
    howToUse:
      "After each episode, write a 100-word summary in Spanish and list the key political or economic vocabulary it introduced.",
    whereToFind: "Spotify, Apple Podcasts, elhilo.audio",
  },

  // ───────── News ─────────
  {
    id: "m-bbc-mundo",
    title: "BBC News Mundo",
    type: "news",
    minLevel: "B2",
    maxLevel: "C2",
    region: "Neutral (Latin American focus)",
    description:
      "The BBC's Spanish-language news service, written in neutral Latin American Spanish with explainers and features alongside breaking news.",
    howToUse:
      "Read one article a day and summarize it aloud in one minute; save any new collocations (tomar medidas, poner en marcha) to your review list.",
    whereToFind: "bbc.com/mundo, YouTube",
  },
  {
    id: "m-cnn-en-espanol",
    title: "CNN en Español",
    type: "news",
    minLevel: "B2",
    maxLevel: "C2",
    region: "Neutral (Latin America)",
    description:
      "24-hour Spanish-language news network with anchors from across Latin America, plus articles and video on its website.",
    howToUse:
      "Watch a two-minute news clip, pause, and repeat the anchor's sentences with the same rhythm; then state the facts in your own words.",
    whereToFind: "cnnespanol.cnn.com, YouTube, cable TV",
  },
  {
    id: "m-dw-espanol",
    title: "DW Español",
    type: "news",
    minLevel: "B2",
    maxLevel: "C1",
    region: "Neutral (Latin America)",
    description:
      "Deutsche Welle's Spanish-language service, with news, documentaries, and explainers aimed at Latin American audiences.",
    howToUse:
      "Watch a short documentary segment and write down five opinions expressed; then agree or disagree with each in Spanish using subjunctive (no creo que...).",
    whereToFind: "dw.com/es, YouTube",
  },
  {
    id: "m-el-pais",
    title: "El País",
    type: "news",
    minLevel: "C1",
    maxLevel: "C2",
    region: "Spain (with an América edition)",
    description:
      "Spain's leading newspaper, with a dedicated América edition covering Latin America; long-form reporting and opinion columns.",
    howToUse:
      "Read one opinion column a week and outline its argument: premise, evidence, conclusion; note how the writer uses relative pronouns and nominalizations.",
    whereToFind: "elpais.com (América edition available)",
  },

  // ───────── Music for upper levels ─────────
  {
    id: "m-latinoamerica-calle-13",
    title: "\"Latinoamérica\" – Calle 13",
    type: "music",
    minLevel: "B2",
    maxLevel: "C1",
    region: "Puerto Rico / Latin America",
    description:
      "Anthem-like song celebrating Latin American identity, with dense imagery and references to history and geography.",
    howToUse:
      "Study the lyrics verse by verse and research every reference; then write a short paragraph in Spanish about your own region using the same 'Soy...' structure.",
    whereToFind: "Spotify, Apple Music, YouTube",
  },
  {
    id: "m-pedro-navaja",
    title: "\"Pedro Navaja\" – Rubén Blades",
    type: "music",
    minLevel: "C1",
    maxLevel: "C2",
    region: "Panama / New York salsa",
    description:
      "Classic salsa story-song from the album Siembra (with Willie Colón) narrating a street crime with a twist ending; rich in slang and storytelling.",
    howToUse:
      "Treat it like a short story: read the lyrics, identify the narrator's use of tenses, and retell the plot in formal Spanish.",
    whereToFind: "Spotify, Apple Music, YouTube",
  },

  // ───────── Literature ─────────
  {
    id: "m-cronica-muerte-anunciada",
    title: "Crónica de una muerte anunciada (Gabriel García Márquez)",
    type: "book",
    minLevel: "B2",
    maxLevel: "C1",
    region: "Colombia",
    description:
      "Short novella reconstructing a murder that everyone in town knew was coming; a manageable first taste of García Márquez.",
    howToUse:
      "Read one section per sitting and keep a timeline of events; note how the narrator mixes pluperfect and conditional to talk about what could have been prevented.",
    whereToFind: "Bookstores, libraries, Amazon/Kindle",
  },
  {
    id: "m-como-agua-para-chocolate",
    title: "Como agua para chocolate (Laura Esquivel)",
    type: "book",
    minLevel: "B2",
    maxLevel: "C1",
    region: "Mexico",
    description:
      "Novel in monthly installments, each opening with a recipe, about Tita and forbidden love during the Mexican Revolution; blends cooking and magical realism.",
    howToUse:
      "Read one chapter a month (as the book is structured) or a week, and cook or summarize its recipe in Spanish using impersonal se (se pica la cebolla...).",
    whereToFind: "Bookstores, libraries, Amazon/Kindle; 1992 film adaptation",
  },
  {
    id: "m-la-casa-de-los-espiritus",
    title: "La casa de los espíritus (Isabel Allende)",
    type: "book",
    minLevel: "C1",
    maxLevel: "C2",
    region: "Chile",
    description:
      "Isabel Allende's 1982 multigenerational saga of the Trueba family, spanning decades of Chilean political history.",
    howToUse:
      "Keep a family tree as you read and write a short character sketch for each generation; mark every use of the subjunctive in hypothetical passages.",
    whereToFind: "Bookstores, libraries, Amazon/Kindle",
  },
  {
    id: "m-cien-anos-de-soledad",
    title: "Cien años de soledad (Gabriel García Márquez)",
    type: "book",
    minLevel: "C1",
    maxLevel: "C2",
    region: "Colombia",
    description:
      "The landmark 1967 novel of magical realism following the Buendía family in the fictional town of Macondo.",
    howToUse:
      "Keep a Buendía family tree (many names repeat) and read 10 pages a day; after finishing, compare a chapter with the Netflix series adaptation (2024).",
    whereToFind: "Bookstores, libraries, Amazon/Kindle; Netflix series",
  },
  {
    id: "m-pedro-paramo",
    title: "Pedro Páramo (Juan Rulfo)",
    type: "book",
    minLevel: "C1",
    maxLevel: "C2",
    region: "Mexico",
    description:
      "Juan Rulfo's short, haunting 1955 novel about a man searching for his father in a ghost town; fragmented, poetic, and rural in style.",
    howToUse:
      "Read it twice: first straight through, then while labeling each fragment by narrator and time period; note rural Mexican vocabulary.",
    whereToFind: "Bookstores, libraries, Amazon/Kindle",
  },
  {
    id: "m-ficciones",
    title: "Ficciones (Jorge Luis Borges)",
    type: "book",
    minLevel: "C2",
    maxLevel: "C2",
    region: "Argentina",
    description:
      "Borges's 1944 collection of philosophical short stories (\"La biblioteca de Babel\", \"El jardín de senderos que se bifurcan\") written in dense, erudite prose.",
    howToUse:
      "Read one story slowly with a monolingual dictionary (RAE) at hand, then write a one-paragraph interpretation in Spanish using academic connectors.",
    whereToFind: "Bookstores, libraries, Amazon/Kindle",
  },
];
