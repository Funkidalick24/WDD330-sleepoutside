import { renderListWithTemplate } from "./utils.mjs";
import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";
import {
  isInWishlist,
  addToWishlist,
  removeFromWishlist,
  alertMessage,
} from "./utils.mjs";

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    try {
      const params = new URLSearchParams(window.location.search);
      const category = params.get("category") || this.category;

      let products = await this.dataSource.getData(category);
      this.products = Array.isArray(products)
        ? products
        : products.Result || [];

      console.log("Products to render:", this.products);

      if (this.products.length === 0) {
        this.showEmptyMessage();
        return;
      }

      this.renderList();
      this.addWishlistListeners(); // Fixed method name
    } catch (error) {
      console.error("Failed to load products:", error);
      this.showErrorMessage(error.message);
    }
  }

  addWishlistListeners() {
    const wishlistStars = this.listElement.querySelectorAll(".wishlist-star");
    wishlistStars.forEach((star) => {
      star.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const productId = star.dataset.id;
        const product = this.products.find((p) => p.Id === productId);

        if (isInWishlist(productId)) {
          removeFromWishlist(productId);
          star.innerHTML = '<i class="far fa-star"></i>';
          star.classList.remove("in-wishlist");
        } else {
          addToWishlist(product);
          star.innerHTML = '<i class="fas fa-star"></i>';
          star.classList.add("in-wishlist");
        }
      });
    });
  }

  renderList() {
    if (!this.listElement || !Array.isArray(this.products)) return;

    this.listElement.innerHTML = this.products
      .map(
        (product) => `
      <li class="product-card">
        <div class="card-header">
          <a href="/product_pages/index.html?product=${product.Id}">
            <img src="${product.Images?.PrimaryMedium || "/images/placeholder.jpg"}" 
                 alt="${product.Name}" 
                 loading="lazy">
          </a>
          <button class="wishlist-star ${isInWishlist(product.Id) ? "in-wishlist" : ""}" 
                  data-id="${product.Id}">
            <i class="fa${isInWishlist(product.Id) ? "s" : "r"} fa-star"></i>
          </button>
        </div>
        <a href="/product_pages/index.html?product=${product.Id}">
          <h2 class="card__brand">${product.Brand?.Name || "Unknown Brand"}</h2>
          <h3 class="card__name">${product.NameWithoutBrand || product.Name}</h3>
          <p class="product-card__price">$${product.FinalPrice || product.ListPrice || "N/A"}</p>
        </a>
      </li>
    `,
      )
      .join("");
  }

  showEmptyMessage() {
    this.listElement.innerHTML = `
      <li class="empty-message">
        No products found in this category.
      </li>
    `;
  }

  showErrorMessage(message) {
    this.listElement.innerHTML = `
      <li class="error-message">
        ${message || "Failed to load products. Please try again later."}
      </li>
    `;
  }
}
