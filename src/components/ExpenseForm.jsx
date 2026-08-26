import { useState } from "react";

function ExpenseForm({ expenses, setExpenses }) {
  // =========================================
  // FORM STATE
  // =========================================

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [paidBy, setPaidBy] = useState("Tanisha");

  const [splitBetween, setSplitBetween] = useState([
    "Tanisha",
  ]);


  // =========================================
  // TRIP MEMBERS
  // =========================================

  const savedMembers =
    localStorage.getItem("tripMembers");

  const members = savedMembers
    ? JSON.parse(savedMembers)
    : ["Tanisha"];


  // =========================================
  // SELECT / UNSELECT MEMBER
  // =========================================

  function toggleMember(member) {
    setSplitBetween((currentMembers) => {

      if (currentMembers.includes(member)) {
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
      alert("Please fill in all the fields.");
      return;
    }

    if (splitBetween.length === 0) {
      alert(
        "Please select at least one person to split the expense."
      );

      return;
    }


    const numericAmount =
      Number(amount);


    // Calculate each person's share
    const sharePerPerson =
      numericAmount /
      splitBetween.length;


    const expense = {
      id: Date.now(),

      amount: numericAmount,

      category,

      description,

      paidBy,

      splitBetween,

      sharePerPerson,
    };


    setExpenses((currentExpenses) => [
      ...currentExpenses,
      expense,
    ]);


    // Clear form
    setAmount("");
    setCategory("");
    setDescription("");

    setPaidBy("Tanisha");

    setSplitBetween([
      "Tanisha",
    ]);
  }


  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="expense-form">

      <h2>
        💸 Add Trip Expense
      </h2>


      <form onSubmit={handleSubmit}>

        {/* Amount */}

        <input
          type="number"
          placeholder="Amount (₹)"
          min="0"
          value={amount}
          onChange={(event) =>
            setAmount(event.target.value)
          }
        />


        {/* Category */}

        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
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


        {/* Description */}

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
        />


        {/* Who paid */}

        <label>
          Paid by
        </label>

        <select
          value={paidBy}
          onChange={(event) =>
            setPaidBy(event.target.value)
          }
        >

          {members.map((member) => (
            <option
              key={member}
              value={member}
            >
              {member}
            </option>
          ))}

        </select>


        {/* Split between */}

        <div className="split-section">

          <h3>
            Split between
          </h3>

          {members.map((member) => (

            <label
              className="split-member"
              key={member}
            >

              <input
                type="checkbox"
                checked={splitBetween.includes(
                  member
                )}
                onChange={() =>
                  toggleMember(member)
                }
              />

              <span>
                {member}
              </span>

            </label>

          ))}

        </div>


        {/* Preview */}

        {amount &&
          splitBetween.length > 0 && (

          <div className="split-preview">

            <strong>
              Each person pays:
            </strong>

            <span>
              ₹
              {(
                Number(amount) /
                splitBetween.length
              ).toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 2,
                }
              )}
            </span>

          </div>

        )}


        {/* Submit */}

        <button type="submit">
          Add Expense
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

          expenses.map((expense) => (

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
  Paid by {expense.paidBy || "Tanisha"}
</small>

<small>
  {" "}· Split between{" "}
  {(expense.splitBetween || [expense.paidBy || "Tanisha"]).join(", ")}
</small>

              </div>


              <div>

                <strong>
                  ₹
                  {expense.amount.toLocaleString(
                    "en-IN"
                  )}
                </strong>

                <small>
                  
                  ₹
{(
  expense.sharePerPerson ||
  Number(expense.amount || 0)
).toLocaleString(
  "en-IN",
  {
    maximumFractionDigits: 2,
  }
)}{" "}
each
                </small>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default ExpenseForm;