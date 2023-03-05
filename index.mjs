// templating is that we are just modifiying part of html using template
import express from "express";
import bodyParser from "body-parser";
import * as date from "./date.mjs"; // self made node module for today date
import mongoose from "mongoose";
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // to use static files inside public folder
app.set("view engine", "ejs");
mongoose.connect("mongodb://127.0.0.1:27017/todoListDb");
const notesSchema = new mongoose.Schema({ name: String });
const Notes = new mongoose.model("Note", notesSchema);
const work = [];
const listSchema = new mongoose.Schema({ name: String, item:[notesSchema]});
const listModel = new mongoose.model("list",listSchema);
app.get("/", (req, res) => {
  Notes.find() // reading the file in mangoose(use promise)
    .then((x) => {
      async function add() {
        if(x.length == 0){
            await Notes.insertMany(work).then((msg)=>{//just checking only if we have not feched the data from db then fetch
                console.log("Sucessfull");
            }).catch(err=>{
                console.log(err);
            })
        }
        const currentDay = date.day();
        res.render("list", { listTitle: currentDay, newItems: x, value: "home" }); //
      }
      add();
    });
});
app.post("/", (req, res) => {
  const item = req.body.todo;
  const regExp = /[a-zA-Z]/g;
  const dest = req.body.button; // just checking on which page we have pressed the add button
  const work = new Notes({name:item});
  if (dest == "work") {
    if (regExp.test(item)) {
    }
    res.redirect("/work");
  } else {
    if (regExp.test(item)) {
       work.save();
    }
    res.redirect("/");
  }
});
app.post('/delete', (req,res)=>{
  const id = req.body.delete;
  Notes.deleteOne({_id:id}).then(data=>{
    console.log(data);
  });
  res.redirect('/');
});
app.get("/:customList", (req, res) => {
  res.render("list", { listTitle: req.params.customList, newItems: work, value: customList}); //
});
app.get("/about", (req, res) => {
  res.render("about"); //
});
app.listen(3000, () => {
  console.log("Server Started...");
});