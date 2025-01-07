const cart = [];

function addToCart() {
  const ram = document.getElementById('ram').value;
  const storage = document.getElementById('storage').value;
  const byo = document.getElementById('byo').checked ? "Yes" : "No";

  const product = { RAM: ram, Storage: storage, BringYourOwnPi: byo };
  cart.push(product);

  updateCart();
}

function updateCart() {
  const cartDiv = document.getElementById('cart');
  if (cart.length === 0) {
    cartDiv.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cartDiv.innerHTML = '<ul>' + cart.map(item => `
      <li>${item.RAM} RAM, ${item.Storage} Storage, BYO Pi: ${item.BringYourOwnPi}</li>
    `).join('') + '</ul>';
  }
}
