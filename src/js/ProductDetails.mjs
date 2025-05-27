import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // the product details are needed before rendering the HTML
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    const quantity = parseInt(document.getElementById("quantity").value) || 1;
    
    // Check if product already exists in cart
    const existingItem = cartItems.find(item => item.Id === this.product.Id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + quantity;
    } else {
      this.product.quantity = quantity;
      cartItems.push(this.product);
    }
    
    setLocalStorage("so-cart", cartItems);
    updateCartCount();
    
    // Add alert message
    const alertMessage = document.createElement("div");
    alertMessage.className = "alert-message";
    alertMessage.innerHTML = `
      <p>${this.product.Name} added to cart!</p>
    `;
    
    // Add to page
    document.querySelector("main").appendChild(alertMessage);
    
    // Remove after 3 seconds
    setTimeout(() => {
      alertMessage.remove();
    }, 3000);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector('h2').textContent = product.Brand.Name;
  document.querySelector('h3').textContent = product.NameWithoutBrand;

  const productImage = document.getElementById('productImage');
  productImage.src = product.Image;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById('productPrice').textContent = product.FinalPrice;
  document.getElementById('productColor').textContent = product.Colors[0].ColorName;
  document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;
  
  document.getElementById('addToCart').dataset.id = product.Id;
  // Add quantity input before add to cart button
  const addToCartDiv = document.getElementById('addToCart').parentElement;
  const quantityHTML = `
    <div class="product-detail__quantity">
      <label for="quantity">Quantity:</label>
      <input 
        type="number" 
        id="quantity" 
        name="quantity" 
        min="1" 
        value="1" 
        class="quantity-input"
      >
    </div>
  `;
  addToCartDiv.insertAdjacentHTML('beforebegin', quantityHTML);

}

// ************* Alternative Display Product Details Method *******************
// function productDetailsTemplate(product) {
//   return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
//     <h2 class="divider">${product.NameWithoutBrand}</h2>
//     <img
//       class="divider"
//       src="${product.Image}"
//       alt="${product.NameWithoutBrand}"
//     />
//     <p class="product-card__price">$${product.FinalPrice}</p>
//     <p class="product__color">${product.Colors[0].ColorName}</p>
//     <p class="product__description">
//     ${product.DescriptionHtmlSimple}
//     </p>
//     <div class="product-detail__add">
//       <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
//     </div></section>`;
// }