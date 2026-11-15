const listings = [
  { id: 1, mode: "buy", type: "apartment", bhk: 3, title: "3 BHK Apartment, Green Lotus Towers", city: "Mohali", area: "Sector 82, Mohali", price: 9200000, size: 1450, unit: "sq ft", bath: 3, floor: "7 of 14", facing: "East", rera: "PBRERA-SAS80-PR0912", age: "Ready to move", amen: ["Covered parking", "Power backup", "Gym", "Club house", "24×7 security"], added: 9 },
  { id: 2, mode: "buy", type: "floor", bhk: 2, title: "2 BHK Builder Floor", city: "Ludhiana", area: "Model Town, Ludhiana", price: 5800000, size: 1100, unit: "sq ft", bath: 2, floor: "1 of 3", facing: "North", rera: "", age: "5 years old", amen: ["Modular kitchen", "Car parking", "Park facing"], added: 7 },
  { id: 3, mode: "buy", type: "villa", bhk: 4, title: "4 BHK Independent Villa", city: "Zirakpur", area: "VIP Road, Zirakpur", price: 18500000, size: 2900, unit: "sq ft", bath: 4, floor: "G + 2", facing: "North-East", rera: "PBRERA-SAS81-PR1044", age: "New construction", amen: ["Private lawn", "Terrace", "2 car parking", "Servant room", "Solar water heater"], added: 10 },
  { id: 4, mode: "rent", type: "apartment", bhk: 1, title: "1 BHK Furnished Studio", city: "Phagwara", area: "Near LPU, Phagwara", price: 12000, size: 520, unit: "sq ft", bath: 1, floor: "3 of 5", facing: "West", rera: "", age: "Furnished", amen: ["Wi-Fi", "AC", "Bed & wardrobe", "Power backup"], added: 8 },
  { id: 5, mode: "buy", type: "plot", bhk: 0, title: "Residential Plot, 200 sq yd", city: "Jalandhar", area: "Urban Estate Phase 2, Jalandhar", price: 6400000, size: 200, unit: "sq yd", bath: 0, floor: "—", facing: "South", rera: "PBRERA-JAL01-PR0417", age: "Freehold", amen: ["Gated colony", "Corner plot", "30 ft road"], added: 5 },
  { id: 6, mode: "rent", type: "apartment", bhk: 2, title: "2 BHK Apartment, Skyline Residency", city: "Mohali", area: "Sector 70, Mohali", price: 22000, size: 1050, unit: "sq ft", bath: 2, floor: "4 of 10", facing: "East", rera: "PBRERA-SAS80-PR0388", age: "Semi-furnished", amen: ["Lift", "Covered parking", "Children's play area"], added: 6 },
  { id: 7, mode: "buy", type: "villa", bhk: 3, title: "3 BHK Independent House", city: "Yamunanagar", area: "Model Colony, Yamunanagar", price: 7800000, size: 1800, unit: "sq ft", bath: 3, floor: "G + 1", facing: "East", rera: "", age: "8 years old", amen: ["Courtyard", "Car porch", "Borewell"], added: 4 },
  { id: 8, mode: "buy", type: "apartment", bhk: 4, title: "4 BHK Penthouse, The Crest", city: "Panchkula", area: "Sector 20, Panchkula", price: 24000000, size: 3400, unit: "sq ft", bath: 5, floor: "15 of 15", facing: "North", rera: "HRERA-PKL-PKL-412-2024", age: "Under construction · Dec 2027", amen: ["Private terrace", "Jacuzzi", "3 car parking", "Club house", "Pool"], added: 3 },
  { id: 9, mode: "rent", type: "floor", bhk: 3, title: "3 BHK Builder Floor", city: "Ludhiana", area: "Sarabha Nagar, Ludhiana", price: 32000, size: 1600, unit: "sq ft", bath: 3, floor: "2 of 3", facing: "North", rera: "", age: "Unfurnished", amen: ["Lift", "Stilt parking", "Near market"], added: 2 },
  { id: 10, mode: "rent", type: "villa", bhk: 4, title: "4 BHK Kothi with Lawn", city: "Chandigarh", area: "Sector 8, Chandigarh", price: 95000, size: 3200, unit: "sq ft", bath: 4, floor: "G + 1", facing: "South", rera: "", age: "Semi-furnished", amen: ["Front lawn", "Servant quarter", "3 car parking"], added: 1 }
];

const state = { mode: "buy", q: "", type: "", bhk: "", fav: false, rera: false, sort: "new" };
let saved = new Set();
try { saved = new Set(JSON.parse(localStorage.getItem("aangan-saved") || "[]")); } catch (e) {}
function persist() { try { localStorage.setItem("aangan-saved", JSON.stringify([...saved])); } catch (e) {} }

const inr = n => n.toLocaleString("en-IN");
function fmtPrice(l) {
  if (l.mode === "rent") return `₹${inr(l.price)} <small>/ month</small>`;
  if (l.price >= 1e7) return `₹${+(l.price / 1e7).toFixed(2)} Cr`;
  return `₹${+(l.price / 1e5).toFixed(1)} L`;
}
const typeName = { apartment: "Apartment", floor: "Builder floor", villa: "Villa / House", plot: "Plot" };

/* Small drawn illustration per property type */
function illus(l) {
  const sky = `<rect class="ill-sky" width="320" height="200"/><rect class="ill-g" y="168" width="320" height="32"/>`;
  let s = "";
  if (l.type === "apartment") {
    const floors = l.bhk >= 4 ? 9 : 7, top = 168 - floors * 16;
    s += `<rect class="ill-b2" x="200" y="${top + 30}" width="70" height="${168 - top - 30}"/>`;
    s += `<rect class="ill-b" x="90" y="${top}" width="110" height="${168 - top}"/>`;
    for (let f = 0; f < floors; f++) for (let c = 0; c < 4; c++) s += `<rect class="ill-w" x="${100 + c * 25}" y="${top + 6 + f * 16}" width="14" height="9" opacity="${(f + c + l.id) % 3 ? 1 : .35}"/>`;
    if (l.bhk >= 4) s += `<rect class="ill-a" x="86" y="${top - 6}" width="118" height="6"/>`;
  } else if (l.type === "floor") {
    s += `<rect class="ill-b" x="80" y="78" width="160" height="90"/><rect class="ill-b2" x="74" y="72" width="172" height="8"/>`;
    for (let f = 0; f < 3; f++) { for (let c = 0; c < 4; c++) s += `<rect class="ill-w" x="${96 + c * 36}" y="${88 + f * 26}" width="20" height="14"/>`; s += `<rect class="ill-b2" x="80" y="${105 + f * 26}" width="160" height="3"/>`; }
  } else if (l.type === "villa") {
    s += `<rect class="ill-b" x="70" y="100" width="180" height="68"/><path class="ill-b2" d="M58 104 160 48l102 56z"/>`;
    s += `<rect class="ill-a" x="146" y="128" width="28" height="40"/><rect class="ill-w" x="90" y="118" width="34" height="22"/><rect class="ill-w" x="196" y="118" width="34" height="22"/>`;
    s += `<circle class="ill-b2" cx="40" cy="150" r="20"/><rect class="ill-b" x="38" y="150" width="4" height="18"/><circle class="ill-b2" cx="285" cy="146" r="22"/><rect class="ill-b" x="283" y="146" width="4" height="22"/>`;
  } else {
    s += `<path class="ill-g" d="M40 150 280 150 300 186 20 186z" opacity=".7"/><path class="ill-l" d="M60 140h200l20 36H40z"/>`;
    [[60,140],[260,140],[280,176],[40,176]].forEach(([x,y]) => s += `<rect class="ill-a" x="${x-3}" y="${y-10}" width="6" height="12"/>`);
    s += `<circle class="ill-b2" cx="250" cy="80" r="14"/>`;
  }
  return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${sky}${s}</svg>`;
}

function filtered() {
  const q = state.q.trim().toLowerCase();
  let out = listings.filter(l =>
    l.mode === state.mode &&
    (!q || (l.title + " " + l.area + " " + l.city).toLowerCase().includes(q)) &&
    (!state.type || l.type === state.type) &&
    (!state.bhk || (state.bhk === "4" ? l.bhk >= 4 : l.bhk === +state.bhk)) &&
    (!state.fav || saved.has(l.id)) &&
    (!state.rera || l.rera));
  const by = { new: (a, b) => b.added - a.added, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, area: (a, b) => (b.unit === "sq yd" ? b.size * 9 : b.size) - (a.unit === "sq yd" ? a.size * 9 : a.size) };
  return out.sort(by[state.sort]);
}

const heart = `<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.5-9.2C1 8.3 3.2 4.5 6.9 4.5c2.1 0 3.6 1.1 5.1 2.9 1.5-1.8 3-2.9 5.1-2.9 3.7 0 5.9 3.8 4.4 7.3C19.5 16.4 12 21 12 21z"/></svg>`;

function render() {
  const items = filtered();
  document.getElementById("listTitle").textContent = state.mode === "buy" ? "Homes for sale" : "Homes for rent";
  document.getElementById("count").textContent = `${items.length} ${items.length === 1 ? "property" : "properties"} found`;
  const grid = document.getElementById("grid");
  if (!items.length) {
    grid.innerHTML = `<div class="empty"><h3>No homes match these filters</h3><p>Try a nearby city, a different BHK, or clear the Saved and RERA filters.</p></div>`;
    return;
  }
  grid.innerHTML = items.map(l => `
    <article class="card">
      <div class="thumb">${illus(l)}
        <span class="tag ${l.mode}">${l.mode === "buy" ? "For sale" : "For rent"}</span>
        <button class="fav" data-fav="${l.id}" aria-pressed="${saved.has(l.id)}" aria-label="Save ${l.title}">${heart}</button>
      </div>
      <div class="body">
        <div class="price">${fmtPrice(l)}</div>
        <h3>${l.title}</h3>
        <div class="loc">📍 ${l.area}</div>
        <div class="specs">
          ${l.bhk ? `<span><b>${l.bhk}</b> BHK</span><span><b>${l.bath}</b> Bath</span>` : `<span><b>${typeName[l.type]}</b></span>`}
          <span><b>${inr(l.size)}</b> ${l.unit}</span>
          <span>${l.age}</span>
        </div>
        ${l.rera ? `<div class="rera">✓ RERA ${l.rera}</div>` : ""}
        <div class="actions">
          <button class="btn ghost" data-open="${l.id}">View details</button>
          <button class="btn" data-enquire="${l.id}">Enquire</button>
        </div>
      </div>
    </article>`).join("");
}

/* Modal with EMI calculator */
const overlay = document.getElementById("overlay"), modal = document.getElementById("modal");
let lastFocus = null;
function openModal(id) {
  const l = listings.find(x => x.id === id);
  lastFocus = document.activeElement;
  const emiBlock = l.mode === "buy" ? `
    <div class="emi">
      <h3>Home loan EMI estimate</h3>
      <div class="row">
        <div class="field"><label for="emiLoan">Loan amount (₹)</label><input id="emiLoan" type="number" min="0" step="50000" value="${Math.round(l.price * 0.8)}"></div>
        <div class="field"><label for="emiRate">Interest rate (% p.a.)</label><input id="emiRate" type="number" min="1" max="20" step="0.05" value="8.5"></div>
        <div class="field"><label for="emiYears">Tenure (years)</label><input id="emiYears" type="number" min="1" max="30" value="20"></div>
      </div>
      <div><output id="emiOut"></output> <span class="note">per month</span></div>
      <div class="note" id="emiNote"></div>
    </div>` : `
    <div class="emi"><h3>Move-in cost</h3><div><output>₹${inr(l.price * 3)}</output> <span class="note">approx. (2 months deposit + 1 month rent)</span></div></div>`;
  modal.innerHTML = `
    <button class="close" id="closeModal" aria-label="Close">✕</button>
    <div class="thumb">${illus(l)}<span class="tag ${l.mode}">${l.mode === "buy" ? "For sale" : "For rent"}</span></div>
    <div class="inner">
      <div>
        <div class="price">${fmtPrice(l)}</div>
        <h2 id="mTitle">${l.title}</h2>
        <div class="loc">📍 ${l.area}</div>
      </div>
      <dl class="facts">
        <div><dt>Type</dt><dd>${typeName[l.type]}</dd></div>
        <div><dt>${l.unit === "sq yd" ? "Plot area" : "Carpet area"}</dt><dd>${inr(l.size)} ${l.unit}</dd></div>
        <div><dt>Floor</dt><dd>${l.floor}</dd></div>
        <div><dt>Facing</dt><dd>${l.facing}</dd></div>
        <div><dt>Bedrooms</dt><dd>${l.bhk || "—"}</dd></div>
        <div><dt>Bathrooms</dt><dd>${l.bath || "—"}</dd></div>
        <div><dt>Status</dt><dd>${l.age}</dd></div>
        <div><dt>${l.mode === "buy" ? "Price / sq ft" : "Rent / sq ft"}</dt><dd>₹${inr(Math.round(l.price / (l.unit === "sq yd" ? l.size * 9 : l.size)))}</dd></div>
      </dl>
      ${l.rera ? `<div class="rera">✓ RERA registration ${l.rera}</div>` : ""}
      <div class="amen">${l.amen.map(a => `<span>${a}</span>`).join("")}</div>
      ${emiBlock}
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn" data-enquire="${l.id}">Book a site visit</button>
        <button class="btn ghost" data-fav="${l.id}" aria-pressed="${saved.has(l.id)}">${saved.has(l.id) ? "♥ Saved" : "♡ Save"}</button>
      </div>
    </div>`;
  overlay.hidden = false;
  document.body.style.overflow = "hidden";
  if (l.mode === "buy") { ["emiLoan", "emiRate", "emiYears"].forEach(i => document.getElementById(i).addEventListener("input", calcEmi)); calcEmi(); }
  document.getElementById("closeModal").focus();
}
function closeModal() { overlay.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }

function calcEmi() {
  const P = +document.getElementById("emiLoan").value || 0;
  const r = (+document.getElementById("emiRate").value || 0) / 12 / 100;
  const n = (+document.getElementById("emiYears").value || 0) * 12;
  let emi = 0;
  if (P > 0 && n > 0) emi = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  document.getElementById("emiOut").textContent = "₹" + inr(Math.round(emi));
  document.getElementById("emiNote").textContent = n ? `Total interest ₹${inr(Math.round(emi * n - P))} over ${n / 12} years. Indicative only; your bank's rate may differ.` : "";
}

/* Toast */
let toastTimer;
function toast(msg) { const t = document.getElementById("toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => t.hidden = true, 2800); }

/* Events */
function setMode(m) {
  state.mode = m;
  document.querySelectorAll(".seg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.mode === m));
  render();
}
document.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => setMode(b.dataset.mode)));
document.getElementById("searchForm").addEventListener("submit", e => {
  e.preventDefault();
  state.q = document.getElementById("q").value;
  state.type = document.getElementById("type").value;
  state.bhk = document.getElementById("bhk").value;
  render();
  document.getElementById("listings").scrollIntoView({ behavior: "smooth" });
});
["type", "bhk"].forEach(id => document.getElementById(id).addEventListener("change", e => { state[id] = e.target.value; render(); }));
document.getElementById("q").addEventListener("input", e => { state.q = e.target.value; render(); });
document.getElementById("sort").addEventListener("change", e => { state.sort = e.target.value; render(); });
["favOnly", "reraOnly"].forEach(id => document.getElementById(id).addEventListener("click", e => {
  const key = id === "favOnly" ? "fav" : "rera";
  state[key] = !state[key];
  e.currentTarget.setAttribute("aria-pressed", state[key]);
  render();
}));

document.addEventListener("click", e => {
  const fav = e.target.closest("[data-fav]"), open = e.target.closest("[data-open]"), enq = e.target.closest("[data-enquire]");
  if (fav) {
    const id = +fav.dataset.fav;
    saved.has(id) ? saved.delete(id) : saved.add(id);
    persist(); render();
    if (!overlay.hidden) openModal(id);
    toast(saved.has(id) ? "Saved to your shortlist" : "Removed from your shortlist");
  } else if (open) openModal(+open.dataset.open);
  else if (enq) {
    const l = listings.find(x => x.id === +enq.dataset.enquire);
    if (!overlay.hidden) closeModal();
    document.getElementById("ecity").value = l.city;
    document.getElementById("emsg").value = `I'm interested in: ${l.title}, ${l.area}`;
    document.getElementById("enquire").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => document.getElementById("ename").focus({ preventScroll: true }), 400);
  } else if (e.target === overlay) closeModal();
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && !overlay.hidden) closeModal(); });

document.getElementById("enqForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("ename").value.trim();
  const phone = document.getElementById("ephone").value.replace(/\D/g, "");
  if (!name) { toast("Enter your name so the advisor knows who to ask for."); return; }
  if (phone.length !== 10) { toast("Enter a 10-digit mobile number."); return; }
  toast(`Thanks, ${name.split(" ")[0]}. Enquiry noted (demo form, nothing is sent).`);
  e.target.reset();
});

render();
