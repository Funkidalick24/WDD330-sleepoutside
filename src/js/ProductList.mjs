import { renderListWithTemplate } from "./utils.mjs";
import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";
import { isInWishlist, addToWishlist, removeFromWishlist, alertMessage } from "./utils.mjs";

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
  }

  async init() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category") || this.category;
    this.products = await this.dataSource.getData(category);
    this.renderList();
    this.addWishlistListeners();
  }

  addWishlistListeners() {
    const wishlistStars = this.listElement.querySelectorAll('.wishlist-star');
    wishlistStars.forEach(star => {
      star.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const productId = star.dataset.id;
        const product = this.products.find(p => p.Id === productId);
        
        if (isInWishlist(productId)) {
          removeFromWishlist(productId);
          star.innerHTML = '<i class="far fa-star"></i>';
          star.classList.remove('in-wishlist');
        } else {
          addToWishlist(product);
          star.innerHTML = '<i class="fas fa-star"></i>';
          star.classList.add('in-wishlist');
        }
      });
    });
  }

  renderList() {
    if (this.listElement) {
      this.listElement.innerHTML = this.products.map(product => `
        <li class="product-card">
          <div class="card-header">
            <a href="/product_pages/index.html?product=${product.Id}">
              <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
            </a>
            <button class="wishlist-star ${isInWishlist(product.Id) ? 'in-wishlist' : ''}" 
              data-id="${product.Id}">
              <i class="fa${isInWishlist(product.Id) ? 's' : 'r'} fa-star"></i>
            </button>
          </div>
          <a href="/product_pages/index.html?product=${product.Id}">
            <h2 class="card__brand">${product.Brand.Name}</h2>
            <h3 class="card__name">${product.NameWithoutBrand}</h3>
            <p class="product-card__price">$${product.FinalPrice}</p>
          </a>
        </li>
      `).join('');
    }
  }
}
