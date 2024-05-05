import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
const app = express();
const port = 5000;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistdb", { useNewUrlParser: true });

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({
    name: "Saten"
});
const item2 = new Item({
    name: "Sandhya"
});

const listsSchema = new mongoose.Schema({ name: String }, {timestamps: true})
const List = mongoose.model("List", listsSchema);
const list1 = new List({ name: "Baghel" });

app.get("/", (req, res) => {
    // const today = new Date();
    // const options = { name: "String"  }
    const now = "Lists";
    Item.find({}).then((items) => {
        if (items.length == 0) {
            // Item.insertMany([item1, item2]);
            res.redirect("/");
        } else {
            res.render("index", {
                titleName: now,
                listItems: items  // get
            })
        }
    })
})

app.post('/', function (req, res) {
    const item = req.body.newItem;
    const newItem = new Item({ name: item });
    newItem.save();
    res.redirect("/");
})

app.get('/list', (req, res) => {
    // const listName = req.body.item;
    const listName = "ListName";
    
     Item.find({}).then((lists) => {
        if (lists.length == 0) {
            List.insertOne([list1]);
            res.redirect("/");
        } else {
            res.render("list", {
                titleName: listName,
                listItem: lists
            })
        }
    })

})
app.post('/list', function (req, res) {
    const list = req.body.newList;
    const newList = new List({ name: list });
    newList.save();
    res.redirect("/list");
})

app.get('/addlist', (req, res) => {
    const addlist = "AddLists";
    res.render('addlist', {
        addlist
    })
})
app.post("/submit", (req, res) => {
    const addlist = "AddLists";
    res.render('addlist', { addlist })
})

app.post("/delete", function (req, res) {
    console.log(req.body);
    const id = req.body.list;
    Item.findByIdAndDelete(id).exec();
    res.redirect('/');
});



app.get("/:listID", function (req, res) {
    console.log(req.params.listID);
    // find by ID 
    // render the list
})
app.listen(port, () => {
    console.log("My First express project live");
})
