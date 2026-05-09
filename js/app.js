// js/app.js
const CONFIG = {
    whatsapp: "5493436108343", // Tu número del catálogo
    talles: ["S", "M", "L", "XL", "XXL"],
    key: "rexregum_cart_v1"
};

let carrito = JSON.parse(localStorage.getItem(CONFIG.key)) || [];

function renderizar() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = productos.map(p => `
        <div class="group">
            <div class="relative aspect-[3/4] overflow-hidden bg-neutral-900 mb-6">
                <img id="img-p-${p.id}" src="${p.colores[0].img}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105">
            </div>
            <div class="space-y-4">
                <div>
                    <h3 class="font-bold uppercase tracking-widest text-sm">${p.nombre}</h3>
                    <p class="text-neutral-500">$${p.precio.toLocaleString('es-AR')}</p>
                </div>
                
                <div class="grid grid-cols-2 gap-2">
                    <select id="color-${p.id}" 
                            onchange="document.getElementById('img-p-${p.id}').src = this.options[this.selectedIndex].dataset.img"
                            class="bg-neutral-900 border border-neutral-800 text-[10px] p-2 uppercase outline-none focus:border-neutral-600">
                        ${p.colores.map(c => `<option value="${c.nombre}" data-img="${c.img}">${c.nombre}</option>`).join('')}
                    </select>
                    <select id="talle-${p.id}" class="bg-neutral-900 border border-neutral-800 text-[10px] p-2 uppercase outline-none focus:border-neutral-600">
                        ${CONFIG.talles.map(t => `<option value="${t}">${t}</option>`).join('')}
                    </select>
                </div>

                <button onclick="agregar(${p.id})" class="w-full bg-white text-black text-[10px] font-black uppercase py-3 hover:bg-neutral-300 transition-all">
                    Agregar al pedido
                </button>
            </div>
        </div>
    `).join('');
}

function agregar(id) {
    const p = productos.find(prod => prod.id === id);
    const talle = document.getElementById(`talle-${id}`).value;
    const colorSelect = document.getElementById(`color-${id}`);
    const color = colorSelect.value;
    const img = colorSelect.options[colorSelect.selectedIndex].dataset.img;

    const exist = carrito.find(i => i.id === id && i.talle === talle && i.color === color);
    
    if (exist) {
        exist.qty++;
    } else {
        carrito.push({ id, nombre: p.nombre, precio: p.precio, talle, color, img, qty: 1 });
    }
    
    save();
    toggleCart(true);
}

function remove(idx) {
    carrito.splice(idx, 1);
    save();
}

function save() {
    localStorage.setItem(CONFIG.key, JSON.stringify(carrito));
    updateUI();
}

function updateUI() {
    const badge = document.getElementById('cart-badge');
    const items = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    const count = carrito.reduce((a, b) => a + b.qty, 0);
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);

    items.innerHTML = carrito.map((i, index) => `
        <div class="flex gap-4 items-center bg-neutral-900/50 p-4 border border-neutral-800">
            <img src="${i.img}" class="w-16 h-20 object-cover grayscale">
            <div class="flex-1">
                <h4 class="text-[10px] font-bold uppercase truncate">${i.nombre}</h4>
                <p class="text-[9px] text-neutral-500 uppercase">${i.color} | Talle ${i.talle}</p>
                <p class="font-bold text-xs mt-1">${i.qty}x $${i.precio.toLocaleString('es-AR')}</p>
            </div>
            <button onclick="remove(${index})" class="text-neutral-600 hover:text-white">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
    `).join('');

    const total = carrito.reduce((a, b) => a + (b.precio * b.qty), 0);
    totalEl.textContent = `$${total.toLocaleString('es-AR')}`;
}

function toggleCart(open = false) {
    const d = document.getElementById('cart-drawer');
    const o = document.getElementById('cart-overlay');
    if (open || d.classList.contains('translate-x-full')) {
        d.classList.remove('translate-x-full');
        o.classList.remove('hidden');
    } else {
        d.classList.add('translate-x-full');
        o.classList.add('hidden');
    }
}

function checkoutWhatsApp() {
    if (carrito.length === 0) return;
    let m = '¡Hola Rex Regum! 👑 Quiero este pedido:%0A%0A';
    carrito.forEach(i => {
        m += `• ${i.qty}x ${i.nombre} (${i.color} - Talle ${i.talle})%0A`;
    });
    const total = carrito.reduce((a, b) => a + (b.precio * b.qty), 0);
    m += `%0ATotal: $${total.toLocaleString('es-AR')}.%0A¿Cómo coordinamos el pago?`;
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${m}`, '_blank');
}

document.addEventListener('DOMContentLoaded', () => { renderizar(); updateUI(); });