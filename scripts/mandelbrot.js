const fragment = document.createDocumentFragment();

const MaxColorValue = 0xFFFFFF;
const XBoundary = 2;
const YBoundary  = XBoundary;
const XDots = 200;
const YDots = 200;

let DotMatrix = [];
let Zoom = 1;

function MandelbrotAlgorithm(TopLeft) {
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
    const OGx = TopLeft[0];
    const OGy = TopLeft[1];
    const deltax = (XBoundary * 2) / (Zoom * XDots);
    const deltay = (YBoundary * 2) / (Zoom * YDots);

    Item.forEach(function (NestedItem, NestedIndex) {
      const x0 = TopLeft[0] + (deltax * NestedIndex);
      const y0 = TopLeft[1] + (deltay * Index);
      
      let x = 0;
      let y = 0;
      let iteration = 0;

      while ((x*x) + (y*y) <= 2*2 && (iteration < MaxIteration)) {
        const xtemp = x*x - y * y + x0;
        y = 2*x*y + y0;
        x = xtemp;
        iteration++;
      }
      console.log(iteration);
      const ColorValue = Math.floor((iteration / MaxIteration) * MaxColorValue);
      const ColorString = "#" + ColorValue.toString('16');

      NestedItem.style.color = ColorString;

      console.log({ColorString, ColorValue, x0, y0});
    });
  });
}

function ZoomIn(MouseX, MouseY) {
  console.log('zoomed in', { MouseX, MouseY });
  /*
    manage zoom
    set up top left pixel coord
      - mouse position is middle
    Call algorithm
  */
  Zoom++;
  const TopLeftDotxel = [MouseX - (XBoundary / Zoom), MouseY - (YBoundary / Zoom)];

  MandelbrotAlgorithm(TopLeftDotxel);
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
  const Cols = XDots;
  const Rows = YDots;
  console.log({ Rows, Cols });

  const DotSavior = document.createElement('span');
  DotSavior.textContent = '.';

  for (let i = 0; i < Rows; i++) {
    DotMatrix[i] = [];

    NewDiv = DivTemplate.cloneNode(false);
    fragment.append(NewDiv);

    for (let j = 0; j < Cols; j++) {
      const NewDot = DotSavior.cloneNode(true);
      NewDot.style.color = "rgb(" + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ")";

      DotMatrix[i][j] = NewDot;

      NewDiv.appendChild(NewDot);
    }
  }

  document.body.appendChild(fragment);

  // Add Event Listeners
  document.addEventListener('click', function (event) {
    const MouseX = event.clientX;
    const MouseY = event.clientY;
    
    if (event.ctrlKey) {
      ZoomOut();
    } else {
      ZoomIn(MouseX, MouseY); 
    }
  })
})();