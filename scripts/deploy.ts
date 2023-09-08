import { ethers, network } from "hardhat";
import { networkConfig } from "./network-config";

// PMC: PasswordManagerConsumer
async function deployPMC(verbose: boolean = true): Promise<string> {
    try {
        // Print network configuration
        const chainId: number = (network.config.chainId as number) ?? process.env.DEFAULT_CHAIN_ID;
        if (verbose) {
            console.log("---------------------------- Contract deployment script ----------------------------\n");
            console.log("--> Network: {\n\tName: ", networkConfig[chainId as keyof typeof networkConfig].name);
            console.log("\tChain Id: ", chainId);
            console.log("}");
        }

        // Deploy CloneFactory library
        const lib = await ethers.deployContract("CloneFactory");
        await lib.waitForDeployment();
        const libAddress = await lib.getAddress();

        // Deploy PMC Contract
        const pmc = await ethers.deployContract("PasswordManagerConsumer", {
            libraries: {
                CloneFactory: libAddress
            }
        });
        await pmc.waitForDeployment();

        // Return address of deployed PMC Contract
        return await pmc.getContractAddress();
    } catch (err) {
        throw new Error(`deployPMC(): ${err}`)
    }
}

// Test
deployPMC()
    .then(contractAddress => console.log(`PMC contract has been deployed to address ${contractAddress}`))
    .catch(err => console.error(err));