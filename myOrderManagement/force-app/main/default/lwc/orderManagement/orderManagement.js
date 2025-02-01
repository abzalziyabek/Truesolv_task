import { LightningElement, wire, track } from 'lwc';
import getProducts from '@salesforce/apex/ProductController.getProducts';


export default class OrderManagement extends LightningElement {
    @track products;
    searchKey = '';
    familyFilter = '';
    typeFilter = '';

    @wire(getProducts, { searchKey: '$searchKey', family: '$familyFilter', type: '$typeFilter' })
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

    handleFilter(event) {
        const field = event.target.label.includes('Family') ? 'familyFilter' : 'typeFilter';
        this[field] = event.target.value;
    }

    handleAddToCart(event) {
        const productId = event.target.dataset.id;
        console.log('Product added:', productId);
        // Add to Cart logic here
    }

    handleViewCart() {
        console.log('Viewing Cart');
        // Show Cart logic here
    }
}
