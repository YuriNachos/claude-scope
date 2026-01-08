# Widget Styles Reference — Implementation Guide

**Date:** 2026-01-08
**Purpose:** Complete reference of all widget style outputs for implementation

This document contains exact output specifications for every widget style. Use this as the source of truth during implementation.

---

## Convention Legend

| Symbol | Meaning |
|--------|---------|
| `N` | Variable number (e.g., token count, cost, duration) |
| `X` | Variable text (e.g., branch name, model name) |
| `█` | Progress bar filled character |
| `░` | Progress bar empty character |
| `🤖` | Emoji (varies by style) |
| `⠀` | Braille Pattern Blank (U+2800) - visible empty character |

---

## 1. ModelWidget

**Data source:** `data.model.display_name` (e.g., "Claude Opus 4.5")
**Data source:** `data.model.id` (e.g., "claude-opus-4-5-20251101")

| Style | Format | Example |
|-------|--------|---------|
| balanced | `{display_name}` | `Claude Opus 4.5` |
| compact | Short name without "Claude " | `Opus 4.5` |
| playful | `🤖 {short_name}` | `🤖 Opus 4.5` |
| technical | `{model_id}` | `claude-opus-4-5-20251101` |
| symbolic | `◆ {short_name}` | `◆ Opus 4.5` |
| labeled | `Model: {short_name}` | `Model: Opus 4.5` |
| indicator | `● {short_name}` | `● Opus 4.5` |
| fancy | `[{short_name}]` | `[Opus 4.5]` |

**Short name logic:** Remove "Claude " prefix if present.

---

## 2. ContextWidget

**Data source:** `used` tokens, `context_window_size`, `percent` (0-100)

| Style | Format | Example |
|-------|--------|---------|
| balanced | `[{progress_bar}] {percent}%` | `[████░░░] 71%` |
| compact | `{percent}%` | `71%` |
| playful | `🧠 [{progress_bar}] {percent}%` | `🧠 [████░░░] 71%` |
| verbose | `{used_formatted} / {max_formatted} tokens ({percent}%)` | `142,847 / 200,000 tokens (71%)` |
| symbolic | `▮▮▮▮▯ {percent}%` | `▮▮▮▮▯ 71%` |
| compact-verbose | `{percent}% ({used_k}/{max_k})` | `71% (142K/200K)` |
| indicator | `● {percent}%` | `● 71%` |
| fancy | `⟨{percent}%⟩` | `⟨71%⟩` |

**Progress bar:** 10 characters wide, `█` for filled, `░` for empty.
**Number formatting:** `142847` → `142K`, `200000` → `200K` (for compact-verbose).

---

## 3. CostWidget

**Data source:** `data.cost.total_cost_usd` (always formatted with 2 decimals)

| Style | Format | Example |
|-------|--------|---------|
| balanced | `${cost}` | `$0.42` |
| compact | `${cost}` | `$0.42` |
| playful | `💰 ${cost}` | `💰 $0.42` |
| labeled | `Cost: ${cost}` | `Cost: $0.42` |
| indicator | `● ${cost}` | `● $0.42` |
| fancy | `«${cost}»` | `«$0.42»` |

**Cost formatting:** Always `toFixed(2)` → `$0.00`, `$0.42`, `$1.23`.

---

## 4. DurationWidget

**Data source:** `data.cost.total_duration_ms` (milliseconds)

| Style | Format | Example |
|-------|--------|---------|
| balanced | `{h}h {m}m {s}s` | `1h 1m 5s` |
| compact | `{h}h{m}` | `1h1m` |
| playful | `⌛ {h}h {m}m` | `⌛ 1h 1m` |
| technical | `{ms}ms` | `3665000ms` |
| labeled | `Time: {h}h {m}m {s}s` | `Time: 1h 1m 5s` |
| indicator | `● {h}h {m}m {s}s` | `● 1h 1m 5s` |
| fancy | `⟨{h}h {m}m {s}s⟩` | `⟨1h 1m 5s⟩` |

**Time calculation:**
- seconds = `ms / 1000`
- hours = `seconds / 3600`
- minutes = `(seconds % 3600) / 60`
- secs = `seconds % 60`

---

## 5. GitWidget (branch)

**Data source:** `git.status().current` (branch name)

| Style | Format | Example |
|-------|--------|---------|
| balanced | `{branch}` | `main` |
| compact | `{branch}` | `main` |
| playful | `🔀 {branch}` | `🔀 main` |
| verbose | `branch: {branch} (HEAD)` | `branch: main (HEAD)` |
| indicator | `● {branch}` | `● main` |
| labeled | `Git: {branch}` | `Git: main` |
| fancy | `[{branch}]` | `[main]` |

---

## 6. GitChangesWidget

**Data source:** `insertions`, `deletions` from git diff

| Style | Format | Example |
|-------|--------|---------|
| balanced | `+{insertions} -{deletions}` | `+142 -27` |
| compact | `+{insertions}/-{deletions}` | `+142/-27` |
| playful | `⬆{insertions} ⬇{deletions}` | `⬆142 ⬇27` |
| verbose | `+{insertions} insertions, -{deletions} deletions` | `+142 insertions, -27 deletions` |
| technical | `{insertions}/{deletions}` | `142/27` |
| symbolic | `▲{insertions} ▼{deletions}` | `▲142 ▼27` |
| labeled | `Diff: +{insertions} -{deletions}` | `Diff: +142 -27` |
| indicator | `● +{insertions} -{deletions}` | `● +142 -27` |
| fancy | `⟨+{insertions}\|-{deletions}⟩` | `⟨+142\|-27⟩` |

**Note:** Only show insertions if > 0, only show deletions if > 0.

---

## 7. GitTagWidget

**Data source:** `git.latestTag()` or null

| Style | Format | With Tag | No Tag |
|-------|--------|----------|--------|
| balanced | `{tag}` | `v0.5.4` | `—` |
| compact | `{tag}` (no "v" prefix) | `0.5.4` | `—` |
| playful | `🏷️ {tag}` | `🏷️ v0.5.4` | `🏷️ —` |
| verbose | `version {tag}` | `version v0.5.4` | `version: none` |
| labeled | `Tag: {tag}` | `Tag: v0.5.4` | `Tag: none` |
| indicator | `● {tag}` | `● v0.5.4` | `● —` |
| fancy | `⟨{tag}⟩` | `⟨v0.5.4⟩` | `⟨—⟩` |

**Compact format:** Remove "v" prefix if present → `v0.5.4` → `0.5.4`.

---

## 8. LinesWidget

**Data source:** `data.cost.total_lines_added`, `data.cost.total_lines_removed`

| Style | Format | Example |
|-------|--------|---------|
| balanced | `+{added}/-{removed}` | `+142/-27` |
| compact | `+{added}-{removed}` | `+142-27` |
| playful | `➕{added} ➖{removed}` | `➕142 ➖27` |
| verbose | `+{added} added, -{removed} removed` | `+142 added, -27 removed` |
| labeled | `Lines: +{added}/-{removed}` | `Lines: +142/-27` |
| indicator | `● +{added}/-{removed}` | `● +142/-27` |
| fancy | `⟨+{added}\|-{removed}⟩` | `⟨+142\|-27⟩` |

**Colors:** `+{added}` in green, `-{removed}` in red.

---

## 9. ConfigCountWidget

**Data source:** `claudeMdCount`, `rulesCount`, `mcpCount`, `hooksCount`

| Style | Format | Example |
|-------|--------|---------|
| balanced | `CLAUDE.md:{n} │ rules:{n} │ MCPs:{n} │ hooks:{n}` | `CLAUDE.md:2 │ rules:5 │ MCPs:3 │ hooks:1` |
| compact | `{n} docs │ {n} rules │ {n} MCPs │ {n} hook` | `2 docs │ 5 rules │ 3 MCPs │ 1 hook` |
| playful | `📄 {balanced} │ 📜 {balanced} │ 🔌 {balanced} │ 🪝 {balanced}` | `📄 CLAUDE.md:2 │ 📜 rules:5 │ 🔌 MCPs:3 │ 🪝 hooks:1` |
| verbose | `{n} CLAUDE.md │ {n} rules │ {n} MCP servers │ {n} hook` | `2 CLAUDE.md │ 5 rules │ 3 MCP servers │ 1 hook` |

**Note:** Only show sections with count > 0. Skip zero-count sections entirely.

**Compact pluralization:** "1 hook" (singular), "3 hooks" (plural).

---

## 10. PokerWidget

**Data source:** `holeCards` (2 cards), `boardCards` (5 cards), `handResult`

### Current Format (used by balanced, compact, playful)

```
Hand: (K♠) A♠ | Board: 2♠ 3♠ 4♠ 5♠ 6♠ → Straight Flush! 🃏
```

**Rules:**
- Participating cards: `(card)` with bold formatting
- Non-participating: `card` without brackets
- Suits: ♥♦ are red, ♠♣ are gray
- Result emoji: varies by hand strength

### Compact-Verbose Style

```
(K♠)A♠ | 2♠3♠4♠5♠6♠ → SF (Straight Flush)
```

**Rules:**
- No labels ("Hand:", "Board:")
- Cards compact (no spaces between hole cards, no spaces between board cards)
- Hand abbreviation: "SF" for Straight Flush, "FH" for Full House, etc.

**Hand Abbreviations:**
- `RF` - Royal Flush
- `SF` - Straight Flush
- `4K` - Four of a Kind
- `FH` - Full House
- `FL` - Flush
- `ST` - Straight
- `3K` - Three of a Kind
- `2P` - Two Pair
- `1P` - One Pair
- `HC` - High Card
- `—` - Nothing

---

## 11. EmptyLineWidget

**All styles:** Return Braille Pattern Blank `⠀` (U+2800)

This character appears empty but occupies cell width, ensuring the line renders.

---

## Appendix: Common Helper Functions

### withLabel(prefix, value)
```typescript
// Input: withLabel("Model", "Opus 4.5")
// Output: "Model: Opus 4.5"
```

### withIndicator(value)
```typescript
// Input: withIndicator("Opus 4.5")
// Output: "● Opus 4.5"
```

### withFancy(value)
```typescript
// Input: withFancy("Opus 4.5")
// Output: "«Opus 4.5»"
```

### withBrackets(value)
```typescript
// Input: withBrackets("Opus 4.5")
// Output: "[Opus 4.5]"
```

### withAngleBrackets(value)
```typescript
// Input: withAngleBrackets("71%")
// Output: "⟨71%⟩"
```

### formatTokens(n)
```typescript
// Input: formatTokens(142847)
// Output: "142K"
// Input: formatTokens(200000)
// Output: "200K"
```

### progressBar(percent, width = 10)
```typescript
// Input: progressBar(71, 10)
// Output: "███████░░░" (7 filled, 3 empty)
```

---

## Implementation Checklist

For each widget:
- [ ] Create `renderers/` subdirectory
- [ ] Create renderer class for each style
- [ ] Implement `render()` method with exact format from this doc
- [ ] Add `setStyle()` method to widget
- [ ] Wire up renderer selection in widget
- [ ] Write tests for each style
- [ ] Run tests and verify outputs match examples
