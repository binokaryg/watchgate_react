import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../../static/Checkbox.scss';

class Checkbox extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            isChecked: this.props.isCheckedAtFirst,
        };

        this.toggleCheckboxChange = this.toggleCheckboxChange.bind(this);
    }

    toggleCheckboxChange() {
        const { handleCheckboxChange, label } = this.props;

        this.setState({ isChecked: !this.state.isChecked }, function () {
            handleCheckboxChange(this.state.isChecked);
        });

    }

    render() {
        const { label } = this.props;
        const { isChecked } = this.state;

        return (
            <div className="Checkbox">
                <div className="Label">
                    {label}
                </div>
                <div className="Box">
                    <input
                        type="checkbox"
                        value={label}
                        checked={isChecked}
                        onChange={this.toggleCheckboxChange}
                    />
                </div>

            </div>
        );
    }
}

Checkbox.propTypes = {
    label: PropTypes.string.isRequired,
    handleCheckboxChange: PropTypes.func.isRequired,
    isCheckedAtFirst: PropTypes.bool
};

export default Checkbox;