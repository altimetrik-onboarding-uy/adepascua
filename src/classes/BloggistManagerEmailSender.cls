global class BloggistManagerEmailSender implements Schedulable {
	global void execute(SchedulableContext sc) {
		BloggistEmailManager sendEmails = new BloggistEmailManager();
		database.executebatch(sendEmails);
	}
}