public with sharing class OrderManagementController {

	@AuraEnabled(cacheable=true)
	public static List<Product__c> getProducts() {
		return [SELECT Id, Name, Description__c, TypeVal__c, FamilyVal__c, Price__c, Image__c FROM Product__c];
	}

	@AuraEnabled
	public static Id createProduct(String name, String description, String type, String family, Decimal price) {

		Product__c newProduct = new Product__c(
				Name = name,
				Description__c = description,
				TypeVal__c = type,
				FamilyVal__c = family,
				Price__c = price,
				Image__c = imageUrl
		);

		insert newProduct;
		return newProduct.Id;
	}

	@AuraEnabled(cacheable=true)
	public static Account getAccountDetails(Id accountId) {

		if (accountId == null) {
			throw new AuraHandledException(' Error: Account ID is required.');
		}

		try {
			Account acc = [SELECT Id, Name, AccountNumber FROM Account WHERE Id = :accountId LIMIT 1];
			System.debug(' Account Found: ' + acc);
			return acc;
		} catch (Exception e) {
			System.debug(' Error fetching account: ' + e.getMessage());
			throw new AuraHandledException('Error retrieving account details: ' + e.getMessage());
		}
	}
}
