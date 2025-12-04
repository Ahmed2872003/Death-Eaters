/* --- ORDERS LOGIC --- */
window.app = window.app || {};

window.app.processPayment = (details) => {
  const newOrder = {
    id: "ORD-" + Date.now(),
    date:
      new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),
    items: [...window.DB.currentUser.cart],
    total: details.total,
    card: details.card.slice(-4),
  };

  if (!window.DB.currentUser.orders) window.DB.currentUser.orders = [];
  window.DB.currentUser.orders.unshift(newOrder);
  window.DB.currentUser.cart = [];

  window.saveState();

  alert(`Payment Successful! \nOrder ID: ${newOrder.id}`);
  const modal = document.getElementById("checkoutModal");
  if (modal) modal.remove();
  window.app.navigate("orders");
};

window.app.renderOrders = () => {
  const orders = window.DB.currentUser.orders || [];
  let html = `<h1>My Order History</h1>`;
  if (orders.length === 0)
    html += `<div style="text-align:center; margin-top:3rem;">No orders yet.</div>`;
  else {
    html += `<div style="margin-top:2rem;">`;
    orders.forEach((order) => {
      html += `
                <div class="order-card">
                    <div class="order-header"><div><div class="order-id">${
                      order.id
                    }</div><div class="order-date">${
        order.date
      }</div></div><div style="font-weight:bold; color:var(--primary);">$${parseFloat(
        order.total
      ).toFixed(2)}</div></div>
                    <div class="order-items">${order.items
                      .map(
                        (i) =>
                          `<div class="order-item-row"><span>${
                            i.name
                          }</span><span style="color:var(--text-muted)">$${i.price.toFixed(
                            2
                          )}</span></div>`
                      )
                      .join("")}</div>
                </div>`;
    });
    html += `</div>`;
  }
  document.getElementById("mainContent").innerHTML = html;
};
