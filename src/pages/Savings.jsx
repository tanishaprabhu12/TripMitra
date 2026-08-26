import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Savings() {

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const storageKey = currentUser
    ? `tripSavings_${currentUser.id}`
    : "tripSavings";


  const [goal, setGoal] = useState(() => {

    const saved = localStorage.getItem(storageKey);

    return saved
      ? JSON.parse(saved)
      : {
          target: 0,
          saved: 0,
        };
  });


  useEffect(() => {

    localStorage.setItem(
      storageKey,
      JSON.stringify(goal)
    );

  }, [goal, storageKey]);


  const [targetInput, setTargetInput] =
    useState("");

  const [savedInput, setSavedInput] =
    useState("");


  function updateGoal(event) {

    event.preventDefault();

    if (!targetInput) {
      alert("Please enter a savings goal.");
      return;
    }

    setGoal({
      target: Number(targetInput),
      saved: Number(savedInput) || 0,
    });

    setTargetInput("");
    setSavedInput("");
  }


  const percentage =
    goal.target > 0
      ? Math.min(
          (goal.saved / goal.target) * 100,
          100
        )
      : 0;


  function formatMoney(amount) {

    return `₹${amount.toLocaleString(
      "en-IN"
    )}`;
  }


  return (
    <div>

      <Navbar />

      <div className="app-layout">

        <Sidebar />

        <main className="main-content">

          <div className="page-header">

            <div>
              <h1>🎯 Savings</h1>

              <p>
                Set a goal and save towards your next adventure.
              </p>
            </div>

          </div>


          {/* SAVINGS OVERVIEW */}

          <div className="cards">

            <div className="dashboard-card">

              <h3>
                Savings Goal
              </h3>

              <strong>
                {formatMoney(goal.target)}
              </strong>

            </div>


            <div className="dashboard-card">

              <h3>
                Amount Saved
              </h3>

              <strong>
                {formatMoney(goal.saved)}
              </strong>

            </div>


            <div className="dashboard-card">

              <h3>
                Remaining
              </h3>

              <strong>
                {formatMoney(
                  Math.max(
                    goal.target - goal.saved,
                    0
                  )
                )}
              </strong>

            </div>

          </div>


          {/* PROGRESS */}

          <div className="page-card">

            <h2>
              🚀 Savings Progress
            </h2>

            <p>
              {percentage.toFixed(0)}% of your goal completed.
            </p>

            <div className="budget-progress">

              <div
                className="budget-progress-bar"
                style={{
                  width: `${percentage}%`,
                }}
              />

            </div>

          </div>


          {/* SET GOAL */}

          <div className="page-card">

            <h2>
              ✨ Set Savings Goal
            </h2>

            <form
              className="expense-page-form"
              onSubmit={updateGoal}
            >

              <input
                type="number"
                placeholder="Savings target ₹"
                value={targetInput}
                onChange={(event) =>
                  setTargetInput(
                    event.target.value
                  )
                }
              />

              <input
                type="number"
                placeholder="Already saved ₹"
                value={savedInput}
                onChange={(event) =>
                  setSavedInput(
                    event.target.value
                  )
                }
              />

              <button type="submit">
                Save Goal
              </button>

            </form>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Savings;