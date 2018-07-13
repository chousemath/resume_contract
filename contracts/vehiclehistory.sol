pragma solidity ^0.4.24;

contract VehicleHistory {
    struct Multihash {
        bytes32 digest;
        uint8 hashFunction;
        uint8 size;
    }
    struct AccidentReport {
        address author; // address of the report creator
        uint256 timestamp; // unix timestamp (in seconds) of when this accident report was made
        uint16 accidentType;
    }
    struct MaintenanceReport {
        address author;
        uint256 timestamp;
        Multihash document;
    }

    // map a vehicle address to an array of accident reports
    mapping (address => AccidentReport[]) AccidentReports;

    address manager;

    constructor() {
        manager = msg.sender;
    }
}