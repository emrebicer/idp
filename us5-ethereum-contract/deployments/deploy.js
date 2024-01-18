// Deployed at 0x308516B866620fe50e1Af6EdD895C3b823711466
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

