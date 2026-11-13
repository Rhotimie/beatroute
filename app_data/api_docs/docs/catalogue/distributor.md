# distributor

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| GET | `v1/distributor/distributor-chart-data` | retrofit | `getChartData` | `-` | `ChartData` |
| GET | `v1/distributor/get-pending-order` | retrofit | `getPendingOrderList` | `-` | `ArrayList<DistributorPendingOrder>` |
| GET | `v1/distributor/get-pending-sku` | retrofit | `getPendingSkuList` | `-` | `ArrayList<DistributorOrderSummaryProduct>` |
| GET | `v1/distributor/history` | retrofit | `viewDistributorHistory` | `-` | `DataHistory` |
| GET | `v1/distributor/outstanding` | retrofit | `getDistributorListforState` | `-` | `ArrayList<Distributor>` |
| GET | `v1/distributor/outstanding` | kotlin | `getDistributorList` | `-` | `ArrayList<Distributor>` |
| GET | `v1/distributor/product-summary` | retrofit | `getOrderSummaryForProduct` | `-` | `ArrayList<DistributorOrderSummaryProduct>` |
| GET | `v1/distributor/retailer-order-summary` | retrofit | `getOrderSummaryForRStore` | `-` | `ArrayList<DistributorOrderSummaryStore>` |
| GET | `v1/distributor/search-distributor` | retrofit | `searchDistributorList` | `-` | `ArrayList<Distributor>` |
| POST | `v1/distributor/search-distributor-by-distance` | retrofit | `searchDistributorByDistance` | `DistributorHeader100km` | `ArrayList<Distributor>` |
| GET | `v1/distributor/send-summary-email` | retrofit | `sendMail` | `-` | `DataPostRequest` |
| POST | `v1/distributor/update` | retrofit | `updateDistributor` | `Distributor` | `DataPostRequest` |
| GET | `v1/distributor/update-location` | retrofit | `updateDistributorLocation` | `-` | `DataPostRequest` |
| GET | `v1/distributor/view` | retrofit | `viewDistributor` | `-` | `Distributor` |
