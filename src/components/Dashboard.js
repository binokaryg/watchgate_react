import React, { Component } from 'react';
import axios from 'axios';

// Import widgets being used in this component

// Add in styles
import '../../static/Dashboard.scss';
import sampleData from '../../static/sample_data.js';
import GatewayWidgetContainer from '../components/GatewayWidgetContainer';
import TimeAgo from 'react-timeago';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoins, faPlug, faWifi, faBatteryFull, faThermometerHalf, faExchangeAlt, faSync, faBroadcastTower, faEnvelope, faClock, faSyringe, faMoneyCheck } from '@fortawesome/free-solid-svg-icons';
import { Circle } from 'rc-progress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ErrorReload from './ErrorReload';

library.add(faCoins, faPlug, faWifi, faBatteryFull, faThermometerHalf, faExchangeAlt, faSync, faBroadcastTower, faEnvelope, faClock, faSyringe, faMoneyCheck);

class Dashboard extends Component {

    requestFCM = (instance, task) => {
        let request = `${this.props.settings.notificationURL}?topic=${instance}&title=${task}&body=${encodeURI("Requested by " + this.props.username)}`;
        //console.log(request);
        let validURLRegex = '^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$'
        let check = new RegExp(validURLRegex, 'i');
        if (check.test(request)) {
            axios.get(request)
                .then(res => {
                    console.log(res);
                    alert(res.data);
                })
        }
        else {
            console.log(`URL validation failed: ${request}`)
        }
    }
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

    showErrorPopup() {
        this.setState({
            showReloadPopup: true
        });
    }

    closeErrorPopup() {
        this.setState({
            showReloadPopup: false
        });
    }


    closePopupAndReload() {
        this.closeErrorPopup();
        window.location.reload();
    }

    traverse(object, func, key, offset) {
        for (var i in object) {
            func.apply(this, [object, i, key, offset]);
            if (object[i] !== null && typeof (object[i]) == "object") {
                //going one step down in the object tree!!
                this.traverse(object[i], func, key, offset);
            }
        }
    }

    resetDate(object, key, keyToChange, refDate) {
        if (key === keyToChange) {
            var hrs = object[key];
            var date = new Date(refDate - hrs * 60 * 60 * 1000);
            object[key] = date;
            //console.log(key, keyToChange, refDate, hrs, date);
        }
    }

    setDate(data, newReferenceDate) {
        // Sets the newDate as the form's reported date, and modifies other dates in doc by the same offset
        this.traverse(data, this.resetDate, "date", newReferenceDate);
        this.traverse(data, this.resetDate, "balanceDate", newReferenceDate);
        this.traverse(data, this.resetDate, "lastSMSInDate", newReferenceDate);
        this.traverse(data, this.resetDate, "smsPackInfoDate", newReferenceDate);
    }

    loadUserAdminInstances() {
        this.setState({ loading: true });
        if (this.state.mock) {
            const userJSON = sampleData.userData;
            /* ES5 */
            var successful = true; // Math.random() > 0.5 ? true : false;
            // Promise
            var getMockUser = new Promise(
                function (resolve, reject) {
                    if (successful) {
                        var result = userJSON;
                        resolve(result); // fulfilled
                    } else {
                        var reason = new Error('not happy');
                        reject(reason); // reject
                    }
                }
            );

            let obj = this;
            return getMockUser.then(user => {
                //console.log(`Data: ${JSON.stringify(user)}`);
                setTimeout(function () {
                    obj.setState({ instances: user[0].admin });
                }, (3 * 1000)); //add 3 sec delay
            })

                .catch(ex => {
                    console.error("Error while loading user instances: " + ex.message);
                    this.showErrorPopup();
                });
        }

        else {
            if (!this.client.auth.isLoggedIn) {
                return this.loadGatewayUnavailableStatus();
            }
            let obj = this;
            return this.client.callFunction("getAdminInstancesForUser").then(docs => {
                //console.log(`Balance: ${JSON.stringify(docs)}`);
                obj.setState({ instances: docs, requestPending: false });
            })

                .catch(ex => {
                    console.error("Error while loading user instances: " + ex.message);
                    this.showErrorPopup();
                });
        }
    }

    loadGatewayStatus() {

        this.setState({ loading: true });
        if (this.state.mock) {
            const resultJSON = sampleData.recentData;
            this.setDate(resultJSON, new Date());
            /* ES5 */
            var successful = true; // Math.random() > 0.5 ? true : false;
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
                //console.log(`Data: ${JSON.stringify(docs)}`);
                setTimeout(function () {
                    obj.setState({ gateways: docs, requestPending: false, maxBalance: getMaxBalanceFromData(docs) });
                    obj.setState({ loading: false, lastUpdate: new Date() });
                }, (3 * 1000)); //add 3 sec delay
            })

                .catch(ex => {
                    console.error("Error while loading status: " + ex.message);
                    this.showErrorPopup();
                });
        }

        else {
            if (!this.client.auth.isLoggedIn) {
                return this.loadGatewayUnavailableStatus();
            }
            let obj = this;
            return this.client.callFunction("getRecentStatusForUserContext").then(docs => {
                //console.log(`Balance: ${JSON.stringify(docs)}`);
                docs.sort(function (a, b) { return (a._id.toLowerCase() > b._id.toLowerCase()) ? 1 : ((b._id.toLowerCase() > a._id.toLowerCase()) ? -1 : 0) });
                obj.setState({ gateways: docs, requestPending: false });
                obj.setState({ loading: false, lastUpdate: new Date(), maxBalance: getMaxBalanceFromData(docs) });

            })

                .catch(ex => {
                    console.error("Error while loading status: " + ex.message);
                    this.showErrorPopup();
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
            instances: [],
            loading: false,
            lastUpdate: new Date(),
            mock: false,
            maxBalance: 10000,
            showReloadPopup: false
        };
        this.client = props.client;
        this.gateways = props.gateways;
        this.loadUserAdminInstances = this.loadUserAdminInstances.bind(this);
        this.loadGatewayStatus = this.loadGatewayStatus.bind(this);
    }

    componentWillMount() {
        //this.loadGatewayStatus();
    }

    componentDidMount() {
        //console.log(sampleData.oldData);
        this.loadUserAdminInstances();

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
                        closePopup={this.closeErrorPopup.bind(this)}
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
                {this.state.instances.length > 0 ?
                    <div className="Dashboard" style={{ borderBottom: "1px solid #ccc" }}>
                        {this.state.gateways.length == 0
                            ? <div className="list-empty-label">Loading...</div>
                            : this.state.gateways.map(gateway => {
                                if (this.state.instances.includes(gateway._id.toLowerCase())) {
                                    return (
                                        <GatewayWidgetContainer
                                            key={gateway._id}
                                            heading={gateway._id}
                                            statusinfo={gateway}
                                            controlinfo={this.state.instances}
                                            loading={this.state.loading}
                                            colspan={1}
                                            onChange={() => this.loadGatewayStatus()}
                                            onStartChange={() => this.setPending()}
                                            getColorForPercentage={this.getColorForPercentage}
                                            getColorForDate={this.getColorForDate}
                                            settings={this.props.settings}
                                            maxBalance={this.state.maxBalance}
                                            requestFCM={this.requestFCM}
                                        />
                                    );
                                }
                            })}
                    </div> : null}
                {this.state.instances.length > 0 ? <br /> : null}
                <div className="Dashboard">
                    {this.state.gateways.length == 0
                        ? <div className="list-empty-label">Loading...</div>
                        : this.state.gateways.map(gateway => {
                            if (!this.state.instances.includes(gateway._id.toLowerCase())) {
                                return (
                                    <GatewayWidgetContainer
                                        key={gateway._id}
                                        heading={gateway._id}
                                        statusinfo={gateway}
                                        controlinfo={this.state.instances}
                                        loading={this.state.loading}
                                        colspan={1}
                                        onChange={() => this.loadGatewayStatus()}
                                        onStartChange={() => this.setPending()}
                                        getColorForPercentage={this.getColorForPercentage}
                                        getColorForDate={this.getColorForDate}
                                        settings={this.props.settings}
                                        maxBalance={this.state.maxBalance}
                                        requestFCM={this.requestFCM}
                                    />
                                );
                            }
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

var getMaxBalanceFromData = function (data) {
    var max = 0;
    //console.log("data", data);
    data.forEach(function (gateway) {
        //console.log("gateway", gateway);
        gateway.balanceTrend.forEach(function (balanceInfo) {
            //console.log(balanceInfo);
            if (max < balanceInfo.y) {
                max = balanceInfo.y;
            }

            else if (max < balanceInfo.bal) {
                max = balanceInfo.bal
            }
        });
    });
    //console.log("max", max);
    return Math.min(max, 5000);
}

var percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0x00 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0x00 } },
    { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0x00 } }];

var updateDurationSec = 600;
export default Dashboard;