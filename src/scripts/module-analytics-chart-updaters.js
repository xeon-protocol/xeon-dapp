import { chartConfig } from './constants-charting.js';

/*=========================================================================
    HELPERS
==========================================================================*/
function updateDoughnutChart(canvasId, labels, data, backgroundColor, borderColor, legendPosition = 'left') {
    const chartCanvas = document.getElementById(canvasId).getContext('2d');

    if (chartConfig[canvasId] && chartConfig[canvasId] !== null) {
        chartConfig[canvasId].destroy();
    }

    chartConfig[canvasId] = createDoughnutChart(chartCanvas, labels, data, backgroundColor, borderColor, legendPosition);
}

function updateBarChart(canvasId, labels, datasets, indexAxis, legendPosition, scalesConfig, aspectRatio) {
    const chartCanvas = document.getElementById(canvasId).getContext('2d');

    if (chartConfig[canvasId] && chartConfig[canvasId] !== null) {
        chartConfig[canvasId].destroy();
    }

    chartConfig[canvasId] = createBarChart(chartCanvas, labels, datasets, indexAxis, legendPosition, scalesConfig, aspectRatio);
}

function createDoughnutChart(chartCanvas, labels, data, backgroundColor, borderColor, legendPosition) {
    return new Chart(chartCanvas, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {
            cutout: '55%',
            plugins: {
                legend: {
                    display: true,
                    position: legendPosition
                },
                tooltip: {
                    enabled: true
                }
            },
            layout: {
                padding: {
                    top: 20,
                    bottom: 20,
                    left: 20,
                    right: 20
                }
            },
            aspectRatio: 1.5,
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

function createBarChart(chartCanvas, labels, datasets, indexAxis, legendPosition, scalesConfig, aspectRatio) {
    return new Chart(chartCanvas, {
        type: "bar",
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            indexAxis: indexAxis,
            plugins: {
                legend: {
                    display: true,
                    position: legendPosition
                }
            },
            scales: scalesConfig,
            aspectRatio: aspectRatio,
            responsive: true,
            maintainAspectRatio: true,
            layout: {
                padding: {
                    top: 20,
                    bottom: 20,
                    left: 20,
                    right: 20
                }
            }
        }
    });
}

/*=========================================================================
    CHARTING FUNCTIONS
==========================================================================*/

function updateChartValues_Cashier(netDeposit, netWithdraw) {
    const chartDataCash = [netDeposit, netWithdraw];
    const chartCanvasCash = document.getElementById('depositWithdrawalChart');
    const chartContextCash = chartCanvasCash.getContext('2d');

    if (chartConfig.netCashingChart !== null) {
        chartConfig.netCashingChart.destroy();
    }

    chartConfig.netCashingChart = new Chart(chartContextCash, {
        type: 'bar',
        data: {
            labels: [""],
            datasets: [
                {
                    label: "Net Deposits",
                    data: [chartDataCash[0]],
                    backgroundColor: "rgba(75, 192, 192, 0.5)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                    fill: true
                },
                {
                    label: "Net Withdrawals",
                    data: [chartDataCash[1]],
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                    fill: true
                }
            ]
        },
        options: {
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 5000,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: "rgba(0, 0, 0, 0.1)",
                        lineWidth: 1
                    },
                    title: {
                        display: false,
                        text: 'Amount (USD)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    title: {
                        display: false,
                        text: ''
                    }
                }
            }
        },
        aspectRatio: 1.8,
        responsive: true,
        maintainAspectRatio: true
    });
}

function updateChartValues_Currencies(weth, usdt, usdc, erc20) {
    const chartDataPie = [weth, usdt, usdc, erc20];
    const chartLabelsPie = ['WETH', 'USDT', 'USDC', 'ERC20'];
    const chartCanvasPie = document.getElementById('cashingPieChart');

    if (chartConfig.cashingPieChart !== null) {
        chartConfig.cashingPieChart.destroy();
    }

    chartConfig.cashingPieChart = createDoughnutChart('cashingPieChart', chartLabelsPie, chartDataPie, [
        'rgba(31, 72, 147, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(38, 161, 123, 0.6)',
        'rgba(255, 206, 86, 0.6)'
    ], [
        'rgba(51, 153, 255, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)'
    ], 'left');
}

//Do for all charts in one go
function updateChartValues_hedges(chartID, valueA, valueB) {
    if((valueA && valueB) == 0) {
        valueA= 50;
        valueB= 50;
    }
    const chartDataHedgeA = [valueA, valueB];

    let hedgeChartID, chartLabels;

    if (chartID == 1) {
        hedgeChartID = "hedgeBarChartA";
        chartLabels = ["Traded Hedges", "Created Hedges"];
    } else if (chartID == 2) {
        hedgeChartID = "hedgeBarChartB";
        chartLabels = ["Options Volume", "Swaps Volume"];
    } else if (chartID == 3) {
        hedgeChartID = "hedgeBarChartC";
        chartLabels = ["Hedge Costs", "Underlying Value"];
    } else if (chartID == 4) {
        hedgeChartID = "hedgeBarChartD";
        chartLabels = ["Hedge Profits", "Hedge Losses"];
    }

    // Check if the chart already exists and destroy it
    const existingChart = Chart.getChart(document.getElementById(hedgeChartID));
    if (existingChart) {
        existingChart.destroy();
    }

    const hedgeData = {
        labels: chartLabels,
        datasets: [
            {
                data: chartDataHedgeA,
                backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(75, 192, 192, 0.5)"],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    const hedgeChart = new Chart(document.getElementById(hedgeChartID), {
        type: "doughnut",
        data: hedgeData,
        options: {
            cutout: '55%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true
                }
            },
            aspectRatio: 1,
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

function updateChartValues_Revenue(cashierRevenue, hedgeRevenue, tokenRevenue) {
    if((hedgeRevenue && tokenRevenue) == 0) {
        hedgeRevenue= 50;
        tokenRevenue= 50;
    }
    const chartData = [cashierRevenue, hedgeRevenue, tokenRevenue];
    const chartLabelsRevenue = ['Cashier', 'Hedges', 'TokenTax'];

    const chartCanvasRevenue = document.getElementById('revenuesplitChart');

    if (chartConfig.revenuePieChart !== null) {
        chartConfig.revenuePieChart.destroy();
    }

    chartConfig.revenuePieChart = createDoughnutChart('revenuesplitChart', chartLabelsRevenue, chartData, [
        'rgba(181, 37, 232, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(75, 192, 192, 0.6)'
    ], [
        'rgba(107, 16, 170, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)'
    ], 'left');
}


function updateChartValues_Dividents(netRevenue, netDistributed) {
    if((netRevenue && netDistributed) == 0) {
        netRevenue= 50;
        netDistributed= 50;
    }
    const chartData = [netRevenue, netDistributed];
    const chartCanvasDividents = document.getElementById('dividentsChart');

    if (chartConfig.dividentsChart !== null) {
        chartConfig.dividentsChart.destroy();
    }

    chartConfig.dividentsChart = new Chart(chartCanvasDividents, {
        type: "bar",
        data: {
            labels: ["Present"],
            datasets: [
                {
                    label: "Net Revenue",
                    data: [chartData[0]],
                    backgroundColor: "rgba(75, 192, 192, 0.5)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                    fill: true
                },
                {
                    label: "Total Distributed",
                    data: [chartData[1]],
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                    fill: true
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: "rgba(0, 0, 0, 0.1)",
                        lineWidth: 1
                    },
                    title: {
                        display: true,
                        text: 'Amount (USD)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            },
            layout: {
                padding: {
                    top: 20,
                    bottom: 20,
                    left: 20,
                    right: 20
                }
            }
        },
        responsive: true,
        maintainAspectRatio: true
    });
}
function updateChartValues_Claims(netClaimed, netUnclaimed) {
    if((netClaimed && netUnclaimed) == 0) {
        netClaimed= 50;
        netUnclaimed= 50;
    }
    const chartData = [netClaimed, netUnclaimed];
    const chartLabelsClaims = ['Claimed', 'Unclaimed'];

    updateDoughnutChart('claimsChart', chartLabelsClaims, chartData, [
        'rgba(54, 162, 235, 0.6)',   // More vibrant blue
        'rgba(255, 206, 86, 0.6)'   // More vibrant yellow
    ], [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)'
    ]);
}

function updateChartValues_Staking(stakedSupply, circulatingSupply) {
    if((stakedSupply && circulatingSupply) == 0) {
        stakedSupply= 50;
        circulatingSupply= 50;
    }
    const chartDataStake = [stakedSupply, circulatingSupply];

    updateBarChart('stakedsupplyChart', [""], [
        {
            label: "Staked",
            data: [chartDataStake[0]],
            backgroundColor: "rgba(31, 72, 147, 0.5)",
            borderColor: "rgba(51, 153, 255, 1)"
        },
        {
            label: "C.Supply",
            data: [chartDataStake[1]],
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)"
        }
    ], 'y', 'top', {
        x: {
            beginAtZero: true,
            ticks: {
                stepSize: 50000000,
                font: {
                    size: 12,
                    weight: 'bold'
                }
            },
            grid: {
                color: "rgba(0, 0, 0, 0.1)",
                lineWidth: 1
            }
        }
    }, 1.8);
}

function updateChartValues_Tokenomics(burntSupplyT, circulatingSupplyT) {
    const chartData = [burntSupplyT, circulatingSupplyT];
    const chartLabelsTokenomics = ['Burnt', 'Circulating'];

    updateDoughnutChart('tokenomicsChart', chartLabelsTokenomics, chartData, [
        'rgba(255, 99, 132, 0.6)',   // More vibrant red
        'rgba(54, 162, 235, 0.6)'   // More vibrant blue
    ], [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)'
    ], 'right');
}

// Export the fetch functions
export { updateChartValues_Cashier, updateChartValues_Currencies, updateChartValues_hedges, updateChartValues_Revenue, updateChartValues_Dividents, updateChartValues_Claims, updateChartValues_Staking, updateChartValues_Tokenomics };