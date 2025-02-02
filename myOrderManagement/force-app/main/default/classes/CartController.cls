public with sharing class CartController {
	@AuraEnabled
	public static Order__c checkoutCart(Id accountId, List<OrderItemWrapper> cartItems) {

		System.debug('Checkout Started - Account ID: ' + accountId);
		System.debug('Cart Items Received: ' + JSON.serialize(cartItems));

		if (accountId == null) {
			System.debug('ERROR: Account ID is NULL!');
			throw new AuraHandledException('Account ID is required.');
		}
		if (cartItems == null || cartItems.isEmpty()) {
			System.debug('ERROR: Cart is EMPTY!');
			throw new AuraHandledException('Cart cannot be empty.');
		}

		try {
			Order__c newOrder = new Order__c(Account__c = accountId);
			insert newOrder;
			System.debug('Order Created - ID: ' + newOrder.Id);

			List<OrderItem__c> orderItemsToInsert = new List<OrderItem__c>();

			for (OrderItemWrapper item : cartItems) {
				System.debug('Processing Order Item - ' + JSON.serialize(item));

				if (item.productId == null || item.productId == '') {
					System.debug('ERROR: Missing Product ID!');
					continue;
				}

				orderItemsToInsert.add(new OrderItem__c(
						Order_Reference__c = newOrder.Id,
						Product_Reference__c = item.productId,
						Quantity__c = item.quantity,
						Price__c = item.price
				));

			}
			if (!orderItemsToInsert.isEmpty()) {
				insert orderItemsToInsert;  //
				System.debug('Order Items Created: ' + orderItemsToInsert.size());
			} else {
				System.debug('No valid order items to insert!');
			}

			return newOrder;

		} catch (Exception e) {
			System.debug('Checkout Failed: ' + e.getMessage());
			throw new AuraHandledException('Checkout failed: ' + e.getMessage());
		}
	}

	public class OrderItemWrapper {
		@AuraEnabled public String productId;
		@AuraEnabled public Integer quantity;
		@AuraEnabled public Integer price;
	}
}
