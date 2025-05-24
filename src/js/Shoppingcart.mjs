// ShoppingCart - Utilized by the cart's index.html to manage the shopping cart functionality.
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
  }

  cartItemTemplate(item) {
    return `<li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Images?.PrimaryMedium}" alt="${item.Name}">
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName}</p>
      <p class="cart-card__quantity">qty: ${item.quantity || 1}</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <button class="cart-card__remove" data-id="${item.Id}">X</button>
    </li>`;
  }

  removeItem(id) {
    let cartItems = getLocalStorage("so-cart") || [];
    cartItems = cartItems.filter(item => item.Id !== id);
    setLocalStorage("so-cart", cartItems);
    this.renderCartContents();
    // Update cart count
    document.dispatchEvent(new CustomEvent("cartUpdated"));
  }

  addRemoveButtonListeners() {
    const removeButtons = document.querySelectorAll(".cart-card__remove");
    removeButtons.forEach(button => {
      button.addEventListener("click", () => {
        this.removeItem(button.dataset.id);
      });
    });
  }

  renderCartContents() {
    const cartItems = getLocalStorage("so-cart") || [];
    const htmlItems = cartItems.map((item) => this.cartItemTemplate(item));
    const parent = document.querySelector(this.parentSelector);

    if (cartItems.length === 0) {
      parent.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    parent.innerHTML = htmlItems.join("");
    this.calculateCartTotal();

    this.addRemoveButtonListeners();
  }

  calculateCartTotal() {
    const cartItems = getLocalStorage("so-cart") || [];
    const total = cartItems.reduce((sum, item) => 
      sum + (parseFloat(item.FinalPrice) * (item.quantity || 1)), 0
    );
    
    const totalElement = document.querySelector(".cart-total");
    if (totalElement) {
      totalElement.textContent = `Total: $${total.toFixed(2)}`;
    }
  }
}
