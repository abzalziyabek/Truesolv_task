import { LightningElement, wire, track } from 'lwc';
import getProducts from '@salesforce/apex/OrderManagementController.getProducts';

export default class OrderManagement extends LightningElement {
    @track products = []; // Stores all products from Apex
    @track filteredProducts = []; // Stores filtered products
    @track filters = { type: [], family: [], searchKey: '' };

    @wire(getProducts)
    wiredProducts({ error, data }) {
        if (data) {
            this.products = data;
            this.applyFilters(); // Apply filters when data is loaded
        } else if (error) {
            console.error("Error fetching products:", error);
        }
    }

    // Handle filter changes from checkboxes
    handleFilterChange(event) {
        const field = event.target.dataset.type || event.target.dataset.family;
        const checked = event.target.checked;

        if (event.target.dataset.type) {
            this.filters.type = checked
                ? [...this.filters.type, field]
                : this.filters.type.filter(t => t !== field);
        } else if (event.target.dataset.family) {
            this.filters.family = checked
                ? [...this.filters.family, field]
                : this.filters.family.filter(f => f !== field);
        }

        this.applyFilters();
    }

    // Handle search input
    handleSearch(event) {
        this.filters.searchKey = event.target.value;
        this.applyFilters();
    }

    // Apply filters to the product list
    applyFilters() {
        this.filteredProducts = this.products
            .map(product => ({
                ...product,
                Description: product.Description ? product.Description : 'No description available'
            }))
            .filter(product => {
                const matchesSearch = this.filters.searchKey
                    ? product.Name.toLowerCase().includes(this.filters.searchKey.toLowerCase()) ||
                    product.Description.toLowerCase().includes(this.filters.searchKey.toLowerCase())
                    : true;

                const matchesType = this.filters.type.length
                    ? this.filters.type.includes(product.Type__c)
                    : true;

                const matchesFamily = this.filters.family.length
                    ? this.filters.family.includes(product.Family__c)
                    : true;

                return matchesSearch && matchesType && matchesFamily;
            });
    }


    handleAddToCart(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: "Product Added",
                message: "Product added to cart successfully!",
                variant: "success"
            })
        );
    }

    handleViewDetails(event) {
        console.log("View Details Clicked for Product ID:", event.target.dataset.id);
    }
}
