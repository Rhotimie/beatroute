# BeatRoute recon (com.gz.vitalwires 10.1.2.0.12)

Static analysis of a third-party APK, done to map behaviour for a clean-room rebuild.
Nothing in this folder (code, assets, fonts, branding) may be copied into the new app.

## How it was produced

| Step | Tool | Output |
|---|---|---|
| Unpack XAPK splits | `unzip` | `xapk/` (base, `armeabi_v7a`, `xhdpi`) |
| Resources and manifest | `apktool d` 3.0.3 | `apktool/` (560 MB) |
| Java sources | `jadx` 1.5.6 | `jadx/` (233 MB, 3,535 app files, 392 classes not fully decompiled) |
| Endpoints | grep of path literals | `endpoints.txt` (222 lines, ~180 real) |
| Screens | manifest | `activities.txt` (242) |

## The app

- Native Kotlin/Java, minSdk 34 (Android 14+). No Flutter or React Native.
- **Offline-first:** about 90 local SQLite tables in `sqlite/MySQLiteHelper.java`, with `staging_*` tables
  and a sync queue. Every queued row carries `is_syncing`, `is_error`, `error_message`.
- **Every action during a visit is geostamped and tied to a visit:** `latitude`, `longitude`, `accuracy`,
  `retailer_id`, `beatplan_id`, timestamp.
- **Backend:** REST at `https://api.beatroute.io/` + `mAPI/`, resources under `v1/`; per-region map and
  routing services (`mapservice-in/uk`, OSRM, Mapbox optimisation).
- **Third-party SDKs:** Firebase (FCM), OkHttp/Retrofit, Datadog, Freshchat, Blitzllama, ML Kit OCR,
  ZXing barcode, PDFium.
- **Native libraries:** all third-party (PDFium, ML Kit OCR, GIF, SQLite, root detection). No app logic is
  native, so Ghidra is not needed.
- **Permissions:**
  - background and fine location, with a foreground location service;
  - camera, microphone, NFC;
  - biometric sign-in, exact alarms, start on boot.

## Feature map (from 242 screens and the API groups)

| Area | Screens (examples) | API group |
|---|---|---|
| Sign-in | EnterUsername, EnterPassword, OtpVerification, UserActivation | `v1/user`, `v1/profile` |
| Attendance | MarkAttendance, DayInOutDetail, ApplyLeave, LeaveHistory | `v1/attendance`, `ums/attendance`, `v1/user-leave`, `v1/holiday` |
| Beat / route plan | ScheduleWrapper, plan.CreateNewPlan, RouteSelection, RecommendedRoute, Maps | `v1/schedule`, `v1/route`, `v1/routing` |
| Customers (retailers) | Retailers, RetailerCreate, RetailerEditNew, CustomerOnboarding, GeoTagAdjustment | `v1/retailer` (35 endpoints) |
| Distributors | distributor.Distributorlist, DistributorDetail, TakeStock_Distributor | `v1/distributor`, `v1/distributororder` |
| Visit: check-in | CheckInActivity_Promotor, VisitNoteHistory | `v1/activity` |
| Visit: take order | takeOrder.ProductListViewKotlin, DraftOrderList, OrderSummaryViewType | `v1/order`, `v1/sku`, `v1/scheme` |
| Visit: stock | TakeStock_ProductList, TakeStock_Confirm, ViewStockSummary | `v1/retailer/inventory` |
| Visit: payment | ProcessPayment, OutStandingPayment, PaymentDetailScreen | `v1/payment`, `v1/outstanding` |
| Visit: returns, feedback, sales log | ProcessReturn, SubmitFeedback, LogSales_* | `v1/feedback` |
| Schemes / promotions | SchemeDialog, AppliedSchemeDialog, PromotionalProductList | `v1/scheme` |
| Campaigns / surveys | Campaigns, RunningCampaigns, CampaignDraftList | `v1/stream`, vmCampaign |
| Approvals (manager) | PendingOrderApproval, PendingApprovalTaskList, ApprovedUnapprovedCustomerList | `v1/order/approve-reject` |
| Team | Team, TeamDetails, MyScheduleTeam | `v1/retailer/team` |
| Expenses, inventory, assets | expense.ExpenseClaims, inventory.*, AssetList | `v1/filemanager` |
| Learning, gamification | LearnAndDemo, TopicsList, GamificationWebView, PointsEarnedRedeem | `v1/loyality`, `v1/scorecard` |

## Core entities (columns read from the local schema)

- **Retailer:**
  - identity and contact: name, contact person, mobile, email;
  - address: street, city, state, district, pincode, latitude/longitude with `is_location_locked`;
  - classification and assignment: type/subtype, stage, distributor, route, sales rep, TSM;
  - extensions: custom and statutory field arrays, `sap_id`.
- **Route:** name, distributor, sales rep, geo-sequencing flag.
- **BeatPlanRetailer (a scheduled visit):** retailer snapshot, `beatplan_id`, `schedule_id`, scheduled date and
  start/end time, status, and the location captured on the list.
- **DayIn / DayOut:** user, timestamp, location and accuracy, address, custom fields.
- **Attendance (check-in at a retailer):** retailer, check-in time, photo, NFC tag, location and accuracy.
- **SKU:**
  - identity: product id, description, category, brand, SKU group, `sap_id`, image;
  - pricing: base price, price, tax, scheme;
  - units: UOM, up to four alternate UOMs with conversion rates;
  - stock and ordering: distributor and retailer stock, last and suggested order;
  - flags: `is_msl/fsl/csl` (must-, focus- and core-selling lines).
- **ProductOrder:**
  - header: order id, retailer, distributor, `beatplan_id`, location, signature/photo, remarks, order type;
  - lines: product, quantity, price, scheme price/id, discount, `invoice_level_discount`;
  - selling-line counts: MSL/FSL/CSL totals.
- **Stock:** retailer, product, quantity, UOM, photo, minimum stock quantity.
- **ProductPayment:** order/invoice, retailer, mode, cash, reference, payment term, photo.
- **Scheme:** type, rule, SKUs, dates, `can_be_clubbed`, discount and cap, eligibility by retailer
  class/type/chain.
- **Feedback, VisitNote, SalesLog:** retailer, remark/rating, photo, location.

## The core loop a rep runs every day

1. Sign in, then **Day In** (geostamped).
2. Open today's **beat plan**: the scheduled retailers on a route, on a map.
3. At a retailer: **check in** (location + optional photo), then any of take order, take stock, collect
   payment, feedback, visit note. Then **check out**.
4. Everything queues locally and syncs when the network allows.
5. **Day Out** (geostamped). A manager approves or rejects pending orders (`v1/order/approve-reject`,
   `PendingOrderApproval`).

**Verified vs not verified:**
- **No distance check at check-in was found.** The only geofence (`visit/autocheckout/`) **auto-checks-out** a
  rep who leaves a radius around the retailer after checking in. It applies to promoters only and is behind the
  Firebase Remote Config flag `allow_promoter_geofencing` (`VisitGeofenceGate`: `not_promoter`, `flag_off`,
  `no_radius`, `permission`, `no_play_services`).
- **Not established:** what a manager *views* (dashboards are on the web portal, `env9.portal.vwbeatroute.com`,
  not in this APK).
- **Partly undecompiled:**
  - totals: 392 methods overall; 14 app files carry jadx's "decompiled incorrectly" marker;
  - in the core loop: `takeOrder/ProductViewModel`, `fragments/ScheduleFragment`,
    `shared/viewmodel/AttendanceViewModel`, `fragment/OrderPriceDialogFragment` (pricing);
  - how to read them: smali under `apktool/smali*/`, or `jadx-gui` with "show inconsistent code".
- **Field names are obfuscated:** JSON fields are annotated `@InterfaceC1158On0("radius")`, not
  `@SerializedName`, so request and response bodies are read from those string arguments.

## Where to look next

- `jadx/sources/com/gz/vitalwires/sqlite/MySQLiteHelper.java`: the whole local schema.
- `jadx/sources/com/gz/vitalwires/shared/utils/ApiConstants.java` and `endpoints.txt`: the API surface.
- `jadx/sources/com/gz/vitalwires/takeOrder/`: the order flow.
- `apktool/res/layout/`: screen layouts, for UX patterns only.
- Interactive: `jadx-gui input/base.apk`, then the jadx-mcp-server tools in a new Claude session.
