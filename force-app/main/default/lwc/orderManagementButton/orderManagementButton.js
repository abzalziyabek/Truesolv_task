import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class OrderManagementButton extends NavigationMixin(LightningElement) {
    handleOpenOrderManagement() {
        // Open Order Management in a new tab
        window.open('/lightning/n/Order_Management', '_blank');
    }
}
