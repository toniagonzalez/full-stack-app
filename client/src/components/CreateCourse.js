import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import urlBase from '../config';

class CreateCourse extends Component {
    constructor(props){
        super(props);
    
        this.state = {
          errors: [],
          unhandledError: false,
          confirmation: null,
          title: '',
          description: '',
          estimatedTime: '',
          materialsNeeded: ''
        }
    };

    //sets state to form input values on entry
    handleInputChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({
            [name]: value
        });
    }

     //calls 'createCourse' on form submission 
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

    //calls POST  method on courses API to get to create course & handle errors
    createCourse = async(course)=> {
        let path = urlBase + '/courses';
        
        const response = await this.api(path, 'POST', course, true, this.props.encodedCred).catch(()=>{});
        
        if (response.status === 401 || response.status === 403 ) {
            this.props.history.push('/forbidden'); 
        }
        if (response.status === 201) {
            this.setState({
                confirmation: "Your course has been created!",
                errors: []
            }) 
            return [];
        }
        if (response.status === 500) {
            this.setState({
                unhandledError: true
            })
        }
        else {   
            const errors = await response.json().then((data) => {return data.errors}); 
            this.setState({
                errors: errors
            })
        };
    }

    render(){
        const confirmation = this.state.confirmation;
         //if unhandled error
         if (this.state.unhandledError){
            return (
                <Redirect to={'/error'}/>
            )
        }
      
        return (
            <div className="bounds course--detail">
                <div>
                    {this.state.errors.length  ?
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
                                <p>By {this.props.isAuthed.user[0].firstName} {this.props.isAuthed.user[0].lastName}</p>
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
                                    <div className="confirmation">
                                        { confirmation ?
                                            <h3> {confirmation} </h3>
                                        :  
                                            []
                                        }
                                    </div>
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