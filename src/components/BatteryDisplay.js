import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import styling
import '../../static/WifiDisplay.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class BatteryDisplay extends Component {
    getColorForBattery(battery) {
        var percent = battery/100;
        return this.props.getColor(percent);
    }
    render() {
        return (
            <div className="WifiDisplay">
                
            <FontAwesomeIcon icon="battery-full" className="icon" style={{ color: this.getColorForBattery(this.props.battery) }}/>
                <span className="wifi">
                    {this.props.battery}%
                </span>
                
            </div>
            
        );
    }
}

// Enforce the type of props to send to this component
BatteryDisplay.propTypes = {
    battery: PropTypes.number,
    getColor: PropTypes.func
}

export default BatteryDisplay;