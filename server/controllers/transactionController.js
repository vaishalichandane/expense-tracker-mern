const Transaction = require('../models/Transaction');

const addTransaction = async (req, res) => {
  try {
    const { title, amount, category, type } =
      req.body;

    const transaction =
      await Transaction.create({
        title,
        amount,
        category,
        type,
        user: req.user,
      });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions =
      await Transaction.find({
        user: req.user,
      });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: 'Deleted',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateTransaction = async (req, res) => {

  try {

    const updatedTransaction =
      await Transaction.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.status(200).json(
      updatedTransaction
    );

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

module.exports = {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
};