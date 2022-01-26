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


 

router.get('/hold', async (req,res) => {
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


router.get('/:date1/:date2', async(req, res, next) =>{
    
    let hold=[];
    let order = await Order.find()
    let d1=new Date(req.params.date1)
    let d2=new Date(req.params.date2)
    for(var i=0;i<order.length;i++)
    {
        //if(order[i].date >=d1  && order[i].date <=d2)
        //{hold.push(order[i]);
        //    console.log(order[i].date >=d1  && order[i].date <=d2)
        //}
        if((order[i].date>= d1)&&(order[i].date <=d2) )
        {
            
            hold.push(order[i]);
        }
        
        //console.log(order[i].date)
        //console.log((order[i].date>= d1) )


    }
    //console.log(order[0].date)
    console.log( order[0].date < d1)
    res.status(200).send({
        hold
    })

})



module.exports = router;