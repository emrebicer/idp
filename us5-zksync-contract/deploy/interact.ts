import * as hre from "hardhat";
import { getWallet } from "./utils";
import { ethers } from "ethers";

// Address of the contract to interact with
const CONTRACT_ADDRESS = "0x665FA5E77dAE4db2884A4dd3A371B146dA2A59Af";
if (!CONTRACT_ADDRESS) throw "⛔️ Provide address of the contract to interact with!";

// An example of a script to interact with the contract
async function old_example() {
  console.log(`Running script to interact with contract ${CONTRACT_ADDRESS}`);

  // Load compiled contract info
  const contractArtifact = await hre.artifacts.readArtifact("Greeter");

  // Initialize contract instance for interaction
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractArtifact.abi,
    getWallet() // Interact with the contract on behalf of this wallet
  );

  // Run contract read function
  const response = await contract.greet();
  console.log(`Current message is: ${response}`);

  // Run contract write function
  const transaction = await contract.setGreeting("Hello people!");
  console.log(`Transaction hash of setting new message: ${transaction.hash}`);

  // Wait until transaction is processed
  await transaction.wait();

  // Read message after transaction
  console.log(`The message now is: ${await contract.greet()}`);
}

// An example of a script to interact with the contract
export default async function () {
  console.log(`Running script to interact with contract ${CONTRACT_ADDRESS}`);

  // Load compiled contract info
  const contractArtifact = await hre.artifacts.readArtifact("TokenSender");

  // Initialize contract instance for interaction
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractArtifact.abi,
    getWallet() // Interact with the contract on behalf of this wallet
  );


  let MY_USDT_ADDR = "0x2d2df6A224E6a6c2455d5C2bE5d625ab503bdFEF";
  
  // Get current usdt
  console.log(`Current USDT balance is: ${await contract.balance(MY_USDT_ADDR)}`);

  // Run contract write function
  const transaction = await contract.transferTokens(MY_USDT_ADDR, "0x46a2dE8Bf0aA6c38a9fbD9FE8e745d248dd4c6f6", 1);
  console.log(`Transaction hash of setting new message: ${transaction.hash}`);

  // Wait until transaction is processed
  await transaction.wait();

  console.log(`New USDT balance is: ${await contract.balance(MY_USDT_ADDR)}`);
}
