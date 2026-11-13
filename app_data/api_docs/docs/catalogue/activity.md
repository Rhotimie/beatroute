# activity

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| GET | `v1/activity/activity-type` | kotlin | `getScheduleActivityList` | `-` | `ArrayList<ScheduleActivityItem>` |
| GET | `v1/activity/daily-activity` | retrofit | `getMyActivity` | `-` | `MyActivityResponse` |
| GET | `v1/activity/daily-activity` | kotlin | `getActivityHistoryOnParameter` | `-` | `MyActivityResponse` |
| GET | `v1/activity/get-activity-list` | kotlin | `getTeamRetailerActivityList` | `-` | `ArrayList<RetailerActivityData>` |
| GET | `v1/activity/monthly-activity` | retrofit | `getSelfAttendance` | `-` | `ArrayList<SelfAttendenceRecord>` |
| GET | `v1/activity/monthly-activity` | kotlin | `getMonthlyActivity` | `-` | `ArrayList<SelfAttendenceRecord>` |
| GET | `v1/activity/retailer-list` | kotlin | `getTeamRetailerList` | `-` | `ArrayList<TeamRetailerData>` |
