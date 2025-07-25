"use strict";

window.onload = () => {

    const elementSet =  {
        sample: document.body.querySelector("textarea"),
        buttonShow: document.body.querySelector("button"),
    };

    elementSet.buttonShow.onclick = () =>
        simpleModalDialog.show(
            `<p>Not so long text</p><p>&hellip;more</p>
            <p><input></input></p>`,
            {
                buttons: [
                    { text: "Close", noClosing: false, isEscape: true },
                    { text: "Some long action",
                        isEnter: 1, isDefault: 1,
                        action: button =>
                            simpleModalDialog.show(button.textContent, { options: {cssClasses: "different"}})  },
                ],
                options: {
                    initialFocusQuery: "input",
                    focusActerAction: elementSet.sample,
                },
            });
};
