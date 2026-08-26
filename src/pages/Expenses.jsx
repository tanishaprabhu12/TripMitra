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

  const userId = currentUser?.id || "guest";

  const currentUserName =
    currentUser?.name ||
    currentUser?.fullName ||
    "Traveler";


  // =========================================
  // MEMBERS
  // =========================================

  const membersKey = currentUser
    ? `tripMembers_${currentUser.id}`
    : "tripMembers";

  const getMembers = () => {

    const savedMembers =
      localStorage.getItem(membersKey);

    return savedMembers
      ? JSON.parse(savedMembers)
      : [currentUserName];

  };


  const [members, setMembers] =
    useState(getMembers);


  // =========================================
  // EXPENSES
  // =========================================

  const [expenses, setExpenses] = useState(() => {

    const savedExpenses =
      localStorage.getItem(
        `tripExpenses_${userId}`
      );

    return savedExpenses
      ? JSON.parse(savedExpenses)
      : [];

  });


  // =========================================
  // FORM
  // =========================================

  const [amount, setAmount] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [paidBy, setPaidBy] =
    useState(currentUserName);

  const [splitBetween, setSplitBetween] =
    useState([currentUserName]);


  // =========================================
  // SAVE EXPENSES
  // =========================================

  useEffect(() => {

    localStorage.setItem(
      `tripExpenses_${userId}`,
      JSON.stringify(expenses)
    );

  }, [expenses, userId]);


  // =========================================
  // UPDATE MEMBERS
  // =========================================

  useEffect(() => {

    function updateMembers() {

      const updatedMembers =
        getMembers();

      setMembers(updatedMembers);

    }

    window.addEventListener(
      "tripMembersUpdated",
      updateMembers
    );

    window.addEventListener(
      "storage",
      updateMembers
    );

    return () => {

      window.removeEventListener(
        "tripMembersUpdated",
        updateMembers
      );

      window.removeEventListener(
        "storage",
        updateMembers
      );

    };

  }, [membersKey]);


  // =========================================
  // TOGGLE SPLIT MEMBER
  // =========================================

  function toggleMember(member) {

    setSplitBetween(
      (currentMembers) => {

        if (
          currentMembers.includes(member)
        ) {

          return currentMembers.filter(
            (item) => item !== member
          );

        }

        return [
          ...currentMembers,
          member,
        ];

      }
    );

  }


  // =========================================
  // ADD EXPENSE
  // =========================================

  function handleSubmit(event) {

    event.preventDefault();

    if (
      !amount ||
      !category ||
      !description ||
      !paidBy
    ) {

      alert(
        "Please fill in all the fields."
      );

      return;

    }


    if (
      splitBetween.length === 0
    ) {

      alert(
        "Please select at least one person."
      );

      return;

    }


    const numericAmount =
      Number(amount);


    const sharePerPerson =
      numericAmount /
      splitBetween.length;


    const newExpense = {

      id: Date.now(),

      amount: numericAmount,

      category,

      description,

      paidBy,

      splitBetween: [
        ...splitBetween,
      ],

      sharePerPerson,

    };


    setExpenses(
      (currentExpenses) => [
        ...currentExpenses,
        newExpense,
      ]
    );


    // Reset form

    setAmount("");

    setCategory("");

    setDescription("");

    setPaidBy(currentUserName);

    setSplitBetween([
      currentUserName,
    ]);

  }


  // =========================================
  // DELETE
  // =========================================

  function deleteExpense(id) {

    setExpenses(
      (currentExpenses) =>
        currentExpenses.filter(
          (expense) =>
            expense.id !== id
        )
    );

  }


  // =========================================
  // TOTAL
  // =========================================

  const totalSpending =
    expenses.reduce(
      (total, expense) =>
        total +
        Number(
          expense.amount || 0
        ),
      0
    );


  // =========================================
  // CATEGORY TOTALS
  // =========================================

  const categoryTotals = {};

  expenses.forEach(
    (expense) => {

      const category =
        expense.category ||
        "Other";

      if (
        !categoryTotals[category]
      ) {

        categoryTotals[category] =
          0;

      }

      categoryTotals[category] +=
        Number(
          expense.amount || 0
        );

    }
  );


  // =========================================
  // CATEGORY ICON
  // =========================================

  function getCategoryIcon(
    category
  ) {

    if (
      category === "Food"
    ) {
      return "🍴";
    }

    if (
      category === "Accommodation"
    ) {
      return "🏨";
    }

    if (
      category === "Transport"
    ) {
      return "🚕";
    }

    if (
      category === "Activities"
    ) {
      return "🎟️";
    }

    if (
      category === "Shopping"
    ) {
      return "🛍️";
    }

    return "💳";

  }


  // =========================================
  // FORMAT MONEY
  // =========================================

  function formatMoney(amount) {

    return `₹${Number(
      amount
    ).toLocaleString(
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

        <main className="main-content expenses-page">


          {/* =================================
              HEADER
          ================================= */}

          <div className="modern-page-header">

            <div>

              <p className="page-eyebrow">
                TRIP FINANCES
              </p>

              <h1>
                💸 Expenses
              </h1>

              <p>
                Track every expense and keep
                your trip spending under control.
              </p>

            </div>

            <div className="expenses-decoration">
              💳💰
            </div>

          </div>


          {/* =================================
              TOTAL CARD
          ================================= */}

          <div className="expenses-total-banner">

            <div>

              <span>
                💰 TOTAL TRIP SPENDING
              </span>

              <strong>
                {formatMoney(
                  totalSpending
                )}
              </strong>

              <small>
                {expenses.length}{" "}
                {expenses.length === 1
                  ? "expense"
                  : "expenses"} recorded
              </small>

            </div>

            <div className="expenses-total-icon">
              💸
            </div>

          </div>


          {/* =================================
              ADD EXPENSE
          ================================= */}

          <div className="modern-card">

            <div className="card-title-row">

              <div>

                <span className="card-kicker">
                  ➕ NEW EXPENSE
                </span>

                <h2>
                  Add Trip Expense
                </h2>

                <p>
                  Record a shared expense and
                  choose who should split it.
                </p>

              </div>

              <div className="expense-form-icon">
                🧾
              </div>

            </div>


            <form
              className="modern-expense-form"
              onSubmit={handleSubmit}
            >


              {/* AMOUNT */}

              <div className="expense-form-field">

                <label>
                  Amount
                </label>

                <div className="expense-money-input">

                  <span>
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={amount}
                    onChange={(event) =>
                      setAmount(
                        event.target.value
                      )
                    }
                  />

                </div>

              </div>


              {/* CATEGORY */}

              <div className="expense-form-field">

                <label>
                  Category
                </label>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
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

              </div>


              {/* DESCRIPTION */}

              <div className="expense-form-field expense-description-field">

                <label>
                  Description
                </label>

                <input
                  type="text"
                  placeholder="What did you spend on?"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                />

              </div>


              {/* PAID BY */}

              <div className="expense-form-field">

                <label>
                  Paid by
                </label>

                <select
                  value={paidBy}
                  onChange={(event) =>
                    setPaidBy(
                      event.target.value
                    )
                  }
                >

                  {members.map(
                    (member) => (

                      <option
                        key={member}
                        value={member}
                      >
                        {member}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* SPLIT */}

              <div className="expense-split-section">

                <div className="split-heading">

                  <div>

                    <label>
                      Split between
                    </label>

                    <span>
                      {splitBetween.length}{" "}
                      {splitBetween.length === 1
                        ? "person"
                        : "people"}
                    </span>

                  </div>

                  {amount &&
                    splitBetween.length > 0 && (

                    <strong>
                      {formatMoney(
                        Number(amount) /
                          splitBetween.length
                      )}{" "}
                      each
                    </strong>

                  )}

                </div>


                <div className="modern-member-grid">

                  {members.map(
                    (member) => (

                      <button
                        type="button"
                        key={member}
                        className={
                          splitBetween.includes(
                            member
                          )
                            ? "modern-member selected"
                            : "modern-member"
                        }
                        onClick={() =>
                          toggleMember(
                            member
                          )
                        }
                      >

                        <span>
                          👤
                        </span>

                        <span>
                          {member}
                        </span>

                        {splitBetween.includes(
                          member
                        ) && (

                          <span className="member-check">
                            ✓
                          </span>

                        )}

                      </button>

                    )
                  )}

                </div>

              </div>


              {/* SUBMIT */}

              <button
                className="modern-expense-submit"
                type="submit"
              >
                Add Expense 💸
              </button>

            </form>

          </div>


          {/* =================================
              CATEGORY SUMMARY
          ================================= */}

          <div className="modern-card">

            <div className="card-title-row">

              <div className="card-section-title">
                📊 Spending by Category
              </div>

              <span className="count-pill">
                {Object.keys(
                  categoryTotals
                ).length}{" "}
                categories
              </span>

            </div>


            {Object.keys(
              categoryTotals
            ).length === 0 ? (

              <div className="modern-empty">

                <div>
                  📊
                </div>

                <h3>
                  No spending yet
                </h3>

                <p>
                  Your spending breakdown
                  will appear here.
                </p>

              </div>

            ) : (

              <div className="expense-category-grid">

                {Object.entries(
                  categoryTotals
                ).map(
                  ([category, amount]) => {

                    const percentage =
                      totalSpending > 0
                        ? (
                            amount /
                            totalSpending
                          ) *
                          100
                        : 0;

                    return (

                      <div
                        className="expense-category-card"
                        key={category}
                      >

                        <div className="expense-category-top">

                          <div className="expense-category-icon">
                            {getCategoryIcon(
                              category
                            )}
                          </div>

                          <div>

                            <span>
                              {category}
                            </span>

                            <small>
                              {percentage.toFixed(
                                0
                              )}
                              % of spending
                            </small>

                          </div>

                        </div>

                        <strong>
                          {formatMoney(
                            amount
                          )}
                        </strong>

                        <div className="category-mini-progress">

                          <div
                            style={{
                              width:
                                `${percentage}%`,
                            }}
                          />

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            )}

          </div>


          {/* =================================
              EXPENSE HISTORY
          ================================= */}

          <div className="modern-card">

            <div className="card-title-row">

              <div>

                <div className="card-section-title">
                  🧾 Expense History
                </div>

                <p>
                  All your trip expenses in
                  one place.
                </p>

              </div>

              <span className="count-pill">
                {expenses.length}{" "}
                {expenses.length === 1
                  ? "expense"
                  : "expenses"}
              </span>

            </div>


            {expenses.length === 0 ? (

              <div className="modern-empty">

                <div>
                  💰
                </div>

                <h3>
                  No expenses yet
                </h3>

                <p>
                  Add your first trip expense
                  above.
                </p>

              </div>

            ) : (

              <div className="modern-expense-list">

                {expenses
                  .slice()
                  .reverse()
                  .map(
                    (expense) => (

                      <div
                        className="modern-expense-item"
                        key={expense.id}
                      >

                        <div className="modern-expense-icon">

                          {getCategoryIcon(
                            expense.category
                          )}

                        </div>


                        <div className="modern-expense-info">

                          <strong>
                            {expense.description}
                          </strong>

                          <span>
                            {expense.category}
                          </span>

                          <small>

                            Paid by{" "}
                            <strong>
                              {expense.paidBy ||
                                currentUserName}
                            </strong>

                            {" · "}

                            Split between{" "}

                            {(
                              expense.splitBetween ||
                              [
                                expense.paidBy ||
                                  currentUserName,
                              ]
                            ).join(", ")}

                          </small>

                        </div>


                        <div className="modern-expense-amount">

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
                              Number(
                                expense.sharePerPerson ||
                                  expense.amount ||
                                  0
                              )
                            )}{" "}
                            each
                          </small>

                        </div>


                        <button
                          type="button"
                          className="modern-delete-expense"
                          onClick={() =>
                            deleteExpense(
                              expense.id
                            )
                          }
                          title="Delete expense"
                        >
                          🗑️
                        </button>

                      </div>

                    )
                  )}

              </div>

            )}

          </div>


        </main>

      </div>

    </div>

  );

}

export default Expenses;