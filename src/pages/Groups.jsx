import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Settlement from "../components/Settlement";

function Groups() {

  // =========================================
  // CURRENT USER
  // =========================================

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const userId = currentUser?.id || "guest";

  const currentUserName =
    currentUser?.name ||
    currentUser?.fullName ||
    "Traveler";


  // =========================================
  // STORAGE KEYS
  // =========================================

  const membersKey = currentUser
    ? `tripMembers_${currentUser.id}`
    : "tripMembers";

  const expensesKey = currentUser
    ? `tripExpenses_${currentUser.id}`
    : "tripExpenses";


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


  const [newMember, setNewMember] =
    useState("");


  // =========================================
  // EXPENSES
  // =========================================

  const [expenses, setExpenses] =
    useState(() => {

      const savedExpenses =
        localStorage.getItem(expensesKey);

      return savedExpenses
        ? JSON.parse(savedExpenses)
        : [];

    });


  // =========================================
  // SAVE MEMBERS
  // =========================================

  useEffect(() => {

    localStorage.setItem(
      membersKey,
      JSON.stringify(members)
    );

  }, [members, membersKey]);


  // =========================================
  // LOAD EXPENSES
  // =========================================

  useEffect(() => {

    function updateExpenses() {

      const savedExpenses =
        localStorage.getItem(
          expensesKey
        );

      setExpenses(
        savedExpenses
          ? JSON.parse(savedExpenses)
          : []
      );

    }

    updateExpenses();

    window.addEventListener(
      "storage",
      updateExpenses
    );

    window.addEventListener(
      "tripExpensesUpdated",
      updateExpenses
    );

    return () => {

      window.removeEventListener(
        "storage",
        updateExpenses
      );

      window.removeEventListener(
        "tripExpensesUpdated",
        updateExpenses
      );

    };

  }, [expensesKey]);


  // =========================================
  // ADD MEMBER
  // =========================================

  function addMember(event) {

    event.preventDefault();

    const memberName =
      newMember.trim();


    // Empty name

    if (!memberName) {

      alert(
        "Please enter a member name."
      );

      return;

    }


    // Duplicate name

    const alreadyExists =
      members.some(
        (member) =>
          member.toLowerCase() ===
          memberName.toLowerCase()
      );


    if (alreadyExists) {

      alert(
        "This member is already in the trip."
      );

      return;

    }


    // Add member

    const updatedMembers = [
      ...members,
      memberName,
    ];


    setMembers(
      updatedMembers
    );


    localStorage.setItem(
      membersKey,
      JSON.stringify(
        updatedMembers
      )
    );


    // Tell Expenses to update

    window.dispatchEvent(
      new Event(
        "tripMembersUpdated"
      )
    );


    setNewMember("");

  }


  // =========================================
  // REMOVE MEMBER
  // =========================================

  function removeMember(
    memberToRemove
  ) {

    // Don't remove yourself

    if (
      memberToRemove ===
      currentUserName
    ) {

      alert(
        "You cannot remove yourself from the trip."
      );

      return;

    }


    const confirmed =
      window.confirm(
        `Remove ${memberToRemove} from the trip?`
      );


    if (!confirmed) {
      return;
    }


    const updatedMembers =
      members.filter(
        (member) =>
          member !==
          memberToRemove
      );


    setMembers(
      updatedMembers
    );


    localStorage.setItem(
      membersKey,
      JSON.stringify(
        updatedMembers
      )
    );


    // Tell Expenses to update

    window.dispatchEvent(
      new Event(
        "tripMembersUpdated"
      )
    );

  }


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

          <div className="modern-page-header">

            <div>

              <p className="page-eyebrow">
                GROUP TRAVEL
              </p>

              <h1>
                👥 Trip Group
              </h1>

              <p>
                Manage your travel companions
                and keep shared expenses organized.
              </p>

            </div>


            <div className="groups-decoration">
              👥✨
            </div>

          </div>


          {/* =================================
              GROUP OVERVIEW
          ================================= */}

          <div className="group-stat-grid">


            <div className="group-stat-card purple">

              <div className="group-stat-icon">
                👥
              </div>

              <span>
                Trip Members
              </span>

              <strong>
                {members.length}
              </strong>

              <small>
                people in your group
              </small>

            </div>


            <div className="group-stat-card green">

              <div className="group-stat-icon">
                💸
              </div>

              <span>
                Shared Spending
              </span>

              <strong>
                ₹
                {totalSpent.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 2,
                  }
                )}
              </strong>

              <small>
                total recorded expenses
              </small>

            </div>


            <div className="group-stat-card blue">

              <div className="group-stat-icon">
                🧾
              </div>

              <span>
                Shared Expenses
              </span>

              <strong>
                {expenses.length}
              </strong>

              <small>
                expenses recorded
              </small>

            </div>

          </div>


          {/* =================================
              MEMBERS CARD
          ================================= */}

          <div className="modern-card group-members-card">


            <div className="card-title-row">

              <div>

                <span className="card-kicker">
                  👥 TRAVEL COMPANIONS
                </span>

                <h2>
                  Trip Members
                </h2>

                <p>
                  Add everyone traveling with
                  you on this trip.
                </p>

              </div>


              <div className="members-count">

                {members.length}

                <span>
                  {members.length === 1
                    ? " member"
                    : " members"}
                </span>

              </div>

            </div>


            {/* =================================
                MEMBER LIST
            ================================= */}

            <div className="modern-group-member-list">

              {members.map(
                (member) => (

                  <div
                    className="modern-group-member"
                    key={member}
                  >


                    <div className="group-member-avatar">
                      👤
                    </div>


                    <div className="group-member-info">

                      <strong>
                        {member}
                      </strong>

                      {member ===
                        currentUserName && (

                        <span>
                          You
                        </span>

                      )}

                    </div>


                    {member !==
                      currentUserName && (

                      <button
                        type="button"
                        className="modern-remove-member"
                        onClick={() =>
                          removeMember(
                            member
                          )
                        }
                        title={`Remove ${member}`}
                      >
                        ×
                      </button>

                    )}

                  </div>

                )
              )}

            </div>


            {/* =================================
                ADD MEMBER
            ================================= */}

            <form
              className="modern-add-member-form"
              onSubmit={addMember}
            >

              <input
                type="text"
                placeholder="Enter friend's name"
                value={newMember}
                onChange={(event) =>
                  setNewMember(
                    event.target.value
                  )
                }
              />


              <button type="submit">
                + Add Member
              </button>

            </form>


          </div>


          {/* =================================
              INFO
          ================================= */}

          <div className="group-info-banner">

            <div className="group-info-icon">
              💡
            </div>

            <div>

              <strong>
                How group expenses work
              </strong>

              <p>
                Add your travel companions here,
                then go to Expenses to choose who
                paid and who should split each
                expense.
              </p>

            </div>

          </div>


          {/* =================================
              SETTLEMENT
          ================================= */}

          <Settlement
            expenses={expenses}
          />


        </main>

      </div>

    </div>

  );

}

export default Groups;