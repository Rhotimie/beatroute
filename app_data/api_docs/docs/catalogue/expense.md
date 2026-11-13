# expense

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| GET | `/v1/expense/master` | kotlin | `getExpenseMaster` | `-` | `ArrayList<ExpenseMasterResponse>` |
| POST | `/v1/expense/ocr-extract` | kotlin | `extractExpenseOcr` | `OcrExtractRequest` | `OcrExtractResponse` |
