trigger OrderTrigger on OrderItem__c (after insert, after update, after delete) {
	Set<Id> orderIds = new Set<Id>();
	for (OrderItem__c item : Trigger.new) {
		orderIds.add(item.OrderId__c);
	}

	List<Order__c> ordersToUpdate = [SELECT Id, TotalProductCount__c, TotalPrice__c FROM Order__c WHERE Id IN :orderIds];
	for (Order__c order : ordersToUpdate) {
		List<OrderItem__c> items = [SELECT Quantity__c, Price__c FROM OrderItem__c WHERE OrderId__c = :order.Id];
		Integer totalCount = 0;
		Decimal totalPrice = 0;
		for (OrderItem__c item : items) {
			totalCount += item.Quantity__c;
			totalPrice += item.Price__c;
		}
		order.TotalProductCount__c = totalCount;
		order.TotalPrice__c = totalPrice;
	}
	update ordersToUpdate;
}
