let currentExam = null;
let timer;
let timeRemaining = 0;

window.onload = function () {
    const token = localStorage.getItem('authToken');
    if (!token) { window.location.href = 'login.html'; return; }

    const examId = localStorage.getItem('currentExamId');
    if (!examId) {
        alert(window.t('no_exam_selected') || 'No exam selected');
        window.location.href = 'exams-list.html';
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (document.getElementById('welcomeText')) {
        document.getElementById('welcomeText').textContent = `${window.t('welcome_user')} ${currentUser.name || ''}`;
    }
    if (document.getElementById('studentName')) {
        document.getElementById('studentName').value = currentUser.name || '';
    }

    loadExam(examId);
};

function loadExam(id) {
    const token = localStorage.getItem('authToken');
    fetch(`/api/students/exams/${id}/questions`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                window.location.href = 'exams-list.html';
                return;
            }
            currentExam = data;
            renderExam();
            startTimer(data.exam.duration);
        })
        .catch(err => {
            console.error('Load exam error:', err);
            alert(window.t('server_error'));
        });
}

function renderExam() {
    document.getElementById('examTitle').textContent = currentExam.exam.title;
    document.getElementById('examSubject').textContent = currentExam.exam.description || '';

    const form = document.getElementById('quizForm');
    if (currentExam.questions.length === 0) {
        form.innerHTML = `<p style="text-align:center; padding: 20px;">${window.t('no_questions_msg') || 'No questions in this exam.'}</p>`;
        return;
    }

    form.innerHTML = currentExam.questions.map((q, index) => {
        let optionsHtml = '';
        if (q.question_type === 'multiple-choice') {
            const options = q.options || [];
            optionsHtml = options.map((opt, i) => `
                <div class="option">
                    <input type="radio" name="q${q.id}" id="q${q.id}_${i}" value="${opt.text}" required>
                    <label for="q${q.id}_${i}">${opt.text}</label>
                </div>
            `).join('');
        } else if (q.question_type === 'calculation' || q.question_type === 'numerical') {
            optionsHtml = `<input type="number" name="q${q.id}" step="any" required placeholder="${window.t('student_name_placeholder')}">`;
        } else if (q.question_type === 'essay') {
            optionsHtml = `<textarea name="q${q.id}" class="essay-answer" required placeholder="${window.t('student_name_placeholder')}"></textarea>`;
        }

        return `
            <div class="question">
                <h3>${index + 1}. ${q.question_text} <span style="font-size: 0.8em; color: #666;">(${q.points} ${window.t('points') || 'درجة'})</span></h3>
                <div class="options-container">
                    ${optionsHtml}
                </div>
            </div>
        `;
    }).join('');
}

function startTimer(durationMinutes) {
    timeRemaining = durationMinutes * 60;
    const timerDisplay = document.getElementById('timer');

    timer = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${window.t('time_remaining')} ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeRemaining <= 0) {
            clearInterval(timer);
            alert(window.t('time_up_msg'));
            submitQuiz();
        }
        timeRemaining--;
    }, 1000);
}

function submitQuiz() {
    if (!confirm(window.t('confirm_submit_quiz'))) return;

    clearInterval(timer);
    const form = document.getElementById('quizForm');
    const formData = new FormData(form);
    const answers = {};

    currentExam.questions.forEach(q => {
        answers[q.id] = formData.get(`q${q.id}`);
    });

    const token = localStorage.getItem('authToken');
    fetch(`/api/students/exams/${currentExam.exam.id}/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers })
    })
        .then(res => res.json())
        .then(data => {
            alert(data.message || 'Submitted');
            window.location.href = 'student-results.html';
        })
        .catch(err => {
            console.error('Submit error:', err);
            alert(window.t('server_error'));
        });
}

function logout() {
    if (confirm(window.t('logout_confirm'))) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userType');
        window.location.href = 'login.html';
    }
}
