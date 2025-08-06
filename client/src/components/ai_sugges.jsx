import React, { useState,useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
function ai_sugges() {
    const [aiResponse, setAiResponse] = useState("");
    const [financialData, setFinancialData] = useState({
        monthlyIncome: 0,
        totalExpense: 0,
        savings: 0,
        budgetRemaining: 0
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch financial data
                const financialRes = await axios.get('http://localhost:3001/financial-data');
                setFinancialData(financialRes.data);
            } catch (err) {
                console.error('Error fetching data', err);
            }
        };

        fetchData();
    }, []);

    const clickai = (e) => {
        e.preventDefault();
        const prompt = `Act as a personal finance advisor for someone living in India who wants to plan their **daily budget for today** to stay on track with their **monthly savings goal**.\n

Here is the user’s financial data:
- Monthly Income: ₹${financialData.monthlyIncome.toFixed(2)} \n
- Total Monthly Expenses So Far: ₹${financialData.totalExpense.toFixed(2)} \n
- Monthly Savings Target: ₹${financialData.savings.toFixed(2)} \n
- Budget Remaining for the Month: ₹${financialData.budgetRemaining.toFixed(2)} \n
- Today’s Date: ${new Date().toISOString()} \n

Based on today's date, calculate how many days are remaining in the current month. Then, divide the remaining budget evenly across those days to determine the **available daily budget**. Use that amount to plan today's expenses. \n

Distribute the daily budget into the following 7 categories: \n
**Food, Travelling, Shopping, Entertainment, Utilities, Healthcare, Education** \n

For each category: \n
1. Allocate a **realistic percentage** of today’s daily budget. \n
2. Show the **₹ daily budget** for that category. \n
3. Provide a **cost-saving tip**. \n
4. Suggest an **Indian platform, app, or bank** that helps manage or save money. \n

 Present the output in **exactly 7 lines**, each in this format: \n

Category – % Allocation – ₹ Daily Budget – Cost-saving Tip – Suggested Platform/App/Bank \n
`;


        axios.post('http://localhost:3001/ai', { prompt })
            .then(result => {
                // Access the response data properly
                console.log("AI Response:", result.data.response);
                setAiResponse(result.data.response);
            })
            .catch(err => console.log("Error:", err));
    };

    return (
        <div className="container-fluid vh-100 p-0 m-0">
            <div className="row g-0 h-100">
                <div className="col-12 d-flex align-items-center justify-content-center">
                    <div className="card shadow-lg w-75">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <h1
                                    className="fw-bold text-primary"
                                    style={{ fontSize: '2.75rem', minHeight: '3rem' }}
                                >
                                    AI Suggestions
                                </h1>
                                <hr className="w-25 mx-auto my-4 border-primary" />
                            </div>

                            {/* Enlarged text area */}
                            <div
                                className="message-container bg-light rounded-3 p-4 mb-4"
                                style={{
                                    minHeight: "60vh",
                                    maxHeight: "70vh",
                                    overflowY: "auto",
                                    fontSize: "1.25rem"
                                }}
                            >
                                <p className="mb-0">
                                    {aiResponse}
                                </p>
                            </div>

                            {/* Button group with two buttons */}
                            <div className="d-flex justify-content-center gap-4 mt-4">
                                 <Link to="/Home" className="btn btn-outline-primary btn-lg px-5"
                                    style={{ minHeight: '3rem', fontSize: '1.25rem' }}>
                                    Back Home
                                </Link>

                                <button
                                    className="btn btn-primary btn-lg px-5"
                                    style={{ minHeight: '3rem', fontSize: '1.25rem' }}
                                    onClick={clickai}
                                >
                                    Generate New Suggestions
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ai_sugges;