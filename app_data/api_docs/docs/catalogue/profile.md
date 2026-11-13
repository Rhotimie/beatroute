# profile

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| POST | `v1/profile/change-password` | retrofit | `changePassword` | `ChangePassword` | `DataPostRequest` |
| GET | `v1/profile/feature-request` | retrofit | `sendInterest` | `-` | `DataPostRequest` |
| POST | `v1/profile/send-support-mail` | retrofit | `sendSupportMail` | `SupportMail` | `DataPostRequest` |
| GET | `v1/profile/sr-team` | retrofit | `getSRTeamReport` | `-` | `ArrayList<TeamDetails>` |
| GET | `v1/profile/team` | retrofit | `get_SM_TSM_TeamReport` | `-` | `ArrayList<TeamDetails>` |
| POST | `v1/profile/update` | retrofit | `updateProfile` | `ProfileRequest` | `DataPostRequest` |
| POST | `v1/profile/update-fcm-token` | retrofit | `updateFCMCode` | `SingleRequest` | `DataPostRequest` |
| POST | `v1/profile/update-freshchat-token` | retrofit | `submitFreshChatToken` | `Profile` | `BaseApiResponse` |
| POST | `v1/profile/update-freshchat-token` | kotlin | `submitFreshChatToken` | `Profile` | `BaseApiResponse` |
| POST | `v1/profile/update-gcm-token` | retrofit | `updateGCMCode` | `SingleRequest` | `DataPostRequest` |
