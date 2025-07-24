/*

Simple Modal Popup

v.1.0

Copyright (c) 2025 by Sergey A Kryukov
https://www.SAKryukov.org
https://www.codeproject.com/Members/SAKryukov

*/

"use strict";

const simpleModalDialog = (() => {

    const definitionSet = {
        keys: {
            Enter: 0, Escape: 0,
        },
        tags: {
            dialog: 0,
            section: 0,
            button: 0,
        },
        cssClassSeparator: ` `,
        empty: ``,
        toPixel: value => `${value}px`,
        setup: function() {
            for (let constantSet of [this.keys, this.tags])
                for (let index in constantSet)
                    constantSet[index] = index;
            Object.freeze(this);
        }, //setup
    };
    definitionSet.setup();

    const defaultButton = text => {
        return {
                text: "Close",
                isDefault: true, isEnter: true, isEscape: true, noClosing: false,
                action: undefined,
        };
    }; //defaultButton

    const defaults = {
        buttons: [
            {
                text: "Close",
                isDefault: true, isEnter: true, isEscape: true, noClosing: false,
                action: button => console.log(button.textContent)
            },
        ],
        options: {
            equalButtonWidths: true,
            cssClasses: definitionSet.empty,
        },
    }; //defaults

    const elementSet = {
        dialog: null,
        messageSection: null,
        buttonSection: null,
    }; //elementSet

    const buttonSet = {
        enterButton: null,
        escapeButton: null,
        reset: function() {
            this.enterKey = null;
            this.escapeKey = null;
        }, //reset
    }; //buttonSet

    const setupDialog = () => {
        elementSet.dialog = document.createElement(definitionSet.tags.dialog);
        document.body.appendChild(elementSet.dialog);
        elementSet.messageSection = document.createElement(definitionSet.tags.section);
        elementSet.buttonSection = document.createElement(definitionSet.tags.section);
        elementSet.dialog.appendChild(elementSet.messageSection);
        elementSet.dialog.appendChild(elementSet.buttonSection);
        elementSet.dialog.onkeydown = event => {
            if (event.code == definitionSet.keys.Escape && buttonSet.escapeButton)
                buttonSet.escapeButton.click();
            else if (event.code == definitionSet.keys.Enter && buttonSet.enterButton)
                buttonSet.enterButton.click();
            if (event.code == definitionSet.keys.Escape || event.code == definitionSet.keys.Enter)
                event.preventDefault();
        }; //elementSet.dialog.onkeydown
    }; //setupDialog

    const show = (htmlContent, detail = defaults) => {
        if (elementSet.dialog == null)
            setupDialog();
        elementSet.dialog.classList.value = definitionSet.empty;
        if (detail && detail.options && detail.options.cssClasses) {
            const classes = detail.options.cssClasses.split(definitionSet.cssClassSeparator);
            for (let className of classes)
                if (className)
                    elementSet.dialog.classList.add(className);
        } //if
        let focusButton = null;
        elementSet.messageSection.innerHTML = htmlContent;
        elementSet.buttonSection.innerHTML = null;
        const buttonMap = new Map();
        buttonSet.reset();
        if (detail && detail.buttons && detail.buttons.length) 
            for (let buttonDescriptor of detail.buttons) {
                const button = document.createElement(definitionSet.tags.button);
                if (buttonDescriptor.isEnter)
                    buttonSet.enterButton = button;
                if (buttonDescriptor.isEscape)
                    buttonSet.escapeButton = button;
                buttonMap.set(button, buttonDescriptor);
                button.textContent = buttonDescriptor.text;
                button.onclick = event => {
                    const descriptor = buttonMap.get(event.target);
                    if (!descriptor || !descriptor.noClosing)
                        elementSet.dialog.close();
                    if (descriptor && descriptor.action)
                        descriptor.action(event.target);
                }; //button.onclick
                elementSet.buttonSection.appendChild(button);
                if (buttonDescriptor.isDefault)
                    focusButton = button;
            } //loop
        elementSet.dialog.showModal();
        if (detail && detail.options && detail.options.equalButtonWidths) {
            let buttons = buttonMap.keys().toArray();
            let max = 0;
            for (let button of buttons)
                if (button.offsetWidth > max) max = button.offsetWidth;
            for (let button of buttons)
                button.style.width = definitionSet.toPixel(max);
        } //if
        if (!focusButton)
            focusButton = elementSet.buttonSection.firstChild;
        focusButton.focus();
    }; //this.show

    return { show };

})(); //simpleModalDialog
