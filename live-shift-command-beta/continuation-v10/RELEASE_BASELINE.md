# V10 Live Baseline Lock

This is the exact live deployment baseline being evolved into V10. Re-check these heads before any preview or production promotion.

## Manager web baseline

- Vercel project: `live-shift-command-v74`
- Project ID: `prj_ETPejWyItkL7iE586cO4CbGlZWk6`
- Production deployment: `dpl_9htmWxc6jLdCW5SUpnLKp7zj2sfX`
- Production URL: `https://live-shift-command-v74.vercel.app`
- Deployment source: CLI / prebuilt; not Git-linked

Observed production load order:

1. `app1.js`
2. `app2.js`
3. `app3.js`
4. `lsc-intelligence.js`
5. `lsc-v8.js`
6. `manager-intelligence.js`
7. `lsc-command-v9.js`

## Mobile baseline

- Vercel project: `live-shift-command-v741-mobile`
- Project ID: `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON`
- Production deployment: `dpl_GsxQqw4seGRvtXqE1uupksyUKba9`
- Production URL: `https://live-shift-command-v741-mobile.vercel.app`
- Deployment source: CLI / prebuilt; not Git-linked

Observed mobile load order:

1. `app1.js`
2. `app2.js`
3. `app3.js`
4. `lsc-intelligence.js`
5. `lsc-v8.js`
6. `lsc-command-v9.js`

## Shared backend baseline

At the configuration-mapping checkpoint both live surfaces returned the same `/api/state` revision: `91`.

This proved that manager web and mobile already share the same source of truth. V10 must extend that existing state path; it must not create a second synchronization layer.

State/config already contains the manager-owned production configuration and schedule versions. V10 adds scoped `config.v10` capability flags and optional `current.processProduction[]` only. Existing configuration keys remain authoritative and must round-trip unchanged.

## Existing capabilities not to duplicate

V8/V9 already own downtime, canonical code selection, 4M, voice/photo/type capture, AI classification/enrichment, quality, responders, resolution verification, Shift Recall, schedule versions, cross-midnight ownership, hot memory, permanent Calendar Memory, manager ratings, response intelligence, quality/process intelligence, solution memory, evidence ledger and the Morning Meeting Brief.

V10 additions are intentionally limited to the missing capabilities:

- shared process/run/hourly Good Actual evidence
- simple mobile Process Actual capture
- Calendar Day Reconstruction by process run/hour
- strict cross-shift rate/capacity decision gate
- process/capacity context injected into the existing AI path
- capacity/process enhancement of the existing Morning Meeting Brief
- manager-only configuration enforcement on mobile

## Promotion rule

Do not promote from stale GitHub `main`. Build the V10 release from the live baseline above or a verified newer deployment head. If either live project gets a newer production deployment, compare it before continuing so V10 never overwrites a newer fix.