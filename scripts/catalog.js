const dateMeta = document.querySelector('meta[name="date"]');
const date = dateMeta.getAttribute('content');
console.log(date);

let PostArray = [];
let TagArray = [];
let ExpandedPostArray = [];

(function() {
  // Attach Event Listeners to random button and tag sort thing
  const TagSelector = document.querySelector('#tag-selector');
  const RandomLink = document.querySelector('#random-link');

  // Tag Selector event listener
  TagSelector.addEventListener('change', function() {
    const SelectedTag = TagSelector.options[TagSelector.selectedIndex];
    TagSort(SelectedTag.value);
  });

  // RandomLink event listener
  RandomLink.addEventListener('click', GoToRandomPost());

  // Get all posts
  const PostHolder = document.querySelector('#data-all-posts');
  const PostHolderText = PostHolder.textContent;
  PostArray = PostHolderText.split(', ');

  // Convert all posts to URLs, get data from urls
  PostArray.forEach(function(CurrentIndex) {
    PostArray[CurrentIndex] = "../pages/posts/" + PostArray[CurrentIndex] + ".html";
    
    fetch(PostArray[CurrentIndex])
    .then(response => response.text())
    .then(data => {
      // Get all the data
      const parser = new DOMParser();
      const htmlDocument = parser.parseFromString(data, 'text/html');
      const title = htmlDocument.querySelector('title').textContent;
      const TagHolder = htmlDocument.querySelector('.tag-data')
      const TemporaryTagArray = TagHolder.split(', ');
      
      let DataArray = [PostArray[CurrentIndex], title];

      // Store any new tags in TagArray, store the tags in data array regardless
      TemporaryTagArray.forEach(function(CurrentIndexNested) {
        if (TagArray.includes(TemporaryTagArray[CurrentIndex])) {
          TagArray.push(TemporaryTagArray[CurrentIndex]);
        }

        DataArray.push(TemporaryTagArray[CurrentIndex]);
      })

      // Push Data to expanded post array
      ExpandedPostArray.push(DataArray);
  });

  // Put all tags as options in selector element
  

})
  .catch(error => console.error(error));
})();

function GoToRandomPost(event) {

}

function TagSort(OptionValue) {

}