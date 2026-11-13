# API reference (reconstructed from the decompiled client)

Machine-readable version: `openapi.json` / `openapi.yaml`; interactive: `swagger.html`. Worked examples per screen: `views/`.
Every call carries `suppress_response_codes=true`. Names are server names; see `../NAMING.md`. Samples are synthesised.

## Screens with worked examples

- [Sign-in (username, password, OTP)](views/01_sign_in.md)
- [Customer (retailer) list and detail](views/02_customers.md)
- [Take order and submit order](views/03_take_order.md)

## Endpoints

### User (1)

- **POST `v1/User/index`** (retrofit.getProfile) - query: `id`; body: `-`; response: `ArrayList<Profile>`

### activity (7)

- **GET `v1/activity/activity-type`** (kotlin.getScheduleActivityList) - query: -; body: `-`; response: `ArrayList<ScheduleActivityItem>`
- **GET `v1/activity/daily-activity`** (retrofit.getMyActivity) - query: `date`, `to_date`, `from_date`; body: `-`; response: `MyActivityResponse`
- **GET `v1/activity/daily-activity`** (kotlin.getActivityHistoryOnParameter) - query: `date`, `activity_type`; body: `-`; response: `MyActivityResponse`
- **GET `v1/activity/get-activity-list`** (kotlin.getTeamRetailerActivityList) - query: `retailer_id`, `date`, `isSelf`, `user_id`; body: `-`; response: `ArrayList<RetailerActivityData>`
- **GET `v1/activity/monthly-activity`** (retrofit.getSelfAttendance) - query: `year`, `month`; body: `-`; response: `ArrayList<SelfAttendenceRecord>`
- **GET `v1/activity/monthly-activity`** (kotlin.getMonthlyActivity) - query: `year`, `month`, `user_id`; body: `-`; response: `ArrayList<SelfAttendenceRecord>`
- **GET `v1/activity/retailer-list`** (kotlin.getTeamRetailerList) - query: `limit`, `page`, `isSelf`, `date`, `user_id`; body: `-`; response: `ArrayList<TeamRetailerData>`

### api (1)

- **GET `api/other-tasks`** (kotlin.getOtherTasks) - query: -; body: `-`; response: `List<OtherTask>`

### approval-workflow (2)

- **GET `/v1/approval-workflow/pending-approvals`** (kotlin.getExpenseApprovalUsers) - query: `type`, `parent_reference_id`; body: `-`; response: `List<ExpenseApprovalUser>`; flags: leading_slash
- **GET `/v1/approval-workflow/pending-approvals`** (kotlin.getWorkflowApprovalRequests) - query: `type`, `parent_reference_id`; body: `-`; response: `List<PendingOrder>`; flags: leading_slash

### async-job (1)

- **POST `v1/async-job/get-status`** (kotlin.getJobStatus) - query: -; body: `ScheduleJobRequest`; response: `ArrayList<ScheduleJobStatusResponse>`

### attendance (1)

- **POST `v1/attendance/mark-attendance`** (retrofit.submitAttendence) - query: -; body: `Attendance`; response: `DataPostRequest`

### awms (2)

- **POST `awms/workflow/approval-requests/update-status`** (kotlin.submitApproval) - query: -; body: `ApprovalRequest`; response: `ApprovalResponse`
- **GET `awms/workflow/reason/view/{action}`** (kotlin.getAllReasons) - query: `referenceId`; body: `-`; response: `AllReasonsApiResponse`

### beat-plan (1)

- **GET `v1/beat-plan/get-retailer`** (retrofit.getBeatPlanRetailerList) - query: `date`; body: `-`; response: `ArrayList<Retailer>`

### beat-route-alert (1)

- **POST `v1/beat-route-alert/send-self-order-nudge`** (kotlin.sendSelfOrderNudge) - query: -; body: `SelfOrderNudgeRequest`; response: `BaseApiResponse`

### brands (2)

- **GET `v1/brands/index`** (retrofit.getBrandsList) - query: -; body: `-`; response: `ArrayList<BrandsBean>`
- **GET `v1/brands/index`** (kotlin.getBrandsList) - query: -; body: `-`; response: `ArrayList<BrandsBean>`

### campaign-customer-participation (2)

- **POST `v1/campaign-customer-participation/history`** (kotlin.getRetailerParticipations) - query: `retailer_id`, `page`; body: `-`; response: `ArrayList<ParticipationHistoryDao>`
- **GET `v1/campaign-customer-participation/list`** (kotlin.getRetailerParticipants) - query: `response_id`; body: `-`; response: `ArrayList<ParticipantRetailersDao>`

### campaign-response (7)

- **GET `v1/campaign-response`** (retrofit.getCampaignHistoryList) - query: `campaign_id`, `retailer_id`; body: `-`; response: `ArrayList<HistoryDataList>`
- **GET `v1/campaign-response/linked-workflows-responses`** (kotlin.getLinkedWorkflowResponses) - query: `campaign_id`, `customer_id`; body: `-`; response: `ArrayList<LinkedWorkflowResponse>`
- **GET `v1/campaign-response/master-list`** (retrofit.getOpportunityResponseList) - query: -; body: `-`; response: `ArrayList<OpportunityResponseBean>`
- **GET `v1/campaign-response/master-list`** (kotlin.getOpportunityResponseList) - query: `campaign_id`, `expand`; body: `-`; response: `ArrayList<OpportunityResponseBean>`
- **GET `v1/campaign-response/open-responses`** (kotlin.getOpenResponseList) - query: `campaign_id`, `to_date`; body: `-`; response: `ArrayList<OpportunityResponseBean>`
- **GET `v1/campaign-response/view`** (retrofit.getCampaignHistory) - query: `res_id`, `campaign_id`, `retailer_id`; body: `-`; response: `CampainData`
- **GET `v1/campaign-response/view`** (kotlin.getCampaignResponseView) - query: `res_id`; body: `-`; response: `CampainData`

### campaign-team-participation (1)

- **GET `v1/campaign-team-participation/list`** (kotlin.getTeamParticipants) - query: `response_id`; body: `-`; response: `ArrayList<TeamDetails>`

### category (1)

- **GET `v1/category/index`** (kotlin.getCat) - query: `type`; body: `-`; response: `ArrayList<IdValue>`

### cue-alert (4)

- **GET `v1/cue-alert/action`** (retrofit.postReplyNoBody) - query: `id`, `notification_id`; body: `-`; response: `CueResponseBean`
- **POST `v1/cue-alert/action`** (retrofit.postReply) - query: `id`, `notification_id`; body: `-`; response: `CueResponseBean`
- **POST `v1/cue-alert/action`** (retrofit.postReply) - query: `id`, `notification_id`; body: `CuesScheduleBean`; response: `CueResponseBean`
- **GET `v1/cue-alert/response`** (retrofit.getCues) - query: `id`, `notification_id`; body: `-`; response: `CueResponseBean`

### custom-attribute (1)

- **GET `v1/custom-attribute`** (kotlin.getCustomQuestion) - query: -; body: `-`; response: `ArrayList<CustomQuestionModel>`

### customer-segment (2)

- **GET `v1/customer-segment/attributes`** (kotlin.getSegmentAttributes) - query: `page`; body: `-`; response: `ArrayList<Segment>`
- **GET `v1/customer-segment/sku-pricing`** (kotlin.getSkuSegmentPricing) - query: `page`; body: `-`; response: `ArrayList<SkuSegmentPricing>`

### dispatchedorder (7)

- **POST `v1/dispatchedorder/cancel`** (kotlin.cancelProformaStatus) - query: `id`; body: `-`; response: `UpdateProformaResponse`
- **POST `v1/dispatchedorder/create-dispatch`** (retrofit.submitDeliveryRelatedDispatch) - query: -; body: `SubmitDispatchHeader`; response: `DataPostRequest`
- **POST `v1/dispatchedorder/delivery`** (kotlin.getDeliveryOrders) - query: -; body: `OrderRequestDao`; response: `ArrayList<DeliveryOrderItemResponse>`
- **GET `v1/dispatchedorder/list-dispatch`** (retrofit.getDispatchList) - query: `retailer_id`; body: `-`; response: `DispatchListResponse`
- **POST `v1/dispatchedorder/update`** (retrofit.updateDeliveryRelatedDispatch) - query: `id`; body: `SubmitDispatchHeader`; response: `DataPostRequest`
- **GET `v1/dispatchedorder/view`** (retrofit.getDispatchFromServer) - query: `id`; body: `-`; response: `GetDispatchFromServer`
- **GET `v1/dispatchedorder/view`** (kotlin.getDispatchFromServer) - query: `id`; body: `-`; response: `GetDispatchFromServer`

### distributor (14)

- **GET `v1/distributor/distributor-chart-data`** (retrofit.getChartData) - query: `id`; body: `-`; response: `ChartData`; flags: trailing_space
- **GET `v1/distributor/get-pending-order`** (retrofit.getPendingOrderList) - query: `id`, `interval`, `start_date`; body: `-`; response: `ArrayList<DistributorPendingOrder>`
- **GET `v1/distributor/get-pending-sku`** (retrofit.getPendingSkuList) - query: `id`; body: `-`; response: `ArrayList<DistributorOrderSummaryProduct>`
- **GET `v1/distributor/history`** (retrofit.viewDistributorHistory) - query: `distributor`; body: `-`; response: `DataHistory`
- **GET `v1/distributor/outstanding`** (retrofit.getDistributorListforState) - query: `state_id`; body: `-`; response: `ArrayList<Distributor>`
- **GET `v1/distributor/outstanding`** (kotlin.getDistributorList) - query: -; body: `-`; response: `ArrayList<Distributor>`
- **GET `v1/distributor/product-summary`** (retrofit.getOrderSummaryForProduct) - query: `distributor`, `date`; body: `-`; response: `ArrayList<DistributorOrderSummaryProduct>`
- **GET `v1/distributor/retailer-order-summary`** (retrofit.getOrderSummaryForRStore) - query: `distributor`, `date`; body: `-`; response: `ArrayList<DistributorOrderSummaryStore>`
- **GET `v1/distributor/search-distributor`** (retrofit.searchDistributorList) - query: `search`; body: `-`; response: `ArrayList<Distributor>`
- **POST `v1/distributor/search-distributor-by-distance`** (retrofit.searchDistributorByDistance) - query: -; body: `DistributorHeader100km`; response: `ArrayList<Distributor>`
- **GET `v1/distributor/send-summary-email`** (retrofit.sendMail) - query: `distributor`, `date`, `email`; body: `-`; response: `DataPostRequest`
- **POST `v1/distributor/update`** (retrofit.updateDistributor) - query: `id`; body: `Distributor`; response: `DataPostRequest`
- **GET `v1/distributor/update-location`** (retrofit.updateDistributorLocation) - query: `image`, `latitude`, `longitude`, `id`; body: `-`; response: `DataPostRequest`
- **GET `v1/distributor/view`** (retrofit.viewDistributor) - query: `id`; body: `-`; response: `Distributor`

### distributor-feedback (2)

- **POST `v1/distributor-feedback/create`** (retrofit.submitFeedbackDistributor) - query: -; body: `Feedback_distributor`; response: `DataPostRequest`
- **GET `v1/distributor-feedback/view`** (retrofit.getFeedbackDistributor) - query: `id`; body: `-`; response: `DistributorFeedbackResponse`

### distributor-stock (2)

- **POST `v1/distributor-stock/create`** (retrofit.submitDistributorStock) - query: -; body: `SubmitStockHeader`; response: `DataPostRequest`
- **GET `v1/distributor-stock/view`** (retrofit.getDistributorStockFromServer) - query: `id`; body: `-`; response: `ArrayList<DistributerStockViewData>`

### distributororder (2)

- **POST `v1/distributororder/create`** (retrofit.submitPrimaryOrder) - query: -; body: `SubmitPrimaryOrderHeader`; response: `DataPostRequest`
- **GET `v1/distributororder/view`** (retrofit.getdistributOrderFromServer) - query: `id`; body: `-`; response: `GetPrimaryOrderFromServer`

### dms (9)

- **GET `dms/van-inventory/stock-reconcile/get-request`** (kotlin.getVanReconciliationDetails) - query: `distributorId`; body: `-`; response: `VanReconciliationData`
- **POST `dms/van-inventory/stock-reconcile/status-update`** (kotlin.confirmVanReconciliationDetails) - query: -; body: `SubmitVanReconcileStatusRequest`; response: `SubmitVanReconcileStatusResponse`
- **POST `dms/van-inventory/stock-request/create`** (kotlin.createVanInventoryStock) - query: -; body: `VanStockRequest`; response: `BaseApiResponse`
- **POST `dms/van-inventory/stock-request/index`** (kotlin.getVanInventoryStockRequested) - query: `page`; body: `VanStockViewRequest`; response: `VanStockDetail`
- **GET `dms/van-inventory/stock-request/last-stock-request-skus`** (kotlin.getLastStockRequest) - query: `distributorId`; body: `-`; response: `LastOrderResponse`
- **POST `dms/van-inventory/stock-request/update`** (kotlin.updateVanInventoryStock) - query: -; body: `VanStockUpdateRequest`; response: `BaseApiResponse`
- **POST `dms/van-inventory/stock-request/view`** (kotlin.getVanInventoryView) - query: `id`; body: `-`; response: `VanStockViewResponse`
- **GET `dms/van-inventory/van/view`** (kotlin.getVanView) - query: `id`, `distributor_id`; body: `-`; response: `VanViewResponse`
- **GET `dms/van-inventory/van/view/last-reconciliation-date`** (kotlin.getReconciliationDate) - query: -; body: `-`; response: `ReconcilationDetailResponse`

### dynamic (2)

- **GET `(dynamic URL)`** (kotlin.assistEligibility) - query: -; body: `-`; response: `AssistEligibilityResponse`; flags: dynamic_url
- **POST `(dynamic URL)`** (retrofit.checkUser) - query: -; body: `CheckUserRequest`; response: `CheckUserResponse`; flags: dynamic_url

### expense (2)

- **GET `/v1/expense/master`** (kotlin.getExpenseMaster) - query: -; body: `-`; response: `ArrayList<ExpenseMasterResponse>`; flags: leading_slash
- **POST `/v1/expense/ocr-extract`** (kotlin.extractExpenseOcr) - query: -; body: `OcrExtractRequest`; response: `OcrExtractResponse`; flags: leading_slash

### expense-response (3)

- **POST `/v1/expense-response/approve-claims`** (kotlin.submitExpenseClaimApproval) - query: -; body: `ExpenseClaimApprovalRequest`; response: `ApprovalResponse`; flags: leading_slash
- **POST `/v1/expense-response/approve-users`** (kotlin.submitExpenseUserApproval) - query: -; body: `ExpenseUserApprovalRequest`; response: `ApprovalResponse`; flags: leading_slash
- **GET `/v1/expense-response/master-list`** (kotlin.getExpenseClaimsList) - query: `campaign_id`, `search`, `from_date`, `to_date`, `team`, `approvalStatus`, `paymentStatus`, `page`; body: `-`; response: `ArrayList<ExpenseClaimResponse>`; flags: leading_slash

### feedback (2)

- **POST `v1/feedback/create`** (retrofit.submitFeedback) - query: -; body: `Feedback`; response: `DataPostRequest`
- **GET `v1/feedback/view`** (retrofit.getFeedback) - query: `id`; body: `-`; response: `FeedbackRetailer`

### field-heroes (2)

- **GET `v1/field-heroes/config`** (kotlin.getLeaderboardPoints) - query: -; body: `-`; response: `ArrayList<LeaderboardPointsBean>`
- **GET `v1/field-heroes/my-rank`** (kotlin.getRank) - query: -; body: `-`; response: `RankData`

### filemanager (3)

- **GET `v1/filemanager/get-s3-presigned-url`** (retrofit.getPreSignedURL) - query: `type`, `id`, `file`, `action`; body: `-`; response: `String`
- **GET `v1/filemanager/get-s3-presigned-url`** (kotlin.getPreSignedURL) - query: `type`, `id`, `file`, `action`; body: `-`; response: `String`
- **GET `v1/filemanager/get-s3-security-credentials`** (retrofit.getS3Credentials) - query: -; body: `-`; response: `S3_security_credentials`

### geo-boundary (1)

- **GET `v1/geo-boundary/get-villages`** (kotlin.getVillageList) - query: `taluka`; body: `-`; response: `ArrayList<VillageData>`

### goal-tracking (6)

- **POST `v1/goal-tracking/activity-stats`** (kotlin.getGoalTrackingActivityState) - query: `expand`; body: `TeamMemberRequest`; response: `TeamActivityStateResponse`
- **POST `v1/goal-tracking/customer-wise-moves`** (kotlin.getCustomerWiseMoves) - query: `page`; body: `TeamMemberRequest`; response: `List<TeamActivityResponse>`
- **POST `v1/goal-tracking/customer-wise-visit-activity`** (kotlin.getTeamActivityList) - query: `page`; body: `TeamMemberRequest`; response: `List<TeamActivityResponse>`
- **GET `v1/goal-tracking/inactive-team-member`** (kotlin.getInactiveTeamMembers) - query: `date`, `user_id`; body: `-`; response: `List<InactiveTeamMemberResponse>`
- **POST `v1/goal-tracking/team-member`** (kotlin.getTeamMembersList) - query: `page`, `expand`; body: `TeamMemberRequest`; response: `List<TeamMemberMasterResponse>`
- **POST `v1/goal-tracking/team-member`** (kotlin.getTeamMembersListSearch) - query: `page`, `expand`; body: `TeamMemberRequest`; response: `List<TeamUserData>`

### joint-visit (5)

- **GET `v1/joint-visit/active`** (kotlin.getActiveJointVisit) - query: -; body: `-`; response: `JointVisitActiveResponse`
- **GET `v1/joint-visit/eligible-users`** (kotlin.getJointVisitEligibleUsers) - query: -; body: `-`; response: `JointVisitEligibleUsersResponse`
- **POST `v1/joint-visit/end`** (kotlin.endJointVisit) - query: -; body: `EndJointVisitRequest`; response: `JointVisitEndResponse`
- **POST `v1/joint-visit/start`** (kotlin.startJointVisit) - query: -; body: `StartJointVisitRequest`; response: `JointVisitStartResponse`
- **GET `v1/joint-visit/tagged-retailers`** (kotlin.getTaggedRetailers) - query: `session_id`; body: `-`; response: `JointVisitTaggedResponse`

### loyality (2)

- **POST `v1/loyality/get-reward-detail`** (kotlin.getLoyaltyPointsDetail) - query: -; body: `LoyaltyPointsRequest`; response: `ArrayList<LoyaltyPointsData>`
- **POST `v1/loyality/get-rewards`** (kotlin.getLoyaltyPoints) - query: `page`, `limit`; body: `LoyaltyPointsRequest`; response: `ArrayList<LoyaltyPointsData>`

### move (5)

- **POST `v1/move`** (kotlin.getMoves) - query: -; body: `MovesRequest`; response: `ArrayList<Move>`
- **POST `v1/move/activity`** (kotlin.getMovesActivity) - query: -; body: `MoveActivityRequest`; response: `ArrayList<Move>`
- **POST `v1/move/create`** (kotlin.createMove) - query: -; body: `CreateMoveRequest`; response: `CreateMoveResult`
- **GET `v1/move/history`** (kotlin.getMovesHistory) - query: `retailer_id`, `from_date`, `to_date`, `search`, `status`, `page`; body: `-`; response: `ArrayList<Move>`
- **POST `v1/move/update`** (kotlin.updateMove) - query: `id`; body: `UpdateMoveRequest`; response: `Object`

### notification (2)

- **GET `v1/notification/index`** (kotlin.getNotification) - query: `page`; body: `-`; response: `ArrayList<NotificationBean>`
- **POST `v1/notification/update-status`** (retrofit.updateNotificationReadStatus) - query: -; body: `NotificationId`; response: `DataPostRequest`

### order (9)

- **POST `v1/order/approve-reject`** (kotlin.fetchOrderApprovalStatus) - query: -; body: `OrderApproval`; response: `TaskMessage`
- **POST `v1/order/cancel`** (kotlin.cancelOrderStatus) - query: `id`; body: `RemarksData`; response: `UpdateOrderResponse`
- **POST `v1/order/create`** (retrofit.submitOrder) - query: -; body: `SubmitOrderHeader`; response: `DataPostRequest`
- **GET `v1/order/delete`** (retrofit.deletePendingOrder) - query: `id`; body: `-`; response: `DataPostRequest`
- **POST `v1/order/get-pending-orders`** (kotlin.getPendingOrder) - query: -; body: `OrderRequestDao`; response: `ArrayList<OutOfDeliveryOrderItemResponse>`
- **GET `v1/order/index`** (kotlin.fetchorderapprovalslist) - query: `pendingForApproval`, `page`; body: `-`; response: `ArrayList<OrdersPendingData>`
- **GET `v1/order/pending-orders-to-approve`** (kotlin.getPendingOrders) - query: `expand`, `page`, `only_return`; body: `-`; response: `List<PendingOrder>`
- **GET `v1/order/sold-msl-fsl-mtd`** (kotlin.getProductMtd) - query: `mtdDateTime`, `retailerId`; body: `-`; response: `ArrayList<Mtd_MSL>`
- **GET `v1/order/view`** (retrofit.getOrderFromServer) - query: `id`; body: `-`; response: `GetOrderFromServer`

### otp-verification (2)

- **POST `v1/otp-verification/send`** (kotlin.sendCampaignOtp) - query: -; body: `OtpSendRequest`; response: `OtpSendResponse`
- **POST `v1/otp-verification/verify`** (kotlin.verifyCampaignOtp) - query: -; body: `OtpVerifyRequest`; response: `OtpVerifyResponse`

### outstanding (1)

- **GET `v1/outstanding/overdue-payments`** (kotlin.getRetailerOverdue) - query: `retailer_id`; body: `-`; response: `ArrayList<OverduePayment>`

### payment (3)

- **POST `v1/payment/create`** (retrofit.submitPayment) - query: -; body: `SubmitPaymentHeader`; response: `DataPostRequest`
- **POST `v1/payment/create-distributor-payment`** (retrofit.submitPrimaryPayment) - query: -; body: `SubmitPrimaryPaymentHeader`; response: `DataPostRequest`
- **GET `v1/payment/view`** (retrofit.getPaymentFromServer) - query: `id`; body: `-`; response: `GetPaymentFromServer`

### payment-term (2)

- **GET `v1/payment-term/conditions-list`** (kotlin.getPaymentTermConditions) - query: `retailer_id`, `distributor_id`; body: `-`; response: `ArrayList<PaymentTermResponse>`
- **GET `v1/payment-term/view`** (kotlin.getPaymentTermConditionsDetail) - query: `id`; body: `-`; response: `PaymentTermResponse`

### postal-codes (1)

- **POST `v1/postal-codes/get-pincode-info`** (kotlin.getAddressByPinCode) - query: -; body: `PinCodeRequest`; response: `PinCodeResponse`

### pricing-edit-rule (1)

- **GET `v1/pricing-edit-rule/master-list`** (kotlin.getCommonPricingRules) - query: `page`; body: `-`; response: `ArrayList<CommonPricingRule>`

### primary-invoice (1)

- **GET `v1/primary-invoice/view`** (kotlin.getDispatchDetail) - query: `invoiceId`; body: `-`; response: `PrimaryDispatchData`

### product-group (1)

- **GET `v1/product-group`** (kotlin.getSkuProductGroup) - query: -; body: `-`; response: `ArrayList<SkuGroupItemResponse>`

### profile (10)

- **POST `v1/profile/change-password`** (retrofit.changePassword) - query: -; body: `ChangePassword`; response: `DataPostRequest`
- **GET `v1/profile/feature-request`** (retrofit.sendInterest) - query: -; body: `-`; response: `DataPostRequest`
- **POST `v1/profile/send-support-mail`** (retrofit.sendSupportMail) - query: -; body: `SupportMail`; response: `DataPostRequest`
- **GET `v1/profile/sr-team`** (retrofit.getSRTeamReport) - query: `cid`, `d`; body: `-`; response: `ArrayList<TeamDetails>`
- **GET `v1/profile/team`** (retrofit.get_SM_TSM_TeamReport) - query: `cid`, `d`; body: `-`; response: `ArrayList<TeamDetails>`
- **POST `v1/profile/update`** (retrofit.updateProfile) - query: -; body: `ProfileRequest`; response: `DataPostRequest`
- **POST `v1/profile/update-fcm-token`** (retrofit.updateFCMCode) - query: -; body: `SingleRequest`; response: `DataPostRequest`
- **POST `v1/profile/update-freshchat-token`** (retrofit.submitFreshChatToken) - query: -; body: `Profile`; response: `BaseApiResponse`
- **POST `v1/profile/update-freshchat-token`** (kotlin.submitFreshChatToken) - query: -; body: `Profile`; response: `BaseApiResponse`
- **POST `v1/profile/update-gcm-token`** (retrofit.updateGCMCode) - query: -; body: `SingleRequest`; response: `DataPostRequest`

### purchase-log (1)

- **GET `v1/purchase-log/view`** (retrofit.getPurchaseLogFromServer) - query: `id`; body: `-`; response: `GetSalesLogfromServer`

### reason-list (2)

- **POST `v1/reason-list/index`** (kotlin.getOrderCancelRemarks) - query: -; body: `OrderReturnRequest`; response: `ArrayList<ReturnReasonItem>`
- **POST `v1/reason-list/index`** (kotlin.getReturnReasons) - query: -; body: `OrderReturnRequest`; response: `ArrayList<ReturnReasonItem>`

### recommended-customer (1)

- **GET `v1/recommended-customer/index`** (kotlin.getRecommendedCustomers) - query: `routeId`, `priority`, `notScheduledFrequency`, `tasks`, `refIds`, `search`, `sort`, `page`; body: `-`; response: `ArrayList<RecommendedCustomers>`

### recommended-route (1)

- **GET `v1/recommended-route/index`** (kotlin.getRecommendedRoutes) - query: `page`; body: `-`; response: `ArrayList<RecommendedRouteDao>`

### report-template (2)

- **GET `v1/report-template/return-invoice`** (kotlin.getReturnTemplate) - query: -; body: `-`; response: `InvoiceTemplateDao`
- **GET `v1/report-template/view`** (kotlin.getInvoiceTemplate) - query: -; body: `-`; response: `InvoiceTemplateDao`

### retailer (50)

- **POST `v1/retailer/all`** (kotlin.getAllRetailers) - query: `page`; body: `DataSearchFilter`; response: `ArrayList<Retailer>`
- **GET `v1/retailer/assets`** (kotlin.getRetailerAssets) - query: `retailer`, `search`, `page`, `per-page`; body: `-`; response: `ArrayList<RetailerAsset>`
- **POST `v1/retailer/associate`** (retrofit.updateRetailerAssociate) - query: `id`; body: `Retailer`; response: `DataPostRequest`
- **GET `v1/retailer/attributes`** (kotlin.getUserAttributes) - query: -; body: `-`; response: `UserAttributeResponse`
- **GET `v1/retailer/base-pricing`** (retrofit.getRetailerBasedPricing) - query: -; body: `-`; response: `ArrayList<RetailerBasedPricingBean>`
- **POST `v1/retailer/bulk-create`** (kotlin.createBulkRetailers) - query: -; body: `BulkRetailersDao`; response: `ArrayList<String>`
- **POST `v1/retailer/change-stage`** (retrofit.changeRetailerStage) - query: -; body: `Map<String, String>`; response: `DataPostRequest`
- **POST `v1/retailer/change-status`** (kotlin.changeRetailerStatus) - query: `id`; body: `RetailerStatusResponse`; response: `RetailerUpdatedStatusResponse`
- **POST `v1/retailer/check-duplicate-retailer`** (retrofit.checkRetailer) - query: -; body: `CheckRetailer`; response: `CheckRetailerDuplicate`
- **GET `v1/retailer/cities`** (kotlin.getRetailerCities) - query: -; body: `-`; response: `CitiesResponse`
- **GET `v1/retailer/contacts`** (retrofit.getContactPerson) - query: `id`; body: `-`; response: `ArrayList<ContactPerson>`
- **GET `v1/retailer/contacts`** (kotlin.getContactPerson) - query: `id`; body: `-`; response: `ArrayList<ContactPerson>`
- **POST `v1/retailer/create`** (retrofit.submitNewRetailer) - query: -; body: `Retailer`; response: `DataPostRequest`
- **GET `v1/retailer/extra-data`** (retrofit.getRetailerOutstandingBalance) - query: `retailer_id`, `distributor_id`; body: `-`; response: `ArrayList<RetailerLedgerInfo>`
- **GET `v1/retailer/extra-data`** (kotlin.getRetailerOutstandingBalance) - query: `retailer_id`, `distributor_id`; body: `-`; response: `ArrayList<RetailerLedgerInfo>`
- **GET `v1/retailer/find-duplicate-retailers`** (kotlin.getDuplicateRetailersList) - query: `id`; body: `-`; response: `ArrayList<DuplicateRetailersResponseBean>`
- **GET `v1/retailer/generate-otp`** (retrofit.getOtp) - query: `mobile`; body: `-`; response: `OtpModel`
- **GET `v1/retailer/get-account-statement`** (kotlin.getAccountStatement) - query: `retailer`, `page`, `Start_date`, `End_date`, `distributor_id`, `filter`; body: `-`; response: `ArrayList<AccountStatementData>`
- **GET `v1/retailer/get-associate-retailers`** (kotlin.getAssociatedCustomer) - query: `id`, `scenario`; body: `-`; response: `ArrayList<AssociatedCustomersData>`
- **GET `v1/retailer/get-custom-detail`** (retrofit.getRetailerFieldsExtra) - query: `id`; body: `-`; response: `Retailer`
- **POST `v1/retailer/get-history`** (retrofit.viewRetailerHistory) - query: `retailerId`, `page`, `id`, `orderId`; body: `HistoryFilterReq`; response: `ArrayList<CustomerHistoryListBean>`
- **POST `v1/retailer/get-product-serial-number`** (kotlin.getRetailerProductSerialNumber) - query: -; body: `RetailerSerialLookupRequest`; response: `RetailerSerialLookupData`
- **GET `v1/retailer/get-profile-info`** (retrofit.getRetailerExtraInfo) - query: `retailer_id`; body: `-`; response: `RetailerExtraInfoResponse`
- **GET `v1/retailer/get-profile-info`** (kotlin.getRetailerExtraInfo) - query: `retailer_id`; body: `-`; response: `RetailerExtraInfoResponse`
- **GET `v1/retailer/get-retailer-product-promoter`** (retrofit.getRetailerForProductPromotor) - query: -; body: `-`; response: `GetRetailerPromoterResponse`
- **GET `v1/retailer/index`** (retrofit.getViewRetailer) - query: `id`, `expand`; body: `-`; response: `Retailer`
- **GET `v1/retailer/index`** (kotlin.getCustomerApprovedList) - query: `completedApprovalTillDate`, `expand`; body: `-`; response: `ArrayList<Retailer>`
- **GET `v1/retailer/index`** (kotlin.getCustomerPendingApprovalList) - query: `pendingApproval`, `expand`; body: `-`; response: `ArrayList<Retailer>`
- **GET `v1/retailer/index`** (kotlin.getJumpCallRetailerListDelta) - query: `distributor_id`, `expand`, `page`, `last_updated_on`; body: `-`; response: `ArrayList<Retailer>`
- **GET `v1/retailer/index`** (kotlin.getJumpCallRetailerList_coroutine) - query: `distributor_id`, `expand`, `page`; body: `-`; response: `ArrayList<Retailer>`
- **GET `v1/retailer/index`** (kotlin.getViewRetailer) - query: `id`, `expand`; body: `-`; response: `Retailer`
- **POST `v1/retailer/index`** (retrofit.getFilterRetailerList) - query: `search`, `distributor_id`, `expand`; body: `FilterBody`; response: `ArrayList<Retailer>`
- **POST `v1/retailer/index`** (kotlin.getFilterRetailerList) - query: `search`, `expand`, `page`, `pagination`, `retailerLimit`; body: `FilterBody`; response: `ArrayList<Retailer>`
- **POST `v1/retailer/index`** (kotlin.getStateCallRetailerList) - query: `distributor_id`, `page`, `pagination`, `expand`; body: `-`; response: `ArrayList<Retailer>`
- **GET `v1/retailer/inventory`** (kotlin.getInventoryStock) - query: `retailer`, `page`, `Start_date`, `End_date`; body: `-`; response: `InventoryData`
- **GET `v1/retailer/retailer-label`** (retrofit.getlabelsforRetailer) - query: `retailer_id`; body: `-`; response: `ArrayList<LabelForRetailer>`; flags: trailing_space
- **GET `v1/retailer/retailer-label`** (kotlin.getlabelsforRetailer) - query: `retailer_id`; body: `-`; response: `ArrayList<LabelForRetailer>`; flags: trailing_space
- **POST `v1/retailer/search-retailer`** (kotlin.getRetailerOfCompany) - query: `page`; body: `FilterBean`; response: `ArrayList<Retailer>`
- **POST `v1/retailer/source-data-retailers`** (kotlin.getSourceDataForRetailers) - query: `page`; body: `CustomerDaoRequest`; response: `ArrayList<CustomerDaoResponse>`
- **GET `v1/retailer/status/{id}`** (kotlin.getRetailerStatus) - query: -; body: `-`; response: `RetailerStatusResponse`
- **GET `v1/retailer/team`** (retrofit.getRetailerListExtra) - query: `id`; body: `-`; response: `Retailer`
- **GET `v1/retailer/team-mapping`** (retrofit.getRetailerListTeam) - query: `id`; body: `-`; response: `ArrayList<RetailerTeamResponse>`
- **GET `v1/retailer/team-mapping`** (kotlin.getRetailerListTeam) - query: `id`; body: `-`; response: `ArrayList<RetailerTeamResponse>`
- **POST `v1/retailer/update`** (retrofit.submitUpdatedRetailer) - query: `id`, `user_latitude`, `user_longitude`; body: `Retailer`; response: `DataPostRequest`
- **POST `v1/retailer/update-contacts`** (retrofit.submitRetailerContact) - query: `id`; body: `ArrayList<ContactPerson>`; response: `ContactPersonResponse`
- **POST `v1/retailer/update-route`** (retrofit.updateRetailerRoute) - query: -; body: `RouteUpdateRequest`; response: `RouteUpdateResponse`
- **POST `v1/retailer/verify-ifsc`** (kotlin.verifyIfsc) - query: -; body: `IfscVerificationRequest`; response: `IfscVerificationData`
- **POST `v1/retailer/verify-statutory`** (retrofit.verifyStatutory) - query: -; body: `VerifyStatutoryRequest`; response: `VerifyStatutoryData`
- **GET `v1/retailer/view-note`** (kotlin.getViewNote) - query: `id`, `type`; body: `-`; response: `CreditDebitData`
- **GET `v1/retailer/view-update-history`** (retrofit.viewRetailerHistoryDetail) - query: `activityId`, `retailerId`; body: `-`; response: `RetailerHistoryDetailResponse`

### retailer-bucket (2)

- **GET `v1/retailer-bucket/customer-ageing-wise-data`** (kotlin.getCustomerWiseAgeingData) - query: `customerId`, `distributorId`; body: `-`; response: `ArrayList<CustomerWiseAgeingData>`
- **GET `v1/retailer-bucket/index`** (kotlin.getBucketData) - query: -; body: `-`; response: `ArrayList<AgeingBucketData>`

### retailer-calllog (2)

- **POST `v1/retailer-calllog/create`** (retrofit.submitCallLog) - query: `id`; body: `CallLogsData`; response: `DataPostRequest`
- **GET `v1/retailer-calllog/view`** (retrofit.getCallLogbyId) - query: `id`; body: `-`; response: `CallLogsData`

### retailer-segment (1)

- **GET `v1/retailer-segment/master-list`** (kotlin.getCommonSegments) - query: `page`; body: `-`; response: `ArrayList<CommonSegment>`

### retailer-stage (1)

- **GET `v1/retailer-stage/get-stage`** (kotlin.getStageList) - query: -; body: `-`; response: `ArrayList<Stage>`

### retailer-stats (2)

- **GET `v1/retailer-stats/status-counts`** (kotlin.getRetailerStatusCount) - query: -; body: `-`; response: `RetailerStatus`
- **GET `v1/retailer-stats/subtype-stats`** (kotlin.getSubtypeCount) - query: `team_member_id`; body: `-`; response: `ArrayList<SubtypeCountDao>`

### retailer-stock (2)

- **POST `v1/retailer-stock/create`** (retrofit.submitRetailerStock) - query: -; body: `SubmitStockHeader`; response: `DataPostRequest`
- **GET `v1/retailer-stock/view`** (retrofit.getRetailerStockFromServer) - query: `id`; body: `-`; response: `StockViewdata`

### retailer-visit-target (3)

- **POST `v1/retailer-visit-target/index`** (kotlin.getRetailerVisitTargetWithFilter) - query: `search`, `page`, `pagination`, `retailerLimit`; body: `FilterBody`; response: `ArrayList<RetailerVisitTarget>`
- **GET `v1/retailer-visit-target/pending-approval-customers-count`** (kotlin.getPendingApprovalCustomersCount) - query: `user_id`; body: `-`; response: `OtherTaskCountResponse`
- **POST `v1/retailer-visit-target/update`** (kotlin.updateRetailerVisitTarget) - query: -; body: `UpdateRetailerVisitTargetRequest`; response: `RetailerStatusResponse`

### route (2)

- **GET `v1/route/index`** (kotlin.getRouteList) - query: -; body: `-`; response: `ArrayList<DataRoute>`
- **POST `v1/route/plan`** (kotlin.createPlan) - query: -; body: `CreatePlanRequest`; response: `CreatePlanResponse`

### routing (1)

- **GET `v1/routing/credentials`** (kotlin.getRoutingCredentials) - query: `provider`; body: `-`; response: `RouteCredentialsDto`

### sales-log (4)

- **POST `v1/sales-log/create`** (retrofit.submitSalesLog) - query: -; body: `SubmitSalesLogHeader`; response: `DataPostRequest`
- **POST `v1/sales-log/fetch-sku-by-serial-number`** (kotlin.fetchSkubySerialNumber) - query: -; body: `SkuSerialNumber`; response: `Product`
- **GET `v1/sales-log/get-sales-info`** (retrofit.getInfoBandForSkuSales) - query: -; body: `-`; response: `ArrayList<DataSkuSalesInfo>`
- **GET `v1/sales-log/view`** (retrofit.getSalesLogFromServer) - query: `id`; body: `-`; response: `GetSalesLogfromServer`

### schedule (8)

- **POST `v1/schedule/analytics`** (kotlin.getActivitiesAnalysis) - query: -; body: `RequestActivitiesAnalysis`; response: `ActivitiesAnalysisResponse`
- **POST `v1/schedule/create`** (retrofit.createSchedule) - query: -; body: `ScheduleRequest`; response: `CreateScheduleResponse`
- **DELETE `v1/schedule/delete`** (retrofit.deleteSchedule) - query: -; body: `-`; response: `DataPostRequest`
- **GET `v1/schedule/get-retailers`** (retrofit.getScheduleOfRetailer) - query: `retailer_id`, `limit`; body: `-`; response: `ArrayList<ScheduleData>`
- **GET `v1/schedule/get-retailers`** (kotlin.getScheduleOfRetailer) - query: `retailer_id`, `limit`; body: `-`; response: `ArrayList<ScheduleData>`
- **GET `v1/schedule/get-retailers`** (kotlin.getScheduleRetailerList) - query: `date`, `page`, `limit`, `buckets`, `overdue`, `overdueIn7Days`, `expand`, `user_id`; body: `-`; response: `ArrayList<ScheduleData>`
- **GET `v1/schedule/missed-retailers`** (kotlin.getMissedRetailers30d) - query: `user_id`; body: `-`; response: `MissedScheduleResponse`
- **POST `v1/schedule/update`** (retrofit.updateSchedule) - query: -; body: `ScheduleRequest`; response: `CreateScheduleResponse`

### scheme (5)

- **GET `v1/scheme/get-all`** (retrofit.getSchemeList) - query: `scheme_condition_type`; body: `-`; response: `ArrayList<SchemeApplication>`
- **GET `v1/scheme/get-all`** (retrofit.getSchemeListBuyXGetY) - query: `scheme_condition_type`; body: `-`; response: `ArrayList<SchemeApplicationBuyXGetY>`
- **GET `v1/scheme/get-all`** (kotlin.getSchemeList) - query: `scheme_condition_type`; body: `-`; response: `ArrayList<SchemeApplication>`
- **GET `v1/scheme/get-all`** (kotlin.getSchemeListBuyXGetY) - query: `scheme_condition_type`; body: `-`; response: `ArrayList<SchemeApplicationBuyXGetY>`
- **GET `v1/scheme/index`** (retrofit.getScheme) - query: `distributor`, `sku`, `retailer_id`; body: `-`; response: `ArrayList<Scheme>`

### scorecard (1)

- **GET `v1/scorecard/kpi-by-user`** (kotlin.getKpiListByUser) - query: -; body: `-`; response: `ArrayList<KpiItem>`

### sku (17)

- **POST `/v1/sku/other-skus`** (kotlin.getMarketingAssetsList) - query: `page`; body: `MarketingAssetsRequest`; response: `ArrayList<Product>`; flags: leading_slash
- **GET `v1/sku/customer-price`** (kotlin.getCustomerSkuPrice) - query: `page`, `distributor_id`, `retailer_id`; body: `-`; response: `ArrayList<DataSKU>`
- **GET `v1/sku/distributor-inventory`** (kotlin.getDistributorInventory) - query: `id`; body: `-`; response: `ArrayList<VanSKusData>`
- **GET `v1/sku/featured`** (kotlin.getSkuFeature) - query: `retailer_id`; body: `-`; response: `SkuTypeData`
- **GET `v1/sku/get-all-list`** (retrofit.getAllSKUList) - query: -; body: `-`; response: `ArrayList<Product>`
- **GET `v1/sku/get-all-list`** (kotlin.getAllSKUList) - query: -; body: `-`; response: `ArrayList<Product>`
- **GET `v1/sku/get-config`** (kotlin.getProductCategoryType) - query: `retailerId`; body: `-`; response: `ArrayList<Golden_Points>`
- **POST `v1/sku/get-external-price`** (kotlin.fetchskuexternalprice) - query: -; body: `SkuDetailsRequest`; response: `SkuExternalPriceResponse`
- **GET `v1/sku/get-invoice`** (kotlin.getInvoice) - query: `page`, `sku_id`, `retailer_id`; body: `-`; response: `ArrayList<InvoiceResponse>`
- **GET `v1/sku/master`** (kotlin.getSkuMaster) - query: `last_updated_on`; body: `-`; response: `ResponseBody`
- **GET `v1/sku/price`** (retrofit.getUpdatedSKUList) - query: `rate_updated_on`, `distributorOnly`; body: `-`; response: `ArrayList<Product>`
- **GET `v1/sku/price`** (kotlin.getSKUList) - query: `page`, `last_updated_on`, `distributorOnly`; body: `-`; response: `ArrayList<Product>`
- **POST `v1/sku/price`** (retrofit.getSKUListDistributor) - query: `page`; body: `SingleRequest`; response: `ArrayList<DataSKU>`
- **POST `v1/sku/price`** (retrofit.getUpdatedSKUListDistributor) - query: `rate_updated_on`; body: `SingleRequest`; response: `ArrayList<DataSKU>`
- **GET `v1/sku/retailer-sku`** (retrofit.getInfoBandForSKU) - query: `retailer_id`, `distributor_id`, `type`; body: `-`; response: `ArrayList<DataSKU>`
- **GET `v1/sku/van-skus`** (kotlin.getVanSkusList) - query: -; body: `-`; response: `ArrayList<VanSKusData>`
- **GET `v1/sku/view`** (retrofit.getSkuDetail) - query: `suppress_response_code`, `id`, `distributor_id`; body: `-`; response: `Product`

### sku-category (2)

- **GET `v1/sku-category/index`** (retrofit.getSKUCategoryList) - query: -; body: `-`; response: `ArrayList<SkuCategory>`
- **GET `v1/sku-category/index`** (kotlin.getSKUCategoryList) - query: -; body: `-`; response: `ArrayList<SkuCategory>`

### start-end-day-activity (5)

- **GET `v1/start-end-day-activity/end-day`** (kotlin.getDayOutDetail) - query: `id`; body: `-`; response: `DayOutModel`
- **POST `v1/start-end-day-activity/end-day`** (retrofit.submitDayOut) - query: -; body: `DayOutModel`; response: `DataPostRequest`
- **GET `v1/start-end-day-activity/get-activity`** (kotlin.getStartEndDayActivity) - query: `date`, `user_id`; body: `-`; response: `StartEndDayActivityResponse`
- **GET `v1/start-end-day-activity/start-day`** (kotlin.getDayInDetail) - query: `id`; body: `-`; response: `DayInModel`
- **POST `v1/start-end-day-activity/start-day`** (retrofit.submitDayIn) - query: -; body: `DayInModel`; response: `DataPostRequest`

### state (2)

- **GET `v1/state/index`** (retrofit.getState) - query: -; body: `-`; response: `ArrayList<StateList>`
- **GET `v1/state/index`** (kotlin.getState) - query: -; body: `-`; response: `ArrayList<StateList>`

### stream (11)

- **GET `v1/stream/content-view-count`** (retrofit.getContentCount) - query: `entity_id`, `topic_id`; body: `-`; response: `ArrayList<ContentViewCount>`
- **POST `v1/stream/feedback`** (kotlin.submitLnDContentFeedback) - query: -; body: `LnDContentFeedbackRequest`; response: `Object`
- **GET `v1/stream/feedback-response`** (kotlin.getLnDContentFeedbackResponse) - query: `page`, `retailer_id`; body: `-`; response: `ArrayList<LnDContentFeedbackPair>`
- **GET `v1/stream/get-categories`** (retrofit.getCategoryDataForTopic) - query: `id`; body: `-`; response: `ArrayList<LearnnDemoCategoryData>`
- **GET `v1/stream/get-categories`** (kotlin.getCategoryData) - query: -; body: `-`; response: `ArrayList<LearnnDemoCategoryData>`
- **GET `v1/stream/view`** (retrofit.getTopicData) - query: `id`; body: `-`; response: `TopicData`
- **GET `v1/stream/view-article`** (retrofit.getArticleData) - query: -; body: `-`; response: `ArrayList<TopicData>`
- **GET `v1/stream/view-article`** (retrofit.getCategoryContentData) - query: `cat-id`; body: `-`; response: `ArrayList<TopicData>`
- **GET `v1/stream/view-topics`** (retrofit.getAllLearnDemoContent) - query: -; body: `-`; response: `ArrayList<TopicData>`
- **GET `v1/stream/view-topics`** (kotlin.getAllLearnDemoContent) - query: -; body: `-`; response: `ArrayList<TopicData>`
- **POST `v1/stream/view-tracking`** (retrofit.submitTracking) - query: -; body: `TopicTrack`; response: `DataPostRequest`

### tour-plan (9)

- **GET `v1/tour-plan/by-date`** (kotlin.tourPlanByDate) - query: `date`; body: `-`; response: `TourPlanByDate`
- **POST `v1/tour-plan/create`** (kotlin.tourPlanCreate) - query: -; body: `TourPlanRequest`; response: `TourPlanActionResponse`
- **GET `v1/tour-plan/current-plan-missed-schedule`** (kotlin.getMissedSchedules) - query: -; body: `-`; response: `MissedScheduleResponse`
- **POST `v1/tour-plan/delete`** (kotlin.tourPlanDelete) - query: -; body: `TourPlanDeleteRequest`; response: `TourPlanActionResponse`
- **GET `v1/tour-plan/list`** (kotlin.tourPlanList) - query: `user_id`, `month`, `year`, `date`, `page`; body: `-`; response: `ArrayList<TourPlanListItem>`
- **POST `v1/tour-plan/reassess`** (kotlin.tourPlanReassess) - query: -; body: `TourPlanReassessRequest`; response: `TourPlanActionResponse`
- **POST `v1/tour-plan/reassess`** (kotlin.tourPlanReassessWithInputs) - query: -; body: `TourPlanRequest`; response: `TourPlanActionResponse`
- **POST `v1/tour-plan/update`** (kotlin.tourPlanUpdate) - query: -; body: `TourPlanRequest`; response: `TourPlanActionResponse`
- **GET `v1/tour-plan/view`** (kotlin.tourPlanView) - query: `id`; body: `-`; response: `TourPlanDetail`

### tour-visit (2)

- **POST `v1/tour-visit/create`** (retrofit.submitTourVisit) - query: -; body: `TourVisit`; response: `DataPostRequest`
- **GET `v1/tour-visit/view`** (retrofit.getTourVisitView) - query: `id`; body: `-`; response: `TourVisitData`

### user (16)

- **POST `v1/user/activate-user`** (retrofit.activateUser) - query: -; body: `LoginRequest`; response: `CheckUserResponse`
- **POST `v1/user/all`** (kotlin.getAllTeams) - query: `page`; body: `DataSearchFilter`; response: `ArrayList<TeamDetails>`
- **GET `v1/user/forgot-password`** (retrofit.forgotPassword) - query: `key_value`; body: `-`; response: `DataPostRequest`
- **GET `v1/user/get-designations`** (kotlin.getDesignationList) - query: -; body: `-`; response: `ArrayList<DesignationData>`
- **POST `v1/user/index`** (kotlin.getUserList) - query: `limit`, `page`; body: `UserRequestBody`; response: `ArrayList<TeamUserData>`
- **POST `v1/user/login`** (retrofit.login) - query: -; body: `LoginRequest`; response: `DataLogin`
- **POST `v1/user/logout`** (retrofit.logout) - query: -; body: `-`; response: `DataPostRequest`
- **POST `v1/user/my-team`** (kotlin.getMyTeam) - query: `page`; body: `MyTeamRequest`; response: `List<TeamUserData>`
- **POST `v1/user/other-team`** (kotlin.getOtherTeamMembersListSearch) - query: `page`, `expand`; body: `TeamMemberRequest`; response: `List<TeamUserData>`
- **POST `v1/user/request-correction`** (retrofit.getRequestCorrection) - query: -; body: `RequestCorrectionReq`; response: `RequestCorrectionData`
- **POST `v1/user/send-otp`** (retrofit.resendOtp) - query: -; body: `CheckUserResendOtp`; response: `CheckOtpResponse`
- **GET `v1/user/settings`** (kotlin.getUserFeatures) - query: -; body: `-`; response: `UserFeatureResponse`
- **POST `v1/user/team-performance`** (kotlin.getFilteredTeamPerformanceStatus) - query: -; body: `UserRequestBody`; response: `TeamPerformanceStatus`
- **GET `v1/user/upload-token`** (kotlin.getUploadToken) - query: -; body: `-`; response: `UploadTokenResponse`
- **GET `v1/user/user-performance`** (kotlin.getUserPerformanceStatus) - query: `user_id`, `isSelf`, `date`; body: `-`; response: `UserPerformanceStatus`
- **POST `v1/user/verify-contact`** (retrofit.verifyContact) - query: -; body: `VerifyEmailRequest`; response: `VerifyEmailResponse`

### user-leave (5)

- **POST `v1/user-leave/cancel-leave`** (retrofit.cancelLeave) - query: -; body: `CancelLeaveRequest`; response: `DataPostRequest`
- **POST `v1/user-leave/create`** (retrofit.submitLeave) - query: -; body: `SelfLeaveRecord`; response: `DataPostRequest`
- **GET `v1/user-leave/future-leave`** (retrofit.getFutureLeave) - query: -; body: `-`; response: `ArrayList<SelfLeaveRecord>`
- **GET `v1/user-leave/future-leave`** (retrofit.getFutureLeaveById) - query: `id`; body: `-`; response: `SelfLeaveRecord`
- **GET `v1/user-leave/get-history`** (retrofit.getSelfLeave) - query: -; body: `-`; response: `ArrayList<SelfLeaveRecord>`

### user-location-tracking (2)

- **POST `v1/user-location-tracking/location`** (kotlin.sendContinuousLocation) - query: -; body: `List<SendContinuousLocation>`; response: `DataPostRequest`
- **POST `v1/user-location-tracking/location-logs`** (kotlin.getActivityLocationList) - query: -; body: `TeamMemberRequest`; response: `ActivityLocationResponse`

### user-otp (1)

- **POST `v1/user-otp/send`** (retrofit.resendTwoOtp) - query: -; body: `CheckUserResendOtpRequest`; response: `CheckUserResendOtpResponse`

### user-task (7)

- **GET `/v1/user-task/get-task-stats`** (kotlin.fetchOtherTaskCount) - query: -; body: `-`; response: `OtherTaskCountResponse`; flags: leading_slash
- **GET `/v1/user-task/get-task-stats`** (kotlin.fetchOtherTaskCountByWorkflow) - query: `workflow_type`; body: `-`; response: `OtherTaskCountResponse`; flags: leading_slash
- **POST `v1/user-task/cancel`** (kotlin.cancelUserTask) - query: -; body: `UserTaskCancelRequest`; response: `DataPostRequest`
- **POST `v1/user-task/create`** (kotlin.createUserTask) - query: -; body: `UserTaskCreateRequest`; response: `DataPostRequest`
- **GET `v1/user-task/index`** (kotlin.getCampaignScheduleList) - query: `campaign_id`; body: `-`; response: `ArrayList<CampaignScheduleIndexItem>`
- **GET `v1/user-task/index`** (kotlin.getUserTaskList) - query: `user_id`, `start_date`, `end_date`; body: `-`; response: `ArrayList<UserTaskSchedule>`
- **POST `v1/user-task/update`** (kotlin.updateUserTask) - query: -; body: `UserTaskUpdateRequest`; response: `DataPostRequest`

### user-workzone (1)

- **GET `v1/user-workzone/index`** (kotlin.getUserWorkZoneList) - query: -; body: `-`; response: `ArrayList<WorkZoneData>`

### v2 (1)

- **GET `/v2/approval-workflow/get-approval-setup-status`** (kotlin.getApprovalSetupStatus) - query: `workflow_type`, `reference_id`; body: `-`; response: `ApprovalSetupStatus`; flags: leading_slash

### visit-note (4)

- **POST `v1/visit-note/create`** (retrofit.createVisitNote) - query: -; body: `VisitNote`; response: `DataPostRequest`
- **GET `v1/visit-note/show-all`** (kotlin.getPublishedVisitNotes) - query: `retailer_id`, `page`, `limit`, `published_only`; body: `-`; response: `ArrayList<VisitNoteData>`
- **GET `v1/visit-note/show-all`** (kotlin.getVisitNotes) - query: `retailer_id`, `page`, `limit`; body: `-`; response: `ArrayList<VisitNoteData>`
- **GET `v1/visit-note/show-visit-note`** (retrofit.getVisitNoteDetail) - query: `id`; body: `-`; response: `VisitNote`

### vm-campaign (4)

- **GET `v1/vm-campaign`** (kotlin.getCampaignData) - query: -; body: `-`; response: `ArrayList<CampainData>`
- **GET `v1/vm-campaign/linked-workflows`** (kotlin.getLinkedWorkflows) - query: `campaign_id`, `customer_id`; body: `-`; response: `ArrayList<LinkedWorkflow>`
- **GET `v1/vm-campaign/stats`** (kotlin.getCampaignStats) - query: `id`; body: `-`; response: `ArrayList<CampaignStatsModel>`
- **POST `v1/vm-campaign/updateresponse`** (retrofit.submitNewCampaign) - query: -; body: `CampainResponse`; response: `DataPostRequest`
