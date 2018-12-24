import React, { Component } from 'react';

// Import widgets being used in this component

// Add in styles
import '../../static/Dashboard.scss';
import sampleData from '../../static/sample_data.js';
import GatewayWidgetContainer from '../components/GatewayWidgetContainer';
import TimeAgo from 'react-timeago';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoins, faPlug, faWifi, faClock, faBatteryFull, faThermometerHalf, faExchangeAlt, faSync, faBroadcastTower, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Circle } from 'rc-progress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ErrorReload from './ErrorReload';

library.add(faCoins, faPlug, faWifi, faClock, faBatteryFull, faThermometerHalf, faExchangeAlt, faSync, faBroadcastTower, faEnvelope);

class Dashboard extends Component {
    getColorForPercentage(percent) {
        return getColorForPercent(percent);
    }

    getPercentageForElapsedTime(refTime, max) {
        var now = this.state.curTime;
        var diff = now - refTime.getTime();
        var res = 100 * diff / max;
        return res;
    }

    getColorForDate(date, maxInterval) {
        var now = new Date();
        var diff = now - date;
        var percent = 1 - (diff / maxInterval);
        return getColorForPercent(percent);
    }

    showPopup() {
        this.setState({
            showReloadPopup: true
        });
    }

    closePopup() {
        this.setState({
            showReloadPopup: false
        });
    }

    closePopupAndReload() {
        this.closePopup();
        window.location.reload();
    }

    loadGatewayStatus() {

        this.setState({ loading: true });
        if (this.state.mock) {
            const resultJSON = sampleData.recentData;
            /* ES5 */
            var successful = Math.random() > 0.5 ? true : false;
            // Promise
            var getMockData = new Promise(
                function (resolve, reject) {
                    if (successful) {
                        var result = resultJSON;
                        resolve(result); // fulfilled
                    } else {
                        var reason = new Error('not happy');
                        reject(reason); // reject
                    }
                }
            );

            let obj = this;
            return getMockData.then(docs => {
                console.log(`Data: ${JSON.stringify(docs)}`);
                setTimeout(function () {
                    obj.setState({ gateways: docs, requestPending: false });
                    obj.setState({ loading: false, lastUpdate: new Date() });
                }, (3 * 1000)); //add 3 sec delay
            })

                .catch(ex => {
                    console.error("Error while loading status: " + ex.message);
                    this.showPopup();
                });
        }

        else {
            if (!this.client.auth.isLoggedIn) {
                return this.loadGatewayUnavailableStatus();
            }
            let obj = this;
            return this.client.callFunction("getRecentStatusForAll3").then(docs => {
                //console.log(`Balance: ${JSON.stringify(docs)}`);
                obj.setState({ gateways: docs, requestPending: false });
                this.setState({ loading: false, lastUpdate: new Date() });

            })

                .catch(ex => {
                    console.error("Error while loading status: " + ex.message);
                    this.showPopup();
                });
        }

    }

    loadGatewayUnavailableStatus() {
        // Promise
        var getMessage = new Promise(
            function (resolve, reject) {
                resolve("Unauthorized"); // fulfilled
            }
        );
        return getMessage.then(docs => {
            console.log('Unauthorized');
        });


    }

    constructor(props) {
        super(props);

        this.state = {
            gateways: [],
            loading: false,
            lastUpdate: new Date(),
            mock: false,
            showReloadPopup: false
        };
        this.client = props.client;
        this.gateways = props.gateways;
        this.loadGatewayStatus = this.loadGatewayStatus.bind(this);
    }

    componentWillMount() {
        //this.loadGatewayStatus();
    }

    componentDidMount() {
        //console.log(sampleData.oldData);
        this.loadGatewayStatus().then(_ => {
            // Re-fetch every 10 minutes
            this.interval = setInterval(this.loadGatewayStatus, updateDurationSec * 1000);
        });

        setInterval(() => {
            this.setState({
                curTime: (new Date()).getTime()
            })
        }, 3000)

    }

    setPending() {
        this.setState({ requestPending: true });
    }

    render() {
        let loggedInResult = (
            <div>
                {this.state.showReloadPopup ?
                    <ErrorReload
                        text='Error'
                        closePopup={this.closePopup.bind(this)}
                        reload={this.closePopupAndReload.bind(this)}
                    />
                    : null
                }
                <div className="top-right">
                    <div className="timeago">
                        {this.state.loading ?
                            <span>Updating</span>
                            :
                            <span style={{ color: this.getColorForDate(this.state.lastUpdate, 12 * 60 * 60 * 1000) }}>
                                Updated <TimeAgo date={this.state.lastUpdate} title={new Date(this.state.lastUpdate).toString()} />
                            </span>
                        }
                    </div>

                    <div className="update" onClick={this.loadGatewayStatus} title={this.state.loading ? 'Updating' : "Will be updated in " + Math.round(updateDurationSec - ((new Date()).getTime() - this.state.lastUpdate.getTime()) / 1000) + " seconds.\nClick to update now."}>
                        <div className="progress">
                            <Circle percent={this.getPercentageForElapsedTime(this.state.lastUpdate, updateDurationSec * 1000)} strokeWidth="10" strokeColor="#FFFFFF" />
                        </div>
                        <div className={this.state.loading ? "sync-icon loading" : "sync-icon"}>
                            <FontAwesomeIcon icon="sync" />
                        </div>
                    </div>
                </div>

                <div className="Dashboard">
                    {this.state.gateways.length == 0
                        ? <div className="list-empty-label">Loading...</div>
                        : this.state.gateways.map(gateway => {
                            return (
                                <GatewayWidgetContainer
                                    key={gateway._id}
                                    heading={gateway._id}
                                    statusinfo={gateway}
                                    loading={this.state.loading}
                                    colspan={1}
                                    onChange={() => this.loadGatewayStatus()}
                                    onStartChange={() => this.setPending()}
                                    getColorForPercentage={this.getColorForPercentage}
                                    getColorForDate={this.getColorForDate}
                                    settings={this.props.settings}
                                />
                            );
                        })}
                </div>
            </div>
        );
        return this.client.auth.isLoggedIn ? loggedInResult : null;
    }

}

var getColorForPercent = function (pct) {
    {
        for (var i = 1; i < percentColors.length - 1; i++) {
            if (pct < percentColors[i].pct) {
                break;
            }
        }
        var lower = percentColors[i - 1];
        var upper = percentColors[i];
        var range = upper.pct - lower.pct;
        var rangePct = (pct - lower.pct) / range;
        var pctLower = 1 - rangePct;
        var pctUpper = rangePct;
        var color = {
            r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
            g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
            b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
        };
        return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
        // or output as hex if preferred
    }
}

var percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0x00 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0x00 } },
    { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0x00 } }];

var updateDurationSec = 600;
export default Dashboard;