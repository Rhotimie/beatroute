# move

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| POST | `v1/move` | kotlin | `getMoves` | `MovesRequest` | `ArrayList<Move>` |
| POST | `v1/move/activity` | kotlin | `getMovesActivity` | `MoveActivityRequest` | `ArrayList<Move>` |
| POST | `v1/move/create` | kotlin | `createMove` | `CreateMoveRequest` | `CreateMoveResult` |
| GET | `v1/move/history` | kotlin | `getMovesHistory` | `-` | `ArrayList<Move>` |
| POST | `v1/move/update` | kotlin | `updateMove` | `UpdateMoveRequest` | `Object` |
