## Bug Bounties

[![xeon token](https://img.shields.io/badge/$XEON-0x8d65a2eaBDE4B31cbD7E43F27E47559d1CCec86c-8429c6.svg?logo=ethereum)](https://app.uniswap.org/explore/tokens/ethereum/0x8d65a2eabde4b31cbd7e43f27e47559d1ccec86c?chain=mainnet)

The `v1-core` repository is subject to the Xeon Protocol Bug Bounty (the "Program") to incentivize responsible disclosure of vulnerabilities. We are offering XEON token rewards for submissions that meet eligibility criteria.

## Scope

The scope of the Program is limited to bugs that result in the direct loss of user or protocol funds when interacting with Xeon v1 contracts, and bugs that interfere with the ability of peripheral contracts to properly interact with core contracts.

The following are not within the scope of the Program:

- contracts located in `test/` or `script/`
- bugs in any third party contract or platform that interacts with Xeon v1
- vulnerabilities already reported and/or discovered in contracts built by third parties on Xeon v1
- any already-reported bugs

Vulnerabilities contingent upon the occurrence of any of the following are also outside the scope of this Program:

- frontend bugs
- DDOS attacks
- spamming
- phishing
- automated tools (Github Actions, AWS, etc.)
- compromise or misuse of third party systems or services

## Assumptions

Xeon v1 was developed with the following assumptions, and thus any bug must also adhere to the following assumptions to be eligible for the bug bounty:

- The total supply of any token does not exceed 2<sup>128</sup> - 1, i.e. `type(uint128).max`.
- The `transfer` and `transferFrom` methods of any token strictly decrease the balance of the token sender by the transfer amount and increases the balance of token recipient by the transfer amount, i.e. fee on transfer tokens are excluded.
- The token balance of an address can only change due to a call to `transfer` by the sender or `transferFrom` by an approved address, i.e. rebase tokens and interest bearing tokens are excluded.

Although general enhancements such as gas efficiency improvements and refactoring are appreciated, they are not subject to payouts from the Program.
We do however recognize regular contributors who commit to our repositories with XEON rewards paid out on developer-specific quests through our Galxe campaign, which you can sign up for [here](https://app.galxe.com/quest/bxfBJ9bbdUWazgQ2gTSNNp).

## Rewards

Rewards will be allocated based on the severity of the bug disclosed and will be evaluated and rewarded at the discretion of the Xeon Protocol team. For critical bugs that lead to a loss of user or protocol funds, rewards of up to 500k XEON will be granted. Lower severity bugs will be rewarded at the discretion of the team.

| Vulnerability                                                   | Max Reward                                                    | Description                                                                    |
| --------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| ![severe](https://img.shields.io/badge/level-critical-red.svg)  | ![500k](https://img.shields.io/badge/XEON-500,000-000000.svg) | Bug that would definitely result in the direct loss of user funds if not fixed |
| ![high](https://img.shields.io/badge/level-high-darkorange.svg) | ![100k](https://img.shields.io/badge/XEON-200,000-000000.svg) | Bug that may result in the direct loss or user or protocol funds if not fixed  |
| ![medium](https://img.shields.io/badge/level-medium-yellow.svg) | ![25k](https://img.shields.io/badge/XEON-25,000-000000.svg)   | Bug that prevents peripheral contracts from interacting with core contracts    |

## Supported Deployments

The following deployments are subject to bounty rewards up to and including the vulnerability levels listed below:

| Codebase                                                          | Bounty                                                          |
| ----------------------------------------------------------------- | --------------------------------------------------------------- |
| [v1-core](https://github.com/xeon-protocol/v1-core) *               | ![severe](https://img.shields.io/badge/level-critical-red.svg)  |
| [xeon-testnet](https://github.com/xeon-protocol/xeon-testnet)     | ![none](https://img.shields.io/badge/level-N/A-grey.svg)        |
| [xeon-periphery](https://github.com/xeon-protocol/xeon-periphery) | ![medium](https://img.shields.io/badge/level-medium-yellow.svg) |

Completed bug bounties are claimable per-codebase, not per-network deployment of that codebase.

> v1-core is currently in internal review, and available only to select solidity auditors once the initial audit phase is complete, the repo will be publicly opened to the Program
>
> NOTE: Early access developers within audit scope use a different payment structure from the Program, to ensure fair access for all bug hunters.

## Responsible Disclosure

Any vulnererability or bug discovered must be reported directly to the CTO: [jon@xeon-protocol.io](mailto:jon@xeon-protocol.io)

The vulnerability must not be disclosed publicly or to any other person, entity or email address before the Xeon team has been notified, has fixed the issue, and has granted permission for public disclosure. In addition, disclosure must be made within 24 hours following discovery of the vulnerability.

A detailed report of a vulnerability increases the likelihood of a reward and may increase the reward amount. Please provide as much information about the vulnerability as possible, including:

- the conditiona on which reproducing the bug is contingent
- the steps needed to reproduce the bug or, preferably, a proof of concept
- the potential implications of the vulnerability being abused

- Anyone who reports a unique, previously-unreported vulnerability that results in a change to the code or a configuration change and who keeps such vulnerability confidential until it has been resolved by our team will be recognized publicly for their contribution if they so choose.

## Eligibility

To be eligible for a reward under this Program, you must:

- discover a previously unreported, non-public vulnerability that would result in a loss and/or lock of any ERC-20 token on Xeon Protocol (but not on third party platforms interacting with Xeon Protocol) and that is within the scope of this Program. Vulnerabilities must be distinct from the issues covered in public audits.
- be the first to disclose the unique vulnerability to [jon@xeon-protocol.io](mailto:jon@xeon-protocol.io), in compliance with the disclosure requirements above. If similar vulnerabilities are reported within the same 24-hour period, rewards will be split at the discretion of the Xeon team.
- provide sufficient information to enable our team to reproduce and fix the vulnerability.
- not engage in any unlawful conduct when disclosing the bug, including through threats, demands, or any other coercive tactics.
- not exploit the vulnerability in any way, including through making it public or by obtaining a profit (other than a reward through this Program).
- make a good faith effort to avoid privacy violations, destruction of data, interruption or degradation of Xeon Protocol.
- Submit only one vulnerability per submission, unless you need to chain them together to provide impact regarding any of the vulnerabilities.
- not submit a vulnerability caused by an underlying issue that is the same as an issue on which a reward has been paid under this Program.
- not be one of our current or former employeed, vendors, or contractors or an employee of any of those vendors or contractors.
- not be subject to US sanctions or reside in a US-embardoed country.
- be at least 18 years of age or, if younger, submit your vulnerability with the consent of your parent or guardian.

## Other Terms

By submitting your report, you grant Xeon Protocol any and all rights, including intellectual property rights, needed to validate, mitigate, and disclose the vulnerability. All reward decisions, including eligibility for and amounts of the rewards and the manner in which such rewards will be paid, are made at our sole discretion.

The terms and conditions of this program may be altered at any time.
