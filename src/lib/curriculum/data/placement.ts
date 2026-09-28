import type { PlacementItem } from "../types";

/** 30 items, 5 per CEFR level, ordered from easiest to hardest. */
export const placementItems: PlacementItem[] = [
  // ───────── A1 ─────────
  {
    id: "p-a1-1",
    cefr: "A1",
    instruction: "Choose the correct translation",
    question: "¿Cómo te llamas?",
    options: ["How old are you?", "What is your name?", "Where are you from?", "How are you?"],
    answerIndex: 1,
  },
  {
    id: "p-a1-2",
    cefr: "A1",
    instruction: "Choose the correct Spanish translation",
    question: "the red car",
    options: ["el carro rojo", "el rojo carro", "la carro roja", "los carro rojos"],
    answerIndex: 0,
  },
  {
    id: "p-a1-3",
    cefr: "A1",
    instruction: "Choose the correct form to complete the sentence",
    question: "Nosotros ___ estudiantes.",
    options: ["es", "son", "somos", "están"],
    answerIndex: 2,
  },
  {
    id: "p-a1-4",
    cefr: "A1",
    instruction: "Choose the correct form to complete the sentence",
    question: "María ___ en la cocina ahora.",
    options: ["es", "hay", "estoy", "está"],
    answerIndex: 3,
  },
  {
    id: "p-a1-5",
    cefr: "A1",
    instruction: "Read and answer the question",
    question:
      "Me llamo Luis. Tengo veinte años y vivo en Lima con mi hermana.\n\nWho does Luis live with?",
    options: ["With his mother", "Alone", "With his sister", "With a friend"],
    answerIndex: 2,
  },

  // ───────── A2 ─────────
  {
    id: "p-a2-1",
    cefr: "A2",
    instruction: "Choose the correct form to complete the sentence",
    question: "Ayer yo ___ al cine con mis amigos.",
    options: ["voy", "fui", "fue", "iré"],
    answerIndex: 1,
  },
  {
    id: "p-a2-2",
    cefr: "A2",
    instruction: "Choose the best meaning",
    question: "Tengo que madrugar mañana.",
    options: [
      "I have to get up early tomorrow.",
      "I have to work late tomorrow.",
      "I want to sleep in tomorrow.",
      "I have to go shopping tomorrow.",
    ],
    answerIndex: 0,
  },
  {
    id: "p-a2-3",
    cefr: "A2",
    instruction: "Choose the correct form to complete the sentence",
    question: "Cuando era niño, ___ en el parque todos los días.",
    options: ["jugué", "juego", "jugara", "jugaba"],
    answerIndex: 3,
  },
  {
    id: "p-a2-4",
    cefr: "A2",
    instruction: "Choose the correct pronouns",
    question: "—¿Le diste el libro a Ana?\n—Sí, ya ___ di.",
    options: ["le lo", "la lo", "se lo", "lo le"],
    answerIndex: 2,
  },
  {
    id: "p-a2-5",
    cefr: "A2",
    instruction: "Read and answer the question",
    question:
      "El sábado pasado Carla fue al mercado, pero estaba cerrado, así que compró fruta en el supermercado.\n\nWhere did Carla buy fruit?",
    options: ["At the market", "At the supermarket", "She didn't buy any", "At a friend's house"],
    answerIndex: 1,
  },

  // ───────── B1 ─────────
  {
    id: "p-b1-1",
    cefr: "B1",
    instruction: "Choose the correct form to complete the sentence",
    question: "Espero que tú ___ un buen viaje.",
    options: ["tengas", "tienes", "tendrás", "tuviste"],
    answerIndex: 0,
  },
  {
    id: "p-b1-2",
    cefr: "B1",
    instruction: "Choose the correct form to complete the sentence",
    question: "Si tengo tiempo el fin de semana, te ___ con la mudanza.",
    options: ["ayudaría", "ayudaré", "ayudara", "haya ayudado"],
    answerIndex: 1,
  },
  {
    id: "p-b1-3",
    cefr: "B1",
    instruction: "Choose the correct preposition",
    question: "Muchas gracias ___ tu ayuda.",
    options: ["para", "a", "por", "con"],
    answerIndex: 2,
  },
  {
    id: "p-b1-4",
    cefr: "B1",
    instruction: "Choose the best meaning",
    question: "Se me olvidaron las llaves.",
    options: [
      "I left the keys behind on purpose.",
      "I forgot the keys.",
      "Someone stole my keys.",
      "I found the keys.",
    ],
    answerIndex: 1,
  },
  {
    id: "p-b1-5",
    cefr: "B1",
    instruction: "Read and answer the question",
    question:
      "Aunque el médico le recomendó descansar, Tomás volvió a la oficina al día siguiente porque tenía una reunión importante.\n\nWhy did Tomás go back to the office?",
    options: [
      "Because he felt better",
      "Because the doctor told him to",
      "Because he was bored at home",
      "Because he had an important meeting",
    ],
    answerIndex: 3,
  },

  // ───────── B2 ─────────
  {
    id: "p-b2-1",
    cefr: "B2",
    instruction: "Choose the correct form to complete the sentence",
    question: "Me sorprendió que ellos no ___ a la fiesta.",
    options: ["vinieron", "vengan", "vinieran", "venían"],
    answerIndex: 2,
  },
  {
    id: "p-b2-2",
    cefr: "B2",
    instruction: "Choose the correct form to complete the sentence",
    question: "Busco un departamento que ___ cerca del metro.",
    options: ["está", "esté", "estuviera", "estará"],
    answerIndex: 1,
  },
  {
    id: "p-b2-3",
    cefr: "B2",
    instruction: "Choose the best meaning",
    question: "Por más que lo intento, no me sale.",
    options: [
      "No matter how hard I try, I can't get it right.",
      "The more I try, the better it goes.",
      "I've stopped trying because it's too hard.",
      "I tried once and it worked.",
    ],
    answerIndex: 0,
  },
  {
    id: "p-b2-4",
    cefr: "B2",
    instruction: "Choose the correct form to complete the sentence",
    question: "Cuando ___ a casa, llámame.",
    options: ["llegas", "llegarás", "llegaste", "llegues"],
    answerIndex: 3,
  },
  {
    id: "p-b2-5",
    cefr: "B2",
    instruction: "Read and answer the question",
    question:
      "La alcaldía anunció que, a menos que aumente la inversión privada, el proyecto del nuevo tren quedará suspendido indefinidamente.\n\nWhat will happen if private investment does not increase?",
    options: [
      "The train will be built faster.",
      "The project will be put on hold indefinitely.",
      "The mayor will resign.",
      "Public funding will increase.",
    ],
    answerIndex: 1,
  },

  // ───────── C1 ─────────
  {
    id: "p-c1-1",
    cefr: "C1",
    instruction: "Choose the correct form to complete the sentence",
    question: "Si me hubieras avisado, ___ a buscarte al aeropuerto.",
    options: ["habría ido", "iría", "había ido", "haya ido"],
    answerIndex: 0,
  },
  {
    id: "p-c1-2",
    cefr: "C1",
    instruction: "Choose the correct form to complete the sentence",
    question: "Habla del tema como si ___ experto.",
    options: ["es", "sea", "fuera", "será"],
    answerIndex: 2,
  },
  {
    id: "p-c1-3",
    cefr: "C1",
    instruction: "Choose the correct word to complete the sentence",
    question: "Es una autora ___ novelas han sido traducidas a veinte idiomas.",
    options: ["cuya", "cuyas", "que sus", "la cual"],
    answerIndex: 1,
  },
  {
    id: "p-c1-4",
    cefr: "C1",
    instruction: "Choose what the speaker means",
    question: "Cuando le pregunté por su exnovia, metí la pata.",
    options: [
      "I changed the subject.",
      "I got really angry.",
      "I made everyone laugh.",
      "I said something embarrassing and inappropriate.",
    ],
    answerIndex: 3,
  },
  {
    id: "p-c1-5",
    cefr: "C1",
    instruction: "Read and answer the question",
    question:
      "Si bien el informe reconoce ciertos avances en materia educativa, advierte que, de no revertirse la deserción escolar, los logros alcanzados podrían desvanecerse en pocos años.\n\nWhat does the report warn?",
    options: [
      "That education has not improved at all",
      "That progress could be lost if school dropout rates aren't reversed",
      "That the dropout rate has already been reversed",
      "That the achievements are permanent",
    ],
    answerIndex: 1,
  },

  // ───────── C2 ─────────
  {
    id: "p-c2-1",
    cefr: "C2",
    instruction: "Choose the closest meaning of \"endebles\"",
    question: "Sus argumentos eran endebles.",
    options: ["convincing", "lengthy", "aggressive", "weak, flimsy"],
    answerIndex: 3,
  },
  {
    id: "p-c2-2",
    cefr: "C2",
    instruction: "Choose the best meaning",
    question: "Me lo dijo con retintín.",
    options: [
      "He said it with a sarcastic, needling tone.",
      "He said it very quietly.",
      "He said it several times.",
      "He said it without thinking.",
    ],
    answerIndex: 0,
  },
  {
    id: "p-c2-3",
    cefr: "C2",
    instruction: "Choose the correct form to complete the sentence",
    question: "Quienquiera que ___ el responsable, tendrá que dar explicaciones.",
    options: ["es", "fuera", "sea", "será"],
    answerIndex: 2,
  },
  {
    id: "p-c2-4",
    cefr: "C2",
    instruction: "Choose the closest English equivalent of the saying",
    question: "A buen entendedor, pocas palabras bastan.",
    options: [
      "Good listeners rarely speak.",
      "A word to the wise is enough.",
      "Understanding grammar takes few words.",
      "Silence is golden.",
    ],
    answerIndex: 1,
  },
  {
    id: "p-c2-5",
    cefr: "C2",
    instruction: "Read and answer the question",
    question:
      "Lejos de amilanarse ante las críticas, la directora redobló la apuesta y anunció una segunda temporada aún más ambiciosa.\n\nHow did the director react to the criticism?",
    options: [
      "She was discouraged and canceled the show.",
      "She apologized publicly.",
      "She doubled down with an even more ambitious plan.",
      "She ignored the ratings and took a break.",
    ],
    answerIndex: 2,
  },
];
