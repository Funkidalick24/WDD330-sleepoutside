// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  // Update cart count whenever we modify localStorage
  if (key === "so-cart") {
    updateCartCount();
  }
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get the product id from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}
export function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem("so-cart")) || [];
  const cartCount = document.querySelector(".cart-count");
  const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  if (cartCount) {
    cartCount.textContent = itemCount > 99 ? "99+" : itemCount;
    // Only show if we have items
    cartCount.style.display = itemCount > 0 ? "block" : "none";
  }
}
