# retailer-stock

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| POST | `v1/retailer-stock/create` | retrofit | `submitRetailerStock` | `SubmitStockHeader` | `DataPostRequest` |
| GET | `v1/retailer-stock/view` | retrofit | `getRetailerStockFromServer` | `-` | `StockViewdata` |
