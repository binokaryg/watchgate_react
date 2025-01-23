import React, { Component } from 'react';
import AuthControls from './AuthControls';
import Dashboard from './Dashboard';
import Settings from './Settings';
import '../../static/watchgate.scss';

import {
    Stitch,
    RemoteMongoClient
} from "mongodb-stitch-browser-sdk";


//TODO: add your MongoDB stitch app id here
let appId = WATCHGATE_APP_ID;

const client = Stitch.initializeDefaultAppClient(appId);

const db = client.getServiceClient(RemoteMongoClient.factory,
    "mongodb-atlas").db('watchgate');

let gateways = db.collection("gateways");
//let status = db.collection("status");
//let users = db.collection("users");

//let props = { client, gateways, status, users, settings, toggleBalanceTrend };
//console.log(document.getElementById('app'));


class App extends Component {
    constructor(props) {
        super(props);
        let showBalanceTrend = true;
        let safeBalance = 3000;
        let notificationURL = '';
        try {
            showBalanceTrend = localStorage.getItem("showBalanceTrend") == "false" ? false : true;
            notificationURL = localStorage.getItem("notificationURL");
            safeBalance = parseInt(localStorage.getItem("safeBalance"));
            if (isNaN(safeBalance) || safeBalance == null) {
                safeBalance = 3000;
            }
        }
        catch (exc) {
            console.log(`Could not get from local storage: ${exc}`);
        }
        this.state = {
            settings: { showBalanceTrend, safeBalance, notificationURL },
            showPopup: false,
            username: 'Unregistered user'
        };
        this.client = client;
        this.gateways = gateways;
        this.applySettings = this.applySettings.bind(this);
        this.toggleBalanceTrend = this.toggleBalanceTrend.bind(this);
        this.handleSafeBalanceChange = this.handleSafeBalanceChange.bind(this);
        this.handleNotificationURLChange = this.handleNotificationURLChange.bind(this);    
    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    applySettings(newSettings) {
        this.setState({ settings: newSettings });
    }

    toggleBalanceTrend(show) {
        let settings = Object.assign({}, this.state.settings);
        if (show != null) {
            settings.showBalanceTrend = show;
        }
        else {
            settings.showBalanceTrend = !settings.showBalanceTrend;
        }
        this.setState({ settings });
        localStorage.setItem("showBalanceTrend", settings.showBalanceTrend.toString());
    }

    handleSafeBalanceChange(balance) {
        let settings = Object.assign({}, this.state.settings);
        settings.safeBalance = parseInt(balance);
        this.setState({ settings });
        localStorage.setItem("safeBalance", balance);
        //console.log("balance set", balance);
    }

    handleNotificationURLChange(url) {
        let settings = Object.assign({}, this.state.settings);
        settings.notificationURL = url;
        this.setState({ settings });
        localStorage.setItem("notificationURL", url);
        //console.log("notification url set", url);
    }
    updateUserName(name) {
        this.setState({ username: name });
    }

    render() {
        return (
            <div>
                <AuthControls
                    client={this.client}
                    togglePopup={this.togglePopup.bind(this)}
                    updateUserName={this.updateUserName.bind(this)}
                >

                    {this.state.showPopup ?
                        <Settings
                            text='Settings'
                            closePopup={this.togglePopup.bind(this)}
                            settings={this.state.settings}
                            toggleBalanceTrend={this.toggleBalanceTrend}
                            handleSettingsChange={this.applySettings}
                            handleCheckBoxChange={this.handleCheckBoxChange}
                            handleSafeBalanceChange={this.handleSafeBalanceChange}
                            handleNotificationURLChange={this.handleNotificationURLChange}
                        />
                        : null
                    }
                </AuthControls>
                <Dashboard
                    client={this.client}
                    gateways={this.gateways}
                    settings={this.state.settings}
                    username={this.state.username} />
            </div>
        );
    }


}

export default App;