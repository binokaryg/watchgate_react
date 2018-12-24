import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Import components
import Loading from './UIControls/Loading';

//Import styling
import '../../static/Widget.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TimeAgo from 'react-timeago'


class Widget extends Component {
    constructor(props) {
        super(props);

        // Create inline styles to make grid elements span multiple rows/columns
        this.spanStyles = {};
        if (props.colspan !== 1) {
            this.spanStyles.gridColumn = `span ${props.colspan}`;
        }
        if (props.rowspan !== 1) {
            this.spanStyles.gridRow = `span ${props.rowspan}`;
        }
    }

    render() {
        let data = null;
        return (
            <div style={this.spanStyles} className="Widget">
                <div className="header">
                    <span className='title'>
                        {((typeof this.props.heading) == "string") ? this.props.heading.toUpperCase() : ""}
                    </span>
                </div>
                <div className="icons">
                    {this.props.data ? <span className="icon dataOn" title="Mobile Data On"><FontAwesomeIcon icon="exchange-alt" /></span> : ""}                    
                    <span className="icon" title={"Last SMS was received on: " + (this.props.lastSMSInDate.getTime() > 0 ? new Date(this.props.lastSMSInDate).toString(): "never or long time ago")}><FontAwesomeIcon icon="envelope" style={{ color: this.props.getColorForDate(this.props.lastSMSInDate, 24 * 60 * 60 * 1000) }} /></span>
                    <span className="icon" title={this.props.carrier ? this.props.carrier : "No Network"}><FontAwesomeIcon icon="broadcast-tower" className={this.props.carrier ? "on" : "off"} /></span>
                    <span className="icon" title={this.props.plugged ? "Plugged" : "Not Plugged"}><FontAwesomeIcon icon="plug" className={this.props.plugged ? "on" : "off"} /></span>
                    {/* Conditionally show the loading spinner */}
                    {this.props.loading ? <Loading /> : ""}
                </div>
                {this.props.children}
                <div className="footer">
                    <span className="upDate" style={{ color: this.props.getColorForDate(this.props.date, 60 * 60 * 1000) }}>
                        <TimeAgo date={this.props.date} title={"Last reported on " + new Date(this.props.date).toString()} />
                    </span>
                </div>
            </div>
        );
    }
}

// Provide default settings for when they aren't supplied
Widget.defaultProps = {
    heading: "No Name",
    colspan: 2,
    rowspan: 1
}

// Enforce the type of props to send to this component
Widget.propTypes = {
    heading: PropTypes.string,
    colspan: PropTypes.number,
    rowspan: PropTypes.number,
    plugged: PropTypes.bool,
    data: PropTypes.bool,
    date: PropTypes.object,
    lastSMSInDate: PropTypes.object,
    getColorForDate: PropTypes.func,
}

export default Widget;