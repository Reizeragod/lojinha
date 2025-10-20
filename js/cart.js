const CART_KEY = 'stylehub_cart';
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

const cartCounters = document.querySelectorAll('#carrinhoContador');
const cartContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg opacity-0 translate-y-4 transition-all duration-300 z-[9999]`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('opacity-100', 'translate-y-0'), 50);
  setTimeout(() => {
    toast.classList.remove('opacity-100');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function formatPrice(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCounters();
  if (cartContainer) renderCartPage();
}

function updateCartCounters() {
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCounters.forEach(el => (el.textContent = totalQty));
}

function addToCart(id, name, price) {
  const existing = cart.find(p => p.id === id);
  if (existing) existing.quantity++;
  else cart.push({ id, name, price, quantity: 1 });
  saveCart();
  showToast(`🛍️ "${name}" adicionado ao carrinho!`);
}

function changeQuantity(id, delta) {
  const item = cart.find(p => p.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter(p => p.id !== id);
  saveCart();
}

function renderCartPage() {
  if (!cartContainer) return;
  cartContainer.innerHTML = '';
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="text-center text-gray-500 py-8">Seu carrinho está vazio.</p>';
    if (cartTotal) cartTotal.textContent = formatPrice(0);
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center py-4 border-b border-gray-200';
    div.innerHTML = `
      <div>
        <h3 class="font-semibold text-gray-800">${item.name}</h3>
        <p class="text-gray-500">${formatPrice(item.price)} x ${item.quantity}</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="bg-gray-200 px-3 py-1 rounded text-lg hover:bg-gray-300" data-action="dec" data-id="${item.id}">-</button>
        <button class="bg-gray-200 px-3 py-1 rounded text-lg hover:bg-gray-300" data-action="inc" data-id="${item.id}">+</button>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  if (cartTotal) cartTotal.textContent = formatPrice(total);
}

document.addEventListener('click', e => {
  const addBtn = e.target.closest('.add-to-cart');
  if (addBtn) {
    const card = addBtn.closest('[data-id]');
    addToCart(card.dataset.id, card.dataset.name, parseFloat(card.dataset.price));
  }

  const btn = e.target.closest('[data-action]');
  if (btn) {
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    changeQuantity(id, action === 'inc' ? 1 : -1);
  }
});

updateCartCounters();
renderCartPage();
