import { ethers } from "hardhat";

async function main() {
  const [deployer, user1, user2] = await ethers.getSigners();

  console.log("Deploying with:", deployer.address);

  // Deploy AssetToken
  const AssetToken = await ethers.getContractFactory("AssetToken");
  const token = await AssetToken.deploy("BondToken", "BOND", deployer.address);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("AssetToken deployed at:", tokenAddress);

  // Deploy SettlementEngine
  const SettlementEngine = await ethers.getContractFactory("SettlementEngine");
  const engine = await SettlementEngine.deploy(deployer.address);
  await engine.waitForDeployment();
  const engineAddress = await engine.getAddress();
  console.log("SettlementEngine deployed at:", engineAddress);

  // Whitelist both users
  const whitelistTx1 = await engine.setWhitelist(user1.address, true);
  await whitelistTx1.wait();
  const whitelistTx2 = await engine.setWhitelist(user2.address, true);
  await whitelistTx2.wait();
  console.log("Users whitelisted");

  // Mint and approve tokens
  await token.mint(deployer.address, 2000);  // Mint to deployer
  await token.transfer(user1.address, 1000); // Then transfer to user1
  const approveTx = await token.connect(user1).approve(engineAddress, 1000);
  await approveTx.wait();
  console.log("Tokens minted and approved");

  // Set a transaction ID
  const txnId = ethers.keccak256(ethers.toUtf8Bytes("txn-001"));

  // Set time lock (e.g., 2 minutes from now)
  const unlockTime = Math.floor(Date.now() / 1000) + 120;
  const timeLockTx = await engine.setSettlementTime(txnId, unlockTime);
  await timeLockTx.wait();
  console.log("Time lock set for txnId");

  // Initialize settlement
  const initTx = await engine.connect(user1).initializeSettlement(
    tokenAddress,
    user1.address,
    user2.address,
    100,
    txnId
  );
  await initTx.wait();
  console.log("Settlement initialized");

  // (Optional) Wait and finalize later
  console.log("🚀 Deployment complete. Finalize settlement after unlock time if needed.");
}

main().catch((error) => {
  console.error("❌ Error in deployment:", error);
  process.exitCode = 1;
});
