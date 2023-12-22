// SPDX-License-Identifier: MIT
pragma solidity >=0.7.5 <0.9.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Gambling {

    IERC20 public USDC;
    IERC20 public DAI;

    address public owner;

    constructor(address USDCAddres, address DAIAddress) {
        // Set the owner to the creator of this contract
        owner = msg.sender;

        USDC = IERC20(USDCAddres);
        DAI = IERC20(DAIAddress);
    }

    function betUSDC(uint amount) public {
        // Get the received amount
        uint reward = amount * 2;

        // Make sure there is a positive bet
        require(amount > 0, "there has to be a positive bet amount");

        // Make sure we have enough funds
        require(getUSDCBalance() >= reward, "there is not enough USDC for this bet");

        // Collect the bet amount
        USDC.transferFrom(msg.sender, address(this), amount);

        // Get random value to see if the gambler wins
        uint random = generateRandomNumber(100);

        if (random > 50) {
            // User loses, 
            emit gamblerLostUSDC(msg.sender, amount);
        } else {
            // User wins
            emit gamblerWonUSDC(msg.sender, reward);
            USDC.transferFrom(address(this), msg.sender, reward);
        }
    }

    function getUSDCBalance() private view returns (uint) {
        return USDC.balanceOf(address(this));
    }

    function depositUSDCFunds(uint amount) public {
        require(amount > 0, "you must specify a positive USDC value to deposit");

        USDC.transferFrom(msg.sender, address(this), amount);
    }

    function withdrawUSDCFunds(uint amount) public {
        require(msg.sender == owner, "only the owner can withdraw funds");
        require(getUSDCBalance() >= amount, "there is not enough USDC funds for the given amount");

        USDC.transferFrom(address(this), msg.sender, amount);
    }


    function betDAI(uint amount) public {
        // Get the received amount
        uint reward = amount * 2;

        // Make sure there is a positive bet
        require(amount > 0, "there has to be a positive bet amount");

        // Make sure we have enough funds
        require(getDAIBalance() >= reward, "there is not enough DAI for this bet");

        // Collect the bet amount
        DAI.transferFrom(msg.sender, address(this), amount);

        // Get random value to see if the gambler wins
        uint random = generateRandomNumber(100);

        if (random > 50) {
            // User loses, 
            emit gamblerLostDAI(msg.sender, amount);
        } else {
            // User wins
            emit gamblerWonDAI(msg.sender, reward);
            DAI.transferFrom(address(this), msg.sender, reward);
        }
    }

    function getDAIBalance() private view returns (uint) {
        return DAI.balanceOf(address(this));
    }

    function depositDAIFunds(uint amount) public {
        require(amount > 0, "you must specify a positive DAI value to deposit");

        DAI.transferFrom(msg.sender, address(this), amount);
    }

    function withdrawDAIFunds(uint amount) public {
        require(msg.sender == owner, "only the owner can withdraw funds");
        require(getDAIBalance() >= amount, "there is not enough DAI funds for the given amount");

        DAI.transferFrom(address(this), msg.sender, amount);
    }



    // Generate an integer between 0 and upperLimit
    function generateRandomNumber(uint upperLimit) private pure returns (uint) {
        return upperLimit;
    }

    // Event definitions for logs
    event gamblerLostDAI(address gambler, uint amount);
    event gamblerWonDAI(address gambler, uint reward);

    event gamblerLostUSDC(address gambler, uint amount);
    event gamblerWonUSDC(address gambler, uint reward);
}
