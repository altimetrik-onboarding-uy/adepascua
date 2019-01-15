({

    recordUpdated: function (component, event, helper) {
        var changeType = event.getParams().changeType;
        if (changeType === "ERROR") { /* handle error; do this first! */ }
        else if (changeType === "LOADED") {
            var loadedText = component.get("v.simpleRecord.Content__c")
            component.set("v.updatedText", loadedText);
            var input = component.find("input").get("v.value");
            helper.convertToMarkdown(input);
        }
        else if (changeType === "REMOVED") { /* handle record removal */ }
        else if (changeType === "CHANGED") {
        }
    },
    handleSelect: function (component, event, helper) {
        var stepName = event.getParam("detail").value;
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "message": "Toast from " + stepName
        });
        toastEvent.fire();
    },

    submitForApproval: function (component, event, helper) {
        if (component.get("v.simpleRecord.Status__c") == "Draft") {
            component.set("v.simpleRecord.Status__c", "Under Review");
            component.set("v.simpleRecord.Submit_for_Approval__c", true)
            component.find("recordData").saveRecord(function (saveResult) {
                if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                    // record is saved successfully
                    var resultsToast = $A.get("e.force:showToast");
                    resultsToast.setParams({
                        "title": "Saved",
                        "message": "Post submitted for review."
                    });
                    resultsToast.fire();
                } else if (saveResult.state === "INCOMPLETE") {
                    // handle the incomplete state
                    console.log("User is offline, device doesn't support drafts.");
                } else if (saveResult.state === "ERROR") {
                    // handle the error state
                    console.log('Problem saving post, error: ' +
                        JSON.stringify(saveResult.error));
                } else {
                    console.log('Unknown problem, state: ' + saveResult.state +
                        ', error: ' + JSON.stringify(saveResult.error));
                }
            });
        }
        else {
            var resultsToast = $A.get("e.force:showToast");
            resultsToast.setParams({
                "title": "Notice:",
                "message": "This post has already submitted for review."
            });
            resultsToast.fire();
        }
    },
    textUpdated: function (component, event, helper) {
        var input = component.find("input").get("v.value");
        helper.convertToMarkdown(input);
        window.setTimeout($A.getCallback(function () {
            helper.autoSave(component, event, helper);
        }), 3000
        );
    },
    markdownInputOnFocus: function (component, event, helper) {
        var ctrlhold = component.get("v.isCtrlHold");
        var shifthold = component.get("v.isShiftHold");
        document.onkeyup = function (e) {
            if (e.which == 17) //17 is the code of Ctrl button
                component.set("v.isCtrlHold", false);
            if (e.which == 16) //16 is the code of Shift button
                component.set("v.isShiftHold", false);
        }
        document.onkeydown = function (e) {
            if (e.which == 17)
                component.set("v.isCtrlHold", true);
            if (e.which == 16)
                component.set("v.isShiftHold", true);
            helper.shorcutManager(component, e);
        }
    }
})