import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Widget from '../components/Widget';
import BalanceDisplay from '../components/BalanceDisplay';
import WifiDisplay from '../components/WifiDisplay';
import DateDisplay from './DateDisplay';
import BatteryDisplay from './BatteryDisplay';
import TempDisplay from './TempDisplay';
import InnerGraph from './InnerGraph';

//Import styling
import '../../static/GatewayWidget.scss';
import SMSPackDisplay from './SMSPackDisplay';
import Button from './UIControls/Button';



class GatewayWidget extends Component {



    constructor(props) {
        super(props);
        this.state = {
            postpaid: false
        };
        if ((this.props.balance == null) && this.props.balanceDue > -1) {
            this.state.postpaid = true;
        }
        else {
            this.state.postpaid = false;
        }
    }
    // Decide whether to show widget
    showWidget() {
        // Show loading indicator while initial data is being fetched
        if (this.props.date === undefined) {
            return <p>Loading...</p>;
        }

        return <div className="stats">
            <div className="vitals">
                <BalanceDisplay
                    balance={this.props.balance}
                    balanceDue={this.props.balanceDue}
                    balanceCredit={this.props.balanceCredit}
                    postpaid={this.state.postpaid}
                    getColor={this.props.getColorForPercentage}
                    safeBalance={this.props.settings.safeBalance}
                />
                <DateDisplay date={this.props.balanceDate} dateFor="Balance" getColorForDate={this.props.getColorForDate} />
                <SMSPackDisplay smsRemaining={this.props.smsRemaining} smsPackInfoDate={this.props.smsPackInfoDate} getColor={this.props.getColorForPercentage} />
                <DateDisplay date={this.props.smsPackInfoDate} dateFor="SMS Pack" getColorForDate={this.props.getColorForDate} />
                <WifiDisplay wifi={this.props.wifi} wifiStrength={this.props.wifiStrength} getColor={this.props.getColorForPercentage} />
                <BatteryDisplay battery={this.props.battery} getColor={this.props.getColorForPercentage} />
                <TempDisplay temp={this.props.temp} getColor={this.props.getColorForPercentage} />
                {/* Conditionally show the progress bar */}
            </div>

            <InnerGraph
                balanceData={this.props.balanceTrend}
                smsData={this.props.smsPackTrend}
                id={this.props.heading}
                getColor={this.props.getColorForPercentage}
                settings={this.props.settings}
                maxBalance={this.props.maxBalance}
            />
        </div>
    }

    render() {
        return (
            <div>
                <Widget
                    heading={this.props.heading}
                    colspan={this.props.colspan}
                    rowspan={this.props.rowspan}
                    loading={this.props.loading}
                    plugged={this.props.plugged}
                    data={this.props.data}
                    date={this.props.date}
                    carrier={this.props.carrier}
                    lastSMSInDate={this.props.lastSMSInDate}
                    controls={this.props.controls}
                    settings={this.props.settings}
                    getColor={this.props.getColorForPercentage}
                    getColorForDate={this.props.getColorForDate}
                    balanceData={this.props.balanceTrend}
                    smsData={this.props.smsPackTrend}
                    requestFCM={this.props.requestFCM}
                >
                    {this.showWidget()}
                </Widget>
            </div>
        );
    }
}

// Enforce the type of props to send to this component
GatewayWidget.propTypes = {
    heading: PropTypes.string,
    colspan: PropTypes.number,
    rowspan: PropTypes.number,
    loading: PropTypes.bool.isRequired,
    balance: PropTypes.number,
    balanceDue: PropTypes.number,
    balanceCredit: PropTypes.number,
    smsRemaining: PropTypes.number,
    smsPackInfoDate: PropTypes.object,
    plugged: PropTypes.bool,
    wifi: PropTypes.string,
    wifiStrength: PropTypes.number,
    date: PropTypes.object,
    balanceDate: PropTypes.object,
    battery: PropTypes.number,
    temp: PropTypes.number,
    data: PropTypes.bool,
    carrier: PropTypes.string,
    balanceTrend: PropTypes.arrayOf(PropTypes.object),
    smsPackTrend: PropTypes.arrayOf(PropTypes.object),
    lastSMSInDate: PropTypes.object,
    controls: PropTypes.array,
    settings: PropTypes.object,
    getColorForPercentage: PropTypes.func,
    getColorForDate: PropTypes.func,
    maxBalance: PropTypes.number,
    requestFCM: PropTypes.func
}


export default GatewayWidget;