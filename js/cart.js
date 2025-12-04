/* --- CART LOGIC --- */
window.app = window.app || {};

window.app.removeFromCart = (gameId) => {
  window.DB.currentUser.cart = window.DB.currentUser.cart.filter(
    (i) => i.id !== gameId
  );
  window.saveState();
  window.app.renderCart();
  window.app.updateNav();
};

window.app.renderCart = () => {
  const cart = window.DB.currentUser.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (cart.length === 0) {
    document.getElementById(
      "mainContent"
    ).innerHTML = `<div style="text-align:center; margin-top:3rem;">Your cart is empty.<br><br><button class="btn btn-outline" onclick="window.app.navigate('home')">Go Shop</button></div>`;
    return;
  }
  document.getElementById("mainContent").innerHTML = `
        <div class="cart-layout">
            <div class="cart-list">
                ${cart
                  .map(
                    (item) => `
                    <div class="cart-item">
                        <img src="${
                          item.img
                        }" onerror="this.src='https://via.placeholder.com/80'">
                        <div class="cart-details"><h3>${
                          item.name
                        }</h3><div style="color:var(--primary)">$${item.price.toFixed(
                      2
                    )}</div></div>
                        <button class="btn btn-danger btn-sm" onclick="window.app.removeFromCart(${
                          item.id
                        })"><i class="fas fa-trash"></i></button>
                    </div>`
                  )
                  .join("")}
            </div>
            <div class="cart-summary">
                <h3>Summary</h3>
                <div class="summary-row"><span>Subtotal</span><span>$${total.toFixed(
                  2
                )}</span></div>
                <div class="summary-row"><span>Tax (5%)</span><span>$${(
                  total * 0.05
                ).toFixed(2)}</span></div>
                <div class="summary-row total-row"><span>Total</span><span>$${(
                  total * 1.05
                ).toFixed(2)}</span></div>
                <button class="btn btn-primary" style="width:100%; margin-top:1rem;" onclick="window.app.renderCheckout(${
                  total * 1.05
                })">Proceed to Checkout</button>
            </div>
        </div>`;
};

window.app.renderCheckout = (total) => {
  const modal = document.createElement("div");
  modal.id = "checkoutModal";
  modal.className = "modal";
  modal.innerHTML = `
        <div class="modal-content">
            <h2 style="font-family:var(--font-head); color:var(--primary); margin-bottom:1rem;">Secure Payment</h2>
            <form onsubmit="event.preventDefault(); window.app.processPayment({card: this.card.value, total: '${total.toFixed(
              2
            )}'})">
                <div class="form-group"><label>Cardholder Name</label><input type="text" required></div>
                <div class="form-group"><label>Card Number</label><input type="text" name="card" maxlength="19" required></div>
                <div style="display:flex; gap:10px;"><div class="form-group" style="flex:1"><label>Expiry</label><input type="text" required></div><div class="form-group" style="flex:1"><label>CVV</label><input type="password" required></div></div>
                <div class="total-row" style="margin-bottom:1rem; text-align:right;">Pay $${total.toFixed(
                  2
                )}</div>
                <div style="display:flex; gap:10px;"><button type="button" class="btn btn-outline" style="flex:1" onclick="document.getElementById('checkoutModal').remove()">Cancel</button><button type="submit" class="btn btn-primary" style="flex:1">Pay Now</button></div>
            </form>
        </div>`;
  document.body.appendChild(modal);
};
