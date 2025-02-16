import React, { Component } from 'react';

const buttonStyle = {
  //margin: '10px 10px 10px 0'
};

class Button extends Component {
  render() {
    return (
      <button
        className="btn btn-default"
        style={buttonStyle}
        onClick={this.props.onClick}>{this.props.label}
      </button>
    );
  }
}

export default Button;