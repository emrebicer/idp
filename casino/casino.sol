pragma solidity >=0.8.2 <0.9.0;

contract Gambling {

    int fund;

    address public owner;

    // Constructor is "payable" so it can receive the initial funding of 30, 
    constructor() payable {
        require(msg.value == 30 ether, "30 ether initial funding required");
        /* Set the owner to the creator of this contract */
        owner = msg.sender;
    }


    function bet() public payable {
        // Get the received amount
        uint amount = msg.value;
        uint reward = amount * 2;

        // Make sure there is a positive bet
        require(amount > 0, "there has to be a positive bet amount");

        // Make sure we have enough funds
        require(getBalance() >= reward, "there is not enough funds for this bet");

        // Get random value to see if the gambler wins
        uint random = generateRandomNumber(100);

        if (random > 50) {
            // User loses, 
            emit gamblerLost(msg.sender, amount);
        } else {
            // User wins
            emit gamblerWon(msg.sender, reward);
            payable(msg.sender).transfer(reward);
        }
    }


    function getBalance() private view returns (uint) {
        return address(this).balance;
    }


    // Generate an integer between 0 and upperLimit
    function generateRandomNumber(uint upperLimit) private returns (uint) {

        return 10;
    }

    function depositFunds() public payable {
        require(msg.value > 0, "you must specify a positive ETH value to deposit");
    }

    function withdrawFunds(uint amount) public {
        require(msg.sender == owner, "only the owner can withdraw funds");
        require(getBalance() >= amount, "there is not enough funds for the given amount");

        payable(msg.sender).transfer(amount);
    }


    // Event definitions for logs
    event gamblerLost(address gambler, uint amount);
    event gamblerWon(address gambler, uint reward);
}
