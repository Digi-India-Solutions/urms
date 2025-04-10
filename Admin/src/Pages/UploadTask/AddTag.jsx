import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddTag = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            toast.error('Please select an Excel file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsLoading(true);
        
        try {
            const response = await axios.post('https://api.ssdipl.com/api/upload-task', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsLoading(false);
            console.log(response)
            if (response.status === 200) {
                toast.success(response.data.message);
            } else {
                toast.error('Error uploading tasks');
            }
        } catch (error) {
            setIsLoading(false);
            toast.error('Error uploading tasks. Please try again.');
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Task</h4>
                </div>
                <div className="links">
                    <Link to="/all-task" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-9">
                        <label htmlFor="file" className="form-label">Upload Excel File</label>
                        <input 
                            type="file" 
                            name="file" 
                            className="form-control" 
                            id="file" 
                            onChange={handleFileChange}
                            accept=".xlsx, .xls"
                        />
                    </div>  
                    <div className="col-md-3 mt-5 text-center">
                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            className={`btn ${isLoading ? 'not-allowed':'allowed'}`}
                        >
                            {isLoading ? "Please Wait..." : "Add Task"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddTag;
