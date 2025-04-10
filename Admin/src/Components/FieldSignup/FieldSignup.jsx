import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const FieldSignup = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        fieldExcutiveId: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://api.ssdipl.com/api/field/signup', data);
            console.log(response);
            if (response.status === 200) {
                toast.success(response.data.message);
                setData({
                    name: "",
                    email: "",
                    phoneNumber: "",
                    fieldExcutiveId: "",
                    teamLeader: "", // Resetting teamLeader to an empty string
                    password: ""
                });
                navigate("/all-field-users");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An error occurred. Please try again.');
            }
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Field Excutive</h4>
                </div>
                <div className="links">
                    <Link to="/all-field-users" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>
            <div className="main-login">
                <div className="login-container">
                    <h2 className="login-title">Create Account For Field Excutive</h2>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                className="form-control"
                                required
                                placeholder='Name'
                            />
                        </div>
                        <div className="form-group">
                            <label>Field Excutive Id</label>
                            <input
                                type="text"
                                name="fieldExcutiveId"
                                value={data.fieldExcutiveId}
                                onChange={handleChange}
                                className="form-control"
                                required
                                placeholder='Field Excutive Id'
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                className="form-control"
                                required
                                placeholder='Email'
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={data.phoneNumber}
                                onChange={handleChange}
                                className="form-control"
                                required
                                placeholder='Phone Number'
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                className="form-control"
                                required
                                placeholder='Password'
                            />
                        </div>
                        <button type="submit" className="login-button mt-2">Sign Up</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default FieldSignup;
