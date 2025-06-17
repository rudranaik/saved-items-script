(async function () {
  console.log("✅ Swym Saved Items script loaded");

  function waitForDrawer() {
    const footer = document.querySelector("#CartDrawer .drawer__footer");
    if (!footer) return setTimeout(waitForDrawer, 200);
    if (document.querySelector("#swym-sic-container")) return;

    injectSavedItems(footer);
  }

  waitForDrawer();

  async function injectSavedItems(footer) {
    console.log("🧩 Injecting saved items section...");

    try {
      const cartRes = await fetch("/cart.js");
      const cart = await cartRes.json();
      const cartVariantIds = new Set(cart.items.map(item => item.variant_id));
      console.log("🛒 Cart variant IDs:", [...cartVariantIds]);

      const res = await fetch("https://api.swym.it/v3/user/wishlist", {
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      console.log("💖 Wishlist data:", data);

      const items = (data.items || []).filter(
        item => !cartVariantIds.has(Number(item.epi))
      );

      if (items.length === 0) return;

      const container = document.createElement("div");
      container.id = "swym-sic-container";
      container.style.padding = "16px";
      container.style.borderTop = "1px solid #ddd";
      container.innerHTML = `<h4 style="margin-bottom: 8px;">Saved for Later</h4>`;

      items.slice(0, 3).forEach(item => {
        const productHTML = `
          <div style="display: flex; gap: 12px; margin-bottom: 12px;">
            <img src="${item.imageUrl}" style="width: 64px; height: auto; border: 1px solid #ccc;" />
            <div style="flex: 1;">
              <div style="font-size: 14px;">${item.title}</div>
              <button style="margin-top: 4px; padding: 4px 8px; font-size: 13px;"
                onclick="addToCartFromWishlist(${item.epi})">Add to Cart</button>
            </div>
          </div>`;
        container.innerHTML += productHTML;
      });

      footer.parentNode.insertBefore(container, footer);

      window.addToCartFromWishlist = function (variantId) {
        fetch("/cart/add.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: variantId, quantity: 1 })
        }).then(() => location.reload());
      };
    } catch (err) {
      console.error("🔥 Error rendering saved items:", err);
    }
  }
})();
