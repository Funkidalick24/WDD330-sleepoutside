import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./Shoppingcart.mjs";

loadHeaderFooter();

const cart = new ShoppingCart("so-cart", "#cart-items");
cart.renderCartContents();

function checkoutCart() {
  const checkoutBtn = document.querySelector("#checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "../checkout/index.html";
    });
  }
}

checkoutCart();

// Add this after any cart modifications (remove item, update quantity, etc.)
function removeItem(e) {
  // ...existing code...
  setLocalStorage("so-cart", cartItems);
  updateCartCount();
  // ...existing code...
}
