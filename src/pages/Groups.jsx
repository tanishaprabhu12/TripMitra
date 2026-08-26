import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Groups() {
  const navigate = useNavigate();

  // =========================================
  // CURRENT USER
  // =========================================

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  // =========================================
  // CURRENT TRIP
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
  // MEMBERS
  // =========================================

  const [members, setMembers] = useState(() => {
    if (!currentUser) {
      return [];
    }

    const savedMembers = localStorage.getItem(
      `tripMembers_${currentUser.id}`
    );

    return savedMembers
      ? JSON.parse(savedMembers)
      : [currentUser.name];
  });

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
  // UPDATE DATA
  // =========================================

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    function updateData() {
      const savedMembers = localStorage.getItem(
        `tripMembers_${currentUser.id}`
      );

      const savedExpenses = localStorage.getItem(
        `tripExpenses_${currentUser.id}`
      );

      setMembers(
        savedMembers
          ? JSON.parse(savedMembers)
          : [currentUser.name]
      );

      setExpenses(
        savedExpenses
          ? JSON.parse(savedExpenses)
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
  // NO LOGIN
  // =========================================

  if (!currentUser) {
    navigate("/login");
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

              <h1>
                No trip yet ✈️
              </h1>

              <p>
                Create a trip before managing
                your group expenses.
              </p>

              <button
                onClick={() =>
                  navigate("/create-trip")
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
  // TOTAL SPENDING
  // =========================================

  const totalSpending = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );

  // =========================================
  // MEMBER SUMMARY
  // =========================================

  const memberSummary = members.map(
    (member) => {

      let paid = 0;
      let share = 0;

      expenses.forEach((expense) => {

        const amount =
          Number(expense.amount || 0);

        const paidBy =
          expense.paidBy ||
          currentUser.name;

        const splitBetween =
          expense.splitBetween ||
          [paidBy];

        // Amount this member paid
        if (paidBy === member) {
          paid += amount;
        }

        // Amount this member owes
        if (
          splitBetween.includes(member)
        ) {
          share +=
            amount /
            splitBetween.length;
        }

      });

      const balance =
        paid - share;

      return {
        member,
        paid,
        share,
        balance,
      };
    }
  );

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

          {/* =================================
              HEADER
          ================================= */}

          <div className="groups-header">

            <div>

              <h1>
                👥 Group Spending
              </h1>

              <p>
                {trip.tripName} ·{" "}
                {trip.destination}
              </p>

            </div>

            <div className="group-total">

              <span>
                Total Trip Spending
              </span>

              <strong>
                {formatMoney(totalSpending)}
              </strong>

            </div>

          </div>


          {/* =================================
              MEMBERS
          ================================= */}

          <div className="member-summary-grid">

            {memberSummary.map(
              (person) => (

                <div
                  className="member-summary-card"
                  key={person.member}
                >

                  <div className="member-summary-header">

                    <div className="member-avatar">
                      👤
                    </div>

                    <div>

                      <h2>
                        {person.member}
                      </h2>

                      <span>
                        Trip member
                      </span>

                    </div>

                  </div>


                  <div className="member-stat">

                    <span>
                      💳 Paid
                    </span>

                    <strong>
                      {formatMoney(
                        person.paid
                      )}
                    </strong>

                  </div>


                  <div className="member-stat">

                    <span>
                      📊 Fair Share
                    </span>

                    <strong>
                      {formatMoney(
                        person.share
                      )}
                    </strong>

                  </div>


                  <div
                    className={`member-balance ${
                      person.balance >= 0
                        ? "positive"
                        : "negative"
                    }`}
                  >

                    <span>
                      {person.balance >= 0
                        ? "💰 Gets back"
                        : "💸 Owes"}
                    </span>

                    <strong>
                      {formatMoney(
                        Math.abs(
                          person.balance
                        )
                      )}
                    </strong>

                  </div>

                </div>

              )
            )}

          </div>


          {/* =================================
              EXPENSE HISTORY
          ================================= */}

          <div className="group-expenses">

            <h2>
              🧾 Group Expense History
            </h2>

            {expenses.length === 0 ? (

              <div className="group-empty">

                <div>
                  💰
                </div>

                <h3>
                  No group expenses yet
                </h3>

                <p>
                  Add an expense from the
                  dashboard to see it here.
                </p>

              </div>

            ) : (

              <div className="group-expense-list">

                {expenses
                  .slice()
                  .reverse()
                  .map((expense, index) => {

                    const splitBetween =
                      expense.splitBetween ||
                      [
                        expense.paidBy ||
                          currentUser.name,
                      ];

                    const share =
                      Number(
                        expense.amount || 0
                      ) /
                      splitBetween.length;

                    return (

                      <div
                        className="group-expense-item"
                        key={
                          expense.id ||
                          `${expense.description}-${index}`
                        }
                      >

                        <div className="expense-category-icon">

                          {expense.category ===
                          "Food"
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
                            : "💳"}

                        </div>


                        <div className="group-expense-info">

                          <strong>
                            {expense.description}
                          </strong>

                          <span>
                            {expense.category}
                          </span>

                          <small>
                            Paid by{" "}
                            {expense.paidBy ||
                              currentUser.name}
                            {" · "}
                            {splitBetween.length}{" "}
                            people
                          </small>

                        </div>


                        <div className="group-expense-amount">

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

export default Groups;