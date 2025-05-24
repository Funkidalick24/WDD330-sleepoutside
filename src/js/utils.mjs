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
  // Update cart count when cart is modified
  if (key === "so-cart") {
    updateCartCount();
  }
}

export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartCount = document.querySelector(".cart-count");
  
  if (cartCount) {
    const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCount.textContent = itemCount > 99 ? "99+" : itemCount;
    cartCount.style.display = itemCount > 0 ? "block" : "none";
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
  return product
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  // Add null check for parentElement
  if (!parentElement) {
    console.error("Parent element is null. Selector might be incorrect or element doesn't exist.");
    return;
  }

  try {
    const htmlStrings = list.map(template);
    // if clear is true we need to clear out the contents of the parent.
    if (clear) {
      parentElement.innerHTML = "";
    }
    parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
  } catch (error) {
    console.error("Error in renderListWithTemplate:", error);
  }
}

/// Función para cargar templates HTML
export async function loadTemplate(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load template: ${path}`);
  }
  return await response.text();
}

// Función para renderizar un template (sin loop)
export function renderWithTemplate(template, parentElement, data = null, callback = null) {
  parentElement.innerHTML = template;
  if (callback && data) {
    callback(data);
  }
}

// Función principal para cargar header/footer
export async function loadHeaderFooter() {
  try {
    console.log("Starting header/footer load...");
    
    // Load templates
    const headerTemplate = await loadTemplate("/partials/header.html");
    const footerTemplate = await loadTemplate("/partials/footer.html");

    // Get elements and verify they exist
    const headerElement = document.getElementById("main-header");
    const footerElement = document.getElementById("main-footer");

    if (!headerElement) {
      throw new Error('Header element with id "main-header" not found in the DOM');
    }

    if (!footerElement) {
      throw new Error('Footer element with id "main-footer" not found in the DOM');
    }

    renderWithTemplate(headerTemplate, headerElement);
    renderWithTemplate(footerTemplate, footerElement);

    console.log("Header and footer loaded successfully");

  } catch (error) {
    console.error("Error loading header/footer:", error.message);
    
  }
}

// Add this to update cart count when items are removed
document.addEventListener("cartUpdated", () => {
  updateCartCount();
});
