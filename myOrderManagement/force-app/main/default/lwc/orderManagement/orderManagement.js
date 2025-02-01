import { LightningElement, wire, track } from 'lwc';
import getProducts from '@salesforce/apex/OrderManagementController.getProducts';

export default class OrderManagementPage extends LightningElement {
    @track products = [];
    searchKey = '';
    selectedType = '';
    selectedFamily = '';

    @wire(getProducts, { searchKey: '$searchKey', type: '$selectedType', family: '$selectedFamily' })
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data;
        } else if (error) {
            console.error(error);
        }
    }

    handleSearch(event) {
        this.searchKey = event.target.value;
    }

    handleTypeChange(event) {
        this.selectedType = event.detail.value;
    }

    handleFamilyChange(event) {
        this.selectedFamily = event.detail.value;
    }
}
