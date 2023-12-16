// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ERC20.sol";

contract Dex {
    event buy(
        address account,
        address _tokenAddress,
        uint256 _cost,
        uint256 _amount
    );
    event sell(
        address account,
        address _tokenAddress,
        uint256 _cost,
        uint256 _amount
    );

    mapping(address => bool) public supportedTokens;
    modifier supportedToken(address _tokenAddress) {
        require(supportedTokens[_tokenAddress], "Dex: token not supported");
        _;
    }

    constructor(address[] memory tokenAddress) {
        for (uint256 i = 0; i < tokenAddress.length; i++) {
            supportedTokens[tokenAddress[i]] = true;
        }
    }

    function buyToken(
        address _tokenAddress,
        uint256 _cost,
        uint256 _amount
    ) external payable supportedToken(_tokenAddress) {
        ERC20 token = ERC20(_tokenAddress);
        require(msg.value == _cost, "Dex: insufficient funds");
        require(
            token.balanceOf(address(this)) >= _amount,
            "Dex: token sold out"
        );
        token.transfer(msg.sender, _amount);
        emit buy(msg.sender, _tokenAddress, _cost, _amount);
    }

    function sellToken(
        address _tokenAddress,
        uint256 _cost,
        uint256 _amount
    ) external supportedToken(_tokenAddress) {
        ERC20 token = ERC20(_tokenAddress);
        require(
            token.balanceOf(msg.sender) >= _cost,
            "Dex: insufficient funds"
        );
        require(
            address(this).balance >= _amount,
            "Dex: insufficient funds in contract"
        );
        token.transferFrom(msg.sender, address(this), _cost);
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Dex: ETH transfer failed");
        emit sell(msg.sender, _tokenAddress, _cost, _amount);
    }
}
