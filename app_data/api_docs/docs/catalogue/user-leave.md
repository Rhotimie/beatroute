# user-leave

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| POST | `v1/user-leave/cancel-leave` | retrofit | `cancelLeave` | `CancelLeaveRequest` | `DataPostRequest` |
| POST | `v1/user-leave/create` | retrofit | `submitLeave` | `SelfLeaveRecord` | `DataPostRequest` |
| GET | `v1/user-leave/future-leave` | retrofit | `getFutureLeave` | `-` | `ArrayList<SelfLeaveRecord>` |
| GET | `v1/user-leave/future-leave` | retrofit | `getFutureLeaveById` | `-` | `SelfLeaveRecord` |
| GET | `v1/user-leave/get-history` | retrofit | `getSelfLeave` | `-` | `ArrayList<SelfLeaveRecord>` |
