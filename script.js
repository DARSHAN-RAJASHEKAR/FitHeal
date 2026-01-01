// Fitness Calculator Functions

// ============================================
// Global State for AI Chatbot
// ============================================
const fitnessContext = {
    userData: null,
    calculatedMetrics: null,
    isCalculated: false
};

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

// ============================================
// PDF Download Functionality
// ============================================
function createInputSummary() {
    // Get user input values
    const age = document.getElementById('age')?.value || '-';
    const gender = document.getElementById('gender')?.value || '-';
    const weight = document.getElementById('weight')?.value || '-';
    const height = document.getElementById('height')?.value || '-';
    const waist = document.getElementById('waist')?.value || '-';
    const neck = document.getElementById('neck')?.value || '-';
    const hipElement = document.getElementById('hip');
    const hip = hipElement ? hipElement.value : '-';
    const activityLevel = document.getElementById('activityLevel')?.value || '1.2';
    const goal = document.getElementById('goal')?.value || 'stay_healthy';
    const rateElement = document.getElementById('rate');
    const rate = rateElement ? rateElement.value : '';

    // Create activity level description
    const activityDesc = {
        '1.2': 'Sedentary (little or no exercise)',
        '1.375': 'Lightly Active (light exercise 1-3 days/week)',
        '1.55': 'Moderately Active (moderate exercise 3-5 days/week)',
        '1.725': 'Very Active (hard exercise 6-7 days/week)',
        '1.9': 'Extra Active (very hard exercise, physical job)'
    };

    // Create goal description
    const goalDesc = {
        'weight_loss': 'Weight Loss',
        'weight_gain': 'Weight Gain',
        'stay_healthy': 'Stay Healthy (Maintenance)'
    };

    // Create the summary section
    const summaryDiv = document.createElement('div');
    summaryDiv.style.marginTop = '0';
    summaryDiv.style.marginBottom = '15px';
    summaryDiv.style.padding = '15px';
    summaryDiv.style.backgroundColor = '#f8f9fa';
    summaryDiv.style.borderRadius = '8px';
    summaryDiv.style.border = '2px solid #667eea';

    let summaryHTML = `
        <h2 style="color: #667eea; margin-top: 0; margin-bottom: 20px; text-align: center;">Your Input Data</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div><strong>Age:</strong> ${age} years</div>
            <div><strong>Gender:</strong> ${gender.charAt(0).toUpperCase() + gender.slice(1)}</div>
            <div><strong>Weight:</strong> ${weight} kg</div>
            <div><strong>Height:</strong> ${height} cm</div>
            <div><strong>Waist:</strong> ${waist} cm</div>
            <div><strong>Neck:</strong> ${neck} cm</div>
    `;

    if (gender === 'female') {
        summaryHTML += `<div><strong>Hip:</strong> ${hip} cm</div>`;
    }

    summaryHTML += `
            <div><strong>Activity Level:</strong> ${activityDesc[activityLevel]}</div>
            <div><strong>Goal:</strong> ${goalDesc[goal]}</div>
    `;

    if (rate) {
        summaryHTML += `<div><strong>Target Rate:</strong> ${rate} kg/week</div>`;
    }

    summaryHTML += `</div>`;

    summaryDiv.innerHTML = summaryHTML;
    return summaryDiv;
}

document.getElementById('downloadPdfBtn').addEventListener('click', function() {
    generatePDF();
});

function generatePDF() {
    const button = document.getElementById('downloadPdfBtn');

    // Disable button during generation
    button.disabled = true;
    button.querySelector('.pdf-text').textContent = 'Generating PDF...';

    // Get both results sections
    const basicResults = document.getElementById('results');
    const detailedResults = document.getElementById('detailedResults');

    // Create a wrapper for both sections
    const pdfWrapper = document.createElement('div');
    pdfWrapper.style.padding = '10px';
    pdfWrapper.style.margin = '0 auto';
    pdfWrapper.style.backgroundColor = '#fff';
    pdfWrapper.style.width = '700px';
    pdfWrapper.style.transform = 'scale(0.98)';
    pdfWrapper.style.transformOrigin = 'top left';

    // Create user input summary section
    const inputSummary = createInputSummary();

    // Clone both sections
    const clonedBasic = basicResults.cloneNode(true);
    const clonedDetailed = detailedResults.cloneNode(true);

    // Remove hidden class and reset margins/padding
    clonedBasic.classList.remove('hidden');
    clonedBasic.style.marginTop = '0';
    clonedBasic.style.paddingTop = '10px';

    clonedDetailed.classList.remove('hidden');
    clonedDetailed.style.marginTop = '10px';
    clonedDetailed.style.paddingTop = '20px';

    // Make macronutrient boxes smaller and arrange in 3 columns for PDF
    const macrosGrid = clonedDetailed.querySelector('.macros-grid');
    if (macrosGrid) {
        macrosGrid.style.display = 'grid';
        macrosGrid.style.gridTemplateColumns = '1fr 1fr 1fr';
        macrosGrid.style.gap = '15px';
        macrosGrid.style.marginTop = '20px';
        macrosGrid.style.pageBreakAfter = 'always';
        macrosGrid.style.marginBottom = '40px';
    }

    const macroCards = clonedDetailed.querySelectorAll('.macro-card');
    macroCards.forEach(card => {
        card.style.padding = '20px 15px';
        card.style.minHeight = '180px';
        card.style.height = 'auto';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.justifyContent = 'center';
        card.style.alignItems = 'center';
        card.style.overflow = 'visible';
    });

    const macroIcons = clonedDetailed.querySelectorAll('.macro-icon');
    macroIcons.forEach(icon => {
        icon.style.fontSize = '2.5rem';
        icon.style.marginBottom = '10px';
    });

    const macroValues = clonedDetailed.querySelectorAll('.macro-value');
    macroValues.forEach(value => {
        value.style.fontSize = '2rem';
        value.style.fontWeight = 'bold';
        value.style.marginBottom = '5px';
        value.style.marginTop = '5px';
    });

    const macroTitles = clonedDetailed.querySelectorAll('.macro-card h4');
    macroTitles.forEach(title => {
        title.style.fontSize = '1.1rem';
        title.style.fontWeight = '600';
        title.style.marginBottom = '10px';
        title.style.marginTop = '0';
    });

    const macroUnits = clonedDetailed.querySelectorAll('.macro-unit');
    macroUnits.forEach(unit => {
        unit.style.fontSize = '0.9rem';
        unit.style.marginBottom = '3px';
    });

    const macroKcals = clonedDetailed.querySelectorAll('.macro-kcal');
    macroKcals.forEach(kcal => {
        kcal.style.fontSize = '0.85rem';
        kcal.style.marginTop = '2px';
    });

    // Add page break before Detailed Breakdown section
    const detailedH2 = clonedDetailed.querySelector('h2');
    if (detailedH2 && detailedH2.textContent.includes('Detailed Breakdown')) {
        detailedH2.style.pageBreakBefore = 'always';
        detailedH2.style.paddingTop = '60px';
        detailedH2.style.marginTop = '0';
    }

    // Remove the reset button from basic results
    const resetBtn = clonedBasic.querySelector('.reset-btn');
    if (resetBtn) {
        resetBtn.remove();
    }

    // Remove the PDF download button from detailed results
    const pdfSection = clonedDetailed.querySelector('.pdf-download-section');
    if (pdfSection) {
        pdfSection.remove();
    }

    // Remove the High Protein Food Sources section from PDF
    const foodListSection = clonedDetailed.querySelector('.food-list-section');
    if (foodListSection) {
        foodListSection.remove();
    }

    // Add all sections to wrapper (input summary first, then results)
    pdfWrapper.appendChild(inputSummary);
    pdfWrapper.appendChild(clonedBasic);
    pdfWrapper.appendChild(clonedDetailed);

    // Use the wrapper for PDF generation
    const clonedResults = pdfWrapper;

    // Generate filename with current date
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const filename = `FitHeal_Report_${day}_${month}_${year}.pdf`;

    // Configure PDF options
    const opt = {
        margin: [8, 8, 8, 8],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            scrollY: 0,
            scrollX: 0
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Generate PDF
    html2pdf().set(opt).from(clonedResults).save().then(() => {
        // Re-enable button after generation
        button.disabled = false;
        button.querySelector('.pdf-text').textContent = 'Download Full Report (PDF)';
    }).catch((error) => {
        console.error('PDF generation error:', error);
        alert('Failed to generate PDF. Please try again.');
        button.disabled = false;
        button.querySelector('.pdf-text').textContent = 'Download Full Report (PDF)';
    });
}

