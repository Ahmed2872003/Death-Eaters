/* --- ADMIN LOGIC --- */
window.app = window.app || {};

window.app.deleteUser = (username) => {
  if (!confirm("Delete this user?")) return;
  window.DB.users = window.DB.users.filter((u) => u.username !== username);
  window.saveState();
  window.app.renderAdmin("users");
};

window.app.addGame = (gameData) => {
  gameData.id = Date.now();
  window.DB.games.push(gameData);
  window.saveState();
  window.app.renderAdmin("games");
};

window.app.deleteGame = (id) => {
  if (!confirm("Delete this game?")) return;

  // Remove from games
  window.DB.games = window.DB.games.filter((g) => g.id !== id);

  // Remove from all users carts
  window.DB.users.forEach((user) => {
    if (user.cart) user.cart = user.cart.filter((item) => item.id !== id);
  });

  // Remove from current user cart
  if (window.DB.currentUser && window.DB.currentUser.cart) {
    window.DB.currentUser.cart = window.DB.currentUser.cart.filter(
      (item) => item.id !== id
    );
  }

  window.saveState();
  window.app.renderAdmin("games");
};

window.app.renderAdmin = (tab) => {
  if (window.DB.currentUser.role !== "admin")
    return window.app.navigate("home");
  const main = document.getElementById("mainContent");
  let content = "";

  if (tab === "users") {
    content = `
            <table class="data-table"><thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Action</th></tr></thead><tbody>
                ${window.DB.users
                  .map(
                    (u) =>
                      `<tr><td>${u.username}</td><td>${
                        u.email || "-"
                      }</td><td>${
                        u.role
                      }</td><td><button class="btn btn-danger btn-sm" onclick="window.app.deleteUser('${
                        u.username
                      }')">Delete</button></td></tr>`
                  )
                  .join("")}
            </tbody></table>`;
  } else if (tab === "games") {
    content = `
            <div style="background:var(--bg-input); padding:1rem; border-radius:4px; margin-bottom:1rem;">
                <h4 style="margin-bottom:10px;">Add New Game</h4>
                <form id="addGameForm" style="display:flex; gap:10px; flex-wrap:wrap;">
                    <input type="text" id="gname" placeholder="Game Name" required style="flex:1">
                    <input type="text" id="gcat" placeholder="Category" required style="width:150px">
                    <input type="number" id="gprice" placeholder="Price" step="0.01" required style="width:100px">
                    <input type="file" id="gimg" accept="image/*" style="width:200px">
                    <button type="submit" class="btn btn-primary btn-sm">Add</button>
                </form>
            </div>
            <div class="games-grid">
                ${window.DB.games
                  .map(
                    (g) =>
                      `<div class="game-card" style="flex-direction:row; height:100px;"><img src="${g.img}" style="width:100px; object-fit:cover;"><div style="padding:10px; flex:1"><div style="font-weight:bold">${g.name}</div><div style="color:var(--text-muted)">${g.category} - $${g.price}</div></div><button class="btn btn-danger" style="border-radius:0;" onclick="window.app.deleteGame(${g.id})"><i class="fas fa-trash"></i></button></div>`
                  )
                  .join("")}
            </div>`;
  }

  main.innerHTML = `
        <div class="admin-header"><h1>Admin Dashboard</h1><div>Welcome, Admin</div></div>
        <div class="admin-nav"><div class="admin-tab ${
          tab === "users" ? "active" : ""
        }" onclick="window.app.renderAdmin('users')">Manage Users</div><div class="admin-tab ${
    tab === "games" ? "active" : ""
  }" onclick="window.app.renderAdmin('games')">Manage Games</div></div>
        ${content}`;

  const form = document.getElementById("addGameForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("gname").value;
      const cat = document.getElementById("gcat").value;
      const price = parseFloat(document.getElementById("gprice").value);
      const fileInput = document.getElementById("gimg");
      const add = (img) =>
        window.app.addGame({ name, category: cat, price, img });

      if (fileInput.files[0]) {
        const file = fileInput.files[0];

        // --- NEW: Limit File Size to 500KB ---
        const maxSize = 500 * 1024; // 500KB in bytes
        if (file.size > maxSize) {
          alert("Image is too large! Please select an image under 500KB.");
          return;
        }
        // -------------------------------------

        const reader = new FileReader();
        reader.onload = (e) => add(e.target.result);
        reader.readAsDataURL(file);
      } else add(`https://via.placeholder.com/300?text=${name}`);
    });
  }
};
