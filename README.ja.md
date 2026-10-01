# @nuxtjp/identity-client

[English](docs/en/README.md)

通常のサービスで使うログイン、アカウント、認証方法、登録端末、ログアウトを
同じUI契約で提供するNuxt 4モジュールです。日本語が既定で、英語にも対応します。

このPackageは表示とOIDC BFF向けの純粋なSecurity primitiveだけを提供します。
IdPへの通信、認証Code交換、Token保存、User DB、認可は実装しません。

## 導入

Version固定したArtifactを導入し、Nuxtへ登録します。

```ts
import identityClient from '@nuxtjp/identity-client'

export default defineNuxtConfig({
  modules: [[identityClient, { componentPrefix: 'NuxtJp' }]]
})
```

利用できる表示Componentは次の6つです。

| Path契約 | Component |
|---|---|
| `/login` | `NuxtJpIdentityLoginCard` |
| `/auth/callback` | `NuxtJpIdentityCallbackStatus` |
| `/account` | `NuxtJpIdentityAccountPanel` |
| `/account/security` | `NuxtJpIdentitySecurityPanel` |
| `/account/devices` | `NuxtJpIdentityDeviceList` |
| `/logout` | `NuxtJpIdentityLogoutPanel` |

PackageがConsumerの既存Routeや認証Middlewareを上書きしないよう、Route自体は
自動登録しません。`IDENTITY_UI_CONTRACTS`に従ってConsumer側でPageを作り、
認証済みProjectionをpropsへ渡します。操作はEventとして受け取ります。

```vue
<NuxtJpIdentityDeviceList
  :devices="devices"
  locale="ja"
  @rename="requestRename"
  @revoke="requestRevocation"
/>
```

UIは通信APIを呼びません。Event handlerからConsumer所有のsame-origin BFFへ
接続してください。Playgroundも合成Dataだけを表示し、通信しません。

## OIDCとBFFの境界

推奨FlowはAuthorization Code Flow + PKCEです。

```text
Nuxt UI -> same-origin BFF -> OIDC Provider
             |                    |
             +-- state/nonce -----+
             +-- PKCE verifier (server only)
             +-- HttpOnly session cookie
```

Browserが利用する境界は次のsame-origin Pathだけです。

- `POST /api/identity/login`
- `GET /api/identity/callback`（Providerのredirect先）
- `GET /api/identity/session`
- `POST /api/identity/logout`

`IdentityBffPort`はHost実装用のTypeScript Portです。Browserへ返すSessionは
`SessionProjection`だけで、access token、refresh token、PKCE verifierを
表すfieldはありません。Provider ClientとCredential保管は別のServer-side
Adapterで実装してください。

Providerは表示Pageの`/auth/callback`ではなくBFFの`/api/identity/callback`へ
redirectします。BFFがCodeを交換してSessionをrotateした後、Codeを除いた状態で
表示Pageへredirectします。

`@nuxtjp/identity-client/core`は次を公開します。

- 256 bit以上の`state`、`nonce`、PKCE verifier生成
- S256 PKCE challenge生成
- HTTPSまたはhigh-port loopback IP HTTPだけを認める完全一致redirect allow-list
- 5分を既定上限にできる一回利用Authorization transaction
- `state`、`nonce`、pre-auth session、expiryのbinding検査
- 認証後Session ID rotation計画
- `__Host-ihat_session` Cookie policy
- same-origin return path検査

TransactionとPKCE verifierはBFF内の短命Storeへ保存し、Code交換後に消去します。
`nonce`はProvider署名、issuer、audience、時刻を検証したID Tokenのclaimから渡し、
`providerClaimsVerified: true`はその検証が成功した後だけ設定してください。メール
アドレスはAccount LinkingのKeyにしません。

## Host側の必須事項

- login/logout POSTにCSRF Tokenを要求する
- OIDC Clientごとのredirect URIを完全一致登録する
- callback Codeとtransactionを一回だけ消費する
- 認証成功時にpre-auth Sessionを失効し、新しいSession IDを発行する
- Cookieを`HttpOnly; Secure; SameSite=Lax; Path=/`かつDomainなしで発行する
- access/refresh tokenと端末秘密鍵をBrowser、URL、Log、SQLiteへ置かない
- 未認証・未接続をreadyとして表示しない
- Provider Error詳細をそのままUIへ表示しない

[SECURITY.md](SECURITY.md)も参照してください。

## ローカル検証

```bash
pnpm install --offline --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
pnpm exec nuxt dev playground --host 127.0.0.1
```

Playgroundは合成IDと`.invalid`のメールアドレスだけを含みます。確認後はProcessを
停止してください。このRepositoryから外部OIDC Providerへの通信や公開は行いません。
