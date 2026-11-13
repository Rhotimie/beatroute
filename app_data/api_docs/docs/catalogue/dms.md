# dms

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| GET | `dms/van-inventory/stock-reconcile/get-request` | kotlin | `getVanReconciliationDetails` | `-` | `VanReconciliationData` |
| POST | `dms/van-inventory/stock-reconcile/status-update` | kotlin | `confirmVanReconciliationDetails` | `SubmitVanReconcileStatusRequest` | `SubmitVanReconcileStatusResponse` |
| POST | `dms/van-inventory/stock-request/create` | kotlin | `createVanInventoryStock` | `VanStockRequest` | `BaseApiResponse` |
| POST | `dms/van-inventory/stock-request/index` | kotlin | `getVanInventoryStockRequested` | `VanStockViewRequest` | `VanStockDetail` |
| GET | `dms/van-inventory/stock-request/last-stock-request-skus` | kotlin | `getLastStockRequest` | `-` | `LastOrderResponse` |
| POST | `dms/van-inventory/stock-request/update` | kotlin | `updateVanInventoryStock` | `VanStockUpdateRequest` | `BaseApiResponse` |
| POST | `dms/van-inventory/stock-request/view` | kotlin | `getVanInventoryView` | `-` | `VanStockViewResponse` |
| GET | `dms/van-inventory/van/view` | kotlin | `getVanView` | `-` | `VanViewResponse` |
| GET | `dms/van-inventory/van/view/last-reconciliation-date` | kotlin | `getReconciliationDate` | `-` | `ReconcilationDetailResponse` |
