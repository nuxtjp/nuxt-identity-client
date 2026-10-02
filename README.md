# @nuxtjp/identity-client

ログイン、アカウント、認証方法、登録端末の画面を共通化できます。

## 利用前の確認

実装済みの範囲、必要な依存関係、検証コマンドを以下の英語説明に併記しています。操作・配備・公開は、それぞれの権限と設定を確認してから実施してください。

## 導入・使い方

以下は現行インターフェースの利用例です。ローカル成果物の参照がある場合は、必要な版の成果物を先に準備してください。パッケージの公開配布は今回の作業では行いません。

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

## English

Provide consistent sign-in, account, authenticator and device-management screens in a Nuxt service.

## What you can do

- Reuse Japanese and English identity presentation components.
- Apply declared pure security primitives to caller-owned flows.

## Current scope

The application owns IdP communication, token exchange, custody, user records and authorization.

Package distribution is not activated by this documentation. Use the checked-in source and the declared dependency versions; published availability must be verified separately.

## Getting started

Use `pnpm@10.29.3` and the Node.js version declared in `engines` in `package.json`. Run from this repository:

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
```

## Documentation and source

[Usage guide](docs/getting-started.md)

[Detailed documentation](docs) · [Implementation and public interfaces](src) · [Verification cases](test) · [Contributing](CONTRIBUTING.md) · [Security reporting](SECURITY.md) · [License](LICENSE) · [Attribution notices](NOTICE)
