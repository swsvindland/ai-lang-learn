# Hablo

A local-only, on-device-AI app that takes an English speaker from zero to fluent (CEFR C1) in Latin American Spanish.

Unlike streak apps, Hablo is built around **~25 minutes of focused study, 2–5 times a week**, plus **real-world immersion homework** (shows, books, and podcasts at your level) between sessions.

## How it works

- **Sessions** (`src/lib/session/engine.ts`) are timed blocks:
  1. **Warm-up review:** spaced-repetition flashcards.
  2. **New material:** a grammar lesson and new words in small batches.
  3. **Practice:** a mix of fill-the-gap, listening, dictation, speaking, translation, and AI reading passages. It's weighted toward your weakest skills.
  4. **Conversation:** an AI role-play for the unit's scenario.
  5. **Wrap-up:** a summary and homework.

  Only active, foreground time counts toward the session.
- **Curriculum** (`src/lib/curriculum/data`): 34 hand-structured units from A1 to C1 (~650 words, ~90 grammar points with drills, and role-play scenarios), plus a 30-item adaptive placement check and a catalog of 60 real Spanish media items. The AI writes content *within* this syllabus rather than inventing the course.
- **Learner model** (`src/lib/learner.ts`):
  - Elo-style ratings per skill (vocab, grammar, listening, speaking, reading, writing) on a 0–600 scale that maps onto CEFR.
  - Per-unit mastery that decides when the next unit unlocks.
  - Study hours, from lessons plus logged homework.
- **SRS** (`src/lib/srs.ts`): an SM-2 variant with minute-level learning steps inside a session and day-level review intervals.
- **On-device AI** (`modules/on-device-llm`): a local Expo module.
  - **iOS:** Apple Foundation Models (iOS 26+), with JSON Schema → `DynamicGenerationSchema` guided generation.
  - **Android:** Gemini Nano through ML Kit GenAI Prompt API (`genai-prompt`), in JSON mode with validation and retry.
  - Everything degrades gracefully: without AI, lessons use the built-in course, and conversation time becomes extra speaking and listening practice.
- **Speech:**
  - `expo-speech` for TTS; it prefers an es-MX voice and has a slow mode.
  - `expo-speech-recognition` for on-device STT, with word-level pronunciation scoring and playback of your own recording.
- **Storage:** everything lives in local SQLite (`expo-sqlite`). Nothing leaves the device.

## Running it

This app needs a development build; the native modules don't run in Expo Go.

```bash
pnpm install
pnpm expo run:ios        # or: pnpm expo run:android
```

Notes:
- **iOS:** needs iOS 26+ with Apple Intelligence enabled for AI features. The simulator works if Apple Intelligence is on for the Mac.
- **Builds with Xcode 27:** the app enables UIScene support via `expo-build-properties` (`ios.enableSceneSupport`). Without it, iOS 27 refuses to launch.
- **Android:** needs a Gemini Nano-capable device (e.g. Pixel 9+ or Galaxy S26); emulators aren't supported. `genai-prompt` is pinned to `1.0.0-beta2` because later betas ship Kotlin 2.3 metadata that React Native's Kotlin 2.1 toolchain can't read.
- **CocoaPods:** if it crashes with an encoding error, run with `LANG=en_US.UTF-8`.

In dev builds, **Settings → Developer → Activity gallery** (or `hablo://dev`) opens each exercise type directly.

## Checks

```bash
npx tsc --noEmit
pnpm expo lint
```
