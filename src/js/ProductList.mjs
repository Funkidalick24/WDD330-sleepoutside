import { renderListWithTemplate } from "./utils.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { updateCartCount } from "./utils.mjs";


function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/index.html?id=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
      <button class="add-to-cart" data-id="${product.Id}">Add to Cart</button>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    // Add debug log
    console.log('ProductList constructor:', { category, dataSource, listElement });
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.products = [];
    this.initSorting();

    this.addToCart = this.addToCart.bind(this);
  }

  initSorting() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect){
      sortSelect.addEventListener('change', (e) => {
        this.sortProducts(e.target.value);
      });
    }
  }

  sortProducts(sortBy) {
    if (sortBy === 'price-asc') {
      this.products.sort((a, b) => a.FinalPrice - b.FinalPrice);
    } else if (sortBy === 'price-desc') {
      this.products.sort((a, b) => b.FinalPrice - a.FinalPrice);
    } else if (sortBy === 'name-asc') {
      this.products.sort((a, b) => a.Name.localeCompare(b.Name));
    } else if (sortBy === 'name-desc') {
      this.products.sort((a, b) => b.Name.localeCompare(a.Name));
    }
    this.renderList();
  }

  async init() {
    try {
      const params = new URLSearchParams(window.location.search);
      const category = params.get("category") || this.category;
      const searchQuery = params.get("search");
      
      // Debug log before getData
      console.log('Fetching products for category:', category);
      
      // Make sure we're passing the category to getData
      this.products = await this.dataSource.getData(category);
      this.renderList(this.products)
      
      // Debug log after getData
      console.log('Retrieved products:', this.products);

      if (searchQuery) {
        this.products = this.products.filter(product => {
          const matchName = product.Name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchBrand = product.Brand.Name.toLowerCase().includes(searchQuery.toLowerCase());
          return matchName || matchBrand;
        });
      }

      // Debug check if listElement exists
      if (!this.listElement) {
        console.error('List element is null or undefined');
        return;
      }

      this.renderList();
      // Add event listeners to cart buttons after rendering
      this.addCartListeners();
      
    } catch (error) {
      console.error('Error in ProductList init:', error);
      // Show error in UI
      if (this.listElement) {
        this.listElement.innerHTML = `
          <div class="products-empty">
            <h2>Error loading products</h2>
            <p>Please try again later</p>
          </div>`;
      }
    }
  }

  addCartListeners() {
    const cartButtons = this.listElement.querySelectorAll('.add-to-cart');
    cartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = e.target.dataset.id;
        const product = this.products.find(p => p.Id === productId);
        if (product) {
          this.addToCart(product);
        }
      });
    });
  }

  addToCart(product) {
    const cartItems = getLocalStorage("so-cart") || [];
    
    // Check if product already exists in cart
    const existingItem = cartItems.find(item => item.Id === product.Id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      product.quantity = 1;
      cartItems.push(product);
    }
    
    setLocalStorage("so-cart", cartItems);
    updateCartCount();

    // Add alert message
    const alertMessage = document.createElement("div");
    alertMessage.className = "alert-message";
    alertMessage.innerHTML = `
      <p>${product.Name} added to cart!</p>
    `;
    
    document.querySelector("main").appendChild(alertMessage);
    
    setTimeout(() => {
      alertMessage.remove();
    }, 3000);
  }

  renderList() {
    // Debug check products array
    console.log('Rendering products:', this.products);

    if (!this.products || this.products.length === 0) {
      this.listElement.innerHTML = `
        <div class="products-empty">
          <h2>No products found</h2>
          <p>Try another search term or category</p>
        </div>`;
      return;
    }

    this.listElement.innerHTML = this.products
      .map((product) => productCardTemplate(product))
      .join("");
  }
}
