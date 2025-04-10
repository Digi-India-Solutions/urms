import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';

const AllCompleteTask = () => {
    const [tasks, setTasks] = useState([]);
    const [remarkData, setRemarkData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRemark, setSelectedRemark] = useState(''); // State to hold selected remark
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const [selectedImages, setSelectedImages] = useState([]); // Track selected images

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('https://api.ssdipl.com/api/get-all-task');
                setTasks(response.data.data); 
                setIsLoading(false);
            } catch (error) {
                toast.error('Error fetching tasks');
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, []);


    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://api.ssdipl.com/api/delete-task/${id}`);
            if (response.status === 200) {
                toast.success('Task deleted successfully');
                setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id)); // Remove the deleted task from the list
            } else {
                toast.error('Failed to delete task');
            }
        } catch (error) {
            toast.error('Error deleting task');
        }
    };

      // Fetch remarks
      useEffect(() => {
        const fetchRemarkData = async () => {
            try {
                const response = await axios.get('https://api.ssdipl.com/api/get-remark');
                setRemarkData(response.data.data);
            } catch (error) {
                console.error('Error fetching remarks', error);
            }
        };
        fetchRemarkData();
    }, []);

    const filterData = tasks.filter((x)=>x.status==="Complete")

    const getAllImages = (remark) => {
        const addressImages = remark?.addressImage || [];
        const otherImages = remark?.images || [];
        return [...addressImages, ...otherImages];
    };

    const downloadImagesAsPdf = async (images, taskId) => {
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
    
        const margin = 10;
        const availableWidth = pageWidth - 2 * margin;
        const availableHeight = pageHeight - 2 * margin;
    
        let totalImageHeight = 0;
        const imageHeights = [];
    
        // Load all images and calculate total height for proportionate scaling
        const loadedImages = await Promise.all(
            images.map(imgUrl => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous'; // Allow cross-origin image loading
                    img.src = imgUrl;
    
                    img.onload = () => {
                        const aspectRatio = img.width / img.height;
                        const height = availableWidth / 2 / aspectRatio; // Scale image height proportionally to fit within half the width
                        imageHeights.push(height);
                        totalImageHeight += height; // Calculate the total height of all images combined
    
                        resolve(img);
                    };
    
                    img.onerror = () => {
                        console.error('Failed to load image:', imgUrl);
                        resolve(null); // Skip this image if there's an error
                    };
                });
            })
        );
    
        let scalingFactor = 1;
        if (totalImageHeight > availableHeight) {
            scalingFactor = availableHeight / totalImageHeight; // Adjust scaling factor if total image height exceeds available height
        }
    
        let positionY = margin;
        let positionX = margin;
        let imagesInRow = 0;
    
        loadedImages.forEach((img, index) => {
            if (img) {
                const aspectRatio = img.width / img.height;
                const width = availableWidth / 2 - margin; // Width for two images per row
                const height = imageHeights[index] * scalingFactor;
    
                // Log the image positioning and dimensions
                console.log('Adding Image:', index, 'PositionY:', positionY, 'PositionX:', positionX, 'Width:', width, 'Height:', height);
    
                doc.addImage(img, 'JPEG', positionX, positionY, width, height);
    
                // Track the position for the next image in the row
                imagesInRow++;
    
                if (imagesInRow === 2) {
                    imagesInRow = 0; // Reset for the next row
                    positionY += height + margin; // Move to the next line after two images
                    positionX = margin; // Reset X position to start a new row
                } else {
                    positionX += width + margin; // Move X position for the next image in the row
                }
            }
        });
    
        // If there’s space left, you may want to add extra margin before the next row of images.
        doc.save(`task_${taskId}_images.pdf`);
    };

    
    const getRemarkForTask = (taskId) => {
        return remarkData.find(remark => remark.taskID?._id === taskId) || {};
    };

    const handleViewRemark = (remark) => {
        setSelectedRemark(remark?.remark || 'No Remark');
        setSelectedImages(getAllImages(remark)); // Set the images related to this remark
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRemark('');
        setSelectedImages([]); // Clear images when modal is closed
    };


    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Complete Tasks</h4>
                </div>
            </div>

            <section className="d-table">
                {isLoading ? (
                    <p>Loading tasks...</p>
                ) : (
                    <table className="table table-bordered table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Sr.No.</th>
                                <th scope="col">Status</th>
                                <th scope="col">Ass Date</th>
                                <th scope="col">Bank</th>
                                <th scope="col">Product</th>
                                <th scope="col">Name</th>
                                <th scope="col">Number</th>
                                <th scope="col">Address</th>
                                <th scope="col">Tri</th>
                                <th scope="col">Verifier</th>
                                <th scope="col">Images</th>
                                <th scope="col">Remark</th>
                                {/* <th scope="col">Edit</th> */}
                                <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterData.map((task, index) => {
                                const remark = getRemarkForTask(task._id);
                                const allImages = getAllImages(remark); // Get all combined images

                                return (
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
                                        <td>
                                            {allImages.length > 0 ? (
                                                <button onClick={() => downloadImagesAsPdf(allImages, task._id)} className='btn btn-success'>
                                                    Download
                                                </button>
                                            ) : (
                                                <p>No Images</p>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleViewRemark(remark)}
                                            >
                                                View
                                            </button>
                                        </td>
                                        <td><button className="bt delete" onClick={() => handleDelete(task._id)}><i className="fa-solid fa-trash"></i></button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </section>

               {/* Modal */}
               {showModal && (
                <div className="modal fade show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Remark Details</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>{selectedRemark}</p>
                                <div className="image-gallery">
                                    {selectedImages.map((image, index) => (
                                        <img key={index} src={image} alt={`Remark Image ${index + 1}`} style={{ maxWidth: '100%' }} />
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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

export default AllCompleteTask;
