const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');

// routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authorize(Role.Admin), create);
router.put('/:id', authorize(Role.Admin), update);
router.delete('/:id', authorize(Role.Admin), _delete);

module.exports = router;

async function getAll(req, res, next) {
    try {
        const departments = await db.Department.findAll();
        res.json(departments);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const department = await db.Department.findByPk(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json(department);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        // Validate request body
        if (!req.body.name || !req.body.description) {
            return res.status(400).json({ message: 'Name and description are required' });
        }

        // Check if department with same name exists
        const existingDepartment = await db.Department.findOne({
            where: { name: req.body.name }
        });

        if (existingDepartment) {
            return res.status(400).json({ message: 'Department with this name already exists' });
        }

        const department = await db.Department.create(req.body);
        res.status(201).json(department);
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: err.message });
        }
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const department = await db.Department.findByPk(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        // Check if new name conflicts with existing department
        if (req.body.name && req.body.name !== department.name) {
            const existingDepartment = await db.Department.findOne({
                where: { name: req.body.name }
            });

            if (existingDepartment) {
                return res.status(400).json({ message: 'Department with this name already exists' });
            }
        }

        await department.update(req.body);
        res.json(department);
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: err.message });
        }
        next(err);
    }
}

async function _delete(req, res, next) {
    try {
        const department = await db.Department.findByPk(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        await department.destroy();
        res.json({ message: 'Department deleted successfully' });
    } catch (err) {
        next(err);
    }
}