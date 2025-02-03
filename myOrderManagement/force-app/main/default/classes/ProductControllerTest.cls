@IsTest
private class ProductControllerTest {

	@testSetup
	static void setupTestData() {
		// Create test products
		List<Product__c> testProducts = new List<Product__c>{
				new Product__c(Name = 'Test Product A', Description__c = 'Description A', TypeVal__c = 'Type 1', FamilyVal__c = 'Family 1', Price__c = 100),
				new Product__c(Name = 'Test Product B', Description__c = 'Description B', TypeVal__c = 'Type 1', FamilyVal__c = 'Family 1', Price__c = 200)
				};
		insert testProducts;
	}

	static testMethod void testGetProductDetails_ValidId() {
		Product__c testProduct = [SELECT Id FROM Product__c LIMIT 1];

		Test.startTest();
		Product__c resultProduct = ProductController.getProductDetails(testProduct.Id);
		Test.stopTest();

		System.assertNotEquals(null, resultProduct, 'Product should be retrieved.');
		System.assertEquals(testProduct.Id, resultProduct.Id, 'Retrieved product ID should match.');
	}


	static testMethod void testCreateProduct() {
		Product__c newProduct = new Product__c(
				Name = 'New Product',
				Description__c = 'New Description',
				TypeVal__c = 'something',
				FamilyVal__c = 'something',
				Price__c = 500
		);

		Test.startTest();
		ProductController.createProduct(newProduct);
		Test.stopTest();

		List<Product__c> products = [SELECT Id, Name FROM Product__c WHERE Name = 'New Product' LIMIT 1];

		System.assertNotEquals(0, products.size(), 'Product should be created.');
		System.assertEquals('New Product', products[0].Name, 'Product name should match.');
	}
}
