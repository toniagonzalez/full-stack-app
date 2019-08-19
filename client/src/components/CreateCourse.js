import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class CreateCourse extends Component {

    validation = ()=>{
        return(
            <div>
                <h2 className="validation--errors--label">Validation errors</h2>
                <div validation-errors>
                    <ul>
                    <li>Error Message</li> 
                    </ul>
                </div>
            </div>
        )
    }

    form = ()=>{
        return(
            <form>
                <div className="grid-66">
                    <div className="course--header">
                        <h4 className="course--label">Course</h4>
                        <div>
                            <input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Title"/>
                        </div>
                        <p>Author</p>
                    </div>
                    <div className="course--description">
                        <div>
                            <textarea id="description" name="description" placeholder="Course Description..."/>
                        </div>
                    </div>
                </div>
                <div className="grid-25 grid-right">
                        <div className="course--stats">
                            <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                    <h4>Estimated Time</h4>
                                    <div>
                                        <input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours"/>
                                    </div>
                                </li>
                                <li className="course--stats--list--item">
                                    <h4>Materials Needed</h4>
                                    <div>
                                        <textarea id="materialsNeeded" name="materialsNeeded" placeholder="List Materials..."/>
                                    </div>
                                </li>
                            </ul> 
                        </div>
                    </div> 
                <div className="grid-100 pad-bottom">
                    <button className="button" type="submit">Create Course</button>
                    <Link to="/" className="button button-secondary" onclick="event.preventDefault()">Cancel</Link>
                </div>
            </form>
        )
    }

    render(){
        const validationErrors = this.validation();
        const createCourseForm = this.form();

        return (
            <div className="bounds course--detail">
                <h1>Create Course</h1>
                <div>
                    { validationErrors }
                    { createCourseForm }  
                </div>
            </div>
        )
    }
}

export default CreateCourse;