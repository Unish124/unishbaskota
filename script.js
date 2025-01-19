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