public with sharing class OrderService {

	@AuraEnabled
	public static Order__c createOrder(Id accountId, List<OrderItem__c> orderItems) {
		if (accountId == null || orderItems.isEmpty()) {
			throw new AuraHandledException('Account and Order Items are required.');
		}

		// Create a new Order linked to the Account
		Order__c newOrder = new Order__c(Account__c = accountId);
		insert newOrder;

		// Assign the correct relationship field
		for (OrderItem__c item : orderItems) {
			item.Order_Reference__c = newOrder.Id; // FIXED FIELD NAME
		}

		insert orderItems; // Bulk insert for efficiency

		return newOrder;
	}
}
