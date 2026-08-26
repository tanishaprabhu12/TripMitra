import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Budget() {

  // =========================================
  // CURRENT USER
  // =========================================

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const userId = currentUser?.id || "guest";


  // =========================================
  // TRIP
  // =========================================

  const trip = JSON.parse(
    localStorage.getItem(
      `trip_${userId}`
    ) || "null"
  );


  // =========================================
  // BUDGET
  // =========================================

  const [budget, setBudget] = useState(() => {

    return (
      Number(
        localStorage.getItem(
          `tripBudget_${userId}`
        )
      ) ||
      Number(trip?.budget || 0) ||
      0
    );

  });


  // =========================================
  // EXPENSES
  // =========================================

  const [expenses, setExpenses] = useState(() => {

    const saved =
      localStorage.getItem(
        `tripExpenses_${userId}`
      );

    return saved
      ? JSON.parse(saved)
      : [];

  });


  // =========================================
  // ITINERARY
  // =========================================

  const [itinerary, setItinerary] =
    useState(() => {

      const saved =
        localStorage.getItem(
          `tripItinerary_${userId}`
        );

      return saved
        ? JSON.parse(saved)
        : [];

    });


  // =========================================
  // SAVE BUDGET
  // =========================================

  useEffect(() => {

    localStorage.setItem(
      `tripBudget_${userId}`,
      budget
    );

  }, [budget, userId]);


  // =========================================
  // UPDATE DATA
  // =========================================

  useEffect(() => {

    function updateData() {

      const savedExpenses =
        localStorage.getItem(
          `tripExpenses_${userId}`
        );

      const savedItinerary =
        localStorage.getItem(
          `tripItinerary_${userId}`
        );

      setExpenses(
        savedExpenses
          ? JSON.parse(savedExpenses)
          : []
      );

      setItinerary(
        savedItinerary
          ? JSON.parse(savedItinerary)
          : []
      );

    }

    updateData();

    window.addEventListener(
      "storage",
      updateData
    );

    return () => {

      window.removeEventListener(
        "storage",
        updateData
      );

    };

  }, [userId]);


  // =========================================
  // CALCULATIONS
  // =========================================

  const expenseSpending =
    expenses.reduce(
      (total, expense) =>
        total +
        Number(
          expense.amount || 0
        ),
      0
    );


  const itineraryCost =
    itinerary.reduce(
      (total, item) =>
        total +
        Number(
          item.cost || 0
        ),
      0
    );


  const totalSpending =
    expenseSpending +
    itineraryCost;


  const remainingBudget =
    Math.max(
      budget -
        totalSpending,
      0
    );


  const overBudget =
    Math.max(
      totalSpending -
        budget,
      0
    );


  const percentage =
    budget > 0
      ? Math.min(
          (totalSpending /
            budget) *
            100,
          100
        )
      : 0;


  // =========================================
  // CATEGORY TOTALS
  // =========================================

  const categoryTotals = {};

  expenses.forEach(
    (expense) => {

      const category =
        expense.category ||
        "Other";

      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }

      categoryTotals[category] +=
        Number(
          expense.amount || 0
        );

    }
  );


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

        <main className="main-content budget-page">


          {/* =================================
              HEADER
          ================================= */}

          <div className="modern-page-header">

            <div>

              <p className="page-eyebrow">
                TRIP FINANCES
              </p>

              <h1>
                📊 Trip Budget
              </h1>

              <p>
                {trip?.tripName ||
                  "Your Trip"}
                {trip?.destination
                  ? ` · ${trip.destination}`
                  : ""}
              </p>

            </div>

            <div className="budget-decoration">
              💵👛
            </div>

          </div>


          {/* =================================
              STAT CARDS
          ================================= */}

          <div className="budget-stat-grid">


            {/* BUDGET */}

            <div className="budget-modern-stat purple">

              <div className="stat-icon">
                🎯
              </div>

              <span>
                Total Budget
              </span>

              <strong>
                {formatMoney(budget)}
              </strong>

              <button
                type="button"
                onClick={() => {
                  document
                    .querySelector(
                      ".budget-main-input"
                    )
                    ?.focus();
                }}
              >
                Edit Budget
              </button>

            </div>


            {/* SPENDING */}

            <div className="budget-modern-stat blue">

              <div className="stat-icon">
                💸
              </div>

              <span>
                Total Spending
              </span>

              <strong>
                {formatMoney(
                  totalSpending
                )}
              </strong>

              <small>
                {percentage.toFixed(0)}%
                of budget used
              </small>

            </div>


            {/* REMAINING */}

            <div className="budget-modern-stat green">

              <div className="stat-icon">
                💰
              </div>

              <span>
                Remaining
              </span>

              <strong>
                {formatMoney(
                  remainingBudget
                )}
              </strong>

              <small>
                {budget > 0
                  ? `${Math.max(
                      100 -
                        percentage,
                      0
                    ).toFixed(0)}% of budget left`
                  : "Set a budget"}
              </small>

            </div>


            {/* OVER BUDGET */}

            <div className="budget-modern-stat red">

              <div className="stat-icon">
                ⚠️
              </div>

              <span>
                Over Budget
              </span>

              <strong>
                {formatMoney(
                  overBudget
                )}
              </strong>

              <small>
                {overBudget > 0
                  ? "Budget exceeded"
                  : "You're within budget"}
              </small>

            </div>

          </div>


          {/* =================================
              SET BUDGET
          ================================= */}

          <div className="modern-card budget-setting-card">

            <div>

              <span className="card-kicker">
                💰 BUDGET SETTINGS
              </span>

              <h2>
                Set Trip Budget
              </h2>

              <p>
                Enter the maximum amount you
                want to spend on this trip.
              </p>

            </div>

            <div className="budget-input-modern">

              <span>
                ₹
              </span>

              <input
                className="budget-main-input"
                type="number"
                min="0"
                placeholder="Trip budget"
                value={
                  budget || ""
                }
                onChange={(event) =>
                  setBudget(
                    Number(
                      event.target.value
                    )
                  )
                }
              />

            </div>

          </div>


          {/* =================================
              PROGRESS + BREAKDOWN
          ================================= */}

          <div className="budget-content-grid">


            {/* PROGRESS */}

            <div className="modern-card">

              <div className="card-section-title">
                📈 Budget Progress
              </div>

              <div className="budget-progress-big">

                <div
                  className={`budget-progress-big-fill ${
                    percentage >= 100
                      ? "danger"
                      : percentage >= 80
                      ? "warning"
                      : ""
                  }`}
                  style={{
                    width:
                      `${percentage}%`,
                  }}
                />

              </div>

              <div className="budget-progress-info">

                <div>

                  <strong>
                    {percentage.toFixed(0)}%
                  </strong>

                  <span>
                    of your budget used
                  </span>

                </div>

                <div>

                  <strong>
                    {formatMoney(
                      totalSpending
                    )}
                  </strong>

                  <span>
                    spent
                  </span>

                </div>

              </div>


              {budget === 0 ? (

                <div className="budget-message neutral">
                  Set your budget to start tracking.
                </div>

              ) : overBudget > 0 ? (

                <div className="budget-message danger">
                  🚨 You're{" "}
                  <strong>
                    {formatMoney(
                      overBudget
                    )}
                  </strong>{" "}
                  over your budget.
                </div>

              ) : percentage >= 80 ? (

                <div className="budget-message warning">
                  ⚠️ You're getting close to your
                  budget limit.
                </div>

              ) : (

                <div className="budget-message success">
                  ✅ You're within budget! You have{" "}
                  <strong>
                    {formatMoney(
                      remainingBudget
                    )}
                  </strong>{" "}
                  left.
                </div>

              )}

            </div>


            {/* SPENDING BREAKDOWN */}

            <div className="modern-card">

              <div className="card-section-title">
                💸 Spending Breakdown
              </div>

              <div className="breakdown-row">

                <div>
                  <span>
                    🧾 Actual Expenses
                  </span>
                </div>

                <strong>
                  {formatMoney(
                    expenseSpending
                  )}
                </strong>

              </div>

              <div className="mini-progress">

                <div
                  style={{
                    width:
                      totalSpending > 0
                        ? `${Math.min(
                            (expenseSpending /
                              totalSpending) *
                              100,
                            100
                          )}%`
                        : "0%",
                  }}
                />

              </div>


              <div className="breakdown-row">

                <div>
                  <span>
                    🗓️ Planned Activities
                  </span>
                </div>

                <strong>
                  {formatMoney(
                    itineraryCost
                  )}
                </strong>

              </div>

              <div className="mini-progress">

                <div
                  style={{
                    width:
                      totalSpending > 0
                        ? `${Math.min(
                            (itineraryCost /
                              totalSpending) *
                              100,
                            100
                          )}%`
                        : "0%",
                  }}
                />

              </div>


              <div className="breakdown-total">

                <span>
                  💰 Total Spending
                </span>

                <strong>
                  {formatMoney(
                    totalSpending
                  )}
                </strong>

              </div>

            </div>

          </div>


          {/* =================================
              CATEGORY
          ================================= */}

          <div className="modern-card">

            <div className="card-section-title">
              📊 Spending by Category
            </div>

            {Object.keys(
              categoryTotals
            ).length === 0 ? (

              <div className="modern-empty">

                <div>
                  💰
                </div>

                <h3>
                  No spending yet
                </h3>

                <p>
                  Add expenses to see your
                  spending breakdown.
                </p>

              </div>

            ) : (

              <div className="category-modern-list">

                {Object.entries(
                  categoryTotals
                ).map(
                  ([category, amount]) => {

                    const categoryPercentage =
                      expenseSpending > 0
                        ? (
                            amount /
                            expenseSpending
                          ) *
                          100
                        : 0;

                    return (

                      <div
                        className="category-modern-item"
                        key={category}
                      >

                        <div className="category-name">

                          <span>
                            {category ===
                            "Food"
                              ? "🍴"
                              : category ===
                                "Accommodation"
                              ? "🏨"
                              : category ===
                                "Transport"
                              ? "🚕"
                              : category ===
                                "Activities"
                              ? "🎟️"
                              : category ===
                                "Shopping"
                              ? "🛍️"
                              : "💳"}
                          </span>

                          <div>

                            <strong>
                              {category}
                            </strong>

                            <small>
                              {categoryPercentage.toFixed(
                                0
                              )}
                              % of expenses
                            </small>

                          </div>

                        </div>

                        <strong>
                          {formatMoney(
                            amount
                          )}
                        </strong>

                      </div>

                    );

                  }
                )}

              </div>

            )}

          </div>


          {/* =================================
              RECENT EXPENSES + ITINERARY
          ================================= */}

          <div className="budget-content-grid">


            {/* RECENT EXPENSES */}

            <div className="modern-card">

              <div className="card-title-row">

                <div className="card-section-title">
                  🧾 Recent Expenses
                </div>

                <span className="count-pill">
                  {expenses.length}
                </span>

              </div>

              {expenses.length === 0 ? (

                <div className="small-empty">
                  No expenses yet.
                </div>

              ) : (

                <div className="modern-list">

                  {expenses
                    .slice()
                    .reverse()
                    .slice(0, 5)
                    .map(
                      (expense) => (

                        <div
                          className="modern-list-item"
                          key={expense.id}
                        >

                          <div>

                            <strong>
                              {expense.description}
                            </strong>

                            <span>
                              {expense.category}
                            </span>

                          </div>

                          <strong>
                            {formatMoney(
                              Number(
                                expense.amount ||
                                0
                              )
                            )}
                          </strong>

                        </div>

                      )
                    )}

                </div>

              )}

            </div>


            {/* PLANNED */}

            <div className="modern-card">

              <div className="card-title-row">

                <div className="card-section-title">
                  🗓️ Planned Activities
                </div>

                <span className="count-pill">
                  {itinerary.length}
                </span>

              </div>

              {itinerary.length === 0 ? (

                <div className="small-empty">
                  No planned activities yet.
                </div>

              ) : (

                <div className="modern-list">

                  {itinerary
                    .slice()
                    .reverse()
                    .slice(0, 5)
                    .map(
                      (item) => (

                        <div
                          className="modern-list-item"
                          key={item.id}
                        >

                          <div>

                            <strong>
                              {item.activity}
                            </strong>

                            <span>
                              📍 {item.location}
                            </span>

                          </div>

                          <strong>
                            {Number(
                              item.cost || 0
                            ) > 0
                              ? formatMoney(
                                  Number(
                                    item.cost
                                  )
                                )
                              : "Free"}
                          </strong>

                        </div>

                      )
                    )}

                </div>

              )}

            </div>

          </div>

        </main>

      </div>

    </div>

  );
}

export default Budget;