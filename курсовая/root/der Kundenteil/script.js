const ctx = document.getElementById("chart").getContext('2d');
let chart;
  
function playSound(frequency) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)(); 
    const oscillator = audioContext.createOscillator(); //создаем сам оск
    oscillator.type = 'triangle';  //тип звука (square, sine, etc.)
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);  //для установки частот
    oscillator.connect(audioContext.destination);  // коннект осциллилятора к динамикам
    oscillator.start();  
    oscillator.stop(audioContext.currentTime + 0.2);  // останавливается после 100ms
}

  const statusEl = document.getElementById('status');
  
  function updateStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.style.color = isError ? '#dc3545' : '#666';
  }

async function fetchSteps(algorithm, users_input) {
  const urls = [
    'http://127.0.0.1:8000/sort',
    'http://127.0.0.1:8001/sort',
    '/sort'
  ];

  updateStatus('Connecting to sorting server...');

  for (const url of urls) {
    try {
      updateStatus(`Trying ${url}...`);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
        numbers: users_input,
        algorithm: algorithm 
        })
      });

      if (!response.ok) {
        const text = await response.text();
        console.warn(`HTTP ${response.status} from ${url}:`, text);
        continue;
      }

      updateStatus('Подключилось!!!!!!');
      return await response.json();
    } catch (err) {
      console.warn(`Проблема с интернетом ${url}:`, err);
        const error = 'Не получается подключиться к порту, активирован ли сервер?';
        updateStatus(error, true);
        return { error };
    }
  }
}

  document.getElementById('start').addEventListener('click', async () => {
  const algorithm = document.getElementById("algorithm").value;
  

const raw = document.getElementById("numbersInput").value;

const userArray = raw
  .split(",")
  .map(n => Number(n.trim()))
  .filter(n => !isNaN(n));

    if (userArray.length === 0) {
    alert("Введите хотя бы одно число!");
    return;
  }
  
  const data = await fetchSteps(algorithm, userArray);

    if (data.error) {
      console.error('Server error:', data.error);
      alert('Server error: ' + data.error);
      return;
    }

    const steps = data.steps;
    if (!Array.isArray(steps) || steps.length === 0) {
      console.error('Invalid steps from server:', steps);
      alert('No steps returned from server. Check console for details.');
      return;
    }
  
  const startBtn = document.getElementById('start');
  if (chart) chart.destroy(); // чтобы не наслаивались графики
  startBtn.disabled = true;
  
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: steps[0].map((_, i) => i + 1),
        datasets: [{
          label: `${algorithm} Sorting progress`,
          data: steps[0],
          backgroundColor: '#51795aff'
        }]
      },
      options: {
        animation: { duration: 300 },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  
  // начинаем с 1 потому что steps[0] уже отображено в начальной диаграмме
  let i = 1;
    const interval = setInterval(() => {
      if (i >= steps.length) {
        clearInterval(interval);
        startBtn.disabled = false;
        // завершающийся 
        playSound(80); //
        return;
      }
      
      const currentData = steps[i];
      chart.data.datasets[0].data = currentData;
      chart.update();
      
      const maxValue = Math.max(...currentData);
      const frequency = 15000 + (maxValue / Math.max(...steps[0])) * 606;
      playSound(frequency);
      
      i++;
    }, 400);
  });