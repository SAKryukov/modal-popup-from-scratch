    "use strict";

    window.onload = () => {

        if (namedCaller && modalPopup && AutoAccessKey)
            document.querySelector("aside").style.display = "none";
    
        const elements = {
            console: document.querySelector("main > section"),
            buttonParent: document.querySelector("header > section"),
            scrollParent: document.querySelector("main"),
            date: document.querySelector("footer small span:first-of-type"),
            version: document.querySelector("footer small span:last-of-type"),
        } //elements

        elements.date.textContent = modalPopup.date;
        elements.version.textContent = modalPopup.version;
     
        const demo = () => {

            (function () {
                const tryNonBlocking = document.getElementById("tryNonBlocking");
                modifyElementAccessKey(tryNonBlocking, 2);
                tryNonBlocking.onclick = function () {
                    add("Before Popup");
                    modalPopup.show("Not blocking", null, { textAlign: "center", dimmerOpacity: 0.25, backgroundColor: { buttonPad: "gray" } });
                    add("After Popup");
                }; //tryNonBlocking
                document.getElementById("tryAlert").onclick = function (ev) {
                    add("Before Alert");
                    alert("Blocking");
                    add("After Alert");
                    ev.preventDefault();
                    return false;
                }; //tryAlert
            })();

            addButton("Default", () => {
                modalPopup.show();
            }, 1);

            addButton("Some Content", () => {
                modalPopup.show("Some content&hellip;<br/><br/>Try to drag this window with mouse, compare with next demo.<br/><br/>Also try to resize the browser window.");
            });

            addButton("Disabled Drag", () => {
                modalPopup.show("Disabled drag&hellip;<br/><br/>Try to drag this window with mouse.<br/><br/>Try to resize the browser window &mdash; adjustment of modal popup location always works.",
                null,
                { allowDragging: false });
            });

            const p = namedCaller(function(content, buttonDescriptors, styles, endModalStateHandler) {
                try {
                    modalPopup.show(content, buttonDescriptors, styles, endModalStateHandler);
                } catch (e) {
                    alert(e.toString());
                } //exception
            }); //namedCaller

            addButton("Custom Buttons", () => {
                p(
                    p.content = "Custom buttons",
                    p.buttonDescriptors = [
                        { text: "Yes" },
                        { default: true, text: "No" },
                        { escape: true, text: "Close" }
                    ],
                p.styles = { backgroundColor: { message: "Cornsilk", buttonPad: "Chocolate" } });
            }, 7);

            addButton("Changed Access Key", () => {
                p(
                    p.content = "Pay attention for the access key for \"Y<u>e</u>s\"; it is shifted to the letter 'e' (underlined)",
                    p.buttonDescriptors = [
                        { text: "Yes", access: 1 },
                        { default: true, text: "No" },
                        { escape: true, text: "Close" }
                    ],
                p.styles = { backgroundColor: { message: "Cornsilk", buttonPad: "Chocolate" } });
            });

            addButton("Button Actions", () => {
                p(
                    p.content = "<p>Button Actions</p><br/>(Click a button or press Escape key)",
                    p.buttonDescriptors = [
                        { text: "Yes", action: function () { add("Pressed Yes"); } },
                        { default: true, text: "No", action: function () { add("Pressed No"); } },
                        { escape: true, text: "Close", action: function () { add("Pressed Close"); } }
                    ],
                p.styles = { backgroundColor: { message: "Cornsilk", buttonPad: "Chocolate" } });
            });

            addButton("More Styles", () => {
                p(
                    p.content = "<b>Modified</b> window and button colors, text alignment, aspect ratio, text colors, padding, border radius for message window and buttons, button spacing, horizontal line thickness and color",
                    p.buttonDescriptors = [
                        { text: "Yes", action: function () { add("Pressed Yes"); } },
                        { default: true, text: "No", action: function () { add("Pressed No"); } },
                        { escape: true, text: "Close", action: function () { add("Pressed Close"); } }
                    ],
                p.styles = {
                    width: "24em",
                    thickness: { horizontalLine: "6px", buttonBorder : "4px" },
                    textAlign: "center",
                    backgroundColor: { message: "Cornsilk", buttonPad: "Chocolate", button: "#b3dbff" },
                    textLineColor: { message: "brown", horizontalLine: "saddleBrown", button: "navy", buttonBorder: "maroon" },
                    borderRadius: { window: 0, button: "16px" },
                    padding: {
                        textPad: { horizontal: "1.8em", vertical: "1.2em" },
                        buttonPad: { horizontal: "1.2em", vertical: "1em" },
                        button: { horizontal: "1.6em", vertical: "0.6em"},
                        buttonSpacing: "1.4em" }
                });
            });

            addButton("Modified Dimming", () => {
                p(
                    p.content = "Modified dimming color/opacity",
                    p.styles = { dimmerOpacity: 0.4, dimmerColor: "DarkMagenta", backgroundColor: { message: "black" }, textLineColor: { message: "yellow" } });
            });

            (function () {
                const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
                addButton("Long Text", function () { modalPopup.show(loremIpsum); });
                addButton("Long Text, Custom Aspect Ratio", function () { modalPopup.show(loremIpsum, null, { width: "26em" }); });
            })();
            
            addButton("Closing Action", () => {
                modalPopup.show(
                    "Notification on closing",
                    [{ text: "Try it", escape: true, action: function () { add("Button Action"); } }],
                    { textAlign: "center" }, function () { add("Closing Action"); });
            });

            addButton("Formatted", () => {
                p(
                    p.content = "<h2>You win!</h2><hr/>Do you want to play again?",
                    p.buttonDescriptors = [
                        { default: true, text: "No", action: function () { add("Pressed No"); } },
                        { text: "I'm Feeling Lucky :-)", escape: true, access: 12, action: function () { add("Pressed Yes"); } },
                    ],
                p.styles = {
                    width: "18em",
                    textAlign: "center",
                    dimmerOpacity: 0.55,
                    backgroundColor: { message: "Cornsilk", buttonPad: "Chocolate" },
                    padding: {
                        buttonSpacing: "1.2em",
                        button: { horizontal: "1.0em", vertical: "0.2em" }
                    }
                });
            });

            (function () {
                const content = modalPopup.prepareContentById("heavilyFormattedSample");
                const heavilyFormattedButton = addButton("Heavily Formatted", function () {
                    let cancel = false;
                    let formatOption = (isChecked, option) => {
                        return "<dd>{0}: {1}</dd>".format(option, isChecked)
                    } //formatOption
                    p(
                        p.content = content,
                        p.buttonDescriptors = [
                            { text: "Apply", action: function () { cancel = false; add("Use features:"); } },
                            { default: true, escape: true, text: "Cancel", action: function () { cancel = true; add("Cancel"); } }
                        ],
                        p.styles = {
                            width: null,
                            padding: {
                                button: { horizontal: "1.8em", vertical: "0.4em" },
                                buttonSpacing: "2.2em",
                                textPad: { horizontal: "1.8em", vertical: "1em" },
                                buttonPad: { horizontal: "1.4em", vertical: "0.8em" }
                            },
                            backgroundColor: { message: "#FFFFCC", buttonPad: "#C2C2EB" }
                        },
                        p.endModalStateHandler = () => {
                            if (cancel) return;
                            const widthToContent = document.getElementById("widthToContent");
                            const handleEscape = document.getElementById("handleEscape");
                            const defineDefault = document.getElementById("defineDefault");
                            const disableDrag = document.getElementById("disableDrag");
                            const defineClosing = document.getElementById("defineClosing");
                            const insanity = document.getElementById("insanity");
                            add(formatOption(widthToContent.checked, "Use width-to-content feature"));
                            add(formatOption(handleEscape.checked, "Handle Escape button"));
                            add(formatOption(defineDefault.checked, "Define default button"));
                            add(formatOption(disableDrag.checked, "Disable drag"));
                            add(formatOption(defineClosing.checked, "Define closing action"));
                            add("<dd>Use insanity level: {0}</dd>".format(insanity.value));
                        } //p.endModalStateHandler
                    );
                });
                heavilyFormattedButton.style.color = "brown";
                heavilyFormattedButton.style.fontWeight = "bold";
                heavilyFormattedButton.style.paddingLeft = "1.2em";
                heavilyFormattedButton.style.paddingRight = "1.2em";
            })();

            addButton("Width to Content, Equalized Button Widths", () => {
                p(
                    p.content = "<h2>You win!</h2><hr/>Do you want to play again?",
                    p.buttonDescriptors = [
                        { text: "No", action: function () { add("Pressed No"); } },
                        { default: true, escape: true, text: "I'm Feeling Lucky :-)", access: 12, action: function () { add("Pressed Yes"); } },
                    ],
                p.styles = {
                    width: null,
                    textAlign: "center",
                    equalizeButtonWidths: true,
                    backgroundColor: { message: "Cornsilk", buttonPad: "Chocolate" },
                    padding: {
                        buttonSpacing: "1.2em",
                        button: { horizontal: "1.0em", vertical: "0.2em" },
                        buttonPad: { horizontal: "1.4em", vertical: "0.4em" }
                    }
                });
            });

            addButton("Width to Content, Dominated by Message Text", () => {
                p(
                    p.content = "Pretty long message text, no word wrapping. The width of this text defines its container width&hellip;",
                    p.buttonDescriptors = [
                        { text: "One", action: function () { add("Pressed 1"); } },
                        { text: "Two", action: function () { add("Pressed 2"); } },
                        { text: "Three", action: function () { add("Pressed 3"); } },
                        { text: "Four", action: function () { add("Pressed 4"); } },
                        { escape: true, text: "Cancel", action: function () { add("Cancel"); } },
                    ],
                p.styles = { width: null });
            });

            addButton("No Escape Handling", () => {
                p(
                    p.content = "Escape handling is disabled:<br/><br/>Press Escape to check up if it works or not.<br/><br/>Also pay attention for changed default button.",
                    p.buttonDescriptors = [
                        { default: true, text: "Yes", action: function () { add("Pressed Yes"); } },
                        { text: "No", action: function () { add("Pressed No"); } },
                        { text: "Close", action: function () { add("Pressed Close"); } }
                    ],
                    p.styles = { backgroundColor: { message: "Cornsilk", buttonPad: "Chocolate" } });
            });

        }; //demo

        const autoAccessKey = new AutoAccessKey("ijcfn");
        const add = function (content) {
            const p = document.createElement("p");
            p.innerHTML = content;
            elements.console.appendChild(p);
            elements.scrollParent.scrollTop = elements.scrollParent.scrollHeight;
        }; //add
        const addButton = (caption, handler, forceAccessKeyIndex) => {
            const btn = document.createElement("button");
            const access = autoAccessKey.next(caption, forceAccessKeyIndex);
            btn.innerHTML = access.value;
            btn.accessKey = access.accessKey;
            btn.onclick = handler;
            btn.style.marginRight = window.getComputedStyle(elements.buttonParent).getPropertyValue("padding-left");
            btn.style.marginBottom = window.getComputedStyle(elements.buttonParent).getPropertyValue("padding-top");
            elements.buttonParent.appendChild(btn);
            return btn;
        }; //addButton
        const modifyElementAccessKey = (element, forceAccessKeyIndex) => {
            const access = autoAccessKey.next(element.innerHTML, forceAccessKeyIndex);
            element.innerHTML = access.value;
            element.accessKey = access.accessKey;
        }; //modifyElementAccessKey

        try { demo(); } catch (ex) {
            alert(ex);
        }

    }; //window.onload
