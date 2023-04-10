pragma solidity ^0.8.0;

contract IdentityManagement {
    struct Identity {
        string name;
        string email;
        string phoneNumber;
        uint256 createdAt;
        bool verified;
        bool hasGovCertificate;
        bool govCertificateVerified;
        string govCertificateCID;
        string currentPicCID;
        Document[] AllDocuments;
        string physicalAddress;
    }

    struct Document {
        string documentCID;
        string documentName;
        uint256 validityUpTo;
        bool verified;
        address identityAddress;
    }

    mapping(address => Identity) public identities;
    mapping(string => bool) public verifiedCertificates;
    mapping(string => bool) public verifiedDocuments;
    mapping(string => Document) public documents;

    address public admin;
    address[] public identityAddresses;
    Document[] public allDocumentsforAdmin;

    constructor() {
        admin = msg.sender;
        Identity storage newIdentity = identities[msg.sender];
        newIdentity.name = "Admin";
        newIdentity.email = "admin@gmail.com";
        newIdentity.phoneNumber = "1234567890";
        newIdentity.physicalAddress = "Admin Address";
        newIdentity.createdAt = block.timestamp;
        newIdentity.verified = true;
        newIdentity.hasGovCertificate = true;
        newIdentity.govCertificateVerified = true;
        newIdentity.govCertificateCID = "";
        newIdentity.currentPicCID = "";
        identityAddresses.push(msg.sender);
    }

    function createIdentity(
        string memory name,
        string memory email,
        string memory phoneNumber,
        string memory physicalAddress,
        string memory govCertificateCID,
        string memory currentPicCID,
        bool verified
    ) public {
        require(
            identities[msg.sender].createdAt == 0,
            "Identity already exists."
        );
        Identity storage newIdentity = identities[msg.sender];
        newIdentity.name = name;
        newIdentity.email = email;
        newIdentity.phoneNumber = phoneNumber;
        newIdentity.physicalAddress = physicalAddress;
        newIdentity.createdAt = block.timestamp;
        newIdentity.verified = verified;
        newIdentity.hasGovCertificate = true;
        newIdentity.govCertificateVerified = true;
        newIdentity.govCertificateCID = govCertificateCID;
        newIdentity.currentPicCID = currentPicCID;
        identityAddresses.push(msg.sender);

        if (keccak256(abi.encodePacked(govCertificateCID)) != keccak256("")) {
            newIdentity.hasGovCertificate = true;
        }

        if (verifiedCertificates[govCertificateCID] == true) {
            newIdentity.govCertificateVerified = true;
            newIdentity.verified = true;
        }

        for (uint256 i = 0; i < identityAddresses.length; i++) {
            Identity storage identity = identities[identityAddresses[i]];
            if (identity.verified == true) {
                for (uint256 j = 0; j < identity.AllDocuments.length; j++) {
                    if (
                        keccak256(
                            abi.encodePacked(
                                identity.AllDocuments[j].documentCID
                            )
                        ) == keccak256(abi.encodePacked(govCertificateCID))
                    ) {
                        newIdentity.govCertificateVerified = true;
                        newIdentity.verified = true;
                        break;
                    }
                }
            }
        }

        for (uint256 i = 0; i < identityAddresses.length; i++) {
            Identity storage identity = identities[identityAddresses[i]];
            if (identity.verified == true) {
                for (uint256 j = 0; j < identity.AllDocuments.length; j++) {
                    if (
                        keccak256(
                            abi.encodePacked(
                                identity.AllDocuments[j].documentCID
                            )
                        ) == keccak256(abi.encodePacked(govCertificateCID))
                    ) {
                        identity.AllDocuments[j].verified = true;
                        break;
                    }
                }
            }
        }

        if (verifiedCertificates[govCertificateCID] == true) {
            newIdentity.govCertificateVerified = true;
            newIdentity.verified = true;
        }
    }

    function verifyGovCertificate(string memory govCertificateCID) public {
        require(
            msg.sender == admin,
            "Only admin can verify government certificate."
        );
        require(
            verifiedCertificates[govCertificateCID] == false,
            "Government certificate already verified."
        );
        verifiedCertificates[govCertificateCID] = true;
        for (uint256 i = 0; i < identityAddresses.length; i++) {
            Identity storage identity = identities[identityAddresses[i]];
            if (
                keccak256(abi.encodePacked(identity.govCertificateCID)) ==
                keccak256(abi.encodePacked(govCertificateCID))
            ) {
                identity.govCertificateVerified = true;
                identity.verified = true;
                break;
            }
        }
    }

    function rejectUser(address identityAddress) public {
        require(msg.sender == admin, "Only admin can reject identity.");
        for (uint256 i = 0; i < identityAddresses.length; i++) {
            if (identityAddresses[i] == identityAddress) {
                identityAddresses[i] = identityAddresses[
                    identityAddresses.length - 1
                ];
                identityAddresses.pop();
                break;
            }
        }
    }

    function uploadDocument(
        string memory documentCID,
        string memory documentName
    ) public {
        Identity storage identity = identities[msg.sender];
        require(
            identity.verified == true &&
                identity.govCertificateVerified == true,
            "Identity not verified."
        );
        Document memory newDocument;
        newDocument.documentCID = documentCID;
        newDocument.documentName = documentName;
        newDocument.validityUpTo = block.timestamp + 31536000;
        newDocument.verified = false;
        newDocument.identityAddress = msg.sender;
        identity.AllDocuments.push(newDocument);

        verifiedDocuments[documentCID] = false;

        documents[documentCID] = newDocument;
        allDocumentsforAdmin.push(newDocument);
    }

    function verifyDocument(string memory documentCID) public returns (bool) {
        require(msg.sender == admin, "Only admin can verify document.");
        require(
            verifiedDocuments[documentCID] == false,
            "Document already verified."
        );
        verifiedDocuments[documentCID] = true;
        for (uint256 i = 0; i < identityAddresses.length; i++) {
            Identity storage identity = identities[identityAddresses[i]];
            if (identity.verified == true) {
                for (uint256 j = 0; j < identity.AllDocuments.length; j++) {
                    if (
                        keccak256(
                            abi.encodePacked(
                                identity.AllDocuments[j].documentCID
                            )
                        ) == keccak256(abi.encodePacked(documentCID))
                    ) {
                        identity.AllDocuments[j].verified = true;

                        documents[documentCID].verified = true;

                        for (
                            uint256 k = 0;
                            k < allDocumentsforAdmin.length;
                            k++
                        ) {
                            if (
                                keccak256(
                                    abi.encodePacked(
                                        allDocumentsforAdmin[k].documentCID
                                    )
                                ) == keccak256(abi.encodePacked(documentCID))
                            ) {
                                allDocumentsforAdmin[k].verified = true;
                                break;
                            }
                        }
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function getDocumentCount() public view returns (uint256) {
        Identity storage identity = identities[msg.sender];
        require(identity.verified == true, "Identity not verified.");
        return identity.AllDocuments.length;
    }

    function getDocuments(
        address identityAddress
    ) public view returns (Document[] memory) {
        Identity storage identity = identities[identityAddress];
        require(identity.verified == true, "Identity not verified.");
        return identity.AllDocuments;
    }

    function getAllDocument() public view returns (Document[] memory) {
        require(
            msg.sender == admin,
            "Only admin can view unverified documents."
        );
        return allDocumentsforAdmin;
    }

    function getIdentity(
        address identityAddress
    ) public view returns (Identity memory) {
        return identities[identityAddress];
    }

    function getIdentities() public view returns (Identity[] memory) {
        require(msg.sender == admin, "Only admin can view all identities.");
        Identity[] memory allIdentities = new Identity[](
            identityAddresses.length
        );

        for (uint256 i = 0; i < identityAddresses.length; i++) {
            allIdentities[i] = identities[identityAddresses[i]];
        }

        return allIdentities;
    }

    //check if the address is registered
    function isRegistered(address identityAddress) public view returns (bool) {
        return identities[identityAddress].createdAt != 0;
    }

    function isAdmin() public view returns (bool) {
        return msg.sender == admin;
    }

    function isVerified(
        string memory documentCID
    ) public view returns (bool, Document memory, Identity memory) {
        Document memory document = documents[documentCID];
        Identity memory identity = identities[document.identityAddress];
        if (identity.verified == true && document.verified == true) {
            return (true, document, identity);
        } else {
            return (false, document, identity);
        }
    }
}
