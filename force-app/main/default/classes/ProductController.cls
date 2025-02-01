public with sharing class ProductController {
	@AuraEnabled(cacheable=true)
	public static List<Product__c> getProducts(String searchKey) {
		// Prepare the search pattern, escaping any quotes
		String pattern = '%' + String.escapeSingleQuotes(searchKey) + '%';
		// Use the pattern as a bind variable in the query
		return [SELECT Id, Name, Description__c, Price__c FROM Product__c WHERE Name LIKE :pattern];
	}
}
