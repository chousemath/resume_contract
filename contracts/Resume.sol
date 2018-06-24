pragma solidity ^0.4.17;

contract Resume {
    // solidity enums start at 0
    enum Genders { Unspecified, Male, Female, Other }
    string public uuid; // could be social security number, once set, cannot be changed
    string public ownerName; // government-issued name
    string public introduction; // quick introduction of who this person is
    string public currentJob;
    string public currentAddress;
    string public currentPhone;
    string public currentEmail;
    uint public birthYear; // can be unsigned integer
    uint public birthMonth;
    uint public birthDay;
    Genders public gender;

    constructor(
        string _uuid,
        string _ownerName,
        string _introduction,
        string _currentJob,
        string _currentAddress,
        string _currentPhone,
        string _currentEmail,
        uint _birthYear,
        uint _birthMonth,
        uint _birthDay,
        Genders _gender
    ) public {
        uuid = _uuid;
        ownerName = _ownerName;
        introduction = _introduction;
        currentJob = _currentJob;
        currentAddress = _currentAddress;
        currentPhone = _currentPhone;
        currentEmail = _currentEmail;
        birthYear = _birthYear;
        birthMonth = _birthMonth;
        birthDay = _birthDay;

        int genderInt = int(_gender);
        gender = (genderInt < 0 || genderInt > 3) ? Genders.Unspecified : _gender;
    }

    function setCurrentAddress(string newAddress) public {
        currentAddress = newAddress;
    }

    function setCurrentEmail(string newEmail) public {
        currentEmail = newEmail;
    }

    function setCurrentJob(string newJob) public {
        currentJob = newJob;
    }

    function setCurrentPhone(string newPhone) public {
        currentPhone = newPhone;
    }

    function setGender(Genders newGender) public {
        gender = newGender;
    }

    function setIntroduction(string newIntroduction) public {
        introduction = newIntroduction;
    }

    function setOwnerName(string newOwnerName) public {
        ownerName = newOwnerName;
    }
}