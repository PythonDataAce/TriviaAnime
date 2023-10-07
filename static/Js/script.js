document.addEventListener('DOMContentLoaded', (event) => {
    // El DOM está completamente cargado, ahora puedes ejecutar tu código JavaScript

    // Inicialización de variables
    const animeCarousel = document.getElementById('animeCarousel');
    const questionContainer = document.getElementById('questionContainer');
    const questionText = document.getElementById('questionText');
    const labels = [document.getElementById('label1'), document.getElementById('label2'), document.getElementById('label3'), document.getElementById('label4')];
    const nextButton = document.getElementById('nextButton');
    const restartButton = document.getElementById('restartButton');
    const resultMessage = document.getElementById('resultMessage');
    const scoreValue = document.getElementById('scoreValue');
    let currentAnime = '';
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = null;

    // Función para cargar las preguntas desde el archivo JSON
    function loadQuestions() {
        fetch('questions.json')
            .then(response => response.json())
            .then(data => {
                questions = data;
                showQuestion();
            })
            .catch(error => {
                console.error('Error al cargar el archivo JSON:', error);
            });
    }

    // Función para mostrar una pregunta
    function showQuestion() {
        if (questions && questions[currentAnime]) {
            const currentQuestion = questions[currentAnime][currentQuestionIndex];
            questionText.textContent = currentQuestion.question;
            for (let i = 0; i < 4; i++) {
                labels[i].textContent = currentQuestion.options[i];
                labels[i].previousElementSibling.checked = false;
            }
        }
    }

    // Función para verificar respuesta
    function checkAnswer(selectedOption) {
        const userAnswer = labels[selectedOption - 1].textContent;
        const currentQuestion = questions[currentAnime][currentQuestionIndex];

        if (userAnswer === currentQuestion.answer) {
            score++;
            resultMessage.textContent = '¡Respuesta correcta!';
        } else {
            resultMessage.textContent = 'Aun te falta conocer del mundo de ' + currentAnime;
        }

        scoreValue.textContent = score;
    }

    // Manejador de eventos para el botón "Siguiente Pregunta"
    nextButton.addEventListener('click', () => {
        const selectedOption = Array.from(document.querySelectorAll('input[name="answer"]')).find(input => input.checked);

        if (selectedOption) {
            checkAnswer(parseInt(selectedOption.id.replace('option', '')));
            currentQuestionIndex++;
        }

        if (currentQuestionIndex < questions[currentAnime].length) {
            showQuestion();
            resultMessage.textContent = '';
        } else {
            questionContainer.innerHTML = '<h2 class="text-center">¡Juego completado!</h2>';
            resultMessage.textContent = 'Puntuación final: ' + score + ' de ' + questions[currentAnime].length;
            nextButton.style.display = 'none';
            restartButton.style.display = 'block';
        }
    });

    // Manejador de eventos para detectar el cambio de diapositiva en el carrusel
    animeCarousel.addEventListener('slid.bs.carousel', function (event) {
        const newIndex = event.to;
        const animeOptions = ["onePiece", "dragonBall", "naruto"];

        currentAnime = animeOptions[newIndex];
        currentQuestionIndex = 0;
        score = 0;

        scoreValue.textContent = score;

        showQuestion();
        
        resultMessage.textContent = '';

        nextButton.style.display = 'block';
        
        restartButton.style.display = 'none';
        
    });

    // Manejador de eventos para el botón "Reiniciar Juego"
    restartButton.addEventListener('click', () => {

       currentQuestionIndex = 0;
       score = 0;

       scoreValue.textContent = score;

       showQuestion();

       resultMessage.textContent = '';

       nextButton.style.display = 'block';

       restartButton.style.display = 'none';
       
       animeCarousel.carousel(0); // Vuelve al primer slide del carrusel
    });

    loadQuestions();
});
