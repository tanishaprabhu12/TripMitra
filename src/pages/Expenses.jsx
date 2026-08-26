import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Expenses() {

  // =========================================
  // CURRENT USER
  // =========================================

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  // =========================================
  // EXPENSES
  // =========================================

  const [expenses, setExpenses] = useState(() => {

    if (!currentUser) {
      return [];
    }

    const savedExpenses = localStorage.getItem(
      `tripExpenses_${currentUser.id}`
    );

    return savedExpenses
      ? JSON.parse(savedExpenses)
      : [];
  });


  // =========================================
  // SAVE EXPENSES
  // =========================================

  useEffect(() => {

    if (!currentUser) {
      return;
    }

    localStorage.setItem(
      `tripExpenses_${currentUser.id}`,
      JSON.stringify(expenses)
    );

  }, [expenses, currentUser]);


  // =========================================
  // FORM
  // =========================================

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");


  // =========================================
  // ADD EXPENSE
  // =========================================

  function handleSubmit(event) {

    event.preventDefault();

    if (!amount || !category || !description) {
      alert("Please fill in all the fields.");
      return;
    }

    const newExpense = {
      id: Date.now(),
      amount: Number(amount),
      category,
      description,
      paidBy: currentUser?.name || "You",
      splitBetween: [currentUser?.name || "You"],
    };

    setExpenses((currentExpenses) => [
      ...currentExpenses,
      newExpense,
    ]);

    setAmount("");
    setCategory("");
    setDescription("");
  }


  // =========================================
  // DELETE EXPENSE
  // =========================================

  function deleteExpense(id) {

    setExpenses((currentExpenses) =>
      currentExpenses.filter(
        (expense) => expense.id !== id
      )
    );
  }


  // =========================================
  // TOTAL
  // =========================================

  const totalSpending = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );


  // =========================================
  // CATEGORY TOTALS
  // =========================================

  const categoryTotals = {};

  expenses.forEach((expense) => {

    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }

    categoryTotals[expense.category] +=
      Number(expense.amount || 0);
  });


  // =========================================
  // FORMAT MONEY
  // =========================================

  function formatMoney(amount) {

    return `₹${amount.toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    )}`;
  }


  // =========================================
  // PAGE
  // =========================================

  return (
    <div>

      <Navbar />

      <div className="app-layout">

        <Sidebar />

        <main className="main-content">

          {/* HEADER */}

          <div className="page-header">

            <div>
              <h1>💸 Expenses</h1>

              <p>
                Track and manage all your trip expenses.
              </p>
            </div>

            <div className="page-total">
              <span>Total Spending</span>

              <strong>
                {formatMoney(totalSpending)}
              </strong>
            </div>

          </div>


          {/* ADD EXPENSE */}

          <div className="page-card">

            <h2>
              ➕ Add Expense
            </h2>

            <form
              className="expense-page-form"
              onSubmit={handleSubmit}
            >

              <input
                type="number"
                placeholder="Amount ₹"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
              />

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >

                <option value="">
                  Select category
                </option>

                <option value="Food">
                  🍴 Food
                </option>

                <option value="Accommodation">
                  🏨 Accommodation
                </option>

                <option value="Transport">
                  🚕 Transport
                </option>

                <option value="Activities">
                  🎟️ Activities
                </option>

                <option value="Shopping">
                  🛍️ Shopping
                </option>

                <option value="Other">
                  💳 Other
                </option>

              </select>

              <input
                type="text"
                placeholder="What did you spend on?"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
              />

              <button type="submit">
                Add Expense
              </button>

            </form>

          </div>


          {/* CATEGORY SUMMARY */}

          <div className="page-card">

            <h2>
              📊 Spending by Category
            </h2>

            <div className="category-summary">

              {Object.keys(categoryTotals).length === 0 ? (

                <p>
                  No expenses recorded yet.
                </p>

              ) : (

                Object.entries(categoryTotals).map(
                  ([category, amount]) => (

                    <div
                      className="category-summary-item"
                      key={category}
                    >

                      <span>
                        {category}
                      </span>

                      <strong>
                        {formatMoney(amount)}
                      </strong>

                    </div>

                  )
                )

              )}

            </div>

          </div>


          {/* EXPENSE HISTORY */}

          <div className="page-card">

            <div className="section-heading">

              <h2>
                🧾 Expense History
              </h2>

              <span>
                {expenses.length} expense
                {expenses.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>


            {expenses.length === 0 ? (

              <div className="empty-page">

                <h3>
                  No expenses yet 💰
                </h3>

                <p>
                  Add your first trip expense above.
                </p>

              </div>

            ) : (

              <div className="expense-history">

                {expenses
                  .slice()
                  .reverse()
                  .map((expense) => (

                    <div
                      className="expense-history-item"
                      key={expense.id}
                    >

                      <div className="expense-icon">

                        {expense.category === "Food"
                          ? "🍴"
                          : expense.category ===
                            "Accommodation"
                          ? "🏨"
                          : expense.category ===
                            "Transport"
                          ? "🚕"
                          : expense.category ===
                            "Activities"
                          ? "🎟️"
                          : expense.category ===
                            "Shopping"
                          ? "🛍️"
                          : "💳"}

                      </div>


                      <div className="expense-history-info">

                        <strong>
                          {expense.description}
                        </strong>

                        <span>
                          {expense.category}
                        </span>

                      </div>


                      <div className="expense-history-amount">

                        <strong>
                          {formatMoney(
                            Number(
                              expense.amount || 0
                            )
                          )}
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            deleteExpense(
                              expense.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  ))}

              </div>

            )}

          </div>

        </main>

      </div>

    </div>
  );
}

export default Expenses;