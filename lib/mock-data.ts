import type { CandidateProfile, MatchResult, UserProfile } from './types';

export const MOCK_CANDIDATES: CandidateProfile[] = [
  {
    id: 'c1',
    name: 'Maya Chen',
    course: 'ECON 101',
    seatZone: 'back-right',
    commStyle: 'text-first',
    mbti: 'INFJ',
    hometown: 'Eau Claire, WI',
    languages: ['English', 'Mandarin'],
    zodiac: 'Virgo',
    resumeText: 'Econ major, sustainability club, data viz intern at a local nonprofit.',
    antiResume: {
      struggle: 'Public speaking in large lectures',
      failure: 'Dropped an organic chem class twice',
      curiosity: 'How rural Wisconsin towns adapt to climate policy',
    },
    sharedLectures: 14,
  },
  {
    id: 'c2',
    name: 'Jordan Okafor',
    course: 'ECON 101',
    seatZone: 'back-left',
    commStyle: 'meet-first',
    mbti: 'ENTP',
    hometown: 'Milwaukee, WI',
    languages: ['English', 'Igbo'],
    zodiac: 'Leo',
    resumeText: 'Political science major, debate team, canvassed for local elections.',
    antiResume: {
      struggle: 'Sitting still through long lectures',
      failure: 'Lost a debate final in high school I thought I had won',
      curiosity: 'Why people who disagree politically still end up friends',
    },
    sharedLectures: 9,
  },
  {
    id: 'c3',
    name: 'Riley Nakamura',
    course: 'ECON 101',
    seatZone: 'middle-right',
    commStyle: 'text-first',
    mbti: 'INTP',
    hometown: 'Madison, WI',
    languages: ['English', 'Japanese'],
    zodiac: 'Pisces',
    resumeText: 'CS + econ double major, built a bus-arrival predictor for campus.',
    antiResume: {
      struggle: 'Starting conversations with strangers',
      failure: 'A side project that got 3 users and crashed',
      curiosity: 'Whether small-town economics really works differently',
    },
    sharedLectures: 11,
  },
];

export function mockMatch(user: UserProfile, mode: 'similarity' | 'bridge'): MatchResult {
  const picks = mode === 'bridge'
    ? [MOCK_CANDIDATES[1], MOCK_CANDIDATES[0], MOCK_CANDIDATES[2]]
    : [MOCK_CANDIDATES[0], MOCK_CANDIDATES[2], MOCK_CANDIDATES[1]];

  const sharedGround = mode === 'bridge'
    ? `You three come from different corners of ${user.course} and different corners of Wisconsin. But each of you wrote something on your anti-resume about wanting to understand people who don't think the way you do. That's the thread.`
    : `You three have been sitting within 20 feet of each other for most of the semester. You all lean toward quieter entry points to conversation, and all three anti-resumes mention curiosity about how communities actually work.`;

  const isText = user.commStyle === 'text-first';
  const introMessage = isText
    ? `Hey — this is a soft intro from Ripple. The three of you have overlapped in ${user.course} more than you probably realized (one of you has shared the room 14 times this semester). No pressure to meet up yet. If you're up for it, trade one line on your anti-resume "curiosity" and see where it goes.`
    : `Hi all — Ripple here. You've been sharing the back half of ${user.course} all semester. Since you all said you prefer meeting in person, try this: same row, 10 minutes after Thursday's lecture, grab coffee at the union. Bring the one thing from your anti-resume you'd actually talk about out loud.`;

  const bridgeScore = mode === 'bridge' ? 78 : 42;

  return {
    candidates: picks,
    sharedGround,
    introMessage,
    bridgeScore,
  };
}
