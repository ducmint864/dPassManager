import "dotenv/config";

export const developmentChainIds = [1337, 31337];

export const networkConfig = {
    1337: {
        name: "ganache_localhost" as string,
    },
    31337: {
        name: "hardhat_localhost" as string,
    },
    11155111: {
        name: "sepolia_testnet",
    },
    80001: {
        name: "polygon_mumbai_testnet",
    }
}

