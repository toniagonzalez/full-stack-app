import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import urlBase from '../config';

class DeleteCourse extends Component{

    constructor(props){
        super(props);
    
        this.state = {
            errors: [],
            id: '',
            userId: '',
            title: '',
            description: '',
            estimatedTime: '',
            materialsNeeded: ''
        }
    };

    api = (path, method, body=null, requiresAuth=null, credentials=null) => {
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
        const response = await this.api(path, 'GET', null );

        if (response.status === 400) {
            this.props.history.push('/notfound'); 
        }
        else if (response.status === 200) {
            return response.json();
        }     
    }

    deleteCourse = async() => {
        let path = urlBase + '/courses/' + this.state.id;
        const response = await this.api(path, 'DELETE', null, this.props.encodedCred );
        if (response.status === 204) {
            this.props.history.push('/'); 
        }
        else {
            this.setState({
                errors: ['Ooops, looks like something went wrong!']
            })
        }

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
        const isAuthed = this.props.isAuthed;
       
        return(
            <div>
                <div className="actions--bar">
                    <div className="bounds">
                        <div className="grid-100">
                            {isAuthed && this.state.userId === isAuthed.user[0].id?
                            <span>
                                <button className="button" onClick={this.deleteCourse}>Yes, Delete Course</button> 
                                <Link className="button button-secondary" to={"/courses/" + this.state.id}>No! Go back to Course Details</Link>
                            </span>
                            :
                                <Link className="button button-secondary" to="/">Return to List</Link>
                            }
                        </div>
                    </div>
                </div>
                <div className="bounds course--detail">
                    <div className="grid-66">
                       { this.state.errors.length > 0 ?
                            this.state.errors
                         :
                         []
                       } 
                        {isAuthed && this.state.userId === isAuthed.user[0].id ?
                            <h3 className="delete-warning">Are you sure you want to delete this course?</h3> 
                        :
                            []
                        }
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <h3 className="course--title">{this.state.title}</h3>
                            {isAuthed && this.state.userId === isAuthed.user[0].id?
                                <p>By {isAuthed.user[0].firstName} {isAuthed.user[0].lastName} </p>
                            :
                                <p>Created by User: {this.state.userId}</p>
                            }
                        </div>
                        <div className="course--description">
                            <p>{this.state.description}</p>
                        </div>
                    </div>
                    <div className="grid-25 grid-right">
                        <div className="course--stats">
                            <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                    <h4>Estimated Time</h4>
                                    <h3>{this.state.estimatedTime}</h3>
                                </li>
                                <li className="course--stats--list--item">
                                    <h4>Materials Needed</h4>
                                    <p>
                                        {this.state.materialsNeeded}
                                    </p>
                                </li>
                            </ul> 
                        </div>
                    </div>                       
                </div>
            </div>
           
        )
    }
}

export default DeleteCourse;