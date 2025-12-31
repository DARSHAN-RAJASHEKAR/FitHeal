// ============================================
// AI Fitness Chatbot - Powered by OpenRouter (DeepSeek-V3)
// ============================================

// Chat history storage (session only)
let chatHistory = [];
let isProcessing = false;

// Conversation state for multi-turn interactions
const conversationState = {
    messages: [],              // Full conversation history for API
    awaitingResponse: null,    // Tracks state: 'dietary_preference', 'allergies', or null
    dietaryPreference: null,   // Stores: 'veg', 'non-veg', 'egg-veg', 'vegan'
    allergies: null,           // Stores allergy info or 'none'
    lastIntent: null,          // Tracks detected intent (e.g., 'food_question')
    originalQuestion: null,    // Stores the original user question for context
    dislikedFoods: []          // Track foods user doesn't like
};

// ============================================
// Food Database
// ============================================
const foodDatabase = {
    vegetarian: [
        {
            name: "Milky Mist Fresh Paneer",
            kcal: 265,
            protein: 18,
            carbs: 3,
            fat: 20,
            servingSize: "100g",
            link: "https://shop.milkymist.com/pn/fresh-paneer/pid/3519870"
        },
        {
            name: "Milky Mist High Protein - Low Fat Paneer",
            kcal: 204,
            protein: 25,
            carbs: 6,
            fat: 9,
            servingSize: "100g",
            link: "https://shop.milkymist.com/pn/high-protien-paneer/pid/3892403"
        },
        {
            name: "Mill'D Protein Atta",
            kcal: 387,
            protein: 46,
            carbs: 45,
            fat: 2,
            servingSize: "100g",
            link: "https://milld.com/products/milld-high-protein-atta-1kg?variant=50830533951704"
        },
        {
            name: "Milky Mist Greek Yogurt Natural",
            kcal: 74,
            protein: 7,
            carbs: 7,
            fat: 2,
            servingSize: "100g",
            link: "https://shop.milkymist.com/pn/greek-yogurt-natural/pid/3519837"
        },
        {
            name: "Milky Mist Skyr Yogurt",
            kcal: 100,
            protein: 12,
            carbs: 10,
            fat: 2,
            servingSize: "100g",
            link: "https://shop.milkymist.com/pn/skyr-yogurt/pid/3519887"
        },
        {
            name: "Athena Greek Yogurt High Protein",
            kcal: 99,
            protein: 11,
            carbs: 6,
            fat: 4,
            servingSize: "100g",
            link: "https://www.athenaprotein.com/products/high-protein-plain"
        },
        {
            name: "Masoor Dal Whole (cooked)",
            kcal: 115,
            protein: 8,
            carbs: 20,
            fat: 0,
            servingSize: "100g",
            link: "https://www.tatanutrikorner.com/products/tata-sampann-masoor-dal-whole"
        },
        {
            name: "Moong Dal (cooked)",
            kcal: 110,
            protein: 8,
            carbs: 19,
            fat: 0,
            servingSize: "100g",
            link: "https://www.tatanutrikorner.com/products/tata-sampann-moong-dal"
        },
        {
            name: "Urad Dal Kali (cooked)",
            kcal: 112,
            protein: 8,
            carbs: 20,
            fat: 1,
            servingSize: "100g",
            link: "https://www.tatanutrikorner.com/products/tata-sampann-urad-dal-kali"
        },
        {
            name: "Kabuli Chana (cooked)",
            kcal: 123,
            protein: 8,
            carbs: 21,
            fat: 2,
            servingSize: "100g",
            link: "https://www.tatanutrikorner.com/products/tata-sampann-kabooli-chana"
        },
        {
            name: "Organic Red Rajma (cooked)",
            kcal: 123,
            protein: 8,
            carbs: 21,
            fat: 1,
            servingSize: "100g",
            link: "https://www.tatanutrikorner.com/products/tata-sampann-organic-red-rajma"
        },
        {
            name: "Briyas Tofu Soy Paneer",
            kcal: 140,
            protein: 15.6,
            carbs: 7,
            fat: 5,
            servingSize: "100g",
            link: "https://shop.milkymist.com/pn/tofu-soy-paneer/pid/3519776"
        },
        {
            name: "Nutrela Soya Chunks (uncooked)",
            kcal: 350,
            protein: 52,
            carbs: 33,
            fat: 0.5,
            servingSize: "100g",
            link: "https://mynutrela.com/soya-chunks/"
        },
        {
            name: "Quinoa (cooked)",
            kcal: 120,
            protein: 4,
            carbs: 21,
            fat: 2,
            servingSize: "100g"
        },
        {
            name: "Almonds",
            kcal: 170,
            protein: 6,
            carbs: 6,
            fat: 15,
            servingSize: "30g"
        },
        {
            name: "Milk",
            kcal: 149,
            protein: 8,
            carbs: 12,
            fat: 8,
            servingSize: "1 cup (240ml)"
        },
        {
            name: "Peanut Butter",
            kcal: 188,
            protein: 8,
            carbs: 7,
            fat: 16,
            servingSize: "2 tbsp (32g)"
        },
        {
            name: "Whey Protein Powder",
            kcal: 120,
            protein: 24,
            carbs: 3,
            fat: 1,
            servingSize: "1 scoop (30g)"
        }
    ],
    nonVegetarian: [
        {
            name: "Chicken Breast",
            kcal: 165,
            protein: 31,
            carbs: 0,
            fat: 4,
            servingSize: "100g"
        },
        {
            name: "Eggs",
            kcal: 72,
            protein: 6,
            carbs: 0,
            fat: 5,
            servingSize: "1 large"
        },
        {
            name: "Salmon",
            kcal: 208,
            protein: 25,
            carbs: 0,
            fat: 13,
            servingSize: "100g"
        },
        {
            name: "Tuna",
            kcal: 132,
            protein: 30,
            carbs: 0,
            fat: 1,
            servingSize: "100g"
        },
        {
            name: "Turkey Breast",
            kcal: 135,
            protein: 29,
            carbs: 0,
            fat: 1,
            servingSize: "100g"
        },
        {
            name: "Prawns",
            kcal: 99,
            protein: 24,
            carbs: 0,
            fat: 0,
            servingSize: "100g"
        },
        {
            name: "Fish (Tilapia)",
            kcal: 129,
            protein: 26,
            carbs: 0,
            fat: 3,
            servingSize: "100g"
        },
        {
            name: "Lamb",
            kcal: 294,
            protein: 25,
            carbs: 0,
            fat: 21,
            servingSize: "100g"
        },
        {
            name: "Lean Beef",
            kcal: 250,
            protein: 26,
            carbs: 0,
            fat: 17,
            servingSize: "100g"
        },
        {
            name: "Pork Chop",
            kcal: 231,
            protein: 27,
            carbs: 0,
            fat: 13,
            servingSize: "100g"
        }
    ]
};

// Filter food list based on dietary preferences, allergies, and dislikes
function getFilteredFoodList(dietaryPreference, allergies, dislikedFoods = []) {
    let availableFoods = [];

    // Filter by dietary preference
    if (dietaryPreference === 'veg') {
        // Vegetarian: only vegetarian foods, exclude eggs
        availableFoods = [...foodDatabase.vegetarian];
    } else if (dietaryPreference === 'egg-veg') {
        // Egg-vegetarian: vegetarian foods + eggs
        availableFoods = [...foodDatabase.vegetarian];
        const eggs = foodDatabase.nonVegetarian.find(food => food.name === 'Eggs');
        if (eggs) {
            availableFoods.push(eggs);
        }
    } else if (dietaryPreference === 'non-veg') {
        // Non-vegetarian: vegetarian foods + chicken + eggs only
        availableFoods = [...foodDatabase.vegetarian];

        // Add only chicken and eggs from non-veg options
        const chicken = foodDatabase.nonVegetarian.find(food => food.name === 'Chicken Breast');
        const eggs = foodDatabase.nonVegetarian.find(food => food.name === 'Eggs');

        if (chicken) availableFoods.push(chicken);
        if (eggs) availableFoods.push(eggs);
    } else if (dietaryPreference === 'vegan') {
        // Vegan: exclude all dairy, eggs, and animal products
        availableFoods = foodDatabase.vegetarian.filter(food => {
            const nameLower = food.name.toLowerCase();
            return !nameLower.includes('paneer') &&
                   !nameLower.includes('yogurt') &&
                   !nameLower.includes('milk') &&
                   !nameLower.includes('dairy');
        });
    }

    // Filter out allergens
    if (allergies && allergies !== 'none') {
        const allergyKeywords = allergies.toLowerCase().split(',').map(a => a.trim());
        availableFoods = availableFoods.filter(food => {
            const foodNameLower = food.name.toLowerCase();
            return !allergyKeywords.some(allergen => foodNameLower.includes(allergen));
        });
    }

    // Filter out disliked foods
    if (dislikedFoods.length > 0) {
        availableFoods = availableFoods.filter(food => {
            return !dislikedFoods.some(disliked =>
                food.name.toLowerCase().includes(disliked.toLowerCase()) ||
                disliked.toLowerCase().includes(food.name.toLowerCase())
            );
        });
    }

    return availableFoods;
}

// ============================================
// Initialize Chatbot
// ============================================
function initializeChatbot() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');
    const minimizeBtn = document.querySelector('.chat-minimize-btn');

    // Send message on button click
    sendBtn.addEventListener('click', () => {
        sendMessage();
    });

    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Minimize/expand chatbot
    minimizeBtn.addEventListener('click', toggleChatbot);

    console.log('✅ Chatbot initialized');
}

// ============================================
// Show Chatbot (after calculation)
// ============================================
function showChatbot() {
    const widget = document.getElementById('chatbot-widget');

    if (!widget) {
        console.error('Chatbot widget not found');
        return;
    }

    widget.classList.remove('hidden');
    widget.classList.add('visible');

    // Show welcome message if this is first time
    if (chatHistory.length === 0) {
        showWelcomeMessage();
    }
}

// ============================================
// Hide Chatbot
// ============================================
function hideChatbot() {
    const widget = document.getElementById('chatbot-widget');
    if (widget) {
        widget.classList.remove('visible');
        widget.classList.add('hidden');
    }

    // Clear chat history
    chatHistory = [];
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
        messagesContainer.innerHTML = '';
    }
}

// ============================================
// Toggle Chatbot (minimize/expand)
// ============================================
function toggleChatbot() {
    const widget = document.getElementById('chatbot-widget');
    const messages = document.querySelector('.chat-messages');
    const inputArea = document.querySelector('.chat-input-area');
    const minimizeBtn = document.querySelector('.chat-minimize-btn');

    if (widget.classList.contains('minimized')) {
        // Expand
        widget.classList.remove('minimized');
        messages.style.display = 'flex';
        inputArea.style.display = 'flex';
        minimizeBtn.textContent = '−';
    } else {
        // Minimize
        widget.classList.add('minimized');
        messages.style.display = 'none';
        inputArea.style.display = 'none';
        minimizeBtn.textContent = '+';
    }
}

// ============================================
// Show Welcome Message
// ============================================
function showWelcomeMessage() {
    const { userData, calculatedMetrics } = fitnessContext;

    if (!userData || !calculatedMetrics) {
        return;
    }

    // Create personalized welcome message
    const goalText = userData.goal === 'weight_loss' ? 'weight loss' :
                     userData.goal === 'weight_gain' ? 'weight gain' : 'staying healthy';

    const welcomeMsg = `Hi! I've reviewed your fitness profile. Your goal is ${goalText} with a target of ${calculatedMetrics.dailyKcal} kcal/day. I'm here to help you achieve your fitness goals! Ask me anything about nutrition, workouts, or your personalized plan.`;

    displayMessage('ai', welcomeMsg);

    // Show suggested questions
    showSuggestedQuestions();
}

// ============================================
// Show Suggested Questions
// ============================================
function showSuggestedQuestions() {
    const suggestions = [
        "What foods should I eat to hit my protein goal?",
        "How should I structure my workouts?",
        "Can you create a sample meal plan?",
        "How do I stay consistent with my goal?"
    ];

    const suggestionsHTML = `
        <div class="suggestions">
            <p class="suggestions-title">Quick questions:</p>
            ${suggestions.map(q => `
                <button class="suggestion-btn" onclick="askSuggestion('${q}')">${q}</button>
            `).join('')}
        </div>
    `;

    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.insertAdjacentHTML('beforeend', suggestionsHTML);
    scrollToBottom();
}

// ============================================
// Ask Suggested Question
// ============================================
function askSuggestion(question) {
    // Remove suggestions
    const suggestions = document.querySelector('.suggestions');
    if (suggestions) {
        suggestions.remove();
    }

    // Set input and send
    const chatInput = document.getElementById('chatInput');
    chatInput.value = question;
    sendMessage();
}

// ============================================
// Detect Food Dislike
// ============================================
function detectFoodDislike(message) {
    const dislikePatterns = [
        /(?:i )?don'?t like (.+)/i,
        /(?:i )?hate (.+)/i,
        /(?:i )?can'?t stand (.+)/i,
        /(?:i )?don'?t want (.+)/i,
        /(?:i'm|i am) not a fan of (.+)/i,
        /(?:i )?dislike (.+)/i,
        /not (.+)/i,
        /avoid (.+)/i,
        /skip (.+)/i,
        /without (.+)/i,
        /except (.+)/i,
        /remove (.+)/i
    ];

    for (const pattern of dislikePatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
            const foodName = match[1].trim();
            // Clean up common suffixes
            const cleaned = foodName.replace(/\s+(please|plz|thanks|thank you)$/i, '').trim();
            return cleaned;
        }
    }

    return null;
}

// ============================================
// Send Message
// ============================================
async function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();

    // Validation
    if (!message) return;
    if (isProcessing) return;
    if (message.length > CONFIG.MAX_MESSAGE_LENGTH) {
        alert(`Message too long! Maximum ${CONFIG.MAX_MESSAGE_LENGTH} characters.`);
        return;
    }

    // Check if fitness data is available
    if (!fitnessContext.isCalculated) {
        displayMessage('ai', 'Please calculate your fitness metrics first before asking questions.');
        return;
    }

    // Clear input
    chatInput.value = '';
    isProcessing = true;

    // Display user message
    displayMessage('user', message);

    // Add to history
    chatHistory.push({ role: 'user', message, timestamp: Date.now() });

    // Check if user is expressing a food dislike
    const dislikedFood = detectFoodDislike(message);
    if (dislikedFood && conversationState.dietaryPreference) {
        // User is expressing a dislike for a food
        if (!conversationState.dislikedFoods.includes(dislikedFood)) {
            conversationState.dislikedFoods.push(dislikedFood);
            console.log('🚫 Added to disliked foods:', dislikedFood);
        }

        // Regenerate food recommendations without the disliked food
        conversationState.lastIntent = 'food_dislike';
        conversationState.originalQuestion = 'What foods should I eat to hit my protein goal?';

        const prompt = buildFoodPrompt(
            conversationState.dietaryPreference,
            conversationState.allergies,
            conversationState.originalQuestion
        );

        conversationState.messages.push({ role: 'user', content: message });

        showTypingIndicator();

        try {
            const response = await callAI(prompt);
            hideTypingIndicator();
            displayMessage('ai', response);

            conversationState.messages.push({ role: 'assistant', content: response });
            chatHistory.push({ role: 'ai', message: response, timestamp: Date.now() });

            if (conversationState.messages.length > 20) {
                conversationState.messages = conversationState.messages.slice(-20);
            }
        } catch (error) {
            hideTypingIndicator();
            handleError(error);
        } finally {
            isProcessing = false;
            chatInput.focus();
        }
        return;
    }

    // Check if we're in middle of dietary preference collection
    if (conversationState.awaitingResponse) {
        console.log('🔷 sendMessage: awaitingResponse =', conversationState.awaitingResponse);

        // If awaiting allergy response, handle the typed response
        if (conversationState.awaitingResponse === 'allergies') {
            console.log('🔷 sendMessage: Processing allergy response:', message);
            handleAllergyResponse(message);
            return;
        }

        // If awaiting dietary preference, user must click buttons, not type
        if (conversationState.awaitingResponse === 'dietary_preference') {
            // Check if it's a context switch (asking about something else)
            const nonFoodKeywords = ['workout', 'exercise', 'training', 'cardio', 'lift', 'gym', 'run'];
            const isContextSwitch = nonFoodKeywords.some(kw => message.toLowerCase().includes(kw));

            if (isContextSwitch) {
                // User wants to change topic - abandon preference collection
                removeInteractiveElements();
                conversationState.awaitingResponse = null;
                conversationState.lastIntent = null;
            } else {
                // User is still trying to talk about food - ignore typed message, wait for button clicks
                isProcessing = false;
                chatInput.focus();
                return;
            }
        }
    }

    // Detect food intent for new questions
    if (detectFoodIntent(message) && !conversationState.dietaryPreference) {
        // This is a food question and we don't have dietary preferences yet
        conversationState.lastIntent = 'food_question';
        conversationState.originalQuestion = message;  // Store the original question
        askDietaryPreference();
        isProcessing = false;
        return;
    } else if (detectFoodIntent(message) && conversationState.dietaryPreference) {
        // Food question but we already have preferences - use them
        const prompt = buildFoodPrompt(
            conversationState.dietaryPreference,
            conversationState.allergies,
            message
        );

        // Add original question to conversation
        conversationState.messages.push({ role: 'user', content: message });

        // Show typing and call API
        showTypingIndicator();

        try {
            const response = await callAI(prompt);
            hideTypingIndicator();
            displayMessage('ai', response);

            conversationState.messages.push({ role: 'assistant', content: response });
            chatHistory.push({ role: 'ai', message: response, timestamp: Date.now() });

            if (conversationState.messages.length > 20) {
                conversationState.messages = conversationState.messages.slice(-20);
            }
        } catch (error) {
            hideTypingIndicator();
            handleError(error);
        } finally {
            isProcessing = false;
            chatInput.focus();
        }
        return;
    }

    // Normal conversation flow with memory
    showTypingIndicator();

    try {
        // Add user message to conversation state
        conversationState.messages.push({ role: 'user', content: message });

        // Call AI API with conversation history
        const response = await callAI(message);

        // Hide typing indicator
        hideTypingIndicator();

        // Display AI response
        displayMessage('ai', response);

        // Add AI response to conversation state
        conversationState.messages.push({ role: 'assistant', content: response });

        // Add to history (for UI display)
        chatHistory.push({ role: 'ai', message: response, timestamp: Date.now() });

        // Trim history if too long (keep last 20 messages)
        if (conversationState.messages.length > 20) {
            conversationState.messages = conversationState.messages.slice(-20);
        }

    } catch (error) {
        hideTypingIndicator();
        handleError(error);
    } finally {
        isProcessing = false;
        chatInput.focus();
    }
}

// ============================================
// Build System Prompt with Context
// ============================================
function buildSystemPrompt() {
    const context = buildAIContext();

    const prompt = `You are a knowledgeable fitness coach and nutritionist. You are helping a user with their fitness journey.

${context}

IMPORTANT INSTRUCTIONS:
- Keep responses CONCISE (2-3 short paragraphs maximum, under 200 words)
- Use bullet points for lists (use * or - for bullets)
- Use ONE level of bullets only (no nested sub-bullets)
- Format as: intro text, then bullet list, then conclusion
- Be practical and actionable
- Avoid repetition
- Use simple language and avoid medical jargon

Provide helpful, personalized advice based on their fitness profile.`;

    return prompt;
}

// ============================================
// Build AI Context from Fitness Data
// ============================================
function buildAIContext() {
    const { userData, calculatedMetrics } = fitnessContext;

    if (!userData || !calculatedMetrics) {
        return 'No fitness data available.';
    }

    // Helper to get activity level description
    const getActivityDesc = (level) => {
        const levels = {
            1.2: 'Sedentary (little or no exercise)',
            1.375: 'Lightly Active (light exercise 1-3 days/week)',
            1.55: 'Moderately Active (moderate exercise 3-5 days/week)',
            1.725: 'Very Active (hard exercise 6-7 days/week)',
            1.9: 'Extra Active (very hard exercise, physical job)'
        };
        return levels[level] || 'Unknown';
    };

    // Helper to get BMI category
    const getBMICat = (bmi) => {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal Weight';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    };

    // Helper to get goal description
    const getGoalDesc = (goal) => {
        if (goal === 'weight_loss') return 'Weight Loss';
        if (goal === 'weight_gain') return 'Weight Gain';
        return 'Stay Healthy (Maintenance)';
    };

    const context = `
User Fitness Profile:
- Age: ${userData.age} years old
- Gender: ${userData.gender}
- Current Weight: ${userData.weight} kg
- Height: ${userData.height} cm
- Activity Level: ${getActivityDesc(userData.activityLevel)}
- Fitness Goal: ${getGoalDesc(userData.goal)}
${userData.rate ? `- Target Weight Change: ${userData.rate} kg/week` : ''}

Calculated Metrics:
- BMI: ${calculatedMetrics.bmi.toFixed(1)} (${getBMICat(calculatedMetrics.bmi)})
- BMR (Basal Metabolic Rate): ${calculatedMetrics.bmr} kcal/day
- TDEE (Total Daily Energy Expenditure): ${calculatedMetrics.tdee} kcal/day
- Body Fat Percentage: ${calculatedMetrics.bodyFatPercent.toFixed(1)}% (using ${calculatedMetrics.bodyFatMethod})
- Lean Body Mass: ${calculatedMetrics.lbmFromBodyFat} kg

Personalized Nutrition Plan:
- Daily Calorie Target: ${calculatedMetrics.dailyKcal} kcal
- Protein: ${calculatedMetrics.protein}g (${(calculatedMetrics.protein * 4)} kcal)
- Fat: ${calculatedMetrics.fat}g (${(calculatedMetrics.fat * 9)} kcal)
- Carbohydrates: ${calculatedMetrics.carbs}g (${(calculatedMetrics.carbs * 4)} kcal)

Please provide advice tailored to this specific profile.`;

    return context;
}

// ============================================
// Build Food List Context for AI
// ============================================
function buildFoodListContext(dietaryPreference, allergies) {
    const foods = getFilteredFoodList(dietaryPreference, allergies, conversationState.dislikedFoods);

    if (foods.length === 0) {
        return "No specific foods available for your dietary restrictions.";
    }

    let context = "AVAILABLE FOOD LIST (use these for recommendations):\n\n";

    foods.forEach((food, index) => {
        context += `${index + 1}. ${food.name} (${food.servingSize})\n`;
        context += `   - Calories: ${food.kcal} kcal\n`;
        context += `   - Protein: ${food.protein}g | Carbs: ${food.carbs}g | Fat: ${food.fat}g\n`;
        if (food.link) {
            context += `   - Product Link: ${food.link}\n`;
        }
        context += '\n';
    });

    return context;
}

// ============================================
// Detect Food-Related Questions
// ============================================
function detectFoodIntent(message) {
    const foodKeywords = [
        'food', 'meal', 'eat', 'diet', 'nutrition', 'recipe', 'breakfast',
        'lunch', 'dinner', 'snack', 'protein', 'calories', 'cook', 'dish',
        'vegetarian', 'vegan', 'non-veg', 'plan', 'menu', 'carb', 'fat',
        'macro', 'calorie', 'intake', 'consume', 'grocery', 'ingredient'
    ];

    const messageLower = message.toLowerCase();

    // Check for food-related keywords
    const hasFoodKeyword = foodKeywords.some(keyword =>
        messageLower.includes(keyword)
    );

    // Check for question patterns
    const isQuestion = messageLower.includes('?') ||
                      messageLower.startsWith('what') ||
                      messageLower.startsWith('which') ||
                      messageLower.startsWith('how') ||
                      messageLower.startsWith('can') ||
                      messageLower.includes('should i') ||
                      messageLower.includes('can i') ||
                      messageLower.includes('give me') ||
                      messageLower.includes('suggest') ||
                      messageLower.includes('recommend');

    return hasFoodKeyword && isQuestion;
}

// ============================================
// Call AI API (OpenRouter / DeepSeek)
// ============================================
async function callAI(userMessage, includeHistory = true) {
    console.log('🔷 callAI called with message:', userMessage.substring(0, 100) + '...');
    console.log('🔷 includeHistory:', includeHistory);
    console.log('🔷 conversationState.messages.length:', conversationState.messages.length);

    // Build messages array with history
    const messages = [];

    // Add system message with fitness context (only if starting conversation or no history)
    if (conversationState.messages.length === 0 || !includeHistory) {
        messages.push({
            role: "system",
            content: buildSystemPrompt()
        });
    }

    // Add conversation history if requested
    if (includeHistory && conversationState.messages.length > 0) {
        messages.push({
            role: "system",
            content: buildSystemPrompt()
        });
        messages.push(...conversationState.messages);
    }

    // Add current user message
    messages.push({
        role: "user",
        content: userMessage
    });

    console.log('🔷 Built messages array, total messages:', messages.length);

    const requestBody = {
        messages: messages,
    };

    console.log('🔷 Sending request to Netlify Function...');
    const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    console.log('🔷 API response status:', response.status);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || error.message || 'API request failed');
    }

    const data = await response.json();
    console.log('🔷 API response received successfully');

    // Extract text from response (OpenAI-compatible format)
    if (data.choices && data.choices.length > 0) {
        const content = data.choices[0].message.content;
        console.log('🔷 Extracted content from API response');
        return content;
    }

    throw new Error('Invalid API response format');
}

// ============================================
// Simple Markdown to HTML Converter
// ============================================
function parseMarkdown(text) {
    // Convert ** bold ** to <strong>
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Split by double line breaks to identify paragraphs
    const lines = text.split('\n');
    let inList = false;
    let result = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check if line is a bullet point
        if (line.trim().match(/^[*-]\s+(.+)/)) {
            if (!inList) {
                result.push('<ul>');
                inList = true;
            }
            const content = line.trim().replace(/^[*-]\s+/, '');
            result.push(`<li>${content}</li>`);
        } else {
            // Not a bullet point
            if (inList) {
                result.push('</ul>');
                inList = false;
            }
            if (line.trim()) {
                result.push(line);
            }
        }
    }

    // Close list if still open
    if (inList) {
        result.push('</ul>');
    }

    // Join with line breaks
    text = result.join('<br>');

    // Clean up extra <br> tags around lists
    text = text.replace(/<br><ul>/g, '<ul>');
    text = text.replace(/<\/ul><br>/g, '</ul>');
    text = text.replace(/<br><\/ul>/g, '</ul>');

    return text;
}

// ============================================
// Display Message in Chat
// ============================================
function displayMessage(role, message) {
    const messagesContainer = document.getElementById('chatMessages');

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🤖';

    const content = document.createElement('div');
    content.className = 'message-content';

    // For AI messages, parse Markdown. For user messages, use plain text
    if (role === 'ai') {
        content.innerHTML = parseMarkdown(message);
    } else {
        content.textContent = message;
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    messagesContainer.appendChild(messageDiv);

    scrollToBottom();
}

// ============================================
// Show Typing Indicator
// ============================================
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');

    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai-message typing-indicator';
    typingDiv.id = 'typing-indicator';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '🤖';

    const content = document.createElement('div');
    content.className = 'message-content typing-dots';
    content.innerHTML = '<span></span><span></span><span></span>';

    typingDiv.appendChild(avatar);
    typingDiv.appendChild(content);

    messagesContainer.appendChild(typingDiv);

    scrollToBottom();
}

// ============================================
// Hide Typing Indicator
// ============================================
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// ============================================
// Scroll to Bottom of Chat
// ============================================
function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// ============================================
// Interactive UI Components
// ============================================

// Remove Interactive Elements
function removeInteractiveElements() {
    const interactive = document.querySelectorAll('[data-interactive="true"]');
    interactive.forEach(el => el.remove());
}

// Display Choice Buttons
function displayChoiceButtons(choices, onSelect, message = null) {
    const messagesContainer = document.getElementById('chatMessages');

    // Display AI question if provided
    if (message) {
        displayMessage('ai', message);
    }

    // Create buttons container
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'chat-message ai-message';
    buttonsDiv.setAttribute('data-interactive', 'true');

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '🤖';

    const content = document.createElement('div');
    content.className = 'message-content choice-buttons-container';

    choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'choice-button';
        button.textContent = choice.label;
        button.onclick = () => {
            onSelect(choice.value);
            removeInteractiveElements();
        };
        content.appendChild(button);
    });

    buttonsDiv.appendChild(avatar);
    buttonsDiv.appendChild(content);
    messagesContainer.appendChild(buttonsDiv);
    scrollToBottom();
}

// Display Allergy Input
function displayAllergyInput() {
    console.log('🔷 displayAllergyInput called');
    const messagesContainer = document.getElementById('chatMessages');

    displayMessage('ai', 'Do you have any food allergies I should know about?');

    const inputDiv = document.createElement('div');
    inputDiv.className = 'chat-message ai-message';
    inputDiv.setAttribute('data-interactive', 'true');

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '🤖';

    const content = document.createElement('div');
    content.className = 'message-content allergy-input-container';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'allergy-input';
    input.placeholder = 'e.g., nuts, dairy, shellfish...';
    input.id = 'allergyInput';

    const buttonsRow = document.createElement('div');
    buttonsRow.className = 'allergy-buttons-row';

    const submitBtn = document.createElement('button');
    submitBtn.className = 'allergy-submit-btn';
    submitBtn.textContent = 'Submit';
    submitBtn.onclick = () => {
        console.log('🔷 Submit button clicked');
        const allergies = input.value.trim();
        if (allergies) {
            handleAllergyResponse(allergies);
        }
    };

    const noneBtn = document.createElement('button');
    noneBtn.className = 'allergy-none-btn';
    noneBtn.textContent = 'None';
    noneBtn.onclick = () => {
        console.log('🔷 None button clicked');
        handleAllergyResponse('none');
    };

    // Allow Enter key to submit
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const allergies = input.value.trim();
            if (allergies) {
                handleAllergyResponse(allergies);
            } else {
                handleAllergyResponse('none');
            }
        }
    });

    buttonsRow.appendChild(submitBtn);
    buttonsRow.appendChild(noneBtn);
    content.appendChild(input);
    content.appendChild(buttonsRow);

    inputDiv.appendChild(avatar);
    inputDiv.appendChild(content);
    messagesContainer.appendChild(inputDiv);
    scrollToBottom();

    // Focus the input
    setTimeout(() => input.focus(), 100);
}

// Get Dietary Label
function getDietaryLabel(value) {
    const labels = {
        'veg': 'Vegetarian',
        'non-veg': 'Non-Vegetarian',
        'egg-veg': 'Egg + Vegetarian',
        'vegan': 'Vegan'
    };
    return labels[value] || value;
}

// ============================================
// Preference Collection Functions
// ============================================

// Ask Dietary Preference
function askDietaryPreference() {
    conversationState.awaitingResponse = 'dietary_preference';

    const choices = [
        { label: '🌱 Vegetarian', value: 'veg' },
        { label: '🍖 Non-Vegetarian', value: 'non-veg' },
        { label: '🥚 Egg + Veg', value: 'egg-veg' },
        { label: '🌿 Vegan', value: 'vegan' }
    ];

    displayChoiceButtons(
        choices,
        handleDietaryChoice,
        'Before I recommend foods, what is your dietary preference?'
    );

    // Reset isProcessing flag so allergy response can proceed
    console.log('🔷 Resetting isProcessing flag in askDietaryPreference');
    isProcessing = false;
}

// Handle Dietary Choice
function handleDietaryChoice(choice) {
    console.log('🔷 handleDietaryChoice called with:', choice);
    conversationState.dietaryPreference = choice;
    displayMessage('user', getDietaryLabel(choice));

    // Add to conversation history
    chatHistory.push({ role: 'user', message: getDietaryLabel(choice), timestamp: Date.now() });
    conversationState.messages.push({ role: 'user', content: getDietaryLabel(choice) });

    // Move to allergy question - just ask via chat, no interactive elements
    conversationState.awaitingResponse = 'allergies';
    console.log('🔷 Moving to allergy question, state:', conversationState.awaitingResponse);

    // Ask about allergies via regular chat message
    const allergyQuestion = 'Do you have any food allergies I should know about?';
    displayMessage('ai', allergyQuestion);
    conversationState.messages.push({ role: 'assistant', content: allergyQuestion });
    chatHistory.push({ role: 'ai', message: allergyQuestion, timestamp: Date.now() });
}

// Handle Allergy Response
function handleAllergyResponse(allergies) {
    console.log('🔷 handleAllergyResponse called with:', allergies);
    console.log('🔷 isProcessing flag BEFORE check:', isProcessing);

    // Note: isProcessing is already set to true in sendMessage()
    // Store allergy information
    conversationState.allergies = allergies.toLowerCase() === 'none' ? 'none' : allergies;
    conversationState.awaitingResponse = null;
    console.log('🔷 Updated state - allergies:', conversationState.allergies);
    console.log('🔷 Updated state - awaitingResponse:', conversationState.awaitingResponse);

    // Note: User message already displayed in sendMessage() and added to chatHistory
    // Just add to conversationState.messages for API
    conversationState.messages.push({
        role: 'user',
        content: allergies.toLowerCase() === 'none' ? 'No allergies' : allergies
    });

    console.log('🔷 Calling generateFoodRecommendation...');
    // Now generate food recommendations with full context
    generateFoodRecommendation();
}

// Generate Food Recommendation
async function generateFoodRecommendation() {
    console.log('🔷 generateFoodRecommendation started');
    console.log('🔷 Dietary preference:', conversationState.dietaryPreference);
    console.log('🔷 Allergies:', conversationState.allergies);
    console.log('🔷 Original question:', conversationState.originalQuestion);
    console.log('🔷 Disliked foods:', conversationState.dislikedFoods);

    showTypingIndicator();

    // Build enhanced prompt with dietary preferences
    const prompt = buildFoodPrompt(
        conversationState.dietaryPreference,
        conversationState.allergies,
        conversationState.originalQuestion || ''
    );

    console.log('🔷 Built prompt for API call');

    try {
        // Add prompt to conversation history
        conversationState.messages.push({ role: 'user', content: prompt });
        console.log('🔷 Added prompt to conversation history');

        console.log('🔷 Calling AI API...');
        const response = await callAI(prompt);
        console.log('🔷 Received response from API:', response.substring(0, 100) + '...');

        hideTypingIndicator();
        displayMessage('ai', response);

        // Add AI response to conversation history
        conversationState.messages.push({ role: 'assistant', content: response });
        chatHistory.push({ role: 'ai', message: response, timestamp: Date.now() });

        // Trim history if too long
        if (conversationState.messages.length > 20) {
            conversationState.messages = conversationState.messages.slice(-20);
        }
        console.log('✅ Food recommendation completed successfully');
    } catch (error) {
        console.error('❌ Error in generateFoodRecommendation:', error);
        hideTypingIndicator();
        handleError(error);
    } finally {
        // Reset processing flag
        isProcessing = false;
        console.log('🔷 Reset isProcessing = false in generateFoodRecommendation');

        // Re-focus input for next message
        const chatInput = document.getElementById('chatInput');
        if (chatInput) chatInput.focus();
    }
}

// Build Food Prompt with Preferences
function buildFoodPrompt(dietary, allergies, userQuestion = '') {
    const allergyText = allergies === 'none' ? 'No allergies' : `Allergies: ${allergies}`;
    const foodListContext = buildFoodListContext(dietary, allergies);
    const { userData, calculatedMetrics } = fitnessContext;

    const goalText = userData.goal === 'weight_loss' ? 'Weight Loss' :
                     userData.goal === 'weight_gain' ? 'Weight Gain' : 'Stay Healthy (Maintenance)';

    // Calculate target protein with tolerance
    const proteinTarget = calculatedMetrics.protein;
    const proteinMin = Math.round(proteinTarget * 0.95);
    const proteinMax = Math.round(proteinTarget * 1.05);

    // Build disliked foods context
    let dislikedContext = '';
    if (conversationState.dislikedFoods.length > 0) {
        dislikedContext = `\n**FOODS USER DISLIKES (DO NOT INCLUDE):**\n`;
        conversationState.dislikedFoods.forEach(food => {
            dislikedContext += `- ${food}\n`;
        });
        dislikedContext += '\n';
    }

    // Detect if user is asking for food recommendations vs meal plan
    const questionLower = userQuestion.toLowerCase();
    const isFoodListQuestion = questionLower.includes('what') &&
                              (questionLower.includes('food') || questionLower.includes('eat')) &&
                              (questionLower.includes('protein') || questionLower.includes('hit'));

    const isSimpleFoodQuestion = questionLower.includes('what food') ||
                                 questionLower.includes('which food') ||
                                 (questionLower.includes('what') && questionLower.includes('should i eat'));

    let prompt;

    if (isFoodListQuestion || isSimpleFoodQuestion) {
        // User wants food recommendations - CLEAN output, no internal reasoning
        prompt = `You are a precision nutrition coach. Create a clean, practical protein distribution plan.

MY PROFILE:
- Dietary Preference: ${getDietaryLabel(dietary)}
- ${allergyText}
- **PROTEIN TARGET: ${proteinTarget}g (acceptable range: ${proteinMin}g - ${proteinMax}g)**
${dislikedContext}
${foodListContext}

**STRICT RULES - FOLLOW EXACTLY:**

1. **PRACTICAL SERVING SIZES ONLY:**
   - Yogurt/Skyr: Use 100g or 200g ONLY (comes in 100g packs)
   - Paneer: Use 100g, 150g, or 200g
   - Soya Chunks: Use 25g, 50g, 75g, or 100g (uncooked)
   - Protein Atta: Use 50g, 75g, or 100g
   - Tofu: Use 100g or 200g
   - Whey Protein: MAXIMUM 1 scoop (30g) - never more than 1 scoop
   - Dal/Legumes: Use 50g, 100g, or 150g (cooked weight)
   - Milk: Use 1 cup (240ml) or 2 cups (480ml)

2. **PROTEIN CALCULATION:**
   - Target range is ${proteinMin}g - ${proteinMax}g (±5% of ${proteinTarget}g)
   - Any total within this range is PERFECT
   - Do all calculations internally - show only the final plan
   - DO NOT show revision steps or corrections

3. **FOOD SELECTION:**
   - Pick 4-6 HIGH-PROTEIN foods from the AVAILABLE FOOD LIST
   - Prioritize foods with >15g protein per 100g
   - Include variety - no duplicates (don't list 2 yogurts or 2 types of paneer)

**OUTPUT FORMAT (follow exactly):**

**Protein Distribution Plan**
1. **[Food Name]** - [Quantity]
Protein: [X]g

2. **[Food Name]** - [Quantity]
Protein: [X]g

3. **[Food Name]** - [Quantity]
Protein: [X]g

[continue for 4-6 foods with blank line between each item...]

**Total Protein: [X]g**

**IMPORTANT - DO NOT:**
- Show calculation formulas or steps
- Show "revised" or "corrected" versions
- Explain adjustments or reasoning
- Apologize for being slightly above/below target
- Show multiple plan versions
- Use odd serving sizes (like 70g, 120g, 250g for yogurt)

Show ONE clean, final plan only. Keep response under 200 words.`;

    } else {
        // User wants a full meal plan
        prompt = `Based on my question about food/meals, create a detailed daily meal plan.

MY PROFILE:
- Dietary Preference: ${getDietaryLabel(dietary)}
- ${allergyText}
- Fitness Goal: ${goalText}
- Daily Calorie Target: ${calculatedMetrics.dailyKcal} kcal
- Daily Macro Targets:
  * Protein: ${calculatedMetrics.protein}g
  * Fat: ${calculatedMetrics.fat}g
  * Carbohydrates: ${calculatedMetrics.carbs}g
${dislikedContext}
${foodListContext}

INSTRUCTIONS:
1. **DO NOT include any foods from the DISLIKES list**
2. **PRIORITIZE foods from the Available Food List above** - these have verified nutrition data
3. Create a FULL DAY meal plan divided into: Breakfast, Lunch, Dinner, and Snacks (if needed)
4. Specify EXACT quantities for each food item using practical serving sizes:
   - Yogurt/Skyr: 100g or 200g only
   - Paneer: 100g, 150g, or 200g
   - Whey Protein: Maximum 1 scoop (30g)
5. Calculate and show macros for each meal in format: (Xg protein, Yg carbs, Zg fat, Z kcal)
6. **MACRO REQUIREMENTS:**
   - **PROTEIN**: Within ±5% of target (${proteinMin}g - ${proteinMax}g)
   - **FAT**: Must NOT exceed ${calculatedMetrics.fat}g
   - **CARBS**: Must NOT exceed ${calculatedMetrics.carbs}g
   - **CALORIES**: Must NOT exceed ${calculatedMetrics.dailyKcal} kcal
7. DO NOT include any product links or URLs
8. You may suggest common Indian foods if needed to meet macro targets

FORMAT:
**Breakfast** (Xg protein, Xg carbs, Xg fat, X kcal)
- [Food item with quantity and macros]

Keep response concise. Show total macros at the end.`;
    }

    return prompt;
}

// ============================================
// Handle Errors
// ============================================
function handleError(error) {
    console.error('Chatbot error:', error);

    let errorMessage = 'Sorry, I encountered an error. Please try again.';

    // Specific error messages
    if (error.message.includes('API_KEY_INVALID') || error.message.includes('API key not valid') || error.message.includes('Unauthorized')) {
        errorMessage = '⚠️ Invalid API key. Please check your config.js file and ensure you have a valid OpenRouter API key from https://openrouter.ai/';
    } else if (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('rate_limit')) {
        errorMessage = '⚠️ Rate limit exceeded. Please wait a moment and try again.';
    } else if (error.message.includes('rate')) {
        errorMessage = '⚠️ Rate limit exceeded. Please wait a moment and try again.';
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = '⚠️ Connection failed. Please check your internet connection.';
    }

    displayMessage('ai', errorMessage);
}

// ============================================
// Initialize on Page Load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize chatbot after a short delay to ensure DOM is ready
    setTimeout(initializeChatbot, 500);
});