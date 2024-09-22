## Pre-requisites

- [Node.js](https://nodejs.org/) or [nvm](https://github.com/nvm-sh/nvm) installed.
- pnpm installed globally by running:

```bash
npm i -g pnpm
````
### Setup

Install the dependencies:
```bash
pnpm install
```
- Create a `.env` file in the root directory
- Copy the content of `.env.example` into `.env`

### Run the development server

```bash
pnpm dev
```

### MetaMask Setup

- You must have the MetaMask browser extension installed.
- Add the Polygon Amoy testnet network to your MetaMask, as this is the chain being used.

### Instructions to Add Polygon Amoy

Open MetaMask and click on the network dropdown at the top.
Select "Add Network".

Enter the following details:

- Network Name: Polygon Amoy Testnet
- RPC URL: [https://rpc-amoy.polygon.technology](https://rpc-amoy.polygon.technology)
- Chain ID: 80002
- Currency Symbol: MATIC
- Block Explorer URL: [https://amoy.polygonscan.com](https://amoy.polygonscan.com)
- Save the network.

### Add Testnet Tokens
You'll need some testnet tokens on the Polygon Amoy network to sign transactions.
Get free testnet tokens from Polygon Faucet by selecting the Amoy Testnet.

[https://faucets.chain.link/polygon-amoy](https://faucets.chain.link/polygon-amoy) has some links to get some testnet tokens.