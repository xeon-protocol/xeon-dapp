import Image from "next/image";
import ImagePayful from "../../../assets/imgs/playful.webp";

export default function StakingPanel() {
    return (
        <div className="hedgesPanelHold">
				<div className="dashboard-section">
					<div className="section-title">
						<Image src={ImagePayful} alt="Neon"/>
						<h2>Staking Panel</h2>
					</div>

					<div className="rewardsInformer">
						<a href=""><i className="fa fa-leaf" aria-hidden="true"></i></a> Stake XEON tokens to be eligible for rewards sharing. The staking window opens 3 days only each month-end, during which users can stake or unstake XEON. Revenue is deposited to staking contract for claiming.
					</div>

					<div className="myStakes staking-grid grid grid-cols-2 gap-5">
						<div className="flex flex-col gap-4">
							
							<div className="grid grid-cols-2 stakeGrids">
								<div className="stakeDataRow flex flex-col">
									<div className="grid-sect-subtitle splitView stakedTitle"><span className="splitView-title">my Staked Balance: </span><span id="stakedBalanceAmnt">0</span><span id="stakedBalanceValue"> ($0)</span></div>
									<div className="grid-sect-subtitle splitView"><span className="splitView-title">my Total Holdings: </span><span id="totalBalanceAmnt">0</span><span id="totalBalanceValue"> ($0)</span></div>
								</div>
								<div id="stakedChart" className="chart-svg">
									<svg viewBox="0 0 36 36" className="circular-chart green">
										<path className="circle-bg" d="M18 2.0845
											a 15.9155 15.9155 0 0 1 0 31.831
											a 15.9155 15.9155 0 0 1 0 -31.831"></path>
										<path id="stakedVsMyBalanceDash" className="circle" stroke-dasharray="30, 100" d="M18 2.0845
											a 15.9155 15.9155 0 0 1 0 31.831
											a 15.9155 15.9155 0 0 1 0 -31.831"></path>
										<text x="18" y="20.35" id="stakedVsMyBalancePercent" className="percentage">30%</text>
									</svg>
								</div>
							</div>
							<hr className="line"/>
							<div className="grid grid-cols-2 stakeGrids">
								<div className="stakeDataRow flex flex-col">
									<div className="grid-sect-subtitle splitView stakedTitle"><span className="splitView-title">Staked Supply: </span><span id="stakedSupplyAmnt">0</span><span id="stakedSupplyValue"> ($0)</span></div>
									<div className="grid-sect-subtitle splitView"><span className="splitView-title">Circulating Supply: </span><span id="circSupplyAmnt">0</span><span id="circSupplyValue"> ($0)</span></div>
								</div>
								<div id="circulatingChart" className="chart-svg">
									<svg viewBox="0 0 36 36" className="circular-chart blue">
										<path className="circle-bg" d="M18 2.0845
											a 15.9155 15.9155 0 0 1 0 31.831
											a 15.9155 15.9155 0 0 1 0 -31.831"></path>
										<path id="stakedVsCirculatingDash" className="circle" stroke-dasharray="30, 100" d="M18 2.0845
											a 15.9155 15.9155 0 0 1 0 31.831
											a 15.9155 15.9155 0 0 1 0 -31.831"></path>
										<text x="18" y="20.35" id="stakedVsCirculatingPercent" className="percentage">30%</text>
									</svg>
								</div>
							</div>
							<hr className="line"/>
							<div className="grid grid-cols-2 stakeGrids">
								<div className="stakeDataRow flex flex-col">
									<div className="grid-sect-subtitle splitView stakedTitle"><span className="splitView-title">Dividents Distributed: </span><span id="divDistributedAmnt">0</span><span id="divDistributedValue"> ($0)</span></div>
									<div className="grid-sect-subtitle splitView"><span className="splitView-title">Dividents Claimed: </span><span id="divClaimedAmnt">0</span><span id="divClaimedValue"> ($0)</span></div>
								</div>
								<div id="dividentsChart" className="chart-svg">
									<svg viewBox="0 0 36 36" className="circular-chart blue">
										<path className="circle-bg" d="M18 2.0845
											a 15.9155 15.9155 0 0 1 0 31.831
											a 15.9155 15.9155 0 0 1 0 -31.831"></path>
										<path id="dividentsDash" className="circle" stroke-dasharray="30, 100" d="M18 2.0845
											a 15.9155 15.9155 0 0 1 0 31.831
											a 15.9155 15.9155 0 0 1 0 -31.831"></path>
										<text x="18" y="20.35" id="dividentsDashPercent" className="percentage">30%</text>
									</svg>
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-5">
							<div className="flex flex-col gap-1">
								<div className="flex flex-col">
									<div className="grid-sect-subtitle">XEON available</div>
									<div className="grid-sect-subtitle-value"><span id="tokensAvailableWallet">0</span></div>
								</div>
								<button className="claim-button"><span>Stake XEON</span></button>
							</div>
							<div className="flex flex-col gap-1">
								<div className="flex flex-col">
									<div className="grid-sect-subtitle">XEON staked</div>
									<div className="grid-sect-subtitle-value"><span id="tokensStakedWallet">0</span></div>
								</div>
								<button className="claim-button"><span>unStake XEON</span></button>
							</div>
						</div>
					</div>
					<div className="section-title staking-assignments-title">
						<div className="icon"><i className="fas fa-coins"></i></div>
						<span className="sectionLabel aplAssignments">Stake Assignment Pools</span>
					</div>
					<div className="rewardsInformer">
						<a href=""><i className="fa fa-leaf" aria-hidden="true"></i></a> After staking tokens, you can choose which farming pool or income method to assign your tokens to. (1) Simply stake XEON without assigning, to qualify for general revenue sharing. (2) Stake and assign to Native Hedging & Lending Liquidity Pools. (3) The protocol will now use your tokens to provide native equity swaps or options liquidity. (4) Profits are brought back to pool assigners for sharing. Native Liquidity Pools are not only available for XEON tokens only, other projects can create their own pools too.
					</div>
					<div className="assignments-grid grid grid-cols-2 gap-5">
						<div className="stakeGrids flex flex-col gap-4">
							<div className="stakeDataRow flex items-center justify-between gap-2">
								<div className="grid-sect-title">Staked Tokens</div>
								<div className="grid-sect-title text-[#089353]"><span id="mystakedTokensAmnt">0</span><span id="myStakedTokensValue"> ($0)</span></div>
							</div>

							<hr className="line"/>
							<div className="stakeDataRow flex items-center justify-between gap-2">
								<div className="grid-sect-title">Assigned Tokens</div>
								<div className="grid-sect-title text-[#089353]"><span id="myAssignedAmnt">0</span><span id="myAssignedValue"> ($0)</span></div>
							</div>
							
							<hr className="line"/>
							<div className="stakeDataRow flex items-center justify-between gap-2">
								<div className="grid-sect-title">Unassigned Tokens</div>
								<div className="grid-sect-title text-[#089353]"><span id="myUnassignedAmnt">0</span><span id="myUnassignedValue"> ($0)</span></div>
							</div>

						</div>
						<div className="flex flex-col gap-5">							
							<div className="grid grid-cols-2 place-flexstart">
								<div className="flex flex-col">
									<div className="grid-sect-subtitle">Protocol Hedge Liquidity</div>
									<div className="grid-sect-subtitle-value"><span id="assignedToLiquidityAmnt">0</span><span id="assignedToLiquidityValue"> ($0)</span></div>
								</div>
								<button className="claim-button" disabled><span>Manage</span></button>
							</div>
							<hr className="line"/>
							<div className="grid grid-cols-2 place-flexstart">
								<div className="flex flex-col">
									<div className="grid-sect-subtitle">Protocol Lending Collateral</div>
									<div className="grid-sect-subtitle-value"><span id="assignedToCollateralAmnt">0</span><span id="assignedToCollateralValue"> ($0)</span></div>
								</div>
								<button className="claim-button" disabled><span>Manage</span></button>
							</div>
							<hr className="line"/>
							<div className="grid grid-cols-2 place-flexstart">
								<div className="flex flex-col">
									<div className="grid-sect-subtitle">Mining Rights</div>
									<div className="grid-sect-subtitle-value"><span id="assignedToMiningAmnt">0</span><span id="assignedToMiningValue"> ($0)</span></div>
								</div>
								<button className="claim-button" disabled><span>Manage</span></button>
							</div>
						</div>
					</div>
				</div>
			</div>
    )
}