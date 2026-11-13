# schedule

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| POST | `v1/schedule/analytics` | kotlin | `getActivitiesAnalysis` | `RequestActivitiesAnalysis` | `ActivitiesAnalysisResponse` |
| POST | `v1/schedule/create` | retrofit | `createSchedule` | `ScheduleRequest` | `CreateScheduleResponse` |
| DELETE | `v1/schedule/delete` | retrofit | `deleteSchedule` | `-` | `DataPostRequest` |
| GET | `v1/schedule/get-retailers` | retrofit | `getScheduleOfRetailer` | `-` | `ArrayList<ScheduleData>` |
| GET | `v1/schedule/get-retailers` | kotlin | `getScheduleOfRetailer` | `-` | `ArrayList<ScheduleData>` |
| GET | `v1/schedule/get-retailers` | kotlin | `getScheduleRetailerList` | `-` | `ArrayList<ScheduleData>` |
| GET | `v1/schedule/missed-retailers` | kotlin | `getMissedRetailers30d` | `-` | `MissedScheduleResponse` |
| POST | `v1/schedule/update` | retrofit | `updateSchedule` | `ScheduleRequest` | `CreateScheduleResponse` |
