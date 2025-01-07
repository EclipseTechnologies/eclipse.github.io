const cart = [];

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

function addToCart() {
  const ram = document.getElementById('ram').value;
  const storage = document.getElementById('storage').value;
  const byo = document.getElementById('byo').checked;

  const key = `${ram}-${storage}`;
  const price = prices[key] + (byo ? prices.byo : 0);

  const product = { RAM: ram, Storage: storage, Price: `$${price.toFixed(2)}`, BYO: byo ? "Yes" : "No" };
  cart.push(product);

  alert("Item added to cart!");
}

function updateCart() {
  const cartDiv = document.getElementById('cart');
  if (cart.length === 0) {
    cartDiv.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cartDiv.innerHTML = `
      <ul>${cart.map(item => `
        <li>${item.RAM} RAM, ${item.Storage} Storage, BYO: ${item.BYO}, Price: ${item.Price}</li>
      `).join('')}</ul>
      <p><strong>Total: $${cart.reduce((sum, item) => sum + parseFloat(item.Price.slice(1)), 0).toFixed(2)}</strong></p>
    `;
  }
}

function checkout() {
  alert("Proceeding to checkout...");
  // Add further logic for checkout process here.
}
