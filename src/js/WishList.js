import {
  loadHeaderFooter,
  getWishlist,
  removeFromWishlist,
  addToCart,
} from "./utils.mjs";

loadHeaderFooter();

function renderWishlist() {
  const wishlistContainer = document.querySelector(".wishlist-products");
  const wishlist = getWishlist();

  if (!wishlist || wishlist.length === 0) {
    wishlistContainer.innerHTML = `
      <li class="products-empty">
        <h3>Your wishlist is empty</h3>
        <p>Add items to your wishlist by clicking the star icon on products.</p>
      </li>`;
    return;
  }

  wishlistContainer.innerHTML = wishlist
    .map(
      (item) => `
    <li class="wishlist-card">
      <img src="${item.Images?.PrimaryMedium || 'images/fallback.jpg'}" alt="${item.Name}"/>
      <div class="wishlist-card__content">
        <h3>${item.Brand.Name}</h3>
        <h2>${item.NameWithoutBrand}</h2>
        <p class="wishlist-card__price">$${item.FinalPrice}</p>
        <div class="wishlist-card__actions">
          <button class="add-to-cart" data-id="${item.Id}">Add to Cart</button>
          <button class="remove-from-wishlist" data-id="${item.Id}">Remove</button>
        </div>
      </div>
    </li>
  `,
    )
    .join("");

  addWishlistListeners();
}

function addWishlistListeners() {
  // Add to cart button listeners
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.target.dataset.id;
      const product = getWishlist().find((item) => item.Id === productId);
      if (product) {
        addToCart(product);
        removeFromWishlist(productId);
        renderWishlist();
      }
    });
  });

  // Remove from wishlist button listeners
  document.querySelectorAll(".remove-from-wishlist").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.target.dataset.id;
      removeFromWishlist(productId);
      renderWishlist();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderWishlist();
});


