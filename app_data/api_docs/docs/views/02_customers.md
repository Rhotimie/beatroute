# Customer (retailer) list and detail

> Samples are synthesised from field names and types. No real request or response was observed. See NAMING.md.

The list is offline-first: the response is saved to the local SQLite copy and the screen mostly reads that copy. Detail is a single GET by id and is shared by about 20 screens.

Screens: prototype `retailers, retailer`; app `RetailersActivity, ItemFragment (list), RetailersViewActivity (detail)`.

## Endpoints

### POST `v1/retailer/index`
`kotlin.getFilterRetailerList`

**Query**
| name | type |
|---|---|
| `search` | `String` |
| `expand` | `String` |
| `page` | `int` |
| `pagination` | `boolean` |
| `retailerLimit` | `int` |

**Request body** `FilterBody`

| server name | Jackson name | type | flags |
|---|---|---|---|
| `(none)` | `filter` | `FilterRequest` | accessor_only |
| `(none)` | `sort` | `SortRequest` | accessor_only |

**Sample request**
```json
{
  "query": {
    "search": "search",
    "expand": "expand",
    "page": 1,
    "pagination": true,
    "retailerLimit": 1
  }
}
```

**Response data** `ArrayList<Retailer>` (list)

| server name | Jackson name | type | flags |
|---|---|---|---|
| `date` | `date` | `String` |  |
| `image_binary` | `image_binary` | `String` |  |
| `task_id` | `task_id` | `String` |  |
| `shouldDelete` | `shouldDelete` | `boolean` |  |
| `isUnsync` | - | `boolean` | no_accessor |
| `isSyncing` | - | `boolean` | no_accessor |
| `(none)` | `syncing` | `boolean` | accessor_only |
| `(none)` | `unsync` | `boolean` | accessor_only |
| `accuracyCapturedOnList` | `accuracyCapturedOnList` | `String` |  |
| `activityName` | `activityName` | `String` |  |
| `activity_address` | `activity_address` | `String` |  |
| `activity_id` | `activity_id` | `String` |  |
| `approval_required` | `approval_required` | `boolean` |  |
| `approval_status_detail` | `approval_status_detail` | `ApprovalStatusResponse` |  |
| `associate_ids` | `associate_ids` | `int[]` |  |
| `bankDetail` | `bankDetail` | `BankDetails` |  |
| `billToAddress` | `billToAddress` | `String` |  |
| `billToId` | `billToId` | `String` |  |
| `billToName` | `billToName` | `String` |  |
| `chain_id` | `chain_id` | `int` |  |
| `contact_person` | `contact_person` | `String` |  |
| `contact_person_pic` | `contact_person_pic` | `String` |  |
| `contact_person_pic_path` | `contact_person_pic_path` | `String` |  |
| `contacts` | `contacts` | `ArrayList<ContactPerson>` |  |
| `country` | `country` | `String` |  |
| `createdByUserRole` | `createdByUserRole` | `String` |  |
| `created_date` | `created_date` | `String` |  |
| `customFields` | `customFields` | `ArrayList<CustomFields>` |  |
| `days` | `days` | `String` |  |
| `deal_value` | `deal_value` | `String` |  |
| `disassociate_ids` | `disassociate_ids` | `int[]` |  |
| `distance` | `distance` | `String` |  |
| `distributor_name` | `distributor_name` | `String` |  |
| `district` | `district` | `String` |  |
| `email` | `email` | `String` |  |
| `errorMessage` | `errorMessage` | `String` |  |
| `fax` | `fax` | `String` |  |
| `group` | `group` | `String` |  |
| `image` | `image` | `String` |  |
| `influencerAddress` | `influencerAddress` | `String` |  |
| `influencerId` | `influencerId` | `String` |  |
| `influencerName` | `influencerName` | `String` |  |
| `isAssociated` | `isAssociated` | `Boolean` |  |
| `isFlaggedCustomer` | `isFlaggedCustomer` | `String` |  |
| `isNew` | `isNew` | `boolean` |  |
| `isSelected` | `isSelected` | `Boolean` |  |
| `is_available` | `is_available` | `String` |  |
| `is_cloud_image` | `is_cloud_image` | `String` |  |
| `is_location_locked` | `is_location_locked` | `String` |  |
| `is_new` | `is_new` | `Integer` |  |
| `is_old_version_activity` | `is_old_version_activity` | `boolean` |  |
| `landline` | `landline` | `String` |  |
| `latitude` | `latitude` | `String` |  |
| `latitudeCapturedOnList` | `latitudeCapturedOnList` | `String` |  |
| `locationAccuracy` | `locationAccuracy` | `String` |  |
| `location_accuracy` | `location_accuracy` | `String` |  |
| `location_lock_reason` | `location_lock_reason` | `String` |  |
| `longitude` | `longitude` | `String` |  |
| `longitudeCapturedOnList` | `longitudeCapturedOnList` | `String` |  |
| `mobile` | `mobile` | `String` |  |
| `mobile_validated` | `mobile_validated` | `String` |  |
| `modifiedByUserRole` | `modifiedByUserRole` | `String` |  |
| `modified_date` | `modified_date` | `String` |  |
| `newTag` | `newTag` | `String` |  |
| `pendingSinceDays` | `pendingSinceDays` | `int` |  |
| `persistence` | `persistence` | `String` |  |
| `pincode` | `pincode` | `String` |  |
| `preSignedS3URL` | `preSignedS3URL` | `String` |  |
| `preSignedS3URLforContactPerson` | `preSignedS3URLforContactPerson` | `String` |  |
| `remarks` | `remarks` | `String` |  |
| `retSubtype` | `retSubtype` | `String` |  |
| `retailer_ids` | `retailer_ids` | `ArrayList<String>` |  |
| `retailer_subtype` | `retailer_subtype` | `String` |  |
| `retailer_type` | `retailer_type` | `String` |  |
| `route_ids` | `route_ids` | `ArrayList<String>` |  |
| `sales_rep` | `sales_rep` | `String` |  |
| `sales_rep_mobile` | `sales_rep_mobile` | `String` |  |
| `sales_rep_name` | `sales_rep_name` | `String` |  |
| `shipToAddress` | `shipToAddress` | `String` |  |
| `shipToId` | `shipToId` | `String` |  |
| `shipToName` | `shipToName` | `String` |  |
| `stage` | `stage` | `String` |  |
| `stage_change_reason` | `stage_change_reason` | `String` |  |
| `state` | `state` | `String` |  |
| `state_id` | `state_id` | `int` |  |
| `status` | `status` | `String` |  |
| `status_reason` | `status_reason` | `String` |  |
| `status_updated_at` | `status_updated_at` | `String` |  |
| `status_updated_by` | `status_updated_by` | `String` |  |
| `statutoryFields` | `statutoryFields` | `ArrayList<StatutoryFields>` |  |
| `taluka` | `taluka` | `String` |  |
| `total_count` | `total_count` | `String` |  |
| `tsm` | `tsm` | `String` |  |
| `tsm_mobile` | `tsm_mobile` | `String` |  |
| `tsm_name` | `tsm_name` | `String` |  |
| `village` | `village` | `String` |  |
| `visit_status` | `visit_status` | `String` |  |
| `visitStatus` | `visitStatus` | `int` |  |
| `scheduleActivities` | `scheduleActivities` | `ArrayList<ScheduleActivities>` |  |
| `retailerTeamMapping` | `retailerTeamMapping` | `ArrayList<RetailerTeamResponse>` |  |
| `activitiesList` | `activitiesList` | `ArrayList<ScheduleActivities>` |  |
| `str_associate_ids` | `str_associate_ids` | `String` |  |
| `team_count` | `team_count` | `String` |  |
| `str_disassociate_ids` | `str_disassociate_ids` | `String` |  |
| `distId` | `distId` | `String` |  |
| `promoterName` | `promoterName` | `String` |  |
| `profile_per` | `profile_per` | `String` |  |
| `islongPressed` | `islongPressed` | `boolean` |  |
| `id` | `id` | `String` |  |
| `col_id` | `col_id` | `String` |  |
| `name` | `name` | `String` |  |
| `sap` | `sap` | `String` |  |
| `locality` | `locality` | `String` |  |
| `street` | `street` | `String` |  |
| `city` | `city` | `String` |  |
| `contactNo` | `contactNo` | `String` |  |
| `distributor` | `distributor` | `String` |  |
| `distributor_id` | `distributor_id` | `String` |  |
| `beatplanid` | `beatplanid` | `String` |  |
| `route` | `route` | `String` |  |
| `route_id` | `route_id` | `String` |  |
| `imagePath` | `imagePath` | `String` |  |
| `(none)` | `associated` | `Boolean` | accessor_only |
| `(none)` | `bankDetailsJson` | `String` | accessor_only |
| `(none)` | `date` | `String` | accessor_only |
| `(none)` | `error` | `boolean` | accessor_only |
| `(none)` | `imagepath` | `String` | accessor_only |
| `(none)` | `longPressed` | `boolean` | accessor_only |
| `(none)` | `new` | `boolean` | accessor_only |
| `(none)` | `selected` | `Boolean` | accessor_only |
| `(none)` | `statutory_attributes` | `ArrayList<StatutoryFields>` | accessor_only |

**Sample response**
```json
{
  "data": [
    {
      "date": "2026-11-13 09:02:00",
      "image_binary": "https://example.com/file.jpg",
      "task_id": "1",
      "shouldDelete": true,
      "isUnsync": true,
      "isSyncing": true,
      "accuracyCapturedOnList": "accuracyCapturedOnList",
      "activityName": "Corner Mart",
      "activity_address": "activity_address",
      "activity_id": "1",
      "approval_required": true,
      "approval_status_detail": {
        "lastActionAt": "lastActionAt",
        "lastActionBy": 1,
        "lastActionByDesignationId": 1,
        "lastActionByDesignationName": "Corner Mart",
        "lastActionByName": "Corner Mart",
        "lastActionRemarks": "Sample text",
        "lastActionStatus": "Active",
        "pendingDesignationId": "pendingDesignationId",
        "pendingDesignationName": "Corner Mart"
      },
      "associate_ids": [
        1
      ],
      "bankDetail": {
        "account_holder_name": "1",
        "account_number": "1",
        "bank_name": "Corner Mart",
        "branch": "branch",
        "ifsc_code": "ifsc_code"
      },
      "billToAddress": "billToAddress",
      "billToId": "billToId",
      "billToName": "Corner Mart",
      "chain_id": 1,
      "contact_person": "contact_person",
      "contact_person_pic": "contact_person_pic",
      "contact_person_pic_path": "contact_person_pic_path",
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
      "country": "1",
      "createdByUserRole": "createdByUserRole",
      "created_date": "2026-11-13 09:02:00",
      "customFields": [
        {
          "accessControl": [
            "<AccessControl>"
          ],
          "default_value": "default_value",
          "field_type": "field_type",
          "isAccessControlAllAllowed": true,
          "is_mandatory": true,
          "is_parent": true,
          "labelID": "labelID",
          "labelName": "Corner Mart",
          "local_value": "local_value",
          "params": "<CustomField_Retailer_Params>",
          "status": "Active",
          "subtype_config": [
            "subtype_config"
          ],
          "temp_folder": "temp_folder",
          "value": "value",
          "mandatoryField": "mandatoryField",
          "max_length": "max_length",
          "enableFilter": "enableFilter"
        }
      ],
      "days": "days",
      "deal_value": "deal_value",
      "disassociate_ids": [
        1
      ],
      "distance": "distance",
      "distributor_name": "Corner Mart",
      "district": "district",
      "email": "sam.rivera@example.com",
      "errorMessage": "Sample text",
      "fax": "fax",
      "group": "group",
      "image": "https://example.com/file.jpg",
      "influencerAddress": "influencerAddress",
      "influencerId": "influencerId",
      "influencerName": "Corner Mart",
      "isAssociated": true,
      "isFlaggedCustomer": "isFlaggedCustomer",
      "isNew": true,
      "isSelected": true,
      "is_available": "is_available",
      "is_cloud_image": "https://example.com/file.jpg",
      "is_location_locked": "is_location_locked",
      "is_new": 1,
      "is_old_version_activity": true,
      "landline": "landline",
      "latitude": "latitude",
      "latitudeCapturedOnList": "latitudeCapturedOnList",
      "locationAccuracy": "locationAccuracy",
      "location_accuracy": "location_accuracy",
      "location_lock_reason": "location_lock_reason",
      "longitude": "longitude",
      "longitudeCapturedOnList": "longitudeCapturedOnList",
      "mobile": "555-0101",
      "mobile_validated": "555-0101",
      "modifiedByUserRole": "modifiedByUserRole",
      "modified_date": "2026-11-13 09:02:00",
      "newTag": "newTag",
      "pendingSinceDays": 1,
      "persistence": "persistence",
      "pincode": "62704",
      "preSignedS3URL": "https://example.com/file.jpg",
      "preSignedS3URLforContactPerson": "https://example.com/file.jpg",
      "remarks": "Sample text",
      "retSubtype": "retSubtype",
      "retailer_ids": [
        "retailer_ids"
      ],
      "retailer_subtype": "retailer_subtype",
      "retailer_type": "retailer_type",
      "route_ids": [
        "route_ids"
      ],
      "sales_rep": "sales_rep",
      "sales_rep_mobile": "555-0101",
      "sales_rep_name": "Corner Mart",
      "shipToAddress": "shipToAddress",
      "shipToId": "shipToId",
      "shipToName": "Corner Mart",
      "stage": "stage",
      "stage_change_reason": "stage_change_reason",
      "state": "state",
      "state_id": 1,
      "status": "Active",
      "status_reason": "Active",
      "status_updated_at": "2026-11-13 09:02:00",
      "status_updated_by": "2026-11-13 09:02:00",
      "statutoryFields": [
        {
          "accessControl": [
            "<AccessControl>"
          ],
          "file_uri": "<transient String>",
          "isAccessControlAllAllowed": true,
          "ocr_params": {},
          "params": "<StatuoryField_Retailer_Params>",
          "subtype_config": [
            "subtype_config"
          ],
          "temp_folder": "temp_folder",
          "id": "1",
          "code_name": "Corner Mart",
          "name": "Corner Mart",
          "allow_document_upload": "allow_document_upload",
          "check_duplicates": "check_duplicates",
          "position": "position",
          "is_enabled": "is_enabled",
          "mandatory": "mandatory",
          "value": "value",
          "unSavedValue": "unSavedValue",
          "isMasked": true,
          "is_required": "is_required",
          "filename": "Corner Mart",
          "local_filename": "Corner Mart",
          "status": "Active",
          "document_id": "1",
          "is_verification_enabled": "is_verification_enabled",
          "verification_status": "Active",
          "verifiedValue": "<transient String>",
          "verificationInFlight": "<transient boolean>"
        }
      ],
      "taluka": "taluka",
      "total_count": "1",
      "tsm": "tsm",
      "tsm_mobile": "555-0101",
      "tsm_name": "Corner Mart",
      "village": "village",
      "visit_status": "Active",
      "visitStatus": 1,
      "scheduleActivities": [
        {
          "activity_name": "Corner Mart",
          "activity_type_id": "1",
          "activity_type_ref_id": "1",
          "activity_response_ref_id": "1",
          "id": "1",
          "isCheckInRequired": true,
          "isStockDisabled": true,
          "isStockInDisabled": true,
          "linked_campaign_id": 1,
          "linked_campaign_name": "Corner Mart",
          "schedule_id": "1",
          "user_activity_log_id": "1"
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
      ],
      "activitiesList": [
        {
          "activity_name": "Corner Mart",
          "activity_type_id": "1",
          "activity_type_ref_id": "1",
          "activity_response_ref_id": "1",
          "id": "1",
          "isCheckInRequired": true,
          "isStockDisabled": true,
          "isStockInDisabled": true,
          "linked_campaign_id": 1,
          "linked_campaign_name": "Corner Mart",
          "schedule_id": "1",
          "user_activity_log_id": "1"
        }
      ],
      "str_associate_ids": "str_associate_ids",
      "team_count": "1",
      "str_disassociate_ids": "str_disassociate_ids",
      "distId": "distId",
      "promoterName": "Corner Mart",
      "profile_per": "profile_per",
      "islongPressed": true,
      "id": "1",
      "col_id": "1",
      "name": "Corner Mart",
      "sap": "sap",
      "locality": "locality",
      "street": "street",
      "city": "Springfield",
      "contactNo": "555-0101",
      "distributor": "distributor",
      "distributor_id": "1",
      "beatplanid": "beatplanid",
      "route": "route",
      "route_id": "1",
      "imagePath": "https://example.com/file.jpg"
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

### GET `v1/retailer/index`
`kotlin.getViewRetailer`

**Query**
| name | type |
|---|---|
| `id` | `String` |
| `expand` | `String` |

**Sample request**
```json
{
  "query": {
    "id": "1",
    "expand": "expand"
  }
}
```

**Response data** `Retailer`

| server name | Jackson name | type | flags |
|---|---|---|---|
| `date` | `date` | `String` |  |
| `image_binary` | `image_binary` | `String` |  |
| `task_id` | `task_id` | `String` |  |
| `shouldDelete` | `shouldDelete` | `boolean` |  |
| `isUnsync` | - | `boolean` | no_accessor |
| `isSyncing` | - | `boolean` | no_accessor |
| `(none)` | `syncing` | `boolean` | accessor_only |
| `(none)` | `unsync` | `boolean` | accessor_only |
| `accuracyCapturedOnList` | `accuracyCapturedOnList` | `String` |  |
| `activityName` | `activityName` | `String` |  |
| `activity_address` | `activity_address` | `String` |  |
| `activity_id` | `activity_id` | `String` |  |
| `approval_required` | `approval_required` | `boolean` |  |
| `approval_status_detail` | `approval_status_detail` | `ApprovalStatusResponse` |  |
| `associate_ids` | `associate_ids` | `int[]` |  |
| `bankDetail` | `bankDetail` | `BankDetails` |  |
| `billToAddress` | `billToAddress` | `String` |  |
| `billToId` | `billToId` | `String` |  |
| `billToName` | `billToName` | `String` |  |
| `chain_id` | `chain_id` | `int` |  |
| `contact_person` | `contact_person` | `String` |  |
| `contact_person_pic` | `contact_person_pic` | `String` |  |
| `contact_person_pic_path` | `contact_person_pic_path` | `String` |  |
| `contacts` | `contacts` | `ArrayList<ContactPerson>` |  |
| `country` | `country` | `String` |  |
| `createdByUserRole` | `createdByUserRole` | `String` |  |
| `created_date` | `created_date` | `String` |  |
| `customFields` | `customFields` | `ArrayList<CustomFields>` |  |
| `days` | `days` | `String` |  |
| `deal_value` | `deal_value` | `String` |  |
| `disassociate_ids` | `disassociate_ids` | `int[]` |  |
| `distance` | `distance` | `String` |  |
| `distributor_name` | `distributor_name` | `String` |  |
| `district` | `district` | `String` |  |
| `email` | `email` | `String` |  |
| `errorMessage` | `errorMessage` | `String` |  |
| `fax` | `fax` | `String` |  |
| `group` | `group` | `String` |  |
| `image` | `image` | `String` |  |
| `influencerAddress` | `influencerAddress` | `String` |  |
| `influencerId` | `influencerId` | `String` |  |
| `influencerName` | `influencerName` | `String` |  |
| `isAssociated` | `isAssociated` | `Boolean` |  |
| `isFlaggedCustomer` | `isFlaggedCustomer` | `String` |  |
| `isNew` | `isNew` | `boolean` |  |
| `isSelected` | `isSelected` | `Boolean` |  |
| `is_available` | `is_available` | `String` |  |
| `is_cloud_image` | `is_cloud_image` | `String` |  |
| `is_location_locked` | `is_location_locked` | `String` |  |
| `is_new` | `is_new` | `Integer` |  |
| `is_old_version_activity` | `is_old_version_activity` | `boolean` |  |
| `landline` | `landline` | `String` |  |
| `latitude` | `latitude` | `String` |  |
| `latitudeCapturedOnList` | `latitudeCapturedOnList` | `String` |  |
| `locationAccuracy` | `locationAccuracy` | `String` |  |
| `location_accuracy` | `location_accuracy` | `String` |  |
| `location_lock_reason` | `location_lock_reason` | `String` |  |
| `longitude` | `longitude` | `String` |  |
| `longitudeCapturedOnList` | `longitudeCapturedOnList` | `String` |  |
| `mobile` | `mobile` | `String` |  |
| `mobile_validated` | `mobile_validated` | `String` |  |
| `modifiedByUserRole` | `modifiedByUserRole` | `String` |  |
| `modified_date` | `modified_date` | `String` |  |
| `newTag` | `newTag` | `String` |  |
| `pendingSinceDays` | `pendingSinceDays` | `int` |  |
| `persistence` | `persistence` | `String` |  |
| `pincode` | `pincode` | `String` |  |
| `preSignedS3URL` | `preSignedS3URL` | `String` |  |
| `preSignedS3URLforContactPerson` | `preSignedS3URLforContactPerson` | `String` |  |
| `remarks` | `remarks` | `String` |  |
| `retSubtype` | `retSubtype` | `String` |  |
| `retailer_ids` | `retailer_ids` | `ArrayList<String>` |  |
| `retailer_subtype` | `retailer_subtype` | `String` |  |
| `retailer_type` | `retailer_type` | `String` |  |
| `route_ids` | `route_ids` | `ArrayList<String>` |  |
| `sales_rep` | `sales_rep` | `String` |  |
| `sales_rep_mobile` | `sales_rep_mobile` | `String` |  |
| `sales_rep_name` | `sales_rep_name` | `String` |  |
| `shipToAddress` | `shipToAddress` | `String` |  |
| `shipToId` | `shipToId` | `String` |  |
| `shipToName` | `shipToName` | `String` |  |
| `stage` | `stage` | `String` |  |
| `stage_change_reason` | `stage_change_reason` | `String` |  |
| `state` | `state` | `String` |  |
| `state_id` | `state_id` | `int` |  |
| `status` | `status` | `String` |  |
| `status_reason` | `status_reason` | `String` |  |
| `status_updated_at` | `status_updated_at` | `String` |  |
| `status_updated_by` | `status_updated_by` | `String` |  |
| `statutoryFields` | `statutoryFields` | `ArrayList<StatutoryFields>` |  |
| `taluka` | `taluka` | `String` |  |
| `total_count` | `total_count` | `String` |  |
| `tsm` | `tsm` | `String` |  |
| `tsm_mobile` | `tsm_mobile` | `String` |  |
| `tsm_name` | `tsm_name` | `String` |  |
| `village` | `village` | `String` |  |
| `visit_status` | `visit_status` | `String` |  |
| `visitStatus` | `visitStatus` | `int` |  |
| `scheduleActivities` | `scheduleActivities` | `ArrayList<ScheduleActivities>` |  |
| `retailerTeamMapping` | `retailerTeamMapping` | `ArrayList<RetailerTeamResponse>` |  |
| `activitiesList` | `activitiesList` | `ArrayList<ScheduleActivities>` |  |
| `str_associate_ids` | `str_associate_ids` | `String` |  |
| `team_count` | `team_count` | `String` |  |
| `str_disassociate_ids` | `str_disassociate_ids` | `String` |  |
| `distId` | `distId` | `String` |  |
| `promoterName` | `promoterName` | `String` |  |
| `profile_per` | `profile_per` | `String` |  |
| `islongPressed` | `islongPressed` | `boolean` |  |
| `id` | `id` | `String` |  |
| `col_id` | `col_id` | `String` |  |
| `name` | `name` | `String` |  |
| `sap` | `sap` | `String` |  |
| `locality` | `locality` | `String` |  |
| `street` | `street` | `String` |  |
| `city` | `city` | `String` |  |
| `contactNo` | `contactNo` | `String` |  |
| `distributor` | `distributor` | `String` |  |
| `distributor_id` | `distributor_id` | `String` |  |
| `beatplanid` | `beatplanid` | `String` |  |
| `route` | `route` | `String` |  |
| `route_id` | `route_id` | `String` |  |
| `imagePath` | `imagePath` | `String` |  |
| `(none)` | `associated` | `Boolean` | accessor_only |
| `(none)` | `bankDetailsJson` | `String` | accessor_only |
| `(none)` | `date` | `String` | accessor_only |
| `(none)` | `error` | `boolean` | accessor_only |
| `(none)` | `imagepath` | `String` | accessor_only |
| `(none)` | `longPressed` | `boolean` | accessor_only |
| `(none)` | `new` | `boolean` | accessor_only |
| `(none)` | `selected` | `Boolean` | accessor_only |
| `(none)` | `statutory_attributes` | `ArrayList<StatutoryFields>` | accessor_only |

**Sample response**
```json
{
  "data": {
    "date": "2026-11-13 09:02:00",
    "image_binary": "https://example.com/file.jpg",
    "task_id": "1",
    "shouldDelete": true,
    "isUnsync": true,
    "isSyncing": true,
    "accuracyCapturedOnList": "accuracyCapturedOnList",
    "activityName": "Corner Mart",
    "activity_address": "activity_address",
    "activity_id": "1",
    "approval_required": true,
    "approval_status_detail": {
      "lastActionAt": "lastActionAt",
      "lastActionBy": 1,
      "lastActionByDesignationId": 1,
      "lastActionByDesignationName": "Corner Mart",
      "lastActionByName": "Corner Mart",
      "lastActionRemarks": "Sample text",
      "lastActionStatus": "Active",
      "pendingDesignationId": "pendingDesignationId",
      "pendingDesignationName": "Corner Mart"
    },
    "associate_ids": [
      1
    ],
    "bankDetail": {
      "account_holder_name": "1",
      "account_number": "1",
      "bank_name": "Corner Mart",
      "branch": "branch",
      "ifsc_code": "ifsc_code"
    },
    "billToAddress": "billToAddress",
    "billToId": "billToId",
    "billToName": "Corner Mart",
    "chain_id": 1,
    "contact_person": "contact_person",
    "contact_person_pic": "contact_person_pic",
    "contact_person_pic_path": "contact_person_pic_path",
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
    "country": "1",
    "createdByUserRole": "createdByUserRole",
    "created_date": "2026-11-13 09:02:00",
    "customFields": [
      {
        "accessControl": [
          "<AccessControl>"
        ],
        "default_value": "default_value",
        "field_type": "field_type",
        "isAccessControlAllAllowed": true,
        "is_mandatory": true,
        "is_parent": true,
        "labelID": "labelID",
        "labelName": "Corner Mart",
        "local_value": "local_value",
        "params": "<CustomField_Retailer_Params>",
        "status": "Active",
        "subtype_config": [
          "subtype_config"
        ],
        "temp_folder": "temp_folder",
        "value": "value",
        "mandatoryField": "mandatoryField",
        "max_length": "max_length",
        "enableFilter": "enableFilter"
      }
    ],
    "days": "days",
    "deal_value": "deal_value",
    "disassociate_ids": [
      1
    ],
    "distance": "distance",
    "distributor_name": "Corner Mart",
    "district": "district",
    "email": "sam.rivera@example.com",
    "errorMessage": "Sample text",
    "fax": "fax",
    "group": "group",
    "image": "https://example.com/file.jpg",
    "influencerAddress": "influencerAddress",
    "influencerId": "influencerId",
    "influencerName": "Corner Mart",
    "isAssociated": true,
    "isFlaggedCustomer": "isFlaggedCustomer",
    "isNew": true,
    "isSelected": true,
    "is_available": "is_available",
    "is_cloud_image": "https://example.com/file.jpg",
    "is_location_locked": "is_location_locked",
    "is_new": 1,
    "is_old_version_activity": true,
    "landline": "landline",
    "latitude": "latitude",
    "latitudeCapturedOnList": "latitudeCapturedOnList",
    "locationAccuracy": "locationAccuracy",
    "location_accuracy": "location_accuracy",
    "location_lock_reason": "location_lock_reason",
    "longitude": "longitude",
    "longitudeCapturedOnList": "longitudeCapturedOnList",
    "mobile": "555-0101",
    "mobile_validated": "555-0101",
    "modifiedByUserRole": "modifiedByUserRole",
    "modified_date": "2026-11-13 09:02:00",
    "newTag": "newTag",
    "pendingSinceDays": 1,
    "persistence": "persistence",
    "pincode": "62704",
    "preSignedS3URL": "https://example.com/file.jpg",
    "preSignedS3URLforContactPerson": "https://example.com/file.jpg",
    "remarks": "Sample text",
    "retSubtype": "retSubtype",
    "retailer_ids": [
      "retailer_ids"
    ],
    "retailer_subtype": "retailer_subtype",
    "retailer_type": "retailer_type",
    "route_ids": [
      "route_ids"
    ],
    "sales_rep": "sales_rep",
    "sales_rep_mobile": "555-0101",
    "sales_rep_name": "Corner Mart",
    "shipToAddress": "shipToAddress",
    "shipToId": "shipToId",
    "shipToName": "Corner Mart",
    "stage": "stage",
    "stage_change_reason": "stage_change_reason",
    "state": "state",
    "state_id": 1,
    "status": "Active",
    "status_reason": "Active",
    "status_updated_at": "2026-11-13 09:02:00",
    "status_updated_by": "2026-11-13 09:02:00",
    "statutoryFields": [
      {
        "accessControl": [
          "<AccessControl>"
        ],
        "file_uri": "<transient String>",
        "isAccessControlAllAllowed": true,
        "ocr_params": {},
        "params": "<StatuoryField_Retailer_Params>",
        "subtype_config": [
          "subtype_config"
        ],
        "temp_folder": "temp_folder",
        "id": "1",
        "code_name": "Corner Mart",
        "name": "Corner Mart",
        "allow_document_upload": "allow_document_upload",
        "check_duplicates": "check_duplicates",
        "position": "position",
        "is_enabled": "is_enabled",
        "mandatory": "mandatory",
        "value": "value",
        "unSavedValue": "unSavedValue",
        "isMasked": true,
        "is_required": "is_required",
        "filename": "Corner Mart",
        "local_filename": "Corner Mart",
        "status": "Active",
        "document_id": "1",
        "is_verification_enabled": "is_verification_enabled",
        "verification_status": "Active",
        "verifiedValue": "<transient String>",
        "verificationInFlight": "<transient boolean>"
      }
    ],
    "taluka": "taluka",
    "total_count": "1",
    "tsm": "tsm",
    "tsm_mobile": "555-0101",
    "tsm_name": "Corner Mart",
    "village": "village",
    "visit_status": "Active",
    "visitStatus": 1,
    "scheduleActivities": [
      {
        "activity_name": "Corner Mart",
        "activity_type_id": "1",
        "activity_type_ref_id": "1",
        "activity_response_ref_id": "1",
        "id": "1",
        "isCheckInRequired": true,
        "isStockDisabled": true,
        "isStockInDisabled": true,
        "linked_campaign_id": 1,
        "linked_campaign_name": "Corner Mart",
        "schedule_id": "1",
        "user_activity_log_id": "1"
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
    ],
    "activitiesList": [
      {
        "activity_name": "Corner Mart",
        "activity_type_id": "1",
        "activity_type_ref_id": "1",
        "activity_response_ref_id": "1",
        "id": "1",
        "isCheckInRequired": true,
        "isStockDisabled": true,
        "isStockInDisabled": true,
        "linked_campaign_id": 1,
        "linked_campaign_name": "Corner Mart",
        "schedule_id": "1",
        "user_activity_log_id": "1"
      }
    ],
    "str_associate_ids": "str_associate_ids",
    "team_count": "1",
    "str_disassociate_ids": "str_disassociate_ids",
    "distId": "distId",
    "promoterName": "Corner Mart",
    "profile_per": "profile_per",
    "islongPressed": true,
    "id": "1",
    "col_id": "1",
    "name": "Corner Mart",
    "sap": "sap",
    "locality": "locality",
    "street": "street",
    "city": "Springfield",
    "contactNo": "555-0101",
    "distributor": "distributor",
    "distributor_id": "1",
    "beatplanid": "beatplanid",
    "route": "route",
    "route_id": "1",
    "imagePath": "https://example.com/file.jpg"
  },
  "success": true,
  "sendStatus": 200,
  "sendmessage": "OK"
}
```

## Notes

- List call chain: `fragment/ItemFragment$getRetailers$1` -> `DBManagerKotlin.Companion.z` -> coroutine `DBManagerKotlin$Companion$fetchRetailerlist$1` -> `ApiInterfaceKotlin.getFilterRetailerList` (`ApiInterfaceKotlin.java:397-398`).
- Detail call chain: `DBManagerKotlin.Companion.H2` -> `viewRetailer$1` -> `ApiInterfaceKotlin.getViewRetailer` (`ApiInterfaceKotlin.java:701-702`). `H2` is called by `CreditDebitDetail`, `PaymentDetailScreen`, `DispatchDetail`, `DraftOrderListActivity` and others.
- `Retailer` (about 100 fields) mixes API fields with client-only state (`isSelected`, `islongPressed`, `isError`, `errorMessage`, `latitudeCapturedOnList`). Treat those as not part of the API.
- Related detail endpoints: `GET v1/retailer/get-profile-info?retailer_id`, `GET v1/retailer/contacts?id`, `GET v1/retailer/extra-data?retailer_id&distributor_id`, `POST v1/retailer/get-history`.

## Not verified

- How `RetailersActivity` hands over to `ItemFragment` was not confirmed.
