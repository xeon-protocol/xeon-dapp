// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "openzeppelin/contracts/token/ERC20/ERC20.sol";
import "openzeppelin/contracts/access/AccessControl.sol";

contract MockERC20 is ERC20, AccessControl {
    uint8 private _decimals;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(string memory name, string memory symbol, uint8 decimals_, uint256 initialSupply, address admin)
        ERC20(name, symbol)
    {
        _decimals = decimals_;
        _mint(msg.sender, initialSupply);
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    function mint(address to, uint256 amount) external {
        require(hasRole(MINTER_ROLE, msg.sender), "MockERC20: must have minter role to mint");
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}

contract MockERC20Factory is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    event NewTokenDeployed(address indexed token, string name, string symbol, uint8 decimals, uint256 initialSupply);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function addAdmin(address admin) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "MockERC20Factory: must have default admin role to add admin");
        grantRole(ADMIN_ROLE, admin);
    }

    function removeAdmin(address admin) external {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "MockERC20Factory: must have default admin role to remove admin"
        );
        revokeRole(ADMIN_ROLE, admin);
    }

    function deploy(string memory name, string memory symbol, uint8 decimals, uint256 initialSupply)
        external
        returns (address)
    {
        require(hasRole(ADMIN_ROLE, msg.sender), "MockERC20Factory: must have admin role to deploy token");
        MockERC20 token = new MockERC20(name, symbol, decimals, initialSupply, msg.sender);
        emit NewTokenDeployed(address(token), name, symbol, decimals, initialSupply);
        return address(token);
    }
}
