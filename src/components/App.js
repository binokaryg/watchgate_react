import React, { Component } from 'react';
import AuthControls from './AuthControls';
import Dashboard from './Dashboard';
import Settings from './Settings';
import '../../static/watchgate.scss';

import {
    Stitch,
    RemoteMongoClient,
    GoogleRedirectCredential
} from "mongodb-stitch-browser-sdk";

//TODO: add your MongoDB stitch app id here
let appId = "<stitch-app-id>";

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

        this.state = {
            settings: { showBalanceTrend: true, safeBalance: 3000 },
            showPopup: false
        };
        this.client = client;
        this.gateways = gateways;
        this.applySettings = this.applySettings.bind(this);
        this.toggleBalanceTrend = this.toggleBalanceTrend.bind(this);
        this.handleSafeBalanceChange = this.handleSafeBalanceChange.bind(this);
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
    }

    handleSafeBalanceChange(balance) {
        let settings = Object.assign({}, this.state.settings);
        settings.safeBalance = parseInt(balance);
        this.setState({settings});
    }

    render() {
        return (
            <div>
                <AuthControls
                    client={this.client}
                    togglePopup={this.togglePopup.bind(this)}
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
                        />
                        : null
                    }
                </AuthControls>
                <Dashboard
                    client={this.client}
                    gateways={this.gateways}
                    settings={this.state.settings} />
            </div>
        );
    }


}

export default App;