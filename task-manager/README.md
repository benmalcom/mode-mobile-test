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


### Some decisions

- **State Management**: Used React Context for minimal state management.
- **LocalStorage**: Minted token IDs are stored in localStorage and hydrated to local state for token burning.
- **User Session**: Synced isMessageVerified to localStorage upon successful signature to maintain user login status.

### Moving Forward, concerning testing

Testing the Next.js 14 application with MetaMask integration posed several challenges, especially given time constraints:

- **Automation Difficulty**: Automating MetaMask interactions (wallet connection, transaction signing) is challenging due to browser extension reliance.
- **Security Restrictions**: Browser security measures (CORS, sandboxing) complicate testing.
- **Asynchronous Transactions**: Blockchain transactions require waiting for confirmations, adding complexity.
I explored Synpress and Dapperwright for testing MetaMask-based dApps, but both frameworks are unreliable. Synpress has issues detecting MetaMask popups, while Dapperwright struggles with simulating real-world blockchain behavior.

Due to time limitations and the immaturity of these tools, I always prioritize core functionality over comprehensive automated tests. 
Full automation of MetaMask and blockchain interactions remains challenging with current testing frameworks.

### Conclusion

In summary, while the core functionalities of the task manager application have been successfully implemented, 
the challenges encountered in testing highlight the limitations of current tools for dApp testing. 
Future work could focus on exploring more robust testing solutions as they develop.