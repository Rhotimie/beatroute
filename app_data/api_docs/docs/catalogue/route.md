# route

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| GET | `v1/route/index` | kotlin | `getRouteList` | `-` | `ArrayList<DataRoute>` |
| POST | `v1/route/plan` | kotlin | `createPlan` | `CreatePlanRequest` | `CreatePlanResponse` |
