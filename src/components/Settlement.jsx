import { useMemo } from "react";

function Settlement({ expenses }) {
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
  // USER-SPECIFIC MEMBERS
  // =========================================

  const membersKey = currentUser
    ? `tripMembers_${currentUser.id}`
    : "tripMembers";

  const savedMembers =
    localStorage.getItem(membersKey);

  const members = savedMembers
    ? JSON.parse(savedMembers)
    : [currentUserName];


  // =========================================
  // CALCULATE BALANCES
  // =========================================

  const balances = useMemo(() => {
    const result = {};

    // Start everyone at ₹0
    members.forEach((member) => {
      result[member] = 0;
    });


    // Process each expense
    expenses.forEach((expense) => {
      const amount =
        Number(expense.amount || 0);

      const paidBy =
        expense.paidBy ||
        currentUserName;

      const splitBetween =
        Array.isArray(
          expense.splitBetween
        ) &&
        expense.splitBetween.length > 0
          ? expense.splitBetween
          : [paidBy];


      // Make sure payer exists
      if (
        result[paidBy] === undefined
      ) {
        result[paidBy] = 0;
      }


      // Credit the person who paid
      result[paidBy] += amount;


      // Divide expense among participants
      const share =
        amount /
        splitBetween.length;


      splitBetween.forEach((member) => {

        if (
          result[member] === undefined
        ) {
          result[member] = 0;
        }

        result[member] -= share;

      });
    });


    return result;
  }, [
    expenses,
    members,
    currentUserName,
  ]);


  // =========================================
  // CREATE CREDITORS + DEBTORS
  // =========================================

  const { creditors, debtors } =
    useMemo(() => {

      const creditorsList = [];
      const debtorsList = [];


      Object.entries(balances).forEach(
        ([person, balance]) => {

          const rounded =
            Math.round(
              balance * 100
            ) / 100;


          if (rounded > 0.01) {

            creditorsList.push({
              person,
              amount: rounded,
            });

          } else if (rounded < -0.01) {

            debtorsList.push({
              person,
              amount: Math.abs(
                rounded
              ),
            });

          }

        }
      );


      return {
        creditors: creditorsList,
        debtors: debtorsList,
      };

    }, [balances]);


  // =========================================
  // GENERATE SETTLEMENTS
  // =========================================

  const settlements =
    useMemo(() => {

      const creditorsCopy =
        creditors.map(
          (item) => ({
            ...item,
          })
        );

      const debtorsCopy =
        debtors.map(
          (item) => ({
            ...item,
          })
        );


      const result = [];

      let creditorIndex = 0;
      let debtorIndex = 0;


      while (
        creditorIndex <
          creditorsCopy.length &&
        debtorIndex <
          debtorsCopy.length
      ) {

        const creditor =
          creditorsCopy[
            creditorIndex
          ];

        const debtor =
          debtorsCopy[
            debtorIndex
          ];


        const amount = Math.min(
          creditor.amount,
          debtor.amount
        );


        result.push({
          from: debtor.person,
          to: creditor.person,
          amount:
            Math.round(
              amount * 100
            ) / 100,
        });


        creditor.amount -= amount;
        debtor.amount -= amount;


        if (
          creditor.amount <
          0.01
        ) {
          creditorIndex++;
        }


        if (
          debtor.amount <
          0.01
        ) {
          debtorIndex++;
        }

      }


      return result;

    }, [creditors, debtors]);


  // =========================================
  // TOTAL SPENDING
  // =========================================

  const totalSpent =
    expenses.reduce(
      (total, expense) =>
        total +
        Number(
          expense.amount || 0
        ),
      0
    );


  // =========================================
  // FORMAT MONEY
  // =========================================

  function formatMoney(amount) {
    return `₹${Number(
      amount
    ).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits:
          amount % 1 !== 0
            ? 2
            : 0,
        maximumFractionDigits: 2,
      }
    )}`;
  }


  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="settlement-card">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="settlement-header">

        <div>

          <h2>
            💸 Who Pays Whom?
          </h2>

          <p>
            TripMitra simplifies your
            group settlements.
          </p>

        </div>


        <strong>
          {formatMoney(
            totalSpent
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
           BALANCED
        ==================================== */

        <div className="settlement-balanced">

          <div>
            ✓
          </div>

          <h3>
            Everyone is settled!
          </h3>

          <p>
            No one currently owes
            anyone money.
          </p>

        </div>

      ) : (

        /* ===================================
           SETTLEMENT LIST
        ==================================== */

        <div>

          <div className="settlement-summary">

            <span>
              {settlements.length}{" "}
              {settlements.length === 1
                ? "payment"
                : "payments"}{" "}
              needed
            </span>

          </div>


          <div className="settlement-list">

            {settlements.map(
              (
                settlement,
                index
              ) => (

                <div
                  className="settlement-item"
                  key={`${settlement.from}-${settlement.to}-${index}`}
                >

                  {/* FROM */}

                  <div className="settlement-person">

                    <div className="person-avatar">
                      👤
                    </div>

                    <div>

                      <strong>
                        {settlement.from}
                      </strong>

                      <span>
                        pays
                      </span>

                    </div>

                  </div>


                  {/* ARROW */}

                  <div className="settlement-arrow">
                    →
                  </div>


                  {/* TO */}

                  <div className="settlement-person">

                    <div className="person-avatar">
                      👤
                    </div>

                    <div>

                      <strong>
                        {settlement.to}
                      </strong>

                      <span>
                        receives
                      </span>

                    </div>

                  </div>


                  {/* AMOUNT */}

                  <div className="settlement-amount">

                    {formatMoney(
                      settlement.amount
                    )}

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default Settlement;