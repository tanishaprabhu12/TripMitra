import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TripMembers from "../components/TripMembers";
import ExpenseForm from "../components/ExpenseForm";

function Expenses() {

  // =========================================
  // CURRENT USER
  // =========================================

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const currentUserName =
    currentUser?.name ||
    currentUser?.fullName ||
    "Tanisha";


  // =========================================
  // EXPENSES
  // =========================================

  const expensesKey = currentUser
    ? `tripExpenses_${currentUser.id}`
    : "tripExpenses";


  const [expenses, setExpenses] = useState(() => {

    const savedExpenses =
      localStorage.getItem(expensesKey);

    return savedExpenses
      ? JSON.parse(savedExpenses)
      : [];

  });


  // =========================================
  // SAVE EXPENSES
  // =========================================

  useEffect(() => {

    localStorage.setItem(
      expensesKey,
      JSON.stringify(expenses)
    );

  }, [expenses, expensesKey]);


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
  // TOTAL SPENDING
  // =========================================

  const totalSpending =
    expenses.reduce(
      (total, expense) =>
        total +
        Number(expense.amount || 0),
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

    return `₹${Number(amount).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    )}`;

  }


  // =========================================
  // CATEGORY ICON
  // =========================================

  function getCategoryIcon(category) {

    if (category === "Food") {
      return "🍴";
    }

    if (category === "Accommodation") {
      return "🏨";
    }

    if (category === "Transport") {
      return "🚕";
    }

    if (category === "Activities") {
      return "🎟️";
    }

    if (category === "Shopping") {
      return "🛍️";
    }

    return "💳";
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


          {/* =================================
              HEADER
          ================================= */}

          <div className="page-header">

            <div>

              <h1>
                💸 Expenses
              </h1>

              <p>
                Track expenses and split them
                fairly with your trip members.
              </p>

            </div>


            <div className="page-total">

              <span>
                Total Spending
              </span>

              <strong>
                {formatMoney(
                  totalSpending
                )}
              </strong>

            </div>

          </div>


          {/* =================================
              EXPENSE + MEMBERS
          ================================= */}

          <div
            className="dashboard-lower"
          >


            {/* =================================
                EXPENSE FORM
            ================================= */}

            <div className="expense-section">

              <ExpenseForm
                expenses={expenses}
                setExpenses={setExpenses}
              />

            </div>


            {/* =================================
                TRIP MEMBERS
            ================================= */}

            <div className="members-section">

              <TripMembers />

            </div>

          </div>


          {/* =================================
              SPLITTING EXPLANATION
          ================================= */}

          <div className="page-card">

            <h2>
              💡 How Expense Splitting Works
            </h2>

            <p>
              Add everyone traveling with you,
              then select who paid for an expense
              and who should share it.
            </p>

            <div className="split-info-grid">

              <div>
                <strong>
                  1️⃣ Add Members
                </strong>

                <p>
                  Add friends or family members
                  joining the trip.
                </p>
              </div>


              <div>
                <strong>
                  2️⃣ Add Expense
                </strong>

                <p>
                  Enter the amount and choose
                  who paid.
                </p>
              </div>


              <div>
                <strong>
                  3️⃣ Split
                </strong>

                <p>
                  Select everyone who should
                  share the expense.
                </p>
              </div>


              <div>
                <strong>
                  4️⃣ Settle
                </strong>

                <p>
                  TripMitra calculates who owes
                  whom.
                </p>
              </div>

            </div>

          </div>


          {/* =================================
              CATEGORY SUMMARY
          ================================= */}

          <div className="page-card">

            <h2>
              📊 Spending by Category
            </h2>


            <div className="category-summary">

              {Object.keys(
                categoryTotals
              ).length === 0 ? (

                <p>
                  No expenses recorded yet.
                </p>

              ) : (

                Object.entries(
                  categoryTotals
                ).map(
                  ([category, amount]) => (

                    <div
                      className="category-summary-item"
                      key={category}
                    >

                      <span>
                        {getCategoryIcon(
                          category
                        )}{" "}
                        {category}
                      </span>

                      <strong>
                        {formatMoney(
                          amount
                        )}
                      </strong>

                    </div>

                  )
                )

              )}

            </div>

          </div>


          {/* =================================
              EXPENSE HISTORY
          ================================= */}

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
                  Add your first trip expense
                  above.
                </p>

              </div>

            ) : (

              <div className="expense-history">

                {expenses
                  .slice()
                  .reverse()
                  .map((expense) => {

                    const splitMembers =
                      expense.splitBetween ||
                      [
                        expense.paidBy ||
                        currentUserName,
                      ];


                    const share =
                      Number(
                        expense.amount || 0
                      ) /
                      splitMembers.length;


                    return (

                      <div
                        className="expense-history-item"
                        key={expense.id}
                      >


                        {/* ICON */}

                        <div className="expense-icon">

                          {getCategoryIcon(
                            expense.category
                          )}

                        </div>


                        {/* INFO */}

                        <div className="expense-history-info">

                          <strong>
                            {expense.description}
                          </strong>

                          <span>
                            {expense.category}
                          </span>

                          <small>
                            💳 Paid by{" "}
                            {expense.paidBy ||
                              currentUserName}
                          </small>

                          <small>
                            👥 Split between{" "}
                            {splitMembers.join(
                              ", "
                            )}
                          </small>

                        </div>


                        {/* AMOUNT */}

                        <div className="expense-history-amount">

                          <strong>
                            {formatMoney(
                              Number(
                                expense.amount ||
                                0
                              )
                            )}
                          </strong>

                          <small>
                            {formatMoney(
                              share
                            )}{" "}
                            each
                          </small>


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

                    );

                  })}

              </div>

            )}

          </div>


        </main>

      </div>

    </div>

  );

}

export default Expenses;