//npx ts-node deployments/deposit_eth_l1_to_l2.js
import { Wallet, Provider, utils } from "zksync-ethers";
import * as ethers from "ethers";

// load env file
import dotenv from "dotenv";
dotenv.config();

// HTTP RPC endpoints
const L1_RPC_ENDPOINT = process.env.API_URL || ""; // or an RPC endpoint from Infura/Chainstack/QuickNode/etc.
const L2_RPC_ENDPOINT = process.env.L2_RPC_ENDPOINT || "https://zksync-sepolia-testnet.rpc.thirdweb.com"; // or the zkSync Era mainnet

// Amount in ETH
const AMOUNT = "0.001";

const WALLET_PRIV_KEY = process.env.PRIVATE_KEY || "";

if (!WALLET_PRIV_KEY) {
  throw new Error("Wallet private key is not configured in env file");
}

if (!L1_RPC_ENDPOINT) {
  throw new Error("Missing L1 RPC endpoint. Check chainlist.org or an RPC node provider");
}

async function main() {
  console.log(`Running script to deposit ETH in L2`);

  // Initialize the wallet.
  const l1provider = new Provider(L1_RPC_ENDPOINT);
  const l2provider = new Provider(L2_RPC_ENDPOINT);
  const wallet = new Wallet(WALLET_PRIV_KEY, l2provider, l1provider);

  console.log(`L1 Balance is ${await wallet.getBalanceL1()}`);
  console.log(`L2 Balance is ${await wallet.getBalance()}`);

  // Deposit ETH to L2
  const depositHandle = await wallet.deposit({
    to: wallet.address,
    token: utils.ETH_ADDRESS,
    amount: ethers.utils.parseEther(AMOUNT),
  });
  console.log(`Deposit transaction sent ${depositHandle.hash}`);
  console.log(`Please wait a few minutes for the deposit to be processed in L2`);
}

main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

