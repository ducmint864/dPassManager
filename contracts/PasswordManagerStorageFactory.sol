// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PasswordManagerStorage.sol";
import "./CloneFactory.sol";

contract PasswordManagerStorageFactory is Ownable {
    // State variables
    address private s_sampleStorageAddress;

    // Custom errors
    error PasswordManagerStorageFactory__OnlyNonZeroAddress();

    // Functions
    
    /**
     * @dev On deployment of this Factory Contract, we also need to deploy a sample/base version of the Storage Contract
     * @dev Cloned instances of Storage Contract will be created based on such sample Storage Contract, and thus will delegate all calls to the sample contract, while maintaining a separate states
     */
    constructor() {
        // Ownable Contract's constructor will be called
        // deploy the sample version of the Storage Contract
        PasswordManagerStorage sampleStorage = new PasswordManagerStorage();
        s_sampleStorageAddress = sampleStorage.getContractAddress();
    }

    function getSampleStorageAddress() public view returns (address) {
        return s_sampleStorageAddress;
    }

    function setSampleStorageAddress(
        address samepleStorageAddress
    ) external onlyOwner onlyNonZeroAddress(samepleStorageAddress) {
        s_sampleStorageAddress = samepleStorageAddress;
    }

    function _createStorageInstance()
        internal
        returns (address instanceAddress)
    {
        instanceAddress = CloneFactory.createClone(getSampleStorageAddress());
        PasswordManagerStorage newInstance = PasswordManagerStorage(
            instanceAddress
        );
        newInstance.initializeThisClone(
            getSampleStorageAddress(),
            _msgSender()
        );
        return instanceAddress;
    }

    // Modifiers
    modifier onlyNonZeroAddress(address A) {
        if (A == address(0)) {
            revert PasswordManagerStorageFactory__OnlyNonZeroAddress();
        }
        _;
    }
}
