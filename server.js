import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 5000;

const mongoURl = "mongodb://localhost:27017/showdb";

// set mongoDB connections
mongoose.connect(mongoURl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// define event listener for database connection
db.on('connected', () => {
    console.log("Connected to MongoDB server")
});
db.on('error', (err) => {
    console.log("MongoDB connection error: ", err);
})
db.on('disconnected', () => {
    console.log("MongoDB connection disconnected");
});

app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true }
    
})
const Person = mongoose.model('Person', personSchema);

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true},
    // email: { type: String, required: true},
    price: { type: Number, required: true},
    // taste: {type: String, enum: ['sweet', 'spicy', 'sour'], required: true},
    // is_drink: {type: Boolean, default: false},
    // ingredients: {type: [String], default:[]},
    // num_sales: {type: Number, default:0}
})

const MenuItems = mongoose.model('MenuItems', menuItemSchema)


app.get('/', function (req, res) {
    res.send("Welcomme to my Hotel...How can i help you")
})

app.post('/person', async (req, res) => {
    try {
        const data = req.body
        const newPerson = new Person(data);
        // newPerson.name = data.name;
        // newPerson.age= data.age;
        // newPerson.address = data.address;
        // newPerson.number = data.number;
        // newPerson.email = data.email;

        const response = await newPerson.save()
        console.log("Data saved");
        res.status(200).json(response);
    } catch {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })
    }
    res.send('/person')
})

app.get('/person', async (req, res) => {
    try{
        const data = await Person.find();
        console.log("Data fetched");
        res.status(200).json(response);
    } catch {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })
    }
})

app.get('/menu', async (req, res) => {
    try {
        const data = await MenuItems.find();
        console.log("data fatched");
        res.status(200).json(data);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })
    }
})

app.post('/menu', async (req, res) => {
    try{
        const data = req.body;
        const newMenu = new MenuItems(data);
        const response = await newMenu.save();
        console.log(response);
        res.status(200).json(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
})
app.listen(port, function () {
    console.log("Server is running on port " + port);
})


// function area(length, width){
//     return length * width;
// }
// console.log(area(11, 5));


// var age = 65;

//  if(age<18){
//     console.log("You get a 20 % discount!");
// } else if(age<65){
//     console.log('Normal ticket price applies.');
// } else {
//     console.log("you get 30 % discount!");
// }


// var product = {
//     name: "Saten",
//     price: 100,
//     inStock: true
// }
// console.log(product);

// var guestList = ["Saten", "Raj", "Sandhya", "Rashmi", "Krishu"];

// if(guestList.length > 5){
//     console.log("Welcome to the party");
// } else {
//     console.log("Sorry, you're not on the guest list");
// }

