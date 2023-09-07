import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config"
import { HardhatUserConfig } from "hardhat/types";

const PRIVATE_KEYS: string[] = process.env.PRIVATE_KEYS?.split(" ") ?? [""];
const SEPOLIA_RPC_URL: string = process.env.SEPOLIA_RPC_URL ?? "";
const MAINNET_RPC_URL: string = process.env.MAINNET_RPC_URL ?? "";
const ETHERSCAN_API_KEY: string = process.env.ETHERSCAN_API_KEY ?? "";
const COINMARKETCAP_API_KEY: string = process.env.COINMARKETCAP_API_KEY ?? "";
const POLYGON_MUMBAI_RPC_URL: string = process.env.POLYGON_MUMBAI_RPC_URL ?? "";

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.19",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 100,
                    },
                    viaIR: true,
                },        
            },
        ],
    },
    defaultNetwork: "hardhat_localhost",
    networks: {
        mainnet: {
            url: MAINNET_RPC_URL,
            accounts: PRIVATE_KEYS,
            chainId: 1
        },
        sepolia_testnet: {
            url: SEPOLIA_RPC_URL,
            accounts: PRIVATE_KEYS,
            chainId: 11155111,
        },
        // hardhat: {
        //     forking: {
        //         url: MAINNET_RPC_URL,
        //     },
        // },
        hardhat_localhost: {
            url: process.env.HARDHAT_LOCALHOST_RPC_URL,
            chainId: 31337,
            accounts: PRIVATE_KEYS
        },
        polygon_mumbai_testnet: {
            url: POLYGON_MUMBAI_RPC_URL,
            chainId: 80001,
            accounts: PRIVATE_KEYS,
        }
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        noColors: true,
        currency: 'USD',
        outputFile: "./artifacts/latest-gas-report",
        coinmarketcap: COINMARKETCAP_API_KEY
    },
};

export default config;