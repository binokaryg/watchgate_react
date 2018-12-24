import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './UIControls/Button';
import CheckBox from './UIControls/Checkbox';
import '../../static/Settings.scss';
import TextInput from './UIControls/TextInput';
class Settings extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className='popup'>
                <div className='popup_inner'>
                    <span className="close" onClick={this.props.closePopup}>{String.fromCodePoint(0xd7)}</span>                    
                    <h1>{this.props.text}</h1>
                    <hr className="divider"/>
                    <div className='Settings'>
                        <CheckBox
                            label={"Show Balance Trend"}
                            handleCheckboxChange={this.props.toggleBalanceTrend}
                            handleSettingsChange={this.props.handleSettingsChange}
                            isCheckedAtFirst={this.props.settings.showBalanceTrend}
                        />
                        <TextInput
                            label="Safe Balance (Rs)"
                            safeBalance={this.props.settings.safeBalance}
                            validRegex={/^$|[0-9]$/}
                            onChange={this.props.handleSafeBalanceChange}
                        />
                        <div className="ok">
                            <Button onClick={this.props.closePopup} label={"OK"}></Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Settings.propTypes = {
    text: PropTypes.string,
    settings: PropTypes.object,
    handleSafeBalanceChange: PropTypes.func,
    closePopup: PropTypes.func,
    toggleBalanceTrend: PropTypes.func,
    handleSettingsChange: PropTypes.func,
    handleCheckBoxChange: PropTypes.func,
    handleSafeBalanceChange: PropTypes.func
}

export default Settings;