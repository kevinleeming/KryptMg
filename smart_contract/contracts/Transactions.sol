// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Transactions {
    uint256 transactionCounter;
    uint public postCount = 0;
    mapping(uint => Post) public post;

    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    struct Post {
        bool isImage;
        uint id;
        string hash;
        string title;
        string description;
        string category;
        uint tipAmount;
        address payable author;
    }

    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);
    event PostCreated(bool isImage, uint id, string hash, string title, string description, string category, uint tipAmount, address payable author);

    TransferStruct[] transactions;

    // Transfer Ether part
    function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public {
        transactionCounter += 1;
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    function getAllTransactions() public view returns(TransferStruct[] memory) {
        return transactions;
    }

    function getTransactionCount() public view returns(uint256) {
        return transactionCounter;
    }

    // Create posts
    function createPost(string memory _postHash, string memory _title, string memory _description, string memory _category, bool isImage) public {
        require(bytes(_postHash).length > 0);
        require(bytes(_description).length > 0);
        require(msg.sender != address(0x0));

        postCount++;
        post[postCount] = Post(isImage, postCount, _postHash, _title, _description, _category, 0, payable(msg.sender));
        emit PostCreated(isImage, postCount, _postHash, _title, _description, _category, 0, payable(msg.sender));
    }

    // Tip posts
    // function tipPostOwner(uint _id) public payable {
    //     require(_id > 0 && _id <= postCount);
        
    //     Post memory _post = post[_id]; // Fetch post
    //     address payable _author = _post.author; // Fetch author
    //     payable(address(_author)).transfer(msg.value); // Pay the author by sending them Ether
        

    // }
}