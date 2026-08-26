import { useEffect, useState } from "react";

import DashboardCard from "../components/DashboardCard";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Dashboard() {
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
  // ITINERARY
  // =========================================

  const [itinerary, setItinerary] = useState(() => {
    if (!currentUser) {
      return [];
    }

    const savedItinerary = localStorage.getItem(
      `tripItinerary_${currentUser.id}`
    );

    return savedItinerary
      ? JSON.parse(savedItinerary)
      : [];
  });

  // =========================================
  // TRIP
  // =========================================

  const savedTrip = currentUser
    ? localStorage.getItem(
        `trip_${currentUser.id}`
      )
    : null;

  const trip = savedTrip
    ? JSON.parse(savedTrip)
    : null;

  // =========================================
  // KEEP DASHBOARD DATA UPDATED
  // =========================================

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    function updateData() {
      const savedExpenses = localStorage.getItem(
        `tripExpenses_${currentUser.id}`
      );

      const savedItinerary = localStorage.getItem(
        `tripItinerary_${currentUser.id}`
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
  }, [currentUser?.id]);

  // =========================================
  // NO USER
  // =========================================

  if (!currentUser) {
    window.location.href = "/login";
    return null;
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

              <div className="empty-dashboard-icon">
                ✈️
              </div>

              <h1>
                Ready for your next adventure?
              </h1>

              <p>
                Create your first trip and start
                planning everything in one place.
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
  // BUDGET
  // =========================================

  const tripBudget =
    Number(trip.budget) || 0;

  // =========================================
  // EXPENSE SPENDING
  // =========================================

  const expenseSpending =
    expenses.reduce(
      (total, expense) =>
        total +
        Number(expense.amount || 0),
      0
    );

  // =========================================
  // ITINERARY COST
  // =========================================

  const itineraryCost =
    itinerary.reduce(
      (total, item) =>
        total +
        Number(item.cost || 0),
      0
    );

  // =========================================
  // TOTAL SPENDING
  // =========================================

  const totalSpending =
    expenseSpending + itineraryCost;

  // =========================================
  // REMAINING BUDGET
  // =========================================

  const remainingBudget =
    tripBudget - totalSpending;

  // =========================================
  // BUDGET USED
  // =========================================

  const budgetUsed =
    tripBudget > 0
      ? Math.min(
          Math.max(
            (totalSpending / tripBudget) * 100,
            0
          ),
          100
        )
      : 0;

  // =========================================
  // BUDGET STATUS
  // =========================================

  let budgetStatus = "On Track";

  let budgetMessage =
    "You're comfortably within your trip budget.";

  if (
    budgetUsed >= 50 &&
    budgetUsed < 80
  ) {
    budgetStatus = "Watch Spending";

    budgetMessage =
      "You're using a good amount of your budget. Keep an eye on spending.";
  }

  if (
    budgetUsed >= 80 &&
    budgetUsed < 100
  ) {
    budgetStatus = "Budget Warning";

    budgetMessage =
      "Your remaining budget is getting low.";
  }

  if (budgetUsed >= 100) {
    budgetStatus = "Over Budget";

    budgetMessage =
      "You've reached or exceeded your planned budget.";
  }

  // =========================================
  // RECENT EXPENSES
  // =========================================

  const recentExpenses = expenses
    .slice()
    .reverse()
    .slice(0, 4);

  // =========================================
  // UPCOMING ITINERARY
  // =========================================

  const upcomingActivities =
    itinerary.slice(0, 4);

  // =========================================
  // FORMAT MONEY
  // =========================================

  function formatMoney(amount) {
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN"
    )}`;
  }

  // =========================================
  // DASHBOARD
  // =========================================

  return (
    <div>

      {/* =================================
          NAVBAR
      ================================= */}

      <Navbar />


      {/* =================================
          APP LAYOUT
      ================================= */}

      <div className="app-layout">

        <Sidebar />


        {/* =================================
            MAIN CONTENT
        ================================= */}

        <main className="main-content">


          {/* =================================
              WELCOME / TRIP HEADER
          ================================= */}

          <div className="dashboard-welcome">

            <div>

              <p className="dashboard-eyebrow">
                YOUR TRIP OVERVIEW
              </p>

              <h1>
                {trip.tripName} ✈️
              </h1>

              <p>
                📍 {trip.destination}
                {" · "}
                👥 {trip.travelers} travelers
                {" · "}
                📅 {trip.startDate} → {trip.endDate}
              </p>

            </div>

          </div>


          {/* =================================
              SUMMARY CARDS
          ================================= */}

          <div className="cards">

            <DashboardCard
              title="Trip Budget"
              value={formatMoney(tripBudget)}
            />

            <DashboardCard
              title="Total Spending"
              value={formatMoney(totalSpending)}
            />

            <DashboardCard
              title="Remaining"
              value={formatMoney(
                Math.max(
                  remainingBudget,
                  0
                )
              )}
            />

          </div>


          {/* =================================
              BUDGET HEALTH
          ================================= */}

          <div
            className={`budget-health ${
              budgetStatus
                .toLowerCase()
                .replaceAll(" ", "-")
            }`}
          >

            <div className="budget-health-header">

              <div>

                <h2>
                  🧠 Budget Health
                </h2>

                <p>
                  {budgetMessage}
                </p>

              </div>

              <strong>
                {budgetUsed.toFixed(0)}% used
              </strong>

            </div>


            <div className="budget-progress">

              <div
                className="budget-progress-bar"
                style={{
                  width: `${budgetUsed}%`,
                }}
              />

            </div>


            <div className="budget-health-footer">

              <span>
                {formatMoney(totalSpending)}
                {" "}spent
              </span>

              <span>
                {formatMoney(
                  Math.max(
                    remainingBudget,
                    0
                  )
                )}
                {" "}remaining
              </span>

            </div>

          </div>


          {/* =================================
              QUICK ACTIONS
          ================================= */}

          <div className="dashboard-section">

            <div className="section-heading">

              <div>

                <h2>
                  Quick Actions
                </h2>

                <p>
                  Manage your trip from one place.
                </p>

              </div>

            </div>


            <div className="quick-actions">

              {/* EXPENSES */}

              <a href="/expenses">

                <span>
                  💸
                </span>

                <div>

                  <strong>
                    Expenses
                  </strong>

                  <small>
                    Track your spending
                  </small>

                </div>

                <b>
                  →
                </b>

              </a>


              {/* GROUPS */}

              <a href="/groups">

                <span>
                  👥
                </span>

                <div>

                  <strong>
                    Groups
                  </strong>

                  <small>
                    Split expenses
                  </small>

                </div>

                <b>
                  →
                </b>

              </a>


              {/* BUDGET */}

              <a href="/budget">

                <span>
                  📊
                </span>

                <div>

                  <strong>
                    Budget
                  </strong>

                  <small>
                    Monitor your budget
                  </small>

                </div>

                <b>
                  →
                </b>

              </a>


              {/* ITINERARY */}

              <a href="/itinerary">

                <span>
                  🗓️
                </span>

                <div>

                  <strong>
                    Itinerary
                  </strong>

                  <small>
                    Plan your activities
                  </small>

                </div>

                <b>
                  →
                </b>

              </a>


              {/* EXPLORE */}

              <a href="/explore">

                <span>
                  🌍
                </span>

                <div>

                  <strong>
                    Explore
                  </strong>

                  <small>
                    Discover destinations
                  </small>

                </div>

                <b>
                  →
                </b>

              </a>

            </div>

          </div>


          {/* =================================
              RECENT EXPENSES + ITINERARY
          ================================= */}

          <div className="dashboard-overview-grid">


            {/* =================================
                RECENT EXPENSES
            ================================= */}

            <div className="dashboard-section">

              <div className="section-heading">

                <div>

                  <h2>
                    🧾 Recent Expenses
                  </h2>

                  <p>
                    Your latest trip spending.
                  </p>

                </div>

                <a href="/expenses">
                  View All →
                </a>

              </div>


              {recentExpenses.length === 0 ? (

                <div className="dashboard-empty-small">

                  <span>
                    💰
                  </span>

                  <p>
                    No expenses yet.
                  </p>

                  <a href="/expenses">
                    Add an expense →
                  </a>

                </div>

              ) : (

                <div className="dashboard-list">

                  {recentExpenses.map(
                    (expense, index) => (

                      <div
                        className="dashboard-list-item"
                        key={
                          expense.id ||
                          index
                        }
                      >

                        <div>

                          <strong>
                            {expense.description ||
                              "Trip Expense"}
                          </strong>

                          <small>
                            {expense.category ||
                              "Other"}
                          </small>

                        </div>

                        <strong>
                          {formatMoney(
                            expense.amount
                          )}
                        </strong>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>


            {/* =================================
                ITINERARY PREVIEW
            ================================= */}

            <div className="dashboard-section">

              <div className="section-heading">

                <div>

                  <h2>
                    🗓️ Itinerary
                  </h2>

                  <p>
                    Your planned activities.
                  </p>

                </div>

                <a href="/itinerary">
                  View All →
                </a>

              </div>


              {upcomingActivities.length === 0 ? (

                <div className="dashboard-empty-small">

                  <span>
                    🗺️
                  </span>

                  <p>
                    No activities planned yet.
                  </p>

                  <a href="/itinerary">
                    Plan your itinerary →
                  </a>

                </div>

              ) : (

                <div className="dashboard-list">

                  {upcomingActivities.map(
                    (item, index) => (

                      <div
                        className="dashboard-list-item"
                        key={
                          item.id ||
                          index
                        }
                      >

                        <div>

                          <strong>
                            {item.activity}
                          </strong>

                          <small>
                            {item.day}
                            {" · "}
                            📍 {item.location}
                          </small>

                        </div>

                        <strong>
                          {Number(
                            item.cost || 0
                          ) > 0
                            ? formatMoney(
                                item.cost
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

export default Dashboard;