({
    convertToMarkdown : function(text) {
        
        console.log("helper-markdown");        
        
        // Set options
		/*
        marked.setOptions({
            renderer: new marked.Renderer(),            
            pedantic: false,
            gfm: true,
            tables: true,
            breaks: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false
        });
        */
         marked.setOptions({
         "baseUrl": null,
         "breaks": false,
         "gfm": true,
         "headerIds": true,
         "headerPrefix": "",
         "highlight": null,
         "langPrefix": "language-",
         "mangle": true,
         "pedantic": false,
         "sanitize": false,
         "sanitizer": null,
         "silent": false,
         "smartLists": false,
         "smartypants": false,
         "tables": true,
         "xhtml": false
        });
        
        
        
        // Compile
        var output = marked(text); 
        console.log(output);        
        var htmlOutputDiv = document.getElementById("output");
        htmlOutputDiv.innerHTML = output;
    },
    
    autoSave : function (component, event, helper){        
    var lastText = document.getElementById("output").innerHTML;
    component.set("v.simpleRecord.Content__c", lastText);
	component.find("recordData").saveRecord($A.getCallback(function(saveResult) {
                if (saveResult.state === "SUCCESS") {
                    // record is saved successfully
                    var resultsToast = $A.get("e.force:showToast");
                    resultsToast.setParams({
                        "title": "Saved",
                        "message": "Saved!"
                    });
                    resultsToast.fire();
                } else if (saveResult.state === "INCOMPLETE") {
                    // handle the incomplete state
                    //console.log("User is offline, device doesn't support drafts.");
                } else if (saveResult.state === "ERROR") {
                    // handle the error state
                    //console.log('Problem saving post, error: ' + 
                                 //JSON.stringify(saveResult.error));
                } else {
                   // console.log('Unknown problem, state: ' + saveResult.state +
                               // ', error: ' + JSON.stringify(saveResult.error));
                }
            }))
        
    }
   
})