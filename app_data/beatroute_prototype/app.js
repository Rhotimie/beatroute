/** Router, event handling and sidebar index. */
const $ = id => document.getElementById(id);
let stack = [{ id: "login" }];

const TABS = [["home", "&#8962;", "Home"], ["beat", "&#9873;", "Beat", "schedule"], ["cust", "&#9786;", "Customers", "retailers"], ["team", "&#9734;", "Team"], ["more", "&#8943;", "More"]];

function render() {
  const cur = stack[stack.length - 1], s = S[cur.id];
  $("screen").innerHTML = s.render(cur.p);
  $("screen").scrollTop = 0;
  const tab = s.tab;
  $("tabbar").hidden = !tab;
  $("tabbar").innerHTML = TABS.map(([k, i, l, g]) => `<a class="${k === tab ? "on" : ""}" data-tab="${g || k}"><b>${i}</b>${l}</a>`).join("");
  $("crumb").textContent = `${s.area} / ${s.title}  (${stack.map(x => x.id).join(" > ")})`;
  document.querySelectorAll("#index a").forEach(a => a.classList.toggle("on", a.dataset.id === cur.id));
}

function nav(id, p) {
  if (S[id].modal) return openModal(id, p);
  stack.push({ id, p });
  render();
}
function jump(id, p) {
  closeModal();
  if (S[id].modal) { stack = [{ id: "productList", p: 1 }]; render(); return openModal(id, p); }
  stack = [{ id, p }];
  render();
}
function back() {
  if (stack.length > 1) stack.pop();
  render();
}
function openModal(id, p) {
  $("modal").innerHTML = `<div class="sheet">${S[id].render(p)}</div>`;
  $("modal").hidden = false;
}
function closeModal() { $("modal").hidden = true; }
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => (t.hidden = true), 1600);
}
function now() { return new Date().toTimeString().slice(0, 5); }

const ACTIONS = {
  dayIn: () => { D.state.dayIn = true; D.state.dayInTime = now(); toast("Day started"); },
  dayOut: () => { D.state.dayIn = false; toast("Day ended"); },
  checkIn: p => { D.state.checkedIn = p; toast("Checked in"); },
  checkOut: () => { D.state.checkedIn = null; toast("Checked out"); stack.pop(); },
  inc: p => { D.state.cart[p] = (D.state.cart[p] || 0) + 1; },
  dec: p => { D.state.cart[p] = Math.max(0, (D.state.cart[p] || 0) - 1); },
  placeOrder: () => { D.state.cart = {}; toast("Order placed"); stack.pop(); stack.pop(); },
  closeModal,
  seg: p => { const [k, v] = p.split(":"); (D.state.seg = D.state.seg || {})[k] = v; }
};

document.addEventListener("click", e => {
  const t = e.target.closest("[data-go],[data-back],[data-act],[data-toast],[data-modal],[data-tab],#index a");
  if (!t) return;
  if (t.matches("#index a")) return jump(t.dataset.id, t.dataset.p);
  if (t.dataset.tab) return jump(t.dataset.tab);
  if (t.dataset.modal) return openModal(t.dataset.modal);
  if (t.dataset.toast) return toast(t.dataset.toast);
  if (t.dataset.act) { ACTIONS[t.dataset.act](t.dataset.p); return t.dataset.act === "closeModal" ? null : render(); }
  if ("back" in t.dataset) return back();
  if (t.dataset.go) nav(t.dataset.go, t.dataset.p);
});

/** Close modal when tapping the dim backdrop. */
$("modal").addEventListener("click", e => { if (e.target === $("modal")) closeModal(); });

/** Sidebar index grouped by area, with filter. */
function buildIndex(q = "") {
  const groups = {};
  Object.values(S).filter(s => (s.area + s.title).toLowerCase().includes(q.toLowerCase()))
    .forEach(s => (groups[s.area] = groups[s.area] || []).push(s));
  $("index").innerHTML = Object.entries(groups).map(([a, list]) =>
    `<h3>${a} (${list.length})</h3>` + list.map(s => `<a data-id="${s.id}" ${s.modal ? 'data-p=""' : ""}>${s.title}</a>`).join("")).join("");
  render();
}
$("filter").addEventListener("input", e => buildIndex(e.target.value));

buildIndex();
