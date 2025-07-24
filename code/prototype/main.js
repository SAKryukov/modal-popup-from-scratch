"use strict";

window.onload = () => {

    const elementSet = {
        buttonShow: document.body.querySelector("button"),
    };

    elementSet.buttonShow.onclick = () =>
        simpleModalDialog.show(
            `<p>aaa</p><p>bbbbb wd ewd e de d e de d eewdwe</p>
            <p><input></input></p>`,
            //simpleModalDialog.defaults,
            {
                buttons: [
                    { text: "Close 11111111111", noClosing: false, isEscape: true },
                    { text: "Do it!", isEnter: 1, isDefault: 1, action: button => simpleModalDialog.show(button.textContent)  },
                ],
                options: { equalButtonWidths: true, cssClasses: "a   b" },
            });
};
