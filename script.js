// Cart state management
class Cart {
  constructor() {
    this.items = [];
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const savedCart = localStorage.getItem('cart');
      this.items = savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      this.items = [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('cart', JSON.stringify(this.items));
    } catch (error) {
      console.error('Error saving cart:', error);
      throw new Error('Failed to save cart data');
    }
  }

  addItem(item) {
    this.items.push(item);
    this.saveToStorage();
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.saveToStorage();
  }

  clearCart() {
    this.items = [];
    this.saveToStorage();
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + parseFloat(item.Price.slice(1)), 0).toFixed(2);
  }
}

// Initialize cart
const cart = new Cart();

// Product configuration prices
const prices = {
  "2gb-128gb": 185,
  "2gb-256gb": 210,
  "2gb-512gb": 235,
  "4gb-128gb": 195,
  "4gb-256gb": 220,
  "4gb-512gb": 245,
  "8gb-128gb": 215,
  "8gb-256gb": 240,
  "8gb-512gb": 265,
  "byo": 130
};

// Update product image with loading state
async function updateProductImage() {
  const ram = document.getElementById('ram')?.value;
  const storage = document.getElementById('storage')?.value;
  const byo = document.getElementById('byo')?.checked;
  
  if (!ram || !storage) return;

  const productImage = document.getElementById('product-image');
  if (!productImage) return;

  // Add loading state
  productImage.style.opacity = '0.5';
  
  const image = byo ? 'byo' : `${ram}-${storage}`;
  const newImage = new Image();
  
  newImage.onload = () => {
    productImage.src = `images/tablet-${image}.png`;
    productImage.style.opacity = '1';
  };
  
  newImage.onerror = () => {
    productImage.src = 'images/placeholder.png';
    productImage.style.opacity = '1';
    console.error('Failed to load product image');
  };

  newImage.src = `images/tablet-${image}.png`;
}

// Add product to cart with validation
function addToCart() {
  try {
    const ram = document.getElementById('ram')?.value;
    const storage = document.getElementById('storage')?.value;
    const byo = document.getElementById('byo')?.checked;

    if (!ram || !storage) {
      throw new Error('Please select all product options');
    }

    const price = byo ? prices.byo : prices[`${ram}-${storage}`];
    
    if (typeof price !== 'number') {
      throw new Error('Invalid product configuration');
    }

    const product = {
      RAM: ram,
      Storage: storage,
      Price: `$${price.toFixed(2)}`,
      BYO: byo ? 'Yes' : 'No',
      DateAdded: new Date().toISOString()
    };

    cart.addItem(product);
    
    // Show success message
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = 'Item added to cart!';
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
    
    updateCartIcon();
  } catch (error) {
    console.error('Error adding to cart:', error);
    
    // Show error message
    const toast = document.createElement('div');
    toast.className = 'toast error';
    toast.textContent = error.message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
  }
}

// Update cart icon with item count
function updateCartIcon() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cart.items.length;
    cartCount.style.display = cart.items.length ? 'block' : 'none';
  }
}

// Load and display cart items
function loadCart() {
  const cartDiv = document.getElementById('cart');
  if (!cartDiv) return;

  if (cart.items.length === 0) {
    cartDiv.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p><a href="shop.html" class="btn">Continue Shopping</a></div>';
    return;
  }

  const cartItems = cart.items.map((item, index) => `
    <div class="cart-item">
      <div class="item-details">
        <h3>AndRPi Tablet</h3>
        <p>${item.RAM} RAM, ${item.Storage} Storage</p>
        <p>BYO: ${item.BYO}</p>
      </div>
      <div class="item-price">${item.Price}</div>
      <button onclick="removeFromCart(${index})" class="remove-btn" aria-label="Remove item">×</button>
    </div>
  `).join('');

  cartDiv.innerHTML = `
    <div class="cart-items">${cartItems}</div>
    <div class="cart-summary">
      <div class="cart-total">Total: $${cart.getTotal()}</div>
      <button onclick="checkout()" class="btn checkout-btn">Proceed to Checkout</button>
    </div>
  `;
}

// Remove item from cart
function removeFromCart(index) {
  cart.removeItem(index);
  loadCart();
  updateCartIcon();
}

// Checkout process
async function checkout() {
  try {
    if (cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Here you would typically integrate with a payment processor
    // For now, we'll just simulate the process
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = 'Processing...';
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    cart.clearCart();
    window.location.href = 'checkout.html';
  } catch (error) {
    console.error('Checkout error:', error);
    alert(error.message);
  }
}

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', () => {
  updateCartIcon();
  
  // Setup event listeners for product configuration
  const configInputs = document.querySelectorAll('#ram, #storage, #byo');
  configInputs.forEach(input => {
    input?.addEventListener('change', updateProductImage);
  });

  // Initialize cart display if on cart page
  if (window.location.pathname.includes('cart.html')) {
    loadCart();
  }
});
