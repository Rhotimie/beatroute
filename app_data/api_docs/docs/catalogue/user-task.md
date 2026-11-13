# user-task

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| GET | `/v1/user-task/get-task-stats` | kotlin | `fetchOtherTaskCount` | `-` | `OtherTaskCountResponse` |
| GET | `/v1/user-task/get-task-stats` | kotlin | `fetchOtherTaskCountByWorkflow` | `-` | `OtherTaskCountResponse` |
| POST | `v1/user-task/cancel` | kotlin | `cancelUserTask` | `UserTaskCancelRequest` | `DataPostRequest` |
| POST | `v1/user-task/create` | kotlin | `createUserTask` | `UserTaskCreateRequest` | `DataPostRequest` |
| GET | `v1/user-task/index` | kotlin | `getCampaignScheduleList` | `-` | `ArrayList<CampaignScheduleIndexItem>` |
| GET | `v1/user-task/index` | kotlin | `getUserTaskList` | `-` | `ArrayList<UserTaskSchedule>` |
| POST | `v1/user-task/update` | kotlin | `updateUserTask` | `UserTaskUpdateRequest` | `DataPostRequest` |
