import { LightningElement, wire, track,api } from 'lwc';
import getProducts from '@salesforce/apex/OrderManagementController.getProducts';
import getAccountDetails from '@salesforce/apex/OrderManagementController.getAccountDetails';


export default class OrderManagement extends LightningElement {
    @track products = []; // Stores all products from Apex
    @track filteredProducts = []; // Stores filtered products
    @track filters = { type: [], family: [], searchKey: '' };
    @track accountId;
    account;

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
                Description__c: product.Description__c ? product.Description__c : 'No description available'
            }))
            .filter(product => {
                const matchesSearch = this.filters.searchKey
                    ? product.Name.toLowerCase().includes(this.filters.searchKey.toLowerCase()) ||
                    product.Description__c.toLowerCase().includes(this.filters.searchKey.toLowerCase())
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


    @track cart = []; // Store cart items
    @track selectedProductId;

    openProductModal(event) {
        this.selectedProductId = event.target.dataset.id;
        console.log('🛠 Details Button Clicked! Product ID:', this.selectedProductId);

        setTimeout(() => {
            const modal = this.template.querySelector("c-product-details-modal");
            if (modal) {
                modal.recordId = this.selectedProductId;
                modal.openModal();
                console.log('✅ Modal Opened!');
            } else {
                console.error('❌ Modal component not found!');
            }
        }, 100);
    }

    /**  Handle Adding to Cart */
    handleAddToCart(event) {
        const productId = event.target.dataset.id;
        const product = this.filteredProducts.find(prod => prod.Id === productId);

        if (product) {
            this.cart.push(product);
            console.log('🛒 Product Added to Cart:', product);

            // Show Toast Message
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: `Added ${product.Name} to cart!`,
                    variant: 'success',
                    mode: 'dismissable'
                })
            );
        }
    }

    @wire(getAccountDetails, { accountId: '$accountId' })
    wiredAccount({ error, data }) {
        if (data) {
            console.log('✅ Account Data Received:', JSON.stringify(data));
            this.account = data;
        } else if (error) {
            console.error('❌ Error fetching account data:', error);
        }
    }

    openProductModal(event) {
        this.selectedProductId = event.target.dataset.id;
        console.log('🛠 Details Button Clicked! Product ID:', this.selectedProductId);

        setTimeout(() => {
            const modal = this.template.querySelector("c-product-details-modal");
            if (modal) {
                modal.recordId = this.selectedProductId; // Pass Product ID
                modal.openModal();
                console.log('✅ Modal Opened!');
            } else {
                console.error('❌ Modal component not found!');
            }
        }, 100); // Small delay to allow DOM update
    }




    // openProductModal(event) {
    //     this.selectedProductId = event.target.dataset.id;
    //     console.log('🛠 Details Button Clicked! Product ID:', this.selectedProductId);
    //
    //     // Find the modal component
    //     const modal = this.template.querySelector("c-product-details-modal");
    //
    //     if (modal) {
    //         console.log("🔍 Checking for Modal Component:", modal);
    //
    //         // Fetch Product Details before opening modal
    //         this.fetchProductDetails(this.selectedProductId)
    //             .then(product => {
    //                 console.log("✅ Product Data Fetched:", product);
    //
    //                 modal.product = product;  // Pass product data to modal
    //                 modal.openModal();  // Open modal
    //
    //                 console.log('✅ Modal Opened!');
    //             })
    //             .catch(error => {
    //                 console.error('❌ Error Fetching Product:', error);
    //             });
    //
    //     } else {
    //         console.error('❌ Modal component not found!');
    //     }
    // }
    //
    // fetchProductDetails(productId) {
    //     return getProductDetails({ productId }) // Apex method call
    //         .then(product => {
    //             return product;
    //         })
    //         .catch(error => {
    //             console.error('❌ Error Fetching Product:', error);
    //             return null;
    //         });
    // }


}
