<<<<<<< HEAD
import { setLocalStorage, getParam } from "./utils.mjs";
=======
import { getParam } from "./utils.mjs";
>>>>>>> origin/hb--dynamic-product-image-size
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";


const dataSource = new ProductData("tents");
const productId = getParam("product");

const product = new ProductDetails(productId, dataSource);
product.init();

// console.log(dataSource.findProductById(productId));

// const addToCartButton = document.getElementById("addToCart");
// if (addToCartButton) {
//   addToCartButton.addEventListener("click", addToCartHandler);
// }

// // add to cart button event handler
// async function addToCartHandler(e) {
//   try {
//     if (!e.target.dataset.id) {
//       throw new Error("Product ID not found");
//     }
//     const product = await dataSource.findProductById(e.target.dataset.id);
//     if (product) {
//       addProductToCart(product);
//       console.log("Product added to cart successfully");
//     }
//   } catch (error) {
//     console.error("Error adding product to cart:", error);
//   }
// }


<<<<<<< HEAD
function addProductToCart(product) {
  let cart = JSON.parse(localStorage.getItem("so-cart")) || [];
  cart.push(product);
  setLocalStorage("so-cart", cart);
}

async function addToCartHandler(e) {
  try {
    const productId = getProductId();
    if (!productId) {
      throw new Error("Product ID not found");
    }
    const product = await dataSource.findProductById(productId);
    if (product) {
      addProductToCart(product);
      console.log("Product added to cart successfully");
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
}

function getProductId() {
  return (
    getParam("id") ||
    document.getElementById("addToCart")?.dataset.id ||
    window.location.pathname.split("/").pop().split(".")[0]
  );
}

async function displayProductDetails() {
  const productId = getProductId();
  if (!productId) {
    console.error("No product ID found");
    return;
  }

  try {
    const product = await dataSource.findProductById(productId);
    if (!product) {
      console.error("Product not found");
      return;
    }

    updateProductDisplay(product);
    addDiscountBadge(product);
  } catch (error) {
    console.error("Error loading product details:", error);
  }
}

function updateProductDisplay(product) {
  safeUpdateElement(".product-name", product.Name);
  safeUpdateElement(
    ".product-brand",
    product.Brand?.Name || product.Brand || "",
  );
  safeUpdateElement(
    ".product-description",
    product.Description || "No description available",
  );

  updatePriceDisplay(product);

  const imgElement = document.querySelector(
    ".product-image img, .product-detail img",
  );
  if (imgElement && product.Image) {
    imgElement.src = product.Image;
    imgElement.alt = product.Name || "Product image";
  }
}

function safeUpdateElement(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
}

function updatePriceDisplay(product) {
  const priceContainer = document.querySelector(
    ".product-price, .price-display",
  );
  if (!priceContainer) return;

  const finalPrice = product.FinalPrice?.toFixed(2) || "0.00";

  if (
    product.SuggestedRetailPrice &&
    product.SuggestedRetailPrice > product.FinalPrice
  ) {
    const originalPrice = product.SuggestedRetailPrice.toFixed(2);
    priceContainer.innerHTML = `
    
      <span class="original-price">$${originalPrice}</span>
      <span class="current-price">$${finalPrice}</span>
      <span class="price-savings">(Save $${(product.SuggestedRetailPrice - product.FinalPrice).toFixed(2)})</span>
   
    `;
  } else {
    priceContainer.innerHTML = `
      <span class="current-price">$${finalPrice}</span>
    `;
  }
}

function addDiscountBadge(product) {
  if (
    !product.SuggestedRetailPrice ||
    !product.FinalPrice ||
    product.SuggestedRetailPrice <= product.FinalPrice
  ) {
    return;
  }

  const discountPercent = Math.round(
    ((product.SuggestedRetailPrice - product.FinalPrice) /
      product.SuggestedRetailPrice) *
      100,
  );

  const container = document.querySelector(
    ".product-image, .product-detail, .product-container",
  );
  if (!container) return;

  container.style.position = "relative";

  // Remove existing badge
  const existingBadge = container.querySelector(".discount-badge");
  if (existingBadge) existingBadge.remove();

  // Add new badge
  const badge = document.createElement("div");
  badge.className = "discount-badge";
  badge.textContent = `-${discountPercent}%`;
  container.appendChild(badge);
}

document.addEventListener("DOMContentLoaded", () => {
  const addToCartBtn = document.getElementById("addToCart");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", addToCartHandler);
  }
  displayProductDetails();
});
=======
>>>>>>> origin/hb--dynamic-product-image-size
