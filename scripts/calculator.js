(function() {
  //Attach event listener to calculate button
  const calculateButton = document.querySelector('#calculate-button');
  calculateButton.addEventListener('click', calculateGPA);

  // Attach event listener to add course button
  const addCourseButton = document.querySelector('#add-course-button');
  addCourseButton.addEventListener('click', addCourseInput);

  // Attach event listener to remove course button
  const RemoveCourseButton = document.querySelector('#remove-course-button');
  RemoveCourseButton.addEventListener('click', RemoveCourseInput);

  // Make sure result box is invisible
  const ResultBox = document.querySelector('#result-container');
  ResultBox.style.display = "none";
})();

function addCourseInput(event) {
  event.preventDefault();

  // Clone the course input fields
  const courseInputTemplate = document.querySelector('#course-input');
  const newCourseInput = courseInputTemplate.cloneNode(true);
  const BreakLine = document.createElement('br');
  const RemoveCourseButton = document.querySelector('#remove-course-button');

  BreakLine.id = "big-fat-rock";

  // Clear the input values of the cloned fields
  newCourseInput.querySelector('#coursename').value = '';
  newCourseInput.querySelector('#grade').value = '4.0';
  newCourseInput.querySelector('#units').value = '';

  // Append the cloned fields to the form
  const coursesContainer = document.querySelector('#courses-container');

  coursesContainer.append(BreakLine);
  coursesContainer.append(newCourseInput);

  // Make sure remove button is visible
  RemoveCourseButton.style.display = "inline-block";
}

function RemoveCourseInput(event) {
  event.preventDefault();
  const InputElements = document.querySelectorAll('#course-input');
  const BigRocks = document.querySelectorAll('#big-fat-rock');
  const ParentElement = document.querySelector('#courses-container');
  const RemoveCourseButton = event.target;

  // remove stuff
  ParentElement.removeChild(InputElements[InputElements.length - 1]);
  ParentElement.removeChild(BigRocks[BigRocks.length -1 ]);

  // Remove the remove button if there's only one element left.
  if (document.querySelectorAll('#course-input').length <= 1) {
    RemoveCourseButton.style.display = "none";
  }
}

function calculateGPA(event) {
  event.preventDefault();

  // Retrieve current GPA and total units
  const currentGPAInput = document.querySelector('#currentgpa');
  const totalUnitsInput = document.querySelector('#totalunits');
  const currentGPA = parseFloat(currentGPAInput.value);
  const currentUnits = parseInt(totalUnitsInput.value);
  const ResultBox = document.querySelector('#result-container');
  
  // Make the result visible
  ResultBox.style.display = "flex";

  // Retrieve course inputs
  const courseInputs = document.querySelectorAll('#course-input');
  let totalGradePoints = 0;
  let totalUnits = 0;

  // Calculate grade points and credits for each course
  courseInputs.forEach((input) => {
    const grade = parseFloat(input.querySelector('#grade').value);
    const units = parseInt(input.querySelector('#units').value);

    // Calculate grade points for the course
    const gradePoints = grade * units;
    totalGradePoints += gradePoints;

    // Add course credits to the total credits
    totalUnits += units;
  });

  // Calculate cumulative GPA
  let cumulativeGPA = 0;
  if (isNaN(currentGPA) || isNaN(currentGPA)) {
    console.log("shit");
    cumulativeGPA = totalGradePoints / totalUnits;
  } else {
    console.log("not in here");
    cumulativeGPA = (currentGPA * currentUnits + totalGradePoints) / (totalUnits + currentUnits);
  }

  // Display the calculated GPA
  const resultContainer = document.querySelector('#result');
  resultContainer.textContent = `Your GPA is: ${cumulativeGPA.toFixed(2)}`;
}