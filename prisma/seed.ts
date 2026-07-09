import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Localized helper: order sq, en, de, it, fr, es
const L = (sq: string, en: string, de: string, it: string, fr: string, es: string) =>
  ({ sq, en, de, it, fr, es } as Record<string, string>);

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  // ---------- Learner ----------
  const learner = await db.learner.upsert({
    where: { id: "demo-arlind" },
    update: {},
    create: {
      id: "demo-arlind",
      name: "Arlind",
      avatar: "🦅",
      streak: 4,
      totalXp: 320,
      lastActive: new Date(),
    },
  });

  // ---------- Categories ----------
  const categories = [
    { slug: "alfabeti", name: L("Alfabeti", "Alphabet", "Alphabet", "Alfabeto", "Alphabet", "Alfabeto"), icon: "🔤", color: "#e41e20", order: 1 },
    { slug: "fjalor", name: L("Fjalori", "Vocabulary", "Wortschatz", "Vocabolario", "Vocabulaire", "Vocabulario"), icon: "📚", color: "#0f9d58", order: 2 },
    { slug: "gramatike", name: L("Gramatika", "Grammar", "Grammatik", "Grammatica", "Grammaire", "Gramática"), icon: "✏️", color: "#f4a300", order: 3 },
    { slug: "biseda", name: L("Biseda", "Conversation", "Konversation", "Conversazione", "Conversation", "Conversación"), icon: "💬", color: "#8b5cf6", order: 4 },
    { slug: "kulture", name: L("Kultura", "Culture", "Kultur", "Cultura", "Culture", "Cultura"), icon: "🦅", color: "#e91e63", order: 5 },
  ];
  const catMap: Record<string, string> = {};
  for (const c of categories) {
    const row = await db.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name as any, icon: c.icon, color: c.color, order: c.order },
      create: { ...c, name: c.name as any },
    });
    catMap[c.slug] = row.id;
  }

  // ---------- Lessons ----------
  type LessonSeed = {
    slug: string;
    cat: string;
    diff: "fillim" | "mesatar" | "avancuar";
    title: ReturnType<typeof L>;
    summary: ReturnType<typeof L>;
    content: ReturnType<typeof L>;
    emoji: string;
    xp: number;
    duration: number;
    order: number;
    exercises: { type: "quiz" | "flashcard" | "fill" | "matching"; data: any }[];
  };

  const lessons: LessonSeed[] = [
    {
      slug: "alfabeti-36-shkronjat",
      cat: "alfabeti",
      diff: "fillim",
      title: L("Alfabeti: 36 shkronjat", "The alphabet: 36 letters", "Das Alphabet: 36 Buchstaben", "L'alfabeto: 36 lettere", "L'alphabet : 36 lettres", "El alfabeto: 36 letras"),
      summary: L("Mëso 36 shkronjat e alfabetit shqip dhe shqiptimin e tyre.", "Learn the 36 letters of the Albanian alphabet and their pronunciation.", "Lerne die 36 Buchstaben des albanischen Alphabets und ihre Aussprache.", "Impara le 36 lettere dell'alfabeto albanese e la loro pronuncia.", "Apprends les 36 lettres de l'alphabet albanais et leur prononciation.", "Aprende las 36 letras del alfabeto albanés y su pronunciación."),
      content: L(
        "Alfabeti shqip ka **36 shkronja**. Ai përdor shkronjat latine me disa të veçanta:\n\n- **Ç, ç** — si 'ch' në 'çerek'\n- **Ë, ë** — si 'ë' në 'ëmbël'\n- **Xh, xh** — si 'j' në 'xham'\n- **Zh, zh** — si 'zh' në 'zhurmë'\n\nShembuj: **A** — **a**ri (ariu), **B** — **b**ollob (bukë), **Ç** — **ç**erek.\n\n> Këshillë: Lexo me zë të lartë çdo shkronjë!",
        "The Albanian alphabet has **36 letters**. It uses Latin letters with some special ones:\n\n- **Ç, ç** — like 'ch' in 'church'\n- **Ë, ë** — a schwa sound\n- **Xh, xh** — like 'j' in 'jam'\n- **Zh, zh** — like 's' in 'measure'\n\nExamples: **A** — ari (bear), **B** — bukë (bread), **Ç** — çerek (quarter).\n\n> Tip: Read each letter out loud!",
        "Das albanische Alphabet hat **36 Buchstaben**. Es verwendet lateinische Buchstaben mit einigen Besonderheiten:\n\n- **Ç, ç** — wie 'tsch'\n- **Ë, ë** — ein Schwa-Laut\n- **Xh, xh** — wie 'dsch'\n- **Zh, zh** — wie 'sch' weich\n\nBeispiele: **A** — ari (Bär), **B** — bukë (Brot), **Ç** — çerek (Viertel).\n\n> Tipp: Lies jeden Buchstaben laut vor!",
        "L'alfabeto albanese ha **36 lettere**. Usa lettere latine con alcune speciali:\n\n- **Ç, ç** — come 'c' dolce\n- **Ë, ë** — una vocale schwa\n- **Xh, xh** — come 'g' dolce\n- **Zh, zh** — come 's' sonora\n\nEsempi: **A** — ari (orso), **B** — bukë (pane), **Ç** — çerek (quarto).\n\n> Consiglio: Leggi ogni lettera ad alta voce!",
        "L'alphabet albanais a **36 lettres**. Il utilise des lettres latines avec quelques spéciales :\n\n- **Ç, ç** — comme 'tch'\n- **Ë, ë** — un schwa\n- **Xh, xh** — comme 'dj'\n- **Zh, zh** — comme 'j' doux\n\nExemples : **A** — ari (ours), **B** — bukë (pain), **Ç** — çerek (quart).\n\n> Astuce : Lis chaque lettre à voix haute !",
        "El alfabeto albanés tiene **36 letras**. Usa letras latinas con algunas especiales:\n\n- **Ç, ç** — como 'ch'\n- **Ë, ë** — una vocal schwa\n- **Xh, xh** — como 'y' suave\n- **Zh, zh** — como 'y' fricativa\n\nEjemplos: **A** — ari (oso), **B** — bukë (pan), **Ç** — çerek (cuarto).\n\n> Consejo: ¡Lee cada letra en voz alta!"
      ),
      emoji: "🔤",
      xp: 60,
      duration: 12,
      order: 1,
      exercises: [
        {
          type: "quiz",
          data: {
            question: L("Sa shkronja ka alfabeti shqip?", "How many letters does the Albanian alphabet have?", "Wie viele Buchstaben hat das albanische Alphabet?", "Quante lettere ha l'alfabeto albanese?", "Combien de lettres a l'alphabet albanais ?", "¿Cuántas letras tiene el alfabeto albanés?"),
            options: [
              L("26", "26", "26", "26", "26", "26"),
              L("30", "30", "30", "30", "30", "30"),
              L("36", "36", "36", "36", "36", "36"),
              L("40", "40", "40", "40", "40", "40"),
            ],
            correctIndex: 2,
            explanation: L("Alfabeti shqip ka 36 shkronja, përfshirë Ç dhe Ë.", "The Albanian alphabet has 36 letters, including Ç and Ë.", "Das albanische Alphabet hat 36 Buchstaben, inklusive Ç und Ë.", "L'alfabeto albanese ha 36 lettere, inclusi Ç e Ë.", "L'alphabet albanais a 36 lettres, dont Ç et Ë.", "El alfabeto albanés tiene 36 letras, incluidas Ç y Ë."),
          },
        },
        {
          type: "flashcard",
          data: {
            front: L("Çerek", "—", "—", "—", "—", "—"),
            back: L("Çerek = çereku (i katërti)", "Quarter", "Viertel", "Quarto", "Quart", "Cuarto"),
            emoji: "🥧",
            pronunciation: "che-rek",
          },
        },
        {
          type: "fill",
          data: {
            sentence: L("Shkronja ____ është unike për shqipen dhe tingëllon si 'e' e hapur.", "The letter ____ is unique to Albanian and sounds like an open 'e'.", "Der Buchstabe ____ ist einzigartig im Albanischen und klingt wie ein offenes 'e'.", "La lettera ____ è unica dell'albanese e suona come una 'e' aperta.", "La lettre ____ est unique à l'albanais et sonne comme un 'e' ouvert.", "La letra ____ es única del albanés y suena como una 'e' abierta."),
            answer: L("Ë", "Ë", "Ë", "Ë", "Ë", "Ë"),
            options: [L("Ë", "Ë", "Ë", "Ë", "Ë", "Ë"), L("Ç", "Ç", "Ç", "Ç", "Ç", "Ç"), L("Xh", "Xh", "Xh", "Xh", "Xh", "Xh"), L("Zh", "Zh", "Zh", "Zh", "Zh", "Zh")],
          },
        },
      ],
    },
    {
      slug: "numrat-1-20",
      cat: "fjalor",
      diff: "fillim",
      title: L("Numrat 1-20", "Numbers 1-20", "Zahlen 1-20", "Numeri 1-20", "Nombres 1-20", "Números 1-20"),
      summary: L("Mëso të numërosh nga 1 deri në 20 në shqip.", "Learn to count from 1 to 20 in Albanian.", "Lerne von 1 bis 20 auf Albanisch zu zählen.", "Impara a contare da 1 a 20 in albanese.", "Apprends à compter de 1 à 20 en albanais.", "Aprende a contar de 1 a 20 en albanés."),
      content: L(
        "Numrat 1-10:\n\n1 — **një**, 2 — **dy**, 3 — **tre**, 4 — **katër**, 5 — **pesë**, 6 — **gjashtë**, 7 — **shtatë**, 8 — **tetë**, 9 — **nëntë**, 10 — **dhjetë**.\n\n11-20: **njëmbëdhjetë**, **dymbëdhjetë**, **trembëdhjetë**, **katërmbëdhjetë**, **pesëmbëdhjetë**, **gjashtëmbëdhjetë**, **shtatëmbëdhjetë**, **tetëmbëdhjetë**, **nëntëmbëdhjetë**, **njëzet**.\n\n> Mbëmjet 'mbëdhjetë' do thotë 'mbi dhjetë'.",
        "Numbers 1-10:\n\n1 — një, 2 — dy, 3 — tre, 4 — katër, 5 — pesë, 6 — gjashtë, 7 — shtatë, 8 — tetë, 9 — nëntë, 10 — dhjetë.\n\n11-20: njëmbëdhjetë, dymbëdhjetë, trembëdhjetë, katërmbëdhjetë, pesëmbëdhjetë, gjashtëmbëdhjetë, shtatëmbëdhjetë, tetëmbëdhjetë, nëntëmbëdhjetë, njëzet.\n\n> 'mbëdhjetë' means 'above ten'.",
        "Zahlen 1-10:\n\n1 — një, 2 — dy, 3 — tre, 4 — katër, 5 — pesë, 6 — gjashtë, 7 — shtatë, 8 — tetë, 9 — nëntë, 10 — dhjetë.\n\n11-20: njëmbëdhjetë, dymbëdhjetë, trembëdhjetë, katërmbëdhjetë, pesëmbëdhjetë, gjashtëmbëdhjetë, shtatëmbëdhjetë, tetëmbëdhjetë, nëntëmbëdhjetë, njëzet.\n\n> 'mbëdhjetë' bedeutet 'über zehn'.",
        "Numeri 1-10:\n\n1 — një, 2 — dy, 3 — tre, 4 — katër, 5 — pesë, 6 — gjashtë, 7 — shtatë, 8 — tetë, 9 — nëntë, 10 — dhjetë.\n\n11-20: njëmbëdhjetë, dymbëdhjetë, trembëdhjetë, katërmbëdhjetë, pesëmbëdhjetë, gjashtëmbëdhjetë, shtatëmbëdhjetë, tetëmbëdhjetë, nëntëmbëdhjetë, njëzet.\n\n> 'mbëdhjetë' significa 'sopra dieci'.",
        "Nombres 1-10 :\n\n1 — një, 2 — dy, 3 — tre, 4 — katër, 5 — pesë, 6 — gjashtë, 7 — shtatë, 8 — tetë, 9 — nëntë, 10 — dhjetë.\n\n11-20 : njëmbëdhjetë, dymbëdhjetë, trembëdhjetë, katërmbëdhjetë, pesëmbëdhjetë, gjashtëmbëdhjetë, shtatëmbëdhjetë, tetëmbëdhjetë, nëntëmbëdhjetë, njëzet.\n\n> 'mbëdhjetë' signifie 'au-dessus de dix'.",
        "Números 1-10:\n\n1 — një, 2 — dy, 3 — tre, 4 — katër, 5 — pesë, 6 — gjashtë, 7 — shtatë, 8 — tetë, 9 — nëntë, 10 — dhjetë.\n\n11-20: njëmbëdhjetë, dymbëdhjetë, trembëdhjetë, katërmbëdhjetë, pesëmbëdhjetë, gjashtëmbëdhjetë, shtatëmbëdhjetë, tetëmbëdhjetë, nëntëmbëdhjetë, njëzet.\n\n> 'mbëdhjetë' significa 'sobre diez'."
      ),
      emoji: "🔢",
      xp: 50,
      duration: 10,
      order: 2,
      exercises: [
        {
          type: "quiz",
          data: {
            question: L("Si thuhet '7' në shqip?", "How do you say '7' in Albanian?", "Wie sagt man '7' auf Albanisch?", "Come si dice '7' in albanese?", "Comment dit-on '7' en albanais ?", "¿Cómo se dice '7' en albanés?"),
            options: [
              L("pesë", "pesë", "pesë", "pesë", "pesë", "pesë"),
              L("gjashtë", "gjashtë", "gjashtë", "gjashtë", "gjashtë", "gjashtë"),
              L("shtatë", "shtatë", "shtatë", "shtatë", "shtatë", "shtatë"),
              L("tetë", "tetë", "tetë", "tetë", "tetë", "tetë"),
            ],
            correctIndex: 2,
            explanation: L("Shtatë = 7.", "Shtatë = 7.", "Shtatë = 7.", "Shtatë = 7.", "Shtatë = 7.", "Shtatë = 7."),
          },
        },
        {
          type: "matching",
          data: {
            pairs: [
              { left: L("një", "1", "1", "1", "1", "1"), right: L("1", "një", "një", "një", "një", "një") },
              { left: L("dhjetë", "10", "10", "10", "10", "10"), right: L("10", "dhjetë", "dhjetë", "dhjetë", "dhjetë", "dhjetë") },
              { left: L("njëzet", "20", "20", "20", "20", "20"), right: L("20", "njëzet", "njëzet", "njëzet", "njëzet", "njëzet") },
              { left: L("pesë", "5", "5", "5", "5", "5"), right: L("5", "pesë", "pesë", "pesë", "pesë", "pesë") },
            ],
          },
        },
        {
          type: "fill",
          data: {
            sentence: L("Numri 10 në shqip është ____.", "The number 10 in Albanian is ____.", "Die Zahl 10 auf Albanisch ist ____.", "Il numero 10 in albanese è ____.", "Le nombre 10 en albanais est ____.", "El número 10 en albanés es ____."),
            answer: L("dhjetë", "dhjetë", "dhjetë", "dhjetë", "dhjetë", "dhjetë"),
            options: [L("dhjetë", "dhjetë", "dhjetë", "dhjetë", "dhjetë", "dhjetë"), L("nëntë", "nëntë", "nëntë", "nëntë", "nëntë", "nëntë"), L("njëzet", "njëzet", "njëzet", "njëzet", "njëzet", "njëzet"), L("tetë", "tetë", "tetë", "tetë", "tetë", "tetë")],
          },
        },
      ],
    },
    {
      slug: "ngjyrat",
      cat: "fjalor",
      diff: "fillim",
      title: L("Ngjyrat", "Colors", "Farben", "Colori", "Couleurs", "Colores"),
      summary: L("Mëso emrat e ngjyrave në shqip.", "Learn the names of colors in Albanian.", "Lerne die Namen der Farben auf Albanisch.", "Impara i nomi dei colori in albanese.", "Apprends le nom des couleurs en albanais.", "Aprende los nombres de los colores en albanés."),
      content: L(
        "Ngjyrat kryesore:\n\n- **kuq** — red 🔴\n- **zi** — black ⚫\n- **bardh** — white ⚪\n- **blu** — blue 🔵\n- **gjelbër** — green 🟢\n- **verdhë** — yellow 🟡\n- **portokalli** — orange 🟠\n- **vjollcë** — purple 🟣\n- **kafe** — brown 🟤\n- **rozë** — pink\n\n> 'Ngjyrë' do thotë 'color'. P.sh. 'ngjyrë kuqe' = red color.",
        "Main colors:\n\n- kuq — red 🔴\n- zi — black ⚫\n- bardh — white ⚪\n- blu — blue 🔵\n- gjelbër — green 🟢\n- verdhë — yellow 🟡\n- portokalli — orange 🟠\n- vjollcë — purple 🟣\n- kafe — brown 🟤\n- rozë — pink\n\n> 'Ngjyrë' means 'color'. E.g. 'ngjyrë kuqe' = red color.",
        "Hauptfarben:\n\n- kuq — rot 🔴\n- zi — schwarz ⚫\n- bardh — weiß ⚪\n- blu — blau 🔵\n- gjelbër — grün 🟢\n- verdhë — gelb 🟡\n- portokalli — orange 🟠\n- vjollcë — lila 🟣\n- kafe — braun 🟤\n- rozë — rosa\n\n> 'Ngjyrë' bedeutet 'Farbe'. Z.B. 'ngjyrë kuqe' = rote Farbe.",
        "Colori principali:\n\n- kuq — rosso 🔴\n- zi — nero ⚫\n- bardh — bianco ⚪\n- blu — blu 🔵\n- gjelbër — verde 🟢\n- verdhë — giallo 🟡\n- portokalli — arancione 🟠\n- vjollcë — viola 🟣\n- kafe — marrone 🟤\n- rozë — rosa\n\n> 'Ngjyrë' significa 'colore'. Es. 'ngjyrë kuqe' = colore rosso.",
        "Couleurs principales :\n\n- kuq — rouge 🔴\n- zi — noir ⚫\n- bardh — blanc ⚪\n- blu — bleu 🔵\n- gjelbër — vert 🟢\n- verdhë — jaune 🟡\n- portokalli — orange 🟠\n- vjollcë — violet 🟣\n- kafe — marron 🟤\n- rozë — rose\n\n> 'Ngjyrë' signifie 'couleur'. Ex. 'ngjyrë kuqe' = couleur rouge.",
        "Colores principales:\n\n- kuq — rojo 🔴\n- zi — negro ⚫\n- bardh — blanco ⚪\n- blu — azul 🔵\n- gjelbër — verde 🟢\n- verdhë — amarillo 🟡\n- portokalli — naranja 🟠\n- vjollcë — morado 🟣\n- kafe — marrón 🟤\n- rozë — rosa\n\n> 'Ngjyrë' significa 'color'. Ej. 'ngjyrë kuqe' = color rojo."
      ),
      emoji: "🎨",
      xp: 50,
      duration: 8,
      order: 3,
      exercises: [
        {
          type: "flashcard",
          data: { front: L("Kuq", "—", "—", "—", "—", "—"), back: L("Kuq = red", "red", "rot", "rosso", "rouge", "rojo"), emoji: "🔴", pronunciation: "kuk" },
        },
        {
          type: "flashcard",
          data: { front: L("Gjelbër", "—", "—", "—", "—", "—"), back: L("Gjelbër = green", "green", "grün", "verde", "vert", "verde"), emoji: "🟢", pronunciation: "gjel-bër" },
        },
        {
          type: "quiz",
          data: {
            question: L("Cila është ngjyra 'verdhë'?", "What color is 'verdhë'?", "Welche Farbe ist 'verdhë'?", "Di che colore è 'verdhë'?", "De quelle couleur est 'verdhë' ?", "¿De qué color es 'verdhë'?"),
            options: [L("Blu", "Blue", "Blau", "Blu", "Bleu", "Azul"), L("Verdhë", "Yellow", "Gelb", "Giallo", "Jaune", "Amarillo"), L("Kuq", "Red", "Rot", "Rosso", "Rouge", "Rojo"), L("Zi", "Black", "Schwarz", "Nero", "Noir", "Negro")],
            correctIndex: 1,
            explanation: L("Verdhë = e verdhë = yellow.", "Verdhë = e verdhë = yellow.", "Verdhë = e verdhë = gelb.", "Verdhë = e verdhë = giallo.", "Verdhë = e verdhë = jaune.", "Verdhë = e verdhë = amarillo."),
          },
        },
      ],
    },
    {
      slug: "ditet-e-javes",
      cat: "fjalor",
      diff: "fillim",
      title: L("Ditët e javës", "Days of the week", "Wochentage", "Giorni della settimana", "Jours de la semaine", "Días de la semana"),
      summary: L("Mëso shtatë ditët e javës në shqip.", "Learn the seven days of the week in Albanian.", "Lerne die sieben Wochentage auf Albanisch.", "Impara i sette giorni della settimana in albanese.", "Apprends les sept jours de la semaine en albanais.", "Aprende los siete días de la semana en albanés."),
      content: L(
        "Ditët e javës:\n\n- **e hënë** — Monday\n- **e martë** — Tuesday\n- **e mërkurë** — Wednesday\n- **e enjte** — Thursday\n- **e premte** — Friday\n- **e shtunë** — Saturday\n- **e diel** — Sunday\n\n> Të gjitha fillojnë me 'e '. 'Java' = week.",
        "Days of the week:\n\n- e hënë — Monday\n- e martë — Tuesday\n- e mërkurë — Wednesday\n- e enjte — Thursday\n- e premte — Friday\n- e shtunë — Saturday\n- e diel — Sunday\n\n> All start with 'e '. 'Java' = week.",
        "Wochentage:\n\n- e hënë — Montag\n- e martë — Dienstag\n- e mërkurë — Mittwoch\n- e enjte — Donnerstag\n- e premte — Freitag\n- e shtunë — Samstag\n- e diel — Sonntag\n\n> Alle beginnen mit 'e '. 'Java' = Woche.",
        "Giorni della settimana:\n\n- e hënë — lunedì\n- e martë — martedì\n- e mërkurë — mercoledì\n- e enjte — giovedì\n- e premte — venerdì\n- e shtunë — sabato\n- e diel — domenica\n\n> Iniziano tutti con 'e '. 'Java' = settimana.",
        "Jours de la semaine :\n\n- e hënë — lundi\n- e martë — mardi\n- e mërkurë — mercredi\n- e enjte — jeudi\n- e premte — vendredi\n- e shtunë — samedi\n- e diel — dimanche\n\n> Tous commencent par 'e '. 'Java' = semaine.",
        "Días de la semana:\n\n- e hënë — lunes\n- e martë — martes\n- e mërkurë — miércoles\n- e enjte — jueves\n- e premte — viernes\n- e shtunë — sábado\n- e diel — domingo\n\n> Todos empiezan con 'e '. 'Java' = semana."
      ),
      emoji: "📅",
      xp: 50,
      duration: 8,
      order: 4,
      exercises: [
        {
          type: "quiz",
          data: {
            question: L("Cila ditë është 'e diel'?", "Which day is 'e diel'?", "Welcher Tag ist 'e diel'?", "Quale giorno è 'e diel'?", "Quel jour est 'e diel' ?", "¿Qué día es 'e diel'?"),
            options: [L("E hënë", "Monday", "Montag", "Lunedì", "Lundi", "Lunes"), L("E premte", "Friday", "Freitag", "Venerdì", "Vendredi", "Viernes"), L("E diel", "Sunday", "Sonntag", "Domenica", "Dimanche", "Domingo"), L("E mërkurë", "Wednesday", "Mittwoch", "Mercoledì", "Mercredi", "Miércoles")],
            correctIndex: 2,
            explanation: L("E diel = e djelë = Sunday.", "E diel = Sunday.", "E diel = Sonntag.", "E diel = domenica.", "E diel = dimanche.", "E diel = domingo."),
          },
        },
        {
          type: "matching",
          data: {
            pairs: [
              { left: L("e hënë", "—", "—", "—", "—", "—"), right: L("Monday", "e hënë", "Montag", "lunedì", "lundi", "lunes") },
              { left: L("e mërkurë", "—", "—", "—", "—", "—"), right: L("Wednesday", "e mërkurë", "Mittwoch", "mercoledì", "mercredi", "miércoles") },
              { left: L("e shtunë", "—", "—", "—", "—", "—"), right: L("Saturday", "e shtunë", "Samstag", "sabato", "samedi", "sábado") },
              { left: L("e diel", "—", "—", "—", "—", "—"), right: L("Sunday", "e diel", "Sonntag", "domenica", "dimanche", "domingo") },
            ],
          },
        },
      ],
    },
    {
      slug: "pershedetjet",
      cat: "biseda",
      diff: "fillim",
      title: L("Përshëndetjet", "Greetings", "Begrüßungen", "Saluti", "Salutations", "Saludos"),
      summary: L("Mëso të përshëndesësh dhe të pyesësh për mirëqenie.", "Learn to greet and ask how someone is.", "Lerne zu grüßen und nach dem Befinden zu fragen.", "Impara a salutare e chiedere come sta qualcuno.", "Apprends à saluer et demander comment ça va.", "Aprende a saludar y preguntar cómo estás."),
      content: L(
        "Përshëndetjet:\n\n- **Tungjatjeta!** — Hello! (përdoret gjatë ditës)\n- **Mirëmëngjes!** — Good morning!\n- **Mirëdita!** — Good afternoon!\n- **Mirëmbrëma!** — Good evening!\n- **Natën e mirë!** — Good night!\n- **Si je?** — How are you?\n- **Faleminderit!** — Thank you!\n- **Tung!** — Bye! (joformale)\n\n> 'Tungjatjeta' fjalë për fjalë do thotë 'jetë të gjatë'.",
        "Greetings:\n\n- Tungjatjeta! — Hello! (used during the day)\n- Mirëmëngjes! — Good morning!\n- Mirëdita! — Good afternoon!\n- Mirëmbrëma! — Good evening!\n- Natën e mirë! — Good night!\n- Si je? — How are you?\n- Faleminderit! — Thank you!\n- Tung! — Bye! (informal)\n\n> 'Tungjatjeta' literally means 'long life to you'.",
        "Begrüßungen:\n\n- Tungjatjeta! — Hallo! (tagsüber)\n- Mirëmëngjes! — Guten Morgen!\n- Mirëdita! — Guten Tag!\n- Mirëmbrëma! — Guten Abend!\n- Natën e mirë! — Gute Nacht!\n- Si je? — Wie geht's?\n- Faleminderit! — Danke!\n- Tung! — Tschüss! (informell)\n\n> 'Tungjatjeta' heißt wörtlich 'lange Leben dir'.",
        "Saluti:\n\n- Tungjatjeta! — Ciao! (durante il giorno)\n- Mirëmëngjes! — Buongiorno!\n- Mirëdita! — Buon pomeriggio!\n- Mirëmbrëma! — Buonasera!\n- Natën e mirë! — Buonanotte!\n- Si je? — Come stai?\n- Faleminderit! — Grazie!\n- Tung! — Ciao! (informale)\n\n> 'Tungjatjeta' significa letteralmente 'lunga vita a te'.",
        "Salutations :\n\n- Tungjatjeta! — Bonjour ! (pendant la journée)\n- Mirëmëngjes! — Bon matin !\n- Mirëdita! — Bon après-midi !\n- Mirëmbrëma! — Bonsoir !\n- Natën e mirë! — Bonne nuit !\n- Si je? — Comment vas-tu ?\n- Faleminderit! — Merci !\n- Tung! — Salut ! (informel)\n\n> 'Tungjatjeta' signifie littéralement 'longue vie à toi'.",
        "Saludos:\n\n- Tungjatjeta! — ¡Hola! (durante el día)\n- Mirëmëngjes! — ¡Buenos días!\n- Mirëdita! — ¡Buenas tardes!\n- Mirëmbrëma! — ¡Buenas noches!\n- Natën e mirë! — ¡Buenas noches! (al dormir)\n- Si je? — ¿Cómo estás?\n- Faleminderit! — ¡Gracias!\n- Tung! — ¡Adiós! (informal)\n\n> 'Tungjatjeta' significa literalmente 'larga vida a ti'."
      ),
      emoji: "👋",
      xp: 55,
      duration: 9,
      order: 5,
      exercises: [
        {
          type: "quiz",
          data: {
            question: L("Çfarë do thotë 'Faleminderit'?", "What does 'Faleminderit' mean?", "Was bedeutet 'Faleminderit'?", "Cosa significa 'Faleminderit'?", "Que signifie 'Faleminderit' ?", "¿Qué significa 'Faleminderit'?"),
            options: [L("Mirupafshim", "Goodbye", "Auf Wiedersehen", "Arrivederci", "Au revoir", "Adiós"), L("Faleminderit", "Thank you", "Danke", "Grazie", "Merci", "Gracias"), L("Më vjen keq", "Sorry", "Entschuldigung", "Scusa", "Pardon", "Perdón"), L("Të lutem", "Please", "Bitte", "Per favore", "S'il te plaît", "Por favor")],
            correctIndex: 1,
            explanation: L("Faleminderit = thank you.", "Faleminderit = thank you.", "Faleminderit = danke.", "Faleminderit = grazie.", "Faleminderit = merci.", "Faleminderit = gracias."),
          },
        },
        {
          type: "flashcard",
          data: { front: L("Mirëmëngjes!", "—", "—", "—", "—", "—"), back: L("Good morning!", "Good morning!", "Guten Morgen!", "Buongiorno!", "Bon matin !", "¡Buenos días!"), emoji: "🌅", pronunciation: "mi-rë-mën-gjes" },
        },
        {
          type: "fill",
          data: {
            sentence: L("Për të thënë 'good evening' themi: ____!", "To say 'good evening' we say: ____!", "Um 'guten Abend' zu sagen, sagen wir: ____!", "Per dire 'buonasera' diciamo: ____!", "Pour dire 'bonsoir' on dit : ____ !", "Para decir 'buenas noches' decimos: ¡____!"),
            answer: L("Mirëmbrëma", "Mirëmbrëma", "Mirëmbrëma", "Mirëmbrëma", "Mirëmbrëma", "Mirëmbrëma"),
            options: [L("Mirëmbrëma", "Mirëmbrëma", "Mirëmbrëma", "Mirëmbrëma", "Mirëmbrëma", "Mirëmbrëma"), L("Mirëdita", "Mirëdita", "Mirëdita", "Mirëdita", "Mirëdita", "Mirëdita"), L("Natën e mirë", "Natën e mirë", "Natën e mirë", "Natën e mirë", "Natën e mirë", "Natën e mirë"), L("Mirëmëngjes", "Mirëmëngjes", "Mirëmëngjes", "Mirëmëngjes", "Mirëmëngjes", "Mirëmëngjes")],
          },
        },
      ],
    },
    {
      slug: "familja",
      cat: "fjalor",
      diff: "fillim",
      title: L("Familja", "The family", "Die Familie", "La famiglia", "La famille", "La familia"),
      summary: L("Mëso anëtarët e familjes në shqip.", "Learn family members in Albanian.", "Lerne Familienmitglieder auf Albanisch.", "Impara i membri della famiglia in albanese.", "Apprends les membres de la famille en albanais.", "Aprende los miembros de la familia en albanés."),
      content: L(
        "Anëtarët e familjes:\n\n- **nëna / mamaja** — mother / mom\n- **babai / ati** — father / dad\n- **vëllai** — brother\n- **motra** — sister\n- **gjyshi** — grandfather\n- **gjyshja** — grandmother\n- **djali** — son / boy\n- **vajza** — daughter / girl\n- **fëmija** — child\n\n> 'Familja' = the family. Shumësi: 'vëllezër' (brothers), 'motra' (sisters).",
        "Family members:\n\n- nëna / mamaja — mother / mom\n- babai / ati — father / dad\n- vëllai — brother\n- motra — sister\n- gjyshi — grandfather\n- gjyshja — grandmother\n- djali — son / boy\n- vajza — daughter / girl\n- fëmija — child\n\n> 'Familja' = the family. Plural: 'vëllezër' (brothers), 'motra' (sisters).",
        "Familienmitglieder:\n\n- nëna / mamaja — Mutter / Mama\n- babai / ati — Vater / Papa\n- vëllai — Bruder\n- motra — Schwester\n- gjyshi — Großvater\n- gjyshja — Großmutter\n- djali — Sohn / Junge\n- vajza — Tochter / Mädchen\n- fëmija — Kind\n\n> 'Familja' = die Familie. Plural: 'vëllezër' (Brüder), 'motra' (Schwestern).",
        "Membri della famiglia:\n\n- nëna / mamaja — madre / mamma\n- babai / ati — padre / papà\n- vëllai — fratello\n- motra — sorella\n- gjyshi — nonno\n- gjyshja — nonna\n- djali — figlio / ragazzo\n- vajza — figlia / ragazza\n- fëmija — bambino\n\n> 'Familja' = la famiglia. Plurale: 'vëllezër' (fratelli), 'motra' (sorelle).",
        "Membres de la famille :\n\n- nëna / mamaja — mère / maman\n- babai / ati — père / papa\n- vëllai — frère\n- motra — sœur\n- gjyshi — grand-père\n- gjyshja — grand-mère\n- djali — fils / garçon\n- vajza — fille\n- fëmija — enfant\n\n> 'Familja' = la famille. Pluriel : 'vëllezër' (frères), 'motra' (sœurs).",
        "Miembros de la familia:\n\n- nëna / mamaja — madre / mamá\n- babai / ati — padre / papá\n- vëllai — hermano\n- motra — hermana\n- gjyshi — abuelo\n- gjyshja — abuela\n- djali — hijo / chico\n- vajza — hija / chica\n- fëmija — niño\n\n> 'Familja' = la familia. Plural: 'vëllezër' (hermanos), 'motra' (hermanas)."
      ),
      emoji: "👨‍👩‍👧‍👦",
      xp: 55,
      duration: 9,
      order: 6,
      exercises: [
        {
          type: "flashcard",
          data: { front: L("Nëna", "—", "—", "—", "—", "—"), back: L("Nëna = mother", "mother", "Mutter", "madre", "mère", "madre"), emoji: "👩", pronunciation: "në-na" },
        },
        {
          type: "flashcard",
          data: { front: L("Gjyshi", "—", "—", "—", "—", "—"), back: L("Gjyshi = grandfather", "grandfather", "Großvater", "nonno", "grand-père", "abuelo"), emoji: "👴", pronunciation: "gjy-shi" },
        },
        {
          type: "quiz",
          data: {
            question: L("Çfarë do thotë 'motra'?", "What does 'motra' mean?", "Was bedeutet 'motra'?", "Cosa significa 'motra'?", "Que signifie 'motra' ?", "¿Qué significa 'motra'?"),
            options: [L("Vëllai", "Brother", "Bruder", "Fratello", "Frère", "Hermano"), L("Motra", "Sister", "Schwester", "Sorella", "Sœur", "Hermana"), L("Nëna", "Mother", "Mutter", "Madre", "Mère", "Madre"), L("Vajza", "Daughter", "Tochter", "Figlia", "Fille", "Hija")],
            correctIndex: 1,
            explanation: L("Motra = sister.", "Motra = sister.", "Motra = Schwester.", "Motra = sorella.", "Motra = sœur.", "Motra = hermana."),
          },
        },
      ],
    },
    {
      slug: "ushqimi",
      cat: "fjalor",
      diff: "mesatar",
      title: L("Ushqimi", "Food", "Essen", "Cibo", "Nourriture", "Comida"),
      summary: L("Mëso fjalë për ushqimin dhe pijet.", "Learn words for food and drinks.", "Lerne Wörter für Essen und Trinken.", "Impara parole per cibo e bevande.", "Apprends des mots pour la nourriture et les boissons.", "Aprende palabras para comida y bebidas."),
      content: L(
        "Ushqime dhe pije:\n\n- **buka** — bread\n- **djathi** — cheese\n- **mishi** — meat\n- **peshku** — fish\n- **perimet** — vegetables\n- **frutat** — fruits\n- **uji** — water\n- **qumështi** — milk\n- **kafeja** — coffee\n- **çaji** — tea\n\n> Mëngjesi, dreka, darke = breakfast, lunch, dinner.",
        "Foods and drinks:\n\n- buka — bread\n- djathi — cheese\n- mishi — meat\n- peshku — fish\n- perimet — vegetables\n- frutat — fruits\n- uji — water\n- qumështi — milk\n- kafeja — coffee\n- çaji — tea\n\n> Mëngjesi, dreka, darke = breakfast, lunch, dinner.",
        "Essen und Trinken:\n\n- buka — Brot\n- djathi — Käse\n- mishi — Fleisch\n- peshku — Fisch\n- perimet — Gemüse\n- frutat — Früchte\n- uji — Wasser\n- qumështi — Milch\n- kafeja — Kaffee\n- çaji — Tee\n\n> Mëngjesi, dreka, darke = Frühstück, Mittagessen, Abendessen.",
        "Cibo e bevande:\n\n- buka — pane\n- djathi — formaggio\n- mishi — carne\n- peshku — pesce\n- perimet — verdure\n- frutat — frutta\n- uji — acqua\n- qumështi — latte\n- kafeja — caffè\n- çaji — tè\n\n> Mëngjesi, dreka, darke = colazione, pranzo, cena.",
        "Nourriture et boissons :\n\n- buka — pain\n- djathi — fromage\n- mishi — viande\n- peshku — poisson\n- perimet — légumes\n- frutat — fruits\n- uji — eau\n- qumështi — lait\n- kafeja — café\n- çaji — thé\n\n> Mëngjesi, dreka, darke = petit-déjeuner, déjeuner, dîner.",
        "Comida y bebidas:\n\n- buka — pan\n- djathi — queso\n- mishi — carne\n- peshku — pescado\n- perimet — verduras\n- frutat — frutas\n- uji — agua\n- qumështi — leche\n- kafeja — café\n- çaji — té\n\n> Mëngjesi, dreka, darke = desayuno, almuerzo, cena."
      ),
      emoji: "🍞",
      xp: 60,
      duration: 10,
      order: 7,
      exercises: [
        {
          type: "quiz",
          data: {
            question: L("Çfarë është 'uji'?", "What is 'uji'?", "Was ist 'uji'?", "Cos'è 'uji'?", "Qu'est-ce que 'uji' ?", "¿Qué es 'uji'?"),
            options: [L("Uji", "Water", "Wasser", "Acqua", "Eau", "Agua"), L("Qumështi", "Milk", "Milch", "Latte", "Lait", "Leche"), L("Kafeja", "Coffee", "Kaffee", "Caffè", "Café", "Café"), L("Çaji", "Tea", "Tee", "Tè", "Thé", "Té")],
            correctIndex: 0,
            explanation: L("Uji = water.", "Uji = water.", "Uji = Wasser.", "Uji = acqua.", "Uji = eau.", "Uji = agua."),
          },
        },
        {
          type: "matching",
          data: {
            pairs: [
              { left: L("buka", "—", "—", "—", "—", "—"), right: L("bread", "buka", "Brot", "pane", "pain", "pan") },
              { left: L("djathi", "—", "—", "—", "—", "—"), right: L("cheese", "djathi", "Käse", "formaggio", "fromage", "queso") },
              { left: L("peshku", "—", "—", "—", "—", "—"), right: L("fish", "peshku", "Fisch", "pesce", "poisson", "pescado") },
              { left: L("frutat", "—", "—", "—", "—", "—"), right: L("fruits", "frutat", "Früchte", "frutta", "fruits", "frutas") },
            ],
          },
        },
      ],
    },
    {
      slug: "ne-restorant",
      cat: "biseda",
      diff: "mesatar",
      title: L("Në restorant", "At the restaurant", "Im Restaurant", "Al ristorante", "Au restaurant", "En el restaurante"),
      summary: L("Mëso të bisedosh në një restorant.", "Learn to converse in a restaurant.", "Lerne im Restaurant zu konversieren.", "Impara a conversare al ristorante.", "Apprends à converser au restaurant.", "Aprende a conversar en un restaurante."),
      content: L(
        "Frazat e dobishme:\n\n- **Një tavolinë për dy veta, ju lutem.** — A table for two, please.\n- **Çfarë keni në menu?** — What do you have on the menu?\n- **Dëshiroj të porosis...** — I'd like to order...\n- **Sa kushton?** — How much does it cost?\n- **Faturën, ju lutem.** — The bill, please.\n- **Ishte shumë i shijshëm!** — It was very delicious!\n\n> 'Ju lutem' = please (formale).",
        "Useful phrases:\n\n- Një tavolinë për dy veta, ju lutem. — A table for two, please.\n- Çfarë keni në menu? — What do you have on the menu?\n- Dëshiroj të porosis... — I'd like to order...\n- Sa kushton? — How much does it cost?\n- Faturën, ju lutem. — The bill, please.\n- Ishte shumë i shijshëm! — It was very delicious!\n\n> 'Ju lutem' = please (formal).",
        "Nützliche Sätze:\n\n- Një tavolinë për dy veta, ju lutem. — Ein Tisch für zwei, bitte.\n- Çfarë keni në menu? — Was steht auf der Speisekarte?\n- Dëshiroj të porosis... — Ich möchte bestellen...\n- Sa kushton? — Wie viel kostet das?\n- Faturën, ju lutem. — Die Rechnung, bitte.\n- Ishte shumë i shijshëm! — Es war sehr lecker!\n\n> 'Ju lutem' = bitte (formell).",
        "Frasi utili:\n\n- Një tavolinë për dy veta, ju lutem. — Un tavolo per due, per favore.\n- Çfarë keni në menu? — Cosa avete nel menu?\n- Dëshiroj të porosis... — Vorrei ordinare...\n- Sa kushton? — Quanto costa?\n- Faturën, ju lutem. — Il conto, per favore.\n- Ishte shumë i shijshëm! — Era molto delizioso!\n\n> 'Ju lutem' = per favore (formale).",
        "Phrases utiles :\n\n- Një tavolinë për dy veta, ju lutem. — Une table pour deux, s'il vous plaît.\n- Çfarë keni në menu? — Qu'y a-t-il au menu ?\n- Dëshiroj të porosis... — Je voudrais commander...\n- Sa kushton? — Combien ça coûte ?\n- Faturën, ju lutem. — L'addition, s'il vous plaît.\n- Ishte shumë i shijshëm! — C'était très délicieux !\n\n> 'Ju lutem' = s'il vous plaît (formel).",
        "Frases útiles:\n\n- Një tavolinë për dy veta, ju lutem. — Una mesa para dos, por favor.\n- Çfarë keni në menu? — ¿Qué tienen en el menú?\n- Dëshiroj të porosis... — Quisiera pedir...\n- Sa kushton? — ¿Cuánto cuesta?\n- Faturën, ju lutem. — La cuenta, por favor.\n- Ishte shumë i shijshëm! — ¡Estuvo muy delicioso!\n\n> 'Ju lutem' = por favor (formal)."
      ),
      emoji: "🍽️",
      xp: 70,
      duration: 12,
      order: 8,
      exercises: [
        {
          type: "quiz",
          data: {
            question: L("Si kërkon faturën?", "How do you ask for the bill?", "Wie verlangst du die Rechnung?", "Come chiedi il conto?", "Comment demandes-tu l'addition ?", "¿Cómo pides la cuenta?"),
            options: [
              L("Sa kushton?", "How much does it cost?", "Wie viel kostet das?", "Quanto costa?", "Combien ça coûte ?", "¿Cuánto cuesta?"),
              L("Faturën, ju lutem.", "The bill, please.", "Die Rechnung, bitte.", "Il conto, per favore.", "L'addition, s'il vous plaît.", "La cuenta, por favor."),
              L("Dëshiroj ujin.", "I want water.", "Ich will Wasser.", "Voglio acqua.", "Je veux de l'eau.", "Quiero agua."),
              L("Ishte i shijshëm.", "It was tasty.", "Es war lecker.", "Era gustoso.", "C'était savoureux.", "Estuvo sabroso."),
            ],
            correctIndex: 1,
            explanation: L("'Faturën, ju lutem' = The bill, please.", "'Faturën, ju lutem' = The bill, please.", "'Faturën, ju lutem' = Die Rechnung, bitte.", "'Faturën, ju lutem' = Il conto, per favore.", "'Faturën, ju lutem' = L'addition, s'il vous plaît.", "'Faturën, ju lutem' = La cuenta, por favor."),
          },
        },
        {
          type: "fill",
          data: {
            sentence: L("Për të pyetur çmimin: 'Sa ____?'", "To ask the price: 'Sa ____?'", "Nach dem Preis fragen: 'Sa ____?'", "Per chiedere il prezzo: 'Sa ____?'", "Pour demander le prix : 'Sa ____ ?'", "Para preguntar el precio: '¿Sa ____?'"),
            answer: L("kushton", "kushton", "kushton", "kushton", "kushton", "kushton"),
            options: [L("kushton", "kushton", "kushton", "kushton", "kushton", "kushton"), L("është", "është", "është", "është", "është", "është"), L("don", "don", "don", "don", "don", "don"), L("ha", "ha", "ha", "ha", "ha", "ha")],
          },
        },
      ],
    },
    {
      slug: "emer-mbiemer",
      cat: "gramatike",
      diff: "mesatar",
      title: L("Emri dhe mbiemri", "Nouns & adjectives", "Substantive & Adjektive", "Sostantivi e aggettivi", "Noms et adjectifs", "Sustantivos y adjetivos"),
      summary: L("Mëso gjininë dhe mbiemrat në shqip.", "Learn gender and adjectives in Albanian.", "Lerne Genus und Adjektive auf Albanisch.", "Impara il genere e gli aggettivi in albanese.", "Apprends le genre et les adjectifs en albanais.", "Aprende el género y los adjetivos en albanés."),
      content: L(
        "Emrat kanë gjini:\n\n- **Mashkullor**: libri, djali, mali\n- **Femëror**: libra (shumës), vajza, shtëpia\n\nMbiemrat përshtaten:\n- **i madh** (m.) / **e madhe** (f.) — big\n- **i vogël** (m.) / **e vogël** (f.) — small\n- **i bukur** (m.) / **e bukur** (f.) — beautiful\n\n> P.sh. 'djali i madh' = the big boy; 'vajza e vogël' = the small girl.",
        "Nouns have gender:\n\n- Masculine: libri (book), djali (boy), mali (mountain)\n- Feminine: vajza (girl), shtëpia (house), lule (flower)\n\nAdjectives agree:\n- i madh (m.) / e madhe (f.) — big\n- i vogël (m.) / e vogël (f.) — small\n- i bukur (m.) / e bukur (f.) — beautiful\n\n> E.g. 'djali i madh' = the big boy; 'vajza e vogël' = the small girl.",
        "Substantive haben Genus:\n\n- Maskulin: libri (Buch), djali (Junge), mali (Berg)\n- Feminin: vajza (Mädchen), shtëpia (Haus), lule (Blume)\n\nAdjektive passen sich an:\n- i madh (m.) / e madhe (f.) — groß\n- i vogël (m.) / e vogël (f.) — klein\n- i bukur (m.) / e bukur (f.) — schön\n\n> Z.B. 'djali i madh' = der große Junge; 'vajza e vogël' = das kleine Mädchen.",
        "I sostantivi hanno genere:\n\n- Maschile: libri (libro), djali (ragazzo), mali (monte)\n- Femminile: vajza (ragazza), shtëpia (casa), lule (fiore)\n\nGli aggettivi concordano:\n- i madh (m.) / e madhe (f.) — grande\n- i vogël (m.) / e vogël (f.) — piccolo\n- i bukur (m.) / e bukur (f.) — bello\n\n> Es. 'djali i madh' = il ragazzo grande; 'vajza e vogël' = la ragazza piccola.",
        "Les noms ont un genre :\n\n- Masculin : libri (livre), djali (garçon), mali (montagne)\n- Féminin : vajza (fille), shtëpia (maison), lule (fleur)\n\nLes adjectifs s'accordent :\n- i madh (m.) / e madhe (f.) — grand\n- i vogël (m.) / e vogël (f.) — petit\n- i bukur (m.) / e bukur (f.) — beau\n\n> Ex. 'djali i madh' = le grand garçon ; 'vajza e vogël' = la petite fille.",
        "Los sustantivos tienen género:\n\n- Masculino: libri (libro), djali (chico), mali (montaña)\n- Femenino: vajza (chica), shtëpia (casa), lule (flor)\n\nLos adjetivos concuerdan:\n- i madh (m.) / e madhe (f.) — grande\n- i vogël (m.) / e vogël (f.) — pequeño\n- i bukur (m.) / e bukur (f.) — hermoso\n\n> Ej. 'djali i madh' = el chico grande; 'vajza e vogël' = la chica pequeña."
      ),
      emoji: "✏️",
      xp: 70,
      duration: 12,
      order: 9,
      exercises: [
        {
          type: "quiz",
          data: {
            question: L("Cila është forma femërore e 'i bukur'?", "What is the feminine form of 'i bukur'?", "Was ist die feminine Form von 'i bukur'?", "Qual è la forma femminile di 'i bukur'?", "Quelle est la forme féminine de 'i bukur' ?", "¿Cuál es la forma femenina de 'i bukur'?"),
            options: [L("i bukur", "i bukur", "i bukur", "i bukur", "i bukur", "i bukur"), L("e bukur", "e bukur", "e bukur", "e bukur", "e bukur", "e bukur"), L("të bukur", "të bukur", "të bukur", "të bukur", "të bukur", "të bukur"), L("buken", "buken", "buken", "buken", "buken", "buken")],
            correctIndex: 1,
            explanation: L("'e bukur' = femëror.", "'e bukur' = feminine.", "'e bukur' = feminin.", "'e bukur' = femminile.", "'e bukur' = féminin.", "'e bukur' = femenino."),
          },
        },
        {
          type: "fill",
          data: {
            sentence: L("'vajza ____ vogël' = the small girl.", "'vajza ____ vogël' = the small girl.", "'vajza ____ vogël' = das kleine Mädchen.", "'vajza ____ vogël' = la ragazza piccola.", "'vajza ____ vogël' = la petite fille.", "'vajza ____ vogël' = la chica pequeña."),
            answer: L("e", "e", "e", "e", "e", "e"),
            options: [L("e", "e", "e", "e", "e", "e"), L("i", "i", "i", "i", "i", "i"), L("të", "të", "të", "të", "të", "të"), L("a", "a", "a", "a", "a", "a")],
          },
        },
      ],
    },
    {
      slug: "koha-vertetore",
      cat: "gramatike",
      diff: "mesatar",
      title: L("Koha e tashme", "Present tense", "Gegenwart", "Tempo presente", "Présent", "Tiempo presente"),
      summary: L("Mëso kohën e tashme të foljeve.", "Learn the present tense of verbs.", "Lerne die Gegenwart der Verben.", "Impara il tempo presente dei verbi.", "Apprends le présent des verbes.", "Aprende el presente de los verbos."),
      content: L(
        "Folja 'jam' (të jesh) në të tashmen:\n\n- unë **jam** — I am\n- ti **je** — you are\n- ai/ajo **është** — he/she is\n- ne **jemi** — we are\n- ju **jeni** — you (pl.) are\n- ata/ato **janë** — they are\n\nFolja 'kam' (të kesh):\n- unë kam, ti ke, ai ka, ne kemi, ju keni, ata kanë.\n\n> Foljet rregulloren mbarojnë me: -j, -n, -n, -më, -ni, -jnë.",
        "Verb 'jam' (to be) in present:\n\n- unë jam — I am\n- ti je — you are\n- ai/ajo është — he/she is\n- ne jemi — we are\n- ju jeni — you (pl.) are\n- ata/ato janë — they are\n\nVerb 'kam' (to have):\n- unë kam, ti ke, ai ka, ne kemi, ju keni, ata kanë.\n\n> Regular verbs end with: -j, -n, -n, -më, -ni, -jnë.",
        "Verb 'jam' (sein) in Gegenwart:\n\n- unë jam — ich bin\n- ti je — du bist\n- ai/ajo është — er/sie ist\n- ne jemi — wir sind\n- ju jeni — ihr seid\n- ata/ato janë — sie sind\n\nVerb 'kam' (haben):\n- unë kam, ti ke, ai ka, ne kemi, ju keni, ata kanë.\n\n> Regelmäßige Verben enden mit: -j, -n, -n, -më, -ni, -jnë.",
        "Verbo 'jam' (essere) al presente:\n\n- unë jam — io sono\n- ti je — tu sei\n- ai/ajo është — egli/ella è\n- ne jemi — noi siamo\n- ju jeni — voi siete\n- ata/ato janë — essi/esse sono\n\nVerbo 'kam' (avere):\n- unë kam, ti ke, ai ka, ne kemi, ju keni, ata kanë.\n\n> I verbi regolari terminano con: -j, -n, -n, -më, -ni, -jnë.",
        "Verbe 'jam' (être) au présent :\n\n- unë jam — je suis\n- ti je — tu es\n- ai/ajo është — il/elle est\n- ne jemi — nous sommes\n- ju jeni — vous êtes\n- ata/ato janë — ils/elles sont\n\nVerbe 'kam' (avoir) :\n- unë kam, ti ke, ai ka, ne kemi, ju keni, ata kanë.\n\n> Les verbes réguliers finissent par : -j, -n, -n, -më, -ni, -jnë.",
        "Verbo 'jam' (ser) en presente:\n\n- unë jam — yo soy\n- ti je — tú eres\n- ai/ajo është — él/ella es\n- ne jemi — nosotros somos\n- ju jeni — vosotros sois\n- ata/ato janë — ellos/ellas son\n\nVerbo 'kam' (tener):\n- unë kam, ti ke, ai ka, ne kemi, ju keni, ata kanë.\n\n> Los verbos regulares terminan en: -j, -n, -n, -më, -ni, -jnë."
      ),
      emoji: "⏳",
      xp: 75,
      duration: 13,
      order: 10,
      exercises: [
        {
          type: "quiz",
          data: {
            question: L("Si thuhet 'ne jemi'?", "How do you say 'we are'?", "Wie sagt man 'wir sind'?", "Come si dice 'noi siamo'?", "Comment dit-on 'nous sommes' ?", "¿Cómo se dice 'nosotros somos'?"),
            options: [L("unë jam", "unë jam", "unë jam", "unë jam", "unë jam", "unë jam"), L("ti je", "ti je", "ti je", "ti je", "ti je", "ti je"), L("ne jemi", "ne jemi", "ne jemi", "ne jemi", "ne jemi", "ne jemi"), L("ata janë", "ata janë", "ata janë", "ata janë", "ata janë", "ata janë")],
            correctIndex: 2,
            explanation: L("'ne jemi' = we are.", "'ne jemi' = we are.", "'ne jemi' = wir sind.", "'ne jemi' = noi siamo.", "'ne jemi' = nous sommes.", "'ne jemi' = nosotros somos."),
          },
        },
        {
          type: "fill",
          data: {
            sentence: L("Ai ____ shqiptar. (është)", "Ai ____ shqiptar. (is)", "Ai ____ shqiptar. (ist)", "Ai ____ shqiptar. (è)", "Ai ____ shqiptar. (est)", "Ai ____ shqiptar. (es)"),
            answer: L("është", "është", "është", "është", "është", "është"),
            options: [L("është", "është", "është", "është", "është", "është"), L("jam", "jam", "jam", "jam", "jam", "jam"), L("je", "je", "je", "je", "je", "je"), L("jemi", "jemi", "jemi", "jemi", "jemi", "jemi")],
          },
        },
      ],
    },
    {
      slug: "shtepia",
      cat: "fjalor",
      diff: "fillim",
      title: L("Shtëpia", "The house", "Das Haus", "La casa", "La maison", "La casa"),
      summary: L("Mëso dhomat dhe mobiljet e shtëpisë.", "Learn rooms and furniture of the house.", "Lerne Räume und Möbel des Hauses.", "Impara le stanze e i mobili della casa.", "Apprends les pièces et les meubles de la maison.", "Aprende las habitaciones y muebles de la casa."),
      content: L(
        "Dhomat dhe mobiljet:\n\n- **kuzhina** — kitchen\n- **dhoma e gjumit** — bedroom\n- **banjo** — bathroom\n- **salloni** — living room\n- **tavani** — table\n- **karrigia** — chair\n- **krevati** — bed\n- **dollapi** — closet\n- **dritarja** — window\n- **dyer** — door\n\n> 'Shtëpia' = the house.",
        "Rooms and furniture:\n\n- kuzhina — kitchen\n- dhoma e gjumit — bedroom\n- banjo — bathroom\n- salloni — living room\n- tavani — table\n- karrigia — chair\n- krevati — bed\n- dollapi — closet\n- dritarja — window\n- dyer — door\n\n> 'Shtëpia' = the house.",
        "Räume und Möbel:\n\n- kuzhina — Küche\n- dhoma e gjumit — Schlafzimmer\n- banjo — Badezimmer\n- salloni — Wohnzimmer\n- tavani — Tisch\n- karrigia — Stuhl\n- krevati — Bett\n- dollapi — Schrank\n- dritarja — Fenster\n- dyer — Tür\n\n> 'Shtëpia' = das Haus.",
        "Stanze e mobili:\n\n- kuzhina — cucina\n- dhoma e gjumit — camera da letto\n- banjo — bagno\n- salloni — soggiorno\n- tavani — tavolo\n- karrigia — sedia\n- krevati — letto\n- dollapi — armadio\n- dritarja — finestra\n- dyer — porta\n\n> 'Shtëpia' = la casa.",
        "Pièces et meubles :\n\n- kuzhina — cuisine\n- dhoma e gjumit — chambre\n- banjo — salle de bain\n- salloni — salon\n- tavani — table\n- karrigia — chaise\n- krevati — lit\n- dollapi — placard\n- dritarja — fenêtre\n- dyer — porte\n\n> 'Shtëpia' = la maison.",
        "Habitaciones y muebles:\n\n- kuzhina — cocina\n- dhoma e gjumit — dormitorio\n- banjo — baño\n- salloni — sala\n- tavani — mesa\n- karrigia — silla\n- krevati — cama\n- dollapi — armario\n- dritarja — ventana\n- dyer — puerta\n\n> 'Shtëpia' = la casa."
      ),
      emoji: "🏠",
      xp: 55,
      duration: 9,
      order: 11,
      exercises: [
        {
          type: "flashcard",
          data: { front: L("Kuzhina", "—", "—", "—", "—", "—"), back: L("Kuzhina = kitchen", "kitchen", "Küche", "cucina", "cuisine", "cocina"), emoji: "🍳", pronunciation: "ku-zhi-na" },
        },
        {
          type: "quiz",
          data: {
            question: L("Çfarë është 'krevati'?", "What is 'krevati'?", "Was ist 'krevati'?", "Cos'è 'krevati'?", "Qu'est-ce que 'krevati' ?", "¿Qué es 'krevati'?"),
            options: [L("Karrigia", "Chair", "Stuhl", "Sedia", "Chaise", "Silla"), L("Krevati", "Bed", "Bett", "Letto", "Lit", "Cama"), L("Tavani", "Table", "Tisch", "Tavolo", "Table", "Mesa"), L("Dollapi", "Closet", "Schrank", "Armadio", "Placard", "Armario")],
            correctIndex: 1,
            explanation: L("Krevati = bed.", "Krevati = bed.", "Krevati = Bett.", "Krevati = letto.", "Krevati = lit.", "Krevati = cama."),
          },
        },
      ],
    },
    {
      slug: "tradita-shqiptare",
      cat: "kulture",
      diff: "avancuar",
      title: L("Traditat shqiptare", "Albanian traditions", "Albanische Traditionen", "Tradizioni albanesi", "Traditions albanaises", "Tradiciones albanesas"),
      summary: L("Zbuloni traditat dhe zakonet shqiptare.", "Discover Albanian traditions and customs.", "Entdecke albanische Traditionen und Bräuche.", "Scopri le tradizioni e i costumi albanesi.", "Découvrez les traditions et coutumes albanaises.", "Descubre las tradiciones y costumbres albanesas."),
      content: L(
        "Tradita kryesore:\n\n- **Besa** — premtimi i shenjtë, baza e nderit shqiptar.\n- **Mikutëria** — miqtë trajtohen si anëtarë të familjes.\n- **Kanuni** — set i rregullave tradicionale.\n- **Vallja** — vallëzimi popullore (p.sh. vallja e Devollit).\n- **Polifonia** — këngë polifonike, pjesë e UNESCO-s.\n- **Fustanella** — veshja tradicionale mashkullore.\n\n> 'Besa' është simbol i besnikërisë dhe nderit.",
        "Main traditions:\n\n- Besa — the sacred promise, the basis of Albanian honor.\n- Hospitality — friends are treated as family members.\n- Kanun — a set of traditional rules.\n- Dance — folk dances (e.g. Devoll's dance).\n- Polyphony — polyphonic singing, part of UNESCO.\n- Fustanella — traditional male clothing.\n\n> 'Besa' is a symbol of loyalty and honor.",
        "Haupttraditionen:\n\n- Besa — das heilige Versprechen, die Basis der albanischen Ehre.\n- Gastfreundschaft — Freunde werden wie Familienmitglieder behandelt.\n- Kanun — ein Satz traditioneller Regeln.\n- Tanz — Volkstänze (z.B. Devoll-Tanz).\n- Polyphonie — polyphones Singen, Teil der UNESCO.\n- Fustanella — traditionelle männliche Kleidung.\n\n> 'Besa' ist ein Symbol für Treue und Ehre.",
        "Tradizioni principali:\n\n- Besa — la promessa sacra, base dell'onore albanese.\n- Ospitalità — gli amici sono trattati come membri della famiglia.\n- Kanun — un insieme di regole tradizionali.\n- Danza — danze popolari (es. danza di Devoll).\n- Polifonia — canto polifonico, parte dell'UNESCO.\n- Fustanella — abbigliamento maschile tradizionale.\n\n> 'Besa' è un simbolo di lealtà e onore.",
        "Traditions principales :\n\n- Besa — la promesse sacrée, base de l'honneur albanais.\n- Hospitalité — les amis sont traités comme des membres de la famille.\n- Kanun — un ensemble de règles traditionnelles.\n- Danse — danses folkloriques (ex. danse de Devoll).\n- Polyphonie — chant polyphonique, partie de l'UNESCO.\n- Fustanella — vêtement masculin traditionnel.\n\n> 'Besa' est un symbole de loyauté et d'honneur.",
        "Tradiciones principales:\n\n- Besa — la promesa sagrada, base del honor albanés.\n- Hospitalidad — los amigos son tratados como miembros de la familia.\n- Kanun — un conjunto de reglas tradicionales.\n- Danza — danzas folclóricas (ej. danza de Devoll).\n- Polifonía — canto polifónico, parte de la UNESCO.\n- Fustanella — vestimenta masculina tradicional.\n\n> 'Besa' es un símbolo de lealtad y honor."
      ),
      emoji: "🦅",
      xp: 90,
      duration: 15,
      order: 12,
      exercises: [
        {
          type: "quiz",
          data: {
            question: L("Çfarë është 'Besa'?", "What is 'Besa'?", "Was ist 'Besa'?", "Cos'è 'Besa'?", "Qu'est-ce que 'Besa' ?", "¿Qué es 'Besa'?"),
            options: [
              L("Një vallë", "A dance", "Ein Tanz", "Una danza", "Une danse", "Una danza"),
              L("Premtimi i shenjtë", "The sacred promise", "Das heilige Versprechen", "La promessa sacra", "La promesse sacrée", "La promesa sagrada"),
              L("Një ushqim", "A food", "Ein Essen", "Un cibo", "Un aliment", "Una comida"),
              L("Një festë", "A holiday", "Ein Feiertag", "Una festa", "Une fête", "Un feriado"),
            ],
            correctIndex: 1,
            explanation: L("Besa = premtimi i shenjtë.", "Besa = the sacred promise.", "Besa = das heilige Versprechen.", "Besa = la promessa sacra.", "Besa = la promesse sacrée.", "Besa = la promesa sagrada."),
          },
        },
        {
          type: "quiz",
          data: {
            question: L("Cila traditë është pjesë e UNESCO-s?", "Which tradition is part of UNESCO?", "Welche Tradition ist Teil der UNESCO?", "Quale tradizione fa parte dell'UNESCO?", "Quelle tradition fait partie de l'UNESCO ?", "¿Qué tradición es parte de la UNESCO?"),
            options: [L("Fustanella", "Fustanella", "Fustanella", "Fustanella", "Fustanella", "Fustanella"), L("Polifonia", "Polyphony", "Polyphonie", "Polifonia", "Polyphonie", "Polifonía"), L("Kanuni", "Kanun", "Kanun", "Kanun", "Kanun", "Kanun"), L("Besa", "Besa", "Besa", "Besa", "Besa", "Besa")],
            correctIndex: 1,
            explanation: L("Polifonia shqiptare është pjesë e UNESCO-s.", "Albanian polyphony is part of UNESCO.", "Albanische Polyphonie ist Teil der UNESCO.", "La polifonia albanese fa parte dell'UNESCO.", "La polyphonie albanaise fait partie de l'UNESCO.", "La polifonía albanesa es parte de la UNESCO."),
          },
        },
      ],
    },
  ];

  for (const ls of lessons) {
    const existing = await db.lesson.findUnique({ where: { slug: ls.slug } });
    const lessonData = {
      slug: ls.slug,
      categoryId: catMap[ls.cat],
      difficulty: ls.diff,
      title: ls.title as any,
      summary: ls.summary as any,
      content: ls.content as any,
      xpReward: ls.xp,
      duration: ls.duration,
      coverEmoji: ls.emoji,
      order: ls.order,
      published: true,
    };
    const lesson = existing
      ? await db.lesson.update({ where: { id: existing.id }, data: lessonData })
      : await db.lesson.create({ data: lessonData });

    // replace exercises
    await db.exercise.deleteMany({ where: { lessonId: lesson.id } });
    for (let i = 0; i < ls.exercises.length; i++) {
      const ex = ls.exercises[i];
      await db.exercise.create({
        data: {
          lessonId: lesson.id,
          type: ex.type,
          data: ex.data as any,
          order: i,
        },
      });
    }
  }

  // ---------- Dictionary ----------
  const words: { word: string; pron: string; tr: ReturnType<typeof L>; ex: ReturnType<typeof L>; cat: string; emoji: string }[] = [
    { word: "tungjatjeta", pron: "tung-jat-je-ta", tr: L("përshëndetje", "hello", "hallo", "ciao", "bonjour", "hola"), ex: L("Tungjatjeta, si je?", "Hello, how are you?", "Hallo, wie geht's?", "Ciao, come stai?", "Bonjour, comment ça va ?", "Hola, ¿cómo estás?"), cat: "biseda", emoji: "👋" },
    { word: "faleminderit", pron: "fa-le-min-de-rit", tr: L("mirënjohje", "thank you", "danke", "grazie", "merci", "gracias"), ex: L("Faleminderit shumë!", "Thank you very much!", "Vielen Dank!", "Grazie mille!", "Merci beaucoup !", "¡Muchas gracias!"), cat: "biseda", emoji: "🙏" },
    { word: "bukë", pron: "bu-kë", tr: L("bukë", "bread", "Brot", "pane", "pain", "pan"), ex: L("Buka është e ngrohtë.", "The bread is warm.", "Das Brot ist warm.", "Il pane è caldo.", "Le pain est chaud.", "El pan está caliente."), cat: "ushqim", emoji: "🍞" },
    { word: "ujë", pron: "u-jë", tr: L("ujë", "water", "Wasser", "acqua", "eau", "agua"), ex: L("Dua ujë, ju lutem.", "I want water, please.", "Ich will Wasser, bitte.", "Voglio acqua, per favore.", "Je veux de l'eau, s'il vous plaît.", "Quiero agua, por favor."), cat: "ushqim", emoji: "💧" },
    { word: "shtëpi", pron: "shtë-pi", tr: L("shtëpi", "house", "Haus", "casa", "maison", "casa"), ex: L("Shtëpia ime është e madhe.", "My house is big.", "Mein Haus ist groß.", "La mia casa è grande.", "Ma maison est grande.", "Mi casa es grande."), cat: "shtëpi", emoji: "🏠" },
    { word: "libër", pron: "li-bër", tr: L("libër", "book", "Buch", "libro", "livre", "libro"), ex: L("Lexoj një libër.", "I read a book.", "Ich lese ein Buch.", "Leggo un libro.", "Je lis un livre.", "Leo un libro."), cat: "shkollë", emoji: "📖" },
    { word: "djalë", pron: "dja-lë", tr: L("djalë", "boy", "Junge", "ragazzo", "garçon", "chico"), ex: L("Djali luan futboll.", "The boy plays football.", "Der Junge spielt Fußball.", "Il ragazzo gioca a calcio.", "Le garçon joue au football.", "El chico juega al fútbol."), cat: "familje", emoji: "👦" },
    { word: "vajzë", pron: "vaj-zë", tr: L("vajzë", "girl", "Mädchen", "ragazza", "fille", "chica"), ex: L("Vajza këndon bukur.", "The girl sings beautifully.", "Das Mädchen singt schön.", "La ragazza canta bene.", "La fille chante bien.", "La chica canta hermoso."), cat: "familje", emoji: "👧" },
    { word: "diell", pron: "di-ell", tr: L("diell", "sun", "Sonne", "sole", "soleil", "sol"), ex: L("Dielli shkëlqen.", "The sun is shining.", "Die Sonne scheint.", "Il sole splende.", "Le soleil brille.", "El sol brilla."), cat: "natyrë", emoji: "☀️" },
    { word: "shi", pron: "shi", tr: L("shi", "rain", "Regen", "pioggia", "pluie", "lluvia"), ex: L("Sot bie shi.", "Today it rains.", "Heute regnet es.", "Oggi piove.", "Aujourd'hui il pleut.", "Hoy llueve."), cat: "natyrë", emoji: "🌧️" },
    { word: "mëngjes", pron: "mën-gjes", tr: L("mëngjes", "morning", "Morgen", "mattino", "matin", "mañana"), ex: L("Mirëmëngjes!", "Good morning!", "Guten Morgen!", "Buongiorno!", "Bon matin !", "¡Buenos días!"), cat: "kohë", emoji: "🌅" },
    { word: "natë", pron: "na-të", tr: L("natë", "night", "Nacht", "notte", "nuit", "noche"), ex: L("Natën e mirë!", "Good night!", "Gute Nacht!", "Buonanotte!", "Bonne nuit !", "¡Buenas noches!"), cat: "kohë", emoji: "🌙" },
    { word: "qen", pron: "qen", tr: L("qen", "dog", "Hund", "cane", "chien", "perro"), ex: L("Qeni leh.", "The dog barks.", "Der Hund bellt.", "Il cane abbaia.", "Le chien aboie.", "El perro ladra."), cat: "kafshë", emoji: "🐕" },
    { word: "mace", pron: "ma-ce", tr: L("mace", "cat", "Katze", "gatto", "chat", "gato"), ex: L("Maceja fle.", "The cat sleeps.", "Die Katze schläft.", "Il gatto dorme.", "Le chat dort.", "El gato duerme."), cat: "kafshë", emoji: "🐈" },
    { word: "veturë", pron: "ve-tu-rë", tr: L("veturë", "car", "Auto", "auto", "voiture", "coche"), ex: L("Vetura është e kuqe.", "The car is red.", "Das Auto ist rot.", "L'auto è rossa.", "La voiture est rouge.", "El coche es rojo."), cat: "transport", emoji: "🚗" },
    { word: "shkollë", pron: "shkol-lë", tr: L("shkollë", "school", "Schule", "scuola", "école", "escuela"), ex: L("Shkoj në shkollë.", "I go to school.", "Ich gehe zur Schule.", "Vado a scuola.", "Je vais à l'école.", "Voy a la escuela."), cat: "shkollë", emoji: "🏫" },
    { word: "mësues", pron: "më-su-es", tr: L("mësues", "teacher", "Lehrer", "insegnante", "professeur", "profesor"), ex: L("Mësuesi mëson fëmijët.", "The teacher teaches the children.", "Der Lehrer lehrt die Kinder.", "L'insegnante insegna ai bambini.", "Le professeur enseigne aux enfants.", "El profesor enseña a los niños."), cat: "shkollë", emoji: "👨‍🏫" },
    { word: "fmijë", pron: "fë-mi-jë", tr: L("fëmijë", "child", "Kind", "bambino", "enfant", "niño"), ex: L("Fëmija loz.", "The child plays.", "Das Kind spielt.", "Il bambino gioca.", "L'enfant joue.", "El niño juega."), cat: "familje", emoji: "🧒" },
    { word: "pemë", pron: "pe-më", tr: L("pemë", "tree", "Baum", "albero", "arbre", "árbol"), ex: L("Pema është e lartë.", "The tree is tall.", "Der Baum ist hoch.", "L'albero è alto.", "L'arbre est haut.", "El árbol es alto."), cat: "natyrë", emoji: "🌳" },
    { word: "lule", pron: "lu-le", tr: L("lule", "flower", "Blume", "fiore", "fleur", "flor"), ex: L("Lulja është e bukur.", "The flower is beautiful.", "Die Blume ist schön.", "Il fiore è bello.", "La fleur est belle.", "La flor es hermosa."), cat: "natyrë", emoji: "🌸" },
    { word: "shok", pron: "shok", tr: L("shok", "friend", "Freund", "amico", "ami", "amigo"), ex: L("Shoku im është simpatik.", "My friend is nice.", "Mein Freund ist nett.", "Il mio amico è simpatico.", "Mon ami est sympa.", "Mi amigo es simpático."), cat: "biseda", emoji: "🤝" },
    { word: "punë", pron: "pu-në", tr: L("punë", "work", "Arbeit", "lavoro", "travail", "trabajo"), ex: L("Kam shumë punë.", "I have a lot of work.", "Ich habe viel Arbeit.", "Ho molto lavoro.", "J'ai beaucoup de travail.", "Tengo mucho trabajo."), cat: "jetë", emoji: "💼" },
    { word: "dashuri", pron: "da-shu-ri", tr: L("dashuri", "love", "Liebe", "amore", "amour", "amor"), ex: L("Dashuria është e rëndësishme.", "Love is important.", "Liebe ist wichtig.", "L'amore è importante.", "L'amour est important.", "El amor es importante."), cat: "jetë", emoji: "❤️" },
    { word: "muzikë", pron: "mu-zi-kë", tr: L("muzikë", "music", "Musik", "musica", "musique", "música"), ex: L("Më pëlqen muzika.", "I like music.", "Ich mag Musik.", "Mi piace la musica.", "J'aime la musique.", "Me gusta la música."), cat: "art", emoji: "🎵" },
    { word: "këngë", pron: "kë-n-gë", tr: L("këngë", "song", "Lied", "canzone", "chanson", "canción"), ex: L("Këndoj një këngë.", "I sing a song.", "Ich singe ein Lied.", "Canto una canzone.", "Je chante une chanson.", "Canto una canción."), cat: "art", emoji: "🎤" },
    { word: "lojë", pron: "lo-jë", tr: L("lojë", "game", "Spiel", "gioco", "jeu", "juego"), ex: L("Luajmë një lojë.", "We play a game.", "Wir spielen ein Spiel.", "Giochiamo a un gioco.", "Nous jouons à un jeu.", "Jugamos a un juego."), cat: "jetë", emoji: "🎮" },
    { word: "ftuat", pron: "ftu-at", tr: L("ftuat", "cold", "kalt", "freddo", "froid", "frío"), ex: L("Uji është i ftohtë.", "The water is cold.", "Das Wasser ist kalt.", "L'acqua è fredda.", "L'eau est froide.", "El agua está fría."), cat: "natyrë", emoji: "❄️" },
    { word: "nxehtë", pron: "nxeh-të", tr: L("nxehtë", "hot", "heiß", "caldo", "chaud", "caliente"), ex: L("Çaji është i nxehtë.", "The tea is hot.", "Der Tee ist heiß.", "Il tè è caldo.", "Le thé est chaud.", "El té está caliente."), cat: "natyrë", emoji: "🔥" },
    { word: "i madh", pron: "i madh", tr: L("i madh", "big", "groß", "grande", "grand", "grande"), ex: L("Shtëpia e madhe.", "The big house.", "Das große Haus.", "La casa grande.", "La grande maison.", "La casa grande."), cat: "cilësi", emoji: "🐘" },
    { word: "i vogël", pron: "i vo-gël", tr: L("i vogël", "small", "klein", "piccolo", "petit", "pequeño"), ex: L("Maceja e vogël.", "The small cat.", "Die kleine Katze.", "Il gatto piccolo.", "Le petit chat.", "El gato pequeño."), cat: "cilësi", emoji: "🐭" },
  ];

  for (const w of words) {
    await db.dictionary.upsert({
      where: { word: w.word },
      update: {
        pronunciation: w.pron,
        translations: w.tr as any,
        example: w.ex as any,
        category: w.cat,
        emoji: w.emoji,
      },
      create: {
        word: w.word,
        pronunciation: w.pron,
        translations: w.tr as any,
        example: w.ex as any,
        category: w.cat,
        emoji: w.emoji,
      },
    });
  }

  // ---------- Progress (mark a couple of lessons completed) ----------
  const done1 = await db.lesson.findUnique({ where: { slug: "alfabeti-36-shkronjat" } });
  const done2 = await db.lesson.findUnique({ where: { slug: "numrat-1-20" } });
  const inprog = await db.lesson.findUnique({ where: { slug: "ngjyrat" } });
  if (done1) {
    await db.progress.upsert({
      where: { learnerId_lessonId: { learnerId: learner.id, lessonId: done1.id } },
      update: {},
      create: {
        learnerId: learner.id,
        lessonId: done1.id,
        status: "completed",
        score: 100,
        xpEarned: 60,
        startedAt: new Date(Date.now() - 3 * 86400000),
        completedAt: new Date(Date.now() - 3 * 86400000),
      },
    });
    await db.certificate.upsert({
      where: { code: "MSQ-ALFABETI" },
      update: {},
      create: {
        code: "MSQ-ALFABETI",
        learnerId: learner.id,
        lessonSlug: done1.slug,
        lessonTitle: done1.title as any,
        learnerName: learner.name,
        score: 100,
        issuedAt: new Date(Date.now() - 3 * 86400000),
      },
    });
  }
  if (done2) {
    await db.progress.upsert({
      where: { learnerId_lessonId: { learnerId: learner.id, lessonId: done2.id } },
      update: {},
      create: {
        learnerId: learner.id,
        lessonId: done2.id,
        status: "completed",
        score: 80,
        xpEarned: 40,
        startedAt: new Date(Date.now() - 2 * 86400000),
        completedAt: new Date(Date.now() - 2 * 86400000),
      },
    });
  }
  if (inprog) {
    await db.progress.upsert({
      where: { learnerId_lessonId: { learnerId: learner.id, lessonId: inprog.id } },
      update: {},
      create: {
        learnerId: learner.id,
        lessonId: inprog.id,
        status: "in_progress",
        score: 0,
        xpEarned: 0,
        startedAt: new Date(Date.now() - 1 * 86400000),
      },
    });
  }

  // ---------- Achievements ----------
  const achievements = [
    { type: "first_lesson", title: L("Mësimi i parë", "First lesson", "Erste Lektion", "Prima lezione", "Première leçon", "Primera lección"), icon: "🎯" },
    { type: "streak_7", title: L("Seria 7 ditore", "7-day streak", "7-Tage-Serie", "Serie di 7 giorni", "Série de 7 jours", "Racha de 7 días"), icon: "🔥" },
    { type: "words_50", title: L("50 fjalë", "50 words", "50 Wörter", "50 parole", "50 mots", "50 palabras"), icon: "📚" },
    { type: "quiz_master", title: L("Mjeshtër kuizesh", "Quiz master", "Quiz-Meister", "Maestro dei quiz", "Maître du quiz", "Maestro del quiz"), icon: "🧠" },
    { type: "polyglot", title: L("Poligloti", "Polyglot", "Polyglott", "Poliglotta", "Polyglotte", "Políglota"), icon: "🌍" },
  ];
  for (const a of achievements.slice(0, 2)) {
    await db.achievement.upsert({
      where: { learnerId_type: { learnerId: learner.id, type: a.type } },
      update: {},
      create: { learnerId: learner.id, type: a.type, title: a.title as any, icon: a.icon },
    });
  }

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
