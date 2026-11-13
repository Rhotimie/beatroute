# otp-verification

| verb | path | client | method | body | response |
|---|---|---|---|---|---|
| POST | `v1/otp-verification/send` | kotlin | `sendCampaignOtp` | `OtpSendRequest` | `OtpSendResponse` |
| POST | `v1/otp-verification/verify` | kotlin | `verifyCampaignOtp` | `OtpVerifyRequest` | `OtpVerifyResponse` |
