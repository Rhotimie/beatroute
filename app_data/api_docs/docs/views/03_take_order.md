# Take order and submit order

> Samples are synthesised from field names and types. No real request or response was observed. See NAMING.md.

Products and schemes are read with GETs. The order itself is not posted by the screen: it is queued locally and `ActivitySyncService` posts it, so the write path starts at the queue.

Screens: prototype `productList, scheme, orderSummary, drafts`; app `ProductListViewKotlin, SchemeDialogActivity, OrderSummaryViewTypeActivityNew, DraftOrderListActivity`.

## Endpoints

### GET `v1/sku/price`
`kotlin.getSKUList`

**Query**
| name | type |
|---|---|
| `page` | `String` |
| `last_updated_on` | `String` |
| `distributorOnly` | `String` |

**Sample request**
```json
{
  "query": {
    "page": "1",
    "last_updated_on": "2026-11-13 09:02:00",
    "distributorOnly": "distributorOnly"
  }
}
```

**Response data** `ArrayList<Product>` (list)

| server name | Jackson name | type | flags |
|---|---|---|---|
| `additional_margin` | `additional_margin` | `double` |  |
| `sale_price` | `sale_price` | `String` |  |
| `sku` | `sku` | `String` |  |
| `skuprice` | `skuprice` | `String` |  |
| `uom` | `uom` | `String` |  |

**Sample response**
```json
{
  "data": [
    {
      "additional_margin": 1.5,
      "sale_price": "sale_price",
      "sku": "1",
      "skuprice": "skuprice",
      "uom": "uom"
    }
  ],
  "success": true,
  "sendStatus": 200,
  "sendmessage": "OK",
  "pagination": {
    "currentPage": "1",
    "pageCount": "1",
    "perPage": "1",
    "totalCount": "1"
  }
}
```

### GET `v1/scheme/index`
`retrofit.getScheme`

**Query**
| name | type |
|---|---|
| `distributor` | `String` |
| `sku` | `int` |
| `retailer_id` | `String` |

**Sample request**
```json
{
  "query": {
    "distributor": "distributor",
    "sku": 1,
    "retailer_id": "1"
  }
}
```

**Response data** `ArrayList<Scheme>` (list)

| server name | Jackson name | type | flags |
|---|---|---|---|
| `(none)` | `description` | `String` | accessor_only |
| `(none)` | `endDate` | `String` | accessor_only |
| `(none)` | `id` | `String` | accessor_only |
| `(none)` | `schemeId` | `String` | accessor_only |
| `(none)` | `startDate` | `String` | accessor_only |
| `(none)` | `title` | `String` | accessor_only |

**Sample response**
```json
{
  "data": [
    {}
  ],
  "success": true,
  "sendStatus": 200,
  "sendmessage": "OK"
}
```

### GET `v1/sku/get-all-list`
`retrofit.getAllSKUList`

**Sample request**
(no parameters)

**Response data** `ArrayList<Product>` (list)

| server name | Jackson name | type | flags |
|---|---|---|---|
| `additional_margin` | `additional_margin` | `double` |  |
| `sale_price` | `sale_price` | `String` |  |
| `sku` | `sku` | `String` |  |
| `skuprice` | `skuprice` | `String` |  |
| `uom` | `uom` | `String` |  |

**Sample response**
```json
{
  "data": [
    {
      "additional_margin": 1.5,
      "sale_price": "sale_price",
      "sku": "1",
      "skuprice": "skuprice",
      "uom": "uom"
    }
  ],
  "success": true,
  "sendStatus": 200,
  "sendmessage": "OK"
}
```

### POST `v1/order/create`
`retrofit.submitOrder`

**Request body** `SubmitOrderHeader`

| server name | Jackson name | type | flags |
|---|---|---|---|
| `activity_address` | `activity_address` | `String` |  |
| `approval_required` | `approval_required` | `boolean` |  |
| `beatplanid` | `beatplanid` | `String` |  |
| `cash` | `cash` | `double` |  |
| `confirmation_sku_count` | `confirmation_sku_count` | `String` |  |
| `cross_sell_mtd_percent` | `cross_sell_mtd_percent` | `int` |  |
| `distributor_id` | `distributor_id` | `String` |  |
| `fsl_mtd_percent` | `fsl_mtd_percent` | `int` |  |
| `hasreturns` | `hasreturns` | `boolean` |  |
| `image_binary` | `image_binary` | `String` |  |
| `invoice_level_scheme_discount` | `invoice_level_scheme_discount` | `String` |  |
| `is_proposed_order` | `is_proposed_order` | `boolean` |  |
| `lat` | `lat` | `String` |  |
| `locationAcuuracy` | `locationAcuuracy` | `String` |  |
| `lon` | `lon` | `String` |  |
| `mode` | `mode` | `String` |  |
| `msl_mtd_percent` | `msl_mtd_percent` | `int` |  |
| `orderId` | `orderId` | `String` |  |
| `ordertime` | `ordertime` | `String` |  |
| `payment_term_id` | `payment_term_id` | `int` |  |
| `payment_term_max_cap` | `payment_term_max_cap` | `String` |  |
| `photoURL` | `photoURL` | `String` |  |
| `proceed_sku_count` | `proceed_sku_count` | `String` |  |
| `proposed_order_value` | `proposed_order_value` | `String` |  |
| `remarks` | `remarks` | `String` |  |
| `retailer` | `retailer` | `int` |  |
| `route_id` | `route_id` | `String` |  |
| `salesRep` | `salesRep` | `String` |  |
| `signature_image` | `signature_image` | `String` |  |
| `signature_image_binary` | `signature_image_binary` | `String` |  |
| `source` | `source` | `String` |  |
| `standard_margin` | `standard_margin` | `String` |  |
| `sendStatus` | `status` | `String` | name_disagree |
| `sync_validation_sku_count` | `sync_validation_sku_count` | `String` |  |
| `temp_retailer_id` | `temp_retailer_id` | `int` |  |
| `total_cross_sell` | `total_cross_sell` | `int` |  |
| `total_fsl` | `total_fsl` | `int` |  |
| `total_msl` | `total_msl` | `int` |  |
| `type` | `type` | `String` |  |
| `value` | `value` | `String` |  |
| `products` | `products` | `ArrayList<SubmitOrderDetail>` |  |
| `ship_to` | `ship_to` | `String` |  |
| `influencer` | `influencer` | `String` |  |
| `custom_attributes` | `custom_attributes` | `List<CustomQuestionModel>` |  |
| `is_multi_shipping` | `is_multi_shipping` | `boolean` |  |
| `(none)` | `hasReturns` | `boolean` | accessor_only |
| `(none)` | `paymentMode` | `String` | accessor_only |

**Sample request**
```json
{
  "body": {
    "activity_address": "activity_address",
    "approval_required": true,
    "beatplanid": "beatplanid",
    "cash": 12.5,
    "confirmation_sku_count": "1",
    "cross_sell_mtd_percent": 1,
    "distributor_id": "1",
    "fsl_mtd_percent": 1,
    "hasreturns": true,
    "image_binary": "https://example.com/file.jpg",
    "invoice_level_scheme_discount": "1",
    "is_proposed_order": true,
    "lat": "lat",
    "locationAcuuracy": "locationAcuuracy",
    "lon": "lon",
    "mode": "mode",
    "msl_mtd_percent": 1,
    "orderId": "orderId",
    "ordertime": "2026-11-13 09:02:00",
    "payment_term_id": 1,
    "payment_term_max_cap": "payment_term_max_cap",
    "photoURL": "https://example.com/file.jpg",
    "proceed_sku_count": "1",
    "proposed_order_value": "proposed_order_value",
    "remarks": "Sample text",
    "retailer": 1,
    "route_id": "1",
    "salesRep": "salesRep",
    "signature_image": "https://example.com/file.jpg",
    "signature_image_binary": "https://example.com/file.jpg",
    "source": "source",
    "standard_margin": "standard_margin",
    "sendStatus": "Active",
    "sync_validation_sku_count": "1",
    "temp_retailer_id": 1,
    "total_cross_sell": 12.5,
    "total_fsl": 12.5,
    "total_msl": 12.5,
    "type": "type",
    "value": "value",
    "products": [
      {
        "additional_margin": 1.5,
        "base_price": 12.5,
        "batch_details": [
          "<BatchDetail>"
        ],
        "discount": 12.5,
        "dispatch_sku_ref_id": "1",
        "invoice_id": "1",
        "is_cross_sell": 1,
        "is_fsl": 1,
        "is_msl": 1,
        "parentSchemeId": "parentSchemeId",
        "price": 12.5,
        "process_type": "process_type",
        "quantity": 2,
        "return_status": "Active",
        "return_status_remarks": "Sample text",
        "schemeId": "schemeId",
        "scheme_price": 12.5,
        "selling_base_price": 12.5,
        "selling_price": 12.5,
        "selling_quantity": 2,
        "sku": 1,
        "skuType": "skuType",
        "sold_cross_sell": 1,
        "sold_fsl": 1,
        "sold_msl": 1,
        "standard_margin": 1.5,
        "tax_id": "1",
        "tax_rate": 1.5,
        "type": 1,
        "group_id": "1",
        "discountBreakUp": {},
        "sauom": "<Sauom>"
      }
    ],
    "ship_to": "ship_to",
    "influencer": "influencer",
    "custom_attributes": [
      {
        "date": "2026-11-13 09:02:00",
        "image_binary": "https://example.com/file.jpg",
        "task_id": "1",
        "shouldDelete": true,
        "isUnsync": true,
        "isSyncing": true,
        "apply_on": "apply_on",
        "chain_config": "chain_config",
        "class_config": "class_config",
        "default_value": "default_value",
        "field_name": "Corner Mart",
        "field_type": "field_type",
        "id": 1,
        "is_disabled_gallery_upload": 1,
        "is_required": 1,
        "options": "options",
        "params": "<ParamsCustomFieldsDao>",
        "parent_field_id": 1,
        "parent_field_value": [
          "parent_field_value"
        ],
        "path": "path",
        "stage_config": "stage_config",
        "subtype_config": "subtype_config",
        "type": "type",
        "value": "value"
      }
    ],
    "is_multi_shipping": true
  }
}
```

**Response data** `DataPostRequest`

| server name | Jackson name | type | flags |
|---|---|---|---|
| `distributor_id` | `distributor_id` | `int` |  |
| `message` | `message` | `String` |  |
| `response` | `response` | `OpportunityResponseBean` |  |
| `result` | `result` | `boolean` |  |
| `retailer_id` | `retailer_id` | `int` |  |
| `retailer_stage` | `retailer_stage` | `String` |  |
| `retailer_status` | `retailer_status` | `String` |  |
| `retailer_status_reason` | `retailer_status_reason` | `String` |  |
| `status` | `status` | `String` |  |
| `task_id` | `task_id` | `int` |  |
| `contacts` | `contacts` | `ArrayList<ContactPerson>` |  |
| `retailerTeamMapping` | `retailerTeamMapping` | `ArrayList<RetailerTeamResponse>` |  |

**Sample response**
```json
{
  "data": {
    "distributor_id": 1,
    "message": "Sample text",
    "response": {
      "activation_id": 1,
      "approval_status": "Active",
      "avatar": "https://example.com/file.jpg",
      "campaign_id": 1,
      "campaign_status": 1,
      "created_by": 1,
      "created_by_name": "Corner Mart",
      "created_date": "2026-11-13 09:02:00",
      "designation_name": "Corner Mart",
      "details": [
        "<DetailsBean>"
      ],
      "disable_edit_after_approval": "disable_edit_after_approval",
      "id": 1,
      "modified_by": "modified_by",
      "modified_by_name": "Corner Mart",
      "modified_date": "2026-11-13 09:02:00",
      "rating": "rating",
      "rating_comment": "rating_comment",
      "retailer": "<Retailer>",
      "retailer_id": 1,
      "status": 1,
      "total_customer_participants": 12.5,
      "total_team_participants": 12.5,
      "transaction_campaign_id": "1",
      "transaction_campaign_name": "Corner Mart",
      "transaction_id": "1",
      "transaction_type": "transaction_type",
      "user_id": 1,
      "verification_reason": "verification_reason",
      "verification_status": 1
    },
    "result": true,
    "retailer_id": 1,
    "retailer_stage": "retailer_stage",
    "retailer_status": "Active",
    "retailer_status_reason": "Active",
    "status": "Active",
    "task_id": 1,
    "contacts": [
      {
        "date": "2026-11-13 09:02:00",
        "image_binary": "https://example.com/file.jpg",
        "task_id": "1",
        "shouldDelete": true,
        "isUnsync": true,
        "isSyncing": true,
        "department": "department",
        "designation": "designation",
        "email": "sam.rivera@example.com",
        "errorMessage": "Sample text",
        "id": 1,
        "isEdit": true,
        "last_updated_by": "2026-11-13 09:02:00",
        "last_updated_date": "2026-11-13 09:02:00",
        "mobile": "555-0101",
        "name": "Corner Mart",
        "retailer_id": 1,
        "timeStamp": "2026-11-13 09:02:00",
        "is_available": 1,
        "custom_attributes": [
          "<CustomQuestionModel>"
        ]
      }
    ],
    "retailerTeamMapping": [
      {
        "date": "2026-11-13 09:02:00",
        "image_binary": "https://example.com/file.jpg",
        "task_id": "1",
        "shouldDelete": true,
        "isUnsync": true,
        "isSyncing": true,
        "amount": 12.5,
        "company_id": "1",
        "created_at": "created_at",
        "distributor": "<Distributor>",
        "distributor_id": "1",
        "distributor_name": "Corner Mart",
        "id": "1",
        "retailer_id": "1",
        "route": "<Route>",
        "route_id": "1",
        "salesRep": "<SalesRep>",
        "sales_rep_id": "1",
        "sm": "<Sm>",
        "sm_id": "1",
        "tsm": "<Tsm>",
        "tsm_id": "1"
      }
    ]
  },
  "success": true,
  "sendStatus": 200,
  "sendmessage": "OK"
}
```

## Notes

- Write path: `service/ActivitySyncService.java:1599` -> `DBManager.submitOrder` (`DBManager.java:16011`) -> `C0571Dj.n1` (`C0571Dj.java:657`) -> `ApiInterface.submitOrder`. It posts any queued `Order` task marked syncing and not in error.
- Fixed header values set by the client: `status="New"`, `source="Mobile"`. Images go as base64 JPEG in `image_binary` and `signature_image_binary`.
- The header has one field `hasreturns` but two boolean accessors, `isHasReturns` and `isHasreturns`, so Jackson would send both `hasReturns` and `hasreturns`. The server name `locationAcuuracy` is spelled that way in the source (sic).
- Tax-inclusive price, tax and scheme price are computed on the client before the call (`DBManager.java:16143-16178`).
- The product screen is `takeOrder/ProductListViewKotlin` with `takeOrder/ProductViewModel`, which is partly undecompiled (see RECON.md).

## Not verified

- The hop from the order screen to the local queue (the Order insert) was not traced.
- Which SKU endpoint the product list actually calls: `v1/sku/price` is the likely one, `v1/sku/index` exists on the Ktor side.
