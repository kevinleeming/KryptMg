// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Advertising {
    uint public adCount = 0;
    mapping(uint => Advertisement) public Advertise;
    

    struct Advertisement {
        string Url;
        string Merchant;
        string Author;
        uint Date;
    }


   
    event adCreated(string url, string merchant, string author, uint date);

    // Create posts
    function createAd (string memory _url, string memory _merchant, string memory _author, uint _date) public {
        require(bytes(_url).length > 0);
        require(msg.sender != address(0x0));

        adCount++;
        Advertise[adCount] = Advertisement(_url, _merchant, _author, _date);
        emit adCreated(_url, _merchant, _author, _date);
    }

    
}