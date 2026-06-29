# Design Guidelines — {{APP_NAME}}

## Stitch

- URL: (Stitch project link — fill after external design)
- Reference screen: mobile-first single page

## awesome-design-md base

- Source: (e.g. `cal` — https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/cal)
- Raw: `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/{name}/DESIGN.md`

## Tokens

| Role         | Value   | Notes             |
| ------------ | ------- | ----------------- |
| canvas       | #ffffff | page background   |
| surface-card | #f5f5f5 | main input card   |
| primary      | #111111 | primary CTA       |
| ink          | #111111 | headings          |
| muted        | #6b7280 | secondary text    |
| footer       | #101010 | footer background |

Override per app; default above matches `cal` for date utilities.

## Components (@1-blue/ui)

- List components used: Card, Button, Calendar, Input, Switch, Label, Accordion, …

## Ad slots (web-static)

1. `ad-slot-below-hero` — below page subtitle
2. `ad-slot-below-result` — below main result

## Layout

- Mobile-first, single column
- Max content width ~720px centered
- Touch targets ≥ 44px

## Phase 1

Strategy (DESIGN pick, Stitch prompt, SEO): use Cursor skill **plan-service**.

## Phase 2

Implementation: **create-service** + **apply-design**.
