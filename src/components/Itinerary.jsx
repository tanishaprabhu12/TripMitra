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
  // FORM STATE
  // =========================================

  const [day, setDay] = useState("");
  const [activity, setActivity] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");


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
  // TOTAL COST
  // =========================================

  const totalCost = activities.reduce(
    (total, item) =>
      total + Number(item.cost || 0),
    0
  );


  // =========================================
  // UPDATE DASHBOARD COST
  // =========================================

  useEffect(() => {

    if (typeof onCostChange === "function") {
      onCostChange(totalCost);
    }

  }, [totalCost, onCostChange]);


  // =========================================
  // ADD ACTIVITY
  // =========================================

  function handleSubmit(event) {

    event.preventDefault();

    if (
      !day.trim() ||
      !activity.trim() ||
      !location.trim()
    ) {

      alert(
        "Please fill in the day, activity and location."
      );

      return;
    }


    const numericCost =
      Number(cost) || 0;


    const newActivity = {

      id: Date.now(),

      day: day.trim(),

      activity: activity.trim(),

      location: location.trim(),

      time,

      cost: numericCost,

      notes: notes.trim(),

    };


    setActivities(
      (currentActivities) => [
        ...currentActivities,
        newActivity,
      ]
    );


    // Clear form

    setDay("");
    setActivity("");
    setLocation("");
    setTime("");
    setCost("");
    setNotes("");
  }


  // =========================================
  // DELETE ACTIVITY
  // =========================================

  function deleteActivity(id) {

    setActivities(
      (currentActivities) =>
        currentActivities.filter(
          (item) => item.id !== id
        )
    );

  }


  // =========================================
  // GROUP ACTIVITIES BY DAY
  // =========================================

  const groupedActivities = activities.reduce(
    (groups, item) => {

      const dayName =
        item.day || "Other";

      if (!groups[dayName]) {
        groups[dayName] = [];
      }

      groups[dayName].push(item);

      return groups;

    },
    {}
  );


  // =========================================
  // FORMAT MONEY
  // =========================================

  function formatMoney(amount) {

    return `₹${Number(amount).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    )}`;

  }


  // =========================================
  // PAGE
  // =========================================

  return (

    <div className="itinerary-section">


      {/* =====================================
          HEADER
      ====================================== */}

      <div className="itinerary-header">

        <div>

          <h2>
            🗓️ Trip Itinerary
          </h2>

          <p>
            Organize your activities,
            locations and plans for each day.
          </p>

        </div>


        <div className="itinerary-summary">

          <div>

            <span>
              Activities
            </span>

            <strong>
              {activities.length}
            </strong>

          </div>


          <div>

            <span>
              Planned Cost
            </span>

            <strong>
              {formatMoney(totalCost)}
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================
          ADD ACTIVITY
      ====================================== */}

      <div className="page-card">

        <h2>
          ➕ Add Activity
        </h2>

        <form
          className="itinerary-form"
          onSubmit={handleSubmit}
        >


          {/* DAY */}

          <input
            type="text"
            placeholder="Day (e.g. Day 1)"
            value={day}
            onChange={(event) =>
              setDay(event.target.value)
            }
          />


          {/* ACTIVITY */}

          <input
            type="text"
            placeholder="Activity"
            value={activity}
            onChange={(event) =>
              setActivity(
                event.target.value
              )
            }
          />


          {/* LOCATION */}

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(event) =>
              setLocation(
                event.target.value
              )
            }
          />


          {/* TIME */}

          <input
            type="time"
            value={time}
            onChange={(event) =>
              setTime(
                event.target.value
              )
            }
          />


          {/* COST */}

          <input
            type="number"
            min="0"
            placeholder="Estimated cost ₹"
            value={cost}
            onChange={(event) =>
              setCost(
                event.target.value
              )
            }
          />


          {/* NOTES */}

          <textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(event) =>
              setNotes(
                event.target.value
              )
            }
            rows="3"
          />


          {/* SUBMIT */}

          <button type="submit">
            + Add Activity
          </button>

        </form>

      </div>


      {/* =====================================
          TOTAL
      ====================================== */}

      <div className="itinerary-total">

        <div>

          <span>
            💰 Total Planned Cost
          </span>

          <strong>
            {formatMoney(totalCost)}
          </strong>

        </div>

        <div>

          <span>
            🗺️ Activities Planned
          </span>

          <strong>
            {activities.length}
          </strong>

        </div>

      </div>


      {/* =====================================
          ACTIVITIES
      ====================================== */}

      <div className="itinerary-list">


        {activities.length === 0 ? (

          <div className="empty-itinerary">

            <h3>
              No activities planned yet 🗺️
            </h3>

            <p>
              Add your first activity above to
              start building your trip itinerary.
            </p>

          </div>

        ) : (

          Object.entries(
            groupedActivities
          ).map(
            ([dayName, dayActivities]) => (

              <div
                className="itinerary-day-group"
                key={dayName}
              >


                {/* DAY HEADER */}

                <div className="itinerary-day-header">

                  <h2>
                    📅 {dayName}
                  </h2>

                  <span>
                    {dayActivities.length}{" "}
                    {dayActivities.length === 1
                      ? "activity"
                      : "activities"}
                  </span>

                </div>


                {/* DAY ACTIVITIES */}

                {dayActivities.map(
                  (item) => (

                    <div
                      className="itinerary-item"
                      key={item.id}
                    >


                      {/* TIME */}

                      <div className="itinerary-time">

                        {item.time ? (
                          <>
                            <span>
                              🕐
                            </span>

                            <strong>
                              {item.time}
                            </strong>
                          </>
                        ) : (
                          <span>
                            🕐 Anytime
                          </span>
                        )}

                      </div>


                      {/* DETAILS */}

                      <div className="itinerary-details">

                        <h3>
                          {item.activity}
                        </h3>

                        <p>
                          📍 {item.location}
                        </p>


                        {item.notes && (

                          <p className="itinerary-notes">
                            📝 {item.notes}
                          </p>

                        )}

                      </div>


                      {/* COST */}

                      <div className="itinerary-cost">

                        {Number(item.cost) > 0
                          ? formatMoney(
                              item.cost
                            )
                          : "Free"}

                      </div>


                      {/* DELETE */}

                      <button
                        type="button"
                        className="delete-itinerary"
                        onClick={() =>
                          deleteActivity(
                            item.id
                          )
                        }
                        title="Delete activity"
                      >
                        🗑️
                      </button>

                    </div>

                  )
                )}

              </div>

            )
          )

        )}

      </div>

    </div>

  );

}

export default Itinerary;