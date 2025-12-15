document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bmiForm');
    const resetBtn = document.getElementById('resetBtn');
    const resultSection = document.getElementById('resultSection');
    const bmiValue = document.getElementById('bmiValue');
    const categoryBox = document.getElementById('categoryBox');
    const categoryText = document.getElementById('categoryText');
    const detailWeight = document.getElementById('detailWeight');
    const detailHeight = document.getElementById('detailHeight');
    const detailStatus = document.getElementById('detailStatus');
    const bmiCircle = document.getElementById('bmiCircle');
    
    // Обработка отправки формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Получение данных формы
        const formData = new FormData(form);
        const data = {
            weight: formData.get('weight'),
            height: formData.get('height')
        };
        
        // Валидация на клиенте
        if (!data.weight || !data.height || data.weight <= 0 || data.height <= 0) {
            alert('Пожалуйста, введите корректные положительные значения');
            return;
        }
        
        // Отправка запроса на сервер
        try {
            const response = await fetch('/calculate-bmi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка сервера');
            }
            
            const result = await response.json();
            
            // Обновление UI с результатами
            updateUI(result);
            
            // Показать секцию с результатом
            resultSection.style.display = 'block';
            
            // Плавная прокрутка к результатам
            resultSection.scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            alert('Ошибка: ' + error.message);
        }
    });
    
    // Сброс формы
    resetBtn.addEventListener('click', function() {
        form.reset();
        resultSection.style.display = 'none';
    });
    
    // Функция обновления интерфейса с результатами
    function updateUI(result) {
        // Обновление значения BMI
        bmiValue.textContent = result.bmi;
        
        // Обновление категории и цвета
        categoryText.textContent = result.category;
        categoryBox.className = 'category-box ' + result.color + '-bg';
        
        // Обновление деталей
        detailWeight.textContent = result.weight + ' кг';
        detailHeight.textContent = result.height + ' м';
        detailStatus.textContent = result.category;
        
        // Обновление круга с цветом
        bmiCircle.style.borderColor = getColorCode(result.color);
    }
    
    // Функция для получения HEX кода цвета
    function getColorCode(colorName) {
        const colors = {
            'blue': '#3498db',
            'green': '#2ecc71',
            'orange': '#f39c12',
            'red': '#e74c3c'
        };
        return colors[colorName] || '#e0e0e0';
    }
    
    // Инициализация примера значений
    form.weight.value = '70';
    form.height.value = '1.75';
});