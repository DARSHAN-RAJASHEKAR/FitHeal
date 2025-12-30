// ============================================
// Groq AI Configuration
// ============================================

/**
 * SETUP INSTRUCTIONS:
 *
 * 1. Get your FREE Groq API key:
 *    - Visit: https://console.groq.com
 *    - Sign up with Google or email
 *    - Go to "API Keys" section
 *    - Click "Create API Key"
 *    - Copy your key
 *
 * 2. Replace 'YOUR_API_KEY_HERE' below with your actual key
 *
 * 3. IMPORTANT: Keep your API key secure!
 *    - Don't commit this file to public repositories
 *    - Add config.js to .gitignore
 *
 * Free Tier Benefits:
 * - 300+ tokens/second with Llama 3.3 70B
 * - No credit card required
 * - Generous rate limits
 */

const CONFIG = {
    // Replace with your actual Groq API key
    GROQ_API_KEY: 'YOUR_API_KEY_HERE',

    // Model configuration (Llama 3.3 70B - very fast and capable)
    MODEL_NAME: 'llama-3.3-70b-versatile',

    // API endpoint
    API_ENDPOINT: 'https://api.groq.com/openai/v1/chat/completions',

    // Chat configuration
    MAX_TOKENS: 300,  // Maximum response length (reduced for concise responses)
    TEMPERATURE: 0.7,  // Response creativity (0.0 = deterministic, 1.0 = creative)

    // UI configuration
    TYPING_DELAY: 50,  // Milliseconds between typing animation frames
    MAX_MESSAGE_LENGTH: 500,  // Maximum characters in user message
};

// Validation function
function validateConfig() {
    if (CONFIG.GROQ_API_KEY === 'YOUR_API_KEY_HERE') {
        console.warn('⚠️ Please configure your Groq API key in config.js');
        return false;
    }
    return true;
}
