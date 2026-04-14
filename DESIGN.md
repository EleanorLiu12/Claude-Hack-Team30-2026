# Ripple

*Small nods. Wide ripples.*

## Problem

50,000 people on campus. 300 in your lecture. You know none of them. Digital tools made us lonelier and more polarized, not less. We need spaces where different people actually meet.

## Concept

A campus app that reveals the invisible social graph already forming around your seat, and uses Claude to gently introduce you to the people you've been sitting near — or the people most unlike you.

## Six Core Functions

**1. Seat Archaeology**
Check in by scanning a QR code when you sit. The app tracks who has been near you over the semester. Surface the invisible: *"You've shared space with this person 14 times."*

**2. Anti-Resume Profile**
Upload your real resume. Claude extracts skills, major, projects. Then add an *anti-resume*: one struggle, one failure, one thing you're curious about. Match on vulnerability, not credentials.

**3. Bridge Mode (toggle)**
- *Similarity mode:* match with people like you (lower anxiety).
- *Bridge mode:* match with someone different (hometown, views, major) who still shares one spark. Gamified Bridge Score.

**4. Warm Introducer (Claude API)**
Claude chats briefly with each user, finds genuine overlap, then writes a personalized intro message tailored to both people's communication styles (introvert vs extrovert).

**5. Time-Locked Reveals**
A match unlocks only after you have been in the same lecture N times. Earned through real presence. No gaming it.

**6. Group-First Matching**
Default to matching 4-5 people from the same lecture, not 1-to-1. Groups reduce social anxiety. One-to-one is opt-in.

## Psychology Inputs (Onboarding)

Required: class, seat zone, communication style (text-first / meet-first).
Optional: MBTI, hometown, languages, zodiac, resume upload, anti-resume answers.

## User Flow (Demo)

1. Sign up, pick a class, pick your seat zone.
2. Upload resume and answer three anti-resume prompts.
3. Toggle Bridge Mode on or off.
4. App shows a small group match from your class with a Claude-generated intro and shared ground.
5. Send the intro, or save for later.

## Tech Stack

- Frontend: Next.js + Tailwind (single page, mocked data)
- Backend: Next.js API route as Claude API proxy
- Data: Three hardcoded fake profiles for the demo match
- Claude API: Sonnet 4.6, with prompt caching on the system prompt

## Claude API Usage

1. **Resume extraction:** PDF text in, structured JSON profile out.
2. **Match reasoning:** two profiles in, shared-ground explanation out.
3. **Warm intro message:** two profiles and their comm styles in, tailored intro out.

System prompt cached across calls.

## Scope for 25-Minute Build

Must-have:
- Single onboarding form
- Hardcoded candidate pool (three profiles)
- One API route calling Claude to generate match reasoning and intro
- Match card UI

Cut if over time:
- Resume PDF upload (use pasted text instead)
- Bridge Score gamification
- Time-locked gating (show the concept in UI, do not enforce)

## Demo Pitch

Open on the match card. Show the Claude-generated intro that references seat zone, anti-resume overlap, and suggests a next step matched to the users' communication styles. One screen, one magic moment.
