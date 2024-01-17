// Deployed at 0x406CeF36fFff5f3D123348f1e02421A9E01CC8E2
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

