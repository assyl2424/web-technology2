const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Раздаем статические файлы
app.use(express.static('public'));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Обработка BMI
app.post('/calculate-bmi', (req, res) => {
    const { weight, height } = req.body;
    
    if (!weight || !height || weight <= 0 || height <= 0) {
        return res.status(400).json({
            error: 'Введите корректные положительные значения'
        });
    }
    
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const bmi = (weightNum / (heightNum * heightNum)).toFixed(2);
    
    let category = '';
    let color = '';
    
    if (bmi < 18.5) {
        category = 'Недостаточный вес';
        color = 'blue';
    } else if (bmi < 25) {
        category = 'Нормальный вес';
        color = 'green';
    } else if (bmi < 30) {
        category = 'Избыточный вес';
        color = 'orange';
    } else {
        category = 'Ожирение';
        color = 'red';
    }
    
    res.json({
        bmi: bmi,
        category: category,
        color: color,
        weight: weightNum,
        height: heightNum
    });
});

app.listen(PORT, () => {
    console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
});