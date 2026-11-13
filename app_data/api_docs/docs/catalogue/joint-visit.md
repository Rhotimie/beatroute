# joint-visit

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| GET | `v1/joint-visit/active` | kotlin | `getActiveJointVisit` | `-` | `JointVisitActiveResponse` |
| GET | `v1/joint-visit/eligible-users` | kotlin | `getJointVisitEligibleUsers` | `-` | `JointVisitEligibleUsersResponse` |
| POST | `v1/joint-visit/end` | kotlin | `endJointVisit` | `EndJointVisitRequest` | `JointVisitEndResponse` |
| POST | `v1/joint-visit/start` | kotlin | `startJointVisit` | `StartJointVisitRequest` | `JointVisitStartResponse` |
| GET | `v1/joint-visit/tagged-retailers` | kotlin | `getTaggedRetailers` | `-` | `JointVisitTaggedResponse` |
