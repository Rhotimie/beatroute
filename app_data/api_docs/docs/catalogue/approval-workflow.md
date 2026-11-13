# approval-workflow

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| GET | `/v1/approval-workflow/pending-approvals` | kotlin | `getExpenseApprovalUsers` | `-` | `List<ExpenseApprovalUser>` |
| GET | `/v1/approval-workflow/pending-approvals` | kotlin | `getWorkflowApprovalRequests` | `-` | `List<PendingOrder>` |
