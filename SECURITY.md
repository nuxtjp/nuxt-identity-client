# セキュリティ境界

[English](docs/en/SECURITY.md)

`@nuxtjp/identity-client`は認証Providerではありません。一般User向けのIdentity
表示Componentと、same-origin BFFが利用する純粋な検証Logicだけを提供します。

## Packageが扱わないもの

- access token、refresh token、ID tokenの保存
- Authorization Code交換やProvider discovery通信
- Password、OTP seed、秘密鍵、生のWebAuthn assertion
- Account Linking、Role、Subscription、Policy決定
- User SessionやAuthorization transactionの永続Store

UI Componentは`fetch`、Browser storage、Cookie APIを呼びません。Hostから渡す
Projectionには表示に必要な最小限のmetadataだけを含めてください。

## BFF実装条件

- CSPRNGでstate、nonce、PKCE verifier、Session IDを生成する
- state、nonce、redirect URI、pre-auth Session、expiryを同じTransactionへ結ぶ
- Transactionは短命かつ一回利用にし、成功・失敗後にVerifierを消去する
- Callback後にSession IDを必ずrotateし、旧Sessionを失効する
- issuer、audience、署名、nonce、時刻をProvider metadataに基づいて検証する
- redirect URIはClientごとの完全一致allow-listから選ぶ
- login/logout POSTへCSRF対策を適用する
- TokenはServer-side Credential Storeに隔離し、LogやErrorへ含めない

`SESSION_COOKIE_POLICY`は`__Host-ihat_session`、`HttpOnly`、`Secure`、
`SameSite=Lax`、`Path=/`、Domainなしを要求します。Header helperは方針の表現であり、
Session StoreやCSRF実装の代替ではありません。

## 信頼できない入力

ProviderのError text、端末名、Authenticator label、Profileは信頼できない入力です。
Vueの通常のtext bindingを使用し、`v-html`へ渡さないでください。LogにはCode、Token、
Cookie、Verifier、Assertionを記録しないでください。

このPackageの`consumeAuthorizationTransaction`へ渡すnonceは、署名等を検証済みの
ID Token claimでなければなりません。`providerClaimsVerified: true`はその検証後だけ
設定します。関数単体は署名検証を行いません。loopback HTTPのredirectはDNS名でなく
明示的なIPv4/IPv6 loopbackと1024以上のportを使用します。

脆弱性は非公開経路で報告し、実Credential、個人Data、稼働Endpointを添付しないで
ください。
