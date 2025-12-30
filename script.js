// Fitness Calculator Functions

// ============================================
// Global State for AI Chatbot
// ============================================
const fitnessContext = {
    userData: null,
    calculatedMetrics: null,
    isCalculated: false
};

// ============================================
// Food Database for AI Recommendations
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

// Filter food list based on dietary preferences and allergies
function getFilteredFoodList(dietaryPreference, allergies) {
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

    return availableFoods;
}

// Calculate BMI (Body Mass Index)
function calculateBMI(weight, height) {
    // BMI = weight (kg) / (height (m))^2
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi;
}

// Get BMI Category
function getBMICategory(bmi) {
    if (bmi < 18.5) return { category: 'Underweight', color: '#3498db' };
    if (bmi < 25) return { category: 'Normal Weight', color: '#2ecc71' };
    if (bmi < 30) return { category: 'Overweight', color: '#f39c12' };
    return { category: 'Obese', color: '#e74c3c' };
}

// Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
function calculateBMR(age, gender, weight, height) {
    // BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age(years) + s
    // s = +5 for males, -161 for females
    const s = gender === 'male' ? 5 : -161;
    const bmr = (10 * weight) + (6.25 * height) - (5 * age) + s;
    return Math.round(bmr);
}

// Calculate TDEE (Total Daily Energy Expenditure)
function calculateTDEE(bmr, activityLevel) {
    // TDEE = BMR * Activity Level
    const tdee = bmr * activityLevel;
    return Math.round(tdee);
}

// Calculate LBM (Lean Body Mass) using Boer Formula
function calculateLBM(weight, height, gender, age) {
    // For males: LBM = 0.407 * weight + 0.267 * height - 19.2
    // For females: LBM = 0.252 * weight + 0.473 * height - 48.3
    let lbm;
    if (gender === 'male') {
        lbm = (0.407 * weight) + (0.267 * height) - 19.2;
    } else {
        lbm = (0.252 * weight) + (0.473 * height) - 48.3;
    }
    return Math.round(lbm * 10) / 10; // Round to 1 decimal place
}

// Calculate Body Fat Percentage using Navy Method (SI/Metric Units)
function calculateBodyFatPercentageNavy(neck, waist, hip, height, gender) {
    // Navy method formulas using SI/Metric units (measurements in cm)
    // Source: Naval Health Research Center by Hodgdon and Beckett (1984)
    let bodyFatPercent;
    
    if (gender === 'male') {
        // Men (Metric): BFP = 495 / (1.0324 - 0.19077×log10(waist-neck) + 0.15456×log10(height)) - 450
        const denominator = 1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height);
        bodyFatPercent = (495 / denominator) - 450;
    } else {
        // Women (Metric): BFP = 495 / (1.29579 - 0.35004×log10(waist+hip-neck) + 0.22100×log10(height)) - 450
        const denominator = 1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height);
        bodyFatPercent = (495 / denominator) - 450;
    }
    
    return Math.max(0, Math.min(100, Math.round(bodyFatPercent * 10) / 10)); // Clamp between 0-100
}

// Calculate Body Fat Percentage using BMI Method (Deurenberg Formula)
function calculateBodyFatPercentage(bmi, age, gender) {
    // BMI method formulas for adults
    // Adult Males: BFP = 1.20 × BMI + 0.23 × Age - 16.2
    // Adult Females: BFP = 1.20 × BMI + 0.23 × Age - 5.4
    let bodyFatPercent;
    
    if (gender === 'male') {
        bodyFatPercent = (1.20 * bmi) + (0.23 * age) - 16.2;
    } else {
        bodyFatPercent = (1.20 * bmi) + (0.23 * age) - 5.4;
    }
    
    return Math.max(0, Math.min(100, Math.round(bodyFatPercent * 10) / 10)); // Clamp between 0-100
}

// Calculate Body Fat Percentage (chooses method based on available data)
function calculateBodyFat(neck, waist, hip, bmi, age, height, gender) {
    // Use Navy method if measurements are available
    if (neck && waist) {
        if (gender === 'male') {
            // Men only need neck and waist
            return {
                percentage: calculateBodyFatPercentageNavy(neck, waist, null, height, gender),
                method: 'Navy Method'
            };
        } else if (gender === 'female' && hip) {
            // Women need neck, waist, and hip
            return {
                percentage: calculateBodyFatPercentageNavy(neck, waist, hip, height, gender),
                method: 'Navy Method'
            };
        }
    }
    
    // Fall back to Deurenberg formula
    return {
        percentage: calculateBodyFatPercentage(bmi, age, gender),
        method: 'Deurenberg Formula'
    };
}

// Calculate Body Fat in kg
function calculateBodyFatKg(weight, bodyFatPercent) {
    return Math.round((weight * bodyFatPercent / 100) * 10) / 10;
}

// Calculate Daily Calorie Intake based on goal and rate
function calculateDailyKcalIntake(tdee, goal, rate) {
    // 1 kg of fat ≈ 7700 kcal
    // Daily kcal adjustment = (rate in kg/week × 7700) / 7 days
    let kcalAdjustment = 0;

    if (goal === 'weight_loss' || goal === 'weight_gain') {
        if (rate) {
            // Calculate based on selected rate
            const weeklyKcal = rate * 7700; // kcal per week
            kcalAdjustment = weeklyKcal / 7; // kcal per day
        } else {
            // Default to 0.5 kg/week if no rate selected
            kcalAdjustment = 550;
        }
    }

    if (goal === 'weight_loss') {
        return Math.round(tdee - kcalAdjustment);
    } else if (goal === 'weight_gain') {
        return Math.round(tdee + kcalAdjustment);
    } else {
        // For stay_healthy or maintenance
        return tdee;
    }
}

// Calculate Protein Intake
function calculateProtein(lbm, bodyFatPercent, activityLevel, gender, bodyFatMethod) {
    // If sedentary (1.2) or lightly active (1.375), use 2.2g per LBM for all
    if (activityLevel <= 1.375) {
        return Math.round(lbm * 2.2 * 10) / 10;
    }

    // If moderately active (1.55), use 2.5g per LBM for all
    if (activityLevel === 1.55) {
        return Math.round(lbm * 2.5 * 10) / 10;
    }

    // For very active and extra active levels:
    // Determine threshold based on gender and body fat method
    let threshold;
    if (bodyFatMethod === 'Navy Method') {
        // Navy Method thresholds
        threshold = gender === 'male' ? 24 : 31;
    } else {
        // BMI Method (Deurenberg Formula) thresholds
        threshold = gender === 'male' ? 20 : 28;
    }

    // High body fat: 2.65g per LBM, Low body fat: 3.53g per LBM
    const proteinPerLbm = bodyFatPercent > threshold ? 2.65 : 3.53;
    return Math.round(lbm * proteinPerLbm * 10) / 10;
}

// Calculate Fat Intake (25% of daily kcal intake)
function calculateFat(dailyKcal) {
    const fatKcal = dailyKcal * 0.25;
    const fatGrams = fatKcal / 9; // 1g fat = 9 kcal
    return Math.round(fatGrams * 10) / 10;
}

// Calculate Carb Intake (remaining kcal after protein and fat)
function calculateCarbs(dailyKcal, proteinGrams, fatGrams) {
    const proteinKcal = proteinGrams * 4; // 1g protein = 4 kcal
    const fatKcal = fatGrams * 9; // 1g fat = 9 kcal
    const carbKcal = dailyKcal - proteinKcal - fatKcal;
    const carbGrams = carbKcal / 4; // 1g carb = 4 kcal
    return Math.max(0, Math.round(carbGrams * 10) / 10); // Ensure non-negative
}


// Display Results
function displayResults(bmi, bmr, tdee, lbmBoer, lbmFromBodyFat, weight, bodyFatPercent, bodyFatKg, dailyKcal, goal, rate, protein, fat, carbs, bodyFatMethod) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.classList.remove('hidden');

    // Display BMI
    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');
    const bmiInfo = getBMICategory(bmi);
    bmiValue.textContent = bmi.toFixed(1);
    bmiCategory.textContent = bmiInfo.category;
    bmiCategory.style.color = bmiInfo.color;

    // Display BMR
    document.getElementById('bmrValue').textContent = bmr.toLocaleString();

    // Display TDEE
    document.getElementById('tdeeValue').textContent = tdee.toLocaleString();

    // Display LBM (using body fat based for main display)
    document.getElementById('lbmValue').textContent = lbmFromBodyFat.toLocaleString();

    // Display Detailed Breakdown
    // Validate all values are numbers before displaying
    if (isNaN(weight) || isNaN(bodyFatKg) || isNaN(bodyFatPercent) || isNaN(lbmBoer) || 
        isNaN(lbmFromBodyFat) || isNaN(bmr) || isNaN(tdee) || isNaN(dailyKcal) || 
        isNaN(protein) || isNaN(fat) || isNaN(carbs)) {
        console.error('Invalid calculation values detected:', {
            weight, bodyFatKg, bodyFatPercent, lbmBoer, lbmFromBodyFat, bmr, tdee, dailyKcal, protein, fat, carbs
        });
        return;
    }
    
    displayDetailedResults(weight, bodyFatKg, bodyFatPercent, lbmBoer, lbmFromBodyFat, bmr, tdee, dailyKcal, goal, rate, protein, fat, carbs, bodyFatMethod);
}

// Display Detailed Results
function displayDetailedResults(weight, bodyFatKg, bodyFatPercent, lbmBoer, lbmFromBodyFat, bmr, tdee, dailyKcal, goal, rate, protein, fat, carbs, bodyFatMethod) {
    try {
        const detailedDiv = document.getElementById('detailedResults');
        if (!detailedDiv) {
            console.error('detailedResults element not found');
            return;
        }
        detailedDiv.classList.remove('hidden');

        // Display breakdown values
        if (document.getElementById('breakdownWeight')) {
            document.getElementById('breakdownWeight').textContent = weight.toLocaleString();
        }
        if (document.getElementById('breakdownBodyFatKg')) {
            document.getElementById('breakdownBodyFatKg').textContent = bodyFatKg.toLocaleString();
        }
        if (document.getElementById('breakdownBodyFatPercent')) {
            let methodLabel = '';
            if (bodyFatMethod === 'Navy Method') {
                methodLabel = ' (Navy)';
            } else if (bodyFatMethod === 'Deurenberg Formula') {
                methodLabel = ' (BMI)';
            }
            document.getElementById('breakdownBodyFatPercent').textContent = `(${bodyFatPercent.toFixed(1)}%${methodLabel})`;
        }
        if (document.getElementById('breakdownLBM')) {
            document.getElementById('breakdownLBM').textContent = lbmBoer.toLocaleString();
        }
        if (document.getElementById('breakdownLBMFromBF')) {
            document.getElementById('breakdownLBMFromBF').textContent = lbmFromBodyFat.toLocaleString();
        }
        if (document.getElementById('breakdownBMR')) {
            document.getElementById('breakdownBMR').textContent = bmr.toLocaleString();
        }
        if (document.getElementById('breakdownTDEE')) {
            document.getElementById('breakdownTDEE').textContent = tdee.toLocaleString();
        }
        if (document.getElementById('breakdownDailyKcal')) {
            document.getElementById('breakdownDailyKcal').textContent = dailyKcal.toLocaleString();
        }
        
        // Display goal
        let goalText = 'Maintenance';
        if (goal === 'weight_loss') {
            goalText = 'Deficit';
        } else if (goal === 'weight_gain' || goal === 'body_building') {
            goalText = 'Surplus';
        } else if (goal === 'stay_healthy') {
            goalText = 'Maintenance';
        }
        if (document.getElementById('breakdownGoal')) {
            document.getElementById('breakdownGoal').textContent = goalText;
        }

        // Display macros
        if (document.getElementById('proteinValue')) {
            document.getElementById('proteinValue').textContent = protein.toLocaleString();
        }
        if (document.getElementById('fatValue')) {
            document.getElementById('fatValue').textContent = fat.toLocaleString();
        }
        if (document.getElementById('carbValue')) {
            document.getElementById('carbValue').textContent = carbs.toLocaleString();
        }

        // Display macro kcal
        const proteinKcal = Math.round(protein * 4);
        const fatKcal = Math.round(fat * 9);
        const carbKcal = Math.round(carbs * 4);
        
        if (document.getElementById('proteinKcal')) {
            document.getElementById('proteinKcal').textContent = `${proteinKcal} kcal`;
        }
        if (document.getElementById('fatKcal')) {
            document.getElementById('fatKcal').textContent = `${fatKcal} kcal`;
        }
        if (document.getElementById('carbKcal')) {
            document.getElementById('carbKcal').textContent = `${carbKcal} kcal`;
        }

        // Display weight change projections
        displayWeightProjections(tdee, dailyKcal, goal, rate);
    } catch (error) {
        console.error('Error in displayDetailedResults:', error);
    }
}

// Calculate and Display Weight Change Projections
function displayWeightProjections(tdee, dailyKcal, goal, rate) {
    // Calculate daily kcal deficit/surplus
    // Positive = surplus (gain), Negative = deficit (loss)
    const dailyKcalChange = dailyKcal - tdee;
    
    // Calculate weekly and monthly kcal changes
    const weeklyKcalChange = Math.round(dailyKcalChange * 7);
    const monthlyKcalChange = Math.round(dailyKcalChange * 30); // 30 days
    
    // If rate is provided, use it for more accurate weight calculations
    let weeklyWeightChange, monthlyWeightChange;
    if (rate) {
        // Use the selected rate directly
        weeklyWeightChange = goal === 'weight_loss' ? -rate : rate;
        monthlyWeightChange = Math.round((weeklyWeightChange * 30 / 7) * 100) / 100; // Based on 30 days
    } else {
        // Fallback calculation using kcal
        const kcalPerKg = 7700;
        weeklyWeightChange = Math.round((weeklyKcalChange / kcalPerKg) * 100) / 100;
        monthlyWeightChange = Math.round((monthlyKcalChange / kcalPerKg) * 100) / 100;
    }
    
    // Display weekly projections
    if (document.getElementById('weightChangeWeek')) {
        const sign = weeklyWeightChange >= 0 ? '+' : '';
        document.getElementById('weightChangeWeek').textContent = `${sign}${weeklyWeightChange.toFixed(2)}`;
        document.getElementById('weightChangeWeek').style.color = weeklyWeightChange >= 0 ? '#2ecc71' : '#e74c3c';
    }
    if (document.getElementById('kcalChangeWeek')) {
        const sign = weeklyKcalChange >= 0 ? '+' : '';
        document.getElementById('kcalChangeWeek').textContent = `${sign}${weeklyKcalChange.toLocaleString()}`;
        document.getElementById('kcalChangeWeek').style.color = weeklyKcalChange >= 0 ? '#2ecc71' : '#e74c3c';
    }
    
    // Display monthly projections
    if (document.getElementById('weightChangeMonth')) {
        const sign = monthlyWeightChange >= 0 ? '+' : '';
        document.getElementById('weightChangeMonth').textContent = `${sign}${monthlyWeightChange.toFixed(2)}`;
        document.getElementById('weightChangeMonth').style.color = monthlyWeightChange >= 0 ? '#2ecc71' : '#e74c3c';
    }
    if (document.getElementById('kcalChangeMonth')) {
        const sign = monthlyKcalChange >= 0 ? '+' : '';
        document.getElementById('kcalChangeMonth').textContent = `${sign}${monthlyKcalChange.toLocaleString()}`;
        document.getElementById('kcalChangeMonth').style.color = monthlyKcalChange >= 0 ? '#2ecc71' : '#e74c3c';
    }
}


// Handle Form Submission
document.getElementById('fitnessForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activityLevel = parseFloat(document.getElementById('activity').value);
    const goal = document.getElementById('goal').value;
    const rate = document.getElementById('rate').value ? parseFloat(document.getElementById('rate').value) : null;

    // Optional measurements for Navy method
    const neck = document.getElementById('neck').value ? parseFloat(document.getElementById('neck').value) : null;
    const waist = document.getElementById('waist').value ? parseFloat(document.getElementById('waist').value) : null;
    const hip = document.getElementById('hip').value ? parseFloat(document.getElementById('hip').value) : null;

    // Validate required inputs
    if (!age || !gender || !weight || !height || !activityLevel || !goal) {
        alert('Please fill in all required fields');
        return;
    }

    // Validate rate is selected for weight loss or weight gain goals (not needed for stay_healthy)
    if ((goal === 'weight_loss' || goal === 'weight_gain') && !rate) {
        alert('Please select a Weight Change Rate for your goal');
        return;
    }

    // Calculate basic metrics
    const bmi = calculateBMI(weight, height);
    const bmr = calculateBMR(age, gender, weight, height);
    const tdee = calculateTDEE(bmr, activityLevel);

    // Calculate body fat (uses Navy method if measurements provided, otherwise Deurenberg)
    const bodyFatData = calculateBodyFat(neck, waist, hip, bmi, age, height, gender);
    const bodyFatPercent = bodyFatData.percentage;
    const bodyFatMethod = bodyFatData.method;
    const bodyFatKg = calculateBodyFatKg(weight, bodyFatPercent);

    // Calculate LBM using Boer formula (original method)
    const lbmBoer = calculateLBM(weight, height, gender, age);

    // Calculate LBM from body fat: LBM = Weight - Body Fat (kg)
    // This ensures Body Fat + LBM = Weight for both Navy and BMI methods
    const lbmFromBodyFat = Math.round((weight - bodyFatKg) * 10) / 10;

    // Calculate daily calorie intake based on goal and rate
    const dailyKcal = calculateDailyKcalIntake(tdee, goal, rate);

    // Calculate macros using Boer Formula LBM
    const protein = calculateProtein(lbmBoer, bodyFatPercent, activityLevel, gender, bodyFatMethod);
    const fat = calculateFat(dailyKcal);
    const carbs = calculateCarbs(dailyKcal, protein, fat);

    // Store fitness data for AI chatbot
    fitnessContext.userData = {
        age,
        gender,
        weight,
        height,
        activityLevel,
        goal,
        rate
    };
    fitnessContext.calculatedMetrics = {
        bmi,
        bmr,
        tdee,
        bodyFatPercent,
        bodyFatMethod,
        lbmFromBodyFat,
        dailyKcal,
        protein,
        fat,
        carbs
    };
    fitnessContext.isCalculated = true;

    // Display results
    displayResults(bmi, bmr, tdee, lbmBoer, lbmFromBodyFat, weight, bodyFatPercent, bodyFatKg, dailyKcal, goal, rate, protein, fat, carbs, bodyFatMethod);

    // Show chatbot after calculation
    if (typeof showChatbot === 'function') {
        showChatbot();
    }

    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Reset Form Function
function resetForm() {
    document.getElementById('fitnessForm').reset();
    document.getElementById('results').classList.add('hidden');
    document.getElementById('detailedResults').classList.add('hidden');

    // Reset field visibility
    const gender = document.getElementById('gender').value;
    const goal = document.getElementById('goal').value;
    const hipGroup = document.getElementById('hipGroup');
    const rateGroup = document.getElementById('rateGroup');
    const rateSelect = document.getElementById('rate');

    if (gender !== 'female') {
        hipGroup.style.display = 'none';
    } else {
        hipGroup.style.display = 'flex';
    }

    if (goal !== 'weight_loss' && goal !== 'weight_gain') {
        rateGroup.style.display = 'none';
        rateSelect.removeAttribute('required');
    } else {
        rateGroup.style.display = 'flex';
        rateSelect.setAttribute('required', 'required');
    }

    // Reset chatbot context
    fitnessContext.userData = null;
    fitnessContext.calculatedMetrics = null;
    fitnessContext.isCalculated = false;

    // Hide chatbot if it exists
    if (typeof hideChatbot === 'function') {
        hideChatbot();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/hide hip field based on gender
document.getElementById('gender').addEventListener('change', function() {
    const hipGroup = document.getElementById('hipGroup');
    if (this.value === 'female') {
        hipGroup.style.display = 'flex';
    } else {
        hipGroup.style.display = 'none';
        document.getElementById('hip').value = '';
    }
});

// Show/hide rate field based on goal
document.getElementById('goal').addEventListener('change', function() {
    const rateGroup = document.getElementById('rateGroup');
    const rateSelect = document.getElementById('rate');

    if (this.value === 'weight_loss' || this.value === 'weight_gain') {
        rateGroup.style.display = 'flex';
        rateSelect.setAttribute('required', 'required');
    } else {
        // Hide rate group for stay_healthy and empty selection
        rateGroup.style.display = 'none';
        rateSelect.removeAttribute('required');
        rateSelect.value = '';
    }
});

// Initialize field visibility on page load
document.addEventListener('DOMContentLoaded', function() {
    const gender = document.getElementById('gender').value;
    const goal = document.getElementById('goal').value;
    const hipGroup = document.getElementById('hipGroup');
    const rateGroup = document.getElementById('rateGroup');
    const rateSelect = document.getElementById('rate');

    if (gender !== 'female') {
        hipGroup.style.display = 'none';
    }

    if (goal !== 'weight_loss' && goal !== 'weight_gain') {
        rateGroup.style.display = 'none';
        rateSelect.removeAttribute('required');
    }
});

