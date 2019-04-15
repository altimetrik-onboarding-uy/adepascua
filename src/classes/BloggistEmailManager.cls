global class BloggistEmailManager implements Database.Batchable<sObject>, Database.Stateful {
	
	global Integer recordsProcessed = 0;	
	string header = 'Posts for review: \n';
	string body = '';
	string subject = 'Daily reminder - Posts for review';
	
	global Database.QueryLocator start(Database.BatchableContext bc) {
		return Database.getQueryLocator('SELECT ID, Author__c, Name, Published_Date__c, Status__c FROM Post__c WHERE Status__c = \'Under Review\'');
	}

   	global void execute(Database.BatchableContext bc, List<Post__c> scope) {	

		for (Post__c post : scope){
			recordsProcessed = recordsProcessed + 1;
			body = body + ' ' + recordsProcessed + ') ' + post.Name + '\n';
		}	
		System.debug('Body: ' + body);			
	}
	
	global void finish(Database.BatchableContext bc) {

		Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();

		System.debug(recordsProcessed + ' records processed. Shazam!');
        AsyncApexJob job = [SELECT Id, Status, NumberOfErrors, 
            JobItemsProcessed,
            TotalJobItems, CreatedBy.Email
            FROM AsyncApexJob
            WHERE Id = :bc.getJobId()];	
		
		//Get the manager profile
		List<User> managers = [SELECT id, Email FROM User WHERE UserRole.Name = 'Manager'];

		//Instance email list
		List<String> emailList = new List<String>();

		for (User user : managers){

			//Add managers emails
			emailList.add(user.Email);

			//Add your own email address for test
			emailList.add('adepascua@altimetrik.com');
		}

		//Set addresses
		mail.setToAddresses(emailList);
		//Set body
		string fullbody = header + body;
		mail.setPlainTextBody(fullbody);
		//Set subject
		mail.setSubject(subject);		 
		
        Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage> {mail};
        Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);		
	}	
}