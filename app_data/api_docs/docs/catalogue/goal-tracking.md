# goal-tracking

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| POST | `v1/goal-tracking/activity-stats` | kotlin | `getGoalTrackingActivityState` | `TeamMemberRequest` | `TeamActivityStateResponse` |
| POST | `v1/goal-tracking/customer-wise-moves` | kotlin | `getCustomerWiseMoves` | `TeamMemberRequest` | `List<TeamActivityResponse>` |
| POST | `v1/goal-tracking/customer-wise-visit-activity` | kotlin | `getTeamActivityList` | `TeamMemberRequest` | `List<TeamActivityResponse>` |
| GET | `v1/goal-tracking/inactive-team-member` | kotlin | `getInactiveTeamMembers` | `-` | `List<InactiveTeamMemberResponse>` |
| POST | `v1/goal-tracking/team-member` | kotlin | `getTeamMembersList` | `TeamMemberRequest` | `List<TeamMemberMasterResponse>` |
| POST | `v1/goal-tracking/team-member` | kotlin | `getTeamMembersListSearch` | `TeamMemberRequest` | `List<TeamUserData>` |
