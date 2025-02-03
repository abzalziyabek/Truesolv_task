@IsTest
private class UserControllerTest {

	static testMethod void testGetCurrentUser() {
		// Get the current user in the test context
		User currentUser = [SELECT Id, IsManager__c FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];

		Test.startTest();
		User resultUser = UserController.getCurrentUser();
		Test.stopTest();

		System.assertNotEquals(null, resultUser, 'User should be retrieved.');
		System.assertEquals(currentUser.Id, resultUser.Id, 'Retrieved user ID should match current user.');
	}
}
