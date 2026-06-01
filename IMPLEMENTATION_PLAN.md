# IAHO Field Scanner — Implementation Plan

A **deterministic fake scanner** prop for a LARP. It looks like it scans, but every
result comes from an internal table: `scan mode + target → planned result`. The fantasy
is *"authoritative device makes the room nervous"* — not functional software.

> Design north star: a **grim regulatory tool made by people who hate joy**, with just
> enough sci-fi animation to impress players. Never overbuild into a videogame UI.

---

## Core principles (do not lose these)

1. **Deterministic, never random.** Same mode + same target always yields the same result.
   This prevents accidental plot escalation and lets the NPC pre-rehearse outcomes.
2. **Every result hands the auditor a next line.** No result is just "spooky." Each one
   ends with an `ACTION:` telling the NPC what to say/do next.
3. **Unknown combinations return boring inconclusive results** (e.g. scanning a random
   player's boot → `STOP SCANNING BOOTS`). Boring is a safety feature.
4. **No behavioural scanner.** We do NOT override player roleplay. Only the scripted
   technical/procedural scanner moments the forms already define.
5. **Config-driven.** All modes, targets, and planned results live in config files. Adding
   a scripted outcome = editing data, not code.

---

## The six scanner applications

Each mode has a signature visual. CQ (legal gauge) and FETR (technical waveform) set the
visual language and are built **first**.

| # | Mode | id | Used by | Signature visual | Tone |
|---|------|----|---------|------------------|------|
| 1 | **CQ Boundary Scan** | `cq-boundary` | Maral (VI legality) | Circular gauge .000–.400, `.34` threshold marked | Legal heart of the plot |
| 2 | **Memory Retention / Continuity** | `memory-retention` | "logs vs. continuity of self" | Timeline of broken/connected memory nodes w/ pulses | Uncomfortable, not legally definitive |
| 3 | **FETR Patch Integrity** | `fetr-patch` | Malan(a) (personal agenda) | Waveform / edge-detection w/ drops, resets, echoes | Technobabble-safe |
| 4 | **Architecture Surface Sweep** | `architecture-sweep` | "what talks to what" | SVG node map: Bastion Node center → endpoints | Nudges toward TECH quietly |
| 5 | **Cradle Residue / External Cognition** | `cradle-residue` | the "oh shit" scanner | Dark, slow, unstable lattice/fingerprint that fails to resolve | Plot escalator — use sparingly |
| 6 | **Procedure Completeness / Evidence Seal** | `procedure-seal` | Wendell (comedy + useful) | Bureaucratic checklist, hash gen, seal IDs | Safe to use often; comedy not plot facts |

### Result families per mode

**1. CQ Boundary** — `COMPLIANT BASELINE` · `COMPLIANT / MONITOR UNDER STRESS` ·
`BORDERLINE / TECHNICAL INTERPRETATION REQUIRED` · `THRESHOLD EXCEEDED / REPEATABILITY REQUIRED` ·
`READING UNSTABLE` · `CLASSIFICATION REFUSED`. Carries a numeric `CQ` reading; `.34` is the legal limit.

**2. Memory Retention** — `STANDARD OPERATIONAL LOG CONTINUITY` · `PERSISTENT PREFERENCE MARKERS` ·
`REPEATED-HANDLER BONDING MARKERS` · `IDENTITY-CONTINUITY MARKERS` · `UNKNOWN MEMORY STRUCTURE` ·
`AUDITOR NOTE: EMOTIONAL DISTANCE RECOMMENDED`.

**3. FETR Patch Integrity** — `PATCH PRESENT` · `PATCH PRESENT / LOCAL MODIFICATIONS` ·
`PATCH PRESENT BUT DIRTY` · `FETR BOUNDARY ECHO DETECTED` · `RESET HYSTERESIS DETECTED` ·
`MONITORING SHARD MISMATCH` · `PATCH LINEAGE CANNOT BE VERIFIED`.

**4. Architecture Surface Sweep** — `EXPECTED TALON ARCHITECTURE` · `LOCAL ADAPTATION DETECTED` ·
`UNSUPPORTED BRIDGE DETECTED` · `EXTERNAL ROUTE DETECTED` · `NON-TALON PROCESS DETECTED` ·
`LOCAL EXTERNAL-ADJACENT ENDPOINT` · `GAIANET EXPOSURE MARKER` · `TOPOLOGY SUMMARY REFUSED`.

**5. Cradle Residue / External Cognition** — `NO CRADLE INDICATORS` · `RESET-BOUNDARY RESIDUE` ·
`MEMORY-CONTINUITY SUPPORT` · `EXTERNAL COGNITION MARKER` · `NON-TALON SIGNATURE` ·
`LOCAL EXTERNAL ROUTE CORRELATION` · `GAIANET ROUTE CORRELATION` · `CLASSIFICATION UNAVAILABLE` ·
`IAHO PROTOCOL GAP DETECTED`.

**6. Procedure Completeness / Evidence Seal** — `COMPLETE` · `INCOMPLETE` · `FORM MISMATCH` ·
`SIGNATURE GAP` · `CHAIN-OF-CUSTODY BREAK` · `CONFLICT DECLARATION REQUIRED` · `WITNESS REQUIRED` ·
`UNAUTHORIZED TOUCHING DETECTED` · `PROCEDURAL VIBE DEGRADED`.

---

## Targets (predefined)

People: **Don Dragon**, **Bee-Nice**, **IO Otter**, **Shrimp**, **Pavel**.
Systems: **TALON Bastion Node**, **Attack Vector Environment**, **Local External Infrastructure**,
**Gaianet Route**, **Unknown Endpoint**.
Objects: **Evidence Packet**, **Manual Target** (free-text entry → always boring/inconclusive).

### Scripted narrative beats (must be exact every time)
- **Maral → Don Dragon → CQ Boundary** = borderline result, `CQ ≈ .337`,
  `ACTION: Ask operator whether the VI has recently been under tactical stress.`
- **Malan(a) → TALON Bastion Node → FETR Patch Integrity** = agreed patch result.

Combinations without a scripted beat resolve **deterministically** (stable hash of
`mode+target` picks from that mode's result family) so they're consistent but varied.
Truly unknown / manual targets fall back to the boring default.

---

## App structure & screens

```
Home  ─▶  Target  ─▶  Scan (5–8s animation)  ─▶  Result  ─▶  Audit Log
 ▲                                                   │            │
 └───────────────────── repeat / home ◀──────────────┴────────────┘
```

- **Home** — `IAHO FIELD SCANNER` + six scanner-app buttons.
- **Target** — predefined target buttons + Manual Target free-text.
- **Scan** — big "START SCAN" (or hold-to-scan) button. Runs 5–8s with animation, fake
  terminal logs, and escalating status (`calibrating / sampling / normalizing / legalizing`).
- **Result** — card with: Status · Reading/Classification · Evidence ID · Auditor note ·
  Recommended form action · `Repeat scan` / `Save to audit log`.
- **Audit Log** — list of previous scans with fake evidence IDs
  (e.g. `IAHO-EV-7C4A-19`, `CQ-BND-447A`) so players can copy them into paper forms.
  Persisted in `localStorage`.

### Result card contract (every mode)
```
STATUS:        <result family label>
READING:       <classification or numeric, mode-specific>
EVIDENCE ID:   <generated, e.g. IAHO-EV-7C4A-19>
NOTE:          <auditor note>
ACTION:        <the next line for the NPC>
```

---

## Hidden control — Auditor Override (SL intervention only)

- **Tap the IAHO logo 5× → opens "Auditor Override".**
- Lets the NPC force the next result's band:
  `Green/compliant` · `Yellow/borderline` · `Red/violation` · `Glitch/inconclusive` ·
  `TECH-adjacent anomaly` · `Procedure defect`.
- Default behaviour stays deterministic-by-target. Override is the exception, not the norm.

---

## Visual style (no images, no external fonts)

- CSS `radial-gradient` for scanner glow; `repeating-linear-gradient` for scanlines.
- **SVG** for gauges, waveforms, node maps, lattice patterns.
- Monospace font stack only. CSS/text "IAHO" logo (no image asset).
- Animated fake terminal logs; progress bars labelled `calibrating / sampling / normalizing / legalizing`.
- Glitch via CSS `text-shadow` + tiny transforms.
- Per-mode accent colour to differentiate the six tools (CQ cold legal, Cradle dark/unstable, etc.).

---

## Tech decisions

- **React + Vite**, plain CSS (no Tailwind). No backend, no Firebase, no images.
- **No** auth, real QR/camera, networking, or admin tooling.
- `localStorage` for the saved scan/audit log.
- **One config layer** for scan modes, targets, and planned results.
- Deploy to **GitHub Pages** (`vite base: './'` for relative asset paths;
  `gh-pages` package or a Pages Action — decide at deploy time).

### Project layout
```
src/
  main.jsx
  App.jsx                  # navigation state machine + Auditor Override
  index.css                # base "grim regulatory" theme, scanlines, glitch
  config/
    scanModes.js           # the six modes (id, name, blurb, accent, visual)
    targets.js             # predefined targets
    results.js             # deterministic mode+target → result table + defaults
  lib/
    resolveResult.js       # scripted beat ▸ stable-hash family pick ▸ boring default
    audit.js               # evidence-ID generation + localStorage log
  screens/
    HomeScreen.jsx
    TargetScreen.jsx
    ScanScreen.jsx         # fake logs + progress animation
    ResultScreen.jsx
    AuditLogScreen.jsx
  visuals/
    CqGauge.jsx            # SVG circular gauge w/ .34 threshold   (build first)
    FetrWaveform.jsx       # SVG edge-detection waveform           (build first)
    ArchitectureMap.jsx    # SVG node map                          (later)
    MemoryTimeline.jsx     # SVG memory nodes                      (later)
    CradleLattice.jsx      # SVG failing lattice                   (later)
    ProcedureChecklist.jsx # bureaucratic checklist                (later)
```

---

## Build order (MVP first)

**MVP (now):** Home · Target select · Animated scan screen · Result screen ·
config-driven deterministic results · Audit log. **Skip** auth, real QR/camera,
networking, admin tooling.

1. ✅ Project init + plan (this doc).
2. ✅ Config data model (`scanModes`, `targets`, `results`) + `resolveResult` + `audit`.
3. ✅ Navigation shell: Home → Target → Scan → Result → Audit Log (data-driven, generic).
4. ✅ **CQ Boundary** signature visual (`CqGauge`) — the iconic `.34` gauge.
5. ✅ **FETR Patch Integrity** signature visual (`FetrWaveform`).
6. ✅ Auditor Override (5-tap logo).
7. ✅ Mode visuals beyond CQ/FETR:
   - ✅ `ArchitectureMap` — Bastion-centred node map, radar sweep, flagged endpoint.
   - ✅ `CradleLattice` — distorted concentric fingerprint that resolves or fails.
   - ✅ `ProcedureChecklist` — checklist ticks/crosses, scrambling evidence hash, seal stamp.
   - 🟡 Memory Retention uses the animated bars (`GenericVisual`) — looks good; a
     bespoke `MemoryTimeline` (connected/broken nodes) remains optional polish.
8. ⬜ Polish pass + flesh out scripted result beats; deploy to GitHub Pages.

### Done so far (MVP is runnable)
The full flow works end-to-end with deterministic results, the two signature
visuals, the audit log (localStorage + evidence IDs), and the 5-tap Auditor
Override. `npm run dev` to play with it; `npm run build` is green.

### Open decisions for next session
- **Remaining visuals**: build the four placeholder modes' SVGs (see `visuals/`).
- **Scripted beats**: only a handful of `mode|target` pairs are hand-scripted in
  `config/results.js`; the rest resolve via deterministic pool. Add the exact
  agreed outcomes the SL wants before play.
- **Deploy**: choose `gh-pages` package vs. GitHub Actions Pages workflow.
- **Hold-to-scan**: currently a tap "START SCAN"; could switch to press-and-hold.

Examples of the action-first result contract:
```
CQ: .337 · STATUS: BORDERLINE / TECHNICAL INTERPRETATION REQUIRED
NOTE: Known TALON threshold jitter may apply.
ACTION: Ask operator whether the VI has recently been under tactical stress.

UNSUPPORTED BRIDGE DETECTED · ROUTE: Bastion Node → Local External Infrastructure
CONFIDENCE: 71% · ACTION: Ask which emergency condition authorized this connection.

SIGNATURE GAP · MISSING: Local responsible officer acknowledgement
ACTION: Obtain signature or record refusal.
```
