document.addEventListener('DOMContentLoaded', () => {
    // --- Cart Functionality ---
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeModalButton = document.querySelector('.close-button');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountSpan = document.getElementById('cart-count');
    const cartTotalSpan = document.getElementById('cart-total');
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to update cart display
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = ''; // Clear existing items
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Giỏ hàng trống.</p>';
        } else {
            let total = 0;
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <span>${item.name}</span>
                    <span>${(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</span>
                    <div class="cart-item-controls">
                        <button class="quantity-minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-plus" data-id="${item.id}">+</button>
                        <button class="remove-from-cart" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
                total += item.price * item.quantity;
            });
            cartTotalSpan.textContent = `${total.toLocaleString('vi-VN')} VNĐ`;
        }
        cartCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to local storage
    }

    // Add to cart event listener
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const name = e.target.dataset.name;
            const price = parseFloat(e.target.dataset.price);

            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }
            updateCartDisplay();
            alert(`${name} đã được thêm vào giỏ hàng!`);
        });
    });

    // Event listener for quantity change and remove from cart
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.dataset.id;

        if (target.classList.contains('quantity-minus')) {
            const item = cart.find(item => item.id === id);
            if (item && item.quantity > 1) {
                item.quantity--;
                updateCartDisplay();
            } else if (item && item.quantity === 1) {
                cart = cart.filter(item => item.id !== id);
                updateCartDisplay();
            }
        } else if (target.classList.contains('quantity-plus')) {
            const item = cart.find(item => item.id === id);
            if (item) {
                item.quantity++;
                updateCartDisplay();
            }
        } else if (target.classList.contains('remove-from-cart')) {
            cart = cart.filter(item => item.id !== id);
            updateCartDisplay();
        }
    });

    // Open cart modal
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'block';
        updateCartDisplay(); // Ensure cart is up-to-date when opened
    });

    // Close cart modal
    closeModalButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Initialize cart display on page load
    updateCartDisplay();

    // --- Product Filtering and Search Functionality ---
    const gameFilterSelect = document.getElementById('game-filter');
    const searchBarInput = document.getElementById('search-bar');
    const applyFiltersButton = document.getElementById('apply-filters');
    const productListDiv = document.getElementById('products-list');
    const productCards = document.querySelectorAll('.product-card');

    function applyFilters() {
        const selectedGame = gameFilterSelect.value;
        const searchTerm = searchBarInput.value.toLowerCase().trim();

        productCards.forEach(card => {
            const gameType = card.dataset.game;
            const productName = card.querySelector('h3').textContent.toLowerCase();

            const matchesGame = (selectedGame === 'all' || gameType === selectedGame);
            const matchesSearch = productName.includes(searchTerm);

            if (matchesGame && matchesSearch) {
                card.style.display = 'flex'; // Show the card
            } else {
                card.style.display = 'none'; // Hide the card
            }
        });
    }

    applyFiltersButton.addEventListener('click', applyFilters);
    searchBarInput.addEventListener('keyup', applyFilters); // Apply filters on keyup for instant search
    gameFilterSelect.addEventListener('change', applyFilters); // Apply filters on game selection change

    // --- Smooth Scrolling for Navigation ---
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - (document.querySelector('header').offsetHeight), // Adjust for sticky header
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Basic Form Submission Prevention (for example, if you had a contact form) ---
    // This is a placeholder. If you add forms, you'll need more robust validation and submission handling.
    const contactForm = document.querySelector('#contact form'); // Assuming a contact form exists
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Form submitted! (This is a demo, no actual submission)');
            // Here you would typically send data to a server using fetch() or XMLHttpRequest
        });
    }
});