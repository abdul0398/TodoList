// templating is that we are just modifiying part of html using template 
import express from 'express';
import bodyParser from 'body-parser';
import * as date from "./date.mjs"; // self made node module for today date  
const app = express();
app.use(bodyParser.urlencoded({extended:true})); 
app.use(express.static('public')); // to use static files inside public folder
app.set('view engine', 'ejs');
const items = []; // using array as we need to store multiple inputs to show on list.
const work = [];
app.get('/',(req,res)=>{
    const currentDay = date.day();
    res.render('list',{listTitle: currentDay,newItems:items,value:'home'})//
})
app.post('/', (req,res)=>{
    const item = req.body.todo;
    const regExp = /[a-zA-Z]/g;
    const dest = req.body.button;// just checking on which page we have pressed the add button
    if(dest == 'work'){// if addition is on work page then add note to work array and redirect to work page
        if(regExp.test(item)){
            work.push(item);
        }
        res.redirect('/work');
    }else{
        if(regExp.test(item)){
            items.push(item);
        }
        res.redirect('/');
    }
})
app.get('/work',(req,res)=>{
    res.render('list',{listTitle: "Work List",newItems:work,value:'work'})//
})
app.get('/about',(req,res)=>{
    res.render('about')//
})
app.listen(3000, ()=>{  
    console.log("hello");
})