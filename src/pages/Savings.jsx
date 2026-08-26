import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Savings() {

  // =========================================
  // CURRENT USER
  // =========================================

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const userId = currentUser?.id || "guest";


  // =========================================
  // SAVINGS DATA
  // =========================================

  const [goalName, setGoalName] = useState(() => {
    return (
      localStorage.getItem(
        `savingsGoalName_${userId}`
      ) || ""
    );
  });

  const [targetAmount, setTargetAmount] = useState(() => {
    return (
      Number(
        localStorage.getItem(
          `savingsTarget_${userId}`
        )
      ) || 0
    );
  });

  const [savedAmount, setSavedAmount] = useState(() => {
    return (
      Number(
        localStorage.getItem(
          `savingsSaved_${userId}`
        )
      ) || 0
    );
  });

  const [amountToAdd, setAmountToAdd] =
    useState("");


  // =========================================
  // SAVE DATA
  // =========================================

  useEffect(() => {

    localStorage.setItem(
      `savingsGoalName_${userId}`,
      goalName
    );

    localStorage.setItem(
      `savingsTarget_${userId}`,
      targetAmount
    );

    localStorage.setItem(
      `savingsSaved_${userId}`,
      savedAmount
    );

  }, [
    goalName,
    targetAmount,
    savedAmount,
    userId,
  ]);


  // =========================================
  // ADD SAVINGS
  // =========================================

  function addSavings(event) {

    event.preventDefault();

    const amount = Number(amountToAdd);

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setSavedAmount(
      (currentAmount) =>
        currentAmount + amount
    );

    setAmountToAdd("");
  }


  // =========================================
  // CALCULATIONS
  // =========================================

  const remainingAmount = Math.max(
    targetAmount - savedAmount,
    0
  );

  const percentage =
    targetAmount > 0
      ? Math.min(
          (savedAmount / targetAmount) * 100,
          100
        )
      : 0;


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
  // RESET
  // =========================================

  function resetGoal() {

    const confirmReset =
      window.confirm(
        "Are you sure you want to reset your savings goal?"
      );

    if (!confirmReset) {
      return;
    }

    setGoalName("");
    setTargetAmount(0);
    setSavedAmount(0);
    setAmountToAdd("");
  }


  // =========================================
  // PAGE
  // =========================================

  return (

    <div>

      <Navbar />

      <div className="app-layout">

        <Sidebar />

        <main className="main-content savings-page">


          {/* =================================
              HEADER
          ================================= */}

          <div className="modern-page-header">

            <div>

              <p className="page-eyebrow">
                FINANCIAL GOALS
              </p>

              <h1>
                🎯 Savings
              </h1>

              <p>
                Turn your travel dreams into
                achievable savings goals.
              </p>

            </div>

            <div className="savings-decoration">
              🐷💰
            </div>

          </div>


          {/* =================================
              TOP GRID
          ================================= */}

          <div className="savings-top-grid">


            {/* =================================
                GOAL CARD
            ================================= */}

            <div className="modern-card savings-goal-card">

              <div className="card-title-row">

                <div>

                  <span className="card-kicker">
                    🎯 YOUR SAVINGS GOAL
                  </span>

                  <h2>
                    {goalName ||
                      "My Savings Goal"}
                  </h2>

                  <p>
                    Make your next trip happen!
                  </p>

                </div>

                <button
                  className="small-outline-button"
                  type="button"
                  onClick={() => {
                    document
                      .querySelector(
                        ".savings-goal-input"
                      )
                      ?.focus();
                  }}
                >
                  Edit Goal
                </button>

              </div>


              <div className="savings-goal-content">


                {/* CIRCLE */}

                <div
                  className="savings-circle"
                  style={{
                    "--progress":
                      `${percentage}%`,
                  }}
                >

                  <div className="savings-circle-inner">

                    <strong>
                      {percentage.toFixed(0)}%
                    </strong>

                    <span>
                      goal completed
                    </span>

                  </div>

                </div>


                {/* VALUES */}

                <div className="savings-values">

                  <div>

                    <span>
                      💵 Saved Amount
                    </span>

                    <strong className="saved-value">
                      {formatMoney(
                        savedAmount
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      🎯 Target Amount
                    </span>

                    <strong>
                      {formatMoney(
                        targetAmount
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      📌 Remaining Amount
                    </span>

                    <strong className="remaining-value">
                      {formatMoney(
                        remainingAmount
                      )}
                    </strong>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================
                ADD MONEY
            ================================= */}

            <div className="savings-right-column">

              <div className="modern-card add-money-card">

                <div className="card-title-row">

                  <div>

                    <span className="card-kicker">
                      💰 KEEP GOING
                    </span>

                    <h2>
                      Add Money
                    </h2>

                    <p>
                      Add money whenever you
                      save towards your goal.
                    </p>

                  </div>

                  <div className="money-icon">
                    💵
                  </div>

                </div>


                <form
                  className="modern-add-form"
                  onSubmit={addSavings}
                >

                  <div className="money-input">

                    <span>
                      ₹
                    </span>

                    <input
                      type="number"
                      min="1"
                      placeholder="Enter amount"
                      value={amountToAdd}
                      onChange={(event) =>
                        setAmountToAdd(
                          event.target.value
                        )
                      }
                    />

                  </div>

                  <button type="submit">
                    Add Savings
                  </button>

                </form>

              </div>


              {/* QUICK OVERVIEW */}

              <div className="modern-card">

                <div className="card-section-title">
                  📊 Quick Overview
                </div>

                <div className="quick-overview-grid">

                  <div className="overview-box green">

                    <span>
                      🌱 Saved
                    </span>

                    <strong>
                      {formatMoney(
                        savedAmount
                      )}
                    </strong>

                  </div>


                  <div className="overview-box blue">

                    <span>
                      🎯 Target
                    </span>

                    <strong>
                      {formatMoney(
                        targetAmount
                      )}
                    </strong>

                  </div>


                  <div className="overview-box orange">

                    <span>
                      📌 Remaining
                    </span>

                    <strong>
                      {formatMoney(
                        remainingAmount
                      )}
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* =================================
              GOAL SETUP
          ================================= */}

          <div className="modern-card">

            <div className="card-section-title">
              ⚙️ Goal Settings
            </div>

            <div className="savings-settings">

              <div>

                <label>
                  Goal name
                </label>

                <input
                  className="savings-goal-input"
                  type="text"
                  placeholder="e.g. Goa Trip"
                  value={goalName}
                  onChange={(event) =>
                    setGoalName(
                      event.target.value
                    )
                  }
                />

              </div>


              <div>

                <label>
                  Target amount
                </label>

                <div className="money-input">

                  <span>
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    placeholder="Target amount"
                    value={
                      targetAmount || ""
                    }
                    onChange={(event) =>
                      setTargetAmount(
                        Number(
                          event.target.value
                        )
                      )
                    }
                  />

                </div>

              </div>

            </div>

          </div>


          {/* =================================
              PROGRESS OVERVIEW
          ================================= */}

          <div className="modern-card progress-overview-card">

            <div className="progress-header">

              <div>

                <div className="card-section-title">
                  📈 Progress Overview
                </div>

                <p>
                  {percentage >= 100
                    ? "You've reached your savings goal! 🎉"
                    : percentage >= 75
                    ? "You're almost there! Keep going!"
                    : percentage >= 50
                    ? "You're halfway there! 💪"
                    : "Every little bit gets you closer."}
                </p>

              </div>

              <strong>
                {percentage.toFixed(0)}%
              </strong>

            </div>


            <div className="large-progress">

              <div
                className="large-progress-fill"
                style={{
                  width:
                    `${percentage}%`,
                }}
              />

            </div>


            <div className="progress-labels">

              <span>
                0%
              </span>

              <span>
                25%
              </span>

              <span>
                50%
              </span>

              <span>
                75%
              </span>

              <span>
                100%
              </span>

            </div>

          </div>


          {/* =================================
              COMPLETE
          ================================= */}

          {targetAmount > 0 &&
            savedAmount >= targetAmount && (

            <div className="savings-complete-modern">

              <div className="complete-icon">
                🏆
              </div>

              <div>

                <h2>
                  Goal Achieved!
                </h2>

                <p>
                  Congratulations! You reached
                  your savings goal.
                </p>

              </div>

            </div>

          )}


          {/* =================================
              RESET
          ================================= */}

          {(goalName ||
            targetAmount > 0 ||
            savedAmount > 0) && (

            <button
              className="reset-savings-modern"
              type="button"
              onClick={resetGoal}
            >
              Reset Savings Goal
            </button>

          )}

        </main>

      </div>

    </div>

  );
}

export default Savings;