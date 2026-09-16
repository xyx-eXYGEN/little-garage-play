/* Little Garage — sit-together play for a 3.5-year-old who loves cars.
   Parent scaffolds stories. No scores, no countdown clocks.
   Five stable home boxes; variants rotate inside each box. */

const STORAGE = "little-garage-v1";
const PALETTE = ["#d94b3a", "#3a7ca5", "#e8b44c", "#5a9e6f", "#c07a4a", "#7a5ea6"];
const PHOTO_V = "parent-29";
const RECENT_AVOID = 5;

const DEFAULTS = {
  bilingual: true,
  speech: true,
  speechVoiceURI: "",
  sessionMin: 8,
  plays: { story: true, park: true, bay: true, build: true, box: true },
  stars: 0,
  theme: null,
  recentIds: [],
  recentVariants: {
    garage: { story: [], park: [], bay: [], build: [], box: [] },
    house: { story: [], park: [], bay: [], build: [], box: [] },
  },
};

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE) || "{}");
    const plays = { ...DEFAULTS.plays, ...(stored.plays || {}) };
    if (plays.box == null) plays.box = true;
    return { ...DEFAULTS, ...stored, plays };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveState(partial) {
  const next = { ...loadState(), ...partial };
  localStorage.setItem(STORAGE, JSON.stringify(next));
  return next;
}

function photo(name, alt, extraClass) {
  const cls = extraClass ? `photo ${extraClass}` : "photo";
  return `<img class="${cls}" src="photos/${name}.jpg?v=${PHOTO_V}" alt="${escapeHtml(alt)}" />`;
}

function storyPhoto(name, alt) {
  return `<img class="photo scene" src="photos/stories/${name}.jpg?v=${PHOTO_V}" alt="${escapeHtml(alt)}" />`;
}

function storyArt(name, alt, cap) {
  return storyPhoto(name, alt) + (cap ? caption(cap) : "");
}

const STORY_MEDIA_FOLDERS = {
  sleep: "media/garage/sleep",
  wash: "media/garage/wash",
  friend: "media/garage/friend",
  gas: "media/garage/gas",
  "wash-eat-sleep": "media/house/wash-eat-sleep",
  "cook-set-eat": "media/house/cook-set-eat",
  "bath-pj-bed": "media/house/bath-pj-bed",
  morning: "media/house/morning",
};

function beatCaptionHtml(art) {
  const html = String(art || "");
  const start = html.indexOf('<div class="cap">');
  return start === -1 ? "" : html.slice(start);
}

function resolveStoryMediaFolder(story) {
  if (!story) return null;
  if (story.mediaFolder) return story.mediaFolder;
  const id = String(story.id || "")
    .toLowerCase()
    .trim();
  const slug = id.replace(/\s+/g, "-");
  if (STORY_MEDIA_FOLDERS[id]) return STORY_MEDIA_FOLDERS[id];
  if (STORY_MEDIA_FOLDERS[slug]) return STORY_MEDIA_FOLDERS[slug];
  const title = String(story.titleEn || "").toLowerCase();
  const keys = Object.keys(STORY_MEDIA_FOLDERS);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const words = key.replace(/-/g, " ");
    if (id.includes(key) || slug.includes(key) || title.includes(words)) {
      return STORY_MEDIA_FOLDERS[key];
    }
  }
  return null;
}

function attachStoryMedia(story) {
  if (!story || !Array.isArray(story.beats)) return story;
  try {
    const folder = resolveStoryMediaFolder(story);
    if (!folder) return story;
    const beats = story.beats.map((beat, i) => {
      const file = `beat-${i + 1}.jpg`;
      return {
        ...beat,
        art: `<img class="photo scene" src="${folder}/${file}?v=${PHOTO_V}" alt="${escapeHtml(beat.en || "")}" />${beatCaptionHtml(beat.art)}`,
      };
    });
    return { ...story, beats, video: `${folder}/story.mp4` };
  } catch {
    return story;
  }
}

function sizeClass(size) {
  if (size === "sm") return "sm";
  if (size === "lg") return "lg";
  return "";
}

function applySize(html, size) {
  if (!size || size === "md") return html;
  return html.replace('class="photo"', `class="photo ${sizeClass(size)}"`);
}

function carSvg(color, opts = {}) {
  if (opts.dirty) return applySize(photo("car-dirty-blue", "dusty pickup truck"), opts.size);
  if (color === "#d94b3a") return applySize(photo("car-red", "red car"), opts.size);
  if (color === "#3a7ca5") return applySize(photo("car-blue", "blue car"), opts.size);
  if (color === "#e8b44c") return applySize(photo("car-yellow", "yellow car"), opts.size);
  if (color === "#ffffff") return applySize(photo("car-white", "white car"), opts.size);
  return applySize(photo("car-blue", "car"), opts.size);
}

function truckSvg(color, opts = {}) {
  if (opts.dirty) return applySize(photo("car-dirty-blue", "dusty pickup truck"), opts.size);
  if (color === "#d94b3a") return applySize(photo("pickup-red", "red pickup truck"), opts.size);
  if (color === "#3a7ca5") return applySize(photo("pickup", "blue pickup truck"), opts.size);
  if (color === "#e8b44c") return applySize(photo("pickup-yellow", "yellow pickup truck"), opts.size);
  if (color === "#ffffff") return applySize(photo("pickup-white", "white pickup truck"), opts.size);
  return applySize(photo("pickup", "pickup truck"), opts.size);
}

function motoSvg(color, opts = {}) {
  return applySize(photo("sports-car-yellow", "sports car"), opts.size);
}

function busSvg(color, opts = {}) {
  return applySize(photo("car-red", "family car"), opts.size);
}

function vehicleArt(kind, color, opts) {
  if (kind === "fire") return applySize(photo("fire-truck", "fire truck"), opts && opts.size);
  if (kind === "pickup" || kind === "truck") return truckSvg(color, opts);
  if (kind === "sports" || kind === "moto") return applySize(photo("sports-car", "sports car"), opts && opts.size);
  if (kind === "bus") return busSvg(color, opts);
  return carSvg(color, opts);
}

function garageArt(opts = {}) {
  return photo(opts.wide ? "garage-wide" : "garage", opts.wide ? "big garage" : "garage");
}

function washArt() {
  return photo("wash", "car wash");
}

function keyArt() {
  return photo("keys", "car keys");
}

function pumpArt() {
  return photo("keys", "car keys");
}

function rampArt() {
  return photo("ramp", "ramp");
}

function moonArt() {
  return photo("moon", "moon");
}

function roofArt() {
  return photo("roof", "roof");
}

function wallArt() {
  return photo("wall", "wall");
}

function fireTruckArt() {
  return photo("fire-truck", "fire truck");
}

function pickupArt() {
  return photo("pickup", "pickup truck");
}

function whitePickupArt() {
  return photo("pickup-white", "white pickup truck");
}

function redPickupArt() {
  return photo("pickup-red", "red pickup truck");
}

function pickupRedArt() {
  return photo("pickup-red", "red pickup truck");
}

function pickupWhiteArt() {
  return photo("pickup-white", "white pickup truck");
}

function sportsCarArt() {
  return photo("sports-car", "red sports car");
}

function yellowSportsArt() {
  return photo("sports-car-yellow", "yellow sports car");
}

function redCarArt() {
  return photo("car-red", "red car");
}

function blueCarArt() {
  return photo("car-blue", "blue car");
}

function yellowCarArt() {
  return photo("car-yellow", "yellow car");
}

function whiteCarArt() {
  return photo("car-white", "white car");
}

function pickupBlueArt() {
  return photo("pickup", "blue pickup truck");
}

function yellowPickupArt() {
  return photo("pickup-yellow", "yellow pickup truck");
}

function fireStationArt() {
  return photo("fire-station", "fire station");
}

function wheelArt() {
  return photo("wheel", "wheel");
}

function mysteryBoxArt(opts = {}) {
  const open = !!opts.open;
  const reveal = opts.reveal || "";
  return `<div class="mystery-box${open ? " is-open" : ""}" aria-hidden="true">
    <svg class="mystery-svg" viewBox="0 0 160 150" role="img">
      <rect class="mystery-body" x="28" y="62" width="104" height="72" rx="10" fill="#e07a4c" stroke="#c45e32" stroke-width="4"/>
      <rect class="mystery-ribbon" x="74" y="62" width="14" height="72" fill="#f0c45a"/>
      <g class="mystery-lid">
        <rect x="22" y="38" width="116" height="30" rx="8" fill="#f0a04a" stroke="#c47a32" stroke-width="4"/>
        <rect x="74" y="38" width="14" height="30" fill="#ffe08a"/>
        <path d="M80 38 C68 18 48 22 54 38 C62 28 74 28 80 38 Z" fill="#e06a50"/>
        <path d="M80 38 C92 18 112 22 106 38 C98 28 86 28 80 38 Z" fill="#e06a50"/>
        <circle cx="80" cy="40" r="7" fill="#fff3b0" stroke="#c47a32" stroke-width="2"/>
        <text class="mystery-mark" x="80" y="32" text-anchor="middle" font-size="22" font-weight="800" fill="#4a3226">?</text>
      </g>
    </svg>
    <div class="mystery-reveal">${reveal}</div>
  </div>`;
}

function pieceArt(name) {
  if (name === "ramp") return rampArt();
  if (name === "wall") return wallArt();
  return roofArt();
}

function bowlSvg(color, opts = {}) {
  if (color === "#3a7ca5") return applySize(photo("bowl-blue", "blue bowl"), opts.size);
  if (color === "#e8b44c") return applySize(photo("bowl-yellow", "yellow bowl"), opts.size);
  return applySize(photo("bowl", "bowl"), opts.size);
}

function plateSvg() {
  return photo("plate", "plate");
}

function stoveArt() {
  return photo("stove", "stove");
}

function bedArt() {
  return photo("bed", "bed");
}

function tableArt() {
  return photo("table", "table");
}

function cupboardArt() {
  return photo("cupboard", "kitchen cupboard");
}

function fridgeArt() {
  return photo("fridge", "fridge");
}

function washHandsArt() {
  return photo("wash-hands", "sink for washing hands");
}

function tubArt() {
  return photo("bath", "bathtub");
}

function pajamaArt() {
  return photo("pajamas", "pajamas");
}

function shirtArt() {
  return photo("shirt", "shirt");
}

function pantsArt() {
  return photo("pants", "pants");
}

function sockArt() {
  return photo("socks", "socks");
}

function appleArt() {
  return photo("apple", "apple");
}

function dumplingArt() {
  return photo("dumplings", "dumplings");
}

function riceArt() {
  return photo("rice", "rice");
}

function noodlesArt() {
  return photo("noodles", "noodles");
}

function bananaArt() {
  return photo("banana", "banana");
}

function breadArt() {
  return photo("bread", "bread");
}

function soupArt() {
  return photo("soup", "soup");
}

function cupArt() {
  return photo("cup", "cup");
}

function toyBallArt() {
  return photo("ball", "ball");
}

function teddyArt() {
  return photo("teddy", "teddy bear");
}

function toysArt() {
  return photo("toys", "toys");
}

function spoonArt() {
  return photo("spoon", "spoon");
}

function milkArt() {
  return photo("milk", "milk");
}

function pillowArt() {
  return photo("pillow", "pillow");
}

function miniBowl(color) {
  if (color === "#3a7ca5") return photo("bowl-blue", "bowl", "mini");
  if (color === "#e8b44c") return photo("bowl-yellow", "bowl", "mini");
  if (color === "#c9c2b0") return photo("plate", "plate", "mini");
  return photo("bowl", "bowl", "mini");
}

function miniDumpling() {
  return photo("dumplings", "dumplings", "mini");
}

function miniApple() {
  return photo("apple", "apple", "mini");
}

function houseMini(i, color) {
  if (color) return miniBowl(color);
  const foods = ["bowl", "plate", "cup", "rice", "noodles", "dumplings", "apple", "banana", "bread", "soup"];
  const alts = ["bowl", "dinner plate", "cup", "rice", "noodles", "dumplings", "apple", "banana", "bread", "soup"];
  const idx = i % foods.length;
  return photo(foods[idx], alts[idx], "mini");
}

function houseCluster(n, color) {
  const dense = n > 12 ? " dense" : "";
  return `<div class="mini-grid${dense}">${Array.from({ length: n }, (_, i) =>
    color ? miniBowl(color) : houseMini(i)
  ).join("")}</div>`;
}

function bowlPileArt(n, color) {
  return `<div class="pile-art">
    ${tableArt()}
    ${houseCluster(n, color)}
  </div>`;
}

function houseSameAmountArt() {
  return `<div class="same-art">
    ${houseCluster(3, "#8a7d6b")}
    <span class="eq-mark" aria-hidden="true">=</span>
    ${houseCluster(3, "#8a7d6b")}
  </div>`;
}

function housePieceArt(name) {
  if (name === "bed") return bedArt();
  if (name === "cupboard") return cupboardArt();
  return tableArt();
}

function houseWhereChoiceArt(cls) {
  if (cls === "fridge") return photo("fridge", "in the fridge");
  if (cls === "sink") return photo("wash-hands", "at the sink");
  if (cls === "bed-on") return photo("bed", "on the bed");
  if (cls === "stove") return photo("stove", "on the stove");
  const names = { on: "bowl-on", under: "bowl-under", in: "bowl-in", next: "bowl-next" };
  const alts = { on: "bowl on the table", under: "bowl under the bed", in: "bowl in the cupboard", next: "bowl next to the table" };
  return storyPhoto(names[cls] || "bowl-on", alts[cls] || "bowl");
}

function garageWorldArt() {
  return photo("world-garage", "cars in a garage", "world");
}

function houseWorldArt() {
  return photo("world-house", "kitchen at home", "world");
}

function storybookWorldArt() {
  return photo("world-storybook", "picture books on a shelf", "world");
}

function sbImg(bookId, file, alt, extraClass) {
  const cls = extraClass ? `photo ${extraClass}` : "photo scene";
  return `<img class="${cls}" src="photos/storybook/${bookId}/${file}.jpg?v=${PHOTO_V}" alt="${escapeHtml(alt || "")}" />`;
}

function sbRefArt(ref) {
  if (!ref) return "";
  return sbImg(ref.book, ref.file, "", "scene");
}

function hearIcon() {
  return `<svg class="hear-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M3 9v6h4l5 4V5L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/>
  </svg>`;
}

function sameAmountArt() {
  return `<div class="same-art">
    ${cluster(3, "#8a7d6b")}
    <span class="eq-mark" aria-hidden="true">=</span>
    ${cluster(3, "#8a7d6b")}
  </div>`;
}

function garagePileArt(n, color) {
  return `<div class="pile-art">
    ${garageArt()}
    ${cluster(n, color)}
  </div>`;
}

function whereChoiceArt(cls) {
  if (cls === "road") return photo("road", "on the road");
  if (cls === "station") return photo("fire-station", "at the fire station");
  if (cls === "wash") return photo("wash", "at the car wash");
  if (cls === "ramp-on") return photo("ramp", "on the ramp");
  const names = { in: "where-in", on: "where-on", under: "where-under", next: "where-next" };
  const alts = { in: "car in the garage", on: "car on the roof", under: "car under the ramp", next: "car next to the garage" };
  return storyPhoto(names[cls] || "where-in", alts[cls] || "car");
}

function miniCar(color) {
  if (color === "#d94b3a") return photo("sports-car", "sports car", "mini");
  if (color === "#3a7ca5") return photo("car-blue", "blue car", "mini");
  if (color === "#e8b44c") return photo("car-yellow", "yellow car", "mini");
  if (color === "#c9c2b0") return photo("car-red", "family car", "mini");
  if (color === "#5a9e6f") return photo("pickup", "pickup truck", "mini");
  if (color === "#7a5ea6") return photo("fire-truck", "fire truck", "mini");
  if (color === "#ffffff") return photo("pickup-white", "white pickup truck", "mini");
  return photo("car-blue", "car", "mini");
}

function cluster(n, color) {
  const dense = n > 12 ? " dense" : "";
  const mix = ["fire-truck", "pickup", "sports-car", "car-blue", "car-yellow", "pickup-red", "pickup-white", "pickup-yellow", "car-white"];
  const alts = ["fire truck", "pickup truck", "sports car", "blue car", "yellow car", "red pickup truck", "white pickup truck", "yellow pickup truck", "white car"];
  return `<div class="mini-grid${dense}">${Array.from({ length: n }, (_, i) =>
    color ? miniCar(color) : photo(mix[i % mix.length], alts[i % alts.length], "mini")
  ).join("")}</div>`;
}

function wheelDots(n) {
  return `<div class="wheel-row">${Array.from({ length: n }, () => photo("wheel", "wheel", "mini")).join("")}</div>`;
}

function caption(text) {
  return `<div class="cap">${escapeHtml(text)}</div>`;
}

function lookCard(inner) {
  const kicker = inStoryTimeUi() ? "看一看" : "Look · 看一看";
  return `<section class="look-zone">
    <p class="look-kicker">${kicker}</p>
    <div class="listen-card look-card">${inner}</div>
  </section>`;
}

function renderStem(stem) {
  if (!stem || !stem.length) return "";
  return `<div class="stem-row">${stem.map((s) => `<div class="stem-card">${s}</div>`).join("")}</div>`;
}

function compactYes(again, againLabel, yesEn, yesZh, heading) {
  addStarOnce();
  return `<div class="play-actions celebrate compact">
    <h2>${escapeHtml(heading || yesEn)}</h2>
    ${langButtons(yesEn, yesZh)}
    <button class="big" type="button" data-action="${again}">${againLabel}</button>
    <button class="big ghost" type="button" data-go="home">All done · 好了</button>
  </div>`;
}

function compactYesZh(again, againLabel, yesZh, heading) {
  addStarOnce();
  return `<div class="play-actions celebrate compact">
    <h2>${escapeHtml(heading || yesZh)}</h2>
    ${zhHearButton(yesZh)}
    <button class="big" type="button" data-action="${again}">${againLabel}</button>
    <button class="big ghost" type="button" data-go="home">好了</button>
  </div>`;
}

function splitBand(mode) {
  const below =
    mode === "place"
      ? inStoryTimeUi()
        ? "请把图放到下面"
        : "请把图放到下面 · Put the pictures below"
      : inStoryTimeUi()
        ? "请点下面"
        : "请点下面 · Tap below";
  return `<div class="play-split" role="separator">
    <span class="split-above">题目</span>
    <span class="split-below">${below}</span>
  </div>`;
}

function answerWell(inner) {
  return `<section class="answer-well">${inner}</section>`;
}

function playLayout(lookInner, answerInner, mode) {
  return `<div class="play-fit">${lookCard(lookInner)}${splitBand(mode || "tap")}${answerWell(answerInner)}</div>`;
}

function clearFxLayer(sel) {
  document.querySelectorAll(sel).forEach((el) => el.remove());
}

function celebrate(kind) {
  if (kind === "wrong") {
    playWrongRain();
    return;
  }
  playCorrectBurst();
}

function celebrateWin() {
  celebrate("correct");
}

function playWrongRain() {
  clearFxLayer(".fx-layer.fx-wrong");
  const layer = document.createElement("div");
  layer.className = "fx-layer fx-wrong";
  layer.setAttribute("aria-hidden", "true");
  const n = 20;
  for (let i = 0; i < n; i += 1) {
    const drop = document.createElement("span");
    drop.className = "cry-drop";
    drop.textContent = "😢";
    drop.style.left = `${4 + Math.random() * 92}%`;
    drop.style.animationDelay = `${Math.random() * 0.35}s`;
    drop.style.fontSize = `${28 + Math.random() * 26}px`;
    drop.style.setProperty("--drift", `${Math.random() * 40 - 20}px`);
    layer.appendChild(drop);
  }
  document.body.appendChild(layer);
  window.setTimeout(() => layer.remove(), 1600);
}

function playCorrectBurst() {
  clearFxLayer(".fx-smile");
  const smile = document.createElement("div");
  smile.className = "fx-smile";
  smile.setAttribute("aria-hidden", "true");
  smile.innerHTML = `<span class="fx-smile-bundle"><span class="fx-smile-face">😄</span><span class="fx-smile-thumb">👍</span></span>`;
  document.body.appendChild(smile);
  window.setTimeout(() => smile.remove(), 2000);
  if (document.querySelector("canvas.fireworks-layer")) return;
  const canvas = document.createElement("canvas");
  canvas.className = "fireworks-layer";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  function sizeCanvas() {
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  sizeCanvas();
  const widthOf = () => canvas.width / dpr;
  const heightOf = () => canvas.height / dpr;
  const colors = ["#ffd166", "#ef476f", "#06d6a0", "#118ab2", "#f4a261", "#fff1a8", "#ffffff"];
  const bits = [];
  function burst(x, y) {
    const n = 40 + Math.floor(Math.random() * 16);
    for (let i = 0; i < n; i += 1) {
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.24;
      const sp = 2.4 + Math.random() * 5.8;
      bits.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 1.4,
        g: 0.07 + Math.random() * 0.05,
        life: 1,
        decay: 0.011 + Math.random() * 0.01,
        size: 3 + Math.random() * 4,
        color: colors[i % colors.length],
        spark: Math.random() < 0.4,
      });
    }
  }
  const t0 = performance.now();
  burst(widthOf() * 0.5, heightOf() * 0.36);
  burst(widthOf() * 0.22, heightOf() * 0.26);
  burst(widthOf() * 0.78, heightOf() * 0.28);
  let extra = 0;
  function frame(now) {
    const elapsed = now - t0;
    const w = widthOf();
    const h = heightOf();
    ctx.clearRect(0, 0, w, h);
    if (elapsed < 900 && extra < 3 && elapsed > extra * 280 + 180) {
      extra += 1;
      burst(w * (0.18 + Math.random() * 0.64), h * (0.2 + Math.random() * 0.28));
    }
    bits.forEach((p) => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) return;
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      if (p.spark) {
        ctx.fillRect(p.x, p.y, p.size * 0.4, p.size * 1.7);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
    if (elapsed < 2100) requestAnimationFrame(frame);
    else canvas.remove();
  }
  requestAnimationFrame(frame);
}

function choiceIsCorrect() {
  return (round.choices || []).some((c) => c.id === round.picked && c.ok);
}

function sequenceIsCorrect() {
  if (!round) return false;
  if (round.kind === "storybook" && round.phase === "sequence") {
    const order = round.book.seq;
    return round.slots.every(Boolean) && round.slots.every((id, i) => id === order[i]);
  }
  if (round.kind !== "sequence" || !round.story) return false;
  const story = round.story;
  return round.slots.every(Boolean) && round.slots.every((id, i) => id === story.beats[i].id);
}

function sequencePlace(beatId, slotIndex) {
  const from = round.slots.indexOf(beatId);
  const occupant = round.slots[slotIndex];
  if (from === slotIndex) return;
  if (from !== -1) {
    round.slots[from] = occupant;
    round.slots[slotIndex] = beatId;
  } else {
    round.slots[slotIndex] = beatId;
  }
  round.selectedBeat = null;
}

/* Prefer iPad Spoken Content child voice Yue (普通话小孩音), then Meijia. Never force zh-TW. */
const TINGTING_NAME_HINTS = ["ting-ting", "tingting", "ting ting", "婷婷"];
const ZH_CHILD_NAME_HINTS = ["child", "kid", "toddler", "xiaohai", "tongsheng"];
const ZH_MALE_NAME_HINTS = [
  "liang",
  "yunjian",
  "yun-jian",
  "kangkang",
  "kang-kang",
  "kang kang",
  "li-mu",
  "limu",
  "li mu",
  "yunyang",
  "yun-yang",
  "yunxi",
  "xiaoming",
  "eddy",
  "grandpa",
  "reed",
  "rocko",
];

const ZH_RATE = 0.92;
const ZH_PITCH = 1;
const EN_RATE = 0.95;

let cachedSpeechVoices = [];
let speechVoicesSettled = false;
const speechVoiceWaiters = [];

function foldVoiceName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[‐–—_]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function voiceLangTag(voice) {
  return String((voice && voice.lang) || "")
    .toLowerCase()
    .replace(/_/g, "-");
}

function isZhVoice(voice) {
  return voiceLangTag(voice).startsWith("zh");
}

function isZhCnVoice(voice) {
  const lang = voiceLangTag(voice);
  return lang === "zh" || lang.startsWith("zh-cn");
}

function nameHasHint(name, hints) {
  return hints.some((hint) => name.includes(hint));
}

function voiceKey(voice) {
  if (!voice) return "";
  return String(voice.voiceURI || `${voice.name || ""}||${voice.lang || ""}`);
}

function isCantoneseVoice(voice) {
  const raw = String((voice && voice.name) || "");
  const name = foldVoiceName(raw);
  const lang = voiceLangTag(voice);
  return (
    lang.startsWith("zh-hk") ||
    lang.startsWith("zh-yue") ||
    name.includes("cantonese") ||
    raw.includes("粤") ||
    raw.includes("粵")
  );
}

function isLikelyMaleVoice(voice) {
  const name = foldVoiceName(voice && voice.name);
  if (name.includes("female") || name.includes("woman")) return false;
  return nameHasHint(name, ZH_MALE_NAME_HINTS) || /\bmale\b/.test(name) || /\bman\b/.test(name);
}

function isYueVoice(voice) {
  const raw = String((voice && voice.name) || "");
  const uri = String((voice && voice.voiceURI) || "");
  if (/yue/i.test(raw) || raw.includes("月") || raw.includes("玥")) return true;
  return /(?:^|[._-])yue(?:[._-]|$)/i.test(uri) && !/zh-yue|zh_yue|cantonese/i.test(uri);
}

function isChildLikeZhVoice(voice) {
  if (!isZhVoice(voice) || isCantoneseVoice(voice) || isYueVoice(voice)) return false;
  const raw = String((voice && voice.name) || "");
  const name = foldVoiceName(raw);
  if (/小孩|儿童|兒童|童声|童聲|童音|小朋友|小孩音/.test(raw)) return true;
  return nameHasHint(name, ZH_CHILD_NAME_HINTS);
}

function isMeijiaVoice(voice) {
  const raw = String((voice && voice.name) || "");
  const name = foldVoiceName(raw);
  return raw.includes("美佳") || nameHasHint(name, ["meijia", "mei-jia", "mei jia"]);
}

function chineseVoices(voices) {
  return (voices || []).filter((voice) => isZhVoice(voice) || isYueVoice(voice));
}

function isChineseFirstVoice(voice) {
  return isZhVoice(voice) || isYueVoice(voice);
}

function voiceOptionLabel(voice) {
  const name = String((voice && voice.name) || "").trim() || "(unnamed)";
  const lang = String((voice && voice.lang) || "").trim();
  return lang ? `${name} · ${lang}` : name;
}

function scorePreferredZhVoice(voice) {
  const raw = String((voice && voice.name) || "");
  const name = foldVoiceName(raw);
  const lang = voiceLangTag(voice);
  let score = 0;

  if (isYueVoice(voice)) {
    score += 400;
    if (isZhCnVoice(voice)) score += 40;
  }
  if (isChildLikeZhVoice(voice)) {
    score += 220;
    if (isZhCnVoice(voice)) score += 20;
  }
  if (isMeijiaVoice(voice)) score += 160;
  if (raw.includes("曉佳") || raw.includes("晓佳") || nameHasHint(name, ["xiaojia", "xiao-jia", "xiao jia"])) {
    score += 70;
  }
  if (nameHasHint(name, TINGTING_NAME_HINTS) || raw.includes("婷婷")) score += 40;
  if (isZhCnVoice(voice)) score += 16;
  else if (lang.startsWith("zh-tw")) score += 10;
  else if (isCantoneseVoice(voice)) score -= 40;
  else if (lang.startsWith("zh")) score += 6;

  if (name.includes("female") || name.includes("woman")) score += 20;
  if (isLikelyMaleVoice(voice)) score -= 100;
  if (voice.localService) score += 6;
  if (name.includes("enhanced") || name.includes("premium") || name.includes("neural")) score += 8;
  return score;
}

function pickPreferredZhVoice(voices) {
  const all = voices || [];
  const saved = String((loadState().speechVoiceURI || "").trim());
  if (saved) {
    const match = all.find((voice) => voiceKey(voice) === saved);
    if (match) return match;
  }
  const ranked = chineseVoices(all).slice().sort((a, b) => {
    const diff = scorePreferredZhVoice(b) - scorePreferredZhVoice(a);
    if (diff) return diff;
    return String(a.name || "").localeCompare(String(b.name || ""), "zh");
  });
  return ranked[0] || null;
}

function allVoicesSorted(voices) {
  return (voices || []).slice().sort((a, b) => {
    const aZh = isChineseFirstVoice(a) ? 1 : 0;
    const bZh = isChineseFirstVoice(b) ? 1 : 0;
    if (aZh !== bZh) return bZh - aZh;
    if (aZh) {
      const diff = scorePreferredZhVoice(b) - scorePreferredZhVoice(a);
      if (diff) return diff;
    }
    const nameCmp = String(a.name || "").localeCompare(String(b.name || ""), "zh");
    if (nameCmp) return nameCmp;
    return String(a.lang || "").localeCompare(String(b.lang || ""));
  });
}

function renderSpeechVoiceOptions() {
  const voices = allVoicesSorted(collectSpeechVoices());
  if (!voices.length) {
    return `<option value="">正在读取本机声音…</option>`;
  }
  const saved = String((loadState().speechVoiceURI || "").trim());
  const savedOk = saved && voices.some((voice) => voiceKey(voice) === saved);
  const selectedKey = savedOk ? saved : voiceKey(pickPreferredZhVoice(voices));
  return voices
    .map((voice) => {
      const key = voiceKey(voice);
      const label = voiceOptionLabel(voice);
      return `<option value="${escapeAttr(key)}" ${key === selectedKey ? "selected" : ""}>${escapeHtml(label)}</option>`;
    })
    .join("");
}

function notifySpeechVoiceWaiters(voices) {
  while (speechVoiceWaiters.length) speechVoiceWaiters.shift()(voices);
}

function collectSpeechVoices() {
  if (!window.speechSynthesis) return [];
  const list = speechSynthesis.getVoices() || [];
  if (list.length) {
    cachedSpeechVoices = list;
    speechVoicesSettled = true;
    notifySpeechVoiceWaiters(list);
  }
  return cachedSpeechVoices.length ? cachedSpeechVoices : list;
}

function whenSpeechVoicesReady() {
  const now = collectSpeechVoices();
  if (speechVoicesSettled || now.length) return Promise.resolve(now);
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(collectSpeechVoices()), 1200);
    speechVoiceWaiters.push((voices) => {
      clearTimeout(timer);
      resolve(voices);
    });
  });
}

function refreshSettingsVoiceSelect() {
  if (view !== "settings") return;
  const select = document.querySelector('select[data-set="speechVoiceURI"]');
  if (!select) {
    render();
    return;
  }
  const next = renderSpeechVoiceOptions();
  if (select.innerHTML === next) return;
  select.innerHTML = next;
}

function warmSpeechVoices() {
  if (!window.speechSynthesis) return;
  collectSpeechVoices();
  const onChange = () => {
    collectSpeechVoices();
    refreshSettingsVoiceSelect();
  };
  if (typeof speechSynthesis.addEventListener === "function") {
    speechSynthesis.addEventListener("voiceschanged", onChange);
  } else {
    speechSynthesis.onvoiceschanged = onChange;
  }
  /* iOS Safari often fires voiceschanged late, or not at all. */
  [300, 1000].forEach((ms) => {
    setTimeout(onChange, ms);
  });
}

/* Unlock speak() on this tap so iOS still accepts speech after we wait for voices. */
function unlockSpeechForGesture() {
  if (!window.speechSynthesis) return;
  try {
    const unlock = new SpeechSynthesisUtterance("");
    unlock.volume = 0;
    speechSynthesis.speak(unlock);
    speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}

/* Join a story page into ONE utterance. 。 is a slight pause — never a new speak() per sentence. */
function fluentZhText(text) {
  const raw = String(text || "")
    .replace(/\s+/g, "")
    .trim();
  if (!raw) return "";
  const chunks = raw
    .split(/[。！？!?]+/)
    .map((part) => part.replace(/^[、，,；;]+|[、，,；;]+$/g, ""))
    .filter(Boolean);
  if (chunks.length <= 1) return raw;
  return `${chunks.join("。")}。`;
}

let speakJob = 0;

function speakUtterance(text, lang, voices, opts) {
  const job = ++speakJob;
  const raw = String(text || "").trim();
  const spoken = lang === "zh" ? fluentZhText(raw) : raw;
  if (!spoken) {
    if (opts && typeof opts.onend === "function") opts.onend();
    return;
  }
  const u = new SpeechSynthesisUtterance(spoken);
  if (lang === "zh") {
    const voice = pickPreferredZhVoice(voices);
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang || "zh-CN";
    } else {
      u.lang = "zh-CN";
    }
    u.rate = ZH_RATE;
    u.pitch = ZH_PITCH;
  } else {
    u.lang = "en-US";
    u.rate = EN_RATE;
    u.pitch = 1;
  }
  const finish = () => {
    if (job !== speakJob) return;
    if (opts && typeof opts.onend === "function") opts.onend();
  };
  u.onend = finish;
  u.onerror = finish;
  const start = () => {
    if (job !== speakJob) return;
    speechSynthesis.speak(u);
  };
  if (!opts || opts.cancel !== false) {
    speechSynthesis.cancel();
    /* iOS drops speak() in the same tick as cancel(). */
    setTimeout(start, 60);
    return;
  }
  start();
}

let storyReadToken = 0;

function cancelStoryRead() {
  storyReadToken += 1;
  speakJob += 1;
  if (window.speechSynthesis) speechSynthesis.cancel();
}

function speakThen(text, lang, token) {
  return new Promise((resolve) => {
    if (token !== storyReadToken) {
      resolve();
      return;
    }
    const settings = loadState();
    if (!settings.speech || !window.speechSynthesis) {
      resolve();
      return;
    }
    const finish = () => resolve();
    const voices = collectSpeechVoices();
    if (lang !== "zh" || voices.length) {
      speakUtterance(text, lang, voices, { cancel: false, onend: finish });
      return;
    }
    unlockSpeechForGesture();
    whenSpeechVoicesReady().then((readyVoices) => {
      if (token !== storyReadToken) {
        resolve();
        return;
      }
      speakUtterance(text, lang, readyVoices, { cancel: false, onend: finish });
    });
  });
}

async function readStoryBookAloud(whole) {
  const token = ++storyReadToken;
  if (!round || round.kind !== "storybook" || round.phase !== "read") return;
  const book = round.book;
  const pages = whole ? book.pages.map((_, i) => i) : [round.page];
  if (window.speechSynthesis) speechSynthesis.cancel();
  await new Promise((resolve) => setTimeout(resolve, 60));
  for (let n = 0; n < pages.length; n += 1) {
    const i = pages[n];
    if (token !== storyReadToken || !round || round.phase !== "read") return;
    if (round.page !== i) {
      round.page = i;
      render();
    }
    const page = book.pages[i];
    await speakThen(fluentZhText(page.zh), "zh", token);
  }
}

function speak(text, lang) {
  const settings = loadState();
  if (!settings.speech || !window.speechSynthesis) return;
  const voices = collectSpeechVoices();
  if (lang !== "zh" || voices.length) {
    speakUtterance(text, lang, voices);
    return;
  }
  unlockSpeechForGesture();
  whenSpeechVoicesReady().then((readyVoices) => {
    speakUtterance(text, lang, readyVoices);
  });
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function loadRecentIds() {
  const ids = loadState().recentIds;
  return Array.isArray(ids) ? ids : [];
}

function rememberPlayed(id) {
  if (!id) return;
  const recent = loadRecentIds().filter((x) => x !== id);
  recent.push(id);
  saveState({ recentIds: recent.slice(-18) });
}

function emptyVariantMemory() {
  return {
    garage: { story: [], park: [], bay: [], build: [], box: [] },
    house: { story: [], park: [], bay: [], build: [], box: [] },
    storybook: { story: [] },
  };
}

function loadVariantMemory() {
  const raw = loadState().recentVariants;
  const base = emptyVariantMemory();
  if (!raw || typeof raw !== "object") return base;
  ["garage", "house", "storybook"].forEach((theme) => {
    if (!raw[theme] || typeof raw[theme] !== "object") return;
    ["story", "park", "bay", "build", "box"].forEach((box) => {
      if (Array.isArray(raw[theme][box])) base[theme][box] = raw[theme][box].slice(-12);
    });
  });
  return base;
}

const lastVariant = loadVariantMemory();

function rememberVariant(theme, box, kind) {
  if (!lastVariant[theme]) return;
  const recent = (lastVariant[theme][box] || []).filter((k) => k !== kind).concat(kind).slice(-12);
  lastVariant[theme][box] = recent;
  const stored = loadVariantMemory();
  stored[theme][box] = recent;
  saveState({ recentVariants: stored });
}

function pickFresh(items, getId) {
  const list = (items || []).filter(Boolean);
  if (!list.length) return null;
  const idOf =
    getId ||
    ((item, i) =>
      item.id ||
      `anon-${i}-${String(item.promptEn || item.titleEn || item.sentenceEn || item.en || "").slice(0, 28)}`);
  const recent = loadRecentIds().slice(-RECENT_AVOID);
  const tagged = list.map((item, i) => ({ item, id: String(idOf(item, i)) }));
  let pool = tagged.filter((row) => !recent.includes(row.id));
  if (!pool.length) {
    const last = recent[recent.length - 1];
    pool = tagged.filter((row) => row.id !== last);
  }
  if (!pool.length) pool = tagged;
  const picked = pickOne(pool);
  rememberPlayed(picked.id);
  return picked.item;
}

function pickVariant(box, kinds) {
  const theme = themeId();
  const prev = lastVariant[theme] && lastVariant[theme][box];
  const recent = Array.isArray(prev) ? prev : prev ? [prev] : [];
  const avoid = recent.slice(-2);
  let pool = kinds.filter((k) => !avoid.includes(k));
  if (!pool.length) {
    const last = recent[recent.length - 1];
    pool = kinds.filter((k) => k !== last);
  }
  if (!pool.length) pool = kinds.slice();
  const kind = pickOne(pool);
  rememberVariant(theme, box, kind);
  return kind;
}

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

const STORIES = [
  {
    id: "sleep",
    titleEn: "The sleepy red sports car",
    titleZh: "困了的红色跑车",
    parentEn: "Sit together. You tell it first. Then he puts the pictures in order and says what happened.",
    parentZh: "一起坐。你先讲，再请他给图片排队，说说发生了什么。",
    beats: [
      {
        id: "a",
        en: "First the red sports car drives on the road.",
        zh: "先：红色跑车在路上开。",
        art: storyArt("sleep-1", "red sports car driving on the road", "sports car 跑车"),
      },
      {
        id: "b",
        en: "Then the sports car goes up the ramp.",
        zh: "然后：跑车开上坡道。",
        art: storyArt("sleep-2", "red sports car driving up a ramp", "ramp 坡道"),
      },
      {
        id: "c",
        en: "Last the sports car parks in the garage. Night-night.",
        zh: "最后：跑车停进车库。晚安。",
        art: storyArt("sleep-3", "red sports car parked in the garage at night", "garage 车库"),
      },
    ],
  },
  {
    id: "wash",
    titleEn: "The dusty pickup truck",
    titleZh: "脏脏的皮卡",
    parentEn: "Three pictures: dusty pickup, car wash, clean pickup. First / then / last.",
    parentZh: "三张图：脏皮卡、洗车、干净皮卡。先 / 然后 / 最后。",
    beats: [
      {
        id: "a",
        en: "First the pickup truck is dusty.",
        zh: "先：皮卡脏了。",
        art: storyArt("wash-1", "dusty pickup truck", "dusty pickup 脏皮卡"),
      },
      {
        id: "b",
        en: "Then the pickup goes through the car wash. Splash!",
        zh: "然后：皮卡去洗车。哗啦！",
        art: storyArt("wash-2", "pickup truck in the car wash", "car wash 洗车"),
      },
      {
        id: "c",
        en: "Last the pickup truck is shiny and happy.",
        zh: "最后：皮卡亮亮的，开心。",
        art: storyArt("wash-3", "shiny clean pickup truck", "shiny pickup 亮皮卡"),
      },
    ],
  },
  {
    id: "friend",
    titleEn: "Yellow car finds the fire truck",
    titleZh: "黄色小车找到消防车",
    parentEn: "Somebody wanted a friend. Then they parked together.",
    parentZh: "有人想找朋友，然后它们停在一起。",
    beats: [
      {
        id: "a",
        en: "First the yellow car is alone.",
        zh: "先：黄色小车自己一个。",
        art: storyArt("friend-1", "yellow car alone", "yellow car 黄色小车"),
      },
      {
        id: "b",
        en: "Then a fire truck waves hello.",
        zh: "然后：消防车打招呼。",
        art: storyArt("friend-2", "yellow car meets a fire truck", "fire truck 消防车"),
      },
      {
        id: "c",
        en: "Last they park next to each other.",
        zh: "最后：它们停在旁边。",
        art: storyArt("friend-3", "yellow car parked next to a fire truck", "next to 旁边"),
      },
    ],
  },
  {
    id: "gas",
    titleEn: "Fire truck goes home",
    titleZh: "消防车回家",
    parentEn: "Four pictures: fire truck, keys, road, fire station. You narrate; he lines them up.",
    parentZh: "这次四张图：消防车、钥匙、马路、消防站。你讲，他排队。",
    beats: [
      {
        id: "a",
        en: "First the fire truck is ready.",
        zh: "先：消防车准备好了。",
        art: storyArt("gas-1", "fire truck ready", "fire truck 消防车"),
      },
      {
        id: "b",
        en: "Next Dad uses the keys.",
        zh: "接着：爸爸用钥匙。",
        art: storyArt("gas-2", "keys with the fire truck", "keys 钥匙"),
      },
      {
        id: "c",
        en: "Then the fire truck drives on the road.",
        zh: "然后：消防车在路上开。",
        art: storyArt("gas-3", "fire truck driving on the road", "road 马路"),
      },
      {
        id: "d",
        en: "Last the fire truck parks at the fire station.",
        zh: "最后：消防车停进消防站。",
        art: storyArt("gas-4", "fire truck at the fire station", "fire station 消防站"),
      },
    ],
  },
  {
    id: "two-pickups",
    titleEn: "Two pickup trucks",
    titleZh: "两辆皮卡",
    parentEn: "Dark pickup, then white pickup, then they park together. First / then / last.",
    parentZh: "深色皮卡，然后白色皮卡，然后一起停。先 / 然后 / 最后。",
    beats: [
      {
        id: "a",
        en: "First the dark pickup truck is ready.",
        zh: "先：深色皮卡准备好了。",
        art: pickupArt() + caption("pickup 皮卡"),
      },
      {
        id: "b",
        en: "Then the white pickup truck comes too.",
        zh: "然后：白色皮卡也来了。",
        art: pickupWhiteArt() + caption("white pickup 白色皮卡"),
      },
      {
        id: "c",
        en: "Last they park together in the garage.",
        zh: "最后：它们一起停进车库。",
        art: garageArt() + caption("garage 车库"),
      },
    ],
  },
  {
    id: "white-home",
    titleEn: "White pickup goes home",
    titleZh: "白色皮卡回家",
    parentEn: "White pickup, keys, garage. You name the white pickup. He lines them up.",
    parentZh: "白色皮卡、钥匙、车库。你说出白色皮卡。他排队。",
    beats: [
      {
        id: "a",
        en: "First the white pickup truck is waiting.",
        zh: "先：白色皮卡在等。",
        art: pickupWhiteArt() + caption("white pickup 白色皮卡"),
      },
      {
        id: "b",
        en: "Next Dad uses the keys.",
        zh: "接着：爸爸用钥匙。",
        art: keyArt() + caption("keys 钥匙"),
      },
      {
        id: "c",
        en: "Last the white pickup parks in the garage.",
        zh: "最后：白色皮卡停进车库。",
        art: garageArt() + caption("garage 车库"),
      },
    ],
  },
  {
    id: "sports-keys",
    titleEn: "Sports car needs the keys",
    titleZh: "跑车需要钥匙",
    parentEn: "Sports car, keys, garage. First / then / last.",
    parentZh: "跑车、钥匙、车库。先 / 然后 / 最后。",
    beats: [
      {
        id: "a",
        en: "First the red sports car is ready.",
        zh: "先：红色跑车准备好了。",
        art: sportsCarArt() + caption("sports car 跑车"),
      },
      {
        id: "b",
        en: "Then Dad finds the keys.",
        zh: "然后：爸爸找到钥匙。",
        art: keyArt() + caption("keys 钥匙"),
      },
      {
        id: "c",
        en: "Last the sports car parks in the garage.",
        zh: "最后：跑车停进车库。",
        art: garageArt() + caption("garage 车库"),
      },
    ],
  },
  {
    id: "yellow-home",
    titleEn: "Yellow car goes home",
    titleZh: "黄色小车回家",
    parentEn: "Yellow car, road, garage. First / then / last.",
    parentZh: "黄色小车、马路、车库。先 / 然后 / 最后。",
    beats: [
      {
        id: "a",
        en: "First the yellow car is ready.",
        zh: "先：黄色小车准备好了。",
        art: photo("car-yellow", "yellow car") + caption("yellow car 黄车"),
      },
      {
        id: "b",
        en: "Then the yellow car drives on the road.",
        zh: "然后：黄色小车在路上开。",
        art: photo("road", "road") + caption("road 马路"),
      },
      {
        id: "c",
        en: "Last the yellow car parks in the garage.",
        zh: "最后：黄色小车停进车库。",
        art: garageArt() + caption("garage 车库"),
      },
    ],
  },
  {
    id: "night-garage",
    titleEn: "Night-night in the garage",
    titleZh: "车库里说晚安",
    parentEn: "Moon, sports car, garage. Night time.",
    parentZh: "月亮、跑车、车库。晚上。",
    beats: [
      {
        id: "a",
        en: "First the moon is out.",
        zh: "先：月亮出来了。",
        art: moonArt() + caption("moon 月亮"),
      },
      {
        id: "b",
        en: "Then the red sports car is sleepy.",
        zh: "然后：红色跑车困了。",
        art: sportsCarArt() + caption("sports car 跑车"),
      },
      {
        id: "c",
        en: "Last it sleeps in the garage.",
        zh: "最后：它在车库睡觉。",
        art: garageArt() + caption("garage 车库"),
      },
    ],
  },
  {
    id: "ramp-ride",
    titleEn: "Pickup goes up",
    titleZh: "皮卡开上去",
    parentEn: "Pickup, ramp, garage. First / then / last.",
    parentZh: "皮卡、坡道、车库。先 / 然后 / 最后。",
    beats: [
      {
        id: "a",
        en: "First the pickup truck is waiting.",
        zh: "先：皮卡在等。",
        art: pickupArt() + caption("pickup 皮卡"),
      },
      {
        id: "b",
        en: "Then it drives up the ramp.",
        zh: "然后：它开上坡道。",
        art: rampArt() + caption("ramp 坡道"),
      },
      {
        id: "c",
        en: "Last it parks in the garage.",
        zh: "最后：它停进车库。",
        art: garageArt() + caption("garage 车库"),
      },
    ],
  },
  {
    id: "fire-road",
    titleEn: "Fire truck on the road",
    titleZh: "消防车上路",
    parentEn: "Fire truck, road, fire station.",
    parentZh: "消防车、马路、消防站。",
    beats: [
      {
        id: "a",
        en: "First the fire truck is ready.",
        zh: "先：消防车准备好了。",
        art: fireTruckArt() + caption("fire truck 消防车"),
      },
      {
        id: "b",
        en: "Then it drives on the road.",
        zh: "然后：它在路上开。",
        art: photo("road", "road") + caption("road 马路"),
      },
      {
        id: "c",
        en: "Last it parks at the fire station.",
        zh: "最后：它停进消防站。",
        art: fireStationArt() + caption("fire station 消防站"),
      },
    ],
  },
  {
    id: "red-home",
    titleEn: "Red car goes home",
    titleZh: "红色小车回家",
    parentEn: "Red car, keys, garage. First / then / last.",
    parentZh: "红色小车、钥匙、车库。先 / 然后 / 最后。",
    beats: [
      {
        id: "a",
        en: "First the red car is ready.",
        zh: "先：红色小车准备好了。",
        art: redCarArt() + caption("red car 红车"),
      },
      {
        id: "b",
        en: "Then Dad finds the keys.",
        zh: "然后：爸爸找到钥匙。",
        art: keyArt() + caption("keys 钥匙"),
      },
      {
        id: "c",
        en: "Last the red car parks in the garage.",
        zh: "最后：红色小车停进车库。",
        art: garageArt() + caption("garage 车库"),
      },
    ],
  },
  {
    id: "blue-wash-home",
    titleEn: "Blue car gets a wash",
    titleZh: "蓝色小车去洗车",
    parentEn: "Blue car, car wash, garage.",
    parentZh: "蓝色小车、洗车、车库。",
    beats: [
      {
        id: "a",
        en: "First the blue car is ready.",
        zh: "先：蓝色小车准备好了。",
        art: blueCarArt() + caption("blue car 蓝车"),
      },
      {
        id: "b",
        en: "Then the blue car goes through the car wash.",
        zh: "然后：蓝色小车去洗车。",
        art: washArt() + caption("wash 洗车"),
      },
      {
        id: "c",
        en: "Last the blue car parks in the garage.",
        zh: "最后：蓝色小车停进车库。",
        art: garageArt() + caption("garage 车库"),
      },
    ],
  },
  {
    id: "white-car-home",
    titleEn: "White car on the road",
    titleZh: "白色小车上路",
    parentEn: "White car, road, garage.",
    parentZh: "白色小车、马路、车库。",
    beats: [
      {
        id: "a",
        en: "First the white car is waiting.",
        zh: "先：白色小车在等。",
        art: whiteCarArt() + caption("white car 白车"),
      },
      {
        id: "b",
        en: "Then the white car drives on the road.",
        zh: "然后：白色小车在路上开。",
        art: photo("road", "road") + caption("road 马路"),
      },
      {
        id: "c",
        en: "Last the white car parks in the garage.",
        zh: "最后：白色小车停进车库。",
        art: garageArt() + caption("garage 车库"),
      },
    ],
  },
  {
    id: "yellow-ramp",
    titleEn: "Yellow car goes up",
    titleZh: "黄色小车开上去",
    parentEn: "Yellow car, ramp, garage.",
    parentZh: "黄色小车、坡道、车库。",
    beats: [
      {
        id: "a",
        en: "First the yellow car is waiting.",
        zh: "先：黄色小车在等。",
        art: yellowCarArt() + caption("yellow car 黄车"),
      },
      {
        id: "b",
        en: "Then it drives up the ramp.",
        zh: "然后：它开上坡道。",
        art: rampArt() + caption("ramp 坡道"),
      },
      {
        id: "c",
        en: "Last it parks in the garage.",
        zh: "最后：它停进车库。",
        art: garageArt() + caption("garage 车库"),
      },
    ],
  },
  {
    id: "moon-pickup",
    titleEn: "Night-night pickup",
    titleZh: "皮卡说晚安",
    parentEn: "Moon, yellow pickup, garage. Night time.",
    parentZh: "月亮、黄色皮卡、车库。晚上。",
    beats: [
      {
        id: "a",
        en: "First the moon is out.",
        zh: "先：月亮出来了。",
        art: moonArt() + caption("moon 月亮"),
      },
      {
        id: "b",
        en: "Then the yellow pickup truck is sleepy.",
        zh: "然后：黄色皮卡困了。",
        art: yellowPickupArt() + caption("yellow pickup 黄皮卡"),
      },
      {
        id: "c",
        en: "Last it sleeps in the garage.",
        zh: "最后：它在车库睡觉。",
        art: garageArt() + caption("garage 车库"),
      },
    ],
  },
  {
    id: "sports-road",
    titleEn: "Sports car on the road",
    titleZh: "跑车上路",
    parentEn: "Sports car, road, garage.",
    parentZh: "跑车、马路、车库。",
    beats: [
      {
        id: "a",
        en: "First the red sports car is ready.",
        zh: "先：红色跑车准备好了。",
        art: sportsCarArt() + caption("sports car 跑车"),
      },
      {
        id: "b",
        en: "Then it drives on the road.",
        zh: "然后：它在路上开。",
        art: photo("road", "road") + caption("road 马路"),
      },
      {
        id: "c",
        en: "Last it parks in the garage.",
        zh: "最后：它停进车库。",
        art: garageArt() + caption("garage 车库"),
      },
    ],
  },
];

const STORY_CLASSIFY = [
  {
    id: "fire-trucks",
    promptEn: "These are all fire trucks. Which belongs too?",
    promptZh: "这些都是消防车。哪一个也属于这里？",
    coachEn: "Fire trucks with fire trucks — not just any red vehicle.",
    coachZh: "消防车和消防车在一起。不是随便一辆红车。",
    stem: [fireTruckArt(), fireStationArt()],
    choices: [
      { id: "f", ok: true, art: applySize(fireTruckArt(), "lg") + caption("fire truck 消防车") },
      { id: "pr", ok: false, art: pickupRedArt() + caption("red pickup 红皮卡") },
      { id: "y", ok: false, art: photo("car-yellow", "yellow car") + caption("yellow car 黄车") },
    ],
  },
  {
    id: "pickups",
    promptEn: "These are all pickup trucks. Which belongs?",
    promptZh: "这些都是皮卡。哪一个属于这里？",
    coachEn: "Look for the open back. The dark pickup — not the blue car.",
    coachZh: "看后面敞开的车斗。深色皮卡，不是蓝色小车。",
    stem: [pickupWhiteArt(), pickupRedArt()],
    choices: [
      { id: "p", ok: true, art: pickupArt() + caption("pickup 皮卡") },
      { id: "b", ok: false, art: photo("car-blue", "blue car") + caption("blue car 蓝车") },
      { id: "y", ok: false, art: photo("car-yellow", "yellow car") + caption("yellow car 黄车") },
    ],
  },
  {
    id: "sports-cars",
    promptEn: "These are all sports cars. Which belongs?",
    promptZh: "这些都是跑车。哪一个属于这里？",
    coachEn: "Low and fast. Not the yellow ordinary car.",
    coachZh: "矮矮的、快快的。不是平常的黄色小车。",
    stem: [sportsCarArt(), sportsCarArt()],
    choices: [
      { id: "s", ok: true, art: photo("sports-car-yellow", "sports car") + caption("sports car 跑车") },
      { id: "y", ok: false, art: photo("car-yellow", "yellow car") + caption("yellow car 黄车") },
      { id: "p", ok: false, art: pickupArt() + caption("pickup 皮卡") },
    ],
  },
  {
    id: "sleep-places",
    promptEn: "These are all places a vehicle sleeps. Which belongs too?",
    promptZh: "这些都是车睡觉的地方。哪一个也属于这里？",
    coachEn: "A garage for the sports car. A fire station for the fire truck.",
    coachZh: "跑车的家是车库。消防车的家是消防站。",
    stem: [fireStationArt(), garageArt({ wide: true })],
    choices: [
      { id: "g", ok: true, art: garageArt() + caption("garage 车库") },
      { id: "w", ok: false, art: washArt() + caption("wash 洗车") },
      { id: "k", ok: false, art: keyArt() + caption("key 钥匙") },
    ],
  },
  {
    id: "white-pickups",
    promptEn: "These are pickup trucks. Which belongs too?",
    promptZh: "这些都是皮卡。哪一个也属于这里？",
    coachEn: "White pickup and dark pickup — both have an open back.",
    coachZh: "白色皮卡和深色皮卡——后面都是敞开的车斗。",
    stem: [pickupWhiteArt(), pickupArt()],
    choices: [
      { id: "pr", ok: true, art: pickupRedArt() + caption("red pickup 红色皮卡") },
      { id: "f", ok: false, art: fireTruckArt() + caption("fire truck 消防车") },
      { id: "s", ok: false, art: sportsCarArt() + caption("sports car 跑车") },
    ],
  },
  {
    id: "yellow-vehicles",
    promptEn: "These are yellow vehicles. Which belongs?",
    promptZh: "这些都是黄色的车。哪一个属于这里？",
    coachEn: "Color — yellow with yellow.",
    coachZh: "看颜色：黄的和黄的在一起。",
    stem: [photo("sports-car-yellow", "yellow sports car"), photo("sports-car-yellow", "yellow sports car")],
    choices: [
      { id: "y", ok: true, art: photo("car-yellow", "yellow car") + caption("yellow car 黄车") },
      { id: "pw", ok: false, art: pickupWhiteArt() + caption("white pickup 白色皮卡") },
      { id: "f", ok: false, art: fireTruckArt() + caption("fire truck 消防车") },
    ],
  },
  {
    id: "go-helpers",
    promptEn: "These help a car go. Which belongs too?",
    promptZh: "这些能帮车走。哪一个也属于这里？",
    coachEn: "Keys start the car. A ramp helps it drive up.",
    coachZh: "钥匙发动车。坡道帮它开上去。",
    stem: [keyArt(), rampArt()],
    choices: [
      { id: "r", ok: true, art: photo("road", "road") + caption("road 马路") },
      { id: "m", ok: false, art: moonArt() + caption("moon 月亮") },
      { id: "w", ok: false, art: washArt() + caption("wash 洗车") },
    ],
  },
  {
    id: "red-fire-trucks",
    promptEn: "These are red fire trucks. Which belongs too?",
    promptZh: "这些是红色的消防车。哪一个也属于这里？",
    coachEn: "Both: red, and a fire truck — not just any red pickup.",
    coachZh: "又是红的，又是消防车。不是随便一辆红皮卡。",
    stem: [fireTruckArt(), fireStationArt()],
    choices: [
      { id: "f", ok: true, art: applySize(fireTruckArt(), "sm") + caption("fire truck 消防车") },
      { id: "pr", ok: false, art: pickupRedArt() + caption("red pickup 红皮卡") },
      { id: "y", ok: false, art: photo("car-yellow", "yellow car") + caption("yellow car 黄车") },
    ],
  },
  {
    id: "blue-color",
    promptEn: "These are blue. Which is blue too?",
    promptZh: "这些都是蓝色的。哪一个也是蓝的？",
    coachEn: "Color — blue with blue. The blue pickup belongs. The dusty truck is black and dirty, not the blue match.",
    coachZh: "看颜色：蓝的和蓝的在一起。蓝色皮卡属于这里。脏皮卡是黑的。",
    stem: [blueCarArt(), blueCarArt()],
    choices: [
      { id: "pb", ok: true, art: pickupBlueArt() + caption("blue pickup 蓝皮卡") },
      { id: "y", ok: false, art: photo("car-yellow", "yellow car") + caption("yellow car 黄车") },
      { id: "pr", ok: false, art: pickupRedArt() + caption("red pickup 红皮卡") },
    ],
  },
  {
    id: "wash-places",
    promptEn: "The dusty pickup needs a wash. Which belongs?",
    promptZh: "脏皮卡需要洗一洗。哪一个属于这里？",
    coachEn: "The car wash is for getting clean.",
    coachZh: "洗车房是把车洗干净的。",
    stem: [photo("car-dirty-blue", "dusty pickup"), photo("car-dirty-blue", "dusty pickup")],
    choices: [
      { id: "w", ok: true, art: washArt() + caption("wash 洗车") },
      { id: "m", ok: false, art: moonArt() + caption("moon 月亮") },
      { id: "fs", ok: false, art: fireStationArt() + caption("fire station 消防站") },
    ],
  },
  {
    id: "white-vehicles",
    promptEn: "These are white. Which is white too?",
    promptZh: "这些都是白色的。哪一个也是白的？",
    coachEn: "Color — white with white. The white pickup belongs, not the yellow car.",
    coachZh: "看颜色：白的和白的在一起。白色皮卡属于这里，不是黄车。",
    stem: [whiteCarArt(), whiteCarArt()],
    choices: [
      { id: "pw", ok: true, art: pickupWhiteArt() + caption("white pickup 白色皮卡") },
      { id: "y", ok: false, art: yellowCarArt() + caption("yellow car 黄车") },
      { id: "p", ok: false, art: pickupBlueArt() + caption("blue pickup 蓝皮卡") },
    ],
  },
  {
    id: "yellow-pickups",
    promptEn: "These are yellow vehicles. Which belongs?",
    promptZh: "这些都是黄色的车。哪一个属于这里？",
    coachEn: "Yellow with yellow — the yellow pickup, not the white pickup.",
    coachZh: "黄的和黄的在一起。黄色皮卡，不是白色皮卡。",
    stem: [yellowCarArt(), yellowSportsArt()],
    choices: [
      { id: "yp", ok: true, art: yellowPickupArt() + caption("yellow pickup 黄皮卡") },
      { id: "pw", ok: false, art: pickupWhiteArt() + caption("white pickup 白色皮卡") },
      { id: "f", ok: false, art: fireTruckArt() + caption("fire truck 消防车") },
    ],
  },
  {
    id: "drive-places",
    promptEn: "These are places a car can go. Which belongs too?",
    promptZh: "这些是车可以去的地方。哪一个也属于这里？",
    coachEn: "Road and ramp are for driving. The moon is for night-night.",
    coachZh: "马路和坡道是开的。月亮是晚上的。",
    stem: [photo("road", "road"), rampArt()],
    choices: [
      { id: "g", ok: true, art: garageArt() + caption("garage 车库") },
      { id: "m", ok: false, art: moonArt() + caption("moon 月亮") },
      { id: "k", ok: false, art: keyArt() + caption("key 钥匙") },
    ],
  },
];

const STORY_ANALOGY = [
  {
    id: "sports-garage-fire",
    promptEn: "Sports car goes with garage. Fire truck goes with…?",
    promptZh: "跑车配车库。消防车配……？",
    coachEn: "A home for the sports car. A home for the fire truck — the fire station.",
    coachZh: "跑车的家是车库。消防车的家是消防站。",
    a: sportsCarArt(),
    b: garageArt(),
    c: fireTruckArt(),
    choices: [
      { id: "fs", ok: true, art: fireStationArt() + caption("fire station 消防站") },
      { id: "wash", ok: false, art: washArt() + caption("wash 洗车") },
      { id: "key", ok: false, art: keyArt() + caption("key 钥匙") },
    ],
  },
  {
    id: "wash-dirty-garage",
    promptEn: "Wash goes with the dirty pickup. Garage goes with…?",
    promptZh: "洗车房配脏皮卡。车库配……？",
    coachEn: "Wash is for the dusty truck. The garage is a home for the sports car.",
    coachZh: "洗车房是给脏皮卡的。车库是跑车的家。",
    a: washArt(),
    b: photo("car-dirty-blue", "dusty pickup truck"),
    c: garageArt(),
    choices: [
      { id: "car", ok: true, art: sportsCarArt() + caption("sports car 跑车") },
      { id: "moon", ok: false, art: moonArt() + caption("moon 月亮") },
      { id: "key", ok: false, art: keyArt() + caption("key 钥匙") },
    ],
  },
  {
    id: "key-sports-ramp",
    promptEn: "Key goes with sports car. Ramp goes with…?",
    promptZh: "钥匙配跑车。坡道配……？",
    coachEn: "Both help the vehicle go.",
    coachZh: "都是帮车走的。",
    a: keyArt(),
    b: sportsCarArt(),
    c: rampArt(),
    choices: [
      { id: "p", ok: true, art: pickupArt() + caption("pickup 皮卡") },
      { id: "wash", ok: false, art: washArt() + caption("wash 洗车") },
      { id: "moon", ok: false, art: moonArt() + caption("moon 月亮") },
    ],
  },
  {
    id: "little-big",
    promptEn: "Little car goes with little garage. Fire truck goes with…?",
    promptZh: "小小车配小车库。消防车配……？",
    coachEn: "Match the size. The fire truck needs a big bay.",
    coachZh: "大小要配得上。消防车要大车位。",
    a: applySize(photo("car-yellow", "yellow car"), "sm"),
    b: garageArt(),
    c: fireTruckArt(),
    choices: [
      { id: "big", ok: true, art: garageArt({ wide: true }) + caption("big bay 大车位") },
      { id: "key", ok: false, art: keyArt() + caption("key 钥匙") },
      { id: "mini", ok: false, art: applySize(photo("car-blue", "blue car"), "sm") + caption("little car 小车") },
    ],
  },
  {
    id: "pickup-ramp-fire",
    promptEn: "Pickup goes up the ramp. Fire truck goes to sleep at…?",
    promptZh: "皮卡开上坡道。消防车去……睡觉？",
    coachEn: "Ramp is for driving up. Fire station is for night-night.",
    coachZh: "坡道是开上去的。消防站是睡觉的。",
    a: pickupArt(),
    b: rampArt(),
    c: fireTruckArt(),
    choices: [
      { id: "g", ok: true, art: fireStationArt() + caption("fire station 消防站") },
      { id: "w", ok: false, art: washArt() + caption("wash 洗车") },
      { id: "k", ok: false, art: keyArt() + caption("key 钥匙") },
    ],
  },
  {
    id: "white-garage-fire",
    promptEn: "White pickup goes with the garage. Fire truck goes with…?",
    promptZh: "白色皮卡配车库。消防车配……？",
    coachEn: "A home for the white pickup. A home for the fire truck — the fire station.",
    coachZh: "白色皮卡的家是车库。消防车的家是消防站。",
    a: pickupWhiteArt(),
    b: garageArt(),
    c: fireTruckArt(),
    choices: [
      { id: "fs", ok: true, art: fireStationArt() + caption("fire station 消防站") },
      { id: "pr", ok: false, art: pickupRedArt() + caption("red pickup 红色皮卡") },
      { id: "key", ok: false, art: keyArt() + caption("key 钥匙") },
    ],
  },
  {
    id: "keys-white-wash-dirty",
    promptEn: "Keys go with the white pickup. Wash goes with…?",
    promptZh: "钥匙配白色皮卡。洗车房配……？",
    coachEn: "Keys start the white pickup. Wash is for the dusty truck.",
    coachZh: "钥匙发动白色皮卡。洗车房是给脏皮卡的。",
    a: keyArt(),
    b: pickupWhiteArt(),
    c: washArt(),
    choices: [
      { id: "dirty", ok: true, art: photo("car-dirty-blue", "dusty pickup truck") + caption("dusty pickup 脏皮卡") },
      { id: "moon", ok: false, art: moonArt() + caption("moon 月亮") },
      { id: "s", ok: false, art: sportsCarArt() + caption("sports car 跑车") },
    ],
  },
  {
    id: "red-pickup-white",
    promptEn: "Red pickup goes with dark pickup. Sports car goes with…?",
    promptZh: "红色皮卡配深色皮卡。跑车配……？",
    coachEn: "Two pickups go together. Another sports car belongs with the sports car.",
    coachZh: "两辆皮卡在一起。跑车配另一辆跑车。",
    a: pickupRedArt(),
    b: pickupArt(),
    c: sportsCarArt(),
    choices: [
      { id: "sy", ok: true, art: photo("sports-car-yellow", "sports car") + caption("sports car 跑车") },
      { id: "pw", ok: false, art: pickupWhiteArt() + caption("white pickup 白色皮卡") },
      { id: "w", ok: false, art: washArt() + caption("wash 洗车") },
    ],
  },
  {
    id: "white-car-white-pickup",
    promptEn: "White car goes with white pickup. Blue car goes with…?",
    promptZh: "白色小车配白色皮卡。蓝色小车配……？",
    coachEn: "Same color: white with white. Blue car needs the blue pickup — not the white pickup, and not another blue car.",
    coachZh: "一样的颜色配在一起。蓝车配蓝皮卡。",
    a: whiteCarArt(),
    b: pickupWhiteArt(),
    c: blueCarArt(),
    choices: [
      { id: "pb", ok: true, art: pickupBlueArt() + caption("blue pickup 蓝皮卡") },
      { id: "pw", ok: false, art: pickupWhiteArt() + caption("white pickup 白色皮卡") },
      { id: "bc", ok: false, art: blueCarArt() + caption("blue car 蓝车") },
    ],
  },
  {
    id: "red-car-red-pickup",
    promptEn: "Red car goes with red pickup. Yellow car goes with…?",
    promptZh: "红色小车配红色皮卡。黄色小车配……？",
    coachEn: "Color and kind: yellow car needs the yellow pickup. Not a yellow sports car, not a red pickup.",
    coachZh: "看颜色也看车：黄车配黄皮卡。不是黄跑车，也不是红皮卡。",
    a: redCarArt(),
    b: pickupRedArt(),
    c: yellowCarArt(),
    choices: [
      { id: "yp", ok: true, art: yellowPickupArt() + caption("yellow pickup 黄皮卡") },
      { id: "yc", ok: false, art: yellowCarArt() + caption("yellow car 黄车") },
      { id: "pr", ok: false, art: pickupRedArt() + caption("red pickup 红皮卡") },
    ],
  },
  {
    id: "blue-car-blue-pickup",
    promptEn: "Blue car goes with blue pickup. White car goes with…?",
    promptZh: "蓝色小车配蓝色皮卡。白色小车配……？",
    coachEn: "White car needs the white pickup — both white, and a pickup.",
    coachZh: "白车配白皮卡。又是白的，又是皮卡。",
    a: blueCarArt(),
    b: pickupBlueArt(),
    c: whiteCarArt(),
    choices: [
      { id: "pw", ok: true, art: pickupWhiteArt() + caption("white pickup 白色皮卡") },
      { id: "pb", ok: false, art: pickupBlueArt() + caption("blue pickup 蓝皮卡") },
      { id: "wc", ok: false, art: whiteCarArt() + caption("white car 白车") },
    ],
  },
];

const STORY_SENTENCE = [
  {
    id: "fire-sleep",
    sentenceEn: "The fire truck is going to sleep at the…",
    sentenceZh: "消防车要去……睡觉。",
    parentEn: "You read the sentence. He taps the picture that finishes it.",
    parentZh: "你读句子。他点选把句子说完的图片。",
    choices: [
      { id: "g", ok: true, art: fireStationArt() + caption("fire station 消防站") },
      { id: "w", ok: false, art: washArt() + caption("wash 洗车") },
      { id: "p", ok: false, art: pickupArt() + caption("pickup 皮卡") },
    ],
  },
  {
    id: "dusty-wash",
    sentenceEn: "The dusty pickup truck needs a…",
    sentenceZh: "脏脏的皮卡需要……",
    parentEn: "You read. He finishes with a picture.",
    parentZh: "你读。他用图片把话说完。",
    choices: [
      { id: "w", ok: true, art: washArt() + caption("wash 洗车") },
      { id: "k", ok: false, art: keyArt() + caption("key 钥匙") },
      { id: "m", ok: false, art: moonArt() + caption("moon 月亮") },
    ],
  },
  {
    id: "dad-key",
    sentenceEn: "Dad uses a key to start the…",
    sentenceZh: "爸爸用钥匙发动……",
    parentEn: "Leave a blank at the end. Wait.",
    parentZh: "句尾留空。等他。",
    choices: [
      { id: "c", ok: true, art: sportsCarArt() + caption("sports car 跑车") },
      { id: "g", ok: false, art: garageArt() + caption("garage 车库") },
      { id: "r", ok: false, art: rampArt() + caption("ramp 坡道") },
    ],
  },
  {
    id: "pickup-ramp",
    sentenceEn: "The pickup truck drives up the…",
    sentenceZh: "皮卡开上……",
    parentEn: "You say the sentence. He taps.",
    parentZh: "你读句子。他点。",
    choices: [
      { id: "r", ok: true, art: rampArt() + caption("ramp 坡道") },
      { id: "k", ok: false, art: keyArt() + caption("key 钥匙") },
      { id: "m", ok: false, art: moonArt() + caption("moon 月亮") },
    ],
  },
  {
    id: "white-parks",
    sentenceEn: "The white pickup truck parks in the…",
    sentenceZh: "白色皮卡停进……",
    parentEn: "You say white pickup / 白色皮卡. He finishes with a picture.",
    parentZh: "你说出白色皮卡。他用图片把话说完。",
    choices: [
      { id: "g", ok: true, art: garageArt() + caption("garage 车库") },
      { id: "w", ok: false, art: washArt() + caption("wash 洗车") },
      { id: "f", ok: false, art: fireStationArt() + caption("fire station 消防站") },
    ],
  },
  {
    id: "dad-keys-white",
    sentenceEn: "Dad uses a key to start the white…",
    sentenceZh: "爸爸用钥匙发动白色……",
    parentEn: "Hear names the white pickup. He taps the picture.",
    parentZh: "听一听白色皮卡。他点图片。",
    choices: [
      { id: "pw", ok: true, art: pickupWhiteArt() + caption("white pickup 白色皮卡") },
      { id: "s", ok: false, art: sportsCarArt() + caption("sports car 跑车") },
      { id: "f", ok: false, art: fireTruckArt() + caption("fire truck 消防车") },
    ],
  },
  {
    id: "two-pickups-home",
    sentenceEn: "The red pickup and the white pickup park in the…",
    sentenceZh: "红色皮卡和白色皮卡停进……",
    parentEn: "Two pickups he can name. He taps where they sleep.",
    parentZh: "两辆他能叫出名字的皮卡。他点它们睡觉的地方。",
    choices: [
      { id: "g", ok: true, art: garageArt() + caption("garage 车库") },
      { id: "m", ok: false, art: moonArt() + caption("moon 月亮") },
      { id: "k", ok: false, art: keyArt() + caption("key 钥匙") },
    ],
  },
  {
    id: "yellow-car-home",
    sentenceEn: "The yellow car parks in the…",
    sentenceZh: "黄色小车停进……",
    parentEn: "You say the sentence. He taps.",
    parentZh: "你读句子。他点。",
    choices: [
      { id: "g", ok: true, art: garageArt() + caption("garage 车库") },
      { id: "m", ok: false, art: moonArt() + caption("moon 月亮") },
      { id: "w", ok: false, art: washArt() + caption("wash 洗车") },
    ],
  },
  {
    id: "blue-on-road",
    sentenceEn: "The blue car drives on the…",
    sentenceZh: "蓝色小车在……上开。",
    parentEn: "You say the sentence. He taps.",
    parentZh: "你读句子。他点。",
    choices: [
      { id: "r", ok: true, art: photo("road", "road") + caption("road 马路") },
      { id: "k", ok: false, art: keyArt() + caption("key 钥匙") },
      { id: "m", ok: false, art: moonArt() + caption("moon 月亮") },
    ],
  },
  {
    id: "yellow-pickup-ramp",
    sentenceEn: "The yellow pickup truck drives up the…",
    sentenceZh: "黄色皮卡开上……",
    parentEn: "Name the yellow pickup. He finishes with a picture.",
    parentZh: "说出黄色皮卡。他用图片把话说完。",
    choices: [
      { id: "r", ok: true, art: rampArt() + caption("ramp 坡道") },
      { id: "fs", ok: false, art: fireStationArt() + caption("fire station 消防站") },
      { id: "k", ok: false, art: keyArt() + caption("key 钥匙") },
    ],
  },
  {
    id: "moon-sleep-garage",
    sentenceEn: "The moon is out. The sports car sleeps in the…",
    sentenceZh: "月亮出来了。跑车在……睡觉。",
    parentEn: "Night-night. He taps where it sleeps.",
    parentZh: "晚安。他点睡觉的地方。",
    choices: [
      { id: "g", ok: true, art: garageArt() + caption("garage 车库") },
      { id: "w", ok: false, art: washArt() + caption("wash 洗车") },
      { id: "r", ok: false, art: rampArt() + caption("ramp 坡道") },
    ],
  },
];

const BAY_CLASSIFY = [
  {
    id: "bay-fire",
    promptEn: "This bay is for fire trucks. Which one parks here too?",
    promptZh: "这个车位是给消防车的。哪一辆也可以停？",
    coachEn: "Fire trucks with fire trucks.",
    coachZh: "消防车和消防车在一起。",
    stem: [fireStationArt(), fireStationArt()],
    choices: [
      { id: "f", ok: true, art: fireTruckArt() + caption("fire truck 消防车") },
      { id: "s", ok: false, art: sportsCarArt() + caption("sports car 跑车") },
      { id: "p", ok: false, art: pickupArt() + caption("pickup 皮卡") },
    ],
  },
  {
    id: "bay-pickup",
    promptEn: "This bay is for pickup trucks. Which one belongs?",
    promptZh: "这个车位是给皮卡的。哪一辆属于这里？",
    coachEn: "Look for the open back. White pickup too.",
    coachZh: "看后面敞开的车斗。白色皮卡也是。",
    stem: [pickupArt(), pickupWhiteArt()],
    choices: [
      { id: "p", ok: true, art: pickupRedArt() + caption("red pickup 红色皮卡") },
      { id: "s", ok: false, art: sportsCarArt() + caption("sports car 跑车") },
      { id: "f", ok: false, art: fireTruckArt() + caption("fire truck 消防车") },
    ],
  },
  {
    id: "bay-sports",
    promptEn: "This bay is for sports cars. Which one belongs?",
    promptZh: "这个车位是给跑车的。哪一辆属于这里？",
    coachEn: "Low and fast.",
    coachZh: "矮矮的、快快的。",
    stem: [sportsCarArt(), sportsCarArt()],
    choices: [
      { id: "s", ok: true, art: photo("sports-car-yellow", "sports car") + caption("sports car 跑车") },
      { id: "y", ok: false, art: photo("car-yellow", "yellow car") + caption("yellow car 黄车") },
      { id: "p", ok: false, art: pickupArt() + caption("pickup 皮卡") },
    ],
  },
  {
    id: "bay-ordinary",
    promptEn: "This bay is for ordinary cars. Which one belongs?",
    promptZh: "这个车位是给平常小车的。哪一辆属于这里？",
    coachEn: "A regular car — not a dusty pickup, even if it is also blue.",
    coachZh: "平常的小车。不是脏皮卡，就算它也是蓝的。",
    stem: [photo("car-yellow", "yellow car"), photo("car-red", "family car")],
    choices: [
      { id: "c", ok: true, art: photo("car-blue", "blue car") + caption("car 小车") },
      { id: "d", ok: false, art: photo("car-dirty-blue", "dusty pickup") + caption("pickup 皮卡") },
      { id: "p", ok: false, art: pickupArt() + caption("pickup 皮卡") },
    ],
  },
  {
    id: "bay-red",
    promptEn: "This bay is for red vehicles. Which one parks here too?",
    promptZh: "这个车位是给红色车的。哪一辆也可以停？",
    coachEn: "Color — even if one is a pickup.",
    coachZh: "看颜色，皮卡也可以是红的。",
    stem: [photo("car-red", "family car"), sportsCarArt()],
    choices: [
      { id: "pr", ok: true, art: pickupRedArt() + caption("red pickup 红皮卡") },
      { id: "bc", ok: false, art: photo("car-blue", "blue car") + caption("blue car 蓝车") },
      { id: "pw", ok: false, art: pickupWhiteArt() + caption("white pickup 白色皮卡") },
    ],
  },
  {
    id: "bay-little",
    promptEn: "This bay is for little cars. Which one belongs?",
    promptZh: "这个车位是给小小车的。哪一辆属于这里？",
    coachEn: "Size: tiny with tiny.",
    coachZh: "看大小：小小的在一起。",
    stem: [applySize(photo("car-blue", "little blue car"), "sm"), applySize(photo("car-red", "little car"), "sm")],
    choices: [
      { id: "sm", ok: true, art: applySize(photo("car-yellow", "little yellow car"), "sm") + caption("little car 小小车") },
      { id: "lg", ok: false, art: applySize(fireTruckArt(), "lg") + caption("fire truck 消防车") },
      { id: "tk", ok: false, art: applySize(pickupArt(), "lg") + caption("pickup 皮卡") },
    ],
  },
  {
    id: "bay-white-pickups",
    promptEn: "This bay is for pickup trucks. Which one parks here too?",
    promptZh: "这个车位是给皮卡的。哪一辆也可以停？",
    coachEn: "White pickup and red pickup. The dark pickup belongs too — not the blue car.",
    coachZh: "白色皮卡和红色皮卡。深色皮卡也是皮卡，不是蓝色小车。",
    stem: [pickupWhiteArt(), pickupRedArt()],
    choices: [
      { id: "p", ok: true, art: pickupArt() + caption("pickup 皮卡") },
      { id: "b", ok: false, art: photo("car-blue", "blue car") + caption("blue car 蓝车") },
      { id: "y", ok: false, art: photo("car-yellow", "yellow car") + caption("yellow car 黄车") },
    ],
  },
  {
    id: "bay-yellow",
    promptEn: "This bay is for yellow vehicles. Which one belongs?",
    promptZh: "这个车位是给黄色车的。哪一辆属于这里？",
    coachEn: "Yellow with yellow.",
    coachZh: "黄的和黄的在一起。",
    stem: [photo("sports-car-yellow", "yellow sports car"), photo("sports-car-yellow", "yellow sports car")],
    choices: [
      { id: "y", ok: true, art: photo("car-yellow", "yellow car") + caption("yellow car 黄车") },
      { id: "pw", ok: false, art: pickupWhiteArt() + caption("white pickup 白色皮卡") },
      { id: "f", ok: false, art: fireTruckArt() + caption("fire truck 消防车") },
    ],
  },
  {
    id: "bay-trucks",
    promptEn: "This bay is for trucks. Which one belongs?",
    promptZh: "这个车位是给卡车的。哪一辆属于这里？",
    coachEn: "Fire truck and pickup trucks. Not a little sports car.",
    coachZh: "消防车和皮卡。不是小小跑车。",
    stem: [fireTruckArt(), pickupArt()],
    choices: [
      { id: "pw", ok: true, art: pickupWhiteArt() + caption("white pickup 白色皮卡") },
      { id: "s", ok: false, art: sportsCarArt() + caption("sports car 跑车") },
      { id: "c", ok: false, art: photo("car-yellow", "yellow car") + caption("car 小车") },
    ],
  },
  {
    id: "bay-red-fire",
    promptEn: "This bay is for red fire trucks. Which one parks here too?",
    promptZh: "这个车位是给红色消防车的。哪一辆也可以停？",
    coachEn: "Both: red AND a fire truck. A red pickup is only red.",
    coachZh: "又是红的，又是消防车。红皮卡只是红的。",
    stem: [fireStationArt(), fireStationArt()],
    choices: [
      { id: "f", ok: true, art: fireTruckArt() + caption("fire truck 消防车") },
      { id: "pr", ok: false, art: pickupRedArt() + caption("red pickup 红皮卡") },
      { id: "y", ok: false, art: photo("car-yellow", "yellow car") + caption("yellow car 黄车") },
    ],
  },
  {
    id: "bay-blue",
    promptEn: "This bay is for blue vehicles. Which one belongs?",
    promptZh: "这个车位是给蓝色车的。哪一辆属于这里？",
    coachEn: "Color — blue with blue. The blue pickup belongs. Not the dusty black truck.",
    coachZh: "看颜色：蓝的和蓝的在一起。蓝色皮卡属于这里。",
    stem: [blueCarArt(), blueCarArt()],
    choices: [
      { id: "pb", ok: true, art: pickupBlueArt() + caption("blue pickup 蓝皮卡") },
      { id: "y", ok: false, art: photo("car-yellow", "yellow car") + caption("yellow car 黄车") },
      { id: "pr", ok: false, art: pickupRedArt() + caption("red pickup 红皮卡") },
    ],
  },
  {
    id: "bay-white",
    promptEn: "This bay is for white vehicles. Which one parks here too?",
    promptZh: "这个车位是给白色车的。哪一辆也可以停？",
    coachEn: "White car with white pickup. Not the blue pickup.",
    coachZh: "白车和白皮卡。不是蓝皮卡。",
    stem: [whiteCarArt(), whiteCarArt()],
    choices: [
      { id: "pw", ok: true, art: pickupWhiteArt() + caption("white pickup 白色皮卡") },
      { id: "pb", ok: false, art: pickupBlueArt() + caption("blue pickup 蓝皮卡") },
      { id: "y", ok: false, art: yellowCarArt() + caption("yellow car 黄车") },
    ],
  },
  {
    id: "bay-yellow-pickup",
    promptEn: "This bay is for yellow pickups. Which one belongs?",
    promptZh: "这个车位是给黄色皮卡的。哪一辆属于这里？",
    coachEn: "Both: yellow AND a pickup. A yellow car is only yellow. A white pickup is only a pickup.",
    coachZh: "又是黄的，又是皮卡。黄车只是黄的。白皮卡只是皮卡。",
    stem: [yellowCarArt(), pickupWhiteArt()],
    choices: [
      { id: "yp", ok: true, art: yellowPickupArt() + caption("yellow pickup 黄皮卡") },
      { id: "yc", ok: false, art: yellowSportsArt() + caption("yellow sports car 黄跑车") },
      { id: "pb", ok: false, art: pickupBlueArt() + caption("blue pickup 蓝皮卡") },
    ],
  },
];

const BAY_MATRIX = [
  {
    id: "matrix-color-kind",
    promptEn: "What finishes the garage pattern?",
    promptZh: "哪一个能把车库图案补齐？",
    coachEn: "Look across (color), then down (car or truck).",
    coachZh: "先横着看颜色，再竖着看是小车还是卡车。",
    cells: [
      carSvg("#d94b3a"),
      carSvg("#3a7ca5"),
      truckSvg("#d94b3a"),
    ],
    choices: [
      { id: "ok", ok: true, art: truckSvg("#3a7ca5") },
      { id: "a", ok: false, art: carSvg("#3a7ca5") },
      { id: "b", ok: false, art: truckSvg("#d94b3a") },
      { id: "c", ok: false, art: motoSvg("#3a7ca5") },
    ],
  },
  {
    promptEn: "What finishes the garage pattern?",
    promptZh: "哪一个能把车库图案补齐？",
    id: "matrix-size",
    promptEn: "What finishes the garage pattern?",
    promptZh: "哪一个能把车库图案补齐？",
    coachEn: "Across gets bigger. Down stays a car: yellow, then blue.",
    coachZh: "横着变大。竖着还是小车：黄色再到蓝色。",
    cells: [
      carSvg("#e8b44c", { size: "sm" }),
      carSvg("#e8b44c", { size: "lg" }),
      carSvg("#3a7ca5", { size: "sm" }),
    ],
    choices: [
      { id: "ok", ok: true, art: carSvg("#3a7ca5", { size: "lg" }) },
      { id: "a", ok: false, art: carSvg("#3a7ca5", { size: "sm" }) },
      { id: "b", ok: false, art: carSvg("#e8b44c", { size: "lg" }) },
      { id: "c", ok: false, art: truckSvg("#3a7ca5", { size: "lg" }) },
    ],
  },
  {
    id: "matrix-count",
    promptEn: "What finishes the garage pattern?",
    promptZh: "哪一个能把车库图案补齐？",
    coachEn: "Across: one car, then two. Down: yellow, then blue.",
    coachZh: "横着：一辆再到两辆。竖着：黄色再到蓝色。",
    cells: [
      cluster(1, "#e8b44c"),
      cluster(2, "#e8b44c"),
      cluster(1, "#3a7ca5"),
    ],
    choices: [
      { id: "ok", ok: true, art: cluster(2, "#3a7ca5") },
      { id: "a", ok: false, art: cluster(1, "#3a7ca5") },
      { id: "b", ok: false, art: cluster(2, "#e8b44c") },
      { id: "c", ok: false, art: cluster(3, "#3a7ca5") },
    ],
  },
  {
    id: "matrix-car-truck",
    promptEn: "What finishes the garage pattern?",
    promptZh: "哪一个能把车库图案补齐？",
    coachEn: "Across: car then pickup. Down: red, then yellow. Need a yellow pickup — both.",
    coachZh: "横着：小车再到皮卡。竖着：红色再到黄色。要黄色皮卡——两个都对。",
    cells: [redCarArt(), pickupRedArt(), yellowCarArt()],
    choices: [
      { id: "ok", ok: true, art: yellowPickupArt() },
      { id: "a", ok: false, art: yellowSportsArt() },
      { id: "b", ok: false, art: pickupBlueArt() },
      { id: "c", ok: false, art: pickupWhiteArt() },
    ],
  },
  {
    id: "matrix-white-blue",
    promptEn: "What finishes the garage pattern?",
    promptZh: "哪一个能把车库图案补齐？",
    coachEn: "Across: car then pickup. Down: white, then blue. Need a blue pickup — both.",
    coachZh: "横着：小车再到皮卡。竖着：白色再到蓝色。要蓝色皮卡——两个都对。",
    cells: [whiteCarArt(), pickupWhiteArt(), blueCarArt()],
    choices: [
      { id: "ok", ok: true, art: pickupBlueArt() },
      { id: "a", ok: false, art: blueCarArt() },
      { id: "b", ok: false, art: pickupWhiteArt() },
      { id: "c", ok: false, art: yellowPickupArt() },
    ],
  },
  {
    id: "matrix-red-blue-pickup",
    promptEn: "What finishes the garage pattern?",
    promptZh: "哪一个能把车库图案补齐？",
    coachEn: "Across: car then pickup. Down: red, then blue. Need a blue pickup — both.",
    coachZh: "横着：小车再到皮卡。竖着：红色再到蓝色。要蓝色皮卡——两个都对。",
    cells: [redCarArt(), pickupRedArt(), blueCarArt()],
    choices: [
      { id: "ok", ok: true, art: pickupBlueArt() },
      { id: "a", ok: false, art: blueCarArt() },
      { id: "b", ok: false, art: pickupRedArt() },
      { id: "c", ok: false, art: pickupWhiteArt() },
    ],
  },
  {
    id: "matrix-white-yellow",
    promptEn: "What finishes the garage pattern?",
    promptZh: "哪一个能把车库图案补齐？",
    coachEn: "Across: car then pickup. Down: white, then yellow. Need a yellow pickup — both.",
    coachZh: "横着：小车再到皮卡。竖着：白色再到黄色。要黄色皮卡——两个都对。",
    cells: [whiteCarArt(), pickupWhiteArt(), yellowCarArt()],
    choices: [
      { id: "ok", ok: true, art: yellowPickupArt() },
      { id: "a", ok: false, art: yellowCarArt() },
      { id: "b", ok: false, art: pickupWhiteArt() },
      { id: "c", ok: false, art: pickupBlueArt() },
    ],
  },
  {
    id: "matrix-blue-white",
    promptEn: "What finishes the garage pattern?",
    promptZh: "哪一个能把车库图案补齐？",
    coachEn: "Across: car then pickup. Down: blue, then white. The answer is a white pickup — color and kind.",
    coachZh: "横着：小车再到皮卡。竖着：蓝色再到白色。答案是白色皮卡——颜色和车型都对。",
    cells: [blueCarArt(), pickupBlueArt(), whiteCarArt()],
    choices: [
      { id: "ok", ok: true, art: pickupWhiteArt() },
      { id: "a", ok: false, art: whiteCarArt() },
      { id: "b", ok: false, art: pickupBlueArt() },
      { id: "c", ok: false, art: pickupRedArt() },
    ],
  },
  {
    id: "matrix-red-white",
    promptEn: "What finishes the garage pattern?",
    promptZh: "哪一个能把车库图案补齐？",
    coachEn: "Across: car then pickup. Down: red, then white. The answer is a white pickup — both.",
    coachZh: "横着：小车再到皮卡。竖着：红色再到白色。答案是白色皮卡——两个都对。",
    cells: [redCarArt(), pickupRedArt(), whiteCarArt()],
    choices: [
      { id: "ok", ok: true, art: pickupWhiteArt() },
      { id: "a", ok: false, art: whiteCarArt() },
      { id: "b", ok: false, art: pickupRedArt() },
      { id: "c", ok: false, art: pickupBlueArt() },
    ],
  },
];

const SERIES_BANK = [
  { id: "by-two", seq: [2, 4, 6], answer: 8, distractors: [7, 5], en: "Count up by two cars.", zh: "每次多两辆。" },
  { id: "leave-one", seq: [5, 4, 3], answer: 2, distractors: [4, 6], en: "One car leaves each time.", zh: "每次少一辆。" },
  { id: "plus-one", seq: [1, 2, 3], answer: 4, distractors: [2, 5], en: "One more each time.", zh: "每次多一辆。" },
  { id: "same", seq: [2, 2, 2], answer: 2, distractors: [3, 4], en: "It stays the same.", zh: "一直一样多。" },
  { id: "plus-two-odd", seq: [3, 5, 7], answer: 9, distractors: [8, 6], en: "Two more each time.", zh: "每次多两辆。" },
  { id: "minus-one-from-4", seq: [4, 3, 2], answer: 1, distractors: [3, 5], en: "One less each time.", zh: "每次少一辆。" },
  { id: "odds", seq: [1, 3, 5], answer: 7, distractors: [6, 8], en: "Skip one each time.", zh: "每次跳过一辆。" },
  { id: "down-from-6", seq: [6, 5, 4], answer: 3, distractors: [2, 5], en: "One car leaves each time.", zh: "每次少一辆。" },
  { id: "by-three", seq: [3, 6, 9], answer: 12, distractors: [10, 11], en: "Count up by three cars.", zh: "每次多三辆。" },
  { id: "down-by-two", seq: [8, 6, 4], answer: 2, distractors: [3, 5], en: "Two cars leave each time.", zh: "每次少两辆。" },
  { id: "plus-one-from-5", seq: [5, 6, 7], answer: 8, distractors: [9, 6], en: "One more each time.", zh: "每次多一辆。" },
  { id: "same-threes", seq: [3, 3, 3], answer: 3, distractors: [2, 4], en: "It stays the same.", zh: "一直一样多。" },
  { id: "twos-to-fives", seq: [2, 3, 4], answer: 5, distractors: [6, 3], en: "One more each time.", zh: "每次多一辆。" },
  { id: "from-ten", seq: [10, 9, 8], answer: 7, distractors: [6, 9], en: "One car leaves each time.", zh: "每次少一辆。" },
  { id: "evens-up", seq: [4, 6, 8], answer: 10, distractors: [9, 7], en: "Two more each time.", zh: "每次多两辆。" },
];

const NUM_ANALOGY = [
  {
    id: "wheels",
    promptEn: "One car goes with four wheels. Two cars go with…?",
    promptZh: "一辆车配四个轮子。两辆车配……？",
    coachEn: "Same relationship: cars to their wheels.",
    coachZh: "一样的关系：车和它的轮子。",
    a: cluster(1, "#d94b3a"),
    b: wheelDots(4),
    c: cluster(2),
    choices: [
      { id: "8", ok: true, art: wheelDots(8) + caption("wheels 轮子") },
      { id: "4", ok: false, art: wheelDots(4) + caption("wheels 轮子") },
      { id: "2", ok: false, art: wheelDots(2) + caption("wheels 轮子") },
    ],
  },
  {
    id: "garages",
    promptEn: "One car goes with one garage. Two cars go with…?",
    promptZh: "一辆车配一个车库。两辆车配……？",
    coachEn: "One home each.",
    coachZh: "一辆一个家。",
    a: cluster(1, "#3a7ca5"),
    b: garageArt(),
    c: cluster(2),
    choices: [
      { id: "2g", ok: true, art: `<div class="mini-grid">${garageArt()}${garageArt()}</div>` + caption("two garages 两个车库") },
      { id: "1g", ok: false, art: keyArt() + caption("key 钥匙") },
      { id: "4w", ok: false, art: wheelDots(4) + caption("wheels 轮子") },
    ],
  },
  {
    id: "spots",
    promptEn: "Two cars go with two parking spots. Three cars go with…?",
    promptZh: "两辆车配两个车位。三辆车配……？",
    coachEn: "Match the number of spots to the cars.",
    coachZh: "车位数量要和车一样多。",
    a: cluster(2, "#e8b44c"),
    b: cluster(2, "#c9c2b0"),
    c: cluster(3, "#e8b44c"),
    choices: [
      { id: "3", ok: true, art: cluster(3, "#c9c2b0") + caption("three spots 三个位") },
      { id: "2", ok: false, art: cluster(2, "#c9c2b0") + caption("two spots 两个位") },
      { id: "4", ok: false, art: cluster(4, "#c9c2b0") + caption("four spots 四个位") },
    ],
  },
  {
    id: "pickup-ramps",
    promptEn: "One pickup goes with one ramp. Two pickups go with…?",
    promptZh: "一辆皮卡配一个坡道。两辆皮卡配……？",
    coachEn: "One ramp for each pickup — dark and white.",
    coachZh: "一辆皮卡一个坡道。深色和白色都是。",
    a: pickupArt(),
    b: rampArt(),
    c: `<div class="mini-grid">${pickupArt()}${pickupWhiteArt()}</div>`,
    choices: [
      { id: "2r", ok: true, art: `<div class="mini-grid">${rampArt()}${rampArt()}</div>` + caption("two ramps 两个坡道") },
      { id: "1r", ok: false, art: rampArt() + caption("one ramp 一个坡道") },
      { id: "k", ok: false, art: keyArt() + caption("key 钥匙") },
    ],
  },
  {
    id: "three-homes",
    promptEn: "Three cars go with three garages. One car goes with…?",
    promptZh: "三辆车配三个车库。一辆车配……？",
    coachEn: "Same number of homes.",
    coachZh: "家的数量要一样。",
    a: cluster(3),
    b: `<div class="mini-grid">${garageArt()}${garageArt()}${garageArt()}</div>`,
    c: cluster(1, "#3a7ca5"),
    choices: [
      { id: "1g", ok: true, art: garageArt() + caption("one garage 一个车库") },
      { id: "3g", ok: false, art: `<div class="mini-grid">${garageArt()}${garageArt()}${garageArt()}</div>` + caption("three 三个") },
      { id: "w", ok: false, art: washArt() + caption("wash 洗车") },
    ],
  },
  {
    id: "keys-two-cars",
    promptEn: "One car goes with one key. Two cars go with…?",
    promptZh: "一辆车配一把钥匙。两辆车配……？",
    coachEn: "One key for each car.",
    coachZh: "一辆车一把钥匙。",
    a: cluster(1, "#d94b3a"),
    b: keyArt(),
    c: cluster(2),
    choices: [
      { id: "2k", ok: true, art: `<div class="mini-grid">${keyArt()}${keyArt()}</div>` + caption("two keys 两把钥匙") },
      { id: "1k", ok: false, art: keyArt() + caption("one key 一把钥匙") },
      { id: "w", ok: false, art: washArt() + caption("wash 洗车") },
    ],
  },
  {
    id: "yellow-pickup-ramps",
    promptEn: "One yellow pickup goes with one ramp. Two yellow pickups go with…?",
    promptZh: "一辆黄色皮卡配一个坡道。两辆黄色皮卡配……？",
    coachEn: "One ramp for each yellow pickup.",
    coachZh: "一辆黄色皮卡一个坡道。",
    a: yellowPickupArt(),
    b: rampArt(),
    c: `<div class="mini-grid">${yellowPickupArt()}${yellowPickupArt()}</div>`,
    choices: [
      { id: "2r", ok: true, art: `<div class="mini-grid">${rampArt()}${rampArt()}</div>` + caption("two ramps 两个坡道") },
      { id: "1r", ok: false, art: rampArt() + caption("one ramp 一个坡道") },
      { id: "k", ok: false, art: keyArt() + caption("key 钥匙") },
    ],
  },
  {
    id: "four-wheels-again",
    promptEn: "One pickup goes with four wheels. Three pickups go with…?",
    promptZh: "一辆皮卡配四个轮子。三辆皮卡配……？",
    coachEn: "Four wheels each. Three pickups need twelve wheels.",
    coachZh: "每辆四个轮子。三辆要十二个。",
    a: pickupArt(),
    b: wheelDots(4),
    c: `<div class="mini-grid">${pickupArt()}${pickupWhiteArt()}${yellowPickupArt()}</div>`,
    choices: [
      { id: "12", ok: true, art: wheelDots(12) + caption("wheels 轮子") },
      { id: "4", ok: false, art: wheelDots(4) + caption("wheels 轮子") },
      { id: "8", ok: false, art: wheelDots(8) + caption("wheels 轮子") },
    ],
  },
];

const WHERE_SPOTS = [
  { id: "in", en: "In the garage", zh: "在车库里面", cls: "in" },
  { id: "on", en: "On the roof", zh: "在屋顶上面", cls: "on" },
  { id: "under", en: "Under the ramp", zh: "在坡道下面", cls: "under" },
  { id: "next", en: "Next to the garage", zh: "在车库旁边", cls: "next" },
  { id: "road", en: "On the road", zh: "在马路上", cls: "road" },
  { id: "station", en: "At the fire station", zh: "在消防站", cls: "station" },
  { id: "wash", en: "At the car wash", zh: "在洗车房", cls: "wash" },
  { id: "ramp-on", en: "On the ramp", zh: "在坡道上面", cls: "ramp-on" },
];

const HOUSE_STORIES = [
  {
    id: "wash-eat-sleep",
    titleEn: "Wash, eat rice, sleep",
    titleZh: "洗手、吃米饭、睡觉",
    parentEn: "Sit together. You tell it first: wash hands, then eat rice in a bowl, then sleep.",
    parentZh: "一起坐。你先讲：洗手，然后用碗吃米饭，然后睡觉。",
    beats: [
      {
        id: "a",
        en: "First we wash our hands.",
        zh: "先：洗手。",
        art: storyArt("house-wash", "washing hands at the sink", "wash 洗手"),
      },
      {
        id: "b",
        en: "Then we eat rice in a bowl.",
        zh: "然后：用碗吃米饭。",
        art: storyArt("house-rice", "eating rice at the table", "rice 米饭"),
      },
      {
        id: "c",
        en: "Last we go to sleep. Night-night.",
        zh: "最后：睡觉。晚安。",
        art: storyArt("house-sleep", "sleeping in bed", "sleep 睡觉"),
      },
    ],
  },
  {
    id: "cook-set-eat",
    titleEn: "Cook, set the plate, eat dumplings",
    titleZh: "做饭、摆盘子、吃饺子",
    parentEn: "Three pictures: cook, dinner plate and cup, dumplings. First / then / last.",
    parentZh: "三张图：做饭、摆盘子和杯子、吃饺子。先 / 然后 / 最后。",
    beats: [
      {
        id: "a",
        en: "First we cook on the stove.",
        zh: "先：在炉子上做饭。",
        art: storyArt("house-cook", "cooking on the stove", "cook 做饭"),
      },
      {
        id: "b",
        en: "Then we set the dinner plate and the cup.",
        zh: "然后：摆好盘子和杯子。",
        art: storyArt("house-set", "plate and cup set on the table", "plate and cup 盘子杯子"),
      },
      {
        id: "c",
        en: "Last we eat dumplings.",
        zh: "最后：吃饺子。",
        art: storyArt("house-dumplings", "eating dumplings at the table", "dumplings 饺子"),
      },
    ],
  },
  {
    id: "bath-pj-bed",
    titleEn: "Bath, clothes, bed",
    titleZh: "洗澡、穿衣服、上床",
    parentEn: "Night-time: bath, then clothes, then bed. You narrate; he lines them up.",
    parentZh: "晚上：洗澡，然后穿衣服，然后上床。你讲，他排队。",
    beats: [
      {
        id: "a",
        en: "First we take a bath. Splash!",
        zh: "先：洗澡。哗啦！",
        art: storyArt("house-bath", "bubbly bathtub", "bath 洗澡"),
      },
      {
        id: "b",
        en: "Then we put on clothes for bed.",
        zh: "然后：穿上睡觉的衣服。",
        art: storyArt("house-pj", "pajamas on the bed", "clothes 衣服"),
      },
      {
        id: "c",
        en: "Last we climb into bed.",
        zh: "最后：爬上床。",
        art: storyArt("house-bed", "climbing into bed", "bed 上床"),
      },
    ],
  },
  {
    id: "morning",
    titleEn: "Wake, dress, breakfast",
    titleZh: "起床、穿衣服、吃早饭",
    parentEn: "Morning: wake, shirt, then bread and banana.",
    parentZh: "早上：起床，穿衣服，然后吃面包和香蕉。",
    beats: [
      {
        id: "a",
        en: "First we wake up in bed.",
        zh: "先：在床上醒来。",
        art: storyArt("house-wake", "waking up in bed", "wake 起床"),
      },
      {
        id: "b",
        en: "Then we put on a shirt.",
        zh: "然后：穿上衣服。",
        art: storyArt("house-shirt", "putting on a shirt", "shirt 衣服"),
      },
      {
        id: "c",
        en: "Last we eat bread and a banana.",
        zh: "最后：吃面包和香蕉。",
        art: storyArt("house-breakfast", "eating bread and a banana", "breakfast 早饭"),
      },
    ],
  },
  {
    id: "milk-cup-bread",
    titleEn: "Milk, cup, bread",
    titleZh: "牛奶、杯子、面包",
    parentEn: "Milk, then the cup, then bread. First / then / last.",
    parentZh: "牛奶，然后杯子，然后面包。先 / 然后 / 最后。",
    beats: [
      {
        id: "a",
        en: "First we take the milk.",
        zh: "先：拿出牛奶。",
        art: milkArt() + caption("milk 牛奶"),
      },
      {
        id: "b",
        en: "Then we pour it in the cup.",
        zh: "然后：倒进杯子。",
        art: cupArt() + caption("cup 杯子"),
      },
      {
        id: "c",
        en: "Last we eat bread.",
        zh: "最后：吃面包。",
        art: breadArt() + caption("bread 面包"),
      },
    ],
  },
  {
    id: "pillow-night",
    titleEn: "Pillow, bed, night-night",
    titleZh: "枕头、床、晚安",
    parentEn: "Pillow, then bed, then moon. You narrate; he lines them up.",
    parentZh: "枕头，然后床，然后月亮。你讲，他排队。",
    beats: [
      {
        id: "a",
        en: "First we find the pillow.",
        zh: "先：找到枕头。",
        art: pillowArt() + caption("pillow 枕头"),
      },
      {
        id: "b",
        en: "Then we put it on the bed.",
        zh: "然后：放到床上。",
        art: bedArt() + caption("bed 床"),
      },
      {
        id: "c",
        en: "Last it is night-night.",
        zh: "最后：晚安。",
        art: moonArt() + caption("moon 月亮"),
      },
    ],
  },
  {
    id: "toys-table-bed",
    titleEn: "Toys, table, bed",
    titleZh: "玩具、桌子、床",
    parentEn: "Play with toys, then table time, then bed.",
    parentZh: "先玩玩具，然后桌子，然后上床。",
    beats: [
      {
        id: "a",
        en: "First we play with the toys.",
        zh: "先：玩玩具。",
        art: toysArt() + caption("toys 玩具"),
      },
      {
        id: "b",
        en: "Then we sit at the table.",
        zh: "然后：坐到桌子旁边。",
        art: tableArt() + caption("table 桌子"),
      },
      {
        id: "c",
        en: "Last we go to bed.",
        zh: "最后：上床。",
        art: bedArt() + caption("bed 床"),
      },
    ],
  },
  {
    id: "soup-spoon-table",
    titleEn: "Soup, spoon, table",
    titleZh: "汤、勺子、桌子",
    parentEn: "Soup, then the spoon, then the table. First / then / last.",
    parentZh: "汤，然后勺子，然后桌子。先 / 然后 / 最后。",
    beats: [
      {
        id: "a",
        en: "First we have soup.",
        zh: "先：有汤。",
        art: soupArt() + caption("soup 汤"),
      },
      {
        id: "b",
        en: "Then we take the spoon.",
        zh: "然后：拿勺子。",
        art: spoonArt() + caption("spoon 勺子"),
      },
      {
        id: "c",
        en: "Last we sit at the table.",
        zh: "最后：坐到桌子旁边。",
        art: tableArt() + caption("table 桌子"),
      },
    ],
  },
  {
    id: "noodles-bowl-bed",
    titleEn: "Noodles, bowl, bed",
    titleZh: "面条、碗、床",
    parentEn: "Eat noodles in a bowl, then bed.",
    parentZh: "用碗吃面条，然后上床。",
    beats: [
      {
        id: "a",
        en: "First we have noodles.",
        zh: "先：有面条。",
        art: noodlesArt() + caption("noodles 面条"),
      },
      {
        id: "b",
        en: "Then we eat them in a bowl.",
        zh: "然后：用碗吃。",
        art: bowlSvg() + caption("bowl 碗"),
      },
      {
        id: "c",
        en: "Last we go to bed.",
        zh: "最后：上床。",
        art: bedArt() + caption("bed 床"),
      },
    ],
  },
  {
    id: "apple-fridge-table",
    titleEn: "Apple, fridge, table",
    titleZh: "苹果、冰箱、桌子",
    parentEn: "Apple from the fridge, then the table.",
    parentZh: "从冰箱拿苹果，然后桌子。",
    beats: [
      {
        id: "a",
        en: "First we take an apple.",
        zh: "先：拿出苹果。",
        art: appleArt() + caption("apple 苹果"),
      },
      {
        id: "b",
        en: "Then we get it from the fridge.",
        zh: "然后：从冰箱拿。",
        art: fridgeArt() + caption("fridge 冰箱"),
      },
      {
        id: "c",
        en: "Last we put it on the table.",
        zh: "最后：放到桌子上。",
        art: tableArt() + caption("table 桌子"),
      },
    ],
  },
  {
    id: "pj-pillow-moon",
    titleEn: "Clothes, pillow, moon",
    titleZh: "衣服、枕头、月亮",
    parentEn: "Pajamas, pillow, then night-night moon.",
    parentZh: "睡衣、枕头、然后月亮晚安。",
    beats: [
      {
        id: "a",
        en: "First we put on clothes for bed.",
        zh: "先：穿上睡觉的衣服。",
        art: pajamaArt() + caption("clothes 衣服"),
      },
      {
        id: "b",
        en: "Then we find the pillow.",
        zh: "然后：找到枕头。",
        art: pillowArt() + caption("pillow 枕头"),
      },
      {
        id: "c",
        en: "Last the moon is out. Night-night.",
        zh: "最后：月亮出来了。晚安。",
        art: moonArt() + caption("moon 月亮"),
      },
    ],
  },
  {
    id: "shirt-socks-bed",
    titleEn: "Shirt, socks, bed",
    titleZh: "衣服、袜子、床",
    parentEn: "Dress: shirt, socks, then bed.",
    parentZh: "穿衣服：上衣、袜子、然后床。",
    beats: [
      {
        id: "a",
        en: "First we put on a shirt.",
        zh: "先：穿上衣服。",
        art: shirtArt() + caption("shirt 衣服"),
      },
      {
        id: "b",
        en: "Then we put on socks.",
        zh: "然后：穿上袜子。",
        art: sockArt() + caption("socks 袜子"),
      },
      {
        id: "c",
        en: "Last we climb into bed.",
        zh: "最后：爬上床。",
        art: bedArt() + caption("bed 床"),
      },
    ],
  },
];

const HOUSE_STORY_CLASSIFY = [
  {
    id: "fruits",
    promptEn: "These are all fruits. Which belongs too?",
    promptZh: "这些都是水果。哪一个也属于这里？",
    coachEn: "Apple and banana are fruit. Noodles are hot food.",
    coachZh: "苹果和香蕉是水果。面条是热食。",
    stem: [appleArt(), appleArt()],
    choices: [
      { id: "b", ok: true, art: bananaArt() + caption("banana 香蕉") },
      { id: "n", ok: false, art: noodlesArt() + caption("noodles 面条") },
      { id: "t", ok: false, art: teddyArt() + caption("toy 玩具") },
    ],
  },
  {
    id: "hot-foods",
    promptEn: "These are all hot foods. Which belongs?",
    promptZh: "这些都是热食。哪一个属于这里？",
    coachEn: "Rice, noodles, soup, dumplings — we eat them hot.",
    coachZh: "米饭、面条、汤、饺子——热热的吃。",
    stem: [riceArt(), noodlesArt(), soupArt()],
    choices: [
      { id: "d", ok: true, art: dumplingArt() + caption("dumplings 饺子") },
      { id: "a", ok: false, art: appleArt() + caption("apple 苹果") },
      { id: "b", ok: false, art: bananaArt() + caption("banana 香蕉") },
    ],
  },
  {
    id: "plates",
    promptEn: "These are all dinner plates. Which belongs?",
    promptZh: "这些都是盘子。哪一个属于这里？",
    coachEn: "Flat plates. Not a deep bowl, not a cup.",
    coachZh: "扁扁的盘子。不是深碗，也不是杯子。",
    stem: [tableArt(), tableArt()],
    choices: [
      { id: "p", ok: true, art: plateSvg() + caption("plate 盘子") },
      { id: "b", ok: false, art: bowlSvg() + caption("bowl 碗") },
      { id: "c", ok: false, art: cupArt() + caption("cup 杯子") },
    ],
  },
  {
    id: "bowls",
    promptEn: "These are all bowls. Which belongs too?",
    promptZh: "这些都是碗。哪一个也属于这里？",
    coachEn: "Deep bowls for soup and rice. Not a flat plate.",
    coachZh: "深深的碗，装汤和饭。不是扁盘子。",
    stem: [bowlSvg(), bowlSvg("#3a7ca5"), bowlSvg("#5a9e6f")],
    choices: [
      { id: "b", ok: true, art: bowlSvg("#e8b44c") + caption("bowl 碗") },
      { id: "p", ok: false, art: plateSvg() + caption("plate 盘子") },
      { id: "s", ok: false, art: shirtArt() + caption("shirt 衣服") },
    ],
  },
  {
    id: "toys",
    promptEn: "These are all toys. Which belongs too?",
    promptZh: "这些都是玩具。哪一个也属于这里？",
    coachEn: "Teddy and ball are toys. Rice is food.",
    coachZh: "小熊和球是玩具。米饭是食物。",
    stem: [teddyArt(), toyBallArt()],
    choices: [
      { id: "y", ok: true, art: toysArt() + caption("toys 玩具") },
      { id: "r", ok: false, art: riceArt() + caption("rice 米饭") },
      { id: "s", ok: false, art: shirtArt() + caption("shirt 衣服") },
    ],
  },
  {
    id: "clothes",
    promptEn: "These are all clothes. Which belongs?",
    promptZh: "这些都是衣服。哪一个属于这里？",
    coachEn: "Shirt and pants. Not a bowl.",
    coachZh: "上衣和裤子。不是碗。",
    stem: [shirtArt(), pantsArt()],
    choices: [
      { id: "k", ok: true, art: sockArt() + caption("socks 袜子") },
      { id: "b", ok: false, art: bowlSvg() + caption("bowl 碗") },
      { id: "m", ok: false, art: milkArt() + caption("milk 牛奶") },
    ],
  },
  {
    id: "sleep-things",
    promptEn: "These are for sleeping. Which belongs too?",
    promptZh: "这些是睡觉用的。哪一个也属于这里？",
    coachEn: "Bed and pillow. Not a stove.",
    coachZh: "床和枕头。不是炉子。",
    stem: [bedArt(), pillowArt()],
    choices: [
      { id: "pj", ok: true, art: pajamaArt() + caption("clothes 衣服") },
      { id: "st", ok: false, art: stoveArt() + caption("stove 炉子") },
      { id: "a", ok: false, art: appleArt() + caption("apple 苹果") },
    ],
  },
  {
    id: "drinks-milk",
    promptEn: "These are for drinking. Which belongs too?",
    promptZh: "这些是喝的。哪一个也属于这里？",
    coachEn: "Cup and milk. Not a pillow.",
    coachZh: "杯子和牛奶。不是枕头。",
    stem: [cupArt(), cupArt()],
    choices: [
      { id: "m", ok: true, art: milkArt() + caption("milk 牛奶") },
      { id: "p", ok: false, art: pillowArt() + caption("pillow 枕头") },
      { id: "t", ok: false, art: teddyArt() + caption("toy 玩具") },
    ],
  },
  {
    id: "kitchen-tools",
    promptEn: "These belong in the kitchen. Which belongs too?",
    promptZh: "这些属于厨房。哪一个也属于这里？",
    coachEn: "Spoon and stove. Not a pillow.",
    coachZh: "勺子和炉子。不是枕头。",
    stem: [spoonArt(), stoveArt()],
    choices: [
      { id: "c", ok: true, art: cupArt() + caption("cup 杯子") },
      { id: "p", ok: false, art: pillowArt() + caption("pillow 枕头") },
      { id: "s", ok: false, art: shirtArt() + caption("shirt 衣服") },
    ],
  },
  {
    id: "breakfast-foods",
    promptEn: "These are breakfast foods. Which belongs too?",
    promptZh: "这些是早饭。哪一个也属于这里？",
    coachEn: "Bread and banana. An apple is food too. Not a teddy.",
    coachZh: "面包和香蕉。苹果也是食物。不是小熊。",
    stem: [breadArt(), bananaArt()],
    choices: [
      { id: "a", ok: true, art: appleArt() + caption("apple 苹果") },
      { id: "t", ok: false, art: teddyArt() + caption("toy 玩具") },
      { id: "s", ok: false, art: shirtArt() + caption("shirt 衣服") },
    ],
  },
];

const HOUSE_STORY_ANALOGY = [
  {
    id: "rice-bowl-bread",
    promptEn: "Rice goes with the bowl. Bread goes with…?",
    promptZh: "米饭配碗。面包配……？",
    coachEn: "Rice sits in a bowl. Bread sits on a plate.",
    coachZh: "米饭放在碗里。面包放在盘子上。",
    a: riceArt(),
    b: bowlSvg(),
    c: breadArt(),
    choices: [
      { id: "pl", ok: true, art: plateSvg() + caption("plate 盘子") },
      { id: "stove", ok: false, art: stoveArt() + caption("stove 炉子") },
      { id: "ball", ok: false, art: toysArt() + caption("toys 玩具") },
    ],
  },
  {
    id: "apple-fridge-shirt",
    promptEn: "Apple goes with the fridge. Shirt goes with…?",
    promptZh: "苹果配冰箱。衣服配……？",
    coachEn: "Cold fruit in the fridge. Clothes in the cupboard.",
    coachZh: "冷的水果进冰箱。衣服进柜子。",
    a: appleArt(),
    b: fridgeArt(),
    c: shirtArt(),
    choices: [
      { id: "cup", ok: true, art: cupboardArt() + caption("cupboard 柜子") },
      { id: "tub", ok: false, art: tubArt() + caption("bath 浴缸") },
      { id: "bowl", ok: false, art: bowlSvg() + caption("bowl 碗") },
    ],
  },
  {
    id: "dumplings-milk",
    promptEn: "Dumplings go with the bowl. Milk goes with…?",
    promptZh: "饺子配碗。牛奶配……？",
    coachEn: "Dumplings in a bowl. Milk in a cup.",
    coachZh: "饺子盛在碗里。牛奶倒在杯子里。",
    a: dumplingArt(),
    b: bowlSvg(),
    c: milkArt(),
    choices: [
      { id: "cup", ok: true, art: cupArt() + caption("cup 杯子") },
      { id: "bed", ok: false, art: bedArt() + caption("bed 床") },
      { id: "ball", ok: false, art: toysArt() + caption("toys 玩具") },
    ],
  },
  {
    id: "spoon-banana",
    promptEn: "Spoon goes with the bowl. Banana goes with…?",
    promptZh: "勺子配碗。香蕉配……？",
    coachEn: "Spoon is for the bowl. Banana is a fruit, like the apple.",
    coachZh: "勺子配碗。香蕉是水果，像苹果。",
    a: spoonArt(),
    b: bowlSvg(),
    c: bananaArt(),
    choices: [
      { id: "ap", ok: true, art: appleArt() + caption("apple 苹果") },
      { id: "stove", ok: false, art: stoveArt() + caption("stove 炉子") },
      { id: "pants", ok: false, art: pantsArt() + caption("pants 裤子") },
    ],
  },
  {
    id: "pillow-bed-bowl-table",
    promptEn: "Pillow goes with the bed. Bowl goes with…?",
    promptZh: "枕头配床。碗配……？",
    coachEn: "Pillow belongs on the bed. Bowl belongs on the table.",
    coachZh: "枕头在床上。碗在桌子上。",
    a: pillowArt(),
    b: bedArt(),
    c: bowlSvg(),
    choices: [
      { id: "t", ok: true, art: tableArt() + caption("table 桌子") },
      { id: "y", ok: false, art: toysArt() + caption("toys 玩具") },
      { id: "f", ok: false, art: fridgeArt() + caption("fridge 冰箱") },
    ],
  },
  {
    id: "milk-fridge-shirt",
    promptEn: "Milk goes with the fridge. Shirt goes with…?",
    promptZh: "牛奶配冰箱。衣服配……？",
    coachEn: "Cold milk in the fridge. Clothes in the cupboard.",
    coachZh: "冷牛奶进冰箱。衣服进柜子。",
    a: milkArt(),
    b: fridgeArt(),
    c: shirtArt(),
    choices: [
      { id: "cup", ok: true, art: cupboardArt() + caption("cupboard 柜子") },
      { id: "bed", ok: false, art: bedArt() + caption("bed 床") },
      { id: "y", ok: false, art: toysArt() + caption("toys 玩具") },
    ],
  },
  {
    id: "toys-teddy-clothes",
    promptEn: "Toys go with the teddy. Clothes go with…?",
    promptZh: "玩具配小熊。衣服配……？",
    coachEn: "Teddy is a toy. Shirt is clothes.",
    coachZh: "小熊是玩具。上衣是衣服。",
    a: toysArt(),
    b: teddyArt(),
    c: pantsArt(),
    choices: [
      { id: "sh", ok: true, art: shirtArt() + caption("shirt 衣服") },
      { id: "r", ok: false, art: riceArt() + caption("rice 米饭") },
      { id: "m", ok: false, art: milkArt() + caption("milk 牛奶") },
    ],
  },
  {
    id: "soup-bowl-noodles",
    promptEn: "Soup goes with the bowl. Noodles go with…?",
    promptZh: "汤配碗。面条配……？",
    coachEn: "Soup in a bowl. Noodles in a bowl too.",
    coachZh: "汤盛在碗里。面条也盛在碗里。",
    a: soupArt(),
    b: bowlSvg(),
    c: noodlesArt(),
    choices: [
      { id: "bowl", ok: true, art: bowlSvg("#3a7ca5") + caption("bowl 碗") },
      { id: "bed", ok: false, art: bedArt() + caption("bed 床") },
      { id: "shirt", ok: false, art: shirtArt() + caption("shirt 衣服") },
    ],
  },
  {
    id: "banana-table-pillow",
    promptEn: "Banana goes with the table. Pillow goes with…?",
    promptZh: "香蕉配桌子。枕头配……？",
    coachEn: "Food on the table. Pillow on the bed.",
    coachZh: "食物在桌子上。枕头在床上。",
    a: bananaArt(),
    b: tableArt(),
    c: pillowArt(),
    choices: [
      { id: "bed", ok: true, art: bedArt() + caption("bed 床") },
      { id: "stove", ok: false, art: stoveArt() + caption("stove 炉子") },
      { id: "toys", ok: false, art: toysArt() + caption("toys 玩具") },
    ],
  },
];

const HOUSE_STORY_SENTENCE = [
  {
    id: "eat-rice-bowl",
    sentenceEn: "We eat rice in the…",
    sentenceZh: "我们用……吃米饭。",
    parentEn: "You read the sentence. He taps the picture that finishes it.",
    parentZh: "你读句子。他点选把句子说完的图片。",
    choices: [
      { id: "b", ok: true, art: bowlSvg() + caption("bowl 碗") },
      { id: "bed", ok: false, art: bedArt() + caption("bed 床") },
      { id: "c", ok: false, art: cupboardArt() + caption("cupboard 柜子") },
    ],
  },
  {
    id: "dumplings-plate",
    sentenceEn: "We put dumplings on the…",
    sentenceZh: "我们把饺子放在……",
    parentEn: "You read. He finishes with a picture.",
    parentZh: "你读。他用图片把话说完。",
    choices: [
      { id: "p", ok: true, art: plateSvg() + caption("plate 盘子") },
      { id: "s", ok: false, art: stoveArt() + caption("stove 炉子") },
      { id: "f", ok: false, art: fridgeArt() + caption("fridge 冰箱") },
    ],
  },
  {
    id: "drink-milk-cup",
    sentenceEn: "We drink milk from the…",
    sentenceZh: "我们用……喝牛奶。",
    parentEn: "Leave a blank at the end. Wait.",
    parentZh: "句尾留空。等他。",
    choices: [
      { id: "c", ok: true, art: cupArt() + caption("cup 杯子") },
      { id: "b", ok: false, art: bedArt() + caption("bed 床") },
      { id: "t", ok: false, art: toysArt() + caption("toys 玩具") },
    ],
  },
  {
    id: "dirty-hands",
    sentenceEn: "Dirty hands need the…",
    sentenceZh: "脏脏的手需要……",
    parentEn: "You say the sentence. He taps.",
    parentZh: "你读句子。他点。",
    choices: [
      { id: "w", ok: true, art: washHandsArt() + caption("wash 洗手") },
      { id: "p", ok: false, art: pillowArt() + caption("pillow 枕头") },
      { id: "d", ok: false, art: dumplingArt() + caption("dumplings 饺子") },
    ],
  },
  {
    id: "eat-noodles-bowl",
    sentenceEn: "We eat noodles in the…",
    sentenceZh: "我们用……吃面条。",
    parentEn: "You say the sentence. He taps.",
    parentZh: "你读句子。他点。",
    choices: [
      { id: "b", ok: true, art: bowlSvg() + caption("bowl 碗") },
      { id: "bed", ok: false, art: bedArt() + caption("bed 床") },
      { id: "t", ok: false, art: toysArt() + caption("toys 玩具") },
    ],
  },
  {
    id: "pillow-on-bed",
    sentenceEn: "We put the pillow on the…",
    sentenceZh: "我们把枕头放在……",
    parentEn: "You say the sentence. He taps.",
    parentZh: "你读句子。他点。",
    choices: [
      { id: "bed", ok: true, art: bedArt() + caption("bed 床") },
      { id: "st", ok: false, art: stoveArt() + caption("stove 炉子") },
      { id: "a", ok: false, art: appleArt() + caption("apple 苹果") },
    ],
  },
  {
    id: "soup-needs-spoon",
    sentenceEn: "We eat soup with a…",
    sentenceZh: "我们用……喝汤。",
    parentEn: "You say the sentence. He taps.",
    parentZh: "你读句子。他点。",
    choices: [
      { id: "sp", ok: true, art: spoonArt() + caption("spoon 勺子") },
      { id: "p", ok: false, art: pillowArt() + caption("pillow 枕头") },
      { id: "t", ok: false, art: teddyArt() + caption("toy 玩具") },
    ],
  },
  {
    id: "apple-in-fridge",
    sentenceEn: "We keep the apple in the…",
    sentenceZh: "我们把苹果放进……",
    parentEn: "You say the sentence. He taps.",
    parentZh: "你读句子。他点。",
    choices: [
      { id: "f", ok: true, art: fridgeArt() + caption("fridge 冰箱") },
      { id: "bed", ok: false, art: bedArt() + caption("bed 床") },
      { id: "y", ok: false, art: toysArt() + caption("toys 玩具") },
    ],
  },
];

const HOUSE_BAY_CLASSIFY = [
  {
    id: "h-bay-fruits",
    promptEn: "These are fruits. Which belongs too?",
    promptZh: "这些是水果。哪一个也属于这里？",
    coachEn: "Fruit we can eat cold. Not hot noodles.",
    coachZh: "凉的水果。不是热面条。",
    stem: [bananaArt(), bananaArt()],
    choices: [
      { id: "a", ok: true, art: appleArt() + caption("apple 苹果") },
      { id: "n", ok: false, art: noodlesArt() + caption("noodles 面条") },
      { id: "t", ok: false, art: teddyArt() + caption("toy 玩具") },
    ],
  },
  {
    id: "h-bay-hot",
    promptEn: "These are hot foods. Which belongs?",
    promptZh: "这些是热食。哪一个属于这里？",
    coachEn: "Rice, noodles, soup, dumplings. A banana is fruit.",
    coachZh: "米饭、面条、汤、饺子。香蕉是水果。",
    stem: [noodlesArt(), soupArt(), dumplingArt()],
    choices: [
      { id: "r", ok: true, art: riceArt() + caption("rice 米饭") },
      { id: "b", ok: false, art: bananaArt() + caption("banana 香蕉") },
      { id: "t", ok: false, art: teddyArt() + caption("toy 玩具") },
    ],
  },
  {
    promptEn: "These are dinner plates. Which belongs?",
    promptZh: "这些是盘子。哪一个属于这里？",
    coachEn: "Flat plates. A bowl is deep.",
    coachZh: "扁扁的盘子。碗是深的。",
    stem: [tableArt(), tableArt()],
    choices: [
      { id: "p", ok: true, art: plateSvg() + caption("plate 盘子") },
      { id: "b", ok: false, art: bowlSvg() + caption("bowl 碗") },
      { id: "c", ok: false, art: cupArt() + caption("cup 杯子") },
    ],
  },
  {
    promptEn: "These are bowls. Which belongs too?",
    promptZh: "这些是碗。哪一个也属于这里？",
    coachEn: "Deep bowls. Not a flat plate.",
    coachZh: "深深的碗。不是扁盘子。",
    stem: [bowlSvg(), bowlSvg("#3a7ca5")],
    choices: [
      { id: "b", ok: true, art: bowlSvg("#e8b44c") + caption("bowl 碗") },
      { id: "p", ok: false, art: plateSvg() + caption("plate 盘子") },
      { id: "y", ok: false, art: toysArt() + caption("toys 玩具") },
    ],
  },
  {
    promptEn: "These belong in the kitchen. Which belongs too?",
    promptZh: "这些属于厨房。哪一个也属于这里？",
    coachEn: "Kitchen: stove, bowls, fridge. Bed is for the bedroom.",
    coachZh: "厨房：炉子、碗、冰箱。床是卧室的。",
    stem: [stoveArt(), fridgeArt(), bowlSvg()],
    choices: [
      { id: "c", ok: true, art: cupArt() + caption("cup 杯子") },
      { id: "b", ok: false, art: bedArt() + caption("bed 床") },
      { id: "y", ok: false, art: toysArt() + caption("toys 玩具") },
    ],
  },
  {
    id: "bay-fridge",
    promptEn: "What belongs in the fridge?",
    promptZh: "什么可以放进冰箱？",
    coachEn: "Cold food. Milk and apple. Not a shirt.",
    coachZh: "冷的食物。牛奶和苹果。不是衣服。",
    stem: [appleArt(), fridgeArt()],
    choices: [
      { id: "m", ok: true, art: milkArt() + caption("milk 牛奶") },
      { id: "s", ok: false, art: shirtArt() + caption("shirt 衣服") },
      { id: "t", ok: false, art: toysArt() + caption("toys 玩具") },
    ],
  },
  {
    id: "bay-toys",
    promptEn: "These are toys. Which belongs too?",
    promptZh: "这些是玩具。哪一个也属于这里？",
    coachEn: "Teddy and ball. Not rice.",
    coachZh: "小熊和球。不是米饭。",
    stem: [teddyArt(), toyBallArt()],
    choices: [
      { id: "y", ok: true, art: toysArt() + caption("toys 玩具") },
      { id: "r", ok: false, art: riceArt() + caption("rice 米饭") },
      { id: "p", ok: false, art: plateSvg() + caption("plate 盘子") },
    ],
  },
  {
    id: "bay-sleep",
    promptEn: "These are for bed. Which belongs too?",
    promptZh: "这些是睡觉的。哪一个也属于这里？",
    coachEn: "Bed and clothes for sleep. Not a stove.",
    coachZh: "床和睡觉的衣服。不是炉子。",
    stem: [bedArt(), pajamaArt()],
    choices: [
      { id: "p", ok: true, art: pillowArt() + caption("pillow 枕头") },
      { id: "st", ok: false, art: stoveArt() + caption("stove 炉子") },
      { id: "a", ok: false, art: appleArt() + caption("apple 苹果") },
    ],
  },
  {
    id: "bay-drinks",
    promptEn: "These are for drinking. Which belongs?",
    promptZh: "这些是喝的。哪一个属于这里？",
    coachEn: "Milk goes in a cup. Not a pillow.",
    coachZh: "牛奶倒在杯子里。不是枕头。",
    stem: [cupArt(), cupArt()],
    choices: [
      { id: "m", ok: true, art: milkArt() + caption("milk 牛奶") },
      { id: "p", ok: false, art: pillowArt() + caption("pillow 枕头") },
      { id: "y", ok: false, art: toysArt() + caption("toys 玩具") },
    ],
  },
];

const HOUSE_BAY_MATRIX = [
  {
    id: "h-matrix-kitchen-sleep",
    promptEn: "What finishes the house pattern?",
    promptZh: "哪一个能把家里的图案补齐？",
    coachEn: "Look across (kitchen things), then down (sleep things).",
    coachZh: "先横着看厨房的，再竖着看睡觉的。",
    cells: [riceArt(), stoveArt(), pillowArt()],
    choices: [
      { id: "ok", ok: true, art: bedArt() },
      { id: "a", ok: false, art: bowlSvg("#d94b3a") },
      { id: "b", ok: false, art: toyBallArt() },
      { id: "c", ok: false, art: appleArt() },
    ],
  },
  {
    promptEn: "What finishes the house pattern?",
    promptZh: "哪一个能把家里的图案补齐？",
    id: "h-matrix-clothes-food",
    promptEn: "What finishes the house pattern?",
    promptZh: "哪一个能把家里的图案补齐？",
    coachEn: "Across: clothes. Down: food.",
    coachZh: "横着是衣服。竖着是食物。",
    cells: [shirtArt(), pantsArt(), appleArt()],
    choices: [
      { id: "ok", ok: true, art: bananaArt() },
      { id: "a", ok: false, art: sockArt() },
      { id: "b", ok: false, art: teddyArt() },
      { id: "c", ok: false, art: bedArt() },
    ],
  },
  {
    id: "h-matrix-bowls",
    promptEn: "What finishes the house pattern?",
    promptZh: "哪一个能把家里的图案补齐？",
    coachEn: "Across: one bowl, then two. Down: red, then blue.",
    coachZh: "横着：一个碗再到两个。竖着：红色再到蓝色。",
    cells: [houseCluster(1, "#d94b3a"), houseCluster(2, "#d94b3a"), houseCluster(1, "#3a7ca5")],
    choices: [
      { id: "ok", ok: true, art: houseCluster(2, "#3a7ca5") },
      { id: "a", ok: false, art: houseCluster(1, "#3a7ca5") },
      { id: "b", ok: false, art: houseCluster(2, "#d94b3a") },
      { id: "c", ok: false, art: houseCluster(3, "#3a7ca5") },
    ],
  },
  {
    id: "h-matrix-toy-clothes",
    promptEn: "What finishes the house pattern?",
    promptZh: "哪一个能把家里的图案补齐？",
    coachEn: "Across: toy then clothes. Down: ball then teddy.",
    coachZh: "横着：玩具再到衣服。竖着：球再到熊。",
    cells: [toyBallArt(), shirtArt(), teddyArt()],
    choices: [
      { id: "ok", ok: true, art: pajamaArt() },
      { id: "a", ok: false, art: toyBallArt() },
      { id: "b", ok: false, art: appleArt() },
      { id: "c", ok: false, art: fridgeArt() },
    ],
  },
  {
    id: "h-matrix-milk-pillow",
    promptEn: "What finishes the house pattern?",
    promptZh: "哪一个能把家里的图案补齐？",
    coachEn: "Across: drink things. Down: sleep things.",
    coachZh: "横着是喝的。竖着是睡觉的。",
    cells: [milkArt(), cupArt(), pillowArt()],
    choices: [
      { id: "ok", ok: true, art: bedArt() },
      { id: "a", ok: false, art: toysArt() },
      { id: "b", ok: false, art: appleArt() },
      { id: "c", ok: false, art: stoveArt() },
    ],
  },
  {
    id: "h-matrix-bowl-table",
    promptEn: "What finishes the house pattern?",
    promptZh: "哪一个能把家里的图案补齐？",
    coachEn: "Across: food then its place. Down: bowl then pillow.",
    coachZh: "横着：食物再到它的地方。竖着：碗再到枕头。",
    cells: [bowlSvg(), tableArt(), pillowArt()],
    choices: [
      { id: "ok", ok: true, art: bedArt() },
      { id: "a", ok: false, art: fridgeArt() },
      { id: "b", ok: false, art: appleArt() },
      { id: "c", ok: false, art: toysArt() },
    ],
  },
  {
    id: "h-matrix-blue-yellow-bowl",
    promptEn: "What finishes the house pattern?",
    promptZh: "哪一个能把家里的图案补齐？",
    coachEn: "Across: one then two. Down: yellow bowl, then blue bowl.",
    coachZh: "横着：一个再到两个。竖着：黄碗再到蓝碗。",
    cells: [houseCluster(1, "#e8b44c"), houseCluster(2, "#e8b44c"), houseCluster(1, "#3a7ca5")],
    choices: [
      { id: "ok", ok: true, art: houseCluster(2, "#3a7ca5") },
      { id: "a", ok: false, art: houseCluster(1, "#3a7ca5") },
      { id: "b", ok: false, art: houseCluster(2, "#e8b44c") },
      { id: "c", ok: false, art: houseCluster(3, "#3a7ca5") },
    ],
  },
];

const HOUSE_SERIES = [
  { id: "h-by-two", seq: [2, 4, 6], answer: 8, distractors: [7, 5], en: "Count up by two bowls.", zh: "每次多两个碗。" },
  { id: "h-leave-one", seq: [5, 4, 3], answer: 2, distractors: [4, 6], en: "One dumpling leaves each time.", zh: "每次少一个饺子。" },
  { id: "h-plus-one", seq: [1, 2, 3], answer: 4, distractors: [2, 5], en: "One more apple each time.", zh: "每次多一个苹果。" },
  { id: "h-same", seq: [2, 2, 2], answer: 2, distractors: [3, 4], en: "It stays the same.", zh: "一直一样多。" },
  { id: "h-plus-two-odd", seq: [3, 5, 7], answer: 9, distractors: [8, 6], en: "Two more each time.", zh: "每次多两个。" },
  { id: "h-minus-one", seq: [4, 3, 2], answer: 1, distractors: [3, 5], en: "One less each time.", zh: "每次少一个。" },
  { id: "h-odds", seq: [1, 3, 5], answer: 7, distractors: [6, 8], en: "Skip one each time.", zh: "每次跳过一个。" },
  { id: "h-down-from-6", seq: [6, 5, 4], answer: 3, distractors: [2, 5], en: "One leaves each time.", zh: "每次少一个。" },
  { id: "h-by-three", seq: [3, 6, 9], answer: 12, distractors: [10, 11], en: "Count up by three bowls.", zh: "每次多三个碗。" },
  { id: "h-down-by-two", seq: [8, 6, 4], answer: 2, distractors: [3, 5], en: "Two leave each time.", zh: "每次少两个。" },
  { id: "h-plus-one-from-5", seq: [5, 6, 7], answer: 8, distractors: [9, 6], en: "One more each time.", zh: "每次多一个。" },
  { id: "h-same-threes", seq: [3, 3, 3], answer: 3, distractors: [2, 4], en: "It stays the same.", zh: "一直一样多。" },
  { id: "h-twos-to-fives", seq: [2, 3, 4], answer: 5, distractors: [6, 3], en: "One more each time.", zh: "每次多一个。" },
  { id: "h-from-ten", seq: [10, 9, 8], answer: 7, distractors: [6, 9], en: "One leaves each time.", zh: "每次少一个。" },
  { id: "h-evens-up", seq: [4, 6, 8], answer: 10, distractors: [9, 7], en: "Two more each time.", zh: "每次多两个。" },
];

const HOUSE_NUM_ANALOGY = [
  {
    id: "h-spoons",
    promptEn: "One bowl goes with one spoon. Two bowls go with…?",
    promptZh: "一个碗配一把勺子。两个碗配……？",
    coachEn: "One spoon for each bowl.",
    coachZh: "一个碗一把勺子。",
    a: houseCluster(1, "#d94b3a"),
    b: spoonArt(),
    c: houseCluster(2, "#d94b3a"),
    choices: [
      { id: "2s", ok: true, art: `<div class="mini-grid">${spoonArt()}${spoonArt()}</div>` + caption("two spoons 两把勺") },
      { id: "1s", ok: false, art: spoonArt() + caption("one spoon 一把勺") },
      { id: "bed", ok: false, art: bedArt() + caption("bed 床") },
    ],
  },
  {
    id: "h-plates",
    promptEn: "One apple goes with one plate. Two apples go with…?",
    promptZh: "一个苹果配一个盘子。两个苹果配……？",
    coachEn: "One plate each.",
    coachZh: "一个一个配。",
    a: appleArt(),
    b: plateSvg(),
    c: `<div class="mini-grid">${appleArt()}${appleArt()}</div>`,
    choices: [
      { id: "2p", ok: true, art: `<div class="mini-grid">${plateSvg()}${plateSvg()}</div>` + caption("two plates 两个盘") },
      { id: "1p", ok: false, art: plateSvg() + caption("one plate 一个盘") },
      { id: "3p", ok: false, art: `<div class="mini-grid">${plateSvg()}${plateSvg()}${plateSvg()}</div>` + caption("three plates 三个盘") },
    ],
  },
  {
    id: "h-placemats",
    promptEn: "Two bowls go with two placemats. Three bowls go with…?",
    promptZh: "两个碗配两个垫子。三个碗配……？",
    coachEn: "Match the number.",
    coachZh: "数量要一样。",
    a: houseCluster(2, "#e8b44c"),
    b: houseCluster(2, "#c9c2b0"),
    c: houseCluster(3, "#e8b44c"),
    choices: [
      { id: "3", ok: true, art: houseCluster(3, "#c9c2b0") + caption("three 三个") },
      { id: "2", ok: false, art: houseCluster(2, "#c9c2b0") + caption("two 两个") },
      { id: "4", ok: false, art: houseCluster(4, "#c9c2b0") + caption("four 四个") },
    ],
  },
  {
    id: "h-cups-milk",
    promptEn: "One cup goes with one milk. Two cups go with…?",
    promptZh: "一个杯子配一份牛奶。两个杯子配……？",
    coachEn: "One milk for each cup.",
    coachZh: "一个杯子一份牛奶。",
    a: cupArt(),
    b: milkArt(),
    c: `<div class="mini-grid">${cupArt()}${cupArt()}</div>`,
    choices: [
      { id: "2m", ok: true, art: `<div class="mini-grid">${milkArt()}${milkArt()}</div>` + caption("two milks 两杯奶") },
      { id: "1m", ok: false, art: milkArt() + caption("one milk 一杯奶") },
      { id: "p", ok: false, art: pillowArt() + caption("pillow 枕头") },
    ],
  },
  {
    id: "h-toys-teddy",
    promptEn: "One toy pile goes with one teddy. Two toy piles go with…?",
    promptZh: "一堆玩具配一只小熊。两堆玩具配……？",
    coachEn: "One teddy for each pile.",
    coachZh: "一堆一只小熊。",
    a: toysArt(),
    b: teddyArt(),
    c: `<div class="mini-grid">${toysArt()}${toysArt()}</div>`,
    choices: [
      { id: "2t", ok: true, art: `<div class="mini-grid">${teddyArt()}${teddyArt()}</div>` + caption("two teddies 两只熊") },
      { id: "1t", ok: false, art: teddyArt() + caption("one teddy 一只熊") },
      { id: "b", ok: false, art: bedArt() + caption("bed 床") },
    ],
  },
];

const HOUSE_WHERE_SPOTS = [
  { id: "on", en: "On the table", zh: "在桌子上面", cls: "on" },
  { id: "under", en: "Under the bed", zh: "在床下面", cls: "under" },
  { id: "in", en: "In the cupboard", zh: "在柜子里面", cls: "in" },
  { id: "next", en: "Next to the table", zh: "在桌子旁边", cls: "next" },
  { id: "fridge", en: "In the fridge", zh: "在冰箱里面", cls: "fridge" },
  { id: "sink", en: "At the sink", zh: "在洗手池", cls: "sink" },
  { id: "bed-on", en: "On the bed", zh: "在床上面", cls: "bed-on" },
  { id: "stove", en: "On the stove", zh: "在炉子上", cls: "stove" },
];

function whereChoices(spots, correctId, artFn) {
  const correct = spots.find((s) => s.id === correctId);
  const others = shuffle(spots.filter((s) => s.id !== correctId)).slice(0, 3);
  return shuffle(
    [correct, ...others].filter(Boolean).map((s) => ({
      id: s.id,
      ok: s.id === correctId,
      label: `${s.en} ${s.zh}`,
      art: artFn(s.cls),
    }))
  );
}

const GARAGE_BELONG = [
  {
    id: "belong-white-home",
    promptEn: "Where does the white pickup sleep?",
    promptZh: "白色皮卡在哪里睡觉？",
    show: pickupWhiteArt(),
    choices: [
      { id: "g", ok: true, art: garageArt() + caption("garage 车库") },
      { id: "w", ok: false, art: washArt() + caption("wash 洗车") },
      { id: "f", ok: false, art: fireStationArt() + caption("fire station 消防站") },
    ],
  },
  {
    id: "belong-fire-home",
    promptEn: "Where does the fire truck sleep?",
    promptZh: "消防车在哪里睡觉？",
    show: fireTruckArt(),
    choices: [
      { id: "f", ok: true, art: fireStationArt() + caption("fire station 消防站") },
      { id: "g", ok: false, art: garageArt() + caption("garage 车库") },
      { id: "w", ok: false, art: washArt() + caption("wash 洗车") },
    ],
  },
  {
    id: "belong-dirty-wash",
    promptEn: "Where does the dusty pickup go?",
    promptZh: "脏皮卡要去哪里？",
    show: photo("car-dirty-blue", "dusty pickup"),
    choices: [
      { id: "w", ok: true, art: washArt() + caption("wash 洗车") },
      { id: "g", ok: false, art: garageArt() + caption("garage 车库") },
      { id: "m", ok: false, art: moonArt() + caption("moon 月亮") },
    ],
  },
  {
    id: "belong-sports-home",
    promptEn: "Where does the sports car sleep?",
    promptZh: "跑车在哪里睡觉？",
    show: sportsCarArt(),
    choices: [
      { id: "g", ok: true, art: garageArt() + caption("garage 车库") },
      { id: "f", ok: false, art: fireStationArt() + caption("fire station 消防站") },
      { id: "r", ok: false, art: rampArt() + caption("ramp 坡道") },
    ],
  },
  {
    id: "belong-yellow-pickup",
    promptEn: "Where does the yellow pickup park?",
    promptZh: "黄色皮卡停在哪里？",
    show: yellowPickupArt(),
    choices: [
      { id: "g", ok: true, art: garageArt() + caption("garage 车库") },
      { id: "w", ok: false, art: washArt() + caption("wash 洗车") },
      { id: "k", ok: false, art: keyArt() + caption("keys 钥匙") },
    ],
  },
];

const HOUSE_BELONG = [
  {
    id: "belong-pillow-bed",
    promptEn: "Where does the pillow go?",
    promptZh: "枕头放在哪里？",
    show: pillowArt(),
    choices: [
      { id: "b", ok: true, art: bedArt() + caption("bed 床") },
      { id: "t", ok: false, art: tableArt() + caption("table 桌子") },
      { id: "f", ok: false, art: fridgeArt() + caption("fridge 冰箱") },
    ],
  },
  {
    id: "belong-bowl-table",
    promptEn: "Where does the bowl go?",
    promptZh: "碗放在哪里？",
    show: bowlSvg(),
    choices: [
      { id: "t", ok: true, art: tableArt() + caption("table 桌子") },
      { id: "b", ok: false, art: bedArt() + caption("bed 床") },
      { id: "y", ok: false, art: toysArt() + caption("toys 玩具") },
    ],
  },
  {
    id: "belong-milk-fridge",
    promptEn: "Where does the milk go?",
    promptZh: "牛奶放在哪里？",
    show: milkArt(),
    choices: [
      { id: "f", ok: true, art: fridgeArt() + caption("fridge 冰箱") },
      { id: "b", ok: false, art: bedArt() + caption("bed 床") },
      { id: "s", ok: false, art: stoveArt() + caption("stove 炉子") },
    ],
  },
  {
    id: "belong-shirt-cupboard",
    promptEn: "Where does the shirt go?",
    promptZh: "衣服放在哪里？",
    show: shirtArt(),
    choices: [
      { id: "c", ok: true, art: cupboardArt() + caption("cupboard 柜子") },
      { id: "f", ok: false, art: fridgeArt() + caption("fridge 冰箱") },
      { id: "t", ok: false, art: tableArt() + caption("table 桌子") },
    ],
  },
  {
    id: "belong-rice-bowl",
    promptEn: "Where does the rice go?",
    promptZh: "米饭放在哪里？",
    show: riceArt(),
    choices: [
      { id: "b", ok: true, art: bowlSvg() + caption("bowl 碗") },
      { id: "p", ok: false, art: pillowArt() + caption("pillow 枕头") },
      { id: "y", ok: false, art: toysArt() + caption("toys 玩具") },
    ],
  },
];

const GARAGE_MYSTERIES = [
  {
    id: "mx-fire-truck",
    labelEn: "fire truck",
    labelZh: "消防车",
    art: fireTruckArt,
    hints: [
      { en: "It is red.", zh: "它是红色的。" },
      { en: "It has a ladder.", zh: "它有一个梯子。" },
      { en: "It goes to fires.", zh: "它会去救火。" },
    ],
  },
  {
    id: "mx-pickup",
    labelEn: "pickup truck",
    labelZh: "皮卡",
    art: pickupArt,
    hints: [
      { en: "It is a truck.", zh: "它是一辆卡车。" },
      { en: "It has a box in the back.", zh: "后面有一个货箱。" },
      { en: "Families drive it.", zh: "家里人会开它。" },
    ],
  },
  {
    id: "mx-sports",
    labelEn: "sports car",
    labelZh: "跑车",
    art: sportsCarArt,
    hints: [
      { en: "It is low and fast.", zh: "它又矮又快。" },
      { en: "It looks shiny.", zh: "它看起来亮亮的。" },
      { en: "It looks like a race car.", zh: "它好像赛车。" },
    ],
  },
  {
    id: "mx-keys",
    labelEn: "keys",
    labelZh: "钥匙",
    art: keyArt,
    hints: [
      { en: "They are small.", zh: "它们小小的。" },
      { en: "They open the car.", zh: "它们能打开车子。" },
      { en: "You hold them in your hand.", zh: "你可以拿在手里。" },
    ],
  },
  {
    id: "mx-ramp",
    labelEn: "ramp",
    labelZh: "坡道",
    art: rampArt,
    hints: [
      { en: "Cars drive up it.", zh: "车子会开上去。" },
      { en: "It is a slope.", zh: "它是斜的。" },
      { en: "It lives by the garage.", zh: "它在车库旁边。" },
    ],
  },
  {
    id: "mx-wheel",
    labelEn: "wheel",
    labelZh: "轮子",
    art: wheelArt,
    hints: [
      { en: "It is round.", zh: "它是圆的。" },
      { en: "A car has four.", zh: "一辆车有四个。" },
      { en: "It rolls.", zh: "它会滚。" },
    ],
  },
  {
    id: "mx-garage",
    labelEn: "garage",
    labelZh: "车库",
    art: garageArt,
    hints: [
      { en: "Cars sleep here.", zh: "车子在这里睡觉。" },
      { en: "It has a big door.", zh: "它有一扇大门。" },
      { en: "It is a little house for cars.", zh: "它是车子的小房子。" },
    ],
  },
  {
    id: "mx-wash",
    labelEn: "car wash",
    labelZh: "洗车",
    art: washArt,
    hints: [
      { en: "Cars get clean here.", zh: "车子在这里变干净。" },
      { en: "Water sprays.", zh: "会喷水。" },
      { en: "There is soap and bubbles.", zh: "有肥皂和泡泡。" },
    ],
  },
  {
    id: "mx-station",
    labelEn: "fire station",
    labelZh: "消防站",
    art: fireStationArt,
    hints: [
      { en: "It is a big building.", zh: "它是一座大房子。" },
      { en: "The fire truck lives here.", zh: "消防车住在这里。" },
      { en: "It has a tall door.", zh: "它有一扇高高的门。" },
    ],
  },
];

const HOUSE_MYSTERIES = [
  {
    id: "mx-bowl",
    labelEn: "bowl",
    labelZh: "碗",
    art: bowlSvg,
    hints: [
      { en: "You eat from it.", zh: "你用它吃饭。" },
      { en: "It is round.", zh: "它是圆的。" },
      { en: "Food goes inside.", zh: "食物放在里面。" },
    ],
  },
  {
    id: "mx-apple",
    labelEn: "apple",
    labelZh: "苹果",
    art: appleArt,
    hints: [
      { en: "It is a fruit.", zh: "它是水果。" },
      { en: "It is red.", zh: "它是红色的。" },
      { en: "You can bite it.", zh: "你可以咬一口。" },
    ],
  },
  {
    id: "mx-milk",
    labelEn: "milk",
    labelZh: "牛奶",
    art: milkArt,
    hints: [
      { en: "You drink it.", zh: "你可以喝它。" },
      { en: "It is white.", zh: "它是白色的。" },
      { en: "It is in a cup or carton.", zh: "它在杯子或盒子里。" },
    ],
  },
  {
    id: "mx-pillow",
    labelEn: "pillow",
    labelZh: "枕头",
    art: pillowArt,
    hints: [
      { en: "You rest your head.", zh: "你把头放在上面。" },
      { en: "It is soft.", zh: "它软软的。" },
      { en: "It lives on the bed.", zh: "它在床上。" },
    ],
  },
  {
    id: "mx-toys",
    labelEn: "toys",
    labelZh: "玩具",
    art: toysArt,
    hints: [
      { en: "You play with them.", zh: "你可以拿来玩。" },
      { en: "They are fun.", zh: "它们很好玩。" },
      { en: "They live in a basket.", zh: "它们住在篮子里。" },
    ],
  },
  {
    id: "mx-bed",
    labelEn: "bed",
    labelZh: "床",
    art: bedArt,
    hints: [
      { en: "You sleep here.", zh: "你在这里睡觉。" },
      { en: "It has a pillow.", zh: "上面有枕头。" },
      { en: "It is in the bedroom.", zh: "它在房间里。" },
    ],
  },
  {
    id: "mx-fridge",
    labelEn: "fridge",
    labelZh: "冰箱",
    art: fridgeArt,
    hints: [
      { en: "It is cold inside.", zh: "里面是凉的。" },
      { en: "Food lives here.", zh: "食物住在这里。" },
      { en: "It is in the kitchen.", zh: "它在厨房。" },
    ],
  },
  {
    id: "mx-dumplings",
    labelEn: "dumplings",
    labelZh: "饺子",
    art: dumplingArt,
    hints: [
      { en: "You eat them.", zh: "你可以吃它们。" },
      { en: "They come from the kitchen.", zh: "它们从厨房来。" },
      { en: "They are little food pockets.", zh: "它们是小小的食物包包。" },
    ],
  },
  {
    id: "mx-teddy",
    labelEn: "teddy",
    labelZh: "小熊",
    art: teddyArt,
    hints: [
      { en: "It is soft.", zh: "它软软的。" },
      { en: "You hug it.", zh: "你可以抱它。" },
      { en: "It is a toy animal.", zh: "它是玩具小动物。" },
    ],
  },
];

let view = loadState().theme ? "home" : "themes";
let overlay = null;
let sessionStarted = 0;
let awarded = false;
let round = null;
let holdTimer = null;
let grownupArmedUntil = 0;
let grownupHintTimer = null;
let grownupTapLockUntil = 0;
let selectedPiece = null;
let suppressClickUntil = 0;
const drag = {
  id: null,
  ghost: null,
  startX: 0,
  startY: 0,
  moved: false,
  pointerId: null,
};

const app = document.getElementById("app");

function addStarOnce() {
  if (awarded) return;
  awarded = true;
  const s = loadState();
  saveState({ stars: (s.stars || 0) + 1 });
}

function maybeBreak() {
  const mins = loadState().sessionMin || 8;
  if (!sessionStarted) sessionStarted = Date.now();
  const elapsed = (Date.now() - sessionStarted) / 60000;
  if (elapsed >= mins && overlay !== "break") {
    overlay = "break";
    render();
  }
}

setInterval(() => {
  if (view !== "home" && view !== "settings" && view !== "themes") maybeBreak();
}, 20000);

function themeId() {
  const theme = loadState().theme;
  if (theme === "house") return "house";
  if (theme === "storybook") return "storybook";
  return "garage";
}

function inStoryTimeUi() {
  return themeId() === "storybook" && view !== "themes" && view !== "settings";
}

function themeCluster(n, color) {
  return themeId() === "house" ? houseCluster(n, color) : cluster(n, color);
}

function themePack() {
  if (themeId() === "storybook") {
    return {
      id: "storybook",
      brandEn: "故事书",
      brandZh: "故事书",
      heroH: "一次听一个故事。",
      heroP: "一起坐下来。听完这一本。跑题了也先接住，再问回这个故事。",
      starsLabel: "这台设备上的故事星星",
      parentNote:
        "老师说他容易跑题。黄条一直在。先接住他的话，再问回主题。他说恐龙：恐龙呀。那恐龙想戴小黄帽吗？他说车：车也来了。那小车要帮小明找帽子吗？不要说「车待会再讲」。哭了就停。",
      boxes: [],
      titles: { story: "故事书" },
    };
  }
  if (themeId() === "house") {
    return {
      id: "house",
      brandEn: "Playing House",
      brandZh: "过家家",
      heroH: "The house is waiting.",
      heroP: "Same five doors. Kitchen, bowls, bed, and a mystery box. Parent sits with him. Start with Tell the Story — that is the gap. Real play still wins after 5–8 minutes.",
      starsLabel: "House stars on this device",
      parentNote:
        "Each box shuffles a different house puzzle when you go in. Grown-up: tap 家长 twice, then the yellow car. The big picture bar is 换主题 — or tap Home 回家 again on this screen.",
      boxes: [
        {
          id: "story",
          title: "Tell the Story",
          sub: "洗手 → 吃饭 → 睡觉",
          thumb: washHandsArt(),
        },
        {
          id: "park",
          title: "Count the Bowls",
          sub: "More, less, same — 碗和饺子",
          thumb: riceArt(),
        },
        {
          id: "bay",
          title: "Which Belongs?",
          sub: "水果 / 热食 / 盘子碗",
          thumb: dumplingArt(),
        },
        {
          id: "build",
          title: "Where Is It?",
          sub: "桌上、床下、柜子里",
          thumb: bedArt(),
        },
        {
          id: "box",
          title: "Mystery Box",
          sub: "盲盒猜猜猜",
          thumb: mysteryBoxArt(),
        },
      ],
      titles: {
        story: "Tell the Story",
        park: "Count the Bowls",
        bay: "Which Belongs?",
        build: "Where Is It?",
        box: "Mystery Box",
      },
      mysteries: HOUSE_MYSTERIES,
      stories: HOUSE_STORIES,
      storyClassify: HOUSE_STORY_CLASSIFY,
      storyAnalogy: HOUSE_STORY_ANALOGY,
      storySentence: HOUSE_STORY_SENTENCE,
      bayClassify: HOUSE_BAY_CLASSIFY,
      bayMatrix: HOUSE_BAY_MATRIX,
      series: HOUSE_SERIES,
      numAnalogy: HOUSE_NUM_ANALOGY,
      whereSpots: HOUSE_WHERE_SPOTS,
      belong: HOUSE_BELONG,
      pieces: ["table", "bed", "cupboard"],
      pieceLabels: { table: ["table", "桌子"], bed: ["bed", "床"], cupboard: ["cupboard", "柜子"] },
    };
  }
  return {
    id: "garage",
    brandEn: "Little Garage",
    brandZh: "小车库",
    heroH: "The cars are waiting.",
    heroP: "Same five doors. Fresh puzzles inside, plus a mystery box. Parent sits with him. Start with Tell the Story — that is the gap. Real toy cars still win after 5–8 minutes.",
    starsLabel: "Garage stars on this device",
    parentNote:
      "Each box shuffles a different car puzzle when you go in. Grown-up: tap 家长 twice, then the yellow car to open settings. The big picture bar is 换主题 — or tap Home 回家 again on this screen. No login. Nothing leaves this phone or iPad.",
    boxes: [
      { id: "story", title: "Tell the Story", sub: "先 / 然后 / 最后 · new puzzles inside", thumb: fireTruckArt() },
      { id: "park", title: "Park the Cars", sub: "More, less, same — close amounts", thumb: pickupArt() },
      { id: "bay", title: "Which Bay?", sub: "消防车 / 皮卡 / 跑车", thumb: sportsCarArt() },
      {
        id: "build",
        title: "Build the Garage",
        sub: "On, under, next to — what’s missing?",
        thumb: garageArt(),
      },
      { id: "box", title: "Mystery Box", sub: "盲盒猜猜猜", thumb: mysteryBoxArt() },
    ],
    titles: {
      story: "Tell the Story",
      park: "Park the Cars",
      bay: "Which Bay?",
      build: "Build the Garage",
      box: "Mystery Box",
    },
    mysteries: GARAGE_MYSTERIES,
    stories: STORIES,
    storyClassify: STORY_CLASSIFY,
    storyAnalogy: STORY_ANALOGY,
    storySentence: STORY_SENTENCE,
    bayClassify: BAY_CLASSIFY,
    bayMatrix: BAY_MATRIX,
    series: SERIES_BANK,
    numAnalogy: NUM_ANALOGY,
    whereSpots: WHERE_SPOTS,
    belong: GARAGE_BELONG,
    pieces: ["ramp", "wall", "roof"],
    pieceLabels: { ramp: ["ramp", "坡道"], wall: ["walls", "墙"], roof: ["roof", "屋顶"] },
  };
}

function topbar(title) {
  const pack = themePack();
  const storyUi = inStoryTimeUi();
  const hasTheme = !!loadState().theme;
  const homeLabel = storyUi ? "回家" : "Home 回家";
  const grownLabel = storyUi ? "家长" : "Grown-up";
  const homeBtn =
    view === "themes" && !hasTheme
      ? `<span class="icon-btn" style="visibility:hidden" aria-hidden="true">${homeLabel}</span>`
      : `<button class="icon-btn" type="button" data-go="home">${homeLabel}</button>`;
  const brand = view === "themes" ? "Pick a world" : storyUi ? pack.brandZh : pack.brandEn;
  const sub = view === "themes" ? "Garage · 过家家 · 故事书" : storyUi ? "听故事" : pack.brandZh;
  const armed = Date.now() < grownupArmedUntil ? " is-armed" : "";
  return `<div class="topbar">
    ${homeBtn}
    <div class="brand"><strong>${title}</strong><span>${brand} · ${sub}</span></div>
    <button class="icon-btn grownup-btn${armed}" type="button" id="grownup" aria-label="家长设置，请按两次">${grownLabel}</button>
  </div>
  <div class="road-strip"></div>`;
}

function langButtons(en, zh) {
  if (!loadState().bilingual) {
    return `<div class="hear-row">
      <button class="hear-btn" type="button" data-speak="en" data-text="${escapeAttr(en)}">${hearIcon()} Hear</button>
    </div>`;
  }
  return `<div class="hear-row">
    <button class="hear-btn" type="button" data-speak="en" data-text="${escapeAttr(en)}">${hearIcon()} Hear</button>
    <button class="hear-btn zh" type="button" data-speak="zh" data-text="${escapeAttr(zh)}">${hearIcon()} 听</button>
  </div>`;
}

function zhHearButton(zh) {
  return `<div class="hear-row">
    <button class="hear-btn zh" type="button" data-speak="zh" data-text="${escapeAttr(zh)}">${hearIcon()} 听</button>
  </div>`;
}

function storyBeatHearRows(story, labels) {
  return `<div class="story-readouts">${story.beats
    .map((b, i) => {
      const [en, zh] = labels[i];
      return `<div class="story-readout">
        <span class="story-readout-label">${escapeHtml(en)} · ${escapeHtml(zh)}</span>
        ${langButtons(b.en, b.zh)}
      </div>`;
    })
    .join("")}</div>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/'/g, "&#39;");
}

function beginPlay() {
  awarded = false;
  selectedPiece = null;
  sessionStarted = sessionStarted || Date.now();
}

function resultBlock(again, againLabel, yesEn, yesZh, retryEn, retryZh) {
  const picked = (round.choices || []).find((c) => c.id === round.picked);
  if (!picked) return "";
  if (picked.ok) return compactYes(again, againLabel, yesEn, yesZh);
  return `<div class="play-actions retry-note"><p>${escapeHtml(retryEn)}${loadState().bilingual ? " " + escapeHtml(retryZh) : ""}</p></div>`;
}

function renderChoices(extraClass) {
  return `<div class="answer-row">
    ${(round.choices || [])
      .map((o) => {
        const label = o.label ? ` aria-label="${escapeAttr(o.label)}"` : "";
        return `<button class="choice kid-btn ${extraClass || ""}" type="button" data-choice="${o.id}"${label}>${o.art}</button>`;
      })
      .join("")}
  </div>`;
}

function bookSeqBeats(book) {
  return book.seq.map((id) => {
    const page = book.pages.find((p) => p.id === id);
    return {
      id,
      en: page.en,
      zh: page.zh,
      art: sbImg(book.id, id, page.zh),
    };
  });
}

function renderTopicAnchor(book) {
  return `<div class="topic-anchor" aria-label="这个故事说的是${escapeAttr(book.topicZh)}">
    ${sbImg(book.id, "topic", book.topicZh, "topic")}
    <div class="topic-anchor-copy">
      <b>这个故事说的是${escapeHtml(book.topicZh)}</b>
    </div>
  </div>`;
}

function belongFoilItem(book) {
  const foil = book.belongFoil || book.belongOff;
  if (!foil) return [];
  return [
    {
      id: "foil",
      on: false,
      art: sbRefArt(foil),
      bridgeZh: foil.bridgeZh || book.parentCarZh,
    },
  ];
}

function renderGrownupScript(book, bridgeZh) {
  const zh = bridgeZh || book.parentStayZh;
  return `<p class="grownup-script">${escapeHtml(zh)}</p>
    <p class="join-hint">他插进来的话，变成这个故事里的客人。不要说「车待会再讲」。</p>`;
}

function startBook(id) {
  const book = STORY_BOOKS.find((b) => b.id === id);
  if (!book) return;
  beginPlay();
  cancelStoryRead();
  view = "book";
  round = {
    kind: "storybook",
    book,
    phase: "read",
    page: 0,
    didAutoRead: false,
    belongPicked: [],
    belongOrder: shuffle(
      book.belongOn
        .map((file) => ({ id: file, on: true, art: sbImg(book.id, file, file) }))
        .concat(belongFoilItem(book))
    ),
    slots: Array(book.seq.length).fill(null),
    selectedBeat: null,
    qIndex: 0,
    picked: null,
    showJoinNudge: false,
    bridgeZh: "",
  };
  render();
}

function hookStoryBookRead() {
  if (view !== "book" || !round || round.kind !== "storybook" || round.phase !== "read") return;
  if (round.didAutoRead) return;
  round.didAutoRead = true;
  readStoryBookAloud(false);
}

function renderStoryShelf() {
  const pack = themePack();
  const s = loadState();
  return `${topbar("故事书")}
    <section class="hero">
      <h1>选一本书</h1>
      <p>一起坐下来。听完这一本。跑题了也先接住，再问回这个故事。</p>
    </section>
    <div class="book-shelf">
      ${STORY_BOOKS.map(
        (b) => `<button class="play-card kid-btn book-cover" type="button" data-book="${b.id}" aria-label="${escapeAttr(b.titleZh)}">
          <div class="thumb">${sbImg(b.id, "p1", b.titleZh, "scene")}</div>
          <b>${escapeHtml(b.titleZh)}</b>
        </button>`
      ).join("")}
    </div>
    ${renderWorldBar(pack)}
    <p class="stars">${escapeHtml(pack.starsLabel)}: ${s.stars || 0}</p>
    <p class="parent-note">${escapeHtml(pack.parentNote)}</p>`;
}

function renderBookRead() {
  const book = round.book;
  const page = book.pages[round.page];
  const last = round.page === book.pages.length - 1;
  const look = `${renderTopicAnchor(book)}
      <p class="look-kicker">读 · ${round.page + 1}/${book.pages.length}</p>
      <div class="book-page-art">${sbImg(book.id, page.id, page.zh, "scene book-scene")}</div>
      <h2 class="book-read-zh">${escapeHtml(page.zh)}</h2>
      ${zhHearButton(fluentZhText(page.zh))}
      ${renderGrownupScript(book)}`;
  const nav = `<div class="book-nav">
      <button class="big ghost" type="button" data-action="book-prev" ${round.page === 0 ? "disabled" : ""}>上一页</button>
      ${
        last
          ? `<button class="big" type="button" data-action="book-understand">理解</button>`
          : `<button class="big" type="button" data-action="book-next">下一页</button>`
      }
    </div>
    <div class="play-actions">
      <button class="big ghost" type="button" data-action="book-read-all">${hearIcon()} 全部听</button>
    </div>`;
  return `${topbar(book.titleZh)}
    ${playLayout(look, nav, "tap")}`;
}

function renderBookBelong() {
  const book = round.book;
  const needed = book.belongOn;
  const got = needed.every((id) => round.belongPicked.includes(id));
  const promptZh = `我们在讲${book.topicZh}。哪张还是这个故事？`;
  const look = `${renderTopicAnchor(book)}
      <h2>这张图还在这个故事里吗？</h2>
      <p>我们在讲${escapeHtml(book.topicZh)}。点还是这个故事的图。</p>
      ${zhHearButton(promptZh)}
      ${renderGrownupScript(book, round.showJoinNudge ? round.bridgeZh : "")}`;
  const answers = `<div class="answer-row belong-row">
      ${round.belongOrder
        .map((item) => {
          const picked = round.belongPicked.includes(item.id);
          const cls = picked ? "choice kid-btn belong-yes" : "choice kid-btn";
          return `<button class="${cls}" type="button" data-belong="${item.id}" aria-label="${escapeAttr(item.id)}">${item.art}</button>`;
        })
        .join("")}
    </div>
    ${
      got
        ? `<div class="play-actions">${compactYesZh("book-sequence", "然后", "对，这些图还在这个故事里。", "这个故事还是这个故事。")}</div>`
        : round.showJoinNudge
          ? `<p class="parent-note">${escapeHtml(round.bridgeZh || book.parentCarZh)}</p>`
          : `<p class="parent-note">跑题了就接住，再问回${escapeHtml(book.topicZh)}。他说车：${escapeHtml(book.parentCarZh)}</p>`
    }`;
  return `${topbar("理解")}
    ${playLayout(look, answers, "tap")}`;
}

function renderBookSequence() {
  const book = round.book;
  const story = { beats: bookSeqBeats(book) };
  const labels = storyLabels(story.beats.length);
  const done = round.slots.every(Boolean);
  const correct = sequenceIsCorrect();
  const slotsHtml = renderSequenceSlots(story, labels);
  const look = `${renderTopicAnchor(book)}
      <h2>这个故事里发生了什么？</h2>
      <p>哪张在前面？哪张在后面？我们还在讲这个故事。</p>
      ${zhHearButton("先发生了什么？")}
      ${renderGrownupScript(book)}`;
  if (done && correct) {
    return `${topbar("理解")}
      ${playLayout(
        look,
        `${slotsHtml}${compactYesZh("book-ask", "提问", "这个故事排好了。")}`,
        "place"
      )}`;
  }
  const pool = story.beats.map((b) => b.id).filter((id) => !round.slots.includes(id));
  return `${topbar("理解")}
    ${playLayout(
      look,
      `${slotsHtml}
    <div class="cards-row answer-row">
      ${pool
        .map((id) => {
          const b = story.beats.find((x) => x.id === id);
          const picked = round.selectedBeat === id ? " picked" : "";
          return `<button class="scene kid-btn${picked}" type="button" data-pick="${id}" data-drag="${id}">${b.art}</button>`;
        })
        .join("")}
    </div>
    ${
      done && !correct
        ? `<div class="play-actions retry-note"><p>再看一次。这个故事说的是${escapeHtml(book.topicZh)}。</p>
           <button class="big" type="button" data-action="reset-slots">再排一次</button></div>`
        : ""
    }`,
      "place"
    )}`;
}

function bookQuestionChoices() {
  const q = round.book.questions[round.qIndex];
  const opts = shuffle([
    { id: "ok", ok: true, art: sbRefArt(q.correct) },
    ...q.foils.map((foil, i) => ({
      id: `no-${i}`,
      ok: false,
      art: sbRefArt(foil),
      bridgeZh: foil.bridgeZh,
    })),
  ]);
  return opts;
}

function renderBookAsk() {
  const book = round.book;
  const q = book.questions[round.qIndex];
  if (!round.choices) round.choices = bookQuestionChoices();
  const last = round.qIndex >= book.questions.length - 1;
  const picked = (round.choices || []).find((c) => c.id === round.picked);
  const wrongBridge = picked && !picked.ok ? picked.bridgeZh || book.parentCarZh : "";
  const look = `${renderTopicAnchor(book)}
      <p class="look-kicker">提问 · ${round.qIndex + 1}/3</p>
      <h2>${escapeHtml(q.promptZh)}</h2>
      ${zhHearButton(q.promptZh)}
      ${renderGrownupScript(book, wrongBridge)}
      <p class="grownup-script">只要看图听——不用认字。</p>`;
  let extra = "";
  if (picked && picked.ok) {
    extra = last
      ? compactYesZh("another-book", "再看一本", "你一直跟着这个故事。")
      : `<div class="play-actions"><button class="big" type="button" data-action="book-next-q">下一题</button></div>`;
  } else if (picked && !picked.ok) {
    extra = `<div class="play-actions retry-note"><p>${escapeHtml(wrongBridge)}</p></div>`;
  }
  return `${topbar("提问")}
    ${playLayout(look, `${renderChoices()}${extra}`, "tap")}`;
}

function renderBook() {
  if (!round || round.kind !== "storybook") return renderStoryShelf();
  if (round.phase === "belong") return renderBookBelong();
  if (round.phase === "sequence") return renderBookSequence();
  if (round.phase === "ask") return renderBookAsk();
  return renderBookRead();
}

function renderThemes() {
  return `${topbar("Which world?")}
    <section class="hero">
      <h1>Pick a world · 选一个世界</h1>
      <p>Three picture doors. Cars, playing house, or story books. Parent sits with him.</p>
    </section>
    <div class="theme-doors doors-3">
      <button class="theme-door kid-btn" type="button" data-theme="garage" aria-label="Garage 小车库">
        ${garageWorldArt()}
        <b>小车库</b>
        <small>Garage · cars, ramp</small>
      </button>
      <button class="theme-door kid-btn" type="button" data-theme="house" aria-label="过家家 Playing house">
        ${houseWorldArt()}
        <b>过家家</b>
        <small>Playing house · stove, bed</small>
      </button>
      <button class="theme-door kid-btn" type="button" data-theme="storybook" aria-label="故事书">
        ${storybookWorldArt()}
        <b>故事书</b>
        <small>听故事，跟着这一本</small>
      </button>
    </div>
    <p class="parent-note">Next open remembers this world. Story Time is its own shelf of books — not the garage games. Home 回家 from a game goes to that world’s home; tap Home again to come back here.</p>`;
}

function renderWorldBar(pack) {
  const storyUi = pack.id === "storybook";
  const pic = storyUi ? garageWorldArt() : storybookWorldArt();
  const hint = storyUi ? "去小车库或过家家" : "故事书 Story Time, or switch worlds";
  const title = storyUi ? "换主题" : "换主题 · Change world";
  return `<button class="world-bar kid-btn" type="button" data-go="themes" aria-label="换主题">
    ${pic}
    <span class="world-bar-copy">
      <b>${title}</b>
      <small>${hint}</small>
    </span>
  </button>`;
}

function renderHome() {
  const s = loadState();
  const pack = themePack();
  const cards = pack.boxes
    .filter((c) => s.plays[c.id] !== false)
    .map((c) => ({ ...c }));

  return `${topbar(pack.brandEn)}
    <section class="hero">
      <h1>${escapeHtml(pack.heroH)}</h1>
      <p>${pack.heroP}</p>
    </section>
    <div class="grid doors-${cards.length}">
      ${cards
        .map(
          (c) => `<button class="play-card kid-btn" type="button" data-go="${c.id}">
            <div class="thumb">${c.thumb}</div>
            <b>${c.title}</b>
            <small>${c.sub}</small>
          </button>`
        )
        .join("")}
    </div>
    ${renderWorldBar(pack)}
    <p class="stars">${escapeHtml(pack.starsLabel)}: ${s.stars || 0}</p>
    <p class="parent-note">${escapeHtml(pack.parentNote)}</p>`;
}

function mysteryChoices(item, bank) {
  const others = shuffle(bank.filter((m) => m.id !== item.id)).slice(0, 3);
  return shuffle([
    { id: item.id, ok: true, label: item.labelEn, art: item.art() },
    ...others.map((m) => ({ id: m.id, ok: false, label: m.labelEn, art: m.art() })),
  ]);
}

function renderMysteryHints(hints) {
  return `<div class="mystery-hints">${hints
    .map(
      (h, i) => `<div class="mystery-hint">
        <p>${i + 1}. ${escapeHtml(h.en)}${loadState().bilingual ? ` · ${escapeHtml(h.zh)}` : ""}</p>
        ${langButtons(h.en, h.zh)}
      </div>`
    )
    .join("")}</div>`;
}

function startBox() {
  beginPlay();
  view = "box";
  const pack = themePack();
  const bank = pack.mysteries || GARAGE_MYSTERIES;
  const item = pickFresh(bank);
  round = {
    kind: "mystery",
    id: item.id,
    labelEn: item.labelEn,
    labelZh: item.labelZh,
    hints: item.hints,
    reveal: item.art(),
    opened: false,
    choices: mysteryChoices(item, bank),
    picked: null,
  };
  render();
}

function renderBox() {
  const pack = themePack();
  const title = pack.titles.box || "Mystery Box";
  const opened = !!round.opened;
  const look = `<h2>What's in the box?</h2>
      <p>${loadState().bilingual ? "盒子里是什么？" : ""}</p>
      ${langButtons("What's in the box?", "盒子里是什么？")}
      <div class="mystery-stage">${mysteryBoxArt({ open: opened, reveal: opened ? round.reveal : "" })}</div>
      ${renderMysteryHints(round.hints)}`;
  return `${topbar(title)}
    ${playLayout(
      look,
      `${renderChoices()}${resultBlock("again-box", "Another one", `It is the ${round.labelEn}.`, `是${round.labelZh}。`, "Hear a hint again. Try another picture.", "再听一条提示。换一张图试试。")}`
    )}`;
}

function startStory() {
  beginPlay();
  view = "story";
  const pack = themePack();
  const kind = pickVariant("story", ["sequence", "classify", "analogy", "sentence"]);
  if (kind === "sequence") {
    const story = attachStoryMedia(pickFresh(pack.stories));
    round = {
      kind,
      story,
      order: shuffle(story.beats.map((b) => b.id)),
      slots: Array(story.beats.length).fill(null),
      selectedBeat: null,
      storyVideo: story.video ? "ready" : "done",
    };
  } else if (kind === "classify") {
    const item = pickFresh(pack.storyClassify);
    round = { kind, ...item, choices: shuffle(item.choices), picked: null };
  } else if (kind === "analogy") {
    const item = pickFresh(pack.storyAnalogy);
    round = { kind, ...item, choices: shuffle(item.choices), picked: null };
  } else {
    const item = pickFresh(pack.storySentence);
    round = { kind: "sentence", ...item, choices: shuffle(item.choices), picked: null };
  }
  render();
}

function storyLabels(n) {
  if (n === 4) {
    return [
      ["First", "先"],
      ["Next", "接着"],
      ["Then", "然后"],
      ["Last", "最后"],
    ];
  }
  return [
    ["First", "先"],
    ["Then", "然后"],
    ["Last", "最后"],
  ];
}

function renderSequenceSlots(story, labels) {
  return `<div class="slots-row ${story.beats.length > 3 ? "four" : ""}">
    ${labels
      .map(([en, zh], i) => {
        const filledId = round.slots[i];
        const drag = filledId ? ` data-drag="${filledId}"` : "";
        const labelText = inStoryTimeUi() ? zh : `${en} · ${zh}`;
        return `<button class="slot drop-slot kid-btn ${filledId ? "filled" : ""}" type="button" data-unslot="${i}"${drag}>
          <span class="label">${labelText}</span>
          ${filledId ? story.beats.find((b) => b.id === filledId).art : ""}
        </button>`;
      })
      .join("")}
  </div>`;
}

function renderStorySequence() {
  const story = round.story;
  const labels = storyLabels(story.beats.length);
  const done = round.slots.every(Boolean);
  const correct = sequenceIsCorrect();
  const title = themePack().titles.story;
  const slotsHtml = renderSequenceSlots(story, labels);

  if (done && correct) {
    const videoSrc = story.video;
    const watching = videoSrc && round.storyVideo !== "done";
    if (watching) {
      return `${topbar(title)}
        <div class="play-fit story-watch">
          <p class="look-kicker">Look · 看一看</p>
          <div class="story-watch-frame">
            <video class="story-video" src="${escapeAttr(videoSrc)}?v=${PHOTO_V}" muted playsinline webkit-playsinline autoplay preload="auto" disablepictureinpicture></video>
            <button class="story-skip" type="button" data-action="skip-story-video">Skip · 跳过</button>
          </div>
          <div class="story-watch-hear">
            ${langButtons("What happened first?", "先发生了什么？")}
          </div>
        </div>`;
    }
    return `${topbar(title)}
      ${playLayout(
        `<h2>You lined up the story.</h2>
        <p>Now <b>you</b> tell it. Parent waits. First… then… last…</p>
        ${langButtons("What happened first?", "先发生了什么？")}`,
        `${compactYes("another-story", "Another story", "You lined up the story.", "故事排好了。")}`,
        "place"
      )}`;
  }

  const pool = round.order.filter((id) => !round.slots.includes(id));
  return `${topbar(title)}
    ${playLayout(
      `<h2>${escapeHtml(story.titleEn)} · ${escapeHtml(story.titleZh)}</h2>
      ${storyBeatHearRows(story, labels)}`,
      `${slotsHtml}
    <div class="cards-row answer-row">
      ${pool
        .map((id) => {
          const b = story.beats.find((x) => x.id === id);
          const picked = round.selectedBeat === id ? " picked" : "";
          return `<button class="scene kid-btn${picked}" type="button" data-pick="${id}" data-drag="${id}">${b.art}</button>`;
        })
        .join("")}
    </div>
    ${
      done && !correct
        ? `<div class="play-actions retry-note"><p>Let’s look again. First something starts, then something happens, last it finishes.</p>
           <button class="big" type="button" data-action="reset-slots">Try the pictures again</button></div>`
        : ""
    }`,
      "place"
    )}`;
}

function renderStory() {
  const title = themePack().titles.story;
  if (round.kind === "sequence") return renderStorySequence();

  if (round.kind === "classify") {
    return `${topbar(title)}
      ${playLayout(
        `<h2>${escapeHtml(round.promptEn)}</h2>
        <p>${loadState().bilingual ? escapeHtml(round.promptZh) : ""}</p>
        ${langButtons(round.promptEn, round.promptZh)}
        ${renderStem(round.stem)}`,
        `${renderChoices()}${resultBlock("another-story", "Another story", "That one belongs.", "这个属于这里。", "Let’s look at what is the same.", "再看看它们哪里一样。")}`
      )}`;
  }

  if (round.kind === "analogy") {
    return `${topbar(title)}
      ${playLayout(
        `<h2>${escapeHtml(round.promptEn)}</h2>
        <p>${loadState().bilingual ? escapeHtml(round.promptZh) : ""}</p>
        ${langButtons(round.promptEn, round.promptZh)}
        <div class="pair-row">
          <div class="pair-cell">${round.a}</div>
          <span class="pair-arrow">→</span>
          <div class="pair-cell">${round.b}</div>
        </div>
        <div class="pair-row">
          <div class="pair-cell">${round.c}</div>
          <span class="pair-arrow">→</span>
          <div class="pair-cell ask">?</div>
        </div>`,
        `${renderChoices()}${resultBlock("another-story", "Another story", "Yes — they go together that way.", "对，它们就是这样配的。", "Look at how the first pair goes together.", "先看上面那一对是怎么配的。")}`
      )}`;
  }

  return `${topbar(title)}
    ${playLayout(
      `<h2>${escapeHtml(round.sentenceEn)}</h2>
      <p>${loadState().bilingual ? escapeHtml(round.sentenceZh) : ""}</p>
      <p class="parent-note" style="margin-top:8px">${escapeHtml(round.parentEn)} ${loadState().bilingual ? escapeHtml(round.parentZh) : ""}</p>
      ${langButtons(round.sentenceEn, round.sentenceZh)}`,
      `${renderChoices()}${resultBlock("another-story", "Another story", "That picture finishes the sentence.", "这张图把句子说完了。", "Hear the sentence again. Which picture finishes it?", "再听一遍句子。哪张图能说完？")}`
    )}`;
}

function parkTarget() {
  return pickFresh([4, 5, 6, 7, 8, 9, 10, 12], (n) => `park-n-${n}`);
}

function closePair() {
  const hot = Math.random() < 0.18;
  const base = hot ? 16 + Math.floor(Math.random() * 4) : 7 + Math.floor(Math.random() * 6);
  const roll = Math.random();
  const delta = roll < 0.22 ? 0 : roll < 0.78 ? 1 : 2;
  const left = clamp(base, 6, 20);
  const right = delta === 0 ? left : clamp(base + (Math.random() < 0.5 ? delta : -delta), 6, 20);
  return { left, right };
}

function startPark() {
  beginPlay();
  view = "park";
  const pack = themePack();
  const house = pack.id === "house";
  const pileArt = house ? bowlPileArt : garagePileArt;
  const sameArtFn = house ? houseSameAmountArt : sameAmountArt;
  const kind = pickVariant("park", ["park", "compare", "equalize", "series", "numAnalogy"]);
  if (kind === "park") {
    const need = parkTarget();
    round = { kind, need, parked: Array(need).fill(null) };
  } else if (kind === "compare") {
    const { left, right } = closePair();
    round = {
      kind,
      left,
      right,
      picked: null,
      coachEn: house
        ? "These two piles are close. Point and count. Last number is how many."
        : "These two piles are close. Point and count. Last number is how many.",
      coachZh: house ? "两边差不多。用手指着数。最后一个数字就是几个。" : "两边差不多。用手指着数。最后一个数字就是几辆。",
      choices: [
        { id: "left", ok: left > right, label: house ? "Table A" : "Garage A", art: pileArt(left, "#d94b3a") },
        { id: "same", ok: left === right, label: "Same", art: sameArtFn() },
        { id: "right", ok: right > left, label: house ? "Table B" : "Garage B", art: pileArt(right, "#3a7ca5") },
      ],
    };
  } else if (kind === "equalize") {
    const low = 6 + Math.floor(Math.random() * 5);
    const diff = 1 + Math.floor(Math.random() * 3);
    const high = low + diff;
    const leftIsHigh = Math.random() < 0.5;
    const left = leftIsHigh ? high : low;
    const right = leftIsHigh ? low : high;
    const distractors = shuffle([diff, diff === 1 ? 2 : 1, diff === 3 ? 4 : 3]).slice(0, 3);
    const unique = [];
    distractors.forEach((n) => {
      if (!unique.includes(n)) unique.push(n);
    });
    if (!unique.includes(diff)) unique[0] = diff;
    const unit = house ? "个" : "辆";
    round = {
      kind,
      left,
      right,
      need: diff,
      smallSide: leftIsHigh ? "B" : "A",
      picked: null,
      coachEn: house
        ? "How many more to make them the same? Tap the extra bowls."
        : "How many more to make them the same? Tap the extra cars.",
      coachZh: house ? "再来几个就一样多？点多出来的碗。" : "再来几辆就一样多？点多出来的车。",
      choices: shuffle(
        unique.map((n) => ({
          id: String(n),
          ok: n === diff,
          art: themeCluster(n) + caption(`${n} more · 再${n}${unit}`),
        }))
      ),
    };
  } else if (kind === "series") {
    const item = pickFresh(pack.series);
    const nums = shuffle([item.answer, ...item.distractors.filter((n) => n > 0)]);
    round = {
      kind,
      ...item,
      picked: null,
      coachEn: item.en,
      coachZh: item.zh,
      choices: nums.map((n) => ({ id: String(n), ok: n === item.answer, art: themeCluster(n) })),
    };
  } else {
    const item = pickFresh(pack.numAnalogy);
    round = { kind: "numAnalogy", ...item, choices: shuffle(item.choices), picked: null };
  }
  render();
}

function renderParkCount() {
  const pack = themePack();
  const house = pack.id === "house";
  const title = pack.titles.park;
  const parkedN = round.parked.filter(Boolean).length;
  const full = parkedN === round.need;
  if (full) addStarOnce();
  const token = (c) => (house ? miniBowl(c) : miniCar(c));
  const addArt = house ? bowlSvg("#e8b44c") : carSvg("#e8b44c");
  const h2 = house ? `Set ${round.need} bowls.` : `Park ${round.need} cars.`;
  const help = house
    ? `摆 ${round.need} 个碗。 Tap the yellow bowl — or tap an empty plate. Count out loud with him.`
    : `停 ${round.need} 辆车。 Tap the yellow car — or tap an empty parking spot. Count out loud with him.`;
  const hearEn = house ? `Set ${round.need} bowls.` : `Park ${round.need} cars.`;
  const hearZh = house ? `请摆 ${round.need} 个碗。` : `请停 ${round.need} 辆车。`;
  const doneH = house ? "All set. So how many?" : "All parked. So how many?";
  const doneEn = house ? `There are ${round.need} bowls.` : `There are ${round.need} cars.`;
  const doneZh = house ? `有 ${round.need} 个碗。` : `有 ${round.need} 辆车。`;
  const again = house ? "Count again" : "Park again";
  return `${topbar(title)}
    ${playLayout(
      `<h2>${h2}</h2>
      <p>${help}</p>
      ${langButtons(hearEn, hearZh)}`,
      `<div class="count-track">
      ${round.parked
        .map((c, i) => {
          return `<button class="count-bead kid-btn ${c ? "filled" : ""}" type="button" data-unpark="${i}">
            ${c ? token(c) : ""}
          </button>`;
        })
        .join("")}
    </div>
    <div class="park-actions">
      ${
        full
          ? ""
          : `<button class="big kid-btn park-add" type="button" data-action="park-add">${addArt}</button>`
      }
    </div>
    ${full ? compactYes("again-park", again, doneEn, doneZh, doneH) : ""}`
    )}`;
}

function renderPark() {
  const pack = themePack();
  const house = pack.id === "house";
  const title = pack.titles.park;
  const again = house ? "Count again" : "Park again";
  if (round.kind === "park") return renderParkCount();

  if (round.kind === "compare") {
    const h2 = house ? "More, less, or the same?" : "More, less, or the same?";
    const p = house ? "哪边更多，还是一样多？" : "哪边更多，还是一样多？";
    const hearEn = house
      ? "Which table has more bowls? Or are they the same?"
      : "Which garage has more cars? Or are they the same?";
    const hearZh = house ? "哪边桌子的碗更多？还是一样多？" : "哪边车库的车更多？还是一样多？";
    return `${topbar(title)}
      ${playLayout(
        `<h2>${h2}</h2>
        <p>${p}</p>
        ${langButtons(hearEn, hearZh)}`,
        `${renderChoices("wide pile-choice")}${resultBlock("again-park", again, "Yes — that matches.", "对，就是这样。", "Let’s count both sides together.", "两边一起数一数。")}`
      )}`;
  }

  if (round.kind === "equalize") {
    const sideA = house ? "Table A" : "Garage A";
    const sideB = house ? "Table B" : "Garage B";
    const h2 = house ? "How many more to make them the same?" : "How many more to make them the same?";
    const p = house
      ? `再来几个就一样多？ Table ${round.smallSide} needs more.`
      : `再来几辆就一样多？ Garage ${round.smallSide} needs more.`;
    const hearEn = house ? "How many more bowls to make them equal?" : "How many more cars to make them equal?";
    const hearZh = house ? "再来几个就一样多？" : "再来几辆就一样多？";
    const retryEn = house ? "How many extra does the smaller table need?" : "How many extra does the smaller garage need?";
    const retryZh = house ? "小的那边还差几个？" : "小的那边还差几辆？";
    return `${topbar(title)}
      ${playLayout(
        `<h2>${h2}</h2>
        <p>${p}</p>
        ${langButtons(hearEn, hearZh)}
        <div class="bays">
          <div class="bay crowd">
            <span class="label">${sideA}</span>
            ${themeCluster(round.left, "#d94b3a")}
          </div>
          <div class="bay crowd">
            <span class="label">${sideB}</span>
            ${themeCluster(round.right, "#3a7ca5")}
          </div>
        </div>`,
        `${renderChoices()}${resultBlock("again-park", again, "Now they can be the same.", "这样就可以一样多了。", retryEn, retryZh)}`
      )}`;
  }

  if (round.kind === "series") {
    const hearZh = house ? "接下来是几个？" : "接下来是几辆？";
    return `${topbar(title)}
      ${playLayout(
        `<h2>What comes next?</h2>
        <p>${hearZh}</p>
        ${langButtons("What comes next?", hearZh)}
        <div class="series-row">
          ${round.seq.map((n) => `<div class="series-card">${themeCluster(n)}</div>`).join("")}
          <div class="series-card ask">?</div>
        </div>`,
        `${renderChoices()}${resultBlock("again-park", again, "That’s what comes next.", "接下来就是这样。", "What’s changing each time?", "每一次在怎么变？")}`
      )}`;
  }

  return `${topbar(title)}
    ${playLayout(
      `<h2>${escapeHtml(round.promptEn)}</h2>
      <p>${loadState().bilingual ? escapeHtml(round.promptZh) : ""}</p>
      ${langButtons(round.promptEn, round.promptZh)}
      <div class="pair-row">
        <div class="pair-cell">${round.a}</div>
        <span class="pair-arrow">→</span>
        <div class="pair-cell">${round.b}</div>
      </div>
      <div class="pair-row">
        <div class="pair-cell">${round.c}</div>
        <span class="pair-arrow">→</span>
        <div class="pair-cell ask">?</div>
      </div>`,
      `${renderChoices()}${resultBlock("again-park", again, "Yes — they go together that way.", "对，它们就是这样配的。", "Look at how the first pair goes together.", "先看上面那一对是怎么配的。")}`
    )}`;
}

function startBay() {
  beginPlay();
  view = "bay";
  const pack = themePack();
  const kind = pickVariant("bay", ["classify", "matrix"]);
  if (kind === "classify") {
    const item = pickFresh(pack.bayClassify);
    const choices = item.choices
      ? shuffle(item.choices)
      : shuffle(
          item.options.map((o) => ({
            id: o.id,
            ok: o.ok,
            art:
              vehicleArt(o.kind, o.color, { size: o.size }) +
              (item.showWheels ? wheelDots(o.wheels) + caption(`${o.wheels} wheels · ${o.wheels}个轮子`) : ""),
          }))
        );
    round = {
      kind,
      promptEn: item.promptEn,
      promptZh: item.promptZh,
      coachEn: item.coachEn,
      coachZh: item.coachZh,
      stem: item.stem || [],
      choices,
      picked: null,
    };
  } else {
    const item = pickFresh(pack.bayMatrix);
    round = {
      kind: "matrix",
      promptEn: item.promptEn,
      promptZh: item.promptZh,
      coachEn: item.coachEn,
      coachZh: item.coachZh,
      cells: item.cells,
      choices: shuffle(item.choices),
      picked: null,
    };
  }
  render();
}

function renderBay() {
  const pack = themePack();
  const title = pack.titles.bay;
  const again = pack.id === "house" ? "Another one" : "Another bay";
  const yes = pack.id === "house" ? "That one belongs." : "That one belongs in this bay.";
  const yesZh = pack.id === "house" ? "这个属于这里。" : "这辆属于这个车位。";
  const retry = pack.id === "house" ? "Let’s look again. What is the same?" : "Let’s look at the bay again. What is the same?";
  const retryZh = pack.id === "house" ? "再看看。它们哪里一样？" : "再看看这个车位。它们哪里一样？";
  if (round.kind === "matrix") {
    return `${topbar(title)}
      ${playLayout(
        `<h2>${escapeHtml(round.promptEn)}</h2>
        <p>${loadState().bilingual ? escapeHtml(round.promptZh) : ""}</p>
        ${langButtons(round.promptEn, round.promptZh)}
        <div class="matrix">
          <div class="matrix-cell">${round.cells[0]}</div>
          <div class="matrix-cell">${round.cells[1]}</div>
          <div class="matrix-cell">${round.cells[2]}</div>
          <div class="matrix-cell ask">?</div>
        </div>`,
        `${renderChoices()}${resultBlock("again-bay", again, "That finishes the pattern.", "这样就齐了。", "Look across, then down.", "先横着看，再竖着看。")}`
      )}`;
  }

  return `${topbar(title)}
    ${playLayout(
      `<h2>${escapeHtml(round.promptEn)}</h2>
      <p>${loadState().bilingual ? escapeHtml(round.promptZh) : ""}</p>
      ${langButtons(round.promptEn, round.promptZh)}
      ${renderStem(round.stem)}`,
      `${renderChoices()}${resultBlock("again-bay", again, yes, yesZh, retry, retryZh)}`
    )}`;
}

function startBuild() {
  beginPlay();
  view = "build";
  const pack = themePack();
  const kind = pickVariant("build", ["build", "where", "missing", "belong"]);
  if (pack.id === "house") {
    if (kind === "build") {
      round = { kind, room: { table: false, bed: false, cupboard: false } };
    } else if (kind === "belong") {
      const item = pickFresh(pack.belong);
      round = { kind: "belong", ...item, choices: shuffle(item.choices), picked: null };
    } else if (kind === "where") {
      const spot = pickFresh(pack.whereSpots);
      round = {
        kind,
        spot,
        picked: null,
        coachEn: "Use the words: on, under, in, next to.",
        coachZh: "用这些词：上面、下面、里面、旁边。",
        choices: whereChoices(pack.whereSpots, spot.id, houseWhereChoiceArt),
      };
    } else {
      const missing = pickOne(pack.pieces);
      round = {
        kind: "missing",
        missing,
        room: {
          table: missing !== "table",
          bed: missing !== "bed",
          cupboard: missing !== "cupboard",
        },
        picked: null,
        coachEn: "Two pieces are here. What’s gone?",
        coachZh: "两块在。哪一块不见了？",
        choices: shuffle(
          pack.pieces.map((p) => ({
            id: p,
            ok: p === missing,
            label: `${pack.pieceLabels[p][0]} ${pack.pieceLabels[p][1]}`,
            art: housePieceArt(p),
          }))
        ),
      };
    }
    render();
    return;
  }
  if (kind === "build") {
    round = { kind, garage: { ramp: false, wall: false, roof: false } };
  } else if (kind === "belong") {
    const item = pickFresh(pack.belong);
    round = { kind: "belong", ...item, choices: shuffle(item.choices), picked: null };
  } else if (kind === "where") {
    const spot = pickFresh(WHERE_SPOTS);
    round = {
      kind,
      spot,
      picked: null,
      coachEn: "Use the words: in, on, under, next to.",
      coachZh: "用这些词：里面、上面、下面、旁边。",
      choices: whereChoices(WHERE_SPOTS, spot.id, whereChoiceArt),
    };
  } else {
    const missing = pickFresh(["ramp", "wall", "roof"], (p) => p);
    const labels = { ramp: ["ramp", "坡道"], wall: ["walls", "墙"], roof: ["roof", "屋顶"] };
    round = {
      kind: "missing",
      missing,
      garage: {
        ramp: missing !== "ramp",
        wall: missing !== "wall",
        roof: missing !== "roof",
      },
      picked: null,
      coachEn: "Two pieces are here. What’s gone?",
      coachZh: "两块在。哪一块不见了？",
      choices: shuffle(
        ["ramp", "wall", "roof"].map((p) => ({
          id: p,
          ok: p === missing,
          label: `${labels[p][0]} ${labels[p][1]}`,
          art: pieceArt(p),
        }))
      ),
    };
  }
  render();
}

function renderGarageBoard(garage, interactive) {
  const complete = !!(garage.ramp && garage.wall && garage.roof);
  const slot = (name, style, label) => {
    const done = garage[name];
    const tag = interactive ? "button" : "div";
    const extra = interactive ? `type="button" data-gslot="${name}"` : "";
    return `<${tag} class="g-slot kid-btn ${done ? "done" : ""}" ${extra} style="${style}">
      <span class="label">${escapeHtml(label)}</span>
    </${tag}>`;
  };
  const frame = complete
    ? photo("garage-done", "garage with a car", "garage-assembled")
    : photo("garage", "empty garage", "garage-frame");
  return `<div class="garage-board${complete ? " built" : ""}">
    ${frame}
    ${
      complete
        ? ""
        : `${slot("roof", "left:18%;right:18%;top:6%;height:28%", "roof 屋顶")}
    ${slot("wall", "left:22%;right:22%;top:36%;height:36%", "walls 墙")}
    ${slot("ramp", "left:14%;right:14%;bottom:6%;height:24%", "ramp 坡道")}`
    }
  </div>`;
}

function renderHouseBoard(room, interactive) {
  const pack = themePack();
  const slot = (name, style, label) => {
    const done = room[name];
    const tag = interactive ? "button" : "div";
    const extra = interactive ? `type="button" data-gslot="${name}"` : "";
    return `<${tag} class="g-slot kid-btn ${done ? "done" : ""}" ${extra} style="${style}">
      ${done && interactive ? housePieceArt(name) : ""}
      <span class="label">${escapeHtml(label)}</span>
    </${tag}>`;
  };
  return `<div class="garage-board house-board">
    ${slot("cupboard", "right:8%;top:10%;width:30%;height:62%", `${pack.pieceLabels.cupboard[0]} ${pack.pieceLabels.cupboard[1]}`)}
    ${slot("bed", "left:8%;top:16%;width:42%;height:48%", `${pack.pieceLabels.bed[0]} ${pack.pieceLabels.bed[1]}`)}
    ${slot("table", "left:20%;bottom:8%;width:38%;height:34%", `${pack.pieceLabels.table[0]} ${pack.pieceLabels.table[1]}`)}
    ${
      room.table && room.bed && room.cupboard
        ? `<div class="g-done-token">${photo("bowl", "bowl")}</div>`
        : ""
    }
  </div>`;
}

function renderHouseWhereBoard(cls) {
  return `<div class="where-board scene-board">${houseWhereChoiceArt(cls)}</div>`;
}

function renderWhereScene(spot, house) {
  if (house) return `<div class="where-board scene-board">${houseWhereChoiceArt(spot.cls)}</div>`;
  return `<div class="where-board scene-board">${whereChoiceArt(spot.cls)}</div>`;
}

function renderBuild() {
  const pack = themePack();
  const title = pack.titles.build;
  const again = pack.id === "house" ? "Play again" : "Build again";
  if (round.kind === "belong") {
    return `${topbar(title)}
      ${playLayout(
        `<h2>${escapeHtml(round.promptEn)}</h2>
        <p>${loadState().bilingual ? escapeHtml(round.promptZh) : ""}</p>
        ${langButtons(round.promptEn, round.promptZh)}
        <div class="pair-row"><div class="pair-cell">${round.show}</div></div>`,
        `${renderChoices()}${resultBlock("again-build", again, "Yes — that’s where it goes.", "对，它就在那里。", "Look at the picture. Where does it belong?", "看看这张图。它属于哪里？")}`
      )}`;
  }
  if (round.kind === "where") {
    const house = pack.id === "house";
    const spot = round.spot;
    const h2 = spot.en;
    const p = `${spot.zh} · Tap the matching picture.`;
    const hearEn = spot.en;
    const hearZh = spot.zh;
    const retryEn = house ? "Is it on, under, in, or next to?" : "Is it in, on, under, or next to?";
    const retryZh = house ? "在上面、下面、里面，还是旁边？" : "在里面、上面、下面，还是旁边？";
    return `${topbar(title)}
      ${playLayout(
        `<h2>${h2}</h2>
        <p>${p}</p>
        ${langButtons(hearEn, hearZh)}`,
        `${renderChoices("wide")}${resultBlock("again-build", again, "Yes — that’s where it is.", "对，它就在那里。", retryEn, retryZh)}`
      )}`;
  }

  if (round.kind === "missing") {
    const house = pack.id === "house";
    const board = house ? renderHouseBoard(round.room, false) : renderGarageBoard(round.garage, false);
    const hearEn = house ? "What’s missing from the room?" : "What’s missing from the garage?";
    const hearZh = house ? "房间少了哪一块？" : "车库少了哪一块？";
    return `${topbar(title)}
      ${playLayout(
        `<h2>What’s missing?</h2>
        <p>少了哪一块？</p>
        ${langButtons(hearEn, hearZh)}
        ${board}`,
        `${renderChoices("wide")}${resultBlock("again-build", again, "That’s the missing piece.", "就是少了这一块。", "Two pieces are here. What’s gone?", "两块在。哪一块不见了？")}`
      )}`;
  }

  if (pack.id === "house") {
    const done = round.room.table && round.room.bed && round.room.cupboard;
    return `${topbar(title)}
    ${playLayout(
      `<h2>Tap a piece, then tap where it goes.</h2>
      <p>选一块，再点位置。</p>
      ${langButtons("The bowl is on the table. The teddy is under the bed.", "碗在桌子上面。玩具在床下面。")}`,
      `${renderHouseBoard(round.room, true)}
    <div class="piece-tray">
      ${pack.pieces
        .filter((p) => !round.room[p])
        .map(
          (p) =>
            `<button class="piece kid-btn" type="button" data-piece="${p}" aria-label="${p}" style="${selectedPiece === p ? "outline:3px solid #e8b44c" : ""}">${housePieceArt(p)}</button>`
        )
        .join("")}
    </div>
    ${
      done
        ? compactYes(
            "again-build",
            again,
            "First we eat at the table. Then we sleep in the bed.",
            "先在桌子上吃饭，然后在床上睡觉。",
            "The room is ready."
          )
        : ""
    }`,
      "place"
    )}`;
  }

  const done = round.garage.ramp && round.garage.wall && round.garage.roof;
  return `${topbar(title)}
    ${playLayout(
      `<h2>Tap a piece, then tap where it goes.</h2>
      <p>选一块，再点位置。</p>
      ${langButtons("The roof is on top. The ramp is under.", "屋顶在上面。坡道在下面。")}`,
      `${renderGarageBoard(round.garage, true)}
    <div class="piece-tray">
      ${["ramp", "wall", "roof"]
        .filter((p) => !round.garage[p])
        .map(
          (p) =>
            `<button class="piece kid-btn" type="button" data-piece="${p}" aria-label="${p}" style="${selectedPiece === p ? "outline:3px solid #e8b44c" : ""}">${pieceArt(p)}</button>`
        )
        .join("")}
    </div>
    ${
      done
        ? compactYes(
            "again-build",
            "Build again",
            "First the car drives up the ramp. Then it goes under the roof.",
            "先开上坡道，然后开进屋顶下面。",
            "Garage is ready."
          )
        : ""
    }`,
      "place"
    )}`;
}

function renderSettings() {
  const s = loadState();
  return `${topbar("Grown-up settings")}
    <div class="settings allow-scroll">
      <h2>For the parent</h2>
      <p>The handbook is the main plan. This page is extra. Sit with him; start with stories. Three worlds: Garage 小车库, 过家家, and 故事书 Story Time. Switch with the big picture bar on home. Garage and house keep the five boxes. Story Time is a shelf of short books for staying on one topic.</p>
      <label>English + 中文 labels
        <input type="checkbox" data-set="bilingual" ${s.bilingual ? "checked" : ""}/>
      </label>
      <label>Tap-to-hear speech
        <input type="checkbox" data-set="speech" ${s.speech ? "checked" : ""}/>
      </label>
      <label>声音
        <select data-set="speechVoiceURI">
          ${renderSpeechVoiceOptions()}
        </select>
      </label>
      <p class="cogat-hint">Safari 网页通常只能用 Tingting / Meijia，设置里的 Yue 可能给不了网页。</p>
      <p class="cogat-hint">下拉框列出网页能看到的全部声音（名字 + 语言）。故事书只读中文，一页一句。</p>
      <label>Gentle break reminder
        <select data-set="sessionMin">
          ${[5, 8, 10, 15]
            .map(
              (n) =>
                `<option value="${n}" ${Number(s.sessionMin) === n ? "selected" : ""}>${n} minutes</option>`
            )
            .join("")}
        </select>
      </label>
      <label>Tell the Story
        <input type="checkbox" data-play="story" ${s.plays.story ? "checked" : ""}/>
      </label>
      <p class="cogat-hint">This play is like CogAT Verbal: picture sequence, picture classification, picture analogies (and a little sentence completion). Narrative stays the priority.</p>
      <label>Park the Cars
        <input type="checkbox" data-play="park" ${s.plays.park ? "checked" : ""}/>
      </label>
      <p class="cogat-hint">This play is like CogAT Quantitative: number puzzles, number series, number analogies — relationships (more/less/same, how many more), not counting to 40.</p>
      <label>Which Bay?
        <input type="checkbox" data-play="bay" ${s.plays.bay ? "checked" : ""}/>
      </label>
      <p class="cogat-hint">This play is like CogAT Nonverbal: figure/picture classification and simple 2×2 figure matrices. No paper folding.</p>
      <label>Build the Garage
        <input type="checkbox" data-play="build" ${s.plays.build ? "checked" : ""}/>
      </label>
      <p class="cogat-hint">This play is like CogAT Nonverbal spatial language (in / on / under / next to) and noticing what’s missing — not paper folding.</p>
      <label>Mystery Box · 盲盒猜猜猜
        <input type="checkbox" data-play="box" ${s.plays.box !== false ? "checked" : ""}/>
      </label>
      <p class="cogat-hint">Three spoken hints, then four pictures. The box opens when the picture matches. No reading required.</p>
      <p class="cogat-hint">故事书（第三扇门）：全程中文。先听故事、跟着这一本，再问是谁/什么/哪里、先/后。听和看图，不用认字。先接住他的话，再问回主题。他说恐龙：恐龙呀。那恐龙想戴小黄帽吗？不要说「车待会再讲」。</p>
      <p style="margin-top:12px;color:var(--muted);font-size:0.9rem">Stars saved on this device only. No account. CogAT words stay in this grown-up screen only.</p>
      <p class="cogat-hint">Same page on phone and iPad — one address. In Safari: Share (方块加箭头) → Add to Home Screen / 添加到主屏幕. Both devices can do this. Mac stays awake on the same Wi-Fi with the server running. This is a home-screen web app, not an App Store app.</p>
    </div>`;
}

function renderOverlay() {
  if (overlay === "gate") {
    return `<div class="overlay"><div class="modal">
      <h2>Grown-up check</h2>
      <p>Tap the <b>yellow</b> car so little hands don’t change settings.</p>
      <div class="gate-cars">
        <button class="kid-btn" type="button" data-gate="red">${photo("sports-car", "red sports car")}</button>
        <button class="kid-btn" type="button" data-gate="yellow">${photo("car-yellow", "yellow car")}</button>
        <button class="kid-btn" type="button" data-gate="blue">${photo("car-blue", "blue car")}</button>
      </div>
      <button class="big ghost" type="button" data-action="close-overlay">Back</button>
    </div></div>`;
  }
  if (overlay === "break") {
    return `<div class="overlay"><div class="modal">
      <h2>Maybe a snack break?</h2>
      <p>Real cars and magnetic tiles are still the best garage. No rush.</p>
      <button class="big" type="button" data-go="home">Home</button>
      <button class="big ghost" type="button" data-action="keep-playing">Keep playing</button>
    </div></div>`;
  }
  return "";
}

function finishStoryVideo() {
  if (!round || round.kind !== "sequence" || round.storyVideo === "done") return;
  round.storyVideo = "done";
  const playing = document.querySelector("video.story-video");
  if (playing) {
    try {
      playing.pause();
    } catch {
      /* ignore */
    }
  }
  render();
}

function hookStoryVideo() {
  const video = document.querySelector("video.story-video");
  if (!video || !round || round.storyVideo === "done") return;
  round.storyVideo = "playing";
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.addEventListener("ended", finishStoryVideo, { once: true });
  video.addEventListener("error", finishStoryVideo, { once: true });
  const attempt = video.play();
  if (attempt && typeof attempt.catch === "function") {
    attempt.catch(() => {
      /* iOS may block unmute; Skip stays available. */
    });
  }
}

function render() {
  let html = "";
  if (view === "themes") html = renderThemes();
  else if (view === "home") html = themeId() === "storybook" ? renderStoryShelf() : renderHome();
  else if (view === "settings") html = renderSettings();
  else if (view === "book") html = renderBook();
  else if (view === "story") html = renderStory();
  else if (view === "park") html = renderPark();
  else if (view === "bay") html = renderBay();
  else if (view === "build") html = renderBuild();
  else if (view === "box") html = renderBox();
  const stageClass =
    view === "home" || view === "themes" ? "stage home-stage" : view === "settings" ? "stage" : "stage play-stage";
  const body = view === "settings" ? html : wrapPlayScroll(html);
  app.innerHTML = `<div class="${stageClass}">${body}</div>${renderOverlay()}`;
  pinPlayActions();
  hookStoryVideo();
  hookStoryBookRead();
}

function pinPlayActions() {
  const fit = document.querySelector(".play-fit");
  if (!fit) return;
  const actions = fit.querySelector(".play-actions");
  if (!actions || actions.parentElement === fit) return;
  fit.appendChild(actions);
  const well = fit.querySelector(".answer-well");
  if (well && !well.children.length) well.classList.add("is-empty");
}

function wrapPlayScroll(html) {
  const needle = '<div class="road-strip"></div>';
  const idx = html.indexOf(needle);
  if (idx === -1) return html;
  const split = idx + needle.length;
  return `${html.slice(0, split)}<div class="play-scroll allow-scroll">${html.slice(split)}</div>`;
}

function parkAdd() {
  const i = round.parked.findIndex((c) => !c);
  if (i !== -1) {
    round.parked[i] = PALETTE[i % PALETTE.length];
    if (round.parked.filter(Boolean).length === round.need) celebrate("correct");
    render();
  }
}

app.addEventListener("click", (e) => {
  if (Date.now() < suppressClickUntil) return;
  const t = e.target.closest(
    "[data-go],[data-theme],[data-speak],[data-action],[data-pick],[data-unslot],[data-choice],[data-unpark],[data-piece],[data-gslot],[data-gate],[data-book],[data-belong],#grownup"
  );
  if (!t) return;

  if (t.id === "grownup") {
    onGrownupTap();
    return;
  }

  if (t.dataset.theme) {
    overlay = null;
    cancelStoryRead();
    saveState({ theme: t.dataset.theme });
    view = "home";
    render();
    return;
  }

  if (t.dataset.book) {
    overlay = null;
    startBook(t.dataset.book);
    return;
  }

  if (t.dataset.belong) {
    const id = t.dataset.belong;
    const item = (round.belongOrder || []).find((x) => x.id === id);
    if (!item) return;
    if (!item.on) {
      round.showJoinNudge = true;
      round.bridgeZh = item.bridgeZh || round.book.parentCarZh;
      celebrate("wrong");
      render();
      return;
    }
    if (!round.belongPicked.includes(id)) round.belongPicked.push(id);
    round.showJoinNudge = false;
    if (round.book.belongOn.every((need) => round.belongPicked.includes(need))) {
      celebrate("correct");
    }
    render();
    return;
  }

  if (t.dataset.go) {
    overlay = null;
    if (t.dataset.go === "home") {
      cancelStoryRead();
      view = view === "home" ? "themes" : "home";
      render();
      return;
    }
    if (t.dataset.go === "themes") {
      view = "themes";
      render();
      return;
    }
    if (t.dataset.go === "story") startStory();
    else if (t.dataset.go === "park") startPark();
    else if (t.dataset.go === "bay") startBay();
    else if (t.dataset.go === "build") startBuild();
    else if (t.dataset.go === "box") startBox();
    else {
      view = t.dataset.go;
      render();
    }
    return;
  }

  if (t.dataset.speak) {
    cancelStoryRead();
    speak(t.dataset.text, t.dataset.speak);
    return;
  }

  if (t.dataset.action === "close-overlay") {
    overlay = null;
    render();
    return;
  }
  if (t.dataset.action === "keep-playing") {
    overlay = null;
    sessionStarted = Date.now();
    render();
    return;
  }
  if (t.dataset.action === "skip-story-video") {
    finishStoryVideo();
    return;
  }
  if (t.dataset.action === "another-story") {
    startStory();
    return;
  }
  if (t.dataset.action === "reset-slots") {
    const n = round.story ? round.story.beats.length : round.book ? round.book.seq.length : 0;
    round.slots = Array(n).fill(null);
    round.selectedBeat = null;
    render();
    return;
  }
  if (t.dataset.action === "book-next") {
    cancelStoryRead();
    if (round.page < round.book.pages.length - 1) round.page += 1;
    round.didAutoRead = false;
    render();
    return;
  }
  if (t.dataset.action === "book-prev") {
    cancelStoryRead();
    if (round.page > 0) round.page -= 1;
    round.didAutoRead = false;
    render();
    return;
  }
  if (t.dataset.action === "book-read-all") {
    cancelStoryRead();
    round.page = 0;
    round.didAutoRead = true;
    render();
    readStoryBookAloud(true);
    return;
  }
  if (t.dataset.action === "book-understand") {
    cancelStoryRead();
    round.phase = "belong";
    round.showJoinNudge = false;
    render();
    return;
  }
  if (t.dataset.action === "book-sequence") {
    round.phase = "sequence";
    round.slots = Array(round.book.seq.length).fill(null);
    round.selectedBeat = null;
    render();
    return;
  }
  if (t.dataset.action === "book-ask") {
    round.phase = "ask";
    round.qIndex = 0;
    round.picked = null;
    round.choices = null;
    render();
    return;
  }
  if (t.dataset.action === "book-next-q") {
    round.qIndex += 1;
    round.picked = null;
    round.choices = null;
    round.showJoinNudge = false;
    render();
    return;
  }
  if (t.dataset.action === "another-book") {
    cancelStoryRead();
    view = "home";
    round = null;
    render();
    return;
  }
  if (t.dataset.action === "again-park") {
    startPark();
    return;
  }
  if (t.dataset.action === "again-bay") {
    startBay();
    return;
  }
  if (t.dataset.action === "again-build") {
    startBuild();
    return;
  }
  if (t.dataset.action === "again-box") {
    startBox();
    return;
  }
  if (t.dataset.action === "park-add") {
    parkAdd();
    return;
  }

  if (t.dataset.pick) {
    round.selectedBeat = round.selectedBeat === t.dataset.pick ? null : t.dataset.pick;
    render();
    return;
  }
  if (t.dataset.unslot !== undefined) {
    const slotIndex = Number(t.dataset.unslot);
    if (round.selectedBeat) {
      sequencePlace(round.selectedBeat, slotIndex);
      if (sequenceIsCorrect()) celebrate("correct");
      else if (round.slots.every(Boolean)) celebrate("wrong");
    } else {
      round.slots[slotIndex] = null;
      round.selectedBeat = null;
    }
    render();
    return;
  }

  if (t.dataset.choice) {
    round.picked = t.dataset.choice;
    if (choiceIsCorrect()) {
      if (round.kind === "mystery") round.opened = true;
      if (round.kind === "storybook" && round.phase === "ask") {
        const last = round.qIndex >= round.book.questions.length - 1;
        if (last) addStarOnce();
      }
      celebrate("correct");
    } else {
      celebrate("wrong");
    }
    render();
    return;
  }

  if (t.dataset.unpark !== undefined && round && round.kind === "park") {
    const i = Number(t.dataset.unpark);
    if (round.parked[i]) {
      round.parked[i] = null;
      awarded = false;
    } else {
      round.parked[i] = PALETTE[i % PALETTE.length];
      if (round.parked.filter(Boolean).length === round.need) celebrate("correct");
    }
    render();
    return;
  }

  if (t.dataset.piece) {
    selectedPiece = t.dataset.piece;
    render();
    return;
  }
  if (t.dataset.gslot && selectedPiece === t.dataset.gslot) {
    if (round.room) round.room[t.dataset.gslot] = true;
    else round.garage[t.dataset.gslot] = true;
    selectedPiece = null;
    const done = round.room
      ? round.room.table && round.room.bed && round.room.cupboard
      : round.garage.ramp && round.garage.wall && round.garage.roof;
    if (done) celebrate("correct");
    render();
    return;
  }

  if (t.dataset.gate === "yellow") {
    overlay = null;
    view = "settings";
    render();
    whenSpeechVoicesReady().then(() => {
      if (view === "settings") refreshSettingsVoiceSelect();
    });
    return;
  }
  if (t.dataset.gate) {
    overlay = null;
    render();
  }
});

app.addEventListener("change", (e) => {
  const el = e.target;
  if (el.dataset.set === "bilingual" || el.dataset.set === "speech") {
    saveState({ [el.dataset.set]: el.checked });
  }
  if (el.dataset.set === "speechVoiceURI") {
    saveState({ speechVoiceURI: el.value });
  }
  if (el.dataset.set === "sessionMin") {
    saveState({ sessionMin: Number(el.value) });
  }
  if (el.dataset.play) {
    const plays = { ...loadState().plays, [el.dataset.play]: el.checked };
    saveState({ plays });
  }
});

function clearDrag() {
  if (drag.ghost) drag.ghost.remove();
  document.querySelectorAll(".drop-slot.drop-hover").forEach((el) => el.classList.remove("drop-hover"));
  drag.id = null;
  drag.ghost = null;
  drag.moved = false;
  drag.pointerId = null;
}

function slotFromPoint(x, y) {
  const els = document.elementsFromPoint(x, y);
  for (let i = 0; i < els.length; i += 1) {
    const slot = els[i].closest && els[i].closest(".drop-slot");
    if (slot) return slot;
  }
  return null;
}

function canSequenceDrag() {
  return (
    (view === "story" && round && round.kind === "sequence") ||
    (view === "book" && round && round.phase === "sequence")
  );
}

function hideGrownupHint() {
  const toast = document.getElementById("grownup-hint");
  if (toast) toast.hidden = true;
  clearTimeout(grownupHintTimer);
}

function showGrownupHint(msg) {
  let toast = document.getElementById("grownup-hint");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "grownup-hint";
    toast.className = "grownup-hint";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(grownupHintTimer);
  grownupHintTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2400);
}

function openGrownupGate() {
  clearTimeout(holdTimer);
  holdTimer = null;
  grownupArmedUntil = 0;
  hideGrownupHint();
  overlay = "gate";
  render();
}

function onGrownupTap() {
  const now = Date.now();
  if (now < grownupTapLockUntil) return;
  grownupTapLockUntil = now + 380;
  if (overlay === "gate" || view === "settings") return;
  if (now < grownupArmedUntil) {
    openGrownupGate();
    return;
  }
  grownupArmedUntil = now + 4500;
  const btn = document.getElementById("grownup");
  if (btn) btn.classList.add("is-armed");
  showGrownupHint("这是给大人的，再按一次");
}

app.addEventListener("pointerdown", (e) => {
  const grown = e.target.closest("#grownup");
  if (grown) {
    e.stopPropagation();
    clearTimeout(holdTimer);
    holdTimer = setTimeout(() => {
      openGrownupGate();
    }, 800);
  }
  if (!canSequenceDrag() || e.button) return;
  const source = e.target.closest("[data-drag]");
  if (!source) return;
  drag.id = source.dataset.drag;
  drag.startX = e.clientX;
  drag.startY = e.clientY;
  drag.moved = false;
  drag.pointerId = e.pointerId;
  try {
    source.setPointerCapture(e.pointerId);
  } catch {
    /* ignore */
  }
});

app.addEventListener(
  "pointermove",
  (e) => {
    if (!drag.id || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && dx * dx + dy * dy < 144) return;
    if (!drag.moved) {
      drag.moved = true;
      drag.ghost = document.createElement("div");
      drag.ghost.className = "drag-ghost";
      const src = document.querySelector('[data-drag="' + drag.id + '"]');
      if (src) drag.ghost.innerHTML = src.innerHTML;
      document.body.appendChild(drag.ghost);
    }
    e.preventDefault();
    drag.ghost.style.left = `${e.clientX}px`;
    drag.ghost.style.top = `${e.clientY}px`;
    document.querySelectorAll(".drop-slot.drop-hover").forEach((el) => el.classList.remove("drop-hover"));
    const slot = slotFromPoint(e.clientX, e.clientY);
    if (slot) slot.classList.add("drop-hover");
  },
  { passive: false }
);

app.addEventListener("pointerup", (e) => {
  const grown = e.target.closest && e.target.closest("#grownup");
  if (grown) {
    clearTimeout(holdTimer);
    holdTimer = null;
    onGrownupTap();
    suppressClickUntil = Date.now() + 400;
  } else if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = null;
  }
  if (!drag.id) return;
  const id = drag.id;
  const moved = drag.moved;
  const slot = moved ? slotFromPoint(e.clientX, e.clientY) : null;
  clearDrag();
  if (!moved || !canSequenceDrag()) return;
  suppressClickUntil = Date.now() + 450;
  if (slot) {
    sequencePlace(id, Number(slot.dataset.unslot));
    if (sequenceIsCorrect()) celebrate("correct");
    else if (round.slots.every(Boolean)) celebrate("wrong");
    render();
  }
});
app.addEventListener("pointercancel", (e) => {
  const grown = e.target.closest && e.target.closest("#grownup");
  clearTimeout(holdTimer);
  holdTimer = null;
  if (grown) {
    onGrownupTap();
    suppressClickUntil = Date.now() + 400;
  }
  clearDrag();
});

warmSpeechVoices();
render();

function allowScrollRoot(target) {
  return target && target.closest ? target.closest(".allow-scroll, .play-scroll") : null;
}

function findPlayScroller(start) {
  let el = start;
  while (el && el !== document.body) {
    const taller = el.scrollHeight > el.clientHeight + 1;
    if (taller) {
      const oy = window.getComputedStyle(el).overflowY;
      if (oy === "auto" || oy === "scroll" || el.classList.contains("allow-scroll") || el.classList.contains("play-scroll")) {
        return el;
      }
    }
    el = el.parentElement;
  }
  return start;
}

function pinDocument() {
  if (window.scrollX || window.scrollY) window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function shouldAllowInnerScroll(event) {
  if (drag.moved) return false;
  if (event.touches && event.touches.length > 1) return false;
  const area = allowScrollRoot(event.target);
  if (!area) return false;
  const scroller = findPlayScroller(area);
  if (!scroller || scroller.scrollHeight <= scroller.clientHeight + 1) return false;
  const touch = event.touches && event.touches[0];
  if (!touch || typeof scroller._lastTouchY !== "number") return true;
  const dy = touch.clientY - scroller._lastTouchY;
  const atTop = scroller.scrollTop <= 0;
  const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
  if (atTop && dy > 0) return false;
  if (atBottom && dy < 0) return false;
  return true;
}

document.addEventListener(
  "touchstart",
  (e) => {
    const area = allowScrollRoot(e.target);
    const scroller = area ? findPlayScroller(area) : null;
    if (scroller && e.touches && e.touches[0]) scroller._lastTouchY = e.touches[0].clientY;
    if (e.touches && e.touches.length > 1) e.preventDefault();
  },
  { passive: false, capture: true }
);

window.addEventListener(
  "touchmove",
  (e) => {
    if (!shouldAllowInnerScroll(e)) e.preventDefault();
    const area = allowScrollRoot(e.target);
    const scroller = area ? findPlayScroller(area) : null;
    if (scroller && e.touches && e.touches[0]) scroller._lastTouchY = e.touches[0].clientY;
    pinDocument();
  },
  { passive: false, capture: true }
);

document.addEventListener("touchend", pinDocument, { passive: true });
window.addEventListener("scroll", pinDocument, { passive: true });
window.addEventListener("resize", pinDocument);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", pinDocument);
  window.visualViewport.addEventListener("scroll", pinDocument);
}

["gesturestart", "gesturechange", "gestureend"].forEach((type) => {
  document.addEventListener(type, (e) => e.preventDefault(), { passive: false });
});
