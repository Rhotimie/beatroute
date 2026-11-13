# campaign-response

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| GET | `v1/campaign-response` | retrofit | `getCampaignHistoryList` | `-` | `ArrayList<HistoryDataList>` |
| GET | `v1/campaign-response/linked-workflows-responses` | kotlin | `getLinkedWorkflowResponses` | `-` | `ArrayList<LinkedWorkflowResponse>` |
| GET | `v1/campaign-response/master-list` | retrofit | `getOpportunityResponseList` | `-` | `ArrayList<OpportunityResponseBean>` |
| GET | `v1/campaign-response/master-list` | kotlin | `getOpportunityResponseList` | `-` | `ArrayList<OpportunityResponseBean>` |
| GET | `v1/campaign-response/open-responses` | kotlin | `getOpenResponseList` | `-` | `ArrayList<OpportunityResponseBean>` |
| GET | `v1/campaign-response/view` | retrofit | `getCampaignHistory` | `-` | `CampainData` |
| GET | `v1/campaign-response/view` | kotlin | `getCampaignResponseView` | `-` | `CampainData` |
