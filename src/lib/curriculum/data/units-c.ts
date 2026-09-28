import type { Unit } from "../types";

export const unitsC: Unit[] = [
  // ───────────────────────────── C1-01 ─────────────────────────────
  {
    id: "c1-01",
    cefr: "C1",
    order: 31,
    title: "Deseos, apariencias y lamentos",
    theme: "Nuanced subjunctive: sequence of tenses, como si, and ojalá",
    canDo: [
      "Apply the sequence of tenses correctly when reporting requests, emotions, and doubts in the past",
      "Describe impressions and behavior with como si + imperfect or pluperfect subjunctive",
      "Distinguish real hopes, unlikely wishes, and past regrets with ojalá",
    ],
    grammar: [
      {
        id: "g-c1-01-1",
        title: "Sequence of tenses (concordancia de tiempos)",
        summary:
          "When the main clause triggers the subjunctive, the tense of the subordinate verb usually follows the tense of the main verb. A present, future, or present-perfect main verb (quiero, pediré, he pedido) pairs with the present subjunctive (que vengas), while a past or conditional main verb (quería, pedí, pediría) pairs with the imperfect subjunctive (que vinieras). For an action completed before the main verb, use the present perfect subjunctive (haya hecho) after present triggers and the pluperfect subjunctive (hubiera hecho) after past triggers. In Latin America the -ra forms (hablara, hubiera) are far more common in speech than the -se forms (hablase, hubiese).",
        examples: [
          { es: "Me alegra que hayas venido.", en: "I'm glad you've come." },
          {
            es: "Me pidió que le enviara el informe antes del viernes.",
            en: "She asked me to send her the report before Friday.",
          },
          {
            es: "Nos sorprendió que no hubieran avisado a nadie.",
            en: "We were surprised that they hadn't told anyone.",
          },
          {
            es: "Te recomendaría que lo pensaras con calma.",
            en: "I'd recommend that you think it over calmly.",
          },
        ],
        drills: [
          {
            es: "El jefe nos exigió que ___ puntuales.",
            en: "The boss demanded that we be on time.",
            answer: "fuéramos",
            distractors: ["seamos", "éramos", "fuimos"],
          },
          {
            es: "Dudo que ellos ya ___ la noticia.",
            en: "I doubt they've already heard the news.",
            answer: "hayan escuchado",
            distractors: ["hubieran escuchado", "han escuchado", "habían escuchado"],
          },
          {
            es: "Me molestó que no me ___ antes.",
            en: "It bothered me that you hadn't warned me earlier.",
            answer: "hubieras avisado",
            distractors: ["hayas avisado", "habías avisado", "avisas"],
          },
          {
            es: "Buscaban a alguien que ___ hablar tres idiomas.",
            en: "They were looking for someone who knew how to speak three languages.",
            answer: "supiera",
            distractors: ["sabía", "supo", "sabría"],
          },
          {
            es: "Te lo explicaré para que lo ___ mejor.",
            en: "I'll explain it to you so that you understand it better.",
            answer: "entiendas",
            distractors: ["entendieras", "entiendes", "entenderás"],
          },
          {
            es: "Sería mejor que ustedes ___ temprano mañana.",
            en: "It would be better if you all left early tomorrow.",
            answer: "salieran",
            distractors: ["salieron", "salen", "saldrían"],
          },
        ],
      },
      {
        id: "g-c1-01-2",
        title: "Como si and ojalá with the imperfect and pluperfect subjunctive",
        summary:
          "Como si (as if) is always followed by the imperfect subjunctive for a situation happening at the same time (como si fuera rico) or the pluperfect subjunctive for a prior one (como si hubiera visto un fantasma), never by the present subjunctive. Ojalá changes meaning with tense: ojalá + present subjunctive expresses a real, possible hope (ojalá llueva), ojalá + imperfect subjunctive expresses an unlikely or impossible wish about now or the future (ojalá tuviera más tiempo), and ojalá + pluperfect subjunctive expresses regret about the past (ojalá hubiera estudiado más).",
        examples: [
          { es: "Habla como si lo supiera todo.", en: "He talks as if he knew everything." },
          {
            es: "Me miró como si nunca me hubiera visto.",
            en: "She looked at me as if she had never seen me.",
          },
          { es: "Ojalá viviera más cerca del mar.", en: "I wish I lived closer to the sea." },
          {
            es: "Ojalá no le hubiera dicho la verdad.",
            en: "I wish I hadn't told him the truth.",
          },
        ],
        drills: [
          {
            es: "Gasta dinero como si ___ millonario.",
            en: "He spends money as if he were a millionaire.",
            answer: "fuera",
            distractors: ["sea", "es", "será"],
          },
          {
            es: "Ojalá ___ más tiempo libre este año, pero es imposible.",
            en: "I wish I had more free time this year, but it's impossible.",
            answer: "tuviera",
            distractors: ["tenga", "tengo", "tendría"],
          },
          {
            es: "Ojalá ___ a tiempo; ahora ya es demasiado tarde.",
            en: "I wish we had arrived on time; now it's too late.",
            answer: "hubiéramos llegado",
            distractors: ["lleguemos", "llegáramos", "habíamos llegado"],
          },
          {
            es: "Se comportó como si no ___ nada.",
            en: "He behaved as if nothing had happened.",
            answer: "hubiera pasado",
            distractors: ["haya pasado", "había pasado", "pasa"],
          },
          {
            es: "Ojalá no ___ mañana; tenemos un pícnic en el parque.",
            en: "I hope it doesn't rain tomorrow; we have a picnic in the park.",
            answer: "llueva",
            distractors: ["llovió", "llueve", "lloverá"],
          },
        ],
      },
    ],
    vocab: [
      {
        id: "v-c1-01-01",
        es: "arrepentimiento",
        en: "regret, remorse",
        pos: "noun",
        gender: "m",
        example: {
          es: "Sintió un profundo arrepentimiento por no haberse despedido.",
          en: "He felt deep regret for not having said goodbye.",
        },
      },
      {
        id: "v-c1-01-02",
        es: "arrepentirse (de)",
        en: "to regret, to be sorry (for)",
        pos: "verb",
        example: {
          es: "No me arrepiento de nada de lo que hice.",
          en: "I don't regret anything I did.",
        },
      },
      {
        id: "v-c1-01-03",
        es: "anhelar",
        en: "to long for, to yearn for",
        pos: "verb",
        example: {
          es: "Anhelaba volver a su tierra natal.",
          en: "She longed to return to her homeland.",
        },
      },
      {
        id: "v-c1-01-04",
        es: "añoranza",
        en: "longing, nostalgia",
        pos: "noun",
        gender: "f",
        example: {
          es: "Habla de su infancia en Guadalajara con añoranza.",
          en: "He speaks of his childhood in Guadalajara with longing.",
        },
      },
      {
        id: "v-c1-01-05",
        es: "lamentar",
        en: "to regret, to be sorry about",
        pos: "verb",
        example: {
          es: "Lamentamos que no hayas podido venir.",
          en: "We're sorry you weren't able to come.",
        },
      },
      {
        id: "v-c1-01-06",
        es: "fingir",
        en: "to pretend, to fake",
        pos: "verb",
        example: {
          es: "Fingió que no le importaba, pero se le notaba triste.",
          en: "She pretended she didn't care, but you could tell she was sad.",
        },
      },
      {
        id: "v-c1-01-07",
        es: "disimular",
        en: "to hide, to conceal (a feeling); to act as if nothing is wrong",
        pos: "verb",
        example: {
          es: "Intentó disimular su nerviosismo durante la entrevista.",
          en: "He tried to hide his nervousness during the interview.",
        },
      },
      {
        id: "v-c1-01-08",
        es: "expectativa",
        en: "expectation",
        pos: "noun",
        gender: "f",
        example: {
          es: "La película no estuvo a la altura de mis expectativas.",
          en: "The movie didn't live up to my expectations.",
        },
      },
      {
        id: "v-c1-01-09",
        es: "desengaño",
        en: "disillusionment, letdown",
        pos: "noun",
        gender: "m",
        example: {
          es: "Se llevó un gran desengaño cuando supo la verdad.",
          en: "She was deeply disillusioned when she learned the truth.",
        },
      },
      {
        id: "v-c1-01-10",
        es: "hacerse ilusiones",
        en: "to get one's hopes up",
        pos: "phrase",
        example: {
          es: "No te hagas ilusiones; es difícil que nos den el préstamo.",
          en: "Don't get your hopes up; it's unlikely they'll give us the loan.",
        },
      },
      {
        id: "v-c1-01-11",
        es: "en vano",
        en: "in vain",
        pos: "phrase",
        example: {
          es: "Lo buscamos toda la tarde, pero en vano.",
          en: "We looked for it all afternoon, but in vain.",
        },
      },
      {
        id: "v-c1-01-12",
        es: "a estas alturas",
        en: "at this point, by now",
        pos: "phrase",
        example: {
          es: "A estas alturas ya no tiene sentido quejarse.",
          en: "At this point there's no sense in complaining.",
        },
      },
      {
        id: "v-c1-01-13",
        es: "a regañadientes",
        en: "reluctantly, grudgingly",
        pos: "phrase",
        example: {
          es: "Aceptó a regañadientes que su hermano tenía razón.",
          en: "He grudgingly accepted that his brother was right.",
        },
      },
      {
        id: "v-c1-01-14",
        es: "ojalá",
        en: "I hope; if only, I wish",
        pos: "interjection",
        example: {
          es: "Ojalá lo hubiera sabido antes.",
          en: "If only I had known sooner.",
        },
      },
    ],
    scenario: {
      title: "A reunion full of what-ifs",
      setting:
        "You run into an old friend from your exchange year in Mexico whom you haven't seen in ten years. Over coffee, you talk about how your lives turned out, what you miss, and what you'd do differently.",
      aiRole: "Mariana, an old friend from Monterrey who is warm, a bit nostalgic, and curious about your life",
      learnerGoal:
        "Talk about past wishes and regrets with ojalá + pluperfect subjunctive, describe people's behavior with como si, and report what others asked or wanted using the correct sequence of tenses.",
      opener:
        "¡No puedo creer que hayan pasado diez años! Me miras como si hubieras visto un fantasma. A veces pienso en todo lo que habría sido distinto si no me hubiera quedado en Monterrey. ¿Y tú? ¿Hay algo que te hubiera gustado hacer de otra manera?",
    },
  },

  // ───────────────────────────── C1-02 ─────────────────────────────
  {
    id: "c1-02",
    cefr: "C1",
    order: 32,
    title: "Lo que pudo haber sido",
    theme: "Conditional perfect and mixed hypotheticals",
    canDo: [
      "Speculate about how past events could have turned out differently",
      "Connect past decisions with present consequences using mixed hypotheticals",
      "Give advice by imagining yourself in someone else's position",
    ],
    grammar: [
      {
        id: "g-c1-02-1",
        title: "The conditional perfect and past unreal conditions",
        summary:
          "The conditional perfect (habría + past participle) expresses what would have happened under different circumstances: habría ido, habrían ganado. It pairs with si + pluperfect subjunctive to form past contrary-to-fact conditions: Si hubiera sabido, habría venido. In everyday Latin American speech you will often hear the pluperfect subjunctive in both halves (Si hubiera sabido, hubiera venido); this is widely accepted, but habría is preferred in careful writing. De + perfect infinitive (De haberlo sabido...) is a compact, elegant alternative to the si-clause.",
        examples: [
          {
            es: "Si hubieras llamado, te habría recogido en el aeropuerto.",
            en: "If you had called, I would have picked you up at the airport.",
          },
          {
            es: "Yo, en tu lugar, habría aceptado la oferta.",
            en: "In your place, I would have accepted the offer.",
          },
          {
            es: "De haberlo sabido, no habríamos invertido tanto dinero.",
            en: "Had we known, we wouldn't have invested so much money.",
          },
          {
            es: "Si no hubiera llovido, no se habría suspendido el partido.",
            en: "If it hadn't rained, the game wouldn't have been called off.",
          },
        ],
        drills: [
          {
            es: "Si ___ el mapa, no nos habríamos perdido.",
            en: "If we had brought the map, we wouldn't have gotten lost.",
            answer: "hubiéramos traído",
            distractors: ["habríamos traído", "habíamos traído", "trajimos"],
          },
          {
            es: "Si me hubieras invitado, ___ con gusto.",
            en: "If you had invited me, I would have gone gladly.",
            answer: "habría ido",
            distractors: ["iría", "había ido", "haya ido"],
          },
          {
            es: "De ___ la verdad, no le habría prestado el carro.",
            en: "Had I known the truth, I wouldn't have lent him the car.",
            answer: "haber sabido",
            distractors: ["había sabido", "hubiera sabido", "sabiendo"],
          },
          {
            es: "Ellos ___ el partido si el árbitro no hubiera anulado el gol.",
            en: "They would have won the game if the referee hadn't disallowed the goal.",
            answer: "habrían ganado",
            distractors: ["ganarían", "habían ganado", "hayan ganado"],
          },
          {
            es: "¿Qué ___ tú en mi situación el año pasado?",
            en: "What would you have done in my situation last year?",
            answer: "habrías hecho",
            distractors: ["hayas hecho", "habías hecho", "habrás hecho"],
          },
        ],
      },
      {
        id: "g-c1-02-2",
        title: "Mixed hypotheticals",
        summary:
          "Real-life hypotheticals often mix time frames. To connect a past condition with a present result, use si + pluperfect subjunctive with the simple conditional: Si hubiera estudiado medicina, ahora sería médico. To connect a present or permanent condition with a past result, use si + imperfect subjunctive with the conditional perfect: Si fuera más paciente, no habría discutido con ella. Time markers such as ahora, hoy, ayer, and el año pasado help you choose the right combination.",
        examples: [
          {
            es: "Si hubiera aceptado ese trabajo, hoy viviría en Bogotá.",
            en: "If I had accepted that job, today I would be living in Bogotá.",
          },
          {
            es: "Si no fuera tan terco, ya habría pedido ayuda.",
            en: "If he weren't so stubborn, he would have asked for help already.",
          },
          {
            es: "Si hubiéramos ahorrado más, ahora no tendríamos deudas.",
            en: "If we had saved more, we wouldn't be in debt now.",
          },
          {
            es: "Si hablaras portugués, te habrían mandado a la oficina de São Paulo.",
            en: "If you spoke Portuguese, they would have sent you to the São Paulo office.",
          },
        ],
        drills: [
          {
            es: "Si no hubiera perdido el vuelo, ahora ___ en la playa.",
            en: "If I hadn't missed the flight, I would be at the beach now.",
            answer: "estaría",
            distractors: ["habría estado", "estaba", "esté"],
          },
          {
            es: "Si ___ más organizada, no habría olvidado la reunión de ayer.",
            en: "If she were a more organized person, she wouldn't have forgotten yesterday's meeting.",
            answer: "fuera",
            distractors: ["sea", "es", "habría sido"],
          },
          {
            es: "Si hubieras dormido bien anoche, hoy no ___ tan cansado.",
            en: "If you had slept well last night, you wouldn't be so tired today.",
            answer: "estarías",
            distractors: ["habrías estado", "estás", "estuvieras"],
          },
          {
            es: "Si yo ___ inglés, habría conseguido ese puesto el año pasado.",
            en: "If I spoke English, I would have gotten that position last year.",
            answer: "hablara",
            distractors: ["hable", "hablo", "hablaría"],
          },
          {
            es: "Si ellos hubieran invertido en esa empresa, hoy ___ ricos.",
            en: "If they had invested in that company, they would be rich today.",
            answer: "serían",
            distractors: ["habrían sido", "son", "fueran"],
          },
        ],
      },
    ],
    vocab: [
      {
        id: "v-c1-02-01",
        es: "encrucijada",
        en: "crossroads (a difficult decision point)",
        pos: "noun",
        gender: "f",
        example: {
          es: "Estoy en una encrucijada: seguir en mi trabajo o empezar mi propio negocio.",
          en: "I'm at a crossroads: stay at my job or start my own business.",
        },
      },
      {
        id: "v-c1-02-02",
        es: "disyuntiva",
        en: "dilemma, choice between two options",
        pos: "noun",
        gender: "f",
        example: {
          es: "Nos enfrentamos a la disyuntiva de vender la casa o rentarla.",
          en: "We face the dilemma of selling the house or renting it out.",
        },
      },
      {
        id: "v-c1-02-03",
        es: "remordimiento",
        en: "remorse, guilt",
        pos: "noun",
        gender: "m",
        example: {
          es: "Le quedó el remordimiento de no haber visitado a su padre.",
          en: "He was left with the guilt of not having visited his father.",
        },
      },
      {
        id: "v-c1-02-04",
        es: "arriesgarse",
        en: "to take a risk",
        pos: "verb",
        example: {
          es: "Si no te arriesgas, nunca sabrás si lo habrías logrado.",
          en: "If you don't take the risk, you'll never know whether you would have made it.",
        },
      },
      {
        id: "v-c1-02-05",
        es: "desaprovechar",
        en: "to waste, to fail to take advantage of",
        pos: "verb",
        example: {
          es: "Desaprovechó la beca por miedo a vivir en el extranjero.",
          en: "She wasted the scholarship out of fear of living abroad.",
        },
      },
      {
        id: "v-c1-02-06",
        es: "replantearse",
        en: "to reconsider, to rethink",
        pos: "verb",
        example: {
          es: "Después del accidente, se replanteó sus prioridades.",
          en: "After the accident, he rethought his priorities.",
        },
      },
      {
        id: "v-c1-02-07",
        es: "sopesar",
        en: "to weigh up",
        pos: "verb",
        example: {
          es: "Hay que sopesar los pros y los contras antes de firmar.",
          en: "You have to weigh up the pros and cons before signing.",
        },
      },
      {
        id: "v-c1-02-08",
        es: "rumbo",
        en: "course, direction",
        pos: "noun",
        gender: "m",
        example: {
          es: "Su vida cambió de rumbo cuando se mudó a Lima.",
          en: "Her life changed course when she moved to Lima.",
        },
      },
      {
        id: "v-c1-02-09",
        es: "azar",
        en: "chance, luck",
        pos: "noun",
        gender: "m",
        example: {
          es: "Nos conocimos por puro azar en un aeropuerto.",
          en: "We met by pure chance at an airport.",
        },
      },
      {
        id: "v-c1-02-10",
        es: "corazonada",
        en: "hunch, gut feeling",
        pos: "noun",
        gender: "f",
        example: {
          es: "Tuve la corazonada de que algo iba a salir mal.",
          en: "I had a hunch that something was going to go wrong.",
        },
      },
      {
        id: "v-c1-02-11",
        es: "imprevisto",
        en: "unforeseen event, last-minute setback",
        pos: "noun",
        gender: "m",
        example: {
          es: "Surgió un imprevisto y tuve que cancelar el viaje.",
          en: "Something unexpected came up and I had to cancel the trip.",
        },
      },
      {
        id: "v-c1-02-12",
        es: "a la larga",
        en: "in the long run",
        pos: "phrase",
        example: {
          es: "A la larga, habría sido más barato comprar que rentar.",
          en: "In the long run, it would have been cheaper to buy than to rent.",
        },
      },
      {
        id: "v-c1-02-13",
        es: "en retrospectiva",
        en: "in hindsight",
        pos: "phrase",
        example: {
          es: "En retrospectiva, habría sido mejor esperar un año.",
          en: "In hindsight, it would have been better to wait a year.",
        },
      },
      {
        id: "v-c1-02-14",
        es: "dar un giro",
        en: "to take a turn, to change direction",
        pos: "phrase",
        example: {
          es: "Su carrera dio un giro inesperado a los cuarenta.",
          en: "His career took an unexpected turn at forty.",
        },
      },
      {
        id: "v-c1-02-15",
        es: "tomar las riendas",
        en: "to take control, to take the reins",
        pos: "phrase",
        example: {
          es: "Decidió tomar las riendas de su vida y cambiar de carrera.",
          en: "She decided to take control of her life and change careers.",
        },
      },
    ],
    scenario: {
      title: "Talking through a career crossroads",
      setting:
        "You meet with a career mentor in Santiago de Chile. You're torn between two paths, and she asks you to reflect on past decisions that led you here and imagine how things might have gone differently.",
      aiRole: "Carolina, an experienced and thoughtful career mentor who asks probing questions",
      learnerGoal:
        "Explain how you got to this point, speculate about alternative outcomes with si + pluperfect subjunctive and the conditional perfect, and link past choices to your present situation with mixed hypotheticals.",
      opener:
        "Bueno, cuéntame cómo llegaste a esta encrucijada. Si pudieras volver cinco años atrás, ¿qué decisión habrías tomado de otra manera, y dónde crees que estarías ahora?",
    },
  },

  // ───────────────────────────── C1-03 ─────────────────────────────
  {
    id: "c1-03",
    cefr: "C1",
    order: 33,
    title: "Registro y modismos",
    theme: "Formality, politeness, and colloquial Spanish across Latin America",
    canDo: [
      "Switch appropriately between formal and informal registers in the same conversation",
      "Soften requests and complaints with courtesy forms and diminutives",
      "Recognize and use common colloquialisms from different Latin American countries",
    ],
    grammar: [
      {
        id: "g-c1-03-1",
        title: "Courtesy forms: softening requests",
        summary:
          "Polite Spanish softens requests by moving verbs away from the plain present. The conditional (¿Podría...?, Me gustaría...), the imperfect subjunctive of querer (Quisiera...), and the 'imperfect of courtesy' (Quería preguntarle...) all sound more tentative and respectful than quiero or puede. Combine these with usted and formulas such as ¿Sería tan amable de...? or Le agradecería que + imperfect subjunctive in professional emails and service situations. In much of Latin America, blunt commands can sound rude even among acquaintances, so these softeners are used constantly.",
        examples: [
          {
            es: "Quisiera hacer una reservación para cuatro personas.",
            en: "I would like to make a reservation for four people.",
          },
          { es: "¿Sería tan amable de firmar aquí?", en: "Would you be so kind as to sign here?" },
          {
            es: "Le agradecería que me enviara la factura por correo.",
            en: "I would appreciate it if you sent me the invoice by email.",
          },
          {
            es: "Quería preguntarle si todavía hay lugares disponibles.",
            en: "I wanted to ask you whether there are still spots available.",
          },
        ],
        drills: [
          {
            es: "___ hablar con la gerente, por favor.",
            en: "I would like to speak with the manager, please.",
            answer: "Quisiera",
            distractors: ["Quiera", "Quise", "Querré"],
          },
          {
            es: "Le agradecería que me ___ antes del lunes.",
            en: "I would appreciate it if you replied to me before Monday.",
            answer: "respondiera",
            distractors: ["respondió", "responde", "respondería"],
          },
          {
            es: "¿___ decirme dónde queda la oficina de migración?",
            en: "Could you tell me where the immigration office is?",
            answer: "Podría",
            distractors: ["Pueda", "Pudo", "Pudiendo"],
          },
          {
            es: "¿Sería tan amable ___ cerrar la ventana?",
            en: "Would you be so kind as to close the window?",
            answer: "de",
            distractors: ["que", "a", "en"],
          },
          {
            es: "Disculpe, ___ saber si aceptan tarjeta.",
            en: "Excuse me, I wanted to know if you accept cards.",
            answer: "quería",
            distractors: ["quise", "querré", "quiera"],
          },
        ],
      },
      {
        id: "g-c1-03-2",
        title: "Diminutives and affective language",
        summary:
          "Latin American Spanish uses diminutives (-ito/-ita, -cito/-cita) far beyond physical size: they soften requests, show affection, and make speech sound friendly or modest. Un momentito, un cafecito, or ¿me haces un favorcito? feel warmer than the plain forms. Even adverbs take them (cerquita, rapidito), and some shift meaning: in Mexico, ahorita can mean 'right now' or 'in a little while' depending on context. Words ending in -e, -n, or -r usually take -cito (cafecito, camioncito, amorcito).",
        examples: [
          {
            es: "Espérame un momentito, ya casi termino.",
            en: "Wait for me just a moment, I'm almost done.",
          },
          {
            es: "¿Nos tomamos un cafecito antes de la reunión?",
            en: "Shall we grab a quick coffee before the meeting?",
          },
          {
            es: "La farmacia está cerquita, a dos cuadras.",
            en: "The pharmacy is really close, two blocks away.",
          },
          { es: "Ahorita lo hago, no te preocupes.", en: "I'll do it in a bit, don't worry." },
        ],
        drills: [
          {
            es: "¿Me haces un ___? Necesito que me prestes tu cargador.",
            en: "Can you do me a little favor? I need to borrow your charger.",
            answer: "favorcito",
            distractors: ["favorito", "favorita", "favorcita"],
          },
          {
            es: "Tómate un ___ conmigo antes de irte.",
            en: "Have a little coffee with me before you go.",
            answer: "cafecito",
            distractors: ["cafito", "cafecita", "cafetera"],
          },
          {
            es: "Vivimos ___, puedes venir caminando.",
            en: "We live really close by; you can walk over.",
            answer: "cerquita",
            distractors: ["cerquito", "cercita", "cercito"],
          },
          {
            es: "Dame un ___, ya casi estoy listo.",
            en: "Give me a quick second, I'm almost ready.",
            answer: "segundito",
            distractors: ["segundita", "segundón", "segundazo"],
          },
        ],
      },
    ],
    vocab: [
      {
        id: "v-c1-03-01",
        es: "chévere",
        en: "great, cool (Venezuela, Colombia, Caribbean)",
        pos: "adjective",
        example: {
          es: "¡Qué chévere que pudiste venir a la fiesta!",
          en: "How great that you could come to the party!",
        },
      },
      {
        id: "v-c1-03-02",
        es: "¡Qué padre!",
        en: "How cool! (Mexico)",
        pos: "phrase",
        example: {
          es: "¿Te vas a Oaxaca de vacaciones? ¡Qué padre!",
          en: "You're going to Oaxaca on vacation? How cool!",
        },
      },
      {
        id: "v-c1-03-03",
        es: "bacán",
        en: "cool, awesome (Chile, Peru, Colombia)",
        pos: "adjective",
        example: {
          es: "El concierto de anoche estuvo bacán.",
          en: "Last night's concert was awesome.",
        },
      },
      {
        id: "v-c1-03-04",
        es: "chamba",
        en: "job, work (Mexico, Peru, Central America)",
        pos: "noun",
        gender: "f",
        example: {
          es: "Por fin encontré chamba en una agencia de diseño.",
          en: "I finally found work at a design agency.",
        },
      },
      {
        id: "v-c1-03-05",
        es: "plata",
        en: "money (much of Latin America; literally 'silver')",
        pos: "noun",
        gender: "f",
        example: {
          es: "No tengo plata para salir este fin de semana.",
          en: "I don't have money to go out this weekend.",
        },
      },
      {
        id: "v-c1-03-06",
        es: "cuate",
        en: "buddy, pal (Mexico)",
        pos: "noun",
        gender: "m",
        example: {
          es: "Voy a ver el partido con unos cuates.",
          en: "I'm going to watch the game with some buddies.",
        },
      },
      {
        id: "v-c1-03-07",
        es: "tinto",
        en: "black coffee (Colombia); red wine elsewhere",
        pos: "noun",
        gender: "m",
        example: {
          es: "En Bogotá, si te ofrecen un tinto, es un café negro, no vino.",
          en: "In Bogotá, if they offer you a 'tinto', it's black coffee, not wine.",
        },
      },
      {
        id: "v-c1-03-08",
        es: "guagua",
        en: "bus (Cuba, Puerto Rico, Dominican Republic); baby (Chile, Andes)",
        pos: "noun",
        gender: "f",
        example: {
          es: "En Santo Domingo tomamos la guagua para ir al centro.",
          en: "In Santo Domingo we took the bus downtown.",
        },
      },
      {
        id: "v-c1-03-09",
        es: "ponerse las pilas",
        en: "to get one's act together, to get moving",
        pos: "phrase",
        example: {
          es: "Si quieres aprobar el examen, ponte las pilas.",
          en: "If you want to pass the exam, get your act together.",
        },
      },
      {
        id: "v-c1-03-10",
        es: "meter la pata",
        en: "to put one's foot in it, to blunder",
        pos: "phrase",
        example: {
          es: "Metí la pata cuando le pregunté por su ex.",
          en: "I put my foot in it when I asked her about her ex.",
        },
      },
      {
        id: "v-c1-03-11",
        es: "tomarle el pelo a alguien",
        en: "to pull someone's leg",
        pos: "phrase",
        example: {
          es: "No te creo, me estás tomando el pelo.",
          en: "I don't believe you, you're pulling my leg.",
        },
      },
      {
        id: "v-c1-03-12",
        es: "no tener pelos en la lengua",
        en: "to not mince words, to be outspoken",
        pos: "phrase",
        example: {
          es: "Mi abuela no tiene pelos en la lengua: siempre dice lo que piensa.",
          en: "My grandmother doesn't mince words: she always says what she thinks.",
        },
      },
      {
        id: "v-c1-03-13",
        es: "dar papaya",
        en: "to make yourself an easy target, e.g. by flashing valuables (Colombia)",
        pos: "phrase",
        example: {
          es: "No saques el celular en el bus; no hay que dar papaya.",
          en: "Don't take your phone out on the bus; don't make yourself a target.",
        },
      },
      {
        id: "v-c1-03-14",
        es: "estar en la luna",
        en: "to be daydreaming, to be absent-minded",
        pos: "phrase",
        example: {
          es: "Perdón, no te escuché; estaba en la luna.",
          en: "Sorry, I didn't hear you; I was miles away.",
        },
      },
      {
        id: "v-c1-03-15",
        es: "costar un ojo de la cara",
        en: "to cost an arm and a leg",
        pos: "phrase",
        example: {
          es: "Los boletos para la final costaron un ojo de la cara.",
          en: "The tickets for the final cost an arm and a leg.",
        },
      },
    ],
    scenario: {
      title: "A job interview that turns casual",
      setting:
        "You're interviewing at a design studio in Bogotá. The interviewer starts off formal, but once the official questions are over, she relaxes and chats with you like a future colleague. Match her register as it shifts.",
      aiRole: "Lucía, a hiring manager in Bogotá who is formal at first and friendly and colloquial later",
      learnerGoal:
        "Use usted and courtesy forms (quisiera, podría, le agradecería) during the formal part, then shift naturally to a relaxed tone and use at least two colloquial expressions appropriately.",
      opener:
        "Buenas tardes, bienvenido. Siga, por favor, tome asiento. ¿Le puedo ofrecer un tinto o un poquito de agua antes de empezar?",
    },
  },

  // ───────────────────────────── C1-04 ─────────────────────────────
  {
    id: "c1-04",
    cefr: "C1",
    order: 34,
    title: "El arte de argumentar",
    theme: "Advanced discourse: relative pronouns and nominalization",
    canDo: [
      "Build complex sentences with el cual, lo que, lo cual, and cuyo",
      "Condense ideas with nominalizations such as lo + adjective and verb-derived nouns",
      "Present and defend a structured argument in a formal discussion",
    ],
    grammar: [
      {
        id: "g-c1-04-1",
        title: "Relative pronouns: el cual, lo que, lo cual, cuyo",
        summary:
          "After prepositions, especially longer ones (a través de, según, debido a), formal Spanish prefers el cual / la cual / los cuales / las cuales (or el que) instead of plain que: la razón por la cual renunció. Lo que and lo cual refer back to a whole idea rather than a single noun; after a comma both work (Llegó tarde, lo cual molestó a todos), but only lo que can begin a sentence meaning 'what' (Lo que necesito es tiempo). Cuyo means 'whose' and agrees in gender and number with the thing possessed, not with the owner: el autor cuyas novelas leí.",
        examples: [
          {
            es: "Esa es la empresa para la cual trabajé cinco años.",
            en: "That's the company I worked for for five years.",
          },
          {
            es: "No respondió a mis mensajes, lo cual me pareció raro.",
            en: "He didn't reply to my messages, which seemed strange to me.",
          },
          {
            es: "Lo que más me preocupa es la falta de transparencia.",
            en: "What worries me most is the lack of transparency.",
          },
          {
            es: "Conocí a una escritora cuyos libros se estudian en las universidades.",
            en: "I met a writer whose books are studied at universities.",
          },
        ],
        drills: [
          {
            es: "Es un proyecto ___ objetivo principal es reducir la pobreza.",
            en: "It's a project whose main goal is to reduce poverty.",
            answer: "cuyo",
            distractors: ["cuya", "cuyos", "el cual"],
          },
          {
            es: "La ciudad ___ nació mi abuela ha cambiado muchísimo.",
            en: "The city where my grandmother was born has changed a great deal.",
            answer: "en la cual",
            distractors: ["la cual", "en el cual", "en cuya"],
          },
          {
            es: "Se canceló el vuelo, ___ nos obligó a pasar la noche en el aeropuerto.",
            en: "The flight was canceled, which forced us to spend the night at the airport.",
            answer: "lo cual",
            distractors: ["el cual", "la cual", "cuyo"],
          },
          {
            es: "___ me molesta no es el ruido, sino la actitud.",
            en: "What bothers me isn't the noise, but the attitude.",
            answer: "Lo que",
            distractors: ["Lo cual", "El cual", "Que"],
          },
          {
            es: "Estas son las razones por ___ decidimos mudarnos.",
            en: "These are the reasons why we decided to move.",
            answer: "las cuales",
            distractors: ["los cuales", "lo cual", "cuyas"],
          },
          {
            es: "Hablé con la vecina, ___ hijos estudian con los míos.",
            en: "I spoke with the neighbor whose kids go to school with mine.",
            answer: "cuyos",
            distractors: ["cuya", "que sus", "la cual"],
          },
        ],
      },
      {
        id: "g-c1-04-2",
        title: "Nominalization: lo + adjective, el + infinitive, and verb-derived nouns",
        summary:
          "Formal Spanish often turns qualities and actions into noun phrases to build dense, cohesive arguments. Lo + adjective or participle names an abstract quality or idea: lo importante (the important thing), lo ocurrido (what happened), lo más difícil (the hardest part). The infinitive can work as a noun, optionally with el: El madrugar nunca ha sido lo mío. Nouns derived from verbs (la aprobación, el aumento, el hallazgo) let you compress whole clauses, a hallmark of academic and journalistic writing.",
        examples: [
          {
            es: "Lo interesante del estudio es su metodología.",
            en: "The interesting thing about the study is its methodology.",
          },
          {
            es: "Lo ocurrido en la asamblea generó mucha polémica.",
            en: "What happened at the assembly caused a lot of controversy.",
          },
          {
            es: "La aprobación de la ley provocó un aumento de las protestas.",
            en: "The passing of the law led to an increase in protests.",
          },
          {
            es: "El hecho de que nadie se haya quejado no significa que todos estén de acuerdo.",
            en: "The fact that nobody has complained doesn't mean everyone agrees.",
          },
        ],
        drills: [
          {
            es: "___ difícil es mantener la motivación a largo plazo.",
            en: "The hard part is staying motivated in the long run.",
            answer: "Lo",
            distractors: ["El", "La", "Los"],
          },
          {
            es: "Todos quedamos impresionados por ___ ocurrido en la conferencia.",
            en: "We were all impressed by what happened at the conference.",
            answer: "lo",
            distractors: ["el", "la", "que"],
          },
          {
            es: "___ madrugar nunca ha sido lo mío.",
            en: "Getting up early has never been my thing.",
            answer: "El",
            distractors: ["Lo", "La", "Un"],
          },
          {
            es: "La ___ del presupuesto se retrasó hasta enero.",
            en: "The approval of the budget was delayed until January.",
            answer: "aprobación",
            distractors: ["aprobar", "aprobado", "aprobando"],
          },
          {
            es: "Lo más ___ fue la reacción del público.",
            en: "The most surprising thing was the audience's reaction.",
            answer: "sorprendente",
            distractors: ["sorprendido", "sorpresa", "sorprendentemente"],
          },
        ],
      },
    ],
    vocab: [
      {
        id: "v-c1-04-01",
        es: "planteamiento",
        en: "approach; way of framing an issue",
        pos: "noun",
        gender: "m",
        example: {
          es: "Su planteamiento del problema me parece demasiado simplista.",
          en: "His way of framing the problem seems too simplistic to me.",
        },
      },
      {
        id: "v-c1-04-02",
        es: "plantear",
        en: "to raise (an issue), to pose (a question)",
        pos: "verb",
        example: {
          es: "La investigadora planteó una pregunta que nadie supo responder.",
          en: "The researcher raised a question that nobody could answer.",
        },
      },
      {
        id: "v-c1-04-03",
        es: "ámbito",
        en: "sphere, field, domain",
        pos: "noun",
        gender: "m",
        example: {
          es: "Este cambio afecta tanto al ámbito laboral como al familiar.",
          en: "This change affects both the professional and the family sphere.",
        },
      },
      {
        id: "v-c1-04-04",
        es: "índole",
        en: "nature, kind",
        pos: "noun",
        gender: "f",
        example: {
          es: "Recibimos quejas de toda índole.",
          en: "We received complaints of every kind.",
        },
      },
      {
        id: "v-c1-04-05",
        es: "subyacente",
        en: "underlying",
        pos: "adjective",
        example: {
          es: "El problema subyacente es la falta de inversión pública.",
          en: "The underlying problem is the lack of public investment.",
        },
      },
      {
        id: "v-c1-04-06",
        es: "premisa",
        en: "premise",
        pos: "noun",
        gender: "f",
        example: {
          es: "Tu argumento parte de una premisa falsa.",
          en: "Your argument starts from a false premise.",
        },
      },
      {
        id: "v-c1-04-07",
        es: "matizar",
        en: "to qualify, to add nuance to",
        pos: "verb",
        example: {
          es: "Quisiera matizar lo que dije hace un momento.",
          en: "I'd like to qualify what I said a moment ago.",
        },
      },
      {
        id: "v-c1-04-08",
        es: "hallazgo",
        en: "finding, discovery",
        pos: "noun",
        gender: "m",
        example: {
          es: "Los hallazgos del estudio contradicen la hipótesis inicial.",
          en: "The study's findings contradict the initial hypothesis.",
        },
      },
      {
        id: "v-c1-04-09",
        es: "vigencia",
        en: "validity, current relevance",
        pos: "noun",
        gender: "f",
        example: {
          es: "Sus ideas siguen teniendo vigencia hoy en día.",
          en: "His ideas are still relevant today.",
        },
      },
      {
        id: "v-c1-04-10",
        es: "recalcar",
        en: "to stress, to emphasize",
        pos: "verb",
        example: {
          es: "La directora recalcó la importancia de la puntualidad.",
          en: "The director stressed the importance of punctuality.",
        },
      },
      {
        id: "v-c1-04-11",
        es: "no obstante",
        en: "nevertheless, however",
        pos: "phrase",
        example: {
          es: "El plan es costoso; no obstante, es necesario.",
          en: "The plan is expensive; nevertheless, it is necessary.",
        },
      },
      {
        id: "v-c1-04-12",
        es: "por ende",
        en: "therefore, consequently",
        pos: "phrase",
        example: {
          es: "La demanda aumentó y, por ende, subieron los precios.",
          en: "Demand increased and, consequently, prices went up.",
        },
      },
      {
        id: "v-c1-04-13",
        es: "cabe destacar que",
        en: "it is worth noting that",
        pos: "phrase",
        example: {
          es: "Cabe destacar que la participación fue mayor que el año pasado.",
          en: "It is worth noting that turnout was higher than last year.",
        },
      },
      {
        id: "v-c1-04-14",
        es: "a raíz de",
        en: "as a result of, following",
        pos: "phrase",
        example: {
          es: "A raíz de la crisis, muchas pequeñas empresas cerraron.",
          en: "As a result of the crisis, many small businesses closed.",
        },
      },
      {
        id: "v-c1-04-15",
        es: "en cuanto a",
        en: "as for, regarding",
        pos: "phrase",
        example: {
          es: "En cuanto a la financiación, todavía no hay nada decidido.",
          en: "As for the funding, nothing has been decided yet.",
        },
      },
    ],
    scenario: {
      title: "Roundtable on remote work",
      setting:
        "You're a panelist at a university roundtable in Buenos Aires on the future of remote work. The moderator will ask for your position, press you on weak points, and invite you to respond to counterarguments.",
      aiRole: "Dr. Martín Ferreyra, a sharp but courteous moderator who addresses panelists as usted",
      learnerGoal:
        "Present and defend a structured argument using relative clauses (el cual, lo que, cuyo), nominalized phrases (lo importante, lo ocurrido), and formal connectors (no obstante, por ende, cabe destacar que).",
      opener:
        "Muy buenas noches y bienvenidos a esta mesa redonda. Para empezar, me gustaría que nos explicara cuál es, a su juicio, el aspecto más problemático del trabajo remoto y en qué datos se basa su postura.",
    },
  },
];
