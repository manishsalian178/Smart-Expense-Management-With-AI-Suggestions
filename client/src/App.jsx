import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './components/signup';
import Login from './components/login';
import Home from './components/home';
import Add from './components/add-expense';
import IncomePage from './components/IncomePage';
import AI from './components/ai_sugges.jsx';

function App() {
  // State for financial data
  const [financialData, setFinancialData] = useState({
    monthlyIncome: 0,
    totalExpense: 0,
    savings: 0,
    budgetRemaining: 0
  });

  // State for expenses
  const [expenses, setExpenses] = useState([
    
  ]);

  // Function to add a new expense
  const addExpense = (newExpense) => {
    setExpenses([...expenses, newExpense]);
    
    // Update financial data
    const newTotalExpense = financialData.totalExpense + newExpense.amount;
    const newBudgetRemaining = financialData.budgetRemaining - newExpense.amount;
    
    setFinancialData({
      ...financialData,
      totalExpense: newTotalExpense,
      budgetRemaining: newBudgetRemaining > 0 ? newBudgetRemaining : 0
    });
  };

  // Function to delete an expense
  const deleteExpense = (id) => {
    const expenseToDelete = expenses.find(expense => expense.id === id);
    if (!expenseToDelete) return;

    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    
    // Update financial data
    const newTotalExpense = financialData.totalExpense - expenseToDelete.amount;
    const newBudgetRemaining = financialData.budgetRemaining + expenseToDelete.amount;
    
    setFinancialData({
      ...financialData,
      totalExpense: newTotalExpense,
      budgetRemaining: newBudgetRemaining
    });
  };

  // Function to update income and savings
  const updateIncomeAndSavings = (monthlyIncome, savings) => {
    const budgetRemaining = monthlyIncome - savings - financialData.totalExpense;
    
    setFinancialData({
      monthlyIncome,
      savings,
      totalExpense: financialData.totalExpense,
      budgetRemaining: budgetRemaining > 0 ? budgetRemaining : 0
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Register" element={<Register />} />
        <Route 
          path="/Home" 
          element={
            <Home 
              expenses={expenses}
              financialData={financialData}
              addExpense={addExpense}
              deleteExpense={deleteExpense}
              updateIncomeAndSavings={updateIncomeAndSavings}
            />
          } 
        />
        <Route path="/" element={<Login />} />
        <Route 
          path="/Home/Add" 
          element={<Add addExpense={addExpense} />} 
        />
        <Route 
          path="/Home/AddIncome" 
          element={<IncomePage updateIncomeAndSavings={updateIncomeAndSavings} />} 
        />
        <Route path="/suggestion" element={<AI />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;