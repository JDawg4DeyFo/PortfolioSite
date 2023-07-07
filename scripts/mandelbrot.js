(function() {
    // Initialize stuff
    const DotTemplate = document.querySelector('#dot-template');
    const BreakLineTemplate = document.createElement('br');

    const DotWidth = DotTemplate.offsetWidth;
    const DotHeight = DotTemplate.offsetHeight;

    const ViewportWidth = window.innerWidth;
    const ViewportHeight = window.innerHeight;
    const AspectRatio = ViewportWidth / ViewportHeight;

    // populate screen with apropriate rows and cols of dots.
    console.log(ViewportWidth, DotWidth);
    const Cols = Math.floor(ViewportWidth / DotWidth);
    const Rows = Math.floor(ViewportHeight / DotHeight);
    console.log(Rows, Cols);

    // dot matrix
    let DotMatrix = [];

    const DotSavior = document.createElement('span');
    DotSavior.textContent = '.';

    fragment = document.createDocumentFragment();

    for (let i = 0; i < Rows; i++) {
        DotMatrix[i] = [];

        for (let j = 0; j < Cols; j++) {
            const NewDot = DotSavior.cloneNode(true);

            DotMatrix[i][j] = NewDot;

            fragment.appendChild(NewDot);
        }
        
        fragment.appendChild(BreakLineTemplate.cloneNode(false));
    }

    document.body.appendChild(fragment);
})();