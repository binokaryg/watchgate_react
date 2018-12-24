import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import styling
import '../../static/DateDisplay.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TimeAgo from 'react-timeago'

class DateDisplay extends Component {
    render() {
        return (
            <div className="DateDisplay" title={'Balance last updated on ' + new Date(this.props.date).toString()}>
                
            <FontAwesomeIcon icon="clock" className="icon"  style={{ color: this.props.getColorForDate(this.props.date, 8*60*60*1000) }}/>
                <TimeAgo className="date" date={this.props.date} title={'Balance last updated on ' + new Date(this.props.date).toString()}/>
                
            </div>
            
        );
    }
}

// Enforce the type of props to send to this component
DateDisplay.propTypes = {
    date: PropTypes.object,
    getColorForDate: PropTypes.func
}

export default DateDisplay;