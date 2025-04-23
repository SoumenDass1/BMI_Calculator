document.addEventListener('DOMContentLoaded', function () {
      let typed1 = new Typed('.first-line', {
            strings: ["Welcome to The BMI Calculator!"],
            typeSpeed: 50,
            loop: false,
            onComplete: function () {
                  setTimeout(() => {
                        document.querySelector('.input-section').style.display = 'block';
                  }, 500);
            }
      });

      let typed2 = new Typed('.second-line', {
            strings: ["Please select your preferred units and enter your measurements"],
            typeSpeed: 50,
            startDelay: 2700,
            loop: false
      });

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

      heightUnit.addEventListener('change', function () {
            if (this.value === 'ft') {
                  heightInputCm.style.display = 'none';
                  heightInputFtDiv.style.display = 'block';
            } else {
                  heightInputCm.style.display = 'block';
                  heightInputFtDiv.style.display = 'none';
            }
      });

      calculateBtn.addEventListener('click', function () {
            let weightKg;
            const weight = parseFloat(weightInput.value);

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

            if (isNaN(weightKg) || isNaN(heightM) || weightKg <= 0 || heightM <= 0) {
                  showResult("Please enter valid values for weight and height.");
                  return;
            }

            const bmi = weightKg / (heightM * heightM);
            const roundedBMI = bmi.toFixed(1);

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

            showResult(roundedBMI, category, categoryClass);
      });

      function showResult(bmiValueText, category, categoryClass) {
            if (category === "error") {
                  bmiValue.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${bmiValueText}`;
                  bmiCategory.textContent = "";
                  bmiCategory.className = "bmi-category";
            } else {
                  bmiValue.innerHTML = `Your BMI: <span style="color: var(--accent);">${bmiValueText}</span>`;
                  bmiCategory.textContent = category;
                  bmiCategory.className = `bmi-category ${categoryClass}`;
            }

            resultDiv.style.display = 'block';
            resultDiv.scrollIntoView({ behavior: 'smooth' });
      }

      const themeToggle = document.getElementById('theme-toggle');
      let isDarkMode = false; // default to light

      themeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle('dark', isDarkMode);
            themeToggle.innerHTML = isDarkMode
                  ? '<i class="fas fa-sun"></i>'
                  : '<i class="fas fa-moon"></i>';
      });

      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
});
