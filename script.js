let cart = JSON.parse(localStorage.getItem('voyage_cart')) || [];
renderCart();

function openBooking(packageName) {
    document.getElementById('selectedPackage').value = packageName;
    const modal = new bootstrap.Modal(document.getElementById('contactModal'));
    modal.show();
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    saveAndRender();
    const drawer = new bootstrap.Offcanvas(document.getElementById('cartDrawer'));
    drawer.show();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('voyage_cart', JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartCountEl = document.getElementById('cartCount');

    cartItemsEl.innerHTML = '';
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="text-muted text-center my-5">ยังไม่มีแพ็กเกจในตะกร้า</p>';
    } else {
        cart.forEach((item, index) => {
            total += item.price * item.qty;
            count += item.qty;
            cartItemsEl.innerHTML += `
                <div class="d-flex justify-content-between align-items-center border-bottom py-3">
                    <div>
                        <h6 class="mb-1 fw-bold">${item.name}</h6>
                        <small class="text-muted">฿${item.price.toLocaleString()} x ${item.qty}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-danger rounded-circle" onclick="removeFromCart(${index})">✕</button>
                </div>
            `;
        });
    }

    cartTotalEl.innerText = `฿${total.toLocaleString()}`;
    cartCountEl.innerText = count;
}

function checkoutCart() {
    if (cart.length === 0) return alert('กรุณาเลือกแพ็กเกจลงตะกร้าก่อนครับ');
    const summary = cart.map(i => `${i.name} (x${i.qty})`).join(', ');
    bootstrap.Offcanvas.getInstance(document.getElementById('cartDrawer')).hide();
    openBooking(summary);
}

document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('บันทึกการจองสำเร็จ! เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด');
    bootstrap.Modal.getInstance(document.getElementById('contactModal')).hide();
    cart = [];
    saveAndRender();
    this.reset();
});