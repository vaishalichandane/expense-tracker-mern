import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import API from '../services/api';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

function DashboardPage() {

  const navigate = useNavigate();

  const [transactions, setTransactions] =
    useState([]);

  const [filter, setFilter] =
    useState('all');

  const [search, setSearch] =
    useState('');
    const [categoryFilter, setCategoryFilter] =
  useState('');

const [selectedDate, setSelectedDate] =
  useState('');

const [loading, setLoading] =
  useState(false);

  const [editId, setEditId] =
    useState(null);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    type: 'expense',
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const fetchTransactions = async () => {

    try {

      setLoading(true);
      const res = await API.get(
        '/transactions',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              'token'
            )}`,
          },
        }
      );

      setTransactions(res.data);
      setLoading(false);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    const token =
      localStorage.getItem('token');

    if (!token) {
      navigate('/');
    } else {
      fetchTransactions();
    }

  }, []);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editId) {

        await API.put(
          `/transactions/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                'token'
              )}`,
            },
          }
        );

        setEditId(null);

      } else {

        await API.post(
          '/transactions',
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                'token'
              )}`,
            },
          }
        );

      }

      alert('Transaction Added');

      fetchTransactions();

      setFormData({
        title: '',
        amount: '',
        category: '',
        type: 'expense',
      });

    } catch (error) {
      console.log(error);
    }
  };

  const deleteTransaction = async (id) => {

    try {

      await API.delete(
        `/transactions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              'token'
            )}`,
          },
        }
      );

      fetchTransactions();

    } catch (error) {
      console.log(error);
    }
  };

  const downloadPDF = () => {

    const doc = new jsPDF();

    doc.text(
      'Expense Tracker Report',
      20,
      20
    );

    const tableColumn = [
      'Title',
      'Amount',
      'Category',
      'Type',
    ];

    const tableRows =
      transactions.map((item) => [

        item.title,
        item.amount,
        item.category,
        item.type,

      ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save('expense-report.pdf');
  };

  const income = transactions
    .filter((item) => item.type === 'income')
    .reduce(
      (acc, item) => acc + item.amount,
      0
    );

  const expense = transactions
    .filter((item) => item.type === 'expense')
    .reduce(
      (acc, item) => acc + item.amount,
      0
    );

  const balance = income - expense;

const data = [
  {
    name: 'Income',
    value: income,
  },
  {
    name: 'Expense',
    value: expense,
  },
];

  const COLORS = ['#22c55e', '#ef4444'];

  const filteredTransactions =
  transactions.filter((item) => {

    const matchesFilter =
      filter === 'all'
        ? true
        : item.type === filter;

    const matchesSearch =
      item.title
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === ''
        ? true
        : item.category === categoryFilter;

    const matchesDate =
      selectedDate === ''
        ? true
        : new Date(item.createdAt)
            .toLocaleDateString('en-CA') ===
          selectedDate;

    return (
      matchesFilter &&
      matchesSearch &&
      matchesCategory &&
      matchesDate
    );
  });

  return (

    <div className="min-h-screen bg-gray-900 text-white">

      <nav className="bg-black p-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          Expense Tracker
        </h1>

        <div className="flex gap-4 items-center">

          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate('/transactions')}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
          >
            Transactions
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
          >
            Profile
          </button>

          <select
            onChange={(e) =>
             setCategoryFilter(e.target.value)
            }
            className="bg-gray-700 p-2 rounded-lg"
          >

            <option value="">
              All Categories
            </option>

            <option value="Food">
              Food
            </option>

            <option value="Shopping">
              Shopping
            </option>

          </select>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

      </nav>

      <div className="p-8">

        <div className="max-w-xl mx-auto">

          <h1 className="text-4xl font-bold text-center mb-8">
            Expense Tracker
          </h1>

          <div className="grid grid-cols-3 gap-4 mb-8">

            <div className="bg-green-600 p-4 rounded-xl text-center">

              <h2 className="text-lg">
                Income
              </h2>

              <p className="text-2xl font-bold">
                ₹{income}
              </p>

            </div>

            <div className="bg-red-600 p-4 rounded-xl text-center">

              <h2 className="text-lg">
                Expense
              </h2>

              <p className="text-2xl font-bold">
                ₹{expense}
              </p>

            </div>

            <div className="bg-blue-600 p-4 rounded-xl text-center">

              <h2 className="text-lg">
                Balance
              </h2>

              <p className="text-2xl font-bold">
                ₹{balance}
              </p>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 p-6 rounded-xl mb-8"
          >

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 mb-4 rounded-lg bg-gray-700"
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-3 mb-4 rounded-lg bg-gray-700"
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 mb-4 rounded-lg bg-gray-700"
            />

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 mb-4 rounded-lg bg-gray-700"
            >

              <option value="expense">
                Expense
              </option>

              <option value="income">
                Income
              </option>

            </select>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-bold"
            >
              {editId
                ? 'Update Transaction'
                : 'Add Transaction'}
            </button>

          </form>

          <div className="bg-gray-800 p-6 rounded-xl mb-8 flex justify-center">

            <PieChart width={300} height={300}>

              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >

                {data.map((entry, index) => (

                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index]}
                  />

                ))}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>
            <div className="bg-gray-800 p-6 rounded-xl mb-8">

  <h2 className="text-2xl font-bold text-center mb-4">
    Income vs Expense
  </h2>

  <ResponsiveContainer
    width="100%"
    height={300}
  >

    <BarChart data={data}>

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="name" />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="value"
        fill="#3b82f6"
      />

    </BarChart>

  </ResponsiveContainer>

</div>

          </div>

          <div className="bg-gray-800 p-6 rounded-xl">

            <input
              type="text"
              placeholder="Search transaction..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full p-3 mb-4 rounded-lg bg-gray-700"
            />

            <div className="mb-4 flex gap-4 justify-center">

              <button
                onClick={() => setFilter('all')}
                className="bg-blue-600 px-4 py-2 rounded-lg"
              >
                All
              </button>

              <button
                onClick={() => setFilter('income')}
                className="bg-green-600 px-4 py-2 rounded-lg"
              >
                Income
              </button>

              <button
                onClick={() => setFilter('expense')}
                className="bg-red-600 px-4 py-2 rounded-lg"
              >
                Expense
              </button>

            </div>

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-2xl font-bold">
                Transactions
              </h2>

              <button
                onClick={downloadPDF}
                className="bg-green-600 px-4 py-2 rounded-lg"
              >
                Download PDF
              </button>

            </div>

            {filteredTransactions.map((item) => (

              <div
                key={item._id}
                className="flex justify-between items-center bg-gray-700 p-4 rounded-lg mb-3"
              >

                <div>

                  <p className="font-bold">
                    {item.title}
                  </p>

                  <div className="flex items-center gap-2">

                    <p>
                      ₹{item.amount}
                    </p>

                    <span className="bg-blue-600 px-2 py-1 rounded-lg text-sm">
                      {item.category}
                    </span>

                  </div>

                  <p className="text-sm text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>

                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() => {

                      setFormData({
                        title: item.title,
                        amount: item.amount,
                        category: item.category,
                        type: item.type,
                      });

                      setEditId(item._id);

                    }}
                    className="bg-yellow-500 px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteTransaction(item._id)
                    }
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default DashboardPage;