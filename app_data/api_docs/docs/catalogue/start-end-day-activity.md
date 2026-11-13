# start-end-day-activity

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| GET | `v1/start-end-day-activity/end-day` | kotlin | `getDayOutDetail` | `-` | `DayOutModel` |
| POST | `v1/start-end-day-activity/end-day` | retrofit | `submitDayOut` | `DayOutModel` | `DataPostRequest` |
| GET | `v1/start-end-day-activity/get-activity` | kotlin | `getStartEndDayActivity` | `-` | `StartEndDayActivityResponse` |
| GET | `v1/start-end-day-activity/start-day` | kotlin | `getDayInDetail` | `-` | `DayInModel` |
| POST | `v1/start-end-day-activity/start-day` | retrofit | `submitDayIn` | `DayInModel` | `DataPostRequest` |
