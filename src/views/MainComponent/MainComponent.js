import React, { Component } from 'react';
import {
    Badge,
    Row,
    Col,
    Progress,
    Dropdown,
    Button,
    ButtonToolbar,
    ButtonGroup,
    ButtonDropdown,
    Label,
    Input,
    Table,
    Form,
    FormGroup,
    FormText,
    Nav, NavItem, NavLink, TabContent, TabPane
} from 'reactstrap';
import { connect, Provider } from "react-redux";
import classnames from 'classnames';

import * as genericAction from '../../actions/genericAction'; 

import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import store from "../../store";






// @connect((store) => {
//     return{
//         myList: store.mainComponent.myList
//     }
// })

function mapStateToProps(store) {
    return {
        myList: store.mainComponent.myList
    };
}

function mapDispatchToProps(dispatch) {
    // return { actions: bindActionCreators(loadboardAct, dispatch) };
    let actions = bindActionCreators({ genericAction });
    return { ...actions, dispatch };
}



class MainComponent extends Component {

    constructor(props){
        super(props);
        this.state={
            activeTab: '1',
            lastActiveTab: '1',
            newAppointmentList:[],
            apponintmentList:[{
                "Intime": "Hello", "goingTime": "dummy value", "flag": true 
            },{
                "Intime": "Hi", "goingTime": "dummy value one", "flag": true 
            }]
        }
    }

    componentDidMount(){
        this.props.dispatch(genericAction.getappointmentList(this.state.apponintmentList));
    }

    componentWillReceiveProps(nextProps){
       if(nextProps.myList){
           console.log("componentWillReceiveProps", nextProps.myList);
           this.setState({
                newAppointmentList: nextProps.myList
           })     
       }
    }

    //toggle my tabs
    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                lastActiveTab: this.state.activeTab,
                activeTab: tab,
            });
        }
    }

    renderAppointmentList(item, key){
        return(
            <tr>
                <td>{item.Intime}</td><td>{item.goingTime}</td><td><Button color="primary" className="my-10" > View</Button>  </td>
            </tr>    
        );
    }

    render(){
        return(
            <div>
            <Nav tabs>
                <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' }, 'custom-link')}
                            onClick={() => { this.toggleTab('1'); }}
                        >
                             View Appointment
                        </NavLink>
                </NavItem>
                <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' }, 'custom-link')}
                            onClick={() => { this.toggleTab('2'); }}
                        >
                             Create Appointment
                        </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink disabled={this.state.disabledTab}
                        className={classnames({ active: this.state.activeTab === '3' }, 'custom-link')}
                        onClick={() => { this.toggleTab('3'); }}
                    >
                            Logout
                    </NavLink>
                </NavItem>
            </Nav>

            <Table responsive >
            <thead>
            <tr>
            <th> Coming Date </th>
            <th> Going Date </th>
            <th> Status </th>
            </tr>
            </thead>
            <tbody>
                { (this.state.newAppointmentList.length > 0)?  this.state.newAppointmentList.map(this.renderAppointmentList):null }  

            </tbody>
            </Table>


            <div>

               
            </div>    

            </div>


        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MainComponent);
