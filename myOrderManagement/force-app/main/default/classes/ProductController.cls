public with sharing class ProductController {
	@AuraEnabled(cacheable=true)
	public static Product__c getProductDetails(Id productId) {
		if (String.isEmpty(productId)) {
			throw new AuraHandledException('❌ Invalid Product ID');
		}

		try {
			return [
					SELECT Id, Name, Description__c, Type__c, Family__c, Price__c, Image__c
					FROM Product__c
					WHERE Id = :productId
					LIMIT 1
			];
		} catch (Exception e) {
			throw new AuraHandledException('Error fetching product details: ' + e.getMessage());
		}
	}
}
