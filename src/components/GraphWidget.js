import React, { Component } from 'react';
import PropTypes from 'prop-types';

//Import graphing component
import { Line } from 'react-chartjs-2';

// Import styling
import '../../static/GraphWidget.scss';

class GraphWidget extends Component {
    constructor(props) {
        super(props);

        // Set the initial state for the graphing component
        this.state = {
            values: {
                labels: ["24", "20", "16", "12", "8", "4"],
                datasets: []
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                scaleShowGridLines: false,
                scales: {
                    xAxes: [{
                        ticks: {
                            fontFamily: "'Didact Gothic', sans-serif",
                            fontSize: 18,
                            fontColor: "#ecf0f1",
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontFamily: "'Didact Gothic', sans-serif",
                            fontSize: 18,
                            fontColor: "#ecf0f1",
                        },
                        gridLines: {
                            display: false
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
        if (this.props.data !== nextProps.data) {
            //Only update if the data has actually changed
            this.generateDatasets(nextProps);
        }
    }

    //Convert the data received in props to a format the graphing component likes
    generateDatasets(props) {
        let datasets = [];

        //Create a dataset object that Chart.js to understand
        props.data.forEach(function (data) {
            var balanceTrend = data.balanceTrend.slice();
            balanceTrend.forEach(function (balanceInfo) {
                balanceInfo.x = new Date(balanceInfo.date);
                balanceInfo.y = balanceInfo.bal;
                delete balanceInfo.bal;
                delete balanceInfo.date;
            });
            balanceTrend.sort(function (a, b) { return a.x - b.x });

            datasets.push({
                label: data._id,
                data: data.balanceTrend,
                fill: false,
                tension: 0,
                borderColor: 'green',
                borderWidth: 4,
                pointRadius: 6,
                pointHitRadius: 10,
                pointBackgroundColor: 'blue',
                pointBorderColor: 'red',
                pointBorderWidth: 1
            });
        }, this);

        //Let the React wrapper for Chart.js update the view
        this.setState({
            values: {
                datasets
            }
        });
    }

    render() {
        return (
            <div className="GraphWidget">
                <Line data={this.state.values} options={this.state.chartOptions} />
            </div>
        );
    }
}

// Enforce the type of props to send to this component
GraphWidget.propTypes = {
    heading: PropTypes.string,
    colspan: PropTypes.number,
    rowspan: PropTypes.number,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.arrayOf(PropTypes.object)
}

export default GraphWidget;