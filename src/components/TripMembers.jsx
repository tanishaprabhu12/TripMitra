import { useState } from "react";

function TripMembers() {

  const [members, setMembers] = useState(() => {

    const savedMembers =
      localStorage.getItem("tripMembers");

    return savedMembers
      ? JSON.parse(savedMembers)
      : ["Tanisha"];

  });


  const [newMember, setNewMember] =
    useState("");


  function addMember(event) {

    event.preventDefault();

    const memberName =
      newMember.trim();


    if (!memberName) {
      return;
    }


    if (
      members.some(
        (member) =>
          member.toLowerCase() ===
          memberName.toLowerCase()
      )
    ) {

      alert(
        "This member is already in the trip."
      );

      return;
    }


    const updatedMembers = [
      ...members,
      memberName,
    ];


    setMembers(updatedMembers);


    localStorage.setItem(
      "tripMembers",
      JSON.stringify(updatedMembers)
    );


    setNewMember("");
  }


  return (

    <div className="trip-members">

      <h2>
        👥 Trip Members
      </h2>


      <div className="member-list">

        {members.map(
          (member, index) => (

            <div
              className="member-item"
              key={index}
            >

              <span>
                👤
              </span>

              <span>
                {member}
              </span>

            </div>

          )
        )}

      </div>


      <form onSubmit={addMember}>

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
  );
}

export default TripMembers;