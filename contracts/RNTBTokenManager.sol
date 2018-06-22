pragma solidity ^0.4.21;

import "../library/ownership/HasNoEther.sol";
import "../library/interface/IRntToken.sol";
import "../library/interface/IPricingStrategy.sol";


contract RNTBTokenManager is HasNoEther {
    address public wallet;
    IRntToken public token;
    IPricingStrategy public pricingStrategy;

    mapping (address => bytes16) public users;

    event UuidRigistered(address _addr, bytes16 _uuid);
    event TokensBought(address _addr, uint256 _weiSpend, uint256 _tokensReceived);
    event PricingStrategyChanged(address _changer, address _newStrategy);

    constructor(address _wallet, address _token) public {
        wallet = _wallet;
        token = IRntToken(_token);
    }

    function register(bytes16 _uuid) public {
        users[msg.sender] = _uuid;
        emit UuidRigistered(msg.sender, _uuid);
    }

    function buyTokens() public payable {
        uint256 tokens = pricingStrategy.calculatePrice(msg.value, token.decimals());
        token.transferFrom(owner, msg.sender, tokens);
        wallet.transfer(msg.value);
        emit TokensBought(msg.sender, msg.value, tokens);
    }

    function setPricingStrategy(IPricingStrategy _pricingStrategy) onlyOwner public {
        require(_pricingStrategy.isPricingStrategy());
        pricingStrategy = _pricingStrategy;
        emit PricingStrategyChanged(msg.sender, pricingStrategy);
    }

}