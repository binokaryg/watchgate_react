import React, { Component } from 'react';
import PropTypes from 'prop-types';


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
                scales: {
                    xAxes: [{
                        type: 'time',
                        ticks: {
                            source: 'data',
                            maxTicksLimit: 3,
                            fontFamily: "'Didact Gothic', sans-serif",
                            fontSize: 8,
                            fontColor: "#ecf0f1"
                        },
                        gridLines: {
                            display: true
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            fontFamily: "'Didact Gothic', sans-serif",
                            fontSize: 8,
                            fontColor: "#ecf0f1",
                            maxTicksLimit: 3
                        },
                        display: true,
                        gridLines: {
                            display: true,
                            drawBorder: true,
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
        if (this.props.data !== nextProps.data || this.props.settings.safeBalance != nextProps.settings.safeBalance) {
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

        //Create a dataset object that Chart.js to understand
        var balanceTrend = props.data;

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
            data: balanceTrend,
            fill: false,
            tension: 0,
            borderColor: '#0493f2',
            borderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 10,
            pointBackgroundColor: this.getColorForBalanceTrend(this.props.getColor, balanceTrend, props.settings.safeBalance),
            pointBorderColor: 'white',
            pointBorderWidth: 1
        });

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
    data: PropTypes.arrayOf(PropTypes.object),
    getColor: PropTypes.func
}

export default InnerGraph;