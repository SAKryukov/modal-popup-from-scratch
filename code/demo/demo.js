/*

Modal Popup and Modal Dialog

v.4.2

Copyright (c) 2015, 2019, 2023, 2025 by Sergey A Kryukov
http://www.SAKryukov.org
http://www.codeproject.com/Members/SAKryukov

Published: http://www.codeproject.com/Articles/1061121/ModalPopupFromScratch

*/
"use strict";

window.onload = () => {

    const definitionSet = {
        colors: {
            message: "Cornsilk",
            buttonPad: "hsl(6, 70%, 40%, 100%)",
        }, //colors
    }; //definitionSet

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

        const p = namedCaller(function (content, buttonDescriptors, styles, endModalStateHandler) {
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
                p.styles = { backgroundColor: { message: definitionSet.colors.message, buttonPad: "hsl(6, 70%, 40%, 100%)" } });
        }, 7);

        addButton("Changed Access Key", () => {
            p(
                p.content = "Pay attention for the access key for \"Y<u>e</u>s\"; it is shifted to the letter 'e' (underlined)",
                p.buttonDescriptors = [
                    { text: "Yes", access: 1 },
                    { default: true, text: "No" },
                    { escape: true, text: "Close" }
                ],
                p.styles = { backgroundColor: { message: definitionSet.colors.message, buttonPad: definitionSet.colors.buttonPad } });
        });

        addButton("Button Actions", () => {
            p(
                p.content = "<p>Button Actions</p><br/>(Click a button or press Escape key)",
                p.buttonDescriptors = [
                    { text: "Yes", action: function () { add("Pressed Yes"); } },
                    { default: true, text: "No", action: function () { add("Pressed No"); } },
                    { escape: true, text: "Close", action: function () { add("Pressed Close"); } }
                ],
                p.styles = { backgroundColor: { message: definitionSet.colors.message, buttonPad: definitionSet.colors.buttonPad } });
        });

        addButton("Modified Dimming", () => {
            p(
                p.content = "Modified dimming color/opacity",
                p.styles = { dimmerOpacity: 0.4, dimmerColor: "DarkMagenta", backgroundColor: { message: "black" }, textLineColor: { message: "yellow" } });
        });

        (function () {
            const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
            addButton("Long Text, Custom Aspect Ratio", function () { modalPopup.show(loremIpsum, null, { width: "26em" }); });
        })();

        addButton("Closing Action", () => {
            modalPopup.show(
                "Notification on closing",
                [{ text: "Try it", escape: true, action: function () { add("Button Action"); } }],
                { textAlign: "center" }, function () { add("Closing Action"); });
        });

        addButton("More Styles", () => {
            p(
                p.content = "<b>Modified</b> window and button colors, text alignment, button focus outline, aspect ratio, text colors, padding, border radius for message window and buttons, button spacing, horizontal line thickness and color",
                p.buttonDescriptors = [
                    { text: "Yes", action: function () { add("Pressed Yes"); } },
                    { default: true, text: "No", action: function () { add("Pressed No"); } },
                    { escape: true, text: "Close", action: function () { add("Pressed Close"); } }
                ],
                p.styles = {
                    width: "24em",
                    buttonFocusOutline: "dotted 5px yellow",
                    thickness: { horizontalLine: "6px", buttonBorder: "4px" },
                    textAlign: "center",
                    backgroundColor: { message: definitionSet.colors.message, buttonPad: definitionSet.colors.buttonPad, button: "#b3dbff" },
                    textLineColor: { message: "brown", horizontalLine: "saddleBrown", button: "navy", buttonBorder: "maroon" },
                    borderRadius: { window: 0, button: "16px" },
                    padding: {
                        textPad: { horizontal: "1.8em", vertical: "1.2em" },
                        buttonPad: { horizontal: "1.2em", vertical: "1em" },
                        button: { horizontal: "1.6em", vertical: "0.6em" },
                        buttonSpacing: "1.4em"
                    }
                });
        });

        addButton("Formatted", () => {
            p(
                p.content = "<h2>You win!</h2><hr/>Do you want to play again?",
                p.buttonDescriptors = [
                    { default: true, text: "No", action: function () { add("Pressed No"); } },
                    { text: "I'm Feeling Lucky :-)", escape: true, access: 12, action: function () { add("Pressed Yes"); } },
                ],
                p.styles = {
                    width: "22em",
                    textAlign: "center",
                    dimmerOpacity: 0.55,
                    backgroundColor: { message: definitionSet.colors.message, buttonPad: definitionSet.colors.buttonPad },
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
                    backgroundColor: { message: definitionSet.colors.message, buttonPad: definitionSet.colors.buttonPad },
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
        }, undefined, true);

        addButton("Disabled Drag", () => {
            modalPopup.show("Disabled drag&hellip;<br/><br/>Try to drag this window with mouse.<br/><br/>Try to resize the browser window &mdash; adjustment of modal popup location always works.",
                null,
                { allowDragging: false });
        });

        addButton("No Escape Handling", () => {
            p(
                p.content = "Escape handling is disabled:<br/><br/>Press Escape to check up if it works or not.<br/><br/>Also pay attention for changed default button.",
                p.buttonDescriptors = [
                    { default: true, text: "Yes", action: function () { add("Pressed Yes"); } },
                    { text: "No", action: function () { add("Pressed No"); } },
                    { text: "Close", action: function () { add("Pressed Close"); } }
                ],
                p.styles = { backgroundColor: { message: definitionSet.colors.message, buttonPad: definitionSet.colors.buttonPad } });
        }, null, true);

        const defaultDialogButton = 
            addButton("<b>Dialog:</b> Default", () => modalDialog.show(
                `Default.<br/>
                See the clipboard copy button above.<br/>Use it to copy the message.<br/><br/>
                The dialog can be closed by pressing Escape, Enter, the spacebar, or by clicking the button.`));
        addButton("<b>Dialog:</b> Multiple buttons, actions", () =>
            modalDialog.show(`<p>A button can be default, Escape or Enter</p><p><input style="width:100%" value="Press Enter or Escape in this input"/></p>`,
                {
                    buttons: [
                        { text: "Close", isEscape: true },
                        {
                            text: "Default button, pre-focused", isDefault: true,
                            action: () => add("Default button"),
                        },
                        {
                            text: "Another dialog&hellip;",
                            isEnter: true,
                            action: () => modalDialog.show("Default dialog in different style", { options: { cssClasses: "different" } })
                        },
                    ],
                    options: { equalButtonWidths: false },
                }));
        addButton("<b>Dialog:</b> Pre-focused element", () =>
            modalDialog.show(`<p>An element inside a message can be pre-focused</p><p><input value="Focus is here"/></p>`,
                {
                    buttons: [
                        { text: "Close", isEscape: true },
                        {
                            text: "Default button, not pre-focused", isDefault: true,
                            action: () => add("Default button"),
                        },
                        {
                            text: "Another dialog&hellip;",
                            isEnter: true,
                            action: () => modalDialog.show("Default dialog in different style", { options: { cssClasses: "different" } })
                        },
                    ],
                    options: { equalButtonWidths: false, initialFocus: "input" },
                }));
        addButton("<b>Dialog:</b> Equalized button widths", () => {
            modalDialog.show("Equalized button widths.<br>The first button is Escape.", {
                buttons: [
                    { text: "Close", isEscape: true },
                    { text: "A", action: button => add(button.textContent), isDefault: true },
                    { text: "B", action: button => add(button.textContent), },
                ]
            });
        });
        addButton("<b>Dialog:</b> No closing by keyboard", () => {
            modalDialog.show(`<p>A dialog can be closed by pressing Escape, Enter or the spacebar<br/>
                if one of the buttons is specified as <code>isEscape</code> or <code>isEnter</code>.</p>
                This dialog cannot be closed by Escape or Enter.`, {
                buttons: [
                    { text: "Close, not <code>isEscape</code>" },
                    { text: "No <code>isEscape</code> or <code>isEnter</code> flags", action: button => add(button.textContent), isDefault: true },
                    { text: "None of them", action: button => add(button.textContent), },
                ]
            });
        });
        addButton("<b>Dialog:</b> No-close buttons", () => {
            modalDialog.show(`Some buttons can work without closing the dialog.<br/>
                    Also note that Escape does not close this dialog<br/>
                    because none of the buttons is an Escape button.`, {
                buttons: [
                    { text: "Non-closing button", noClosing: true, action: button => add(button.textContent) },
                    { text: "Normal closing button", noClosing: false, action: button => add(button.textContent) },
                ],
            });
        });
        addButton("<b>Dialog:</b> Multiline buttons", () => {
            modalDialog.show("Multiline buttons", {
                buttons: [
                    { text: "Close", isEscape: true },
                    { text: "Two<br>Lines", isDefault: true },
                ],
            });
        });
        addButton("<b>Dialog:</b> Disabled dragging", () => {
            modalDialog.show("<p>Previous dialog samples can be dragged.</p><p>For this sample, dragging is disabled.</p>",
                { options: { drag: { isEnabled: false } } });
        });
        addButton("<b>Dialog:</b> Reset position after dragging", () => {
            modalDialog.show(`<p>In other dialog samples, the position after dragging is remembered for the same message content.<p>
                    </p>This feature can be disabled, so the dialog is shown again in the center of the screen.</p>`,
                { options: { drag: { usePreviousPosition: false } } });
        });
        addButton("<b>Dialog:</b> Multiple styles", () =>
            modalDialog.show(`<p>A dialog can use alternative CSS styles.<br/>One or more styles can be listed, separated by a blank space character.</p>`,
                {
                    buttons: [
                        { text: "Close", isEscape: true },
                        {
                            text: "Default button, pre-focused", isDefault: true,
                            action: () => add("Default button"),
                        },
                        {
                            text: "Another dialog&hellip;",
                            isEnter: true,
                            action: () => modalDialog.show("Default dialog in different style", { options: { cssClasses: "different" } })
                        },
                    ],
                    options: { equalButtonWidths: true, cssClasses: "different" },
                }));
        addButton("<b>Dialog:</b> <code>HTMLElement</code> message", () => {
            const elements = [];
            const p1 = document.createElement("p");
            p1.innerHTML = "A message can be a pre-created <code>HTMLElement</code>";
            elements.push(p1);
            const p2 = document.createElement("p");
            p2.innerHTML = "or an array of <code>HTMLElement</code> objects.";
            elements.push(p2);
            const p3 = document.createElement("p");
            p3.innerHTML = "<br/>Note that the text area below is pre-focused:";
            elements.push(p3);
            const container = document.createElement("div");
            const textarea = document.createElement("textarea");
            textarea.value = "Focus is here";
            textarea.style.width = "100%";
            container.appendChild(textarea);
            elements.push(container);
            modalDialog.show(elements,
                { options: { initialFocus: textarea }});
        });
        addButton("<b>Dialog:</b> Focus after closing", () => {
            modalDialog.show(`After this dialog is closed, a specified element is focused.<br/>
                In other cases, an attempt is made to focus on the element that was focused on before showing the dialog.`,
                { options: { focusAfterAction: defaultDialogButton }});
        });
    }; //demo

    const autoAccessKey = new AutoAccessKey("ijcfnyT");
    const add = function (content) {
        const p = document.createElement("p");
        p.innerHTML = content;
        elements.console.appendChild(p);
        elements.scrollParent.scrollTop = elements.scrollParent.scrollHeight;
    }; //add
    const addButton = (caption, handler, forceAccessKeyIndex, separatorAfter) => {
        const button = document.createElement("button");
        const access = autoAccessKey.next(caption, forceAccessKeyIndex);
        button.innerHTML = access.value;
        button.accessKey = access.accessKey;
        button.onclick = handler;
        button.style.marginRight = window.getComputedStyle(elements.buttonParent).getPropertyValue("padding-left");
        button.style.marginBottom = window.getComputedStyle(elements.buttonParent).getPropertyValue("padding-top");
        elements.buttonParent.appendChild(button);
        if (separatorAfter) {
            const separator = document.createElement("nav");
            elements.buttonParent.appendChild(separator);
        } //if
        return button;
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
