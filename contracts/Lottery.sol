pragma solidity ^0.6.1;

contract Lottery {
    address public manager;
    address payable[] public players;

    constructor() public {
        // msg is the global variable that holds sender, data, value etc
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether, "Ether not sufficient enough");

        players.push(msg.sender);
    }

    function random() public view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, now, players)));
    }

    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        players = new address payable[](0);
    }

    modifier restricted() {
        require(msg.sender == manager, "User not authorized");
        _;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
}
