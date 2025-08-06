const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  monthlyIncome: { type: Number, required: true },
  savingsGoal: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Income', incomeSchema);