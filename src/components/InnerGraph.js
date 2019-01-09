import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

//Import graphing component
import { Line } from 'react-chartjs-2';

class InnerGraph extends Component {

    getColorForBalanceTrend(getColor, balanceTrend, safeBalance) {
        let colorArray = [];
        balanceTrend.forEach(function (balanceInfo) {
            var percent = balanceInfo.y / safeBalance;
            colorArray.push(getColor(percent));
        });
        return colorArray;
    }

    constructor(props) {
        super(props);

        // Set the initial state for the graphing component
        this.state = {
            values: {
                //labels: ["24", "20", "16", "12", "8", "4"],
                datasets: []
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                scaleShowGridLines: false,
                title: {
                    display: false,
                    text: 'Balance Trend',
                    fontFamily: "'Didact Gothic', sans-serif",
                    fontSize: 12,
                    fontColor: "#ecf0f1",
                },
                tooltips: {
                    titleFontSize: 10,
                    bodyFontSize: 12
                },
                hover: {
                    mode: 'nearest', // only hovers items under the mouse
                    intersect: false
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                'hour': 'HH:MM'
                            }
                        },
                        ticks: {
                            source: 'data',
                            autoSkip: true,
                            autoSkipPadding: 1,
                            maxTicksLimit: 3,
                            maxRotation: 0,
                            minRotation: 0,
                            fontFamily: "'Didact Gothic', sans-serif",
                            fontSize: 8,
                            fontColor: "#ecf0f1"
                        },
                        gridLines: {
                            display: true
                        }
                    }],
                    yAxes: [{
                        id: 'balance',
                        scaleLabel: {
                            display: false,
                            labelString: 'Balance'
                        },
                        ticks: {
                            fontFamily: "'Didact Gothic', sans-serif",
                            fontSize: 8,
                            fontColor: "#ecf0f1",
                            maxTicksLimit: 3,
                            beginAtZero: true,
                            suggestedMax: props.maxBalance
                        },
                        display: true,
                        gridLines: {
                            display: true,
                            drawBorder: true
                        }
                    },
                    {
                        id: 'sms',
                        scaleLabel: {
                            display: false,
                            labelString: 'SMS Pack'
                        },
                        ticks: {
                            fontFamily: "'Didact Gothic', sans-serif",
                            fontSize: 8,
                            fontColor: "#ecf0f1",
                            maxTicksLimit: 3,
                            beginAtZero: true,
                            suggestedMax: 1000
                        },
                        display: true,
                        position: 'right',
                        gridLines: {
                            display: true,
                            drawBorder: true
                        }
                    }],
                },
                legend: {
                    display: false
                }
            }
        }
    }


    // Update the state based on changing props
    componentWillReceiveProps(nextProps) {
        if (this.props.balanceData !== nextProps.balanceData ||
            this.props.smsData !== nextProps.smsData ||
            this.props.settings.safeBalance != nextProps.settings.safeBalance) {
            //Only update if the data has actually changed
            this.generateDatasets(nextProps);
        }
    }

    componentDidMount() {
        this.generateDatasets(this.props);
    }

    //Convert the data received in props to a format the graphing component likes
    generateDatasets(props) {
        let datasets = [];
        let chartOptions = this.state.chartOptions;

        //Create a dataset object that Chart.js can understand
        var balanceTrend = cloneDeep(props.balanceData);
        var smsTrend = cloneDeep(props.smsData);
        var maxBalance = props.maxBalance;

        if (balanceTrend) {

            balanceTrend.forEach(function (balanceInfo) {
                if (balanceInfo.x == null && balanceInfo.y == null) {//don't change if already present
                    balanceInfo.x = balanceInfo.date;
                    balanceInfo.y = balanceInfo.bal;
                    delete balanceInfo.bal;
                    delete balanceInfo.date;
                }
            });
            balanceTrend.sort(function (a, b) { return a.x - b.x });

            datasets.push({
                label: 'Balance',
                yAxisID: 'balance',
                data: balanceTrend,
                fill: false,
                tension: 0,
                borderColor: '#0493f2',
                borderWidth: 1,
                pointRadius: 2,
                pointHitRadius: 6,
                pointBackgroundColor: this.getColorForBalanceTrend(this.props.getColor, balanceTrend, props.settings.safeBalance),
                pointBorderColor: 'white',
                pointBorderWidth: 1
            });
        }
        if (smsTrend) {
            smsTrend.forEach(function (smsInfo) {
                if (smsInfo.x == null && smsInfo.y == null) {//don't change if already present
                    smsInfo.x = smsInfo.date;
                    smsInfo.y = smsInfo.sms;
                    delete smsInfo.sms;
                    delete smsInfo.date;
                }
            });
            smsTrend.sort(function (a, b) { return a.x - b.x });
            //console.log(smsTrend);
            datasets.push({
                label: 'SMS',
                yAxisID: 'sms',
                data: smsTrend,
                fill: false,
                tension: 0,
                borderColor: '#9604f2',
                borderWidth: 1,
                pointRadius: 2,
                pointHitRadius: 6,
                pointBackgroundColor: this.getColorForBalanceTrend(this.props.getColor, smsTrend, 300),
                pointBorderColor: 'white',
                pointBorderWidth: 1
            });

        }
        //console.log(maxBalance);
        chartOptions.scales.yAxes[0].ticks.suggestedMax = maxBalance;

        //Let the React wrapper for Chart.js update the view
        this.setState({
            values: {
                datasets,
                chartOptions
            }
        });
    }

    render() {
        return (
            <div className={this.props.settings.showBalanceTrend ? "graph" : "graph invisible"}>
                <Line ref="lineChart" data={this.state.values} options={this.state.chartOptions} width={100} height={50} />
            </div>
        );
    }
}

// Enforce the type of props to send to this component
InnerGraph.propTypes = {
    balanceData: PropTypes.arrayOf(PropTypes.object),
    smsData: PropTypes.arrayOf(PropTypes.object),
    getColor: PropTypes.func,
    maxBalance: PropTypes.number
}

export default InnerGraph;