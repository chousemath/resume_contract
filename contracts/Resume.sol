pragma solidity ^0.4.24;

/**
 * @title ResumeDapp
 * @author Joseph Sungpil Choi
 * @dev Provides a system for users to upload their professional profile in a standardized,
 * immutable way on the Ethereum blockchain
 */

contract Resume {
    struct Multihash {
        bytes32 digest;
        uint8 hashFunction;
        uint8 size;
    }
    struct Document {
        bytes32 title;
        Multihash document;
    }
    struct Experience {
        bytes32 companyName; // official name of the company
        bytes32 position; // the position the applicant held
        uint256 startDate; // when this job began
        uint256 endDate; // when this job ended
    }
    struct Organization {
        bytes32 name; // official name of the organization
        bytes32 latitude; // bytes32 encoded latitude numeric value
        bytes32 longitude; // bytes32 encoded longitude numeric value
    }

    address public manager;
    address[] public users;

    // A collaborator is anyone who has been designated by the manager
    // to be able to review the profile of an applicant
    // Collaborators have the ability to add other collaborators
    mapping (address => bool) private Collaborators;
    mapping (address => bool) private Participants;
    mapping (address => bytes32) private Names; // full name of the applicant
    mapping (address => bytes32) private Positions; // current job held by applicant

    mapping (address => bytes32) private AddressStreets; // full home street address
    mapping (address => uint32) private AddressCities; // full home city (use integer code of city, 0: Seoul)
    mapping (address => uint32) private AddressRegions; // full home state/region (use integer code of region, 0: 서초구)
    mapping (address => uint32) private AddressZipcodes; // full home zipcode

    mapping (address => bytes32) private PhoneNumbers; // preferably mobile phone number
    mapping (address => bytes32) private Emails; // email addresses
    mapping (address => uint256) private DatesOfBirth; // unix timestamps in seconds
    mapping (address => uint256) private ConfirmationDates; // timestamp (in seconds) of when gov agent last confirmed applicant
    mapping (address => uint8) private Genders; // applicant's sex, 0: unspecified, 1: male, 2: female, 3: other
    mapping (address => uint256) private UpdateDates; // unix timestamps in seconds of when the user last update his/her profile    
    mapping (address => Multihash) private ProfileImages; // applicant's profile image (stored on IPFS), should they choose to upload it
    
    mapping (address => Document[]) private Documents; // documents that the applicant wants to share
    mapping (address => uint16) private DocumentCounts; // number of documents each user has uploaded
    mapping (address => Experience[]) private Experiences;
    mapping (address => uint16) private ExperienceCounts; // number of experiences each user has uploaded
    
    mapping (address => Organization[]) private Organizations;
    mapping (address => uint16) private OrganizationCounts;

    constructor() public { manager = msg.sender; }

    function getUsers() public view returns (address[]) { return users; }

    // make sure that whenever a user update his or her own record, to add that user
    // to the total list of users
    // Keep a running list of all applicants who have submitted their personal data
    // to the blockchain
    modifier recordUser() {
        UpdateDates[msg.sender] = now;
        if (!Participants[msg.sender]) {
            Participants[msg.sender] = true;
            users.push(msg.sender);
        }
        _;
    }

    modifier authorized() {
        require(msg.sender == manager || isCollaborator(msg.sender));
        _;
    }

    function getUpdateDate(address sender) public view returns(uint256) {
        return UpdateDates[sender];
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

    // Allows managers and collaborators to mark when they have confirmed that an applicant's
    // self-created profile has been validated (by some government agency or organization)
    function setConfirmationDate(address applicant) public authorized { ConfirmationDates[applicant] = now; }
    function getConfirmationDate(address applicant) public view returns (uint256) { return ConfirmationDates[applicant]; }

    // The following functions are to be used mostly by regular citizen who
    // want to update their profile

    // set and retrieve the current home street for the applicant
    function setAddressStreet(bytes32 _address) public recordUser { AddressStreets[msg.sender] = _address; }
    function getAddressStreet(address sender) public view returns (bytes32) { return AddressStreets[sender]; }
    function deleteAddressStreet() public { delete AddressStreets[msg.sender]; }

    // set and retrieve the current home city for the applicant
    function setAddressCity(uint32 _address) public recordUser { AddressCities[msg.sender] = _address; }
    function getAddressCity(address sender) public view returns (uint32) { return AddressCities[sender]; }
    function deleteAddressCity() public { delete AddressCities[msg.sender]; }

    // set and retrieve the current home region/state for the applicant
    function setAddressRegion(uint32 _address) public recordUser { AddressRegions[msg.sender] = _address; }
    function getAddressRegion(address sender) public view returns (uint32) { return AddressRegions[sender]; }
    function deleteAddressRegion() public { delete AddressRegions[msg.sender]; }

    // set and retrieve the current home zipcode for the applicant
    function setAddressZipcode(uint32 _address) public recordUser { AddressZipcodes[msg.sender] = _address; }
    function getAddressZipcode(address sender) public view returns (uint32) { return AddressZipcodes[sender]; }
    function deleteAddressZipcode() public { delete AddressZipcodes[msg.sender]; }


    // set and retrieve the date of birth for the applicant
    function setDateOfBirth(uint256 timestamp) public recordUser { DatesOfBirth[msg.sender] = timestamp; }
    function getDateOfBirth(address sender) public view returns (uint256) { return DatesOfBirth[sender]; }
    function deleteDateOfBirth() public { delete DatesOfBirth[msg.sender]; }

    // set and retrieve the email address of the applicant
    function setEmail(bytes32 email) public recordUser { Emails[msg.sender] = email; }
    function getEmail(address sender) public view returns (bytes32) { return Emails[sender]; }
    function deleteEmail() public { delete Emails[msg.sender]; }

    // set and retrieve the gender of the applicant
    function setGender(uint8 gender) public recordUser { Genders[msg.sender] = gender; }
    function getGender(address sender) public view returns (uint8) { return Genders[sender]; }
    function deleteGender() public { delete Genders[msg.sender]; }

    // set and retrieve the full name of the applicant
    function setName(bytes32 name) public recordUser { Names[msg.sender] = name; }
    function getName(address sender) public view returns (bytes32) { return Names[sender]; }
    function deleteName() public { delete Names[msg.sender]; }

    // set and retrieve the phone number of the applicant
    function setPhone(bytes32 phone) public recordUser { PhoneNumbers[msg.sender] = phone; }
    function getPhone(address sender) public view returns (bytes32) { return PhoneNumbers[sender]; }
    function deletePhone() public { delete PhoneNumbers[msg.sender]; }

    // set and retrieve the current position (job title) of the applicant
    function setPosition(bytes32 position) public recordUser { Positions[msg.sender] = position; }
    function getPosition(address sender) public view returns (bytes32) { return Positions[sender]; }
    function deletePosition() public { delete Positions[msg.sender]; }

    // set and retrieve the current profile image of the applicant
    function setProfileImage(bytes32 _digest, uint8 _hashFunction, uint8 _size) public recordUser {
        ProfileImages[msg.sender] = Multihash({digest: _digest, hashFunction: _hashFunction, size: _size});
    }
    function getProfileImage(address sender) public view returns (bytes32 digest, uint8 hashFunction, uint8 size) {
        Multihash storage ipfsHash = ProfileImages[sender];
        return (ipfsHash.digest, ipfsHash.hashFunction, ipfsHash.size);
    }
    function deleteProfileImage() public {
        require(ProfileImages[msg.sender].digest != 0);
        delete ProfileImages[msg.sender];
    }

    // set, retrieve, and delete documents for the applicant
    function addDocument(bytes32 title, bytes32 _digest, uint8 _hashFunction, uint8 _size) public recordUser {
        Documents[msg.sender].push(Document({
            title: title,
            document: Multihash({digest: _digest, hashFunction: _hashFunction, size: _size})
        }));
        DocumentCounts[msg.sender]++;
    }
    function getDocument(address sender, uint16 index) public view returns(bytes32 title, bytes32 digest, uint8 hashFunction, uint8 size) {
        Document storage doc = Documents[sender][index];
        return (doc.title, doc.document.digest, doc.document.hashFunction, doc.document.size);
    }
    function deleteDocument(uint16 index) public recordUser {
        require(Documents[msg.sender][index].document.digest != 0);
        delete Documents[msg.sender][index];
    }
    function getDocumentCount(address sender) public view returns(uint16) {
        return DocumentCounts[sender];
    }

    function addExperience(bytes32 companyName, bytes32 position, uint256 startDate, uint256 endDate) public recordUser {
        Experiences[msg.sender].push(Experience({
            companyName: companyName,
            position: position,
            startDate: startDate,
            endDate: endDate
        }));
        ExperienceCounts[msg.sender]++;
    }
    function getExperience(address sender, uint16 index) public view returns(
        bytes32 companyName,
        bytes32 position,
        uint256 startDate,
        uint256 endDate
    ) {
        Experience storage exp = Experiences[sender][index];
        return (exp.companyName, exp.position, exp.startDate, exp.endDate);
    }
    function deleteExperience(uint16 index) public {
        require(Experiences[msg.sender][index].startDate != 0);
        delete Experiences[msg.sender][index];
    }
    function getExperienceCount(address sender) public view returns(uint16) {
        return ExperienceCounts[sender];
    }

    function addOrganization(bytes32 name, bytes32 latitude, bytes32 longitude) public {
        Organizations[msg.sender].push(Organization({
            name: name, latitude: latitude, longitude: longitude
        }));
        OrganizationCounts[msg.sender]++;
    }
    function getOrganization(address sender, uint16 index) public view returns(
        bytes32 name,
        bytes32 latitude,
        bytes32 longitude
    ) {
        Organization storage org = Organizations[sender][index];
        return (org.name, org.latitude, org.longitude);
    }
    function deleteOrganization(uint16 index) public {
        delete Organizations[msg.sender][index];
    }
    function getOrganizationCount(address sender) public view returns(uint16) {
        return OrganizationCounts[sender];
    }
}