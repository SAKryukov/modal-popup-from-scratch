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
        names: {
            Close: 0
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
            for (let constantSet of [this.keys, this.tags, this.names])
                for (let index in constantSet)
                    constantSet[index] = index;
            Object.freeze(this);
        }, //setup
    };
    definitionSet.setup();

    const defaultButton = text => {
        return {
            text: text,
            isDefault: true, isEnter: true, isEscape: true, noClosing: false,
            action: undefined,
        };
    }; //defaultButton

    const defaultOptions = {
        equalButtonWidths: true,
        cssClasses: definitionSet.empty,
        initialFocusQuery: null,
        focusActerAction: null,
    }; //defaultOptions

    const defaults = {
        buttons: [ defaultButton(definitionSet.names.Close) ],
        options: defaultOptions,
    }; //defaults

    const elementSet = {
        dialog: null,
        messageSection: null,
        buttonSection: null,
        initialFocusElement: null,
        focusElementOnClose: null,
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

    const cleanUp = () => {
        elementSet.dialog.classList.value = definitionSet.empty;
        elementSet.initialFocusElement = null;
        elementSet.focusElementOnClose = null;
    } //cleanUp

    const close = () => {
        elementSet.dialog.close();
        if (elementSet.focusElementOnClose)
            elementSet.focusElementOnClose.focus();
    }; //close

    const specialize = (defaultValue, value) => {
        if (value == null) return defaultValue;
        const newValue = {};
        for (let index in defaultValue) {
            if (value[index] !== undefined) {
                if (value[index] != null &&
                    defaultValue[index] != null &&
                    value[index].constructor == Object &&
                    defaultValue[index].constructor == Object)
                    newValue[index] = specialize(defaultValue[index], value[index]);
                else
                    newValue[index] = value[index];
            } else
                newValue[index] = defaultValue[index];
        } //loop
        return newValue;
    } //specialize

    const show = (htmlContent, detail = defaults) => {
        detail = detail
            ? specialize(defaults, detail)
            : defaults
        if (elementSet.dialog == null)
            setupDialog();
        cleanUp();
        elementSet.focusElementOnClose = detail.options.focusActerAction;
        if (detail.options.cssClasses) {
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
        if (detail.buttons.length && detail.buttons.length > 0)
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
                        close();
                    if (descriptor && descriptor.action)
                        descriptor.action(event.target);
                }; //button.onclick
                elementSet.buttonSection.appendChild(button);
                if (buttonDescriptor.isDefault)
                    focusButton = button;
            } //loop
        elementSet.dialog.showModal();
        if (detail.options.equalButtonWidths) {
            let buttons = buttonMap.keys().toArray();
            let max = 0;
            for (let button of buttons)
                if (button.offsetWidth > max) max = button.offsetWidth;
            for (let button of buttons)
                button.style.width = definitionSet.toPixel(max);
        } //if
        if (detail.options.initialFocusQuery)
            elementSet.initialFocusElement = elementSet.messageSection.querySelector(detail.options.initialFocusQuery);
        if (!focusButton && elementSet.buttonSection.firstChild)
            focusButton = elementSet.buttonSection.firstChild;
        if (elementSet.initialFocusElement)
            focus(elementSet.initialFocusElement)
        else if (focusButton)
            focusButton.focus();
    }; //this.show

    const result = { show, defaultButton };
    Object.defineProperties(result, {
        defaultButtons: { get() { return defaultButton(definitionSet.names.Close); } },
        defaultOptions: { get() { return defaultOptions; } },
        defaults: { get() { return defaults; } },
    });

    return result;

})(); //simpleModalDialog
