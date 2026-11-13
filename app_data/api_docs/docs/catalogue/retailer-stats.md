# retailer-stats

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| GET | `v1/retailer-stats/status-counts` | kotlin | `getRetailerStatusCount` | `-` | `RetailerStatus` |
| GET | `v1/retailer-stats/subtype-stats` | kotlin | `getSubtypeCount` | `-` | `ArrayList<SubtypeCountDao>` |
