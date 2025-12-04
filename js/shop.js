/* --- SHOP LOGIC --- */
window.app = window.app || {};

window.app.addToCart = (gameId) => {
  if (!window.DB.currentUser) return window.app.navigate("login");

  // 1. Check if already owned (in previous orders)
  const orders = window.DB.currentUser.orders || [];
  const isOwned = orders.some((order) =>
    order.items.some((item) => item.id === gameId)
  );

  if (isOwned) {
    alert("You already own this game! Check your Library.");
    return;
  }

  const game = window.DB.games.find((g) => g.id === gameId);
  const existing = window.DB.currentUser.cart.find(
    (item) => item.id === gameId
  );

  if (existing) {
    alert("Item already in cart!");
  } else {
    window.DB.currentUser.cart.push(game);
    window.saveState();
    window.app.updateNav();
    alert(`${game.name} added to cart!`);
  }
};

window.app.renderHome = () => {
  const categories = [
    "all",
    ...new Set(window.DB.games.map((g) => g.category)),
  ];

  document.getElementById("mainContent").innerHTML = `
        <div class="shop-controls">
            <input type="text" class="search-bar" placeholder="Search games..." id="searchInput" oninput="window.app.filterGames()">
            <select style="width: auto;" id="catInput" onchange="window.app.filterGames()">
                <option value="all">All Categories</option>
                ${categories
                  .filter((c) => c !== "all")
                  .map((cat) => `<option value="${cat}">${cat}</option>`)
                  .join("")}
            </select>
        </div>
        <div class="games-grid" id="gamesGrid"></div>`;
  window.app.filterGames();
};

window.app.filterGames = () => {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const cat = document.getElementById("catInput").value;
  const filtered = window.DB.games.filter((g) => {
    return (
      g.name.toLowerCase().includes(search) &&
      (cat === "all" || g.category === cat)
    );
  });
  const grid = document.getElementById("gamesGrid");

  if (filtered.length === 0) {
    grid.innerHTML =
      '<div style="grid-column: 1/-1; text-align:center;">No games found.</div>';
    return;
  }

  // Check ownership for UI updates
  let ownedIds = new Set();
  if (window.DB.currentUser && window.DB.currentUser.orders) {
    window.DB.currentUser.orders.forEach((order) => {
      if (order.items) order.items.forEach((item) => ownedIds.add(item.id));
    });
  }

  grid.innerHTML = filtered
    .map((g) => {
      const isOwned = ownedIds.has(g.id);
      // Change button style if owned
      const btnText = isOwned ? "Owned" : "Add";
      const btnClass = isOwned
        ? "btn btn-outline btn-sm"
        : "btn btn-primary btn-sm";
      const btnAction = isOwned
        ? ""
        : `onclick="window.app.addToCart(${g.id})"`;
      const btnStyle = isOwned
        ? "cursor:default; opacity:0.6; border-color:var(--border);"
        : "";
      const icon = isOwned ? "fa-check" : "fa-cart-plus";

      return `
        <div class="game-card">
            <img src="${
              g.img
            }" class="game-img" onerror="this.src='https://via.placeholder.com/250x150/1f2b38/ffffff?text=${
        g.name
      }'">
            <div class="game-info">
                <div class="game-title">${g.name}</div>
                <div class="game-cat">${g.category}</div>
                <div class="game-price">$${g.price.toFixed(2)}</div>
                <button class="${btnClass}" style="${btnStyle}" ${btnAction}>
                    <i class="fas ${icon}"></i> ${btnText}
                </button>
            </div>
        </div>`;
    })
    .join("");
};
