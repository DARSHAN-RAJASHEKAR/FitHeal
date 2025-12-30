# Fitness Calculator Website

A modern, beautiful fitness calculator that computes BMI, BMR, TDEE, and LBM from a single form submission, now with AI-powered chatbot for personalized fitness advice.

## Features

### Fitness Calculations
- **BMI (Body Mass Index)**: Calculates and categorizes your BMI
- **BMR (Basal Metabolic Rate)**: Uses the Mifflin-St Jeor equation
- **TDEE (Total Daily Energy Expenditure)**: Calculates based on BMR and activity level
- **LBM (Lean Body Mass)**: Uses the Boer formula for accurate estimation
- **Personalized Macros**: Calculates your protein, fat, and carb targets

### AI Fitness Coach 🤖 NEW!
- **Powered by Groq AI**: Lightning-fast AI chatbot (300+ tokens/sec)
- **Personalized Advice**: AI knows your fitness metrics and provides tailored guidance
- **Smart Suggestions**: Quick-start questions to help you get started
- **Mobile Responsive**: Works perfectly on all devices
- **Session Privacy**: Chat history cleared on page reload

[📖 **Chatbot Setup Instructions**](CHATBOT_SETUP.md)

## How to Use

1. Visit the live website at: **https://fitheal.darshanrajashekar.dev**
2. Fill in the form with your information:
   - Age
   - Gender
   - Weight (in kg)
   - Height (in cm)
   - Activity Level
   - Fitness Goal (Weight Loss or Weight Gain)
   - Weight Change Rate (0.25 to 1.00 kg/week)
   - Optional: Body measurements for Navy Method body fat calculation
3. Click "Calculate All Metrics"
4. View your comprehensive fitness metrics:
   - BMI (Body Mass Index) with category
   - BMR (Basal Metabolic Rate)
   - TDEE (Total Daily Energy Expenditure)
   - Target Calories for your goal
   - Lean Body Mass
   - Body Fat Percentage (if measurements provided)
   - Weekly weight projection
5. Browse the High-Protein Food List for meal planning (VEG & NON-VEG categories)
6. **NEW:** Chat with AI Fitness Coach for personalized advice (appears after calculation)

## Technologies Used

- HTML5
- CSS3 (with modern gradients and animations)
- Vanilla JavaScript
- Groq API (for AI chatbot with Llama 3.3 70B)

## AI Chatbot Setup

To enable the AI chatbot feature:

1. Get a free API key from [Groq Console](https://console.groq.com)
2. Open `config.js` and replace `YOUR_API_KEY_HERE` with your API key
3. The chatbot will automatically appear after you calculate your fitness metrics

For detailed setup instructions, see [CHATBOT_SETUP.md](CHATBOT_SETUP.md)

## Future Enhancements

- LocalStorage persistence for chat history
- Export chat transcript as PDF
- Voice input/output for chatbot
- Multi-language support
- Additional fitness metrics
- User profiles and history
- Progress tracking

