// docs/source/_static/custom.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dataset search and filters
    initializeSearch('dataset-search', '.dataset-card');
    initializeSearch('feature-search', '.feature-card');
});

function initializeSearch(searchInputId, cardSelector) {
    const searchInput = document.getElementById(searchInputId);
    if (!searchInput) return;
    
    const cards = document.querySelectorAll(cardSelector);
    const tagFilters = searchInput.closest('.dataset-search-container, .feature-search-container')
                                   .querySelectorAll('.tag-filter');
    const clearButton = searchInput.closest('.dataset-search-container, .feature-search-container')
                                    .querySelector('.clear-filters');
    
    let activeFilters = new Set();
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        filterCards();
    });
    
    // Tag filter functionality
    tagFilters.forEach(button => {
        button.addEventListener('click', function() {
            const tag = this.dataset.tag;
            
            if (activeFilters.has(tag)) {
                activeFilters.delete(tag);
                this.classList.remove('active');
            } else {
                activeFilters.add(tag);
                this.classList.add('active');
            }
            
            filterCards();
        });
    });
    
    // Clear filters functionality
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            activeFilters.clear();
            tagFilters.forEach(button => button.classList.remove('active'));
            searchInput.value = '';
            filterCards();
        });
    }
    
    function filterCards() {
        const searchTerm = searchInput.value.toLowerCase();
        let visibleCount = 0;
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const cardTags = card.dataset.tags ? card.dataset.tags.toLowerCase() : '';
            
            // Check search term match
            const matchesSearch = !searchTerm || 
                                  text.includes(searchTerm) || 
                                  cardTags.includes(searchTerm);
            
            // Check tag filter match
            const matchesFilters = activeFilters.size === 0 || 
                                   Array.from(activeFilters).some(filter => 
                                       cardTags.includes(filter.toLowerCase())
                                   );
            
            if (matchesSearch && matchesFilters) {
                card.classList.remove('hidden');
                card.style.display = '';
                visibleCount++;
                
                // Show the associated header
                const header = findAssociatedHeader(card);
                if (header) {
                    header.style.display = '';
                }
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
                
                // Hide the associated header
                const header = findAssociatedHeader(card);
                if (header) {
                    header.style.display = 'none';
                }
            }
        });
        
        // Show "no results" message if needed
        updateNoResultsMessage(searchInput, visibleCount);
    }
    
    function findAssociatedHeader(card) {
        // Find the previous sibling that is a header (h2, h3, h4)
        let sibling = card.previousElementSibling;
        while (sibling) {
            if (sibling.tagName && sibling.tagName.match(/^H[2-4]$/)) {
                return sibling;
            }
            sibling = sibling.previousElementSibling;
        }
        return null;
    }
    
    function updateNoResultsMessage(input, count) {
        const container = input.closest('.dataset-search-container, .feature-search-container')
                                .nextElementSibling;
        
        // Remove existing message
        const existingMessage = container.querySelector('.no-results');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Add message if no results
        if (count === 0) {
            const message = document.createElement('div');
            message.className = 'no-results';
            message.textContent = 'No results found. Try different search terms or filters.';
            container.insertBefore(message, container.firstChild);
        }
    }
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Highlight active section in navigation
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.wy-menu-vertical a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('current');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('current');
        }
    });
});