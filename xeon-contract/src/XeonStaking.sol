// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract XeonStaking is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public stakingToken;
    uint256 public nextUnstakeTimestamp; // The day when stakers can unstake again.
    uint256 public totalEthRewards;    
    uint256 public totalEthLiquidityRewards;
    uint256 public totalEthCollateralRewards;
    uint256 public totalMiningRewards;
    uint256 public totalLiquidityRewards;
    uint256 public totalCollateralRewards;
    uint256 public totalClaimedRewards;
    uint256 public totalClaimedLiquidityRewards;
    uint256 public totalClaimedCollateralRewards;
    address[] public allStakerAddresses;
    bool public canUnstake;
    bool public emergencyUnstakeEnabled;


    struct Staker {
        uint256 amount;
        uint256 stakeStartTimestamp;
        uint256 lastClaimedTimestamp;
        uint256 miningRewards;
        uint256 liquidityRewards;
        uint256 collateralRewards;
    }

    mapping(address => Staker) public stakers;
    mapping(address => uint256) public lastRewardBasis;
    mapping(address => uint256) public lastLiquidityRewardBasis;
    mapping(address => uint256) public lastCollateralRewardBasis;
    mapping(address => uint256) public totalClaimedRewardsStaking;
    mapping(address => uint256) public totalClaimedCollateralRewardslateral;
    mapping(address => uint256) public totalClaimedLiquidityRewardsuidity;

    event Staked(address indexed staker, uint256 amount);
    event Unstaked(address indexed staker, uint256 amount);
    event TokensAssigned(address indexed staker, uint256 amountForMining, uint256 amountForLiquidity, uint256 amountForCollateral);
    event TokensUnassigned(address indexed staker, uint256 amountFromMining, uint256 amountFromLiquidity, uint256 amountFromCollateral);
    event RewardClaimed(address indexed staker, uint256 amount, uint indexed poolID);
    event RewardsDistributed(uint256 amount, uint indexed poolID);
    event EmergencyUnstakeSet(bool enabled);
    event EmergencyUnstaked(address indexed staker, uint256 amount);

    modifier stakingWindow() {
        require(block.timestamp >= nextUnstakeTimestamp
 && block.timestamp <= nextUnstakeTimestamp
 + 3 days, "Staking or assigning features suspended at the moment.");
        _;
    }

    constructor(address xeonToken) {
        require(xeonToken != address(0), "Invalid token address.");
        stakingToken = IERC20(xeonToken);
        nextUnstakeTimestamp = 0;
        totalEthRewards = 0;
        totalEthLiquidityRewards = 0;
        totalEthCollateralRewards = 0;
        totalMiningRewards = 0;
        totalLiquidityRewards = 0;
        totalCollateralRewards = 0;
        totalClaimedRewards = 0;
        totalClaimedLiquidityRewards = 0;
        totalClaimedCollateralRewards = 0;
    }

    function beginUnstakeWindow() external onlyOwner {
        require(block.timestamp >= nextUnstakeTimestamp - 30 days, "30-day staking period has not yet passed.");
        nextUnstakeTimestamp
 = block.timestamp; // 3 days for people to stake & assign stakes to pools
        canUnstake = true;
    }

    function restartPool() external stakingWindow onlyOwner {
        require(block.timestamp > nextUnstakeTimestamp + 3 days, "Cannot restart pool during the current unstake period.");
        nextUnstakeTimestamp = block.timestamp + 30 days; // Start a new 30-day staking period
        canUnstake = false;
    }

    function stake(uint256 _amount) external stakingWindow {
        require(_amount > 0, "Staked amount must be greater than zero.");

        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);

        Staker storage staker = stakers[msg.sender];

        // Update the staked amount
        staker.amount += _amount;

        // Update the staking time if it's the first time staking
        if (staker.stakeStartTimestamp == 0) {
            staker.stakeStartTimestamp = block.timestamp;

            // Initialize reward basis if it's the first time staking
            lastRewardBasis[msg.sender] = totalEthRewards;
            lastLiquidityRewardBasis[msg.sender] = totalEthLiquidityRewards;
            lastCollateralRewardBasis[msg.sender] = totalEthCollateralRewards;
        }

        emit Staked(msg.sender, _amount);
    }

    function unstake() external {
        require(canUnstake || emergencyUnstakeEnabled, "Unstaking is not allowed now.");
        Staker storage staker = stakers[msg.sender];
        require(staker.amount > 0, "You have no staked tokens.");

        uint256 amountToUnstake = staker.amount;
        uint256 totalAssignedAmount = staker.miningRewards + staker.liquidityRewards + staker.collateralRewards;

        if (totalAssignedAmount > 0) {
            // Calculate the portion of the unstaked amount that was assigned
            uint256 assignedMining = (staker.miningRewards * amountToUnstake) / totalAssignedAmount;
            uint256 assignedLiquidity = (staker.liquidityRewards * amountToUnstake) / totalAssignedAmount;
            uint256 assignedCollateral = (staker.collateralRewards * amountToUnstake) / totalAssignedAmount;

            // Subtract the assigned amounts
            staker.miningRewards -= assignedMining;
            staker.liquidityRewards -= assignedLiquidity;
            staker.collateralRewards -= assignedCollateral;
        }

        staker.amount -= amountToUnstake;

        stakingToken.transfer(msg.sender, amountToUnstake);

        emit Unstaked(msg.sender, amountToUnstake);
        
        if (emergencyUnstakeEnabled) {
        emit EmergencyUnstaked(msg.sender, amountToUnstake);
    }
    }

    function assignTokens(uint256 _percentForMining, uint256 _percentForLiquidity, uint256 _percentForCollateral) external stakingWindow {
        Staker storage staker = stakers[msg.sender];
        require(staker.amount > 0, "You have no staked tokens.");
        require(_percentForMining + _percentForLiquidity + _percentForCollateral <= 100, "Total assigned percentage cannot exceed 100%.");

        uint256 totalStakedAmount = staker.amount;

        // Calculate the unassigned amount.
        uint256 totalAssignedAmount = staker.miningRewards + staker.liquidityRewards + staker.collateralRewards;
        uint256 unassignedAmount = totalStakedAmount - totalAssignedAmount;

        // Calculate the new assigned amounts based on the provided percentages.
        uint256 newAssignedForMining = unassignedAmount * _percentForMining / 100;
        uint256 newliquidityRewards = unassignedAmount * _percentForLiquidity / 100;
        uint256 newcollateralRewards = unassignedAmount * _percentForCollateral / 100;

        // Update the assigned percentages for Mining, liquidity, and collateral.
        staker.miningRewards += newAssignedForMining;
        staker.liquidityRewards += newliquidityRewards;
        staker.collateralRewards += newcollateralRewards;

        // Update globals
        totalMiningRewards += newAssignedForMining;
        totalLiquidityRewards += newliquidityRewards;
        totalCollateralRewards += newcollateralRewards;

        emit TokensAssigned(msg.sender, staker.miningRewards, staker.liquidityRewards, staker.collateralRewards);
    }

    function unassignTokens(uint256 _amountFromMining, uint256 _amountFromLiquidity, uint256 _amountFromCollateral) external stakingWindow {
        Staker storage staker = stakers[msg.sender];
        require(staker.amount > 0, "You have no staked tokens.");

        // Ensure that the unassigning amounts are not greater than the assigned amounts.
        require(staker.miningRewards >= _amountFromMining, "Unassign amount exceeds assigned for Mining.");
        require(staker.liquidityRewards >= _amountFromLiquidity, "Unassign amount exceeds assigned for liquidity.");
        require(staker.collateralRewards >= _amountFromCollateral, "Unassign amount exceeds assigned for collateral.");

        // Update the assigned percentages for Mining, liquidity, and collateral.
        staker.miningRewards -= _amountFromMining;
        staker.liquidityRewards -= _amountFromLiquidity;
        staker.collateralRewards -= _amountFromCollateral;

        // Update globals
        totalMiningRewards -= _amountFromMining;
        totalLiquidityRewards -= _amountFromLiquidity;
        totalCollateralRewards -= _amountFromCollateral;

        emit TokensUnassigned(msg.sender, _amountFromMining, _amountFromLiquidity, _amountFromCollateral);
    }

    function depositRewards() external payable onlyOwner {
        require(msg.value > 0, "Reward amount must be greater than zero.");
        totalEthRewards = totalEthRewards +msg.value;
        emit RewardsDistributed(msg.value, 1);
    }

    function depositLiquidityRewards() external payable onlyOwner {
        require(msg.value > 0, "Reward amount must be greater than zero.");
        totalEthLiquidityRewards = totalEthLiquidityRewards + msg.value;
        emit RewardsDistributed(msg.value, 2);
    }

    function depositCollateralRewards() external payable onlyOwner {
        require(msg.value > 0, "Reward amount must be greater than zero.");
        totalEthCollateralRewards = totalEthCollateralRewards + msg.value;
        emit RewardsDistributed(msg.value, 3);
    }
    // proposal
    // claim only after 30 days from last stake update
    // claim like rewards share for every token staked (not in existence)
    function claimRewards() external {
        Staker storage staker = stakers[msg.sender];
        require(staker.amount > 0, "You have no staked tokens.");
        require(block.timestamp - staker.stakeStartTimestamp > 3 * 24 * 60 * 60,"Wait 30 days from your last claim" );
        
        uint256 ethChange = totalEthRewards - lastRewardBasis[msg.sender];
        uint256 stakerRewardShare = ethChange * staker.amount / getTotalStaked();

        staker.lastClaimedTimestamp = block.timestamp;
        lastRewardBasis[msg.sender] = totalEthRewards;
        totalClaimedRewardsStaking[msg.sender] += stakerRewardShare;
        totalClaimedRewards += stakerRewardShare;

        payable(msg.sender).transfer(stakerRewardShare);

        emit RewardClaimed(msg.sender, stakerRewardShare, 1);
    }

    function claimLiquidityRewards() external {
        Staker storage staker = stakers[msg.sender];
        require(staker.liquidityRewards > 0, "You have no tokens assigned for liquidity.");
        
        uint256 ethChange = totalEthLiquidityRewards - lastLiquidityRewardBasis[msg.sender];
        uint256 liquidityRewardShare = ethChange * staker.liquidityRewards / totalLiquidityRewards;

        staker.lastClaimedTimestamp = block.timestamp;
        lastLiquidityRewardBasis[msg.sender] = totalEthLiquidityRewards;
        totalClaimedLiquidityRewardsuidity[msg.sender] += liquidityRewardShare;
        totalClaimedLiquidityRewards += liquidityRewardShare;

        payable(msg.sender).transfer(liquidityRewardShare);

        emit RewardClaimed(msg.sender, liquidityRewardShare, 2);
    }

    function claimCollateralRewards() external {
        Staker storage staker = stakers[msg.sender];
        require(staker.collateralRewards > 0, "You have no tokens assigned for protocol collateral.");
        
        uint256 ethChange = totalEthCollateralRewards - lastCollateralRewardBasis[msg.sender];
        uint256 collateralRewardShare = ethChange * staker.collateralRewards / totalCollateralRewards;

        staker.lastClaimedTimestamp = block.timestamp;
        lastCollateralRewardBasis[msg.sender] = totalEthCollateralRewards;
        totalClaimedCollateralRewardslateral[msg.sender] += collateralRewardShare;
        totalClaimedCollateralRewards += collateralRewardShare;

        payable(msg.sender).transfer(collateralRewardShare);

        emit RewardClaimed(msg.sender, collateralRewardShare, 3);
    }

    function getRewardsDue() external view returns (uint256) {
        Staker storage staker = stakers[msg.sender];

        if (staker.amount == 0) {
            return 0;
        }

        uint256 ethChange = totalEthRewards - lastRewardBasis[msg.sender];
        uint256 stakerRewardShare = ethChange * staker.amount / getTotalStaked();
        return stakerRewardShare;
    }

    function getLiquidityRewardsDue() external view returns (uint256) {
        Staker storage staker = stakers[msg.sender];

        if (staker.liquidityRewards == 0) {
            return 0;
        }

        uint256 ethChange = totalEthLiquidityRewards - lastLiquidityRewardBasis[msg.sender];
        uint256 liquidityRewardShare = ethChange * staker.liquidityRewards / totalLiquidityRewards;
        return liquidityRewardShare;
    }

    function getCollateralRewardsDue() external view returns (uint256) {
        Staker storage staker = stakers[msg.sender];

        if (staker.collateralRewards == 0) {
            return 0;
        }

        uint256 ethChange = totalEthCollateralRewards - lastCollateralRewardBasis[msg.sender];
        uint256 collateralRewardShare = ethChange * staker.collateralRewards / totalCollateralRewards;
        return collateralRewardShare;
    }

    function getAssignedAndUnassignedAmounts(address stakerAddress) external view returns (uint256 assignedForMiningRewards, uint256 liquidityRewards, uint256 collateralRewards, uint256 unassigned) {
        Staker storage staker = stakers[stakerAddress];
        uint256 totalStakedAmount = staker.amount;
        uint256 totalAssignedAmount = staker.miningRewards + staker.liquidityRewards + staker.collateralRewards;
        uint256 unassignedAmount = totalStakedAmount - totalAssignedAmount;
        return (staker.miningRewards, staker.liquidityRewards, staker.collateralRewards, unassignedAmount);
    }

    function getStakedBalance(address stakerAddress) public view returns (uint256) {
        return stakers[stakerAddress].amount;
    }

    function getTotalStaked() public view returns (uint256) {
        return stakingToken.balanceOf(address(this));
    }

    function getTotalAssigned() public view returns (uint256) {
        return totalMiningRewards + totalLiquidityRewards; + totalCollateralRewards;
    }

    function getTotalUnassigned() public view returns (uint256) {
        uint256 totalStakedAmount = getTotalStaked();
        uint256 totalAssignedAmount = getTotalAssigned();
        return totalStakedAmount - totalAssignedAmount;
    }

    function getStakers() public view returns (address[] memory) {
        uint256 totalStakers = allStakerAddresses.length;
        address[] memory stakersWithAmount = new address[](totalStakers);
        uint256 count = 0;

        for (uint256 i = 0; i < totalStakers; i++) {
            address stakerAddress = allStakerAddresses[i];
            if (stakers[stakerAddress].amount > 0) {
                stakersWithAmount[count] = stakerAddress;
                count++;
            }
        }

        // Resize the array to remove unused slots
        assembly {
            mstore(stakersWithAmount, count)
        }

        return stakersWithAmount;
    }

    function setEmergencyUnstake(bool _enabled) external onlyOwner {
    emergencyUnstakeEnabled = _enabled;
    emit EmergencyUnstakeSet(_enabled);
}

}
