/* --- LIBRARY LOGIC --- */
window.app = window.app || {};

window.app.downloadGame = (gameName) => {
  // Simulation of a download process
  const confirmDownload = confirm(`Start download for "${gameName}"?`);
  if (confirmDownload) {
    alert(
      `Downloading ${gameName}...\n\n(This is a simulation. No file is actually downloading.)`
    );
  }
};

window.app.renderLibrary = () => {
  // 1. Get all orders
  const orders = window.DB.currentUser.orders || [];

  // 2. Extract all items from all orders into a single list
  const allItems = orders.flatMap((order) => order.items);

  // 3. Remove duplicates (User owns the game once)
  const uniqueGames = [];
  const seenIds = new Set();

  allItems.forEach((item) => {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      uniqueGames.push(item);
    }
  });

  // 4. Render
  if (uniqueGames.length === 0) {
    document.getElementById("mainContent").innerHTML = `
            <div style="text-align:center; margin-top:3rem;">
                <h2>Your library is empty.</h2>
                <p style="color:var(--text-muted);">Purchase games from the store to see them here.</p>
                <br>
                <button class="btn btn-outline" onclick="window.app.navigate('home')">Go to Store</button>
            </div>`;
    return;
  }

  document.getElementById("mainContent").innerHTML = `
        <h1 style="margin-bottom: 2rem; font-family: var(--font-head);">My Game Library</h1>
        <div class="library-grid">
            ${uniqueGames
              .map(
                (g) => `
                <div class="library-card">
                    <img src="${g.img}" class="game-img" onerror="this.src='https://via.placeholder.com/250x150/1f2b38/ffffff?text=${g.name}'">
                    <div class="game-info">
                        <div class="game-title">${g.name}</div>
                        <div class="game-cat">${g.category}</div>
                        <button class="btn btn-primary btn-sm" style="margin-top:auto; background-color:#2ecc71;" onclick="window.app.downloadGame('${g.name}')">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                </div>`
              )
              .join("")}
        </div>`;
};
