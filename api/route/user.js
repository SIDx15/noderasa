const express = require('express');
const  mongoose  = require('mongoose');
const router = express.Router();
const Order = require('../model/user');

router.get('/:oid',async(req, res, next)=>{
    const Oid = await Order.findOne({ orderID: req.params.oid });
    console.log(Oid);
    var msg;
    if(Oid.status)
    {msg="delivered"}
    else
    {if(Oid.holdType===1)
    {
        msg="your order is in hold due to email"
    }
    else if(Oid.holdType===2)
    {
        msg="order on hold due to zip code"
    }
    else if(Oid.holdType===3)
    {
        msg="order on hold due to zip code and email"
    }
    }

    res.status(200).json({
        msg
       
    })
})


router.put('/:oid/:email',async(req, res, next)=>{
    console.log(req.params.email)
    console.log(req.params.oid)
    Order.findOneAndUpdate({orderID: req.params.id},{

    })
})


router.post('/',(req, res, next)=>{
    console.log(req.body);
    console.log('oder status =');
    console.log( req.body.status);

    const user = new Order({
        
        orderID:req.body.orderID,
        name:req.body.name,
        email:req.body.email,
        zipCode:req.body.zipCode,
        status:req.body.status,
        holdType:req.body.holdType,
        date:req.body.date
    })

    user.save()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            newuser :result
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })

})



module.exports = router;