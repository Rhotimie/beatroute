# dispatchedorder

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| POST | `v1/dispatchedorder/cancel` | kotlin | `cancelProformaStatus` | `-` | `UpdateProformaResponse` |
| POST | `v1/dispatchedorder/create-dispatch` | retrofit | `submitDeliveryRelatedDispatch` | `SubmitDispatchHeader` | `DataPostRequest` |
| POST | `v1/dispatchedorder/delivery` | kotlin | `getDeliveryOrders` | `OrderRequestDao` | `ArrayList<DeliveryOrderItemResponse>` |
| GET | `v1/dispatchedorder/list-dispatch` | retrofit | `getDispatchList` | `-` | `DispatchListResponse` |
| POST | `v1/dispatchedorder/update` | retrofit | `updateDeliveryRelatedDispatch` | `SubmitDispatchHeader` | `DataPostRequest` |
| GET | `v1/dispatchedorder/view` | retrofit | `getDispatchFromServer` | `-` | `GetDispatchFromServer` |
| GET | `v1/dispatchedorder/view` | kotlin | `getDispatchFromServer` | `-` | `GetDispatchFromServer` |
