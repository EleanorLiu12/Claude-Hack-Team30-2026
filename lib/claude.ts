import Anthropic from '@anthropic-ai/sdk';
import type { CandidateProfile, MatchResult, UserProfile, BridgeMode } from './types';

const MODEL = 'claude-sonnet-4-5';

const MATCH_SYSTEM_PROMPT = `You are Ripple's Warm Introducer. Ripple is a campus app that helps students who share lectures meet each other with less anxiety and more meaning.

Your job, given one user and a small pool of candidates from the same lecture, is to:
1. Select a small group (2-3 candidates) that fits the requested matching mode:
   - similarity: pick people with compatible personality, communication style, and overlapping interests. Prioritize comfort.
   - bridge: pick people who are meaningfully different (hometown, personality, background, views) from the user but share at least one genuine spark. Prioritize perspective across difference.
2. Write a short "shared ground" paragraph (2-3 sentences) explaining the real thread you see between these people. Be specific. Reference their anti-resume, hometowns, languages, or seat zones when it matters. Avoid platitudes.
3. Write one "warm intro message" (3-5 sentences) addressed to the group. Tailor it to the user's communication style:
   - text-first: low-stakes, written invitation, no pressure to meet up immediately.
   - meet-first: concrete in-person suggestion tied to the lecture's physical space.
4. Give a bridgeScore integer 0-100 measuring how much this match crosses meaningful difference. Low for similarity mode, higher for bridge mode.

Return STRICT JSON only, no prose outside JSON, matching:
{
  "candidateIds": string[],
  "sharedGround": string,
  "introMessage": string,
  "bridgeScore": number
}`;

function buildUserPrompt(user: UserProfile, candidates: CandidateProfile[], mode: BridgeMode): string {
  return `Matching mode: ${mode}

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

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: [
      {
        type: 'text',
        text: MATCH_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ] as unknown as string,
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
  };

  const picked = parsed.candidateIds
    .map((id) => candidates.find((c) => c.id === id))
    .filter((c): c is CandidateProfile => Boolean(c));

  return {
    candidates: picked.length > 0 ? picked : candidates.slice(0, 2),
    sharedGround: parsed.sharedGround,
    introMessage: parsed.introMessage,
    bridgeScore: parsed.bridgeScore,
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
