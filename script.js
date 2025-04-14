// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize typing animation only on home page
    initTypeAnimation();
    
    // Initialize hamburger menu on all pages
    initHamburgerMenu();
    
    // Initialize navbar slider on all pages
    initNavbarSlider();
});

// Typing animation function (only for homepage)
function initTypeAnimation() {
    const animatedText = document.getElementById('animated-text');
    if (!animatedText) return; // Skip if not on homepage
    
    const texts = ["a coder", "a student", "a learner"];
    let textIndex = 0, charIndex = 0, isDeleting = false;
    
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
}

// Hamburger menu function
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    const blurOverlay = document.getElementById('blurOverlay');
    
    if (!hamburger || !menu || !blurOverlay) return; // Skip if elements not found
    
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
}

// Navbar slider function
function initNavbarSlider() {
    const navLinksContainer = document.querySelector('.nav-links');
    if (!navLinksContainer) return; // Skip if nav container not found
    
    // Create the slider element if it doesn't exist
    let slider = navLinksContainer.querySelector('.nav-slider');
    if (!slider) {
        slider = document.createElement('div');
        slider.className = 'nav-slider';
        navLinksContainer.appendChild(slider);
    }
    
    // Get all nav links
    const navLinks = navLinksContainer.querySelectorAll('a');
    if (!navLinks.length) return; // Skip if no links found
    
    // Get current page filename
    const currentPagePath = window.location.pathname;
    const currentPage = currentPagePath.substring(currentPagePath.lastIndexOf('/') + 1) || 'index.html';
    
    // Set active class on current page link
    let activeLink = null;
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
            activeLink = link;
        } else {
            link.classList.remove('active');
        }
    });
    
    // Default to first link if no active link found
    if (!activeLink) {
        activeLink = navLinks[0];
        activeLink.classList.add('active');
    }
    
    // Add mouseenter events to all nav links
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            updateSlider(this, slider, navLinksContainer);
        });
    });
    
    // When mouse leaves the nav-links area, reset slider to active link
    navLinksContainer.addEventListener('mouseleave', function() {
        updateSlider(activeLink, slider, navLinksContainer);
    });
    
    // Position slider initially with a slight delay
    setTimeout(() => {
        updateSlider(activeLink, slider, navLinksContainer);
    }, 100);
    
    // Reposition on window resize
    window.addEventListener('resize', function() {
        updateSlider(activeLink, slider, navLinksContainer);
    });
}

// Helper function to update slider position
function updateSlider(targetLink, slider, container) {
    if (!targetLink || !slider || !container) return;
    
    // Get positions
    const linkRect = targetLink.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // Calculate position and width
    const leftPosition = linkRect.left - containerRect.left;
    
    // Update slider
    slider.style.left = `${leftPosition}px`;
    slider.style.width = `${linkRect.width}px`;
    slider.style.opacity = '1';
}
