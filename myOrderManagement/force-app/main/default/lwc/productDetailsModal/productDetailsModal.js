import { LightningElement, api, track, wire } from 'lwc';
import getProductDetails from '@salesforce/apex/ProductController.getProductDetails';

export default class ProductDetailsModal extends LightningElement {
    @api recordId;
    @track product;
    @api isOpen = false; // Allow external control of modal visibility

    @wire(getProductDetails, { productId: '$recordId' })
    wiredProduct({ error, data }) {
        if (data) {
            console.log("✅ Product Data Loaded:", data);
            this.product = data;
        } else if (error) {
            console.error("❌ Error Fetching Product Details:", error);
        }
    }

    @api openModal() {
        console.log("✅ Opening Modal with Record ID:", this.recordId);
        if (!this.recordId) {
            console.error("❌ No Product ID provided!");
            return;
        }
        this.isOpen = true;
        console.log("✅ Modal State Updated:", this.isOpen);
    }

    closeModal() {
        this.isOpen = false;
        console.log("❌ Modal Closed!");
    }
}
