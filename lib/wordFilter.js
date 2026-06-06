const BLOCKED_WORDS = [
  // profanity
  'fuck', 'shit', 'ass', 'bitch', 'bastard', 'crap', 'damn', 'piss',
  'cock', 'dick', 'pussy', 'cunt', 'whore', 'slut', 'fag', 'faggot',
  'retard', 'rape', 'molest',

  // common bypasses
  'f*ck', 'sh*t', 'b*tch', 'a**', 'd*ck', 'c*nt',

  // racial slurs
  'nigger', 'nigga', 'chink', 'spic', 'kike', 'wetback', 'gook',
  'towelhead', 'raghead', 'zipperhead', 'beaner', 'cracker', 'honky',
  'tranny', 'shemale',

  // sexist/misogynistic
  'femoid', 'roastie', 'thot', 'landwhale',
];

const BLOCKED_PHRASES = [
  // self-harm / suicide
  'kill yourself', 'kys', 'go kill yourself', 'go die', 'you should die',
  'i hope you die', 'hope you die', 'end yourself', 'off yourself',
  'hang yourself', 'shoot yourself', 'slit your wrists', 'kill urself',
  'go commit suicide', 'commit suicide', 'kms', 'unalive yourself',

  // threats / violence
  'i will kill', 'i will hurt', 'i\'ll kill you', 'i\'ll hurt you',
  'gonna kill you', 'going to kill you', 'you\'re dead', 'ur dead',
  'watch your back', 'i know where you live',

  // hate / racism
  'white power', 'white supremacy', 'black lives dont matter',
  'go back to your country', 'death to', 'gas the', 'ethnic cleansing',
  'racial purity', 'master race',

  // sexism / harassment
  'women belong', 'women should', 'get back in the kitchen',
  'make me a sandwich', 'women are inferior', 'men are superior',
];

/**
 * Returns true if the text contains a blocked word (whole-word match).
 */
export function containsBadWord(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  const stripped = lower.replace(/[^a-z0-9\s]/g, '');
  const words = stripped.split(/\s+/);

  // word check
  if (BLOCKED_WORDS.some(word => {
    const clean = word.replace(/[^a-z0-9]/g, '');
    return words.includes(clean);
  })) return true;

  // phrase check (substring match on lowercased original)
  if (BLOCKED_PHRASES.some(phrase => lower.includes(phrase))) return true;

  return false;
}

/**
 * Returns an error message string if blocked, otherwise null.
 */
export function checkContent(text, fieldName = 'Post') {
  if (containsBadWord(text)) {
    return `${fieldName} contains inappropriate language or content. Please keep it respectful — this is an all-ages community.`;
  }
  return null;
}