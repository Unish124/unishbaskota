// Your existing code
// Typing Animation
const texts = ["a coder", "a student", "a learner"];
let textIndex = 0, charIndex = 0, isDeleting = false;
const animatedText = document.getElementById('animated-text');

function typeAnimation() {
    const currentText = texts[textIndex];
    animatedText.textContent = currentText.slice(0, charIndex);
    if (!isDeleting && charIndex < currentText.length) charIndex++;
    else if (isDeleting && charIndex > 0) charIndex--;
    else {
        isDeleting = !isDeleting;
        if (!isDeleting) textIndex = (textIndex + 1) % texts.length;
        setTimeout(typeAnimation, 800);
        return;
    }
    setTimeout(typeAnimation, isDeleting ? 50 : 100);
}
typeAnimation();

// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
const blurOverlay = document.getElementById('blurOverlay');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    menu.classList.toggle('active');
    blurOverlay.classList.toggle('active');
});

blurOverlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    menu.classList.remove('active');
    blurOverlay.classList.remove('active');
});

// NEW CODE FOR NAVBAR SLIDER
// Add active class to current page
document.addEventListener('DOMContentLoaded', function() {
    // Get current page URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Find the nav link that matches the current page and add 'active' class
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if(link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Create the slider element if it doesn't exist
    if(!document.querySelector('.nav-slider')) {
        const slider = document.createElement('div');
        slider.className = 'nav-slider';
        document.querySelector('.nav-links').appendChild(slider);
    }
    
    // Position the slider under the active link on page load
    positionSlider();
    
    // Add hover events to all nav links
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            // Move slider to hovered link
            updateSlider(this);
        });
    });
    
    // When mouse leaves the nav-links area, reset slider to active link
    document.querySelector('.nav-links').addEventListener('mouseleave', function() {
        positionSlider();
    });
});

// Position slider under active link or hide it if none active
function positionSlider() {
    const slider = document.querySelector('.nav-slider');
    const activeLink = document.querySelector('.nav-links a.active');
    
    if(activeLink) {
        // Position under active link
        updateSlider(activeLink);
    } else {
        // Hide slider if no active link
        slider.style.opacity = '0';
        slider.style.width = '0';
    }
}

// Update slider position and size to match target element
function updateSlider(element) {
    const slider = document.querySelector('.nav-slider');
    
    // Get position relative to parent
    const rect = element.getBoundingClientRect();
    const navLinksRect = document.querySelector('.nav-links').getBoundingClientRect();
    
    // Calculate relative position and width
    const leftPosition = rect.left - navLinksRect.left;
    
    // Update slider position and size
    slider.style.left = `${leftPosition}px`;
    slider.style.width = `${rect.width}px`;
    slider.style.opacity = '1';
}
