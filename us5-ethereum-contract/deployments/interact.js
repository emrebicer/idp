
async function main() {
  const TokenSender = await ethers.getContractFactory("TokenSender");
  const ts = await TokenSender.attach('0x04E97E65487aBb3bb8BFcFCeed3755e18Ce2c5E3') //deployed contract address

  wallet = await new ethers.Wallet(process.env.PRIVATE_KEY);
  signer = await wallet.connect(ethers.provider);

  await ts.connect(signer).transferTokensToL2(
  '0x2eD8eF54a16bBF721a318bd5a5C0F39Be70eaa65',
  '0x7546a21cd4D74fc98Ef1A50145dfd8c043e2096F',
  '0x665FA5E77dAE4db2884A4dd3A371B146dA2A59Af',
  '0x308516B866620fe50e1Af6EdD895C3b823711466',
  42,
  1,
  1
  );

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

