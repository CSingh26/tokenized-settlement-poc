import { ethers } from "hardhat";

async function main() {
  const [deployer, user1] = await ethers.getSigners();

  const assetToken = await ethers.getContractAt("AssetToken", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
  const engine = await ethers.getContractAt("SettlementEngine", "0x7f1725E7734CE288F8367e1bb143e90bb3bf0512");

  console.log("Minting 1000 tokens to user1...");
  const tx1 = await assetToken.mint(user1.address, ethers.parseEther("1000"));
  await tx1.wait();

  const balance = await assetToken.balanceOf(user1.address);
  console.log(`User1 balance: ${ethers.formatEther(balance)} BOND`);

  // Optionally: initiate a settlement and mock fraud check
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
