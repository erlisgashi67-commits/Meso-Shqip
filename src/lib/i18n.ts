import type { LangCode } from "./types";
import { DEFAULT_LANG } from "./languages";

// UI string keys for Mëso Shqip🦅
export const UI = {
  brand: "Mëso Shqip",
  tagline: {
    sq: "Mëso gjuhën shqipe në një mënyrë të re",
    en: "Learn Albanian in a new way",
    de: "Albanisch auf neue Weise lernen",
    it: "Impara l'albanese in un modo nuovo",
    fr: "Apprenez l'albanais d'une nouvelle manière",
    es: "Aprende albanés de una nueva manera",
  },

  // Navigation
  nav: {
    home: { sq: "Shtëpi", en: "Home", de: "Start", it: "Home", fr: "Accueil", es: "Inicio" },
    lessons: { sq: "Mësime", en: "Lessons", de: "Lektionen", it: "Lezioni", fr: "Leçons", es: "Lecciones" },
    practice: { sq: "Ushtrime", en: "Practice", de: "Üben", it: "Pratica", fr: "Pratique", es: "Práctica" },
    progress: { sq: "Progresi", en: "Progress", de: "Fortschritt", it: "Progressi", fr: "Progrès", es: "Progreso" },
    certificate: { sq: "Certifikata", en: "Certificate", de: "Zertifikat", it: "Certificato", fr: "Certificat", es: "Certificado" },
    admin: { sq: "Admin", en: "Admin", de: "Admin", it: "Admin", fr: "Admin", es: "Admin" },
    aiStudio: { sq: "AI Studio", en: "AI Studio", de: "KI-Studio", it: "AI Studio", fr: "Studio IA", es: "Estudio IA" },
  },

  // Common
  common: {
    search: { sq: "Kërko", en: "Search", de: "Suchen", it: "Cerca", fr: "Rechercher", es: "Buscar" },
    loading: { sq: "Po ngarkohet...", en: "Loading...", de: "Lädt...", it: "Caricamento...", fr: "Chargement...", es: "Cargando..." },
    save: { sq: "Ruaj", en: "Save", de: "Speichern", it: "Salva", fr: "Enregistrer", es: "Guardar" },
    cancel: { sq: "Anulo", en: "Cancel", de: "Abbrechen", it: "Annulla", fr: "Annuler", es: "Cancelar" },
    delete: { sq: "Fshi", en: "Delete", de: "Löschen", it: "Elimina", fr: "Supprimer", es: "Eliminar" },
    edit: { sq: "Modifiko", en: "Edit", de: "Bearbeiten", it: "Modifica", fr: "Modifier", es: "Editar" },
    add: { sq: "Shto", en: "Add", de: "Hinzufügen", it: "Aggiungi", fr: "Ajouter", es: "Añadir" },
    close: { sq: "Mbyll", en: "Close", de: "Schließen", it: "Chiudi", fr: "Fermer", es: "Cerrar" },
    back: { sq: "Prapa", en: "Back", de: "Zurück", it: "Indietro", fr: "Retour", es: "Atrás" },
    next: { sq: "Para", en: "Next", de: "Weiter", it: "Avanti", fr: "Suivant", es: "Siguiente" },
    submit: { sq: "Dërgo", en: "Submit", de: "Absenden", it: "Invia", fr: "Envoyer", es: "Enviar" },
    retry: { sq: "Provo përsëri", en: "Try again", de: "Erneut versuchen", it: "Riprova", fr: "Réessayer", es: "Reintentar" },
    start: { sq: "Fillo", en: "Start", de: "Starten", it: "Inizia", fr: "Commencer", es: "Empezar" },
    completed: { sq: "Përfunduar", en: "Completed", de: "Abgeschlossen", it: "Completato", fr: "Terminé", es: "Completado" },
    continue: { sq: "Vazhdo", en: "Continue", de: "Fortsetzen", it: "Continua", fr: "Continuer", es: "Continuar" },
    viewAll: { sq: "Shiko të gjitha", en: "View all", de: "Alle ansehen", it: "Vedi tutto", fr: "Voir tout", es: "Ver todo" },
    all: { sq: "Të gjitha", en: "All", de: "Alle", it: "Tutti", fr: "Tous", es: "Todos" },
    minutes: { sq: "min", en: "min", de: "Min", it: "min", fr: "min", es: "min" },
    xp: { sq: "XP", en: "XP", de: "XP", it: "XP", fr: "XP", es: "XP" },
    words: { sq: "fjalë", en: "words", de: "Wörter", it: "parole", fr: "mots", es: "palabras" },
    lessons: { sq: "mësime", en: "lessons", de: "Lektionen", it: "lezioni", fr: "leçons", es: "lecciones" },
    learners: { sq: "nxënës", en: "learners", de: "Lernende", it: "studenti", fr: "apprenants", es: "estudiantes" },
    languages: { sq: "gjuhë", en: "languages", de: "Sprachen", it: "lingue", fr: "langues", es: "idiomas" },
    of: { sq: "nga", en: "of", de: "von", it: "di", fr: "sur", es: "de" },
    question: { sq: "Pyetje", en: "Question", de: "Frage", it: "Domanda", fr: "Question", es: "Pregunta" },
    score: { sq: "Pikë", en: "Score", de: "Punkte", it: "Punteggio", fr: "Score", es: "Puntuación" },
    correct: { sq: "Saktë!", en: "Correct!", de: "Richtig!", it: "Corretto!", fr: "Correct !", es: "¡Correcto!" },
    incorrect: { sq: "Pasaktë", en: "Incorrect", de: "Falsch", it: "Sbagliato", fr: "Incorrect", es: "Incorrecto" },
    finish: { sq: "Përfundo", en: "Finish", de: "Fertig", it: "Termina", fr: "Terminer", es: "Finalizar" },
  },

  difficulty: {
    fillim: { sq: "Fillestar", en: "Beginner", de: "Anfänger", it: "Principiante", fr: "Débutant", es: "Principiante" },
    mesatar: { sq: "Mesatar", en: "Intermediate", de: "Mittelstufe", it: "Intermedio", fr: "Intermédiaire", es: "Intermedio" },
    avancuar: { sq: "I avancuar", en: "Advanced", de: "Fortgeschritten", it: "Avanzato", fr: "Avancé", es: "Avanzado" },
  },

  // Home
  home: {
    heroBadge: { sq: "Për diasporën shqiptare", en: "For the Albanian diaspora", de: "Für die albanische Diaspora", it: "Per la diaspora albanese", fr: "Pour la diaspora albanaise", es: "Para la diáspora albanesa" },
    heroTitle: { sq: "Mëso gjuhën shqipe me zemër", en: "Learn the Albanian language with heart", de: "Lerne die albanische Sprache mit Herz", it: "Impara la lingua albanese con il cuore", fr: "Apprenez la langue albanaise avec le cœur", es: "Aprende el idioma albanés con el corazón" },
    heroSubtitle: { sq: "Platforma e parë interaktive që kombinon mësimet, ushtrimet dhe inteligjencën artificiale për të ndihmuar fëmijët e diasporës të lidhen me rrënjët e tyre shqiptare.", en: "The first interactive platform that combines lessons, exercises and artificial intelligence to help diaspora children connect with their Albanian roots.", de: "Die erste interaktive Plattform, die Lektionen, Übungen und künstliche Intelligenz verbindet, um Kindern der Diaspora zu helfen, sich mit ihren albanischen Wurzeln zu verbinden.", it: "La prima piattaforma interattiva che combina lezioni, esercizi e intelligenza artificiale per aiutare i bambini della diaspora a connettersi con le loro radici albanesi.", fr: "La première plateforme interactive qui combine leçons, exercices et intelligence artificielle pour aider les enfants de la diaspora à se connecter à leurs racines albanaises.", es: "La primera plataforma interactiva que combina lecciones, ejercicios e inteligencia artificial para ayudar a los niños de la diáspora a conectarse con sus raíces albanesas." },
    heroCta: { sq: "Fillo mësimin", en: "Start learning", de: "Jetzt lernen", it: "Inizia a imparare", fr: "Commencer", es: "Empezar a aprender" },
    heroCta2: { sq: "Eksploro mësimet", en: "Explore lessons", de: "Lektionen entdecken", it: "Esplora le lezioni", fr: "Explorer les leçons", es: "Explorar lecciones" },
    statLessons: { sq: "Mësime", en: "Lessons", de: "Lektionen", it: "Lezioni", fr: "Leçons", es: "Lecciones" },
    statLearners: { sq: "Nxënës", en: "Learners", de: "Lernende", it: "Studenti", fr: "Apprenants", es: "Estudiantes" },
    statWords: { sq: "Fjalë", en: "Words", de: "Wörter", it: "Parole", fr: "Mots", es: "Palabras" },
    statLanguages: { sq: "Gjuhë", en: "Languages", de: "Sprachen", it: "Lingue", fr: "Langues", es: "Idiomas" },
    featured: { sq: "Mësime të zgjedhura", en: "Featured lessons", de: "Empfohlene Lektionen", it: "Lezioni in evidenza", fr: "Leçons en vedette", es: "Lecciones destacadas" },
    featuredSub: { sq: "Fillo udhëtimin tënd me mësimet më të njohura", en: "Start your journey with the most popular lessons", de: "Beginne deine Reise mit den beliebtesten Lektionen", it: "Inizia il tuo viaggio con le lezioni più popolari", fr: "Commencez votre voyage avec les leçons les plus populaires", es: "Comienza tu viaje con las lecciones más populares" },
    featuresTitle: { sq: "Pse Mëso Shqip?", en: "Why Mëso Shqip?", de: "Warum Mëso Shqip?", it: "Perché Mëso Shqip?", fr: "Pourquoi Mëso Shqip ?", es: "¿Por qué Mëso Shqip?" },
    featuresSub: { sq: "Një eksperiencë mësimi e plotë, e krijuar për diasporën", en: "A complete learning experience, built for the diaspora", de: "Ein vollständiges Lernerlebnis, für die Diaspora geschaffen", it: "Un'esperienza di apprendimento completa, creata per la diaspora", fr: "Une expérience d'apprentissage complète, conçue pour la diaspora", es: "Una experiencia de aprendizaje completa, creada para la diáspora" },
    feat1Title: { sq: "Ushtrime interaktive", en: "Interactive exercises", de: "Interaktive Übungen", it: "Esercizi interattivi", fr: "Exercices interactifs", es: "Ejercicios interactivos" },
    feat1Desc: { sq: "Kuize, flashcard dhe lojëra përforcimi për çdo mësim.", en: "Quizzes, flashcards and reinforcement games for every lesson.", de: "Quiz, Karteikarten und Verstärkungsspiele für jede Lektion.", it: "Quiz, flashcard e giochi di rinforzo per ogni lezione.", fr: "Quiz, flashcards et jeux de renforcement pour chaque leçon.", es: "Cuestionarios, flashcards y juegos de refuerzo para cada lección." },
    feat2Title: { sq: "6 gjuhë ndihmëse", en: "6 helper languages", de: "6 Hilfssprachen", it: "6 lingue di supporto", fr: "6 langues d'aide", es: "6 idiomas de apoyo" },
    feat2Desc: { sq: "Ndërfaqja dhe përmbajtja përshtaten me gjuhën tënde amtare.", en: "Interface and content adapt to your native language.", de: "Oberfläche und Inhalt passen sich an deine Muttersprache an.", it: "Interfaccia e contenuti si adattano alla tua lingua madre.", fr: "L'interface et le contenu s'adaptent à votre langue maternelle.", es: "La interfaz y el contenido se adaptan a tu idioma materno." },
    feat3Title: { sq: "Inteligjencë artificiale", en: "Artificial intelligence", de: "Künstliche Intelligenz", it: "Intelligenza artificiale", fr: "Intelligence artificielle", es: "Inteligencia artificial" },
    feat3Desc: { sq: "Gjenero materiale edukative dhe bisedo me tutorin AI.", en: "Generate educational materials and chat with the AI tutor.", de: "Generiere Lernmaterial und chatte mit dem KI-Tutor.", it: "Genera materiali educativi e chatta con il tutor AI.", fr: "Générez du matériel éducatif et discutez avec le tuteur IA.", es: "Genera materiales educativos y chatea con el tutor de IA." },
    feat4Title: { sq: "Certifikata", en: "Certificates", de: "Zertifikate", it: "Certificati", fr: "Certificats", es: "Certificados" },
    feat4Desc: { sq: "Merr certifikatë pas çdo mësimi të përfunduar me sukses.", en: "Get a certificate after every successfully completed lesson.", de: "Erhalte ein Zertifikat nach jeder erfolgreich abgeschlossenen Lektion.", it: "Ottieni un certificato dopo ogni lezione completata con successo.", fr: "Obtenez un certificat après chaque leçon terminée avec succès.", es: "Obtén un certificado después de cada lección completada con éxito." },
    feat5Title: { sq: "Ndjekja e progresit", en: "Progress tracking", de: "Fortschrittsverfolgung", it: "Monitoraggio dei progressi", fr: "Suivi de progression", es: "Seguimiento del progreso" },
    feat5Desc: { sq: "Paso zhvillimin tënd me statistika, seri dhe arritje.", en: "Track your development with statistics, streaks and achievements.", de: "Verfolge deine Entwicklung mit Statistiken, Serien und Erfolgen.", it: "Monitora il tuo sviluppo con statistiche, serie e traguardi.", fr: "Suivez votre développement avec des statistiques, des séries et des réussites.", es: "Rastrea tu desarrollo con estadísticas, rachas y logros." },
    feat6Title: { sq: "Fjalor i pasur", en: "Rich dictionary", de: "Reichhaltiges Wörterbuch", it: "Dizionario ricco", fr: "Dictionnaire riche", es: "Diccionario rico" },
    feat6Desc: { sq: "Qindra fjalë me përkthim, shembuj dhe shqiptim.", en: "Hundreds of words with translation, examples and pronunciation.", de: "Hunderte Wörter mit Übersetzung, Beispielen und Aussprache.", it: "Centinaia di parole con traduzione, esempi e pronuncia.", fr: "Des centaines de mots avec traduction, exemples et prononciation.", es: "Cientos de palabras con traducción, ejemplos y pronunciación." },
    ctaTitle: { sq: "Gati të fillosh?", en: "Ready to start?", de: "Bereit anzufangen?", it: "Pronto per iniziare?", fr: "Prêt à commencer ?", es: "¿Listo para empezar?" },
    ctaSubtitle: { sq: "Bashkohu me mijëra fëmijë të diasporës që mësojnë shqip çdo ditë.", en: "Join thousands of diaspora children learning Albanian every day.", de: "Trete Tausenden von Diasporakindern bei, die jeden Tag Albanisch lernen.", it: "Unisciti a migliaia di bambini della diaspora che imparano l'albanese ogni giorno.", fr: "Rejoignez des milliers d'enfants de la diaspora qui apprennent l'albanais chaque jour.", es: "Únete a miles de niños de la diáspora que aprenden albanés cada día." },
  },

  // Lessons
  lessons: {
    title: { sq: "Mësime", en: "Lessons", de: "Lektionen", it: "Lezioni", fr: "Leçons", es: "Lecciones" },
    subtitle: { sq: "Eksploro mësimet sipas kategorisë dhe nivelit", en: "Explore lessons by category and level", de: "Entdecke Lektionen nach Kategorie und Niveau", it: "Esplora le lezioni per categoria e livello", fr: "Explorez les leçons par catégorie et niveau", es: "Explora las lecciones por categoría y nivel" },
    allCategories: { sq: "Të gjitha kategoritë", en: "All categories", de: "Alle Kategorien", it: "Tutte le categorie", fr: "Toutes les catégories", es: "Todas las categorías" },
    noResults: { sq: "Nuk u gjetën mësime", en: "No lessons found", de: "Keine Lektionen gefunden", it: "Nessuna lezione trovata", fr: "Aucune leçon trouvée", es: "No se encontraron lecciones" },
    exercises: { sq: "ushtrime", en: "exercises", de: "Übungen", it: "esercizi", fr: "exercices", es: "ejercicios" },
    startLesson: { sq: "Fillo mësimin", en: "Start lesson", de: "Lektion starten", it: "Inizia lezione", fr: "Commencer la leçon", es: "Empezar lección" },
  },

  // Lesson detail / exercises
  lesson: {
    objectives: { sq: "Çfarë do të mësosh", en: "What you'll learn", de: "Was du lernen wirst", it: "Cosa imparerai", fr: "Ce que vous apprendrez", es: "Lo que aprenderás" },
    exercisesTitle: { sq: "Ushtrime", en: "Exercises", de: "Übungen", it: "Esercizi", fr: "Exercices", es: "Ejercicios" },
    completeToEarn: { sq: "Përfundo për të fituar", en: "Complete to earn", de: "Abschließen für", it: "Completa per guadagnare", fr: "Terminer pour gagner", es: "Completa para ganar" },
    yourScore: { sq: "Rezultati yt", en: "Your score", de: "Dein Ergebnis", it: "Il tuo punteggio", fr: "Votre score", es: "Tu puntuación" },
    passed: { sq: "Kaluar! Urime 🎉", en: "Passed! Congratulations 🎉", de: "Bestanden! Glückwunsch 🎉", it: "Superato! Congratulazioni 🎉", fr: "Réussi ! Félicitations 🎉", es: "¡Aprobado! Felicidades 🎉" },
    failed: { sq: "Provo përsëri", en: "Try again", de: "Versuche es erneut", it: "Riprova", fr: "Réessayer", es: "Inténtalo de nuevo" },
    retake: { sq: "Ribëj", en: "Retake", de: "Wiederholen", it: "Ripeti", fr: "Refaire", es: "Repetir" },
    needPass: { sq: "Duhet të kalosh 60% për të fituar certifikatën", en: "You need 60% to earn the certificate", de: "Du brauchst 60% für das Zertifikat", it: "Ti serve il 60% per il certificato", fr: "Il faut 60% pour le certificat", es: "Necesitas 60% para el certificado" },
    certificateReady: { sq: "Certifikata është gati!", en: "Your certificate is ready!", de: "Dein Zertifikat ist bereit!", it: "Il tuo certificato è pronto!", fr: "Votre certificat est prêt !", es: "¡Tu certificado está listo!" },
    viewCertificate: { sq: "Shiko certifikatën", en: "View certificate", de: "Zertifikat ansehen", it: "Vedi certificato", fr: "Voir le certificat", es: "Ver certificado" },
    flashcardFlip: { sq: "Kliko për t'a kthyer", en: "Click to flip", de: "Klicken zum Umdrehen", it: "Clicca per girare", fr: "Cliquez pour retourner", es: "Clic para girar" },
    matching: { sq: "Bashko çiftet", en: "Match the pairs", de: "Paare zuordnen", it: "Abbina le coppie", fr: "Associez les paires", es: "Empareja las parejas" },
    fillBlank: { sq: "Plotëso hapësirën", en: "Fill the blank", de: "Lücke ausfüllen", it: "Completa lo spazio", fr: "Remplir le blanc", es: "Rellena el espacio" },
    selectAnswer: { sq: "Zgjidh përgjigjen", en: "Select the answer", de: "Antwort wählen", it: "Scegli la risposta", fr: "Choisissez la réponse", es: "Elige la respuesta" },
    progress: { sq: "Progresi", en: "Progress", de: "Fortschritt", it: "Progresso", fr: "Progression", es: "Progreso" },
    notStarted: { sq: "Pa filluar", en: "Not started", de: "Nicht begonnen", it: "Non iniziato", fr: "Non commencé", es: "No empezado" },
    inProgress: { sq: "Në progres", en: "In progress", de: "In Arbeit", it: "In corso", fr: "En cours", es: "En progreso" },
    completed: { sq: "Përfunduar", en: "Completed", de: "Abgeschlossen", it: "Completato", fr: "Terminé", es: "Completado" },
  },

  // Practice
  practice: {
    title: { sq: "Ushtrime", en: "Practice", de: "Üben", it: "Pratica", fr: "Pratique", es: "Práctica" },
    subtitle: { sq: "Përforco njohuritë me ushtrime interaktive", en: "Reinforce your knowledge with interactive exercises", de: "Verstärke dein Wissen mit interaktiven Übungen", it: "Rinforza le tue conoscenze con esercizi interattivi", fr: "Renforcez vos connaissances avec des exercices interactifs", es: "Refuerza tus conocimientos con ejercicios interactivos" },
    quiz: { sq: "Kuiz", en: "Quiz", de: "Quiz", it: "Quiz", fr: "Quiz", es: "Cuestionario" },
    flashcards: { sq: "Karta", en: "Flashcards", de: "Karteikarten", it: "Flashcard", fr: "Flashcards", es: "Flashcards" },
    matching: { sq: "Bashkim", en: "Matching", de: "Zuordnung", it: "Abbinamento", fr: "Association", es: "Emparejamiento" },
    fill: { sq: "Plotësim", en: "Fill blank", de: "Lücke", it: "Completamento", fr: "Texte à trou", es: "Rellenar" },
    chooseType: { sq: "Zgjidh llojin e ushtrimit", en: "Choose exercise type", de: "Übungstyp wählen", it: "Scegli il tipo di esercizio", fr: "Choisissez le type d'exercice", es: "Elige el tipo de ejercicio" },
    finalScore: { sq: "Rezultati përfundimtar", en: "Final score", de: "Endergebnis", it: "Punteggio finale", fr: "Score final", es: "Puntuación final" },
    greatJob: { sq: "Punë e shkëlqyer!", en: "Great job!", de: "Großartig!", it: "Ottimo lavoro!", fr: "Excellent travail !", es: "¡Gran trabajo!" },
    keepGoing: { sq: "Vazhdo kështu!", en: "Keep going!", de: "Mach weiter so!", it: "Continua così!", fr: "Continuez !", es: "¡Sigue así!" },
    noExercises: { sq: "Nuk ka ushtrime ende", en: "No exercises yet", de: "Noch keine Übungen", it: "Nessun esercizio ancora", fr: "Pas encore d'exercices", es: "Aún no hay ejercicios" },
  },

  // Progress
  progress: {
    title: { sq: "Progresi im", en: "My progress", de: "Mein Fortschritt", it: "I miei progressi", fr: "Ma progression", es: "Mi progreso" },
    subtitle: { sq: "Ndjek zhvillimin tënd në mësimin e shqipes", en: "Track your development in learning Albanian", de: "Verfolge deine Entwicklung im Albanischlernen", it: "Monitora il tuo sviluppo nell'apprendimento dell'albanese", fr: "Suivez votre développement dans l'apprentissage de l'albanais", es: "Rastrea tu desarrollo en el aprendizaje del albanés" },
    totalXp: { sq: "XP totale", en: "Total XP", de: "Gesamt-XP", it: "XP totale", fr: "XP total", es: "XP total" },
    streak: { sq: "Seri ditore", en: "Day streak", de: "Tagesserie", it: "Serie di giorni", fr: "Série de jours", es: "Racha de días" },
    lessonsCompleted: { sq: "Mësime të përfunduara", en: "Lessons completed", de: "Abgeschlossene Lektionen", it: "Lezioni completate", fr: "Leçons terminées", es: "Lecciones completadas" },
    wordsLearned: { sq: "Fjalë të mësuara", en: "Words learned", de: "Gelernte Wörter", it: "Parole imparate", fr: "Mots appris", es: "Palabras aprendidas" },
    weeklyActivity: { sq: "Aktiviteti javor", en: "Weekly activity", de: "Wöchentliche Aktivität", it: "Attività settimanale", fr: "Activité hebdomadaire", es: "Actividad semanal" },
    byCategory: { sq: "Progresi sipas kategorisë", en: "Progress by category", de: "Fortschritt nach Kategorie", it: "Progressi per categoria", fr: "Progression par catégorie", es: "Progreso por categoría" },
    achievements: { sq: "Arritje", en: "Achievements", de: "Erfolge", it: "Traguardi", fr: "Réussites", es: "Logros" },
    noAchievements: { sq: "Asnjë arritje ende. Fillo të mësosh!", en: "No achievements yet. Start learning!", de: "Noch keine Erfolge. Fang an zu lernen!", it: "Nessun traguardo ancora. Inizia a imparare!", fr: "Pas encore de réussites. Commencez à apprendre !", es: "Aún no hay logros. ¡Empieza a aprender!" },
    day: { sq: "ditë", en: "days", de: "Tage", it: "giorni", fr: "jours", es: "días" },
  },

  // Certificate
  certificate: {
    title: { sq: "Certifikatat", en: "Certificates", de: "Zertifikate", it: "Certificati", fr: "Certificats", es: "Certificados" },
    subtitle: { sq: "Certifikatat e tua për mësimet e përfunduara", en: "Your certificates for completed lessons", de: "Deine Zertifikate für abgeschlossene Lektionen", it: "I tuoi certificati per le lezioni completate", fr: "Vos certificats pour les leçons terminées", es: "Tus certificados para lecciones completadas" },
    none: { sq: "Nuk ke asnjë certifikatë ende. Përfundo një mësim për të fituar të parën!", en: "You don't have any certificates yet. Complete a lesson to earn your first!", de: "Du hast noch keine Zertifikate. Schließe eine Lektion ab für dein erstes!", it: "Non hai ancora certificati. Completa una lezione per ottenere il primo!", fr: "Vous n'avez pas encore de certificat. Terminez une leçon pour obtenir le premier !", es: "Aún no tienes certificados. ¡Completa una lección para obtener el primero!" },
    download: { sq: "Shkarko", en: "Download", de: "Herunterladen", it: "Scarica", fr: "Télécharger", es: "Descargar" },
    issuedTo: { sq: "Lëshuar për", en: "Issued to", de: "Ausgestellt für", it: "Rilasciato a", fr: "Délivré à", es: "Emitido a" },
    lesson: { sq: "Mësimi", en: "Lesson", de: "Lektion", it: "Lezione", fr: "Leçon", es: "Lección" },
    date: { sq: "Data", en: "Date", de: "Datum", it: "Data", fr: "Date", es: "Fecha" },
    congrats: { sq: "Urime! Ke fituar një certifikatë.", en: "Congratulations! You've earned a certificate.", de: "Glückwunsch! Du hast ein Zertifikat erhalten.", it: "Congratulazioni! Hai ottenuto un certificato.", fr: "Félicitations ! Vous avez obtenu un certificat.", es: "¡Felicidades! Has obtenido un certificado." },
    certificateOf: { sq: "Certifikatë e Plotësimit", en: "Certificate of Completion", de: "Zertifikat über den Abschluss", it: "Certificato di Completamento", fr: "Certificat d'Achèvement", es: "Certificado de Finalización" },
    presented: { sq: "i/e cila i është dhënë", en: "presented to", de: "verliehen an", it: "presentato a", fr: "présenté à", es: "presentado a" },
    completedLesson: { sq: "për përfundimin me sukses të mësimit", en: "for successfully completing the lesson", de: "für den erfolgreichen Abschluss der Lektion", it: "per aver completato con successo la lezione", fr: "pour avoir terminé avec succès la leçon", es: "por completar con éxito la lección" },
    score: { sq: "Rezultat", en: "Score", de: "Ergebnis", it: "Punteggio", fr: "Score", es: "Puntuación" },
    code: { sq: "Kodi", en: "Code", de: "Code", it: "Codice", fr: "Code", es: "Código" },
  },

  // Admin
  admin: {
    title: { sq: "Paneli i administrimit", en: "Admin panel", de: "Admin-Panel", it: "Pannello admin", fr: "Panneau d'administration", es: "Panel de administración" },
    subtitle: { sq: "Menaxho mësimet, fjalorin dhe përmbajtjen", en: "Manage lessons, dictionary and content", de: "Lektionen, Wörterbuch und Inhalte verwalten", it: "Gestisci lezioni, dizionario e contenuti", fr: "Gérer leçons, dictionnaire et contenu", es: "Administra lecciones, diccionario y contenido" },
    manageLessons: { sq: "Menaxho mësimet", en: "Manage lessons", de: "Lektionen verwalten", it: "Gestisci lezioni", fr: "Gérer les leçons", es: "Gestionar lecciones" },
    manageDictionary: { sq: "Menaxho fjalorin", en: "Manage dictionary", de: "Wörterbuch verwalten", it: "Gestisci dizionario", fr: "Gérer le dictionnaire", es: "Gestionar diccionario" },
    addLesson: { sq: "Shto mësim", en: "Add lesson", de: "Lektion hinzufügen", it: "Aggiungi lezione", fr: "Ajouter une leçon", es: "Añadir lección" },
    addWord: { sq: "Shto fjalë", en: "Add word", de: "Wort hinzufügen", it: "Aggiungi parola", fr: "Ajouter un mot", es: "Añadir palabra" },
    lessonTitle: { sq: "Titulli i mësimit", en: "Lesson title", de: "Lektionstitel", it: "Titolo lezione", fr: "Titre de la leçon", es: "Título de la lección" },
    summary: { sq: "Përmbledhje", en: "Summary", de: "Zusammenfassung", it: "Riepilogo", fr: "Résumé", es: "Resumen" },
    content: { sq: "Përmbajtja", en: "Content", de: "Inhalt", it: "Contenuto", fr: "Contenu", es: "Contenido" },
    difficulty: { sq: "Niveli", en: "Difficulty", de: "Niveau", it: "Livello", fr: "Niveau", es: "Nivel" },
    category: { sq: "Kategoria", en: "Category", de: "Kategorie", it: "Categoria", fr: "Catégorie", es: "Categoría" },
    emoji: { sq: "Emoji", en: "Emoji", de: "Emoji", it: "Emoji", fr: "Emoji", es: "Emoji" },
    publish: { sq: "Publiko", en: "Publish", de: "Veröffentlichen", it: "Pubblica", fr: "Publier", es: "Publicar" },
    published: { sq: "Publikuar", en: "Published", de: "Veröffentlicht", it: "Pubblicato", fr: "Publié", es: "Publicado" },
    draft: { sq: "Skicë", en: "Draft", de: "Entwurf", it: "Bozza", fr: "Brouillon", es: "Borrador" },
    word: { sq: "Fjala (shqip)", en: "Word (Albanian)", de: "Wort (Albanisch)", it: "Parola (albanese)", fr: "Mot (albanais)", es: "Palabra (albanés)" },
    pronunciation: { sq: "Shqiptimi", en: "Pronunciation", de: "Aussprache", it: "Pronuncia", fr: "Prononciation", es: "Pronunciación" },
    translations: { sq: "Përkthimet", en: "Translations", de: "Übersetzungen", it: "Traduzioni", fr: "Traductions", es: "Traducciones" },
    example: { sq: "Shembull", en: "Example", de: "Beispiel", it: "Esempio", fr: "Exemple", es: "Ejemplo" },
    deleteConfirm: { sq: "A je i sigurt që dëshiron ta fshish?", en: "Are you sure you want to delete?", de: "Möchtest du wirklich löschen?", it: "Sei sicuro di voler eliminare?", fr: "Voulez-vous vraiment supprimer ?", es: "¿Seguro que quieres eliminar?" },
    saved: { sq: "U ruajt me sukses", en: "Saved successfully", de: "Erfolgreich gespeichert", it: "Salvato con successo", fr: "Enregistré avec succès", es: "Guardado con éxito" },
    deleted: { sq: "U fshi me sukses", en: "Deleted successfully", de: "Erfolgreich gelöscht", it: "Eliminato con successo", fr: "Supprimé avec succès", es: "Eliminado con éxito" },
    totalLessons: { sq: "Gjithsej mësime", en: "Total lessons", de: "Lektionen gesamt", it: "Lezioni totali", fr: "Leçons totales", es: "Lecciones totales" },
    totalWords: { sq: "Gjithsej fjalë", en: "Total words", de: "Wörter gesamt", it: "Parole totali", fr: "Mots totaux", es: "Palabras totales" },
  },

  // AI Studio
  ai: {
    title: { sq: "AI Studio", en: "AI Studio", de: "KI-Studio", it: "AI Studio", fr: "Studio IA", es: "Estudio IA" },
    subtitle: { sq: "Përdor inteligjencën artificiale për të krijuar materiale edukative", en: "Use AI to create educational materials", de: "Nutze KI, um Lernmaterial zu erstellen", it: "Usa l'IA per creare materiali educativi", fr: "Utilisez l'IA pour créer du matériel éducatif", es: "Usa IA para crear materiales educativos" },
    generateLesson: { sq: "Gjenero mësim", en: "Generate lesson", de: "Lektion generieren", it: "Genera lezione", fr: "Générer une leçon", es: "Generar lección" },
    generateQuiz: { sq: "Gjenero kuiz", en: "Generate quiz", de: "Quiz generieren", it: "Genera quiz", fr: "Générer un quiz", es: "Generar cuestionario" },
    generateWord: { sq: "Gjenero fjalë", en: "Generate word", de: "Wort generieren", it: "Genera parola", fr: "Générer un mot", es: "Generar palabra" },
    aiTutor: { sq: "Tutori AI", en: "AI Tutor", de: "KI-Tutor", it: "Tutor IA", fr: "Tuteur IA", es: "Tutor IA" },
    topic: { sq: "Tema", en: "Topic", de: "Thema", it: "Argomento", fr: "Sujet", es: "Tema" },
    topicPlaceholder: { sq: "p.sh. Numrat, Ngjyrat, Familja...", en: "e.g. Numbers, Colors, Family...", de: "z.B. Zahlen, Farben, Familie...", it: "es. Numeri, Colori, Famiglia...", fr: "ex. Nombres, Couleurs, Famille...", es: "ej. Números, Colores, Familia..." },
    outputLang: { sq: "Gjuha e nxënësit", en: "Learner language", de: "Lernersprache", it: "Lingua dello studente", fr: "Langue de l'apprenant", es: "Idioma del estudiante" },
    generate: { sq: "Gjenero", en: "Generate", de: "Generieren", it: "Genera", fr: "Générer", es: "Generar" },
    generating: { sq: "Po gjenerohet...", en: "Generating...", de: "Generiert...", it: "Generazione...", fr: "Génération...", es: "Generando..." },
    askTutor: { sq: "Pyet tutorin", en: "Ask the tutor", de: "Frag den Tutor", it: "Chiedi al tutor", fr: "Posez une question", es: "Pregunta al tutor" },
    tutorPlaceholder: { sq: "Shkruaj pyetjen tënde për shqipen...", en: "Type your question about Albanian...", de: "Stelle deine Frage zum Albanischen...", it: "Scrivi la tua domanda sull'albanese...", fr: "Posez votre question sur l'albanais...", es: "Escribe tu pregunta sobre el albanés..." },
    addLessonToCatalog: { sq: "Shto në katalog", en: "Add to catalog", de: "Zum Katalog hinzufügen", it: "Aggiungi al catalogo", fr: "Ajouter au catalogue", es: "Añadir al catálogo" },
    addWordToDict: { sq: "Shto në fjalor", en: "Add to dictionary", de: "Zum Wörterbuch hinzufügen", it: "Aggiungi al dizionario", fr: "Ajouter au dictionnaire", es: "Añadir al diccionario" },
    tutorIntro: { sq: "Përshëndetje! Jam tutori yt AI për shqipen. Pyes çdo gjë!", en: "Hello! I'm your AI Albanian tutor. Ask me anything!", de: "Hallo! Ich bin dein KI-Albanisch-Tutor. Frag mich alles!", it: "Ciao! Sono il tuo tutor IA di albanese. Chiedimi qualsiasi cosa!", fr: "Bonjour ! Je suis votre tuteur IA d'albanais. Posez-moi vos questions !", es: "¡Hola! Soy tu tutor de IA de albanés. ¡Pregúntame lo que sea!" },
    error: { sq: "Diçka shkoi keq. Provo përsëri.", en: "Something went wrong. Try again.", de: "Etwas ist schiefgelaufen. Versuche es erneut.", it: "Qualcosa è andato storto. Riprova.", fr: "Une erreur s'est produite. Réessayez.", es: "Algo salió mal. Inténtalo de nuevo." },
    suggestions: { sq: "Sugjerime", en: "Suggestions", de: "Vorschläge", it: "Suggerimenti", fr: "Suggestions", es: "Sugerencias" },
  },

  // Footer
  footer: {
    tagline: { sq: "Platforma edukative për mësimin e gjuhës shqipe për diasporën", en: "Educational platform for learning Albanian for the diaspora", de: "Bildungsplattform zum Erlernen der albanischen Sprache für die Diaspora", it: "Piattaforma educativa per l'apprendimento dell'albanese per la diaspora", fr: "Plateforme éducative d'apprentissage de l'albanais pour la diaspora", es: "Plataforma educativa para aprender albanés para la diáspora" },
    madeWith: { sq: "Krijuar me", en: "Built with", de: "Erstellt mit", it: "Creato con", fr: "Créé avec", es: "Creado con" },
    forDiaspora: { sq: "për diasporën shqiptare", en: "for the Albanian diaspora", de: "für die albanische Diaspora", it: "per la diaspora albanese", fr: "pour la diaspora albanaise", es: "para la diáspora albanesa" },
    rights: { sq: "Të gjitha të drejtat e rezervuara", en: "All rights reserved", de: "Alle Rechte vorbehalten", it: "Tutti i diritti riservati", fr: "Tous droits réservés", es: "Todos los derechos reservados" },
    quickLinks: { sq: "Lidhje të shpejta", en: "Quick links", de: "Schnelllinks", it: "Link rapidi", fr: "Liens rapides", es: "Enlaces rápidos" },
    languageLabel: { sq: "Gjuha e ndërfaqes", en: "Interface language", de: "Oberflächensprache", it: "Lingua interfaccia", fr: "Langue de l'interface", es: "Idioma de la interfaz" },
  },
} as const;

export type UIStrings = typeof UI;

// Helper to resolve a localized object safely
export function t<L extends LangCode>(obj: Record<LangCode, string> | undefined | null, lang: L): string {
  if (!obj) return "";
  return obj[lang] ?? obj[DEFAULT_LANG] ?? obj.sq ?? "";
}

export function ui<L extends LangCode>(key: keyof typeof UI, lang: L): unknown {
  return (UI[key] as Record<LangCode, unknown>)[lang];
}
