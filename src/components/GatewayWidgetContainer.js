import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import components
import GatewayWidget from '../components/GatewayWidget';

class GatewayWidgetContainer extends Component {
    constructor() {
        super();

        // Set initial state
        this.state = {
        }
    }

    componentDidMount() {
    }


    render() {
        return (
            // Render the number widget
            <GatewayWidget
                heading={this.props.statusinfo._id}
                colspan={this.props.colspan}
                rowspan={this.props.rowspan}
                balance={this.props.statusinfo.balance}
                balanceDue={this.props.statusinfo.balanceDue}
                balanceCredit={this.props.statusinfo.balanceCredit}
                smsRemaining={this.props.statusinfo.remainingSMS}
                loading={this.props.loading}
                plugged={this.props.statusinfo.charging}
                wifi={this.props.statusinfo.wifi}
                wifiStrength={this.props.statusinfo.wifiStrength}
                date={this.props.statusinfo.date}
                balanceDate={this.props.statusinfo.balanceDate}
                temp={this.props.statusinfo.temp}
                battery={this.props.statusinfo.battery}
                data={this.props.statusinfo.data}
                getColorForPercentage={this.props.getColorForPercentage}
                getColorForDate={this.props.getColorForDate}
                balanceTrend={this.props.statusinfo.balanceTrend}
                carrier={this.props.statusinfo.carrier}
                lastSMSInDate={this.props.statusinfo.lastSMSInDate}
                settings={this.props.settings}
                />
        );
    }
}

// Enforce the type of props to send to this component
GatewayWidgetContainer.propTypes = {
    heading: PropTypes.string,
    colspan: PropTypes.number,
    rowspan: PropTypes.number,
    gatewayinfo: PropTypes.object,
    statusinfo: PropTypes.object,
    loading: PropTypes.bool,
    getColorForPercentage: PropTypes.func,
    getColorForDate: PropTypes.func
}

export default GatewayWidgetContainer;