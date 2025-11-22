document.addEventListener('DOMContentLoaded', function () {
      // Typed.js animations
      let typed1 = new Typed('.first-line', {
            strings: ["Welcome to The BMI Calculator! 💪"],
            typeSpeed: 50,
            loop: false,
            onComplete: function () {
                  setTimeout(() => {
                        document.querySelector('.input-section').style.display = 'block';
                  }, 500);
            }
      });

      let typed2 = new Typed('.second-line', {
            strings: ["Discover your health status with personalized recommendations"],
            typeSpeed: 50,
            startDelay: 2700,
            loop: false
      });

      // DOM Elements
      const weightUnit = document.getElementById('weight-unit');
      const heightUnit = document.getElementById('height-unit');
      const weightInput = document.getElementById('weight');
      const heightInput = document.getElementById('height');
      const heightInputFt = document.getElementById('height-ft');
      const heightInputIn = document.getElementById('height-in');
      const calculateBtn = document.getElementById('calculate-btn');
      const resultDiv = document.querySelector('.result');
      const bmiValue = document.querySelector('.bmi-value');
      const bmiCategory = document.querySelector('.bmi-category');
      const heightInputCm = document.getElementById('height-input-cm');
      const heightInputFtDiv = document.getElementById('height-input-ft');
      const bmiIndicator = document.getElementById('bmi-indicator');
      const idealWeightText = document.getElementById('ideal-weight-text');
      const recommendationsList = document.getElementById('recommendations-list');
      const historySection = document.getElementById('history-section');
      const historyList = document.getElementById('history-list');
      const clearHistoryBtn = document.getElementById('clear-history-btn');
      const recalculateBtn = document.getElementById('recalculate-btn');
      const printBtn = document.getElementById('print-btn');
      const shareBtn = document.getElementById('share-btn');

      // Height unit change handler
      heightUnit.addEventListener('change', function () {
            if (this.value === 'ft') {
                  heightInputCm.style.display = 'none';
                  heightInputFtDiv.style.display = 'block';
            } else {
                  heightInputCm.style.display = 'block';
                  heightInputFtDiv.style.display = 'none';
            }
      });

      // Calculate BMI
      calculateBtn.addEventListener('click', function () {
            let weightKg;
            const weight = parseFloat(weightInput.value);

            // Convert weight to kg
            switch (weightUnit.value) {
                  case 'kg':
                        weightKg = weight;
                        break;
                  case 'lbs':
                        weightKg = weight * 0.453592;
                        break;
                  default:
                        weightKg = weight;
            }

            // Convert height to meters
            let heightM;
            switch (heightUnit.value) {
                  case 'cm':
                        heightM = parseFloat(heightInput.value) / 100;
                        break;
                  case 'm':
                        heightM = parseFloat(heightInput.value);
                        break;
                  case 'ft':
                        const feet = parseFloat(heightInputFt.value) || 0;
                        const inches = parseFloat(heightInputIn.value) || 0;
                        heightM = (feet * 12 + inches) * 0.0254;
                        break;
                  case 'in':
                        heightM = parseFloat(heightInput.value) * 0.0254;
                        break;
                  default:
                        heightM = parseFloat(heightInput.value) / 100;
            }

            // Validation
            if (isNaN(weightKg) || isNaN(heightM) || weightKg <= 0 || heightM <= 0) {
                  alert("⚠️ Please enter valid values for weight and height.");
                  return;
            }

            // Calculate BMI
            const bmi = weightKg / (heightM * heightM);
            const roundedBMI = bmi.toFixed(1);

            // Determine category
            let category, categoryClass;
            if (bmi < 18.5) {
                  category = "Underweight";
                  categoryClass = "underweight";
            } else if (bmi < 25) {
                  category = "Normal weight";
                  categoryClass = "normal";
            } else if (bmi < 30) {
                  category = "Overweight";
                  categoryClass = "overweight";
            } else {
                  category = "Obese";
                  categoryClass = "obese";
            }

            // Calculate ideal weight range (using BMI 18.5-24.9)
            const idealWeightMin = (18.5 * heightM * heightM).toFixed(1);
            const idealWeightMax = (24.9 * heightM * heightM).toFixed(1);

            // Display results
            displayResults(roundedBMI, category, categoryClass, idealWeightMin, idealWeightMax, heightM);

            // Save to history
            saveToHistory(roundedBMI, category, categoryClass);
      });

      function displayResults(bmiValueText, category, categoryClass, idealMin, idealMax, height) {
            // Display BMI value
            bmiValue.innerHTML = `Your BMI: <span style="color: rgba(255, 255, 255, 1);">${bmiValueText}</span>`;
            bmiCategory.textContent = category;
            bmiCategory.className = `bmi-category ${categoryClass}`;

            // Position BMI indicator on gauge
            const bmiNum = parseFloat(bmiValueText);
            let indicatorPosition;
            
            if (bmiNum < 18.5) {
                  // Underweight range: 0% to 18.5% of gauge (scaled from BMI 10-18.5)
                  indicatorPosition = ((bmiNum - 10) / (18.5 - 10)) * 18.5;
            } else if (bmiNum < 25) {
                  // Normal range: 18.5% to 25% of gauge
                  indicatorPosition = 18.5 + ((bmiNum - 18.5) / (25 - 18.5)) * (25 - 18.5);
            } else if (bmiNum < 30) {
                  // Overweight range: 25% to 30% of gauge
                  indicatorPosition = 25 + ((bmiNum - 25) / (30 - 25)) * (30 - 25);
            } else {
                  // Obese range: 30% to 100% of gauge (scaled from BMI 30-40)
                  const obeseMax = Math.min(bmiNum, 40);
                  indicatorPosition = 30 + ((obeseMax - 30) / (40 - 30)) * 70;
            }
            
            indicatorPosition = Math.max(0, Math.min(100, indicatorPosition));
            bmiIndicator.style.left = `${indicatorPosition}%`;

            // Display ideal weight range
            const weightUnitDisplay = weightUnit.value === 'kg' ? 'kg' : 'lbs';
            let displayMin = idealMin;
            let displayMax = idealMax;
            
            if (weightUnit.value === 'lbs') {
                  displayMin = (idealMin / 0.453592).toFixed(1);
                  displayMax = (idealMax / 0.453592).toFixed(1);
            }
            
            idealWeightText.textContent = `${displayMin} - ${displayMax} ${weightUnitDisplay}`;

            // Display health recommendations
            displayHealthTips(categoryClass, bmiNum);

            // Show result section
            resultDiv.style.display = 'block';
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      function displayHealthTips(categoryClass, bmi) {
            const tips = {
                  underweight: [
                        "Increase your caloric intake with nutrient-dense foods",
                        "Include protein-rich foods in every meal",
                        "Eat smaller, more frequent meals throughout the day",
                        "Consider strength training to build muscle mass",
                        "Consult with a healthcare provider or nutritionist"
                  ],
                  normal: [
                        "Maintain your current healthy lifestyle",
                        "Continue balanced nutrition and regular exercise",
                        "Aim for 150 minutes of moderate activity per week",
                        "Stay hydrated with 8 glasses of water daily",
                        "Get regular health check-ups"
                  ],
                  overweight: [
                        "Focus on gradual, sustainable weight loss (1-2 lbs/week)",
                        "Increase physical activity to 300 minutes per week",
                        "Reduce portion sizes and caloric intake",
                        "Choose whole foods over processed options",
                        "Consider consulting a healthcare provider"
                  ],
                  obese: [
                        "Consult with a healthcare provider for a personalized plan",
                        "Start with low-impact exercises like walking or swimming",
                        "Focus on portion control and balanced nutrition",
                        "Set realistic, achievable weight loss goals",
                        "Consider joining a support group or working with a nutritionist"
                  ]
            };

            recommendationsList.innerHTML = '';
            const categoryTips = tips[categoryClass] || tips.normal;
            
            categoryTips.forEach(tip => {
                  const li = document.createElement('li');
                  li.textContent = tip;
                  recommendationsList.appendChild(li);
            });
      }

      // History Management
      function saveToHistory(bmi, category, categoryClass) {
            let history = JSON.parse(localStorage.getItem('bmiHistory')) || [];
            
            const entry = {
                  bmi: bmi,
                  category: category,
                  categoryClass: categoryClass,
                  date: new Date().toLocaleString(),
                  timestamp: Date.now()
            };
            
            history.unshift(entry); // Add to beginning
            
            // Keep only last 10 entries
            if (history.length > 10) {
                  history = history.slice(0, 10);
            }
            
            localStorage.setItem('bmiHistory', JSON.stringify(history));
            displayHistory();
      }

      function displayHistory() {
            const history = JSON.parse(localStorage.getItem('bmiHistory')) || [];
            
            if (history.length === 0) {
                  historySection.style.display = 'none';
                  return;
            }
            
            historySection.style.display = 'block';
            historyList.innerHTML = '';
            
            history.forEach(entry => {
                  const historyItem = document.createElement('div');
                  historyItem.className = 'history-item';
                  historyItem.innerHTML = `
                        <div class="history-info">
                              <div class="history-bmi">${entry.bmi}</div>
                              <div class="history-date">${entry.date}</div>
                        </div>
                        <div class="history-category ${entry.categoryClass}">
                              ${entry.category}
                        </div>
                  `;
                  historyList.appendChild(historyItem);
            });
      }

      // Clear history
      clearHistoryBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your BMI history?')) {
                  localStorage.removeItem('bmiHistory');
                  displayHistory();
            }
      });

      // Recalculate button
      recalculateBtn.addEventListener('click', function() {
            resultDiv.style.display = 'none';
            weightInput.value = '';
            heightInput.value = '';
            heightInputFt.value = '';
            heightInputIn.value = '';
            weightInput.focus();
            
            // Scroll to input section
            document.querySelector('.input-section').scrollIntoView({ behavior: 'smooth' });
      });

      // Print button
      printBtn.addEventListener('click', function() {
            window.print();
      });

      // Share button
      shareBtn.addEventListener('click', function() {
            const bmiText = bmiValue.textContent;
            const categoryText = bmiCategory.textContent;
            const shareText = `My ${bmiText} - ${categoryText}! Calculate yours at BMI Calculator`;
            
            if (navigator.share) {
                  navigator.share({
                        title: 'My BMI Result',
                        text: shareText,
                  }).catch(err => console.log('Error sharing:', err));
            } else {
                  // Fallback: copy to clipboard
                  navigator.clipboard.writeText(shareText).then(() => {
                        alert('✅ BMI result copied to clipboard!');
                  }).catch(() => {
                        alert('Unable to share. Please try again.');
                  });
            }
      });

      // Theme Toggle
      const themeToggle = document.getElementById('theme-toggle');
      let isDarkMode = localStorage.getItem('darkMode') === 'true';

      // Apply saved theme
      if (isDarkMode) {
            document.body.classList.add('dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      }

      themeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle('dark', isDarkMode);
            themeToggle.innerHTML = isDarkMode
                  ? '<i class="fas fa-sun"></i>'
                  : '<i class="fas fa-moon"></i>';
            localStorage.setItem('darkMode', isDarkMode);
      });

      // Load history on page load
      displayHistory();

      // Add enter key support for inputs
      [weightInput, heightInput, heightInputFt, heightInputIn].forEach(input => {
            input.addEventListener('keypress', function(e) {
                  if (e.key === 'Enter') {
                        calculateBtn.click();
                  }
            });
      });
});
