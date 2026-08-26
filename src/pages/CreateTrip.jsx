import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function CreateTrip() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  // Get destination from Explore page
  const suggestedDestination =
    searchParams.get("destination") || "";

  const [tripName, setTripName] = useState(
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


    const trip = {
      tripName,
      destination,
      startDate,
      endDate,
      travelers: Number(travelers),
      budget: Number(budget),
    };

    // Reset members when creating a new trip
localStorage.removeItem(
  `tripMembers_${currentUser.id}`
);


    // Save trip for this specific user
    localStorage.setItem(
      `trip_${currentUser.id}`,
      JSON.stringify(trip)
    );


    // Start with a fresh itinerary
    localStorage.removeItem(
      `tripItinerary_${currentUser.id}`
    );


    // Start with fresh expenses
    localStorage.removeItem(
      `tripExpenses_${currentUser.id}`
    );


    navigate("/dashboard");
  }


  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>
          ✈️ Create Your Trip
        </h1>

        <p>
          Let's plan your next adventure!
        </p>


        <form onSubmit={handleSubmit}>

          {/* Trip Name */}

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


          {/* Destination */}

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


          {/* Start Date */}

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


          {/* End Date */}

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


          {/* Travelers */}

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


          {/* Budget */}

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


          <button type="submit">
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