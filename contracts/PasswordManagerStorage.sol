// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CloneFactory.sol";
import "./DataStruct.sol";

/**
 * @title  PasswordManagerStorage Smart Contract (Cloneable)
 * @author https://github.com/ducmint864
 * @notice Who would be the owner of a cloned version of this contract? Answer is the owner of any instance of this contract is the consumer/user of DePassword
 * @dev *Note that the owner of the original/sample version of this contract is whoever deployed it.
 */
contract PasswordManagerStorage is Ownable {
    // Custom errors
    error PasswordManagerStorage__OnlyUninitializedClone();
    error PasswordManagerStorage__CallerIsNotFactory();

    // Events
    event KeyPairdAdded(address userAddress);
    event LoginAccountAdded(address userAddress);

    // State variables
    EncryptedLoginAccount[] private s_accountList;

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
        return s_accountList;
    }

    function initializeThisClone(
        address sampleStorageAddress,
        address consumer
    ) external checkValidClone(sampleStorageAddress) {
        _initializeThisClone(consumer);
    }

    function addEncryptedLoginAccount(
        string calldata _encrypted__name,
        string calldata _encrypted__URI,
        string calldata _encrypted__username,
        string calldata _encrypted__email,
        string calldata _encrypted__password
    ) external onlyOwner returns (bool) {
        s_accountList.push(
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

    function _initializeThisClone(address consumer) internal {
        _transferOwnership(consumer);
    }

    // Modifiers
    modifier checkValidClone(address sampleStorageAddress) {
        PasswordManagerStorage sampleStorage = PasswordManagerStorage(
            sampleStorageAddress
        );
        bool callerIsFactory = (_msgSender() == sampleStorage.owner());
        if (!callerIsFactory) {
            revert PasswordManagerStorage__CallerIsNotFactory();
        }

        bool amICloned = CloneFactory.isClone(
            sampleStorageAddress,
            getContractAddress()
        );
        bool ownerIsNull = (owner() == address(0));
        if (!(amICloned && ownerIsNull && callerIsFactory)) {
            revert PasswordManagerStorage__OnlyUninitializedClone();
        }
        _;
    }
}
