import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const BackendSingup = () => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        backendId: "",
        password: ""
    });

    // Update the state based on input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://api.ssdipl.com/api/backend/signup', data);
            if (response.status === 200) {
                toast.success(response.data.message);
                setData({
                    name: "",
                    email: "",
                    phoneNumber: "",
                    password: ""
                });
                navigate("/all-backend-users")
            }
        } catch (error) {
            if (error.response && error.response.data) {
                console.error('Signup failed:', error.response.data.message);
                toast.error(error.response.data.message);
            } else {
                console.error('Error during signup:', error);
                alert('An error occurred. Please try again.');
            }
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Backend Member</h4>
                </div>
                <div className="links">
                    <Link to="/all-backend-users" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>
            <div className="main-login">
                <div className="login-container">
                    <h2 className="login-title">Create Account For Backend</h2>
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
                            <label>ID</label>
                            <input
                                type="text"
                                name="backendId"
                                value={data.backendId}
                                onChange={handleChange}
                                className="form-control"
                                required
                                placeholder='Make A Unique ID'
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

export default BackendSingup;
