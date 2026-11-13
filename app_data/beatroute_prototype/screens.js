/** Screen registry and UI helpers. Each screen renders an HTML string. */
const S = {};
const def = (id, area, title, render, opt = {}) => (S[id] = { id, area, title, render, ...opt });

const bar = (t, back = true) =>
  `<div class="bar">${back ? '<span class="back" data-back>&#8249;</span>' : ""}<h2>${t}</h2></div>`;
const go = (id, p) => `data-go="${id}"${p !== undefined ? ` data-p="${p}"` : ""}`;
const row = (t, sub, r, g, p, ico) =>
  `<div class="row" ${g ? go(g, p) : ""}>${ico ? `<div class="ico">${ico}</div>` : ""}<div class="t"><b>${t}</b>${sub ? `<small>${sub}</small>` : ""}</div>${r ? `<div class="r">${r}</div>` : ""}</div>`;
const chip = (t, kind = "") => `<span class="chip ${kind}">${t}</span>`;
const kind = s => ({ Approved: "ok", Active: "ok", Pending: "warn", Prospect: "warn", Rejected: "bad", Dormant: "bad" })[s] || "";
const btn = (t, g, p, cls = "") => `<div class="btn ${cls}" ${go(g, p)}>${t}</div>`;
const act = (t, a, p = "", cls = "") => `<div class="btn ${cls}" data-act="${a}" data-p="${p}">${t}</div>`;
const tbtn = (t, msg, cls = "") => `<div class="btn ${cls}" data-toast="${msg}">${t}</div>`;
const kv = (k, v) => `<div class="kv"><span>${k}</span><span>${v}</span></div>`;
const card = (h, body) => `<div class="card">${h ? `<h4>${h}</h4>` : ""}${body}</div>`;
const photo = t => `<div class="photo">${t}</div>`;
const R = id => D.retailers.find(r => r.id == id) || D.retailers[0];
const seg = (key, opts) => {
  const cur = (D.state.seg || {})[key] || opts[0];
  return `<div class="seg">${opts.map(o => `<a class="${o === cur ? "on" : ""}" data-act="seg" data-p="${key}:${o}">${o}</a>`).join("")}</div>`;
};
const segVal = (key, opts) => (D.state.seg || {})[key] || opts[0];
const field = (label, type = "text", val = "") =>
  type === "select"
    ? `<label class="f">${label}<select>${val.map(o => `<option>${o}</option>`).join("")}</select></label>`
    : type === "area"
    ? `<label class="f">${label}<textarea rows="3">${val}</textarea></label>`
    : `<label class="f">${label}<input type="${type}" value="${val}"></label>`;
const retailerRows = (g = "retailer") =>
  D.retailers.map(r => row(r.name, `${r.type} - ${r.city}`, chip(r.stage, kind(r.stage)), g, r.id, r.name[0])).join("");

/** Simple list screen: title, optional header html, rows html. */
const listScreen = (id, area, title, body, opt) => def(id, area, title, p => bar(title) + body(p), opt);

/* ---------- Sign-in ---------- */
def("login", "Sign-in", "Enter username", () =>
  bar("Sign in", false) + `<div class="pad"><div class="photo" style="height:90px">Logo</div><br>${field("Username", "text", "sam.rivera")}${btn("Continue", "password")}${btn("Activate new account", "activate", "", "alt")}</div>`, { start: true });
def("password", "Sign-in", "Enter password", () =>
  bar("Password") + `<div class="pad">${field("Password", "password", "password")}${btn("Sign in", "otp")}${tbtn("Use fingerprint", "Biometric prompt (mock)", "alt")}</div>`);
def("otp", "Sign-in", "OTP verification", () =>
  bar("Verify code") + `<div class="pad"><p>A 6-digit code was sent to ***-0142.</p>${field("Code", "text", "482915")}${btn("Verify", "home")}${tbtn("Resend code", "Code resent", "alt")}</div>`);
def("activate", "Sign-in", "User activation", () =>
  bar("Activate account") + `<div class="pad">${field("Company code", "text", "ACME01")}${field("Mobile number", "tel", "555-0142")}${field("Set password", "password", "password")}${btn("Activate", "otp")}</div>`);

/* ---------- Home ---------- */
def("home", "Home", "Home", () => {
  const s = D.state;
  return bar(`Hi, ${D.user.name}`, false) + `<div class="pad">
    ${card("Today", `<div class="kv"><span>Day status</span><span>${s.dayIn ? chip("Day in " + s.dayInTime, "ok") : chip("Not started", "warn")}</span></div>
      ${kv("Planned visits", "4")}${kv("Completed", "1")}${kv("Orders today", "2")}
      ${btn(s.dayIn ? "View attendance" : "Start day", "attendance")}`)}
    <div class="grid">
      <div class="tile" ${go("schedule")}><b>4</b><small>Beat plan</small></div>
      <div class="tile" ${go("retailers")}><b>${D.retailers.length}</b><small>Customers</small></div>
      <div class="tile" ${go("pendingOrders")}><b>2</b><small>Approvals</small></div>
      <div class="tile" ${go("campaigns")}><b>2</b><small>Campaigns</small></div>
      <div class="tile" ${go("team")}><b>${D.team.length}</b><small>Team</small></div>
      <div class="tile" ${go("learn")}><b>5</b><small>Learning</small></div>
    </div>
    ${card("Sales this week", `<div class="bars">${[40, 62, 35, 78, 55, 90, 20].map(h => `<i style="height:${h}%"></i>`).join("")}</div>`)}
  </div>`;
}, { tab: "home" });
def("more", "Home", "More menu", () =>
  bar("More", false) + [
    ["Attendance", "attendance"], ["Distributors", "distributors"], ["Schemes", "promoList"], ["Campaigns", "campaigns"],
    ["Approvals", "pendingOrders"], ["Expenses", "expenses"], ["Inventory", "inventory"], ["Assets", "assets"],
    ["Learning", "learn"], ["Rewards", "points"], ["Outstanding payments", "outstanding"], ["Draft orders", "drafts"]
  ].map(([t, g]) => row(t, "", "&#8250;", g)).join(""), { tab: "more" });

/* ---------- Attendance ---------- */
def("attendance", "Attendance", "Mark attendance", () => {
  const s = D.state;
  return bar("Attendance") + `<div class="pad">${card("", `<div style="text-align:center"><div style="font-size:34px;font-weight:700">${s.dayIn ? s.dayInTime : "--:--"}</div><p>${s.dayIn ? "You are checked in" : "You have not started your day"}</p>
    ${photo("Selfie preview")}${kv("Location", "Springfield HQ (12 m accuracy)")}</div>`)}
    ${s.dayIn ? act("Day out", "dayOut", "", "bad") : act("Day in", "dayIn")}${btn("Day details", "dayDetail", "", "alt")}${btn("Apply for leave", "applyLeave", "", "alt")}</div>`;
});
listScreen("dayDetail", "Attendance", "Day in / out detail", () =>
  `<div class="pad">${card("Today", kv("Day in", D.state.dayInTime || "--") + kv("Day out", "--") + kv("Distance covered", "18.4 km") + kv("Visits", "4 planned / 1 done"))}${card("Timeline", row("Day in", "Springfield HQ", "09:02") + row("Check-in Corner Mart", "", "09:40") + row("Check-out Corner Mart", "", "10:05"))}</div>`);
listScreen("applyLeave", "Attendance", "Apply leave", () =>
  `<div class="pad">${field("Leave type", "select", ["Casual", "Sick", "Earned"])}${field("From", "date", "2026-12-28")}${field("To", "date", "2026-12-29")}${field("Reason", "area", "Family event")}${tbtn("Submit", "Leave request submitted")}${btn("Leave history", "leaveHistory", "", "alt")}</div>`);
listScreen("leaveHistory", "Attendance", "Leave history", () =>
  D.leaves.map(l => row(l.type + " leave", l.dates, chip(l.status, kind(l.status)))).join(""));

/* ---------- Beat plan ---------- */
def("schedule", "Beat plan", "Today's beat plan", () =>
  bar("Beat plan", false) + seg("sched", ["Today", "Tomorrow", "Week"]) +
  D.retailers.slice(0, segVal("sched", ["Today", "Tomorrow", "Week"]) === "Week" ? 6 : 4).map((r, i) =>
    row(r.name, `${10 + i}:00 - ${r.city}`, chip(i === 0 ? "Done" : "Planned", i === 0 ? "ok" : ""), "visit", r.id, i + 1)).join("") +
  `<div class="pad">${btn("View on map", "map")}${btn("Create new plan", "createPlan", "", "alt")}</div>`, { tab: "beat" });
listScreen("createPlan", "Beat plan", "Create plan", () =>
  `<div class="pad">${field("Plan name", "text", "Friday North Loop")}${field("Date", "date", "2026-11-14")}${field("Distributor", "select", D.distributors.map(d => d.name))}${btn("Choose route", "routeSelect")}</div>`);
listScreen("routeSelect", "Beat plan", "Route selection", () =>
  ["North Loop", "Riverside Run", "Lakeside Circuit"].map((n, i) => row(n, `${5 + i * 2} retailers - ${12 + i * 7} km`, "&#8250;", "recRoute", "", i + 1)).join(""));
listScreen("recRoute", "Beat plan", "Recommended route", () =>
  `<div class="pad">${card("Suggested order", D.retailers.slice(0, 4).map((r, i) => row(r.name, `${r.dist} km`, `ETA ${9 + i}:${i}0`, "retailer", r.id, i + 1)).join(""))}${kv("Total distance", "16 km")}${kv("Estimated time", "3h 20m")}${tbtn("Use this route", "Route applied")}</div>`);
def("map", "Beat plan", "Map", () =>
  bar("Map") + `<div class="pad"><div class="map"><svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M0 40 L100 55 M30 0 L45 100 M0 85 L100 20" stroke="#fff" stroke-width="3" fill="none"/></svg>
  ${D.retailers.map(r => `<div class="pin" style="left:${r.x}%;top:${r.y}%" ${go("visit", r.id)}><i>${r.id}</i></div>`).join("")}</div><p class="hint">Tap a pin to open the visit.</p>${retailerRows("visit")}</div>`);

/* ---------- Customers ---------- */
def("retailers", "Customers", "Customer list", () =>
  bar("Customers", false) + `<div class="pad" style="padding-bottom:0">${field("Search", "text", "")}</div>` + retailerRows() +
  `<div class="pad">${btn("Add customer", "retailerCreate")}${btn("Onboarding", "onboarding", "", "alt")}</div>`, { tab: "cust" });
def("retailer", "Customers", "Customer detail", p => {
  const r = R(p), t = segVal("rtab", ["Info", "Orders", "Stock"]);
  const body = t === "Info"
    ? card("", kv("Contact", r.contact) + kv("Phone", r.phone) + kv("City", r.city) + kv("Type", r.type) + kv("Last visit", r.last) + kv("Outstanding", D.money(r.due)))
    : t === "Orders" ? D.orders.slice(0, 3).map(o => row(o.id, o.date, D.money(o.total))).join("")
    : D.products.slice(0, 4).map(x => row(x.name, "", Math.round(x.stock / 4) + " units")).join("");
  return bar(r.name) + seg("rtab", ["Info", "Orders", "Stock"]) + `<div class="pad">${body}${btn("Start visit", "visit", r.id)}${btn("Edit", "retailerEdit", r.id, "alt")}${btn("Adjust geo-tag", "geoTag", r.id, "alt")}</div>`;
});
listScreen("retailerCreate", "Customers", "Create customer", () =>
  `<div class="pad">${field("Name")}${field("Contact person")}${field("Mobile", "tel")}${field("Type", "select", ["Grocery", "Supermarket", "Wholesale"])}${field("Address", "area")}${tbtn("Save", "Customer saved")}</div>`);
listScreen("retailerEdit", "Customers", "Edit customer", p => {
  const r = R(p);
  return `<div class="pad">${field("Name", "text", r.name)}${field("Contact person", "text", r.contact)}${field("Mobile", "tel", r.phone)}${field("City", "text", r.city)}${tbtn("Save changes", "Changes saved")}</div>`;
});
listScreen("onboarding", "Customers", "Customer onboarding", () =>
  `<div class="pad">${["Basic details", "Address and geo-tag", "Documents", "Review"].map((s, i) => row(s, i < 2 ? "Complete" : "To do", i < 2 ? chip("Done", "ok") : "", "", "", i + 1)).join("")}${btn("Continue", "retailerCreate")}</div>`);
listScreen("geoTag", "Customers", "Geo-tag adjustment", p => {
  const r = R(p);
  return `<div class="pad"><div class="map"><div class="pin" style="left:50%;top:45%"><i>&#9679;</i></div></div>${kv("Stored", "40.7128, -74.0060")}${kv("Current", "40.7131, -74.0057")}${tbtn("Update location", "Geo-tag updated")}</div>`;
});

/* ---------- Distributors ---------- */
def("distributors", "Distributors", "Distributor list", () =>
  bar("Distributors") + D.distributors.map(d => row(d.name, d.city, d.orders + " orders", "distributor", d.id, d.name[0])).join(""));
def("distributor", "Distributors", "Distributor detail", p => {
  const d = D.distributors.find(x => x.id == p) || D.distributors[0];
  return bar(d.name) + `<div class="pad">${card("", kv("City", d.city) + kv("Open orders", d.orders) + kv("Credit limit", D.money(d.credit)))}${btn("Take stock", "takeStockDist")}${btn("Place order", "productList", 1, "alt")}</div>`;
});
listScreen("takeStockDist", "Distributors", "Distributor stock", () =>
  D.products.map(x => row(x.name, x.cat, `<div class="stepper"><button>-</button>${x.stock}<button>+</button></div>`)).join("") + `<div class="pad">${tbtn("Save stock", "Stock saved")}</div>`);

/* ---------- Visit ---------- */
def("visit", "Visit", "Visit hub / check-in", p => {
  const r = R(p), s = D.state, here = s.checkedIn == r.id;
  const grid = [["Take order", "productList"], ["Take stock", "stockList"], ["Payment", "payment"], ["Return", "returns"], ["Feedback", "feedback"], ["Sales log", "salesLog"]];
  return bar(r.name) + `<div class="pad">${card("", kv("Address", r.city) + kv("Distance", r.dist + " km") + kv("Status", here ? chip("Checked in", "ok") : chip("Not checked in", "warn")))}
  ${here ? `<div class="grid">${grid.map(([t, g]) => `<div class="tile" ${go(g, r.id)}>${t}</div>`).join("")}</div>${btn("Visit notes", "notes", r.id, "alt")}${act("Check out", "checkOut", "", "bad")}`
         : `${photo("Optional check-in photo")}${act("Check in here", "checkIn", r.id)}`}</div>`;
});
listScreen("notes", "Visit", "Visit note history", p =>
  `<div class="pad">${field("New note", "area")}${tbtn("Save note", "Note saved")}</div>` +
  ["Owner asked for new price list", "Shelf space reduced for drinks", "Payment promised by Friday"].map((n, i) => row(n, `${i + 1} week${i ? "s" : ""} ago`)).join(""));
def("productList", "Order", "Take order - products", p => {
  const c = D.state.cart, total = Object.entries(c).reduce((a, [id, q]) => a + q * D.products.find(x => x.id == id).price, 0);
  const items = D.products.map(x => `<div class="row"><div class="t"><b>${x.name}</b><small>${D.money(x.price)} - ${x.stock ? x.stock + " in stock" : "Out of stock"}</small></div>
    <div class="stepper"><button data-act="dec" data-p="${x.id}">-</button>${c[x.id] || 0}<button data-act="inc" data-p="${x.id}">+</button></div></div>`).join("");
  return bar("Order - " + R(p).name) + `<div class="pad" style="padding-bottom:0"><div class="btn alt sm" data-modal="scheme">Schemes</div> <div class="btn alt sm" ${go("drafts")}>Drafts (${D.state.draftCount})</div></div>${items}
    <div class="pad">${card("", kv("Items", Object.values(c).reduce((a, b) => a + b, 0)) + kv("Total", D.money(total)))}${btn("Review order", "orderSummary", p)}</div>`;
});
def("orderSummary", "Order", "Order summary", p => {
  const c = D.state.cart, lines = Object.entries(c).map(([id, q]) => { const x = D.products.find(y => y.id == id); return row(x.name, `${q} x ${D.money(x.price)}`, D.money(q * x.price)); }).join("");
  const total = Object.entries(c).reduce((a, [id, q]) => a + q * D.products.find(x => x.id == id).price, 0);
  return bar("Order summary") + (lines || `<div class="empty">Cart is empty. Go back and add products.</div>`) +
    `<div class="pad">${card("", kv("Subtotal", D.money(total)) + kv("Discount", "-" + D.money(total * 0.05)) + kv("Total", D.money(total * 0.95)))}${field("Remarks", "area")}${photo("Signature")}${act("Place order", "placeOrder", p)}${tbtn("Save as draft", "Draft saved", "alt")}</div>`;
});
listScreen("drafts", "Order", "Draft orders", () =>
  ["Corner Mart", "Daily Fresh"].map((n, i) => row(n, "Saved " + (i + 1) + "h ago", D.money(60 + i * 40), "productList", i + 1)).join(""));
def("scheme", "Schemes", "Scheme dialog (modal)", () =>
  `<h3 style="margin-top:0">Available schemes</h3>${D.schemes.map(s => row(s.name, s.rule, "Ends " + s.ends)).join("")}${act("Close", "closeModal", "", "alt")}`, { modal: true });
listScreen("promoList", "Schemes", "Promotional products", () =>
  D.schemes.map(s => row(s.name, s.rule, "Ends " + s.ends, "productList", 1)).join(""));

/* ---------- Stock ---------- */
listScreen("stockList", "Stock", "Take stock - products", p =>
  D.products.map(x => row(x.name, x.cat, `<div class="stepper"><button>-</button>${Math.round(x.stock / 5)}<button>+</button></div>`)).join("") + `<div class="pad">${btn("Confirm stock", "stockConfirm", p)}</div>`);
listScreen("stockConfirm", "Stock", "Stock confirm", p =>
  `<div class="pad">${card("", kv("Retailer", R(p).name) + kv("Products counted", D.products.length) + kv("Low stock items", 2))}${photo("Shelf photo")}${btn("Submit", "stockSummary", p)}</div>`);
listScreen("stockSummary", "Stock", "Stock summary", p =>
  D.products.map(x => row(x.name, "", Math.round(x.stock / 5) + " units", "", "", "")).join("") + `<div class="pad">${btn("Back to visit", "visit", p, "alt")}</div>`);

/* ---------- Payment ---------- */
listScreen("payment", "Payment", "Process payment", p =>
  `<div class="pad">${card("", kv("Outstanding", D.money(R(p).due)))}${field("Mode", "select", ["Cash", "Cheque", "Bank transfer"])}${field("Amount", "number", R(p).due)}${field("Reference")}${photo("Receipt photo")}${tbtn("Collect payment", "Payment recorded")}${btn("Payment details", "paymentDetail", "", "alt")}</div>`);
listScreen("outstanding", "Payment", "Outstanding payments", () =>
  D.retailers.filter(r => r.due).map(r => row(r.name, "Overdue " + (r.id * 3) + " days", D.money(r.due), "payment", r.id)).join(""));
listScreen("paymentDetail", "Payment", "Payment detail", () =>
  `<div class="pad">${card("", kv("Receipt", "PY-7731") + kv("Mode", "Cash") + kv("Amount", D.money(500)) + kv("Date", "Today 10:12") + kv("Status", chip("Posted", "ok")))}</div>`);
listScreen("returns", "Visit", "Process return", () =>
  `<div class="pad">${field("Product", "select", D.products.map(p => p.name))}${field("Quantity", "number", "2")}${field("Reason", "select", ["Damaged", "Expired", "Wrong item"])}${photo("Damage photo")}${tbtn("Submit return", "Return submitted")}</div>`);
listScreen("feedback", "Visit", "Submit feedback", () =>
  `<div class="pad">${field("Rating", "select", ["5 - Excellent", "4", "3", "2", "1"])}${field("Comments", "area")}${tbtn("Send", "Feedback sent")}</div>`);
listScreen("salesLog", "Visit", "Log sales", () =>
  D.products.slice(0, 4).map(x => row(x.name, "Sold this week", `<div class="stepper"><button>-</button>${x.id * 3}<button>+</button></div>`)).join("") + `<div class="pad">${tbtn("Save log", "Sales logged")}</div>`);

/* ---------- Campaigns ---------- */
def("campaigns", "Campaigns", "Campaigns", () =>
  bar("Campaigns") + seg("camp", ["Running", "Drafts"]) +
  (segVal("camp", ["Running", "Drafts"]) === "Running"
    ? D.campaigns.map(c => row(c.name, c.due, `${c.done}/${c.total}`, "survey", c.id)).join("")
    : row("Summer Promo Audit", "Draft saved yesterday", "", "survey", 1) + row("Cooler Check", "Draft saved 3d ago", "", "survey", 2)));
listScreen("survey", "Campaigns", "Survey form", () =>
  `<div class="pad">${field("Is the display visible?", "select", ["Yes", "Partly", "No"])}${field("Facings count", "number", "4")}${field("Competitor present?", "select", ["No", "Yes"])}${photo("Add photo")}${field("Notes", "area")}${tbtn("Submit survey", "Survey submitted")}</div>`);

/* ---------- Approvals ---------- */
def("pendingOrders", "Approvals", "Pending order approval", () =>
  bar("Approvals") + seg("appr", ["Orders", "Tasks", "Customers"]) + (() => {
    const t = segVal("appr", ["Orders", "Tasks", "Customers"]);
    if (t === "Orders") return D.orders.filter(o => o.status === "Pending").map(o => row(o.id, o.retailer, D.money(o.total), "approveOrder", o.id)).join("");
    if (t === "Tasks") return ["Credit limit change - Hilltop", "Price override - Daily Fresh"].map(x => row(x, "Waiting for you", chip("Pending", "warn"))).join("");
    return D.retailers.slice(0, 4).map(r => row(r.name, "New customer request", chip(r.stage, kind(r.stage)), "retailer", r.id)).join("");
  })());
def("approveOrder", "Approvals", "Order approve / reject", p => {
  const o = D.orders.find(x => x.id === p) || D.orders[0];
  return bar(o.id) + `<div class="pad">${card("", kv("Retailer", o.retailer) + kv("Placed", o.date) + kv("Total", D.money(o.total)) + kv("Rep", D.user.name))}${tbtn("Approve", "Order approved")}${tbtn("Reject", "Order rejected", "bad")}</div>`;
});

/* ---------- Team ---------- */
def("team", "Team", "Team list", () =>
  bar("Team", false) + D.team.map(t => row(t.name, t.role, chip(t.status, t.status === "On leave" ? "bad" : "ok"), "teamMember", t.id, t.name[0])).join(""), { tab: "team" });
def("teamMember", "Team", "Team member detail", p => {
  const t = D.team.find(x => x.id == p) || D.team[0];
  return bar(t.name) + `<div class="pad">${card("", kv("Role", t.role) + kv("Status", t.status) + kv("Visits today", t.visits) + kv("Orders today", t.visits ? 3 : 0))}${btn("View schedule", "teamSchedule", p)}${btn("Their customers", "retailers", "", "alt")}</div>`;
});
listScreen("teamSchedule", "Team", "Team member schedule", () =>
  D.retailers.slice(0, 4).map((r, i) => row(r.name, `${10 + i}:00`, chip(i < 2 ? "Done" : "Planned", i < 2 ? "ok" : ""), "retailer", r.id)).join(""));

/* ---------- Expenses, inventory, assets ---------- */
def("expenses", "Expenses", "Expense claims", () =>
  bar("Expenses") + D.expenses.map(e => row(e.label, e.date, `${D.money(e.amt)}<br>${chip(e.status, kind(e.status))}`)).join("") + `<div class="pad">${btn("New claim", "newExpense")}</div>`);
listScreen("newExpense", "Expenses", "New expense claim", () =>
  `<div class="pad">${field("Category", "select", ["Fuel", "Meals", "Parking", "Travel"])}${field("Amount", "number", "0")}${field("Date", "date", "2026-11-13")}${photo("Attach receipt")}${tbtn("Submit claim", "Claim submitted")}</div>`);
listScreen("inventory", "Inventory", "Inventory", () =>
  D.products.map(x => row(x.name, x.cat, x.stock ? x.stock + " units" : chip("Out", "bad"))).join(""));
listScreen("assets", "Inventory", "Asset list", () =>
  D.assets.map(a => row(a.name, a.at, "x" + a.qty)).join(""));

/* ---------- Learning and rewards ---------- */
def("learn", "Learning", "Learn and demo", () =>
  bar("Learning") + D.topics.map(t => row(t.name, `${t.done}/${t.lessons} lessons`, "&#8250;", "lesson", "", t.name[0])).join(""));
listScreen("lesson", "Learning", "Topic lessons", () =>
  ["Introduction", "Key products", "Customer questions", "Quiz"].map((l, i) => row(l, i < 2 ? "Watched" : "Not started", i < 2 ? chip("Done", "ok") : "", "", "", i + 1)).join("") + `<div class="pad">${photo("Video player")}</div>`);
listScreen("points", "Learning", "Points and rewards", () =>
  `<div class="pad">${card("", `<div style="text-align:center"><div style="font-size:34px;font-weight:700">1,240</div><small>points earned</small></div>`)}${["Free coffee voucher - 500", "Gift card - 1000", "Extra leave day - 2500"].map(r => row(r, "", "Redeem")).join("")}</div>`);
