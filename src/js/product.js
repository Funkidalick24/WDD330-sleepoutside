import { setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

const addToCartButton = document.getElementById("addToCart");
if (addToCartButton) {
  addToCartButton.addEventListener("click", addToCartHandler);
}

function addProductToCart(product) {
  let cart = JSON.parse(localStorage.getItem("so-cart")) || [];
  cart.push(product);
  setLocalStorage("so-cart", cart);
}
// add to cart button event handler
async function addToCartHandler(e) {
  try {
    if (!e.target.dataset.id) {
      throw new Error("Product ID not found");
    }
    const product = await dataSource.findProductById(e.target.dataset.id);
    if (product) {
      addProductToCart(product);
      console.log("Product added to cart successfully");
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
}
