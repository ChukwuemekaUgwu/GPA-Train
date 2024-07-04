document.addEventListener('DOMContentLoaded', function() {
    // Initial setup: Add event listener to the first term's "Add Course" button
    const initialNewCourseButton = document.querySelector('#term1 .new__course');
    // const initCourseButton = document.querySelector(#term1 .new__course);
    initialNewCourseButton.addEventListener('click', addCourse);
    // initCourseButton.addEventListener('click', addCourse);
    // function addCourse(event){
        // const oldcourse = document.querySelector()
        
    // }
    // Add event listener to the "Add Term" button
    const newTermButton = document.querySelector('.new_term');
    newTermButton.addEventListener('click', addTerm);

    const initialDeleteButtons = document.querySelectorAll('#term1 .delete__icon');
    initialDeleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const course = button.closest('.course');
            course.remove();
            updateGPA();
        });
    });

    // Add event listeners to the course inputs for GPA calculation
    const gpaForm = document.querySelector('.gpa__table');
    gpaForm.addEventListener('change', function(event) {
        if (event.target.matches('.course__grade, .credit__box')) {
            updateGPA();
        }
    });

    function addTerm() {
        const term1 = document.getElementById('term1');
        const newTerm = term1.cloneNode(true);
        const termCount = document.querySelectorAll('.gpa__term').length;
        newTerm.id = `term${termCount + 1}`;
        newTerm.querySelector('.gpa__term__header .term__number').textContent = `Term ${termCount + 1}`;
        newTerm.querySelectorAll('input').forEach(input => input.value = '');
        newTerm.querySelectorAll('select').forEach(select => select.selectedIndex = 0);

        const newCourseButton = newTerm.querySelector('.new__course');
        newCourseButton.removeEventListener('click', addCourse);
        newCourseButton.addEventListener('click', addCourse);

        const coursesContainer = newTerm.querySelector('.courses');
        coursesContainer.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            addCourse({ target: newCourseButton });
        }

        document.querySelector('.gpa__terms').appendChild(newTerm);
    }

    function addCourse(event) {
        const termElement = event.target.closest('.gpa__term');
        const coursesContainer = termElement.querySelector('.courses');
        const firstCourse = document.querySelector('#term1 .course');
        const newCourse = firstCourse.cloneNode(true);
        newCourse.querySelectorAll('input').forEach(input => input.value = '');
        newCourse.querySelectorAll('select').forEach(select => select.selectedIndex = 0);

        const deleteButton = newCourse.querySelector('.delete__icon');
        deleteButton.addEventListener('click', function() {
            newCourse.remove();
            updateGPA();
        });

        coursesContainer.appendChild(newCourse);
    }

    function updateGPA() {
        const courses = Array.from(document.querySelectorAll('.course')).map(course => {
            return {
                name: course.querySelector('.course__name').value,
                grade: parseFloat(course.querySelector('.course__grade').value),
                credits: parseFloat(course.querySelector('.credit__box').value)
            };
        }).filter(course => !isNaN(course.grade) && !isNaN(course.credits));

        fetch('/api/gpa-calculate/', {  // Adjust the URL based on your actual API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')  // Ensure CSRF token is included if needed
            },
            body: JSON.stringify({courses: courses})
        })
        .then(response => response.json())
        .then(data => {
            document.querySelector('.gpa__term__output').textContent = `Calculated GPA: ${data.gpa.toFixed(2)}`; //Change to term__gpa
        })
        .catch(error => console.error('Error calculating GPA:', error));
    }

    // Helper function to get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});