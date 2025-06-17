(function () {
  console.log("✅ Swym Saved Items script loaded");

  function waitForDrawer() {
    const footer = document.querySelector("#CartDrawer .drawer__footer");
    if (!footer) return setTimeout(waitForDrawer, 200);
    if (document.querySelector("#swym-sic-container")) return;

    injectSavedItems(footer);
  }

  waitForDrawer();

  function injectSavedItems(footer) {
    console.log("🧩 Waiting for Swym SDK to initialize...");

    window.SwymCallbacks = window.SwymCallbacks || [];
    window.SwymCallbacks.push(function () {
      const swat = window.swat || window._swat;
      if (!swat) {
        console.error("❌ Swym SDK still not available");
        return;
      }

      console.log("🎯 Swym SDK ready. Fetching lists...");

      swat.fetchLists({
        callbackFn: function (lists) {
          if (!lists || lists.length === 0) {
            console.log("😶 No wishlists found");
            return;
          }

          const listId = lists[0].lid;
          console.log("📦 First wishlist ID:", listId);

          swat.fetchListCtx(
            { lid: listId },
            function (items) {
              console.log("💖 Wishlist items:", items);

              if (!items || items.length === 0) return;

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
                      <div style="font-size: 14px;">${item.productTitle}</div>
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
            },
            function (err) {
              console.error("❌ Failed to fetch wishlist items", err);
            }
          );
        },
        errorFn: function (err) {
          console.error("❌ Failed to fetch lists", err);
        }
      });
    });
  }
})();
