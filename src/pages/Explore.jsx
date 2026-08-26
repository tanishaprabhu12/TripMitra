import { useState } from "react";
import { useNavigate } from "react-router-dom";

const destinations = [
  {
    id: 1,
    name: "Goa",
    emoji: "🌴",
    description:
      "Beaches, nightlife, food and adventure.",
    category: "Beach",
    budget: 12000,
    highlights: [
      "Baga Beach",
      "Fort Aguada",
      "Calangute Beach",
      "Old Goa",
    ],
    activities: [
      "Beach hopping",
      "Water sports",
      "Sunset sightseeing",
      "Local food",
    ],
  },

  {
    id: 2,
    name: "Manali",
    emoji: "🏔️",
    description:
      "Mountains, snow, nature and adventure.",
    category: "Adventure",
    budget: 15000,
    highlights: [
      "Solang Valley",
      "Hadimba Temple",
      "Mall Road",
      "Vashisht",
    ],
    activities: [
      "Mountain sightseeing",
      "Adventure sports",
      "Nature walks",
      "Local shopping",
    ],
  },

  {
    id: 3,
    name: "Jaipur",
    emoji: "🏰",
    description:
      "Palaces, forts, culture and local food.",
    category: "Heritage",
    budget: 10000,
    highlights: [
      "Amber Fort",
      "Hawa Mahal",
      "City Palace",
      "Johari Bazaar",
    ],
    activities: [
      "Heritage sightseeing",
      "Local shopping",
      "Food experiences",
      "Cultural tours",
    ],
  },

  {
    id: 4,
    name: "Kerala",
    emoji: "🌿",
    description:
      "Backwaters, beaches, nature and relaxation.",
    category: "Nature",
    budget: 14000,
    highlights: [
      "Alleppey",
      "Munnar",
      "Fort Kochi",
      "Varkala",
    ],
    activities: [
      "Backwater cruise",
      "Nature sightseeing",
      "Beach visits",
      "Local cuisine",
    ],
  },

  {
    id: 5,
    name: "Bangalore",
    emoji: "🌆",
    description:
      "Cafes, parks, technology and city experiences.",
    category: "City",
    budget: 8000,
    highlights: [
      "Cubbon Park",
      "Lalbagh",
      "MG Road",
      "Indiranagar",
    ],
    activities: [
      "Cafe hopping",
      "City exploration",
      "Park visits",
      "Shopping",
    ],
  },

  {
    id: 6,
    name: "Rishikesh",
    emoji: "🏞️",
    description:
      "River rafting, yoga, nature and adventure.",
    category: "Adventure",
    budget: 11000,
    highlights: [
      "River Ganga",
      "Laxman Jhula",
      "Neer Garh Waterfall",
      "Beatles Ashram",
    ],
    activities: [
      "River rafting",
      "Yoga",
      "Waterfall visits",
      "Nature walks",
    ],
  },
];


function Explore() {

  const navigate = useNavigate();

  const [search, setSearch] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [selectedDestination, setSelectedDestination] =
    useState(null);


  // =========================================
  // FILTER DESTINATIONS
  // =========================================

  const filteredDestinations =
    destinations.filter(
      (destination) => {

        const matchesSearch =
          destination.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesCategory =
          selectedCategory === "All" ||
          destination.category ===
            selectedCategory;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );


  // =========================================
  // PLAN TRIP
  // =========================================

  function createTrip(destination) {

    const currentUser =
      JSON.parse(
        localStorage.getItem(
          "currentUser"
        ) || "null"
      );

    if (!currentUser) {

      alert(
        "Please login before planning a trip."
      );

      navigate("/login");

      return;
    }


    /*
      We DON'T save "trip" here anymore.

      CreateTrip.jsx will save the trip
      using the logged-in user's ID.
    */

    navigate(
      `/create-trip?destination=${encodeURIComponent(
        destination.name
      )}`
    );
  }


  // =========================================
  // RENDER
  // =========================================

  return (

    <div className="explore-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="explore-header">

        <div>

          <h1>
            Explore Destinations 🌍
          </h1>

          <p>
            Discover places and start planning
            your next adventure.
          </p>

        </div>


        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Back to Dashboard
        </button>

      </div>


      {/* =====================================
          SEARCH
      ====================================== */}

      <div className="explore-controls">

        <input
          type="text"
          placeholder="🔎 Search destinations..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />


        <div className="category-buttons">

          {[
            "All",
            "Beach",
            "Adventure",
            "Heritage",
            "Nature",
            "City",
          ].map(
            (category) => (

              <button
                key={category}
                className={
                  selectedCategory ===
                  category
                    ? "category-active"
                    : ""
                }
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
              >
                {category}
              </button>

            )
          )}

        </div>

      </div>


      {/* =====================================
          DESTINATION DETAILS
      ====================================== */}

      {selectedDestination && (

        <div className="destination-detail">

          <button
            className="close-detail"
            onClick={() =>
              setSelectedDestination(null)
            }
          >
            ✕
          </button>


          <div className="detail-hero">

            <div className="detail-emoji">
              {selectedDestination.emoji}
            </div>

            <div>

              <span className="detail-category">
                {selectedDestination.category}
              </span>

              <h2>
                {selectedDestination.name}
              </h2>

              <p>
                {selectedDestination.description}
              </p>

            </div>

          </div>


          <div className="detail-columns">

            {/* HIGHLIGHTS */}

            <div>

              <h3>
                📍 Places to Visit
              </h3>

              <ul>

                {selectedDestination.highlights.map(
                  (place) => (
                    <li key={place}>
                      {place}
                    </li>
                  )
                )}

              </ul>

            </div>


            {/* ACTIVITIES */}

            <div>

              <h3>
                🎯 Things to Do
              </h3>

              <ul>

                {selectedDestination.activities.map(
                  (activity) => (
                    <li key={activity}>
                      {activity}
                    </li>
                  )
                )}

              </ul>

            </div>


            {/* BUDGET */}

            <div>

              <h3>
                💰 Budget
              </h3>

              <strong className="detail-budget">

                ₹
                {selectedDestination.budget.toLocaleString(
                  "en-IN"
                )}

              </strong>

              <p>
                Estimated starting budget
              </p>

            </div>

          </div>


          <button
            className="detail-plan-button"
            onClick={() =>
              createTrip(
                selectedDestination
              )
            }
          >
            ✈️ Plan This Trip
          </button>

        </div>

      )}


      {/* =====================================
          DESTINATION GRID
      ====================================== */}

      <div className="destination-grid">

        {filteredDestinations.length ===
        0 ? (

          <div className="no-destinations">

            <h2>
              No destinations found 😕
            </h2>

            <p>
              Try another search or category.
            </p>

          </div>

        ) : (

          filteredDestinations.map(
            (destination) => (

              <div
                className="destination-card"
                key={destination.id}
              >

                {/* EMOJI */}

                <div className="destination-emoji">
                  {destination.emoji}
                </div>


                {/* CONTENT */}

                <div className="destination-content">

                  <div className="destination-title">

                    <h2>
                      {destination.name}
                    </h2>

                    <span>
                      {destination.category}
                    </span>

                  </div>


                  <p>
                    {destination.description}
                  </p>


                  {/* QUICK HIGHLIGHTS */}

                  <div className="destination-highlights">

                    {destination.highlights
                      .slice(0, 3)
                      .map(
                        (place) => (
                          <span
                            key={place}
                          >
                            📍 {place}
                          </span>
                        )
                      )}

                  </div>


                  {/* FOOTER */}

                  <div className="destination-footer">

                    <div>

                      <small>
                        Estimated starting
                        budget
                      </small>

                      <strong>

                        ₹
                        {destination.budget.toLocaleString(
                          "en-IN"
                        )}

                      </strong>

                    </div>


                    <div className="destination-actions">

                      <button
                        className="details-button"
                        onClick={() =>
                          setSelectedDestination(
                            destination
                          )
                        }
                      >
                        View Details
                      </button>


                      <button
                        onClick={() =>
                          createTrip(
                            destination
                          )
                        }
                      >
                        Plan Trip →
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            )
          )

        )}

      </div>

    </div>

  );
}

export default Explore;