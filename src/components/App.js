import React, { Component } from 'react';
import AuthControls from './AuthControls';
import Dashboard from './Dashboard';
import Settings from './Settings';
import '../../static/watchgate.scss';

const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;


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
            username: 'Unregistered user',
            email: null,
            isLoggedIn: false
        };
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

    componentDidMount() {
        // Sync with stored auth state from localStorage
        const storedEmail = localStorage.getItem('userEmail');
        const storedName = localStorage.getItem('userName');
        const authToken = localStorage.getItem('authToken');

        if (authToken && storedEmail && storedName) {
            this.setState({
                email: storedEmail,
                username: storedName,
                isLoggedIn: true
            });
        }
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

    updateUserEmail(email) {
        this.setState({ email });
    }

    setIsLoggedIn(isLoggedIn) {
        this.setState({ isLoggedIn });
    }

    render() {
        return (
            <div>
                <AuthControls
                    togglePopup={this.togglePopup.bind(this)}
                    updateUserName={this.updateUserName.bind(this)}
                    updateUserEmail={this.updateUserEmail.bind(this)}
                    setIsLoggedIn={this.setIsLoggedIn.bind(this)}
                    apiUrl={apiUrl}
                    apiKey={apiKey}
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
                    settings={this.state.settings}
                    username={this.state.username}
                    email={this.state.email}
                    isLoggedIn={this.state.isLoggedIn}
                    apiUrl={apiUrl}
                    apiKey={apiKey} />
            </div>
        );
    }


}

export default App;