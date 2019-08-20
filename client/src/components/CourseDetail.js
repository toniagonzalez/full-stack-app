import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import urlBase from '../config';

class CourseDetail extends Component{

    constructor(props){
        super(props);
    
        this.state = {
          course: {},
          errors: false
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
        let courseId = window.location.pathname.substr(9);
        let path = urlBase + '/courses/' + courseId;
        const response = await this.api(path, 'GET', null );

        if (response.status === 400) {
            this.props.history.push('/notfound'); 
        }
        else if (response.status === 200) {
            return response.json();
        }     
    }

    actionsBar = ()=>{
        const isAuthed = this.props.isAuthed;
        
        return( 
                <div className="actions--bar">
                    <div className="bounds">
                        <div className="grid-100">
                            {isAuthed && this.state.course.userId === isAuthed.user[0].id?
                            <span>
                                <Link className="button" to={"/courses/" + this.state.course.id + "/update"}>Update Course</Link>
                                <Link className="button" to="/">Delete Course</Link> 
                            </span>
                            :
                                []
                            }
                            <Link className="button button-secondary" to="/">Return to List</Link>
                        </div>
                    </div>
                </div>
        )
    }

    courseDetail = ()=>{
        const isAuthed = this.props.isAuthed;
        return (
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
                        <div className="course--description">
                            <p>{this.state.course.description}</p>
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
                                    <p>
                                        {this.state.course.materialsNeeded}
                                    </p>
                                </li>
                            </ul> 
                        </div>
                    </div>                       
                </div>
        )
    }

    componentDidMount(){  
        this.getCourse()
          .then(data => {
            this.setState({
                course: data.course,
                loading: false
            })
          })
          .catch(error => {
            console.log('Unable to fetch data');
          })    
    }

    render(){
        const actionsBar = this.actionsBar();
        const courseDetail = this.courseDetail();

        return(
            <div>
                { actionsBar }
                { courseDetail }
            </div>
           
        )
    }
}

export default CourseDetail;