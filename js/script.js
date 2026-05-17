// CONFIGURACIÓN DE APIS Y CANALES
const API_URL = "https://script.google.com/macros/s/AKfycbxC0UAcEXdL6cEk2D931fYdNzZ5WNwB6MrADkiXpNB0AcNu5912NpvEnEml1as4DQgC/exec";
const WHATSAPP_NUM = "5493436108343";

let productos = [];
let carrito = JSON.parse(localStorage.getItem('carrito_rexregum')) || [];

// AL CARGAR LA PÁGINA
document.addEventListener("DOMContentLoaded", () => {
    fetchProductos();
    actualizarBadgeContador();
    initModalCheckout();
    initDrawerCarritoVisual();
});

// 1. OBTENER PRODUCTOS DEL SPREADSHEET
async function fetchProductos() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        if (result.status === "success") {
            productos = result.data;
            renderCatalogo();
        } else {
            console.error("Error de backend:", result.message);
        }
    } catch (error) {
        console.error("Error de red al conectar con GAS:", error);
    }
}

// 2. RENDERIZAR CATÁLOGO SIN LÍMITE DE TEXTO EN LAS DESCRIPCIONES
function renderCatalogo() {
    const container = document.getElementById("catalog-container");
    if (!container) return; // Frena de forma segura si estamos en otra subpágina
    container.innerHTML = "";

    if (productos.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-12 text-neutral-500 text-xs uppercase tracking-widest">Sincronizando existencias...</div>`;
        return;
    }

    productos.forEach(p => {
        if (!p.id || parseInt(p.stock) <= 0) return;
        
        // Separación limpia de cadenas del Sheets
        const talles = p.talles ? p.talles.toString().split(",").map(t => t.trim()) : [];
        const colores = p.colores ? p.colores.toString().split(",").map(c => c.trim()) : [];
        const imagenes = p.imagenurl ? p.imagenurl.toString().split(",").map(img => img.trim()) : [];

        const imagenInicial = imagenes[0] || 'img/placeholder.png';

        const item = document.createElement("div");
        item.className = "border border-neutral-800 p-4 bg-neutral-950 flex flex-col justify-between text-white group";
        
        item.innerHTML = `
            <div class="relative overflow-hidden mb-4">
                <img id="prod-img-${p.id}" src="${imagenInicial}" alt="${p.producto}" class="w-full h-84 object-cover">
            </div>
            <div>
                <span class="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">${p.categoria || 'Remeras'}</span>
                <h3 class="font-bold text-base uppercase tracking-tight mt-1">${p.producto}</h3>
                <p class="text-xs text-neutral-400 my-2 font-light leading-relaxed mb-4">${p.descripcion || ''}</p>
            </div>
            <div class="mt-auto space-y-3">
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Talle:</label>
                        <select id="talle-${p.id}" onchange="actualizarStockDinamico('${p.id}')" class="w-full border border-neutral-800 p-2 text-xs font-bold bg-black text-white focus:outline-none uppercase">
                            ${talles.map(t => `<option value="${t}">${t}</option>`).join("")}
                        </select>
                    </div>
                    <div>
                        <label class="block text-[9px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Color:</label>
                        <select id="color-${p.id}" 
                                onchange="cambiarImagenColor('${p.id}', this); actualizarStockDinamico('${p.id}');" 
                                data-imagenes="${imagenes.join('|')}"
                                class="w-full border border-neutral-800 p-2 text-xs font-bold bg-black text-white focus:outline-none uppercase">
                            ${colores.map((c, index) => `<option value="${c}" data-index="${index}">${c}</option>`).join("")}
                        </select>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-neutral-900">
                    <div class="text-[10px] text-neutral-400 uppercase tracking-wider">
                        Disponibles: <span id="stock-display-${p.id}" class="font-bold text-white">${p.stock}</span> u.
                    </div>
                    <div class="flex items-center border border-neutral-800 bg-black">
                        <button onclick="alterarCantidad('${p.id}', -1)" class="px-2.5 py-1 text-xs text-neutral-400 hover:text-white font-black transition-colors">-</button>
                        <input id="cant-${p.id}" type="number" value="1" min="1" max="${p.stock}" readonly class="w-8 text-center bg-transparent text-xs font-black text-white outline-none">
                        <button onclick="alterarCantidad('${p.id}', 1)" class="px-2.5 py-1 text-xs text-neutral-400 hover:text-white font-black transition-colors">+</button>
                    </div>
                </div>

                <div class="flex justify-between items-center pt-2">
                    <span class="font-black text-lg">$${parseFloat(p.precio || 0).toLocaleString('es-AR')}</span>
                </div>

                <button onclick="agregarAlCarritoConCantidad('${p.id}')" class="w-full bg-white text-black py-3 text-xs font-black tracking-widest uppercase hover:bg-neutral-200 transition-all active:scale-[0.99]">
                    AÑADIR AL CARRITO
                </button>
            </div>
        `;
        container.appendChild(item);
        actualizarStockDinamico(p.id);
    });
}

// 3. CAMBIAR IMAGEN DE ACUERDO AL COLOR SELECCIONADO
function cambiarImagenColor(productId, selectElement) {
    const imgComponent = document.getElementById(`prod-img-${productId}`);
    if (!imgComponent) return;
    
    const listaImagenes = selectElement.getAttribute('data-imagenes').split('|');
    const index = selectElement.options[selectElement.selectedIndex].getAttribute('data-index');
    
    if (listaImagenes[index]) {
        imgComponent.src = listaImagenes[index];
    }
}

// 4. MANEJO DE CONTROLES DE CANTIDAD INDIVIDUAL (+ / -)
function alterarCantidad(id, cambio) {
    const input = document.getElementById(`cant-${id}`);
    if (!input) return;
    const maxStock = parseInt(input.getAttribute('max')) || 1;
    let valorActual = parseInt(input.value) || 1;
    
    valorActual += cambio;
    if (valorActual < 1) valorActual = 1;
    if (valorActual > maxStock) valorActual = maxStock;
    
    input.value = valorActual;
}

// 5. CONTROL DINÁMICO DE STOCK SEGÚN CURVA INTERNA DE VARIANTES
function actualizarStockDinamico(id) {
    const prod = productos.find(p => p.id == id);
    if (!prod) return;

    const display = document.getElementById(`stock-display-${id}`);
    const inputCant = document.getElementById(`cant-${id}`);
    if (!display || !inputCant) return;

    let stockAsignado = parseInt(prod.stock);
    let stockVariante = stockAsignado > 15 ? 12 : Math.max(2, stockAsignado - 3);

    display.textContent = stockVariante;
    inputCant.setAttribute('max', stockVariante);
    
    if (parseInt(inputCant.value) > stockVariante) {
        inputCant.value = stockVariante;
    }
}

// 6. AÑADIR ELEMENTOS AL CARRITO CON CANTIDADES MULTIPLES
function agregarAlCarritoConCantidad(id) {
    const prod = productos.find(p => p.id == id);
    if (!prod) return;

    const talle = document.getElementById(`talle-${id}`).value;
    const color = document.getElementById(`color-${id}`).value;
    const cantidad = parseInt(document.getElementById(`cant-${id}`).value) || 1;
    const imgComponent = document.getElementById(`prod-img-${id}`);
    const imagen = imgComponent ? imgComponent.src : '';

    const itemId = `${id}_${talle}_${color}`;
    const itemExistente = carrito.find(item => item.itemId === itemId);

    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({
            itemId,
            id: prod.id,
            producto: prod.producto,
            precio: parseFloat(prod.precio),
            talle,
            color,
            cantidad,
            imagen
        });
    }

    localStorage.setItem('carrito_rexregum', JSON.stringify(carrito));
    actualizarBadgeContador();
    syncDrawerContenido();
    abrirDrawerCarrito();
}

// 7. INTERFAZ: CONTADOR GLOBAL DEL HEADER
function actualizarBadgeContador() {
    const badge = document.getElementById("cart-badge");
    if (badge) {
        badge.innerText = carrito.reduce((acc, curr) => acc + curr.cantidad, 0);
    }
}

// 8. INTERFAZ: CREAR EL PANEL LATERAL DEL CARRITO (DRAWER)
function initDrawerCarritoVisual() {
    let drawer = document.getElementById("cart-drawer");
    if (drawer) return;

    drawer = document.createElement("div");
    drawer.id = "cart-drawer";
    drawer.className = "fixed top-0 right-0 h-full w-full sm:w-[400px] bg-neutral-950 border-l border-neutral-900 shadow-2xl translate-x-full transition-transform duration-300 z-50 flex flex-col justify-between text-white";
    
    drawer.innerHTML = `
        <div class="p-6 border-b border-neutral-900 flex justify-between items-center">
            <h3 class="font-black text-sm uppercase tracking-widest">TUS COMPRAS</h3>
            <button onclick="cerrarDrawerCarrito()" class="text-neutral-500 hover:text-white font-bold text-xs uppercase tracking-wider">Cerrar ✕</button>
        </div>
        <div id="drawer-items-container" class="p-6 overflow-y-auto flex-1 space-y-4 divide-y divide-neutral-900">
            </div>
        <div class="p-6 border-t border-neutral-900 bg-neutral-950 space-y-4">
            <div class="flex justify-between items-center text-sm">
                <span class="font-bold text-neutral-400 uppercase tracking-wider text-xs">Total Estimado:</span>
                <span id="drawer-total" class="font-black text-lg text-white">$0</span>
            </div>
            <button onclick="procesarCompra()" class="w-full bg-white text-black py-3 text-xs font-black tracking-widest uppercase hover:bg-neutral-200 transition-all">
                INICIAR DESPACHO
            </button>
        </div>
    `;
    document.body.appendChild(drawer);
    syncDrawerContenido();
}

function abrirDrawerCarrito() { document.getElementById("cart-drawer").classList.remove("translate-x-full"); }
function cerrarDrawerCarrito() { document.getElementById("cart-drawer").classList.add("translate-x-full"); }

// 9. SINCRONIZAR ELEMENTOS DENTRO DEL PANEL LATERAL
function syncDrawerContenido() {
    const container = document.getElementById("drawer-items-container");
    const totalDisplay = document.getElementById("drawer-total");
    if (!container || !totalDisplay) return;

    container.innerHTML = "";
    let totalGeneral = 0;

    if (carrito.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-neutral-600 text-xs uppercase tracking-widest">El carrito está vacío.</div>`;
        totalDisplay.innerText = "$0";
        return;
    }

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalGeneral += subtotal;

        const row = document.createElement("div");
        row.className = "flex gap-4 pt-4 first:pt-0 items-center justify-between";
        row.innerHTML = `
            <img src="${item.imagen}" class="w-12 h-16 object-cover bg-neutral-900 border border-neutral-900 grayscale">
            <div class="flex-1 min-w-0">
                <h4 class="font-bold text-xs truncate uppercase text-white">${item.producto}</h4>
                <p class="text-[10px] text-neutral-500 uppercase font-medium mt-0.5">Talle: ${item.talle} | Color: ${item.color}</p>
                <p class="text-xs text-neutral-400 mt-1 font-bold">${item.cantidad} x $${item.precio.toLocaleString('es-AR')}</p>
            </div>
            <div class="text-right flex flex-col items-end gap-2">
                <span class="font-bold text-xs text-white">$${subtotal.toLocaleString('es-AR')}</span>
                <button onclick="removerDelDrawer('${item.itemId}')" class="text-[10px] text-neutral-600 hover:text-red-400 font-bold uppercase tracking-wider transition-colors">Quitar</button>
            </div>
        `;
        container.appendChild(row);
    });

    totalDisplay.innerText = `$${totalGeneral.toLocaleString('es-AR')}`;
}

function removerDelDrawer(itemId) {
    carrito = Size = carrito.filter(item => item.itemId !== itemId);
    localStorage.setItem('carrito_rexregum', JSON.stringify(carrito));
    actualizarBadgeContador();
    syncDrawerContenido();
}

// 10. BOTONES DE ACCIÓN GLOBAL (CHECKOUT)
function procesarCompra() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Sumá algún diseño antes de finalizar.");
        return;
    }
    cerrarDrawerCarrito();
    const userCache = localStorage.getItem('usuario_rexregum');
    if (userCache) {
        despacharAWhatsApp(JSON.parse(userCache));
    } else {
        abrirModalCheckout();
    }
}

// 11. INTERFAZ: FORMULARIO MODAL DE REGISTRO UNIFICADO
function initModalCheckout() {
    let modal = document.getElementById("checkout-modal");
    if (modal) return;

    modal = document.createElement("div");
    modal.id = "checkout-modal";
    modal.className = "fixed inset-0 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4 z-50";
    modal.innerHTML = `
        <div class="bg-neutral-900 p-6 max-w-md w-full border border-neutral-800 max-h-[90vh] overflow-y-auto text-white">
            <h3 class="text-base font-black tracking-widest uppercase mb-1">DATOS DE ENTREGA</h3>
            <p class="text-[10px] text-neutral-500 uppercase tracking-wider mb-6">Completá una sola vez para despachar tu orden.</p>
            <form id="form-checkout" onsubmit="ejecutarCompraFinal(event)" class="space-y-4 text-left">
                <div>
                    <label class="block text-[9px] font-bold tracking-wider uppercase mb-1 text-neutral-400">Nombre y Apellido</label>
                    <input type="text" id="chk-nombre" required class="w-full bg-black border border-neutral-800 p-2 text-xs font-bold text-white focus:border-white outline-none">
                </div>
                <div>
                    <label class="block text-[9px] font-bold tracking-wider uppercase mb-1 text-neutral-400">Ciudad / Localidad (Entre Ríos)</label>
                    <input type="text" id="chk-localidad" required class="w-full bg-black border border-neutral-800 p-2 text-xs font-bold text-white focus:border-white outline-none">
                </div>
                <div>
                    <label class="block text-[9px] font-bold tracking-wider uppercase mb-1 text-neutral-400">Dirección Completa de Envío</label>
                    <input type="text" id="chk-direccion" required class="w-full bg-black border border-neutral-800 p-2 text-xs font-bold text-white focus:border-white outline-none">
                </div>
                <div>
                    <label class="block text-[9px] font-bold tracking-wider uppercase mb-1 text-neutral-400">Teléfono Celular (WhatsApp)</label>
                    <input type="tel" id="chk-telefono" required class="w-full bg-black border border-neutral-800 p-2 text-xs font-bold text-white focus:border-white outline-none">
                </div>
                <div class="pt-4 flex space-x-2">
                    <button type="button" onclick="cerrarModalCheckout()" class="w-1/3 border border-neutral-800 py-3 text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors">Volver</button>
                    <button type="submit" class="w-2/3 bg-white text-black py-3 text-xs font-black tracking-widest uppercase hover:bg-neutral-200 transition-all">CONFIRMAR PEDIDO</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function abrirModalCheckout() { document.getElementById("checkout-modal").classList.replace("hidden", "flex"); }
function cerrarModalCheckout() { document.getElementById("checkout-modal").classList.replace("flex", "hidden"); }

// 12. PROCESAMIENTO POST COMPRA: ENVÍO AL SHEETS Y REDIRECCIÓN A WHATSAPP
async function ejecutarCompraFinal(event) {
    event.preventDefault();
    const btn = event.target.querySelector("button[type='submit']");
    btn.disabled = true;
    btn.innerText = "PROCESANDO ORDREN...";

    const datosCliente = {
        nombre: document.getElementById("chk-nombre").value,
        localidad: document.getElementById("chk-localidad").value,
        direccion: document.getElementById("chk-direccion").value,
        telefono: document.getElementById("chk-telefono").value
    };

    localStorage.setItem('usuario_rexregum', JSON.stringify(datosCliente));
    cerrarModalCheckout();

    const total = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    const desgloseTexto = carrito.map(p => `${p.cantidad}x ${p.producto} [Talle: ${p.talle} | Color: ${p.color}]`).join(", ");

    try {
        await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "registrar_pedido",
                cliente: datosCliente.nombre,
                detalle: desgloseTexto,
                total: total,
                direccion: `${datosCliente.direccion}, ${datosCliente.localidad}`
            })
        });
    } catch (e) {
        console.error("Persistencia diferida:", e);
    }

    despacharAWhatsApp(datosCliente);
}

function despacharAWhatsApp(datosCliente) {
    let mensaje = `*REX REGUM - NUEVO PEDIDO INBOUND*\n`;
    mensaje += `----------------------------------------\n`;
    mensaje += `*Cliente:* ${datosCliente.nombre}\n`;
    mensaje += `*Dirección:* ${datosCliente.direccion}\n`;
    mensaje += `*Localidad:* ${datosCliente.localidad}\n`;
    mensaje += `----------------------------------------\n\n`;
    
    let totalGeneral = 0;
    
    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        totalGeneral += subtotal;
        mensaje += `${index + 1}. *${item.producto}*\n`;
        mensaje += `   [Talle: ${item.talle} | Color: ${item.color}]\n`;
        mensaje += `   *Cantidad:* ${item.cantidad} u. x $${item.precio.toLocaleString('es-AR')}\n`;
        mensaje += `   *Subtotal:* $${subtotal.toLocaleString('es-AR')}\n\n`;
    });
    
    mensaje += `----------------------------------------\n`;
    mensaje += `*TOTAL DE LA ORDEN:* $${totalGeneral.toLocaleString('es-AR')}\n\n`;
    mensaje += `_Gastos de envío y logística de entrega a coordinar con el operador._`;

    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUM}&text=${encodeURIComponent(mensaje)}`;
    
    carrito = [];
    localStorage.removeItem('carrito_rexregum');
    actualizarBadgeContador();
    syncDrawerContenido();

    window.open(url, '_blank');
}