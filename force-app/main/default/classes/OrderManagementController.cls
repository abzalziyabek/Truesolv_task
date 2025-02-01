public with sharing class OrderManagementController {
	@AuraEnabled(cacheable=true)
	public static List<Product__c> getProducts() {
		List<Product__c> products = [SELECT Id, Name, Description__c, Type__c, Family__c FROM Product__c];

		System.debug('Fetched Products from Apex: ' + products);
		return products;
	}
}
