import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import urlBase from '../config';

class CreateCourse extends Component {
    constructor(props){
        super(props);
    
        this.state = {
          errors: [],
          confirmation: null,
          title: '',
          description: '',
          estimatedTime: '',
          materialsNeeded: ''
        }
    };

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

        await this.createCourse(course);
       
       
    }

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
            // const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
            const encodedCredentials = this.props.encodedCred;
        
            options.headers['Authorization'] = `Basic ${encodedCredentials}`;
        }

        return fetch(path, options)
    }

    createCourse = async(course)=> {
        let path = urlBase + '/courses';
        // let emailAddress = this.props.isAuthed.user[0].emailAddress;
        // let password = this.props.password;

        // const response = await this.api(path, 'POST', course, true, {emailAddress, password})
        const response = await this.api(path, 'POST', course, true, this.props.encodedCred)
        if (response.status === 401 || response.status === 403 ) {
            this.props.history.push('/forbidden'); 
        }
        else if (response.status === 201) {
            this.setState({
                confirmation: "Your course has been created!"
            }) 
            return [];
        }
        else {
            this.setState({
                errors: ["There has been a problem!"]
            })
        };
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
                    {errors.length > 0 ?
                        <div>
                            <h2 className="validation--errors--label">Validation errors</h2>
                            <div validation-errors>
                                <ul>
                                <li>Error Message</li> 
                                </ul>
                            </div>
                        </div>
                    :
                        []
                    }
                </div>
                    <h1>Create Course</h1>
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
                                        placeholder="Title"
                                        value={this.state.title}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <p>Created by User -{this.props.isAuthed.user[0].id}</p>
                            </div>
                            <div className="course--description">
                                <div>
                                    <textarea 
                                        id="description"
                                        name="description" 
                                        placeholder="Course Description..."
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
                                                    placeholder="Hours"
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
                                                    placeholder="List Materials..."
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
                                    <button className="button" type="submit">Create Course</button> 
                                    <Link to="/" className="button button-secondary">Cancel</Link>
                                </div>
                            }                             
                    </form>  
                </div>
            </div>
        )
    }
}

export default CreateCourse;