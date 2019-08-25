import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import urlBase from '../config';


class UpdateCourse extends Component {

    constructor(props){
        super(props);
    
        this.state = {
          errors: [],
          unhandledError: false,
          notfound: false,
          forbidden: false,
          confirmation: null,
          id: '',
          userId: '',
          title: '',
          description: '',
          estimatedTime: '',
          materialsNeeded: '',
          authorFirstName: '',
          authorLastName: ''
        }
    };

    //fetches courses API
    api = (path, method, body=null, requiresAuth = false, credentials =  null) => {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
        };

        if (body!== null ){
            options.body = JSON.stringify(body);
        }

        if(requiresAuth) {
            const encodedCredentials = this.props.encodedCred;
            options.headers['Authorization'] = `Basic ${encodedCredentials}`;
        }

        return fetch(path, options)
    }

    //calls GET method on courses API to retrieve course for update
    getCourse = async() => {
        let pathName = window.location.pathname; 
        let courseId = pathName.replace(/\D/g, '');
        let path = urlBase + '/courses/' + courseId;
        const response = await this.api(path, 'GET', null ).catch(()=>{});
        if (response !== null){
            return response.json(); 
        }
        else {
            return null;
        }
                      
    }

    //calls PUT  method on courses API to get to update course & handle errors
    updateCourse = async(course)=> {
        let courseId = window.location.pathname.replace(/\D/g, '');
        let path = urlBase + '/courses/' + courseId;
  
        const response = await this.api(path, 'PUT', course, true, this.props.encodedCred).catch(()=>{});

        if (response.status === 401 || response.status === 403 ) {
            this.setState({
                forbidden: true
            }) 
        }
        if (response.status === 204) {
            this.setState({
                confirmation: "Your course has been updated!",
                errors: []
            }) 
            return [];
        }
        if(response.status === 400 ) {
            const errors = await response.json().then((data) => {return data.errors});
            this.setState({
                errors: errors
            })
        }
        if(response.status === 404 ) {
            this.setState({
                notfound: true
            })
        } 
        else if(response.status === 500 ) {
            this.setState({
                unhandledError: true
            })
        }        
    }
    
    //sets state to form input values on entry
    handleInputChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({
            [name]: value
        });
    }

    //calls 'updateCourse' on form submission 
    handleSubmit = async(event)=> {
        event.preventDefault();
        let title = this.state.title;
        let description = this.state.description;
        let estimatedTime = this.state.estimatedTime;
        let materialsNeeded = this.state.materialsNeeded;
        
        const course = {
            title,
            description,
            estimatedTime,
            materialsNeeded
        };

        await this.updateCourse(course);    
    }

    //calls 'getCourse' on page mount
    componentDidMount(){  
        this.getCourse()
          .then(data => {
              if(data.course === undefined){
                this.setState({
                    unhandledError: true,
                    loading: false,
                })
              }
              if(data.course.userId === this.props.isAuthed.user[0].id){
                this.setState({
                    course: data.course,
                    id: data.course.id,
                    userId: data.course.userId,
                    title: data.course.title,
                    description: data.course.description,
                    estimatedTime: data.course.estimatedTime,
                    materialsNeeded: data.course.materialsNeeded,
                    authorFirstName: data.course.User.firstName,
                    authorLastName: data.course.User.lastName
                })
              } else{
                  this.setState({
                      forbidden: true
                  })
              }          
          })   
          .catch(error => {
              console.log(error);
            this.setState({
                notfound: true
            })
          }) 
    }

    render(){
        const errors = this.state.errors;
        const confirmation = this.state.confirmation; 

         //Redirects if auth user does not own course
        if (this.state.forbidden){
            return (
                <Redirect to={'/forbidden'}/>
            )
        }
         //Redirects if course not found
        if (this.state.notfound){
            return (
                <Redirect to={'/notfound'}/>
            )
        }
         //Redirects unhandled errors
        if (this.state.unhandledError){
            return (
                <Redirect to={'/error'}/>
            )
        }
    
       
        return (
            <div className="bounds course--detail">
                <div>
                    { errors.length?
                         <div>
                            <h2 className="validation--errors--label">Validation errors</h2>
                            <div validation-errors>
                                <ul>
                                {this.state.errors.map((error, i) => <li key={i}>{error}</li>)}
                                </ul>
                            </div>
                        </div>
                    :  
                        []
                    }
                </div>
                <h1>Update Course</h1>
                <div>    
                    <form onSubmit={this.handleSubmit}>
                        <div className="grid-66">
                            <div className="course--header">
                                <h4 className="course--label">Course</h4>
                                <div>
                                    <input 
                                        id="title" 
                                        name="title" 
                                        type="text" 
                                        className="input-title course--title--input" 
                                        placeholder={this.state.title}
                                        value={this.state.title}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                {/* <p>By {this.props.isAuthed.user[0].firstName} {this.props.isAuthed.user[0].lastName}</p> */}
                                <p>By {this.state.authorFirstName} {this.state.authorLastName}</p>
                            </div>
                            <div className="course--description">
                                <div>
                                    <textarea 
                                        id="description" 
                                        name="description" 
                                        placeholder={this.state.description}
                                        value={this.state.description}
                                        onChange={this.handleInputChange}
                                   />                             
                                </div>
                            </div>
                        </div>
                        <div className="grid-25 grid-right">
                                <div className="course--stats">
                                    <ul className="course--stats--list">
                                        <li className="course--stats--list--item">
                                            <h4>Estimated Time</h4>
                                            <div>
                                                <input 
                                                    id="estimatedTime" 
                                                    name="estimatedTime" 
                                                    type="text" 
                                                    className="course--time--input" 
                                                    placeholder={this.state.estimatedTime}  
                                                    value={this.state.estimatedTime}
                                                    onChange={this.handleInputChange}
                                                />
                                            </div>
                                        </li>
                                        <li className="course--stats--list--item">
                                            <h4>Materials Needed</h4>
                                            <div>
                                                <textarea 
                                                    id="materialsNeeded" 
                                                    name="materialsNeeded"  
                                                    placeholder={this.state.materialsNeeded}
                                                    value={this.state.materialsNeeded}
                                                    onChange={this.handleInputChange}
                                                />
                                            </div>
                                        </li>
                                    </ul> 
                                </div>
                        </div>
                            { confirmation ?
                                <div className="grid-100 pad-bottom">
                                    <div className="confirmation">
                                        <h3 > {confirmation} </h3>     
                                    </div>
                                    <Link to={'/courses/'+ this.state.id} className="button button-secondary" >Back to Course Details</Link>
                                </div>
                            :  
                                <div className="grid-100 pad-bottom">
                                    <button className="button" type="submit">Update Course</button>
                                     <Link to={'/courses/'+ this.state.id} className="button button-secondary" >Cancel</Link>
                                </div>
                            }
                    </form>  
                </div>
            </div>
        )
    }
}

export default UpdateCourse;