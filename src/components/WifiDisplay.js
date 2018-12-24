import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import styling
import '../../static/WifiDisplay.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class WifiDisplay extends Component {

    getColorForWifi(signal, fullSignal) {
        var percent = signal / fullSignal;
        return this.props.getColor(percent);
    }

    render() {
        return (
            <div className="WifiDisplay" title={"Strength: " + (this.props.wifiStrength + 1) + "/5"}>

                <FontAwesomeIcon icon="wifi" className="icon" style={{ color: this.getColorForWifi(this.props.wifiStrength, 4) }} />
                <span className="wifi">
                    {this.props.wifi}
                </span>

            </div>

        );
    }
}

// Enforce the type of props to send to this component
WifiDisplay.propTypes = {
    wifi: PropTypes.string,
    wifiStrength: PropTypes.number,
    getColor: PropTypes.func
}

export default WifiDisplay;