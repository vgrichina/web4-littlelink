# web4-littlelink

Self-hosted Linktree alternative to use with [web4](https://web4.near.page).

## Why?

Get your own homepage tied to your `.near` account.

For example I have [vlad.near.page](https://vlad.near.page) which is tied to `web4.vlad.near` account.

## How

### Clone this project locally

```bash
git clone https://github.com/vgrichina/web4-littlelink.git
cd web4-littlelink
```

### Install dependencies

```bash
yarn
```

### Create web4 subaccount
```bash
NEAR_ENV=mainnet near create-account web4.target-account.near --masterAccount target-account.near --initialBalance 0.5
```

### Deploy smart contract

```bash
NEAR_ENV=mainnet CONTRACT_NAME=web4.target-account.near yarn deploy
```

### Deploy static files to IPFS

```bash
NEAR_ENV=mainnet CONTRACT_NAME=web4.target-account.near yarn deploy:website
```

### Setup links and info

```bash
NEAR_ENV=mainnet near call web4.target-account.near setConfig \
    '{"config":{"name":"Vlad Grichina","bio":"web4 hacker", "links":[ \
        {"type":"twitter","text":"Twitter","href":"https://twitter.com/vgrichina"}, \
        {"type":"github","text":"GitHub","href":"https://github.com/vgrichina"} \
    ]}}' --accountId  web4.target-account.near
```


