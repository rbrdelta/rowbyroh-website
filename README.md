# rowbyroh.com

Source for [rowbyroh.com](https://rowbyroh.com): research on how people and AI models
interact, plus field notes on building with Claude Code.

- **Research:** [rowbyroh.com/research](https://rowbyroh.com/research) — the Emotional Resonance
  (sound) and Model Behavior series. Experiment code: [sound-lab](https://github.com/rbrdelta/sound-lab).
- **Field notes:** [rowbyroh.com/archive?tag=field-notes](https://rowbyroh.com/archive?tag=field-notes)
- **How the site is built:** [rowbyroh.com/colophon](https://rowbyroh.com/colophon)

Static HTML, CSS and vanilla JS on Vercel. Content index lives in `assets/data/content.json`.

```bash
npm test            # unit tests
npm run ship        # full pre-push gate (structural, visual, voice)
./scripts/verify.sh # post-deploy check against the live site
```
