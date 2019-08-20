import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import urlBase from '../config';


class UpdateCourse extends Component {

    constructor(props){
        super(props);
    
        this.state = {
          errors: [],
          confirmation: null,
          id: '',
          userId: '',
          title: '',
          description: '',
          estimatedTime: '',
          materialsNeeded: ''
        }
    };

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
            console.log(encodedCredentials);
            options.headers['Authorization'] = `Basic ${encodedCredentials}`;
        }

        return fetch(path, options)
    }

    getCourse = async() => {
        let pathLength = window.location.pathname.length; 
        let courseId = window.location.pathname.substring(9 , pathLength - 7);
        let path = urlBase + '/courses/' + courseId;
        const getApi = await this.api(path, 'GET', null );
        return getApi.json();    
    }

    updateCourse = async(course)=> {
        let pathLength = window.location.pathname.length; 
        let courseId = window.location.pathname.substring(9 , pathLength - 7);
        let path = urlBase + '/courses/' + courseId;
  
        const response = await this.api(path, 'PUT', course, true, this.props.encodedCred)
        if (response.status === 401 || response.status === 403 ) {
            this.props.history.push('/forbidden'); 
        }
        else if (response.status === 204) {
            this.setState({
                confirmation: "Your course has been updated!"
            }) 
            return [];
        }
        else {
            this.setState({
                errors: ["There has been a problem!"]
            })
        };
        
    }
    
    handleInputChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({
            [name]: value
        });
    }

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


    componentDidMount(){  
        this.getCourse()
          .then(data => {
            this.setState({
                course: data.course,
                id: data.course.id,
                userId: data.course.userId,
                title: data.course.title,
                description: data.course.description,
                estimatedTime: data.course.estimatedTime,
                materialsNeeded: data.course.materialsNeeded,
            })
          })
          .catch(error => {
            console.log('Unable to fetch data');
          })    
    }

    render(){
        const errors = this.state.errors;
        const confirmation = this.state.confirmation;
  
        return (
            <div className="bounds course--detail">
                 <div>
                    { confirmation ?
                        <h3 > {confirmation} </h3>
                    :  
                        []
                    }
                </div>
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
                                <p>Created by User - {this.state.userId}</p>
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
                                    <Link to="/" className="button button-secondary">Return to Courses</Link>
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