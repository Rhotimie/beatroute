# retailer-visit-target

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| POST | `v1/retailer-visit-target/index` | kotlin | `getRetailerVisitTargetWithFilter` | `FilterBody` | `ArrayList<RetailerVisitTarget>` |
| GET | `v1/retailer-visit-target/pending-approval-customers-count` | kotlin | `getPendingApprovalCustomersCount` | `-` | `OtherTaskCountResponse` |
| POST | `v1/retailer-visit-target/update` | kotlin | `updateRetailerVisitTarget` | `UpdateRetailerVisitTargetRequest` | `RetailerStatusResponse` |
