public with sharing class OrderManagementController {
	@AuraEnabled(Cacheable=true)
	public static List<Product__c> getProducts(String searchKey, String type, String family) {
		String query = 'SELECT Id, Name, Description, Type__c, Family__c, Price__c, Image__c FROM Product__c WHERE Name LIKE :searchKey OR Description LIKE :searchKey';
		if (type != null && type != '') query += ' AND Type__c = :type';
		if (family != null && family != '') query += ' AND Family__c = :family';
		return Database.query(query);
	}

	@AuraEnabled
	public static void createOrder(List<OrderItem__c> orderItems, String accountId) {
		Order__c newOrder = new Order__c(AccountId = accountId);
		insert newOrder;

		for (OrderItem__c item : orderItems) {
			item.OrderId__c = newOrder.Id;
		}
		insert orderItems;
	}
}
