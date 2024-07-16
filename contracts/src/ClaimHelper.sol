// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "../src/MockERC20Factory.sol";

contract ClaimHelper {
// --
// airdrop functionality
// handle all ERC20 tokens
// -- users claim XEON
// -- users claim ERC20
// -- users claim WETH, USDC
// also record if user has claimed - hasClaimedInitial
// when user uses claimInitial, one of the params is "address referredBy" which is the address of the user who referred them
// user cannot set themselves as referredBy
// if user has a referral, they receive an additional 5%, and the referral receives an additional 5%
// user can only do claimInitial once
// mapping for referrals [address][referralCount]
// mapping for internal tokens [tokens]
// mapping for internal balances [address][balance]
}
