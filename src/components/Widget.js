import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
// Import components
import Loading from './UIControls/Loading';

//Import styling
import '../../static/Widget.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TimeAgo from 'react-timeago'


class Widget extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lastSMSActivity: null,
            lastBalanceActivity: null,
            isMouseInside: false
        }

        // Create inline styles to make grid elements span multiple rows/columns
        this.spanStyles = {};
        if (props.colspan !== 1) {
            this.spanStyles.gridColumn = `span ${props.colspan}`;
        }
        if (props.rowspan !== 1) {
            this.spanStyles.gridRow = `span ${props.rowspan}`;
        }
    }

    mouseEnter = () => {
        this.setState({ isMouseInside: true });
    }
    mouseLeave = () => {
        this.setState({ isMouseInside: false });
    }

    handlePhoneNumberClick = (event) => {
        const element = event.target;
        const originalText = element.textContent;
        navigator.clipboard.writeText(originalText).then(() => {
            element.textContent = "Copied";
            element.classList.add('copied');
            setTimeout(() => {
                element.classList.remove('copied');
                element.textContent = originalText;
            }, 1000); // Revert back after 1 second
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };
    
    // Update the state based on changing props
    componentWillReceiveProps(nextProps) {
        if (this.props.balanceData !== nextProps.balanceData ||
            this.props.smsData !== nextProps.smsData) {
            //Only update if the data has actually changed
            let lastSMSActivity = this.lastSMSPackActivity(nextProps);
            let lastBalanceActivity = this.lastBalanceActivity(nextProps);
            this.setState({
                lastSMSActivity,
                lastBalanceActivity
            });
        }
    }

    componentDidMount() {
        let lastSMSActivity = this.lastSMSPackActivity(this.props);
        let lastBalanceActivity = this.lastBalanceActivity(this.props);
        this.setState({
            lastSMSActivity,
            lastBalanceActivity
        });
    }


    lastBalanceActivity(props) {
        let balanceDataReversed = cloneDeep(props.balanceData);
        balanceDataReversed.sort(function (a, b) { return b.date - a.date }); //order from last to first
        for (let i = 0; i < balanceDataReversed.length - 1; i++) {
            if (balanceDataReversed[i].bal < balanceDataReversed[i + 1].bal) {
                return balanceDataReversed[i];
            }
        }
        return null;
    }

    lastSMSPackActivity(props) {
        let smsDataReversed = cloneDeep(props.smsData);
        smsDataReversed.sort(function (a, b) { return b.date - a.date }); //order from last to first
        for (let i = 0; i < smsDataReversed.length - 1; i++) {
            if (smsDataReversed[i].sms < smsDataReversed[i + 1].sms) {
                return smsDataReversed[i];
            }
        }
        return null;
    }

    canControlInstance() {
        return this.props.controls.includes(this.props.heading.toLowerCase());
    }

    render() {
        let data = null;
        return (
            <div style={this.spanStyles} className="Widget" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                <div className="header">
                    <span className='title'>
                        {((typeof this.props.heading) == "string") ? this.props.heading.toUpperCase() : ""}
                    </span>
                    {this.props.settings.notificationURL && this.props.settings.notificationURL.length > 5 && this.state.isMouseInside ?
                        <div className="controls">
                            <span className="icon" title={this.props.pinned ? "Unpin" : "Pin"}>
                                <FontAwesomeIcon
                                    icon="thumbtack"
                                    onClick={() => this.props.togglePin(this.props.heading)}
                                    style={{ transform: this.props.pinned ? 'none' : 'rotate(90deg)' }}
                                />
                            </span>
                            <span className="icon" title="Check balance">
                                <FontAwesomeIcon icon="sync" onClick={() => { if (window.confirm(`Are you sure you want to recheck ${this.props.heading}?`)) { this.props.requestFCM(this.props.heading, 'CHECK') } }} />
                            </span>
                            {/* <span className="icon" title="Subscribe SMS pack">
                                <FontAwesomeIcon icon="money-check" onClick={() => { if (window.confirm(`Are you sure you want to subscribe SMS packs in ${this.props.heading}?`)) { this.props.requestFCM(this.props.heading, 'SUBSCRIBE') } }} />
                            </span> */}
                            {this.canControlInstance() ?
                                <span className="icon" title="Attempt gateway refresh">
                                    <FontAwesomeIcon icon="syringe" onClick={() => { if (window.confirm(`Are you sure you want to restart gateway app in ${this.props.heading}?`)) { this.props.requestFCM(this.props.heading, 'RESTART') } }} />
                                </span>
                                : ""}
                            {this.props.number ?
                                <span className="phoneNumber" title="Click to copy" onClick={() => { this.handlePhoneNumberClick(event) }}>
                                    {this.props.number}
                                </span>
                                : ""}
                        </div>
                        : <div style={{ visibility: "hidden" }}>&nbsp;</div>}
                </div>
                <div className="icons">
                    {this.props.data ? <span className="icon dataOn" title="Mobile Data On"><FontAwesomeIcon icon="exchange-alt" /></span> : ""}
                    <span className="icon" title={"Last SMS was received on: " + (this.props.lastSMSInDate.getTime() > 0 ? new Date(this.props.lastSMSInDate).toString() : "never or long time ago")}><FontAwesomeIcon icon="envelope" style={{ color: this.props.getColorForDate(this.props.lastSMSInDate, 24 * 60 * 60 * 1000) }} /></span>
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
                <div className="activity"
                    style={{ color: this.props.getColorForDate(this.state.lastSMSActivity !== null ? this.state.lastSMSActivity.date : 0, 8 * 60 * 60 * 1000) }}>

                    <span className="icon"
                        title={"Last SMS pack activity detected: " +
                            (this.state.lastSMSActivity !== null ? "before " + new Date(this.state.lastSMSActivity.date).toString() : "never or long time ago") +
                            "\nLast Balance activity detected: " +
                            (this.state.lastBalanceActivity !== null ? "before " + new Date(this.state.lastBalanceActivity.date).toString() : "never or long time ago")
                        }>
                        <FontAwesomeIcon icon="clock" />
                    </span>
                </div>
            </div>
        );
    }
}

// Provide default settings for when they aren't supplied
Widget.defaultProps = {
    heading: "No Name",
    pinned: false,
    colspan: 2,
    rowspan: 1
}

// Enforce the type of props to send to this component
Widget.propTypes = {
    pinned: PropTypes.bool,
    heading: PropTypes.string,
    colspan: PropTypes.number,
    rowspan: PropTypes.number,
    plugged: PropTypes.bool,
    data: PropTypes.bool,
    date: PropTypes.object,
    lastSMSInDate: PropTypes.object,
    controls: PropTypes.array,
    settings: PropTypes.object,
    getColorForDate: PropTypes.func,
    balanceData: PropTypes.arrayOf(PropTypes.object),
    smsData: PropTypes.arrayOf(PropTypes.object),
    requestFCM: PropTypes.func,
    togglePin: PropTypes.func,
}

export default Widget;