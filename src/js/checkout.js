import {
  loadHeaderFooter,
  getLocalStorage,
  setLocalStorage,
  getFormValidationErrors,
  alertMessage,
} from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();
document.addEventListener("DOMContentLoaded", () => {
  const myCheckout = new CheckoutProcess("so-cart", ".checkout-summary");
  const myForm = document.forms["checkout-form"];

  // Initialize checkout process
  myCheckout.init();

  const zipInput = document.querySelector("#zipcode");
  const checkoutSubmitButton = document.querySelector("#btn-checkout");
  const creditcardNum = document.querySelector("#creditcard-number");

  if (creditcardNum) {
    creditcardNum.addEventListener("click", () => {
      const errors = getFormValidationErrors(myForm);
      if (errors.length > 0) {
        console.log(errors);
        alertMessage(errors, true);
      }
    });
  }

  if (zipInput) {
    // Fix: Use correct method name 'calculateOrderTotal' and check if it exists
    zipInput.addEventListener("blur", () => {
      if (typeof myCheckout.calculateOrderTotal === "function") {
        myCheckout.calculateOrderTotal();
      }
    });
  }

  if (checkoutSubmitButton) {
    checkoutSubmitButton.addEventListener("click", (e) => {
      e.preventDefault();
      const chk_status = myForm.checkValidity();
      myForm.reportValidity();

      if (chk_status) {
        myCheckout.checkout();
        window.location.href = "../checkout/success.html";
        setLocalStorage("so-cart", []); // Fix: Update cart key name
      }
    });
  }

  // Remove duplicate form submit listener since we already handle submission
  // in the checkoutSubmitButton click handler
});
