public class OrderItemTrigger {
	public static void updateOrderTotals(Set<Id> orderIds) {
		System.debug('🔄 Handling Order Totals Update for Orders: ' + orderIds);
	}
}


//trigger OrderTrigger on OrderItem__c (after insert, after update, after delete) {
//	Set<Id> orderIds = new Set<Id>();
//
//	if (Trigger.isInsert || Trigger.isUpdate) {
//		for (OrderItem__c item : Trigger.new) {
//			orderIds.add(item.Order_Reference__c); // Ensure you're using the correct API name
//		}
//	}
//
//	if (Trigger.isDelete) {
//		for (OrderItem__c item : Trigger.old) {
//			orderIds.add(item.Order_Reference__c);
//		}
//	}
//
//	List<Order__c> ordersToUpdate = new List<Order__c>();
//
//	try {
//		// Use the correct relationship name "OrderItems__r"
//		for (Order__c order : [SELECT Id, (SELECT Quantity__c, Price__c FROM OrderItems__r) FROM Order__c WHERE Id IN :orderIds]) {
//			Decimal totalPrice = 0;
//			Integer totalProducts = 0;
//
//			for (OrderItem__c item : order.OrderItems__r) {
//				totalPrice += item.Price__c * item.Quantity__c;
//				totalProducts += Integer.valueOf(item.Quantity__c);
//			}
//
//			order.TotalPrice__c = totalPrice;
//			order.TotalProductCount__c = totalProducts;
//			ordersToUpdate.add(order);
//		}
//
//		if (!ordersToUpdate.isEmpty()) {
//			update ordersToUpdate;
//		}
//	} catch (Exception e) {
//		System.debug('SOQL Error: ' + e.getMessage());
//	}
//}
