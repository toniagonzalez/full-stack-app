import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import urlBase from '../config';


class UpdateCourse extends Component {

    constructor(props){
        super(props);
    
        this.state = {
          course: {},
          errors: [],
          title: '',
          description: '',
          estimatedTime: '',
          materialsNeeded: ''
        }
    };

    api = (path, method, body=null) => {
        const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        };

        if (body!== null ){
        options.body = JSON.stringify(body);
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
    
    validation = ()=>{
        return(
            <div>
                <h2 className="validation--errors--label">Validation errors</h2>
                <div validation-errors>
                    <ul>
                    {this.state.errors.map((error, i) => <li key={i}>{error}</li>)}
                    </ul>
                </div>
            </div>
        )
    }

    handleInputChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({
            [name]: [value]
        });
    }

    handleSubmit = async(event)=> {
        event.preventDefault();
        let title = this.state.title.length ? this.state.title[0] : this.state.course.title;
        let description = this.state.description.length ?  this.state.description[0] : this.state.course.description;
        let estimatedTime = this.state.estimatedTime.length ? this.state.estimatedTime[0] : this.state.course.estimatedTime;
        let materialsNeeded = this.state.materialsNeeded.length ? this.state.materialsNeeded[0] : this.state.course.materialsNeeded;
        
        const course = [
            title,
            description,
            estimatedTime,
            materialsNeeded
        ]

        await console.log("course:" + course+ " state:" + this.state.course.title);
    }


    componentDidMount(){  
        this.getCourse()
          .then(data => {
            this.setState({
                course: {
                    title: data.course.title,
                    description: data.course.description,
                    estimatedTime: data.course.estimatedTime,
                    materialsNeeded: data.course.materialsNeeded
                }
            })
          })
          .catch(error => {
            console.log('Unable to fetch data');
          })    
    }

    render(){
        const validationErrors = this.validation();
        const errors = this.state.errors;
      
        return (
            <div className="bounds course--detail">
                <div>
                    { errors.length?
                        validationErrors
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
                                        placeholder={this.state.course.title}
                                        defaultValue={this.state.course.title}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                                <p>Created by User - {this.state.course.userId}</p>
                            </div>
                            <div className="course--description">
                                <div>
                                    <textarea 
                                        id="description" 
                                        name="description" 
                                        placeholder={this.state.course.description}
                                        defaultValue={this.state.course.description}
                                        onChange={this.handleInputChange}
                                    >                             
                                    </textarea>
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
                                                    placeholder={this.state.course.estimatedTime}  
                                                    defaultValue={this.state.course.estimatedTime}
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
                                                    placeholder={this.state.course.materialsNeeded}
                                                    innerHTML={this.state.course.materialsNeeded}
                                                    onChange={this.handleInputChange}
                                                >
                                                </textarea>
                                            </div>
                                        </li>
                                    </ul> 
                                </div>
                        </div> 
                        <div className="grid-100 pad-bottom">
                            <button className="button" type="submit">Update Course</button>
                            <Link to={'/courses/'+ this.state.course.id} className="button button-secondary" >Cancel</Link>
                        </div>
                    </form>  
                </div>
            </div>
        )
    }
}

export default UpdateCourse;