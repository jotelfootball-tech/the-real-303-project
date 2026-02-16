const API_URL = '/api/items';

// Helper to format date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Fetch and display items (for lost.html and found.html)
async function fetchItems(type, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    const loadItems = async () => {
        try {
            container.innerHTML = '<p>Loading...</p>';
            let url = `${API_URL}?type=${type}`;

            if (categoryFilter && categoryFilter.value) {
                url += `&category=${categoryFilter.value}`;
            }
            if (searchInput && searchInput.value) {
                url += `&search=${searchInput.value}`;
            }

            const response = await fetch(url);
            const items = await response.json();

            container.innerHTML = '';
            if (items.length === 0) {
                container.innerHTML = '<p class="no-items">No items found.</p>';
                return;
            }

            items.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.className = 'item-card';
                itemCard.innerHTML = `
                    <img src="${item.imageUrl || '/images/placeholder.png'}" alt="${item.title}" onerror="this.src='https://placehold.co/300x200?text=No+Image'">
                    <div class="card-content">
                        <h3>${item.title}</h3>
                        <p class="location"><i class="fas fa-map-marker-alt"></i> ${item.location}</p>
                        <p class="date"><i class="far fa-calendar-alt"></i> ${formatDate(item.dateLostFound)}</p>
                        <a href="details.html?id=${item.id}" class="btn-details">View Details</a>
                    </div>
                `;
                container.appendChild(itemCard);
            });
        } catch (error) {
            console.error('Error fetching items:', error);
            container.innerHTML = '<p class="error">Failed to load items. Please try again later.</p>';
        }
    };

    // Initial Load
    loadItems();

    // Event Listeners
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => loadItems(), 500));
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => loadItems());
    }
}

// Initialize Lost/Found Pages
if (document.getElementById('lost-items-container')) {
    fetchItems('lost', 'lost-items-container');
}
if (document.getElementById('found-items-container')) {
    fetchItems('found', 'found-items-container');
}

// Post Item Form Handler
const postForm = document.getElementById('postItemForm');
const imageInput = document.getElementById('imageInput');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const loadingMessage = document.getElementById('loading-message');
const submitBtn = document.querySelector('.form-submit');

if (imageInput) {
    imageInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreviewContainer.style.display = 'block';
            }
            reader.readAsDataURL(file);
        } else {
            imagePreview.src = '';
            imagePreviewContainer.style.display = 'none';
        }
    });
}

if (postForm) {
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Posting...';
        if (loadingMessage) loadingMessage.style.display = 'block';

        const formData = new FormData(postForm);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Item posted successfully!');
                window.location.href = 'index.html';
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error posting item:', error);
            alert('An error occurred. Please try again.');
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Post';
            if (loadingMessage) loadingMessage.style.display = 'none';
        }
    });
}

// Load Details Page
const detailsContainer = document.getElementById('item-details');
if (detailsContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');

    if (itemId) {
        fetch(`${API_URL}/${itemId}`)
            .then(res => res.json())
            .then(item => {
                if (item.message) throw new Error(item.message);

                document.getElementById('detail-image').src = item.imageUrl || 'https://placehold.co/600x400?text=No+Image';
                document.getElementById('detail-title').textContent = item.title;
                document.getElementById('detail-type').textContent = item.type.toUpperCase();
                document.getElementById('detail-type').className = `badge ${item.type}`;
                document.getElementById('detail-category').textContent = item.category;
                document.getElementById('detail-location').textContent = item.location;
                document.getElementById('detail-date').textContent = formatDate(item.dateLostFound);
                document.getElementById('detail-description').textContent = item.description;

                const contactBtn = document.getElementById('contact-btn');
                const contactInfo = document.getElementById('contact-info');

                contactBtn.addEventListener('click', () => {
                    contactInfo.style.display = 'block';
                    contactBtn.style.display = 'none';
                    document.getElementById('contact-name').textContent = item.contactName;
                    document.getElementById('contact-phone').textContent = item.contactPhone;
                    document.getElementById('contact-email').textContent = item.contactEmail || 'N/A';
                });
            })
            .catch(err => {
                detailsContainer.innerHTML = '<p class="error">Item not found.</p>';
            });
    }
}

// Recent Items on Homepage
const recentItemsContainer = document.getElementById('recent-items');
if (recentItemsContainer) {
    fetch(API_URL) // Fetches all items, sorted by new
        .then(res => res.json())
        .then(items => {
            const recent = items.slice(0, 3); // Take top 3
            recentItemsContainer.innerHTML = '';
            recent.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.className = 'item-card';
                itemCard.innerHTML = `
                    <img src="${item.imageUrl || '/images/placeholder.png'}" alt="${item.title}" onerror="this.src='https://placehold.co/300x200?text=No+Image'">
                    <div class="card-content">
                        <span class="badge ${item.type}">${item.type}</span>
                        <h3>${item.title}</h3>
                        <p>${item.location}</p>
                        <a href="details.html?id=${item.id}" class="btn-text">Check it out &rarr;</a>
                    </div>
                `;
                recentItemsContainer.appendChild(itemCard);
            });
        });
}
// Mobile Menu Toggle
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Toggle icon between bars and times
        const icon = menuToggle.querySelector('i');
        if (icon) {
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}
