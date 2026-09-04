# V10 Web / Mobile Authority Boundary

This file is a regression contract.

## Manager web owns configuration

Manager web remains the only surface that can intentionally change:

- Company Goal / shift target
- plant MES target/rate configuration
- plant shift windows
- detached/process schedule windows
- effective dates for schedule versions
- future manager-owned V10 policy/config values

Those values live in the existing shared `state.config` and are consumed by mobile.

## Mobile owns floor evidence, not policy

Mobile may create or update operational evidence in the active shift:

- shift start/join and closeout workflow
- hourly shift Actual through the established workflow
- process-level Good Actual through V10
- downtime events
- Scrap / Rework events
- notes
- photos / typed / voice evidence
- responder timestamps
- recovery evidence / verification

Mobile must not expose write controls for manager-owned configuration.

## Shared-state direction

This is not two databases and not a replication system.

Both apps already use the same `/api/state` revisioned source of truth.

- manager configuration becomes visible to mobile on the next pull
- mobile evidence becomes visible to manager web on the next pull
- V10 keeps the same revision conflict/409 retry path

## Process Actual rule

Shift Actual and Process Actual are separate evidence dimensions:

- `current.production[]` = established shift hourly production
- `current.processProduction[]` = explicitly attributed process/run/hour Good Actual

V10 never infers or redistributes shift Actual into a process. Process Actual exists only when a user/integration explicitly records it.

## Quality rule

Scrap / Rework stays in the existing quality-event workflow. Process Actual records Good production only. This prevents double counting quality quantity in V8/V9 manager intelligence and V10 reconstruction.

## Corrections

A Process Actual correction for the same run + area + plant hour replaces the active value and appends the prior value to `corrections[]`. Corrections are evidence, not additional production.