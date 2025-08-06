import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  // Chart references
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  
  // State variables
  const [expenses, setExpenses] = useState([]);
  const [financialData, setFinancialData] = useState({
    monthlyIncome: 0,
    totalExpense: 0,
    savings: 0,
    budgetRemaining: 0
  });
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch expenses
        const expensesRes = await axios.get('http://localhost:3001/expenses');
        setExpenses(expensesRes.data);
        
        // Fetch financial data
        const financialRes = await axios.get('http://localhost:3001/financial-data');
        setFinancialData(financialRes.data);
      } catch (err) {
        console.error('Error fetching data', err);
      }
    };
    
    fetchData();
  }, []);



  // Handle expense deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/expenses/${id}`);
      setExpenses(expenses.filter(expense => expense._id !== id));
      window.location.reload();
    } catch (err) {
      console.error('Error deleting expense', err);
    }
  };



  // Filter expenses based on selected filters
  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = categoryFilter === 'All' || expense.category === categoryFilter;
    const matchesDate = !dateFilter || expense.date.split('T')[0] === dateFilter;
    return matchesCategory && matchesDate;
  });

  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(expenses.map(expense => expense.category))];

  // Prepare data for charts
  useEffect(() => {
    // Calculate category totals for pie chart
    const categoryTotals = {};
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    // Prepare monthly data for bar chart
    const monthlyData = { labels: [], data: [] };
    const now = new Date();
    
    // Generate last 6 months labels
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyData.labels.push(date.toLocaleString('default', { month: 'short' }));
    }
    
    // Calculate expenses for each month
    monthlyData.labels.forEach(month => {
      const monthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.toLocaleString('default', { month: 'short' }) === month;
      });
      
      const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      monthlyData.data.push(total);
    });

    // Destroy existing charts if they exist
    if (pieChartRef.current && pieChartRef.current.chart) {
      pieChartRef.current.chart.destroy();
    }
    
    if (barChartRef.current && barChartRef.current.chart) {
      barChartRef.current.chart.destroy();
    }

    // Create pie chart
    if (pieChartRef.current && Object.keys(categoryTotals).length > 0) {
      const pieCtx = pieChartRef.current.getContext('2d');
      pieChartRef.current.chart = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: Object.keys(categoryTotals),
          datasets: [{
            data: Object.values(categoryTotals),
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
            },
            title: {
              display: true,
              text: 'Expense Distribution by Category'
            }
          }
        }
      });
    }

    // Create bar chart
    if (barChartRef.current && monthlyData.data.length > 0) {
      const barCtx = barChartRef.current.getContext('2d');
      barChartRef.current.chart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: monthlyData.labels,
          datasets: [{
            label: 'Monthly Expenses (₹)',
            data: monthlyData.data,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '₹' + value;
                }
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Monthly Expense Trend'
            }
          }
        }
      });
    }

    // Cleanup function to destroy charts on unmount
    return () => {
      if (pieChartRef.current && pieChartRef.current.chart) {
        pieChartRef.current.chart.destroy();
      }
      if (barChartRef.current && barChartRef.current.chart) {
        barChartRef.current.chart.destroy();
      }
    };
  }, [expenses]);

  return (
    <div className="container-fluid">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <div className="bg-light rounded p-1 me-2">
              <i className="bi bi-cash-coin text-primary fs-4"></i>
            </div>
            <span className="fw-bold">Expense Management</span>
          </Link>
          <div className="d-flex">
            <Link to="/" className="btn btn-light mx-1">
            
              Dashboard
            </Link>
            <Link to="/Home/AddIncome" className="btn btn-outline-light mx-1">
              Monthly Income
            </Link>
            <Link to="/Home/Add" className="btn btn-outline-light mx-1">
              Add Expense
            </Link>
          </div>
        </div>
      </nav>

      <div className="row">
        {/* Main Content - 75% width */}
        <div className="col-lg-9">
          {/* Hero Image */}
          <div className="text-center mb-4">
            <img 
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=300" 
              alt="Expense Management" 
              className="img-fluid rounded"
              style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }}
            />
          </div>

          {/* Financial Summary Cards */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted text-uppercase small">
                    Monthly Income
                  </h6>
                  <h3 className="card-title fw-bold">₹{financialData.monthlyIncome.toFixed(2)}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted text-uppercase small">
                    Total Expense
                  </h6>
                  <h3 className="card-title fw-bold">₹{financialData.totalExpense.toFixed(2)}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted text-uppercase small">
                    Savings
                  </h6>
                  <h3 className="card-title fw-bold">₹{financialData.savings.toFixed(2)}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted text-uppercase small">
                    Budget Remaining
                  </h6>
                  <h3 className="card-title fw-bold">₹{financialData.budgetRemaining.toFixed(2)}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Expense Distribution</h5>
                </div>
                <div className="card-body p-3">
                  <div style={{ height: '300px' }}>
                    <canvas ref={pieChartRef}></canvas>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Monthly Trend</h5>
                </div>
                <div className="card-body p-3">
                  <div style={{ height: '300px' }}>
                    <canvas ref={barChartRef}></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Expenses</h5>
              <div>
                <select 
                  className="form-select me-2 d-inline-block w-auto"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <input 
                  type="date" 
                  className="form-control d-inline-block w-auto"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Amount</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map(expense => (
                      <tr key={expense._id}>
                        <td>₹{expense.amount.toFixed(2)}</td>
                        <td>{expense.category}</td>
                        <td>{new Date(expense.date).toLocaleDateString()}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(expense._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* AI Suggestions Sidebar - 25% width */}
        <div className="col-lg-3">
          <div className="card shadow-sm sticky-top" style={{ top: '1rem' }}>
            <div className="card-header bg-light">
              <h5 className="mb-0">For AI Suggestions Click Here</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                
            <Link to="/suggestion" className="btn btn-dark mx-1">
                  AI Suggestion     
              </Link>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;