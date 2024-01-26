async function getBalance(erc20, ofAddr, signer) {
 return erc20.connect(signer).balanceOf(ofAddr);
}

async function main() {
  const TokenSender = await ethers.getContractFactory("TokenSender");
  const ts = await TokenSender.attach('0x04E97E65487aBb3bb8BFcFCeed3755e18Ce2c5E3') //deployed contract address

  wallet = await new ethers.Wallet(process.env.PRIVATE_KEY);
  signer = await wallet.connect(ethers.provider);


  // usdc zksync l2 sepolia address
  let l1TokenAddress = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
  let l1TokenName = 'USDC';

  const ierc20 = await ethers.getContractFactory("MyERC20Token");
  let usdcContract = await ierc20.attach(l1TokenAddress);

  let myPublicAddr = '0x46a2dE8Bf0aA6c38a9fbD9FE8e745d248dd4c6f6';

  console.log(`Current ${l1TokenName} amount of sender: ${ethers.utils.formatUnits(String(await getBalance(usdcContract, myPublicAddr, signer)), 6)}`);


  let res = await ts.connect(signer).transferTokensToL2(
    '0x2eD8eF54a16bBF721a318bd5a5C0F39Be70eaa65', // mailbox
    '0x7546a21cd4D74fc98Ef1A50145dfd8c043e2096F', // allowlist
    '0x665FA5E77dAE4db2884A4dd3A371B146dA2A59Af', // l2 receiver
    l1TokenAddress, // l1 token
    1, // amount
    11579208923731, // l2txgaslimit
    11579208923731// l2txgasperpubdatabyte
  );

  // strategy and organization is the department of the adviser but maybe it is also
  // okay if the cocurse is from the same faculty

  //console.debug(res);
  let out = await res.wait();
  console.debug(out);

  console.log(`Final ${l1TokenName} amount of sender: ${ethers.utils.formatUnits(String(await getBalance(usdcContract, myPublicAddr, signer)), 6)}`);

      //function transferTokensToL2(
              //address mailboxAddr,
              //address allowListAddr,
              //address l2Receiver,
              //address l1Token,
              //uint256 amount,
              //uint256 l2TxGasLimit,
              //uint256 l2TxGasPerPubdataByte
          //) external onlyOwner {
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

