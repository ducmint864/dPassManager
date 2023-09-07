// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title  PasswordManagerStorage smart contracat
 * @author https://github.com/ducmint864
 * @notice Who would be the owner of a cloned version of this contract? Answer is the owner of any instance of this contract is the consumer/user of DePassword
 * @dev Note that the owner of the original/sample version of this contract is whoever deployed it.
 */
contract PasswordManagerStorage is Ownable {
    // struct EncryptedIdentity {
    //     string _title;
    //     string _firstName;
    //     string _middleName;
    //     string _lastName;
    //     string _username;
    //     string _company;
    //     string _socialSecurityNumber;
    //     string _passPortNumber;
    //     string _LicenseNumber;
    //     string _email;
    //     string _phone;
    //     string _address1;
    //     string _address2;
    //     string _address3;
    //     string _cityOrTown;
    //     string _stateOrProvince;
    //     string _postalCode;
    //     string _country;
    // }

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
        string iv;
    }
    // Custom errors

    // Events
    event KeyPairdAdded(address userAddress);
    event LoginAccountAdded(address userAddress);

    // State variables
    mapping(address => EncryptedLoginAccount[]) private s_accountList;
    mapping(address => EncryptedKeyPair) private s_keyPair;

    // functions
    constructor() {}

    function _initalizeClone(address consumer) external {
        transferOwnership(consumer);
    }

    function _addEncryptedLoginAccount(
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

    function _addEncryptedKeyPair(
        string calldata _encrypted__publicKeyHex,
        string calldata _encrypted__privateKeyHex,
        string calldata _iv
    ) external onlyOwner returns (bool) {
        s_keyPair[msg.sender] = EncryptedKeyPair({
            encrypted__publicKeyHex: _encrypted__publicKeyHex,
            encrypted__privateKeyHex: _encrypted__privateKeyHex,
            iv: _iv
        });
        return true;
    }

    function _getContractAddress() external view returns (address) {
        return address(this);
    }

    function _getEncryptedLoginAccount()
        external
        view
        onlyOwner
        returns (EncryptedLoginAccount[] memory)
    {
        return s_accountList[_msgSender()];
    }

    function _getEncryptedKeyPair()
        external
        view
        onlyOwner
        returns (EncryptedKeyPair memory)
    {
        return s_keyPair[_msgSender()];
    }
}
