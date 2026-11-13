# distributor-stock

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| POST | `v1/distributor-stock/create` | retrofit | `submitDistributorStock` | `SubmitStockHeader` | `DataPostRequest` |
| GET | `v1/distributor-stock/view` | retrofit | `getDistributorStockFromServer` | `-` | `ArrayList<DistributerStockViewData>` |
