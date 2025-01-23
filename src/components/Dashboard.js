import React, { Component } from 'react';
import axios from 'axios';

// Import widgets being used in this component

// Add in styles
import '../../static/Dashboard.scss';
import sampleData from '../../static/sample_data.js';
import GatewayWidgetContainer from '../components/GatewayWidgetContainer';
import TimeAgo from 'react-timeago';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoins, faPlug, faWifi, faBatteryFull, faThermometerHalf, faExchangeAlt, faSync, faBroadcastTower, faEnvelope, faClock, faSyringe, faMoneyCheck, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { Circle } from 'rc-progress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ErrorReload from './ErrorReload';

library.add(faCoins, faPlug, faWifi, faBatteryFull, faThermometerHalf, faExchangeAlt, faSync, faBroadcastTower, faEnvelope, faClock, faSyringe, faMoneyCheck, faThumbtack);

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
        const now = this.state.curTime;
        const diff = now - refTime.getTime();
        const res = 100 * diff / max;
        return res;
    }

    getColorForDate(date, maxInterval) {
        const now = new Date();
        const diff = now - date;
        const percent = 1 - (diff / maxInterval);
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
        for (let i in object) {
            func.apply(this, [object, i, key, offset]);
            if (object[i] !== null && typeof (object[i]) == "object") {
                //going one step down in the object tree!!
                this.traverse(object[i], func, key, offset);
            }
        }
    }

    resetDate(object, key, keyToChange, refDate) {
        if (key === keyToChange) {
            const hrs = object[key];
            const date = new Date(refDate - hrs * 60 * 60 * 1000);
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
            const successful = true; // Math.random() > 0.5 ? true : false;
            // Promise
            const getMockUser = new Promise(
                function (resolve, reject) {
                    if (successful) {
                        const result = userJSON;
                        resolve(result); // fulfilled
                    } else {
                        const reason = new Error('not happy');
                        reject(reason); // reject
                    }
                }
            );

            let obj = this;
            return getMockUser.then(user => {
                //console.log(`Data: ${JSON.stringify(user)}`);
                setTimeout(function () {
                    obj.setState({ adminGateways: user[0].admin, requestPending: false });
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
                const pinnedGateways = JSON.parse(localStorage.getItem('pinnedGateways')) || [];
                obj.setState({ adminGateways: docs, pinnedGateways: pinnedGateways.concat(docs), requestPending: false });
            })

                .catch(ex => {
                    console.error("Error while loading user instances: " + ex.message);
                    this.showErrorPopup();
                });
        }
    }

    //Call MongoDB function "listGateways"
    //It returns in this format:
    // {
    //     "gateway1": "+9779812345678",
    //     "gateway2": "+9779812345679",
    //     ..
    // }
    loadGatewayNumbers() {
        this.setState({ loading: true });
        if (this.state.mock) {
            const resultJSON = sampleData.gatewayNumbers;
            /* ES5 */
            const successful = true; // Math.random() > 0.5 ? true : false;
            // Promise
            const getMockData = new Promise(
                function (resolve, reject) {
                    if (successful) {
                        const result = resultJSON;
                        resolve(result); // fulfilled
                    } else {
                        const reason = new Error('not happy');
                        reject(reason); // reject
                    }
                }
            );

            let obj = this;
            return getMockData.then(docs => {
                //console.log(`Data: ${JSON.stringify(docs)}`);
                setTimeout(function () {
                    obj.setState({ gatewayNumbers: docs, requestPending: false });
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
            return this.client.callFunction("listGateways").then(docs => {
                obj.setState({ gatewayNumbers: docs, requestPending: false });
            })

                .catch(ex => {
                    console.error("Error while loading status: " + ex.message);
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
            const successful = true; // Math.random() > 0.5 ? true : false;
            // Promise
            const getMockData = new Promise(
                function (resolve, reject) {
                    if (successful) {
                        const result = resultJSON;
                        resolve(result); // fulfilled
                    } else {
                        const reason = new Error('not happy');
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
        const getMessage = new Promise(
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
            adminGateways: [],
            loading: false,
            lastUpdate: new Date(),
            mock: false,
            maxBalance: 10000,
            showReloadPopup: false,
            pinnedGateways: [],
            gatewayNumbers: null
        };
        this.client = props.client;
        this.gateways = props.gateways;
        this.gatewayNumbers = props.gatewayNumbers;
        this.loadUserAdminInstances = this.loadUserAdminInstances.bind(this);
        this.loadGatewayStatus = this.loadGatewayStatus.bind(this);
        this.loadGatewayNumbers = this.loadGatewayNumbers.bind(this);
        this.togglePin = this.togglePin.bind(this);
    }

    togglePin(gatewayId) {
        this.setState(prevState => {
            const isPinned = prevState.pinnedGateways.includes(gatewayId.toLowerCase());
            const newPinnedGateways = isPinned
                ? prevState.pinnedGateways.filter(id => id !== gatewayId.toLowerCase()).map(id => id.toLowerCase())
                : [...prevState.pinnedGateways, gatewayId];

            // Save to local storage
            localStorage.setItem('pinnedGateways', JSON.stringify(newPinnedGateways));

            return {
                pinnedGateways: newPinnedGateways
            };
        });
    }

    componentWillMount() {
        //this.loadGatewayStatus();
    }

    componentDidMount() {
        //console.log(sampleData.oldData);// Load pinned gateways from local storage
        const pinnedGateways = JSON.parse(localStorage.getItem('pinnedGateways')) || [];
        this.setState({ pinnedGateways });

        this.loadUserAdminInstances();
        this.loadGatewayNumbers();

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
                {this.state.adminGateways.length > 0 ?
                    <div className="dashboard admin" style={{ borderBottom: "1px solid #ccc" }}>
                        {this.state.gateways.length == 0
                            ? <div className="list-empty-label">Loading...</div>
                            : this.state.gateways.map(gateway => {
                                const gatewayId = gateway._id.toLowerCase();
                                const gatewayNumber = this.state.gatewayNumbers ? stripCountryCode(this.state.gatewayNumbers[gatewayId]) : null;
                                if (this.state.pinnedGateways.includes(gateway._id.toLowerCase()) || this.state.adminGateways.includes(gateway._id.toLowerCase())) {
                                    return (
                                        <GatewayWidgetContainer
                                            key={gateway._id}
                                            pinned={this.state.pinnedGateways.includes(gateway._id)}
                                            heading={gateway._id}
                                            statusinfo={gateway}
                                            controlinfo={this.state.adminGateways}
                                            loading={this.state.loading}
                                            colspan={1}
                                            onChange={() => this.loadGatewayStatus()}
                                            onStartChange={() => this.setPending()}
                                            getColorForPercentage={this.getColorForPercentage}
                                            getColorForDate={this.getColorForDate}
                                            settings={this.props.settings}
                                            maxBalance={this.state.maxBalance}
                                            requestFCM={this.requestFCM}
                                            togglePin={this.togglePin}
                                            number={gatewayNumber}
                                        />
                                    );
                                }
                            })}
                    </div> : null}
                {this.state.adminGateways.length > 0 ? <br /> : null}
                <div className="dashboard">
                    {this.state.gateways.length == 0
                        ? <div className="list-empty-label">Loading...</div>
                        : this.state.gateways.map(gateway => {
                            const gatewayId = gateway._id.toLowerCase();
                            const gatewayNumber = this.state.gatewayNumbers ? this.state.gatewayNumbers[gatewayId] : null;
                            if (!this.state.pinnedGateways.includes(gateway._id.toLowerCase()) && !this.state.adminGateways.includes(gateway._id.toLowerCase())) {
                                return (
                                    <GatewayWidgetContainer
                                        key={gateway._id}
                                        pinned={false}
                                        heading={gateway._id}
                                        statusinfo={gateway}
                                        controlinfo={this.state.adminGateways}
                                        loading={this.state.loading}
                                        colspan={1}
                                        onChange={() => this.loadGatewayStatus()}
                                        onStartChange={() => this.setPending()}
                                        getColorForPercentage={this.getColorForPercentage}
                                        getColorForDate={this.getColorForDate}
                                        settings={this.props.settings}
                                        maxBalance={this.state.maxBalance}
                                        requestFCM={this.requestFCM}
                                        togglePin={this.togglePin}
                                        number={gatewayNumber}
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

const getColorForPercent = function (pct) {
    for (let i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            const lower = percentColors[i - 1];
            const upper = percentColors[i];
            const range = upper.pct - lower.pct;
            const rangePct = (pct - lower.pct) / range;
            const pctLower = 1 - rangePct;
            const pctUpper = rangePct;
            const color = {
                r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
            };
            return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
        }
    }
    // Default to the last color if pct is not less than any percentColors.pct
    const lastColor = percentColors[percentColors.length - 1].color;
    return 'rgb(' + [lastColor.r, lastColor.g, lastColor.b].join(',') + ')';
}

const getMaxBalanceFromData = function (data) {
    let max = 0;
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

const percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0x00 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0x00 } },
    { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0x00 } }];

const stripCountryCode = function (number) {
    if (number) {
        if (number.startsWith('+977')) {
            return number.substring(4);
        }
        return number;
    }
    return number;
}

const updateDurationSec = 600;
export default Dashboard;