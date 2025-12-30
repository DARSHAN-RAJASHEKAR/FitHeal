// ============================================
// OpenRouter AI Configuration
// ============================================

/**
 * SETUP INSTRUCTIONS:
 *
 * METHOD 1: LOCAL DEVELOPMENT (Using .env file)
 * 1. Get your OpenRouter API key:
 *    - Visit: https://openrouter.ai/
 *    - Sign up with Google or email
 *    - Go to "Keys" section in your account
 *    - Click "Create Key"
 *    - Copy your key (starts with sk-or-v1-...)
 *
 * 2. Add to .env file:
 *    - Open the .env file in this directory
 *    - Replace YOUR_API_KEY_HERE with your actual key
 *    - Save the file
 *    - The .env file is in .gitignore (won't be committed)
 *
 * 3. Set in browser console before using the app:
 *    window.OPENROUTER_API_KEY = 'sk-or-v1-...'
 *    (You need to do this each time you reload the page)
 *
 * METHOD 2: NETLIFY DEPLOYMENT (Production)
 * 1. Go to https://app.netlify.com/
 * 2. Select your site
 * 3. Go to Site settings > Environment variables
 * 4. Add new variable:
 *    - Key: OPENROUTER_API_KEY
 *    - Value: [Your actual API key]
 * 5. Redeploy your site
 * 6. Netlify will inject the API key at build time
 *
 * NOTE: .env files don't work in static HTML sites. For local testing,
 * you must set window.OPENROUTER_API_KEY in browser console.
 *
 * Model Benefits (DeepSeek-V3.2):
 * - High-quality responses with strong reasoning capabilities
 * - Cost-effective pricing
 * - Excellent for fitness and nutrition recommendations
 */

const CONFIG = {
    // API Key - reads from environment variable (set in Netlify dashboard)
    // For local development, you can set it in your browser console or use a local env setup
    API_KEY: (typeof process !== 'undefined' && process.env && process.env.OPENROUTER_API_KEY) ||
             (typeof window !== 'undefined' && window.OPENROUTER_API_KEY) ||
             'YOUR_API_KEY_HERE',

    // Model configuration (DeepSeek-v3.2 - high quality and cost-effective)
    MODEL_NAME: 'deepseek/deepseek-v3.2',

    // API endpoint
    API_ENDPOINT: 'https://openrouter.ai/api/v1/chat/completions',

    // Chat configuration
    MAX_TOKENS: 1000,  // Maximum response length (increased for detailed meal plans)
    TEMPERATURE: 0.7,  // Response creativity (0.0 = deterministic, 1.0 = creative)

    // UI configuration
    TYPING_DELAY: 50,  // Milliseconds between typing animation frames
    MAX_MESSAGE_LENGTH: 500,  // Maximum characters in user message
};

// Validation function
function validateConfig() {
    if (CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
        console.warn('⚠️ Please configure your OpenRouter API key in config.js');
        return false;
    }
    return true;
}
