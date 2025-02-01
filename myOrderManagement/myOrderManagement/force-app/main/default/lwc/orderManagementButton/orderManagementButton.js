import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class OrderManagementButton extends NavigationMixin(LightningElement) {
    handleClick() {
        // Navigate to the Order Management page.
        // Adjust the navigation details to match your target page.
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/lightning/n/Order_Management'
            }
        });
    }
}
