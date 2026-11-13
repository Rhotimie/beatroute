# AI Tools, Skills, Plugins and MCP Servers for Cloning a Mobile App — Case Study: a WhatsApp-like Messenger

*Current as of 12 November 2026*

---

## Executive summary

- **"REA" is not one product.** At least three projects use the name "Reverse Engineer Anything."
  - **morluto/rea** has the broadest feature scope on paper (our assessment, based on its README [1]; we have not tested it). It is an MIT-licensed MCP server plus skill that inspects binaries, Android APKs (via JADX), Electron apps and websites, and then hands its evidence to Claude Code, Codex, Cursor and other agents [1].
  - **A skill bundle called REA_Skill** [4].
  - **A "paste the repo into ChatGPT/Claude" method** that MindStudio wrote about in October 2026 [5].
  - **Caution on morluto/rea:** it is new, its skill-hub listing is marked "unsigned", and its GitHub star count is implausibly high for a repo this young [1][2]. Treat it carefully.
- **The most effective 2026 stack for a WhatsApp-like clone** is an AI coding agent (Claude Code or Codex) plus the layers below:
  - **Planning skills:** a "recon, architect, build, test, diff, rebrand" skill pack such as replica-skill [6].
  - **Design tools:** Google Stitch [23], Claude Design [18] or the Figma MCP server [19].
  - **Mobile-platform skills and MCPs:** Expo skills and the Expo MCP server [26][27], or the Dart/Flutter MCP [29], with mobile-mcp to drive simulators and real devices [24].
  - **Backend MCPs:** Supabase MCP [30] or Firebase MCP [31].
  - **Real-time building blocks:** a chat SDK or Matrix [40][41], LiveKit for calls [39], and Signal Protocol or MLS for end-to-end encryption [36][37].

---

## 1. Current state: what "cloning" a mobile app means in 2026

Three activities are often mixed together.

1. **Behavioural cloning.** You rebuild features and UX patterns from observation: screenshots, recordings, store listings and public engineering write-ups. This is where AI tools are now strongest. The replica-skill pack states the principle directly: "It rebuilds what an app does, never what it owns." [6]
2. **Binary reverse engineering.** You decompile an APK or IPA to read code, resources and endpoints. In 2026 AI agents do this through MCP bridges to JADX, apktool, Ghidra, IDA and radare2 [1][8][9][10][12][13].
3. **Protocol and backend replication.** You rebuild the server, real-time delivery and encryption. Here AI mostly speeds up integration of proven building blocks; it does not invent them.

---

## 2. Key developments: the tool landscape, layer by layer

### 2.1 REA and other "reverse engineer anything" tools

| Tool | What it is | Install | Mobile relevance | Caveats |
|---|---|---|---|---|
| **REA (morluto/rea)** | MCP server and skill. Its tagline: "Reverse engineer anything with agents, from app behavior down to native binaries." It returns findings with the evidence behind them; analysis runs locally [1]. | `npx rea-agents setup` registers the MCP server with your agent. CLI: `npm install --global rea-agents` [1] | Android APKs through JADX, adb devices and Flutter apps. Native code through an existing Hopper, Ghidra or IDA install. On Apple, its support table lists Apple app analysis and crash reports but never mentions IPA files [1]. | Listed on skills-hub as created 10/12/2026, version v1.0.17, and "Unsigned, install at your own risk" [2]. Its star count (hundreds of thousands) is implausible for a repo this new, so do not treat it as a quality signal. The listing advises "Skip REA for ordinary source-repository architecture analysis." [2] |
| **ReversePort** (laaielichter) | A second skill named `reverse-engineer-anything`: "Reverse engineer and port anything with ReversePort." [3] | `npx -y skills add laaielichter/Reverseport --skill reverse-engineer-anything --agent claude-code` [3] | APK classes and methods; partial iOS support (IPA, plists, asset catalogs) [3]. | Small and new [3]. |
| **REA_Skill** (smartworldarafath) | A bundle of skills and prompts for Claude Code, Codex, Cursor and Antigravity. Its description: "Recover lost source code, decompile binaries/APKs, security audits." [4] | `/plugin marketplace add smartworldarafath/REA_Skill` [4] | Includes a mobile-app recovery skill covering APK/AAB/DEX, Flutter, React Native and IPA, plus a MASVS audit skill [4]. | The README gives conflicting skill counts. It is scoped to software you own or are authorised to test [4]. |
| **"Reverse Engineer Anything" method** (MindStudio write-up, October 30, 2026) | Paste a GitHub repo URL into the ChatGPT or Claude desktop app, then ask it to "make me" an app. The AI infers the app's behaviour and rebuilds it [5]. | Desktop app with folder access [5]. | Works best for narrow, single-purpose apps. MindStudio warns that "results will vary by how well-known or well-documented the target app is" [5]. | The article does not name the repo [5]. |

**Related skills that matter more for a clone than binary RE:**

- **replica-skill** (MIT, about 9.1k stars) is eleven Claude skills [6]:
  - `replica-recon` maps screens, flows and the data model;
  - `replica-architect` plans the stack, schema and API;
  - `replica-design` builds a design system as tokens;
  - `replica-build` and `replica-backend` build the app and its auth, database and integrations;
  - `replica-test` and `replica-diff` test flows and score the clone against the original;
  - `replica-entrepreneur` mines user reviews for complaints;
  - `replica-brand` renames and rebrands the clone;
  - `replica-launch` and `replica-deploy` handle the store listing and shipping.

  Install with `/plugin marketplace add Jakeschincariol/replica-skill` [6]. Its worked examples are web-oriented (Next.js, Postgres, Playwright), so native mobile support is unconfirmed [6].
- **reverse-api-engineer** records a browser session as HAR traffic and generates a typed API client. Its description: "Reverse engineer any website into a typed API client." [7] It is useful for *web* targets. WhatsApp's traffic is Noise-encrypted, so it does not apply there [34].

### 2.2 AI reverse-engineering MCP servers (for your own builds or open-source apps)

| Tool | What it does | Notes |
|---|---|---|
| **JADX-AI-MCP** | "Plugin for JADX to integrate MCP server." Lets an agent read classes, smali, the manifest and resources, and follow cross-references [8]. | Install: `jadx plugins --install "github:zinja-coder:jadx-ai-mcp"` [8]. Likely the most practical Android option (our assessment): it works on decompiled code, smali and resources inside one tool, while apktool-mcp-server focuses on resources and layouts [9]. We have not compared it in use with REA's JADX integration [1]. |
| **apktool-mcp-server** | "Fully automated MCP server built on top of apktool to analyze Android APKs using LLMs like Claude." [9] | Good for layouts and resources. |
| **GhidraMCP** | Lets LLMs "autonomously reverse engineer applications" in Ghidra [10]. | Use it for native `.so` libraries. |
| **ReVa** | A Ghidra extension that claims to "limit context rot and enable long form reverse engineering tasks" [11]. | `claude mcp add --scope user ReVa -- mcp-reva` [11]. |
| **IDA Pro MCP** | Bridges IDA Pro to agents. Its author now recommends "the Official Hex-Rays IDA MCP Server instead!" [12] | Needs a paid IDA Pro licence [12]. |
| **radare2-mcp** | "An MCP server to use radare2 with AI agents" [13]. | Free alternative. |
| **LLM4Decompile** | An LLM decompiler that "supports decompiling Linux x86_64 binaries" [14]. | It does not target ARM, so it is of little use on mobile binaries (our assessment). |

**Limits for WhatsApp specifically (our assessment):**

- Even with these tools, decompiling the WhatsApp APK yields obfuscated code and native libraries.
- The wire protocol is encrypted end to end and at the transport layer [34], so traffic capture reveals little.
- Meta's own engineering posts describe the architecture more clearly and legally than a decompile would (§2.5).

### 2.3 Turning screenshots and designs into mobile UI

| Tool | Input | Output | Fit for a chat-app clone |
|---|---|---|---|
| **Google Stitch** (Google Labs, free) | Prompts, voice and existing designs | UI screens on an "AI-native, infinite canvas". The March 2026 update generates multiple screens at once, adds interactive flow preview, and saves design rules in "a natural language file called DESIGN.md" [23] | Fast for designing an original-branded chat UI. It can connect to agents such as Antigravity [23]. |
| **Claude Design** (Anthropic Labs, research preview since April 2026) | Prompts, images, documents, a codebase, and web capture | Designs that it "packages ... into a handoff bundle that you can pass to Claude Code with a single instruction" [18] | Strong if Claude Code is your builder [18]. |
| **Figma MCP server** | Figma frames | Code from frames, variables and components. It can also write to the canvas; the remote server is at `https://mcp.figma.com/mcp` [19] | The best bridge if a designer works in Figma [19]. |
| **screenshot-to-code** (open source) | "screenshots, mockups, Figma designs, and screen recordings" [15] | Web stacks only (HTML, React, Vue, Ionic with Tailwind) [15] | Good for visual-fidelity prototypes; no native output and no backend [15]. |
| **Rork** | Prompts | Native apps: "Swift apps for Apple devices" and Kotlin for Android [16] | All-in-one prompt-to-native builder [16]. |
| **a0.dev** | Prompts | Cross-platform apps with a backend: "Develop with reliable backend support powered by Convex or Supabase." [17] | Convex or Supabase can power real-time chat [17]. |
| **FlutterFlow AI** | "Describe a page or component and get real widgets in your app's theme." [20] | Flutter | Good if you choose Flutter [20]. |
| **Bolt** | Prompts, Figma import | Apps on Bolt Cloud, which offers "enterprise-grade backend infrastructure" [21] | Its home page does not confirm mobile or Expo output [21]. |
| **Anything** (formerly Create) | Prompts: "Turn your words into mobile apps" [22] | Its stack is not stated [22] | Unverified for chat. |

We did not verify Lovable, v0, Replit mobile, Firebase Studio, Uizard or Builder.io for this report.

### 2.4 Coding-agent skills, plugins and MCP servers for building and testing

These matter most once you move past the prototype.

- **Expo (React Native), official.**
  - The remote MCP server installs with `claude mcp add --transport http expo https://mcp.expo.dev/mcp`. It covers Expo docs, EAS builds and workflows, TestFlight data, and local automation: screenshots, taps, typing and scrolling (SDK 54+) [26].
  - Expo skills install with `claude plugin install expo@claude-plugins-official` (also available in Codex). They include expo-router, expo-native-ui, expo-design-system and eas-app-stores [27].
  - **This is the strongest single toolchain for a React Native WhatsApp-like clone** (our assessment).
- **Callstack agent-skills** add React Native best practices, React Navigation, testing and upgrading skills: `npx skills@latest add callstackincubator/agent-skills --skill '*'` [28].
- **mobile-mcp** (about 10.5k stars) drives iOS and Android simulators, emulators and real devices. It installs with `claude mcp add mobile-mcp -- npx -y @mobilenext/mobile-mcp@latest` [24]. The agent can tap through chat screens, type messages and take screenshots to compare against your reference designs.
- **XcodeBuildMCP** (Sentry), "A Model Context Protocol (MCP) server and CLI that provides tools for agent use when working on iOS and macOS projects." [25] Use it for a native SwiftUI build. The README now shows the name MobileBuildMCP [25].
- **Dart and Flutter MCP server**, official. It gives analyzer diagnostics, tests and runtime inspection. Install with `claude plugin install dart-flutter@dart-flutter` [29].
- **Supabase MCP** handles schema, migrations, SQL, edge functions and type generation for the chats, messages and users tables. Supabase itself warns: "Connecting an LLM to your Supabase projects carries security risks." Use read-only mode and project scoping [30].
- **Firebase MCP** (`npx -y firebase-tools@latest mcp`) covers phone-number auth, Firestore, and FCM push notifications [31]. That maps directly onto WhatsApp-style phone sign-up and message notifications.

### 2.5 What WhatsApp's architecture looks like, and the building blocks to replicate it

**What Meta has published (the legal "reverse engineering"):**

- **Client protocol.** It is based on XMPP. Client–server traffic is encrypted with the Noise Protocol Framework. Messages are protobufs encrypted with the Signal Protocol and wrapped in XML stanzas [34].
- **Multi-device.** "Each companion device will connect to your WhatsApp independently". Messages are encrypted separately for each device, and groups use Sender Keys [32].
- **Key transparency.** An Auditable Key Directory "will enable WhatsApp clients to automatically validate that a user's encryption key is genuine" [33].
- **Media.** WhatsApp rewrote its media library from C++ to Rust. Meta wrote in January 2026: "We believe that this is the largest rollout globally of any library written in Rust." [35]
- **Server heritage.** A 2014 High Scalability blog post describes an Erlang/FreeBSD server stack running "Erlang R16B01 (plus their own patches)" and tuned to about 2 million connections a server [38]. This is a secondary summary, not a WhatsApp or Meta source, so treat these figures as approximate and dated. The commonly repeated claim that WhatsApp grew out of the ejabberd XMPP server rests only on secondary blogs; the 2014 write-up does not mention ejabberd.

**Building blocks for a clone:**

| Need | Option | Note |
|---|---|---|
| End-to-end encryption (one-to-one chats) | **libsignal** (Rust core with Java, Swift and TypeScript bindings) [36] | "Licensed under the GNU AGPLv3." [36] For a closed-source commercial app, AGPL obligations are a serious constraint, so get legal advice. |
| End-to-end encryption (groups) | **MLS (RFC 9420)**: "efficient asynchronous group key establishment with forward secrecy (FS) and post-compromise security (PCS)" [37] | An IETF standard alternative to Sender Keys [37]. |
| Federated, open-source messaging | **Matrix**. For example, Element X is an "Android Matrix messenger application using the Matrix Rust Sdk and Jetpack Compose." [41] | AGPL-3.0, or a paid commercial licence [41]. Also a good open-source reference app to study legally. |
| Hosted chat SDK | **Stream Chat**: native iOS, Android, Flutter and React Native SDKs, threads ("Reply to specific messages without cluttering the main channel conversation"), and offline support [40] | The fastest route to typing, threads and reactions. It is not end-to-end encrypted by default (not verified here). |
| Voice and video calls | **LiveKit**: "an open source platform for building voice, video, and physical AI agents", Apache License 2.0, with Flutter, React Native, Swift and Android SDKs [39] | WebRTC-based and self-hostable [39]. |
| MVP backend | **Supabase** or **Firebase** via their MCP servers [30][31] | Agents can build these directly. |

---

## 3. Main players

- **Agent platforms:** Anthropic (Claude Code, Claude Design [18]), OpenAI Codex (Expo skills ship in its curated plugins [27]), Google (Stitch [23], Antigravity), and Cursor.
- **Mobile-tooling vendors with official agent integrations:** Expo [26][27], Flutter/Dart [29], Sentry (XcodeBuildMCP) [25], Supabase [30] and Firebase [31].
- **Community RE tooling:** morluto/REA [1], zinja-coder (JADX and apktool MCP servers) [8][9], LaurieWired (GhidraMCP) [10], cyberkaida (ReVa) [11], mrexodia (IDA Pro MCP) [12] and radareorg [13].
- **Clone-workflow skill authors:** replica-skill [6], REA_Skill [4] and ReversePort [3].
- **Messaging infrastructure:** Signal (libsignal) [36], the Matrix/Element ecosystem [41], Stream [40] and LiveKit [39].
- **Rule-setters:** Meta/WhatsApp [42][43], Apple [50], Google Play [51] and the EU (Software Directive, DMA) [48][52].

---

## 4. Open debates

### 4.1 Reverse engineering versus clean-room rebuilding

**What WhatsApp's contract forbids:** its Terms bar you from "reverse engineer, alter, modify, create derivative works from, decompile, or extract code from our Services" [42]. Meta also bans the accounts of people who use unofficial apps [43].

**Our reading:** RE of WhatsApp for a clone is high-risk and adds little.

### 4.2 Copycat versus original product

- **Apple's guideline 4.1** says "Come up with your own ideas." It rejects apps that copy a popular app with minor name or UI changes [50].
- **Google Play** bans apps that "mislead users by impersonating someone else" [51].
- **WhatsApp's brand rules** say you "may not modify the WhatsApp Brand Resources in any way" and bar confusingly similar names and logos [49].

You can copy the *patterns* (chat list, ticks, voice notes). You cannot copy the identity. replica-skill's rebrand step exists for this reason [6].

### 4.3 Trusting new AI skills

Many 2026 skills are days or weeks old. Some are unsigned [2], and star counts can be unreliable [1].

Skills and MCP servers run code on your machine and may touch production data. Supabase's own warning applies broadly [30].

**Our advice:** pin versions, read SKILL.md files before installing, and keep RE work in a VM.

### 4.4 Open-source encryption licensing

libsignal is AGPLv3 [36] and Element X is AGPL or commercial [41]. Teams must choose among three options:
- open-source the clone;
- buy a commercial licence;
- implement MLS through permissively licensed libraries (not verified here).

### 4.5 How far screenshot-to-app tools get you

The tools reviewed here produce good UI, but none of their pages mention real-time messaging [15][16][17][21]. The hard parts of WhatsApp remain engineering work:
- offline sync;
- delivery receipts;
- end-to-end encryption across multiple devices [32];
- calls.

---

## 5. Recommended workflow for a WhatsApp-like clone (our synthesis)

1. **Recon, legally.** Run `replica-recon` [6] on your own screenshots and screen recordings of WhatsApp, its store listing and Meta's engineering posts [32][33][34]. Produce a feature map: chats, groups, status, calls, media, linked devices.
2. **Learn the architecture from open code instead of decompiling WhatsApp.**
   - Study libsignal [36] and Element X [41].
   - If you want AI-assisted binary analysis, point REA [1] or JADX-AI-MCP [8] at **your own** APK builds. Use them to debug size, obfuscation and leaked secrets.
3. **Design an original brand** in Stitch [23], Claude Design [18] or Figma (via its MCP server [19]). Keep the UX patterns but use your own name, colours and icon [49][50].
4. **Build with an agent.**
   - Choose one path: Claude Code or Codex with Expo skills and the Expo MCP [26][27] plus Callstack skills [28], or the Flutter MCP [29], or XcodeBuildMCP for native iOS [25].
   - Use mobile-mcp for automated tap-through tests on devices [24], and `replica-diff` to score the clone against the original's flows [6].
5. **Backend.**
   - For the MVP, use Supabase or Firebase via MCP [30][31], or Stream Chat [40].
   - Add LiveKit for calls [39].
   - Add libsignal or MLS for end-to-end encryption once you have legal clarity on licensing [36][37].
6. **If you need to reach real WhatsApp users,** the only sanctioned route is DMA interoperability in Europe (see §6).

---

## 6. What to watch next

- **DMA interoperability.** In November 2025 Meta said "BirdyChat and Haiket will be the first third-party services to implement messaging interoperability with WhatsApp" [52]. Partners "must use the same level of E2EE as WhatsApp" [52]. We found no confirmed 2026 news of more partners or of cross-app group chats, so check Meta's reference offer before relying on this route.
- **REA's maturity.** Watch whether morluto/rea publishes signed releases and reliable metrics [1][2], and whether IPA support is added [1].
- **Design-to-agent handoff.** Watch the convergence of Stitch's DESIGN.md [23], Claude Design's handoff to Claude Code [18] and Figma's canvas-writing MCP [19].
- **Expo MCP local automation** maturing beyond iOS simulators [26]; and XcodeBuildMCP becoming MobileBuildMCP [25].
- **Enforcement.** Watch Meta's actions against unofficial clients [43] and the aftermath of WhatsApp's win against NSO, after which a judge barred NSO from targeting WhatsApp users [44].

---

## 7. Conclusion

There is no single "clone WhatsApp" button.

- **REA** (morluto/rea) claims the broadest scope of the AI reverse-engineering MCPs reviewed here (our assessment, based on its README [1]; we have not tested it, and its star count is unreliable and its listing unsigned [2]). Alongside it sit JADX-AI-MCP, GhidraMCP, ReVa and IDA MCP [8][10][11][12].
- **The effective path in late 2026** is a clean-room rebuild led by a coding agent:
  1. replica-skill-style recon and diffing [6];
  2. Stitch, Claude Design or Figma MCP for an original UI [23][18][19];
  3. Expo or Flutter skills and MCPs plus mobile-mcp to build and test [26][27][29][24];
  4. Supabase or Firebase, Stream, LiveKit and Signal Protocol or MLS for the messaging core [30][31][40][39][36][37].

## Follow-up questions

### Follow-up 1

> I do like that you add how we could easily generate a mockup(figma version and installable mobile version that is installable on adroid or iphone) of the app exactly as the source apk with dummy data. this will undertsnad how the system works, i would also like that we can have API designs per each views documentation with sample input data, output data, which will also help in designing the backend
> all these are needed to be available.
> all these helps as a proof of concept that this app can be reverse engineered.
> using what we already have existing add every possible tools/mcp/plugins/ai tools and hoow they can easily generate all these from the initial research document

Here's how to chain the tools you already have into a proof-of-concept pipeline. One framing note: this is sound as a general RE/POC method on an app you own or are authorised to analyse; on WhatsApp itself, keep it to your *own* builds or open-source references and an original brand, for the legal reasons in the report [42][48][49].

##### Stage 0 — Extract the structured facts from the APK
Point your agent + an RE MCP at the APK to produce the "initial research document" that everything else reads from.
- **JADX-AI-MCP** [8] and **apktool-mcp-server** [9] give the agent decompiled code, smali, the manifest, layouts, strings and resources.
- **REA (morluto/rea)** [1] can drive JADX, adb and native inspection from one MCP if you prefer a single tool.
- **replica-recon** (from replica-skill) [6] consumes those outputs plus screenshots/recordings and writes the screen map, flows, components and a draft data model — this is your source-of-truth doc.

##### Stage 1 — Figma mockup from the extracted screens
- **Figma MCP server** [19]: the agent writes the recovered screens back onto the Figma canvas as editable layers ("Create and modify native Figma content from your MCP client"), driven from the layout/resource data in Stage 0.
- **Google Stitch** [23] or **Claude Design** [18]: feed the screenshots/exported layouts to regenerate screens, then export to Figma; Stitch saves style rules in a `DESIGN.md` so the look stays consistent across screens.

##### Stage 2 — Installable mobile app with dummy data
Have the agent turn the Stage-0 screen map into a runnable app, populated with mock data:
- **React Native/Expo**: Expo skills [27] + **Expo MCP server** [26] build it and produce an **installable EAS build** (TestFlight / Android APK) and run it on a simulator. **replica-build**/**replica-design** [6] generate screens from the recon doc.
- **Flutter** alternative: Dart/Flutter MCP [29]; **native iOS**: XcodeBuildMCP [25].
- **Dummy data**: wire screens to a quick mock backend via **Supabase MCP** [30] or **Firebase MCP** [31] (seed tables/fixtures), or local JSON — no real service needed for a POC.
- **Verify fidelity**: **mobile-mcp** [24] taps through the clone on a real device/emulator and screenshots each screen; **replica-diff** [6] scores those against the original's flows.

##### Stage 3 — Per-view API design docs with sample I/O
- **replica-architect** [6] turns the Stage-0 data model into the stack, schema and API spec per screen.
- For endpoints the app actually calls, capture them as evidence: **reverse-api-engineer** [7] records a browser/HAR session and emits a typed client with real request/response shapes — best for web/HTTP targets (note: WhatsApp's own traffic is Noise-encrypted, so this works on your clone's backend or an HTTP target, not WhatsApp's wire protocol [34]).
- Generate backend-ready types/migrations directly: **Supabase MCP** can `generate_typescript_types` and `apply_migration` [30]; **Firebase MCP** scaffolds Firestore/auth [31].
- Output per view: endpoint, method, sample input JSON, sample output JSON, auth — your agent writes this as OpenAPI/Markdown from the architect spec.

##### One-command orchestration
**replica-skill** [6] already sequences this end to end (recon → architect → design → build → backend → test → diff → brand → deploy), so a single skill pack can drive Stages 0–3 from the research document; the individual MCPs above are what it (or you) call at each step. Keep RE work in a VM and pin/review each skill before install, since some are unsigned [2][30].

No new sources were needed, so `sources.json` is unchanged.

## Sources

1. [REA: Reverse Engineer Anything (morluto/rea)](https://github.com/morluto/rea) - REA description, MCP architecture, install, APK/JADX and native support
2. [skills-hub.ai listing: rea-reverse-engineer-anything](https://skills-hub.ai/skills/rea-reverse-engineer-anything) - REA version, creation date, unsigned warning, when to skip
3. [ReversePort reverse-engineer-anything skill](https://www.skillsdirectory.com/skills/laaielichter-reverse-engineer-anything) - Second REA-named skill, install and coverage
4. [REA_Skill (smartworldarafath)](https://github.com/smartworldarafath/REA_Skill) - REA skill bundle, mobile app recovery skill, authorised-use scope
5. [MindStudio: Reverse Engineer Anything: Clone Any App With ChatGPT or Claude](https://www.mindstudio.ai/blog/reverse-engineer-anything-github-tool) - Paste-the-repo REA method and its limits
6. [replica-skill](https://github.com/Jakeschincariol/replica-skill) - Eleven Claude skills to recon, rebuild, test, diff and rebrand an app clone
7. [reverse-api-engineer](https://github.com/kalil0321/reverse-api-engineer) - HAR-based website-to-API-client skill
8. [JADX-AI-MCP](https://github.com/zinja-coder/jadx-ai-mcp) - JADX MCP plugin for Android APK analysis
9. [apktool-mcp-server](https://github.com/zinja-coder/apktool-mcp-server) - apktool MCP for APK resources
10. [GhidraMCP](https://github.com/LaurieWired/GhidraMCP) - Ghidra MCP for native binaries
11. [ReVa - Reverse Engineering Assistant](https://github.com/cyberkaida/reverse-engineering-assistant) - Ghidra agent extension, install
12. [IDA Pro MCP](https://github.com/mrexodia/ida-pro-mcp) - IDA bridge; author recommends official Hex-Rays server
13. [radare2-mcp](https://github.com/radareorg/radare2-mcp) - Free radare2 MCP
14. [LLM4Decompile](https://github.com/albertan017/LLM4Decompile) - LLM decompiler limited to x86_64
15. [screenshot-to-code](https://github.com/abi/screenshot-to-code) - Screenshot/video to web code; no native output
16. [Rork](https://rork.com) - Prompt-to-native Swift/Kotlin app builder
17. [a0.dev](https://a0.dev) - AI app builder with Convex/Supabase backend
18. [Anthropic: Introducing Claude Design by Anthropic Labs](https://www.anthropic.com/news/claude-design-anthropic-labs) - Claude Design inputs and handoff to Claude Code
19. [Figma: Guide to the Figma MCP server](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Dev-Mode-MCP-Server) - Remote Figma MCP, code from frames, canvas writes
20. [FlutterFlow AI](https://www.flutterflow.io/ai) - Prompt to Flutter widgets
21. [Bolt.new](https://bolt.new/) - Bolt Cloud backend
22. [Anything (formerly Create)](https://www.createanything.com) - Prompt-to-mobile-app positioning
23. [SiliconANGLE: Google upgrades Stitch AI interface development tool (March 2026)](https://siliconangle.com/2026/03/19/google-upgrades-stitch-ai-interface-development-tool/) - Stitch canvas, multi-screen, DESIGN.md, agent connections, free in Labs
24. [mobile-mcp (mobile-next)](https://github.com/mobile-next/mobile-mcp) - Drive iOS/Android simulators and devices; install; stars
25. [XcodeBuildMCP / MobileBuildMCP (Sentry)](https://github.com/getsentry/XcodeBuildMCP) - iOS/macOS build MCP
26. [Expo MCP Server docs](https://docs.expo.dev/eas/ai/mcp/) - Remote Expo MCP, EAS, local automation tools
27. [expo/skills](https://github.com/expo/skills) - Official Expo agent skills in Claude and Codex marketplaces
28. [Callstack agent-skills](https://github.com/callstackincubator/agent-skills) - React Native best-practice skills
29. [Dart and Flutter MCP server](https://docs.flutter.dev/ai/mcp-server) - Official Flutter MCP and Claude plugin
30. [Supabase MCP server](https://supabase.com/docs/guides/getting-started/mcp) - Supabase MCP tools and security warning
31. [Firebase MCP server](https://firebase.google.com/docs/ai-assistance/mcp-server) - Auth, Firestore, FCM tools via MCP
32. [Meta Engineering: How WhatsApp enables multi-device capability](https://engineering.fb.com/2021/07/14/security/whatsapp-multi-device/) - Multi-device architecture
33. [Meta Engineering: Deploying key transparency at WhatsApp](https://engineering.fb.com/2023/04/13/security/whatsapp-key-transparency/) - Auditable Key Directory
34. [Meta Engineering: Making messaging interoperability with third parties safe for users in Europe](https://engineering.fb.com/2024/03/06/security/whatsapp-messenger-messaging-interoperability-eu/) - XMPP-based protocol, Noise, Signal Protocol, protobuf
35. [Meta Engineering: Rust at scale (WhatsApp, Jan 2026)](https://engineering.fb.com/2026/01/27/security/rust-at-scale-security-whatsapp/) - wamedia Rust rewrite
36. [signalapp/libsignal](https://github.com/signalapp/libsignal) - Signal Protocol library, AGPLv3
37. [RFC 9420: The Messaging Layer Security (MLS) Protocol](https://www.rfc-editor.org/rfc/rfc9420) - MLS group key establishment
38. [High Scalability: How WhatsApp Grew to Nearly 500 Million Users (2014)](https://highscalability.com/how-whatsapp-grew-to-nearly-500-million-users-11000-cores-an/) - Erlang/FreeBSD stack, 2 million connections a server (secondary 2014 blog summary, flagged as such in the report)
39. [LiveKit](https://github.com/livekit/livekit) - Open-source WebRTC voice/video platform and mobile SDKs
40. [Stream Chat](https://getstream.io/chat/) - Chat SDKs, threads, offline support
41. [Element X Android](https://github.com/element-hq/element-x-android) - Matrix reference client, AGPL/commercial
42. [WhatsApp Terms of Service](https://www.whatsapp.com/legal/terms-of-service) - Ban on reverse engineering and substantially-same software
43. [WhatsApp Help Center: unofficial apps](https://faq.whatsapp.com/1217634902127718) - Bans on users of unofficial apps
44. [The Record: Judge bars NSO from targeting WhatsApp users](https://therecord.media/judge-bars-nso-from-targeting-whatsapp-users-lowers-damages) - NSO permanent injunction (Oct 2025)
45. [Sega v. Accolade (Wikipedia)](https://en.wikipedia.org/wiki/Sega_v._Accolade) - Disassembly as fair use (secondary source; court opinion not read, flagged in the report)
46. [Directive 2009/24/EC Article 6 (Decompilation)](https://www.legislation.gov.uk/eudr/2009/24/article/6) - EU decompilation limits
47. [WhatsApp brand guidelines](https://www.meta.com/en-gb/brand/resources/whatsapp/whatsapp-brand/) - Trademark and brand-use limits
48. [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) - 4.1 Copycats

49. [Meta Newsroom: WhatsApp enables third-party chats for users in Europe (Nov 2025)](https://about.fb.com/news/2025/11/messaging-interoperability-whatsapp-enables-third-party-chats-for-users-in-europe/) - DMA interop partners and E2EE requirement
