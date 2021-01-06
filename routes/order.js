const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const ErrorResponse = require('../utils/errorResponse');
const {protect, authorize} = require('../middleware/auth')


// @desc      Get all Order
// @route     GET /api/v1/review
// @access    Public
router.get('/', protect, authorize('admin'), async (req, res, next) => { 
    try {
        await Order.countDocuments(async function (err, count) {
            if (!err && count === 0) {
                res.status(204).json({
                    success: true,
                    message: "There are no reviews to fetch"
                })
                return
            }
            else{

                // Creating a copy of the req query
                let reqQuery = {...req.query}

                // Fields to exclude from the req query
                const excludeFields = ['select', 'sort']

                // Goes those through every item in the excludeFields and delets the from reqQuery
                excludeFields.forEach(excludeParam => delete reqQuery[excludeParam])

                let queryString = JSON.stringify(reqQuery)
                queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

                // Finding resource
                let fetcheQuerys
                
                // Select Fields
                if (req.query.select) {
                    const fields = req.query.select.split(',').join(' ');
                    fetcheQuerys = await Order.find(JSON.parse(queryString)).select(fields);
                }
                else {
                    fetcheQuerys = await Order.find(JSON.parse(queryString));
                }
                
                res.status(200).json({
                    success: true,
                    fetcheQuerys
                })
                return
            }
        })
    } catch (error) {
        return next(new ErrorResponse(err.message, 400));
    }
})


// @desc      Post a single Order
// @route     POST /api/v1/review
// @access    Private
router.post('/', async (req, res, next) => { 

    await Order.create(req.body, function(err, order){
        if(err){
            next(err)
            return
        }
        else{
            res.status(201).json({
                success: true,
                order
            })
        }
    })
})


// @desc      Delete Order
// @route     GET /api/v1/review
// @access    Private
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {

    try {

        await Order.findById({_id: req.params.id}, async function(err, review) {
            if(err) return next(err)
    
            if(!review){
                return next(new ErrorResponse('Order does not exist', 400));
            }
            else{
                const creatorOfTheOrder = review.user.toString()

                if(creatorOfTheOrder === req.user.id || req.user.role === 'admin'){ 

                    await Order.findByIdAndDelete(req.params.id)
                    
                    res.status(201).json({
                        success: true,
                        message: "Order deleted"
                    })
                }
                else{
                    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this review`, 404));
                }
            }
        })
        
    } catch (err) {
        return next(new ErrorResponse(err.message, 400));
    }

})


// @desc      Delete all Order
// @route     GET /api/v1/review
// @access    Private
router.delete('/', protect, authorize('admin'), async (req, res, next) => {

    try {

        // Deleting all removed accounts = { removeItem : true }

        await Order.deleteMany(req.query);

        res.status(200).json({
            success: true,
            message: "Orders removed"
        })

        return
        
    } catch (err) {
        return next(new ErrorResponse(err.message, 400));
    }

})


// @desc      Get a single Order
// @route     GET /api/v1/review
// @access    Public
router.get('/:id', async (req, res, next) => { 
    
    try {

        await Order.findById({_id: req.params.id}, async function(err, review) {
            if(err) return next(err)
    
            if(!review){
                return next(new ErrorResponse('Order does not exist', 400));
            }
            else{
                res.status(200).json({
                    success: true,
                    review
                })
            }
        })
    } 
    catch (err) {
        return next(new ErrorResponse(err.message, 400));
    }

})


module.exports = router;