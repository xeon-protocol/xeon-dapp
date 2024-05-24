// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract StakingContract is Ownable {
    using SafeMath for uint256;

    IERC20 public stakingToken;
    uint256 public poolExpiry; // The day when the staking pool expires and opens transacts for 3 days
    uint256 public nextUnstakeDay; // The day when stakers can unstake again.
    uint256 public ethRewardBasis;
    uint256 public ethLiquidityRewardBasis;
    uint256 public ethCollateralRewardBasis ;
    uint256 public totalAssignedForMining;
    uint256 public totalAssignedForLiquidity;
    uint256 public totalAssignedForCollateral;
    uint256 public claimedRewards;
    uint256 public claimedRewardsLiq;
    uint256 public claimedRewardsCol;
    address[] public stakerAddresses;

    struct Staker {
        uint256 amount;
        uint256 stakingTime;
        uint256 lastClaimedDay;
        uint256 assignedForMining;
        uint256 assignedForLiquidity;
        uint256 assignedForCollateral;
    }

    mapping(address => Staker) public stakers;
    mapping(address => uint256) public lastRewardBasis;
    mapping(address => uint256) public lastLiquidityRewardBasis;
    mapping(address => uint256) public lastCollateralRewardBasis;
    mapping(address => uint256) public claimedRewardsStaking;
    mapping(address => uint256) public claimedRewardsCollateral;
    mapping(address => uint256) public claimedRewardsLiquidity;

    event Staked(address indexed staker, uint256 amount);
    event Unstaked(address indexed staker, uint256 amount);
    event TokensAssigned(address indexed staker, uint256 amountForMining, uint256 amountForLiquidity, uint256 amountForCollateral);
    event TokensUnassigned(address indexed staker, uint256 amountFromMining, uint256 amountFromLiquidity, uint256 amountFromCollateral);
    event RewardClaimed(address indexed staker, uint256 amount, uint indexed poolID);
    event RewardsDistributed(uint256 amount, uint indexed poolID);

    modifier stakingWindow() {
       require(block.timestamp >= nextUnstakeDay && block.timestamp <= nextUnstakeDay.add(3 days), "staking or assigning features suspended at the moment.");
        _;
    }

    constructor(address XeonToken) {
        require(XeonToken != address(0), "Invalid token address.");
        stakingToken = IERC20(XeonToken);
    }

    function startContract() external onlyOwner {
        nextUnstakeDay = block.timestamp;//3 days for people to stake and assign
    }

    function restartPool() external stakingWindow onlyOwner {
        nextUnstakeDay = block.timestamp.add(30 days);//pool 30 days start now
    }

    function stake(uint256 _amount) external stakingWindow {
        require(_amount > 0, "Staked amount must be greater than zero.");
        require(stakers[msg.sender].amount == 0, "You can only stake once at a time.");

        stakingToken.transferFrom(msg.sender, address(this), _amount);

        stakers[msg.sender] = Staker({
            amount: _amount,
            stakingTime: block.timestamp,
            lastClaimedDay: stakers[msg.sender].lastClaimedDay,
            assignedForMining: stakers[msg.sender].assignedForMining,
            assignedForLiquidity: stakers[msg.sender].assignedForLiquidity,
            assignedForCollateral: stakers[msg.sender].assignedForCollateral
        });

        emit Staked(msg.sender, _amount);
    }

    function unstake() external stakingWindow {
        Staker storage staker = stakers[msg.sender];
        require(block.timestamp - staker.stakingTime > 3 * 24 * 60 * 60,"Wait 30 days from your last stake action" );
        require(staker.amount > 0, "You have no staked tokens.");

        uint256 amountToUnstake = staker.amount.sub(staker.assignedForMining).sub(staker.assignedForLiquidity).sub(staker.assignedForCollateral);
        staker.amount = staker.amount.sub(amountToUnstake);

        stakingToken.transfer(msg.sender, amountToUnstake);

        emit Unstaked(msg.sender, amountToUnstake);
    }

    function assignTokens(uint256 _percentForMining, uint256 _percentForLiquidity, uint256 _percentForCollateral) external stakingWindow {
        Staker storage staker = stakers[msg.sender];
        require(staker.amount > 0, "You have no staked tokens.");
        require(_percentForMining.add(_percentForLiquidity).add(_percentForCollateral) <= 100, "Total assigned percentage cannot exceed 100%.");

        uint256 totalStakedAmount = staker.amount;

        // Calculate the unassigned amount.
        uint256 totalAssignedAmount = staker.assignedForMining.add(staker.assignedForLiquidity).add(staker.assignedForCollateral);
        uint256 unassignedAmount = totalStakedAmount.sub(totalAssignedAmount);

        // Calculate the new assigned amounts based on the provided percentages.
        uint256 newAssignedForMining = unassignedAmount.mul(_percentForMining).div(100);
        uint256 newAssignedForLiquidity = unassignedAmount.mul(_percentForLiquidity).div(100);
        uint256 newAssignedForCollateral = unassignedAmount.mul(_percentForCollateral).div(100);

        // Update the assigned percentages for Mining, liquidity, and collateral.
        staker.assignedForMining = staker.assignedForMining.add(newAssignedForMining);
        staker.assignedForLiquidity = staker.assignedForLiquidity.add(newAssignedForLiquidity);
        staker.assignedForCollateral = staker.assignedForCollateral.add(newAssignedForCollateral);

        // Update globals
        totalAssignedForMining = totalAssignedForMining.add(newAssignedForMining);
        totalAssignedForLiquidity = totalAssignedForLiquidity.add(newAssignedForLiquidity);
        totalAssignedForCollateral = totalAssignedForCollateral.add(newAssignedForCollateral);

        emit TokensAssigned(msg.sender, staker.assignedForMining, staker.assignedForLiquidity, staker.assignedForCollateral);
    }

    function unassignTokens(uint256 _amountFromMining, uint256 _amountFromLiquidity, uint256 _amountFromCollateral) external stakingWindow {
        Staker storage staker = stakers[msg.sender];
        require(staker.amount > 0, "You have no staked tokens.");

        // Ensure that the unassigning amounts are not greater than the assigned amounts.
        require(staker.assignedForMining >= _amountFromMining, "Unassign amount exceeds assigned for Mining.");
        require(staker.assignedForLiquidity >= _amountFromLiquidity, "Unassign amount exceeds assigned for liquidity.");
        require(staker.assignedForCollateral >= _amountFromCollateral, "Unassign amount exceeds assigned for collateral.");

        // Update the assigned percentages for Mining, liquidity, and collateral.
        staker.assignedForMining = staker.assignedForMining.sub(_amountFromMining);
        staker.assignedForLiquidity = staker.assignedForLiquidity.sub(_amountFromLiquidity);
        staker.assignedForCollateral = staker.assignedForCollateral.sub(_amountFromCollateral);

        // Update globals
        totalAssignedForMining = totalAssignedForMining.sub(_amountFromMining);
        totalAssignedForLiquidity = totalAssignedForLiquidity.sub(_amountFromLiquidity);
        totalAssignedForCollateral = totalAssignedForCollateral.sub(_amountFromCollateral);

        emit TokensUnassigned(msg.sender, _amountFromMining, _amountFromLiquidity, _amountFromCollateral);
    }

    function depositRewards() external payable onlyOwner {
        require(msg.value > 0, "Reward amount must be greater than zero.");
        ethRewardBasis = ethRewardBasis.add(msg.value);
        emit RewardsDistributed(msg.value, 1);
    }

    function depositLiquidityRewards() external payable onlyOwner {
        require(msg.value > 0, "Reward amount must be greater than zero.");
        ethLiquidityRewardBasis = ethLiquidityRewardBasis.add(msg.value);
        emit RewardsDistributed(msg.value, 2);
    }

    function depositCollateralRewards() external payable onlyOwner {
        require(msg.value > 0, "Reward amount must be greater than zero.");
        ethCollateralRewardBasis = ethCollateralRewardBasis.add(msg.value);
        emit RewardsDistributed(msg.value, 3);
    }
    // proposal
    // claim only after 30 days from last stake update
    // claim like rewards share for every token staked (not in existence)
    function claimRewards() external {
        Staker storage staker = stakers[msg.sender];
        require(staker.amount > 0, "You have no staked tokens.");
        require(block.timestamp - staker.stakingTime > 3 * 24 * 60 * 60,"Wait 30 days from your last claim" );
        
        uint256 ethChange = ethRewardBasis - lastRewardBasis[msg.sender];
        uint256 stakerRewardShare = ethChange.mul(staker.amount).div(getTotalStaked());

        staker.lastClaimedDay = block.timestamp;
        lastRewardBasis[msg.sender] = ethRewardBasis;
        claimedRewardsStaking[msg.sender] += stakerRewardShare;
        claimedRewards += stakerRewardShare;

        payable(msg.sender).transfer(stakerRewardShare);

        emit RewardClaimed(msg.sender, stakerRewardShare, 1);
    }

    function claimLiquidityRewards() external {
        Staker storage staker = stakers[msg.sender];
        require(staker.assignedForLiquidity > 0, "You have no tokens assigned for liquidity.");
        
        uint256 ethChange = ethLiquidityRewardBasis - lastLiquidityRewardBasis[msg.sender];
        uint256 liquidityRewardShare = ethChange.mul(staker.assignedForLiquidity).div(totalAssignedForLiquidity);

        staker.lastClaimedDay = block.timestamp;
        lastLiquidityRewardBasis[msg.sender] = ethLiquidityRewardBasis;
        claimedRewardsLiquidity[msg.sender] += liquidityRewardShare;
        claimedRewardsLiq += liquidityRewardShare;

        payable(msg.sender).transfer(liquidityRewardShare);

        emit RewardClaimed(msg.sender, liquidityRewardShare, 2);
    }

    function claimCollateralRewards() external {
        Staker storage staker = stakers[msg.sender];
        require(staker.assignedForCollateral > 0, "You have no tokens assigned for protocol collateral.");
        
        uint256 ethChange = ethCollateralRewardBasis - lastCollateralRewardBasis[msg.sender];
        uint256 collateralRewardShare = ethChange.mul(staker.assignedForCollateral).div(totalAssignedForCollateral);

        staker.lastClaimedDay = block.timestamp;
        lastCollateralRewardBasis[msg.sender] = ethCollateralRewardBasis;
        claimedRewardsCollateral[msg.sender] += collateralRewardShare;
        claimedRewardsCol += collateralRewardShare;

        payable(msg.sender).transfer(collateralRewardShare);

        emit RewardClaimed(msg.sender, collateralRewardShare, 3);
    }

    function getRewardsDue() external view returns (uint256) {
        Staker storage staker = stakers[msg.sender];

        if (staker.amount == 0) {
            return 0;
        }

        uint256 ethChange = ethRewardBasis - lastRewardBasis[msg.sender];
        uint256 stakerRewardShare = ethChange.mul(staker.amount).div(getTotalStaked());
        return stakerRewardShare;
    }

    function getLiquidityRewardsDue() external view returns (uint256) {
        Staker storage staker = stakers[msg.sender];

        if (staker.assignedForLiquidity == 0) {
            return 0;
        }

        uint256 ethChange = ethLiquidityRewardBasis - lastLiquidityRewardBasis[msg.sender];
        uint256 liquidityRewardShare = ethChange.mul(staker.assignedForLiquidity).div(totalAssignedForLiquidity);
        return liquidityRewardShare;
    }

    function getCollateralRewardsDue() external view returns (uint256) {
        Staker storage staker = stakers[msg.sender];

        if (staker.assignedForCollateral == 0) {
            return 0;
        }

        uint256 ethChange = ethCollateralRewardBasis - lastCollateralRewardBasis[msg.sender];
        uint256 collateralRewardShare = ethChange.mul(staker.assignedForCollateral).div(totalAssignedForCollateral);
        return collateralRewardShare;
    }

    function getAssignedAndUnassignedAmounts(address stakerAddress) external view returns (uint256 assignedForMining, uint256 assignedForLiquidity, uint256 assignedForCollateral, uint256 unassigned) {
        Staker storage staker = stakers[stakerAddress];
        uint256 totalStakedAmount = staker.amount;
        uint256 totalAssignedAmount = staker.assignedForMining.add(staker.assignedForLiquidity).add(staker.assignedForCollateral);
        uint256 unassignedAmount = totalStakedAmount.sub(totalAssignedAmount);
        return (staker.assignedForMining, staker.assignedForLiquidity, staker.assignedForCollateral, unassignedAmount);
    }

    function getStakedBalance(address stakerAddress) public view returns (uint256) {
        return stakers[stakerAddress].amount;
    }

    function getTotalStaked() public view returns (uint256) {
        return stakingToken.balanceOf(address(this));
    }

    function getTotalAssigned() public view returns (uint256) {
        return totalAssignedForMining.add(totalAssignedForLiquidity).add(totalAssignedForCollateral);
    }

    function getTotalUnassigned() public view returns (uint256) {
        uint256 totalStakedAmount = getTotalStaked();
        uint256 totalAssignedAmount = getTotalAssigned();
        return totalStakedAmount.sub(totalAssignedAmount);
    }

    function getStakers() public view returns (address[] memory) {
        uint256 totalStakers = stakerAddresses.length;
        address[] memory stakersWithAmount = new address[](totalStakers);
        uint256 count = 0;

        for (uint256 i = 0; i < totalStakers; i++) {
            address stakerAddress = stakerAddresses[i];
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

}
