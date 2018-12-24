import React, { Component } from 'react';
import GatewayItem from '../components/GatewayItem';

class GatewayList extends Component {
    loadList() {
       if (!this.client.auth.isLoggedIn) {
          return;
       }
       let obj = this;
       this.gateways.find({}, {limit: 1000}).asArray().then(docs => {
          obj.setState({ gateways: docs, requestPending: false });
       });
    }
 
 constructor(props) {
    super(props);
 
    this.state = {
       gateways: []
    };
    this.client = props.client;
    this.gateways = props.gateways;
 }
 
 componentWillMount() {
    this.loadList();
 }
 
 checkHandler(id, status) {
    this.gateways.updateOne({ _id: id }, { $set: { checked: status } }).then(() => {
       this.loadList();
    }, { rule: "checked" });
 }
 
 componentDidMount() {
    this.loadList();
 }
 
 addGateway(event) {
    if (event.keyCode != 13) {
       return;
    }
    this.setState({ requestPending: true });
    this.gateways
       .insertOne({ id: event.target.value, owner_id: this.client.auth.user.id })
       .then(() => {
       this._newgateway.value = "";
       this.loadList();
       });
 }
 
 clear() {
    this.setState({ requestPending: true });
    this.gateways.deleteMany({ checked: true }).then(() => {
       this.loadList();
    });
 }
 
 setPending() {
    this.setState({ requestPending: true });
 }
 
 render() {
    let loggedInResult = (
       <div>
       <div className="controls">
          <input
             type="text"
             className="new-gateway"
             placeholder="add a new gateway..."
             ref={n => {
             this._newgateway = n;
             }}
             onKeyDown={e => this.addGateway(e)}
          />
          {this.state.gateways.filter(x => x.checked).length > 0
             ? <div
                href=""
                className="cleanup-button"
                onClick={() => this.clear()}
             >
                clean up
             </div>
             : null}
       </div>
       <ul className="gateways-list">
          {this.state.gateways.length == 0
             ? <div className="list-empty-label">Loading...</div>
             : this.state.gateways.map(gateway => {
                return (
                   <GatewayItem
                   key={gateway._id.toString()}
                   gateway={gateway}
                   gateways={this.gateways}
                   onChange={() => this.loadList()}
                   onStartChange={() => this.setPending()}
                   />
                );
             })}
       </ul>
       </div>
    );
    return this.client.auth.isLoggedIn ? loggedInResult : null;
 }
 };

 export default GatewayList;