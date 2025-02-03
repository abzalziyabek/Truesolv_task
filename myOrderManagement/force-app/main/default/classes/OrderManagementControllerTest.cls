@IsTest
private class OrderManagementControllerTest {

	@testSetup
	static void setupTestData() {
		// Create sample products
		List<Product__c> testProducts = new List<Product__c>{
				new Product__c(Name = 'Product A', Description__c = 'Test Description A', TypeVal__c = 'something', FamilyVal__c = 'something', Price__c = 100),
				new Product__c(Name = 'Product B', Description__c = 'Test Description B', TypeVal__c = 'something', FamilyVal__c = 'something', Price__c = 200)
				};
		insert testProducts;

		// Create test Account
		Account testAccount = new Account(Name = 'Test Account', AccountNumber = '123456');
		insert testAccount;
	}

	static testMethod void testGetProducts() {
		Test.startTest();
		List<Product__c> products = OrderManagementController.getProducts();
		Test.stopTest();

		System.assertNotEquals(0, products.size(), 'Product list should not be empty.');
		System.assertEquals(2, products.size(), 'There should be 2 test products.');
	}

	static testMethod void testCreateProduct() {
		Test.startTest();
		Id productId = OrderManagementController.createProduct('New Product', 'New Description', 'something', 'something', 300);
		Test.stopTest();

		// Verify product was created
		Product__c createdProduct = [SELECT Id, Name, Image__c FROM Product__c WHERE Id = :productId LIMIT 1];

		System.assertNotEquals(null, createdProduct, 'Created product should not be null.');
		System.assertEquals('New Product', createdProduct.Name, 'Product name should match.');
		System.assert(createdProduct.Image__c.contains('http://www.glyffix.com/api/Image?word=New+Product'),
				'Image URL should contain encoded product name.');
	}

	static testMethod void testGetAccountDetails_ValidId() {
		Account testAccount = [SELECT Id FROM Account LIMIT 1];

		Test.startTest();
		Account resultAccount = OrderManagementController.getAccountDetails(testAccount.Id);
		Test.stopTest();

		System.assertNotEquals(null, resultAccount, 'Account should be retrieved.');
		System.assertEquals(testAccount.Id, resultAccount.Id, 'Retrieved account ID should match.');
	}

}
