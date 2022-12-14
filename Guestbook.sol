// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract Guestbook {

    //定義一個 struct 裡面會有文字、誰留言的、留言時間
    struct Item {
        string word;
        address who;
        uint when ;
    }

    //定義一個 陣列，儲存上面的 item
    Item[] private allWords;

    function save(string memory s, uint t) public {
        allWords.push(Item({
            word: s,
            who: msg.sender,
            when: t
        }));
    }

    //查詢陣列長度
    function getSize() public view returns (uint){
        return allWords.length;
    }

    //查詢留言板內的內容
    function queryGusetbook(uint index) public view returns (string memory, address, uint) {
        //如果長度為0 則直接回傳
        if(allWords.length==0){
            return ("", msg.sender, 0);
        }else{
            Item storage result = allWords[index];
            return (result.word, result.who, result.when);
        }
    }
}