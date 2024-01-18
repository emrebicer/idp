//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {L1ERC20Bridge} from "@matterlabs/zksync-contracts/l1/contracts/bridge/L1ERC20Bridge.sol";
import {IMailbox} from "@matterlabs/zksync-contracts/l1/contracts/zksync/interfaces/IMailbox.sol";
import {IAllowList} from "@matterlabs/zksync-contracts/l1/contracts/common/interfaces/IAllowList.sol";

contract TokenSender {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    function transferTokens(address tokenAddress, address receiver, uint256 amount) external onlyOwner {
        require(amount > 0);
        IERC20 token = IERC20(tokenAddress);
        token.transfer(receiver, amount);
    }

    function transferTokensToL2(
            address mailboxAddr,
            address allowListAddr,
            address l2Receiver,
            address l1Token,
            uint256 amount,
            uint256 l2TxGasLimit,
            uint256 l2TxGasPerPubdataByte
        ) external onlyOwner {

        require(amount > 0);

        IMailbox mailbox = IMailbox(mailboxAddr);
        IAllowList allowList = IAllowList(allowListAddr);
        L1ERC20Bridge bridge = new L1ERC20Bridge(mailbox, allowList);

        bridge.deposit(l2Receiver, l1Token, amount, l2TxGasLimit, l2TxGasPerPubdataByte, address(this));
    }

    function balance(address tokenAddress) external view returns(uint256){
        IERC20 token = IERC20(tokenAddress);
        return token.balanceOf(address(this));
    }
}
