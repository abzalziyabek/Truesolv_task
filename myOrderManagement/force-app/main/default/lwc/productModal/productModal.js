import { LightningElement, track, api } from 'lwc';
import createProduct from '@salesforce/apex/ProductController.createProduct';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ProductModal extends LightningElement {
    @track isOpen = false;
    @track product = {
        Name: '',
        Price__c: '',
        Description__c: '',
        TypeVal__c: '',
        FamilyVal__c: ''
    };

    // Options for Type combobox
    get typeOptions() {
        return [
            { label: 'Type1', value: 'Type 1' },
            { label: 'something', value: 'something' },
            { label: 'Type3', value: 'Type 3' }
        ];
    }

    // Options for Family combobox
    get familyOptions() {
        return [
            { label: 'fam1', value: 'Family 1' },
            { label: 'something', value: 'something' },
            { label: 'fam3', value: 'Family 3' }
        ];
    }

    @api
    openModal() {
        this.isOpen = true;
    }

    closeModal() {
        this.isOpen = false;
        this.clearFields();
    }

    handleInputChange(event) {
        const field = event.target.name;
        this.product[field] = event.target.value;
    }

    handleCreateProduct() {
        const { Name, Price__c, Description__c, TypeVal__c, FamilyVal__c } = this.product;

        // Validation to ensure all fields are filled
        if (!Name || !Price__c || !Description__c || !TypeVal__c || !FamilyVal__c) {
            this.showToast('Error', 'Please fill in all fields.', 'error');
            return;
        }

        createProduct({ productData: this.product })
            .then(() => {
                this.showToast('Success', 'Product created successfully!', 'success');
                this.isOpen = false;
                this.clearFields();
            })
            .catch(error => {
                console.error('Error creating product:', error);
                this.showToast('Error', 'Failed to create product.', 'error');
            });
    }

    clearFields() {
        this.product = {
            Name: '',
            Price__c: '',
            Description__c: '',
            TypeVal__c: '',
            FamilyVal__c: ''
        };
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
