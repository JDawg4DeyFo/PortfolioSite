(function(){
    // This function will initialize everything.
   })();

/*
TO DO:
clone html elements to add courses on button click
get values from html elements
calculate on button click
integrate base stats
*/

(function() {
  // Attach event listener to calculate button
  const calculateButton = document.querySelector('#calculate-button');
  calculateButton.addEventListener('click', calculateGPA);

  function calculateGPA(event) {
    event.preventDefault();

    // Retrieve current GPA and total units
    const currentGPAInput = document.querySelector('#currentgpa');
    const totalUnitsInput = document.querySelector('#totalunits');
    const currentGPA = parseFloat(currentGPAInput.value);
    const totalUnits = parseInt(totalUnitsInput.value);

    // Retrieve course inputs
    const courseInputs = document.querySelectorAll('.course-input');
    let totalGradePoints = 0;
    let totalCredits = 0;

    // Calculate grade points and credits for each course
    courseInputs.forEach((input) => {
      const courseName = input.querySelector('.coursename').value;
      const grade = parseFloat(input.querySelector('.grade').value);
      const credits = parseInt(input.querySelector('.credits').value);

      // Calculate grade points for the course
      const gradePoints = grade * credits;
      totalGradePoints += gradePoints;

      // Add course credits to the total credits
      totalCredits += credits;
    });

    // Calculate cumulative GPA
    const cumulativeGPA = (currentGPA * totalUnits + totalGradePoints) / (totalUnits + totalCredits);

    // Display the calculated GPA
    const resultContainer = document.querySelector('#result');
    resultContainer.textContent = `Your GPA is: ${cumulativeGPA.toFixed(2)}`;
  }

  // Attach event listener to add course button
  const addCourseButton = document.querySelector('#add-course-button');
  addCourseButton.addEventListener('click', addCourseInput);

  function addCourseInput(event) {
    event.preventDefault();

    // Clone the course input fields
    const courseInputTemplate = document.querySelector('.course-input-template');
    const newCourseInput = courseInputTemplate.cloneNode(true);
    newCourseInput.classList.remove('course-input-template');
    newCourseInput.classList.add('course-input');

    // Clear the input values of the cloned fields
    newCourseInput.querySelector('.coursename').value = '';
    newCourseInput.querySelector('.grade').value = '4.0';
    newCourseInput.querySelector('.credits').value = '';

    // Append the cloned fields to the form
    const coursesContainer = document.querySelector('#courses-container');
    coursesContainer.appendChild(newCourseInput);
  }
})();