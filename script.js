/* ---------- Templates: [name, width, height, animated GIF support] ----------
   support: "yes" = animates, "maybe" = unreliable / sources disagree, "no" = shown as a still image */
const PLATFORMS = {
  Facebook: [
    ["Page banner", 820, 312, "no"],
    ["Event banner", 1920, 1005, "no"],
    ["Post", 1200, 630, "maybe"],
    ["Link post", 1200, 628, "no"],
    ["Story", 1080, 1920, "no"],
  ],
  Instagram: [
    ["Square post", 1080, 1080, "no"],
    ["Portrait post", 1080, 1350, "no"],
    ["Story / Reel", 1080, 1920, "no"],
  ],
  "X / Twitter": [
    ["Header", 1500, 500, "no"],
    ["Post image", 1600, 900, "yes"],
  ],
  LinkedIn: [
    ["Page banner", 1584, 396, "no"],
    ["Post", 1200, 627, "maybe"],
  ],
  YouTube: [
    ["Thumbnail", 1280, 720, "no"],
    ["Channel banner", 2560, 1440, "no"],
  ],
  Bluesky: [
    ["Profile picture", 1000, 1000, "maybe"],
    ["Banner", 3000, 1000, "no"],
    ["Post image", 1200, 675, "maybe"],
  ],
  ArtStation: [
    ["Profile banner", 1920, 400, "no"],
    ["Project thumbnail", 1920, 1080, "no"],
    ["Avatar", 400, 400, "no"],
  ],
  "Ko-fi": [
    ["Page banner", 1500, 500, "no"],
    ["Avatar", 512, 512, "no"],
  ],
  Reddit: [
    ["Community banner", 1920, 384, "no"],
    ["Community icon", 256, 256, "no"],
  ],
  Mastodon: [
    ["Profile picture", 400, 400, "maybe"],
    ["Header", 1500, 500, "maybe"],
    ["Link preview", 1200, 630, "no"],
  ],
  // 5th value (optional) = overlay zones the platform covers: [label, x, y, width, height] as fractions of the image
  "itch.io": [
    ["Cover image", 630, 500, "yes", [["GIF label", 0.01, 0.02, 0.14, 0.11]]],
    ["Screenshot", 1920, 1080, "maybe"],
    ["Page banner", 2048, 880, "maybe"],
    ["Wide cover (21:9)", 2100, 900, "no"],
    ["Social media image", 1200, 630, "no"],
    ["Logo (transparent PNG)", 1000, 500, "no"],
    ["Favicon", 32, 32, "no"],
  ],
  "Unity Asset Store": [
    ["Icon", 160, 160, "no"],
    ["Card", 420, 280, "no"],
    ["Cover", 1950, 1300, "no"],
    ["Social media", 1200, 630, "no"],
  ],
  "Epic / Fab": [["Gallery image", 1920, 1080, "no"]],
};

const MAX_TPL = Math.max(...Object.values(PLATFORMS).map((a) => a.length));

const $ = (id) =>
  id[0] === "." ? document.querySelector(id) : document.getElementById(id);
const cv = $("cv"),
  ctx = cv.getContext("2d");
let plat = "Facebook",
  tpl = PLATFORMS[plat][1],
  W = tpl[1],
  H = tpl[2];
let layers = [],
  sel = null,
  uid = 1,
  guides = false;
let T = 0,
  D = 3,
  playing = false,
  last = 0; // timeline: current time, length (s)

/* ---------- Template picker ---------- */
function renderTabs() {
  $("platform").innerHTML = "";
  Object.keys(PLATFORMS).forEach((p) => {
    const b = document.createElement("button");
    b.textContent = p;
    b.setAttribute("aria-pressed", p === plat);
    b.onclick = () => {
      plat = p;
      pick(PLATFORMS[p][0]);
    };
    $("platform").appendChild(b);
  });
}

function renderTpl() {
  renderTabs();
  $("templates").innerHTML = "";
  $("templates").style.minHeight =
    `calc(${MAX_TPL} * 46px + ${MAX_TPL - 1} * 6px)`;
  PLATFORMS[plat].forEach((t) => {
    const b = document.createElement("button");
    b.setAttribute("aria-pressed", t === tpl);
    const k = 26 / Math.max(t[1], t[2]);
    b.innerHTML = `<i style="width:${t[1] * k}px;height:${t[2] * k}px"></i><b>${t[0]}</b>${t[3] === "yes" ? '<u class="gt yes">GIF</u>' : t[3] === "maybe" ? '<u class="gt maybe">GIF?</u>' : ""}${VIDEO[plat + "/" + t[0]] ? '<u class="gt vid">MP4</u>' : ""}<small>${t[1]}×${t[2]}</small>`;
    b.onclick = () => pick(t);
    $("templates").appendChild(b);
  });
}
function pick(t) {
  tpl = t;
  W = t[1];
  H = t[2];
  cv.width = W;
  cv.height = H;
  layers.forEach((l) => {
    if (l.x > W || l.y > H) {
      l.x = W / 2;
      l.y = H / 2;
    }
  });
  renderTpl();
  fitView();
  applyAnimMode();
  draw();
  status();
}
function fitView() {
  const maxW = Math.max(100, cv.parentElement.clientWidth),
    maxH = innerHeight * 0.62;
  const k = Math.min(maxW / W, maxH / H);
  cv.style.width = W * k + "px";
  cv.style.height = H * k + "px";
}

/* ---------- Layers ---------- */
async function addImage(file) {
  let anim = null;
  if (file.type === "image/gif" && "ImageDecoder" in window)
    anim = await decodeGif(file).catch(() => null);
  const finish = (l) => {
    fill(l);
    layers.push(l);
    sel = l.id;
    ui();
    draw();
    status();
  };
  if (anim) {
    if (!layers.some((x) => x.anim) || anim.total > D) setDur(anim.total);
    finish({
      id: uid++,
      type: "image",
      name: file.name,
      img: anim.frames[0].bmp,
      anim,
      x: W / 2,
      y: H / 2,
      s: 1,
    });
    setPlay(true);
    return;
  }
  const img = new Image();
  img.onload = () =>
    finish({
      id: uid++,
      type: "image",
      name: file.name,
      img,
      x: W / 2,
      y: H / 2,
      s: 1,
      still: file.type === "image/gif",
    });
  img.src = URL.createObjectURL(file);
}
function addText() {
  const l = {
    id: uid++,
    type: "text",
    name: "Text",
    text: "Your text",
    x: W / 2,
    y: H / 2,
    size: Math.round(H / 8),
    color: "#ffffff",
    stroke: true,
  };
  layers.push(l);
  sel = l.id;
  ui();
  draw();
  status();
}
const get = (id) => layers.find((l) => l.id === id);

function size(l) {
  if (l.type === "image")
    return { w: l.img.width * l.s, h: l.img.height * l.s };
  ctx.font = fontOf(l);
  return { w: ctx.measureText(l.text).width, h: l.size * 1.2 };
}
function fill(l) {
  l.s = Math.max(W / l.img.width, H / l.img.height);
  l.x = W / 2;
  l.y = H / 2;
}
function contain(l) {
  l.s = Math.min(W / l.img.width, H / l.img.height);
  l.x = W / 2;
  l.y = H / 2;
}

/* ---------- Drawing ---------- */
function draw(forExport) {
  ctx.clearRect(0, 0, W, H);
  if ($("bgOn").checked) {
    ctx.fillStyle = $("bg").value;
    ctx.fillRect(0, 0, W, H);
  }
  layers.forEach((l) => {
    const fx = effect(l);
    if (!fx) return;
    ctx.save();
    ctx.globalAlpha = fx.a;
    ctx.translate(l.x, l.y + fx.dy);
    ctx.scale(fx.s, fx.s);
    ctx.translate(-l.x, -l.y);
    if (l.type === "image") {
      const { w, h } = size(l);
      ctx.drawImage(frameOf(l), l.x - w / 2, l.y - h / 2, w, h);
    } else {
      ctx.font = fontOf(l);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (l.stroke) {
        ctx.lineWidth = l.size / 8;
        ctx.strokeStyle = "rgba(0,0,0,.55)";
        ctx.lineJoin = "round";
        ctx.strokeText(l.text, l.x, l.y);
      }
      ctx.fillStyle = l.color;
      ctx.fillText(l.text, l.x, l.y);
    }
    ctx.restore();
  });
  if (forExport) return;

  const lw = Math.max(2, W / 400);
  if (guides) {
    const m = Math.min(W, H) * 0.08;
    halo(m, m, W - 2 * m, H - 2 * m, lw, [lw * 5, lw * 4], "#ffd400");
  }
  drawZones(lw);
  const l = get(sel);
  if (l) {
    const { w, h } = size(l);
    ctx.save();
    ctx.lineWidth = lw;
    ctx.strokeStyle = "#7f55d6";
    halo(l.x - w / 2, l.y - h / 2, w, h, lw, [], "#7f55d6");
    const hs = Math.max(10, W / 70);
    ctx.fillStyle = "#fff";
    corners(l, w, h).forEach(([cx, cy]) => {
      ctx.fillRect(cx - hs / 2, cy - hs / 2, hs, hs);
      ctx.strokeRect(cx - hs / 2, cy - hs / 2, hs, hs);
    });
    ctx.restore();
  }
}

/* ---------- Fit check ---------- */
function status() {
  const chips = [
    `<span class="chip idle">${tpl[0]} · ${W}×${H}</span>`,
    animChip(),
  ];
  $(".timeline").hidden = !hasMotion() && !layers.some((x) => x.anim);
  const l =
    get(sel)?.type === "image"
      ? get(sel)
      : layers.find((x) => x.type === "image");
  if (!l) {
    chips.push(`<span class="chip idle">Add an image to check the fit</span>`);
  } else {
    const { w, h } = size(l),
      e = 0.5;
    const covers =
      l.x - w / 2 <= e &&
      l.y - h / 2 <= e &&
      l.x + w / 2 >= W - e &&
      l.y + h / 2 >= H - e;
    chips.push(
      covers
        ? `<span class="chip ok">Fits the template</span>`
        : `<span class="chip bad">Gaps at the edges</span>`,
    );
    if (l.s > 1.5)
      chips.push(
        `<span class="chip bad">Blurry: enlarged ${Math.round(l.s * 100)}%</span>`,
      );
    else if (l.s > 1.05)
      chips.push(
        `<span class="chip warn">Slightly enlarged ${Math.round(l.s * 100)}%</span>`,
      );
    else
      chips.push(
        `<span class="chip ok">Sharp: ${Math.round(l.s * 100)}% of original</span>`,
      );
  }
  if (l?.anim)
    chips.push(
      `<span class="chip idle">GIF · ${l.anim.frames.length} frames · ${l.anim.total.toFixed(2)}s</span>`,
    );
  if (l?.still)
    chips.push(
      `<span class="chip warn">GIF shown as a still: use Chrome, Edge or Safari to preview it</span>`,
    );
  chips.push(`<span class="chip idle">Animation ${D.toFixed(2)}s</span>`);
  $("status").innerHTML = chips.join("");
}

/* ---------- Layer list + properties ---------- */
function ui() {
  const box = $("layers");
  box.innerHTML = "";
  [...layers].reverse().forEach((l) => {
    const d = document.createElement("div");
    d.className = "layer" + (l.id === sel ? " sel" : "");
    d.innerHTML = `<em>${l.type === "text" ? "T" : "🖼"}</em><input class="lname" aria-label="Layer name"><button title="Move up">↑</button><button title="Move down">↓</button><button title="Delete">✕</button>`;
    const ni = d.querySelector("input");
    ni.value = l.name || "";
    ni.oninput = () => {
      l.name = ni.value;
    };
    ni.onclick = (e) => e.stopPropagation();
    ni.onfocus = () => {
      if (sel === l.id) return;
      sel = l.id;
      draw();
      status();
      renderProps();
      box.querySelectorAll(".layer").forEach((x) => x.classList.remove("sel"));
      d.classList.add("sel");
    };
    const [b1, b2, b3] = d.querySelectorAll("button");
    d.onclick = () => {
      sel = l.id;
      ui();
      draw();
      status();
    };
    b1.onclick = (e) => {
      e.stopPropagation();
      move(l, 1);
    };
    b2.onclick = (e) => {
      e.stopPropagation();
      move(l, -1);
    };
    b3.onclick = (e) => {
      e.stopPropagation();
      layers = layers.filter((x) => x !== l);
      if (sel === l.id) sel = null;
      ui();
      draw();
      status();
    };
    box.appendChild(d);
  });

  renderProps();
}
function renderProps() {
  renderProps0();
  addAlign();
  addTiming();
}
function renderProps0() {
  const l = get(sel),
    p = $("props");
  if (!l) {
    p.innerHTML = "";
    return;
  }
  if (l.type === "image") {
    p.innerHTML = `<label>Size</label><input type="range" id="sz" min="1" max="400" value="${Math.round(l.s * 100)}">
      <div class="row"><button class="btn small" id="f1">Fill</button><button class="btn small" id="f2">Fit inside</button></div>`;
    $("sz").oninput = (e) => {
      l.s = e.target.value / 100;
      draw();
      status();
    };
    $("f1").onclick = () => {
      fill(l);
      ui();
      draw();
      status();
    };
    $("f2").onclick = () => {
      contain(l);
      ui();
      draw();
      status();
    };
  } else {
    p.innerHTML = `<label>Text</label><input type="text" id="tx">
      <label>Size</label><input type="range" id="sz" min="10" max="${Math.round(H / 2)}" value="${l.size}">
      <label>Font</label><select id="ft">${FONTS.map(([n, f]) => `<option value="${f}"${(l.font || FONTS[0][1]) === f ? " selected" : ""}>${n}</option>`).join("")}</select>
      <label>Colour</label><input type="color" id="co" value="${l.color}">
      <label style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="bd" ${l.bold === false ? "" : "checked"}> Bold</label>
      <label style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="st" ${l.stroke ? "checked" : ""}> Dark outline</label>`;
    $("tx").value = l.text;
    $("tx").oninput = (e) => {
      l.text = e.target.value;
      draw();
    };
    $("tx").onchange = ui;
    $("sz").oninput = (e) => {
      l.size = +e.target.value;
      draw();
    };
    $("co").oninput = (e) => {
      l.color = e.target.value;
      draw();
    };
    $("st").onchange = (e) => {
      l.stroke = e.target.checked;
      draw();
    };
    $("ft").onchange = (e) => {
      l.font = e.target.value;
      draw();
    };
    $("bd").onchange = (e) => {
      l.bold = e.target.checked;
      draw();
    };
  }
}
function move(l, d) {
  const i = layers.indexOf(l),
    j = i + d;
  if (j < 0 || j >= layers.length) return;
  [layers[i], layers[j]] = [layers[j], layers[i]];
  ui();
  draw();
}

/* ---------- Canvas interaction ---------- */
let drag = null,
  scaling = null;
const corners = (l, w, h) =>
  [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ].map(([a, b]) => [l.x + (a * w) / 2, l.y + (b * h) / 2]);
function handleHit(p) {
  const l = get(sel);
  if (!l) return false;
  const { w, h } = size(l),
    r = Math.max(14, W / 45);
  return corners(l, w, h).some(
    ([cx, cy]) => Math.abs(p.x - cx) <= r && Math.abs(p.y - cy) <= r,
  );
}
function startScale(l, p) {
  return {
    l,
    d0: Math.max(1, Math.hypot(p.x - l.x, p.y - l.y)),
    s0: l.s,
    z0: l.size,
  };
}
const pt = (e) => {
  const r = cv.getBoundingClientRect();
  return {
    x: ((e.clientX - r.left) * W) / r.width,
    y: ((e.clientY - r.top) * H) / r.height,
  };
};

cv.addEventListener("pointerdown", (e) => {
  const p = pt(e);
  if (handleHit(p)) {
    scaling = startScale(get(sel), p);
    cv.setPointerCapture(e.pointerId);
    return;
  }
  let hit = null;
  for (let i = layers.length - 1; i >= 0; i--) {
    const l = layers[i],
      { w, h } = size(l);
    if (Math.abs(p.x - l.x) <= w / 2 && Math.abs(p.y - l.y) <= h / 2) {
      hit = l;
      break;
    }
  }
  if (hit) {
    sel = hit.id;
    drag = { l: hit, dx: p.x - hit.x, dy: p.y - hit.y };
    cv.setPointerCapture(e.pointerId);
    cv.style.cursor = "grabbing";
  } else sel = null;
  ui();
  draw();
  status();
});
cv.addEventListener("pointermove", (e) => {
  const p = pt(e);
  if (scaling) {
    const l = scaling.l,
      f = Math.hypot(p.x - l.x, p.y - l.y) / scaling.d0;
    if (l.type === "image") l.s = Math.max(0.01, scaling.s0 * f);
    else l.size = Math.max(10, Math.round(scaling.z0 * f));
    const sz = $("sz");
    if (sz) sz.value = l.type === "image" ? Math.round(l.s * 100) : l.size;
    draw();
    status();
    return;
  }
  if (!drag) {
    cv.style.cursor = handleHit(p) ? "nwse-resize" : "grab";
    return;
  }
  drag.l.x = p.x - drag.dx;
  drag.l.y = p.y - drag.dy;
  draw();
  status();
});
cv.addEventListener("pointerup", () => {
  drag = null;
  scaling = null;
  cv.style.cursor = "grab";
});
cv.addEventListener(
  "wheel",
  (e) => {
    const l = get(sel);
    if (!l) return;
    e.preventDefault();
    const f = e.deltaY < 0 ? 1.04 : 1 / 1.04;
    if (l.type === "image") l.s *= f;
    else l.size = Math.max(10, Math.round(l.size * f));
    ui();
    draw();
    status();
  },
  { passive: false },
);

/* ---------- Buttons, drop zone, download ---------- */
$("choose").onclick = () => $("file").click();
$("file").onchange = (e) => {
  [...e.target.files].forEach(addImage);
  e.target.value = "";
};
$("addTxt").onclick = addText;
$("guides").onchange = (e) => {
  guides = e.target.checked;
  draw();
};

const dz = $("drop");
["dragenter", "dragover"].forEach((ev) =>
  dz.addEventListener(ev, (e) => {
    e.preventDefault();
    dz.classList.add("over");
  }),
);
["dragleave", "drop"].forEach((ev) =>
  dz.addEventListener(ev, () => dz.classList.remove("over")),
);
addEventListener("dragover", (e) => e.preventDefault());
addEventListener("drop", (e) => {
  e.preventDefault();
  [...e.dataTransfer.files]
    .filter((f) => f.type.startsWith("image/"))
    .forEach(addImage);
});

$("dl").onclick = () => {
  draw(true);
  cv.toBlob((b) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = `${plat}-${tpl[0]}-${W}x${H}.png`.replace(/[\s\/]+/g, "-");
    a.click();
    URL.revokeObjectURL(a.href);
    draw();
  }, "image/png");
};

addEventListener("resize", fitView);

/* ================= Animation: GIF decoding, timeline, effects, GIF export ================= */
async function decodeGif(file) {
  const dec = new ImageDecoder({
    data: await file.arrayBuffer(),
    type: "image/gif",
  });
  await dec.tracks.ready;
  const n = dec.tracks.selectedTrack.frameCount;
  if (n < 2) return null;
  const frames = [];
  let t = 0;
  for (let i = 0; i < n; i++) {
    const { image } = await dec.decode({ frameIndex: i });
    const dur = (image.duration || 100000) / 1e6;
    frames.push({ bmp: await createImageBitmap(image), start: t, dur });
    t += dur;
    image.close();
  }
  return { frames, total: t };
}
function frameOf(l) {
  if (!l.anim) return l.img;
  const tot = l.anim.total,
    t = (((T - (l.t0 || 0)) % tot) + tot) % tot;
  return (
    l.anim.frames.find((f) => t < f.start + f.dur) ||
    l.anim.frames[l.anim.frames.length - 1]
  ).bmp;
}
// In/out animation for a layer at time T. Returns null when the layer isn't visible yet / any more.
function effect(l) {
  const t0 = l.t0 || 0,
    t1 = l.t1 ?? D;
  if (T < t0 || T > t1) return null;
  const ease = (p) => 1 - Math.pow(1 - p, 3);
  const back = (p) => {
    const c = 1.70158;
    return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2);
  };
  const A = 0.4,
    fx = { a: 1, s: 1, dy: 0 };
  const apply = (kind, p, out) => {
    if (kind === "fade") fx.a *= p;
    else if (kind === "pop") fx.s *= Math.max(0.001, out ? ease(p) : back(p));
    else if (kind === "slide") {
      fx.a *= p;
      fx.dy += (out ? -1 : 1) * (1 - ease(p)) * H * 0.12;
    }
  };
  apply(l.inA, Math.min(1, (T - t0) / A), false);
  apply(l.outA, Math.min(1, (t1 - T) / A), true);
  return fx;
}
function addTiming() {
  const l = get(sel);
  if (!l || !hasMotion()) return;
  const o = (v) =>
    ["none", "fade", "pop", "slide"]
      .map(
        (k) =>
          `<option value="${k}"${(v || "none") === k ? " selected" : ""}>${k}</option>`,
      )
      .join("");
  $("props").insertAdjacentHTML(
    "beforeend",
    `<div class="timing"><h3>Timing</h3><div class="g2">
    <div><label>Start (s)</label><input type="number" id="t0" min="0" step="0.1" value="${l.t0 || 0}"></div>
    <div><label>End (s)</label><input type="number" id="t1" min="0" step="0.1" value="${l.t1 ?? D}"></div>
    <div><label>Enter</label><select id="inA">${o(l.inA)}</select></div>
    <div><label>Exit</label><select id="outA">${o(l.outA)}</select></div></div></div>`,
  );
  $("t0").oninput = (e) => {
    l.t0 = Math.max(0, +e.target.value || 0);
    draw();
  };
  $("t1").oninput = (e) => {
    l.t1 = e.target.value === "" ? null : Math.max(0, +e.target.value);
    draw();
  };
  $("inA").onchange = (e) => {
    l.inA = e.target.value;
    setT(l.t0 || 0);
  };
  $("outA").onchange = (e) => {
    l.outA = e.target.value;
    setT(Math.max(0, (l.t1 ?? D) - 0.2));
  };
}
function setT(t) {
  T = Math.min(D, Math.max(0, t));
  showT();
  draw();
}
function showT() {
  $("scrub").value = T;
  $("tnow").textContent = `${T.toFixed(2)} / ${D.toFixed(2)}s`;
}
function setDur(v) {
  D = Math.max(0.5, Math.min(30, Math.round(v * 100) / 100));
  $("dur").value = D;
  $("scrub").max = D;
  if (T > D) T = 0;
  showT();
}
function setPlay(on) {
  playing = on;
  $("play").textContent = on ? "❚❚ Pause" : "▶ Play";
  if (on) {
    last = performance.now();
    requestAnimationFrame(tick);
  }
}
function tick(ts) {
  if (!playing) return;
  T = (T + (ts - last) / 1000) % D;
  last = ts;
  showT();
  draw();
  requestAnimationFrame(tick);
}
$("play").onclick = () => setPlay(!playing);
$("scrub").oninput = (e) => {
  setPlay(false);
  setT(+e.target.value);
};
$("dur").onchange = (e) => {
  setDur(+e.target.value || 3);
  draw();
  status();
};

$("dlgif").onclick = async () => {
  const btn = $("dlgif"),
    txt = btn.textContent,
    wasPlaying = playing,
    keep = T;
  btn.disabled = true;
  setPlay(false);
  try {
    btn.textContent = "Loading encoder…";
    const { GIFEncoder, quantize, applyPalette } =
      await import("https://unpkg.com/gifenc@1.0.3");
    const fps = +$("fps").value,
      n = Math.max(1, Math.round(D * fps)),
      gif = GIFEncoder();
    const off = document.createElement("canvas");
    off.width = W;
    off.height = H;
    const oc = off.getContext("2d", { willReadFrequently: true });
    for (let i = 0; i < n; i++) {
      T = i / fps;
      draw(true);
      oc.fillStyle = exportBg();
      oc.fillRect(0, 0, W, H);
      oc.drawImage(cv, 0, 0);
      const { data } = oc.getImageData(0, 0, W, H),
        palette = quantize(data, 256);
      gif.writeFrame(applyPalette(data, palette), W, H, {
        palette,
        delay: 1000 / fps,
      });
      btn.textContent = `Encoding ${i + 1}/${n}`;
      await new Promise((r) => setTimeout(r));
    }
    gif.finish();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([gif.bytes()], { type: "image/gif" }),
    );
    a.download = `${plat}-${tpl[0]}-${W}x${H}.gif`.replace(/[\s\/]+/g, "-");
    a.click();
    URL.revokeObjectURL(a.href);
  } catch (err) {
    alert("Could not create the GIF: " + err.message);
  }
  T = keep;
  btn.textContent = txt;
  btn.disabled = false;
  showT();
  draw();
  if (wasPlaying) setPlay(true);
};

/* ---------- Per-template animation support ---------- */
const ANIM_NOTE = {
  yes: "Animated GIFs are supported here. Check the platform's file size limit before uploading.",
  maybe:
    "GIF animation on this placement is unreliable or has changed over time. Test it after uploading.",
  no: "This placement shows a still image. Pause on the frame you want, then download the PNG.",
};
function applyAnimMode() {
  const a = tpl[3] || "no",
    v = VIDEO[`${plat}/${tpl[0]}`];
  $("dlgif").hidden = a === "no";
  $("dlmp4").hidden = !v;
  $(".tlopts").hidden = !hasMotion();
  $("animnote").textContent =
    a === "no"
      ? v
        ? `GIFs don't animate here, but video does: download an MP4. ${v}`
        : ANIM_NOTE.no
      : ANIM_NOTE[a] + (v ? ` Video also works: ${v}` : "");
  $("zonesLbl").hidden = !tpl[4];
  if (!hasMotion()) setPlay(false);
  renderProps();
}
function animChip() {
  const a = tpl[3] || "no",
    v = VIDEO[`${plat}/${tpl[0]}`];
  const moving = layers.some(
    (l) =>
      l.anim || (l.inA && l.inA !== "none") || (l.outA && l.outA !== "none"),
  );
  if (a === "yes")
    return `<span class="chip ok">Animated GIF supported${v ? " · MP4 works too" : ""}</span>`;
  if (a === "maybe")
    return `<span class="chip warn">GIF may not play${v ? ": MP4 is safer" : " here"}</span>`;
  if (v) return `<span class="chip warn">No GIF here: export as MP4</span>`;
  return moving
    ? `<span class="chip bad">Still image only: one frame is shown</span>`
    : `<span class="chip idle">Still image only</span>`;
}

/* ---------- Platform overlay zones (e.g. itch.io "Sale" and "GIF" labels) ---------- */
function drawZones(lw) {
  const z = tpl[4];
  if (!z || !$("zones").checked) return;
  ctx.save();
  ctx.font = `600 ${Math.max(11, H / 30)}px system-ui,sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  z.forEach(([name, x, y, w, h]) => {
    const rx = x * W,
      ry = y * H,
      rw = w * W,
      rh = h * H;
    ctx.fillStyle = "rgba(255,45,111,.28)";
    ctx.fillRect(rx, ry, rw, rh);
    halo(rx, ry, rw, rh, lw, [lw * 4, lw * 3], "#ff2d6f");
    ctx.setLineDash([]);
    ctx.lineWidth = lw * 1.5;
    ctx.strokeStyle = "rgba(0,0,0,.6)";
    ctx.strokeText(name, rx + rw / 2, ry + rh / 2, rw - 4);
    ctx.fillStyle = "#fff";
    ctx.fillText(name, rx + rw / 2, ry + rh / 2, rw - 4);
  });
  ctx.restore();
}
$("zones").onchange = () => draw();

/* ---------- Video (MP4) support per template: key = "Platform/Template" ---------- */
const VIDEO = {
  "Facebook/Post": "MP4 (H.264). Square or vertical fits feeds best.",
  "Facebook/Story": "MP4, 1080×1920, 1–60 s per story.",
  "Instagram/Square post": "MP4 or MOV, 1080 px wide.",
  "Instagram/Portrait post": "MP4 or MOV, 1080 px wide.",
  "Instagram/Story / Reel": "MP4 or MOV, 1080×1920, stories up to 60 s.",
  "X / Twitter/Post image": "MP4, up to about 140 s and 512 MB.",
  "LinkedIn/Post": "MP4, 3 s to 30 min, up to 5 GB.",
  "Bluesky/Post image": "MP4, up to about 3 min and 100 MB.",
  "Epic / Fab/Gallery image": "Fab gallery video: 1920×1080 MP4, up to 300 MB.",
};
const hasMotion = () =>
  (tpl[3] || "no") !== "no" || !!VIDEO[`${plat}/${tpl[0]}`];

// Frame-by-frame H.264 encode (WebCodecs) packed into an MP4 (mp4-muxer). No audio.
$("dlmp4").onclick = async () => {
  const btn = $("dlmp4"),
    txt = btn.textContent,
    wasPlaying = playing,
    keep = T;
  if (!("VideoEncoder" in window)) {
    alert("MP4 export needs a browser with WebCodecs: Chrome, Edge or Safari.");
    return;
  }
  btn.disabled = true;
  setPlay(false);
  try {
    btn.textContent = "Loading encoder…";
    const { Muxer, ArrayBufferTarget } =
      await import("https://cdn.jsdelivr.net/npm/mp4-muxer@5.2.1/+esm");
    const FPS = 30,
      w = W + (W % 2),
      h = H + (H % 2); // H.264 needs even sizes
    const cfg = {
      codec: w * h > 2097152 ? "avc1.640033" : "avc1.640028",
      width: w,
      height: h,
      framerate: FPS,
      bitrate: Math.round(Math.min(25e6, Math.max(2e6, w * h * FPS * 0.1))),
    };
    if (!(await VideoEncoder.isConfigSupported(cfg)).supported)
      throw new Error(`H.264 at ${w}×${h} isn't supported by this browser`);
    const muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: { codec: "avc", width: w, height: h },
      fastStart: "in-memory",
    });
    let encErr = null;
    const enc = new VideoEncoder({
      output: (c, m) => muxer.addVideoChunk(c, m),
      error: (e) => {
        encErr = e;
      },
    });
    enc.configure(cfg);
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const oc = off.getContext("2d"),
      n = Math.max(1, Math.round(D * FPS));
    for (let i = 0; i < n && !encErr; i++) {
      T = i / FPS;
      draw(true);
      oc.fillStyle = exportBg();
      oc.fillRect(0, 0, w, h);
      oc.drawImage(cv, 0, 0);
      const frame = new VideoFrame(off, {
        timestamp: Math.round((i * 1e6) / FPS),
        duration: Math.round(1e6 / FPS),
      });
      enc.encode(frame, { keyFrame: i % 60 === 0 });
      frame.close();
      while (enc.encodeQueueSize > 8)
        await new Promise((r) => setTimeout(r, 5));
      btn.textContent = `Encoding ${i + 1}/${n}`;
      await new Promise((r) => setTimeout(r));
    }
    await enc.flush();
    if (encErr) throw encErr;
    muxer.finalize();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([muxer.target.buffer], { type: "video/mp4" }),
    );
    a.download = `${plat}-${tpl[0]}-${W}x${H}.mp4`.replace(/[\s\/]+/g, "-");
    a.click();
    URL.revokeObjectURL(a.href);
  } catch (err) {
    alert("Could not create the MP4: " + err.message);
  }
  T = keep;
  btn.textContent = txt;
  btn.disabled = false;
  showT();
  draw();
  if (wasPlaying) setPlay(true);
};

/* ---------- Background colour (preview + exports) ---------- */
// GIF and MP4 can't be transparent here, so they fall back to white when the background is off.
const exportBg = () => ($("bgOn").checked ? $("bg").value : "#ffffff");
function syncBg() {
  const on = $("bgOn").checked;
  $("bg").disabled = !on;
  $("bgHex").textContent = on ? $("bg").value.toUpperCase() : "transparent";
  $("bgNote").textContent = on ? "" : "GIF and MP4 use white when this is off";
  draw();
}
$("bgOn").onchange = syncBg;
$("bg").oninput = syncBg;

/* ---------- Text fonts, alignment, guide outlines ---------- */
const FONTS = [
  ["Sans", "system-ui,sans-serif"],
  ["Serif", "Georgia,serif"],
  ["Mono", "ui-monospace,Consolas,monospace"],
  ["Impact", "Impact,Haettenschweiler,sans-serif"],
  ["Rounded", "'Trebuchet MS',sans-serif"],
];
const fontOf = (l) =>
  `${l.bold === false ? 400 : 700} ${l.size}px ${l.font || FONTS[0][1]}`;
function addAlign() {
  const l = get(sel);
  if (!l) return;
  $("props").insertAdjacentHTML(
    "beforeend",
    `<label>Position</label><div class="row">
    <button class="btn small" id="al-c">Center</button><button class="btn small" id="al-h">Center across</button><button class="btn small" id="al-v">Center down</button></div>`,
  );
  $("al-c").onclick = () => {
    l.x = W / 2;
    l.y = H / 2;
    draw();
    status();
  };
  $("al-h").onclick = () => {
    l.x = W / 2;
    draw();
    status();
  };
  $("al-v").onclick = () => {
    l.y = H / 2;
    draw();
    status();
  };
}
// dark outer line + bright inner line, so it shows on both light and dark backgrounds
function halo(x, y, w, h, lw, dash, col) {
  ctx.save();
  ctx.setLineDash(dash);
  ctx.lineWidth = lw * 3.4;
  ctx.strokeStyle = "rgba(0,0,0,.7)";
  ctx.strokeRect(x, y, w, h);
  ctx.lineWidth = lw * 1.4;
  ctx.strokeStyle = col;
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}

/* ---------- Start ---------- */
pick(tpl);
ui();
syncBg();
