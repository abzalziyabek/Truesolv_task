public with sharing class ProductController {
	@AuraEnabled(cacheable=true)
	public static Product__c getProductDetails(Id productId) {
		if (String.isEmpty(productId)) {
			throw new AuraHandledException(' Invalid Product ID');
		}

		try {
			return [
					SELECT Id, Name, Description__c, TypeVal__c, FamilyVal__c, Price__c, Image__c
					FROM Product__c
					WHERE Id = :productId
					LIMIT 1
			];
		} catch (Exception e) {
			throw new AuraHandledException('Error fetching product details: ' + e.getMessage());
		}
	}

	@AuraEnabled
	public static void createProduct(Product__c productData) {
		try {
			Product__c newProduct = new Product__c(
					Name = productData.Name,
					Description__c = productData.Description__c,
					TypeVal__c = productData.TypeVal__c,
					FamilyVal__c = productData.FamilyVal__c,
					Price__c = productData.Price__c
			);

			insert newProduct;

		} catch (Exception e) {
			throw new AuraHandledException('Error creating product: ' + e.getMessage());
		}
	}


}
