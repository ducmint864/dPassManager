// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PasswordManagerStorage.sol";
import "./CloneFactory.sol";

contract PasswordManagerStorageFactory is Ownable {
    // State variables
    address private s_sampleStorageAddress;

    // Functions

    /**
     * @dev On deployment of this Factory Contract, we also need to deploy a sample/base version of the Storage Contract
     * @dev Cloned instances of Storage Contract will be created based on such sample Storage Contract, and thus will delegate all calls to the sample contract, while maintaining a separate states
     */
    constructor() {
        // deploy the sample version of the storage contract
        PasswordManagerStorage sampleStorage = new PasswordManagerStorage();
        s_sampleStorageAddress = sampleStorage.getContractAddress();
    }

    function getSampleStorageAddress() public view returns (address) {
        return s_sampleStorageAddress;
    }

    function _setSampleStorageAddress(
        address samepleStorageAddress
    ) external onlyOwner {
        s_sampleStorageAddress = samepleStorageAddress;
    }

    function _createStorageInstance()
        internal
        returns (PasswordManagerStorage, address)
    {
        address cloneAddress = CloneFactory.createClone(getSampleStorageAddress());
        PasswordManagerStorage newInstance = PasswordManagerStorage(
            cloneAddress
        );
        newInstance.initializeThisClone(getSampleStorageAddress(), _msgSender());
        return (newInstance, cloneAddress);
    }
}
