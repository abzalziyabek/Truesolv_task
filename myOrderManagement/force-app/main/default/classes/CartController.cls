public with sharing class CartController {

	@AuraEnabled
	public static void addToCart(Id orderId, Id productId, Integer quantity, Decimal price) {
		if (orderId == null || productId == null || quantity == null || price == null) {
			throw new AuraHandledException('Missing required parameters.');
		}

		// Create a new Order Item with correct relationship
		OrderItem__c newItem = new OrderItem__c(
				Order_Reference__c = orderId,  // UPDATED FIELD NAME
				Product_ref__c = productId,    // UPDATED FIELD NAME
				Quantity__c = quantity,
				Price__c = price
		);

		insert newItem;
	}
}
