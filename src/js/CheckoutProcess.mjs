export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;  
    }

    init() {
        this.list = this.packageItems(JSON.parse(localStorage.getItem(this.key)));
        this.calculateItemSummary();
        this.calculateOrderTotal();  // Add this line to calculate all totals
    }

    calculateItemSummary() {
        const summaryElement = document.querySelector(this.outputSelector + " #cartTotal");
        const itemNumElement = document.querySelector(this.outputSelector + " #num-items");
        
        if (summaryElement && itemNumElement) {
            itemNumElement.innerText = this.list.length;
            this.itemTotal = this.list.reduce((total, item) => 
                total + item.price * item.quantity, 0);
            summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`;
        }
    }

    calculateOrderTotal() {
        // Calculate total quantity of all items
        const totalQuantity = this.list.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        // Base shipping is $10 for first item
        this.shipping = 10;
        
        // Add $2 for each additional item based on total quantity
        if (totalQuantity > 1) {
            this.shipping += (totalQuantity - 1) * 2;
        }

        // Calculate tax and total
        this.tax = (this.itemTotal * 0.06);
        this.orderTotal = parseFloat(this.itemTotal) + 
                         parseFloat(this.shipping) + 
                         parseFloat(this.tax);

        // Display the updated totals
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        const shipping = document.querySelector(this.outputSelector + " #shipping");
        const tax = document.querySelector(this.outputSelector + " #tax");
        const orderTotal = document.querySelector(this.outputSelector + " #orderTotal");
        
        if (shipping && tax && orderTotal) {
            shipping.innerText = `$${this.shipping.toFixed(2)}`;
            tax.innerText = `$${this.tax.toFixed(2)}`;
            orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
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


