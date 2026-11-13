# Sign-in (username, password, OTP)

> Samples are synthesised from field names and types. No real request or response was observed. See NAMING.md.

Three steps against two main endpoints. The username check decides whether the user goes to the password screen or the activation screen. The same login endpoint serves password sign-in and OTP verification; only `method`, `password` and `otp` differ.

Screens: prototype `login, password, otp, activate`; app `EnterUsernameKotlin, EnterPasswordKotlin, OtpVerificationActivity, UserActivationActivity`.

## Endpoints

### POST `v1/user/check-username`
`retrofit.checkUser` - flags: dynamic_url

**Request body** `CheckUserRequest`

| server name | Jackson name | type | flags |
|---|---|---|---|
| `username` | `username` | `String` |  |
| `ver` | `ver` | `String` |  |

**Sample request**
```json
{
  "body": {
    "username": "sam.rivera",
    "ver": "10.1.2"
  }
}
```

**Response data** `CheckUserResponse`

| server name | Jackson name | type | flags |
|---|---|---|---|
| `api_url` | `api_url` | `String` |  |
| `available_methods` | `available_methods` | `ArrayList<AvailableMethod>` |  |
| `avatar` | `avatar` | `String` |  |
| `isActivated` | `isActivated` | `boolean` |  |
| `isPasswordSet` | `isPasswordSet` | `boolean` |  |
| `message` | `message` | `String` |  |
| `name` | `name` | `String` |  |
| `otp_limit` | `otp_limit` | `String` |  |
| `portal_url` | `portal_url` | `String` |  |
| `role` | `role` | `String` |  |
| `splashScreen` | `splashScreen` | `CompanyLogoSplash` |  |
| `terms_accepted` | `terms_accepted` | `int` |  |

**Sample response**
```json
{
  "data": {
    "api_url": "https://example.com/file.jpg",
    "available_methods": [
      {
        "method": "password",
        "redirect_url": "https://example.com/file.jpg"
      }
    ],
    "avatar": "https://example.com/file.jpg",
    "isActivated": true,
    "isPasswordSet": true,
    "message": "Sample text",
    "name": "Corner Mart",
    "otp_limit": "1",
    "portal_url": "https://example.com/file.jpg",
    "role": "role",
    "splashScreen": {
      "bgColor": "bgColor",
      "logo": "https://example.com/file.jpg",
      "splashLogo": "https://example.com/file.jpg"
    },
    "terms_accepted": 1
  },
  "success": true,
  "sendStatus": 200,
  "sendmessage": "OK"
}
```

### POST `v1/user/login`
`retrofit.login`

**Request body** `LoginRequest`

| server name | Jackson name | type | flags |
|---|---|---|---|
| `bat_status` | `bat_status` | `String` |  |
| `device_model` | `deviceInfo` | `String` | name_disagree |
| `gp_service_version` | `gp_service_version` | `String` |  |
| `lang` | `lang` | `String` |  |
| `os_ver` | `os_ver` | `String` |  |
| `password` | `password` | `String` |  |
| `terms_accepted` | `terms_accepted` | `String` |  |
| `token` | `token` | `String` |  |
| `username` | `username` | `String` |  |
| `ver` | `ver` | `String` |  |
| `device` | `device` | `String` |  |
| `otp` | `otp` | `String` |  |
| `method` | `method` | `String` |  |
| `transfer_token` | `transfer_token` | `String` |  |
| `twoFA_otp` | `twoFA_otp` | `String` |  |

**Sample request**
```json
{
  "body": {
    "bat_status": "85",
    "device_model": "Pixel 8",
    "gp_service_version": "24.40.1",
    "lang": "en",
    "os_ver": "14",
    "password": "<password>",
    "terms_accepted": "1",
    "token": "<token>",
    "username": "sam.rivera",
    "ver": "10.1.2",
    "device": "mobile",
    "otp": "482915",
    "method": "password",
    "transfer_token": "<token>",
    "twoFA_otp": ""
  }
}
```

**Response data** `DataLogin`

| server name | Jackson name | type | flags |
|---|---|---|---|
| `activity_types` | `activity_types` | `ArrayList<IdValue>` |  |
| `appInfo` | `appInfo` | `AppInfo` |  |
| `company_display_name` | `company_display_name` | `String` |  |
| `customFields` | `customFields` | `ArrayList<CustomFields>` |  |
| `distance_unit` | `distance_unit` | `String` |  |
| `email` | `email` | `String` |  |
| `enable_2fa_verification` | `enable_2fa_verification` | `boolean` |  |
| `enable_van_user_to_collect_orders` | `enable_van_user_to_collect_orders` | `boolean` |  |
| `external_inventory` | `external_inventory` | `boolean` |  |
| `integration_order_price` | `integration_order_price` | `boolean` |  |
| `is_self_inventory` | `is_self_inventory` | `String` |  |
| `last_checkin` | `last_checkin` | `LastCheckInInfo` |  |
| `location_radius` | `location_radius` | `String` |  |
| `mobile` | `mobile` | `String` |  |
| `payment_term_enabled` | `payment_term_enabled` | `boolean` |  |
| `profile` | `profile` | `UserProfile` |  |
| `remaining_otp` | `remaining_otp` | `int` |  |
| `restrict_nonvan_user_order_stock` | `restrict_nonvan_user_order_stock` | `boolean` |  |
| `retailer` | `retailer` | `Retailer` |  |
| `retailer_chain` | `retailer_chain` | `ArrayList<IdValue>` |  |
| `retailer_class` | `retailer_class` | `ArrayList<IdValue>` |  |
| `retailer_subtype` | `retailer_subtype` | `ArrayList<RetailerTypeSubtype>` |  |
| `retailerid` | `retailerid` | `String` |  |
| `retailername` | `retailername` | `String` |  |
| `role_alias` | `role_alias` | `ArrayList<RoleAlias>` |  |
| `settings` | `settings` | `Settings` |  |
| `show_rating_popup` | `show_rating_popup` | `boolean` |  |
| `splashScreen` | `splashScreen` | `CompanyLogoSplash` |  |
| `start_day_time` | `start_day_time` | `String` |  |
| `taxes` | `taxes` | `ArrayList<Tax>` |  |
| `tnc_accepted` | `tnc_accepted` | `int` |  |
| `tnc_enabled` | `tnc_enabled` | `int` |  |
| `token` | `token` | `String` |  |
| `upload_token` | `upload_token` | `String` |  |
| `verified_email_status` | `verified_email_status` | `int` |  |
| `verified_mobile_status` | `verified_mobile_status` | `int` |  |
| `whatsapp_number` | `whatsapp_number` | `String` |  |
| `workflow_alias` | `workflow_alias` | `ArrayList<WorkflowAlias>` |  |

**Sample response**
```json
{
  "data": {
    "activity_types": [
      {
        "id": "1",
        "isSelected": true,
        "value": "value"
      }
    ],
    "appInfo": {
      "appUpdateAvailable": true,
      "appUpdateMandatory": true,
      "appUrl": "https://example.com/file.jpg",
      "sendStatus": true,
      "statusAlert": "Active"
    },
    "company_display_name": "Corner Mart",
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
    "distance_unit": "distance_unit",
    "email": "sam.rivera@example.com",
    "enable_2fa_verification": true,
    "enable_van_user_to_collect_orders": true,
    "external_inventory": true,
    "integration_order_price": true,
    "is_self_inventory": "is_self_inventory",
    "last_checkin": {
      "checkin_time": "2026-11-13 09:02:00",
      "retailer": "<Retailer>"
    },
    "location_radius": "location_radius",
    "mobile": "555-0101",
    "payment_term_enabled": true,
    "profile": {
      "allow_delivery_confirmation_on_dispatchs": "allow_delivery_confirmation_on_dispatchs",
      "allowed_to_approve_orders": true,
      "available_for_delivery": "available_for_delivery",
      "avatar": "https://example.com/file.jpg",
      "company": "company",
      "company_id": "1",
      "designation": "designation",
      "designation_name": "Corner Mart",
      "disabled_tour_visit": true,
      "distributor": "distributor",
      "email": "sam.rivera@example.com",
      "freshchat_token": "<token>",
      "id": "1",
      "mobile": "555-0101",
      "name": "Corner Mart",
      "restricted_for_order_approval": true,
      "retailer": "1",
      "retailerCity": "Springfield",
      "retailerStreet": "retailerStreet",
      "retailerTaluka": "retailerTaluka",
      "role": "role",
      "role_description": "role_description",
      "s3_bucket": "s3_bucket",
      "s3_bucket_default": "s3_bucket_default",
      "s3_region": "s3_region",
      "s3_region_default": "s3_region_default",
      "sendStatus": "Active",
      "verified_email_status": 1,
      "verified_mobile_status": 1
    },
    "remaining_otp": 1,
    "restrict_nonvan_user_order_stock": true,
    "retailer": {
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
      "approval_status_detail": "<ApprovalStatusResponse>",
      "associate_ids": [
        1
      ],
      "bankDetail": "<BankDetails>",
      "billToAddress": "billToAddress",
      "billToId": "billToId",
      "billToName": "Corner Mart",
      "chain_id": 1,
      "contact_person": "contact_person",
      "contact_person_pic": "contact_person_pic",
      "contact_person_pic_path": "contact_person_pic_path",
      "contacts": [
        "<ContactPerson>"
      ],
      "country": "1",
      "createdByUserRole": "createdByUserRole",
      "created_date": "2026-11-13 09:02:00",
      "customFields": [
        "<CustomFields>"
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
        "<StatutoryFields>"
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
        "<ScheduleActivities>"
      ],
      "retailerTeamMapping": [
        "<RetailerTeamResponse>"
      ],
      "activitiesList": [
        "<ScheduleActivities>"
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
    "retailer_chain": [
      {
        "id": "1",
        "isSelected": true,
        "value": "value"
      }
    ],
    "retailer_class": [
      {
        "id": "1",
        "isSelected": true,
        "value": "value"
      }
    ],
    "retailer_subtype": [
      {
        "code": "code",
        "id": "1",
        "is_stage_sequential": "is_stage_sequential",
        "type": "type",
        "value": "value",
        "color_code": "color_code",
        "svg_content": "svg_content"
      }
    ],
    "retailerid": "retailerid",
    "retailername": "Corner Mart",
    "role_alias": [
      {
        "description": "description",
        "role_id": "1"
      }
    ],
    "settings": {
      "activity_sequence_setup": true,
      "allow_back_date_for_sales": true,
      "allow_customer_info_for_sales": true,
      "allow_customer_multiple_routes": true,
      "allow_limit_check_on_stock_issue": true,
      "allow_multiple_shipping_addresses": true,
      "allow_ocr_doc_upload_retailer": true,
      "allow_pocket_mis_reports": true,
      "allow_quantity_decimal": true,
      "allow_retailer_based_pricing": "allow_retailer_based_pricing",
      "allow_role_to_loc_location": "allow_role_to_loc_location",
      "allow_sales_rep_for_customer_self_order_nudge": true,
      "allow_sales_team_order_edit": true,
      "allow_sales_to_associated_customer": true,
      "allow_self_adhoc_schedule": true,
      "allow_signature_in_secondary_order": true,
      "allow_tour_visit_without_photo": true,
      "allow_van_inventory": true,
      "allow_van_to_confirm_reconciliation": true,
      "allow_van_to_confirm_stock": true,
      "allow_van_to_request_stock": true,
      "allow_visual_merchandising": true,
      "auto_assign_routes": true,
      "autopick_retailer_location_via_geocode": true,
      "cancel_order_minutes": "cancel_order_minutes",
      "company_helpline_number": "company_helpline_number",
      "continuous_location_tracking": true,
      "continuous_location_tracking_frequency": "continuous_location_tracking_frequency",
      "create_retailer_sr": true,
      "create_retailer_tsm": true,
      "currency_unicode": "currency_unicode",
      "customer_deal_value": true,
      "customer_sku_target": true,
      "date_chat_support": "2026-11-13 09:02:00",
      "deadline_target_upload": "deadline_target_upload",
      "debit_note_overdue_threshold": "Sample text",
      "define_msl_fsl_configuration": "define_msl_fsl_configuration",
      "device_gps_settings_optional": true,
      "disable_distributor_feedback": true,
      "disable_distributor_functionality": true,
      "disable_distributor_order": true,
      "disable_distributor_payment": true,
      "disable_distributor_stock": true,
      "disable_report_option_in_stock_update": true,
      "disable_retailer_functionality": true,
      "disable_retailer_payment": true,
      "disable_retailer_stock": true,
      "disable_retailer_stock_in": true,
      "disable_scheme_application": true,
      "disable_secondary_order_price_edit": true,
      "disable_team_view": true,
      "disable_tour_visit_functionality": true,
      "edit_retailer_sr": true,
      "edit_retailer_tsm": true,
      "enable_2fa_verification": true,
      "enable_advanced_vm": true,
      "enable_batchwise_primary_orders": true,
      "enable_combined_statement": true,
      "enable_copilot": true,
      "enable_custom_discount": true,
      "enable_customer_insights": true,
      "enable_distributor_hierarchy": true,
      "enable_distributor_menu_roles": "enable_distributor_menu_roles",
      "enable_distributor_premium_functionality": true,
      "enable_gamification": true,
      "enable_idfy_customer_document_verification": true,
      "enable_new_tag": true,
      "enable_on_demand_route_resequence": true,
      "enable_order_influencer": true,
      "enable_promoter_info_band": true,
      "enable_retailer_authentication": true,
      "enable_retailer_premium_filter": true,
      "enable_secondary_scheme_mobile": true,
      "enable_signature_image_sales_log": true,
      "enable_sku_info": true,
      "enable_sku_loading_prevention": true,
      "external_retailer_approval_roles": "external_retailer_approval_roles",
      "fetch_order_prices_online": true,
      "hide_price_values": true,
      "hide_retailer_type": true,
      "index_erp_id_in_serial_number": "index_erp_id_in_serial_number",
      "invoice_overdue_threshold": "invoice_overdue_threshold",
      "is_cashfree_enabled": true,
      "is_visit_kpi_enabled": true,
      "make_address_fields_mandatory": true,
      "make_sales_against_return_stock": true,
      "mandatory_retail_pic_create": true,
      "mandatory_retailer_statutory_field": true,
      "mandatory_retailer_subtype": true,
      "msl_fsl_compliance_calculation": "msl_fsl_compliance_calculation",
      "num_retail_image_skip": "https://example.com/file.jpg",
      "num_stream_topics_allowed": "num_stream_topics_allowed",
      "offline_invoice_download": true,
      "pincode_regex": "62704",
      "prevent_dispatch_more_than_stock": true,
      "prevent_mop_edit_sales_log": true,
      "price_basis": "price_basis",
      "product_group_inventory_calculation": "product_group_inventory_calculation",
      "product_serial_number_secondary_dispatch": true,
      "reason_config": "<ReturnReasonConfig>",
      "regex_barcode_scan": "regex_barcode_scan",
      "regex_sku_erp_id": "1",
      "restrict_checkin_to_scheduled_customers": true,
      "retail_action_feedback": true,
      "retail_action_order": true,
      "retail_action_return": true,
      "retailer_action_sales_log": true,
      "retailer_approval_roles": "retailer_approval_roles",
      "retailer_call_log": true,
      "retailer_create": true,
      "retailer_edit": true,
      "retailer_mobile_number_pattern": "555-0101",
      "retailer_mobile_validation": true,
      "sales_log_product_serial_number_validate": "2026-11-13 09:02:00",
      "sales_rep_take_sales_log": true,
      "show_stock_report_mobile": true,
      "skip_duplicate_retailer_check": true,
      "smart_scheduling": true,
      "take_stock_sku_visibility": "take_stock_sku_visibility",
      "tertiary_sales_image_required": true,
      "tertiary_sales_product_serial_number": true,
      "update_outstandings_by_integration": true,
      "upload_response_image": true,
      "vm_audit_agent": true,
      "without_tax_item_level_pricing": true,
      "company_country_code": "1",
      "enable_incentive_module_visibility": true
    },
    "show_rating_popup": true,
    "splashScreen": {
      "bgColor": "bgColor",
      "logo": "https://example.com/file.jpg",
      "splashLogo": "https://example.com/file.jpg"
    },
    "start_day_time": "2026-11-13 09:02:00",
    "taxes": [
      {
        "description": "description",
        "id": "1",
        "taxRate": 1.5,
        "title": "title"
      }
    ],
    "tnc_accepted": 1,
    "tnc_enabled": 1,
    "token": "<token>",
    "upload_token": "<token>",
    "verified_email_status": 1,
    "verified_mobile_status": 1,
    "whatsapp_number": "555-0101",
    "workflow_alias": [
      {
        "description": "description",
        "description_plural": "description_plural",
        "workflow_type": "workflow_type"
      }
    ]
  },
  "success": true,
  "sendStatus": 200,
  "sendmessage": "OK"
}
```

### POST `v1/user/send-otp`
`retrofit.resendOtp`

**Request body** `CheckUserResendOtp`

| server name | Jackson name | type | flags |
|---|---|---|---|
| `type` | `type` | `String` |  |
| `username` | `username` | `String` |  |

**Sample request**
```json
{
  "body": {
    "type": "type",
    "username": "sam.rivera"
  }
}
```

**Response data** `CheckOtpResponse`

| server name | Jackson name | type | flags |
|---|---|---|---|
| `data` | `data` | `String` |  |
| `remaining_otp` | `remaining_otp` | `int` |  |
| `remaining_time` | `remaining_time` | `Long` |  |
| `status` | `status` | `int` |  |
| `success` | `success` | `boolean` |  |
| `ver` | `ver` | `String` |  |

**Sample response**
```json
{
  "data": {
    "data": "data",
    "remaining_otp": 1,
    "remaining_time": 1,
    "status": 1,
    "success": true,
    "ver": "10.1.2"
  },
  "success": true,
  "sendStatus": 200,
  "sendmessage": "OK"
}
```

### POST `v1/user-otp/send`
`retrofit.resendTwoOtp`

**Request body** `CheckUserResendOtpRequest`

| server name | Jackson name | type | flags |
|---|---|---|---|
| `username` | `username` | `String` |  |

**Sample request**
```json
{
  "body": {
    "username": "sam.rivera"
  }
}
```

**Response data** `CheckUserResendOtpResponse`

| server name | Jackson name | type | flags |
|---|---|---|---|
| `message` | `message` | `String` |  |
| `remaining_attempts` | `remaining_attempts` | `int` |  |

**Sample response**
```json
{
  "data": {
    "message": "Sample text",
    "remaining_attempts": 1
  },
  "success": true,
  "sendStatus": 200,
  "sendmessage": "OK"
}
```

### POST `v1/user/activate-user`
`retrofit.activateUser`

**Request body** `LoginRequest`

| server name | Jackson name | type | flags |
|---|---|---|---|
| `bat_status` | `bat_status` | `String` |  |
| `device_model` | `deviceInfo` | `String` | name_disagree |
| `gp_service_version` | `gp_service_version` | `String` |  |
| `lang` | `lang` | `String` |  |
| `os_ver` | `os_ver` | `String` |  |
| `password` | `password` | `String` |  |
| `terms_accepted` | `terms_accepted` | `String` |  |
| `token` | `token` | `String` |  |
| `username` | `username` | `String` |  |
| `ver` | `ver` | `String` |  |
| `device` | `device` | `String` |  |
| `otp` | `otp` | `String` |  |
| `method` | `method` | `String` |  |
| `transfer_token` | `transfer_token` | `String` |  |
| `twoFA_otp` | `twoFA_otp` | `String` |  |

**Sample request**
```json
{
  "body": {
    "bat_status": "85",
    "device_model": "Pixel 8",
    "gp_service_version": "24.40.1",
    "lang": "en",
    "os_ver": "14",
    "password": "<password>",
    "terms_accepted": "1",
    "token": "<token>",
    "username": "sam.rivera",
    "ver": "10.1.2",
    "device": "mobile",
    "otp": "482915",
    "method": "password",
    "transfer_token": "<token>",
    "twoFA_otp": ""
  }
}
```

**Response data** `CheckUserResponse`

| server name | Jackson name | type | flags |
|---|---|---|---|
| `api_url` | `api_url` | `String` |  |
| `available_methods` | `available_methods` | `ArrayList<AvailableMethod>` |  |
| `avatar` | `avatar` | `String` |  |
| `isActivated` | `isActivated` | `boolean` |  |
| `isPasswordSet` | `isPasswordSet` | `boolean` |  |
| `message` | `message` | `String` |  |
| `name` | `name` | `String` |  |
| `otp_limit` | `otp_limit` | `String` |  |
| `portal_url` | `portal_url` | `String` |  |
| `role` | `role` | `String` |  |
| `splashScreen` | `splashScreen` | `CompanyLogoSplash` |  |
| `terms_accepted` | `terms_accepted` | `int` |  |

**Sample response**
```json
{
  "data": {
    "api_url": "https://example.com/file.jpg",
    "available_methods": [
      {
        "method": "password",
        "redirect_url": "https://example.com/file.jpg"
      }
    ],
    "avatar": "https://example.com/file.jpg",
    "isActivated": true,
    "isPasswordSet": true,
    "message": "Sample text",
    "name": "Corner Mart",
    "otp_limit": "1",
    "portal_url": "https://example.com/file.jpg",
    "role": "role",
    "splashScreen": {
      "bgColor": "bgColor",
      "logo": "https://example.com/file.jpg",
      "splashLogo": "https://example.com/file.jpg"
    },
    "terms_accepted": 1
  },
  "success": true,
  "sendStatus": 200,
  "sendmessage": "OK"
}
```

### GET `v1/user/forgot-password`
`retrofit.forgotPassword`

**Query**
| name | type |
|---|---|
| `key_value` | `String` |

**Sample request**
```json
{
  "query": {
    "key_value": "key_value"
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

- `checkUser` has no path annotation: it takes a `@Url`. `defpackage/C0571Dj.java:638-647` builds `<central base> + v1/user/check-username`. The response carries `api_url` and `portal_url`, which switch the base URL for every later call (`defpackage/C6567tj.java:115-139`, falling back to `https://api.beatroute.io/`).
- Password screen sends `method=password`, `password` set, `otp=""`. OTP screen sends `method=otp`, `otp=<code>`, `password=""`, `terms_accepted="1"`.
- Branching after the username check: empty `name` shows an error; otherwise password screen, or activation if the account is not activated and has no password.
- Call chain: `EnterUsernameKotlin` -> `EnterUsernameViewModel` (obfuscated `defpackage/C1647Xy.java:41-63`) -> `DBManager.checkUser` -> `C0571Dj.n`. Login: `EnterPasswordKotlin` / `OtpVerificationActivity` -> `C1439Ty.b` -> `DBManager.login` (`DBManager.java:14585`) -> `C0571Dj.P0` -> `ApiInterface.login`.
- The splash screen reuses `DBManager.login` for silent token re-login (`SplashScreen.java:450`).

## Not verified

- Auth scheme for later calls (token header) was not traced.
- Whether the server accepts the Jackson name `deviceInfo` as well as `device_model`.
