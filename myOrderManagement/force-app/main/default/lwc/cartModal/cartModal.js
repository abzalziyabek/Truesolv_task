import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import checkoutCart from '@salesforce/apex/CartController.checkoutCart';

export default class CartModal extends LightningElement {
    @track isOpen = false;
    @api cartItems = [];
    @api accountId;

    @api
    openCart(cartData) {
        this.cartItems = cartData;
        this.isOpen = true;
    }

    closeCart() {
        this.isOpen = false;
    }

    removeFromCart(event) {
        const productId = event.target.dataset.id;
        this.cartItems = this.cartItems.filter(item => item.id !== productId);

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Product Removed',
                message: 'Product removed from cart successfully!',
                variant: 'warning',
            })
        );
    }

    async handleCheckout() {
        console.log(" Processing Checkout...");
        console.log(" Account ID:", this.accountId);
        console.log(" Raw Cart Items:", JSON.stringify(this.cartItems));

        if (!this.cartItems.length) {
            this.showToast('Error', 'Your cart is empty!', 'error');
            return;
        }

        //  Ensure Product ID is correctly formatted
        let formattedCartItems = this.cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
        }));

        console.log(" Formatted Cart Items to be sent:", JSON.stringify(formattedCartItems));


        checkoutCart({
            cartItems: [...formattedCartItems],
            accountId: this.accountId
        }).then(result => {
            console.log("✅ Order Created:", result);
            this.showToast('Success', 'Order placed successfully!', 'success');

            window.location.href = `/lightning/r/Order__c/${result.Id}/view`;

            this.cartItems = [];
            this.isOpen = false;
            this.dispatchEvent(new CustomEvent("checkout"));
        }).catch(error => {
            console.error("❌ Checkout Error:", error);
            this.showToast('Error', 'Failed to place order: ' + (error.body ? error.body.message : error), 'error');
        });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({ title, message, variant });
        this.dispatchEvent(event);
    }
}
