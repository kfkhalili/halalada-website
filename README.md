## Introduction

Halal ADA public webapp. It is Next.js application. Read more here: Next.README.md

```
yarn install
```

Create .env.local file with the following content:

```
BLOCKFROST_MAINNET_KEY="KEY"
BLOCKFROST_MAINNET_URL="https://Cardano-mainnet.blockfrost.io/api/v0"

BLOCKFROST_TESTNET_KEY="KEY"
BLOCKFROST_TESTNET_URL="https://Cardano-testnet.blockfrost.io/api/v0"
PREDICTION_API_URL="https://europe-west2-cognitivo-ai.cloudfunctions.net/ada_price"
```

## Dev server

```
yarn dev
```

## Prod build

```
yarn build
yarn start
```

## Support / Donation

If you find this tool useful, you can donate any amount in ADA to the following Cardano address:

```
addr1v8u4n42ltege2nm66dmzyxttqstdycjzsd6tr9r9tg4n3ncanfn84
```
