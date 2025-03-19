const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const bcyrpt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { MongoClient, ObjectId } = require('mongodb')
const app = express()

const dbName = 'fianance-app'
const saltRounds = 10

app.use(bodyparser.json())
app.use(cors())
const client = new MongoClient('mongodb://127.0.0.1/27017')
let db
client.connect()
    .then(() => {
        db = client.db(dbName)
    })
    .catch((e) => {
        console.log(e.message)
    })


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const collection = db.collection('user-data')
        const data = await collection.findOne({ email: email })
        if (!data) {
            res.status(400).json("Email Does Not Match")
            return
        }
        else {
            bcyrpt.compare(password, data.password, async (err, result) => {
                if (err) {
                    res.status(500).json(err)
                    return
                }
                if (result) {
                    const token = jwt.sign({ email: email }, 'cat', { expiresIn: '1h' })
                    res.status(200).json({ "name": data.name, "token": token })
                }
                if (!result) {
                    res.status(404).json('Password does not match')
                }
            })
        }
    }
    catch (e) {
        res.status(500).json(e)
    }
})

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (name && email && password) {
            bcyrpt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    res.status(500).json(err)
                }
                else if (hash) {
                    const collection = db.collection('user-data')
                    await collection.insertOne({ name: name, email: email, password: hash })
                    res.status(200).json('Data saved Successfully')
                }
                else {
                    res.status(500).json('Cannot Save Data')
                }
            })
        }
        else {
            res.status(400).json("Invalid Data")
        }
    }
    catch (e) {
        res.status(500).json(e)
    }
})

app.post('/checkAuth', async (req, res) => {
    try {
        const { email, token } = req.body

        if (email, token) {
            jwt.verify(token, "cat", (err, result) => {
                if (err) {
                    res.status(400).json('Invalid Token')
                }
                if (result) {
                    res.status(200).json('Login Successful')
                }
            })
        }
        else {
            res.status(404).json('No Valid Authentication')
        }
    }
    catch (e) {
        // console.log(e)
        res.status(500).json("Oops! Server Error")
    }
})

app.get('/expenses', async (req, res) => {
    try {
        const collection = db.collection('expenses')
        const data = await collection.find().toArray()
        const budgetCollection = db.collection('budgets')
        const budgetData = await budgetCollection.find().toArray()
        res.status(200).json({ data: data, budgets: budgetData })
    }
    catch (e) {
        console.log(e)
        res.status(500).json('Oops! Server Error')
    }
})

app.post('/addexpense', async (req, res) => {
    try {
        const { name, amount, date, category } = req.body

        if (!name || !amount || !date) {
            return res.status(400).json('Invalid expense data');
        }

        const collection = db.collection('expenses');

        const result = await collection.insertOne({ name, amount, date, category });
        const insertedExpense = await collection.findOne({ _id: result.insertedId });
        res.status(200).json({ insertedExpense });
    }
    catch (e) {
        res.status(500).json("Oops! Server Error")
    }

})

app.post('/updateExpense', async (req, res) => {
    try {
        const { _id, name, amount, date, category } = req.body
        if (_id && name && amount && date && category) {
            const objectid = new ObjectId(_id)

            const collection = db.collection('expenses')
            await collection.updateOne({ _id: objectid }, { $set: { name, amount, date, category } })
            res.status(200).json('Updation Successfull')
        }
        else {
            res.status(400).json('Please Fill Data')
        }
    }
    catch (e) {
        res.status(500).json('Internal Server Error')
    }

})

app.post('/deleteExpense', async (req, res) => {
    try {
        const { id } = req.body
        if (id) {
            const objectid = new ObjectId(id)

            const collection = db.collection('expenses')
            await collection.deleteOne({ _id: objectid })
            res.status(200).json("Data Deleted Successfully")
        }
        else {
            res.status(400).json('Invalid Data to Delete')
        }
    }
    catch (e) {
        res.status(500).json('Internal Server Error')
    }

})

app.get('/getBudgetDetail', async (req, res) => {
    try {
        await client.connect()
        //getting budget data
        const db = client.db(dbName)
        const collection = db.collection('budgets')
        const expenseCollection = db.collection('expenses')
        const budgets = await collection.find().toArray()
        //getting current month and year
        const today = new Date()
        const currentMonth = today.getMonth() + 1
        const currentYear = today.getFullYear()

        //getting expenses with currentMonth and year
        const expenses = await expenseCollection.find({
            date: {
                $gte: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`, // Start of the month
                $lt: `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`, // Start of the next month
            }
        }).toArray();

        //getting totalspend data
        const categorySpend = budgets.map(budget => {
            const categoryExpenses = expenses.filter(expense => expense.category === budget.name)
            const totalSpend = categoryExpenses.reduce((acc, data) => acc + parseFloat(data.amount), 0);
            const totalitems = categoryExpenses.length
            return {
                // items:categoryExpenses[0].name,
                name: budget.name,
                amount: budget.amount,
                icon: budget.icon,
                // spendamt:categoryExpenses[0].amount,
                spend: totalSpend,
                item_count: totalitems,
                // dates:categoryExpenses[0].date
            };
        })

        res.status(200).json(categorySpend)
    }
    catch (e) {
        res.status(500).json(e)
    }

})

app.post('/addBudget', async (req, res) => {
    try {
        const { name, amount, icon } = req.body
        if (name && amount && icon) {

            const collection = db.collection('budgets')
            const data=collection.findOne({name:name})
            if(data)
            {
                res.status(409).json("Data Already Exists")
            }
            else
            {

                await collection.insertOne({ name, amount, icon })
                res.status(200).json("Data Saved Successfully")
            }
        }
    }
    catch (e) {
        res.status(500).json('Internal Server Error')
    }

})

app.listen(3000, async () => {
    console.log('Server started successfully')
})