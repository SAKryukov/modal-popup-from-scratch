"use strict";

window.onload = () => {

    const elementSet = {
        buttonShow: document.body.querySelector("button"),
    };

    elementSet.buttonShow.onclick = () =>
        simpleModalDialog.show(
            `<p>aaa</p><p>bb</p>
            <p><input></input></p>`,
            //simpleModalDialog.defaults,
            {
                buttons: [
                    { text: "Close", noClosing: false, isEscape: true },
                    { text: "Some long action", isEnter: 1, isDefault: 1, action: button => simpleModalDialog.show(button.textContent)  },
                ],
                options: { equalButtonWidths: true, cssClasses: "a   b" },
            });
};
