# Team brief: video demo vs. live presentation

## The difference

| | Video demo | Live presentation |
| --- | --- | --- |
| What | Recorded 2-3 minute screen capture with voice, uploaded to the submission form | 5-minute talk with the slides in Kimmel 905, then a live demo |
| When | Upload before **9:00 AM, 2026-10-04** | Judging, **1-5 PM**, Kimmel 905 (60 Washington Sq S) |
| Who | One narrator recording the screen | All four speak, then Harsh runs the demo |
| Shows | Mostly the working app | Slides first, then the app for about 60 seconds |
| Script | [video-script.md](video-script.md) | [presentation-script.md](presentation-script.md) |

## Recording the video

1. Start the site. From `web/`, run `bun run build`, then `node scripts/serve.mjs`. The site is at http://localhost:4173 and works offline.
2. Open these tabs in order:
   - `localhost:4173/`
   - `/explore/`
   - `/compare/`
   - `/print/`
   - the GitHub repo
3. Set browser zoom to 100% (Ctrl+0) and hide the bookmarks bar (Ctrl+Shift+B).
4. Record with **Win+Alt+R** (Xbox Game Bar records one window) or OBS. Trim in Clipchamp if needed.
5. Read the Narration column of the script and do what the On Screen column says. Aim for about 2:30 and never go over 3:00.
6. On Explore, move only the sliders the script names. At 7% the page may show about 108. Say "106", the hourly model's figure.
7. Export as MP4. Upload it to the form with the deck PDF before 9:00.

## Live presentation

- **Speakers:**
  - Harsh: cover, problem, our answer
  - Linson: rings, how it works
  - Aryaman: results, funding
  - Philip: what Lansing gets, the ask
- Philip ends with "Harsh, the model." Harsh then runs the 60-second Explore demo on his laptop.
- Harsh holds the clicker the whole time.
- Before walking up, open Explore and press **Reset to the base case**.
- Room setup, keyboard shortcuts and fallbacks are in [demo-runbook.md](demo-runbook.md).
- Answers to likely judge questions are in [judge-qa.md](judge-qa.md).
