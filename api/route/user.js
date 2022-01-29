const express = require('express');
const  mongoose  = require('mongoose');
const router = express.Router();
const Order = require('../model/user');
const Domain = require('../model/domain');
const fetch = require('node-fetch');
const emailValidator = require('deep-email-validator');


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
    
    let msg;
    if(Oid.status)
    {msg="Successful"}
    else
    {if(Oid.holdType===1)
    {
        msg="on hold due to incorrect email"
    }
    else if(Oid.holdType===2)
    {
        msg="on hold due to incorrect zipcode"
    }
    else if(Oid.holdType===3)
    {
        msg="on hold due to incorrect email and zipcode"
    }
    else if(Oid.holdType===4)
    {
        msg="on hold as your email is blacklisted from our company"
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
    var val= await emailValidator.validate(req.params.email);
    console.log(val);
    console.log(val.validators.regex.valid)
    if(val.validators.regex.valid)
    {
        if(email.length>=1)
        {
            msg= "already exists"
            res.status(200).json({
                msg
            })
        }    
        else if(domainnum && domainnum.domain==dom ){
            msg= "domain blacklisted "
            res.status(200).json({
                msg
            })
        }
        else{
            const Oid = await Order.findOne({ orderID: req.params.oid });
            let oldemail = Oid.email;
            if(Oid.holdType===3)
            {
                Order.updateOne({orderID: req.params.oid},{      
                    $set:{
                        orderID : req.body.orderID,
                        name: req.body.name,
                        date: req.body.date,
                        status: "false",
                        zipCode: req.body.zipcode,
                        holdType: "2",
                        email: req.params.email
                    }
                }).then(result=>{
                    res.status(200).json({
                        msg :`email updated from ${oldemail} to ${req.params.email}`
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
            }
            else if(Oid.holdType===1 || Oid.holdType ===4)
            {
                Order.updateOne({orderID: req.params.oid},{      
                    $set:{
                        orderID : req.body.orderID,
                        name: req.body.name,
                        date: req.body.date,
                        status: "true",
                        zipCode: req.body.zipcode,
                        holdType: "0",
                        email: req.params.email
                    }
                }).then(result=>{
                    res.status(200).json({
                        msg :`email updated from ${oldemail} to ${req.params.email}`
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
            }    
        }
    }
    else{
        res.status(200).json({
            msg :`your email ${req.params.email} is invalid`
        })
    }
})



router.put('/:oid/editzipcode/:zipcode',async(req, res, next)=>{
    console.log(req.params.zipcode);
    var t = req.params.zipcode;
    t=t.split(" ").join("");
    console.log(t);
    
    const Oid =await Order.findOne({ orderID: req.params.oid });
    let oldzip = Oid.zipCode;
    fetch(`https://api.postalpincode.in/pincode/${t}`)
    .then(res => res.json())
    .then(json =>{
        console.log(json[0].Status)
        if(json[0].Status=='Success')
        {
            
            if(Oid.holdType===3)
            {
                Order.findOneAndUpdate({orderID: req.params.oid},{
                    $set:{
                        orderID : req.body.orderID,
                        name: req.body.name,
                        date: req.body.date,
                        status: "false",
                        zipCode: t,
                
                        holdType: "1",
                        email: req.body.email
                    }
                })
                .then(result=>{
                    res.status(200).json({
                        updated: `zipcode updated from ${oldzip} to ${req.params.zipcode} `
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
            }
            else if(Oid.holdType===2)
            {
                Order.findOneAndUpdate({orderID: req.params.oid},{
                    $set:{
                        orderID : req.body.orderID,
                        name: req.body.name,
                        date: req.body.date,
                        status: "true",
                        zipCode: t,
                
                        holdType: "0",
                        email: req.body.email
                    }
                })
                .then(result=>{
                    res.status(200).json({
                        updated:`zipcode updated from ${oldzip} to ${req.params.zipcode} `
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
            }
            
        }
        else
        {
            res.status(200).json({
                msg : `your zipcode ${req.params.zipcode} is invalid`
            })
        }
    })
    
    
   
})





module.exports = router;