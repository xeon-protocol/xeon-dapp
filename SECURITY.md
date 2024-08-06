# Security Policy &middot; [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-darkgreen.svg)](https://github.com/xeon-protocol/xeon-dapp/blob/main/CONTRIBUTING.md) [![Bug Bounties](https://img.shields.io/badge/Bug_Bounties-open-red.svg)](https://github.com/xeon-protocol/xeon-dapp/blob/main/SECURITY.md)


## Reporting a Vulnerability

If you discover a security vulnerability in Xeon Protocol, we encourage you to report it to us as soon as possible. We will handle your report with the highest priority and confidentiality.

We encourage responsible disclosure, please do not open an issue for sensitive vulnerabilities. Instead, email your findings to [jon@xeon-protocol.io](mailto:jon@xeon-protocol.io) or send a DM on [Warpcast](https://warpcast.com/jonbray.eth).
Include as much detail as possible in your report to help us understand and reproduce the issue.
If applicable, include a link/hash to any relevant onchain transactions and a minimal repo including tests that showcase the behavior in question.

## Response Expectations

- **Acknowledgement**: We will acknowledge receipt of your report within 48 hours.
- **Initial Triage**: We will complete an initial assessment of your report within 5 business days.
- **Resolution**: We will work to resolve the issue as quickly as possible, keeping you informed of our progress.
- **Reward**: If the findings are eligible for a reward, we will reach out for a receiving address and process payment within 5 business days after resolution.


## Bug Bounties &middot; [![warpcast](https://img.shields.io/badge/contact_dev-FFFFFF.svg?logo=farcaster)](https://warpcast.com/xeonprotocol)

[![xeon token](https://img.shields.io/badge/$XEON-0x8d65a2eaBDE4B31cbD7E43F27E47559d1CCec86c-8429c6.svg?logo=ethereum)](https://app.uniswap.org/explore/tokens/ethereum/0x8d65a2eabde4b31cbd7e43f27e47559d1ccec86c?chain=mainnet)

Bug bounties that meet certain criteria are eligible for XEON token rewards, that are paid upon completion.

| Vulnerability                                                   | Max Reward                                                       | Description                                                                        |
| --------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| ![severe](https://img.shields.io/badge/level-severe-red.svg)    | ![500k](https://img.shields.io/badge/XEON-500,000-000000.svg)    | Bug that would definitely result in the direct loss of user funds if not fixed     |
| ![high](https://img.shields.io/badge/level-high-darkorange.svg) | ![100k](https://img.shields.io/badge/XEON-200,000-000000.svg)    | Bug that may result in the direct loss or user or protocol funds if not fixed      |
| ![medium](https://img.shields.io/badge/level-medium-yellow.svg) | ![10k](https://img.shields.io/badge/XEON-25,000-000000.svg)      | Bug that prevents core logic from behaving as required; No loss of funds           |
| ![low](https://img.shields.io/badge/level-low-pink.svg)         | ![5k](https://img.shields.io/badge/XEON-10,000-000000.svg)       | Fix that optimizes or improves core or auxiliary contract logic or gas efficiency  |

Although general enhancements such as gas efficiency improvements and refactoring are appreciated, they are not subject to payouts for bug bounties.
We do however recognize regular contributors who commit to our repositories with XEON rewards paid out through our Galxe campaign, which you can sign up for [here](https://app.galxe.com/quest/bxfBJ9bbdUWazgQ2gTSNNp).

## [Bug Bounty Program](https://github.com/xeon-protocol/xeon-dapp/blob/main/bug-bounty.md) &middot; ![eligible](https://img.shields.io/badge/v1--core-eligible-darkgreen.svg) ![not eligible](https://img.shields.io/badge/xeon--dapp-not_eligible-red.svg)


The following deployments are subject to bounty rewards up to and including the vulnerability levels listed below:

| Codebase                                                          | Bounty                                                              |
| ----------------------------------------------------------------- | ------------------------------------------------------------------- |
| [xeon-dapp](https://github.com/xeon-protocol/xeon-dapp)           | ![medium](https://img.shields.io/badge/level-medium-yellow.svg)     |
| [xeon-v1](https://github.com/xeon-protocol/xeon-v1)               | ![severe](https://img.shields.io/badge/level-severe-red.svg)        |
| [xeon-testnet](https://github.com/xeon-protocol/xeon-testnet)     | ![low](https://img.shields.io/badge/level-low-pink.svg)             |
| [xeon-periphery](https://github.com/xeon-protocol/xeon-periphery) | ![medium](https://img.shields.io/badge/level-medium-yellow.svg)     |

Completed bug bounties are claimable per-codebase, not per-network deployment of that codebase.

Portions of our codebase are subject to the Xeon Protocol Bug Bounty (the "Program") to incentivize responsible disclosure of vulnerabilities. We are offering XEON token rewards for submissions that meet eligibility criteria.

### Community Audit Program

In order to maximize the security of our `v1-core` contracts, we will be opening them for community audit prior to their release on mainnet. If you are a Solidity developer with auditing experience, and would like to earn XEON token rewards in exchange for providing a detailed contract audit, please contact us on [Telegram](https://t.me/XeonProtocolPortal), or by [email](mailto:jon@xeon-protocol.io) for an invite to an audit discussion in Slack.


## Security Updates

To stay informed about security updates, follow us on [Warpcast](https://warpcast.com/xeonprotocol) and [X](https://x.com/xeonprotocol) for the latest updates. Additionally, we publish regular articles on our [Paragraph Newsletter](https://paragraph.xyz/@xeon-protocol).

## Security Practices

We are committed to ensuring the security of our platform and follow best practices, including:

- Regular penetration testing
- Open-Sourcing public contracts
- Continuous dependency management
- Proactive vulnerability scanning

Thank you for helping us keep the Xeon Protocol secure.
