pragma solidity ^0.4.17;

contract Resume {
    struct Document {
        string title;
        string description;
        address document;
    }
    struct Experience {
        string companyName; // official name of the company
        string companyAddress; // official address of the company
        string position; // the position the applicant held
        uint256 startDate; // when this job began
        uint256 endDate; // when this job ended
        Document document; // IPFS document related to this experience
    }

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
    mapping (address => address) private ProfileImages; // applicant's profile image (stored on IPFS), should they choose to upload it

    constructor() public { manager = msg.sender; }

    function getUsers() public view returns (address[]) { return users; }

    // make sure that whenever a user update his or her own record, to add that user
    // to the total list of users
    modifier recordUser() {
        addContractUser(msg.sender);
        _;
    }

    // a collaborator basically has near-admin capabilities, this should let the
    // Korean government expand the team of people working on this blockchain
    // to any arbitrary size
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

    // Keep a running list of all applicants who have submitted their personal data
    // to the blockchain
    function addContractUser(address sender) private {
        require(!isContractUser(sender));
        users.push(sender);
    }
    function isContractUser(address sender) private view returns (bool) {
        return ContractUsers[sender];
    }

    // The following functions are to be used mostly by regular citizen who
    // want to update their profile

    // set and retrieve the current home address for the applicant
    function setAddress(string _address) public recordUser { Addresses[msg.sender] = _address; }
    function getAddress(address sender) public view returns (string) { return Addresses[sender]; }

    // set and retrieve the date of birth for the applicant
    function setDateOfBirth(uint256 timestamp) public recordUser { DatesOfBirth[msg.sender] = timestamp; }
    function getDateOfBirth(address sender) public view returns (uint256) { return DatesOfBirth[sender]; }

    // set and retrieve the short description for the applicant
    function setDescription(string description) public recordUser { Descriptions[msg.sender] = description; }
    function getDescription(address sender) public view returns (string) { return Descriptions[sender]; }

    // set and retrieve the email address of the applicant
    function setEmail(string email) public recordUser { Emails[msg.sender] = email; }
    function getEmail(address sender) public view returns (string) { return Emails[sender]; }

    // set and retrieve the gender of the applicant
    function setGender(uint8 gender) public recordUser { Genders[msg.sender] = gender; }
    function getGender(address sender) public view returns (uint8) { return Genders[sender]; }

    // set and retrieve the full name of the applicant
    function setName(string name) public recordUser { Names[msg.sender] = name; }
    function getName(address sender) public view returns (string) { return Names[sender]; }

    // set and retrieve the phone number of the applicant
    function setPhone(string phone) public recordUser { PhoneNumbers[msg.sender] = phone; }
    function getPhone(address sender) public view returns (string) { return PhoneNumbers[sender]; }

    // set and retrieve the current position (job title) of the applicant
    function setPosition(string position) public recordUser { Positions[msg.sender] = position; }
    function getPosition(address sender) public view returns (string) { return Positions[sender]; }
}