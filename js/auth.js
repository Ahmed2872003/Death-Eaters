/* --- AUTH LOGIC --- */
window.app = window.app || {};

window.app.login = (username, password) => {
  if (
    username === window.DB.adminUser.username &&
    password === window.DB.adminUser.password
  ) {
    const savedAdminData = JSON.parse(
      localStorage.getItem("de_admin_data")
    ) || { cart: [], orders: [] };
    window.DB.currentUser = {
      ...window.DB.adminUser,
      cart: savedAdminData.cart || [],
      orders: savedAdminData.orders || [],
    };
    window.saveState();
    window.app.init();
    return;
  }
  const user = window.DB.users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    window.DB.currentUser = user;
    if (!window.DB.currentUser.cart) window.DB.currentUser.cart = [];
    if (!window.DB.currentUser.orders) window.DB.currentUser.orders = [];
    window.saveState();
    window.app.init();
  } else {
    alert("Invalid credentials!");
  }
};

window.app.register = (username, email, password) => {
  if (
    window.DB.users.find((u) => u.username === username) ||
    username === "admin"
  ) {
    alert("Username already taken.");
    return;
  }
  const newUser = {
    username,
    email,
    password,
    role: "user",
    cart: [],
    orders: [],
  };
  window.DB.users.push(newUser);
  window.saveState();
  alert("Registration successful! Please login.");
  window.app.navigate("login");
};

window.app.renderLogin = () => {
  document.getElementById("mainContent").innerHTML = `
        <div class="auth-container">
            <h2 class="auth-title">Login</h2>
            <form onsubmit="event.preventDefault(); window.app.login(this.username.value, this.password.value)">
                <div class="form-group"><label>Username</label><input type="text" name="username" required placeholder="admin or username"></div>
                <div class="form-group"><label>Password</label><input type="password" name="password" required placeholder="12345 or password"></div>
                <button type="submit" class="btn btn-primary" style="width:100%">Login</button>
            </form>
            <div class="auth-footer">Don't have an account? <a onclick="window.app.navigate('register')">Register here</a></div>
        </div>`;
};

window.app.renderRegister = () => {
  document.getElementById("mainContent").innerHTML = `
        <div class="auth-container">
            <h2 class="auth-title">Register</h2>
            <form onsubmit="event.preventDefault(); window.app.register(this.username.value, this.email.value, this.password.value)">
                <div class="form-group"><label>Username</label><input type="text" name="username" required></div>
                <div class="form-group"><label>Email</label><input type="email" name="email" required></div>
                <div class="form-group"><label>Password</label><input type="password" name="password" required></div>
                <button type="submit" class="btn btn-primary" style="width:100%">Create Account</button>
            </form>
            <div class="auth-footer">Already have an account? <a onclick="window.app.navigate('login')">Login here</a></div>
        </div>`;
};
