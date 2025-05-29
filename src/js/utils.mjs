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
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    const itemCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    // Format count to show 99+ if over 99
    cartCount.textContent = itemCount > 99 ? "99+" : itemCount.toString();
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
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");
  
  const headerElement = document.getElementById("main-header");
  const footerElement = document.getElementById("main-footer");
  
  if (!headerElement || !footerElement) {
    throw new Error("Header or footer element not found in the DOM");
  }
  
  headerElement.innerHTML = headerTemplate;
  footerElement.innerHTML = footerTemplate;
  
  // Update cart count after header is loaded
  updateCartCount();
}

// Add this to update cart count when items are removed
document.addEventListener("cartUpdated", () => {
  updateCartCount();
});

export function alertMessage(message, scroll = true) {
  debugger;
  // create element to hold our alert
  const alert = document.createElement("div");
  // add a class to style the alert
  alert.classList.add("alert");
  // set the contents. You should have a message and an X or something the user can click on to remove
  alert.innerHTML = `
    <span class="alert-message">${message}</span>
    <span class="alert-close" style="cursor: pointer;">&times;</span>
  `;

  // add a listener to the alert to see if they clicked on the X
  // if they did then remove the child
  alert.addEventListener("click", function (e) {
    if (e.target.classList.contains("alert-close")) { // how can we tell if they clicked on our X or on something else?  hint: check out e.target.tagName or e.target.innerText
      main.removeChild(this);
    }
  })
  // add the alert to the top of main
  const main = document.querySelector("main");
  main.prepend(alert);
  // make sure they see the alert by scrolling to the top of the window
  //we may not always want to do this...so default to scroll=true, but allow it to be passed in and overridden.
  if (scroll)
    window.scrollTo(0, 0);
}

export function getFormValidationErrors(form) {
  const invalidFields = [];
  for (let element of form.elements) {
    if (!element.validity.valid) {
      invalidFields.push(element.name || element.id || "Unnamed field");
    }
  }
  return `Invalid fields: ${invalidFields.join(", ")}`;
}

export function loadCarouselSlider(data) {

  debugger;
  console.log(data);
  const slides = document.querySelectorAll(".product-card");
  let slideIndex = 0;
  let intervalId = null;

  function initializeSlider() {
    // debugger;
    slides[slideIndex].classList.add("displaySlide");
    intervalId = setInterval(nextSlide, 5000);
  }

  function showSlide(index) {
    // debugger;

    console.log("slideIndex: ", index);
    console.log("slidesLength: ", slides.length);

    if (index >= slides.length) {
      // Loop back to the first slide
      slideIndex = 0;

    } else if (index < 0) {
      // Go to the last slide
      slideIndex = slides.length - 1;
    } else {
      slideIndex = index; // Valid index within bounds
    }

    // First, hide the slides
    slides.forEach(slide => {
      slide.classList.remove("displaySlide");
    });
    // Add the displaySlide class to the active slide
    slides[slideIndex].classList.add("displaySlide");


  }
  console.log("Slides", slides);


 function prevSlide() {

    // Move to the previous slide
    slideIndex--;
    showSlide(slideIndex);
  }

  // Function to go to the next slide
  function nextSlide() {

    // Move to the next slide
    slideIndex++;
    showSlide(slideIndex);

  }

  const prevBtn = document.querySelector("#prev");
  const nextBtn = document.querySelector("#next");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      // Show previous slide, when clicked
      prevSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      // Show next slide, when clicked
      nextSlide();

    });
  }

  initializeSlider();
}

