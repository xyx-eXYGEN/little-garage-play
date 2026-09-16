# Little Garage — play page for a 3.5-year-old

Car-themed **and** 过家家 (playing house) activities that match the parent handbook in `../ALP-PREP-PLAN.md`. **You sit with him.** The screen scaffolds; it does not replace you. Real magnetic-tile garages still win.

**Design:** two worlds, same four game types. Garage is his hook (cars). 过家家 is for stories (wash → eat → sleep). Phone and iPad share **one URL**.

## Two worlds

Open the page → two huge **photo doors** (kid can tap without reading):

- **Garage / 小车库** — real fire truck, pickup, sports car, ordinary cars
- **过家家** — real kitchen, rice, dumplings, bowls, plates, bed

After a world is picked, the familiar four boxes appear in that world’s pictures. Last world is remembered on this device.

**Switch worlds:** the big cream **换主题 · Change world** picture bar under the four boxes (shows the other world). Or tap **Home 回家** a second time on the four-box screen. From a game, Home goes to the four boxes first so you are not trapped.

## Live URL — Mac no longer required

**https://xyx-exygen.github.io/little-garage-play/**

This URL **never changes**. It is the always-on public HTTPS page. The Mac can sleep. You do **not** need `localhost:8765` or the Python `http.server`. Phone and iPad share this one URL, on any network (home Wi-Fi, cellular, grandparents’ house).

Public play files live in [xyx-eXYGEN/little-garage-play](https://github.com/xyx-eXYGEN/little-garage-play) (GitHub Pages from the **repo root**, not Actions). The parent handbook stays in this private workspace.

### Refresh the live page after local edits

Edit the game in the private handbook repo (`play-garden/`), then from **that** repo root:

```bash
./scripts/deploy-little-garage.sh
```

That copies `play-garden/` into a clone of `little-garage-play`, commits, and `git push origin main`. Pages updates at the **same** URL. The script bumps the `parent-N` cache-bust query in `index.html` / `app.js` when the game files changed, so iPads are less likely to keep old JS. Direct push is the path — do not wait on GitHub Actions.

Or push the same files to `little-garage-play` yourself. Either way, the kid’s bookmark stays `https://xyx-exygen.github.io/little-garage-play/`. The deploy script is **not** in the public Pages repo.

### Open on iPad / iPhone (Safari, Add to Home Screen)

This is a home-screen web app, not an App Store app.

1. On the **iPhone or iPad**, open **Safari** (not Chrome).
2. Go to **https://xyx-exygen.github.io/little-garage-play/**
3. Tap the **Share** button (square with an arrow pointing up).
4. Scroll and tap **Add to Home Screen** / **添加到主屏幕**.
5. Name it **Little Garage** or **小车库**, then tap Add.
6. Open it from the Home Screen — it should be full screen, like an app.

If an old Home Screen icon still points at `localhost:8765` or a LAN IP, **delete that icon** and add this HTTPS URL instead.

After a deploy, Safari may still show the old page. **Hard-reload** (refresh, or long-press Refresh → reload without cache). If it still looks stale, **delete the Home Screen icon and Add to Home Screen again** so story videos and JS are not stuck on a cached copy.

A real App Store / `.ipa` app would need Apple signing and TestFlight later.

### Optional: local Python server (Mac only)

Only if you want to test on this computer without the internet. System Node on this machine may be broken. You do **not** need npm.

```bash
cd play-garden
python3 -m http.server 8765 --bind 0.0.0.0
```

Then open **http://localhost:8765** on the Mac. Stop with Ctrl+C. This local server dies when the Mac sleeps — use the live HTTPS URL above for everyday play.

## What’s inside

Same four boxes in both worlds. Pictures and stories change.

| Home box | Garage | 过家家 |
|---|---|---|
| Tell the Story | Sports car / pickup / fire truck sequences (Hear names the type); which picture belongs; analogies (fire truck → fire station) | Wash→eat rice in a bowl→sleep; cook→set plate and cup→eat dumplings; bath→clothes→bed; wake→shirt→bread and banana |
| Park / count | Mix of real vehicles he can name; more/less/same | Bowls, plates, rice, dumplings, apples — still quantitative; picture taps only |
| Which belongs | Fire trucks together, pickups together, sports cars together | Fruits vs hot food; plates vs bowls vs cups; kitchen vs bedroom; fridge |
| Spatial | Ramp/roof; where is the car; what’s missing | On the table, under the bed, in the cupboard, next to |

Pictures are stored in `photos/` (close-up objects). **Tell the Story** sequence tiles use stills cut from that story’s video (`media/garage/` and `media/house/` — `beat-1.jpg` and friends), not leftover collages. Kid-tap pictures are large. Icons, 简笔画, and two photos glued together are out. Hear / 听 still says the real name in English and 中文.

On a correct **sequence**, the story video (`story.mp4`) plays in the Look window (muted, tap **Skip · 跳过** if you want). Fireworks already run — no extra photo stack underneath. Other correct answers still celebrate with fireworks for about two seconds (no scary boom, no “WRONG” animation). Games split into a flat **Look / 看一看** card on top and raised answer cards below. Sequence games: drag a picture into First / Then / Last, or tap a picture then tap a slot.

Grown-up button (hold, then a tiny yellow-car question) opens settings: which boxes, bilingual labels, speech, a gentle “maybe a break?” reminder, and a **parent-only** one-line CogAT skill hint. Stars save in this browser only. No account, no internet required after the page is loaded.

## How to use (5–8 minutes)

1. Let him pick **Garage** if he wants cars. Use **过家家** when you want a story with a beginning, middle, and end.
2. Open **Tell the Story** first — that’s the home-plan priority.
3. Tap English / 中文 on labels so he hears both.
4. After a sequence, **you** ask: “What happened first?” Wait. The app shows sentence starters; he talks.
5. One more play if he wants, then back to real cars or real bowls.

No timers that punish. A mixed-up picture just means “let’s look again.”
