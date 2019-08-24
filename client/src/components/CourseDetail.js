import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import urlBase from '../config';
import  ReactMarkdown  from 'react-markdown';

class CourseDetail extends Component{

    constructor(props){
        super(props);
    
        this.state = {
          course: {},
          errors: false,
          unhandledError: false,
          loading: true,
          redirect: false
        }
    };

    //fetches courses API
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

    //calls GET method on courses API to retrieve course details
    getCourse = async() => {
        let pathName = window.location.pathname
        let courseId = pathName.replace(/\D/g, '');
        let path = urlBase + '/courses/' + courseId;
        const response = await this.api(path, 'GET', null ).catch(()=>{});

        if (response.status === 404) {
            this.setState({
                loading: false,
                redirect: true
            }) 
        }
        if (response.status === 200) {
            return response.json()
                .then(data => {
                    this.setState({
                        course: data.course,
                        loading: false
                    })
                })
                .catch(error => {
                    this.setState({
                        unhandledError: true,
                        loading: false
                    })
        
                });
        }
        if (response.status === 500){
            this.setState({
                unhandledError: true,
                loading: false
            })
        }     
    }

    //calls 'getCourse' on page mount
    componentDidMount(){  
        this.getCourse();   
    }

    render(){
        //if course is not found in database Redirect to '/notfound'
        if (this.state.redirect){
            return <Redirect to="/notfound"/>;
        }
        if (this.state.unhandledError){
            return <Redirect to="/error"/>;
        }
        
        const isAuthed = this.props.isAuthed;
        const loading = this.state.loading;

        return(
            <div>
                { loading ?
                    <h3 className="loading">Loading...</h3>
                :
                <div>
                    <div className="actions--bar">
                        <div className="bounds">
                            <div className="grid-100">
                                {isAuthed && this.state.course.userId === isAuthed.user[0].id?
                                <span>
                                    <Link className="button" to={"/courses/" + this.state.course.id + "/update"}>Update Course</Link>
                                    <Link className="button" to={"/courses/" + this.state.course.id + "/delete"}>Delete Course</Link> 
                                </span>
                                :
                                    []
                                }
                                <Link className="button button-secondary" to="/">Return to List</Link>
                            </div>
                        </div>
                    </div>
                    <div className="bounds course--detail">
                        <div className="grid-66">
                            <div className="course--header">
                                <h4 className="course--label">Course</h4>
                                <h3 className="course--title">{this.state.course.title}</h3>
                                {isAuthed && this.state.course.userId === isAuthed.user[0].id?
                                    <p>By {isAuthed.user[0].firstName} {isAuthed.user[0].lastName} </p>
                                :
                                    <p>Created by User: {this.state.course.userId}</p>
                                }
                            </div>
                            <div>
                                <ReactMarkdown source={this.state.course.description} className="course--description"/> 
                            </div>                        
                        </div>
                        <div className="grid-25 grid-right">
                            <div className="course--stats">
                                <ul className="course--stats--list">
                                    <li className="course--stats--list--item">
                                        <h4>Estimated Time</h4>
                                        <h3>{this.state.course.estimatedTime}</h3>
                                    </li>
                                    <li className="course--stats--list--item">
                                        <h4>Materials Needed</h4>
                                        <div>
                                            <ReactMarkdown source={this.state.course.materialsNeeded} />
                                        </div>
                                    </li>
                                </ul> 
                            </div>
                        </div>                       
                    </div>
                </div>
                }
            </div>
           
        )
    }
}

export default CourseDetail;