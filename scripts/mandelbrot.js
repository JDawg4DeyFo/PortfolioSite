let DotMatrix = [];

function MandelbrotAlgorithm(TopLeft, BottomRight, Zoom) {
  /*
  for each pixel (Px, Py) on the screen do
      x0 := scaled x coordinate of pixel (scaled to lie in the Mandelbrot X scale (-2.00, 0.47))
      y0 := scaled y coordinate of pixel (scaled to lie in the Mandelbrot Y scale (-1.12, 1.12))
      x := 0.0
      y := 0.0
      iteration := 0
      max_iteration := 1000
      while (x*x + y*y ≤ 2*2 AND iteration < max_iteration) do
          xtemp := x*x - y*y + x0
          y := 2*x*y + y0
          x := xtemp
          iteration := iteration + 1

      color := palette[iteration]
      plot(Px, Py, color)
  */
  const MaxIteration = 1000;


  DotMatrix.forEach(function (Item, Index) {
    Item.forEach(function (NestedItem, NestedIndex) {

    });
  });
}

function ZoomIn(MouseX, MouseY) {
  console.log('zoomed in', { MouseX, MouseY });
  /*
    need to set up new coords for each dotxel on zoom in
    joe comon black top she got ju ju eyeballs!
  */
}

(function () {
  // Initialize stuff
  const DotTemplate = document.querySelector('#dot-template');
  const BreakLineTemplate = document.createElement('br');
  const DivTemplate = document.createElement('div');

  const DotWidth = DotTemplate.offsetWidth;
  const DotHeight = DotTemplate.offsetHeight;
  const ViewportWidth = document.body.clientWidth;
  let ViewportHeight = window.innerHeight;
  const AspectRatio = ViewportWidth / ViewportHeight;

  DotTemplate.style.display = 'none';

  // populate screen with apropriate rows and cols of dots.
  console.log({ DotWidth, DotHeight, ViewportWidth, ViewportHeight });
  const Cols = 200;
  const Rows = 200;
  console.log({ Rows, Cols });

  const DotSavior = document.createElement('span');
  DotSavior.textContent = '.';

  fragment = document.createDocumentFragment();

  for (let i = 0; i < Rows; i++) {
    DotMatrix[i] = [];

    NewDiv = DivTemplate.cloneNode(false);
    fragment.append(NewDiv);

    for (let j = 0; j < Cols; j++) {
      const NewDot = DotSavior.cloneNode(true);

      DotMatrix[i][j] = NewDot;

      NewDiv.appendChild(NewDot);
    }
  }

  document.body.appendChild(fragment);

  // Add Event Listeners
  window.addEventListener('scroll', function (event) {
    const MouseX = event.ClientX;
    const MouseY = event.ClinetY;

    ZoomIn(MouseX, MouseY);
  })
})();