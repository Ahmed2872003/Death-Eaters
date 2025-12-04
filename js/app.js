/* --- 2. CORE APPLICATION LOGIC --- */
window.app = window.app || {};

window.app.view = "home";

window.app.init = () => {
  window.app.updateNav();
  window.app.navigate(window.DB.currentUser ? "home" : "login");
};

window.app.navigate = (viewName) => {
  window.app.view = viewName;
  const main = document.getElementById("mainContent");
  main.innerHTML = "";

  switch (viewName) {
    case "login":
      if (window.app.renderLogin) window.app.renderLogin();
      break;
    case "register":
      if (window.app.renderRegister) window.app.renderRegister();
      break;
    case "home":
      if (window.app.renderHome) window.app.renderHome();
      break;
    case "cart":
      if (window.app.renderCart) window.app.renderCart();
      break;
    case "orders":
      if (window.app.renderOrders) window.app.renderOrders();
      break;
    case "admin":
      if (window.app.renderAdmin) window.app.renderAdmin("users");
      break;
    default:
      if (window.app.renderHome) window.app.renderHome();
  }
  window.app.updateNav();
};

window.app.updateNav = () => {
  const nav = document.getElementById("navLinks");
  if (!window.DB.currentUser) {
    nav.innerHTML = `
            <div class="nav-item" onclick="window.app.navigate('login')">Login</div>
            <div class="nav-item" onclick="window.app.navigate('register')">Register</div>
        `;
  } else {
    const cartCount = window.DB.currentUser.cart
      ? window.DB.currentUser.cart.length
      : 0;
    let html = `
            <div class="nav-item" onclick="window.app.navigate('home')"><i class="fas fa-home"></i> Store</div>
            <div class="nav-item" onclick="window.app.navigate('cart')">
                <i class="fas fa-shopping-cart"></i> Cart <span class="badge">${cartCount}</span>
            </div>
            <div class="nav-item" onclick="window.app.navigate('orders')"><i class="fas fa-box"></i> My Orders</div>
        `;

    if (window.DB.currentUser.role === "admin") {
      html += `<div class="nav-item" onclick="window.app.navigate('admin')"><i class="fas fa-shield-alt"></i> Admin Panel</div>`;
    }

    html += `
            <div class="nav-item" onclick="window.app.logout()">
                <i class="fas fa-sign-out-alt"></i> Logout (${window.DB.currentUser.username})
            </div>
        `;
    nav.innerHTML = html;
  }
};

window.app.logout = () => {
  window.DB.currentUser = null;
  window.saveState();
  window.app.init();
};
