import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, updateCartCount } from "./utils.mjs";

window.addEventListener("storage", (e) => {
  if (e.key === "so-cart") {
    updateCartCount();
  }
});

async function init() {
  try {
    // Load header and footer first
    await loadHeaderFooter();

    // Update cart count
    updateCartCount();

    // Get product list element with more specific error
    let element = document.querySelector(".product-list"); // Changed from const to let
    if (!element) {
      console.error(
        "Product list element not found. Please ensure there is an element with class 'product-list' in your HTML.",
      );

      // Create element if missing (optional fallback)
      const main = document.querySelector("main");
      if (main) {
        const productList = document.createElement("div");
        productList.className = "product-list";
        main.appendChild(productList);
        element = productList;
      }
    }

    // Initialize product data
    const dataSource = new ExternalServices("tents");
    let products = await dataSource.getData();

    // Handle search functionality
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("search");
    if (searchQuery) {
      products = products.filter((product) =>
        product.Name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Render product list
    const productList = new ProductList("Tents", dataSource, element);
    productList.renderList(products);

    // Initialize modal if needed
    showRegisterModal();
  } catch (error) {
    console.error("Initialization error:", error);
  }
}

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  init();
});

// modal register
function showRegisterModal() {
  const modalShown = localStorage.getItem("registerModalShown");

  if (!modalShown) {
    const modal = document.getElementById("register-modal");
    const closeButton = modal.querySelector(".close-modal");

    modal.classList.remove("hidden");

    // Cierra al hacer click en el botón
    closeButton.addEventListener("click", () => {
      modal.classList.add("hidden");
      localStorage.setItem("registerModalShown", "true");
    });

    // Cierra si se hace click fuera del contenido del modal
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.add("hidden");
        localStorage.setItem("registerModalShown", "true");
      }
    });
  }
}

showRegisterModal();
