# Wire names: what is proven and what is not

Two annotation styles sit on the same models, and they disagree in places.

| Source | Meaning |
|---|---|
| `@InterfaceC1158On0("x")` (shaded `@SerializedName`) | Name the server uses. Proven for the envelope, see below. |
| Getter / `@JsonProperty` (Jackson) | Name the Retrofit client actually sends and reads. Both Retrofit clients use `JacksonConverterFactory.create()` (`defpackage/C6567tj.java:122`, `defpackage/C0519Cj.java:124,160`). |

## Evidence

`shared/model/MyResponse.java` is the same envelope written for Ktor with `kotlinx.serialization`, where
`@SerialName` is authoritative. It uses `data`, `data_error`, `sendmessage`, `pagination`, `sendStatus`, `success`.
The Retrofit `model/Response/MyResponse.java` carries the identical strings in the shaded annotation, next to
getters `getMessage()` and `getStatus()`.

Conclusion:
- The shaded annotation values are the server contract (confirmed for the envelope, and consistent with
  `DataLogin.distance_unit`, which carries both annotations with the same value).
- Under Jackson the Retrofit client reads `message` and `status`, so those two envelope fields are likely never
  populated on the Retrofit path. The app works because it relies on `success` and `data`.
- On requests, Jackson serialises the getter name. `LoginRequest.deviceInfo` goes out as `deviceInfo`, while the
  shaded name is `device_model`. Whether the server accepts both is unknown.

## How the docs use this

- `server_name`: the shaded annotation value (constants resolved), else the Jackson name.
- `client_name`: what Jackson would send or read.
- A field where they differ is flagged `name_disagree` and listed in the generated docs.
- Not proven: any real request or response body. All samples are synthesised. One captured session (the app
  bundles Chucker, `shared/network/ChuckerProvider.java`) would settle every flagged field.
