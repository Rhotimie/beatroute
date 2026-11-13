# expense-response

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| POST | `/v1/expense-response/approve-claims` | kotlin | `submitExpenseClaimApproval` | `ExpenseClaimApprovalRequest` | `ApprovalResponse` |
| POST | `/v1/expense-response/approve-users` | kotlin | `submitExpenseUserApproval` | `ExpenseUserApprovalRequest` | `ApprovalResponse` |
| GET | `/v1/expense-response/master-list` | kotlin | `getExpenseClaimsList` | `-` | `ArrayList<ExpenseClaimResponse>` |
