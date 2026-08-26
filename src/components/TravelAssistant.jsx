import { useState } from "react";

function TravelAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "assistant",
      text: "Hi! 👋 I'm your TripMitra Travel Assistant. Ask me anything about your trip!"
    }
  ]);

  const trip = JSON.parse(
    localStorage.getItem("trip") || "null"
  );

  function generateAnswer(question) {
    const q = question.toLowerCase();

    const destination =
      trip?.destination || "your destination";

    // =========================================
    // ITINERARY
    // =========================================

    if (
      q.includes("itinerary") ||
      q.includes("3 day") ||
      q.includes("3-day") ||
      q.includes("plan my trip")
    ) {
      return `Here's a simple itinerary for ${destination} ✈️

Day 1 🌅
• Explore the main attractions
• Try local food
• Relax in the evening

Day 2 🌴
• Visit popular tourist spots
• Try a local activity
• Enjoy dinner at a local restaurant

Day 3 🌊
• Visit a scenic location
• Shopping / souvenirs
• Relax before your journey home

You can also add these activities to your Trip Itinerary section!`;
    }


    // =========================================
    // PACKING
    // =========================================

    if (
      q.includes("pack") ||
      q.includes("packing") ||
      q.includes("bring")
    ) {
      return `Here's a basic packing checklist 🎒

☐ Clothes
☐ Comfortable shoes
☐ Phone charger
☐ Power bank
☐ ID / important documents
☐ Toiletries
☐ Medicines you normally need
☐ Water bottle
☐ Sunglasses
☐ Small backpack

Don't forget to check the weather before you leave! ☀️`;
    }


    // =========================================
    // BUDGET
    // =========================================

    if (
      q.includes("save money") ||
      q.includes("cheap") ||
      q.includes("budget") ||
      q.includes("saving")
    ) {
      return `Here are some ways to save money on your ${destination} trip 💰

1. Set a daily spending limit.
2. Compare transport options.
3. Eat at local restaurants instead of only tourist spots.
4. Book popular activities in advance when possible.
5. Keep some money aside for emergencies.
6. Track every expense in TripMitra.

Your TripMitra dashboard can help you keep track of your budget!`;
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

You can add your favourite activities to the Trip Itinerary section.`;
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

Tip: Check reviews before choosing a restaurant.`;
    }


    // =========================================
    // DEFAULT
    // =========================================

    return `I'd be happy to help with your ${destination} trip! ✈️

Try asking me:

• "Give me a 3-day itinerary"
• "What should I pack?"
• "How can I save money?"
• "What things should I visit?"
• "What food should I try?"

I'm here to help you plan your trip! 😊`;
  }


  // =========================================
  // SEND MESSAGE
  // =========================================

  function handleSubmit(event) {
    event.preventDefault();

    if (!question.trim()) {
      return;
    }

    const userQuestion = question.trim();

    const answer = generateAnswer(
      userQuestion
    );

    setMessages((currentMessages) => [
      ...currentMessages,

      {
        type: "user",
        text: userQuestion
      },

      {
        type: "assistant",
        text: answer
      }
    ]);

    setQuestion("");
  }


  // =========================================
  // QUICK QUESTIONS
  // =========================================

  function askQuestion(text) {
    setQuestion(text);

    const answer = generateAnswer(text);

    setMessages((currentMessages) => [
      ...currentMessages,

      {
        type: "user",
        text
      },

      {
        type: "assistant",
        text: answer
      }
    ]);
  }


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
            Your personal travel planning buddy ✈️
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
                  .map((line, lineIndex) => (
                    <div key={lineIndex}>
                      {line || "\u00A0"}
                    </div>
                  ))}

              </div>

            </div>

          )
        )}

      </div>


      {/* QUICK QUESTIONS */}

      <div className="quick-questions">

        <button
          onClick={() =>
            askQuestion(
              "Give me a 3-day itinerary"
            )
          }
        >
          🗓️ 3-Day Itinerary
        </button>

        <button
          onClick={() =>
            askQuestion(
              "What should I pack?"
            )
          }
        >
          🎒 Packing List
        </button>

        <button
          onClick={() =>
            askQuestion(
              "How can I save money?"
            )
          }
        >
          💰 Save Money
        </button>

        <button
          onClick={() =>
            askQuestion(
              "What things should I visit?"
            )
          }
        >
          📍 Places to Visit
        </button>

      </div>


      {/* INPUT */}

      <form
        className="assistant-input"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          placeholder="Ask TripMitra anything..."
          value={question}
          onChange={(event) =>
            setQuestion(event.target.value)
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