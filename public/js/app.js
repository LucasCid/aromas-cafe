// AGREGAR ESTO AL INICIO DEL ARCHIVO app.js (antes de cualquier otro código)


// Función para crear y ejecutar la animación reveal
function initPageRevealAnimation() {
    // Evitar múltiples ejecuciones
    if (document.body.classList.contains('page-loading') || 
        document.body.classList.contains('page-loaded')) {
        return;
    }

    // Crear el contenedor de líneas
    const revealContainer = document.createElement('div');
    revealContainer.className = 'reveal-container';
    
    // Crear 5 líneas con diferentes gradientes
    for (let i = 0; i < 5; i++) {
        const line = document.createElement('div');
        line.className = 'reveal-line';
        revealContainer.appendChild(line);
    }
    
    // Agregar al body
    document.body.insertBefore(revealContainer, document.body.firstChild);
    
    // Agregar clase de carga al body
    document.body.classList.add('page-loading');
    
    // Mejor timing para la animación
    const animationDuration = 1600;
    
    // Limpiar después de que termina la animación
    setTimeout(() => {
        // Agregar fade out suave al contenedor
        revealContainer.style.opacity = '0';
        revealContainer.style.transition = 'opacity 0.3s ease-out';
        
        setTimeout(() => {
            if (revealContainer.parentNode) {
                revealContainer.remove();
            }
            document.body.classList.remove('page-loading');
            document.body.classList.add('page-loaded');
            
            // Disparar evento personalizado para notificar que la animación terminó
            window.dispatchEvent(new CustomEvent('pageRevealComplete'));
        }, 300);
    }, animationDuration);
}

// Función para reiniciar la animación (útil para transiciones)
function restartRevealAnimation() {
    document.body.classList.remove('page-loaded');
    initPageRevealAnimation();
}

// Ejecutar la animación cuando carga la página
function setupPageReveal() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPageRevealAnimation);
    } else {
        // Pequeño delay para asegurar que el DOM esté listo
        setTimeout(initPageRevealAnimation, 10);
    }
}

// Inicializar
setupPageReveal();

// Opcional: Ejecutar animación al hacer navigate (para SPAs)
window.addEventListener('beforeunload', function() {
    document.body.classList.remove('page-loaded');
});

// Exportar funciones para uso global (opcional)
window.PageReveal = {
    init: initPageRevealAnimation,
    restart: restartRevealAnimation
};











// class EcommerceApp {
//     constructor() {
//         this.products = [];
//         this.categories = [];
//         this.cart = this.loadCart();
//         this.currentCategory = '';
//         this.searchQuery = '';
//         this.currentTheme = this.loadTheme();
        
//         this.initializeElements();
//         this.bindEvents();
//         this.loadInitialData();
//         this.updateCartUI();
//         this.applyTheme();


//         toggleShowMore() 
//     this.showAllProducts = !this.showAllProducts;
//     this.renderProducts();

//         this.showAllProducts = false;

//     }

//     async loadProducts() {
//     try {
//         this.showAllProducts = false; // Resetear al cargar
//         this.showLoading(true);
        
//         const params = new URLSearchParams();
//         if (this.currentCategory) params.append('categoria', this.currentCategory);
//         if (this.searchQuery) params.append('buscar', this.searchQuery);
        
//         const response = await fetch(`/api/productos?${params.toString()}`);
//         const data = await response.json();
        
//         if (data.success) {
//             this.products = data.productos;
//             this.renderProducts();
//         } else {
//             throw new Error(data.error);
//         }
//     } catch (error) {
//         console.error('Error cargando productos:', error);
//         this.showToast('Error cargando productos', 'error');
//     } finally {
//         this.showLoading(false);
//     }
// }

//     renderProducts() {
//     if (this.products.length === 0) {
//         this.productsGrid.innerHTML = `
//             <div class="no-products">
//                 <i class="fas fa-search"></i>
//                 <h3>No se encontraron productos</h3>
//                 <p>Intenta con otros términos de búsqueda</p>
//             </div>
//         `;
//         return;
//     }

//     const productsToShow = this.showAllProducts ? this.products : this.products.slice(0, 6);
//     const hasMore = !this.showAllProducts && this.products.length > 6;

//     this.productsGrid.innerHTML = productsToShow.map(product => `
//         <div class="product-card" data-id="${product.id}">
//             <img src="${product.imagen_url}" alt="${product.nombre}" class="product-image" 
//                  onerror="this.src='https://via.placeholder.com/300x300?text=Sin+Imagen'">
//             <div class="product-info">
//                 <h3 class="product-name">${product.nombre}</h3>
//                 <p class="product-description">${product.descripcion}</p>
//                 <div class="product-price">${this.formatPrice(product.precio)}</div>
//                 <div class="product-stock ${product.stock < 5 ? 'low' : ''}">
//                     ${product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
//                 </div>
//                 <button class="add-to-cart" onclick="app.addToCart(${product.id})" 
//                         ${product.stock === 0 ? 'disabled' : ''}>
//                     <i class="fas fa-cart-plus"></i>
//                     ${product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
//                 </button>
//             </div>
//         </div>
//     `).join('');

//  if (hasMore) {
//         const loadMoreBtn = document.createElement('div');
//         loadMoreBtn.className = 'load-more-container';
//         loadMoreBtn.innerHTML = `
//             <button class="load-more-btn" onclick="app.toggleShowMore()">
//                 Ver más productos
//             </button>
//         `;
//         this.productsGrid.parentNode.insertBefore(loadMoreBtn, this.productsGrid.nextSibling);
//     } else {
//         // Remover botón si existe cuando se resetea
//         const existingBtn = this.productsGrid.parentNode.querySelector('.load-more-container');
//         if (existingBtn) existingBtn.remove();
//     }
// }



//     initializeElements() {
//         // Elementos principales
//         this.productsGrid = document.getElementById('productsGrid');
//         this.loadingProducts = document.getElementById('loadingProducts');
//         this.categoryFilters = document.getElementById('categoryFilters');
//         this.searchInput = document.getElementById('searchInput');
//         this.searchBtn = document.getElementById('searchBtn');
        
//         // Theme toggle
//         this.themeToggle = document.getElementById('themeToggle');
        
//         // Cart
//         this.cartBtn = document.getElementById('cartBtn');
//         this.cartCount = document.getElementById('cartCount');
//         this.cartModal = document.getElementById('cartModal');
//         this.cartItems = document.getElementById('cartItems');
//         this.cartTotal = document.getElementById('cartTotal');
        
//         // Checkout
//         this.checkoutModal = document.getElementById('checkoutModal');
//         this.checkoutForm = document.getElementById('checkoutForm');
//         this.checkoutSummary = document.getElementById('checkoutSummary');
//         this.checkoutTotal = document.getElementById('checkoutTotal');
        
//         // Payment Result
//         this.paymentResultModal = document.getElementById('paymentResultModal');
//         this.paymentResultTitle = document.getElementById('paymentResultTitle');
//         this.paymentResultContent = document.getElementById('paymentResultContent');
        
//         // Toast
//         this.toast = document.getElementById('toast');
//         this.toastMessage = document.getElementById('toastMessage');
//     }

//     bindEvents() {
//         // Toggle de tema
//         this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
//         // Búsqueda
//         this.searchBtn.addEventListener('click', () => this.searchProducts());
//         this.searchInput.addEventListener('keypress', (e) => {
//             if (e.key === 'Enter') this.searchProducts();
//         });
//         this.searchInput.addEventListener('input', (e) => {
//             if (e.target.value === '') {
//                 this.searchQuery = '';
//                 this.loadProducts();
//             }
//         });

//         // Cart
//         this.cartBtn.addEventListener('click', () => this.openCartModal());
//         document.getElementById('closeCartModal').addEventListener('click', () => this.closeModal('cartModal'));
//         document.getElementById('clearCart').addEventListener('click', () => this.clearCart());
//         document.getElementById('checkoutBtn').addEventListener('click', () => this.openCheckoutModal());

//         // Checkout
//         document.getElementById('closeCheckoutModal').addEventListener('click', () => this.closeModal('checkoutModal'));
//         document.getElementById('cancelCheckout').addEventListener('click', () => this.closeModal('checkoutModal'));
//         document.getElementById('confirmOrder').addEventListener('click', () => this.processOrder());

//         // Payment Result
//         document.getElementById('closePaymentResultModal').addEventListener('click', () => this.closeModal('paymentResultModal'));
//         document.getElementById('backToShop').addEventListener('click', () => {
//             this.closeModal('paymentResultModal');
//             this.clearCart();
//         });

//         // Cerrar modales haciendo clic fuera
//         window.addEventListener('click', (e) => {
//             if (e.target.classList.contains('modal')) {
//                 this.closeModal(e.target.id);
//             }
//         });

//         // Verificar resultado de pago si hay parámetros en la URL
//         this.checkPaymentResult();
//     }

//     // Funciones para manejar el tema
//     loadTheme() {
//         return localStorage.getItem('ecommerce_theme') || 'light';
//     }

//     saveTheme() {
//         localStorage.setItem('ecommerce_theme', this.currentTheme);
//     }

//     toggleTheme() {
//         this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
//         this.applyTheme();
//         this.saveTheme();
        
//         // Actualizar icono
//         const icon = this.themeToggle.querySelector('i');
//         icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        
//         this.showToast(`Modo ${this.currentTheme === 'light' ? 'claro' : 'oscuro'} activado`, 'success');
//     }

//     applyTheme() {
//         document.body.setAttribute('data-theme', this.currentTheme);
//     }

//     // El resto del código se mantiene igual...
//     // [Aquí va todo el resto del código de app.js sin cambios]
//     // Solo agregué las funciones de tema al inicio

//     async loadInitialData() {
//         try {
//             await Promise.all([
//                 this.loadCategories(),
//                 this.loadProducts()
//             ]);
//         } catch (error) {
//             console.error('Error cargando datos iniciales:', error);
//             this.showToast('Error cargando la tienda', 'error');
//         }
//     }

//     async loadCategories() {
//         try {
//             const response = await fetch('/api/productos/utils/categorias');
//             const data = await response.json();
            
//             if (data.success) {
//                 this.categories = data.categorias;
//                 // this.categories = ["Capsulas", "Granos", "Molido"];
//                 this.renderCategoryFilters();
//             }
//         } catch (error) {
//             console.error('Error cargando categorías:', error);
//         }
//     }

//     // renderCategoryFilters() {
//     //     const allButton = this.categoryFilters.querySelector('[data-category=""]');
        
//     //     this.categories.forEach(category => {
//     //         const button = document.createElement('button');
//     //         button.className = 'filter-btn';
//     //         button.textContent = category;
//     //         button.dataset.category = category;
//     //         button.addEventListener('click', () => this.filterByCategory(category));
//     //         this.categoryFilters.appendChild(button);
//     //     });
//     // }

//     renderCategoryFilters() {
//     const allButton = this.categoryFilters.querySelector('[data-category=""]');
    
//     // Agregar evento listener al botón "Todos"
//     if (allButton) {
//         allButton.addEventListener('click', () => this.filterByCategory(''));
//     }
    
//     this.categories.forEach(category => {
//         const button = document.createElement('button');
//         button.className = 'filter-btn';
//         button.textContent = category;
//         button.dataset.category = category;
//         button.addEventListener('click', () => this.filterByCategory(category));
//         this.categoryFilters.appendChild(button);
//     });
// }

//     // filterByCategory(category) {
//     //     this.currentCategory = category;
        
//     //     // Actualizar botones activos
//     //     document.querySelectorAll('.filter-btn').forEach(btn => {
//     //         btn.classList.remove('active');
//     //         if (btn.dataset.category === category) {
//     //             btn.classList.add('active');
//     //         }
//     //     });
        
//     //     this.loadProducts();
//     // }

//     filterByCategory(category) {
//     this.currentCategory = category;
    
//     // Actualizar botones activos
//     document.querySelectorAll('.filter-btn').forEach(btn => {
//         btn.classList.remove('active');
//         // Comparar explícitamente: si category es vacío, buscar el botón "Todos"
//         if ((category === '' && btn.dataset.category === '') || 
//             (category !== '' && btn.dataset.category === category)) {
//             btn.classList.add('active');
//         }
//     });
    
//     this.loadProducts();
// }

//     searchProducts() {
//         this.searchQuery = this.searchInput.value.trim();
//         this.loadProducts();
//     }

//     async loadProducts() {
//         try {
//             this.showLoading(true);
            
//             const params = new URLSearchParams();
//             if (this.currentCategory) params.append('categoria', this.currentCategory);
//             if (this.searchQuery) params.append('buscar', this.searchQuery);
            
//             const response = await fetch(`/api/productos?${params.toString()}`);
//             const data = await response.json();
            
//             if (data.success) {
//                 this.products = data.productos;
//                 this.renderProducts();
//             } else {
//                 throw new Error(data.error);
//             }
//         } catch (error) {
//             console.error('Error cargando productos:', error);
//             this.showToast('Error cargando productos', 'error');
//         } finally {
//             this.showLoading(false);
//         }
//     }

//     showLoading(show) {
//         this.loadingProducts.style.display = show ? 'block' : 'none';
//         this.productsGrid.style.display = show ? 'none' : 'grid';
//     }

//     renderProducts() {
//         if (this.products.length === 0) {
//             this.productsGrid.innerHTML = `
//                 <div class="no-products">
//                     <i class="fas fa-search"></i>
//                     <h3>No se encontraron productos</h3>
//                     <p>Intenta con otros términos de búsqueda</p>
//                 </div>
//             `;
//             return;
//         }

//         this.productsGrid.innerHTML = this.products.map(product => `
//             <div class="product-card" data-id="${product.id}">
//                 <img src="${product.imagen_url}" alt="${product.nombre}" class="product-image" 
//                      onerror="this.src='https://via.placeholder.com/300x300?text=Sin+Imagen'">
//                 <div class="product-info">
//                     <h3 class="product-name">${product.nombre}</h3>
//                     <p class="product-description">${product.descripcion}</p>
//                     <div class="product-price">${this.formatPrice(product.precio)}</div>
//                     <div class="product-stock ${product.stock < 5 ? 'low' : ''}">
//                         ${product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
//                     </div>
//                     <button class="add-to-cart" onclick="app.addToCart(${product.id})" 
//                             ${product.stock === 0 ? 'disabled' : ''}>
//                         <i class="fas fa-cart-plus"></i>
//                         ${product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
//                     </button>
//                 </div>
//             </div>
//         `).join('');
//     }

//     formatPrice(price) {
//         return new Intl.NumberFormat('es-CL').format(price);
//     }

//     // Gestión del Carrito
//     loadCart() {
//         const saved = localStorage.getItem('ecommerce_cart');
//         return saved ? JSON.parse(saved) : [];
//     }

//     saveCart() {
//         localStorage.setItem('ecommerce_cart', JSON.stringify(this.cart));
//         this.updateCartUI();
//     }

//     addToCart(productId) {
//         const product = this.products.find(p => p.id === productId);
//         if (!product || product.stock === 0) {
//             this.showToast('Producto no disponible', 'error');
//             return;
//         }

//         const existingItem = this.cart.find(item => item.id === productId);
        
//         if (existingItem) {
//             if (existingItem.quantity >= product.stock) {
//                 this.showToast('No hay más stock disponible', 'warning');
//                 return;
//             }
//             existingItem.quantity++;
//         } else {
//             this.cart.push({
//                 id: productId,
//                 nombre: product.nombre,
//                 precio: product.precio,
//                 imagen_url: product.imagen_url,
//                 quantity: 1,
//                 stock: product.stock
//             });
//         }

//         this.saveCart();
//         this.showToast('Producto agregado al carrito', 'success');
//     }

//     removeFromCart(productId) {
//         this.cart = this.cart.filter(item => item.id !== productId);
//         this.saveCart();
//         this.renderCartItems();
//         this.showToast('Producto eliminado del carrito', 'success');
//     }

//     updateCartItemQuantity(productId, change) {
//         const item = this.cart.find(item => item.id === productId);
//         if (!item) return;

//         const newQuantity = item.quantity + change;
        
//         if (newQuantity <= 0) {
//             this.removeFromCart(productId);
//             return;
//         }
        
//         if (newQuantity > item.stock) {
//             this.showToast('No hay más stock disponible', 'warning');
//             return;
//         }

//         item.quantity = newQuantity;
//         this.saveCart();
//         this.renderCartItems();
//     }

//     updateCartUI() {
//         const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
//         this.cartCount.textContent = totalItems;
//         this.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
//     }

//     openCartModal() {
//         this.renderCartItems();
//         this.openModal('cartModal');
//     }

//     renderCartItems() {
//         if (this.cart.length === 0) {
//             this.cartItems.innerHTML = `
//                 <div class="empty-cart">
//                     <i class="fas fa-shopping-cart"></i>
//                     <h3>Tu carrito está vacío</h3>
//                     <p>Agrega algunos productos para comenzar</p>
//                 </div>
//             `;
//             this.cartTotal.textContent = '0';
//             return;
//         }

//         this.cartItems.innerHTML = this.cart.map(item => `
//             <div class="cart-item">
//                 <img src="${item.imagen_url}" alt="${item.nombre}" class="cart-item-image"
//                      onerror="this.src='https://via.placeholder.com/60x60?text=Sin+Imagen'">
//                 <div class="cart-item-info">
//                     <div class="cart-item-name">${item.nombre}</div>
//                     <div class="cart-item-price">${this.formatPrice(item.precio)}</div>
//                     <div class="cart-item-controls">
//                         <button class="quantity-btn" onclick="app.updateCartItemQuantity(${item.id}, -1)">
//                             <i class="fas fa-minus"></i>
//                         </button>
//                         <span class="cart-item-quantity">${item.quantity}</span>
//                         <button class="quantity-btn" onclick="app.updateCartItemQuantity(${item.id}, 1)">
//                             <i class="fas fa-plus"></i>
//                         </button>
//                     </div>
//                 </div>
//                 <div class="remove-item" onclick="app.removeFromCart(${item.id})">
//                     <i class="fas fa-trash"></i>
//                 </div>
//             </div>
//         `).join('');

//         const total = this.cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
//         this.cartTotal.textContent = this.formatPrice(total);
//     }

//     clearCart() {
//         if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
//             this.cart = [];
//             this.saveCart();
//             this.renderCartItems();
//             this.showToast('Carrito vaciado', 'success');
//         }
//     }

//     // Checkout Process
//     openCheckoutModal() {
//         if (this.cart.length === 0) {
//             this.showToast('Tu carrito está vacío', 'warning');
//             return;
//         }

//         this.renderCheckoutSummary();
//         this.closeModal('cartModal');
//         this.openModal('checkoutModal');
//     }

//     renderCheckoutSummary() {
//         this.checkoutSummary.innerHTML = this.cart.map(item => `
//             <div class="checkout-item">
//                 <span>${item.nombre} x ${item.quantity}</span>
//                 <span>${this.formatPrice(item.precio * item.quantity)}</span>
//             </div>
//         `).join('');

//         const total = this.cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
//         this.checkoutTotal.textContent = this.formatPrice(total);
//     }

//     async processOrder() {
//         const formData = new FormData(this.checkoutForm);
        
//         if (!formData.get('nombre') || !formData.get('email')) {
//             this.showToast('Por favor completa los campos obligatorios', 'error');
//             return;
//         }

//         const confirmBtn = document.getElementById('confirmOrder');
//         const originalText = confirmBtn.innerHTML;
//         confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
//         confirmBtn.disabled = true;

//         try {
//             // Crear la orden
//             const orderData = {
//                 items: this.cart.map(item => ({
//                     producto_id: item.id,
//                     cantidad: item.quantity
//                 })),
//                 usuario: {
//                     nombre: formData.get('nombre'),
//                     email: formData.get('email'),
//                     telefono: formData.get('telefono'),
//                     direccion: formData.get('direccion')
//                 }
//             };

//             const orderResponse = await fetch('/api/ordenes', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(orderData)
//             });

//             const orderResult = await orderResponse.json();

//             if (!orderResult.success) {
//                 throw new Error(orderResult.error);
//             }

//             // Crear el pago en Flow
//             const paymentResponse = await fetch('/api/flow/create-payment', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ ordenId: orderResult.orden.id })
//             });

//             const paymentResult = await paymentResponse.json();

//             if (!paymentResult.success) {
//                 throw new Error(paymentResult.error);
//             }

//             // Redirigir a Flow
//             window.location.href = paymentResult.paymentURL;

//         } catch (error) {
//             console.error('Error procesando orden:', error);
//             this.showToast('Error al procesar la orden: ' + error.message, 'error');
//         } finally {
//             confirmBtn.innerHTML = originalText;
//             confirmBtn.disabled = false;
//         }
//     }

//     // Gestión de Modales
//     openModal(modalId) {
//         document.getElementById(modalId).style.display = 'block';
//         document.body.style.overflow = 'hidden';
//     }

//     closeModal(modalId) {
//         document.getElementById(modalId).style.display = 'none';
//         document.body.style.overflow = 'auto';
//     }

//     // Verificar resultado del pago
//     checkPaymentResult() {
//         const urlParams = new URLSearchParams(window.location.search);
//         const token = urlParams.get('token');
        
//         if (token) {
//             this.showPaymentResult(token);
//             // Limpiar la URL
//             window.history.replaceState({}, document.title, window.location.pathname);
//         }
//     }

//     async showPaymentResult(token) {
//         try {
//             const response = await fetch(`/api/flow/status/${token}`);
//             const result = await response.json();
            
//             if (result.success && result.flowStatus) {
//                 const status = result.flowStatus.status;
//                 const paymentData = result.flowStatus;
                
//                 if (status === 2) { // Pagado
//                     this.paymentResultTitle.innerHTML = '<i class="fas fa-check-circle" style="color: #059669;"></i> ¡Pago Exitoso!';
//                     this.paymentResultContent.innerHTML = `
//                         <div style="text-align: center; padding: 2rem;">
//                             <h3 style="color: #059669; margin-bottom: 1rem;">¡Tu compra fue procesada exitosamente!</h3>
//                             <p><strong>Número de orden:</strong> ${paymentData.commerceOrder}</p>
//                             <p><strong>Total pagado:</strong> ${this.formatPrice(paymentData.amount)}</p>
//                             <p><strong>Fecha:</strong> ${new Date(paymentData.paymentDate).toLocaleString()}</p>
//                             <div style="margin-top: 2rem; padding: 1rem; background: #f0fdf4; border-radius: 8px;">
//                                 <p style="color: #166534;">Recibirás un email de confirmación con los detalles de tu pedido.</p>
//                             </div>
//                         </div>
//                     `;
//                 } else if (status === 3) { // Rechazado
//                     this.paymentResultTitle.innerHTML = '<i class="fas fa-times-circle" style="color: #dc2626;"></i> Pago Rechazado';
//                     this.paymentResultContent.innerHTML = `
//                         <div style="text-align: center; padding: 2rem;">
//                             <h3 style="color: #dc2626; margin-bottom: 1rem;">Tu pago no pudo ser procesado</h3>
//                             <p>El pago fue rechazado por el banco o medio de pago.</p>
//                             <p><strong>Número de orden:</strong> ${paymentData.commerceOrder}</p>
//                             <div style="margin-top: 2rem; padding: 1rem; background: #fef2f2; border-radius: 8px;">
//                                 <p style="color: #991b1b;">Puedes intentar nuevamente con otro medio de pago.</p>
//                             </div>
//                         </div>
//                     `;
//                 } else { // Pendiente u otro estado
//                     this.paymentResultTitle.innerHTML = '<i class="fas fa-clock" style="color: #d97706;"></i> Pago Pendiente';
//                     this.paymentResultContent.innerHTML = `
//                         <div style="text-align: center; padding: 2rem;">
//                             <h3 style="color: #d97706; margin-bottom: 1rem;">Tu pago está siendo procesado</h3>
//                             <p>El pago está pendiente de confirmación.</p>
//                             <p><strong>Número de orden:</strong> ${paymentData.commerceOrder}</p>
//                             <div style="margin-top: 2rem; padding: 1rem; background: #fffbeb; border-radius: 8px;">
//                                 <p style="color: #92400e;">Te notificaremos cuando el pago sea confirmado.</p>
//                             </div>
//                         </div>
//                     `;
//                 }
                
//                 this.openModal('paymentResultModal');
//             }
//         } catch (error) {
//             console.error('Error obteniendo resultado del pago:', error);
//         }
//     }

//     // Toast Notifications
//     showToast(message, type = 'success') {
//         this.toastMessage.textContent = message;
//         this.toast.className = `toast ${type}`;
//         this.toast.classList.add('show');
        
//         setTimeout(() => {
//             this.toast.classList.remove('show');
//         }, 3000);
//     }
// }

// // Inicializar la aplicación cuando se carga la página
// document.addEventListener('DOMContentLoaded', () => {
//     window.app = new EcommerceApp();
// });

class EcommerceApp {
    constructor() {
        this.products = [];
        this.categories = [];
        this.cart = this.loadCart();
        this.currentCategory = '';
        this.searchQuery = '';
        this.currentTheme = this.loadTheme();
        this.showAllProducts = false; // Para la funcionalidad de "Ver más"
        
        this.initializeElements();
        this.bindEvents();
        this.loadInitialData();
        this.updateCartUI();
        this.applyTheme();
    }

    initializeElements() {
        // Elementos principales
        this.productsGrid = document.getElementById('productsGrid');
        this.loadingProducts = document.getElementById('loadingProducts');
        this.categoryFilters = document.getElementById('categoryFilters');
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        
        // Theme toggle
        this.themeToggle = document.getElementById('themeToggle');
        
        // Cart
        this.cartBtn = document.getElementById('cartBtn');
        this.cartCount = document.getElementById('cartCount');
        this.cartModal = document.getElementById('cartModal');
        this.cartItems = document.getElementById('cartItems');
        this.cartTotal = document.getElementById('cartTotal');
        
        // Checkout
        this.checkoutModal = document.getElementById('checkoutModal');
        this.checkoutForm = document.getElementById('checkoutForm');
        this.checkoutSummary = document.getElementById('checkoutSummary');
        this.checkoutTotal = document.getElementById('checkoutTotal');
        
        // Payment Result
        this.paymentResultModal = document.getElementById('paymentResultModal');
        this.paymentResultTitle = document.getElementById('paymentResultTitle');
        this.paymentResultContent = document.getElementById('paymentResultContent');
        
        // Toast
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toastMessage');
    }

    bindEvents() {
        // Toggle de tema
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Búsqueda
        this.searchBtn.addEventListener('click', () => this.searchProducts());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchProducts();
        });
        this.searchInput.addEventListener('input', (e) => {
            if (e.target.value === '') {
                this.searchQuery = '';
                this.loadProducts();
            }
        });

        // Cart
        this.cartBtn.addEventListener('click', () => this.openCartModal());
        document.getElementById('closeCartModal').addEventListener('click', () => this.closeModal('cartModal'));
        document.getElementById('clearCart').addEventListener('click', () => this.clearCart());
        document.getElementById('checkoutBtn').addEventListener('click', () => this.openCheckoutModal());

        // Checkout
        document.getElementById('closeCheckoutModal').addEventListener('click', () => this.closeModal('checkoutModal'));
        document.getElementById('cancelCheckout').addEventListener('click', () => this.closeModal('checkoutModal'));
        document.getElementById('confirmOrder').addEventListener('click', () => this.processOrder());

        // Payment Result
        document.getElementById('closePaymentResultModal').addEventListener('click', () => this.closeModal('paymentResultModal'));
        document.getElementById('backToShop').addEventListener('click', () => {
            this.closeModal('paymentResultModal');
            this.clearCart();
        });

        // Cerrar modales haciendo clic fuera
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Verificar resultado de pago si hay parámetros en la URL
        this.checkPaymentResult();
    }

    // ====== TEMA ======
    loadTheme() {
        return localStorage.getItem('ecommerce_theme') || 'light';
    }

    saveTheme() {
        localStorage.setItem('ecommerce_theme', this.currentTheme);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveTheme();
        
        const icon = this.themeToggle.querySelector('i');
        icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        
        this.showToast(`Modo ${this.currentTheme === 'light' ? 'claro' : 'oscuro'} activado`, 'success');
    }

    applyTheme() {
        document.body.setAttribute('data-theme', this.currentTheme);
    }

    // ====== CARGA INICIAL ======
    async loadInitialData() {
        try {
            await Promise.all([
                this.loadCategories(),
                this.loadProducts()
            ]);
        } catch (error) {
            console.error('Error cargando datos iniciales:', error);
            this.showToast('Error cargando la tienda', 'error');
        }
    }

    async loadCategories() {
        try {
            const response = await fetch('/api/productos/utils/categorias');
            const data = await response.json();
            
            if (data.success) {
                this.categories = data.categorias;
                this.renderCategoryFilters();
            }
        } catch (error) {
            console.error('Error cargando categorías:', error);
        }
    }

    renderCategoryFilters() {
        const allButton = this.categoryFilters.querySelector('[data-category=""]');
        
        if (allButton) {
            allButton.addEventListener('click', () => this.filterByCategory(''));
        }
        
        this.categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.textContent = category;
            button.dataset.category = category;
            button.addEventListener('click', () => this.filterByCategory(category));
            this.categoryFilters.appendChild(button);
        });
    }

    filterByCategory(category) {
        this.currentCategory = category;
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if ((category === '' && btn.dataset.category === '') || 
                (category !== '' && btn.dataset.category === category)) {
                btn.classList.add('active');
            }
        });
        
        this.loadProducts();
    }

    searchProducts() {
        this.searchQuery = this.searchInput.value.trim();
        this.loadProducts();
    }

    async loadProducts() {
        try {
            this.showAllProducts = false; // Resetear al cargar
            this.showLoading(true);
            
            const params = new URLSearchParams();
            if (this.currentCategory) params.append('categoria', this.currentCategory);
            if (this.searchQuery) params.append('buscar', this.searchQuery);
            
            const response = await fetch(`/api/productos?${params.toString()}`);
            const data = await response.json();
            
            if (data.success) {
                this.products = data.productos;
                this.renderProducts();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error cargando productos:', error);
            this.showToast('Error cargando productos', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    showLoading(show) {
        this.loadingProducts.style.display = show ? 'block' : 'none';
        this.productsGrid.style.display = show ? 'none' : 'grid';
    }

    renderProducts() {
        if (this.products.length === 0) {
            this.productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3>No se encontraron productos</h3>
                    <p>Intenta con otros términos de búsqueda</p>
                </div>
            `;
            return;
        }

        const productsToShow = this.showAllProducts ? this.products : this.products.slice(0, 6);
        const hasMore = !this.showAllProducts && this.products.length > 6;

        this.productsGrid.innerHTML = productsToShow.map(product => `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.imagen_url}" alt="${product.nombre}" class="product-image" 
                     onerror="this.src='https://via.placeholder.com/300x300?text=Sin+Imagen'">
                <div class="product-info">
                    <h3 class="product-name">${product.nombre}</h3>
                    <p class="product-description">${product.descripcion}</p>
                    <div class="product-price">${this.formatPrice(product.precio)}</div>
                    <div class="product-stock ${product.stock < 5 ? 'low' : ''}">
                        ${product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
                    </div>
                    <button class="add-to-cart" onclick="app.addToCart(${product.id})" 
                            ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i>
                        ${product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                    </button>
                </div>
            </div>
        `).join('');

        if (hasMore) {
            const loadMoreBtn = document.createElement('div');
            loadMoreBtn.className = 'load-more-container';
            loadMoreBtn.innerHTML = `
                <button class="load-more-btn" onclick="app.toggleShowMore()">
                    Ver más productos
                </button>
            `;
            this.productsGrid.parentNode.insertBefore(loadMoreBtn, this.productsGrid.nextSibling);
        } else {
            const existingBtn = this.productsGrid.parentNode.querySelector('.load-more-container');
            if (existingBtn) existingBtn.remove();
        }
    }

    toggleShowMore() {
        this.showAllProducts = !this.showAllProducts;
        this.renderProducts();
    }

    formatPrice(price) {
        return new Intl.NumberFormat('es-CL').format(price);
    }

    // ====== CARRITO ======
    loadCart() {
        const saved = localStorage.getItem('ecommerce_cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('ecommerce_cart', JSON.stringify(this.cart));
        this.updateCartUI();
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product || product.stock === 0) {
            this.showToast('Producto no disponible', 'error');
            return;
        }

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                this.showToast('No hay más stock disponible', 'warning');
                return;
            }
            existingItem.quantity++;
        } else {
            this.cart.push({
                id: productId,
                nombre: product.nombre,
                precio: product.precio,
                imagen_url: product.imagen_url,
                quantity: 1,
                stock: product.stock
            });
        }

        this.saveCart();
        this.showToast('Producto agregado al carrito', 'success');
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCartItems();
        this.showToast('Producto eliminado del carrito', 'success');
    }

    updateCartItemQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        const newQuantity = item.quantity + change;
        
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }
        
        if (newQuantity > item.stock) {
            this.showToast('No hay más stock disponible', 'warning');
            return;
        }

        item.quantity = newQuantity;
        this.saveCart();
        this.renderCartItems();
    }

    updateCartUI() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        this.cartCount.textContent = totalItems;
        this.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    openCartModal() {
        this.renderCartItems();
        this.openModal('cartModal');
    }

    renderCartItems() {
        if (this.cart.length === 0) {
            this.cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega algunos productos para comenzar</p>
                </div>
            `;
            this.cartTotal.textContent = '0';
            return;
        }

        this.cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.imagen_url}" alt="${item.nombre}" class="cart-item-image"
                     onerror="this.src='https://via.placeholder.com/60x60?text=Sin+Imagen'">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.nombre}</div>
                    <div class="cart-item-price">${this.formatPrice(item.precio)}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="app.updateCartItemQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="app.updateCartItemQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="remove-item" onclick="app.removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </div>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
        this.cartTotal.textContent = this.formatPrice(total);
    }

    clearCart() {
        if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            this.cart = [];
            this.saveCart();
            this.renderCartItems();
            this.showToast('Carrito vaciado', 'success');
        }
    }

    // ====== CHECKOUT ======
    openCheckoutModal() {
        if (this.cart.length === 0) {
            this.showToast('Tu carrito está vacío', 'warning');
            return;
        }

        this.renderCheckoutSummary();
        this.closeModal('cartModal');
        this.openModal('checkoutModal');
    }

    renderCheckoutSummary() {
        this.checkoutSummary.innerHTML = this.cart.map(item => `
            <div class="checkout-item">
                <span>${item.nombre} x ${item.quantity}</span>
                <span>${this.formatPrice(item.precio * item.quantity)}</span>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
        this.checkoutTotal.textContent = this.formatPrice(total);
    }

    async processOrder() {
        const formData = new FormData(this.checkoutForm);
        
        if (!formData.get('nombre') || !formData.get('email')) {
            this.showToast('Por favor completa los campos obligatorios', 'error');
            return;
        }

        const confirmBtn = document.getElementById('confirmOrder');
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        confirmBtn.disabled = true;

        try {
            const orderData = {
                items: this.cart.map(item => ({
                    producto_id: item.id,
                    cantidad: item.quantity
                })),
                usuario: {
                    nombre: formData.get('nombre'),
                    email: formData.get('email'),
                    telefono: formData.get('telefono'),
                    direccion: formData.get('direccion')
                }
            };

            const orderResponse = await fetch('/api/ordenes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const orderResult = await orderResponse.json();

            if (!orderResult.success) {
                throw new Error(orderResult.error);
            }

            const paymentResponse = await fetch('/api/flow/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ordenId: orderResult.orden.id })
            });

            const paymentResult = await paymentResponse.json();

            if (!paymentResult.success) {
                throw new Error(paymentResult.error);
            }

            window.location.href = paymentResult.paymentURL;

        } catch (error) {
            console.error('Error procesando orden:', error);
            this.showToast('Error al procesar la orden: ' + error.message, 'error');
        } finally {
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
        }
    }

    // ====== MODALES ======
    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // ====== PAGO ======
    checkPaymentResult() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
            this.showPaymentResult(token);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    async showPaymentResult(token) {
        try {
            const response = await fetch(`/api/flow/status/${token}`);
            const result = await response.json();
            
            if (result.success && result.flowStatus) {
                const status = result.flowStatus.status;
                const paymentData = result.flowStatus;
                
                if (status === 2) {
                    this.paymentResultTitle.innerHTML = '<i class="fas fa-check-circle" style="color: #059669;"></i> ¡Pago Exitoso!';
                    this.paymentResultContent.innerHTML = `
                        <div style="text-align: center; padding: 2rem;">
                            <h3 style="color: #059669; margin-bottom: 1rem;">¡Tu compra fue procesada exitosamente!</h3>
                            <p><strong>Número de orden:</strong> ${paymentData.commerceOrder}</p>
                            <p><strong>Total pagado:</strong> ${this.formatPrice(paymentData.amount)}</p>
                            <p><strong>Fecha:</strong> ${new Date(paymentData.paymentDate).toLocaleString()}</p>
                            <div style="margin-top: 2rem; padding: 1rem; background: #f0fdf4; border-radius: 8px;">
                                <p style="color: #166534;">Recibirás un email de confirmación con los detalles de tu pedido.</p>
                            </div>
                        </div>
                    `;
                } else if (status === 3) {
                    this.paymentResultTitle.innerHTML = '<i class="fas fa-times-circle" style="color: #dc2626;"></i> Pago Rechazado';
                    this.paymentResultContent.innerHTML = `
                        <div style="text-align: center; padding: 2rem;">
                            <h3 style="color: #dc2626; margin-bottom: 1rem;">Tu pago no pudo ser procesado</h3>
                            <p>El pago fue rechazado por el banco o medio de pago.</p>
                            <p><strong>Número de orden:</strong> ${paymentData.commerceOrder}</p>
                            <div style="margin-top: 2rem; padding: 1rem; background: #fef2f2; border-radius: 8px;">
                                <p style="color: #991b1b;">Puedes intentar nuevamente con otro medio de pago.</p>
                            </div>
                        </div>
                    `;
                } else {
                    this.paymentResultTitle.innerHTML = '<i class="fas fa-clock" style="color: #d97706;"></i> Pago Pendiente';
                    this.paymentResultContent.innerHTML = `
                        <div style="text-align: center; padding: 2rem;">
                            <h3 style="color: #d97706; margin-bottom: 1rem;">Tu pago está siendo procesado</h3>
                            <p>El pago está pendiente de confirmación.</p>
                            <p><strong>Número de orden:</strong> ${paymentData.commerceOrder}</p>
                            <div style="margin-top: 2rem; padding: 1rem; background: #fffbeb; border-radius: 8px;">
                                <p style="color: #92400e;">Te notificaremos cuando el pago sea confirmado.</p>
                            </div>
                        </div>
                    `;
                }
                
                this.openModal('paymentResultModal');
            }
        } catch (error) {
            console.error('Error obteniendo resultado del pago:', error);
        }
    }

    // ====== NOTIFICACIONES ======
    showToast(message, type = 'success') {
        this.toastMessage.textContent = message;
        this.toast.className = `toast ${type}`;
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EcommerceApp();
});

// Página de resultado de pago
if (window.location.pathname === '/payment-result') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new EcommerceApp();
        app.checkPaymentResult();
    });
}




















































// Datos del slider
const heroSlides = [
    {
        title: "Descubre el Auténtico Sabor del Café",
        subtitle: "Granos seleccionados, tostados a la perfección para los verdaderos amantes del café"
    },
    {
        title: "Café Premium de Origen Único",
        subtitle: "Cada taza cuenta una historia. Experimenta sabores únicos de las mejores regiones del mundo"
    },
    {
        title: "Tostado Artesanal con Pasión",
        subtitle: "Proceso cuidadoso desde la selección hasta tu taza. Calidad garantizada en cada grano"
    },
    {
        title: "Vive la Experiencia del Café Puro",
        subtitle: "Descubre por qué somos la opción favorita de verdaderos amantes del café"
    }
];

let currentSlide = 0;

// Inicializar slider
function initHeroSlider() {
    const heroContent = document.querySelector('.hero-content');
    
    setInterval(() => {
        currentSlide = (currentSlide + 1) % heroSlides.length;
        updateHeroSlide(heroContent);
    }, 2500);
}



function updateHeroSlide(heroContent) {
    const slide = heroSlides[currentSlide];
    const heroTitle = heroContent.querySelector('.hero-title');
    const heroSubtitle = heroContent.querySelector('.hero-subtitle');
    
    heroTitle.style.opacity = '0';
    heroSubtitle.style.opacity = '0';
    
    setTimeout(() => {
        heroTitle.textContent = slide.title;
        heroSubtitle.textContent = slide.subtitle;
        heroTitle.style.opacity = '1';
        heroSubtitle.style.opacity = '1';
    }, 300);
}

// Agregar CSS de transición suave al hero content

function addHeroSlideStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .hero-content .hero-title,
        .hero-content .hero-subtitle {
            transition: opacity 0.3s ease-in-out;
        }
    `;
    document.head.appendChild(style);
}

// Crear Footer

function createFooter()  {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3><i class="fas fa-coffee"></i> AromasCafé</h3>
                    <p>Tu tienda especializada en café de alta calidad. Granos seleccionados de las mejores regiones del mundo.</p>
                </div>
                
                <div class="footer-section">
                    <h4>Enlaces Rápidos</h4>
                    <ul>
                        <li><a href="#"><i class="fas fa-chevron-right"></i> Sobre Nosotros</a></li>
                        <li><a href="#"><i class="fas fa-chevron-right"></i> Productos</a></li>
                        <li><a href="#"><i class="fas fa-chevron-right"></i> Blog</a></li>
                        <li><a href="#"><i class="fas fa-chevron-right"></i> Contacto</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Información</h4>
                    <ul>
                        <li><a href="#"><i class="fas fa-chevron-right"></i> Política de Privacidad</a></li>
                        <li><a href="#"><i class="fas fa-chevron-right"></i> Términos de Servicio</a></li>
                        <li><a href="#"><i class="fas fa-chevron-right"></i> Devoluciones</a></li>
                        <li><a href="#"><i class="fas fa-chevron-right"></i> Envíos</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Síguenos</h4>
                    <div class="social-links">
                        <a href="#" class="social-link" title="Facebook"><i class="fab fa-facebook"></i></a>
                        <a href="#" class="social-link" title="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="social-link" title="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="social-link" title="Pinterest"><i class="fab fa-pinterest"></i></a>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2024 AromasCafé. Todos los derechos reservados. | Hecho con <i class="fas fa-heart"></i> para los amantes del café</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(footer);
}

// Agregar estilos del footer

function addFooterStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Footer Styles */
        .footer {
            background: linear-gradient(135deg, var(--cafe-pastel) 0%, rgba(215, 204, 200, 1) 100%);
            color: var(--texto-claro);
            padding: 3rem 0 1rem;
            margin-top: 4rem;
            border-top: 3px solid var(--cafe-pastel);
        }

        [data-theme="dark"] .footer {
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
        }

        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .footer-section h3 {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .footer-section h4 {
            font-family: 'Playfair Display', serif;
            font-size: 1.1rem;
            margin-bottom: 1rem;
            color: var(--texto-claro);
        }

        .footer-section p {
            font-size: 0.95rem;
            line-height: 1.6;
            opacity: 0.9;
        }

        .footer-section ul {
            list-style: none;
            padding: 0;
        }

        .footer-section li {
            margin-bottom: 0.75rem;
        }

        .footer-section a {
            color: var(--texto-claro);
            text-decoration: none;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            opacity: 0.85;
        }

        .footer-section a:hover {
            opacity: 1;
            transform: translateX(5px);
        }

        .social-links {
            display: flex;
            gap: 1rem;
        }

        .social-link {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            transition: all 0.3s ease;
            font-size: 1.2rem;
        }

        .social-link:hover {
            background: var(--amarillo-pastel);
            color: var(--texto-claro);
            transform: translateY(-3px);
        }

        .footer-bottom {
            text-align: center;
            padding-top: 2rem;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            font-size: 0.9rem;
            opacity: 0.85;
        }

        .footer-bottom i {
            color: #dc2626;
        }

        @media (max-width: 768px) {
            .footer {
                padding: 2rem 0 1rem;
                margin-top: 2rem;
            }

            .footer-content {
                gap: 1.5rem;
            }

            .footer-section h3 {
                font-size: 1.3rem;
            }
        }
    `;
    document.head.appendChild(style);
}


// === SOLO AGREGA ESTO AL FINAL DE TU app.js ===

// Agregar estilos del footer
addFooterStyles();

// Crear el footer
createFooter();

// Agregar estilos del slider
addHeroSlideStyles();

// Inicializar el slider
initHeroSlider();