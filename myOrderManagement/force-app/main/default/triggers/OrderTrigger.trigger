trigger OrderTrigger on OrderItem__c (after insert, after update, after delete) {
	Set<Id> orderIds = new Set<Id>();

	if (Trigger.isInsert || Trigger.isUpdate) {
		for (OrderItem__c item : Trigger.new) {
			orderIds.add(item.Order__c);  // Updated field name
		}
	}
	if (Trigger.isDelete) {
		for (OrderItem__c item : Trigger.old) {
			orderIds.add(item.Order__c);  // Updated field name
		}
	}
	// ... further processing ...
}
