pragma solidity ^0.4.17;

contract Resume {
    // solidity enums start at 0
    address public manager;
    address[] public users;

    mapping (address => bool) private Collaborators;
    mapping (address => string) private Names; // full name of the applicant
    mapping (address => string) private Descriptions; // brief description of the applicant
    mapping (address => string) private Positions; // current job held by applicant
    mapping (address => string) private Addresses; // full home address
    mapping (address => string) private PhoneNumbers; // preferably mobile phone number
    mapping (address => string) private Emails; // email addresses
    mapping (address => uint256) private DatesOfBirth; // unix timestamps
    mapping (address => uint8) private Genders; // applicant's sex, 0: unspecified, 1: male, 2: female, 3: other
    mapping (address => bool) private ContractUsers; // keeps track of all users who have interacted with this contract

    constructor() public { manager = msg.sender; }

    function getUsers() public view returns (address[]) { return users; }

    modifier recordUser() {
        addContractUser(msg.sender);
        _;
    }

    function addCollaborator(address newCollaborator) public {
        address user = msg.sender;
        require(user == manager || isCollaborator(user));
        Collaborators[newCollaborator] = true;
    }
    function removeCollaborator(address _collaborator) public {
        address user = msg.sender;
        require(user == manager || (isCollaborator(user) && !isCollaborator(_collaborator)));
        Collaborators[_collaborator] = false;
    }
    function isCollaborator(address _collaborator) public view returns (bool) {
        return Collaborators[_collaborator];
    }

    function addContractUser(address sender) private {
        require(!isContractUser(sender));
        users.push(sender);
    }
    function isContractUser(address sender) private view returns (bool) {
        return ContractUsers[sender];
    }

    function setAddress(string _address) public recordUser { Addresses[msg.sender] = _address; }
    function getAddress(address sender) public view returns (string) { return Addresses[sender]; }

    function setDateOfBirth(uint256 timestamp) public recordUser { DatesOfBirth[msg.sender] = timestamp; }
    function getDateOfBirth(address sender) public view returns (uint256) { return DatesOfBirth[sender]; }

    function setDescription(string description) public recordUser { Descriptions[msg.sender] = description; }
    function getDescription(address sender) public view returns (string) { return Descriptions[sender]; }

    function setEmail(string email) public recordUser { Emails[msg.sender] = email; }
    function getEmail(address sender) public view returns (string) { return Emails[sender]; }

    function setGender(uint8 gender) public recordUser { Genders[msg.sender] = gender; }
    function getGender(address sender) public view returns (uint8) { return Genders[sender]; }

    function setName(string name) public recordUser { Names[msg.sender] = name; }
    function getName(address sender) public view returns (string) { return Names[sender]; }

    function setPhone(string phone) public recordUser { PhoneNumbers[msg.sender] = phone; }
    function getPhone(address sender) public view returns (string) { return PhoneNumbers[sender]; }

    function setPosition(string position) public recordUser { Positions[msg.sender] = position; }
    function getPosition(address sender) public view returns (string) { return Positions[sender]; }
}