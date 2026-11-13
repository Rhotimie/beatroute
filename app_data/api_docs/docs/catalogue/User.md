# user

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| POST | `v1/user/activate-user` | retrofit | `activateUser` | `LoginRequest` | `CheckUserResponse` |
| POST | `v1/user/all` | kotlin | `getAllTeams` | `DataSearchFilter` | `ArrayList<TeamDetails>` |
| GET | `v1/user/forgot-password` | retrofit | `forgotPassword` | `-` | `DataPostRequest` |
| GET | `v1/user/get-designations` | kotlin | `getDesignationList` | `-` | `ArrayList<DesignationData>` |
| POST | `v1/user/index` | kotlin | `getUserList` | `UserRequestBody` | `ArrayList<TeamUserData>` |
| POST | `v1/user/login` | retrofit | `login` | `LoginRequest` | `DataLogin` |
| POST | `v1/user/logout` | retrofit | `logout` | `-` | `DataPostRequest` |
| POST | `v1/user/my-team` | kotlin | `getMyTeam` | `MyTeamRequest` | `List<TeamUserData>` |
| POST | `v1/user/other-team` | kotlin | `getOtherTeamMembersListSearch` | `TeamMemberRequest` | `List<TeamUserData>` |
| POST | `v1/user/request-correction` | retrofit | `getRequestCorrection` | `RequestCorrectionReq` | `RequestCorrectionData` |
| POST | `v1/user/send-otp` | retrofit | `resendOtp` | `CheckUserResendOtp` | `CheckOtpResponse` |
| GET | `v1/user/settings` | kotlin | `getUserFeatures` | `-` | `UserFeatureResponse` |
| POST | `v1/user/team-performance` | kotlin | `getFilteredTeamPerformanceStatus` | `UserRequestBody` | `TeamPerformanceStatus` |
| GET | `v1/user/upload-token` | kotlin | `getUploadToken` | `-` | `UploadTokenResponse` |
| GET | `v1/user/user-performance` | kotlin | `getUserPerformanceStatus` | `-` | `UserPerformanceStatus` |
| POST | `v1/user/verify-contact` | retrofit | `verifyContact` | `VerifyEmailRequest` | `VerifyEmailResponse` |
