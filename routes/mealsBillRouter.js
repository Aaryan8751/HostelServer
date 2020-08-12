const express = require('express');
const bodyParser = require('body-parser');
const mealsBillRouter = express.Router();
mealsBillRouter.use(bodyParser.json());
const MealsBill = require('../models/mealsBill');
const User = require('../models/user');
var authenticate = require('../authenticate');

mealsBillRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})

.get(authenticate.verifyUser, (req, res, next) => {
    MealsBill.findOne({hostel: req.user.hostel})
    .populate('hostel')
    .then((mealsBill) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(mealsBill);
    }, err => next(err))
    .catch(err => next(err))
}) 

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.end('Put request not valid on the /mealsBill end point')
}) 

.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    req.body.hostel = req.user.hostel;
    MealsBill.create(req.body)
    .then((mealsBill) => {
        MealsBill.findById(mealsBill._id)
        .populate('hostel')
        .then((mealsBill) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(mealsBill)
        })
    }, (err) => next(err))
    .catch((err) => next(err))
}) 

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    MealsBill.deleteMany({hostel: req.user.hostel})
    .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(response);
    }, (err) => next(err))
}) 

mealsBillRouter.route('/:studentId')
.get(authenticate.verifyUser, (req, res, next) => {
    MealsBill.find({sid: req.params.studentId})
    .then((mealsBill) => {
        if(mealsBill != null) {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(mealsBill);
        } else {
            const err = new Error("mealsBill not found");
            err.status = 403;
            return(next(err));
        }
    }, (err) => next(err))
    .catch(err => next(err));  
}) 
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    MealsBill.find({sid: req.params.studentId})
    .then((mealsBill) => {
        if(mealsBill != null) {
            MealsBill.findByIdAndUpdate(req.params.mealsBillId,{ 
                $set: req.body
            }, { new: true })
            .then((newBill) => {
                MealsBill.findById(newBill._id)
                .then((bill) => {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(bill);
                }, err => next(err))
            }, err => next(err))
        }
    }, err => next(err))
    .catch(err => next(err))
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.end('Post operation not available')
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    MealsBill.deleteOne({sid: req.params.sid})
    .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(response);
    }, err => next(err))
    .catch(err => next(err))
})

module.exports = mealsBillRouter;

