import { LightningElement, api } from 'lwc';

export default class OrderManagementButton extends LightningElement {
    @api recordId; // Ensure this receives the Account ID

    connectedCallback() {
        console.log(' Button Loaded - Record ID:', this.recordId);
    }

    navigateToOrderManagement() {
        console.log(' Current Record ID:', this.recordId);
        if (this.recordId) {
            let orderManagementUrl = `/lightning/n/Order_Management?c__accountId=${this.recordId}`;
            console.log(' Redirecting to:', orderManagementUrl);
            window.open(orderManagementUrl, "_blank");
        } else {
            console.error(' No Account ID found!');
            alert('No Account ID available! Open this button inside an Account record page.');
        }
    }

}
