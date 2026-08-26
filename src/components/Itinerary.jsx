import { useEffect, useState } from "react";

function Itinerary({ onCostChange }) {

  // =========================================
  // CURRENT USER
  // =========================================

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const itineraryKey = currentUser
    ? `tripItinerary_${currentUser.id}`
    : "tripItinerary";


  // =========================================
  // ACTIVITIES
  // =========================================

  const [activities, setActivities] = useState(() => {

    const savedActivities =
      localStorage.getItem(itineraryKey);

    return savedActivities
      ? JSON.parse(savedActivities)
      : [];
  });


  // =========================================
  // FORM
  // =========================================

  const [day, setDay] = useState("");
  const [activity, setActivity] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [cost, setCost] = useState("");


  // =========================================
  // SAVE ACTIVITIES
  // =========================================

  useEffect(() => {

    localStorage.setItem(
      itineraryKey,
      JSON.stringify(activities)
    );

  }, [activities, itineraryKey]);


  // =========================================
  // UPDATE COST
  // =========================================

  useEffect(() => {

    const totalCost = activities.reduce(
      (total, item) =>
        total + Number(item.cost || 0),
      0
    );

    if (typeof onCostChange === "function") {
      onCostChange(totalCost);
    }

  }, [activities, onCostChange]);


  // =========================================
  // ADD ACTIVITY
  // =========================================

  function handleSubmit(event) {

    event.preventDefault();

    if (!day || !activity || !location) {

      alert(
        "Please fill in the day, activity and location."
      );

      return;
    }


    const newActivity = {

      id: Date.now(),

      day,

      activity,

      location,

      time,

      cost: Number(cost) || 0,
    };


    setActivities((currentActivities) => [

      ...currentActivities,

      newActivity,

    ]);


    // Clear form

    setDay("");
    setActivity("");
    setLocation("");
    setTime("");
    setCost("");
  }


  // =========================================
  // DELETE ACTIVITY
  // =========================================

  function deleteActivity(id) {

    setActivities((currentActivities) =>
      currentActivities.filter(
        (item) => item.id !== id
      )
    );

  }


  // =========================================
  // TOTAL COST
  // =========================================

  const totalCost = activities.reduce(
    (total, item) =>
      total + Number(item.cost || 0),
    0
  );


  // =========================================
  // PAGE
  // =========================================

  return (

    <div className="itinerary-section">

      {/* HEADER */}

      <div className="itinerary-header">

        <div>

          <h2>
            🗓️ Trip Itinerary
          </h2>

          <p>
            Plan your activities and places to visit.
          </p>

        </div>

      </div>


      {/* ADD ACTIVITY */}

      <form
        className="itinerary-form"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          placeholder="Day (e.g. Day 1)"
          value={day}
          onChange={(event) =>
            setDay(event.target.value)
          }
        />


        <input
          type="text"
          placeholder="Activity"
          value={activity}
          onChange={(event) =>
            setActivity(event.target.value)
          }
        />


        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(event) =>
            setLocation(event.target.value)
          }
        />


        <input
          type="time"
          value={time}
          onChange={(event) =>
            setTime(event.target.value)
          }
        />


        <input
          type="number"
          placeholder="Estimated cost ₹"
          min="0"
          value={cost}
          onChange={(event) =>
            setCost(event.target.value)
          }
        />


        <button type="submit">
          + Add Activity
        </button>

      </form>


      {/* TOTAL */}

      <div className="itinerary-total">

        <span>
          💰 Total Planned Cost
        </span>

        <strong>
          ₹{totalCost.toLocaleString("en-IN")}
        </strong>

      </div>


      {/* ACTIVITIES */}

      <div className="itinerary-list">

        {activities.length === 0 ? (

          <div className="empty-itinerary">

            <h3>
              No activities planned yet 🗺️
            </h3>

            <p>
              Add your first activity to start
              building your trip itinerary.
            </p>

          </div>

        ) : (

          activities.map((item) => (

            <div
              className="itinerary-item"
              key={item.id}
            >

              <div className="itinerary-day">

                <strong>
                  {item.day}
                </strong>

              </div>


              <div className="itinerary-details">

                <h3>
                  {item.activity}
                </h3>

                <p>
                  📍 {item.location}
                </p>

                {item.time && (

                  <p>
                    🕐 {item.time}
                  </p>

                )}

              </div>


              <div className="itinerary-cost">

                {Number(item.cost) > 0

                  ? `₹${Number(
                      item.cost
                    ).toLocaleString("en-IN")}`

                  : "Free"}

              </div>


              <button
                type="button"
                className="delete-itinerary"
                onClick={() =>
                  deleteActivity(item.id)
                }
              >
                🗑️
              </button>

            </div>

          ))

        )}

      </div>

    </div>

  );
}

export default Itinerary;