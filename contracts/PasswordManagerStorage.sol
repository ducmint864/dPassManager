// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CloneFactory.sol";

/**
 * @title  PasswordManagerStorage Smart Contract
 * @author https://github.com/ducmint864
 * @notice Who would be the owner of a cloned version of this contract? Answer is the owner of any instance of this contract is the consumer/user of DePassword
 * @dev *Note that the owner of the original/sample version of this contract is whoever deployed it.
 */
contract PasswordManagerStorage is Ownable {
    // structs definition
    struct EncryptedLoginAccount {
        string encrypted__URI;
        string encrypted__name;
        string encrypted__username;
        string encrypted__email;
        string encrypted__password;
    }

    struct EncryptedKeyPair {
        string encrypted__publicKeyHex;
        string encrypted__privateKeyHex;
    }

    // Custom errors
    error PasswordManager__onlyUninitializedClone();

    // Events
    event KeyPairdAdded(address userAddress);
    event LoginAccountAdded(address userAddress);

    // State variables
    mapping(address => EncryptedLoginAccount[]) private s_accountList;
    mapping(address => EncryptedKeyPair) private s_keyPair;

    // functions
    constructor() {
        // Ownable contract's constructor will be called
    }

    function getContractAddress() public view returns (address) {
        return address(this);
    }

    function getEncryptedLoginAccount()
        external
        view
        onlyOwner
        returns (EncryptedLoginAccount[] memory)
    {
        return s_accountList[_msgSender()];
    }

    function getEncryptedKeyPair()
        external
        view
        onlyOwner
        returns (EncryptedKeyPair memory)
    {
        return s_keyPair[_msgSender()];
    }

    function initializeThisClone(
        address sampleStorageAddress,
        address consumer
    ) external onlyUninitializedClone(sampleStorageAddress) {
        _transferOwnership(consumer);
    }

    function addEncryptedLoginAccount(
        string calldata _encrypted__name,
        string calldata _encrypted__URI,
        string calldata _encrypted__username,
        string calldata _encrypted__email,
        string calldata _encrypted__password
    ) external onlyOwner returns (bool) {
        s_accountList[msg.sender].push(
            EncryptedLoginAccount({
                encrypted__URI: _encrypted__URI,
                encrypted__name: _encrypted__name,
                encrypted__username: _encrypted__username,
                encrypted__email: _encrypted__email,
                encrypted__password: _encrypted__password
            })
        );
        return true;
    }

    function addEncryptedKeyPair(
        string calldata _encrypted__publicKeyHex,
        string calldata _encrypted__privateKeyHex
    ) external onlyOwner returns (bool) {
        s_keyPair[msg.sender] = EncryptedKeyPair({
            encrypted__publicKeyHex: _encrypted__publicKeyHex,
            encrypted__privateKeyHex: _encrypted__privateKeyHex
        });
        return true;
    }

    // Modifiers
    modifier onlyUninitializedClone(address sampleStorageAddress) {
        bool amICloned = CloneFactory.isClone(
            sampleStorageAddress,
            getContractAddress()
        );
        bool ownerIsNull = (owner() == address(0));
        if (!(amICloned && ownerIsNull)) {
            revert PasswordManager__onlyUninitializedClone();
        }
        _;
    }
}
