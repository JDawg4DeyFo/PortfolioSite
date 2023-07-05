let PostArray = [];
let TagArray = [];
let ExpandedPostArray = [];

(function() {
  const TagSelector = document.querySelector('#tag-selection');
  const RandomLink = document.querySelector('#random-link');
  const AllPostContainer = document.querySelector('#all-sort');

  // Tag Selector event listener
  TagSelector.addEventListener('change', function() {
    const SelectedTag = TagSelector.options[TagSelector.selectedIndex].textContent;
    console.log(SelectedTag);
    TagSort(SelectedTag);
  });

  // RandomLink event listener
  RandomLink.addEventListener('click', GoToRandomPost);

  // Get all posts
  const PostHolder = document.querySelector('#data-all-posts');
  const PostHolderText = PostHolder.textContent;
  PostArray = PostHolderText.split(', ');
  shuffleArray(PostArray);
  
  
  // Convert all posts to URLs, get data from urls, place in all posts container
  PostArray.forEach(function(CurrentIndex, i) {
    CurrentIndex = "../pages/posts/" + CurrentIndex + ".html";
    const BreakLine = document.createElement('br');
    
    fetch(CurrentIndex)
    .then(response => response.text())
    .then(data => {
      // Get all the data
      const parser = new DOMParser();
      const htmlDocument = parser.parseFromString(data, 'text/html');
      const title = htmlDocument.querySelector('title').textContent;
      const TagHolder = htmlDocument.querySelector('#tag-data')
      const TemporaryTagArray = TagHolder.textContent.split(', '); // store tags in array
      
      let DataArray = [CurrentIndex, title];

      // Store any new tags in TagArray, store the tags in data array regardless
      TemporaryTagArray.forEach(function(CurrentItemNested, j) {
        if (!TagArray.includes(TemporaryTagArray[j])) {
          TagArray.push(TemporaryTagArray[j]);
          const NewOption = document.createElement('option');
          NewOption.textContent = TemporaryTagArray[j];
          TagSelector.appendChild(NewOption);
        }

        DataArray.push(TemporaryTagArray[j]);
      })

      // Push Data to expanded post array
      ExpandedPostArray.push(DataArray);
      
      // Place in container
      const PostLink = document.createElement('a');
      PostLink.href = CurrentIndex;
      PostLink.textContent = title;
      PostLink.classList.add('title');
      
      AllPostContainer.appendChild(PostLink);
      AllPostContainer.appendChild(BreakLine);
  });

});

  console.log(ExpandedPostArray);
})();

function GoToRandomPost(event) {
  event.preventDefault();
  // Generate link and send user to said link.
  const RandomIndex = Math.floor(Math.random() * PostArray.length);
  window.location.href = "https://jacobdennon.com/pages/posts/" + PostArray[RandomIndex] + ".html"
}

function TagSort(Tag) {
  const ExecutionBlock = document.querySelectorAll('#fat-baby'); // elements to kill
  const TagPostContainer = document.querySelector('#tag-sort');

  // killing previously generated elements.
  ExecutionBlock.forEach(function(CurrentItem) {
    CurrentItem.remove();
  });

  // Check each post to see if it has selected tag.
  ExpandedPostArray.forEach(function(CurrentItem) {
    if (CurrentItem.includes(Tag)) {
      const PostLink = document.createElement('a');
      const BreakLine = document.createElement('br');

      PostLink.href = CurrentItem[0]; // set up <a>
      PostLink.classList.add('title');
      PostLink.id = 'fat-baby';
      PostLink.textContent = CurrentItem[1];

      BreakLine.id = 'fat-baby'; // marked for death

      TagPostContainer.appendChild(PostLink);
      TagPostContainer.appendChild(BreakLine);
    }
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}