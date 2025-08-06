import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const IncomePage = () => {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!monthlyIncome || parseFloat(monthlyIncome) <= 0) {
      alert('Please enter a valid monthly income');
      return;
    }
    
    if (!savingsGoal || parseFloat(savingsGoal) < 0) {
      alert('Please enter a valid savings goal');
      return;
    }
    
    if (parseFloat(savingsGoal) > parseFloat(monthlyIncome)) {
      alert('Savings goal cannot exceed monthly income');
      return;
    }
    
    try {
      await axios.post('http://localhost:3001/income', {
        monthlyIncome: parseFloat(monthlyIncome),
        savingsGoal: parseFloat(savingsGoal)
      });
      
      navigate('/Home');
    } catch (err) {
      console.error('Error setting income', err);
      alert('Failed to save income data. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4">Set Income & Savings</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Monthly Income (₹)</label>
              <input 
                type="number" 
                className="form-control"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                min="0.01"
                step="0.01"
                placeholder="Enter monthly income"
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Savings Goal (₹)</label>
              <input 
                type="number" 
                className="form-control"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(e.target.value)}
                min="0"
                step="0.01"
                placeholder="Enter savings goal"
                required
              />
            </div>
            
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Save
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/Home')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IncomePage;