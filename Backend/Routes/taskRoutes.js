const express = require('express');
const { uploadTasks, getTask, updateTask, deleteTask } = require('../Controllers/taskController');
const upload = require('../Middleware/Multer');
const TaskRouter = express.Router();

TaskRouter.post('/upload-task', upload.single('file'), uploadTasks);
TaskRouter.get('/get-all-task', getTask);
TaskRouter.delete('/delete-task/:id', deleteTask);
TaskRouter.put('/update-task/:id', updateTask);

module.exports = TaskRouter;
