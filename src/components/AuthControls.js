import React, { Component } from 'react';

class AuthControls extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userData: null,
            loggingIn: false,
            error: null
        };
        this.googleClientId = process.env.GOOGLE_CLIENT_ID;
    }

    componentDidMount() {
        // Load Google Sign-In library
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            // Use setTimeout to ensure React has rendered the component
            setTimeout(() => {
                if (window.google && this.googleClientId) {
                    window.google.accounts.id.initialize({
                        client_id: this.googleClientId,
                        callback: this.handleCredentialResponse
                    });
                    // Render the button - wait for DOM element to be ready
                    const buttonElement = document.getElementById('google-signin-button');
                    if (buttonElement) {
                        window.google.accounts.id.renderButton(
                            buttonElement,
                            { theme: 'outline', size: 'large' }
                        );
                    }
                }
            }, 100);
        };
        document.head.appendChild(script);

        // Check if user is already logged in (from localStorage)
        const storedEmail = localStorage.getItem('userEmail');
        const storedName = localStorage.getItem('userName');
        const authToken = localStorage.getItem('authToken');

        if (authToken && storedEmail && storedName) {
            this.setState({
                userData: { name: storedName, email: storedEmail }
            });
            this.props.updateUserName(storedName);
            this.props.updateUserEmail(storedEmail);
            this.props.setIsLoggedIn(true);
        }
    }

    handleCredentialResponse = async (response) => {
        const { credential } = response;
        
        this.setState({ loggingIn: true, error: null });
        try {
            // Send the ID token to your backend
            const backendResponse = await fetch(`${this.props.apiUrl}/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.props.apiKey}`
                },
                body: JSON.stringify({
                    id_token: credential
                })
            });

            if (!backendResponse.ok) {
                throw new Error(`Authentication failed: ${backendResponse.status}`);
            }

            const data = await backendResponse.json();
            
            // Store auth token and user info
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userName', data.name);

            // Update parent component with user info
            this.setState({
                userData: { name: data.name, email: data.email },
                loggingIn: false
            });
            this.props.updateUserName(data.name);
            this.props.updateUserEmail(data.email);
            this.props.setIsLoggedIn(true);

        } catch (err) {
            console.error('Login error:', err);
            this.setState({ error: err.message, loggingIn: false });
        }
    };

    handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        this.setState({ userData: null });
        this.props.setIsLoggedIn(false);
        location.reload();
    };

    render() {
        const { userData, loggingIn, error } = this.state;
        const isLoggedIn = !!userData;

        return (
            <div>
                {isLoggedIn
                    ? <div>
                        <div className="login-header">
                            <span className="login-text">
                                <span className="username">
                                    {userData && userData.name ? userData.name : "?"}
                                </span>
                            </span>
                            <div>
                                <a className="logout" href="#" onClick={(e) => { e.preventDefault(); this.handleLogout(); }}>
                                    sign out
                                </a>
                            </div>
                            <div>
                                <a className="settings" href="#" onClick={(e) => { e.preventDefault(); this.props.togglePopup(); }}>settings</a>
                            </div>
                        </div>
                        {this.props.children}
                    </div>
                    : null}
                {!isLoggedIn
                    ? <div className="login-links-panel">
                        <h2>Gateway Watcher</h2>
                        <p>Please click below and sign in using your Medic Mobile account.</p>
                        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
                        <div id="google-signin-button" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}></div>
                    </div>
                    : null}
            </div>
        );
    }
};

export default AuthControls;