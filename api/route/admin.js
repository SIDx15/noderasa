const express = require('express');
const  mongoose  = require('mongoose');
const router = express.Router();
const Order = require('../model/user');
const http = require('http'); // or 'https' for https:// URLs
const fs = require('fs');
const csvcreator = require("json2csv");

/*
router.get('/',async(req, res, next)=>{
    let order = await Order.find()
    res.status(200).json({
        order
    })
})
*/

router.get('/',async(req, res, next)=>{
    let query ={}
    let order = await Order.find(query);
    res.status(200).send({
        message:"success",
        data:order
    })
})

router.get('/hold',async(req, res, next)=>{
    const match = {}
    console.log(req.body);
    if(req.body.status){
        match.status= req.query.status ==='true'
    }
    try{
        let order = await req.Order.populate({
            path:'hold',
            match
        }).execPopulate();
        res.status(200).send(order)

    }catch(e){
        res.status(400).send(e.message)
    }
})

router.get('/posts', async (req,res) => {
    let hold=[]
    let order = await Order.find();
    
    console.log(order);
    for(var i=0;i<order.length;i++)
    {
        if(order[i].status==0)
        hold.push(order[i]);

    }
    console.log(hold);
    res.status(200).json({
        hold
    })
    

})





module.exports = router;