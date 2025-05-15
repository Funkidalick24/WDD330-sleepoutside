import { getParam } from "./utils.mjs";
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


