# tour-plan

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| GET | `v1/tour-plan/by-date` | kotlin | `tourPlanByDate` | `-` | `TourPlanByDate` |
| POST | `v1/tour-plan/create` | kotlin | `tourPlanCreate` | `TourPlanRequest` | `TourPlanActionResponse` |
| GET | `v1/tour-plan/current-plan-missed-schedule` | kotlin | `getMissedSchedules` | `-` | `MissedScheduleResponse` |
| POST | `v1/tour-plan/delete` | kotlin | `tourPlanDelete` | `TourPlanDeleteRequest` | `TourPlanActionResponse` |
| GET | `v1/tour-plan/list` | kotlin | `tourPlanList` | `-` | `ArrayList<TourPlanListItem>` |
| POST | `v1/tour-plan/reassess` | kotlin | `tourPlanReassess` | `TourPlanReassessRequest` | `TourPlanActionResponse` |
| POST | `v1/tour-plan/reassess` | kotlin | `tourPlanReassessWithInputs` | `TourPlanRequest` | `TourPlanActionResponse` |
| POST | `v1/tour-plan/update` | kotlin | `tourPlanUpdate` | `TourPlanRequest` | `TourPlanActionResponse` |
| GET | `v1/tour-plan/view` | kotlin | `tourPlanView` | `-` | `TourPlanDetail` |
