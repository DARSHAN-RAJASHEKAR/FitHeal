# AI Chatbot Setup Instructions

## Overview
Your fitness calculator now includes an AI-powered chatbot that provides personalized fitness advice based on the user's calculated metrics.

## Features
- 🤖 **Powered by Groq AI** - Lightning-fast free tier (300+ tokens/sec)
- 💬 **Personalized Advice** - AI knows your fitness metrics (BMI, TDEE, macros, goals)
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ✨ **Smart Suggestions** - Quick-start questions to get you started
- 🔒 **Session Privacy** - Chat history cleared on page reload

## Setup Steps

### 1. Get Your Free Groq API Key

1. Visit **[Groq Console](https://console.groq.com)**
2. Sign up with your Google account or email
3. Navigate to **"API Keys"** in the left sidebar
4. Click **"Create API Key"**
5. Give it a name (e.g., "Fitness Chatbot")
6. Copy your API key

### 2. Configure Your API Key

Open the `config.js` file in your project and replace `YOUR_API_KEY_HERE` with your actual API key:

```javascript
const CONFIG = {
    GROQ_API_KEY: 'your-actual-api-key-here',  // ← Paste your key here
    // ... rest of config
};
```

### 3. Test the Chatbot

1. Open `index.html` in your browser
2. Fill in the fitness calculator form
3. Click "Calculate All Metrics"
4. The chatbot widget will appear in the bottom-right corner
5. Try asking a question like "What foods should I eat to hit my protein goal?"

## Important Security Notes

⚠️ **API Key Security:**
- Your API key is visible in client-side code
- Only use this setup for personal/demo projects
- DO NOT commit `config.js` with your real API key to public repositories
- For production, use a backend server to proxy API requests

### Recommended: Add to .gitignore

If using Git, add this to your `.gitignore` file:

```
config.js
```

Then create a `config.example.js` template:

```javascript
// Copy this to config.js and add your API key
const CONFIG = {
    GROQ_API_KEY: 'YOUR_API_KEY_HERE',
    MODEL_NAME: 'llama-3.3-70b-versatile',
    API_ENDPOINT: 'https://api.groq.com/openai/v1/chat/completions',
    MAX_TOKENS: 500,
    TEMPERATURE: 0.7,
    TYPING_DELAY: 50,
    MAX_MESSAGE_LENGTH: 500,
};
```

## Free Tier Benefits

Groq API free tier includes:
- ✅ **300+ tokens/second** with Llama 3.3 70B model
- ✅ **No credit card required**
- ✅ **Generous rate limits** - perfect for personal fitness coaching
- ✅ **Lightning-fast responses** - one of the fastest AI APIs available

## How It Works

### After Calculation
1. User fills out fitness form and calculates metrics
2. All fitness data (age, gender, weight, BMI, TDEE, macros, etc.) is stored
3. Chatbot widget appears in bottom-right corner
4. Welcome message shows with personalized greeting

### When User Asks a Question
1. User types question and clicks Send
2. Fitness data + user question sent to Groq API
3. AI (Llama 3.3 70B) generates personalized advice based on user's profile
4. Response appears in chat widget (lightning-fast!)

### Context Example
When you ask "What foods should I eat?", the AI knows:
- Your daily calorie target (e.g., 2000 kcal)
- Your protein goal (e.g., 150g)
- Your fitness goal (weight loss/gain/maintenance)
- Your activity level
- Your current BMI and body fat percentage

## Troubleshooting

### Chatbot doesn't appear
- Make sure you've calculated your fitness metrics first
- Check browser console for errors
- Verify API key is configured in `config.js`

### Error: "Invalid API key" or "Unauthorized"
- Double-check you copied the entire API key
- Make sure there are no extra spaces
- Verify the key is active at [Groq Console](https://console.groq.com)

### Error: "Rate limit exceeded"
- You've hit the rate limit temporarily
- Wait a few seconds and try again
- Groq free tier has very generous limits

### Chatbot appears but AI doesn't respond
- Check your internet connection
- Open browser console (F12) to see error details
- Verify the API endpoint URL is correct

## Customization

### Change Welcome Message
Edit `chatbot.js` → `showWelcomeMessage()` function

### Modify Suggested Questions
Edit `chatbot.js` → `showSuggestedQuestions()` function

### Adjust Response Length
Edit `config.js` → `MAX_TOKENS` value (default: 500)

### Change AI Creativity
Edit `config.js` → `TEMPERATURE` value:
- `0.0` = More deterministic/consistent
- `1.0` = More creative/varied

## Features to Try

Ask the chatbot:
- "What foods should I eat to hit my protein goal?"
- "Create a sample meal plan for my calorie target"
- "How should I structure my workouts?"
- "Tips for staying consistent with my goal"
- "What's the best macro ratio for fat loss?"
- "How much water should I drink?"

## Support

If you encounter issues:
1. Check the browser console (F12) for error messages
2. Verify your API key is correct
3. Ensure you have internet connectivity
4. Check [Groq Console](https://console.groq.com) to verify your API key is active

## Future Enhancements

Planned features:
- 💾 LocalStorage persistence (save chat across sessions)
- 📊 Export chat transcript as PDF
- 🎤 Voice input/output
- 🌐 Multi-language support
- 🍎 Integration with food database API

Enjoy your AI fitness coach! 🎉
