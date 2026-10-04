# Hablo

A language-learning app that takes an English speaker from zero to fluent (CEFR C1 / JLPT N1). It currently teaches
**Latin American Spanish** and **Japanese**. Each language is a separate course with its own progress, and you can
switch between them in Settings.

Unlike streak apps, Hablo is built around **~25 minutes of focused study, 2–5 times a week**, plus **real-world immersion homework** (shows, books, and podcasts at your level) between sessions.

## How it works

- **Sessions** (`src/lib/session/engine.ts`) are timed blocks:
  1. **Warm-up review:** spaced-repetition flashcards.
  2. **New material:** a grammar lesson and new words in small batches.
  3. **Practice:** a mix of fill-the-gap, listening, dictation, speaking, translation, and AI reading passages. It's weighted toward your weakest skills.
  4. **Conversation:** an AI role-play for the unit's scenario.
  5. **Wrap-up:** a summary and homework.

  Only active, foreground time counts toward the session.
- **Languages** (`src/lib/languages.ts`): per-language settings: voices and speech recognition locale, level labels
  (CEFR, or JLPT N5–N1 for Japanese), study-hour estimates, UI phrases, and the tutor's style rules.
- **Curriculum** (`src/lib/curriculum/<lang>`): hand-structured units with grammar notes, cloze drills, vocabulary and
  role-play scenarios, plus a 30-item adaptive placement check and a catalog of real media. The AI writes content
  *within* this syllabus rather than inventing the course.
  - **Spanish** (`es/`): 34 units from A1 to C1, 645 words, 68 grammar points, 60 media items.
  - **Japanese** (`ja/`): speaking first, reading alongside.
    - **Spoken course:** 31 units, 600 words, 62 grammar points, from greetings to JLPT N1. Every sentence carries a
      spaced kana `reading`, used for furigana, romaji, and answer checking.
    - **Reading track** (`src/lib/script.ts`): runs inside every session. It teaches hiragana, katakana (`script-kana.ts`,
      129 characters with lessons and drills), then the 2,211 JLPT kanji (`kanji.json`, from KANJIDIC; see
      `ja/ATTRIBUTION.md`). Kanji are ordered by when the course's words first need them. Practice includes reading
      words you can already say, written in the characters you just learned.
    - **Reading aids:** romaji under each word and furigana over kanji. On "auto" (the default), each aid disappears
      once you know its characters solidly.
  - `node scripts/validate-course.ts` checks the structure: ids, drills, and that each reading lines up with its text.
- **Learner model** (`src/lib/learner.ts`):
  - Elo-style ratings per skill (vocab, grammar, listening, speaking, reading, writing) on a 0–600 scale that maps onto CEFR.
  - Per-unit mastery that decides when the next unit unlocks.
  - Study hours, from lessons plus logged homework.
- **SRS** (`src/lib/srs.ts`): an SM-2 variant with minute-level learning steps inside a session and day-level review
  intervals. New words and characters are drilled in the session that introduces them. Intake slows automatically
  when the review backlog grows.
- **AI tutor** (`src/lib/ai`): role-plays, grading free answers, grammar Q&A, reading passages and homework planning.
  Three providers, chosen in **Settings → AI tutor**:
  - **On-device** (`modules/on-device-llm`, the default; free and private).
    - **iOS:** Apple Foundation Models (iOS 26+), with JSON Schema → `DynamicGenerationSchema` guided generation.
    - **Android:** Gemini Nano through ML Kit GenAI Prompt API (`genai-prompt`), in JSON mode with validation and retry.
  - **Your own OpenRouter key:** any model, DeepSeek by default (about a cent per session). The key is stored in the
    keychain via `expo-secure-store`.
  - **Hablo Plus:** a monthly subscription through RevenueCat. Requests go through a small proxy
    (`server/ai-proxy`, a Cloudflare Worker) that checks the subscription and holds the OpenRouter key. It's hidden
    until the build is configured (see `.env.example` and `server/ai-proxy/README.md`).
  - Cloud providers ask for consent first. If a cloud request fails and on-device AI is available, it falls back.
  - Everything degrades gracefully: without AI, lessons use the built-in course, and conversation time becomes extra
    speaking and listening practice.
- **Speech:**
  - `expo-speech` for TTS; it picks the best installed voice for the language (es-MX, ja-JP) and has a slow mode.
  - `expo-speech-recognition` for on-device STT. Pronunciation is scored word by word, or character by character for
    Japanese against both the kanji text and its reading. You can play back your own recording.
- **Japanese typing:** answers can be typed in kana or romaji (`wanakana`). Katakana/hiragana, long-vowel spellings,
  and wa/は-style particle spellings are folded, so they aren't marked wrong.
- **Storage:** local SQLite (`expo-sqlite`). `app.db` holds app settings, and each course has its own database
  (`hablo.db` for Spanish, kept from before multi-language support, and `hablo-ja.db`). With on-device AI, nothing leaves
  the device.

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
- **Japanese voice:** for the best audio, install an enhanced Japanese voice (iOS: Settings → Accessibility → Spoken
  Content → Voices → Japanese).

In dev builds, **Settings → Developer → Activity gallery** (or `hablo://dev`) opens each exercise type directly.

## Checks

```bash
npx tsc --noEmit
pnpm expo lint
node scripts/validate-course.ts     # course content (Node 22+)
```
