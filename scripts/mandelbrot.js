const fragment = document.createDocumentFragment();

const MaxColorValue = 0xFFFFFF; // white
const XBoundary = 2; // How far from origin on one side
const YBoundary  = XBoundary; // same as x, just y
const XDots = 200; // basically resolution
const YDots = 200;

let DotMatrix = []; // variable to store all dots in, so each one can be manipulated
let Zoom = 1; // Zoom to determine delta stuff
let ZoomIncrement = 1;
let TopLeftDotxel = [-2, 2]; // Top left dotxel's position in the complex plane.

// This is the function that determines each pixel's place in the mandelbrot set.
function MandelbrotAlgorithm() {
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
  // initialize variables for loop
  const MaxIteration = 1000;
  const OGx = TopLeftDotxel[0];
  const OGy = TopLeftDotxel[1];

  // Begin Accessing matrix.
  DotMatrix.forEach(function (Item, Index) {
    const deltax = (XBoundary * 2) / (Zoom * XDots); // determine delta by zoom and resolution. Smaller delta = better pic
    const deltay = (YBoundary * 2) / (Zoom * YDots);
    
    // Begin accessing each individual pixel
    Item.forEach(function (NestedItem, NestedIndex) {
      // Since each pixel doesn't have it's own coordinate data stored with it, we have to extrapolate from delta x & y and our top left pixel
      const x0 = OGx + (deltax * NestedIndex);
      const y0 = OGy - (deltay * Index);
      
      let x = 0;
      let y = 0;
      let iteration = 0;

      while ((x*x) + (y*y) <= 2*2 && (iteration < MaxIteration)) {
        const xtemp = x*x - y * y + x0;
        y = 2*x*y + y0;
        x = xtemp;
        iteration++;
      }
      const ColorValue = Math.floor((iteration / MaxIteration) * MaxColorValue);
      const ColorString = "#" + ColorValue.toString('16').padStart(6, '0'); // hex color code

      NestedItem.style.color = ColorString; // change color of dot according to algorithm's will.
    });
  });
}

function ZoomIn(MouseX, MouseY) {
  console.log('zoomed in', { MouseX, MouseY });
 // increment zooom by 1
  Zoom += ZoomIncrement;
  // Determine top left dotxel according to mouse click position, boundaries and zoom
  TopLeftDotxel = [MouseX - (XBoundary / Zoom), MouseY + (YBoundary / Zoom)];

  // if the top left dotxel is outside our defined boundary, then set it to nearest edge.
  if (TopLeftDotxel[0] < -XBoundary) {
    console.log("x less than");
    TopLeftDotxel[0] = -XBoundary;
  } else if (TopLeftDotxel[0] > XBoundary - (XBoundary / Zoom)) {
    console.log("x greater than");
    TopLeftDotxel[0] = XBoundary - (XBoundary / Zoom);
  }

  // Again, but with y
  if (TopLeftDotxel[1] < -YBoundary) {
    console.log("y less than");
    TopLeftDotxel[1] = -YBoundary;
  } else if (TopLeftDotxel[1] > YBoundary - (YBoundary / Zoom)) {
    console.log("y greater than");
    TopLeftDotxel[1] = YBoundary - (YBoundary / Zoom);
  }

  // Call the algortihm once we're done with top left dotxel manipulation
  MandelbrotAlgorithm();
}

function ZoomOut() {
  console.log('zooming out');

  if (Zoom == 1) {
    console.log('already zoomed out @ max');
    return;
  }

  Zoom -= ZoomIncrement;

  MandelbrotAlgorithm();
}

(function () {
  // Initialize stuff
  const DotTemplate = document.querySelector('#dot-template');
  const BreakLineTemplate = document.createElement('br');
  const DivTemplate = document.createElement('div');
  DivTemplate.classList.add("dot-container")

  const Cols = XDots;
  const Rows = YDots;
  const DotWidth = DotTemplate.offsetWidth;
  const DotHeight = DotTemplate.offsetHeight;
  const ViewportWidth = document.body.clientWidth;
  let ViewportHeight = window.innerHeight;
  const AspectRatio = ViewportWidth / ViewportHeight;
  
  DotTemplate.style.display = 'none';

  // Need to create dot template, this way browser doesn't crash.
  const DotSavior = document.createElement('span');
  DotSavior.textContent = '.';
  DotSavior.style.color = 'white'; // default color in case something goes wrong

  // Time to populate dots onto non-live document fragment and append to the dot matrix
  for (let i = 0; i < Rows; i++) {
    DotMatrix[i] = []; // create row

    // We put dots in div because otherwise the spacing would be weird, and the debugger would be laggy
    NewDiv = DivTemplate.cloneNode(true);
    fragment.append(NewDiv);

    for (let j = 0; j < Cols; j++) {
      const NewDot = DotSavior.cloneNode(true); // just need to clone

      DotMatrix[i][j] = NewDot; // create columns for each row

      NewDiv.appendChild(NewDot); // append dot to div
    }
  }

  document.body.appendChild(fragment); // fragment is live

  // Call algorithm now
  MandelbrotAlgorithm();

  // Add Event Listeners
  /*
    This event listener will be calling either the zoom in our out. ctrl + click will be zoom out.
    click will zoom in, if click is within bounds.
  */
  document.addEventListener('click', function (event) {
    const MouseX = event.clientX;
    const MouseY = event.clientY;

    // since our dots don't fill the viewport we need to create a rectangle of the bottom right dotxel to determine pix bounds
    const BoundaryRect = DotMatrix[XDots - 1][YDots - 1].getBoundingClientRect();    
    const PixelBoundaryX = BoundaryRect.right;
    const PixelBoundaryY = BoundaryRect.bottom;

    if (event.ctrlKey) {
      ZoomOut();
    } else if ((MouseX < PixelBoundaryX) && (MouseY < PixelBoundaryY)) {
      // Determine coords of click in complex plane, send them to zoomin() function.
      const CoordX = (MouseX / PixelBoundaryX) * Math.abs(TopLeftDotxel[0] + (2 * XBoundary) / Zoom) + TopLeftDotxel[0];
      const CoordY = TopLeftDotxel[1] - (MouseY / PixelBoundaryY) * (TopLeftDotxel[1] + (2 * YBoundary) / Zoom);

      console.log({MouseX, MouseY, COo})

      ZoomIn(CoordX, CoordY);
    } else {
      console.log("Error: click is outside of bounds");
    }
  });

  document.addEventListener('wheel', function (event) {
    if (event.deltaY > 0) {
      ZoomIncrement++;
    } else if (ZoomIncrement > 1) {
      ZoomIncrement--;
    } else {
      console.log('ZoomIncrement is at 1');
    }
    console.log({ZoomIncrement});
  });

})();