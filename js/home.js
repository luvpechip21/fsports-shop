import { addToCart, renderCart, syncBadge, openCart, cart, saveCart } from "./cart.js";

async function loadProducts() {
  const res = await fetch("data/products.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Không tải được products.json");
  return await res.json();
}

function renderFlash(products, flashIds) {
  const wrap = $("#flashGrid");
  const list = flashIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  wrap.innerHTML = list
    .map(
      (p) => `
      <div class="card">
        <img class="thumb" src="${p.img}" alt="">
        <div class="info">
          <div class="name">${p.name}</div>
          <div class="price"><div class="now">${fmt(p.price)}</div><div class="old">${fmt(p.old)}</div></div>
          <div class="meta"><span class="label">Freeship</span><span>Đã bán ${p.sold}</span></div>
        </div>
        <div class="act"><button class="qbtn buy" data-id="${p.id}">Mua</button></div>
      </div>`
    )
    .join("");
  wrap.querySelectorAll(".buy").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prod = products.find((p) => p.id === btn.dataset.id);
      addToCart(prod);
    });
  });
}

function renderList(products) {
  const grid = $("#listGrid");
  grid.innerHTML = products
    .map(
      (p) => `
    <div class="card">
      <img class="thumb" src="${p.img}" alt="">
      <div class="info">
        <div class="name">${p.name}</div>
        <div class="price"><div class="now">${fmt(p.price)}</div><div class="old">${fmt(p.old)}</div></div>
        <div class="meta"><span class="label">Còn hàng</span><span>Đã bán ${p.sold}</span></div>
      </div>
      <div class="act">
        <div class="grid" style="grid-template-columns:1fr 1fr;gap:8px">
          <button class="qbtn view" data-id="${p.id}">Xem</button>
          <button class="qbtn buy" data-id="${p.id}">Mua</button>
        </div>
      </div>
    </div>`
    )
    .join("");

  grid.querySelectorAll(".buy").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prod = products.find((p) => p.id === btn.dataset.id);
      addToCart(prod);
    });
  });

  grid.querySelectorAll(".view").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prod = products.find((p) => p.id === btn.dataset.id);
      addToCart(prod);
      openCart();
    });
  });
}

function bindHeader() {
  $("#openCart").addEventListener("click", openCart);
  $("#goSearch").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    $("#searchInput").focus();
  });
}

function bindCheckoutSubmit() {
  $("#confirmBtn").addEventListener("click", async () => {
    const fullname = $("#fullname").value.trim();
    const phone = $("#phone").value.trim();
    const address = $("#address").value.trim();
    if (!fullname || !phone || !address) return toast("Vui lòng điền đủ Họ tên, SĐT, Địa chỉ");

    const items = cart.map((it) => `${it.name} x ${it.qty}`).join(", ");
    const total = cart.reduce((a, c) => a + c.price * c.qty, 0);

    const payload = {
      fullname,
      phone,
      address,
      items,
      total_raw: total,
      total_fmt: fmt(total),
      source: "demo-home",
      atc_event_id: "atc_demo_" + (localStorage.getItem("atc_last") || ""),
      purchase_event_id: "pur_" + Date.now()
    };
    console.log("Submit payload:", payload);

    // TODO: gắn webhook Make.com thật tại đây
    // await fetch("https://hook.us2.make.com/xxxx", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload)});

    await new Promise((r) => setTimeout(r, 700));
    toast("Đặt hàng thành công! (demo)");

    while (cart.length) cart.pop();
    saveCart();
    renderCart();
    syncBadge();
    $("#checkoutModal").classList.remove("show");
    $("#cartDrawer").classList.remove("show");
    setTimeout(() => ($("#cartDrawer").style.display = "none"), 200);
  });
}

async function init() {
  initHero();
  startTimer($("#timer"), 3);
  bindHeader();
  renderCart();
  syncBadge();
  bindCheckoutSubmit();

  const data = await loadProducts();
  renderFlash(data.products, data.flash_ids);
  renderList(data.products);
}

document.addEventListener("DOMContentLoaded", init);
