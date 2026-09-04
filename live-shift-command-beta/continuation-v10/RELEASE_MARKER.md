# V10 Production Release Marker

Feature commit: `265f15bf1525d872fb37216ad9f2814103a68500`
Builder correction commit: `d593302429f5abd6952d258cf0e4ac9aae65b6d5`

Validated before this promotion:
- Live Shift V10 Acceptance run `33852771609`: SUCCESS
- Live Shift Handoff Guard run `33852771439`: SUCCESS
- Previous promotion run `33852395169` stopped safely before Vercel because the old builder requested retired `/api/base` assets; production was untouched.
- Corrected builder harvests exact V9 shell assets from current normal static production paths.

Release scope:
- shift-wide completed-hour verification backlog across all shifts/days
- rapid oldest-first Good / Scrap / Rework catch-up
- offline verification outbox with pending-sync truth
- manager verification completeness indicator
- AI World verification trust on intentional AI calls only
- corrected production smoke test with no `curl | grep -q` false failure

Deployment target remains ONLY the existing projects and regular URLs:
- Manager `prj_ETPejWyItkL7iE586cO4CbGlZWk6` → `https://live-shift-command-v74.vercel.app`
- Mobile `prj_Rq7aASOrQ6zFXzoBsqtJPHCt72ON` → `https://live-shift-command-v741-mobile.vercel.app`
