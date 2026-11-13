# visit-note

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| POST | `v1/visit-note/create` | retrofit | `createVisitNote` | `VisitNote` | `DataPostRequest` |
| GET | `v1/visit-note/show-all` | kotlin | `getPublishedVisitNotes` | `-` | `ArrayList<VisitNoteData>` |
| GET | `v1/visit-note/show-all` | kotlin | `getVisitNotes` | `-` | `ArrayList<VisitNoteData>` |
| GET | `v1/visit-note/show-visit-note` | retrofit | `getVisitNoteDetail` | `-` | `VisitNote` |
