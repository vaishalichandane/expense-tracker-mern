const express = require('express');

const router = express.Router();

const {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} = require('../controllers/transactionController');

router.post('/', addTransaction);

router.get('/', getTransactions);

router.delete('/:id', deleteTransaction);
router.put(
  '/:id',
  updateTransaction
);
module.exports = router;