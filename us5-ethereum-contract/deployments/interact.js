async function getBalance(erc20, ofAddr, signer) {
 return erc20.connect(signer).balanceOf(ofAddr);
}

async function main() {
  const TokenSender = await ethers.getContractFactory("TokenSender");
  const ts = await TokenSender.attach('0x17fe54A433dD37fFb7bf243f379cAd3b1B724bd5') //deployed contract address

  wallet = await new ethers.Wallet(process.env.PRIVATE_KEY);
  signer = await wallet.connect(ethers.provider);

  let l1TokenAddress = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
  let l1TokenName = 'USDC';

  const ierc20 = await ethers.getContractFactory("MyERC20Token");
  let usdcContract = await ierc20.attach(l1TokenAddress);

  let myPublicAddr = '0x46a2dE8Bf0aA6c38a9fbD9FE8e745d248dd4c6f6';

  console.log(`Current ${l1TokenName} amount of sender: ${ethers.utils.formatUnits(String(await getBalance(usdcContract, myPublicAddr, signer)), 6)}`);

      //function transferTokensToL2(
              //address mailboxAddr,
              //address allowListAddr,
              //address l2Receiver,
              //address l1Token,
              //uint256 amount,
              //uint256 l2TxGasLimit,
              //uint256 l2TxGasPerPubdataByte
          //) external onlyOwner {

  //let res = await ts.connect(signer).transferTokensToL2(
    //'0x2eD8eF54a16bBF721a318bd5a5C0F39Be70eaa65', // mailbox
    //'0x7546a21cd4D74fc98Ef1A50145dfd8c043e2096F', // allowlist
    //myPublicAddr, // l2 receiver
    //l1TokenAddress, // l1 token
    //1, // amount
    //11579208923731, // l2txgaslimit
    //800 // l2txgasperpubdatabyte
  //);


    //function transferTokensToL2WithBridge(
            //address bridgeAddr,
            //address l2Receiver,
            //address l1Token,
            //uint256 amount,
            //uint256 l2TxGasLimit,
            //uint256 l2TxGasPerPubdataByte
        //) external onlyOwner {

  let res = await ts.connect(signer).transferTokensToL2WithBridge(
    '0x84DbCC0B82124bee38e3Ce9a92CdE2f943bab60D', // bridgeAddr
    myPublicAddr, // l2 receiver
    l1TokenAddress, // l1 token
    1, // amount
    11579, // l2txgaslimit
    800 // l2txgasperpubdatabyte
    ,
    {
      gasLimit: 23000,
    }
  );

  let out = await res.wait();
  console.debug(out);

  console.log(`Final ${l1TokenName} amount of sender: ${ethers.utils.formatUnits(String(await getBalance(usdcContract, myPublicAddr, signer)), 6)}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

