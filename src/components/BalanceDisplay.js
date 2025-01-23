import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import styling
import '../../static/BalanceDisplay.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class BalanceDisplay extends Component {
    getColorForBalance(currentBalance, safeBalance){
        const percent = currentBalance/safeBalance;
        return this.props.getColor(percent);
        }

    render() {
        // Only display "Rs" when balance prop is available
        let balanceText = null;
        
        if (this.props.postpaid === true) {
            balanceText =
            <span className="balance"
            style={{color: this.getColorForBalance(this.props.balanceCredit, this.props.safeBalance)}}
            title = {'Postpaid Due: ' + String.fromCodePoint(0x930, 0x941) + this.props.balanceDue}>
            {String.fromCodePoint(0x930, 0x941) + ". " + this.props.balanceCredit}
            </span>;
        }
        else {
            balanceText = 
            <span className="balance" style={{color: this.getColorForBalance(this.props.balance, this.props.safeBalance)}}>
            {String.fromCodePoint(0x930, 0x941) + " " + this.props.balance}
            </span>;
        }
        //console.log("Postpaid: " + this.props.postpaid);

        return (
            <div className="BalanceDisplay">
                
            <FontAwesomeIcon icon="coins" className="icon coin"/>
                {balanceText}
            </div>
            
        );
    }
}

// Enforce the type of props to send to this component
BalanceDisplay.propTypes = {
    balance: PropTypes.number,
    balanceDue: PropTypes.number,
    balanceCredit: PropTypes.number,
    balanceDate: PropTypes.object,
    postpaid: PropTypes.bool,
    getColor: PropTypes.func
}

export default BalanceDisplay;