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

  const tripKey = `trip_${userId}`;

  const getTrip = () => {
    const savedTrip =
      localStorage.getItem(tripKey);

    return savedTrip
      ? JSON.parse(savedTrip)
      : null;
  };


  const [trip, setTrip] = useState(
    getTrip
  );


  // =========================================
  // BUDGET
  // =========================================

  const [budget, setBudget] = useState(() => {

    const savedTrip = getTrip();

    return Number(
      savedTrip?.budget || 0
    );

  });


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
  // ITINERARY
  // =========================================

  const [itinerary, setItinerary] = useState(() => {

    const savedItinerary =
      localStorage.getItem(
        `tripItinerary_${userId}`
      );

    return savedItinerary
      ? JSON.parse(savedItinerary)
      : [];

  });


  // =========================================
  // SAVE BUDGET TO TRIP
  // =========================================

  useEffect(() => {

    const savedTrip =
      localStorage.getItem(tripKey);

    if (!savedTrip) {
      return;
    }

    const updatedTrip =
      JSON.parse(savedTrip);

    updatedTrip.budget =
      Number(budget) || 0;

    localStorage.setItem(
      tripKey,
      JSON.stringify(updatedTrip)
    );

    setTrip(updatedTrip);

  }, [budget, tripKey]);


  // =========================================
  // UPDATE DATA
  // =========================================

  useEffect(() => {

    function updateData() {

      const savedTrip =
        localStorage.getItem(tripKey);

      const savedExpenses =
        localStorage.getItem(
          `tripExpenses_${userId}`
        );

      const savedItinerary =
        localStorage.getItem(
          `tripItinerary_${userId}`
        );


      if (savedTrip) {

        const updatedTrip =
          JSON.parse(savedTrip);

        setTrip(updatedTrip);

        setBudget(
          Number(
            updatedTrip.budget || 0
          )
        );

      } else {

        setTrip(null);
        setBudget(0);

      }


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


    window.addEventListener(
      "tripMembersUpdated",
      updateData
    );


    return () => {

      window.removeEventListener(
        "storage",
        updateData
      );

      window.removeEventListener(
        "tripMembersUpdated",
        updateData
      );

    };

  }, [userId, tripKey]);


  // =========================================
  // EXPENSE SPENDING
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


  // =========================================
  // ITINERARY COST
  // =========================================

  const itineraryCost =
    itinerary.reduce(
      (total, item) =>
        total +
        Number(
          item.cost || 0
        ),
      0
    );


  // =========================================
  // TOTAL SPENDING
  // =========================================

  const totalSpending =
    expenseSpending +
    itineraryCost;


  // =========================================
  // REMAINING
  // =========================================

  const remainingBudget =
    Math.max(
      budget -
      totalSpending,
      0
    );


  // =========================================
  // OVER BUDGET
  // =========================================

  const overBudget =
    Math.max(
      totalSpending -
      budget,
      0
    );


  // =========================================
  // PERCENTAGE
  // =========================================

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


  // Expenses

  expenses.forEach(
    (expense) => {

      const category =
        expense.category ||
        "Other";

      if (
        !categoryTotals[category]
      ) {

        categoryTotals[category] = 0;

      }


      categoryTotals[category] +=
        Number(
          expense.amount || 0
        );

    }
  );


  // Itinerary

  if (itineraryCost > 0) {

    categoryTotals[
      "Planned Activities"
    ] = itineraryCost;

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
  // NO TRIP
  // =========================================

  if (!trip) {

    return (

      <div>

        <Navbar />

        <div className="app-layout">

          <Sidebar />

          <main className="main-content">

            <div className="empty-dashboard">

              <h1>
                No trip yet ✈️
              </h1>

              <p>
                Create a trip before
                setting a budget.
              </p>

              <button
                onClick={() =>
                  window.location.href =
                    "/create-trip"
                }
              >
                Create My First Trip ✈️
              </button>

            </div>

          </main>

        </div>

      </div>

    );

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
                📊 Trip Budget
              </h1>

              <p>
                {trip.tripName} ·{" "}
                {trip.destination}
              </p>

            </div>

          </div>


          {/* =================================
              SET BUDGET
          ================================= */}

          <div className="page-card">

            <h2>
              💰 Set Trip Budget
            </h2>

            <p>
              Enter the maximum amount you
              want to spend on this trip.
            </p>


            <div className="budget-input-row">

              <input
                type="number"
                min="0"
                placeholder="Trip budget ₹"
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
              OVERVIEW
          ================================= */}

          <div className="budget-overview-grid">

            <div className="budget-stat-card">

              <span>
                🎯 Total Budget
              </span>

              <strong>
                {formatMoney(
                  budget
                )}
              </strong>

            </div>


            <div className="budget-stat-card">

              <span>
                💸 Total Spending
              </span>

              <strong>
                {formatMoney(
                  totalSpending
                )}
              </strong>

              <small>
                Expenses + planned activities
              </small>

            </div>


            <div className="budget-stat-card">

              <span>
                💰 Remaining
              </span>

              <strong>
                {formatMoney(
                  remainingBudget
                )}
              </strong>

            </div>

          </div>


          {/* =================================
              SPENDING BREAKDOWN
          ================================= */}

          <div className="page-card">

            <h2>
              💸 Spending Breakdown
            </h2>


            <div className="budget-breakdown-grid">

              <div>

                <span>
                  🧾 Actual Expenses
                </span>

                <strong>
                  {formatMoney(
                    expenseSpending
                  )}
                </strong>

              </div>


              <div>

                <span>
                  🗓️ Planned Activities
                </span>

                <strong>
                  {formatMoney(
                    itineraryCost
                  )}
                </strong>

              </div>


              <div>

                <span>
                  💰 Total
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
              PROGRESS
          ================================= */}

          <div className="page-card">

            <div className="section-heading">

              <div>

                <h2>
                  📈 Budget Progress
                </h2>

                <span>
                  {percentage.toFixed(0)}%
                  {" "}of your budget used
                </span>

              </div>


              <strong>
                {formatMoney(
                  totalSpending
                )}
              </strong>

            </div>


            <div className="budget-progress">

              <div
                className={`budget-progress-bar ${
                  percentage >= 100
                    ? "over"
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


            {budget === 0 ? (

              <p className="budget-status">

                Set your budget above
                to start tracking.

              </p>

            ) : overBudget > 0 ? (

              <div className="budget-warning">

                🚨 You are{" "}

                <strong>
                  {formatMoney(
                    overBudget
                  )}
                </strong>

                {" "}over your budget.

              </div>

            ) : percentage >= 80 ? (

              <div className="budget-warning">

                ⚠️ You're getting close
                to your budget limit.

              </div>

            ) : (

              <div className="budget-good">

                ✅ You're within your
                budget!

                {" "}You have{" "}

                <strong>
                  {formatMoney(
                    remainingBudget
                  )}
                </strong>

                {" "}left.

              </div>

            )}

          </div>


          {/* =================================
              CATEGORY BREAKDOWN
          ================================= */}

          <div className="page-card">

            <h2>
              📊 Spending by Category
            </h2>


            {Object.keys(
              categoryTotals
            ).length === 0 ? (

              <div className="empty-page">

                <h3>
                  No spending yet 💰
                </h3>

                <p>
                  Add expenses or itinerary
                  activities to see your
                  spending breakdown.
                </p>

              </div>

            ) : (

              <div className="budget-category-list">

                {Object.entries(
                  categoryTotals
                ).map(
                  ([category, amount]) => {

                    const categoryPercentage =
                      totalSpending > 0
                        ? (
                            amount /
                            totalSpending
                          ) *
                          100
                        : 0;


                    return (

                      <div
                        className="budget-category-item"
                        key={category}
                      >

                        <div>

                          <strong>
                            {category}
                          </strong>

                          <span>
                            {categoryPercentage.toFixed(
                              0
                            )}
                            % of spending
                          </span>

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
              ITINERARY SUMMARY
          ================================= */}

          <div className="page-card">

            <div className="section-heading">

              <div>

                <h2>
                  🗓️ Planned Activities
                </h2>

                <span>
                  {itinerary.length}{" "}
                  {itinerary.length === 1
                    ? "activity"
                    : "activities"}
                </span>

              </div>


              <strong>
                {formatMoney(
                  itineraryCost
                )}
              </strong>

            </div>


            {itinerary.length === 0 ? (

              <div className="empty-page">

                <p>
                  No planned activities yet.
                </p>

              </div>

            ) : (

              <div className="budget-expense-list">

                {itinerary
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map(
                    (item) => (

                      <div
                        className="budget-expense-item"
                        key={item.id}
                      >

                        <div>

                          <strong>
                            {item.activity}
                          </strong>

                          <span>
                            📍{" "}
                            {item.location}
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


          {/* =================================
              RECENT EXPENSES
          ================================= */}

          <div className="page-card">

            <div className="section-heading">

              <h2>
                🧾 Recent Expenses
              </h2>

              <span>
                {expenses.length}{" "}
                expense
                {expenses.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>


            {expenses.length === 0 ? (

              <div className="empty-page">

                <h3>
                  No expenses yet
                </h3>

                <p>
                  Add expenses from the
                  Expenses page.
                </p>

              </div>

            ) : (

              <div className="budget-expense-list">

                {expenses
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map(
                    (expense) => (

                      <div
                        className="budget-expense-item"
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


        </main>

      </div>

    </div>

  );

}

export default Budget;