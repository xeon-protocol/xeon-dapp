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
        _mint(admin, initialSupply);
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

    struct TokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        uint8 decimals;
        uint256 totalSupply;
    }

    event NewTokenDeployed(address indexed token, string name, string symbol, uint8 decimals, uint256 initialSupply);

    address[] public admins;
    TokenInfo[] public tokens;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        admins.push(msg.sender);
    }

    function addAdmin(address admin) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "MockERC20Factory: must have default admin role to add admin");
        grantRole(ADMIN_ROLE, admin);
        admins.push(admin);
    }

    function removeAdmin(address admin) external {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "MockERC20Factory: must have default admin role to remove admin"
        );
        revokeRole(ADMIN_ROLE, admin);

        // Remove admin from the admins array
        for (uint256 i = 0; i < admins.length; i++) {
            if (admins[i] == admin) {
                admins[i] = admins[admins.length - 1];
                admins.pop();
                break;
            }
        }
    }

    function deploy(string memory name, string memory symbol, uint8 decimals, uint256 initialSupply)
        external
        returns (address)
    {
        require(hasRole(ADMIN_ROLE, msg.sender), "MockERC20Factory: must have admin role to deploy token");
        MockERC20 token = new MockERC20(name, symbol, decimals, initialSupply, msg.sender);
        tokens.push(
            TokenInfo({
                tokenAddress: address(token),
                name: name,
                symbol: symbol,
                decimals: decimals,
                totalSupply: initialSupply
            })
        );
        emit NewTokenDeployed(address(token), name, symbol, decimals, initialSupply);
        return address(token);
    }

    function grantMinterRole(address token, address account) external {
        require(hasRole(ADMIN_ROLE, msg.sender), "MockERC20Factory: must have admin role to grant minter role");
        MockERC20(token).grantRole(MockERC20(token).MINTER_ROLE(), account);
    }

    /**
     * @notice return list of admin addresses
     */
    function getAdmins() external view returns (address[] memory) {
        return admins;
    }

    /**
     * @notice return list of deployed tokens with their details
     */
    function getTokens() external view returns (TokenInfo[] memory) {
        return tokens;
    }

    function getTotalSupply(address tokenAddress) external view returns (uint256) {
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i].tokenAddress == tokenAddress) {
                return ERC20(tokenAddress).totalSupply();
            }
        }
        revert("Token not found");
    }

    /**
     * @notice returns list of addresses holding a specific token
     */
    function getTokenHolders(address tokenAddress) external view returns (address[] memory) {
        uint256 count = 0;
        uint256 index = 0;

        // Count the number of holders
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i].tokenAddress == tokenAddress) {
                count++;
            }
        }

        address[] memory holders = new address[](count);

        // Collect the holders' addresses
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i].tokenAddress == tokenAddress) {
                holders[index] = tokens[i].tokenAddress;
                index++;
            }
        }
        return holders;
    }
}
