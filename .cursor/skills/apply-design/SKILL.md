---
name: apply-design
description: >-
  Implements UI from DESIGN.md, Stitch, or Figma using @1-blue/ui (shadcn).
  Use in Phase 2 after plan-service strategy and create-service scaffold.
  Match layout, tokens, ad slots, and component list in app _components.
---

# apply-design

## When to use

- Phase 2 implementation with finalized `apps/{app}/DESIGN.md`
- Stitch URL or awesome-design-md tokens documented
- User asks to build UI from design reference

## Prerequisites

- [plan-service](../plan-service/SKILL.md) strategy done (or equivalent DESIGN.md)
- App scaffolded or template path known

## Steps

1. Read `DESIGN.md`: Stitch link, color tokens, component list, ad slot ids
2. Map to `@1-blue/ui`: Card, Button, Calendar, Input, Switch, Accordion, Tabs, etc.
3. Implement in `apps/{prefix}-{slug}/src/app/_components/` (arrow functions)
4. Match mobile-first layout from Stitch / DESIGN.md
5. web-static: render ad placeholder divs at documented slot ids
6. Do not invent a new palette if DESIGN.md specifies awesome-design-md base

## Reference

See [reference.md](./reference.md)
