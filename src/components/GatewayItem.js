import React, { Component } from 'react';
class GatewayItem extends Component {
    clicked() {
       this.props.onStartChange();
       this.props.gateways
          .updateOne(
          { _id: this.props.gateway._id },
          { $set: { checked: !this.props.gateway.checked } }
          )
          .then(() => this.props.onChange());
    }
 
 render() {
    let gatewayClass = this.props.gateway.checked ? "done" : "";
    return (
       <div className="gateway-item-root">
       <label className="gateway-item-container" onClick={() => this.clicked()}>
          {this.props.gateway.checked
             ? <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
                height="24"
                viewBox="0 0 24 24"
                width="24"
             >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
             </svg>
             : <svg
                fill="#000000"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
             >
                <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                <path d="M0 0h24v24H0z" fill="none" />
             </svg>}
          <span className={"gateway-item-text " + gatewayClass}>
             {this.props.gateway.id}
          </span>
       </label>
       </div>
    );
 }
 };

 export default GatewayItem;