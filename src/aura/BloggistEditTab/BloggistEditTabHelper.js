({
    convertToMarkdown: function (text, component) {
        // Set options
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
        var htmlOutputDiv = document.getElementById("output");
        htmlOutputDiv.innerHTML = output;
    },

    autoSave: function (component, event, helper) {
        var lastText = document.getElementById("output").innerHTML;
        component.set("v.simpleRecord.Content__c", lastText);
        component.find("recordData").saveRecord($A.getCallback(function (saveResult) {
            if (saveResult.state === "SUCCESS") {
                // record is saved successfully
                var resultsToast = $A.get("e.force:showToast");
                resultsToast.setParams({
                    "title": "Saved",
                    "message": "Saved!",
                    "type": "success",
                    "mode": "pester"
                });
                resultsToast.fire();
            } else if (saveResult.state === "INCOMPLETE") {
                // handle the incomplete state
                console.log("User is offline, device doesn't support drafts.");
            } else if (saveResult.state === "ERROR") {
                // handle the error state
                console.log('Problem saving post, error: ' + JSON.stringify(saveResult.error));
            } else {
                console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
            }
        }))
    },
    shorcutManager: function (component, e) {

        var isControlHold = component.get("v.isCtrlHold");
        var isShiftHold = component.get("v.isShiftHold");
        var keyPressed = e.which;

        switch (keyPressed) {
            case 76: //76 is the code of L button
                if (isControlHold) {
                    if (isShiftHold) {
                        e.preventDefault(); //prevent browser from the default behavior

                        //Insert block of code 
                        var text = component.get("v.updatedText");
                        text = "```insert_code_here```" + text;
                        component.set("v.updatedText", text);

                    }
                    else {
                        e.preventDefault(); //prevent browser from the default behavior

                        //Insert inline code 
                        var text = component.get("v.updatedText");
                        text = "`insert_code_here`" + text;
                        component.set("v.updatedText", text);
                    }
                } break;
            case 73: //76 is the code of I button
                if (isControlHold) {
                    e.preventDefault(); //prevent browser from the default behavior

                    //Render as italic 
                    var text = component.get("v.updatedText");
                    text = "*insert_text_here*" + text;
                    component.set("v.updatedText", text);
                } break;
            case 66: //76 is the code of B button
                if (isControlHold) {
                    e.preventDefault(); //prevent browser from the default behavior

                    //Render as bold 
                    var text = component.get("v.updatedText");
                    text = "**insert_text_here**" + text;
                    component.set("v.updatedText", text);
                } break;
        }
    }
})