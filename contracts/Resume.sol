pragma solidity ^0.4.17;

contract Resume {
    string public owner;
    string public introduction;
    string public currentJob;
    string public currentAddress;
    string public currentPhone;
    string public currentEmail;
    uint public birthYear; // can be unsigned integer
    uint public birthMonth;
    uint public birthDay;

    constructor(
        string _owner,
        string _introduction,
        string _currentJob,
        string _currentAddress,
        string _currentPhone,
        string _currentEmail,
        uint _birthYear,
        uint _birthMonth,
        uint _birthDay
    ) public {
        owner = _owner;
        introduction = _introduction;
        currentJob = _currentJob;
        currentAddress = _currentAddress;
        currentPhone = _currentPhone;
        currentEmail = _currentEmail;
        birthYear = _birthYear;
        birthMonth = _birthMonth;
        birthDay = _birthDay;
    }

    function setCurrentAddress(string newAddress) public {
        currentAddress = newAddress;
    }

    function setCurrentJob(string newJob) public {
        currentJob = newJob;
    }

    function setIntroduction(string newIntroduction) public {
        introduction = newIntroduction;
    }
}