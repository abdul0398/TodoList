// templating is that we are just modifiying part of html using template 
import express from 'express';
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.urlencoded({extended:true})); 
app.use(express.static('public')); // to use static files inside public folder
app.set('view engine', 'ejs');
let items = []; // using array as we need to store multiple inputs to show on list.
let work = [];
app.get('/',(req,res)=>{
    var options = {
        weekday: 'long',
        day: 'numeric',
        month:'short'
    }
    var today = new Date();
    var currentDay = today.toLocaleDateString('en-US',options);
    res.render('list',{listTitle: currentDay,newItems:items,value:'home'})//
})
app.post('/', (req,res)=>{
    let item = req.body.todo;
    let dest = req.body.button;// just checking on which page we have pressed the add button
    if(dest == 'work'){// if addition is on work page then add note to work array and redirect to work page
        work.push(item);
        res.redirect('/work');
    }else{
        items.push(item);
        res.redirect('/');
    }
})
app.get('/work',(req,res)=>{
    res.render('list',{listTitle: "Work List",newItems:work,value:'work'})//
})
app.listen(3000, ()=>{  
    console.log("hello");
})