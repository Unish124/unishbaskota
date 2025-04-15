// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize typing animation only on home page
    initTypeAnimation();
    
    // Initialize hamburger menu on all pages
    initHamburgerMenu();
    
    // Initialize navbar slider on all pages
    initNavbarSlider();
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize section animations
    initSectionAnimations();
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

// Theme toggle function
function initThemeToggle() {
    // Create theme toggle button if it doesn't exist
    if (!document.querySelector('.theme-toggle')) {
        const navLinksContainer = document.querySelector('.nav-links');
        const navbar = document.querySelector('.navbar');
        
        if (navbar) {
            const themeToggle = document.createElement('div');
            themeToggle.className = 'theme-toggle';
            
            const themeIcon = document.createElement('div');
            themeIcon.className = 'theme-toggle-icon';
            
            themeToggle.appendChild(themeIcon);
            
            // Insert before hamburger or as last child of navbar
            const hamburger = document.getElementById('hamburger');
            if (hamburger) {
                navbar.insertBefore(themeToggle, hamburger);
            } else {
                navbar.appendChild(themeToggle);
            }
            
            // Add to mobile menu too
            const menu = document.getElementById('menu');
            if (menu) {
                const mobileThemeToggle = document.createElement('div');
                mobileThemeToggle.className = 'theme-toggle';
                mobileThemeToggle.innerHTML = 'Toggle Theme';
                mobileThemeToggle.style.color = 'white';
                menu.appendChild(mobileThemeToggle);
                
                mobileThemeToggle.addEventListener('click', toggleTheme);
            }
            
            // Add event listener
            themeToggle.addEventListener('click', toggleTheme);
        }
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme === 'dark' ? 'dark-mode' : 'light-mode');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    } else {
        // Default to light mode
        document.body.classList.add('light-mode');
    }
}

// Toggle theme function
function toggleTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    if (isDarkMode) {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }
}

// Section animations initialization
function initSectionAnimations() {
    // Add animation classes to elements
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        section.classList.add('fade-in');
    });
    
    const historyHeader = document.querySelector('.history-header');
    if (historyHeader) historyHeader.classList.add('slide-in-left');
    
    const projectsHeader = document.querySelector('.projects-header');
    if (projectsHeader) projectsHeader.classList.add('slide-in-left');
    
    const booksHeader = document.querySelector('.books-header');
    if (booksHeader) booksHeader.classList.add('slide-in-left');
    
    const filesHeader = document.querySelector('.files-header');
    if (filesHeader) filesHeader.classList.add('slide-in-left');
    
    // Add staggered animations to grid items
    const projectsContent = document.querySelector('.projects-content');
    if (projectsContent) {
        projectsContent.classList.add('stagger-animation');
        const projectItems = projectsContent.querySelectorAll('.project-item');
        projectItems.forEach(item => {
            item.classList.add('scale-in');
        });
    }
    
    const booksContent = document.querySelector('.books-content');
    if (booksContent) {
        booksContent.classList.add('stagger-animation');
        const bookItems = booksContent.querySelectorAll('.book-item');
        bookItems.forEach(item => {
            item.classList.add('scale-in');
        });
    }
    
    const filesContent = document.querySelector('.files-content');
    if (filesContent) {
        filesContent.classList.add('stagger-animation');
        const fileItems = filesContent.querySelectorAll('.file-item');
        fileItems.forEach(item => {
            item.classList.add('scale-in');
        });
    }
    
    // Check visible elements on load
    checkAnimatedElements();
    
    // Listen for scroll to animate elements
    window.addEventListener('scroll', checkAnimatedElements);
}

// Helper function to check if elements are in viewport
function checkAnimatedElements() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-animation > *');
    
    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150; // Distance from top of viewport
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}
