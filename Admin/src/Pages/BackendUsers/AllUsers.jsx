import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllUsers = () => {
    const [data, setData] = useState([])

    const getApiData = async () => {
        try {
            const res = await axios.get("https://api.ssdipl.com/api/get-backend-record")
            if (res.status === 200) {
                const newdata = res.data.data
                const filterData = newdata.filter((x) => x.role === "Backend")
                setData(filterData.reverse())
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getApiData()
    }, [])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleString('en-GB', options);
    };

    return (
        <>
            <div className="bread">
                <div className="head">
                    <h4>All Backend Users</h4>
                </div>
                <div className="links">
                    <Link to="/backend-account" className="add-new">Add New <i class="fa-solid fa-plus"></i></Link>
                </div>
            </div>

            <section className="d-table">
                <div className="table-responsive mt-4">
                    <table className="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Sr.No.</th>
                                <th scope="col">Name</th>
                                <th scope="col">Backend User Id</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone Number</th>
                                <th scope="col">Role</th>
                                <th scope="col">Created At</th>
                                {/* Add more columns as needed */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((item, index) =>
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <th>{item.name}</th>
                                        <th>{item.backendId}</th>
                                        <th>{item.email}</th>
                                        <th>{item.phoneNumber}</th>
                                        <th>{item.role}</th>
                                        <th>{formatDate(item.createdAt)}</th>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
};

export default AllUsers;
