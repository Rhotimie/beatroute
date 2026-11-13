# user-location-tracking

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| POST | `v1/user-location-tracking/location` | kotlin | `sendContinuousLocation` | `List<SendContinuousLocation>` | `DataPostRequest` |
| POST | `v1/user-location-tracking/location-logs` | kotlin | `getActivityLocationList` | `TeamMemberRequest` | `ActivityLocationResponse` |
