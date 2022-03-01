// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Transactions {
    uint256 transactionCounter;
    // post
    uint public postCount = 0;
    mapping(uint => Post) public post;
    // tips
    uint256 public tipsCount = 0;
    TipsTransaction[] public tipTx;
    // user
    mapping(address => User) user;
    uint public userCount = 0;

    struct TransferStruct {
        address sender;
        address receiver;
        uint amount; // (Wei)
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
        uint tipAmount; // (Wei)
        address payable author;
        string authorGmailName;
        string authorEmail;
        string authorPic;
    }

    struct User {
        address[] followers;
        address[] subscribes;
        bool isUsed;
    }

    struct SubscribeEvent {
        bool subscribe;
        address author;
        address subscriber;
        uint256 timestamp;
    }

    struct TipsTransaction {
        address tipper;
        address author;
        uint amount; // (Wei)
        uint postId;
        uint256 timestamp;
    }

    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);
    event PostCreated(bool isImage, uint id, string hash, string title, string description, string category, uint tipAmount, address payable author, string authorGmailName, string authorEmail, string authorPic);
    event Tips(address tipper, address author, uint amount, uint postId, uint256 timestamp);
    event UserCreated(address[] followers, address[] subscribes, bool isUsed);
    event Subscribes(bool subscribe, address author, address subscriber, uint256 timestamp);

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
    function createPost(string memory _postHash, string memory _title, string memory _description, string memory _category, bool isImage, string memory _authorGmailName, string memory _authorEmail, string memory _authorPic) public {
        require(bytes(_postHash).length > 0);
        require(bytes(_description).length > 0);
        require(msg.sender != address(0x0));

        postCount++;
        post[postCount] = Post(isImage, postCount, _postHash, _title, _description, _category, 0, payable(msg.sender), _authorGmailName, _authorEmail, _authorPic);
        emit PostCreated(isImage, postCount, _postHash, _title, _description, _category, 0, payable(msg.sender), _authorGmailName, _authorEmail, _authorPic);
    }

    // Tip posts record
    function tipPostRecord(address payable author, uint amount, uint postId) public {
        require(postId > 0 && postId <= postCount);

        tipsCount++;
        Post memory _post = post[postId]; // Fetch post
        _post.tipAmount = _post.tipAmount + amount; // Increment this post tipAmount (Wei)
        post[postId] = _post;

        tipTx.push(TipsTransaction(msg.sender, author, amount, postId, block.timestamp));

        emit Tips(msg.sender, author, amount, postId, block.timestamp);
    }
}