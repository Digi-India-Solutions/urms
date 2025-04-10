import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditTag = () => {
    const [btnLoading, setBtnLoading] = useState(false);
    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Tag</h4>
                </div>
                <div className="links">
                    <Link to="/all-tags" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                    <form className="row g-3">
                        <div className="col-md-4">
                            <label htmlFor="title" className="form-label">Tag Name</label>
                            <input type="text"  name='title'  className="form-control" id="title" />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="TagColour" className="form-label">Tag Color</label>
                            <input type="color"  name='TagColour'  className="form-control" id="TagColour" />
                        </div>

                        <div className="col-12 text-center">
                            <button type="submit" className={`${btnLoading ? 'not-allowed':'allowed'}`} >{btnLoading ? "Please Wait.." : "Update Tag"} </button>
                        </div>
                    </form>
            </div>
        </>
    );
};

export default EditTag;
