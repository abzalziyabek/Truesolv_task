@IsTest
private class CartControllerTest {
	static testmethod void testCheckoutCart_Success() {
		Account testAccount = new Account(Name = 'Test Account');
		insert testAccount;

		Product__c testProduct = new Product__c(Name = 'Test Product', Price__c = 50);
		insert testProduct;

		List<Map<String, Object>> cartItems = new List<Map<String, Object>>();
		Map<String, Object> cartItem = new Map<String, Object>{
		'productId' => testProduct.Id,
		'quantity' => 2,
		'price' => 50
		};
		cartItems.add(cartItem);

		Test.startTest();
		Order__c newOrder = CartController.checkoutCart(testAccount.Id, cartItems);
		Test.stopTest();

		System.assertNotEquals(null, newOrder, 'Order should be created.');
		System.assertEquals(testAccount.Id, newOrder.Account__c, 'Order should be linked to correct Account.');

		List<OrderItem__c> orderItems = [SELECT Id, Order_Reference__c, Product_Reference__c, Quantity__c, Price__c
		FROM OrderItem__c WHERE Order_Reference__c = :newOrder.Id];
		System.assertEquals(1, orderItems.size(), 'One order item should be created.');
		System.assertEquals(testProduct.Id, orderItems[0].Product_Reference__c, 'Order item should reference correct product.');
		System.assertEquals(2, orderItems[0].Quantity__c, 'Quantity should match cart.');
		System.assertEquals(50, orderItems[0].Price__c, 'Price should match cart.');
	}
}
