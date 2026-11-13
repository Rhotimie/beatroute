# vm-campaign

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| GET | `v1/vm-campaign` | kotlin | `getCampaignData` | `-` | `ArrayList<CampainData>` |
| GET | `v1/vm-campaign/linked-workflows` | kotlin | `getLinkedWorkflows` | `-` | `ArrayList<LinkedWorkflow>` |
| GET | `v1/vm-campaign/stats` | kotlin | `getCampaignStats` | `-` | `ArrayList<CampaignStatsModel>` |
| POST | `v1/vm-campaign/updateresponse` | retrofit | `submitNewCampaign` | `CampainResponse` | `DataPostRequest` |
