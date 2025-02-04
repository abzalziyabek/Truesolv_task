import { LightningElement, wire, track,api } from 'lwc';
import getProducts from '@salesforce/apex/OrderManagementController.getProducts';
import getAccountDetails from '@salesforce/apex/OrderManagementController.getAccountDetails';
import getCurrentUser from '@salesforce/apex/UserController.getCurrentUser';


export default class OrderManagement extends LightningElement {
    @track products = []; // Stores all products from Apex
    @track filteredProducts = []; // Stores filtered products
    @track filters = { type: [], family: [], searchKey: '' };
    @track accountId;
    @api recordId; // Ensure this holds Account ID
    @track account;

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
                    ? this.filters.type.includes(product.TypeVal__c)
                    : true;

                const matchesFamily = this.filters.family.length
                    ? this.filters.family.includes(product.FamilyVal__c)
                    : true;

                return matchesSearch && matchesType && matchesFamily;
            });
    }


    @wire(getAccountDetails, { accountId: '$accountId' })
    wiredAccount({ error, data }) {
        if (data) {
            console.log(' Account Data Received:', JSON.stringify(data));
            this.account = data;
        } else if (error) {
            console.error(' Error fetching account data:', error);
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
                console.log(' Modal Opened!');
            } else {
                console.error(' Modal component not found!');
            }
        }, 100); // Small delay to allow DOM update
    }

    @track cart = [];
    @track selectedProductId;

    handleAddToCart(event) {
        const productId = event.target.dataset.id;
        const product = this.filteredProducts.find(p => p.Id === productId);
        this.selectedProductId = product.Id;

        if (product) {
            const existingItem = this.cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
                existingItem.total = existingItem.quantity * existingItem.price;
            } else {
                this.cart.push({
                    id: product.Id,
                    name: product.Name,
                    price: product.Price__c,
                    quantity: 1,
                    total: product.Price__c,
                });
            }

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Added to Cart',
                    message: `${product.Name} added to cart.`,
                    variant: 'success',
                })
            );
        }
    }

    openCartModal() {
        const cartModal = this.template.querySelector("c-cart-modal");
        if (cartModal) {
            cartModal.openCart(this.cart);
        } else {
            console.error("Cart modal component not found!");
        }
    }

    handleCartCheckout() {
        console.log("Cart checked out, clearing cart...");
        this.cartItems = [];
        this.isCartOpen = false;
    }

    connectedCallback() {
        this.extractAccountIdFromUrl();
    }

    extractAccountIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        this.accountId = params.get('c__accountId');
        console.log("Extracted Account ID:", this.accountId);

        if (this.accountId) {
            this.fetchAccountDetails();
        } else {
            console.error(" No Account ID found in URL");
        }
    }

    fetchAccountDetails() {
        getAccountDetails({ accountId: this.accountId })
            .then((data) => {
                if (data) {
                    this.account = data;
                    console.log(" Account Data Loaded:", JSON.stringify(this.account));
                } else {
                    console.error(" No data returned from Apex");
                }
            })
            .catch((error) => {
                console.error(" Error fetching account details:", error);
            });
    }

    @track isManager = false;

    @wire(getCurrentUser)
    wiredUser({ error, data }) {
        if (data) {
            this.isManager = data.IsManager__c;
        } else if (error) {
            console.error('Error fetching user data', error);
        }
    }

    openCreateProductModal() {
        const modal = this.template.querySelector('c-product-modal');
        if (modal) {
            modal.openModal();
        }
    }

}
