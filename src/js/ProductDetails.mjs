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
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on "this" to understand why.
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  productImage.src = product.Image;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById("productPrice").textContent = product.FinalPrice;
  document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;

    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    // Initialize the page and add event listeners
    async init() {

        try {
            // Find the product by Id
            this.product = await this.dataSource.findProductById(this.productId);

            console.log(this.product); // Fixed the reference to this.product

            // Render the product details
            this.renderProductDetails("main");

            // Add listener to "Add to Cart" button
            document
                .getElementById("addToCart")
                .addEventListener("click", this.checkDuplicates.bind(this));

        } catch (error) {
            console.error("Error loading product details", error);
        }
    }

    // Check for duplicate items in the cart
    async checkDuplicates() {
        try {
            const cart = getLocalStorage("so-cart") || [];
            if (cart.length > 0) {
                const quantity = document.getElementById("quantity").value;
                const cartItem = cart.find((item) => item.Id === this.productId);
                if (cartItem) {
                    // Just update quantity without showing "already in cart" message
                    cartItem.quantity += parseInt(quantity);
                    setLocalStorage("so-cart", cart);
                    this.showPopupMessage("Item added to cart");
                } else {
                    // Add new item
                    const product = await this.dataSource.findProductById(this.productId);
                    product.quantity = parseInt(quantity);
                    cart.push(product);
                    setLocalStorage("so-cart", cart);
                    this.showPopupMessage("Item added to cart");
                }
            } else {
                // First item in cart
                const product = await this.dataSource.findProductById(this.productId);
                product.quantity = parseInt(document.getElementById("quantity").value);
                setLocalStorage("so-cart", [product]);
                this.showPopupMessage("Item added to cart");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    }

    // Add to cart button event handler
    async addToCart() {


        // Find the product by Id
        const product = await this.dataSource.findProductById(this.productId);

        // Get the quantity from the input
        const quantity = parseInt(document.getElementById("quantity").value) || 1;

        // Add the product to the cart with quantity
        this.addProductToCart(product, quantity);

    }

    // Add product to the shopping cart
    addProductToCart(product, quantity) {
        // Check if there's an existing cart
        let cart = getLocalStorage("cart") || [];

        // Ensure cart is an array
        if (!Array.isArray(cart)) {
            cart = [];
        }

        // Add quantity to the product object
        const productWithQuantity = {
            ...product,
            quantity: quantity
        };

        cart.push(productWithQuantity);
        setLocalStorage("cart", cart);

        this.showPopupMessage(`${quantity} item(s) added to cart`);
    }

    // Add showPopupMessage as a class method
    showPopupMessage(message) {
        const popup = document.createElement('div');
        popup.className = 'cart-notification';
        popup.textContent = message;

        // Remove any existing notifications
        const existingPopup = document.querySelector('.cart-notification');
        if (existingPopup) {
            existingPopup.remove();
        }

        document.body.appendChild(popup);

        // Auto-remove after animation completes (3 seconds)
        setTimeout(() => {
            popup.remove();
        }, 3000);
    }


  document.getElementById("addToCart").dataset.id = product.Id;
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