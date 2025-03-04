const taskModel = require('../models/task');

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await taskModel.getAllTasks();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener tareas', error });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await taskModel.getTaskById(req.params.id);
        if (task) {
            res.status(200).json(task);
        } else {
            res.status(404).json({ message: "Tarea no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la tarea', error });
    }
};

exports.createTask = async (req, res) => {
    try {
        const newTask = await taskModel.createTask(req.body.title);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la tarea', error });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const updatedTask = await taskModel.updateTask(req.params.id, req.body.title);
        if (updatedTask) {
            res.status(200).json(updatedTask);
        } else {
            res.status(404).json({ message: "Tarea no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la tarea', error });
    }
};
