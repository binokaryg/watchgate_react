import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import styling
import '../../static/SMSPackDisplay.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SMSPackDisplay extends Component {

    getColorForSMSPack(smsRemaining, safeValue) {
        const percent = smsRemaining / safeValue;
        return this.props.getColor(percent);
    }

    render() {
        return (
            <div className="SMSPackDisplay" title={"Remaining SMS in SMS Pack"}>

                <FontAwesomeIcon icon="envelope" className="icon" style={{ color: this.getColorForSMSPack(this.props.smsRemaining, 300) }} />
                <span className="sms">
                    {isNaN(this.props.smsRemaining) ? "N/A" : this.props.smsRemaining === null ? "N/A" : this.props.smsRemaining}
                </span>

            </div>

        );
    }
}

// Enforce the type of props to send to this component
SMSPackDisplay.propTypes = {
    smsRemaining: PropTypes.number,
    smsPackInfoDate: PropTypes.object,
    getColor: PropTypes.func
}

export default SMSPackDisplay;