const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Expense = require('./models/Expense');
const Income = require('./models/income');
const EmployeeModel = require('./models/employee')

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("Your_mongodb_URL", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const generate = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text(); // Return the generated text
  } catch(err) {
    console.error(err);
    throw err; // Propagate error to route handler
  }
};

// Change to POST method and handle response properly
app.post('/ai', async (req, res) => { // 👈 Changed from app.get to app.post
  try {
    const { prompt } = req.body; // Extract prompt from request body
    const result = await generate(prompt);
    res.json({ response: result }); // Send response back to client
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "AI generation failed" });
  }
});


app.post('/Register',(req,res)=>
        EmployeeModel.create(req.body)
        .then(employees => res.json(employees))
        .catch(err => res.lson(err))
)

app.post('/', (req, res) => {
    const { email, password } = req.body;

    EmployeeModel.findOne({ email: email })
        .then((user) => {
            if (user) {
                if (user.password === password) {
                    res.json("Success");
                } else {
                    res.json("Password is incorrect");
                }
            } else {
                res.json("No record found");
            }
        })
        .catch((err) => {
            console.error("Login error:", err);
            res.status(500).json("Internal server error");
        });
});

// Expense Routes
app.post('/expenses', async (req, res) => {
  try {
    const newExpense = await Expense.create(req.body);
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/expenses/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Income Routes
app.post('/income', async (req, res) => {
  try {
    const newIncome = await Income.create(req.body);
    res.status(201).json(newIncome);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/income', async (req, res) => {
  try {
    const incomeData = await Income.findOne().sort({ date: -1 });
    res.json(incomeData || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Financial Data Route
app.get('/financial-data', async (req, res) => {
  try {
    const incomeData = await Income.findOne().sort({ date: -1 });
    const expenses = await Expense.find();
    
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const monthlyIncome = incomeData ? incomeData.monthlyIncome : 0;
    const savingsGoal = incomeData ? incomeData.savingsGoal : 0;
    const savings = monthlyIncome - totalExpense;
    const budgetRemaining = monthlyIncome - savingsGoal - totalExpense;

    res.json({
      monthlyIncome,
      totalExpense,
      savings,
      savingsGoal,
      budgetRemaining
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});