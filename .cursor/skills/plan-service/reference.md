# plan-service reference

## External links

| Resource | URL |
|----------|-----|
| awesome-design-md repo | https://github.com/VoltAgent/awesome-design-md |
| design-md folder | https://github.com/VoltAgent/awesome-design-md/tree/main/design-md |
| Stitch DESIGN.md spec | https://stitch.withgoogle.com/docs/design-md/overview/ |
| Monorepo docs | [docs/MONOREPO.md](../../docs/MONOREPO.md) |
| Factory workflow | [docs/FACTORY-WORKFLOW.md](../../docs/FACTORY-WORKFLOW.md) |
| External deploy checklist | [docs/EXTERNAL-CHECKLIST.md](../../docs/EXTERNAL-CHECKLIST.md) |

## Raw DESIGN.md URL pattern

```text
https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/{folder}/DESIGN.md
```

Preview HTML (optional visual check):

```text
https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/{folder}/preview.html
```

## Recommended picks by category

### Date / time / scheduling

| Folder | Best for |
|--------|----------|
| `cal` | Date pickers, day counters, D-Day, 일수 계산 |
| `linear.app` | Minimal result display, single-task tools |
| `notion` | Long FAQ, explanatory copy |

### Developer / SaaS utility

| Folder | Best for |
|--------|----------|
| `vercel` | Monochrome dev tools |
| `stripe` | Forms, precision layout |
| `mintlify` | Doc-style tools with sections |

### Consumer

| Folder | Best for |
|--------|----------|
| `apple` | Premium simple tools |
| `airbnb` | Friendly, rounded |

## Full folder list (awesome-design-md)

Use GitHub API or repo tree when picking less common themes:

`airbnb`, `airtable`, `apple`, `binance`, `bmw`, `bmw-m`, `bugatti`, `cal`, `claude`, `clay`, `clickhouse`, `cohere`, `coinbase`, `composio`, `cursor`, `dell-1996`, `elevenlabs`, `expo`, `ferrari`, `figma`, `framer`, `hashicorp`, `hp`, `ibm`, `intercom`, `kraken`, `lamborghini`, `linear.app`, `lovable`, `mastercard`, `meta`, `minimax`, `mintlify`, `miro`, `mistral.ai`, `mongodb`, `nike`, `nintendo-2001`, `notion`, `nvidia`, `ollama`, `opencode.ai`, `pinterest`, `playstation`, `posthog`, `raycast`, `renault`, `replicate`, `resend`, `revolut`, `runwayml`, `sanity`, `sentry`, `shopify`, `slack`, `spacex`, `spotify`, `starbucks`, `stripe`, `supabase`, `superhuman`, `tesla`, `theverge`, `together.ai`, `uber`, `vercel`, `vodafone`, `voltagent`, `warp`, `webflow`, `wired`, `wise`, `x.ai`, `zapier`

## App `DESIGN.md` template (after Stitch)

Save under `apps/web-{slug}/DESIGN.md` (or ait/expo equivalent):

```markdown
# Design Guidelines — {APP_NAME}

## Stitch

- URL: (Stitch project link)
- Screen: mobile / desktop reference

## awesome-design-md base

- Source: cal (Cal.com)
- Raw: https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/cal/DESIGN.md

## Tokens (implementation)

| Role | Value | Notes |
|------|-------|-------|
| canvas | #ffffff | page background |
| surface-card | #f5f5f5 | main card |
| primary | #111111 | CTA button |
| footer | #101010 | footer bg |

## Components (@1-blue/ui)

- Card, Button, Calendar, Input, Switch, Label, Accordion

## Ad slots (web-static)

1. `#ad-slot-below-hero` — below subtitle
2. `#ad-slot-below-result` — below result card

## Layout

- Mobile-first, single column
- Max content width 720px centered
```

## Related skills

| Phase | Skill |
|-------|-------|
| 1 · Strategy | plan-service (this) |
| 2 · Scaffold + logic | create-service, scaffold-* |
| 2 · UI | apply-design |
| Deploy | deploy-vercel, add-adsense |
