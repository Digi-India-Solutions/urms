import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPendingTask = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const teamLeaderId = sessionStorage.getItem("teamLeaderId")
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(10); // Number of tasks per page

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('https://api.ssdipl.com/api/get-all-task');
                console.log(response)
                setTasks(response.data.data);
                setIsLoading(false);
            } catch (error) {
                toast.error('Error fetching tasks');
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const filterData = tasks.filter((x) => x.status === "Pending")

     // Pagination logic
     const indexOfLastTask = currentPage * tasksPerPage;
     const indexOfFirstTask = indexOfLastTask - tasksPerPage;
     const currentTasks = filterData.slice(indexOfFirstTask, indexOfLastTask);
 
     const totalPages = Math.ceil(filterData.length / tasksPerPage);
 
     const paginate = (pageNumber) => {
         setCurrentPage(pageNumber);
     };
 
     const handleNext = () => {
         if (currentPage < totalPages) {
             setCurrentPage((prevPage) => prevPage + 1);
         }
     };
 
     const handlePrevious = () => {
         if (currentPage > 1) {
             setCurrentPage((prevPage) => prevPage - 1);
         }
     };

     
    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Pending Tasks</h4>
                </div>
            </div>

            <section className="d-table">
                {isLoading ? (
                    <p>Loading tasks...</p>
                ) : (
                   <>
                    <table className="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Sr.No.</th>
                                <th scope="col">Status</th>
                                <th scope="col">Assign Date</th>
                                <th scope="col">Bank Name</th>
                                <th scope="col">Product</th>
                                <th scope="col">Applicant Name</th>
                                <th scope="col">Contact Number</th>
                                <th scope="col">Applicant Address</th>
                                <th scope="col">Trigger</th>
                                <th scope="col">Verifier</th>
                                {/* <th scope="col">Edit</th>
                                <th scope="col">Delete</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {currentTasks.map((task, index) => (
                                <tr key={task._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{task.status}</td>
                                    <td>{task.assignDate}</td>
                                    <td>{task.bankName}</td>
                                    <td>{task.product}</td>
                                    <td>{task.applicantName}</td>
                                    <td>{task.contactNumber}</td>
                                    <td>{task.address}</td>
                                    <td>{task.trigger}</td>
                                    <td>{task.verifierNameOrId}</td>
                                    {/* <td><Link to={`/edit-task/${task._id}`} className="bt edit">Edit <i className="fa-solid fa-pen-to-square"></i></Link></td>
                                    <td><button className="bt delete" onClick={() => handleDelete(task._id)}>Delete <i className="fa-solid fa-trash"></i></button></td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                            <button
                                onClick={handlePrevious}
                                disabled={currentPage === 1}
                                className="prev-btn"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={currentPage === i + 1 ? 'active' : ''}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                                className="next-btn"
                            >
                                Next
                            </button>
                        </div>
                   </>
                )}
            </section>
        </>
    );

    // const handleDelete = async (taskId) => {
    //     try {
    //         await axios.delete(`https://api.ssdipl.com/api/delete-task/${taskId}`);
    //         setTasks(tasks.filter(task => task._id !== taskId)); // Remove the deleted task from the state
    //         toast.success('Task deleted successfully');
    //     } catch (error) {
    //         toast.error('Error deleting task');
    //     }
    // };
}

export default AdminPendingTask;
