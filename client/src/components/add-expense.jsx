import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
import axios from 'axios';

const AddExpense = () => {
  const [expense, setExpense] = useState({
    amount: '',
    category: ''
  });
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newExpense = {
        amount: parseFloat(expense.amount),
        category: expense.category,
        date: new Date().toISOString()
      };
      
      await axios.post('http://localhost:3001/expenses', newExpense);
      navigate('/Home');
    } catch (err) {
      console.error('Error adding expense', err);
      alert('Failed to add expense. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Add New Expense</h3>
                <Link to="/Home" className="btn btn-light btn-sm">
                  <BiArrowBack className="me-1" /> Back
                </Link>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">Amount (₹)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="amount"
                    value={expense.amount}
                    onChange={(e) => setExpense({...expense, amount: e.target.value})}
                    required
                    min="0.01"
                    step="0.01"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Category</label>
                  <select 
                    className="form-select" 
                    id="category"
                    value={expense.category}
                    onChange={(e) => setExpense({...expense, category: e.target.value})}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn btn-primary">
                    Add Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;