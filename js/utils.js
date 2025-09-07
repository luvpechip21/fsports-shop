window.$ = (s) => document.querySelector(s);
window.$$ = (s) => Array.from(document.querySelectorAll(s));
window.toast = (m) => alert(m);
window.fmt = (n) => (n || 0).toLocaleString('vi-VN') + '₫';

window.startTimer = function(el, h = 3) {
  const e = Date.now() + h * 36e5;
  const t = () => {
    const d = Math.max(0, e - Date.now());
    const H = Math.floor(d / 36e5), M = Math.floor(d % 36e5 / 6e4), S = Math.floor(d % 6e4 / 1e3);
    el.textContent = [H, M, S].map(v => String(v).padStart(2,'0')).join(':');
    if (d <= 0) clearInterval(i);
  };
  t();
  const i = setInterval(t, 1e3);
};

window.initHero = function() {
  const imgs = $$("#hero img");
  const dots = $("#heroDots");
  if (!imgs.length) return;
  dots.innerHTML = imgs.map((_,i)=>`<div class="dot ${i?'':'active'}"></div>`).join('');
  let idx = 0;
  setInterval(()=>{
    imgs.forEach((im,i)=>im.classList.toggle('hide',i!==idx));
    $$("#heroDots .dot").forEach((d,i)=>d.classList.toggle('active',i===idx));
    idx = (idx+1)%imgs.length;
  },3000);
};
