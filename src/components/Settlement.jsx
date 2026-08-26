function Settlement({ expenses }) {
  // =========================================
  // GET MEMBERS
  // =========================================

  const savedMembers =
    localStorage.getItem("tripMembers");

  const members = savedMembers
    ? JSON.parse(savedMembers)
    : ["Tanisha"];


  // =========================================
  // CALCULATE BALANCES
  // =========================================

  const balances = {};

  // Start everyone at ₹0
  members.forEach((member) => {
    balances[member] = 0;
  });


  // Go through every expense
  expenses.forEach((expense) => {
    const amount = Number(expense.amount || 0);

    const paidBy = expense.paidBy || "Tanisha";

    const splitBetween =
      expense.splitBetween || [paidBy];


    // Make sure payer exists
    if (balances[paidBy] === undefined) {
      balances[paidBy] = 0;
    }


    // Payer gets credit for the amount they paid
    balances[paidBy] += amount;


    // Everyone in the split owes their share
    const share =
      amount / splitBetween.length;


    splitBetween.forEach((member) => {

      if (balances[member] === undefined) {
        balances[member] = 0;
      }

      balances[member] -= share;

    });
  });


  // =========================================
  // CREATE DEBT LIST
  // =========================================

  const creditors = [];
  const debtors = [];


  Object.entries(balances).forEach(
    ([person, balance]) => {

      const roundedBalance =
        Math.round(balance * 100) / 100;


      if (roundedBalance > 0.01) {

        creditors.push({
          person,
          amount: roundedBalance,
        });

      } else if (roundedBalance < -0.01) {

        debtors.push({
          person,
          amount: Math.abs(
            roundedBalance
          ),
        });

      }

    }
  );


  // =========================================
  // CALCULATE SETTLEMENTS
  // =========================================

  const settlements = [];

  let creditorIndex = 0;
  let debtorIndex = 0;


  while (
    creditorIndex < creditors.length &&
    debtorIndex < debtors.length
  ) {

    const creditor =
      creditors[creditorIndex];

    const debtor =
      debtors[debtorIndex];


    const amount = Math.min(
      creditor.amount,
      debtor.amount
    );


    settlements.push({
      from: debtor.person,
      to: creditor.person,
      amount:
        Math.round(amount * 100) / 100,
    });


    creditor.amount -= amount;
    debtor.amount -= amount;


    if (creditor.amount < 0.01) {
      creditorIndex++;
    }


    if (debtor.amount < 0.01) {
      debtorIndex++;
    }

  }


  // =========================================
  // TOTAL SPENDING
  // =========================================

  const totalSpent = expenses.reduce(
    (total, expense) =>
      total + Number(expense.amount || 0),
    0
  );


  // =========================================
  // UI
  // =========================================

  return (
    <div className="settlement-card">

      <div className="settlement-header">

        <div>

          <h2>
            💸 Settlement
          </h2>

          <p>
            See who owes whom
          </p>

        </div>

        <strong>
          ₹
          {totalSpent.toLocaleString(
            "en-IN"
          )}
        </strong>

      </div>


      {/* =====================================
          NO EXPENSES
      ====================================== */}

      {expenses.length === 0 ? (

        <div className="settlement-empty">

          <div className="settlement-empty-icon">
            💰
          </div>

          <h3>
            No settlements yet
          </h3>

          <p>
            Add a shared expense to see
            who needs to pay whom.
          </p>

        </div>

      ) : settlements.length === 0 ? (

        /* ===================================
           EVERYONE BALANCED
        ==================================== */

        <div className="settlement-balanced">

          <div>
            ✓
          </div>

          <h3>
            Everyone is settled!
          </h3>

          <p>
            No one currently owes anyone
            money.
          </p>

        </div>

      ) : (

        /* ===================================
           SETTLEMENTS
        ==================================== */

        <div className="settlement-list">

          {settlements.map(
            (settlement, index) => (

              <div
                className="settlement-item"
                key={index}
              >

                <div className="settlement-person">

                  <div className="person-avatar">
                    👤
                  </div>

                  <div>

                    <strong>
                      {settlement.from}
                    </strong>

                    <span>
                      owes
                    </span>

                  </div>

                </div>


                <div className="settlement-arrow">
                  →
                </div>


                <div className="settlement-person">

                  <div className="person-avatar">
                    👤
                  </div>

                  <div>

                    <strong>
                      {settlement.to}
                    </strong>

                  </div>

                </div>


                <div className="settlement-amount">

                  ₹
                  {settlement.amount.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits:
                        settlement.amount %
                          1 !==
                        0
                          ? 2
                          : 0,
                    }
                  )}

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default Settlement;