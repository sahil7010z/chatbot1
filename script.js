// Adding the event listener for voice button and regular submit
document.getElementById('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('user-input');
  const question = input.value.trim();
  if (!question) return;

  addMessage('You', question, 'user');
  input.value = '';

  const response = getAnswer(question); // Get answer based on predefined logic
  addMessage('Bot', response, 'bot');
  speak(response); // Read out the response
});

// Voice Input Button
document.getElementById('start-voice').addEventListener('click', startVoiceRecognition);

// Add messages to the chat box
function addMessage(sender, text, role) {
  const chatBox = document.getElementById('chat-box');
  const message = document.createElement('div');
  message.className = 'chat-message';
  message.innerHTML = `<span class="${role}">${sender}:</span> ${text}`;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to start Speech Recognition (Voice to Text)
function startVoiceRecognition() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    addMessage('You', transcript, 'user');
    
    // Get the chatbot's response
    const response = getAnswer(transcript);
    addMessage('Bot', response, 'bot');
    speak(response); // Read out the response
  };

  recognition.onerror = (event) => {
    console.error("Speech Recognition Error: ", event.error);
  };
}

// Predefined answers for specific questions
function getAnswer(query) {
  // Basic rule-based matching
  const lowerCaseQuery = query.toLowerCase();

  if (lowerCaseQuery.includes('hello') || lowerCaseQuery.includes('hi')) {
    return "Hello! How can I assist you today?";
  }
  if (lowerCaseQuery.includes('name')) {
    return "I am your friendly chatbot!";
  }
  if (lowerCaseQuery.includes('how are you')) {
    return "I'm just a bot, but I'm doing great! Thanks for asking.";
  }
  if (lowerCaseQuery.includes('what is your purpose')) {
    return "My purpose is to assist you by answering questions and having a friendly chat!";
  }
  if (lowerCaseQuery.includes('bye')) {
    return "Goodbye! Have a great day!";
  }

  return "Sorry, I don't know the answer to that. Please ask something else!";
}

// Use Speech Synthesis to read out the response
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
}
