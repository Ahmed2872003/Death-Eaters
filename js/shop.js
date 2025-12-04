/* --- SHOP LOGIC --- */
window.app = window.app || {};

window.app.addToCart = (gameId) => {
  if (!window.DB.currentUser) return window.app.navigate("login");
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
  grid.innerHTML = filtered
    .map(
      (g) => `
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
                <button class="btn btn-primary btn-sm" onclick="window.app.addToCart(${
                  g.id
                })"><i class="fas fa-cart-plus"></i> Add</button>
            </div>
        </div>`
    )
    .join("");
};
