import express from 'express';

const router = express.Router();


router.post('/person', async (req, res) => {
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
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" })
    }
    res.render('person');
})


router.get('/person', async (req, res) => {
    try{
        const data = await Person.find();
        console.log("Person Data fetched");
        res.status(200).json(data);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Internal error" })
    }
    res.render('person')
})

module.exports = router;