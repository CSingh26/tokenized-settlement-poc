import { setEngine } from "crypto";
import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const AssetToken = await ethers.getContractFactory("AssetToken");
    const token = await AssetToken.deploy("BondToken", "BOND", deployer.address);
    await token.waitForDeployment();
    console.log("AssetToken deployed to:", await token.getAddress());

    const SettlementEngine = await ethers.getContractFactory("SettlementEngine");
    const engine = await SettlementEngine.deploy(deployer.getAddress());
    await engine.waitForDeployment();
    console.log("SettlementEngine deployed to:", await engine.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});