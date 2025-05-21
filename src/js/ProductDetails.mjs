import { setLocalStorage, getLocalStorage } from "./utils.mjs";

// ProductDetails - Creates the product details template.
// - Also defines the ProductDetails class, which takes a productId and a dataSource.
// - Primarily responsible for initializing the page and managing the cart (storing/retrieving) in local storage.


function productDetailsTemplate(product) {
    
    // Check for brand existence and provide fallback
    const brandName = product.Brand && product.Brand.Name ? product.Brand.Name : "Unknown Brand";
    return `<section class="product-detail">
        <h3>${brandName}</h3>
        <h2 class="divider">${product.NameWithoutBrand}</h2>
        <img 
            class="divider" 
            src="${product.Image}" 
            alt="${product.NameWithoutBrand}" 
        />
        <p class="product-card__price">$${product.FinalPrice}</p>    
        <p class="product__color">${product.Colors[0].ColorName}</p>  
        <p class="product__description">${product.DescriptionHtmlSimple}</p>   
        <div class="product-detail__add">
            <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
        </div>
        
    </section>`;
}

export default class ProductDetails {
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

    renderProductDetails(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.insertAdjacentHTML(
                "afterBegin",
                productDetailsTemplate(this.product)
            );
        } else {
            console.error("Parent element not found");
        }
    }
}
