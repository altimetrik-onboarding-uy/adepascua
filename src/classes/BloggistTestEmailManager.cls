@isTest
private class BloggistTestEmailManager {    
    public static String CRON_EXP = '0 0 0 ? * * *';    
    
    static testMethod void testPost(){
        List<Post__c> postList = new List<Post__c>();
            for (Integer i=0; i<10; i++){
                Post__c testPost = new Post__c(
                    Author__c = '0031U000004cP2qQAE',
                    Name = 'Test' + i,
                    Status__c = 'Under Review',
                    Tags__c = 'Debate'                    
                    );
                postlist.add(testPost);
            }     

    insert postList;

    // Get the IDs of the opportunities we just retrieved
    Map<Id, Post__c> postListMap = new Map<Id, Post__c>(postList);
    List<Id> postListIds = new List<Id>(postListMap.keySet());
    
    Test.startTest();
    // Schedule the test job
    String jobId = System.schedule('testBasicScheduledApex2', CRON_EXP ,new BloggistManagerEmailSender());
    
    // Verify the scheduled job has not run yet.
    List<Task> lt = [SELECT Id 
                     FROM Task 
                     WHERE WhatId IN :postListIds];
    
    System.assertEquals(10, postList.size(), 'Tasks exist before job has run');
    // Stopping the test will run the job synchronously
    Test.stopTest();   

    }

}