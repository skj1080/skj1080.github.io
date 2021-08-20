pragma solidity ^0.4.24;

contract voting {
    address public owner;
    uint p;
    uint q;
    uint g;
    uint now_time;
    uint term_time;
    uint k;
    uint public n;
    uint vote_num;
    uint add_vote_num;
    bool public all_add_vote;
    bool public all_vote;
    uint public round;
    uint winner;
    uint tally_value;
    bool public tally_complete;
    uint[10] primes;
    mapping (uint => candidate) public candidates; 
    mapping (uint => voter) public voters; 
    mapping (address => uint) voter_number;
    
    struct voter{
        address voter_address;
        bool participant;
        bool voted;
        bool additional_voted;
        uint public_key;
        uint public_key_inv;
    }
    
    struct candidate{
        string name;
        uint value;
        uint votes;
    }
    constructor(address _owner, uint time) public {
        owner = _owner;
        p = 1091659;
        q = 181943;
        g = 9;
        k = 0;
        n = 0;
        vote_num = 0;
        add_vote_num = 0;
        winner = 0;
        all_vote = false;
        all_add_vote = false;
        tally_value = 1;
        tally_complete = false;
        primes = [2,3,5,7,11,13,17,19,23,29];
        now_time = block.timestamp;
        term_time = time;
    }
    function enroll_round() public returns (uint){
        round = 0;
        return round;
    }
    function vote_round(uint time) public returns (uint){
        round = 1;
        now_time = block.timestamp;
        term_time = time;
        return round;
    }
    function tally_round() public returns (uint){
        round = 2;
        return round;
    }

    function additional_round() public returns (uint){
        round = 3;
        return round;
    }

    function remain_time() public view returns(int){
        return int(term_time - block.timestamp + now_time);
    }
    
    function enroll_candidate(string name) public returns (bool success){
        require(round == 0 && ((block.timestamp - now_time) < term_time));
        candidates[k].name = name;
        candidates[k].value = primes[k];
        candidates[k].votes = 0;
        k += 1;
        return true;
    }
    
    function enroll_voter(uint public_key, uint public_key_inv) public returns (bool success){
        require(round == 0 && ((block.timestamp - now_time) < term_time));
        voters[n].voter_address = msg.sender;
        voters[n].public_key = public_key;
        voters[n].public_key_inv = public_key_inv;
        voters[n].voted = false;
        voters[n].additional_voted = false;
        voters[n].participant = true;
        voter_number[msg.sender] = n;
        n += 1;
        return true;
    }
    
    function additional_vote(uint voting_value) public returns (bool success){
        require(round == 3);
        require(voters[voter_number[msg.sender]].voted && voters[voter_number[msg.sender]].participant && voters[voter_number[msg.sender]].additional_voted);
        tally_value *= voting_value;
        tally_value %= q;
        voters[voter_number[msg.sender]].additional_voted = true;
        add_vote_num += 1;
        if(add_vote_num == vote_num){
            all_add_vote = true;
        }
        return true;
    }
        
    function vote(uint voting_value) public returns (bool success){
        require(round == 1 && ((block.timestamp - now_time) < term_time));
        require(!voters[voter_number[msg.sender]].voted && voters[voter_number[msg.sender]].participant);
        tally_value *= voting_value;
        tally_value %= q;
        voters[voter_number[msg.sender]].voted = true;
        vote_num +=1;
        if(vote_num == n){
            all_vote=true;
        }
        return true;
    }

    function tallying() public{
        require(round == 2 && tally_complete == false);
        uint votes = 0;
        uint max = 0;
        for(uint i=0; i<k;i++){
            votes = 0;
            while(tally_value % (primes[i] ** (votes + 1)) == 0){
                votes = votes + 1;
            }
            if (votes > max){
                winner = i;
                max = votes;
            }
            candidates[i].votes = votes;
        }
        tally_complete = true;
    }
    
    function get_winner() public view returns(uint win){
        require(tally_complete);
        return winner;
    }
    
    function get_k() public view returns (uint _k){
        return k;
    }
    
    function get_n() public view returns (uint _n){
        return n;
    }

    function get_vote_num() public view returns (uint){
        return voter_number[msg.sender];
    }
    
    function get_candidate(uint num) public view returns (string name, uint value){
        if(tally_complete == false){
            return (candidates[num].name, candidates[num].value);
        }
        else{
            return (candidates[num].name, candidates[num].votes);
        }
    }
    
    function get_voter(uint num) public view returns (uint pub_key, uint pub_key_inv, bool voted){
        return (voters[num].public_key, voters[num].public_key_inv, voters[num].voted);
    }

    function get_pqg() public view returns (uint _p, uint _q, uint _g){
        return (p,q,g);
    }
    
}
