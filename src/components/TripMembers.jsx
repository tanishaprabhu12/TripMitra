import { useState } from "react";

function TripMembers() {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const currentUserName =
    currentUser?.name ||
    currentUser?.fullName ||
    "Tanisha";

  // Members are now saved separately for each logged-in user
  const membersKey = currentUser
    ? `tripMembers_${currentUser.id}`
    : "tripMembers";

  const [members, setMembers] = useState(() => {
    const savedMembers =
      localStorage.getItem(membersKey);

    return savedMembers
      ? JSON.parse(savedMembers)
      : [currentUserName];
  });

  const [newMember, setNewMember] = useState("");

  function addMember(event) {
    event.preventDefault();

    const memberName = newMember.trim();

    if (!memberName) {
      return;
    }

    // Prevent duplicate names
    if (
      members.some(
        (member) =>
          member.toLowerCase() ===
          memberName.toLowerCase()
      )
    ) {
      alert("This member is already in the trip.");
      return;
    }

    const updatedMembers = [
      ...members,
      memberName,
    ];

    setMembers(updatedMembers);

    localStorage.setItem(
      membersKey,
      JSON.stringify(updatedMembers)
    );

    // Tell ExpenseForm that the members changed
    window.dispatchEvent(
      new Event("tripMembersUpdated")
    );

    setNewMember("");
  }

  function removeMember(memberToRemove) {
    // Don't allow removing the logged-in user
    if (memberToRemove === currentUserName) {
      alert("You cannot remove yourself from the trip.");
      return;
    }

    const updatedMembers = members.filter(
      (member) => member !== memberToRemove
    );

    setMembers(updatedMembers);

    localStorage.setItem(
      membersKey,
      JSON.stringify(updatedMembers)
    );

    window.dispatchEvent(
      new Event("tripMembersUpdated")
    );
  }

  return (
    <div className="trip-members">

      <h2>👥 Trip Members</h2>

      <p>
        Add the people traveling with you.
      </p>

      <div className="member-list">

        {members.map((member) => (
          <div
            className="member-item"
            key={member}
          >

            <span>👤</span>

            <span className="member-name">
              {member}

              {member === currentUserName && (
                <small> (You)</small>
              )}
            </span>

            {member !== currentUserName && (
              <button
                type="button"
                className="remove-member"
                onClick={() =>
                  removeMember(member)
                }
              >
                ×
              </button>
            )}

          </div>
        ))}

      </div>

      <form onSubmit={addMember}>

        <input
          type="text"
          placeholder="Enter friend's name"
          value={newMember}
          onChange={(event) =>
            setNewMember(event.target.value)
          }
        />

        <button type="submit">
          + Add Member
        </button>

      </form>

    </div>
  );
}

export default TripMembers;