
import { setLocalStorage, getParam } from "./utils.mjs";

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

