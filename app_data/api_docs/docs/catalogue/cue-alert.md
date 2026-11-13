# cue-alert

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| GET | `v1/cue-alert/action` | retrofit | `postReplyNoBody` | `-` | `CueResponseBean` |
| POST | `v1/cue-alert/action` | retrofit | `postReply` | `-` | `CueResponseBean` |
| POST | `v1/cue-alert/action` | retrofit | `postReply` | `CuesScheduleBean` | `CueResponseBean` |
| GET | `v1/cue-alert/response` | retrofit | `getCues` | `-` | `CueResponseBean` |
