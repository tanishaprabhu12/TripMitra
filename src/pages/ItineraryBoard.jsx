import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Itinerary from "../components/Itinerary";

function ItineraryBoard() {
  return (
    <div>
      <Navbar />

      <div className="app-layout">

        <Sidebar />

        <main className="main-content">

          <div className="dashboard-welcome">
            <div>

              <p className="dashboard-eyebrow">
                TRIP PLANNING
              </p>

              <h1>
                🗓️ Trip Itinerary
              </h1>

              <p>
                Plan your activities, places to visit,
                timings and estimated costs.
              </p>

            </div>
          </div>

          <Itinerary />

        </main>

      </div>
    </div>
  );
}

export default ItineraryBoard;