import Anthropic from '@anthropic-ai/sdk';
import type { CandidateProfile, MatchResult, UserProfile, BridgeMode } from './types';

const MODEL = 'claude-sonnet-4-5';

const MATCH_SYSTEM_PROMPT = `You are Ripple's Warm Introducer. Ripple is a campus app that helps students who share lectures meet each other with less anxiety and more meaning.

Your job, given one user and a small pool of candidates from the same lecture, is to:
1. Select a group that fits the requested matching mode:
   - similarity: pick people with compatible personality, communication style, and overlapping interests. Prioritize comfort.
   - bridge: pick people who are meaningfully different (hometown, personality, background, views) from the user but share at least one genuine spark. Prioritize perspective across difference.
   Group size: pick 2-3 candidates by default. If the user has introvertMode: true, pick only 1-2 candidates, and prefer candidates whose commStyle is text-first so the match is symmetric.
2. Write a short "shared ground" paragraph (2-3 sentences) explaining the real thread you see between these people. Be specific. Reference their anti-resume, hometowns, languages, or seat zones when it matters. Avoid platitudes.
3. Write one "warm intro message" (3-5 sentences) addressed to the group. Tailor it to the user's communication style:
   - text-first: low-stakes, written invitation, no pressure to meet up immediately.
   - meet-first: concrete in-person suggestion tied to the lecture's physical space.
4. Give a bridgeScore integer 0-100 measuring how much this match crosses meaningful difference. Low for similarity mode, higher for bridge mode.
5. If introvertMode is true, also return a depthScore integer 0-100 measuring how substantive the overlap is (specific curiosity match, shared project themes, language overlap). Otherwise return null for depthScore.

Return STRICT JSON only, no prose outside JSON, matching:
{
  "candidateIds": string[],
  "sharedGround": string,
  "introMessage": string,
  "bridgeScore": number,
  "depthScore": number | null
}`;

const INTROVERT_PREAMBLE = `The user has Introvert Mode enabled. This changes how you must write the intro:
- Presume no real-time reply pressure. A week is fine. A month is fine.
- Offer the introvert a specific low-stakes first move they can rehearse before sending. Avoid generic "grab coffee" asks unless the user's commStyle is meet-first.
- If the match is mixed introvert/extrovert, gently set mutual expectations inside the intro itself. The extrovert should learn the introvert may take days; the introvert should learn they can counter any in-person ask with an async first step.
- Avoid exclamation marks, cheerful urgency, and FOMO framing.
- Prefer verbs like "consider", "whenever you want", "no rush", "if you feel like it".
- Down-weight shallow overlap (zodiac, generic hometown). Up-weight depth: specific curiosity overlap from the anti-resume, shared project themes, meaningful language overlap.
- Keep the whole intro calm in tone. Quiet confidence, not enthusiasm.`;

function buildUserPrompt(user: UserProfile, candidates: CandidateProfile[], mode: BridgeMode): string {
  return `Matching mode: ${mode}
Introvert Mode: ${user.introvertMode ? 'true' : 'false'}

USER:
${JSON.stringify(user, null, 2)}

CANDIDATES (all from the same lecture, each includes sharedLectures count with user):
${JSON.stringify(candidates, null, 2)}

Return the JSON described in the system prompt. No markdown fences.`;
}

export async function generateMatch(
  apiKey: string,
  user: UserProfile,
  candidates: CandidateProfile[],
  mode: BridgeMode,
): Promise<MatchResult> {
  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const systemBlocks: Array<Record<string, unknown>> = [
    {
      type: 'text',
      text: MATCH_SYSTEM_PROMPT,
      cache_control: { type: 'ephemeral' },
    },
  ];
  if (user.introvertMode) {
    systemBlocks.push({ type: 'text', text: INTROVERT_PREAMBLE });
  }

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: systemBlocks as unknown as string,
    messages: [
      { role: 'user', content: buildUserPrompt(user, candidates, mode) },
    ],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  const raw = textBlock.text.trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Could not parse JSON from Claude response');

  const parsed = JSON.parse(jsonMatch[0]) as {
    candidateIds: string[];
    sharedGround: string;
    introMessage: string;
    bridgeScore: number;
    depthScore?: number | null;
  };

  const picked = parsed.candidateIds
    .map((id) => candidates.find((c) => c.id === id))
    .filter((c): c is CandidateProfile => Boolean(c));

  const fallbackCount = user.introvertMode ? 2 : 3;

  return {
    candidates: picked.length > 0 ? picked : candidates.slice(0, fallbackCount),
    sharedGround: parsed.sharedGround,
    introMessage: parsed.introMessage,
    bridgeScore: parsed.bridgeScore,
    depthScore: parsed.depthScore ?? undefined,
  };
}

const RESUME_SYSTEM_PROMPT = `You extract a compact profile from a student's resume text. Return STRICT JSON only:
{
  "major": string,
  "skills": string[],
  "projects": string[],
  "interests": string[]
}
Keep each array to 3-5 concise items. No prose outside JSON.`;

export async function extractResume(apiKey: string, resumeText: string) {
  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    system: [
      {
        type: 'text',
        text: RESUME_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ] as unknown as string,
    messages: [{ role: 'user', content: resumeText }],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') throw new Error('No text response');
  const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Could not parse JSON');
  return JSON.parse(jsonMatch[0]);
}
