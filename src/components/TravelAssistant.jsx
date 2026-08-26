import { useState } from "react";

function TravelAssistant() {

  // =========================================
  // CURRENT USER
  // =========================================

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const userId = currentUser?.id || "guest";


  // =========================================
  // USER-SPECIFIC KEYS
  // =========================================

  const tripKey =
    currentUser
      ? `trip_${currentUser.id}`
      : "trip";

  const expensesKey =
    currentUser
      ? `tripExpenses_${currentUser.id}`
      : "tripExpenses";

  const itineraryKey =
    currentUser
      ? `tripItinerary_${currentUser.id}`
      : "tripItinerary";

  const savingsTargetKey =
    currentUser
      ? `savingsTarget_${currentUser.id}`
      : "savingsTarget";

  const savingsSavedKey =
    currentUser
      ? `savingsSaved_${currentUser.id}`
      : "savingsSaved";


  // =========================================
  // LOAD TRIP
  // =========================================

  const trip = JSON.parse(
    localStorage.getItem(tripKey) || "null"
  );


  // =========================================
  // LOAD EXPENSES
  // =========================================

  const expenses = JSON.parse(
    localStorage.getItem(expensesKey) || "[]"
  );


  // =========================================
  // LOAD ITINERARY
  // =========================================

  const itinerary = JSON.parse(
    localStorage.getItem(itineraryKey) || "[]"
  );


  // =========================================
  // LOAD SAVINGS
  // =========================================

  const savingsTarget =
    Number(
      localStorage.getItem(
        savingsTargetKey
      )
    ) || 0;

  const savingsSaved =
    Number(
      localStorage.getItem(
        savingsSavedKey
      )
    ) || 0;


  // =========================================
  // CALCULATIONS
  // =========================================

  const tripBudget =
    Number(trip?.budget) || 0;

  const totalExpenses =
    expenses.reduce(
      (total, expense) =>
        total +
        Number(
          expense.amount || 0
        ),
      0
    );

  const itineraryCost =
    itinerary.reduce(
      (total, item) =>
        total +
        Number(
          item.cost || 0
        ),
      0
    );

  const totalPlannedSpending =
    totalExpenses +
    itineraryCost;

  const remainingBudget =
    tripBudget -
    totalPlannedSpending;


  // =========================================
  // CHAT STATE
  // =========================================

  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState([
      {
        type: "assistant",
        text: trip
          ? `Hi! 👋 I'm your TripMitra Travel Assistant.

I can help you plan your ${trip.destination} trip, manage your budget, organize your itinerary and more! ✈️`
          : `Hi! 👋 I'm your TripMitra Travel Assistant.

Create a trip first and I'll be able to give you personalized travel suggestions!`
      }
    ]);


  // =========================================
  // FORMAT MONEY
  // =========================================

  function formatMoney(amount) {

    return `₹${Number(
      amount
    ).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    )}`;

  }


  // =========================================
  // GENERATE ANSWER
  // =========================================

  function generateAnswer(questionText) {

    const q =
      questionText.toLowerCase();


    const destination =
      trip?.destination ||
      "your destination";


    // =========================================
    // NO TRIP
    // =========================================

    if (!trip) {

      return `I don't see an active trip yet. ✈️

Create a trip first and I'll be able to help you with:

• Itineraries
• Budget planning
• Activities
• Packing
• Saving money
• Places to visit

Once your trip is created, ask me again! 😊`;

    }


    // =========================================
    // CURRENT TRIP
    // =========================================

    if (
      q.includes("my trip") ||
      q.includes("trip details") ||
      q.includes("what is my trip")
    ) {

      return `Here's your current trip ✈️

📍 Destination: ${destination}

👥 Travelers: ${
        trip.travelers || "Not specified"
      }

📅 Dates: ${
        trip.startDate || "Not set"
      } → ${
        trip.endDate || "Not set"
      }

💰 Trip Budget: ${
        formatMoney(tripBudget)
      }

💸 Current Spending: ${
        formatMoney(totalExpenses)
      }

🗓️ Planned Activities: ${
        itinerary.length
      }

You can ask me about your budget, itinerary, activities or packing!`;

    }


    // =========================================
    // BUDGET STATUS
    // =========================================

    if (
      q.includes("budget status") ||
      q.includes("how much have i spent") ||
      q.includes("how much left") ||
      q.includes("remaining budget") ||
      q.includes("how much money")
    ) {

      if (tripBudget <= 0) {

        return `I don't see a trip budget set yet. 💰

Set your budget on the Trip Budget page and I'll be able to track it for you.`;

      }


      const percentage =
        (
          totalPlannedSpending /
          tripBudget
        ) *
        100;


      if (
        totalPlannedSpending >
        tripBudget
      ) {

        return `🚨 Budget Alert

Your trip budget is ${
          formatMoney(tripBudget)
        }.

You've currently planned/spent ${
          formatMoney(totalPlannedSpending)
        }.

You're ${
          formatMoney(
            totalPlannedSpending -
            tripBudget
          )
        } over your budget.

Consider reducing optional activities or expenses.`;

      }


      return `💰 Your ${destination} budget

Total Budget:
${formatMoney(tripBudget)}

Actual Expenses:
${formatMoney(totalExpenses)}

Planned Itinerary Costs:
${formatMoney(itineraryCost)}

Total Planned Spending:
${formatMoney(totalPlannedSpending)}

Remaining:
${formatMoney(remainingBudget)}

You've used approximately ${Math.max(
        percentage,
        0
      ).toFixed(0)}% of your budget.`;

    }


    // =========================================
    // ITINERARY
    // =========================================

    if (
      q.includes("itinerary") ||
      q.includes("3 day") ||
      q.includes("3-day") ||
      q.includes("plan my trip")
    ) {

      return `Here's a simple 3-day plan for ${destination} ✈️

Day 1 🌅
• Explore the main attractions
• Try local food
• Visit a scenic location
• Relax in the evening

Day 2 🌴
• Visit popular tourist spots
• Try a local activity
• Explore local markets
• Enjoy dinner

Day 3 🌊
• Visit another scenic location
• Shopping / souvenirs
• Take photos
• Relax before your journey home

You can add these activities to your Trip Itinerary page and assign estimated costs to them.`;

    }


    // =========================================
    // EXISTING ITINERARY
    // =========================================

    if (
      q.includes("planned activities") ||
      q.includes("what have i planned") ||
      q.includes("my itinerary")
    ) {

      if (
        itinerary.length === 0
      ) {

        return `You haven't added any activities to your itinerary yet. 🗓️

Go to the Itinerary page and start adding activities!`;

      }


      const activityList =
        itinerary
          .slice(0, 8)
          .map(
            (item) =>
              `• ${item.day}: ${item.activity} — ${item.location}`
          )
          .join("\n");


      return `Here's what's currently planned for your trip 🗓️

${activityList}

Total planned activities:
${itinerary.length}

Total planned activity cost:
${formatMoney(itineraryCost)}`;

    }


    // =========================================
    // PACKING
    // =========================================

    if (
      q.includes("pack") ||
      q.includes("packing") ||
      q.includes("bring")
    ) {

      return `Here's a basic packing checklist for ${destination} 🎒

☐ Comfortable clothes
☐ Comfortable shoes
☐ Phone charger
☐ Power bank
☐ ID / important documents
☐ Toiletries
☐ Any medicines you normally use
☐ Water bottle
☐ Sunglasses
☐ Small backpack

Also check the weather forecast before you leave! ☀️`;

    }


    // =========================================
    // SAVE MONEY
    // =========================================

    if (
      q.includes("save money") ||
      q.includes("cheap") ||
      q.includes("saving") ||
      q.includes("reduce spending")
    ) {

      return `Here are some ways to save money on your ${destination} trip 💰

1. Set a daily spending limit.
2. Compare transport options.
3. Eat at local restaurants instead of only tourist spots.
4. Book popular activities in advance when possible.
5. Avoid unnecessary impulse purchases.
6. Track every expense in TripMitra.
7. Keep some money aside for emergencies.

Your current planned spending is ${
        formatMoney(
          totalPlannedSpending
        )
      }.

Your trip budget is ${
        formatMoney(tripBudget)
      }.`;

    }


    // =========================================
    // ACTIVITIES
    // =========================================

    if (
      q.includes("things to do") ||
      q.includes("activities") ||
      q.includes("places") ||
      q.includes("visit")
    ) {

      return `Here are some ideas for ${destination} 🌍

📍 Explore popular landmarks
🌴 Visit scenic locations
🍴 Try local food
🛍️ Explore local markets
📸 Take photos at famous viewpoints
🎟️ Try a local activity
🌅 Watch the sunset

If you find something you like, add it to your Trip Itinerary.`;

    }


    // =========================================
    // FOOD
    // =========================================

    if (
      q.includes("food") ||
      q.includes("eat") ||
      q.includes("restaurant")
    ) {

      return `For ${destination}, try exploring local food experiences 🍴

Look for:

• Local specialties
• Popular street food
• Highly-rated local restaurants
• Vegetarian options if needed
• Cafes near your sightseeing locations

Tip: Check current reviews and opening hours before visiting a restaurant.`;

    }


    // =========================================
    // SAVINGS
    // =========================================

    if (
      q.includes("savings") ||
      q.includes("saved") ||
      q.includes("saving goal")
    ) {

      if (
        savingsTarget <= 0
      ) {

        return `You don't have a savings goal set yet. 🎯

Go to the Savings page and create one.`;

      }


      const savingsPercentage =
        (
          savingsSaved /
          savingsTarget
        ) *
        100;


      return `🎯 Your Savings Goal

Target:
${formatMoney(savingsTarget)}

Saved:
${formatMoney(savingsSaved)}

Remaining:
${formatMoney(
        Math.max(
          savingsTarget -
          savingsSaved,
          0
        )
      )}

Progress:
${Math.min(
        savingsPercentage,
        100
      ).toFixed(0)}%`;

    }


    // =========================================
    // DEFAULT
    // =========================================

    return `I'd be happy to help with your ${destination} trip! ✈️

Try asking me:

• "Give me a 3-day itinerary"
• "What is my trip?"
• "What's my budget status?"
• "What activities have I planned?"
• "What should I pack?"
• "How can I save money?"
• "What places should I visit?"
• "What food should I try?"
• "How much have I saved?"

I'm here to help you plan your trip! 😊`;

  }


  // =========================================
  // SEND MESSAGE
  // =========================================

  function handleSubmit(event) {

    event.preventDefault();

    if (
      !question.trim()
    ) {
      return;
    }


    const userQuestion =
      question.trim();


    const answer =
      generateAnswer(
        userQuestion
      );


    setMessages(
      (currentMessages) => [

        ...currentMessages,

        {
          type: "user",
          text: userQuestion,
        },

        {
          type: "assistant",
          text: answer,
        },

      ]
    );


    setQuestion("");

  }


  // =========================================
  // QUICK QUESTIONS
  // =========================================

  function askQuestion(text) {

    const answer =
      generateAnswer(text);


    setMessages(
      (currentMessages) => [

        ...currentMessages,

        {
          type: "user",
          text,
        },

        {
          type: "assistant",
          text: answer,
        },

      ]
    );

  }


  // =========================================
  // RENDER
  // =========================================

  return (

    <section className="travel-assistant">


      {/* HEADER */}

      <div className="assistant-header">

        <div className="assistant-icon">
          🤖
        </div>

        <div>

          <h2>
            TripMitra AI Assistant
          </h2>

          <p>
            Your personal travel planning
            buddy ✈️
          </p>

        </div>

      </div>


      {/* CHAT */}

      <div className="assistant-chat">

        {messages.map(
          (message, index) => (

            <div
              key={index}
              className={
                message.type === "user"
                  ? "chat-message user-message"
                  : "chat-message assistant-message"
              }
            >

              <div className="message-icon">

                {message.type === "user"
                  ? "👤"
                  : "🤖"}

              </div>


              <div className="message-text">

                {message.text
                  .split("\n")
                  .map(
                    (
                      line,
                      lineIndex
                    ) => (

                      <div
                        key={lineIndex}
                      >
                        {line ||
                          "\u00A0"}
                      </div>

                    )
                  )}

              </div>

            </div>

          )
        )}

      </div>


      {/* QUICK QUESTIONS */}

      <div className="quick-questions">

        <button
          type="button"
          onClick={() =>
            askQuestion(
              "Give me a 3-day itinerary"
            )
          }
        >
          🗓️ 3-Day Itinerary
        </button>


        <button
          type="button"
          onClick={() =>
            askQuestion(
              "What's my budget status?"
            )
          }
        >
          💰 Budget Status
        </button>


        <button
          type="button"
          onClick={() =>
            askQuestion(
              "What activities have I planned?"
            )
          }
        >
          🗺️ My Itinerary
        </button>


        <button
          type="button"
          onClick={() =>
            askQuestion(
              "What should I pack?"
            )
          }
        >
          🎒 Packing List
        </button>


        <button
          type="button"
          onClick={() =>
            askQuestion(
              "How can I save money?"
            )
          }
        >
          💸 Save Money
        </button>


        <button
          type="button"
          onClick={() =>
            askQuestion(
              "What places should I visit?"
            )
          }
        >
          📍 Places to Visit
        </button>

      </div>


      {/* INPUT */}

      <form
        className="assistant-input"
        onSubmit={
          handleSubmit
        }
      >

        <input
          type="text"
          placeholder="Ask TripMitra anything..."
          value={question}
          onChange={(event) =>
            setQuestion(
              event.target.value
            )
          }
        />


        <button type="submit">
          Send 🚀
        </button>

      </form>

    </section>

  );

}

export default TravelAssistant;