import { useEffect, useState } from "react";

function ExpenseForm({ expenses, setExpenses }) {

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
  // MEMBERS KEY
  // =========================================

  const membersKey = currentUser
    ? `tripMembers_${currentUser.id}`
    : "tripMembers";


  // =========================================
  // MEMBERS
  // =========================================

  const [members, setMembers] = useState(() => {

    const savedMembers =
      localStorage.getItem(membersKey);

    return savedMembers
      ? JSON.parse(savedMembers)
      : [currentUserName];

  });


  // =========================================
  // FORM STATE
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
  // UPDATE MEMBERS WHEN TRIP MEMBERS CHANGE
  // =========================================

  useEffect(() => {

    function updateMembers() {

      const savedMembers =
        localStorage.getItem(membersKey);

      const updatedMembers =
        savedMembers
          ? JSON.parse(savedMembers)
          : [currentUserName];

      setMembers(updatedMembers);

      // Make sure paidBy is still valid
      setPaidBy((currentPaidBy) => {

        if (
          updatedMembers.includes(
            currentPaidBy
          )
        ) {
          return currentPaidBy;
        }

        return updatedMembers[0] ||
          currentUserName;

      });

      // Keep only members who still exist
      setSplitBetween((currentSplit) => {

        const validMembers =
          currentSplit.filter((member) =>
            updatedMembers.includes(member)
          );

        if (validMembers.length > 0) {
          return validMembers;
        }

        return updatedMembers.length > 0
          ? [updatedMembers[0]]
          : [];
      });
    }

    window.addEventListener(
      "tripMembersUpdated",
      updateMembers
    );

    return () => {
      window.removeEventListener(
        "tripMembersUpdated",
        updateMembers
      );
    };

  }, [membersKey, currentUserName]);


  // =========================================
  // SELECT / UNSELECT MEMBER
  // =========================================

  function toggleMember(member) {

    setSplitBetween((currentMembers) => {

      if (
        currentMembers.includes(member)
      ) {

        // Don't allow the last person
        // to be removed
        if (currentMembers.length === 1) {
          alert(
            "At least one person must be selected."
          );

          return currentMembers;
        }

        return currentMembers.filter(
          (item) => item !== member
        );
      }

      return [
        ...currentMembers,
        member,
      ];

    });

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


    if (
      numericAmount <= 0
    ) {

      alert(
        "Amount must be greater than ₹0."
      );

      return;
    }


    // =========================================
    // CALCULATE SHARE
    // =========================================

    const sharePerPerson =
      numericAmount /
      splitBetween.length;


    // =========================================
    // CREATE EXPENSE
    // =========================================

    const expense = {

      id: Date.now(),

      amount:
        numericAmount,

      category,

      description,

      paidBy,

      splitBetween: [
        ...splitBetween,
      ],

      sharePerPerson,

    };


    // =========================================
    // SAVE EXPENSE
    // =========================================

    setExpenses(
      (currentExpenses) => [
        ...currentExpenses,
        expense,
      ]
    );


    // =========================================
    // RESET FORM
    // =========================================

    setAmount("");

    setCategory("");

    setDescription("");

    setPaidBy(
      currentUserName
    );

    setSplitBetween([
      currentUserName,
    ]);

  }


  // =========================================
  // FORMAT MONEY
  // =========================================

  function formatMoney(amount) {

    return Number(amount).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    );

  }


  // =========================================
  // RENDER
  // =========================================

  return (

    <div className="expense-form">

      <h2>
        💸 Add Trip Expense
      </h2>


      <form
        onSubmit={handleSubmit}
      >


        {/* =================================
            AMOUNT
        ================================= */}

        <input
          type="number"
          placeholder="Amount (₹)"
          min="1"
          value={amount}
          onChange={(event) =>
            setAmount(
              event.target.value
            )
          }
        />


        {/* =================================
            CATEGORY
        ================================= */}

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

          <option value="Accommodation">
            🏨 Accommodation
          </option>

          <option value="Food">
            🍴 Food
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
            📦 Other
          </option>

        </select>


        {/* =================================
            DESCRIPTION
        ================================= */}

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value
            )
          }
        />


        {/* =================================
            WHO PAID
        ================================= */}

        <label>
          💳 Paid by
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


        {/* =================================
            SPLIT BETWEEN
        ================================= */}

        <div className="split-section">

          <h3>
            👥 Split between
          </h3>

          <p>
            Select everyone who should share
            this expense.
          </p>


          {members.map(
            (member) => (

              <label
                className="split-member"
                key={member}
              >

                <input
                  type="checkbox"
                  checked={
                    splitBetween.includes(
                      member
                    )
                  }
                  onChange={() =>
                    toggleMember(
                      member
                    )
                  }
                />

                <span>
                  {member}

                  {member ===
                    currentUserName && (
                    <small>
                      {" "} (You)
                    </small>
                  )}
                </span>

              </label>

            )
          )}

        </div>


        {/* =================================
            SPLIT PREVIEW
        ================================= */}

        {amount &&
          splitBetween.length > 0 && (

          <div className="split-preview">

            <strong>
              Each person pays:
            </strong>

            <span>
              ₹
              {formatMoney(
                Number(amount) /
                  splitBetween.length
              )}
            </span>

          </div>

        )}


        {/* =================================
            SUBMIT
        ================================= */}

        <button type="submit">
          Add Expense 💸
        </button>

      </form>


      {/* =====================================
          RECENT EXPENSES
      ====================================== */}

      <div className="expense-list">

        <h2>
          Recent Expenses
        </h2>


        {expenses.length === 0 ? (

          <p>
            No expenses yet. Add your first
            trip expense!
          </p>

        ) : (

          expenses
            .slice()
            .reverse()
            .map(
              (expense) => {

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
                    className="expense-item"
                    key={expense.id}
                  >

                    <div>

                      <strong>
                        {expense.category}
                      </strong>

                      <p>
                        {expense.description}
                      </p>

                      <small>
                        💳 Paid by{" "}
                        {expense.paidBy ||
                          currentUserName}
                      </small>

                      <small>
                        {" "}· 👥 Split between{" "}
                        {splitMembers.join(
                          ", "
                        )}
                      </small>

                    </div>


                    <div>

                      <strong>
                        ₹
                        {formatMoney(
                          expense.amount
                        )}
                      </strong>

                      <small>
                        ₹
                        {formatMoney(
                          share
                        )}{" "}
                        each
                      </small>

                    </div>

                  </div>

                );

              }
            )

        )}

      </div>

    </div>

  );

}

export default ExpenseForm;