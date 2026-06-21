# create-service reference

- [plan-service](../plan-service/SKILL.md) — Phase 1 strategy (run before this)
- [apply-design](../apply-design/SKILL.md) — UI from DESIGN.md / Stitch
- [FACTORY-WORKFLOW](../../docs/FACTORY-WORKFLOW.md)
- [EXTERNAL-CHECKLIST](../../docs/EXTERNAL-CHECKLIST.md)
- [MONOREPO](../../docs/MONOREPO.md)
- Template README under `apps/_template-*/README.md`

## create:app commands

```bash
pnpm create:app --type web-static --slug {slug} --name "{name}"
pnpm create:app --type web-api --slug {slug} --name "{name}"
pnpm create:app --type ait --slug {slug} --name "{name}"
pnpm create:app --type expo --slug {slug} --name "{name}"
```

## After scaffold

```bash
cp apps/web-{slug}/.env.example apps/web-{slug}/.env.local
pnpm dev:{slug}
```
