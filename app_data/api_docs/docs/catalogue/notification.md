# notification

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| GET | `v1/notification/index` | kotlin | `getNotification` | `-` | `ArrayList<NotificationBean>` |
| POST | `v1/notification/update-status` | retrofit | `updateNotificationReadStatus` | `NotificationId` | `DataPostRequest` |
