import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Budget() {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [itinerary, setItinerary] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const savedTrip = localStorage.getItem(
      `trip_${currentUser.id}`
    );

    const savedExpenses = localStorage.getItem(
      `tripExpenses_${currentUser.id}`
    );

    const savedItinerary = localStorage.getItem(
      `tripItinerary_${currentUser.id}`
    );

    setTrip(
      savedTrip
        ? JSON.parse(savedTrip)
        : null
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
  }, [currentUser?.id]);

  // =========================================
  // BUDGET
  // =========================================

  const budget =
    Number(trip?.budget || 0);

  // Actual expenses
  const expenseSpending = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );

  // Planned itinerary costs
  const itinerarySpending = itinerary.reduce(
    (total, item) =>
      total + Number(item.cost || 0),
    0
  );

  // Total = actual expenses + planned activities
  const totalSpending =
    expenseSpending + itinerarySpending;

  const remaining =
    budget - totalSpending;

  const percentage =
    budget > 0
      ? Math.min(
          (totalSpending / budget) * 100,
          100
        )
      : 0;

  // =========================================
  // CATEGORY BREAKDOWN
  // =========================================

  const categories = {};

  expenses.forEach((expense) => {
    const category =
      expense.category || "Other";

    categories[category] =
      (categories[category] || 0) +
      Number(expense.amount || 0);
  });

  // Add planned itinerary as its own category
  if (itinerarySpending > 0) {
    categories["Planned Activities"] =
      itinerarySpending;
  }

  // =========================================
  // FORMAT MONEY
  // =========================================

  function formatMoney(amount) {
    return `₹${Number(amount).toLocaleString(
      "en-IN"
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

            <div className="empty-page">

              <h1>
                No trip yet ✈️
              </h1>

              <p>
                Create a trip to start managing
                your budget.
              </p>

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

          {/* HEADER */}

          <div className="page-header">

            <div>

              <p className="dashboard-eyebrow">
                TRIP FINANCES
              </p>

              <h1>
                📊 Trip Budget
              </h1>

              <p>
                Manage the budget for{" "}
                <strong>
                  {trip.tripName}
                </strong>
                {" · "}
                {trip.destination}
              </p>

            </div>

          </div>


          {/* BUDGET CARDS */}

          <div className="cards">

            <div className="dashboard-card">

              <h3>
                Total Budget
              </h3>

              <strong>
                {formatMoney(budget)}
              </strong>

            </div>


            <div className="dashboard-card">

              <h3>
                Total Planned Spending
              </h3>

              <strong>
                {formatMoney(totalSpending)}
              </strong>

            </div>


            <div className="dashboard-card">

              <h3>
                Remaining
              </h3>

              <strong>
                {formatMoney(
                  Math.max(
                    remaining,
                    0
                  )
                )}
              </strong>

            </div>

          </div>


          {/* SPENDING BREAKDOWN */}

          <div className="page-card">

            <div className="section-heading">

              <div>

                <h2>
                  🧠 Budget Health
                </h2>

                <p>
                  {percentage < 50
                    ? "You're comfortably within your budget."
                    : percentage < 80
                    ? "Keep an eye on your spending."
                    : percentage < 100
                    ? "Your remaining budget is getting low."
                    : "You've reached your planned budget."}
                </p>

              </div>

              <strong>
                {percentage.toFixed(0)}% used
              </strong>

            </div>


            <div className="budget-progress">

              <div
                className="budget-progress-bar"
                style={{
                  width: `${percentage}%`,
                }}
              />

            </div>


            <div className="budget-health-footer">

              <span>
                {formatMoney(totalSpending)} planned
              </span>

              <span>
                {formatMoney(
                  Math.max(
                    remaining,
                    0
                  )
                )} remaining
              </span>

            </div>

          </div>


          {/* ACTUAL VS PLANNED */}

          <div className="dashboard-overview-grid">

            <div className="page-card">

              <h2>
                💸 Actual Expenses
              </h2>

              <p>
                Money you've already recorded.
              </p>

              <strong className="large-money">
                {formatMoney(
                  expenseSpending
                )}
              </strong>

            </div>


            <div className="page-card">

              <h2>
                🗓️ Planned Activities
              </h2>

              <p>
                Estimated costs from your itinerary.
              </p>

              <strong className="large-money">
                {formatMoney(
                  itinerarySpending
                )}
              </strong>

            </div>

          </div>


          {/* CATEGORY BREAKDOWN */}

          <div className="page-card">

            <h2>
              📈 Spending Breakdown
            </h2>

            {Object.keys(categories).length === 0 ? (

              <div className="empty-page">

                <p>
                  No spending recorded yet.
                </p>

              </div>

            ) : (

              <div className="budget-category-list">

                {Object.entries(categories).map(
                  ([category, amount]) => {

                    const categoryPercentage =
                      totalSpending > 0
                        ? (amount / totalSpending) *
                          100
                        : 0;

                    return (
                      <div
                        className="budget-category"
                        key={category}
                      >

                        <div className="budget-category-header">

                          <strong>
                            {category}
                          </strong>

                          <span>
                            {formatMoney(amount)}
                          </span>

                        </div>


                        <div className="budget-progress">

                          <div
                            className="budget-progress-bar"
                            style={{
                              width: `${categoryPercentage}%`,
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

        </main>

      </div>

    </div>
  );
}

export default Budget;