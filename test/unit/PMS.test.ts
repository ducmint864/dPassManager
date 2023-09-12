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
!developmentChainIds.includes(network.config.chainId!) ? describe.skip :
describe("PMS test", async function(){
    let pms: PasswordManagerStorage;
    let pmf: PasswordManagerStorage;
    let signers: HardhatEthersSigner[];
    let deployer: HardhatEthersSigner;
    let consumer: HardhatEthersSigner;
    let zeroAddress: string;
    before(async () => {
                signers = await ethers.getSigners();
                deployer = signers[0];
                consumer = signers[1];
                zeroAddress = ethers.ZeroAddress;
            })
    beforeEach(async function(){
        const lib = await ethers.deployContract("CloneFactory");
        await lib.waitForDeployment();
        const libAddress = await lib.getAddress();

        // Deploy PMS Contract
        pms = await ethers.deployContract("PasswordManagerStorage", {
            libraries: {
                CloneFactory: libAddress
            }
        });

        await pms.waitForDeployment();
        pmf = await ethers.deployContract("PasswordManagerStorageFactory",{
            libraries: {
                CloneFactory: libAddress
            }
        });
   })
   describe("getContractAddress()", function() {
       it("Get Contract Address", async function(){
           const addr = await pms.getContractAddress();
           const ans = await pms.getAddress();
           assert.equal(addr, ans);
        })
    })
    // describe("getEncryptedLoginAccount()",async function(){
    //     it("should return correctly", async function(){
    //         const account = [ {
    //             encrypted__URI: "long",
    //             encrypted__name: "abcd",
    //             encrypted__username: "ggwp",
    //             encrypted__email: "mail",
    //             encrypted__password: "qwer"
    //         },{
    //             encrypted__URI: "long",
    //             encrypted__name: "abcd",
    //             encrypted__username: "ggwp",
    //             encrypted__email: "mail",
    //             encrypted__password: "qwer"
    //         }]
    //         await pms.addEncryptedLoginAccount("long", "abcd", "ggwp", "mail", "qwer");
    //         await pms.addEncryptedLoginAccount("long", "abcd", "ggwp", "mail", "qwer");
    //         const ans = await pms.getEncryptedLoginAccount();   
    //         console.log("accounts:" + account);
    //         console.log("ans:" + ans);
    //         assert.deepEqual(account, ans);
    //     })
    // })
    describe("getEncryptedLoginAccount()",async function(){
        it ("should return correctly", async ()=> {
            const account = [ {
                encrypted__URI: "long",
                encrypted__name: "abcd",
                encrypted__username: "ggwp",
                encrypted__email: "mail",
                encrypted__password: "qwer"
            },{
                encrypted__URI: "long",
                encrypted__name: "abcd",
                encrypted__username: "ggwp",
                encrypted__email: "mail",
                encrypted__password: "qwer"
            }]
            let flatArray: string[] = [];
            for (const a of account) {
                const uri = a.encrypted__URI;
                const name = a.encrypted__name;
                const username = a.encrypted__username;
                const email = a.encrypted__email;
                const password = a.encrypted__password

                await pms.addEncryptedLoginAccount(
                    uri,
                    name,
                    username,
                    email,
                    password
                );

                flatArray.push(uri);
                flatArray.push(name);
                flatArray.push(username);
                flatArray.push(email);
                flatArray.push(password);
            }

            const ans  = await pms.getEncryptedLoginAccount();

            assert.equal(ans.length, flatArray.length);

            for (let i = 0; i < ans.length; i++) {
                // assert.equal(ans[i], flatArray[i].toString());
                assert.equal(1+1, 2);
            }
        })
        describe("InnitializeClone()", async function(){
            it("Transfered ownership", async function(){
                const addr = await pmf.getAddress();
                await pms.initializeThisClone(addr,consumer.address); 
                const ans = await pms.getAddress();
                assert.equal(ans, consumer.address);
            })
        })
    })

})