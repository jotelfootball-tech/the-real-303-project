const API_URL = '/api/items';

// Helper to format date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Fetch and display items (for lost.html and found.html)
async function fetchItems(type, containerId, category = '', search = '') {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        let url = `${API_URL}?type=${type}`;
        if (category) url += `&category=${category}`;
        if (search) url += `&search=${search}`;

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
}

// Post Item Form Handler
const postForm = document.getElementById('postItemForm');
if (postForm) {
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();

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
