public with sharing class UserController {
	@AuraEnabled(cacheable=true)
	public static Boolean isManager() {
		try {
			User currentUser = [SELECT IsManager_c__c FROM User WHERE Id = :UserInfo.getUserId()];
			return currentUser.IsManager_c__c;
		} catch (Exception e) {
			System.debug('Error fetching IsManager_c__c: ' + e.getMessage());
			return false;
		}
	}
}
