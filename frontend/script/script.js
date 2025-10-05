document.addEventListener('DOMContentLoaded', () => {
    // Element selectors
    const studentToggle = document.getElementById('student-toggle');
    const teacherToggle = document.getElementById('teacher-toggle');
    const studentForm = document.getElementById('student-form');
    const teacherForm = document.getElementById('teacher-form');
    const studentError = document.getElementById('student-error');
    const teacherError = document.getElementById('teacher-error');

    // Toggle utility
    function switchMode(isStudent) {
        studentForm.classList.toggle('hidden', !isStudent);
        teacherForm.classList.toggle('hidden', isStudent);
        studentToggle.classList.toggle('active-toggle', isStudent);
        teacherToggle.classList.toggle('active-toggle', !isStudent);

        // Clear all input fields and error messages when switching
        document.querySelectorAll('.form-input').forEach(input => input.value = '');
        document.querySelectorAll('.error-message').forEach(error => error.textContent = '');

        console.log(`Switched to ${isStudent ? 'student' : 'teacher'} form`);
    }

    // Initialize default view
    switchMode(true);

    // Event listeners for toggles
    studentToggle.addEventListener('click', () => switchMode(true));
    teacherToggle.addEventListener('click', () => switchMode(false));

    // Student login form
    studentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const studentId = document.getElementById('student-id').value;
        const studentMac = document.getElementById('student-mac').value;

        // Basic validation
        if (!studentId || !studentMac) {
            studentError.textContent = 'Please enter both ID and MAC address.';
            studentError.classList.add('show');
            return;
        }

        fetch('http://localhost:3000/api/login/student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: studentId,
                mac: studentMac
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    studentError.textContent = '';
                    studentError.classList.remove('show');
                    localStorage.setItem('token', data.token);

                    const studentSuccess = document.getElementById('student-success');
                    studentSuccess.textContent = 'Login successful! Redirecting...';
                    studentSuccess.classList.add('show');

                    setTimeout(() => {
                        window.location.href = 'landing.html';
                    }, 2000);
                } else {
                    studentError.textContent = data.message || 'Invalid credentials';
                    studentError.classList.add('show');
                }
            })
            .catch(err => {
                console.error('Error:', err);
                studentError.textContent = 'Server error. Please try again later.';
                studentError.classList.add('show');
            });
    });

    // Teacher login form
    teacherForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const teacherEmail = document.getElementById('teacher-email').value;
        const teacherPassword = document.getElementById('teacher-password').value;

        // Basic validation
        if (!teacherEmail || !teacherPassword) {
            teacherError.textContent = 'Please enter both email and password.';
            teacherError.classList.add('show');
            return;
        }

        fetch('http://localhost:3000/api/login/teacher', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: teacherEmail,
                password: teacherPassword
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    teacherError.textContent = '';
                    teacherError.classList.remove('show');
                    localStorage.setItem('token', data.token);

                    const teacherSuccess = document.getElementById('teacher-success');
                    teacherSuccess.textContent = 'Login successful! Redirecting...';
                    teacherSuccess.classList.add('show');

                    setTimeout(() => {
                        window.location.href = 'landing.html';
                    }, 2000);
                } else {
                    teacherError.textContent = data.message || 'Invalid email or password.';
                    teacherError.classList.add('show');
                }
            })
            .catch(err => {
                console.error('Error:', err);
                teacherError.textContent = 'Server error. Please try again later.';
                teacherError.classList.add('show');
            });
    });

    // Clear error on typing
    ['student-id', 'student-mac'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            studentError.textContent = '';
            studentError.classList.remove('show');
        });
    });

    ['teacher-email', 'teacher-password'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            teacherError.textContent = '';
            teacherError.classList.remove('show');
        });
    });

    console.log('Login portal script initialized.');
});
