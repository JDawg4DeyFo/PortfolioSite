const fragment = document.createDocumentFragment();

const MaxColorValue = 0xFFFFFF; // white
const XBoundary = 2; // How far from origin on one side
const YBoundary  = XBoundary; // same as x, just y
const XDots = 300; // basically resolution
const YDots = 300;

let DotMatrix = []; // variable to store all dots in, so each one can be manipulated
let Zoom = 1; // Zoom to determine delta stuff
let ZoomIncrement = 2;
let TopLeftDotxel = [-XBoundary, YBoundary]; // Top left dotxel's position in the complex plane.
let ZoomFactor = 1;

let ActiveIntervals = [];

// This is the function that determines each pixel's place in the mandelbrot set.
function MandelbrotAlgorithm() {
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
      let x2 = 0;
      let y2 = 0;
      let iteration = 0;

      while (x2 + y2 <= 4 && iteration < MaxIteration) {
        y = 2 * x * y + y0;
        x = x2 - y2 + x0;
        x2 = x * x;
        y2= y * y;
        
        iteration++;
      }

      const ColorValue = MaxColorValue - Math.floor((iteration / MaxIteration) * MaxColorValue);
      const ColorString = "#" + ColorValue.toString('16').padStart(6, '0'); // hex color code

      NestedItem.style.color = ColorString; // change color of dot according to algorithm's will.
    });
  });
}

function ZoomIn(CoordX, CoordY) {
 // increment zooom by 1
  if (ZoomFactor == 0) {
    Zoom += ZoomIncrement;
  } else {
    Zoom *= ZoomIncrement;
  }
  // Determine top left dotxel according to mouse click position, boundaries and zoom
  TopLeftDotxel = [CoordX - (XBoundary / Zoom), CoordY + (YBoundary / Zoom)];

  // if the top left dotxel is outside our defined boundary, then set it to nearest edge.
  if (TopLeftDotxel[0] < -XBoundary) {
    TopLeftDotxel[0] = -XBoundary;
  } else if (TopLeftDotxel[0] > XBoundary - (XBoundary / Zoom)) {
    TopLeftDotxel[0] = XBoundary - ((2 * XBoundary) / Zoom);
  }

  // Again, but with y
  if (TopLeftDotxel[1] < -YBoundary) {
    TopLeftDotxel[1] = -YBoundary + ((2 * YBoundary) / Zoom);
  } else if (TopLeftDotxel[1] > YBoundary - (YBoundary / Zoom)) {
    TopLeftDotxel[1] = YBoundary;
  }

  // Call the algortihm once we're done with top left dotxel manipulation
  console.log('ZoomIn()', {CoordX, CoordY, TopLeftDotxel});
  MandelbrotAlgorithm();
}

function ZoomOut() {
  // If Zoom is already at 1, do nothing
  if (Zoom == 1) {
    return;
  }

  // Decrement Zoom and check(should never happen) if Zoom is less than one
  if (ZoomFactor == 0) {
    Zoom -= ZoomIncrement;
    if (Zoom < 1) {
    Zoom = 1;
    }
  } else {
    Zoom = Math.floor(Zoom / ZoomIncrement);
  }

  // The mandelbrot function will handle everything from here.
  MandelbrotAlgorithm();
}

function ClosePopup() {
  // Timeout so that it doesn't register as a click.
  setTimeout(function() {
    const ContainerElement = document.querySelector('.information-container');
    ContainerElement.style.display = 'none';
  }, 100)
}

function ResetMandelbrot() {
  TopLeftDotxel = [-XBoundary, YBoundary];
  Zoom = 1;
  ZoomIncrement = 1;
  MandelbrotAlgorithm();
}

function ZoomIncrementDisplay() {
  const DisplayIntervalMS = 100;
  const DisplayTimeMS = 1300;
  const DisplayIterations = DisplayTimeMS / DisplayIntervalMS;

  const ZoomDisplayContainer = document.querySelector('.increment-display');

  let LocalIndex = 0;

  ZoomDisplayContainer.style.display = 'block';
  if (ZoomFactor == 0) {
  ZoomDisplayContainer.textContent = '+' + ZoomIncrement + 'x';
  } else {
    ZoomDisplayContainer.textContent = '*' + ZoomIncrement + 'x';
  }
  ActiveIntervals.push("foo");

  const ActiveIntervalLengthAsWeFoundIt = ActiveIntervals.length;

  let ZoomIntervalID = setInterval(function() {
    // logic stuff so we don't get a bunch of functions trying to kill the display at the same time
    if (ActiveIntervalLengthAsWeFoundIt != ActiveIntervals.length) {
      clearInterval(ZoomIntervalID);
    }
    
    // Check if enough rounds have passed.
    if (LocalIndex >= DisplayIterations) {
      ZoomDisplayContainer.style.display = 'none';

      clearInterval(ZoomIntervalID);
      ActiveIntervals = [];
    }

    LocalIndex++;

  }, DisplayIntervalMS);
}

(function () {
  // Initialize stuff
  const DotTemplate = document.querySelector('#dot-template');
  const BreakLineTemplate = document.createElement('br');
  const DivTemplate = document.createElement('div');
  const PopupCloseElement = document.querySelector('.close');
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
    } else if (PopupCloseElement.parentElement.parentElement.style.display != 'none') {
      console.log('still with popup');
    } else if ((MouseX < PixelBoundaryX) && (MouseY < PixelBoundaryY)) {
      // Determine coords of click in complex plane, send them to zoomin() function.
      const CoordX = ((2 * MouseX * XBoundary) / (PixelBoundaryX * Zoom)) + TopLeftDotxel[0];
      const CoordY = TopLeftDotxel[1] - ((2 * MouseY * YBoundary) / (PixelBoundaryY * Zoom));

      console.log({MouseX, MouseY, PixelBoundaryX, PixelBoundaryY});
      ZoomIn(CoordX, CoordY, event);
    }
  });

  document.addEventListener('wheel', function (event) {
    if (event.shiftKey) {
      if (event.deltaY < 0) {
        ZoomIncrement++;
      } else if (ZoomIncrement > 1) {
        ZoomIncrement--;
      }

      ZoomIncrementDisplay();
    }

  });

  document.addEventListener('keydown', function(event) {
    // reset if user inputs r key.
    if (event.key == 'r') {
      ResetMandelbrot();
    }
    
    // change zoom factor if . key pressed
    if (event.key == '.') {
      if (ZoomFactor == 0) {
        ZoomFactor = 1;
      } else {
        ZoomFactor = 0;
      }
    }
  });

  // add event listener for popup close
  PopupCloseElement.addEventListener('click', ClosePopup);
})();