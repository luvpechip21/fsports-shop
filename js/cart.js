// LocalStorage cart + drawer + checkout
const CART_KEY = "demo_cart";
export let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

export function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
export function syncBadge() {
  const n = cart.reduce((a, c) => a + c.qty, 0);
  $("#cartBadge").textContent = n;
  $("#cartCountTxt").textContent = n + " sản phẩm";
}
export function renderCart() {
  const wrap = $("#cartList");
  if (!wrap) return;
  if (cart.length === 0) {
    wrap.innerHTML = `<div class="small">Giỏ hàng đang trống.</div>`;
  } else {
    wrap.innerHTML = cart
      .map(
        (it) => `
      <div class="citem">
        <img src="${it.img}" alt="">
        <div>
          <div style="font-weight:600">${it.name}</div>
          <div class="price"><span class="now">${fmt(it.price)}</span></div>
          <div class="qty">
            <button onclick="window.__updateQty('${it.id}',-1)">−</button>
            <input value="${it.qty}" oninput="window.__manualQty('${it.id}', this.value)" />
            <button onclick="window.__updateQty('${it.id}',1)">+</button>
          </div>
        </div>
        <button class="iconbtn" title="Xóa" onclick="window.__removeItem('${it.id}')">✕</button>
      </div>
    `
      )
      .join("");
  }
  const sub = cart.reduce((a, c) => a + c.price * c.qty, 0);
  $("#subtotal").textContent = fmt(sub);
  const shipOk = sub >= 300000;
  $("#shipText").textContent = shipOk ? "Đạt Freeship" : "Đơn ≥ 300K để Freeship";
  $("#shipText").style.color = shipOk ? "var(--success)" : "var(--muted)";
  $("#grandTotal").textContent = fmt(sub);
}

export function addToCart(prod) {
  const found = cart.find((c) => c.id === prod.id);
  if (found) found.qty += 1;
  else cart.push({ id: prod.id, name: prod.name, price: prod.price, img: prod.img, qty: 1 });
  saveCart();
  syncBadge();
  renderCart();
  openCart();
  // Hook Pixel (AddToCart) tại đây nếu cần
}

window.__updateQty = function (id, delta) {
  const it = cart.find((c) => c.id === id);
  if (!it) return;
  it.qty = Math.max(1, it.qty + delta);
  saveCart();
  renderCart();
  syncBadge();
};
window.__manualQty = function (id, val) {
  const it = cart.find((c) => c.id === id);
  if (!it) return;
  const n = Math.max(1, parseInt(val || "1"));
  it.qty = n;
  saveCart();
  renderCart();
  syncBadge();
};
window.__removeItem = function (id) {
  cart = cart.filter((c) => c.id !== id);
  saveCart();
  renderCart();
  syncBadge();
};

export function openCart() {
  const d = $("#cartDrawer");
  if (!d) return;
  d.style.display = "block";
  requestAnimationFrame(() => d.classList.add("show"));
}
export function closeCart() {
  const d = $("#cartDrawer");
  if (!d) return;
  d.classList.remove("show");
  setTimeout(() => (d.style.display = "none"), 200);
}
export function openCheckout() {
  if (cart.length === 0) return toast("Giỏ hàng trống");
  const total = cart.reduce((a, c) => a + c.price * c.qty, 0);
  $("#orderPreview").textContent = `Đơn hàng: (${cart.length} sp) – ${fmt(total)}`;
  $("#checkoutModal").classList.add("show");
}
export function closeCheckout() {
  $("#checkoutModal").classList.remove("show");
}

window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.closeCart = closeCart;
