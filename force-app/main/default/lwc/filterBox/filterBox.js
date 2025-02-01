import { LightningElement } from 'lwc';

export default class FilterBox extends LightningElement {
    selectedFilters = { type: [], family: [] };

    handleFilterChange(event) {
        const field = event.target.dataset.type || event.target.dataset.family;
        const checked = event.target.checked;

        if (event.target.dataset.type) {
            this.selectedFilters.type = checked
                ? [...this.selectedFilters.type, field]
                : this.selectedFilters.type.filter(t => t !== field);
        } else if (event.target.dataset.family) {
            this.selectedFilters.family = checked
                ? [...this.selectedFilters.family, field]
                : this.selectedFilters.family.filter(f => f !== field);
        }

        // Emit event to parent component (orderManagement)
        this.dispatchEvent(new CustomEvent('filterchange', { detail: this.selectedFilters }));
    }
}
