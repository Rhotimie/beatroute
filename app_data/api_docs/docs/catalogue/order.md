# order

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| POST | `v1/order/approve-reject` | kotlin | `fetchOrderApprovalStatus` | `OrderApproval` | `TaskMessage` |
| POST | `v1/order/cancel` | kotlin | `cancelOrderStatus` | `RemarksData` | `UpdateOrderResponse` |
| POST | `v1/order/create` | retrofit | `submitOrder` | `SubmitOrderHeader` | `DataPostRequest` |
| GET | `v1/order/delete` | retrofit | `deletePendingOrder` | `-` | `DataPostRequest` |
| POST | `v1/order/get-pending-orders` | kotlin | `getPendingOrder` | `OrderRequestDao` | `ArrayList<OutOfDeliveryOrderItemResponse>` |
| GET | `v1/order/index` | kotlin | `fetchorderapprovalslist` | `-` | `ArrayList<OrdersPendingData>` |
| GET | `v1/order/pending-orders-to-approve` | kotlin | `getPendingOrders` | `-` | `List<PendingOrder>` |
| GET | `v1/order/sold-msl-fsl-mtd` | kotlin | `getProductMtd` | `-` | `ArrayList<Mtd_MSL>` |
| GET | `v1/order/view` | retrofit | `getOrderFromServer` | `-` | `GetOrderFromServer` |
