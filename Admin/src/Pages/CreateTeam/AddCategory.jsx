import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCategory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [teamName, setTeamName] = useState("");
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!teamName) {
            toast.error("Team name is required");
            return;
        }

        setIsLoading(true);
        try {
            // Send POST request to the server running on port 7000
            const response = await axios.post('https://api.ssdipl.com/api/create-team', { teamName });
            if (response.status === 200) {
                toast.success("Team added successfully");
                setTeamName("");
                navigate("/all-team")
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong, please try again");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Team</h4>
                </div>
                <div className="links">
                    <Link to="/all-team" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-9">
                        <label htmlFor="teamName" className="form-label">Team Name</label>
                        <input
                            type="text"
                            name="teamName"
                            className="form-control"
                            id="teamName"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-3 mt-5 text-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`btn ${isLoading ? 'not-allowed' : 'allowed'}`}
                        >
                            {isLoading ? "Please Wait..." : "Add Team"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddCategory;
