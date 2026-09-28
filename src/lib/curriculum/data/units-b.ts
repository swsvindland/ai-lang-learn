import type { Unit } from "../types";

export const unitsB: Unit[] = [
  // ───────────────────────────── B1-01 ─────────────────────────────
  {
    id: "b1-01",
    cefr: "B1",
    order: 17,
    title: "Contar historias de viaje",
    theme: "Travel stories and travel mishaps",
    canDo: [
      "I can tell a story about a past trip, setting the scene and narrating the events.",
      "I can describe what I was doing when something unexpected happened.",
      "I can explain a travel problem and ask for a solution.",
    ],
    grammar: [
      {
        id: "g-b1-01-1",
        title: "Preterite vs. imperfect in stories",
        summary:
          "When you tell a story, the imperfect sets the scene and the preterite moves the plot forward. Use the imperfect for background: time, weather, age, descriptions, feelings, habits, and actions in progress (eran las diez, hacía frío, estaba cansado). Use the preterite for completed events that happen one after another (llegué, vi, salí). A classic pattern is an ongoing action interrupted by an event: Mientras esperaba (imperfect), sonó (preterite) mi teléfono.",
        examples: [
          {
            es: "Eran las once de la noche y llovía mucho cuando llegamos al aeropuerto.",
            en: "It was eleven at night and it was raining hard when we arrived at the airport.",
          },
          {
            es: "Mientras hacía fila en la aduana, alguien me robó la cartera.",
            en: "While I was standing in line at customs, someone stole my wallet.",
          },
          {
            es: "Estaba muy cansada, así que me acosté temprano.",
            en: "I was very tired, so I went to bed early.",
          },
        ],
        drills: [
          {
            es: "Cuando ___ niño, pasaba los veranos en la playa.",
            en: "When I was a child, I spent my summers at the beach.",
            answer: "era",
            distractors: ["fui", "fue"],
          },
          {
            es: "Yo dormía tranquilamente cuando de repente el piloto ___ una emergencia.",
            en: "I was sleeping peacefully when suddenly the pilot announced an emergency.",
            answer: "anunció",
            distractors: ["anunciaba", "anuncia"],
          },
          {
            es: "Ayer mi vuelo ___ con tres horas de retraso.",
            en: "Yesterday my flight left three hours late.",
            answer: "salió",
            distractors: ["salía", "sale"],
          },
          {
            es: "El cielo estaba gris y ___ mucho frío.",
            en: "The sky was gray and it was very cold.",
            answer: "hacía",
            distractors: ["hizo", "hace"],
          },
          {
            es: "Todos los días mi abuela nos ___ historias de su pueblo.",
            en: "Every day my grandmother used to tell us stories about her hometown.",
            answer: "contaba",
            distractors: ["contó", "cuenta"],
          },
        ],
      },
      {
        id: "g-b1-01-2",
        title: "Verbs that change meaning in the preterite",
        summary:
          "A few verbs shift meaning depending on which past tense you use. Conocer: conocía = I knew (someone); conocí = I met (for the first time). Saber: sabía = I knew; supe = I found out. Querer: quería = I wanted; no quise = I refused. Poder: podía = I was able to (in general); pude = I managed to; no pude = I tried but failed.",
        examples: [
          {
            es: "Conocí a mi esposo en un vuelo a Lima.",
            en: "I met my husband on a flight to Lima.",
          },
          {
            es: "Supimos la noticia por la mañana.",
            en: "We found out the news in the morning.",
          },
          {
            es: "Intenté abrir la maleta, pero no pude.",
            en: "I tried to open the suitcase, but I couldn't.",
          },
          {
            es: "Ella no quiso pagar el cargo extra.",
            en: "She refused to pay the extra charge.",
          },
        ],
        drills: [
          {
            es: "¿Dónde ___ a tu mejor amiga?",
            en: "Where did you meet your best friend?",
            answer: "conociste",
            distractors: ["conocías", "conoces"],
          },
          {
            es: "Ayer ___ que mi vuelo estaba cancelado.",
            en: "Yesterday I found out that my flight was canceled.",
            answer: "supe",
            distractors: ["sabía", "sé"],
          },
          {
            es: "Después de muchas horas, por fin ___ dormir un poco.",
            en: "After many hours, I finally managed to sleep a little.",
            answer: "pude",
            distractors: ["podía", "puedo"],
          },
          {
            es: "Le ofrecí ayuda, pero él no ___ aceptarla.",
            en: "I offered him help, but he refused to accept it.",
            answer: "quiso",
            distractors: ["quería", "quiere"],
          },
          {
            es: "De niña, ya ___ nadar muy bien.",
            en: "As a girl, I already knew how to swim very well.",
            answer: "sabía",
            distractors: ["supe", "sé"],
          },
        ],
      },
    ],
    vocab: [
      {
        id: "v-b1-01-01",
        es: "retraso",
        en: "delay",
        pos: "noun",
        gender: "m",
        example: {
          es: "El vuelo tuvo un retraso de tres horas.",
          en: "The flight had a three-hour delay.",
        },
      },
      {
        id: "v-b1-01-02",
        es: "escala",
        en: "layover, stopover",
        pos: "noun",
        gender: "f",
        example: {
          es: "Hicimos escala en Panamá antes de llegar a Lima.",
          en: "We had a layover in Panama before arriving in Lima.",
        },
      },
      {
        id: "v-b1-01-03",
        es: "aduana",
        en: "customs",
        pos: "noun",
        gender: "f",
        example: {
          es: "En la aduana revisaron todas mis maletas.",
          en: "At customs they checked all my suitcases.",
        },
      },
      {
        id: "v-b1-01-04",
        es: "tarjeta de embarque",
        en: "boarding pass",
        pos: "noun",
        gender: "f",
        example: {
          es: "No encontraba mi tarjeta de embarque y casi pierdo el vuelo.",
          en: "I couldn't find my boarding pass and almost missed the flight.",
        },
      },
      {
        id: "v-b1-01-05",
        es: "reembolso",
        en: "refund",
        pos: "noun",
        gender: "m",
        example: {
          es: "La aerolínea me prometió un reembolso completo.",
          en: "The airline promised me a full refund.",
        },
      },
      {
        id: "v-b1-01-06",
        es: "queja",
        en: "complaint",
        pos: "noun",
        gender: "f",
        example: {
          es: "Presenté una queja porque el hotel estaba sucio.",
          en: "I filed a complaint because the hotel was dirty.",
        },
      },
      {
        id: "v-b1-01-07",
        es: "extraviar",
        en: "to lose, to misplace",
        pos: "verb",
        example: {
          es: "La aerolínea extravió mi equipaje.",
          en: "The airline lost my luggage.",
        },
      },
      {
        id: "v-b1-01-08",
        es: "equipaje de mano",
        en: "carry-on luggage",
        pos: "noun",
        gender: "m",
        example: {
          es: "Solo llevaba equipaje de mano, así que salí rápido del aeropuerto.",
          en: "I only had carry-on luggage, so I got out of the airport quickly.",
        },
      },
      {
        id: "v-b1-01-09",
        es: "alojamiento",
        en: "accommodation, lodging",
        pos: "noun",
        gender: "m",
        example: {
          es: "Buscamos alojamiento barato cerca del centro.",
          en: "We looked for cheap accommodation near downtown.",
        },
      },
      {
        id: "v-b1-01-10",
        es: "trámite",
        en: "procedure, paperwork (official)",
        pos: "noun",
        gender: "m",
        example: {
          es: "Los trámites de migración tardaron más de una hora.",
          en: "The immigration procedures took more than an hour.",
        },
      },
      {
        id: "v-b1-01-11",
        es: "de repente",
        en: "suddenly",
        pos: "adverb",
        example: {
          es: "Estábamos en la playa cuando de repente empezó a llover.",
          en: "We were at the beach when suddenly it started to rain.",
        },
      },
      {
        id: "v-b1-01-12",
        es: "mientras tanto",
        en: "meanwhile",
        pos: "adverb",
        example: {
          es: "Mi esposo buscaba un taxi; mientras tanto, yo cuidaba las maletas.",
          en: "My husband was looking for a taxi; meanwhile, I was watching the suitcases.",
        },
      },
      {
        id: "v-b1-01-13",
        es: "darse cuenta (de)",
        en: "to realize",
        pos: "phrase",
        example: {
          es: "Cuando llegué al hotel, me di cuenta de que no tenía mi pasaporte.",
          en: "When I got to the hotel, I realized I didn't have my passport.",
        },
      },
      {
        id: "v-b1-01-14",
        es: "asustarse",
        en: "to get scared",
        pos: "verb",
        example: {
          es: "Me asusté mucho cuando el avión empezó a moverse.",
          en: "I got really scared when the plane started to shake.",
        },
      },
      {
        id: "v-b1-01-15",
        es: "anécdota",
        en: "anecdote, story",
        pos: "noun",
        gender: "f",
        example: {
          es: "Mi abuelo siempre cuenta anécdotas de sus viajes.",
          en: "My grandfather always tells stories about his trips.",
        },
      },
      {
        id: "v-b1-01-16",
        es: "al final",
        en: "in the end",
        pos: "phrase",
        example: {
          es: "Hubo muchos problemas, pero al final todo salió bien.",
          en: "There were lots of problems, but in the end everything turned out fine.",
        },
      },
      {
        id: "v-b1-01-17",
        es: "perderse",
        en: "to get lost",
        pos: "verb",
        example: {
          es: "Nos perdimos en el centro de Quito porque no teníamos mapa.",
          en: "We got lost in downtown Quito because we didn't have a map.",
        },
      },
    ],
    scenario: {
      title: "Lost luggage at the airport",
      setting:
        "You just landed in Mexico City, but your suitcase didn't arrive. You're at the airline's baggage service desk.",
      aiRole: "An airline baggage service agent",
      learnerGoal:
        "Explain what happened on your trip, describe your suitcase, and find out when and how you'll get it back.",
      opener:
        "Buenas tardes. Lamento mucho lo de su maleta. ¿Me podría contar qué pasó? ¿De dónde venía su vuelo y dónde hizo escala?",
    },
  },

  // ───────────────────────────── B1-02 ─────────────────────────────
  {
    id: "b1-02",
    cefr: "B1",
    order: 18,
    title: "Favores entre familia y amigos",
    theme: "Family, friends, and relationships",
    canDo: [
      "I can ask for and offer favors among friends and family.",
      "I can talk about giving, lending, and returning things without repeating nouns.",
      "I can describe my relationships with family members, partners, and in-laws.",
    ],
    grammar: [
      {
        id: "g-b1-02-1",
        title: "Indirect object pronouns",
        summary:
          "Indirect object pronouns tell you to whom or for whom something is done: me, te, le, nos, les. Because le and les can be ambiguous, Spanish often adds a phrase with a to clarify, even when it seems redundant: Le presté dinero a mi hermano. Like direct object pronouns, they go before a conjugated verb or attach to an infinitive or gerund: Te voy a escribir = Voy a escribirte.",
        examples: [
          {
            es: "Le pedí un favor a mi vecina.",
            en: "I asked my neighbor for a favor.",
          },
          {
            es: "¿Nos puedes prestar tu carro este fin de semana?",
            en: "Can you lend us your car this weekend?",
          },
          {
            es: "Mis suegros siempre les compran regalos a los niños.",
            en: "My in-laws always buy the kids presents.",
          },
        ],
        drills: [
          {
            es: "Ayer ___ escribí un mensaje a mis padres.",
            en: "Yesterday I wrote my parents a message.",
            answer: "les",
            distractors: ["le", "los", "me"],
          },
          {
            es: "¿___ puedes explicar el problema? No entiendo nada.",
            en: "Can you explain the problem to me? I don't understand anything.",
            answer: "Me",
            distractors: ["Te", "Lo"],
          },
          {
            es: "Mi jefe ___ dio un día libre a Marta.",
            en: "My boss gave Marta a day off.",
            answer: "le",
            distractors: ["la", "les"],
          },
          {
            es: "Carlos, ¿qué ___ regalaron tus amigos para tu cumpleaños?",
            en: "Carlos, what did your friends give you for your birthday?",
            answer: "te",
            distractors: ["le", "me"],
          },
        ],
      },
      {
        id: "g-b1-02-2",
        title: "Double object pronouns",
        summary:
          "When you use an indirect and a direct object pronoun together, the indirect one comes first: Me lo dio (He gave it to me). If both start with l-, le or les changes to se: instead of le lo, say se lo (Se lo expliqué = I explained it to him/her/them). The two pronouns stay together: before a conjugated verb, or attached to an infinitive, gerund, or affirmative command, which often needs a written accent: Voy a dártelo, Dímelo.",
        examples: [
          {
            es: "¿El libro? Te lo devuelvo mañana.",
            en: "The book? I'll give it back to you tomorrow.",
          },
          {
            es: "Mi hermana necesitaba dinero, así que se lo presté.",
            en: "My sister needed money, so I lent it to her.",
          },
          {
            es: "¿Las fotos de la boda? Nos las mandaron ayer.",
            en: "The wedding photos? They sent them to us yesterday.",
          },
        ],
        drills: [
          {
            es: "—¿Le diste las llaves a Pedro? —Sí, ya ___ di.",
            en: "—Did you give Pedro the keys? —Yes, I already gave them to him.",
            answer: "se las",
            distractors: ["le las", "se los", "les las"],
          },
          {
            es: "—¿Quién te regaló ese reloj? —Mi abuelo ___ regaló.",
            en: "—Who gave you that watch? —My grandfather gave it to me.",
            answer: "me lo",
            distractors: ["me la", "te lo", "se lo"],
          },
          {
            es: "Necesito el informe. ¿___ puedes mandar hoy?",
            en: "I need the report. Can you send it to me today?",
            answer: "Me lo",
            distractors: ["Me la", "Se lo", "Lo me"],
          },
          {
            es: "Los niños quieren un perro, pero no ___ vamos a comprar.",
            en: "The kids want a dog, but we're not going to buy it for them.",
            answer: "se lo",
            distractors: ["les lo", "se los", "los lo"],
          },
          {
            es: "—¿Nos explicas las reglas? —Claro, ahora ___ explico.",
            en: "—Will you explain the rules to us? —Sure, I'll explain them to you all now.",
            answer: "se las",
            distractors: ["les las", "nos las", "se los"],
          },
        ],
      },
    ],
    vocab: [
      {
        id: "v-b1-02-01",
        es: "prestar",
        en: "to lend",
        pos: "verb",
        example: {
          es: "¿Me prestas tu paraguas? Está lloviendo mucho.",
          en: "Can you lend me your umbrella? It's raining hard.",
        },
      },
      {
        id: "v-b1-02-02",
        es: "pedir prestado",
        en: "to borrow",
        pos: "phrase",
        example: {
          es: "Le pedí prestado el carro a mi hermano.",
          en: "I borrowed my brother's car.",
        },
      },
      {
        id: "v-b1-02-03",
        es: "agradecer",
        en: "to thank, to be grateful for",
        pos: "verb",
        example: {
          es: "Te agradezco mucho tu ayuda.",
          en: "I really appreciate your help.",
        },
      },
      {
        id: "v-b1-02-04",
        es: "confianza",
        en: "trust, confidence",
        pos: "noun",
        gender: "f",
        example: {
          es: "Entre nosotros hay mucha confianza.",
          en: "There's a lot of trust between us.",
        },
      },
      {
        id: "v-b1-02-05",
        es: "apoyo",
        en: "support",
        pos: "noun",
        gender: "m",
        example: {
          es: "Mi familia siempre me dio su apoyo.",
          en: "My family always gave me their support.",
        },
      },
      {
        id: "v-b1-02-06",
        es: "suegro",
        en: "father-in-law (suegros = in-laws)",
        pos: "noun",
        gender: "m",
        example: {
          es: "Mi suegro nos ayudó a pintar la casa.",
          en: "My father-in-law helped us paint the house.",
        },
      },
      {
        id: "v-b1-02-07",
        es: "cuñado",
        en: "brother-in-law",
        pos: "noun",
        gender: "m",
        example: {
          es: "Mi cuñado vive en Chile con mi hermana.",
          en: "My brother-in-law lives in Chile with my sister.",
        },
      },
      {
        id: "v-b1-02-08",
        es: "compromiso",
        en: "commitment; engagement (to be married)",
        pos: "noun",
        gender: "m",
        example: {
          es: "Anunciaron su compromiso en la cena de Navidad.",
          en: "They announced their engagement at Christmas dinner.",
        },
      },
      {
        id: "v-b1-02-09",
        es: "pareja",
        en: "partner; couple",
        pos: "noun",
        gender: "f",
        example: {
          es: "Mi pareja y yo llevamos cinco años juntos.",
          en: "My partner and I have been together for five years.",
        },
      },
      {
        id: "v-b1-02-10",
        es: "discutir",
        en: "to argue; to discuss",
        pos: "verb",
        example: {
          es: "Mis padres discuten por cosas pequeñas.",
          en: "My parents argue about little things.",
        },
      },
      {
        id: "v-b1-02-11",
        es: "reconciliarse",
        en: "to make up, to reconcile",
        pos: "verb",
        example: {
          es: "Después de la pelea, se reconciliaron.",
          en: "After the fight, they made up.",
        },
      },
      {
        id: "v-b1-02-12",
        es: "extrañar",
        en: "to miss (someone or something)",
        pos: "verb",
        example: {
          es: "Extraño mucho a mis amigos de la universidad.",
          en: "I really miss my college friends.",
        },
      },
      {
        id: "v-b1-02-13",
        es: "cariño",
        en: "affection; (as a nickname) dear, honey",
        pos: "noun",
        gender: "m",
        example: {
          es: "Les tengo mucho cariño a mis sobrinos.",
          en: "I'm very fond of my nieces and nephews.",
        },
      },
      {
        id: "v-b1-02-14",
        es: "malentendido",
        en: "misunderstanding",
        pos: "noun",
        gender: "m",
        example: {
          es: "Todo fue un malentendido; no estaba enojada contigo.",
          en: "It was all a misunderstanding; I wasn't mad at you.",
        },
      },
      {
        id: "v-b1-02-15",
        es: "llevarse bien",
        en: "to get along well",
        pos: "phrase",
        example: {
          es: "Me llevo muy bien con mi suegra.",
          en: "I get along really well with my mother-in-law.",
        },
      },
      {
        id: "v-b1-02-16",
        es: "soltero",
        en: "single (unmarried)",
        pos: "adjective",
        example: {
          es: "Mi prima sigue soltera y está feliz así.",
          en: "My cousin is still single and she's happy that way.",
        },
      },
      {
        id: "v-b1-02-17",
        es: "echar una mano",
        en: "to lend a hand, to help out",
        pos: "phrase",
        example: {
          es: "¿Me echas una mano con la mudanza?",
          en: "Can you give me a hand with the move?",
        },
      },
    ],
    scenario: {
      title: "Asking a friend for a favor",
      setting:
        "You're moving next weekend and need help. You call a close friend to ask to borrow their car, and you also still have a book you borrowed from them months ago.",
      aiRole: "Daniela, your longtime friend, who is friendly but likes to tease you",
      learnerGoal:
        "Ask to borrow the car, agree on when you'll give it back, and apologize for keeping the book so long, using object pronouns naturally (te lo devuelvo, me lo prestas).",
      opener:
        "¡Hola! ¡Qué milagro! Hace semanas que no sé nada de ti. ¿Todo bien? ¿En qué te puedo ayudar?",
    },
  },

  // ───────────────────────────── B1-03 ─────────────────────────────
  {
    id: "b1-03",
    cefr: "B1",
    order: 19,
    title: "Metas profesionales y el futuro",
    theme: "Careers, job searching, and professional goals",
    canDo: [
      "I can talk about my professional goals and future plans.",
      "I can make predictions and promises.",
      "I can speculate about what is probably happening right now.",
    ],
    grammar: [
      {
        id: "g-b1-03-1",
        title: "The simple future",
        summary:
          "The simple future adds the same endings to the whole infinitive for all verbs: -é, -ás, -á, -emos, -án (trabajaré, comerás, vivirá, iremos, serán). Some common verbs use an irregular stem with those same endings: tener → tendr-, poder → podr-, salir → saldr-, venir → vendr-, poner → pondr-, saber → sabr-, querer → querr-, hacer → har-, decir → dir-, haber → habr-. In everyday speech, ir a + infinitive is more common for near plans; the simple future sounds more formal or distant, and is typical for predictions and promises.",
        examples: [
          {
            es: "El año que viene tendré más experiencia y podré pedir un ascenso.",
            en: "Next year I'll have more experience and I'll be able to ask for a promotion.",
          },
          {
            es: "Te prometo que haré todo lo posible.",
            en: "I promise you I'll do everything I can.",
          },
          {
            es: "¿Crees que la empresa contratará a más gente?",
            en: "Do you think the company will hire more people?",
          },
        ],
        drills: [
          {
            es: "En cinco años, ___ mi propia empresa.",
            en: "In five years, I'll have my own company.",
            answer: "tendré",
            distractors: ["teneré", "tenía", "tuve"],
          },
          {
            es: "¿Qué ___ ustedes después de graduarse?",
            en: "What will you all do after graduating?",
            answer: "harán",
            distractors: ["hacerán", "hicieron", "hacían"],
          },
          {
            es: "Mañana te ___ qué decidió el comité.",
            en: "Tomorrow I'll tell you what the committee decided.",
            answer: "diré",
            distractors: ["deciré", "dije", "diría"],
          },
          {
            es: "Nosotros no ___ venir a la fiesta porque trabajamos ese día.",
            en: "We won't be able to come to the party because we work that day.",
            answer: "podremos",
            distractors: ["poderemos", "pudimos", "pudiéramos"],
          },
          {
            es: "Si todo sale bien, Ana ___ a la nueva oficina en marzo.",
            en: "If all goes well, Ana will come to the new office in March.",
            answer: "vendrá",
            distractors: ["venirá", "vino", "vendría"],
          },
        ],
      },
      {
        id: "g-b1-03-2",
        title: "The future of probability",
        summary:
          "Spanish also uses the future tense to guess or wonder about the present. ¿Dónde estará Juan? means 'I wonder where Juan is,' and Estará en el tráfico means 'He's probably stuck in traffic.' This is very common in conversation when you're speculating, and it doesn't refer to the future at all.",
        examples: [
          {
            es: "No contesta el teléfono. Estará en una reunión.",
            en: "He's not answering his phone. He's probably in a meeting.",
          },
          {
            es: "¿Qué hora será? Ya tengo hambre.",
            en: "I wonder what time it is. I'm already hungry.",
          },
          {
            es: "La nueva gerente tendrá unos cuarenta años.",
            en: "The new manager must be about forty.",
          },
        ],
        drills: [
          {
            es: "—¿Por qué no vino Sofía hoy? —No sé, ___ enferma.",
            en: "—Why didn't Sofía come today? —I don't know, she's probably sick.",
            answer: "estará",
            distractors: ["estuvo", "estaría"],
          },
          {
            es: "¿Cuánto ___ un departamento en este barrio?",
            en: "I wonder how much an apartment costs in this neighborhood.",
            answer: "costará",
            distractors: ["costaba", "costó"],
          },
          {
            es: "Hay mucha gente en la oficina del director. ___ algún problema.",
            en: "There are a lot of people in the director's office. There's probably some problem.",
            answer: "Habrá",
            distractors: ["Haberá", "Hubo"],
          },
          {
            es: "—¿Quién es ese señor? —No sé, ___ el nuevo cliente.",
            en: "—Who's that man? —I don't know, he must be the new client.",
            answer: "será",
            distractors: ["fue", "era"],
          },
        ],
      },
    ],
    vocab: [
      {
        id: "v-b1-03-01",
        es: "ascenso",
        en: "promotion",
        pos: "noun",
        gender: "m",
        example: {
          es: "Después de tres años, por fin me dieron un ascenso.",
          en: "After three years, they finally gave me a promotion.",
        },
      },
      {
        id: "v-b1-03-02",
        es: "meta",
        en: "goal",
        pos: "noun",
        gender: "f",
        example: {
          es: "Mi meta es hablar español con fluidez.",
          en: "My goal is to speak Spanish fluently.",
        },
      },
      {
        id: "v-b1-03-03",
        es: "plazo",
        en: "deadline; period of time",
        pos: "noun",
        gender: "m",
        example: {
          es: "El plazo para enviar la solicitud termina el viernes.",
          en: "The deadline to send the application is Friday.",
        },
      },
      {
        id: "v-b1-03-04",
        es: "sueldo",
        en: "salary, wages",
        pos: "noun",
        gender: "m",
        example: {
          es: "El sueldo es bueno, pero el horario es muy largo.",
          en: "The salary is good, but the hours are very long.",
        },
      },
      {
        id: "v-b1-03-05",
        es: "jubilarse",
        en: "to retire",
        pos: "verb",
        example: {
          es: "Mi papá se jubilará el próximo año.",
          en: "My dad will retire next year.",
        },
      },
      {
        id: "v-b1-03-06",
        es: "emprendedor",
        en: "entrepreneur",
        pos: "noun",
        gender: "m",
        example: {
          es: "Mi hermano es un emprendedor con muchas ideas.",
          en: "My brother is an entrepreneur with lots of ideas.",
        },
      },
      {
        id: "v-b1-03-07",
        es: "capacitación",
        en: "(job) training",
        pos: "noun",
        gender: "f",
        example: {
          es: "La empresa ofrece capacitación a los nuevos empleados.",
          en: "The company offers training to new employees.",
        },
      },
      {
        id: "v-b1-03-08",
        es: "currículum",
        en: "résumé, CV",
        pos: "noun",
        gender: "m",
        example: {
          es: "Actualicé mi currículum antes de postularme.",
          en: "I updated my résumé before applying.",
        },
      },
      {
        id: "v-b1-03-09",
        es: "postularse",
        en: "to apply (for a job or position)",
        pos: "verb",
        example: {
          es: "Me voy a postular a un puesto en un banco.",
          en: "I'm going to apply for a position at a bank.",
        },
      },
      {
        id: "v-b1-03-10",
        es: "puesto",
        en: "position, job",
        pos: "noun",
        gender: "m",
        example: {
          es: "El puesto requiere experiencia en ventas.",
          en: "The position requires sales experience.",
        },
      },
      {
        id: "v-b1-03-11",
        es: "a largo plazo",
        en: "in the long term",
        pos: "phrase",
        example: {
          es: "A largo plazo, quiero tener mi propio negocio.",
          en: "In the long term, I want to have my own business.",
        },
      },
      {
        id: "v-b1-03-12",
        es: "ahorros",
        en: "savings",
        pos: "noun",
        gender: "m",
        example: {
          es: "Usé mis ahorros para estudiar una maestría.",
          en: "I used my savings to do a master's degree.",
        },
      },
      {
        id: "v-b1-03-13",
        es: "desafío",
        en: "challenge",
        pos: "noun",
        gender: "m",
        example: {
          es: "Cambiar de carrera a los cuarenta fue un gran desafío.",
          en: "Changing careers at forty was a big challenge.",
        },
      },
      {
        id: "v-b1-03-14",
        es: "experiencia laboral",
        en: "work experience",
        pos: "noun",
        gender: "f",
        example: {
          es: "Tengo cinco años de experiencia laboral en turismo.",
          en: "I have five years of work experience in tourism.",
        },
      },
      {
        id: "v-b1-03-15",
        es: "lograr",
        en: "to achieve, to manage to",
        pos: "verb",
        example: {
          es: "Logré terminar el proyecto a tiempo.",
          en: "I managed to finish the project on time.",
        },
      },
      {
        id: "v-b1-03-16",
        es: "capaz",
        en: "capable, able",
        pos: "adjective",
        example: {
          es: "Eres capaz de mucho más de lo que crees.",
          en: "You're capable of much more than you think.",
        },
      },
      {
        id: "v-b1-03-17",
        es: "solicitud",
        en: "application; request",
        pos: "noun",
        gender: "f",
        example: {
          es: "Llené la solicitud en línea anoche.",
          en: "I filled out the application online last night.",
        },
      },
    ],
    scenario: {
      title: "Career coaching session",
      setting:
        "You're meeting a career counselor at a job center in Bogotá to talk about your professional goals and next steps.",
      aiRole: "A friendly, encouraging career counselor",
      learnerGoal:
        "Describe your experience, explain where you'll be in five years, and ask what steps you'll need to take to get there.",
      opener:
        "Mucho gusto. Cuénteme un poco sobre usted: ¿a qué se dedica ahora y qué le gustaría hacer en el futuro?",
    },
  },

  // ───────────────────────────── B1-04 ─────────────────────────────
  {
    id: "b1-04",
    cefr: "B1",
    order: 20,
    title: "Quejas y peticiones corteses",
    theme: "Customer service, complaints, and polite requests",
    canDo: [
      "I can make polite requests in shops, hotels, and on the phone.",
      "I can complain about a product or service and ask for a solution.",
      "I can give advice using 'If I were you...'.",
    ],
    grammar: [
      {
        id: "g-b1-04-1",
        title: "The conditional",
        summary:
          "The conditional expresses what would happen. Like the future, it adds endings to the whole infinitive: -ía, -ías, -ía, -íamos, -ían (hablaría, comerías, viviríamos). It uses the same irregular stems as the future: tendría, podría, saldría, vendría, pondría, sabría, querría, haría, diría, habría. Use it for hypothetical situations, for 'future in the past' (Dijo que vendría), and to soften statements: Yo no haría eso (I wouldn't do that).",
        examples: [
          {
            es: "Con más tiempo, viajaría por toda Sudamérica.",
            en: "With more time, I'd travel all over South America.",
          },
          {
            es: "¿Qué harías tú en mi lugar?",
            en: "What would you do in my place?",
          },
          {
            es: "Dijeron que el técnico vendría el martes.",
            en: "They said the technician would come on Tuesday.",
          },
        ],
        drills: [
          {
            es: "Yo que tú, ___ con el gerente.",
            en: "If I were you, I'd talk to the manager.",
            answer: "hablaría",
            distractors: ["hablaré", "hablo", "hablé"],
          },
          {
            es: "En tu lugar, yo no ___ esa tarifa.",
            en: "In your place, I wouldn't pay that fee.",
            answer: "pagaría",
            distractors: ["pagaré", "pago", "pagué"],
          },
          {
            es: "¿Qué ___ ustedes en esa situación?",
            en: "What would you all do in that situation?",
            answer: "harían",
            distractors: ["hacerían", "hacían", "harán"],
          },
          {
            es: "Me dijo que ___ temprano, pero llegó a las diez.",
            en: "He told me he would leave early, but he arrived at ten.",
            answer: "saldría",
            distractors: ["saliría", "saldrá", "salió"],
          },
        ],
      },
      {
        id: "g-b1-04-2",
        title: "Polite requests and advice",
        summary:
          "The conditional makes requests and suggestions sound more polite. Compare ¿Puede...? (Can you...?) with ¿Podría...? (Could you...?), and Quiero... (I want...) with Me gustaría... or the fixed polite form Quisiera... (I'd like...). ¿Sería posible...? (Would it be possible...?) is very useful for formal requests. For advice, use debería + infinitive (you should), or Yo que tú / Yo en tu lugar + conditional (If I were you...).",
        examples: [
          {
            es: "Me gustaría hablar con el gerente, por favor.",
            en: "I'd like to speak with the manager, please.",
          },
          {
            es: "¿Sería posible cambiar la fecha de entrega?",
            en: "Would it be possible to change the delivery date?",
          },
          {
            es: "Deberías guardar la factura por si hay algún problema.",
            en: "You should keep the receipt in case there's a problem.",
          },
        ],
        drills: [
          {
            es: "Buenas tardes, ___ cancelar mi suscripción, por favor.",
            en: "Good afternoon, I'd like to cancel my subscription, please.",
            answer: "quisiera",
            distractors: ["quiera", "quise"],
          },
          {
            es: "Si te cobraron dos veces, ___ llamar al banco.",
            en: "If they charged you twice, you should call the bank.",
            answer: "deberías",
            distractors: ["debías", "debería", "deberán"],
          },
          {
            es: "¿Me ___ traer la cuenta, por favor?",
            en: "Could you bring me the check, please?",
            answer: "podría",
            distractors: ["pueda", "pudo", "poderá"],
          },
          {
            es: "Yo en tu lugar, ___ una queja por escrito.",
            en: "If I were you, I'd file a complaint in writing.",
            answer: "pondría",
            distractors: ["ponería", "pondré", "puse"],
          },
          {
            es: "¿___ posible hablar con alguien de atención al cliente?",
            en: "Would it be possible to speak with someone from customer service?",
            answer: "Sería",
            distractors: ["Será", "Fue", "Era"],
          },
        ],
      },
    ],
    vocab: [
      {
        id: "v-b1-04-01",
        es: "atención al cliente",
        en: "customer service",
        pos: "noun",
        gender: "f",
        example: {
          es: "Llamé a atención al cliente tres veces y nadie me ayudó.",
          en: "I called customer service three times and nobody helped me.",
        },
      },
      {
        id: "v-b1-04-02",
        es: "factura",
        en: "bill, invoice; receipt",
        pos: "noun",
        gender: "f",
        example: {
          es: "Necesito una factura para la empresa.",
          en: "I need an invoice for the company.",
        },
      },
      {
        id: "v-b1-04-03",
        es: "cobrar",
        en: "to charge (money)",
        pos: "verb",
        example: {
          es: "Me cobraron dos veces por el mismo servicio.",
          en: "They charged me twice for the same service.",
        },
      },
      {
        id: "v-b1-04-04",
        es: "cargo",
        en: "charge, fee",
        pos: "noun",
        gender: "m",
        example: {
          es: "No entiendo este cargo en mi cuenta.",
          en: "I don't understand this charge on my account.",
        },
      },
      {
        id: "v-b1-04-05",
        es: "devolución",
        en: "return (of an item); refund",
        pos: "noun",
        gender: "f",
        example: {
          es: "La tienda acepta devoluciones hasta treinta días después de la compra.",
          en: "The store accepts returns up to thirty days after purchase.",
        },
      },
      {
        id: "v-b1-04-06",
        es: "garantía",
        en: "warranty, guarantee",
        pos: "noun",
        gender: "f",
        example: {
          es: "El refrigerador todavía está en garantía.",
          en: "The refrigerator is still under warranty.",
        },
      },
      {
        id: "v-b1-04-07",
        es: "descompuesto",
        en: "broken, not working (of machines)",
        pos: "adjective",
        example: {
          es: "El elevador está descompuesto otra vez.",
          en: "The elevator is out of order again.",
        },
      },
      {
        id: "v-b1-04-08",
        es: "reclamar",
        en: "to complain, to demand (what you're owed)",
        pos: "verb",
        example: {
          es: "Fui a reclamar porque el producto llegó roto.",
          en: "I went to complain because the product arrived broken.",
        },
      },
      {
        id: "v-b1-04-09",
        es: "disponible",
        en: "available",
        pos: "adjective",
        example: {
          es: "Lo siento, no hay habitaciones disponibles.",
          en: "I'm sorry, there are no rooms available.",
        },
      },
      {
        id: "v-b1-04-10",
        es: "gerente",
        en: "manager",
        pos: "noun",
        gender: "m",
        example: {
          es: "Quisiera hablar con el gerente, por favor.",
          en: "I'd like to speak with the manager, please.",
        },
      },
      {
        id: "v-b1-04-11",
        es: "solucionar",
        en: "to solve, to fix",
        pos: "verb",
        example: {
          es: "¿Me puede ayudar a solucionar este problema?",
          en: "Can you help me solve this problem?",
        },
      },
      {
        id: "v-b1-04-12",
        es: "molestia",
        en: "inconvenience, bother",
        pos: "noun",
        gender: "f",
        example: {
          es: "Disculpe las molestias.",
          en: "Sorry for the inconvenience.",
        },
      },
      {
        id: "v-b1-04-13",
        es: "por adelantado",
        en: "in advance",
        pos: "phrase",
        example: {
          es: "Hay que pagar la mitad por adelantado.",
          en: "You have to pay half in advance.",
        },
      },
      {
        id: "v-b1-04-14",
        es: "tarifa",
        en: "rate, fee",
        pos: "noun",
        gender: "f",
        example: {
          es: "La tarifa incluye el desayuno.",
          en: "The rate includes breakfast.",
        },
      },
      {
        id: "v-b1-04-15",
        es: "sucursal",
        en: "branch (of a bank or store)",
        pos: "noun",
        gender: "f",
        example: {
          es: "La sucursal del centro cierra a las seis.",
          en: "The downtown branch closes at six.",
        },
      },
      {
        id: "v-b1-04-16",
        es: "suscripción",
        en: "subscription",
        pos: "noun",
        gender: "f",
        example: {
          es: "Me cobraron la suscripción aunque la cancelé.",
          en: "They charged me for the subscription even though I canceled it.",
        },
      },
      {
        id: "v-b1-04-17",
        es: "de inmediato",
        en: "immediately",
        pos: "adverb",
        example: {
          es: "El técnico vino de inmediato.",
          en: "The technician came right away.",
        },
      },
    ],
    scenario: {
      title: "Calling customer service",
      setting:
        "Your internet provider charged you twice this month, and your connection keeps dropping. You call customer service.",
      aiRole: "A customer service representative for an internet company",
      learnerGoal:
        "Politely explain both problems, ask for a refund of the extra charge, and request that a technician come to your home.",
      opener:
        "Gracias por comunicarse con Conecta Hogar. Mi nombre es Andrés. ¿En qué le puedo ayudar hoy?",
    },
  },

  // ───────────────────────────── B1-05 ─────────────────────────────
  {
    id: "b1-05",
    cefr: "B1",
    order: 21,
    title: "En el consultorio",
    theme: "Health and medical visits",
    canDo: [
      "I can describe my symptoms and how long I've had them.",
      "I can talk about life experiences and things I haven't done yet.",
      "I can understand a doctor's basic instructions and a prescription.",
    ],
    grammar: [
      {
        id: "g-b1-05-1",
        title: "The present perfect",
        summary:
          "The present perfect ('have done') is formed with haber in the present (he, has, ha, hemos, han) plus a past participle ending in -ado for -ar verbs or -ido for -er/-ir verbs: he trabajado, has comido, ha vivido. Common irregular participles: hecho (done), dicho (said), visto (seen), escrito (written), puesto (put), vuelto (returned), roto (broken), abierto (opened), muerto (died). The two parts are never separated, and pronouns go before haber: Me he torcido el tobillo.",
        examples: [
          {
            es: "¿Has tenido fiebre esta semana?",
            en: "Have you had a fever this week?",
          },
          {
            es: "Todavía no he hecho la cita con el especialista.",
            en: "I still haven't made the appointment with the specialist.",
          },
          {
            es: "Nunca me he roto un hueso.",
            en: "I've never broken a bone.",
          },
        ],
        drills: [
          {
            es: "Ya ___ tomado la pastilla de hoy.",
            en: "I've already taken today's pill.",
            answer: "he",
            distractors: ["ha", "hay", "estoy"],
          },
          {
            es: "¿Alguna vez te has ___ un hueso?",
            en: "Have you ever broken a bone?",
            answer: "roto",
            distractors: ["rompido", "rompió", "rota"],
          },
          {
            es: "Nosotros todavía no ___ los resultados del análisis.",
            en: "We still haven't seen the test results.",
            answer: "hemos visto",
            distractors: ["hemos veído", "han visto", "habemos visto"],
          },
          {
            es: "La enfermera me ___ las instrucciones en un papel.",
            en: "The nurse has written the instructions down on a piece of paper for me.",
            answer: "ha escrito",
            distractors: ["ha escribido", "he escrito", "ha escribió"],
          },
          {
            es: "¿Ustedes ya ___ al médico este año?",
            en: "Have you all been to the doctor yet this year?",
            answer: "han ido",
            distractors: ["han ir", "ha ido", "hemos ido"],
          },
        ],
      },
      {
        id: "g-b1-05-2",
        title: "Present perfect vs. preterite in Latin America",
        summary:
          "In Spain, the present perfect is used for anything that happened 'today' or 'this week,' but most Latin Americans prefer the preterite for completed actions, even very recent ones: Hoy me levanté tarde. The present perfect is mainly used for life experiences (alguna vez, nunca), things that haven't happened yet (todavía no, aún no), and situations that continue up to now (últimamente, este año). With a specific past time such as ayer, el lunes, or en 2019, always use the preterite.",
        examples: [
          {
            es: "Ayer fui al médico y me dijo que tenía una infección.",
            en: "Yesterday I went to the doctor and he told me I had an infection.",
          },
          {
            es: "Nunca he tenido una alergia tan fuerte.",
            en: "I've never had such a strong allergy.",
          },
          {
            es: "Últimamente he dormido muy mal.",
            en: "Lately I've been sleeping really badly.",
          },
        ],
        drills: [
          {
            es: "El año pasado me ___ el tobillo jugando fútbol.",
            en: "Last year I sprained my ankle playing soccer.",
            answer: "torcí",
            distractors: ["he torcido", "torcía"],
          },
          {
            es: "Ayer ___ a la farmacia a comprar las pastillas.",
            en: "Yesterday I went to the pharmacy to buy the pills.",
            answer: "fui",
            distractors: ["he ido", "iba"],
          },
          {
            es: "¿Alguna vez ___ en un hospital?",
            en: "Have you ever been in a hospital?",
            answer: "has estado",
            distractors: ["estabas", "estás"],
          },
          {
            es: "Últimamente ___ mucho estrés en el trabajo.",
            en: "Lately I've had a lot of stress at work.",
            answer: "he tenido",
            distractors: ["tuve", "tendré"],
          },
          {
            es: "Todavía no me ___ los resultados del análisis.",
            en: "They still haven't given me the test results.",
            answer: "han dado",
            distractors: ["daban", "han dados", "dan"],
          },
        ],
      },
    ],
    vocab: [
      {
        id: "v-b1-05-01",
        es: "síntoma",
        en: "symptom",
        pos: "noun",
        gender: "m",
        example: {
          es: "¿Qué síntomas tiene y desde cuándo?",
          en: "What symptoms do you have, and since when?",
        },
      },
      {
        id: "v-b1-05-02",
        es: "receta",
        en: "prescription; recipe",
        pos: "noun",
        gender: "f",
        example: {
          es: "Sin receta no le pueden vender ese medicamento.",
          en: "They can't sell you that medication without a prescription.",
        },
      },
      {
        id: "v-b1-05-03",
        es: "recetar",
        en: "to prescribe",
        pos: "verb",
        example: {
          es: "La doctora me recetó unas pastillas para el dolor.",
          en: "The doctor prescribed me some pills for the pain.",
        },
      },
      {
        id: "v-b1-05-04",
        es: "mareado",
        en: "dizzy",
        pos: "adjective",
        example: {
          es: "Me siento mareado cuando me levanto rápido.",
          en: "I feel dizzy when I get up quickly.",
        },
      },
      {
        id: "v-b1-05-05",
        es: "tos",
        en: "cough",
        pos: "noun",
        gender: "f",
        example: {
          es: "Tengo tos desde hace una semana.",
          en: "I've had a cough for a week.",
        },
      },
      {
        id: "v-b1-05-06",
        es: "fiebre",
        en: "fever",
        pos: "noun",
        gender: "f",
        example: {
          es: "El niño tiene fiebre de treinta y nueve grados.",
          en: "The boy has a fever of thirty-nine degrees (Celsius).",
        },
      },
      {
        id: "v-b1-05-07",
        es: "alergia",
        en: "allergy",
        pos: "noun",
        gender: "f",
        example: {
          es: "Tengo alergia a la penicilina.",
          en: "I'm allergic to penicillin.",
        },
      },
      {
        id: "v-b1-05-08",
        es: "análisis de sangre",
        en: "blood test",
        pos: "noun",
        gender: "m",
        example: {
          es: "Mañana me van a hacer un análisis de sangre.",
          en: "Tomorrow they're going to do a blood test on me.",
        },
      },
      {
        id: "v-b1-05-09",
        es: "vacuna",
        en: "vaccine, shot",
        pos: "noun",
        gender: "f",
        example: {
          es: "¿Ya te pusiste la vacuna contra la gripe?",
          en: "Did you already get your flu shot?",
        },
      },
      {
        id: "v-b1-05-10",
        es: "lesión",
        en: "injury",
        pos: "noun",
        gender: "f",
        example: {
          es: "El jugador tiene una lesión en la rodilla.",
          en: "The player has a knee injury.",
        },
      },
      {
        id: "v-b1-05-11",
        es: "torcerse",
        en: "to twist, to sprain",
        pos: "verb",
        example: {
          es: "Me torcí el tobillo bajando las escaleras.",
          en: "I sprained my ankle going down the stairs.",
        },
      },
      {
        id: "v-b1-05-12",
        es: "tobillo",
        en: "ankle",
        pos: "noun",
        gender: "m",
        example: {
          es: "Tengo el tobillo muy hinchado.",
          en: "My ankle is really swollen.",
        },
      },
      {
        id: "v-b1-05-13",
        es: "hinchado",
        en: "swollen",
        pos: "adjective",
        example: {
          es: "Tenía la cara hinchada por la alergia.",
          en: "My face was swollen from the allergy.",
        },
      },
      {
        id: "v-b1-05-14",
        es: "embarazada",
        en: "pregnant",
        pos: "adjective",
        example: {
          es: "Mi hermana está embarazada de cinco meses.",
          en: "My sister is five months pregnant.",
        },
      },
      {
        id: "v-b1-05-15",
        es: "consulta",
        en: "doctor's appointment, consultation",
        pos: "noun",
        gender: "f",
        example: {
          es: "La consulta cuesta quinientos pesos.",
          en: "The consultation costs five hundred pesos.",
        },
      },
      {
        id: "v-b1-05-16",
        es: "seguro médico",
        en: "health insurance",
        pos: "noun",
        gender: "m",
        example: {
          es: "¿Su seguro médico cubre este tratamiento?",
          en: "Does your health insurance cover this treatment?",
        },
      },
      {
        id: "v-b1-05-17",
        es: "empeorar",
        en: "to get worse",
        pos: "verb",
        example: {
          es: "Si los síntomas empeoran, vuelva a la clínica.",
          en: "If the symptoms get worse, come back to the clinic.",
        },
      },
      {
        id: "v-b1-05-18",
        es: "mejorarse",
        en: "to get better, to recover",
        pos: "verb",
        example: {
          es: "¡Que te mejores pronto!",
          en: "Get well soon!",
        },
      },
    ],
    scenario: {
      title: "At the doctor's office",
      setting:
        "You haven't been feeling well for several days, so you're seeing a general practitioner at a clinic in Lima.",
      aiRole: "Dra. Paredes, a calm and thorough general practitioner",
      learnerGoal:
        "Describe your symptoms and how long you've had them, answer questions about your medical history (allergies, past injuries), and make sure you understand the prescription and instructions.",
      opener:
        "Buenos días, pase y siéntese, por favor. Dígame, ¿qué le pasa? ¿Desde cuándo se siente mal?",
    },
  },

  // ───────────────────────────── B1-06 ─────────────────────────────
  {
    id: "b1-06",
    cefr: "B1",
    order: 22,
    title: "Problemas con el departamento",
    theme: "Housing, renting, and dealing with a landlord",
    canDo: [
      "I can explain problems in my home and ask for repairs.",
      "I can say what I want, hope, or expect other people to do.",
      "I can give recommendations to someone looking for an apartment.",
    ],
    grammar: [
      {
        id: "g-b1-06-1",
        title: "Forming the present subjunctive",
        summary:
          "To form the present subjunctive, take the yo form of the present, drop the -o, and add the 'opposite' vowel endings: -ar verbs take -e (hable, hables, hable, hablemos, hablen) and -er/-ir verbs take -a (coma, comas, coma, comamos, coman; viva, vivas...). Because it starts from the yo form, irregular yo stems carry over: tengo → tenga, hago → haga, digo → diga, salgo → salga, conozco → conozca. Six verbs are fully irregular: ser → sea, ir → vaya, estar → esté, dar → dé, saber → sepa, haber → haya. Spelling changes keep the sound: buscar → busque, pagar → pague, empezar → empiece.",
        examples: [
          {
            es: "Espero que el propietario arregle la gotera pronto.",
            en: "I hope the landlord fixes the leak soon.",
          },
          {
            es: "Es importante que ustedes paguen el alquiler a tiempo.",
            en: "It's important that you all pay the rent on time.",
          },
          {
            es: "Ojalá que el nuevo departamento tenga más luz.",
            en: "I hope the new apartment gets more light.",
          },
        ],
        drills: [
          {
            es: "Quiero que el plomero ___ hoy.",
            en: "I want the plumber to come today.",
            answer: "venga",
            distractors: ["viene", "vendrá", "vena"],
          },
          {
            es: "Espero que ustedes ___ contentos en su nueva casa.",
            en: "I hope you all are happy in your new home.",
            answer: "estén",
            distractors: ["están", "sean"],
          },
          {
            es: "Es necesario que yo ___ el depósito antes del lunes.",
            en: "I need to pay the deposit before Monday.",
            answer: "pague",
            distractors: ["pago", "paga", "page"],
          },
          {
            es: "Ojalá que no ___ problemas con el contrato.",
            en: "Hopefully there won't be any problems with the lease.",
            answer: "haya",
            distractors: ["hay", "halla", "había"],
          },
          {
            es: "Mi madre quiere que yo ___ a un lugar más seguro.",
            en: "My mother wants me to move to a safer place.",
            answer: "me mude",
            distractors: ["me mudo", "me mudé", "mudarme"],
          },
        ],
      },
      {
        id: "g-b1-06-2",
        title: "Wishes, requests, and recommendations",
        summary:
          "Use the subjunctive after verbs of wanting, asking, and advising when the subject changes: Quiero que tú vengas (I want you to come). Common triggers are querer que, esperar que, preferir que, pedir que, recomendar que, sugerir que, and impersonal phrases like es importante que, es necesario que, and es mejor que. Ojalá (que) always takes the subjunctive. If there's no change of subject, use the infinitive instead: Quiero mudarme vs. Quiero que te mudes.",
        examples: [
          {
            es: "Te recomiendo que leas bien el contrato antes de firmarlo.",
            en: "I recommend you read the lease carefully before signing it.",
          },
          {
            es: "La administradora prefiere que le paguemos por transferencia.",
            en: "The property manager prefers that we pay her by bank transfer.",
          },
          {
            es: "Quiero vivir cerca del trabajo, pero mi pareja quiere que vivamos en el centro.",
            en: "I want to live near work, but my partner wants us to live downtown.",
          },
        ],
        drills: [
          {
            es: "Te recomiendo que ___ fotos del departamento antes de firmar.",
            en: "I recommend that you take photos of the apartment before signing.",
            answer: "tomes",
            distractors: ["tomas", "tomar", "tomaste"],
          },
          {
            es: "El propietario prefiere ___ el contrato en persona.",
            en: "The landlord prefers to sign the lease in person.",
            answer: "firmar",
            distractors: ["que firme", "firme", "firma"],
          },
          {
            es: "Les pido que ___ la música después de las diez.",
            en: "I'm asking you all to turn the music down after ten.",
            answer: "bajen",
            distractors: ["bajan", "bajar", "bajaron"],
          },
          {
            es: "Es mejor que nosotros ___ un departamento amueblado.",
            en: "It's better for us to look for a furnished apartment.",
            answer: "busquemos",
            distractors: ["buscamos", "buscemos", "busquamos"],
          },
          {
            es: "Ojalá que el vecino de arriba ___ más considerado.",
            en: "I hope the upstairs neighbor is more considerate.",
            answer: "sea",
            distractors: ["es", "esté", "será"],
          },
        ],
      },
    ],
    vocab: [
      {
        id: "v-b1-06-01",
        es: "propietario",
        en: "owner, landlord",
        pos: "noun",
        gender: "m",
        example: {
          es: "El propietario vive en el mismo edificio.",
          en: "The landlord lives in the same building.",
        },
      },
      {
        id: "v-b1-06-02",
        es: "inquilino",
        en: "tenant",
        pos: "noun",
        gender: "m",
        example: {
          es: "Los inquilinos se quejaron del ruido.",
          en: "The tenants complained about the noise.",
        },
      },
      {
        id: "v-b1-06-03",
        es: "alquiler",
        en: "rent (also renta in Mexico)",
        pos: "noun",
        gender: "m",
        example: {
          es: "El alquiler sube cada año.",
          en: "The rent goes up every year.",
        },
      },
      {
        id: "v-b1-06-04",
        es: "depósito",
        en: "(security) deposit",
        pos: "noun",
        gender: "m",
        example: {
          es: "Me devolvieron el depósito cuando me mudé.",
          en: "They gave me back my deposit when I moved out.",
        },
      },
      {
        id: "v-b1-06-05",
        es: "fiador",
        en: "guarantor, co-signer",
        pos: "noun",
        gender: "m",
        example: {
          es: "Para rentar aquí necesitas un fiador.",
          en: "To rent here you need a guarantor.",
        },
      },
      {
        id: "v-b1-06-06",
        es: "gotera",
        en: "leak (from a roof or ceiling)",
        pos: "noun",
        gender: "f",
        example: {
          es: "Hay una gotera en el techo del baño.",
          en: "There's a leak in the bathroom ceiling.",
        },
      },
      {
        id: "v-b1-06-07",
        es: "fuga",
        en: "leak (of water or gas)",
        pos: "noun",
        gender: "f",
        example: {
          es: "Llamamos al técnico por una fuga de gas.",
          en: "We called the technician because of a gas leak.",
        },
      },
      {
        id: "v-b1-06-08",
        es: "plomero",
        en: "plumber",
        pos: "noun",
        gender: "m",
        example: {
          es: "El plomero viene mañana a arreglar la llave del lavabo.",
          en: "The plumber is coming tomorrow to fix the sink faucet.",
        },
      },
      {
        id: "v-b1-06-09",
        es: "mantenimiento",
        en: "maintenance",
        pos: "noun",
        gender: "m",
        example: {
          es: "La cuota de mantenimiento incluye la seguridad.",
          en: "The maintenance fee includes security.",
        },
      },
      {
        id: "v-b1-06-10",
        es: "vecindario",
        en: "neighborhood",
        pos: "noun",
        gender: "m",
        example: {
          es: "Es un vecindario tranquilo y con muchos parques.",
          en: "It's a quiet neighborhood with lots of parks.",
        },
      },
      {
        id: "v-b1-06-11",
        es: "amueblado",
        en: "furnished",
        pos: "adjective",
        example: {
          es: "Busco un departamento amueblado cerca del metro.",
          en: "I'm looking for a furnished apartment near the subway.",
        },
      },
      {
        id: "v-b1-06-12",
        es: "servicios",
        en: "utilities (water, electricity, gas)",
        pos: "noun",
        gender: "m",
        example: {
          es: "El alquiler no incluye los servicios.",
          en: "The rent doesn't include utilities.",
        },
      },
      {
        id: "v-b1-06-13",
        es: "vencer",
        en: "to expire, to be due",
        pos: "verb",
        example: {
          es: "El contrato vence en diciembre.",
          en: "The lease expires in December.",
        },
      },
      {
        id: "v-b1-06-14",
        es: "desalojar",
        en: "to evict; to vacate",
        pos: "verb",
        example: {
          es: "No te pueden desalojar sin una orden judicial.",
          en: "They can't evict you without a court order.",
        },
      },
      {
        id: "v-b1-06-15",
        es: "humedad",
        en: "dampness, humidity",
        pos: "noun",
        gender: "f",
        example: {
          es: "Hay manchas de humedad en la pared del cuarto.",
          en: "There are damp stains on the bedroom wall.",
        },
      },
      {
        id: "v-b1-06-16",
        es: "ruidoso",
        en: "noisy",
        pos: "adjective",
        example: {
          es: "Los vecinos de arriba son muy ruidosos.",
          en: "The upstairs neighbors are very noisy.",
        },
      },
      {
        id: "v-b1-06-17",
        es: "mudanza",
        en: "move (moving house)",
        pos: "noun",
        gender: "f",
        example: {
          es: "La mudanza nos costó más de lo que pensábamos.",
          en: "The move cost us more than we expected.",
        },
      },
    ],
    scenario: {
      title: "Dispute with the landlord",
      setting:
        "You rent an apartment in Guadalajara. There's a leak in the bathroom ceiling, the water heater has been broken for a week, and now the landlord wants to raise the rent.",
      aiRole: "Señor Ramírez, the landlord: polite but reluctant to spend money",
      learnerGoal:
        "Explain the problems, ask him to fix them by a specific date, and negotiate the rent increase using expressions like quiero que, le pido que, and es importante que.",
      opener:
        "Buenas tardes. Me dijo mi esposa que usted quería hablar conmigo. ¿Qué pasó? ¿Hay algún problema con el departamento?",
    },
  },

  // ───────────────────────────── B1-07 ─────────────────────────────
  {
    id: "b1-07",
    cefr: "B1",
    order: 23,
    title: "El medio ambiente y nosotros",
    theme: "The environment and community issues",
    canDo: [
      "I can express my feelings about environmental and social issues.",
      "I can say what I doubt, believe, or am sure about.",
      "I can react to other people's opinions in a discussion.",
    ],
    grammar: [
      {
        id: "g-b1-07-1",
        title: "Subjunctive after emotions",
        summary:
          "When you react emotionally to what someone else does or to a situation, the verb after que goes in the subjunctive: Me alegra que recicles (I'm glad you recycle). Common triggers include me alegra que, me molesta que, me preocupa que, me sorprende que, tengo miedo de que, lamento que, es una pena que, and es increíble que. If the person feeling the emotion is the same person doing the action, use an infinitive instead: Me alegra estar aquí.",
        examples: [
          {
            es: "Me preocupa que haya tanta contaminación en la ciudad.",
            en: "It worries me that there's so much pollution in the city.",
          },
          {
            es: "Es una pena que la gente desperdicie tanta comida.",
            en: "It's a shame that people waste so much food.",
          },
          {
            es: "Me sorprende que el gobierno no haga nada contra la sequía.",
            en: "It surprises me that the government isn't doing anything about the drought.",
          },
        ],
        drills: [
          {
            es: "Me molesta que mis vecinos no ___ la basura.",
            en: "It bothers me that my neighbors don't separate their trash.",
            answer: "separen",
            distractors: ["separan", "separar", "separaron"],
          },
          {
            es: "Tengo miedo de que el río ___ otra vez este año.",
            en: "I'm afraid the river will overflow again this year.",
            answer: "se desborde",
            distractors: ["se desborda", "desbordar", "se desbordó"],
          },
          {
            es: "Nos alegra que la ciudad ___ más árboles.",
            en: "We're glad the city is planting more trees.",
            answer: "plante",
            distractors: ["planta", "plantar", "plantó"],
          },
          {
            es: "Es increíble que todavía ___ tantas bolsas de plástico.",
            en: "It's incredible that so many plastic bags are still being used.",
            answer: "se usen",
            distractors: ["se usan", "se usa", "usar"],
          },
          {
            es: "Me encanta ___ en bicicleta al trabajo.",
            en: "I love riding my bike to work.",
            answer: "ir",
            distractors: ["que vaya", "vaya", "voy"],
          },
        ],
      },
      {
        id: "g-b1-07-2",
        title: "Doubt and denial vs. certainty",
        summary:
          "Expressions of doubt, denial, or uncertainty take the subjunctive: dudo que, no creo que, no pienso que, no es cierto que, no es verdad que, es posible que, puede ser que. Expressions of certainty or belief take the indicative: creo que, pienso que, estoy seguro de que, es verdad que, es obvio que. Compare: Creo que el plan funciona vs. No creo que el plan funcione.",
        examples: [
          {
            es: "Dudo que podamos reducir las emisiones sin cambiar nuestros hábitos.",
            en: "I doubt we can reduce emissions without changing our habits.",
          },
          {
            es: "Es verdad que la energía solar es cada vez más barata.",
            en: "It's true that solar energy is getting cheaper and cheaper.",
          },
          {
            es: "No creo que el reciclaje sea suficiente.",
            en: "I don't think recycling is enough.",
          },
        ],
        drills: [
          {
            es: "Dudo que la fábrica ___ las nuevas leyes.",
            en: "I doubt the factory will respect the new laws.",
            answer: "respete",
            distractors: ["respeta", "respetará", "respetar"],
          },
          {
            es: "Estoy seguro de que el cambio climático ___ un problema grave.",
            en: "I'm sure climate change is a serious problem.",
            answer: "es",
            distractors: ["sea", "esté", "está"],
          },
          {
            es: "No creo que los autos eléctricos ___ la solución a todo.",
            en: "I don't think electric cars are the solution to everything.",
            answer: "sean",
            distractors: ["son", "estén", "serán"],
          },
          {
            es: "Es posible que ___ una sequía este verano.",
            en: "There may be a drought this summer.",
            answer: "haya",
            distractors: ["hay", "habrá", "halla"],
          },
          {
            es: "Pienso que la gente ___ más conciencia ecológica ahora.",
            en: "I think people are more environmentally aware now.",
            answer: "tiene",
            distractors: ["tenga", "tener", "tengan"],
          },
        ],
      },
    ],
    vocab: [
      {
        id: "v-b1-07-01",
        es: "medio ambiente",
        en: "the environment",
        pos: "noun",
        gender: "m",
        example: {
          es: "Todos tenemos la responsabilidad de proteger el medio ambiente.",
          en: "We all have a responsibility to protect the environment.",
        },
      },
      {
        id: "v-b1-07-02",
        es: "contaminación",
        en: "pollution",
        pos: "noun",
        gender: "f",
        example: {
          es: "La contaminación del aire es grave en la capital.",
          en: "Air pollution is serious in the capital.",
        },
      },
      {
        id: "v-b1-07-03",
        es: "residuos",
        en: "waste",
        pos: "noun",
        gender: "m",
        example: {
          es: "En mi casa separamos los residuos orgánicos.",
          en: "At home we separate out the organic waste.",
        },
      },
      {
        id: "v-b1-07-04",
        es: "calentamiento global",
        en: "global warming",
        pos: "noun",
        gender: "m",
        example: {
          es: "El calentamiento global afecta a los glaciares de los Andes.",
          en: "Global warming is affecting the glaciers in the Andes.",
        },
      },
      {
        id: "v-b1-07-05",
        es: "sequía",
        en: "drought",
        pos: "noun",
        gender: "f",
        example: {
          es: "La sequía dejó a muchos agricultores sin cosecha.",
          en: "The drought left many farmers without a harvest.",
        },
      },
      {
        id: "v-b1-07-06",
        es: "inundación",
        en: "flood",
        pos: "noun",
        gender: "f",
        example: {
          es: "Las inundaciones destruyeron varias casas cerca del río.",
          en: "The floods destroyed several houses near the river.",
        },
      },
      {
        id: "v-b1-07-07",
        es: "especie",
        en: "species",
        pos: "noun",
        gender: "f",
        example: {
          es: "Esta especie de rana está en peligro de extinción.",
          en: "This species of frog is endangered.",
        },
      },
      {
        id: "v-b1-07-08",
        es: "recursos naturales",
        en: "natural resources",
        pos: "noun",
        gender: "m",
        example: {
          es: "El país depende mucho de sus recursos naturales.",
          en: "The country depends heavily on its natural resources.",
        },
      },
      {
        id: "v-b1-07-09",
        es: "desperdiciar",
        en: "to waste",
        pos: "verb",
        example: {
          es: "Desperdiciamos demasiada agua en casa.",
          en: "We waste too much water at home.",
        },
      },
      {
        id: "v-b1-07-10",
        es: "sostenible",
        en: "sustainable",
        pos: "adjective",
        example: {
          es: "Buscamos un modelo de turismo más sostenible.",
          en: "We're looking for a more sustainable model of tourism.",
        },
      },
      {
        id: "v-b1-07-11",
        es: "energía renovable",
        en: "renewable energy",
        pos: "noun",
        gender: "f",
        example: {
          es: "Chile produce mucha energía renovable en el desierto.",
          en: "Chile produces a lot of renewable energy in the desert.",
        },
      },
      {
        id: "v-b1-07-12",
        es: "emisiones",
        en: "emissions",
        pos: "noun",
        gender: "f",
        example: {
          es: "Las fábricas deben reducir sus emisiones.",
          en: "Factories must reduce their emissions.",
        },
      },
      {
        id: "v-b1-07-13",
        es: "deforestación",
        en: "deforestation",
        pos: "noun",
        gender: "f",
        example: {
          es: "La deforestación de la Amazonía preocupa a los científicos.",
          en: "Deforestation in the Amazon worries scientists.",
        },
      },
      {
        id: "v-b1-07-14",
        es: "huella de carbono",
        en: "carbon footprint",
        pos: "noun",
        gender: "f",
        example: {
          es: "Viajar en avión aumenta tu huella de carbono.",
          en: "Flying increases your carbon footprint.",
        },
      },
      {
        id: "v-b1-07-15",
        es: "desechable",
        en: "disposable",
        pos: "adjective",
        example: {
          es: "Ya no uso vasos desechables.",
          en: "I don't use disposable cups anymore.",
        },
      },
      {
        id: "v-b1-07-16",
        es: "medida",
        en: "measure, step (action taken)",
        pos: "noun",
        gender: "f",
        example: {
          es: "El gobierno tomó medidas para ahorrar agua.",
          en: "The government took measures to save water.",
        },
      },
      {
        id: "v-b1-07-17",
        es: "conciencia",
        en: "awareness; conscience",
        pos: "noun",
        gender: "f",
        example: {
          es: "Los jóvenes tienen más conciencia ecológica que antes.",
          en: "Young people are more environmentally aware than before.",
        },
      },
    ],
    scenario: {
      title: "Neighborhood meeting",
      setting:
        "Your neighborhood association in Santiago is meeting to discuss a plan to cut down the trees in the local park to build a parking lot.",
      aiRole: "Marcela, an outspoken neighbor who supports the parking lot",
      learnerGoal:
        "Express your feelings and doubts about the plan, react to her arguments, and propose an alternative, using the subjunctive after emotions and doubt (me preocupa que, no creo que, dudo que).",
      opener:
        "¡Qué bueno que estés aquí! Mira, yo creo que el estacionamiento es una gran idea: aquí nadie encuentra dónde estacionarse. ¿Tú qué opinas?",
    },
  },

  // ───────────────────────────── B1-08 ─────────────────────────────
  {
    id: "b1-08",
    cefr: "B1",
    order: 24,
    title: "En la oficina",
    theme: "The workplace: tasks, meetings, and opinions",
    canDo: [
      "I can give instructions formally and informally, including telling someone what not to do.",
      "I can agree and disagree respectfully at work.",
      "I can talk about tasks, deadlines, and responsibilities.",
    ],
    grammar: [
      {
        id: "g-b1-08-1",
        title: "Formal commands (usted / ustedes)",
        summary:
          "Formal commands use the present subjunctive forms: hable / hablen, coma / coman, escriba / escriban. Irregular verbs follow the subjunctive too: tenga, haga, vaya, sea, esté. In affirmative commands, pronouns attach to the end of the verb, often adding a written accent: Siéntese, Envíenmelo. In negative commands, pronouns go before the verb: No se preocupe, No me lo envíen.",
        examples: [
          {
            es: "Por favor, envíeme el informe antes del viernes.",
            en: "Please send me the report before Friday.",
          },
          {
            es: "Siéntense, la reunión va a empezar.",
            en: "Have a seat, everyone; the meeting is about to start.",
          },
          {
            es: "No se preocupe, nosotros nos encargamos de todo.",
            en: "Don't worry, we'll take care of everything.",
          },
        ],
        drills: [
          {
            es: "Señora López, ___ este formulario, por favor.",
            en: "Mrs. López, please fill out this form.",
            answer: "llene",
            distractors: ["llena", "llenes", "llenar"],
          },
          {
            es: "Señores, ___ puntuales a la reunión de mañana.",
            en: "Gentlemen, please be on time for tomorrow's meeting.",
            answer: "sean",
            distractors: ["son", "estén", "sea"],
          },
          {
            es: "Si tiene preguntas, ___ a Recursos Humanos.",
            en: "If you have questions, go to Human Resources.",
            answer: "vaya",
            distractors: ["va", "ve", "ir"],
          },
          {
            es: "El contrato está listo. ___ aquí, por favor.",
            en: "The contract is ready. Please sign it here.",
            answer: "Fírmelo",
            distractors: ["Lo firme", "Firmelo", "Fírmalo"],
          },
          {
            es: "Por favor, no ___ la computadora durante la actualización.",
            en: "Please don't turn off the computer during the update (said to a group).",
            answer: "apaguen",
            distractors: ["apagan", "apagen", "apague"],
          },
        ],
      },
      {
        id: "g-b1-08-2",
        title: "Negative tú commands",
        summary:
          "Negative tú commands also use the present subjunctive: no hables, no comas, no escribas. This applies to irregular verbs too: no tengas miedo, no hagas eso, no vayas, no digas nada, no seas así. Unlike affirmative tú commands (dilo, hazlo), pronouns go before the verb in negative commands: Dímelo → No me lo digas.",
        examples: [
          {
            es: "No llegues tarde a la entrevista.",
            en: "Don't be late for the interview.",
          },
          {
            es: "No le digas nada al jefe todavía.",
            en: "Don't say anything to the boss yet.",
          },
          {
            es: "Si no estás de acuerdo, no te quedes callado.",
            en: "If you don't agree, don't stay quiet.",
          },
        ],
        drills: [
          {
            es: "No ___ miedo de dar tu opinión en la reunión.",
            en: "Don't be afraid to give your opinion in the meeting.",
            answer: "tengas",
            distractors: ["tienes", "ten", "tengues"],
          },
          {
            es: "Por favor, no ___ ese correo todavía.",
            en: "Please don't send that email yet.",
            answer: "envíes",
            distractors: ["envías", "envía", "envies"],
          },
          {
            es: "No ___ así con tus compañeros.",
            en: "Don't be like that with your coworkers.",
            answer: "seas",
            distractors: ["eres", "sé", "estés"],
          },
          {
            es: "Es un secreto: no ___ digas a nadie.",
            en: "It's a secret: don't tell it to anyone.",
            answer: "se lo",
            distractors: ["le lo", "lo se", "se la"],
          },
          {
            es: "No ___ la propuesta sin leerla bien.",
            en: "Don't sign the proposal without reading it carefully.",
            answer: "firmes",
            distractors: ["firmas", "firma", "firmé"],
          },
        ],
      },
    ],
    vocab: [
      {
        id: "v-b1-08-01",
        es: "reunión",
        en: "meeting",
        pos: "noun",
        gender: "f",
        example: {
          es: "Tenemos una reunión con el cliente a las tres.",
          en: "We have a meeting with the client at three.",
        },
      },
      {
        id: "v-b1-08-02",
        es: "compañero de trabajo",
        en: "coworker",
        pos: "noun",
        gender: "m",
        example: {
          es: "Mis compañeros de trabajo me organizaron una fiesta.",
          en: "My coworkers threw me a party.",
        },
      },
      {
        id: "v-b1-08-03",
        es: "informe",
        en: "report",
        pos: "noun",
        gender: "m",
        example: {
          es: "Tengo que entregar el informe mañana.",
          en: "I have to hand in the report tomorrow.",
        },
      },
      {
        id: "v-b1-08-04",
        es: "fecha límite",
        en: "deadline",
        pos: "noun",
        gender: "f",
        example: {
          es: "La fecha límite es el 15 de marzo.",
          en: "The deadline is March 15.",
        },
      },
      {
        id: "v-b1-08-05",
        es: "encargarse de",
        en: "to be in charge of, to take care of",
        pos: "verb",
        example: {
          es: "Yo me encargo de las reservaciones.",
          en: "I'll take care of the reservations.",
        },
      },
      {
        id: "v-b1-08-06",
        es: "entregar",
        en: "to hand in, to deliver",
        pos: "verb",
        example: {
          es: "Entregué el proyecto dos días antes.",
          en: "I handed in the project two days early.",
        },
      },
      {
        id: "v-b1-08-07",
        es: "propuesta",
        en: "proposal",
        pos: "noun",
        gender: "f",
        example: {
          es: "El cliente aceptó nuestra propuesta.",
          en: "The client accepted our proposal.",
        },
      },
      {
        id: "v-b1-08-08",
        es: "horas extra",
        en: "overtime",
        pos: "noun",
        gender: "f",
        example: {
          es: "Esta semana hice diez horas extra.",
          en: "This week I worked ten hours of overtime.",
        },
      },
      {
        id: "v-b1-08-09",
        es: "renunciar",
        en: "to resign, to quit",
        pos: "verb",
        example: {
          es: "Renunció porque encontró un trabajo mejor.",
          en: "She quit because she found a better job.",
        },
      },
      {
        id: "v-b1-08-10",
        es: "despedir",
        en: "to fire, to lay off",
        pos: "verb",
        example: {
          es: "La empresa despidió a veinte empleados.",
          en: "The company laid off twenty employees.",
        },
      },
      {
        id: "v-b1-08-11",
        es: "presupuesto",
        en: "budget; (price) estimate",
        pos: "noun",
        gender: "m",
        example: {
          es: "No tenemos presupuesto para contratar a más gente.",
          en: "We don't have the budget to hire more people.",
        },
      },
      {
        id: "v-b1-08-12",
        es: "equipo",
        en: "team; equipment",
        pos: "noun",
        gender: "m",
        example: {
          es: "Trabajo en un equipo de seis personas.",
          en: "I work on a team of six people.",
        },
      },
      {
        id: "v-b1-08-13",
        es: "opinar",
        en: "to think, to give an opinion",
        pos: "verb",
        example: {
          es: "¿Qué opinas de la nueva política de la empresa?",
          en: "What do you think of the company's new policy?",
        },
      },
      {
        id: "v-b1-08-14",
        es: "estar de acuerdo",
        en: "to agree",
        pos: "phrase",
        example: {
          es: "No estoy de acuerdo con esa decisión.",
          en: "I don't agree with that decision.",
        },
      },
      {
        id: "v-b1-08-15",
        es: "punto de vista",
        en: "point of view",
        pos: "noun",
        gender: "m",
        example: {
          es: "Entiendo tu punto de vista, pero no lo comparto.",
          en: "I understand your point of view, but I don't share it.",
        },
      },
      {
        id: "v-b1-08-16",
        es: "pendiente",
        en: "pending, outstanding",
        pos: "adjective",
        example: {
          es: "Tengo varias tareas pendientes para hoy.",
          en: "I have several pending tasks for today.",
        },
      },
      {
        id: "v-b1-08-17",
        es: "retroalimentación",
        en: "feedback",
        pos: "noun",
        gender: "f",
        example: {
          es: "Mi jefa siempre me da retroalimentación útil.",
          en: "My boss always gives me useful feedback.",
        },
      },
    ],
    scenario: {
      title: "Budget cuts meeting",
      setting:
        "You're a team leader at a marketing agency in Monterrey. Your manager wants to cut the budget for a project you're running, and you disagree with part of the plan.",
      aiRole: "Licenciada Torres, your direct manager (a formal, usted relationship)",
      learnerGoal:
        "Give your opinion respectfully, disagree with parts of her proposal, and suggest next steps using usted commands (considere, revise, no cancele).",
      opener:
        "Pase, pase. Siéntese, por favor. Bueno, como sabe, este trimestre tenemos que reducir el presupuesto un veinte por ciento. Quiero saber su opinión antes de decidir nada.",
    },
  },

  // ───────────────────────────── B2-01 ─────────────────────────────
  {
    id: "b2-01",
    cefr: "B2",
    order: 25,
    title: "La vida digital",
    theme: "Technology, privacy, and digital life",
    canDo: [
      "I can describe exactly what I'm looking for, even when I'm not sure it exists.",
      "I can link ideas with conjunctions of purpose, condition, and time (para que, a menos que, cuando).",
      "I can discuss the pros and cons of technology in daily life.",
    ],
    grammar: [
      {
        id: "g-b2-01-1",
        title: "Subjunctive in adjective clauses",
        summary:
          "When a que clause describes something unknown, hypothetical, or nonexistent, its verb goes in the subjunctive: Busco un teléfono que tenga buena cámara (any phone like that; I don't know if one exists). When it describes something specific that you know exists, use the indicative: Tengo un teléfono que tiene buena cámara. Negatives like No hay nada que... and No conozco a nadie que... always take the subjunctive. The personal a usually drops with unknown people: Busco un técnico que sepa..., but Conozco a un técnico que sabe....",
        examples: [
          {
            es: "Necesitamos una aplicación que funcione sin internet.",
            en: "We need an app that works without internet.",
          },
          {
            es: "No hay ninguna contraseña que sea cien por ciento segura.",
            en: "There's no password that's one hundred percent secure.",
          },
          {
            es: "Tengo un amigo que trabaja en ciberseguridad.",
            en: "I have a friend who works in cybersecurity.",
          },
        ],
        drills: [
          {
            es: "Busco un navegador que no ___ mis datos.",
            en: "I'm looking for a browser that doesn't store my data.",
            answer: "guarde",
            distractors: ["guarda", "guardó", "guardaba"],
          },
          {
            es: "Uso una aplicación que me ___ a recordar las contraseñas.",
            en: "I use an app that helps me remember my passwords.",
            answer: "ayuda",
            distractors: ["ayude", "ayudara", "ayudar"],
          },
          {
            es: "¿Conoces a alguien que ___ arreglar computadoras?",
            en: "Do you know anyone who knows how to fix computers?",
            answer: "sepa",
            distractors: ["sabía", "supe", "sepan"],
          },
          {
            es: "No hay nada en internet que ___ desaparecer por completo.",
            en: "Nothing on the internet can disappear completely.",
            answer: "pueda",
            distractors: ["puede", "pudo", "podía"],
          },
          {
            es: "Quiero un cargador que ___ más rápido que este.",
            en: "I want a charger that charges faster than this one.",
            answer: "cargue",
            distractors: ["carga", "carge", "cargó"],
          },
        ],
      },
      {
        id: "g-b2-01-2",
        title: "Subjunctive in adverbial clauses",
        summary:
          "Some conjunctions always take the subjunctive because they introduce purposes or conditions that aren't real yet: para que, antes de que, sin que, a menos que, con tal de que, en caso de que. Time conjunctions such as cuando, en cuanto, hasta que, después de que, and tan pronto como take the subjunctive when they refer to the future, but the indicative for habits or past facts: Te llamo cuando llegue vs. Siempre te llamo cuando llego. Aunque takes the indicative for a known fact (even though) and the subjunctive for a possibility or something you're not arguing about (even if).",
        examples: [
          {
            es: "Voy a hacer un respaldo antes de que se borre todo.",
            en: "I'm going to make a backup before everything gets deleted.",
          },
          {
            es: "Cuando salga la nueva versión, la voy a descargar.",
            en: "When the new version comes out, I'm going to download it.",
          },
          {
            es: "Aunque la aplicación es gratis, vende tus datos.",
            en: "Even though the app is free, it sells your data.",
          },
          {
            es: "Aunque sea gratis, no la voy a instalar.",
            en: "Even if it's free, I'm not going to install it.",
          },
        ],
        drills: [
          {
            es: "Te mando el enlace para que ___ la reunión desde tu casa.",
            en: "I'll send you the link so that you can follow the meeting from home.",
            answer: "sigas",
            distractors: ["sigues", "seguir", "siguas"],
          },
          {
            es: "Cuando ___ la actualización, reinicia el teléfono.",
            en: "When the update finishes, restart your phone.",
            answer: "termine",
            distractors: ["termina", "terminará", "terminó"],
          },
          {
            es: "Siempre reviso mis mensajes cuando ___ del trabajo.",
            en: "I always check my messages when I leave work.",
            answer: "salgo",
            distractors: ["salga", "saldré", "saliera"],
          },
          {
            es: "No compartas tus datos a menos que ___ necesario.",
            en: "Don't share your data unless it's necessary.",
            answer: "sea",
            distractors: ["es", "será", "esté"],
          },
          {
            es: "Aunque ___ cansado, voy a terminar el proyecto esta noche.",
            en: "Even though I'm tired, I'm going to finish the project tonight.",
            answer: "estoy",
            distractors: ["esté", "estaré", "soy"],
          },
          {
            es: "Mis hijos usan la tablet sin que yo lo ___.",
            en: "My kids use the tablet without my knowing.",
            answer: "sepa",
            distractors: ["sé", "sabe", "supe"],
          },
        ],
      },
    ],
    vocab: [
      {
        id: "v-b2-01-01",
        es: "contraseña",
        en: "password",
        pos: "noun",
        gender: "f",
        example: {
          es: "Cambia tu contraseña cada tres meses.",
          en: "Change your password every three months.",
        },
      },
      {
        id: "v-b2-01-02",
        es: "descargar",
        en: "to download",
        pos: "verb",
        example: {
          es: "Descargué la aplicación del banco ayer.",
          en: "I downloaded the bank's app yesterday.",
        },
      },
      {
        id: "v-b2-01-03",
        es: "actualización",
        en: "update",
        pos: "noun",
        gender: "f",
        example: {
          es: "La actualización tardó casi una hora.",
          en: "The update took almost an hour.",
        },
      },
      {
        id: "v-b2-01-04",
        es: "almacenamiento",
        en: "storage",
        pos: "noun",
        gender: "m",
        example: {
          es: "Mi teléfono ya no tiene espacio de almacenamiento.",
          en: "My phone doesn't have any storage space left.",
        },
      },
      {
        id: "v-b2-01-05",
        es: "red social",
        en: "social network, social media platform",
        pos: "noun",
        gender: "f",
        example: {
          es: "Pasa horas en las redes sociales todos los días.",
          en: "He spends hours on social media every day.",
        },
      },
      {
        id: "v-b2-01-06",
        es: "privacidad",
        en: "privacy",
        pos: "noun",
        gender: "f",
        example: {
          es: "Me preocupa la privacidad de mis hijos en internet.",
          en: "I'm worried about my children's privacy online.",
        },
      },
      {
        id: "v-b2-01-07",
        es: "estafa",
        en: "scam, fraud",
        pos: "noun",
        gender: "f",
        example: {
          es: "Ese mensaje del banco era una estafa.",
          en: "That message from the bank was a scam.",
        },
      },
      {
        id: "v-b2-01-08",
        es: "dispositivo",
        en: "device",
        pos: "noun",
        gender: "m",
        example: {
          es: "Puedes conectar hasta cinco dispositivos a la misma cuenta.",
          en: "You can connect up to five devices to the same account.",
        },
      },
      {
        id: "v-b2-01-09",
        es: "configuración",
        en: "settings",
        pos: "noun",
        gender: "f",
        example: {
          es: "Busca esa opción en la configuración del teléfono.",
          en: "Look for that option in your phone's settings.",
        },
      },
      {
        id: "v-b2-01-10",
        es: "archivo adjunto",
        en: "(email) attachment",
        pos: "noun",
        gender: "m",
        example: {
          es: "Te mandé el contrato como archivo adjunto.",
          en: "I sent you the contract as an attachment.",
        },
      },
      {
        id: "v-b2-01-11",
        es: "inteligencia artificial",
        en: "artificial intelligence",
        pos: "noun",
        gender: "f",
        example: {
          es: "La inteligencia artificial está cambiando muchas profesiones.",
          en: "Artificial intelligence is changing many professions.",
        },
      },
      {
        id: "v-b2-01-12",
        es: "datos personales",
        en: "personal data",
        pos: "noun",
        gender: "m",
        example: {
          es: "Nunca des tus datos personales por teléfono.",
          en: "Never give out your personal data over the phone.",
        },
      },
      {
        id: "v-b2-01-13",
        es: "cargador",
        en: "charger",
        pos: "noun",
        gender: "m",
        example: {
          es: "Dejé el cargador en la oficina.",
          en: "I left my charger at the office.",
        },
      },
      {
        id: "v-b2-01-14",
        es: "navegador",
        en: "(web) browser",
        pos: "noun",
        gender: "m",
        example: {
          es: "Este navegador bloquea los anuncios automáticamente.",
          en: "This browser blocks ads automatically.",
        },
      },
      {
        id: "v-b2-01-15",
        es: "algoritmo",
        en: "algorithm",
        pos: "noun",
        gender: "m",
        example: {
          es: "El algoritmo me recomienda videos muy raros.",
          en: "The algorithm recommends really weird videos to me.",
        },
      },
      {
        id: "v-b2-01-16",
        es: "respaldo",
        en: "backup",
        pos: "noun",
        gender: "m",
        example: {
          es: "Siempre hago un respaldo de mis fotos en la nube.",
          en: "I always back up my photos to the cloud.",
        },
      },
      {
        id: "v-b2-01-17",
        es: "adicto",
        en: "addicted",
        pos: "adjective",
        example: {
          es: "Creo que mi hijo es adicto a los videojuegos.",
          en: "I think my son is addicted to video games.",
        },
      },
    ],
    scenario: {
      title: "Buying a new laptop",
      setting:
        "You're at an electronics store in Mexico City looking for a laptop for work. You have specific needs and a limited budget.",
      aiRole: "An enthusiastic salesperson who keeps pushing the most expensive model",
      learnerGoal:
        "Describe exactly what you're looking for (busco una que tenga...), ask about the warranty and transferring your data, and set conditions before you buy (a menos que, con tal de que).",
      opener:
        "¡Buenas tardes! Veo que está mirando las computadoras portátiles. ¿Busca algo en especial o prefiere que le muestre los modelos más nuevos?",
    },
  },

  // ───────────────────────────── B2-02 ─────────────────────────────
  {
    id: "b2-02",
    cefr: "B2",
    order: 26,
    title: "Si yo fuera alcalde",
    theme: "Politics and society",
    canDo: [
      "I can discuss social issues such as taxes, inequality, and elections.",
      "I can talk about hypothetical and imaginary situations.",
      "I can report what people wanted, requested, or felt in the past.",
    ],
    grammar: [
      {
        id: "g-b2-02-1",
        title: "The imperfect subjunctive",
        summary:
          "To form the imperfect subjunctive, take the ellos form of the preterite, drop -ron, and add -ra, -ras, -ra, -ramos, -ran, with an accent on the nosotros form: hablaron → hablara, comieron → comiera, tuvieron → tuviera, fueron → fuera, dijeron → dijera, pudieron → pudiera (nosotros: habláramos, tuviéramos). Use it in the same situations as the present subjunctive when the main verb is in the past or the conditional: Quiero que votes → Quería que votaras. You may also see an alternative -se form (hablase, tuviese), mostly in writing.",
        examples: [
          {
            es: "Los manifestantes pedían que el gobierno bajara los impuestos.",
            en: "The protesters were demanding that the government lower taxes.",
          },
          {
            es: "Me sorprendió que tan poca gente votara.",
            en: "It surprised me that so few people voted.",
          },
          {
            es: "El alcalde quería que los ciudadanos participaran más.",
            en: "The mayor wanted citizens to participate more.",
          },
        ],
        drills: [
          {
            es: "Mis padres querían que yo ___ derecho.",
            en: "My parents wanted me to study law.",
            answer: "estudiara",
            distractors: ["estudie", "estudiaba", "estudiaría"],
          },
          {
            es: "Era importante que todos ___ su opinión.",
            en: "It was important for everyone to give their opinion.",
            answer: "dieran",
            distractors: ["dieron", "den", "daran"],
          },
          {
            es: "No creía que el candidato ___ ganar.",
            en: "I didn't think the candidate could win.",
            answer: "pudiera",
            distractors: ["podiera", "pueda", "pudo"],
          },
          {
            es: "La periodista nos pidió que ___ la encuesta.",
            en: "The journalist asked us to fill out the survey.",
            answer: "contestáramos",
            distractors: ["contestábamos", "contestemos", "contestaramos"],
          },
          {
            es: "Me molestó que no ___ ninguna mujer en el debate.",
            en: "It bothered me that there wasn't a single woman in the debate.",
            answer: "hubiera",
            distractors: ["había", "haya", "habiera"],
          },
        ],
      },
      {
        id: "g-b2-02-2",
        title: "Hypothetical si-clauses",
        summary:
          "To talk about unlikely or imaginary situations, use si + imperfect subjunctive for the condition and the conditional for the result: Si yo fuera presidente, bajaría los impuestos. The clauses can go in either order: Bajaría los impuestos si fuera presidente. Never put the present subjunctive or the conditional right after si. For real, likely conditions, use si + present indicative instead: Si llueve, no voy.",
        examples: [
          {
            es: "Si tuviera más tiempo, trabajaría como voluntario en la campaña.",
            en: "If I had more time, I'd volunteer for the campaign.",
          },
          {
            es: "¿Qué cambiarías si fueras alcalde de tu ciudad?",
            en: "What would you change if you were mayor of your city?",
          },
          {
            es: "Si la gente confiara más en los políticos, votaría más.",
            en: "If people trusted politicians more, they would vote more.",
          },
        ],
        drills: [
          {
            es: "Si yo ___ presidenta, invertiría más en educación.",
            en: "If I were president, I'd invest more in education.",
            answer: "fuera",
            distractors: ["sería", "sea", "era"],
          },
          {
            es: "Si el gobierno bajara los impuestos, la gente ___ más.",
            en: "If the government lowered taxes, people would spend more.",
            answer: "gastaría",
            distractors: ["gastara", "gastará", "gaste"],
          },
          {
            es: "¿Votarías por ella si ___ una buena propuesta?",
            en: "Would you vote for her if she had a good proposal?",
            answer: "tuviera",
            distractors: ["tendría", "tenga", "tenía"],
          },
          {
            es: "Si ___ dinero este mes, voy a donar a la campaña.",
            en: "If I have money this month, I'm going to donate to the campaign.",
            answer: "tengo",
            distractors: ["tuviera", "tendría", "tenga"],
          },
          {
            es: "No habría tanta desigualdad si todos ___ acceso a la educación.",
            en: "There wouldn't be so much inequality if everyone had access to education.",
            answer: "tuvieran",
            distractors: ["tendrían", "tengan", "tenían"],
          },
        ],
      },
    ],
    vocab: [
      {
        id: "v-b2-02-01",
        es: "ciudadano",
        en: "citizen",
        pos: "noun",
        gender: "m",
        example: {
          es: "Todos los ciudadanos tienen derecho a votar.",
          en: "All citizens have the right to vote.",
        },
      },
      {
        id: "v-b2-02-02",
        es: "impuesto",
        en: "tax",
        pos: "noun",
        gender: "m",
        example: {
          es: "Nadie quiere pagar más impuestos.",
          en: "Nobody wants to pay more taxes.",
        },
      },
      {
        id: "v-b2-02-03",
        es: "ley",
        en: "law",
        pos: "noun",
        gender: "f",
        example: {
          es: "El congreso aprobó una nueva ley de protección de datos.",
          en: "Congress passed a new data protection law.",
        },
      },
      {
        id: "v-b2-02-04",
        es: "derecho",
        en: "right; law (as a field of study)",
        pos: "noun",
        gender: "m",
        example: {
          es: "La educación es un derecho, no un privilegio.",
          en: "Education is a right, not a privilege.",
        },
      },
      {
        id: "v-b2-02-05",
        es: "desigualdad",
        en: "inequality",
        pos: "noun",
        gender: "f",
        example: {
          es: "La desigualdad económica sigue siendo un gran problema.",
          en: "Economic inequality is still a big problem.",
        },
      },
      {
        id: "v-b2-02-06",
        es: "pobreza",
        en: "poverty",
        pos: "noun",
        gender: "f",
        example: {
          es: "Millones de personas todavía viven en la pobreza.",
          en: "Millions of people still live in poverty.",
        },
      },
      {
        id: "v-b2-02-07",
        es: "desempleo",
        en: "unemployment",
        pos: "noun",
        gender: "m",
        example: {
          es: "El desempleo bajó un dos por ciento este año.",
          en: "Unemployment fell two percent this year.",
        },
      },
      {
        id: "v-b2-02-08",
        es: "candidato",
        en: "candidate",
        pos: "noun",
        gender: "m",
        example: {
          es: "El candidato prometió mejorar el transporte público.",
          en: "The candidate promised to improve public transportation.",
        },
      },
      {
        id: "v-b2-02-09",
        es: "campaña",
        en: "campaign",
        pos: "noun",
        gender: "f",
        example: {
          es: "La campaña electoral empieza en agosto.",
          en: "The election campaign starts in August.",
        },
      },
      {
        id: "v-b2-02-10",
        es: "encuesta",
        en: "poll, survey",
        pos: "noun",
        gender: "f",
        example: {
          es: "Según la última encuesta, los dos candidatos están empatados.",
          en: "According to the latest poll, the two candidates are tied.",
        },
      },
      {
        id: "v-b2-02-11",
        es: "corrupción",
        en: "corruption",
        pos: "noun",
        gender: "f",
        example: {
          es: "La gente está cansada de la corrupción.",
          en: "People are tired of corruption.",
        },
      },
      {
        id: "v-b2-02-12",
        es: "alcalde",
        en: "mayor (alcaldesa = female mayor)",
        pos: "noun",
        gender: "m",
        example: {
          es: "El alcalde inauguró un nuevo hospital.",
          en: "The mayor opened a new hospital.",
        },
      },
      {
        id: "v-b2-02-13",
        es: "aprobar",
        en: "to pass (a law); to approve",
        pos: "verb",
        example: {
          es: "El senado aprobó la reforma por un solo voto.",
          en: "The senate passed the reform by a single vote.",
        },
      },
      {
        id: "v-b2-02-14",
        es: "manifestación",
        en: "demonstration, protest",
        pos: "noun",
        gender: "f",
        example: {
          es: "Miles de estudiantes participaron en la manifestación.",
          en: "Thousands of students took part in the demonstration.",
        },
      },
      {
        id: "v-b2-02-15",
        es: "política pública",
        en: "public policy",
        pos: "noun",
        gender: "f",
        example: {
          es: "Necesitamos mejores políticas públicas de vivienda.",
          en: "We need better public housing policies.",
        },
      },
      {
        id: "v-b2-02-16",
        es: "reforma",
        en: "reform",
        pos: "noun",
        gender: "f",
        example: {
          es: "La reforma educativa generó mucho debate.",
          en: "The education reform sparked a lot of debate.",
        },
      },
      {
        id: "v-b2-02-17",
        es: "elecciones",
        en: "election(s)",
        pos: "noun",
        gender: "f",
        example: {
          es: "Las elecciones presidenciales son en octubre.",
          en: "The presidential election is in October.",
        },
      },
    ],
    scenario: {
      title: "Street interview before the election",
      setting:
        "A local radio station in Quito is interviewing people on the street about the upcoming mayoral election.",
      aiRole: "A lively radio host doing live street interviews",
      learnerGoal:
        "Say which problems worry you, explain what you would do if you were mayor, and answer the host's follow-up questions with hypotheticals (si fuera..., cambiaría...).",
      opener:
        "¡Buenos días! Estamos en vivo con Radio Ciudad. Faltan dos semanas para las elecciones. Díganos: si usted fuera alcalde o alcaldesa, ¿qué sería lo primero que cambiaría en esta ciudad?",
    },
  },

  // ───────────────────────────── B2-03 ─────────────────────────────
  {
    id: "b2-03",
    cefr: "B2",
    order: 27,
    title: "Las noticias y los medios",
    theme: "Media, journalism, and the news",
    canDo: [
      "I can report what other people said, asked, or requested.",
      "I can explain the order of past events clearly.",
      "I can discuss news stories and the reliability of sources.",
    ],
    grammar: [
      {
        id: "g-b2-03-1",
        title: "The pluperfect",
        summary:
          "The pluperfect ('had done') describes an action that happened before another past moment. Form it with haber in the imperfect (había, habías, había, habíamos, habían) plus a past participle: había salido, habían dicho. It often appears with ya (already) and todavía no or nunca: Cuando llegué, la conferencia ya había empezado.",
        examples: [
          {
            es: "Cuando salió la noticia, el ministro ya había renunciado.",
            en: "When the news came out, the minister had already resigned.",
          },
          {
            es: "Nunca había visto una protesta tan grande.",
            en: "I had never seen such a big protest.",
          },
          {
            es: "La periodista descubrió que la fuente había mentido.",
            en: "The journalist discovered that the source had lied.",
          },
        ],
        drills: [
          {
            es: "Cuando encendí la tele, el noticiero ya ___.",
            en: "When I turned on the TV, the news had already ended.",
            answer: "había terminado",
            distractors: ["ha terminado", "terminaba", "habría terminado"],
          },
          {
            es: "Nosotros no ___ la noticia hasta que nos llamaste.",
            en: "We hadn't heard the news until you called us.",
            answer: "habíamos oído",
            distractors: ["habíamos oido", "hemos oído", "habían oído"],
          },
          {
            es: "Me dijeron que el reportaje ya se ___ en la radio.",
            en: "They told me the report had already been broadcast on the radio.",
            answer: "había transmitido",
            distractors: ["ha transmitido", "habría transmitido", "transmitía"],
          },
          {
            es: "Antes de este trabajo, ella nunca ___ para un periódico.",
            en: "Before this job, she had never written for a newspaper.",
            answer: "había escrito",
            distractors: ["había escribido", "ha escrito", "habían escrito"],
          },
        ],
      },
      {
        id: "g-b2-03-2",
        title: "Reported speech",
        summary:
          "When you report what someone said with a past verb like dijo que, explicó que, or afirmó que, the tenses usually shift back: present → imperfect (es → era), preterite → pluperfect (ganó → había ganado), future → conditional (será → sería). Reported commands and requests use decir que or pedir que + imperfect subjunctive: “Llamen mañana” → Nos dijo que llamáramos al día siguiente. Yes/no questions are reported with si: Me preguntó si estaba listo. Time and place words shift too: hoy → ese día, mañana → al día siguiente, aquí → allí.",
        examples: [
          {
            es: "“Estoy preocupado”, dijo el ministro. → El ministro dijo que estaba preocupado.",
            en: "“I'm worried,” the minister said. → The minister said he was worried.",
          },
          {
            es: "“Presentaremos pruebas”, afirmó el abogado. → El abogado afirmó que presentarían pruebas.",
            en: "“We will present evidence,” the lawyer stated. → The lawyer stated that they would present evidence.",
          },
          {
            es: "“No publiquen nada”, les dijo el editor. → El editor les dijo que no publicaran nada.",
            en: "“Don't publish anything,” the editor told them. → The editor told them not to publish anything.",
          },
        ],
        drills: [
          {
            es: "“Tengo pruebas”, dijo la periodista. → La periodista dijo que ___ pruebas.",
            en: "“I have evidence,” the journalist said. → The journalist said she had evidence.",
            answer: "tenía",
            distractors: ["tiene", "tuvo", "tendría"],
          },
          {
            es: "“El puente estará listo en mayo”, anunció el alcalde. → El alcalde anunció que el puente ___ listo en mayo.",
            en: "“The bridge will be ready in May,” the mayor announced. → The mayor announced that the bridge would be ready in May.",
            answer: "estaría",
            distractors: ["había estado", "estuviera", "esté"],
          },
          {
            es: "“Ganamos las elecciones”, dijeron. → Dijeron que ___ las elecciones.",
            en: "“We won the election,” they said. → They said they had won the election.",
            answer: "habían ganado",
            distractors: ["ganarían", "han ganado", "ganaran"],
          },
          {
            es: "“Envíe el artículo hoy”, me dijo el editor. → El editor me dijo que ___ el artículo ese día.",
            en: "“Send the article today,” the editor told me. → The editor told me to send the article that day.",
            answer: "enviara",
            distractors: ["enviaba", "envíe", "enviaría"],
          },
          {
            es: "“¿Confías en esta fuente?”, me preguntó. → Me preguntó si ___ en esa fuente.",
            en: "“Do you trust this source?” he asked me. → He asked me if I trusted that source.",
            answer: "confiaba",
            distractors: ["confío", "confiara", "confiaría"],
          },
        ],
      },
    ],
    vocab: [
      {
        id: "v-b2-03-01",
        es: "noticiero",
        en: "news program, newscast",
        pos: "noun",
        gender: "m",
        example: {
          es: "Mis padres ven el noticiero todas las noches.",
          en: "My parents watch the news every night.",
        },
      },
      {
        id: "v-b2-03-02",
        es: "titular",
        en: "headline",
        pos: "noun",
        gender: "m",
        example: {
          es: "El titular era mucho más exagerado que el artículo.",
          en: "The headline was much more exaggerated than the article.",
        },
      },
      {
        id: "v-b2-03-03",
        es: "prensa",
        en: "the press",
        pos: "noun",
        gender: "f",
        example: {
          es: "La prensa no pudo entrar a la reunión.",
          en: "The press wasn't allowed into the meeting.",
        },
      },
      {
        id: "v-b2-03-04",
        es: "fuente",
        en: "source",
        pos: "noun",
        gender: "f",
        example: {
          es: "El periodista no quiso revelar su fuente.",
          en: "The journalist refused to reveal his source.",
        },
      },
      {
        id: "v-b2-03-05",
        es: "conferencia de prensa",
        en: "press conference",
        pos: "noun",
        gender: "f",
        example: {
          es: "El ministro dio una conferencia de prensa esta mañana.",
          en: "The minister held a press conference this morning.",
        },
      },
      {
        id: "v-b2-03-06",
        es: "noticias falsas",
        en: "fake news",
        pos: "noun",
        gender: "f",
        example: {
          es: "Las noticias falsas circulan muy rápido en las redes.",
          en: "Fake news spreads very quickly on social media.",
        },
      },
      {
        id: "v-b2-03-07",
        es: "desmentir",
        en: "to deny, to refute",
        pos: "verb",
        example: {
          es: "El gobierno desmintió los rumores.",
          en: "The government denied the rumors.",
        },
      },
      {
        id: "v-b2-03-08",
        es: "afirmar",
        en: "to state, to claim",
        pos: "verb",
        example: {
          es: "La empresa afirma que no hubo ningún error.",
          en: "The company claims there was no error.",
        },
      },
      {
        id: "v-b2-03-09",
        es: "declarar",
        en: "to state publicly; to testify",
        pos: "verb",
        example: {
          es: "El testigo declaró que había visto todo.",
          en: "The witness testified that he had seen everything.",
        },
      },
      {
        id: "v-b2-03-10",
        es: "según",
        en: "according to",
        pos: "preposition",
        example: {
          es: "Según los expertos, la economía va a crecer.",
          en: "According to the experts, the economy is going to grow.",
        },
      },
      {
        id: "v-b2-03-11",
        es: "reportaje",
        en: "(news) report, feature story",
        pos: "noun",
        gender: "m",
        example: {
          es: "Vi un reportaje sobre la minería ilegal en la selva.",
          en: "I saw a report on illegal mining in the jungle.",
        },
      },
      {
        id: "v-b2-03-12",
        es: "audiencia",
        en: "audience",
        pos: "noun",
        gender: "f",
        example: {
          es: "El programa tiene una audiencia enorme.",
          en: "The show has a huge audience.",
        },
      },
      {
        id: "v-b2-03-13",
        es: "imparcial",
        en: "impartial, unbiased",
        pos: "adjective",
        example: {
          es: "Es difícil encontrar medios totalmente imparciales.",
          en: "It's hard to find completely unbiased media outlets.",
        },
      },
      {
        id: "v-b2-03-14",
        es: "portada",
        en: "front page, cover",
        pos: "noun",
        gender: "f",
        example: {
          es: "La foto salió en la portada de todos los periódicos.",
          en: "The photo was on the front page of every newspaper.",
        },
      },
      {
        id: "v-b2-03-15",
        es: "suceso",
        en: "event, incident",
        pos: "noun",
        gender: "m",
        example: {
          es: "El suceso ocurrió a las tres de la madrugada.",
          en: "The incident happened at three in the morning.",
        },
      },
      {
        id: "v-b2-03-16",
        es: "difundir",
        en: "to spread, to broadcast",
        pos: "verb",
        example: {
          es: "Los medios difundieron la noticia en cuestión de minutos.",
          en: "The media spread the news within minutes.",
        },
      },
      {
        id: "v-b2-03-17",
        es: "polémica",
        en: "controversy",
        pos: "noun",
        gender: "f",
        example: {
          es: "Sus declaraciones causaron mucha polémica.",
          en: "His statements caused a lot of controversy.",
        },
      },
      {
        id: "v-b2-03-18",
        es: "comunicado",
        en: "(official) statement, press release",
        pos: "noun",
        gender: "m",
        example: {
          es: "La empresa publicó un comunicado pidiendo disculpas.",
          en: "The company released a statement apologizing.",
        },
      },
    ],
    scenario: {
      title: "Catching a friend up on the news",
      setting:
        "Your friend missed a big news story about a scandal at the city water company. You're telling her what happened and what everyone said about it.",
      aiRole: "Valeria, a curious friend who asks lots of follow-up questions",
      learnerGoal:
        "Report what officials, journalists, and witnesses said; explain what had happened before the scandal broke; and give your opinion on how the media covered it.",
      opener:
        "¡Oye! Todo el mundo está hablando del escándalo de la compañía de agua, pero yo no vi nada. ¿Qué pasó? ¿Qué dijeron en el noticiero?",
    },
  },

  // ───────────────────────────── B2-04 ─────────────────────────────
  {
    id: "b2-04",
    cefr: "B2",
    order: 28,
    title: "Costumbres y tradiciones",
    theme: "Culture, food, and traditions",
    canDo: [
      "I can explain how holidays and traditions are celebrated in my culture.",
      "I can describe customs and processes without saying who does them.",
      "I can talk about accidents and unplanned events without blaming anyone.",
    ],
    grammar: [
      {
        id: "g-b2-04-1",
        title: "Passive and impersonal se",
        summary:
          "Spanish often uses se instead of a passive voice when the person doing the action is unknown or unimportant. With passive se, the verb agrees with the thing: Se vende casa, Se venden casas, Aquí se habla español. With impersonal se, there's no specific subject and the verb is always singular; it's used for general statements about people: Se vive bien en esta ciudad, Se come muy tarde aquí. When the object is a specific person or group of people, use a singular verb + a: Se honraba a los antepasados.",
        examples: [
          {
            es: "En México se celebra el Día de Muertos el 1 y el 2 de noviembre.",
            en: "In Mexico, the Day of the Dead is celebrated on November 1 and 2.",
          },
          {
            es: "Para el mole se usan más de veinte ingredientes.",
            en: "More than twenty ingredients are used for mole.",
          },
          {
            es: "En mi pueblo se come muy bien y se vive tranquilo.",
            en: "In my town, the food is great and life is peaceful.",
          },
        ],
        drills: [
          {
            es: "En esta región ___ muchas artesanías de barro.",
            en: "Many clay crafts are made in this region.",
            answer: "se hacen",
            distractors: ["se hace", "se haga", "es hecho"],
          },
          {
            es: "¿Cómo ___ “thank you” en quechua?",
            en: "How do you say “thank you” in Quechua?",
            answer: "se dice",
            distractors: ["se dicen", "dice", "se diga"],
          },
          {
            es: "En esta fiesta ___ tamales y atole.",
            en: "At this celebration, tamales and atole are served.",
            answer: "se sirven",
            distractors: ["se sirve", "sirve", "se servimos"],
          },
          {
            es: "En este restaurante ___ muy bien.",
            en: "You eat very well at this restaurant.",
            answer: "se come",
            distractors: ["se comen", "come se", "se coma"],
          },
          {
            es: "Antes ___ a los antepasados con ofrendas de flores y comida.",
            en: "In the past, ancestors were honored with offerings of flowers and food.",
            answer: "se honraba",
            distractors: ["se honraban", "honraba se", "se honre"],
          },
        ],
      },
      {
        id: "g-b2-04-2",
        title: "Accidental se",
        summary:
          "To describe unplanned accidents, Spanish uses se + an indirect object pronoun (me, te, le, nos, les) + verb. The thing becomes the subject and the person is simply the one affected, which takes the blame off them: Se me cayó el vaso (I dropped the glass; literally, 'the glass fell on me'). The verb agrees with the thing, not the person: Se me olvidó la llave, but Se me olvidaron las llaves. Common verbs include caer, olvidar, perder, romper, quemar, and acabar.",
        examples: [
          {
            es: "Se me quemaron las tortillas mientras hablaba por teléfono.",
            en: "I burned the tortillas while I was talking on the phone.",
          },
          {
            es: "¿Se te olvidó comprar las flores para la ofrenda?",
            en: "Did you forget to buy the flowers for the altar?",
          },
          {
            es: "A los músicos se les rompió una guitarra antes del desfile.",
            en: "The musicians' guitar broke right before the parade.",
          },
        ],
        drills: [
          {
            es: "¡Ay, no! ___ cayeron los vasos.",
            en: "Oh no! I dropped the glasses.",
            answer: "Se me",
            distractors: ["Me se", "Me", "Se"],
          },
          {
            es: "A mi abuela se le ___ la receta del pan de muerto.",
            en: "My grandmother lost the recipe for pan de muerto.",
            answer: "perdió",
            distractors: ["perdieron", "perdí", "perdiste"],
          },
          {
            es: "¿Otra vez se te ___ las llaves?",
            en: "You forgot your keys again?",
            answer: "olvidaron",
            distractors: ["olvidó", "olvidaste", "olvidé"],
          },
          {
            es: "Se ___ acabó el café, así que fuimos a comprar más.",
            en: "We ran out of coffee, so we went to buy more.",
            answer: "nos",
            distractors: ["los", "nosotros", "les"],
          },
        ],
      },
    ],
    vocab: [
      {
        id: "v-b2-04-01",
        es: "costumbre",
        en: "custom, habit",
        pos: "noun",
        gender: "f",
        example: {
          es: "Aquí es costumbre saludar con un beso en la mejilla.",
          en: "Here it's customary to greet people with a kiss on the cheek.",
        },
      },
      {
        id: "v-b2-04-02",
        es: "festejo",
        en: "celebration, festivity",
        pos: "noun",
        gender: "m",
        example: {
          es: "Los festejos duran toda la semana.",
          en: "The festivities last all week.",
        },
      },
      {
        id: "v-b2-04-03",
        es: "patrimonio",
        en: "heritage",
        pos: "noun",
        gender: "m",
        example: {
          es: "El centro histórico es Patrimonio de la Humanidad.",
          en: "The historic center is a World Heritage Site.",
        },
      },
      {
        id: "v-b2-04-04",
        es: "antepasado",
        en: "ancestor",
        pos: "noun",
        gender: "m",
        example: {
          es: "Recordamos a nuestros antepasados con mucho respeto.",
          en: "We remember our ancestors with great respect.",
        },
      },
      {
        id: "v-b2-04-05",
        es: "feriado",
        en: "public holiday",
        pos: "noun",
        gender: "m",
        example: {
          es: "El lunes es feriado, así que no hay clases.",
          en: "Monday is a public holiday, so there's no school.",
        },
      },
      {
        id: "v-b2-04-06",
        es: "desfile",
        en: "parade",
        pos: "noun",
        gender: "m",
        example: {
          es: "El desfile pasa por la avenida principal.",
          en: "The parade goes down the main avenue.",
        },
      },
      {
        id: "v-b2-04-07",
        es: "artesanía",
        en: "handicrafts, crafts",
        pos: "noun",
        gender: "f",
        example: {
          es: "Compré artesanías en el mercado de Otavalo.",
          en: "I bought handicrafts at the Otavalo market.",
        },
      },
      {
        id: "v-b2-04-08",
        es: "indígena",
        en: "indigenous",
        pos: "adjective",
        example: {
          es: "En Guatemala se hablan más de veinte lenguas indígenas.",
          en: "More than twenty indigenous languages are spoken in Guatemala.",
        },
      },
      {
        id: "v-b2-04-09",
        es: "mestizaje",
        en: "cultural or ethnic mixing",
        pos: "noun",
        gender: "m",
        example: {
          es: "La comida mexicana es fruto del mestizaje.",
          en: "Mexican food is the result of cultural mixing.",
        },
      },
      {
        id: "v-b2-04-10",
        es: "creencia",
        en: "belief",
        pos: "noun",
        gender: "f",
        example: {
          es: "Cada familia tiene sus propias creencias.",
          en: "Every family has its own beliefs.",
        },
      },
      {
        id: "v-b2-04-11",
        es: "ofrenda",
        en: "offering; home altar for the dead",
        pos: "noun",
        gender: "f",
        example: {
          es: "Ponemos pan, flores y fotos en la ofrenda.",
          en: "We put bread, flowers, and photos on the altar.",
        },
      },
      {
        id: "v-b2-04-12",
        es: "hornear",
        en: "to bake",
        pos: "verb",
        example: {
          es: "Mi abuela horneaba pan todos los domingos.",
          en: "My grandmother used to bake bread every Sunday.",
        },
      },
      {
        id: "v-b2-04-13",
        es: "sazonar",
        en: "to season (food)",
        pos: "verb",
        example: {
          es: "Sazona la carne con sal, ajo y comino.",
          en: "Season the meat with salt, garlic, and cumin.",
        },
      },
      {
        id: "v-b2-04-14",
        es: "cosecha",
        en: "harvest",
        pos: "noun",
        gender: "f",
        example: {
          es: "La fiesta celebra el fin de la cosecha.",
          en: "The festival celebrates the end of the harvest.",
        },
      },
      {
        id: "v-b2-04-15",
        es: "plato típico",
        en: "traditional dish",
        pos: "noun",
        gender: "m",
        example: {
          es: "El ceviche es un plato típico de Perú.",
          en: "Ceviche is a traditional Peruvian dish.",
        },
      },
      {
        id: "v-b2-04-16",
        es: "arraigado",
        en: "deeply rooted",
        pos: "adjective",
        example: {
          es: "Es una tradición muy arraigada en los pueblos de la sierra.",
          en: "It's a deeply rooted tradition in the mountain towns.",
        },
      },
      {
        id: "v-b2-04-17",
        es: "fiesta patronal",
        en: "patron saint's festival",
        pos: "noun",
        gender: "f",
        example: {
          es: "En la fiesta patronal hay fuegos artificiales y bailes.",
          en: "At the patron saint's festival there are fireworks and dancing.",
        },
      },
    ],
    scenario: {
      title: "Cooking class in Oaxaca",
      setting:
        "You're taking a traditional cooking class in Oaxaca. While you cook, the host asks about holidays and food traditions in your country and shares her own.",
      aiRole: "Doña Carmen, a warm Oaxacan cook who runs cooking classes from her home",
      learnerGoal:
        "Explain how an important holiday is celebrated in your country using se constructions (se come, se celebra), ask about Oaxacan traditions, and tell a story about a kitchen accident using accidental se (se me quemó, se me cayó).",
      opener:
        "¡Qué gusto tenerlos aquí! Hoy vamos a preparar mole negro, como se hace en mi familia desde hace generaciones. Pero primero, cuénteme: ¿en su país cómo se celebran las fiestas importantes?",
    },
  },

  // ───────────────────────────── B2-05 ─────────────────────────────
  {
    id: "b2-05",
    cefr: "B2",
    order: 29,
    title: "Ayudar a la comunidad",
    theme: "Community, volunteering, and solidarity",
    canDo: [
      "I can express purposes, causes, deadlines, and exchanges precisely with por and para.",
      "I can talk about community projects and how to help others.",
      "I can use common verbs with their correct prepositions.",
    ],
    grammar: [
      {
        id: "g-b2-05-1",
        title: "Por vs. para: advanced uses",
        summary:
          "Para points forward toward a goal: purpose (para ayudar), recipient (para los niños), deadline (para el viernes), destination (salgo para Lima), and opinion or comparison (para mí, es fácil; para su edad, sabe mucho). Por looks back at a cause or moves through something: reason or motive (lo hizo por amor), exchange (gracias por..., lo compré por diez dólares), duration (por dos años), means (por correo), movement through (por el parque), and on behalf of (hablo por todos). Useful fixed phrases: por eso, por lo menos, por fin, por si acaso, and estar por + infinitive (to be about to).",
        examples: [
          {
            es: "Trabajé como voluntaria en un albergue por dos años.",
            en: "I volunteered at a shelter for two years.",
          },
          {
            es: "Organizamos la colecta para ayudar a los damnificados.",
            en: "We organized the fundraiser to help the disaster victims.",
          },
          {
            es: "Para ser su primer evento, recaudaron muchísimo dinero.",
            en: "For their first event, they raised a huge amount of money.",
          },
          {
            es: "Lo hice por mi comunidad, no por el dinero.",
            en: "I did it for my community, not for the money.",
          },
        ],
        drills: [
          {
            es: "Necesitamos las donaciones ___ el viernes.",
            en: "We need the donations by Friday.",
            answer: "para",
            distractors: ["por", "en"],
          },
          {
            es: "Gracias ___ todo su apoyo.",
            en: "Thank you for all your support.",
            answer: "por",
            distractors: ["para", "de"],
          },
          {
            es: "___ ser tan joven, tiene mucha experiencia.",
            en: "For someone so young, she has a lot of experience.",
            answer: "Para",
            distractors: ["Por", "A"],
          },
          {
            es: "Compré estas mantas ___ veinte dólares.",
            en: "I bought these blankets for twenty dollars.",
            answer: "por",
            distractors: ["para", "de"],
          },
          {
            es: "Estas cajas de comida son ___ las familias damnificadas.",
            en: "These food boxes are for the families affected by the disaster.",
            answer: "para",
            distractors: ["por", "a"],
          },
          {
            es: "Como el director no pudo venir, yo hablé ___ él.",
            en: "Since the director couldn't come, I spoke on his behalf.",
            answer: "por",
            distractors: ["para", "a"],
          },
        ],
      },
      {
        id: "g-b2-05-2",
        title: "Verbs with fixed prepositions",
        summary:
          "Many Spanish verbs require a specific preposition, and it often doesn't match the English one. Common examples: depender de (depend on), soñar con (dream about), contar con (count on), confiar en (trust), pensar en (think about), insistir en (insist on), tratar de (try to), acordarse de (remember), enamorarse de (fall in love with), atreverse a (dare to), and arrepentirse de (regret). The preposition stays even before a que clause: Insisto en que vengas.",
        examples: [
          {
            es: "Podemos contar con los vecinos para organizar la colecta.",
            en: "We can count on the neighbors to organize the fundraiser.",
          },
          {
            es: "Sueño con abrir un centro comunitario en mi barrio.",
            en: "I dream of opening a community center in my neighborhood.",
          },
          {
            es: "Nunca me he arrepentido de hacer voluntariado.",
            en: "I've never regretted volunteering.",
          },
        ],
        drills: [
          {
            es: "El proyecto depende ___ las donaciones.",
            en: "The project depends on donations.",
            answer: "de",
            distractors: ["en", "a", "con"],
          },
          {
            es: "¿Puedo contar ___ ustedes el sábado?",
            en: "Can I count on you all on Saturday?",
            answer: "con",
            distractors: ["en", "de", "a"],
          },
          {
            es: "Siempre pienso ___ las familias que perdieron sus casas.",
            en: "I always think about the families who lost their homes.",
            answer: "en",
            distractors: ["de", "con", "a"],
          },
          {
            es: "Ella se atrevió ___ hablar frente a todo el comité.",
            en: "She dared to speak in front of the whole committee.",
            answer: "a",
            distractors: ["de", "en", "con"],
          },
          {
            es: "¿Te acuerdas ___ la primera vez que fuimos al albergue?",
            en: "Do you remember the first time we went to the shelter?",
            answer: "de",
            distractors: ["en", "a", "con"],
          },
        ],
      },
    ],
    vocab: [
      {
        id: "v-b2-05-01",
        es: "voluntariado",
        en: "volunteering, volunteer work",
        pos: "noun",
        gender: "m",
        example: {
          es: "El voluntariado me cambió la vida.",
          en: "Volunteering changed my life.",
        },
      },
      {
        id: "v-b2-05-02",
        es: "voluntario",
        en: "volunteer",
        pos: "noun",
        gender: "m",
        example: {
          es: "Buscamos voluntarios para este fin de semana.",
          en: "We're looking for volunteers for this weekend.",
        },
      },
      {
        id: "v-b2-05-03",
        es: "donar",
        en: "to donate",
        pos: "verb",
        example: {
          es: "Doné ropa y comida al albergue.",
          en: "I donated clothes and food to the shelter.",
        },
      },
      {
        id: "v-b2-05-04",
        es: "recaudar fondos",
        en: "to raise funds",
        pos: "phrase",
        example: {
          es: "Organizamos un concierto para recaudar fondos.",
          en: "We organized a concert to raise funds.",
        },
      },
      {
        id: "v-b2-05-05",
        es: "organización sin fines de lucro",
        en: "nonprofit organization",
        pos: "noun",
        gender: "f",
        example: {
          es: "Trabaja en una organización sin fines de lucro que ayuda a migrantes.",
          en: "She works at a nonprofit that helps migrants.",
        },
      },
      {
        id: "v-b2-05-06",
        es: "beneficencia",
        en: "charity",
        pos: "noun",
        gender: "f",
        example: {
          es: "Todo el dinero de la rifa es para beneficencia.",
          en: "All the money from the raffle goes to charity.",
        },
      },
      {
        id: "v-b2-05-07",
        es: "albergue",
        en: "shelter",
        pos: "noun",
        gender: "m",
        example: {
          es: "El albergue recibe a familias sin hogar.",
          en: "The shelter takes in homeless families.",
        },
      },
      {
        id: "v-b2-05-08",
        es: "damnificado",
        en: "disaster victim, person affected by a disaster",
        pos: "noun",
        gender: "m",
        example: {
          es: "Los damnificados necesitan agua potable y ropa.",
          en: "The disaster victims need drinking water and clothes.",
        },
      },
      {
        id: "v-b2-05-09",
        es: "solidaridad",
        en: "solidarity",
        pos: "noun",
        gender: "f",
        example: {
          es: "La solidaridad de los vecinos fue increíble.",
          en: "The neighbors' solidarity was incredible.",
        },
      },
      {
        id: "v-b2-05-10",
        es: "comprometerse",
        en: "to commit (oneself)",
        pos: "verb",
        example: {
          es: "Me comprometí a ayudar dos horas por semana.",
          en: "I committed to helping two hours a week.",
        },
      },
      {
        id: "v-b2-05-11",
        es: "marginado",
        en: "marginalized",
        pos: "adjective",
        example: {
          es: "Trabajamos con comunidades marginadas de la periferia.",
          en: "We work with marginalized communities on the outskirts.",
        },
      },
      {
        id: "v-b2-05-12",
        es: "necesitado",
        en: "needy, in need",
        pos: "adjective",
        example: {
          es: "Repartimos comida a las familias más necesitadas.",
          en: "We hand out food to the families most in need.",
        },
      },
      {
        id: "v-b2-05-13",
        es: "aportar",
        en: "to contribute",
        pos: "verb",
        example: {
          es: "Cada uno aporta lo que puede.",
          en: "Everyone contributes what they can.",
        },
      },
      {
        id: "v-b2-05-14",
        es: "brindar",
        en: "to provide, to offer (also: to toast)",
        pos: "verb",
        example: {
          es: "La fundación brinda apoyo legal gratuito.",
          en: "The foundation provides free legal support.",
        },
      },
      {
        id: "v-b2-05-15",
        es: "impacto",
        en: "impact",
        pos: "noun",
        gender: "m",
        example: {
          es: "El programa tuvo un impacto muy positivo en el barrio.",
          en: "The program had a very positive impact on the neighborhood.",
        },
      },
      {
        id: "v-b2-05-16",
        es: "esfuerzo",
        en: "effort",
        pos: "noun",
        gender: "m",
        example: {
          es: "Gracias a su esfuerzo, reconstruimos la escuela.",
          en: "Thanks to your effort, we rebuilt the school.",
        },
      },
      {
        id: "v-b2-05-17",
        es: "a cambio de",
        en: "in exchange for",
        pos: "phrase",
        example: {
          es: "Trabajó en la granja a cambio de comida y alojamiento.",
          en: "He worked on the farm in exchange for food and lodging.",
        },
      },
    ],
    scenario: {
      title: "Asking a local business for help",
      setting:
        "You coordinate volunteers for a food bank in San José, Costa Rica. After a flood, you urgently need donations and volunteers, so you call a local business owner who has helped before.",
      aiRole: "Don Álvaro, a busy but generous local business owner",
      learnerGoal:
        "Explain what the donations are for and by when you need them, what you can offer in return, and convince him that you can count on each other, using por, para, and verbs with prepositions accurately.",
      opener:
        "¿Aló? Sí, habla Álvaro Jiménez. Ah, usted es del banco de alimentos, ¿verdad? Vi en las noticias lo de la inundación. Dígame, ¿en qué les puedo ayudar esta vez?",
    },
  },

  // ───────────────────────────── B2-06 ─────────────────────────────
  {
    id: "b2-06",
    cefr: "B2",
    order: 30,
    title: "El arte de debatir",
    theme: "Debate and argumentation: work and society",
    canDo: [
      "I can build a structured argument with clear reasons and a conclusion.",
      "I can concede a point and then counter it.",
      "I can take part in a debate about work and society.",
    ],
    grammar: [
      {
        id: "g-b2-06-1",
        title: "Connectors of contrast and concession",
        summary:
          "To contrast ideas in an argument, use pero for simple contrast, and sin embargo or no obstante (however) to start a new sentence or clause. En cambio and mientras que compare two different sides: Yo prefiero la oficina, mientras que mi socio prefiere el teletrabajo. A pesar de (despite) is followed by a noun or infinitive (a pesar del ruido, a pesar de trabajar mucho), while a pesar de que and aunque are followed by a full clause. Sino (but rather) corrects a negative statement: No es un problema de dinero, sino de tiempo.",
        examples: [
          {
            es: "El teletrabajo ahorra tiempo; sin embargo, puede aislar a los empleados.",
            en: "Remote work saves time; however, it can isolate employees.",
          },
          {
            es: "A pesar de las ventajas, muchas empresas quieren que la gente vuelva a la oficina.",
            en: "Despite the advantages, many companies want people to return to the office.",
          },
          {
            es: "No se trata de trabajar más, sino de trabajar mejor.",
            en: "It's not about working more, but about working better.",
          },
        ],
        drills: [
          {
            es: "La propuesta es interesante; ___, es demasiado cara.",
            en: "The proposal is interesting; however, it's too expensive.",
            answer: "sin embargo",
            distractors: ["sino", "a pesar de", "ya que"],
          },
          {
            es: "___ los problemas técnicos, la reunión virtual fue un éxito.",
            en: "Despite the technical problems, the virtual meeting was a success.",
            answer: "A pesar de",
            distractors: ["Aunque", "Sin embargo", "Sino"],
          },
          {
            es: "El problema no es la tecnología, ___ cómo la usamos.",
            en: "The problem isn't technology, but rather how we use it.",
            answer: "sino",
            distractors: ["pero", "sin embargo", "si no"],
          },
          {
            es: "Yo trabajo mejor en casa, ___ mi compañera se concentra más en la oficina.",
            en: "I work better at home, whereas my coworker concentrates better at the office.",
            answer: "mientras que",
            distractors: ["sino que", "por lo tanto", "a pesar de"],
          },
          {
            es: "___ el teletrabajo tiene ventajas, también tiene desventajas.",
            en: "Although remote work has advantages, it also has disadvantages.",
            answer: "Aunque",
            distractors: ["A pesar de", "Sin embargo", "Sino"],
          },
        ],
      },
      {
        id: "g-b2-06-2",
        title: "Cause, consequence, and structuring an argument",
        summary:
          "To give reasons, use porque in the middle of a sentence, and ya que, puesto que, or como at the beginning: Como no hubo consenso, votamos. Debido a (due to) is followed by a noun: debido a la crisis. To show results, use por lo tanto (therefore), por eso (that's why), or así que (so). To organize a longer argument, use en primer lugar, además, por otro lado, and por último, and wrap up with en resumen or en conclusión.",
        examples: [
          {
            es: "Ya que todos estamos aquí, podemos empezar el debate.",
            en: "Since we're all here, we can start the debate.",
          },
          {
            es: "La productividad subió un diez por ciento; por lo tanto, vamos a mantener el modelo híbrido.",
            en: "Productivity went up ten percent; therefore, we're going to keep the hybrid model.",
          },
          {
            es: "En primer lugar, el teletrabajo reduce el tráfico. Además, les da más flexibilidad a las familias.",
            en: "First, remote work reduces traffic. In addition, it gives families more flexibility.",
          },
        ],
        drills: [
          {
            es: "___ no hubo consenso, vamos a votar la propuesta.",
            en: "Since there was no consensus, we're going to vote on the proposal.",
            answer: "Como",
            distractors: ["Porque", "Por lo tanto", "Así que"],
          },
          {
            es: "La oficina cerró ___ la falta de presupuesto.",
            en: "The office closed due to the lack of budget.",
            answer: "debido a",
            distractors: ["ya que", "porque", "por lo tanto"],
          },
          {
            es: "Los empleados están más contentos; ___, la empresa va a mantener el horario flexible.",
            en: "The employees are happier; therefore, the company is going to keep flexible hours.",
            answer: "por lo tanto",
            distractors: ["sin embargo", "ya que", "en cambio"],
          },
          {
            es: "___, quiero agradecerles a todos por participar en este debate.",
            en: "First of all, I want to thank everyone for taking part in this debate.",
            answer: "En primer lugar",
            distractors: ["Por lo tanto", "En cambio", "Sin embargo"],
          },
          {
            es: "___, creo que el modelo híbrido es la mejor opción para todos.",
            en: "In short, I think the hybrid model is the best option for everyone.",
            answer: "En resumen",
            distractors: ["Debido a", "A pesar de", "Ya que"],
          },
        ],
      },
    ],
    vocab: [
      {
        id: "v-b2-06-01",
        es: "argumento",
        en: "argument (a reason or point), line of reasoning",
        pos: "noun",
        gender: "m",
        example: {
          es: "Tu argumento no me convence.",
          en: "Your argument doesn't convince me.",
        },
      },
      {
        id: "v-b2-06-02",
        es: "postura",
        en: "position, stance",
        pos: "noun",
        gender: "f",
        example: {
          es: "¿Cuál es tu postura sobre el teletrabajo?",
          en: "What's your position on remote work?",
        },
      },
      {
        id: "v-b2-06-03",
        es: "debatir",
        en: "to debate",
        pos: "verb",
        example: {
          es: "Debatimos el tema durante dos horas.",
          en: "We debated the issue for two hours.",
        },
      },
      {
        id: "v-b2-06-04",
        es: "convencer",
        en: "to convince",
        pos: "verb",
        example: {
          es: "Me convenció con datos muy claros.",
          en: "She convinced me with very clear data.",
        },
      },
      {
        id: "v-b2-06-05",
        es: "rebatir",
        en: "to refute, to counter",
        pos: "verb",
        example: {
          es: "Es difícil rebatir sus argumentos.",
          en: "It's hard to refute his arguments.",
        },
      },
      {
        id: "v-b2-06-06",
        es: "ventaja",
        en: "advantage",
        pos: "noun",
        gender: "f",
        example: {
          es: "La mayor ventaja es que no pierdo tiempo en el tráfico.",
          en: "The biggest advantage is that I don't waste time in traffic.",
        },
      },
      {
        id: "v-b2-06-07",
        es: "desventaja",
        en: "disadvantage",
        pos: "noun",
        gender: "f",
        example: {
          es: "Una desventaja es que te sientes más solo.",
          en: "One disadvantage is that you feel lonelier.",
        },
      },
      {
        id: "v-b2-06-08",
        es: "teletrabajo",
        en: "remote work, working from home",
        pos: "noun",
        gender: "m",
        example: {
          es: "Desde la pandemia, el teletrabajo es muy común.",
          en: "Since the pandemic, remote work has been very common.",
        },
      },
      {
        id: "v-b2-06-09",
        es: "equilibrio",
        en: "balance",
        pos: "noun",
        gender: "m",
        example: {
          es: "Busco un mejor equilibrio entre el trabajo y la vida personal.",
          en: "I'm looking for a better work-life balance.",
        },
      },
      {
        id: "v-b2-06-10",
        es: "productividad",
        en: "productivity",
        pos: "noun",
        gender: "f",
        example: {
          es: "La productividad del equipo no cambió.",
          en: "The team's productivity didn't change.",
        },
      },
      {
        id: "v-b2-06-11",
        es: "sostener",
        en: "to maintain, to argue (that); to hold",
        pos: "verb",
        example: {
          es: "Sostengo que la semana de cuatro días es posible.",
          en: "I maintain that a four-day week is possible.",
        },
      },
      {
        id: "v-b2-06-12",
        es: "matiz",
        en: "nuance (plural: matices)",
        pos: "noun",
        gender: "m",
        example: {
          es: "Estoy de acuerdo, pero con un matiz importante.",
          en: "I agree, but with one important nuance.",
        },
      },
      {
        id: "v-b2-06-13",
        es: "a favor de",
        en: "in favor of",
        pos: "phrase",
        example: {
          es: "La mayoría está a favor de la semana de cuatro días.",
          en: "Most people are in favor of the four-day week.",
        },
      },
      {
        id: "v-b2-06-14",
        es: "en contra de",
        en: "against",
        pos: "phrase",
        example: {
          es: "Yo estoy en contra de volver a la oficina todos los días.",
          en: "I'm against going back to the office every day.",
        },
      },
      {
        id: "v-b2-06-15",
        es: "contraargumento",
        en: "counterargument",
        pos: "noun",
        gender: "m",
        example: {
          es: "Tengo un contraargumento muy sencillo: los datos dicen lo contrario.",
          en: "I have a very simple counterargument: the data say the opposite.",
        },
      },
      {
        id: "v-b2-06-16",
        es: "prueba",
        en: "proof, evidence; test",
        pos: "noun",
        gender: "f",
        example: {
          es: "No hay pruebas de que el teletrabajo reduzca la productividad.",
          en: "There's no evidence that remote work reduces productivity.",
        },
      },
      {
        id: "v-b2-06-17",
        es: "cuestionar",
        en: "to question, to challenge",
        pos: "verb",
        example: {
          es: "Muchos expertos cuestionan la eficacia de esta medida.",
          en: "Many experts question how effective this measure is.",
        },
      },
      {
        id: "v-b2-06-18",
        es: "consenso",
        en: "consensus",
        pos: "noun",
        gender: "m",
        example: {
          es: "Llegamos a un consenso después de mucho debate.",
          en: "We reached a consensus after a lot of debate.",
        },
      },
    ],
    scenario: {
      title: "Debate: remote work vs. the office",
      setting:
        "Your company in Santiago is deciding whether to end remote work. You've been asked to debate the issue in front of the team with a colleague who holds the opposite view.",
      aiRole: "Rodrigo, a persuasive colleague who argues that everyone should return to the office full-time",
      learnerGoal:
        "Present a structured argument, respond to his points with concessions and counterarguments (es cierto que..., sin embargo...), and propose a conclusion or compromise.",
      opener:
        "Bueno, empiezo yo. En mi opinión, la oficina es insustituible: ahí surgen las mejores ideas y se construye la cultura de la empresa. Además, en casa hay demasiadas distracciones. ¿De verdad crees que el teletrabajo es igual de productivo?",
    },
  },
];
