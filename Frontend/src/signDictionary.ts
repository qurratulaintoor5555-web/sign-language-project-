export interface SignDictItem {
  gloss: string;
  urdu: string;
  category: string;
  description: string;
  handPose: string;
  motionDirection: string;
}

export const SIGN_DICTIONARY: Record<string, SignDictItem> = {
  "APPLE": {
    gloss: "APPLE",
    urdu: "\u0633\u06cc\u0628 (\u067e\u06be\u0644)\u06d4",
    category: "Food & Fruit",
    description: "Apple (fruit).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Ain": {
    gloss: "Ain",
    urdu: "\u062d\u0631\u0641 \u0639\u06cc\u0646 (\u0639)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Ain (\u0639).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Aj": {
    gloss: "Aj",
    urdu: "\u0622\u062c \u06a9\u0627 \u062f\u0646 \u06c1\u06d2 \u062c\u0633 \u06a9\u06cc \u0628\u0627\u062a \u06c1\u0648\u0626\u06cc \u062a\u06be\u06cc\u06d4",
    category: "Time / Calendar",
    description: "Today is the day we planned.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Alif": {
    gloss: "Alif",
    urdu: "\u062d\u0631\u0641 \u0627\u0644\u0641 (\u0627)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Alif (\u0627).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Allah": {
    gloss: "Allah",
    urdu: "\u0627\u0644\u0644\u06c1 \u062a\u0639\u0627\u0644\u06cc\u0670\u060c \u0627\u0644\u0644\u06c1 \u0622\u067e \u067e\u0631 \u0631\u062d\u0645\u062a \u0641\u0631\u0645\u0627\u0626\u06d2\u06d4",
    category: "Religious / Blessings",
    description: "Allah (God). May Allah bless you.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Allama Iqbal": {
    gloss: "Allama Iqbal",
    urdu: "\u0639\u0644\u0627\u0645\u06c1 \u0645\u062d\u0645\u062f \u0627\u0642\u0628\u0627\u0644 (\u0642\u0648\u0645\u06cc \u0634\u0627\u0639\u0631)\u06d4",
    category: "Personalities",
    description: "Allama Muhammad Iqbal (National Poet).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Ap": {
    gloss: "Ap",
    urdu: "\u0622\u067e\u060c \u0622\u067e \u06a9\u06cc\u0633\u06d2 \u06c1\u06cc\u06ba\u061f",
    category: "Pronoun",
    description: "You (respectful form). How are you?",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Apki": {
    gloss: "Apki",
    urdu: "\u0622\u067e \u06a9\u06cc / \u06cc\u06c1 \u0686\u06cc\u0632 \u0622\u067e \u06a9\u06cc \u06c1\u06d2\u06d4",
    category: "Pronoun",
    description: "Yours. This belongs to you.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Assalamulaikum": {
    gloss: "Assalamulaikum",
    urdu: "\u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u06cc\u06a9\u0645! \u0622\u067e \u067e\u0631 \u0633\u0644\u0627\u0645\u062a\u06cc \u06c1\u0648\u06d4",
    category: "Greeting",
    description: "Assalam-o-Alaikum! Peace be upon you.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Baad may": {
    gloss: "Baad may",
    urdu: "\u0628\u0639\u062f \u0645\u06cc\u06ba / \u06c1\u0645 \u06a9\u0686\u06be \u062f\u06cc\u0631 \u0628\u0639\u062f \u0628\u0627\u062a \u06a9\u0631\u06cc\u06ba \u06af\u06d2\u06d4",
    category: "Time",
    description: "Later / We will talk after some time.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Bachay": {
    gloss: "Bachay",
    urdu: "\u0628\u0686\u06d2 / \u0628\u0686\u06d2 \u06a9\u06be\u06cc\u0644 \u0631\u06c1\u06d2 \u06c1\u06cc\u06ba\u06d4",
    category: "Family & People",
    description: "Children / The kids are playing.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Barai Mehrbani": {
    gloss: "Barai Mehrbani",
    urdu: "\u0628\u0631\u0627\u0626\u06d2 \u0645\u06c1\u0631\u0628\u0627\u0646\u06cc \u0645\u06cc\u0631\u06cc \u0627\u0633 \u0645\u06cc\u06ba \u0645\u062f\u062f \u06a9\u0631\u06cc\u06ba\u06d4",
    category: "Polite Request",
    description: "Please / Kindly help me with this.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Bay": {
    gloss: "Bay",
    urdu: "\u062d\u0631\u0641 \u0628\u06d2 (\u0628)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Bay (\u0628).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Behra": {
    gloss: "Behra",
    urdu: "\u0628\u06c1\u0631\u0627 / \u0633\u0645\u0627\u0639\u062a \u0633\u06d2 \u0645\u062d\u0631\u0648\u0645 \u0634\u062e\u0635\u06d4",
    category: "Identity & Community",
    description: "Deaf / Hard-of-hearing person.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Bemar": {
    gloss: "Bemar",
    urdu: "\u0645\u06cc\u06ba \u0628\u06cc\u0645\u0627\u0631 \u06c1\u0648\u06ba\u060c \u0645\u06cc\u0631\u06cc \u0637\u0628\u06cc\u0639\u062a \u0679\u06be\u06cc\u06a9 \u0646\u06c1\u06cc\u06ba\u06d4",
    category: "Medical / Health",
    description: "I am feeling sick / unwell.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Chay": {
    gloss: "Chay",
    urdu: "\u062d\u0631\u0641 \u0686\u06d2 (\u0686)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Chay (\u0686).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Cherry": {
    gloss: "Cherry",
    urdu: "\u0686\u06cc\u0631\u06cc (\u067e\u06be\u0644)\u06d4",
    category: "Food & Fruit",
    description: "Cherry (fruit).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Choti-ye": {
    gloss: "Choti-ye",
    urdu: "\u062d\u0631\u0641 \u0686\u06be\u0648\u0679\u06cc \u06cc\u06d2 (\u06cc)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Choti Ye (\u06cc).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Cuckoo": {
    gloss: "Cuckoo",
    urdu: "\u06a9\u0648\u0626\u0644 (\u067e\u0631\u0646\u062f\u06c1)\u06d4",
    category: "Animals & Birds",
    description: "Cuckoo bird.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Dal": {
    gloss: "Dal",
    urdu: "\u062d\u0631\u0641 \u062f\u0627\u0644 (\u062f)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Dal (\u062f).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Ddal": {
    gloss: "Ddal",
    urdu: "\u062d\u0631\u0641 \u0688\u0627\u0644 (\u0688)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Daal (\u0688).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Duck": {
    gloss: "Duck",
    urdu: "\u0628\u0637\u062e (\u067e\u0631\u0646\u062f\u06c1)\u06d4",
    category: "Animals & Birds",
    description: "Duck (water bird).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Dur hai": {
    gloss: "Dur hai",
    urdu: "\u062f\u0648\u0631 \u06c1\u06d2 / \u0641\u0627\u0635\u0644\u06d2 \u067e\u0631 \u06c1\u06d2\u06d4",
    category: "Direction / Distance",
    description: "It is far away / distant location.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Eagle": {
    gloss: "Eagle",
    urdu: "\u0639\u0642\u0627\u0628 / \u0634\u0627\u06c1\u06cc\u0646\u06d4",
    category: "Animals & Birds",
    description: "Eagle / Shaheen.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Email Address": {
    gloss: "Email Address",
    urdu: "\u0627\u067e\u0646\u0627 \u0627\u06cc \u0645\u06cc\u0644 \u0627\u06cc\u0688\u0631\u06cc\u0633 \u0641\u0631\u0627\u06c1\u0645 \u06a9\u06cc\u062c\u06cc\u06d2\u06d4",
    category: "Technology",
    description: "Please provide your email address.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Falcon": {
    gloss: "Falcon",
    urdu: "\u0628\u0627\u0632 (\u0634\u06a9\u0627\u0631\u06cc \u067e\u0631\u0646\u062f\u06c1)\u06d4",
    category: "Animals & Birds",
    description: "Falcon / Bird of prey.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Fay": {
    gloss: "Fay",
    urdu: "\u062d\u0631\u0641 \u0641\u06d2 (\u0641)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Fay (\u0641).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Fig": {
    gloss: "Fig",
    urdu: "\u0627\u0646\u062c\u06cc\u0631 (\u067e\u06be\u0644)\u06d4",
    category: "Food & Fruit",
    description: "Fig (fruit) / Injeer.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Firaun": {
    gloss: "Firaun",
    urdu: "\u0641\u0631\u0639\u0648\u0646 (\u062a\u0627\u0631\u06cc\u062e\u06cc \u0634\u062e\u0635\u06cc\u062a)\u06d4",
    category: "History",
    description: "Pharaoh / Historic ruler.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "G Han": {
    gloss: "G Han",
    urdu: "\u062c\u06cc \u06c1\u0627\u06ba\u060c \u0628\u0627\u0644\u06a9\u0644! \u0645\u06cc\u06ba \u0645\u062a\u0641\u0642 \u06c1\u0648\u06ba\u06d4",
    category: "Confirmation",
    description: "Yes, exactly! I agree completely.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Gaaf": {
    gloss: "Gaaf",
    urdu: "\u062d\u0631\u0641 \u06af\u0627\u0641 (\u06af)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Gaaf (\u06af).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Genghis Khan": {
    gloss: "Genghis Khan",
    urdu: "\u0686\u0646\u06af\u06cc\u0632 \u062e\u0627\u0646\u06d4",
    category: "History",
    description: "Genghis Khan.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Ghain": {
    gloss: "Ghain",
    urdu: "\u062d\u0631\u0641 \u063a\u06cc\u0646 (\u063a)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Ghain (\u063a).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Guava": {
    gloss: "Guava",
    urdu: "\u0627\u0645\u0631\u0648\u062f (\u067e\u06be\u0644)\u06d4",
    category: "Food & Fruit",
    description: "Guava (fruit) / Amrood.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Hain": {
    gloss: "Hain",
    urdu: "\u06c1\u06cc\u06ba / \u0645\u0648\u062c\u0648\u062f \u06c1\u06cc\u06ba\u06d4",
    category: "Grammar",
    description: "Are / Plural or respectful auxiliary.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Hamza": {
    gloss: "Hamza",
    urdu: "\u062d\u0631\u0641 \u06c1\u0645\u0632\u06c1 (\u0621)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Hamza (\u0621).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Hay": {
    gloss: "Hay",
    urdu: "\u062d\u0631\u0641 \u062d\u06d2 (\u062d)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Hay (\u062d).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "He": {
    gloss: "He",
    urdu: "\u062d\u0631\u0641 \u06af\u0648\u0644 \u06c1\u06d2 (\u06c1)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter He (\u06c1).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Iski": {
    gloss: "Iski",
    urdu: "\u0627\u0633 \u06a9\u06cc / \u0627\u0633 \u06a9\u0627\u06d4",
    category: "Pronoun",
    description: "His / Hers / Its (possessive).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Jao": {
    gloss: "Jao",
    urdu: "\u062c\u0627\u0624 / \u0627\u0628 \u0622\u067e \u062c\u0627 \u0633\u06a9\u062a\u06d2 \u06c1\u06cc\u06ba\u06d4",
    category: "Direction",
    description: "Go ahead / You may leave now.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Jeem": {
    gloss: "Jeem",
    urdu: "\u062d\u0631\u0641 \u062c\u06cc\u0645 (\u062c)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Jeem (\u062c).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Kaaf": {
    gloss: "Kaaf",
    urdu: "\u062d\u0631\u0641 \u06a9\u0627\u0641 (\u06a9)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Kaaf (\u06a9).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Kab": {
    gloss: "Kab",
    urdu: "\u06a9\u0628\u061f \u06cc\u06c1 \u06a9\u0633 \u0648\u0642\u062a \u06c1\u0648\u06af\u0627\u061f",
    category: "Question",
    description: "When? At what time will this happen?",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Kesay": {
    gloss: "Kesay",
    urdu: "\u06a9\u06cc\u0633\u06d2\u061f \u06cc\u06c1 \u06a9\u06cc\u0633\u06d2 \u0645\u0645\u06a9\u0646 \u06c1\u06d2\u061f",
    category: "Question",
    description: "How? In what manner can we do this?",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Khay": {
    gloss: "Khay",
    urdu: "\u062d\u0631\u0641 \u062e\u06d2 (\u062e)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Khay (\u062e).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Kya qeemat hai": {
    gloss: "Kya qeemat hai",
    urdu: "\u06a9\u06cc\u0627 \u0642\u06cc\u0645\u062a \u06c1\u06d2\u061f \u06cc\u06c1 \u06a9\u062a\u0646\u06d2 \u06a9\u0627 \u06c1\u06d2\u061f",
    category: "Shopping / Commerce",
    description: "How much does this cost? What is the price?",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Laam": {
    gloss: "Laam",
    urdu: "\u062d\u0631\u0641 \u0644\u0627\u0645 (\u0644)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Laam (\u0644).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Lord Mountbatten": {
    gloss: "Lord Mountbatten",
    urdu: "\u0644\u0627\u0631\u0688 \u0645\u0627\u0624\u0646\u0679 \u0628\u06cc\u0679\u0646\u06d4",
    category: "History",
    description: "Lord Mountbatten.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Mahatma Gandhi": {
    gloss: "Mahatma Gandhi",
    urdu: "\u0645\u06c1\u0627\u062a\u0645\u0627 \u06af\u0627\u0646\u062f\u06be\u06cc\u06d4",
    category: "History",
    description: "Mahatma Gandhi.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Mahsoos kar rahay": {
    gloss: "Mahsoos kar rahay",
    urdu: "\u06a9\u06cc\u0627 \u0645\u062d\u0633\u0648\u0633 \u06a9\u0631 \u0631\u06c1\u06d2 \u06c1\u06cc\u06ba\u061f \u0622\u067e \u06a9\u06cc\u0633\u0627 \u0645\u062d\u0633\u0648\u0633 \u06a9\u0631 \u0631\u06c1\u06d2 \u06c1\u06cc\u06ba\u061f",
    category: "Feelings",
    description: "Are you feeling okay? What do you sense?",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Meem": {
    gloss: "Meem",
    urdu: "\u062d\u0631\u0641 \u0645\u06cc\u0645 (\u0645)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Meem (\u0645).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Muhammad Ali Jinnah": {
    gloss: "Muhammad Ali Jinnah",
    urdu: "\u0628\u0627\u0628\u0627\u0626\u06d2 \u0642\u0648\u0645 \u0642\u0627\u0626\u062f \u0627\u0639\u0638\u0645 \u0645\u062d\u0645\u062f \u0639\u0644\u06cc \u062c\u0646\u0627\u062d\u06d4",
    category: "Personalities",
    description: "Quaid-e-Azam Muhammad Ali Jinnah.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Muhammad Bin Qasim": {
    gloss: "Muhammad Bin Qasim",
    urdu: "\u0645\u062d\u0645\u062f \u0628\u0646 \u0642\u0627\u0633\u0645\u06d4",
    category: "History",
    description: "Muhammad Bin Qasim.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Mujhay": {
    gloss: "Mujhay",
    urdu: "\u0645\u062c\u06be\u06d2\u060c \u06cc\u06c1 \u0645\u062c\u06be\u06d2 \u062f\u0631\u06a9\u0627\u0631 \u06c1\u06d2\u06d4",
    category: "Pronoun",
    description: "To me / I need this.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Nahi hai": {
    gloss: "Nahi hai",
    urdu: "\u0646\u06c1\u06cc\u06ba \u06c1\u06d2 / \u0645\u06cc\u0631\u06d2 \u067e\u0627\u0633 \u0646\u06c1\u06cc\u06ba \u06c1\u06d2\u06d4",
    category: "Negation",
    description: "No, not available / I do not have it.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Noon": {
    gloss: "Noon",
    urdu: "\u062d\u0631\u0641 \u0646\u0648\u0646 (\u0646)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Noon (\u0646).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Pay": {
    gloss: "Pay",
    urdu: "\u062d\u0631\u0641 \u067e\u06d2 (\u067e)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Pay (\u067e).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Peach": {
    gloss: "Peach",
    urdu: "\u0622\u0691\u0648 (\u067e\u06be\u0644)\u06d4",
    category: "Food & Fruit",
    description: "Peach (fruit) / Aarrhu.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Penguin": {
    gloss: "Penguin",
    urdu: "\u067e\u06cc\u0646\u06af\u0648\u0626\u0646 (\u067e\u0631\u0646\u062f\u06c1)\u06d4",
    category: "Animals & Birds",
    description: "Penguin (bird).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Pigeon": {
    gloss: "Pigeon",
    urdu: "\u06a9\u0628\u0648\u062a\u0631 (\u067e\u0631\u0646\u062f\u06c1)\u06d4",
    category: "Animals & Birds",
    description: "Pigeon / Dove (Kabootar).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Pineapple": {
    gloss: "Pineapple",
    urdu: "\u0627\u0646\u0646\u0627\u0633 (\u067e\u06be\u0644)\u06d4",
    category: "Food & Fruit",
    description: "Pineapple (fruit) / Ananas.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Qaaf": {
    gloss: "Qaaf",
    urdu: "\u062d\u0631\u0641 \u0642\u0627\u0641 (\u0642)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Qaaf (\u0642).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Ray": {
    gloss: "Ray",
    urdu: "\u062d\u0631\u0641 \u0631\u06d2 (\u0631)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Ray (\u0631).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Samjhna": {
    gloss: "Samjhna",
    urdu: "\u0633\u0645\u062c\u06be\u0646\u0627 / \u0645\u06cc\u06ba \u0622\u067e \u06a9\u06cc \u0628\u0627\u062a \u0633\u0645\u062c\u06be \u06af\u06cc\u0627 \u06c1\u0648\u06ba\u06d4",
    category: "Communication",
    description: "I understand what you are communicating.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Say": {
    gloss: "Say",
    urdu: "\u062d\u0631\u0641 \u062b\u06d2 (\u062b)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Say (\u062b).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Seekh raha hun": {
    gloss: "Seekh raha hun",
    urdu: "\u0645\u06cc\u06ba \u0627\u0634\u0627\u0631\u0648\u06ba \u06a9\u06cc \u0632\u0628\u0627\u0646 \u0633\u06cc\u06a9\u06be \u0631\u06c1\u0627 \u06c1\u0648\u06ba\u06d4",
    category: "Learning",
    description: "I am currently learning Pakistan Sign Language.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Sheen": {
    gloss: "Sheen",
    urdu: "\u062d\u0631\u0641 \u0634\u06cc\u0646 (\u0634)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Sheen (\u0634).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Shirt dhona hai": {
    gloss: "Shirt dhona hai",
    urdu: "\u0642\u0645\u06cc\u0636 \u062f\u06be\u0648\u0646\u0627 \u06c1\u06d2 / \u06a9\u067e\u0691\u06d2 \u062f\u06be\u0648\u0646\u06d2 \u06c1\u06cc\u06ba\u06d4",
    category: "Daily Life",
    description: "Need to wash the shirt / Laundry clothes.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Sikander-e-Azam": {
    gloss: "Sikander-e-Azam",
    urdu: "\u0633\u06a9\u0646\u062f\u0631 \u0627\u0639\u0638\u0645\u06d4",
    category: "History",
    description: "Alexander the Great (Sikander-e-Azam).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Tay": {
    gloss: "Tay",
    urdu: "\u062d\u0631\u0641 \u062a\u06d2 (\u062a)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Tay (\u062a).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Toain": {
    gloss: "Toain",
    urdu: "\u062d\u0631\u0641 \u0637\u0648\u0626\u06d2 (\u0637)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Toain (\u0637).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Ttay": {
    gloss: "Ttay",
    urdu: "\u062d\u0631\u0641 \u0679\u06d2 (\u0679)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Ttay (\u0679).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Walaikumasalam": {
    gloss: "Walaikumasalam",
    urdu: "\u0648\u0639\u0644\u06cc\u06a9\u0645 \u0627\u0644\u0633\u0644\u0627\u0645! \u0627\u0648\u0631 \u0622\u067e \u067e\u0631 \u0628\u06be\u06cc \u0633\u0644\u0627\u0645\u062a\u06cc \u06c1\u0648\u06d4",
    category: "Greeting",
    description: "Wa Alaikum Assalam! And upon you be peace.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Wao": {
    gloss: "Wao",
    urdu: "\u062d\u0631\u0641 \u0648\u0627\u0624 (\u0648)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Wao (\u0648).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Watermelon": {
    gloss: "Watermelon",
    urdu: "\u062a\u0631\u0628\u0648\u0632 (\u067e\u06be\u0644)\u06d4",
    category: "Food & Fruit",
    description: "Watermelon (fruit).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Woodpecker": {
    gloss: "Woodpecker",
    urdu: "\u06c1\u062f\u06c1\u062f / \u06a9\u0679\u06be \u067e\u06be\u0648\u0691\u0627\u06d4",
    category: "Animals & Birds",
    description: "Woodpecker bird.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Yaqeen": {
    gloss: "Yaqeen",
    urdu: "\u06cc\u0642\u06cc\u0646 / \u0645\u062c\u06be\u06d2 \u0627\u0633 \u067e\u0631 \u067e\u0648\u0631\u0627 \u0628\u06be\u0631\u0648\u0633\u06c1 \u06c1\u06d2\u06d4",
    category: "Belief",
    description: "I am confident / I believe and trust this.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Ye": {
    gloss: "Ye",
    urdu: "\u06cc\u06c1 / \u06cc\u06c1 \u0648\u0627\u0644\u06cc \u0686\u06cc\u0632\u06d4",
    category: "Demonstrative",
    description: "This one right here.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Zal": {
    gloss: "Zal",
    urdu: "\u062d\u0631\u0641 \u0630\u0627\u0644 (\u0630)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Zal (\u0630).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Zoain": {
    gloss: "Zoain",
    urdu: "\u062d\u0631\u0641 \u0638\u0648\u0626\u06d2 (\u0638)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Zoain (\u0638).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Zuaad": {
    gloss: "Zuaad",
    urdu: "\u062d\u0631\u0641 \u0636\u0627\u062f (\u0636)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Zuaad (\u0636).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "Zulfiqar Ali Bhutto": {
    gloss: "Zulfiqar Ali Bhutto",
    urdu: "\u0630\u0648\u0627\u0644\u0641\u0642\u0627\u0631 \u0639\u0644\u06cc \u0628\u06be\u0679\u0648\u06d4",
    category: "Personalities",
    description: "Zulfiqar Ali Bhutto.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "bari-ye": {
    gloss: "bari-ye",
    urdu: "\u062d\u0631\u0641 \u0628\u0691\u06cc \u06cc\u06d2 (\u06d2)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Bari Ye (\u06d2).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "owl": {
    gloss: "owl",
    urdu: "\u0627\u0644\u0648 (\u067e\u0631\u0646\u062f\u06c1)\u06d4",
    category: "Animals & Birds",
    description: "Owl / Bird of wisdom.",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "parrot": {
    gloss: "parrot",
    urdu: "\u0637\u0648\u0637\u0627 (\u067e\u0631\u0646\u062f\u06c1)\u06d4",
    category: "Animals & Birds",
    description: "Parrot / Talking bird (Tota).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "rray": {
    gloss: "rray",
    urdu: "\u062d\u0631\u0641 \u0691\u06d2 (\u0691)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Rray (\u0691).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "seen": {
    gloss: "seen",
    urdu: "\u062d\u0631\u0641 \u0633\u06cc\u0646 (\u0633)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Seen (\u0633).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "suaad": {
    gloss: "suaad",
    urdu: "\u062d\u0631\u0641 \u0635\u0627\u062f (\u0635)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Suaad (\u0635).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
  "zay": {
    gloss: "zay",
    urdu: "\u062d\u0631\u0641 \u0632\u06d2 (\u0632)\u06d4",
    category: "Alphabets",
    description: "Urdu Letter Zay (\u0632).",
    handPose: "Standard PSL hand formation",
    motionDirection: "Standard sign trajectory"
  },
};

export function findMatchingSign(inputText: string): SignDictItem | null {
  const query = inputText.toLowerCase().trim();
  if (!query) return null;

  for (const item of Object.values(SIGN_DICTIONARY)) {
    if (
      item.gloss.toLowerCase() === query ||
      item.description.toLowerCase().includes(query) ||
      item.urdu.includes(query)
    ) {
      return item;
    }
  }

  for (const [key, item] of Object.entries(SIGN_DICTIONARY)) {
    const keyWords = key.toLowerCase().split(/[ _-]+/);
    if (keyWords.some(w => query.includes(w) || w.includes(query))) {
      return item;
    }
  }

  return null;
}
