// FitHeal calculations — ported from script.js
(function () {
  const FitCalc = {};

  FitCalc.bmi = (weight, height) => {
    const h = height / 100;
    return weight / (h * h);
  };

  FitCalc.bmiCategory = (bmi) => {
    if (bmi < 18.5) return { name: "Underweight", color: "oklch(0.62 0.12 240)" };
    if (bmi < 25) return { name: "Normal", color: "oklch(0.55 0.13 145)" };
    if (bmi < 30) return { name: "Overweight", color: "oklch(0.72 0.16 75)" };
    return { name: "Obese", color: "oklch(0.58 0.18 28)" };
  };

  FitCalc.bmr = (age, gender, weight, height) => {
    const s = gender === "male" ? 5 : -161;
    return Math.round(10 * weight + 6.25 * height - 5 * age + s);
  };

  FitCalc.tdee = (bmr, activity) => Math.round(bmr * activity);

  FitCalc.lbm = (weight, height, gender) => {
    let lbm;
    if (gender === "male") lbm = 0.407 * weight + 0.267 * height - 19.2;
    else lbm = 0.252 * weight + 0.473 * height - 48.3;
    return Math.round(lbm * 10) / 10;
  };

  FitCalc.bodyFatNavy = (neck, waist, hip, height, gender) => {
    let bfp;
    if (gender === "male") {
      const d = 1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height);
      bfp = 495 / d - 450;
    } else {
      const d = 1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height);
      bfp = 495 / d - 450;
    }
    return Math.max(0, Math.min(100, Math.round(bfp * 10) / 10));
  };

  FitCalc.bodyFatBMI = (bmi, age, gender) => {
    let bfp;
    if (gender === "male") bfp = 1.2 * bmi + 0.23 * age - 16.2;
    else bfp = 1.2 * bmi + 0.23 * age - 5.4;
    return Math.max(0, Math.min(100, Math.round(bfp * 10) / 10));
  };

  FitCalc.bodyFat = (neck, waist, hip, bmi, age, height, gender) => {
    if (neck && waist) {
      if (gender === "male") return { percentage: FitCalc.bodyFatNavy(neck, waist, null, height, "male"), method: "Navy" };
      if (gender === "female" && hip) return { percentage: FitCalc.bodyFatNavy(neck, waist, hip, height, "female"), method: "Navy" };
    }
    return { percentage: FitCalc.bodyFatBMI(bmi, age, gender), method: "Deurenberg" };
  };

  FitCalc.dailyKcal = (tdee, goal, rate) => {
    let adj = 0;
    if (goal === "weight_loss" || goal === "weight_gain") {
      adj = rate ? (rate * 7700) / 7 : 550;
    }
    if (goal === "weight_loss") return Math.round(tdee - adj);
    if (goal === "weight_gain") return Math.round(tdee + adj);
    return tdee;
  };

  FitCalc.protein = (lbm, bodyFatPct, activity, gender, method) => {
    if (activity <= 1.375) return Math.round(lbm * 2.2 * 10) / 10;
    if (activity === 1.55) return Math.round(lbm * 2.5 * 10) / 10;
    let threshold;
    if (method === "Navy") threshold = gender === "male" ? 24 : 31;
    else threshold = gender === "male" ? 20 : 28;
    const per = bodyFatPct > threshold ? 2.65 : 3.53;
    return Math.round(lbm * per * 10) / 10;
  };

  FitCalc.fat = (kcal) => Math.round(((kcal * 0.25) / 9) * 10) / 10;

  FitCalc.carbs = (kcal, protein, fat) => {
    const c = (kcal - protein * 4 - fat * 9) / 4;
    return Math.max(0, Math.round(c * 10) / 10);
  };

  FitCalc.computeAll = (input) => {
    const { age, gender, weight, height, activity, goal, rate, neck, waist, hip } = input;
    const bmi = FitCalc.bmi(weight, height);
    const bmr = FitCalc.bmr(age, gender, weight, height);
    const tdee = FitCalc.tdee(bmr, activity);
    const lbm = FitCalc.lbm(weight, height, gender);
    const bf = FitCalc.bodyFat(neck, waist, hip, bmi, age, height, gender);
    const dailyKcal = FitCalc.dailyKcal(tdee, goal, rate);
    const protein = FitCalc.protein(lbm, bf.percentage, activity, gender, bf.method);
    const fat = FitCalc.fat(dailyKcal);
    const carbs = FitCalc.carbs(dailyKcal, protein, fat);
    const bfKg = Math.round((weight * bf.percentage / 100) * 10) / 10;
    const lbmFromBf = Math.round((weight - bfKg) * 10) / 10;
    return {
      input,
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory: FitCalc.bmiCategory(bmi),
      bmr, tdee, lbm, lbmFromBf, dailyKcal,
      bodyFat: bf.percentage,
      bodyFatMethod: bf.method,
      bodyFatKg: bfKg,
      protein, fat, carbs,
      proteinKcal: Math.round(protein * 4),
      fatKcal: Math.round(fat * 9),
      carbsKcal: Math.round(carbs * 4),
    };
  };

  window.FitCalc = FitCalc;
})();
