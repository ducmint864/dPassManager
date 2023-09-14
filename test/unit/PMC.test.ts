import { ethers, network } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { developmentChainIds } from "../../scripts/network-config";
import { assert, expect } from "chai";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import deployPMC from "../../scripts/deploy";
import {
    PasswordManagerConsumer,
    PasswordManagerConsumer__factory,
    PasswordManagerStorage,
    PasswordManagerStorageFactory
} from "../../typechain-types";

// Because PMC Contract inherits from PMSF Contract, this file also includes tests for PMSF functions
!developmentChainIds.includes(network.config.chainId!) ? describe.skip :
describe("PMC Contract (including tests for PMSF Contract)", () => {
    let signers: HardhatEthersSigner[];
    let deployer: HardhatEthersSigner;
    let consumer: HardhatEthersSigner;
    let pmc: PasswordManagerConsumer;
    let _pmc: PasswordManagerConsumer; // still pmc but for the 'consumer' signer
    let pmcAddress: string;
    let zeroAddress: string;

    // Before all
    before(async () => {
        signers = await ethers.getSigners();
        deployer = signers[0];
        consumer = signers[1];
        zeroAddress = ethers.ZeroAddress;
    })

    // Before each test case
    beforeEach(async () => {
        const verbose = false;
        pmcAddress = await deployPMC(verbose);
        pmc = await ethers.getContractAt(
            "PasswordManagerConsumer",
            pmcAddress,
            deployer
        );
        _pmc = await ethers.getContractAt(
            "PasswordManagerConsumer",
            pmcAddress,
            consumer
        )
    })

    // Test cases:
    describe("constructor()", () => {
        it (`sets _owner to deployer's address`, async () => {
            const _owner = await pmc.owner();
            assert.equal(_owner, deployer.address);
        })
        it("deploys the sample version of the PMS Contract. Therefore, the owner of that PMS contract should be this PMC contract we're testing", async  () => {
            const sampleStorageAddress = await pmc.getSampleStorageAddress();
            const sample: PasswordManagerStorage = await ethers.getContractAt(
                "PasswordManagerStorage",
                sampleStorageAddress
            );
            const sampleOwner = await sample.owner();
            assert.equal(sampleOwner, pmcAddress);
        })
    })

    describe("getSampleStorageAddress", () => {
        it("returns a non-zero address", async () => {
            const sampleStorageAddress = await pmc.getSampleStorageAddress();
            assert.notEqual(sampleStorageAddress, zeroAddress);
        })
    })

    describe("setSampleStorageAddress", () => {
        it("reverts if caller is not _owner", async () => {
            const randomAddress = deployer.address;
            await expect(_pmc.setSampleStorageAddress(randomAddress))
                .to.be.revertedWith("Ownable: caller is not the owner");
        })
        it("reverts if new address is zero address", async () => {
            await expect(pmc.setSampleStorageAddress(zeroAddress))
                .to.be.revertedWithCustomError(
                    pmc,
                    "PasswordManagerStorageFactory__OnlyNonZeroAddress"
                );
        })
        it("sets new address if new address isn't zero address");
    })

    describe("getConsumerStorageAddress()", () => {
        it("returns zero address if consumer isn't registered", async () => {
            const consumerStorageAddress = await _pmc.getConsumerStorageAddress();
            assert.equal(consumerStorageAddress, zeroAddress);
        })
        it ("returns non-zero address if consumer is registered", async () => {
            await _pmc.registerConsumer();
            const consumerStorageAddress = await _pmc.getConsumerStorageAddress();
            assert.notEqual(consumerStorageAddress, zeroAddress);
        })
    })

    describe("getStorageAddress", () => {
        it("returns the address of the PMC contract", async () => {
            const address = await pmc.getContractAddress();
            assert.equal(address, pmcAddress);
        })
    })

    describe("registerConsumer() -> _createStorageInstance()", () => {
        it("creates a new instance/clone of PMS contract address for the new consumer", async () => {
            await _pmc.registerConsumer();
            const consumerStorageAddress = await _pmc.getConsumerStorageAddress();
            assert.notEqual(consumerStorageAddress, zeroAddress);
        })

        it("sets the owner of the newly created PMS Contract whoever registered for it", async () => {
            await _pmc.registerConsumer();
            const consumerStorageAddress = await _pmc.getConsumerStorageAddress();
            const pms: PasswordManagerStorage = await ethers.getContractAt(
                "PasswordManagerStorage",
                consumerStorageAddress
            );
            const consumerStorageOwner = await pms.owner();
            assert.equal(consumerStorageOwner, consumer.address);
        })
        it("reverts if consumer is already registered", async () => {
            await _pmc.registerConsumer();
            await expect(_pmc.registerConsumer())
                .to.be.revertedWithCustomError(
                    _pmc,
                    "PasswordmanagerConsumer__NotForRegisteredConsumer"
                );
        })
    })

    describe("addLoginAccount()", () => {
        const email = "BE740194BD2847335E73724DA6C51E688B6F9BE2ADB8E8BEA2A7F666F56663A4";
        const name = "1AACC1D86D99F9EDF5EF4C350AECD6EB017B1FA4A14FEDA26885C4C23341E07D";
        const URI = "7815A0706FF6B4FC3D9E52B706EB77B8";
        const username = "";
        const password = "F9000B7904762BB4DC5765CF9C1C8FEE";
        it("reverts if consumer calls getLoginAccount() but hasn't registered", async () => {
            await expect(_pmc.addLoginAccount(
                name,
                URI,
                username,
                email,
                password
            )).to.be.revertedWithCustomError(
                _pmc,
                "PasswordManagerConsumer__OnlyRegisteredConsumer"
            );
        })
    })

    describe("getLoginAccount()", () => {
        it("returns a list of all encrypted login accounts that had been added by consumer to their own storage", async () => {
            // add a few encrypted login accounts first
            const email = "BE740194BD2847335E73724DA6C51E688B6F9BE2ADB8E8BEA2A7F666F56663A4";
            const name = "1AACC1D86D99F9EDF5EF4C350AECD6EB017B1FA4A14FEDA26885C4C23341E07D";
            const URI = "7815A0706FF6B4FC3D9E52B706EB77B8";
            const username = "";
            const password = "F9000B7904762BB4DC5765CF9C1C8FEE"; 
            await _pmc.registerConsumer();
            await _pmc.addLoginAccount(
                name,
                URI,
                username,
                email,
                password
            );
            const data: any = await _pmc.getLoginAccount();
            console.log(data);
            assert.equal(0, 0);
        })
        it("reverts if register calls getLoginAccount() but hasn't registered", async () => {
            await expect(_pmc.getLoginAccount())
                .to.be.revertedWithCustomError(
                    _pmc,
                    "PasswordManagerConsumer__OnlyRegisteredConsumer"
                );
        })
        
    })
})

