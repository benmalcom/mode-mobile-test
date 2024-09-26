# Next.js Home Assignment Solution (Task Manager)

This project aims to provide a streamlined and robust application that integrates Metamask for handling blockchain-based interactions, including minting and burning tokens on the Polygon Amoy testnet. In this project, I've employed industry-standard practices and incorporated thorough testing coverage to ensure both unit and end-to-end (e2e) functionalities.

## Pre-requisites

- [Node.js](https://nodejs.org/) or [nvm](https://github.com/nvm-sh/nvm) installed.
- pnpm installed globally by running:

```bash
npm i -g pnpm
````
### Setup

You should be in the task-manager directory (if not, run  `cd task-manager` to switch to it)

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


### Testing

Testing plays a crucial role in ensuring the stability and reliability of this project. I've included two layers of tests:

- **Unit Tests**: Validates that individual functions and components work as expected.
- **End-to-End (e2e) Tests**: Simulates user interactions, including connecting a Metamask wallet and performing token-related operations (minting and burning).

### Some decisions

- **State Management**: Used React Context for minimal state management.
- **LocalStorage**: Minted token IDs are stored in localStorage and hydrated to local state for token burning.
- **User Session**: Synced isMessageVerified to localStorage upon successful signature to maintain user login status.
- **E2e Tests**: Utilized Synpress, a promising web3 testing framework built on top of Cypress for the e2e testing.
- **Unit Tests**: Utilized Jest and Testing library for the unit tests.

### Moving Forward


While the test suite covers a wide range of cases, particularly around the core interactions with the blockchain, one challenge arises with the **end-to-end (e2e) testing**, particularly around **minting and burning tokens**.

During e2e tests, after connecting the Metamask wallet, there’s a chance that the **generated wallet address** may **not have enough testnet tokens (Polygon Amoy)**, which can cause the minting and burning token operations to fail due to insufficient funds. This is currently a limitation in testing that could affect test reliability in the absence of adequate token funding.

To mitigate this, **exploring an automated method to fund the generated address** with Polygon Amoy testnet tokens would be an excellent next step. This would ensure that all test cases, particularly those involving token minting and burning, proceed without issue.

I look forward to discussing ways to implement this in a scalable manner and further improve the reliability of the test suite.

### Conclusion

In summary, while the core functionalities of the task manager application have been successfully implemented, 
the challenges encountered in testing highlight the limitations of current tools for dApp testing. 
Future work could focus on exploring more robust testing solutions as they develop.