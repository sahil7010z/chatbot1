document.getElementById('chat-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const input = document.getElementById('user-input');
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage('You', userMessage, 'user');
  input.value = '';  // Clear input field

  addMessage('Bot', 'Thinking...', 'bot');

  try {
    const botReply = await getAnswerFromOpenAI(userMessage);
    updateLastBotMessage(botReply);
    speak(botReply); // Voice response
  } catch (err) {
    updateLastBotMessage("Sorry, something went wrong!");
    console.error("Error fetching bot reply:", err);
  }
});

// Function to add messages to the chat
function addMessage(name, text, role) {
  const container = document.getElementById('chat-messages');
  const msg = document.createElement('div');
  msg.className = `message ${role}`;
  msg.innerHTML = `<strong>${name}:</strong> ${text}`;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

// Function to update the last bot message
function updateLastBotMessage(text) {
  const messages = document.querySelectorAll('.message.bot');
  if (messages.length > 0) {
    messages[messages.length - 1].innerHTML = `<strong>Bot:</strong> ${text}`;
  }
}

// Function to get a response from OpenAI
async function getAnswerFromOpenAI(question) {
  const API_KEY = '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'; // Replace with your actual OpenAI API key

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}` // Ensure Bearer token is correct
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    } else {
      throw new Error("No response received from OpenAI.");
    }
  } catch (err) {
    console.error("Error while fetching data from OpenAI:", err);
    throw new Error("Failed to get a response from OpenAI.");
  }
}

// Function to speak the bot's response using speech synthesis
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
}
