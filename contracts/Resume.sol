pragma solidity ^0.4.17;

contract Resume {
    string public owner;
    string public introduction;
    string public currentJob;
    uint public birthYear; // can be unsigned integer
    uint public birthMonth;
    uint public birthDay;

    constructor(
        string initialOwner,
        string initialIntroduction,
        string initialCurrentJob,
        uint finalBirthYear,
        uint finalBirthMonth,
        uint finalBirthDay
    ) public {
        owner = initialOwner;
        introduction = initialIntroduction;
        currentJob = initialCurrentJob;
        birthYear = finalBirthYear;
        birthMonth = finalBirthMonth;
        birthDay = finalBirthDay;
    }

    function setIntroduction(string newIntroduction) public {
        introduction = newIntroduction;
    }

    function setCurrentJob(string newJob) public {
        currentJob = newJob;
    }
}