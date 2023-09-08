// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "./PasswordManagerStorageFactory.sol";
import "./PasswordManagerStorage.sol";
import "./DataStruct.sol";

contract PasswordManagerConsumer is PasswordManagerStorageFactory {
    // Custom Errors:
    error PasswordManagerConsumer__OnlyRegisteredConsumer();
    error PasswordmanagerConsumer__NotForRegisteredConsumer();

    // Events
    event PasswordManagerConsumer__ConsumerRegistered(address consumer);
    event PasswordManagerConsumer__ConsumerLoginAccountAdded(address consumer);
    event ThanksForSupporting(address donator, uint256 value);

    // State variables
    mapping(address => address) private s_consumerStorageAddress;

    // functions
    constructor() {
        // Ownable Contract's constructors will be called
    }

    /**
     * @notice Since this password manager is open-source, transparent, free to use (consumers are still responsible for transaction fees pertaining to saving passwords),
     * any amount of support regardlessly from the users is greatly appreciated by us developers, also it is a strong driving force for the the dev community
     * to maintain and further develop great pieces of software like this one and many more ヾ(＠⌒ー⌒＠)ノ
     * The cumulative amount donation will be distributed evenly to all github contributors of this project. Thanks for supporting us
     */
    function _supportUs() private {
        emit ThanksForSupporting(_msgSender(), msg.value);
    }

    fallback() external payable {
        _supportUs();
    }

    receive() external payable {
        _supportUs();
    }

    function registerConsumer() external notForRegisteredConsumer {
        address consumerStorageAddress = _createStorageInstance();
        s_consumerStorageAddress[_msgSender()] = consumerStorageAddress;
        emit PasswordManagerConsumer__ConsumerRegistered(_msgSender());
    }

    function addLoginAccount(
        string calldata _encrypted__name,
        string calldata _encrypted__URI,
        string calldata _encrypted__username,
        string calldata _encrypted__email,
        string calldata _encrypted__password
    ) external onlyRegisteredConsumer {
        PasswordManagerStorage consumerStorage = PasswordManagerStorage(
            s_consumerStorageAddress[_msgSender()]
        );
        consumerStorage.addEncryptedLoginAccount(
            _encrypted__name,
            _encrypted__URI,
            _encrypted__username,
            _encrypted__email,
            _encrypted__password
        );
        emit PasswordManagerConsumer__ConsumerLoginAccountAdded(_msgSender());
    }

    function getLoginAccount()
        external
        view
        onlyRegisteredConsumer
        returns (EncryptedLoginAccount[] memory)
    {
        PasswordManagerStorage consumerStorage = PasswordManagerStorage(
            s_consumerStorageAddress[_msgSender()]
        );
        return consumerStorage.getEncryptedLoginAccount();
    }

    function getContractAddress() public view returns (address) {
        return address(this);
    }

    function getConsumerStorageAddress() public view returns (address) {
        return s_consumerStorageAddress[_msgSender()];
    }

    function _isRegisteredConsumer(
        address consumer
    ) internal view returns (bool) {
        return (s_consumerStorageAddress[consumer] != address(0));
    }

    // Modifiers
    modifier onlyRegisteredConsumer() {
        if (!_isRegisteredConsumer(_msgSender())) {
            revert PasswordManagerConsumer__OnlyRegisteredConsumer();
        }
        _;
    }

    modifier notForRegisteredConsumer() {
        if (_isRegisteredConsumer(_msgSender())) {
            revert PasswordmanagerConsumer__NotForRegisteredConsumer();
        }
        _;
    }
}
