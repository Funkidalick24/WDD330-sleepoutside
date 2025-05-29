export default class CheckoutProcess{
    constructor(key, outputSelector){
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal - 0;
    
    }

    Init(){
        this.list = this.packageItems(JSON.parse(localStorage.getItem(this.key)));
        this.calculateItemSummary();
    }
    
    calculateItemSummary(){
        const summaryEl = document.querySelector(
            this.outputSelector + ' #cartTotal'
        );

        const itemNumEl = document.querySelector(
            this.outputSelector + ' #num-items'
        );

        if(summaryEl && itemNumEl){
            itemNumEl.innerHTML = this.list.length;
            
            this.itemTotal = this.list.reduce(total, item  => {
                return total + (item.price * item.quantity)
            }, 0
);

        summaryEl.innerText = '$' + this.itemTotal.toFixed(2);
        }
            
     
    }

    calculateOrderTotal(){
        this.shipping = 10 + (this.list.length-1) *2;
        this.tax = (this.itemTotal*0.06).toFixed(2);
        this.orderTotal =(
            parseFloat(this.itemTotal)+
            parseFloat(this.shipping)+
            parseFloat(this.tax)
        ).toFixed(2);

        this.displayOrderTotals();
    }

    displayOrderTotals(){
     const shipping = document.querySelector(
        this.outputSelector +' #shipping'
     );
     const tax = document.querySelector(
        this.outputSelector + ' #tax'
     );

     const orderTotal = document.querySelector(
        this.outputSelector + ' #orderTotal'
     );

     if(shipping && tax && orderTotal){
        shipping.innerText = '$' + this.shipping;
         tax.innerText = '$' + this.tax.toFixed(2);
          orderTotal.innerText = '$' + this.orderTotal.toFixed(2);
     }
    }

     formDataToJSON(formEl) {
        

        const convertedJSON = {};

        const formData = new FormData(formEl);
        // Print the entries to console
        // for (let pair of formData.entries()) {
        //     console.log(pair[0] + ": " + pair[1]);
        // }

        formData.forEach(function (value, key) {
            convertedJSON[key] = value;
        });

        return convertedJSON;
    }

    packageItems(items) {
        debugger;

        if (!items || items.length === 0) {
            console.log("No items to process!");
            return [];  // Return an empty array if no items are passed
        }

        // Convert the list of products from localStorage to the simpler form required for the checkout process.
        return items.map(item => ({
            id: item.Id,
            name: item.NameWithoutBrand,
            price: item.FinalPrice,
            quantity: item.quantity,
            image: item.Images
        }));

    }


    async checkout() {
        debugger;
        const formEl = document.forms["checkout-form"];

        const json = this.formDataToJSON(formEl);
        // add totals and item details
        json.orderDate = new Date();
        json.orderTotal = this.orderTotal;
        json.tax = this.tax;
        json.shipping = this.shipping;
        json.items = this.list;
        console.log(json);

        try {
            const res = await services.checkout(json);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }



}


