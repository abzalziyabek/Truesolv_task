trigger OrderTrigger on OrderItem__c (after insert, after update, after delete) {
	Set<Id> orderIds = new Set<Id>();
	for (OrderItem__c item : Trigger.new) {
		orderIds.add(item.Order__c);
	}

	List<Order__c> ordersToUpdate = [SELECT Id, TotalProductCount__c, TotalPrice__c FROM Order__c WHERE Id IN :orderIds];

	for (Order__c order : ordersToUpdate) {
		List<OrderItem__c> items = [SELECT Quantity__c, Price__c FROM OrderItem__c WHERE Order__c = :order.Id];

		Integer totalCount = 0;
		Decimal totalPrice = 0.0; // Change from Integer to Decimal

		for (OrderItem__c item : items) {
			totalCount += (Integer) item.Quantity__c;  // Explicit casting to Integer
			totalPrice += item.Price__c;               // No change, already Decimal
		}

		order.TotalProductCount__c = totalCount;   // Integer field
		order.TotalPrice__c = totalPrice;         // Decimal field
	}

	update ordersToUpdate;
}
