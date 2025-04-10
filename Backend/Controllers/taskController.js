const ExcelJS = require('exceljs');
const fs = require('fs');
const TaskModel = require('../Models/TaskModel');

const uploadTasks = async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(req.file.path);
        const worksheet = workbook.worksheets[0];

        const tasks = [];

        const parseDate = (dateValue) => {
            if (typeof dateValue === 'string') {
                return dateValue;
            } else if (dateValue instanceof Date) {
                const day = String(dateValue.getDate()).padStart(2, '0');
                const month = String(dateValue.getMonth() + 1).padStart(2, '0');
                const year = dateValue.getFullYear();
                return `${day}-${month}-${year}`;
            } else if (typeof dateValue === 'number') {
                const jsDate = new Date(Math.round((dateValue - 25569) * 86400 * 1000));
                const day = String(jsDate.getDate()).padStart(2, '0');
                const month = String(jsDate.getMonth() + 1).padStart(2, '0');
                const year = jsDate.getFullYear();
                return `${day}-${month}-${year}`;
            } else {
                return 'Invalid Date';
            }
        };

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Skip the header row
                const task = {
                    assignDate: parseDate(row.getCell(2).value), // Assuming the date is in column B
                    bankName: row.getCell(3).value || '', // Handle null or undefined
                    product: row.getCell(4).value || '', // Handle null or undefined
                    applicantName: row.getCell(5).value || '', // Handle null or undefined
                    address: row.getCell(6).value || '', // Handle null or undefined
                    contactNumber: row.getCell(7).value || '', // Handle null or undefined
                    trigger: row.getCell(8).value || '', // Handle null or undefined
                    verifierNameOrId: row.getCell(9).value || '', // Handle null or undefined
                };

                // Make sure to trim string values, if they're not null
                for (const key in task) {
                    if (typeof task[key] === 'string') {
                        task[key] = task[key].trim(); // Trim only if it's a string
                    }
                }

                tasks.push(task);
            }
        });

        // Check for existing records based on multiple fields
        const existingTasks = await TaskModel.find({
            $or: tasks.map(task => ({
                assignDate: task.assignDate,
                bankName: task.bankName,
                product: task.product,
                applicantName: task.applicantName,
                contactNumber: task.contactNumber
            }))
        });

        // Filter out records that already exist in the database
        const existingRecords = new Set(existingTasks.map(task =>
            `${task.assignDate}-${task.bankName}-${task.product}-${task.applicantName}-${task.contactNumber}`
        ));

        const newTasks = tasks.filter(task => {
            const taskKey = `${task.assignDate}-${task.bankName}-${task.product}-${task.applicantName}-${task.contactNumber}`;
            return !existingRecords.has(taskKey); // Insert only if the task doesn't exist
        });

        if (newTasks.length > 0) {
            await TaskModel.insertMany(newTasks);
            res.status(200).json({
                message: `${newTasks.length} new tasks added successfully.`,
            });
        } else {
            res.status(200).json({
                message: 'No new tasks to add. All records already exist.',
            });
        }

        // Delete the uploaded file
        fs.unlinkSync(req.file.path);
    } catch (error) {
        console.error("Error uploading tasks:", error);
        res.status(500).json({ message: 'Error uploading tasks', error });
    }
};

const getTask = async (req, res) => {
    try {
        const tasks = await TaskModel.find()
        if (!tasks) {
            return res.status(404).json({
                success: false,
                message: "Task Not Found",
            })
        }
        res.status(200).json({
            success: true,
            message: "Task Found Successfully",
            data: tasks.reverse()
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const updateTask = async (req, res) => {
    try {
        const { id } = req.params; // Extract the task id from the request parameters

        // Get updated fields from the request body
        const updatedTaskData = req.body;

        // Check if task with the given id exists
        const task = await TaskModel.findById(id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        // Update task fields
        const updatedTask = await TaskModel.findByIdAndUpdate(id, updatedTaskData, {
            new: true, // Return the updated task
            runValidators: true, // Ensure schema validations are applied
        });

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: updatedTask,
        });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const data = await TaskModel.findById(req.params.id)
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Task Not Found"
            })
        }
        await data.deleteOne()
        return res.status(200).json({
            success: true,
            message: "Task Delete Successfully"
        })
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    uploadTasks, getTask, updateTask, deleteTask
};
