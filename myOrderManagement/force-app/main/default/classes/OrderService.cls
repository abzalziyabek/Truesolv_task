public with sharing class OrderService {

	@AuraEnabled
	public static Order__c createOrder(Id accountId, List<OrderItem__c> orderItems) {
		if (accountId == null || orderItems.isEmpty()) {
			throw new AuraHandledException('Account and Order Items are required.');
		}

		Order__c newOrder = new Order__c(Account__c = accountId);

		insert newOrder;

		for (OrderItem__c item : orderItems) {
			item.Order__c = newOrder.Id;
		}
		insert orderItems;

		return newOrder;
	}
}
