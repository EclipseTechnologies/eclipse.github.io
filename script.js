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
    this.updateUI();
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.saveToStorage();
    this.updateUI();
  }

  clearCart() {
    this.items = [];
    this.saveToStorage();
    this.updateUI();
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);
  }

  updateUI() {
    this.updateCartIcon();
    this.updateCartDisplay();
    this.updateCheckoutDisplay();
  }

  updateCartIcon() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      cartCount.textContent = this.items.length;
      cartCount.style.display = this.items.length ? 'block' : 'none';
    }
  }

  updateCartDisplay() {
    const cartDiv = document.getElementById('cart');
    if (!cartDiv) return;

    if (this.items.length === 0) {
      cartDiv.innerHTML = `
        <div class="empty-cart">
          <img src="images/empty-cart.png" alt="Empty cart" width="200" height="200">
          <p>Your cart is empty</p>
          <a href="shop.html" class="btn secondary">Continue Shopping</a>
        </div>`;
      return;
    }

    const cartItems = this.items.map((item, index) => `
      <div class="cart-item">
        <div class="item-details">
          <h3>AndRPi Tablet</h3>
          <p>${item.ram} RAM, ${item.storage} Storage</p>
          <p>BYO: ${item.byo ? 'Yes' : 'No'}</p>
        </div>
        <div class="item-price">$${item.price}</div>
        <button onclick="cart.removeItem(${index})" class="remove-btn" aria-label="Remove item">×</button>
      </div>
    `).join('');

    cartDiv.innerHTML = `
      <div class="cart-items">${cartItems}</div>
      <div class="cart-summary">
        <div class="summary-row">
          <span>Subtotal</span>
          <span>$${this.getTotal()}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span>$${this.getTotal()}</span>
        </div>
        <button onclick="cart.checkout()" class="btn primary checkout-btn">Proceed to Checkout</button>
      </div>
    `;
  }

  updateCheckoutDisplay() {
    const summaryDiv = document.getElementById('cart-summary');
    if (!summaryDiv) return;

    if (this.items.length === 0) {
      window.location.href = 'cart.html';
      return;
    }

    const summaryItems = this.items.map(item => `
      <div class="summary-item">
        <div class="item-details">
          <h3>AndRPi Tablet</h3>
          <p>${item.ram} RAM, ${item.storage} Storage</p>
          <p>BYO: ${item.byo ? 'Yes' : 'No'}</p>
        </div>
        <div class="item-price">$${item.price}</div>
      </div>
    `).join('');

    summaryDiv.innerHTML = `
      <div class="summary-items">${summaryItems}</div>
      <div class="summary-totals">
        <div class="summary-row">
          <span>Subtotal</span>
          <span>$${this.getTotal()}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span>$${this.getTotal()}</span>
        </div>
      </div>
    `;
  }

  async checkout() {
    try {
      if (this.items.length === 0) {
        throw new Error('Cart is empty');
      }

      const checkoutBtn = document.querySelector('.checkout-btn');
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      window.location.href = 'checkout.html';
    } catch (error) {
      showToast(error.message, 'error');
      if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Proceed to Checkout';
      }
    }
  }
}

// Product configuration prices
const prices = {
  "2gb-128gb": 185.00,
  "2gb-256gb": 210.00,
  "2gb-512gb": 235.00,
  "4gb-128gb": 195.00,
  "4gb-256gb": 220.00,
  "4gb-512gb": 245.00,
  "8gb-128gb": 215.00,
  "8gb-256gb": 240.00,
  "8gb-512gb": 265.00,
  "byo": 130.00
};

// Initialize cart
const cart = new Cart();

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Update product image with loading state
async function updateProductImage() {
  const ram = document.getElementById('ram')?.value;
  const storage = document.getElementById('storage')?.value;
  const byo = document.getElementById('byo')?.checked;
  
  if (!ram || !storage) return;

  const productImage = document.getElementById('product-image');
  if (!productImage) return;

  productImage.style.opacity = '0.5';
  
  const image = byo ? 'byo' : `${ram}-${storage}`;
  const newImage = new Image();
  
  newImage.onload = () => {
    productImage.src = `images/tablet-${image}.png`;
    productImage.style.opacity = '1';
    updatePrice();
  };
  
  newImage.onerror = () => {
    productImage.src = 'images/placeholder.png';
    productImage.style.opacity = '1';
    showToast('Failed to load product image', 'error');
  };

  newImage.src = `images/tablet-${image}.png`;
}

// Update price display
function updatePrice() {
  const ram = document.getElementById('ram')?.value;
  const storage = document.getElementById('storage')?.value;
  const byo = document.getElementById('byo')?.checked;
  const priceDisplay = document.getElementById('price');

  if (!ram || !storage || !priceDisplay) return;

  const price = byo ? prices.byo : prices[`${ram}-${storage}`];
  priceDisplay.textContent = `$${price.toFixed(2)}`;
}

// Add product to cart
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
      ram,
      storage,
      price,
      byo,
      dateAdded: new Date().toISOString()
    };

    cart.addItem(product);
    showToast('Item added to cart!');
  } catch (error) {
    console.error('Error adding to cart:', error);
    showToast(error.message, 'error');
  }
}

// Handle checkout form submission
async function handleCheckoutSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');

  try {
    if (cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Clear cart after successful purchase
    cart.clearCart();
    
    // Show success message and redirect
    showToast('Order placed successfully!');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } catch (error) {
    showToast(error.message, 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Complete Purchase';
  }
}

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart UI
  cart.updateUI();

  // Set up event listeners
  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      addToCart();
    });
  }

  const checkoutForm = document.getElementById('payment-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }

  // Set up product configuration listeners
  const configInputs = ['ram', 'storage', 'byo'].map(id => document.getElementById(id));
  configInputs.forEach(input => {
    if (input) {
      input.addEventListener('change', () => {
        updateProductImage();
        updatePrice();
      });
    }
  });
});
