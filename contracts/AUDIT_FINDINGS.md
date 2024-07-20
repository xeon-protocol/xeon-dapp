# Xeon Protocol

**Liquidity unlocking and risk management platform**

## Audit findings updates: 09/06/2024

### `XeonHedging.sol`

This is the main smart contract for the Xeon Protocol.
The smart contract is deployed on testnet.

- Deposit any ERC-20 token as collateral
- Withdraw any ERC20 token
- Get underlying value of any ERC20 token in paired currency
- Use Uniswap V3 TWAP oracle + other dynamic price sources to get price of assets
- Get user token balances
- Lock in collateral for a duration
- Write/Take Loans requests
- Write/Take Options
- Write/Take Equity Swaps
- Write/Take OTC swaps
- Custom deal terms on all trades
- Requests to topup collateral during a deal, passed on mutual consent
- Requests to settle trade before maturity, passed on mutual consent
- Settle trade in underlying assets upon deal maturity
- Settle trade in paired currency upon deal maturity
- Payout settlement profits and fees to: trade parties, protocol, miner
- Distribute revenue or third party service stakes
- Restore collateral on settlement
- Read data storages; array lists, individual mappings and structs, collective mappings and variables

## Functionality goals

1. to receive any ERC20 token as collateral/underlying tokens
2. tokens are priced in their dex paired currency.
3. enable writing using tokens as underlying assets
4. enable buying in paired currency for stipulated duration
5. settlement based on price of assets in comparison to strike value & terms
6. allow settle-now or topup-topup consensus between parties during a deal
7. payment and logging of proceeds, fees and commissions for protocol and parties involved
8. read smart contract data on wallet balances, hedge activity, revenue logs

## List of Key Functions in this smart contract

- deposit
- withdraw
- get pair addresses of all erc20
- get underlying value of all erc20
- cashier fees calculation
- write deal
- buy deal
- settlement
- mine deal
- revenue and fees logging for all stakeholders
- get deal details by deal id
- fetch deal arrays; created, taken, settled

## Third Party Key Dependencies

1.
2.
3.
4.

## Dev notes

- addresses can deposit or withdraw erc20 tokens
- all tokens are treated as ERC20
- deposits, lockedInUse and withdrawals track wallets balances
- lockedInUse is the current account (+-) on trades, and acts as escrow for each deal
- getUnderlyingValue fetches value of tokens & returns paired value & pair address
- split writing, taking and settlement functions for all deal types
- each deal is taxed upon settlement, in relevant tokens (paired or underlying)
- contract taxes credited in mappings under address(this) and withdrwan by owner
- losses, costs paid to Writer, fees charged: are added to users withdrawal balance
- profits, fees paid to Taker: are added to users deposit balance
