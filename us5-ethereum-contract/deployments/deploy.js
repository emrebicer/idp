// TokenSender deployed at 0x17fe54A433dD37fFb7bf243f379cAd3b1B724bd5
// MyERC20Token deployed at 0xD82dA44EC61340739270D0116060E91eDf19168d
async function main() {
  const HelloWorld = await ethers.getContractFactory("TokenSender");
  const hello_world = await HelloWorld.deploy();
  console.log("Contract Deployed to Address:", hello_world.address);
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

