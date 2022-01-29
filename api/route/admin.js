const express = require('express');
const  mongoose  = require('mongoose');
const router = express.Router();
const Order = require('../model/user');
const http = require('http'); // or 'https' for https:// URLs
const {promises: fs} = require('fs');
const fss =require('fs');
const createcsvwriter = require('csv-writer').createObjectCsvWriter;



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
        if(!order[i].status)
        {
            if((order[i].date>= d1)&&(order[i].date <=d2) )
            {
                hold.push(order[i]);
            }

        }
        


    }
    //console.log(order[0].date)
    //console.log( order[0].date < d1)
    if(hold.length===0)
    {
        res.status(200).send({
            msg: "no order available"
        })
    }
    else{
        res.status(200).send({
            hold
        })
    }

})
/*
router.get('/:date1', async(req, res, next) =>{
    
    let hold=[];
    let order = await Order.find()
    let d1=new Date(req.params.date1)
    let d2 =new Date(req.params.date1);
    d1.setDate(d2.getDate() - 1)
    d2.setDate(d2.getDate() + 1)
    console.log(d1);
    console.log(d2);
    
    for(var i=0;i<order.length;i++)
    {
        //console.log(order.status===false);
        //if(order.status==false)
        
            if((order[i].date> d1)&&(order[i].date <d2) )
            {
                hold.push(order[i]);
            }
        

    }
    console.log(hold.length);
    if(hold.length===0)
    {
        res.status(200).send({
            msg: "no order available"
        })
    }
    else{
        res.status(200).send({
            hold
        })
    }
    
    
})
*/
const csvWriter = createcsvwriter({
    path:'./hold.csv',
    header:['orderID', 'name', 'date','status','zipCode','holdType','email'].map((item)=>({id: item, title: item}))

})

const csvWriter = createcsvwriter({
    path:'./date.csv',
    header:['orderID', 'name', 'date','status','zipCode','holdType','email'].map((item)=>({id: item, title: item}))

})

async function converterjson(){
    const file_data = await fs.readFile('./api/route/hold.json', (err, data) => {
        console.log(data);})
    console.log(file_data);
    console.log("hello");
    const parsed_data = JSON.parse(file_data);
    console.log(parsed_data);
    try{
       await csvWriter.writeRecords(parsed_data.hold);
    }catch(err){
        console.log(err);
        console.log("err");
    }
}

async function converterdate(){
    const file_data = await fs.readFile('./api/route/date.json', (err, data) => {
        console.log(data);})
    console.log(file_data);
    console.log("hello");
    const parsed_data = JSON.parse(file_data);
    console.log(parsed_data);
    try{
       await csvWriter.writeRecords(parsed_data.hold);
    }catch(err){
        console.log(err);
        console.log("err");
    }
}



router.get('/download',(req, res, next)=>{

    const url='http://localhost:3000/admin/hold';
     

    http.get(url,(resp) => {
        // Image will be stored at this path
        const path = `./api/route/hold.json`; 
        const filePath = fss.createWriteStream(path);
        console.log(filePath)
        resp.pipe(filePath);
        filePath.on('finish',() => {
             filePath.close();
             converterjson();
            
        })

    })
    //res.status(200).download('api/route/hold.csv');
    res.status(200).json({
        msg: "http://localhost:3000/admin/downh"
    })
    

})


router.get('/download/:date1/:date2',(req, res, next)=>{

    const url=`http://localhost:3000/admin/${req.params.date1}/${req.params.date2}`;
     

    http.get(url,(resp) => {
        // Image will be stored at this path
        const path = `./api/route/date.json`; 
        const filePath = fss.createWriteStream(path);
        console.log(filePath)
        resp.pipe(filePath);
        filePath.on('finish',() => {
             filePath.close();
             converterdate();
            
        })

    })
    //res.status(200).download('api/route/hold.csv');
    res.status(200).json({
        msg: "http://localhost:3000/admin/downdd"
    })
    

})



router.get('/downh', async (req, res, next)=> {
   
    //converterjson();
    res.status(200).download('hold.csv');
});

router.get('/downdd', async (req, res, next)=> {
   
    //converterjson();
    res.status(200).download('date.csv');
});

module.exports = router;

