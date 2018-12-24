import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import styling
import '../../static/WifiDisplay.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class TempDisplay extends Component {
    getColorForTemp(temp, minTemp, maxTemp) {
        var percent = 1 - (temp - minTemp)/(maxTemp - minTemp);
        return this.props.getColor(percent);
    }

    render() {
        return (
            <div className="WifiDisplay">
                
            <FontAwesomeIcon icon="thermometer-half" className="icon" style={{ color: this.getColorForTemp(this.props.temp, 28, 50) }}/>
                <span className="wifi">
                    {this.props.temp + ' ' + String.fromCharCode(186) + 'C'}
                </span>
                
            </div>
            
        );
    }
}

// Enforce the type of props to send to this component
TempDisplay.propTypes = {
    temp: PropTypes.number,
    getColor: PropTypes.func
}

export default TempDisplay;