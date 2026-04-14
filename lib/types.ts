export type SeatZone =
  | 'front-left' | 'front-center' | 'front-right'
  | 'middle-left' | 'middle-center' | 'middle-right'
  | 'back-left' | 'back-center' | 'back-right';

export type CommStyle = 'text-first' | 'meet-first';

export type MBTI =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface UserProfile {
  name: string;
  course: string;
  seatZone: SeatZone;
  commStyle: CommStyle;
  mbti?: MBTI;
  hometown?: string;
  languages?: string[];
  zodiac?: string;
  resumeText?: string;
  antiResume?: {
    struggle: string;
    failure: string;
    curiosity: string;
  };
}

export interface CandidateProfile extends UserProfile {
  id: string;
  sharedLectures: number;
}

export interface MatchResult {
  candidates: CandidateProfile[];
  sharedGround: string;
  introMessage: string;
  bridgeScore: number;
}

export type BridgeMode = 'similarity' | 'bridge';
