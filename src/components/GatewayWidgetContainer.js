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
            // Render the gateway widget
            <GatewayWidget
                pinned={this.props.pinned}
                heading={this.props.statusinfo._id}
                colspan={this.props.colspan}
                rowspan={this.props.rowspan}
                balance={this.props.statusinfo.balance}
                balanceDue={this.props.statusinfo.balanceDue}
                balanceCredit={this.props.statusinfo.balanceCredit}
                smsRemaining={this.props.statusinfo.remainingSMS}
                smsPackInfoDate={this.props.statusinfo.smsPackInfoDate}
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
                smsPackTrend={this.props.statusinfo.smsPackTrend}
                carrier={this.props.statusinfo.carrier}
                lastSMSInDate={this.props.statusinfo.lastSMSInDate}
                controls={this.props.controlinfo}
                settings={this.props.settings}
                maxBalance={this.props.maxBalance}
                requestFCM={this.props.requestFCM}
                togglePin={this.props.togglePin}
                />
        );
    }
}

// Enforce the type of props to send to this component
GatewayWidgetContainer.propTypes = {
    pinned: PropTypes.bool,
    heading: PropTypes.string,
    colspan: PropTypes.number,
    rowspan: PropTypes.number,
    gatewayinfo: PropTypes.object,
    statusinfo: PropTypes.object,
    controlinfo: PropTypes.array,
    loading: PropTypes.bool,
    settings: PropTypes.object,    
    getColorForPercentage: PropTypes.func,
    getColorForDate: PropTypes.func,
    maxBalance: PropTypes.number,
    requestFCM: PropTypes.func,
    togglePin: PropTypes.func,
}

export default GatewayWidgetContainer;