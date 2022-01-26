const express = require('express');
const  mongoose  = require('mongoose');
const router = express.Router();
const Order = require('../model/user');
const Domain = require('../model/domain');
const fetch = require('node-fetch');

router.post('/domain',(req, res, next)=>{
    console.log(req.body);
    console.log('oder status =');
    console.log( req.body[0].status);
    console.log( req.body[0].orderID);

    const user = new Domain({
        
        domain: req.body[0].domain
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

router.post('/',(req, res, next)=>{
    console.log(req.body);
    console.log('oder status =');
    console.log( req.body[0].status);
    console.log( req.body[0].orderID);

    const user = new Order({
        
        orderID:req.body[0].orderID,
        name:req.body[0].name,
        email:req.body[0].email,
        zipCode:req.body[0].zipCode,
        status:req.body[0].status,
        holdType:req.body[0].holdType,
        date:req.body[0].date
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



router.put('/:oid/editemail/:email',async(req, res, next)=>{
    console.log(req.params.email)
    
    var msg;
    var dom = req.params.email.substring(req.params.email.lastIndexOf("@") +1);
    let email = await Order.find({email : req.params.email});
    
    let domainnum = await Domain.findOne({ domain: dom });
    console.log(dom);
    console.log(domainnum.domain);
    if(email.length>=1)
    {
        msg= "already exists"
        res.status(200).json({
            msg
        })
    }
    else if(domainnum.domain==dom){
        msg= "domain blacklisted "
        res.status(200).json({
            msg
        })
    }
    else{
        Order.findOneAndUpdate({orderID: req.params.oid},{
            $set:{
                orderID : req.body.orderID,
                name: req.body.name,
                date: req.body.date,
                status: req.body.status,
                zipCode: req.body.zipcode,
        
                holdType: req.body.holdType,
                email: req.params.email
            }
        })
        .then(result=>{
            res.status(200).json({
                msg :'email updated'
            })
        })
        .catch(err=>{
            console.log(err)
        })
    }
    
})

router.get('/:oid/editzipcode/:zipcode',async(req, res, next)=>{
    console.log(req.params.zipcode);
    var t;
    fetch(`https://api.postalpincode.in/pincode/${req.params.zipcode}`)
    .then(res => res.json())
    .then(json =>{
        console.log(json[0].Status)
        if(json[0].Status=='Success')
        {
            Order.findOneAndUpdate({orderID: req.params.oid},{
                $set:{
                    orderID : req.body.orderID,
                    name: req.body.name,
                    date: req.body.date,
                    status: req.body.status,
                    zipCode: req.params.zipcode,
            
                    holdType: req.body.holdType,
                    email: req.body.email
                }
            })
            .then(result=>{
                res.status(200).json({
                    updated: result
                })
            })
            .catch(err=>{
                console.log(err)
            })
        }
        else
        {
            res.status(200).json({
                msg : "your zipcode is invalid fam"
            })
        }
    })
    
   
})

router.put('/:oid/editzipcode/:zipcode',async(req, res, next)=>{
    
    
    Order.findOneAndUpdate({orderID: req.params.oid},{
        $set:{
            orderID : req.body.orderID,
            name: req.body.name,
            date: req.body.date,
            status: req.body.status,
            zipCode: req.params.zipcode,
    
            holdType: req.body.holdType,
            email: req.body.email
        }
    })
    .then(result=>{
        res.status(200).json({
            updated: result
        })
    })
    .catch(err=>{
        console.log(err)
    })
})





module.exports = router;