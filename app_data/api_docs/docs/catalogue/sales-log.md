# sales-log

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| POST | `v1/sales-log/create` | retrofit | `submitSalesLog` | `SubmitSalesLogHeader` | `DataPostRequest` |
| POST | `v1/sales-log/fetch-sku-by-serial-number` | kotlin | `fetchSkubySerialNumber` | `SkuSerialNumber` | `Product` |
| GET | `v1/sales-log/get-sales-info` | retrofit | `getInfoBandForSkuSales` | `-` | `ArrayList<DataSkuSalesInfo>` |
| GET | `v1/sales-log/view` | retrofit | `getSalesLogFromServer` | `-` | `GetSalesLogfromServer` |
