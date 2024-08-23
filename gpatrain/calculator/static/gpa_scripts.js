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





    function old_updateGPA() {
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

    function updateGPA(){
        // Get Data
        console.log("BULLSHI")
        const coursesW = Array.from(document.querySelectorAll('.course')).map(course => {
            const tid = course.closest('.gpa__term').id
            return {
                name : course.querySelector('.course__name').value,
                credits : parseFloat(course.querySelector('.credit__box').value),
                grade : parseFloat(course.querySelector('.course__grade').value),
                term_number : parseInt(tid.replace('term', ''))
                // term_number : parseInt(course.closest(.gpa__term).id)

            }
        }).filter(course => !isNaN(course.grade) && !isNaN(course.credits));
        const numoftermsW = document.querySelectorAll('.gpa__term').length


        fetch('/api/gpa-calculate/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'X-CSRFToken': getCookie('csrftoken')  // Ensure CSRF token is included if needed
            },
            body: JSON.stringify({courses: coursesW, numofterms: numoftermsW})
        }).then(response => response.json())
        .then(data => {
            data.termgpas.forEach(termGPA => {
                const termElement = document.getElementById('term'+ termGPA.term)
                const gpaElement = termElement ? termElement.querySelector('.term__gpa') : null
                if (gpaElement){
                    gpaElement.textContent = `Term GPA: ${termGPA.gpa.toFixed(2)}`;
                }
            });
            document.querySelector('.temp__cumgpa').textContent = `CUMMULATIVE GPA: ${data.cgpa.toFixed(2)}`;

        })
        
    }




    function db_updateGPA() {
        // Collect term data
        const terms = Array.from(document.querySelectorAll('.gpa__term')).map(term => {
            //const termName = term.querySelector('.term__number').textContent;  // I want to get the term's  id
            const termName = term.id
            const courses = Array.from(term.querySelectorAll('.course')).map(course => ({
                name: course.querySelector('.course__name').value,
                grade: parseFloat(course.querySelector('.course__grade').value),
                credits: parseFloat(course.querySelector('.credit__box').value)
            })).filter(course => !isNaN(course.grade) && !isNaN(course.credits));
    
            return {
                name: termName, //Needs to be the terms id
                courses: courses
            };
        });
    
        // Send collected data to backend
        fetch('/api/gpa-calculate/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({terms: terms})
        })
        .then(response => response.json())
        .then(data => {
            data.term_gpas.forEach(termGpa => {
                // // const termElement = document.querySelector(`.gpa__term__header:contains(${termGpa.term}) .term__gpa`);
                // const termElement = document.getElementById(`${termGpa.term}`).gpa__term__header.term__gpa
                // if (termElement) {
                //     termElement.textContent = `Term GPA: ${termGpa.gpa.toFixed(2)}`;
                //////////////////////////////////////////
                const termElement = document.getElementById(termGpa.term);
                // Find the nested element with the class 'term__gpa' within the term element
                const gpaElement = termElement ? termElement.querySelector('.term__gpa') : null;
                
                if (gpaElement) {
                    gpaElement.textContent = `Term GPA: ${termGpa.gpa.toFixed(2)}`;
                }
                //////////////////////////////////////////

            });
            document.querySelector('.temp__cumgpa').textContent = `Cumulative GPA: ${data.cumulative_gpa.toFixed(2)}`;
        })
        .catch(error => console.error('Error calculating GPA:', error));
    } //What is the syntax error here



    

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