# payment

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| POST | `v1/payment/create` | retrofit | `submitPayment` | `SubmitPaymentHeader` | `DataPostRequest` |
| POST | `v1/payment/create-distributor-payment` | retrofit | `submitPrimaryPayment` | `SubmitPrimaryPaymentHeader` | `DataPostRequest` |
| GET | `v1/payment/view` | retrofit | `getPaymentFromServer` | `-` | `GetPaymentFromServer` |
