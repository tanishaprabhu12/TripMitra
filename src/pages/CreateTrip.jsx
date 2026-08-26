import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function CreateTrip() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  // =========================================
  // DESTINATION FROM EXPLORE
  // =========================================

  const suggestedDestination =
    searchParams.get("destination") || "";


  // =========================================
  // FORM STATE
  // =========================================

  const [tripName, setTripName] =
    useState(
      suggestedDestination
        ? `${suggestedDestination} Trip`
        : ""
    );

  const [destination, setDestination] =
    useState(suggestedDestination);

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [travelers, setTravelers] =
    useState("");

  const [budget, setBudget] =
    useState("");


  // =========================================
  // CREATE TRIP
  // =========================================

  function handleSubmit(event) {
    event.preventDefault();


    // =========================================
    // GET CURRENT USER
    // =========================================

    const currentUser = JSON.parse(
      localStorage.getItem(
        "currentUser"
      ) || "null"
    );


    if (!currentUser) {

      alert(
        "Please login before creating a trip."
      );

      navigate("/login");

      return;
    }


    // =========================================
    // CREATE TRIP OBJECT
    // =========================================

    const trip = {
      tripName:
        tripName.trim(),

      destination:
        destination.trim(),

      startDate,

      endDate,

      travelers:
        Number(travelers),

      budget:
        Number(budget),
    };


    // =========================================
    // USER-SPECIFIC STORAGE KEYS
    // =========================================

    const tripKey =
      `trip_${currentUser.id}`;

    const membersKey =
      `tripMembers_${currentUser.id}`;

    const expensesKey =
      `tripExpenses_${currentUser.id}`;

    const itineraryKey =
      `tripItinerary_${currentUser.id}`;


    // =========================================
    // SAVE TRIP
    // =========================================

    localStorage.setItem(
      tripKey,
      JSON.stringify(trip)
    );


    // =========================================
    // RESET MEMBERS
    // =========================================
    // The person creating the trip becomes
    // the first member automatically.

    localStorage.setItem(
      membersKey,
      JSON.stringify([
        currentUser.name,
      ])
    );


    // =========================================
    // RESET EXPENSES
    // =========================================

    localStorage.setItem(
      expensesKey,
      JSON.stringify([])
    );


    // =========================================
    // RESET ITINERARY
    // =========================================

    localStorage.setItem(
      itineraryKey,
      JSON.stringify([])
    );


    // =========================================
    // GO TO DASHBOARD
    // =========================================

    navigate("/dashboard");
  }


  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>
          ✈️ Create Your Trip
        </h1>

        <p>
          Let's plan your next adventure!
        </p>


        <form
          onSubmit={handleSubmit}
        >

          {/* TRIP NAME */}

          <input
            type="text"
            placeholder="Trip Name"
            value={tripName}
            onChange={(event) =>
              setTripName(
                event.target.value
              )
            }
            required
          />


          {/* DESTINATION */}

          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(event) =>
              setDestination(
                event.target.value
              )
            }
            required
          />


          {/* START DATE */}

          <label>
            Start Date
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(event) =>
              setStartDate(
                event.target.value
              )
            }
            required
          />


          {/* END DATE */}

          <label>
            End Date
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(event) =>
              setEndDate(
                event.target.value
              )
            }
            required
          />


          {/* TRAVELERS */}

          <input
            type="number"
            placeholder="Number of Travelers"
            min="1"
            value={travelers}
            onChange={(event) =>
              setTravelers(
                event.target.value
              )
            }
            required
          />


          {/* BUDGET */}

          <input
            type="number"
            placeholder="Total Trip Budget"
            min="0"
            value={budget}
            onChange={(event) =>
              setBudget(
                event.target.value
              )
            }
            required
          />


          {/* CREATE */}

          <button
            type="submit"
          >
            Create Trip ✈️
          </button>

        </form>


        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            navigate("/explore")
          }
        >
          ← Back to Explore
        </button>

      </div>

    </div>
  );
}

export default CreateTrip;