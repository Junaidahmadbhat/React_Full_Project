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
    Nav, NavItem, NavLink, TabContent, TabPane, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardHeader, CardBody
} from 'reactstrap';

import { connect, Provider } from "react-redux";
import classnames from 'classnames';

import * as genericAction from '../../actions/genericAction'; 

import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import store from "../../store";

//import date picker
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';





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
            title:"",              
            newDate: moment(),           
            activeTab: '1',
            lastActiveTab: '1',
            newAppointmentList:[],                //new appointments                  
            displayondateAppointmentList:[],      //ondate appointments       
            apponintmentList:[{
                "Title": "Hello", "goingTime": "2018-03-06", "flag": true 
            },{
                "Title": "Hi", "goingTime": "2018-03-03", "flag": true 
            },
            {
                "Title": "Good morning", "goingTime": "2018-03-01", "flag": true 
            },
            {
                "Title": "Good evening", "goingTime": "2018-03-06", "flag": true 
            }
            ],
            startDate: moment(),
            primary: false,
            displayModal : false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.togglePrimary = this.togglePrimary.bind(this);
    }

    togglePrimary() {
        this.setState({
            primary: !this.state.primary
        });
    }

    toggleForm(){
        this.setState({
            displayModal: !this.state.displayModal
        });
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
        if (this.state.activeTab !== tab ) {
            if(tab=="2"){
                this.setState({
                    lastActiveTab: this.state.activeTab,
                    activeTab: tab,
                    displayModal: true
                });
            }else{
                this.setState({
                    lastActiveTab: this.state.activeTab,
                    activeTab: tab,
                    displayModal: false
                
                }); 
            }

        }
    }

    renderAppointmentList(item, key){
        return(
            <tr>
                <td>{item.Title}</td><td>{item.goingTime}</td><td><Button color="primary" className="my-10" > View</Button>  </td>
            </tr>    
        );
    }


    //on change of the date picker
    handleChange(date) {
        this.setState({
          startDate: date
        },()=>{
            console.log("startdate:=>  ", this.state.startDate.toISOString());

            //display date on the basis of selected date
            let tempArray = [];
            for(let i=0; i< this.state.apponintmentList.length; i++){
                console.log(this.state.startDate.toISOString().split('T')[0] , "==", this.state.apponintmentList[i].goingTime)
                if(this.state.startDate.toISOString().split('T')[0] == this.state.apponintmentList[i].goingTime){
                    //insert row in temp array
                    tempArray.push(this.state.apponintmentList[i]);
                }
            }

            console.log("temppArray =>", tempArray)

            this.setState({
                displayondateAppointmentList: tempArray
            },()=>{
                this.togglePrimary()
            })

            
            

        });
    }

    createAppointment(){
        console.log("this" , this.state.title);
        if(this.state.title && this.state.newDate){
            let li ={
                "Title": this.state.title , "goingTime": this.state.newDate.toISOString().split('T')[0], "flag": true 
            }

            let tempArray = this.state.apponintmentList;
            tempArray.push(li);
            //call actions with new list
            this.toggleTab("1");
            this.props.dispatch(genericAction.getappointmentList(tempArray));
        }
    }

    onChange(e){
        this.setState({
            newDate : e.target.value
        });
    }

    onChangetext(e){
        this.setState({
            title : e.target.value
        });
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

            <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">

                    <h6>Search Appointment on date basis</h6>
                    <DatePicker
                    selected={this.state.startDate}
                    onChange={this.handleChange}
                    />

                    <Table responsive>
                        <thead>
                        <tr>
                        <th> Title </th>
                        <th> Date </th>
                        <th> Status </th>
                        </tr>
                        </thead>
                        <tbody>
                        { (this.state.newAppointmentList.length > 0)?  this.state.newAppointmentList.map(this.renderAppointmentList): null }  
                        </tbody>
                    </Table>

                     {/* Display appoint ments on the basis of date  */}
                <Modal isOpen={this.state.primary} toggle={this.togglePrimary}
                       className={'modal-primary ' + this.props.className}>
                  <ModalHeader toggle={this.togglePrimary.bind(this)}> Display Appointments</ModalHeader>
                  <ModalBody>

                    <Row>
                      <Col xs="12"> 
                        <Table responsive>
                        <thead>
                        <tr>
                        <th> Title </th>
                        <th> Date </th>
                        <th> State </th>
                        </tr>
                        </thead>
                        <tbody>
                        { (this.state.displayondateAppointmentList.length > 0)?  this.state.displayondateAppointmentList.map(this.renderAppointmentList):"Sorry no appointments" }  
                        </tbody>
                        </Table>
                        
                      </Col>
                    </Row>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={this.togglePrimary.bind(this)}>Close</Button>
                  </ModalFooter>
                </Modal>
                </TabPane>
                <TabPane tabId="2">
                    

                {/*Create appointments  */}
                <Modal isOpen={this.state.displayModal} toggle={this.toggleForm}
                       className={'modal-primary ' + this.props.className}>
                  <ModalHeader toggle={this.toggleForm.bind(this)}> Create new Appointment</ModalHeader>
                  <ModalBody>
                    {/* ***************Create Appointment***************/}
                    <Row>
                      <Col xs="12"> 
                        <FormGroup>
                        <Label htmlFor="name">Name</Label>
                            <Input type="text" id="name" onChange={this.onChangetext.bind(this)}  value={this.state.title || ""}  placeholder="Title" required/>
                        </FormGroup>
                        <FormGroup>
                        <Label htmlFor="name">Name</Label>
                            <DatePicker
                            selected={this.state.newDate}  
                            onChange={(newDate)=> {this.setState({newDate: newDate})} }
                            />
                        </FormGroup>
                        
                      </Col>
                    </Row>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.createAppointment.bind(this)}>Save</Button>{' '}
                    <Button color="secondary" onClick={this.toggleForm.bind(this)}>Close</Button>
                  </ModalFooter>
                </Modal>
                </TabPane>
            </TabContent> 
            </div>


        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MainComponent);
