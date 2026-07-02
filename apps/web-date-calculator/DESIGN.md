# Design Guidelines — 날짜 계산기

## Stitch

- URL: https://stitch.withgoogle.com/projects/18356957827395249331?node-id=c203e35a47a44cabb488c4b5c0bfe3fa
- Export: [.stitch/manifest.json](./.stitch/manifest.json) (fallback — login required for live export)

## awesome-design-md base

- Source: `cal` (Cal.com)
- Raw: https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/cal/DESIGN.md

## Tokens

| Role          | Value   | Notes             |
| ------------- | ------- | ----------------- |
| canvas        | #ffffff | page background   |
| surface-card  | #f5f5f5 | main input card   |
| primary       | #111111 | CTA button        |
| primary-hover | #242424 | CTA hover         |
| ink           | #111111 | headings          |
| muted         | #6b7280 | secondary text    |
| footer        | #101010 | footer background |
| footer-text   | #a1a1aa | footer links      |

## Components (@1-blue/ui)

Card, Button, Calendar, Input, Switch, Label, Tabs, ToggleGroup, Badge, Accordion, Popover

## Ad slots

1. `ad-slot-below-hero` — below page subtitle
2. `ad-slot-below-result` — below tab content / result

## Layout

- Mobile-first, max-width 720px centered
- Touch targets ≥ 44px (h-11 buttons/inputs)
