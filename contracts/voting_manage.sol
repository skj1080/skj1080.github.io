pragma solidity ^0.4.24;
import "./voting.sol";

contract voting_manage {
    uint public num;
    mapping (uint => voting_contract) contracts;
    
    struct voting_contract{
        address contract_address;
        string name;
    }

    constructor() public {
        num = 0;
    }

    function generate_contract(string s,uint time) public{
        contracts[num].contract_address = new voting(msg.sender, time);
        contracts[num].name = s;
        num +=1;
    }

    function get_contract(uint n) public view returns(address, string){
        return (contracts[n].contract_address, contracts[n].name);
    }
}
