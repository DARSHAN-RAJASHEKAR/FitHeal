// ============================================
// OpenRouter AI Configuration
// ============================================

/**
 * NETLIFY FUNCTION DEPLOYMENT
 * 
 * The API key is now handled securely by the Netlify Function at /.netlify/functions/chat
 * 
 * SETUP:
 * 1. Go to https://app.netlify.com/
 * 2. Select your site
 * 3. Go to Site settings > Environment variables
 * 4. Add new variable:
 *    - Key: OPENROUTER_API_KEY
 *    - Value: [Your OpenRouter API key from https://openrouter.ai/]
 * 5. Redeploy your site
 * 
 * The frontend no longer handles API keys directly - all requests go through the Netlify Function.
 */

const CONFIG = {
    // Model configuration (DeepSeek-v3.2 - high quality and cost-effective)
    MODEL_NAME: 'deepseek/deepseek-v3.2',

    // Chat configuration
    MAX_TOKENS: 1000,  // Maximum response length (increased for detailed meal plans)
    TEMPERATURE: 0.7,  // Response creativity (0.0 = deterministic, 1.0 = creative)

    // UI configuration
    TYPING_DELAY: 50,  // Milliseconds between typing animation frames
    MAX_MESSAGE_LENGTH: 500,  // Maximum characters in user message
};
