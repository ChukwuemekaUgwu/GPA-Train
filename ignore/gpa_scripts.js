document.addEventListener('DOMContentLoaded', function() {
    // Initial setup: Add event listener to the first term's "Add Course" button
    const initialNewCourseButton = document.querySelector('#term1 .new__course');
    initialNewCourseButton.addEventListener('click', addCourse);

    // Add event listener to the "Add Term" button
    const newTermButton = document.querySelector('.new_term');
    newTermButton.addEventListener('click', addTerm);

    const initialDeleteButtons = document.querySelectorAll('#term1 .delete__icon');
    initialDeleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const course = button.closest('.course');
            course.remove();
        });
    });

    function addTerm() {
        // Find the term1 element
        const term1 = document.getElementById('term1');
        
        // Clone the term1 element
        const newTerm = term1.cloneNode(true);
        
        // Get the current number of terms to set a new ID and update the header
        const termCount = document.querySelectorAll('.gpa__term').length;
        
        // Update the ID and header of the new term
        newTerm.id = `term${termCount + 1}`;
        newTerm.querySelector('.gpa__term__header').textContent = `Term ${termCount + 1}`;
        
        // Clear the inputs in the cloned element
        newTerm.querySelectorAll('input').forEach(input => input.value = '');
        newTerm.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
        
        // Add event listener to the new term's "Add Course" button
        const newCourseButton = newTerm.querySelector('.new__course');
        newCourseButton.removeEventListener('click', addCourse); // Ensure no old listener is carried over
        newCourseButton.addEventListener('click', addCourse); // Add new listener
        
        // Append the new term to the list
        document.querySelector('.gpa__terms').appendChild(newTerm);
        
        // Ensure the new term has exactly four courses
        const coursesContainer = newTerm.querySelector('.courses');
        coursesContainer.innerHTML = ''; // Clear current courses
        for (let i = 0; i < 4; i++) {
            addCourse({ target: newCourseButton });
        }
    }

    function addCourse(event) {
        const termElement = event.target.closest('.gpa__term');
        const coursesContainer = termElement.querySelector('.courses');
        const firstCourse = document.querySelector('#term1 .course'); // Get the first course as a template
        const newCourse = firstCourse.cloneNode(true);
        newCourse.querySelectorAll('input').forEach(input => input.value = '');
        newCourse.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
        
        const deleteButton = newCourse.querySelector('.delete__icon');
        deleteButton.addEventListener('click', function() {
            newCourse.remove();
        });
        coursesContainer.appendChild(newCourse);
    }
});
