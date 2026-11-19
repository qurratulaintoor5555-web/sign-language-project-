export interface SignDictItem {
  gloss: string;
  urdu: string;
  category: string;
  description: string;
  handPose: string;
  motionDirection: string;
}

export const SIGN_DICTIONARY: Record<string, SignDictItem> = {
  Assalamulaikum: {
    gloss: 'Assalamulaikum',
    urdu: 'السلام علیکم',
    category: 'Greeting',
    description: 'Raise right hand near chest/forehead with open respectful palm greeting.',
    handPose: 'Open flat palm',
    motionDirection: 'Forward and slightly downward toward partner'
  },
  Walaikumasalam: {
    gloss: 'Walaikumasalam',
    urdu: 'وعلیکم السلام',
    category: 'Greeting',
    description: 'Reciprocate peace greeting with respectful open palm toward partner.',
    handPose: 'Open right palm',
    motionDirection: 'Outward acknowledging gesture'
  },
  Allah: {
    gloss: 'Allah',
    urdu: 'اللہ تعالیٰ',
    category: 'Blessing',
    description: 'Index finger pointing upward toward the heavens with reverent posture.',
    handPose: 'Index finger vertical (Tawheed sign)',
    motionDirection: 'Upward elevation'
  },
  'Barai Mehrbani': {
    gloss: 'Barai Mehrbani',
    urdu: 'برائے مہربانی',
    category: 'Request',
    description: 'Right flat palm placed respectfully over chest / heart.',
    handPose: 'Open flat palm over sternum',
    motionDirection: 'Gentle circular motion over chest'
  },
  'G Han': {
    gloss: 'G Han',
    urdu: 'جی ہاں',
    category: 'Confirmation',
    description: 'Closed upright fist nodding affirmatively up and down at the wrist.',
    handPose: 'Closed fist',
    motionDirection: 'Vertical nod up and down'
  },
  'Nahi hai': {
    gloss: 'Nahi hai',
    urdu: 'نہیں ہے',
    category: 'Negation',
    description: 'Hand waving side to side horizontally indicating absence or disagreement.',
    handPose: 'Open flat palm facing outward',
    motionDirection: 'Horizontal left-right sweep'
  },
  Aj: {
    gloss: 'Aj',
    urdu: 'آج',
    category: 'Time',
    description: 'Both hands palms facing up moving downward sharply indicating today / present.',
    handPose: 'Bent or flat hands facing upward',
    motionDirection: 'Downward emphatic drop'
  },
  Ap: {
    gloss: 'Ap',
    urdu: 'آپ',
    category: 'Pronoun',
    description: 'Respectful index or open hand gesturing directly toward the conversation partner.',
    handPose: 'Open hand pointing forward',
    motionDirection: 'Directly toward partner'
  },
  Apki: {
    gloss: 'Apki',
    urdu: 'آپ کی',
    category: 'Pronoun',
    description: 'Open flat palm pushed gently toward the partner denoting possession.',
    handPose: 'Flat palm forward',
    motionDirection: 'Gentle outward press'
  },
  Behra: {
    gloss: 'Behra',
    urdu: 'بہرا / سماعت سے محروم',
    category: 'Community',
    description: 'Index finger touching ear then moving across mouth indicating Deaf / hard of hearing.',
    handPose: 'Index finger extended',
    motionDirection: 'Ear to mouth connection'
  },
  Bemar: {
    gloss: 'Bemar',
    urdu: 'بیمار',
    category: 'Medical',
    description: 'Middle finger bent touching forehead and chest indicating sickness / fever.',
    handPose: 'Middle finger pressed to head/chest',
    motionDirection: 'Gentle inward touch'
  },
  Jao: {
    gloss: 'Jao',
    urdu: 'جاؤ',
    category: 'Direction',
    description: 'Hand gesturing outward away from body signaling to proceed or leave.',
    handPose: 'Open fingers curving forward',
    motionDirection: 'Away from body'
  },
  Kab: {
    gloss: 'Kab',
    urdu: 'کب',
    category: 'Question',
    description: 'Index finger circling the opposite index tip or ticking like a clock.',
    handPose: 'Index finger circling',
    motionDirection: 'Circular clock motion'
  },
  Kesay: {
    gloss: 'Kesay',
    urdu: 'کیسے',
    category: 'Question',
    description: 'Both curved palms twisting upward repeatedly in an inquiring posture.',
    handPose: 'Cupped palms turning up',
    motionDirection: 'Upward rotational twist'
  },
  'Kya qeemat hai': {
    gloss: 'Kya qeemat hai',
    urdu: 'کیا قیمت ہے',
    category: 'Shopping',
    description: 'Thumb rubbing against index & middle fingertips denoting money / cost.',
    handPose: 'Fingertip money rub',
    motionDirection: 'Fingertip slide'
  },
  'Mahsoos kar rahay': {
    gloss: 'Mahsoos kar rahay',
    urdu: 'محسوس کر رہے ہیں',
    category: 'Feelings',
    description: 'Middle finger brush upward against center of chest.',
    handPose: 'Open hand with middle finger bent inward',
    motionDirection: 'Upward gentle stroke on chest'
  },
  Mujhay: {
    gloss: 'Mujhay',
    urdu: 'مجھے',
    category: 'Pronoun',
    description: 'Index finger pointed directly inward toward center of own chest.',
    handPose: 'Index finger pointed at self',
    motionDirection: 'Inward touch'
  },
  Samjhna: {
    gloss: 'Samjhna',
    urdu: 'سمجھنا',
    category: 'Communication',
    description: 'Index finger flicking up from fist near forehead indicating understanding (lightbulb effect).',
    handPose: 'Fist flicking into index finger at temple',
    motionDirection: 'Upward snap near temple'
  },
  'Seekh raha hun': {
    gloss: 'Seekh raha hun',
    urdu: 'سیکھ رہا ہوں',
    category: 'Learning',
    description: 'Fingertips take information from open palm and place it onto forehead.',
    handPose: 'Fingertips gathering and touching forehead',
    motionDirection: 'Palm to forehead lift'
  },
  Yaqeen: {
    gloss: 'Yaqeen',
    urdu: 'یقین',
    category: 'Belief',
    description: 'Index touches forehead then clasps firmly into opposite palm.',
    handPose: 'Forehead touch to firm palm clasp',
    motionDirection: 'Head to two-handed clasp'
  },
  Ye: {
    gloss: 'Ye',
    urdu: 'یہ',
    category: 'Demonstrative',
    description: 'Index finger pointed downward firmly at immediate nearby object.',
    handPose: 'Index finger pointing down',
    motionDirection: 'Downward gesture'
  },
  APPLE: {
    gloss: 'APPLE',
    urdu: 'سیب',
    category: 'Food',
    description: 'Knuckle of index finger twisted into cheek resembling a dimple/apple bite.',
    handPose: 'Curved knuckle on cheek',
    motionDirection: 'Twisting into cheek'
  },
  Watermelon: {
    gloss: 'Watermelon',
    urdu: 'تربوز',
    category: 'Food',
    description: 'Two hands holding a wedge and mimicking biting across it.',
    handPose: 'Curved two-handed grip',
    motionDirection: 'Left-to-right biting motion'
  },
  'Email Address': {
    gloss: 'Email Address',
    urdu: 'ای میل',
    category: 'Technology',
    description: 'Hand miming @ circular symbol in the air.',
    handPose: 'Index finger tracing @ in air',
    motionDirection: 'Circular looping trace'
  },
  'Baad may': {
    gloss: 'Baad may',
    urdu: 'بعد میں',
    category: 'Time',
    description: 'Right hand thumb and index forming a clock hand rotating forward.',
    handPose: 'L-shape hand rotating',
    motionDirection: 'Forward arc rotation'
  },
  Bachay: {
    gloss: 'Bachay',
    urdu: 'بچے',
    category: 'Family',
    description: 'Right palm facing down patting low at various child height levels.',
    handPose: 'Flat palm facing down',
    motionDirection: 'Downward patting'
  }
};

export function findMatchingSign(query: string): SignDictItem | null {
  if (!query) return null;
  const q = query.trim().toLowerCase();
  for (const [key, item] of Object.entries(SIGN_DICTIONARY)) {
    if (
      key.toLowerCase() === q ||
      item.gloss.toLowerCase() === q ||
      item.urdu.toLowerCase().includes(q) ||
      item.category.toLowerCase() === q
    ) {
      return item;
    }
  }
  return null;
}
