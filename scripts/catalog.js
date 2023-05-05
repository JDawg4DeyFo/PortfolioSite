const dateMeta = document.querySelector('meta[name="date"]');
const date = dateMeta.getAttribute('content');
console.log(date);



  (function() {
    fetch('../pages/posts/.html')
    .then(response => response.text())
    .then(data => {
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(data, 'text/html');
    const title = htmlDocument.querySelector('title').textContent;
    
    // Do something with the retrieved data
    console.log(title); 
  })
    .catch(error => console.error(error));
  })();