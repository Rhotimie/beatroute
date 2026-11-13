# stream

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| GET | `v1/stream/content-view-count` | retrofit | `getContentCount` | `-` | `ArrayList<ContentViewCount>` |
| POST | `v1/stream/feedback` | kotlin | `submitLnDContentFeedback` | `LnDContentFeedbackRequest` | `Object` |
| GET | `v1/stream/feedback-response` | kotlin | `getLnDContentFeedbackResponse` | `-` | `ArrayList<LnDContentFeedbackPair>` |
| GET | `v1/stream/get-categories` | retrofit | `getCategoryDataForTopic` | `-` | `ArrayList<LearnnDemoCategoryData>` |
| GET | `v1/stream/get-categories` | kotlin | `getCategoryData` | `-` | `ArrayList<LearnnDemoCategoryData>` |
| GET | `v1/stream/view` | retrofit | `getTopicData` | `-` | `TopicData` |
| GET | `v1/stream/view-article` | retrofit | `getArticleData` | `-` | `ArrayList<TopicData>` |
| GET | `v1/stream/view-article` | retrofit | `getCategoryContentData` | `-` | `ArrayList<TopicData>` |
| GET | `v1/stream/view-topics` | retrofit | `getAllLearnDemoContent` | `-` | `ArrayList<TopicData>` |
| GET | `v1/stream/view-topics` | kotlin | `getAllLearnDemoContent` | `-` | `ArrayList<TopicData>` |
| POST | `v1/stream/view-tracking` | retrofit | `submitTracking` | `TopicTrack` | `DataPostRequest` |
