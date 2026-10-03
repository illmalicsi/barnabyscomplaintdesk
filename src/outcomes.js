/**
 * outcomes.js - Bureaucratic outcomes and dialogue for Barnaby's Complaint Desk.
 * Window 7 - Department of Minor Inconveniences.
 */

export const OUTCOMES = [
  {
    id: 'rejected',
    name: 'Rejected',
    stampText: 'REJECTED',
    stampSubtitle: 'Complaint was too complaining',
    memo: 'The complaint was too complaining.',
    clerkLine: "We don't tolerate complaints about things here.",
    color: '#dc2626'
  },
  {
    id: 'escalated',
    name: 'Escalated to the Department of Nothing',
    stampText: 'ESCALATED',
    stampSubtitle: 'Dept. of Nothing',
    memo: 'The expected response time is geological.',
    clerkLine: "I've escalated your complaint to the Department of Nothing. Expected response: geological.",
    color: '#d97706'
  },
  {
    id: 'approved',
    name: 'Approved, pending approval',
    stampText: 'APPROVED*',
    stampSubtitle: '*Committee of one',
    memo: 'The approval is being approved by a committee of one.',
    clerkLine: 'Your complaint is approved, pending subsequent approval by a committee of one.',
    color: '#2563eb'
  },
  {
    id: 'lost',
    name: 'Lost',
    stampText: 'LOST',
    stampSubtitle: 'Lost per protocol',
    memo: 'The clerk found it and then lost it again, which is the process.',
    clerkLine: 'I found your complaint, and then lost it again. That is the process.',
    color: '#7c3aed'
  },
  {
    id: 'future_self',
    name: 'Forwarded to your future self',
    stampText: 'FORWARDED',
    stampSubtitle: 'To future self',
    memo: 'Expect delivery in several years with no tracking number.',
    clerkLine: 'Forwarded to your future self. Expect delivery in several years with no tracking number.',
    color: '#059669'
  }
];

export const MUTTER_LINES = [
  '*mumbling indistinctly about protocol...*',
  '*sighs deeply at your penmanship...*',
  '*checking if Form 27-B/6 is obsolete...*',
  '*disapprovingly consulting subsection 4...*',
  '*mutters under breath about taxpayers...*',
  '*adjusts glasses with extreme bureaucratic skepticism...*',
  '*cross-referencing with the Directory of Vague Grievances...*'
];

export const EMPTY_INPUT_RESPONSES = [
  'Please complain about something. Window 7 does not accept existential silence.',
  'You must write a complaint. Blank forms are an administrative violation.',
  'Complain about something, please. The Department requires grievances in writing.',
  'Submitting empty air? My stamp does not work on metaphysical voids.'
];

export const BELL_RESPONSES = [
  'Ding received. Your priority has been automatically downgraded.',
  'Ring again and your grievance goes straight into the furnace.',
  'The bell does not speed up bureaucracy. In fact, it adds 3-5 business days.',
  'I heard you the first time. I was deliberately ignoring you.',
  'Service bell policy: Each ring incurs an administrative emotional distress fee.',
  'That bell is purely ornamental. Stop agitating the brass.'
];

export const COFFEE_RESPONSES = [
  '*sips* Lukewarm decaf. Just like our customer service.',
  'Union-mandated caffeine interval. Your complaint is temporarily in limbo.',
  '*slurp* Mmm... tastes like bureaucratic stagnation.',
  'I run on 20% dark roast and 80% procedural non-compliance.',
  'Do not interrupt the coffee sip. This mug is my only remaining joy.'
];

export const POKE_RESPONSES = [
  'Please do not tap the bureaucrat. It agitates my paperwork.',
  'Citizen, kindly maintain a 2-foot buffer zone from Window 7.',
  'Poking is not an authorized method of grievance submission.',
  'That tickles. And by tickles, I mean I am filing a restraining order.',
  'Physical contact with Window 7 personnel requires Form 44-Touch.',
  'You have poked Barnaby. Processing penalty: +14 working days.'
];

export const SHRED_RESPONSES = [
  '*bzzzt* Form shredded. Procedural perfection achieved.',
  'Complaint vaporized. We never spoke. Have a mediocre day.',
  'Into the confetti bin it goes. That saved us both 6 weeks of waiting.',
  'Shredded. Now it is recycled into blank rejection notices.'
];

export const RANDOM_COMPLAINTS = [
  'The office microwave smells like broken dreams and burnt popcorn.',
  'Pigeons outside look at me with unwarranted personal disdain.',
  'My houseplant is quiet-quitting despite regular hydration and sunlight.',
  'Monday has entirely too many syllables and insufficient snacks.',
  'The sidewalk was slightly too bumpy for my fragile emotional state.',
  'The elevator music gave me an existential identity crisis.',
  'My socks keep migrating to an alternate dimension in the dryer.',
  'The air conditioning smells faintly of unresolved zoning disputes.',
  'The pen attached to the desk is exactly 2cm too short to reach the form.',
  'Someone ate my labeled yogurt and left behind a feeling of betrayal.',
  'The weather is being suspiciously pleasant. What is it hiding?',
  'I suspect my cat is operating an illegal underground gambling ring.',
  'The self-checkout machine accused me of unexpected item in bagging area.',
  'My Wi-Fi signal drops whenever I try to look up something important.',
  'Tuesday has no distinct personality and should be abolished.',
  'The streetlights always turn red when they sense my vehicle approaching.'
];

export function getRandomOutcome() {
  const index = Math.floor(Math.random() * OUTCOMES.length);
  return OUTCOMES[index];
}

export function getRandomMutterLine() {
  const index = Math.floor(Math.random() * MUTTER_LINES.length);
  return MUTTER_LINES[index];
}

export function getRandomEmptyResponse() {
  const index = Math.floor(Math.random() * EMPTY_INPUT_RESPONSES.length);
  return EMPTY_INPUT_RESPONSES[index];
}

export function getRandomBellResponse() {
  const index = Math.floor(Math.random() * BELL_RESPONSES.length);
  return BELL_RESPONSES[index];
}

export function getRandomCoffeeResponse() {
  const index = Math.floor(Math.random() * COFFEE_RESPONSES.length);
  return COFFEE_RESPONSES[index];
}

export function getRandomPokeResponse() {
  const index = Math.floor(Math.random() * POKE_RESPONSES.length);
  return POKE_RESPONSES[index];
}

export function getRandomShredResponse() {
  const index = Math.floor(Math.random() * SHRED_RESPONSES.length);
  return SHRED_RESPONSES[index];
}

export function getRandomComplaint() {
  const index = Math.floor(Math.random() * RANDOM_COMPLAINTS.length);
  return RANDOM_COMPLAINTS[index];
}
