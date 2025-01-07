let cart = [];

// Prices for the tablet configurations
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

// Update the product image dynamically
function updateProductImage() {
  const ram = document.getElementById('ram').value;
  const storage = document.getElementById('storage').value;
  const byo = document.getElementById('byo').checked;

  const image = byo ? "byo" : `${ram}-${storage}`;
  document.getElementById("product-image").src = `images/tablet-${image}.png`;
}

// Add product to the cart
function addToCart() {
  const ram = document.getElementById('ram').value;
  const storage = document.getElementById('storage').value;
  const byo = document.getElementById('byo').checked;

  const key = `${ram}-${storage}`;
  const price = prices[key] + (byo ? prices.byo : 0);

  const product = {
    RAM: ram,
    Storage: storage,
    Price: `$${price.toFixed(2)}`,
    BYO: byo ? "Yes" : "No"
  };

  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart)); // Save to local storage
  alert("Item added to cart!");
}

// Load cart items on the cart page
function loadCart() {
  const cartDiv = document.getElementById('cart');
  cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartDiv.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    const cartItems = cart.map(item => `
      <li>${item.RAM} RAM, ${item.Storage} Storage, BYO: ${item.BYO}, Price: ${item.Price}</li>
    `).join("");

    const total = cart.reduce((sum, item) => sum + parseFloat(item.Price.slice(1)), 0).toFixed(2);

    cartDiv.innerHTML = `
      <ul>${cartItems}</ul>
      <p><strong>Total: $${total}</strong></p>
    `;
  }
}

function checkout() {
  alert("Proceeding to checkout...");
  // Add logic for checkout here.
}
