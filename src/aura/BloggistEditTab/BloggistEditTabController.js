({
    recordUpdated: function (component, event, helper) {
        var changeType = event.getParams().changeType;
        if (changeType === "ERROR") { /* handle error; do this first! */ }
        else if (changeType === "LOADED") {
            var loadedText = component.get("v.simpleRecord.Content__c");
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
        helper.submitForApproval(component);
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
            if (e.which === 17) //17 is the code of Ctrl button
                component.set("v.isCtrlHold", false);
            if (e.which === 16) //16 is the code of Shift button
                component.set("v.isShiftHold", false);
        }
        document.onkeydown = function (e) {
            if (e.which === 17)
                component.set("v.isCtrlHold", true);
            if (e.which === 16)
                component.set("v.isShiftHold", true);
            helper.shorcutManager(component, e);
        }
    }
})