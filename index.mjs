// templating is that we are just modifiying part of html using template
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // to use static files inside public folder
app.set("view engine", "ejs");
mongoose.connect("mongodb://127.0.0.1:27017/todoListDb");
const noteSchema = {
   name: String
};
const Notes = new mongoose.model("Note", noteSchema);
const work1 = new Notes({ name: "Write Your Note Here>>>" });
const work = [work1];
const listSchema = {
  name: String,
  item: [noteSchema]
};
const listModel = new mongoose.model("list", listSchema);
app.get("/", (req, res) => {
  Notes.find() // reading the file in mangoose(use promise)
    .then((x) => {
      if (x.length == 0) {
        Notes.insertMany(work)
          .then((msg) => {
            //just checking only if we have not feched the data from db then fetch
            res.redirect("/");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.render("list", { listTitle: "Today", newItems: x });
      }
    });
});
app.post("/", (req, res) => {
  const item = req.body.todo;// content that needs to be inserted in the db;
  const listName = _.capitalize(req.body.button); // just checking on which page we have pressed the add button
  const note = new Notes({ name: item });
  if (!item.replace(/\s/g, '').length) {
    res.redirect(`/${listName}`);
  }
  else if (listName === "Today") {
    note.save();
    res.redirect("/");
  } else {
    listModel.findOne({ name: listName }).then((data) => {
      data.item.push(note);
      data.save();
      res.redirect(`/${listName}`);
    });
  }
});
app.post("/delete", (req, res) => {
  const id = req.body.delete;
  const list = req.body.listTitle;
  if (list === "Today") {
    Notes.findByIdAndRemove(id).then((data) => {
      res.redirect("/");
    });
  } else {
    listModel.findOneAndUpdate(
      { name: list },
      { $pull: { item: { _id: id } } }
    ).then(data=>{
    });
    res.redirect(`/${list}`);
  }
});
app.get("/:customList", (req, res) => {
  const listType = _.capitalize(req.params.customList);
  if(listType == "FAVIICON.ICO")return;
  listModel.findOne({ name: listType }).then((data) => {
    if (!data) {
      // create a list
      const note = new listModel({ name: listType, item: work });
      note.save();
      res.redirect(`/${listType}`);
    } else {
      res.render("list", { listTitle: listType, newItems: data.item });
    }
  });
});
app.get("/about", (req, res) => {
  res.render("about"); //
});
app.listen(3000, () => {
  console.log("Server Started...");
});