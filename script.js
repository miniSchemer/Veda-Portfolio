function toggleMenu() {
    const menu = document.querySelector(".menu-links")
    const icon = document.querySelector(".hamburger-icon")
    menu.classList.toggle("open")
    icon.classList.toggle("open")
}

// Art item click to expand
document.addEventListener('DOMContentLoaded', function() {
    const artItems = document.querySelectorAll('.art-item');
    const body = document.body;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'art-overlay';
    body.appendChild(overlay);
    
    artItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (!this.classList.contains('expanded')) {
                // Close any other expanded items
                artItems.forEach(otherItem => {
                    otherItem.classList.remove('expanded');
                });
                
                // Expand this item
                this.classList.add('expanded');
                overlay.classList.add('active');
            }
        });
    });
    
    // Close on overlay click
    overlay.addEventListener('click', function() {
        artItems.forEach(item => {
            item.classList.remove('expanded');
        });
        overlay.classList.remove('active');
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            artItems.forEach(item => {
                item.classList.remove('expanded');
            });
            overlay.classList.remove('active');
        }
    });
});

// Project item click to expand
document.addEventListener('DOMContentLoaded', function() {
    const projectItems = document.querySelectorAll('.project-item');
    const body = document.body;
    
    // Create overlay for projects
    const projectOverlay = document.createElement('div');
    projectOverlay.className = 'project-overlay';
    body.appendChild(projectOverlay);
    
    projectItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't expand if clicking on buttons
            if (e.target.closest('.project-buttons')) {
                return;
            }
            
            if (!this.classList.contains('expanded')) {
                // Close any other expanded items
                projectItems.forEach(otherItem => {
                    otherItem.classList.remove('expanded');
                });
                
                // Expand this item
                this.classList.add('expanded');
                projectOverlay.classList.add('active');
            }
        });
    });
    
    // Close on overlay click
    projectOverlay.addEventListener('click', function() {
        projectItems.forEach(item => {
            item.classList.remove('expanded');
        });
        projectOverlay.classList.remove('active');
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            projectItems.forEach(item => {
                item.classList.remove('expanded');
            });
            projectOverlay.classList.remove('active');
        }
    });
});

// Carousel functionality for project images on mobile
function initializeProjectCarousel() {
    const projectItems = document.querySelectorAll('.project-item');
    
    projectItems.forEach(item => {
        const images = item.querySelectorAll('.project-screenshot');
        
        // Only initialize carousel if there are multiple images and we're on mobile
        if (images.length > 1 && window.innerWidth <= 768) {
            let currentIndex = 0;
            
            // Create carousel navigation container
            const carouselNav = document.createElement('div');
            carouselNav.className = 'carousel-nav';
            
            // Create arrow buttons
            const prevArrow = document.createElement('button');
            prevArrow.className = 'carousel-arrow prev';
            prevArrow.setAttribute('aria-label', 'Previous image');
            
            const nextArrow = document.createElement('button');
            nextArrow.className = 'carousel-arrow next';
            nextArrow.setAttribute('aria-label', 'Next image');
            
            // Create dots for each image
            images.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot';
                if (index === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to image ${index + 1}`);
                
                dot.addEventListener('click', () => {
                    showImage(index);
                });
                
                carouselNav.appendChild(dot);
            });
            
            // Show specific image
            function showImage(index) {
                images.forEach((img, i) => {
                    img.classList.toggle('active', i === index);
                });
                
                const dots = carouselNav.querySelectorAll('.carousel-dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
                
                currentIndex = index;
            }
            
            // Previous button handler
            prevArrow.addEventListener('click', (e) => {
                e.stopPropagation();
                const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
                showImage(newIndex);
            });
            
            // Next button handler
            nextArrow.addEventListener('click', (e) => {
                e.stopPropagation();
                const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
                showImage(newIndex);
            });
            
            // Add arrows to the images container
            const imagesContainer = item.querySelector('.project-expanded-images');
            if (imagesContainer) {
                imagesContainer.appendChild(prevArrow);
                imagesContainer.appendChild(nextArrow);
                
                // Add navigation dots after the images container
                imagesContainer.parentNode.insertBefore(carouselNav, imagesContainer.nextSibling);
            }
            
            // Initialize first image as active
            showImage(0);
            
            // Touch swipe support
            let touchStartX = 0;
            let touchEndX = 0;
            
            imagesContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            imagesContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
            
            function handleSwipe() {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        // Swipe left - next image
                        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
                        showImage(newIndex);
                    } else {
                        // Swipe right - previous image
                        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
                        showImage(newIndex);
                    }
                }
            }
        }
    });
}

// Re-initialize carousel when window is resized
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Remove existing carousel elements
        document.querySelectorAll('.carousel-nav, .carousel-arrow').forEach(el => el.remove());
        
        // Re-initialize if needed
        if (window.innerWidth <= 768) {
            initializeProjectCarousel();
        } else {
            // Show all images on desktop
            document.querySelectorAll('.project-screenshot').forEach(img => {
                img.classList.remove('active');
                img.style.display = '';
            });
        }
    }, 250);
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProjectCarousel);
} else {
    initializeProjectCarousel();
}

// Also initialize when a project is expanded
document.addEventListener('click', (e) => {
    if (e.target.closest('.project-item') && !e.target.closest('.carousel-arrow, .carousel-dot')) {
        setTimeout(() => {
            if (window.innerWidth <= 768) {
                // Remove old carousel elements and reinitialize
                document.querySelectorAll('.carousel-nav, .carousel-arrow').forEach(el => el.remove());
                initializeProjectCarousel();
            }
        }, 100);
    }
});