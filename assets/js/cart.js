class ShopCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('just_pharma_cart')) || [];
        this.total = 0;
        this.init();
    }

    init() {
        this.renderFloatingButton();
        this.renderModal();
        this.updateTotal();
        this.attachEventListeners();
    }

    addItem(product) {
        const existing = this.items.find(i => i.id === product.id);
        if (existing) {
            existing.qty++;
        } else {
            this.items.push({ ...product, qty: 1 });
        }
        this.save();
        this.updateUI();
        this.showToast(`Added ${product.name} to Quote`);
    }

    removeItem(id) {
        this.items = this.items.filter(i => i.id !== id);
        this.save();
        this.updateUI();
    }

    updateQty(id, delta) {
        const item = this.items.find(i => i.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) this.removeItem(id);
            else this.save();
        }
        this.updateUI();
    }

    save() {
        localStorage.setItem('just_pharma_cart', JSON.stringify(this.items));
        this.updateTotal();
    }

    updateTotal() {
        // In quote mode, we might not show total, or show 'Estimated Total'
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    updateUI() {
        // Update badge
        const badge = document.getElementById('cart-badge');
        const count = this.items.reduce((sum, i) => sum + i.qty, 0);
        if (badge) {
            badge.innerText = count;
            badge.classList.toggle('hidden', count === 0);
        }

        // Render items in modal
        const container = document.getElementById('cart-items-container');
        if (container) {
            container.innerHTML = this.items.map(item => `
                <div class="flex items-center gap-4 bg-gray-50 p-3 rounded-xl mb-3">
                    <div class="flex-1">
                        <h4 class="font-bold text-sm text-spira-black">${item.name}</h4>
                        <p class="text-xs text-gray-500">Est. $${item.price.toFixed(2)} unit</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <button onclick="cart.updateQty('${item.id}', -1)" class="w-6 h-6 rounded-full bg-white border flex items-center justify-center hover:bg-gray-100">-</button>
                        <span class="text-sm font-bold w-4 text-center">${item.qty}</span>
                        <button onclick="cart.updateQty('${item.id}', 1)" class="w-6 h-6 rounded-full bg-white border flex items-center justify-center hover:bg-gray-100">+</button>
                    </div>
                    <div class="font-bold text-spira-black w-16 text-right">$${(item.price * item.qty).toFixed(2)}</div>
                </div>
            `).join('') || '<p class="text-center text-gray-400 py-8">Your quote list is empty</p>';

            // document.getElementById('cart-total-display').innerText = '$' + this.total.toFixed(2);
        }
    }

    renderFloatingButton() {
        const btn = document.createElement('div');
        btn.innerHTML = `
            <button onclick="document.getElementById('cart-modal').classList.remove('hidden')" class="fixed bottom-8 right-8 bg-spira-green text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform">
                <i data-lucide="clipboard-list" class="w-7 h-7"></i>
                <span id="cart-badge" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white hidden">0</span>
            </button>
        `;
        document.body.appendChild(btn);

        // Re-init icons for the new button
        if (window.lucide) lucide.createIcons();
    }

    renderModal() {
        const modal = document.createElement('div');
        modal.id = 'cart-modal';
        modal.className = 'fixed inset-0 z-[60] hidden';
        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" onclick="document.getElementById('cart-modal').classList.add('hidden')"></div>
            <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-6 flex flex-col transform transition-transform duration-300">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-spira-black">Quote Request</h2>
                    <button onclick="document.getElementById('cart-modal').classList.add('hidden')" class="p-2 hover:bg-gray-100 rounded-full">
                        <i data-lucide="x" class="w-6 h-6 text-gray-400"></i>
                    </button>
                </div>

                <!-- Items -->
                <div class="flex-1 overflow-y-auto" id="cart-items-container"></div>

                <!-- Footer -->
                <div class="border-t border-gray-100 pt-6 mt-4">
                    <button onclick="cart.startCheckout()" class="w-full bg-spira-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-spira-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Proceed to Details
                    </button>
                </div>
            </div>

            <!-- Checkout Modal Overlay -->
            <div id="checkout-form-modal" class="absolute inset-0 z-[70] bg-white hidden flex-col">
                <div class="p-6 border-b border-gray-100 flex items-center gap-4">
                    <button onclick="document.getElementById('checkout-form-modal').classList.add('hidden')" class="p-2 hover:bg-gray-100 rounded-full">
                        <i data-lucide="arrow-left" class="w-6 h-6"></i>
                    </button>
                    <h2 class="text-xl font-bold">Request Quotation</h2>
                </div>
                
                <div class="flex-1 overflow-y-auto p-6">
                    <div class="mb-8">
                        <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Business Details</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Pharmacy / Clinic Name</label>
                                <input type="text" id="quote-business" class="w-full border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-spira-green focus:border-transparent outline-none bg-gray-50" placeholder="e.g. City Health Pharmacy">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                                <input type="text" id="quote-name" class="w-full border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-spira-green focus:border-transparent outline-none bg-gray-50" placeholder="Full Name">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input type="email" id="quote-email" class="w-full border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-spira-green focus:border-transparent outline-none bg-gray-50" placeholder="purchasing@example.com">
                            </div>
                             <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">MCAZ License Number (Optional)</label>
                                <input type="text" id="quote-license" class="w-full border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-spira-green focus:border-transparent outline-none bg-gray-50" placeholder="License #">
                            </div>
                        </div>
                    </div>

                    <div class="mb-8">
                         <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Additional Notes</h3>
                         <textarea id="quote-notes" rows="3" class="w-full border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-spira-green focus:border-transparent outline-none bg-gray-50" placeholder="Any specific requirements or delivery instructions..."></textarea>
                    </div>
                </div>

                <div class="p-6 border-t border-gray-100 bg-gray-50">
                    <button id="pay-btn" onclick="cart.submitQuote()" class="w-full bg-spira-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-spira-green transition-colors shadow-lg shadow-gray-200">
                        Submit Request
                    </button>
                    <p class="text-center text-xs text-gray-400 mt-4">
                        A proforma invoice will be sent to your email within 2 hours.
                    </p>
                </div>
                
                <!-- Success Overlay -->
                <div id="success-overlay" class="absolute inset-0 bg-[#E8F2EE] z-[90] hidden flex-col items-center justify-center text-center p-8">
                     <div class="w-24 h-24 bg-spira-green rounded-full flex items-center justify-center mb-6 shadow-xl text-white animate-bounce">
                        <i data-lucide="check" class="w-12 h-12"></i>
                    </div>
                    <h3 class="text-3xl font-bold mb-2 text-spira-black">Request Sent!</h3>
                    <p id="success-msg" class="text-gray-500 mb-8 max-w-sm mx-auto">Your account manager has received your quote request.</p>
                    
                    <div class="bg-white p-6 rounded-2xl shadow-sm w-full max-w-sm mb-8">
                        <div class="flex justify-between mb-2">
                             <span class="text-gray-400 text-sm">Reference</span>
                             <span class="font-mono font-bold">#QT-${Math.floor(Math.random() * 10000)}</span>
                        </div>
                        <div class="flex justify-between">
                             <span class="text-gray-400 text-sm">Status</span>
                             <span class="font-bold text-spira-green">Pending Review</span>
                        </div>
                    </div>
                    
                    <button onclick="location.reload()" class="bg-spira-black text-white px-8 py-3 rounded-full font-bold uppercase text-sm">Return to Catalog</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        if (window.lucide) lucide.createIcons();
    }

    startCheckout() {
        if (this.items.length === 0) return;
        document.getElementById('checkout-form-modal').classList.remove('hidden');
        document.getElementById('checkout-form-modal').classList.add('flex');
    }

    submitQuote() {
        const business = document.getElementById('quote-business').value;
        const name = document.getElementById('quote-name').value;
        const email = document.getElementById('quote-email').value;

        if (!business || !name || !email) {
            alert('Please fill in the required fields');
            return;
        }

        // Show Success
        const success = document.getElementById('success-overlay');
        success.classList.remove('hidden');
        success.classList.add('flex');

        // Clear Cart
        this.items = [];
        this.save();
        this.updateUI();
    }

    showToast(msg) {
        // Simple toast implementation
        const toast = document.createElement('div');
        toast.className = 'fixed top-6 left-1/2 -translate-x-1/2 bg-spira-black text-white px-6 py-3 rounded-full shadow-xl z-[100] text-sm font-bold animate-pulse';
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    attachEventListeners() {
        // Find existing buttons and attach logic if they have data-attributes
        // ... handled dynamically in updateUI or inline onclicks
    }
}

// Initialize Global Cart
window.cart = new ShopCart();
