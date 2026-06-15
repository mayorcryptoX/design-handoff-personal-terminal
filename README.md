# Handoff: Personal Terminal — life dashboard app

## Overview
**Personal Terminal** is a mobile (Android) "everything" dashboard for one power user — a crypto day-trader — that unifies three areas of their life into a single app:

1. **Money** — personal finance: income vs. expenses (P&L), monthly cashflow.
2. **Gym** — training journal: streak/consistency, bodyweight trend, personal records (PRs).
3. **Trades** — trading journal: performance stats, per-trade log with notes + emotion + discipline rating, and a detail view.

A **Home** dashboard sits on top and surfaces a snapshot from all three. Navigation is a 4-tab bottom bar (Home / Money / Gym / Trades).

The visual language is **International Typographic ("Swiss") style**: warm paper ground, white cards, heavy black type, light-gray secondary text, thin black hairline rules, Helvetica, and a single red accent reserved for losses/negatives. Numbers are set in a monospace for a precise, "terminal" feel.

---

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype showing the intended look, layout, and behavior. **They are not production code to copy directly.**

The prototype is authored as a "Design Component" (`Personal Terminal.dc.html`) that runs on a small custom runtime (`support.js`) and mounts an Android device-frame helper (`android-frame.jsx`). That runtime is a prototyping tool — **do not port it.** Instead, **recreate these designs in the target codebase's existing environment** using its established patterns and component libraries.

- If the target is **React Native / Expo** (recommended for an Android-first mobile app like this), build native components and screens.
- If the target is **Flutter / Kotlin (Jetpack Compose) / SwiftUI**, translate the layouts and tokens into that framework's idioms.
- If **no codebase exists yet**, React Native + Expo is the suggested starting point (mobile, cross-platform, fast iteration).

Read `Personal Terminal.dc.html` for exact markup, inline styles, and the data/logic in the `<script>`-equivalent logic class at the bottom of the file (search for `class Component`). All styling is inline; all data and computed values live in `renderVals()`.

---

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions are specified below and present in the HTML. Recreate the UI pixel-accurately using the codebase's libraries. The one caveat is **data** — see "Data & Domain Notes" below: the prototype uses placeholder/mock records that should be replaced by the user's real data model.

---

## Data & Domain Notes (IMPORTANT — read before building)
The user provided a real spreadsheet (`Trading_PnL_Tracker.xlsx`). The prototype's **trading data is currently mocked with stock/futures-style per-trade rows (entry/exit/emotion/discipline)**, but the user's **real** data model is different. Build against the real model:

- **Trades** are logged as **daily P&L aggregates by chain/account**, not individual entry/exit trades. Columns: `Date, Period (YYYY-MM), Chain (Solana/Ethereum/Base/BSC/Portfolio/Other), Account (Main/Prop), Trading Type (Daily PnL/Spot/Perps/Meme/Swing/Scalp/Copy), Start Capital, End Capital, Realized PnL, Fees, Net PnL, ROI, Win Rate`.
  - Real totals (as of the file): **Net P&L +$12,732**, **win rate 46.5%** (positive-day / total-day basis), 258 day-entries over 9 months. By chain: Solana +$9,493, Portfolio +$2,789, Base +$450. Monthly P&L ranges from −$2,480 (Feb 2026) to +$3,916 (Dec 2025).
- **Trading expenses** (separate sheet): prop-account fees (APEX) + group subscriptions. ~$4,041 total → **True Net ≈ $8,691**.
- **Swing trades** (open positions): e.g., BTC LONG $700, GOLD (XAU) LONG $2,000. Columns: `Opened, Asset, Direction, Size($), Entry, Stop Loss, Target, Status, Unrealized P/L, Notes`.
- **Personal finance**: multi-currency. Salary 1,950 BGN ≈ €997 ≈ $1,159/mo; recurring €306 (~$356) debt payment; misc expenses ~$430/mo. Conversion rates in the file: **EUR/USD 1.1628**, **BGN/EUR 1.95583**. Store amounts in original currency + computed EUR/USD.
- **Goals/settings**: $10K profit goal (user ~87% there on true net), 20% target monthly ROI, $1,500 prop budget base.
- **Emotion + discipline journaling**: the user explicitly wants per-entry **notes/setup/screenshots**, an **emotion** tag, and a **discipline rating (0–5)** — these are NOT in the spreadsheet, so they are a **new manual layer** to add on top of imported P&L data.
- **Gym module has no source data** — it is entirely mock in the prototype and represents desired features (bodyweight, streak, PRs, progress charts). Define a data model for it.

---

## Screenshots
Reference renders of each screen are in **`screens/`** (Swiss theme, final colors):
- `01-home.png` — Home dashboard
- `02-money.png` — Money (P&L / cashflow)
- `03-gym.png` — Gym (streak, bodyweight, PRs)
- `04-trades.png` — Trades list (stats, filters, journal cards)
- `05-trade-detail.png` — Trade detail (params, screenshot slot, notes, psychology)

> Note: in these reference renders the **icons are intentionally blanked** (the live Material Symbols font isn't embedded by the static capture). Icon names per component are listed in the spec below and in **Assets**. Empty rounded tiles = where an icon sits; the week-strip squares show filled (done) vs outlined (today) states.

## Screens / Views

### Global chrome
- **Device target**: Android phone, design width 412px (content), tall scroll area + fixed bottom nav.
- **App ground**: `#EAE8E1` (warm paper). Content scrolls; bottom nav is pinned.
- **Bottom nav** (fixed, `#F2F1EB` ground, 1px top rule `rgba(0,0,0,0.14)`): four equal items — **Home** (icon `grid_view`), **Money** (`account_balance_wallet`), **Gym** (`exercise`), **Trades** (`candlestick_chart`). Active item: icon/label go black `#141414` inside a pill `border-radius:16px; height:30px; width:62px; background:rgba(0,0,0,0.08)`; inactive: `#9b998f`, transparent pill. Label: 11px, weight 600, Helvetica. Icon 23px (Material Symbols Rounded). Pill bg transition 0.2s.
- Icons throughout use **Material Symbols Rounded** (Google Fonts). Replace with the codebase's icon set (e.g., `@expo/vector-icons` Material Symbols/Icons) — names referenced below.

### 1. Home
- **Purpose**: at-a-glance snapshot across all modules.
- **Layout**: single column, 22px top / 18px side padding, 28px bottom.
- **Components**:
  - **Greeting**: mono uppercase eyebrow `Good morning[, name]` (11px, letter-spacing 0.16em, `#9b998f`) + date headline `Sunday · June 14` (26px, weight 600, letter-spacing −0.02em, `#141414`). Name is a prop (`userName`).
  - **Net hero card** (white, radius 20, 20px pad, 1px `rgba(0,0,0,0.12)`): mono eyebrow `NET THIS MONTH`; big value 38px mono (`netHome`, black if ≥0 / red if <0); a small inline **sparkline** SVG (120×40, 2px stroke, color matches value sign); footer mono `IN $… / OUT $…`.
  - **Quick-stat grid** (3 cols, 10px gap): three white cards (radius 16). Each: a 20px black icon (`local_fire_department`, `military_tech`, `payments`), a 22px mono value, an 11px gray label. Values: `12` day streak; `67%` win rate; trading P&L (signed, sign-colored).
  - **Week consistency card**: header `THIS WEEK` + `5 / 7 sessions`. Row of 7 day cells (M T W T F S S). Each cell 30×30 radius 10: **done** = black fill `#141414` + paper `check` icon `#FAF9F5`; **today** = transparent fill + 1.5px black border + black `today` icon; **rest** = `rgba(0,0,0,0.05)` fill + gray `remove` icon.
  - **Recent activity** list: mono section label, then 3 rows (white cards radius 14). Each: 38px icon tile (radius 11, `rgba(0,0,0,0.06)` bg, black icon), title (14.5px, 600) + gray sub (12px), right-aligned mono value (sign-colored).

### 2. Money
- **Purpose**: monthly personal P&L / cashflow, switch months, see breakdown + transactions.
- **Layout**: single column, same padding.
- **Components**:
  - **Header row**: title `Money` (24px, 600) + a **month stepper** (white pill, radius 12): `chevron_left` button, mono label `Jun 2026` (min-width 74, centered), `chevron_right` button. Gray chevrons `#6e6d66`.
  - **P&L hero card** (white, radius 20): eyebrow `NET PROFIT / LOSS`; 40px mono value (sign-colored). Then two labeled bars:
    - **Income**: label gray + value mono black `#141414`; track `height:8 radius:4 background:rgba(0,0,0,0.08)`; fill black, width 100%.
    - **Expenses**: label gray + value mono red `#D81E05`; track same; fill red `#D81E05`, width = `expenses/income` % (`expBarPct`).
  - **6-month trend card** (white, radius 18): eyebrow `6-MONTH TREND` + legend (black square = In, red square = Out). Then 6 month groups; each group = two 8px-wide bars (income black, expense red, both radius `3 3 0 0`) bottom-aligned in a 120px-tall area + mono month label below (active month label black, others gray). Bar heights scale to the max value across months.
  - **Transactions list** (white card radius 16, hairline row dividers `rgba(0,0,0,0.05)`): each row = 36px icon tile (income = `rgba(0,0,0,0.06)` bg + black icon; expense = `rgba(0,0,0,0.06)` bg + gray icon) + name (14px, 500) + category (11.5px gray) + signed mono amount (income black, expense black with sign). Icons by category: `work, bolt, home, shopping_cart, restaurant, directions_car, fitness_center`.

### 3. Gym
- **Purpose**: training consistency, bodyweight, PRs.
- **Components**:
  - **Streak hero** (radius 20, subtle gradient `linear-gradient(135deg,#F4F2EA,#FFFFFF)`, 1px `rgba(0,0,0,0.14)`): 34px black `local_fire_department` icon + big `12 days` mono (32px) + sub `Current streak · best yet`. Below: the same 7-cell week row as Home.
  - **Bodyweight card** (white radius 18): eyebrow `BODYWEIGHT` + big `80.1 kg` (30px mono) at left; right = a chip showing change (`trending_down` icon + `-2.3 kg`), black if losing weight / red if gaining. Then an **area line chart** (SVG 280×84): black polyline 2.5px + black-to-transparent gradient fill (`#141414` stops at 0.28 → 0 opacity). Footer mono `Last 8 weeks`.
  - **PR grid** (2 cols): white cards radius 16. Each: lift name (13px gray 500) + value mono 24px + `kg` + a delta line (`+2.5 kg` black if up, `no change` gray) + date.
  - **Recent workouts** list: white cards radius 14, 38px black `fitness_center` tile + name (14.5px 600) + `18 sets · 8.2k kg` sub + right date.

### 4. Trades (list)
- **Purpose**: performance overview + journal entries; tap an entry → detail.
- **Components**:
  - **Title** `Trading journal` (24px 600).
  - **Stats grid** (2×2): white cards radius 16, each = mono eyebrow + 24px mono value: `Net P&L` (sign-colored), `Win rate`, `Trades` (count), `Avg R`.
  - **Filter chips**: `All / Wins / Losses` pills (radius 20, 13px 600). Active = black fill `#141414` + paper text `#FAF9F5`; inactive = transparent + gray text + 1px border `rgba(0,0,0,0.22)`. Filters the list.
  - **Trade cards** (white radius 16, button): top row = ticker (16px mono 600) + direction badge (`LONG`/`SHORT`, 10.5px 700, tinted bg — long `rgba(0,0,0,0.06)`/black text, short `rgba(216,30,5,0.10)`/red text) + right signed P&L (16px mono, black if win / red if loss). Setup snippet (12.5px gray, 2-line clamp). Bottom row: date (mono 11px gray) + emotion chip (11px 600, color by emotion) + discipline indicator (mono `DISC` label + 5 small 13×4 bars; filled = black for disc≥4, red for disc≤2, gray track `rgba(0,0,0,0.16)`).

### 5. Trade detail
- **Purpose**: full record of one journal entry.
- **Components**:
  - **Back button**: `arrow_back` + `Journal` (gray).
  - **Header**: ticker (28px mono 600) + direction badge + right date (mono gray).
  - **Big P&L**: 44px mono, sign-colored.
  - **Params grid** (2×2): white cards radius 14, eyebrow + 18px mono value: `Entry`, `Exit`, `Size`, `R multiple` (R sign-colored).
  - **Screenshot placeholder**: 170px tall, radius 16, 1px `rgba(0,0,0,0.14)`, **diagonal hatched** fill (`repeating-linear-gradient(135deg,#E7E5DD 0 12px,#DEDCD3 12px 24px)`), centered `image` icon + mono caption `chart screenshot`. → In production, this is where the user's uploaded chart screenshot renders.
  - **Setup & notes card**: eyebrow + body text (14px, line-height 1.6, `#2c2c28`).
  - **Psychology card**: left = `EMOTION` eyebrow + emotion word (16px 600, color-coded); vertical hairline divider; right = `DISCIPLINE` eyebrow + `4/5` + 5 segment bars (flex, 7px tall, filled color by score).

---

## Interactions & Behavior
- **Tab nav**: tapping a bottom-nav item sets the active tab and clears any open trade detail.
- **Trade detail drill-in**: tapping a trade card opens its detail view (replaces the list in the scroll area; nav stays). Back button (or any nav tap) returns.
- **Month stepper** (Money): prev/next clamp to the available month range and re-render all Money figures + the highlighted bar.
- **Trade filters**: `All / Wins / Losses` filter the list (wins = P&L > 0, losses = P&L < 0).
- **Entrance animation**: each screen container fades/slides in on mount — `@keyframes ptFade { from{opacity:0; translateY(8px)} to{opacity:1; translateY(0)} }`, `0.28s ease` (detail uses `0.24s`). Reproduce as a mount transition.
- **Nav pill**: `background` transitions 0.2s on active change.
- No loading/error/validation states are specified in this prototype (read-only views). Add per the codebase's conventions when wiring real data and the add/log flows.

## State Management
State held in the prototype's logic class (translate to the framework's state):
- `tab`: `'home' | 'money' | 'gym' | 'trades'` — active module.
- `selectedTrade`: `number | null` — open trade-detail id (only meaningful on the Trades tab).
- `month`: index into the months array (Money stepper).
- `filter`: `'all' | 'wins' | 'losses'` — Trades filter.
- Derived per render: month figures, bar heights, win rate, totals, chain breakdown, filtered list, chart polyline strings, discipline-dot arrays. See `renderVals()` in the HTML for exact formulas (e.g., bar height = `value / maxValue * 120px`; chart points via the `poly()`/`polyArea()` helpers).
- **Props**: `userName` (string) feeds the greeting.
- **Data fetching (production)**: import/sync the spreadsheet model (or a backing store) for Trades (daily P&L by chain), Expenses, Personal Finance, Swing Trades, and Settings; compute Monthly Summary + Monthly Cashflow client-side (those sheets are formula-driven and store no values).

## Design Tokens

### Colors (Swiss / International Typographic)
| Token | Hex | Use |
|---|---|---|
| Ground (paper) | `#EAE8E1` | app background |
| Nav ground | `#F2F1EB` | bottom nav |
| Page (outside device) | radial `#D6D4CC` → `#BFBDB4` | studio backdrop |
| Surface / card | `#FFFFFF` | all cards |
| Gym hero gradient | `#F4F2EA` → `#FFFFFF` | streak card |
| Text primary / black | `#141414` | headings, values, positive/neutral figures, primary icons |
| Text note | `#2c2c28` | long-form notes |
| Text secondary | `#6e6d66` | labels, sub-text, chevrons |
| Text muted | `#9b998f` | eyebrows, captions, inactive nav |
| Accent — Swiss red | `#D81E05` | losses, negative values/emotions, expense bars |
| Inverted text on black | `#FAF9F5` | text/icons on a black fill |
| Hairline (strong) | `rgba(0,0,0,0.14)` | card/nav borders, dividers |
| Hairline (card) | `rgba(0,0,0,0.12)` | default card border |
| Fill subtle | `rgba(0,0,0,0.06)` | icon tiles, tracks |
| Row divider | `rgba(0,0,0,0.05)` | list dividers, rest-day cell |
| Empty track / dot | `rgba(0,0,0,0.16)` | unfilled discipline dots |
| Chip border (inactive) | `rgba(0,0,0,0.22)` | filter chip outline |
| Direction badge — short | `rgba(216,30,5,0.10)` | short trade tint |
| Hatch stripes | `#E7E5DD` / `#DEDCD3` | screenshot placeholder |

> **Convention**: positive & neutral = black; negative (losses, weight gain, FOMO/frustrated, expenses) = red. Keep red rare — it is the only chromatic color.

### Typography
- **Sans / UI**: Helvetica Neue → Helvetica → Arial. Headlines 24–26px/600; titles 14–16px/600; body 12–14px/400–500; labels 11px.
- **Mono / numerals & eyebrows**: a monospace (prototype uses "Geist Mono"; substitute the codebase's mono, e.g. SF Mono / Roboto Mono / IBM Plex Mono). Used for all numbers (tabular), and uppercase eyebrows with letter-spacing 0.12–0.16em.
- Big values: 30–44px, weight 500, letter-spacing −0.02em.

### Spacing & radii
- Screen padding: 18px sides, 22px top, 28px bottom.
- Card padding: 14–20px. Grid gaps: 10px. Stack gaps: 8–12px.
- Radii: cards 16–20; small tiles 10–14; chips/pills 20; nav pill 16; bars 3–4.
- Bottom nav: 8px top / 6px side padding; items flex:1.
- No drop shadows (Swiss flat) — depth comes from hairline borders and the paper/white contrast.

## Assets
- **Icons**: Material Symbols Rounded (Google Fonts) by ligature name. Names used: `grid_view, account_balance_wallet, exercise, candlestick_chart, local_fire_department, military_tech, payments, check, today, remove, chevron_left, chevron_right, work, bolt, home, shopping_cart, restaurant, directions_car, fitness_center, trending_down, trending_up, image, arrow_back`. Map to the codebase's icon library.
- **Fonts**: Helvetica (system on Apple/Android-Arial fallback); a monospace of choice. No licensed/custom font files required.
- **Charts**: hand-built inline SVG (sparkline, bodyweight area line, bar groups) — reproduce with the codebase's charting approach or SVG. Formulas in `poly()`/`polyArea()` in the HTML.
- **No image assets** ship with the prototype; the trade "screenshot" is a placeholder slot for user-uploaded images.
- **Device frame** (`android-frame.jsx`) is a prototype-only mock of the Android status/nav bars — do not port; rely on the real OS chrome.

## Files
- `Personal Terminal.dc.html` — the full design: markup + inline styles (template) and the data/logic class (`renderVals()`). **Primary reference.**
- `android-frame.jsx` — prototype-only Android device-frame helper (status bar, gesture nav). Reference for layout context only; not for production.
- `support.js` — the prototyping runtime that renders the `.dc.html`. **Do not port.** Needed only to open the prototype in a browser.

### Running the prototype locally
Open `Personal Terminal.dc.html` in a browser (it loads `support.js` and `android-frame.jsx` from the same folder). It needs network access for the Google Fonts links.
