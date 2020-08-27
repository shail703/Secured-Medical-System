pragma solidity ^0.5.0;

contract Medical {
    string public pat_name;
    uint public patCount = 0;
    mapping(uint => Details) public patient;

    struct Details {
        uint id;
        string pat_name;
        string medi_name;
        uint price;
        address payable owner;
        bool purchased;
    }
    event medicineAdded(
        uint id,
        string pat_name,
        string medi_name,
        uint price,
        address payable owner,
        bool purchased
    );
    event medicinePurchased(
    uint id,
    string pat_name,
    string medi_name,
    uint price,
    address payable owner,
    bool purchased
);

    constructor() public {
        pat_name = "Secured Medical System";
    }
function addMedicine(string memory _name,string memory _medi, uint _price) public {
    // Require a valid name
    require(bytes(_name).length > 0);
    require(bytes(_medi).length > 0);
    // Require a valid price
    require(_price > 0); 
    // Increment product count
    patCount ++;
    // Create the product
    patient[patCount] = Details(patCount, _name, _medi, _price, msg.sender, false);
    // Trigger an event
    emit medicineAdded(patCount, _name, _medi, _price, msg.sender, false);
}
function purchaseMedicine(uint _id) public payable {
    // Fetch the product
    Details memory _pat = patient[_id];
    // Fetch the owner
    address payable _pharm = _pat.owner;
    // Make sure the product has a valid id  
    require(_pat.id > 0 && _pat.id <= patCount);
    // Require that there is enough Ether in the transaction
    require(msg.value >= _pat.price);
    // Require that the product has not been purchased already
    require(!_pat.purchased);
    // Require that the buyer is not the seller
    require(_pharm != msg.sender);
    // Transfer ownership to the buyer
    _pat.owner = msg.sender;
    // Mark as purchased
    _pat.purchased = true;
    // Update the product
    patient[_id] = _pat;
    // Pay the seller by sending them Ether
    address(_pharm).transfer(msg.value);
    // Trigger an event
    emit medicinePurchased(patCount, _pat.pat_name, _pat.medi_name, _pat.price, msg.sender, true);
}
} 
