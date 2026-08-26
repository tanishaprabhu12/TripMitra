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
      localStorage.getItem(`savingsGoalName_${userId}`) ||
      ""
    );
  });

  const [targetAmount, setTargetAmount] = useState(() => {
    return (
      Number(
        localStorage.getItem(`savingsTarget_${userId}`)
      ) || 0
    );
  });

  const [savedAmount, setSavedAmount] = useState(() => {
    return (
      Number(
        localStorage.getItem(`savingsSaved_${userId}`)
      ) || 0
    );
  });

  const [amountToAdd, setAmountToAdd] = useState("");

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
    return `₹${amount.toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    )}`;
  }

  // =========================================
  // RESET GOAL
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

        <main className="main-content">

          {/* =================================
              HEADER
          ================================= */}

          <div className="page-header">

            <div>

              <h1>
                🎯 Savings
              </h1>

              <p>
                Set a goal and track your
                savings progress.
              </p>

            </div>

          </div>


          {/* =================================
              SET GOAL
          ================================= */}

          <div className="page-card">

            <h2>
              🎯 Create Savings Goal
            </h2>

            <div className="savings-goal-form">

              <input
                type="text"
                placeholder="Goal name e.g. Goa Trip"
                value={goalName}
                onChange={(event) =>
                  setGoalName(
                    event.target.value
                  )
                }
              />

              <input
                type="number"
                min="0"
                placeholder="Target amount ₹"
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


          {/* =================================
              PROGRESS
          ================================= */}

          <div className="page-card">

            <div className="section-heading">

              <div>

                <h2>
                  💰 {goalName || "My Savings Goal"}
                </h2>

                <span>
                  {targetAmount > 0
                    ? `${formatMoney(
                        savedAmount
                      )} saved of ${formatMoney(
                        targetAmount
                      )}`
                    : "Set a target amount to start tracking."}
                </span>

              </div>

              <strong>
                {percentage.toFixed(0)}%
              </strong>

            </div>


            {/* Progress bar */}

            <div className="savings-progress">

              <div
                className="savings-progress-bar"
                style={{
                  width: `${percentage}%`,
                }}
              />

            </div>


            {/* Statistics */}

            <div className="savings-stats">

              <div className="savings-stat">

                <span>
                  💵 Saved
                </span>

                <strong>
                  {formatMoney(
                    savedAmount
                  )}
                </strong>

              </div>


              <div className="savings-stat">

                <span>
                  🎯 Target
                </span>

                <strong>
                  {formatMoney(
                    targetAmount
                  )}
                </strong>

              </div>


              <div className="savings-stat">

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


          {/* =================================
              ADD SAVINGS
          ================================= */}

          <div className="page-card">

            <h2>
              ➕ Add Money
            </h2>

            <p>
              Add money whenever you save
              towards your goal.
            </p>

            <form
              className="savings-add-form"
              onSubmit={addSavings}
            >

              <input
                type="number"
                min="1"
                placeholder="Amount ₹"
                value={amountToAdd}
                onChange={(event) =>
                  setAmountToAdd(
                    event.target.value
                  )
                }
              />

              <button type="submit">
                Add Savings 💰
              </button>

            </form>

          </div>


          {/* =================================
              GOAL COMPLETE
          ================================= */}

          {targetAmount > 0 &&
            savedAmount >= targetAmount && (

            <div className="savings-complete">

              <div>
                🏆
              </div>

              <h2>
                Goal Achieved!
              </h2>

              <p>
                Congratulations! You reached
                your savings goal.
              </p>

            </div>

          )}


          {/* =================================
              RESET
          ================================= */}

          {(goalName ||
            targetAmount > 0 ||
            savedAmount > 0) && (

            <button
              className="reset-savings"
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