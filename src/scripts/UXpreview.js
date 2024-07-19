// Import the neonCursor function from the CDN
import { neonCursor } from "https://unpkg.com/threejs-toys@0.0.8/build/threejs-toys.module.cdn.min.js";

let appSection = document.getElementById('app');
let scriptRunning = false;
let cursorInstance;
let observer;
let lastScrollTop = 0; // To keep track of the last scroll position

// Options for the Intersection Observer
const options = {
    root: null, // Viewport as the root
    rootMargin: '0px',
    threshold: 0.8, // Trigger when 80% of the target is visible
};

// Function to create or reset the neonCursor instance
const createOrResetCursor = () => {
  
    cursorInstance = neonCursor({
      el: appSection,
      shaderPoints: 16,
      curvePoints: 80,
      curveLerp: 0.8, // view threshold is 80%
      radius1: 5,
      radius2: 30,
      velocityTreshold: 10,
      sleepRadiusX: 100,
      sleepRadiusY: 100,
      sleepTimeCoefX: 0.0025,
      sleepTimeCoefY: 0.0025
    });

};
  
  // Callback function when the app section is intersecting
const handleIntersection = (entries, currentObserver) => {
    entries.forEach(entry => {
        const currentScrollTop = window.scrollY || window.pageYOffset;
        const isScrollingUp = currentScrollTop < lastScrollTop;

        if (entry.isIntersecting && !isScrollingUp) {
            // App section is in view and scrolling down only
            if (!scriptRunning) {
                createOrResetCursor();
                scriptRunning = true;
            }
        } else {
            // App section is out of view or scrolling down
            if (scriptRunning) {
                // Stil facing challenges with memory build up after each cursorInstance run
                // so only running instance once now and let it hold memory, thats the best i could do to minimise memory consumption 11/11/2023 21:30
                /*
                scriptRunning = false;
                // Replace the app section with a cloned instance
                const clonedSection = appSection.cloneNode(true);
                appSection.parentNode.replaceChild(clonedSection, appSection);
        
                // Update the reference to the app section
                appSection = clonedSection;
        
                // Reuse the existing observer for the cloned section
                currentObserver.observe(appSection);
                */
            }
        }
    });
  
    // Update the last scroll position
    lastScrollTop = window.scrollY || window.pageYOffset;
};
  

// Initialize the IntersectionObserver
observer = new IntersectionObserver(entries => handleIntersection(entries, observer), options);

// Start observing the initial app section
observer.observe(appSection);
