public with sharing class CartController {
	@AuraEnabled
	public static Order__c checkoutCart(Id accountId, List<Map<String, Object>> cartItems) {

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

			for (Map<String, Object> item : cartItems) {
				String productId = (String) item.get('productId');
				Integer quantity = ((Decimal) item.get('quantity')).intValue();
				Decimal price = (Decimal) item.get('price');

				System.debug('Processing Cart Item - Product ID: ' + productId);

				if (productId == null || productId == '') {
					throw new AuraHandledException('Product ID is missing for an Order Item.');
				}

				OrderItem__c orderItem = new OrderItem__c(
						Order_Reference__c = newOrder.Id,
						Product_Reference__c = productId,
						Quantity__c = quantity,
						Price__c = price
				);

				orderItemsToInsert.add(orderItem);
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
}

