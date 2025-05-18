const express = require('express');
const router = express.Router();
const db = require('../_helpers/db');
const authorize = require('../_middleware/authorize');
const Role = require('../_helpers/role');

// routes
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize(), create);
router.put('/:id', authorize(), update);
router.delete('/:id', authorize(Role.Admin), _delete);

module.exports = router;

async function getAll(req, res, next) {
    try {
        const requests = await db.Request.findAll({
            include: [
                { model: db.RequestItem, as: 'requestItems' },
                { model: db.Employee, as: 'employee' }
            ]
        });
        res.json(requests);
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const request = await db.Request.findByPk(req.params.id, {
            include: [
                { model: db.RequestItem, as: 'requestItems' },
                { model: db.Employee, as: 'employee' }
            ]
        });
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        if (req.user.role !== Role.Admin && request.employeeId !== req.user.employeeId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.json(request);
    } catch (err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        // For admin users, use the provided employeeId
        // For employee users, use their own employeeId
        const employeeId = req.user.role === Role.Admin 
            ? req.body.employeeId 
            : req.user.employeeId;

        if (!employeeId) {
            return res.status(400).json({ message: 'Employee ID is required' });
        }

        // Verify employee exists
        const employee = await db.Employee.findByPk(employeeId);
        if (!employee) {
            return res.status(400).json({ message: 'Employee not found' });
        }

        const request = await db.Request.create({
            ...req.body,
            employeeId
        }, {
            include: [{ model: db.RequestItem, as: 'requestItems' }]
        });

        res.status(201).json(request);
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: err.message });
        }
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const request = await db.Request.findByPk(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Only allow admin or the request owner to update
        if (req.user.role !== Role.Admin && request.employeeId !== req.user.employeeId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await request.update(req.body);

        // Update request items if provided
        if (req.body.requestItems) {
            await db.RequestItem.destroy({ where: { requestId: request.id } });
            await db.RequestItem.bulkCreate(
                req.body.requestItems.map(item => ({
                    ...item,
                    requestId: request.id
                }))
            );
        }

        // Get updated request with items
        const updatedRequest = await db.Request.findByPk(request.id, {
            include: [
                { model: db.RequestItem, as: 'requestItems' },
                { model: db.Employee, as: 'employee' }
            ]
        });

        res.json(updatedRequest);
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: err.message });
        }
        next(err);
    }
}

async function _delete(req, res, next) {
    try {
        const request = await db.Request.findByPk(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        await request.destroy();
        res.json({ message: 'Request deleted successfully' });
    } catch (err) {
        next(err);
    }
}