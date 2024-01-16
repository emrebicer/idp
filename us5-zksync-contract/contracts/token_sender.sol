//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenSender {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    function transferTokens(address tokenAddress, address to, uint256 amount) external onlyOwner {
        require(amount > 0);
        IERC20 token = IERC20(tokenAddress);
        token.transfer(to, amount);
    }

    function balance(address tokenAddress) external view returns(uint256){
        IERC20 token = IERC20(tokenAddress);
        return token.balanceOf(address(this));
    }
}
