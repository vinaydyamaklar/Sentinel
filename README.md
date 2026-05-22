# Sentinel

Client onboarding risk assessment tool for Halcyon Capital Partners. Compliance officers upload a CSV of client records or enter clients manually; Sentinel validates each record, classifies risk automatically, and surfaces incomplete or high-risk cases.

---

## How to Run

```bash
npm install
npm run dev       # starts Vite dev server at http://localhost:5173
npm run build     # type-check + production bundle to dist/
npm run preview   # preview the production build locally
```

No environment variables. No backend. All data lives in the browser.

---

## Architecture

### Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript (strict) |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 (utility-first, no component library) |
| State | React Context API (no Redux, no Zustand) |
| Persistence | `localStorage` only |

### Folder Structure

```
src/
  uiElements/
    atoms/        # Button, Badge, Dropdown, ToggleField, ComboBox, Label
    molecules/    # FormField (wraps atoms with label + error)
    organisms/    # NewClientForm, ClientTable, DataGrid, ValidationSummary, ClientDetail, AppHeader
  context/        # AppContext: global state + event handlers
  lib/            # Pure logic: csvParser, validator, riskEngine, storage, constants
  types/          # client.ts - all shared TypeScript types
  App.tsx         # View router + modal wiring
```

### Atomic Design

Components follow strict atomic design. Atoms are self-contained and stateless. Molecules combine atoms with a label/error pattern. Organisms compose molecules into full UI sections. No organism imports another organism.

### State and Context

A single `AppContext` holds all application state and exposes a `handlers` object. Any component that needs to read state or trigger actions calls `useAppContext()`. No prop drilling beyond one level.

State includes: `clients`, `view`, `selectedClient`, `selectedBranch`, `isUploadOpen`, `isNewClientOpen`.

### URL Params

The selected branch is reflected in the URL as `?branch=Mayfair` via `history.replaceState`. Refreshing the page restores the branch filter without any router dependency.

### Modal Pattern

Upload CSV and New Client open as z-50 overlays. Dismiss is only possible via the X button or explicit Cancel - no outside-click dismiss, by design, to prevent accidental data loss.

---

## Risk Classification Rules

Every client receives exactly one risk level: HIGH, MEDIUM, or LOW. HIGH is evaluated first; if no HIGH triggers fire, MEDIUM is evaluated; otherwise the client is LOW.

### HIGH Risk (automatic - any one trigger is sufficient)

| Trigger | Condition |
|---------|-----------|
| PEP Status | `pepStatus = true` |
| Sanctions Match | `sanctionsScreeningMatch = true` |
| Adverse Media | `adverseMediaFlag = true` |
| High-risk country | `countryOfTaxResidence` in: Russia, Belarus, Venezuela |

### MEDIUM Risk (any one trigger, only if no HIGH triggers)

| Trigger | Condition |
|---------|-----------|
| Entity client | `clientType = ENTITY` |
| Medium-risk country | `countryOfTaxResidence` in: Brazil, Turkey, South Africa, Mexico, UAE, China |
| High income + opaque funds | `annualIncome > 500,000` AND `sourceOfFunds` in: Inheritance, Gift, Other |

### LOW Risk

No HIGH or MEDIUM triggers matched.

---

## Core Logic

### CSV Parser (`src/lib/csvParser.ts`)

Parses a raw CSV string into an array of plain objects keyed by header name.

Process:
1. Split on newlines, trim each line, drop blank lines.
2. First line is treated as the header row; split on commas.
3. Each remaining line is zipped against the headers to produce a `RawCSVRow` (`Record<string, string>`).

All values remain strings at this stage - type coercion happens in the validator.

### Validator (`src/lib/validator.ts`)

`validateAndTransformRow(row)` converts a `RawCSVRow` into a fully-typed `Client` object.

Steps:
1. Check each required string field is non-empty; push missing field keys into `missingFields[]`.
2. Validate enum fields (`client_type`, `source_of_funds`, `kyc_status`) against their allowed sets.
3. Parse boolean fields (`pep_status`, `sanctions_screening_match`, `adverse_media_flag`, `documentation_complete`) - accepts `TRUE`/`FALSE` case-insensitively.
4. Parse `annual_income` as a number; treat non-numeric values as missing.
5. Call `assessRisk()` with the parsed partial to compute `riskClassification` and `riskExplanation`.
6. Set `recordStatus`: `GOOD` if `missingFields` is empty, `INCOMPLETE` otherwise.

The validator never throws. Every row produces a `Client` regardless of data quality - bad rows are marked `INCOMPLETE` and surfaced in the Upload Summary screen.

### Risk Engine (`src/lib/riskEngine.ts`)

`assessRisk(client)` accepts a `Partial<Client>` so it can be called both during CSV import and live in the New Client form before the record is complete.

```
assessRisk(partial)
  -> assessHighRisk(partial)  // returns RiskExplanation[] for each trigger that fires
     if any HIGH triggers -> return { level: 'HIGH', explanations }
  -> assessMediumRisk(partial)
     if any MEDIUM triggers -> return { level: 'MEDIUM', explanations }
  -> return { level: 'LOW', explanations: [] }
```

Each `RiskExplanation` records the rule name, the field that triggered it, and the actual value - this is stored on the client record and displayed verbatim in the Risk Audit Trail section of the client detail view.

### Storage (`src/lib/storage.ts`)

Four functions, all synchronous:

| Function | Purpose |
|----------|---------|
| `loadClients()` | Parse `localStorage['sentinel_clients']`; return `[]` on error or empty |
| `saveClients(clients)` | Serialize full array and overwrite the key |
| `addClient(client)` | Load existing, append, save |
| `hasData()` | Return `true` if at least one client exists |

The entire client list is serialized as a single JSON blob on every write. This is appropriate for the scale (hundreds of records) and avoids any indexing complexity.

---

## Architectural Considerations

**Offline-first.** No network requests are made. Sentinel runs entirely in the browser with localStorage as the database. This means data is per-device and per-browser; sharing records requires exporting CSV.

**Regulatory change.** Risk rules are centralised in `constants.ts` (country lists, income threshold, fund source lists) and `riskEngine.ts`. Adding a new HIGH-risk country is a one-line change to `HIGH_RISK_COUNTRIES`. No rules are embedded in UI components.

**Multi-branch.** The branch filter is a URL param and a context value. The New Client form pre-fills the branch from context and derives the Relationship Manager dropdown from existing records for that branch, so new clients slot naturally into the branch's existing RM list.

**No backend dependency.** The assessment described in the requirements is intentionally a frontend-only tool. If a server-side audit log or multi-user sync were required, `storage.ts` is the single file to replace - the rest of the app calls only `loadClients`, `saveClients`, `addClient`, and `hasData`.
