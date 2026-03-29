let quizData = [];
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQhhiEiWxlYdOjHqbnmgV7ztbBUcZ6YaMu6N7cd0dOCSCeOimoUuD4XgFMe5m_oYsr6fL4Fowci5cGy/pub?output=csv'; // 貼上剛剛複製的 CSV 連結

// 1. 抓取資料
async function fetchQuestions() {
    const response = await fetch(SHEET_URL);
    const csvText = await response.text();
    
    // 使用 PapaParse 解析 CSV
    Papa.parse(csvText, {
        header: true,
        complete: (results) => {
            quizData = results.data;
            showRandomQuestion();
        }
    });
}

// 2. 顯示隨機題目
function showRandomQuestion() {
    if (quizData.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * quizData.length);
    const item = quizData[randomIndex];
    
    document.getElementById('question').innerText = item.題目;
    document.getElementById('result').innerText = '';
    document.getElementById('next-btn').style.display = 'none';
    
    // 組合選項並打亂
    const options = [item.答案, item.選項B, item.選項C, item.選項D].sort(() => Math.random() - 0.5);
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt, item.答案);
        optionsDiv.appendChild(btn);
    });
}

// 3. 檢查答案
function checkAnswer(selected, correct) {
    const resultEl = document.getElementById('result');
    if (selected === correct) {
        resultEl.innerText = '✅ 正確！';
        resultEl.style.color = 'green';
    } else {
        resultEl.innerText = `❌ 錯誤，正確答案是：${correct}`;
        resultEl.style.color = 'red';
    }
    document.getElementById('next-btn').style.display = 'inline-block';
}

fetchQuestions();