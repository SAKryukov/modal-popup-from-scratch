@numbering {
    enable: false
}

{title}Modal Popup From Scratch

[*Sergey A Kryukov*](https://www.SAKryukov.org)

How to create modal popup functionality without 3rd-party frameworks?

<!--
Original publication: [Modal Popup From Scratch](https://www.codeproject.com/Articles/1061121/ModalPopupFromScratch) (to be updated)
-->

<blockquote id="epigraph" class="FQ"><div class="FQA">Epigraph:</div>
<dt>Modality is a facet of illocutionary force, signaled by grammatical devices (that is, moods), that expresses
<ul>
<li>the illocutionary point or general intent of a speaker, or</li>
<li>a speaker's degree of commitment to the expressed proposition's believability, obligatoriness, desirability, or reality.<li></dt>
<dd>SIL International, Glossary of linguistic terms, <a href="https://glossary.sil.org/term/mood-and-modality#:~:text=Modality%20is%20a%20facet%20of,%2C%20obligatoriness%2C%20desirability%2C%20or%20reality"><i>What is mood and modality?</i></a></dd>
</blockquote>

## Contents{no-toc}

@toc

Epigraph:
Modality is a facet of illocutionary force, signaled by grammatical devices (that is, moods), that expresses
the illocutionary point or general intent of a speaker, or
a speaker's degree of commitment to the expressed proposition's believability, obligatoriness, desirability, or reality.
SIL International, Glossary of linguistic terms, What is mood and modality?

## Why Modal Popup?

The term "modal popup" is doubly confused. Modal popup control elements are not "modal" in the same sense as this term is understood in native application programming, nor they are "popup windows", as they are understood in Web programming. However, they are "modal" in some generalized meaning: a modal popup, when activated, creates a special mode which allows to force the user to interact only with this popup element. Even though such elements control the user interaction flow, they are not blocking the execution flow of the code, as the traditional dialogs or modal windows do. I'll discuss this difference below. For detailed overview of the modal window concept, please see https://en.wikipedia.org/wiki/Modal_window.

Modal popup elements are very important in Web programming, by some specific reasons. Historically, one way to create a control element separate from a main window, was creation of a separate browser window by code, which is called "popup". Even though this technique is, formally, perfectly legitimate, it earned extremely bad reputation, mostly due to the practice of annoying and intrusive advertisement, which is perceived very negatively, as something close to malicious activity; blocking of such popup windows became a commonplace. Another kind of modal elements (truly modal, analogously to the traditional dialogs or modal windows, using blocking calls) is a set of three JavaScript functions, alert, confirm and prompt None of those functions can be considered acceptable in real production application, due to lack of flexibility, style and convenience. At best, they are useful during development process, for showing of unhandled exception information, which is supposed to serve as the last resort coming into play as a result of unfixed bugs, and the like.

In contrast to those techniques, modal popup does not create any windows, not in the sense of the word "window" as it is understood in the host OS. The modal control element is just emulated on a single page and may only resemble the real window by its style. It actually just creates the UI mode on this page, which blocks the user access to all elements on the page except the popup. Amazingly, this approach solves all the problems mentioned above.

Presently, most of modal popup facilities are jQuery UI elements, such as jQuery Dialog wizard, or third-party plug-ins, but they can be implemented in other frameworks, or from scratch, as with the code I offer in the present article. However, one of the important goals of this article is to explain: why not modal popup? I'll discuss the drawbacks of modal popup in the last section of the article.

## Why From Scratch?

Well, because not everyone wants to use big JavaScript framework, jQuery or anything else. On CodeProject, I saw a number of questions where the inquirers wanted to create some client side rendering effects without using any 3rd-party frameworks. I also prefer minimalistic approach and having everything under my control.

And, the last but not least, it's good to understand how everything works on more fundamental level. It think it would be useful to explain.

## How?

Here is the idea:

First of all, when the modal state is entered, it's good to have the effect of dimming of the whole client area of the browser window, except the popup elements. It's easy to achieve. Let's have some element, div, covering the whole client area. To get the see-through effect, we can always set its opacity to some value between 0 and 1, and this value can be optional. On top of that element which I call the dimmer, we can place the popup element with message text, buttons, etc.

In addition to the dimming effect, the dimmer will isolate all the elements on the page from the popup element. The mouse events won't go beyond the dimmer and the popup elements. Does it isolate the page from all user interactions except the popup? Not yet. The elements on the page still can be achieved through the keyboard due to 1) tab navigation, 2) access keys on the input elements, which usually work through Alt+key or Alt+Shift+key keyboard events, depending on a particular browser.

I came to conclusion that the only really reliable way to prevent this kind of interaction is to temporarily disable all the input elements on the page, excluding the popup elements. When the popup mode is started, it's easy to remember the set of elements with modified enabled/disabled states, and restore those states on exit of the popup mode automatically.

Basically, I already shared all the essential ideas of this functionality and its implementation. I am not going to explain all the usage options, which are more or less obvious; instead, I provided a detailed demo application covering most of the possibilities; the demo code is self-explanatory when taken in combination with the demo UI and just a few comments. It would leave for just a few delicate moments of the behavior and implementation which i'll try to describe below.

## Principles of Operation

First of all, my approach to flexibility is very different from that of jQuery, where the modal popup is composed from the existing HTML markup. Yes, the user of modalPopup.show can do exactly the same thing, but this is not the most basic usage. I believe the most basic usage with minimal effort should be much simpler: just the call with some message string:

modalPopup.show("Some HTML content");
This call shows popup with predefined default button and with default styles. All other feature come in additional, optional function arguments. (In fact, all arguments are optional; see the very first demo case, "Default", in "demo.html".)

The set of features is limited in a good way: it makes it difficult to break out the basic reasonable rendering and behavior: symmetric look, even distribution of buttons, keyboard operation based on access key, dragging and other predefined handling of mouse and keyboard events, and so on.

So, how the existing HTML markup can be used in the way similar to jQuery Dialog? This is quite a trivial thing: moving some existing DOM element into the popup element messageWindow. This can be done on top of basic functionality: the element with HTML markup is converted to a string which can further be used as the first argument to the call to the function modalPopup.show. It can be done via one of the helper functions, modalPopup.prepareContent or modalPopup.prepareContentById; please see the code fragment shown below. These functions remove the existing HTML element from the DOM tree after getting its innerHTML string.

For some illustration, please see one of the demonstrations named "Heavily Formatted":

Heavily Formatted

The control of the set of the formatting features is based one of the "named function arguments" approach I suggested in my recent article "Named Arguments for JavaScript Functions, Part Two: Going Structured". The user can modify some formatting options, defines buttons, it's optional properties and optional actions, and define the action performed when the modal state is ended.

I will describe only one most important element of the popup messageWindow styling. Two options are available: the width of the element is defined as the option and the content is formatted to fit this width, or, less trivially, width-to-content layout is used, then the width of messageWindow is defined by the content of the message or the button part of the popup, whichever appears wider. First option comes by default, with some default width which can be modified by modification of the property styles.width. To use width-to-content formatting, this property should be set to null. False or 0 also can be used, but not undefined, because undefined is a special feature used to apply the value from default structure. This is demonstrated on the use cases "Width to Content, Equalized Button Widths", "Width to Content, Dominated by Message Text" and the same very "Heavily Formatted" case. Please see the demo application.

The mechanism of defaults is not so trivial; it is implemented by the function populateWithDefault; for detailed explanation, please see my article dedicated to this mechanism, "Named Arguments for JavaScript Functions, Part Two: Going Structured".

The most important aspect of functionality is that there is no blocking of the operation workflow, so the operation only remotely resembles that of "MessageBox.Show" and similar API, but is deeply different in its nature. "MessageBox" and other modal windows provide a way to block current execution flow at the call, at the same time, the flow of input events goes through the modal window, until it is closed, or its modal state is ended. Nothing like that happens with the modal popup. This is just the UI mode, which blocks the user interaction with other elements of the browser window. The call to modalPopup.show does not block execution and returns immediately, while the user keeps working in the "modal" mode. This is illustrated in my demo application by to test cases shown at the bottom section of the demo application window. You can compare the behavior of JavaScript alert with a modal popup use case. By the same reason, modal popup does not return anything. It would be useless, because the call is returned before the user makes any decision. Instead, the developer can define some actions specific to each button and/or the action called when the modal state has ended. At this moment, all the controls of the modal popup content are still accessible, which is demonstrated on the use case "Closing Action".

### Singleton

The fact of that the execution flow is not blocked is closely related to the singleton model. Indeed, it would be useless to show another modal popup if the application is already in the modal state. The singleton is hidden inside a single non-constructor function, which is the deepest method of encapsulation in JavaScript; the singleton instance and its construction are hidden under the façade of the non-constructor function modalPopup.show. This is the skeleton of the modalPopup unit:

```{lang=JavaScript}
const modalPopup = {

	show: function(content, buttonDescriptors, styles, onEndModalState) {

        if (!this.instance) {

            // ...

            this.instance = new function () {

                // ...
                this.dimmer = document.createElement("div");
                this.messageWindow = document.createElement("div");
                // ...

                this.show = function (
                    content,
                    buttonDescriptors,
                    styles,
                    endModalStateHandler) {
                        // define content of this.messageWindow
                        // and all the properties
                        // define event handlers for buttons
                        // and the end of modal state handler
                        // show it all 
                } //this.show
    
                // ...
            
            } //this.instance constructor

        } //if this instance was not yet defined

        this.instance.show(content, buttonDescriptors,
            styles, onEndModalState);

    } //show

	prepareContent: (element) => {
		const content = element.innerHTML;
		element.parentNode.removeChild(element);
		return content;
	}, //prepareContent
	prepareContentById: (id) => {
		return modalPopup.prepareContent(document.getElementById(id));
	} //prepareContentById

} //modalPopup
```

As one can see, two top-level elements of modal popup are created only once: dimmer and messageWindow. All the content of messageWindow is recreated on the call to the instance member (property) function show. All the events of messageWindow are also kept unmodified, but the input event handlers of the global predefined object window are temporarily added and removed, to ensure non-intrusive modification of the behavior of this object, by modifying it only during the modal state of the page. I'll explain the need in these events below.

### Temporarily Disabled Elements

Now, this is the core functionality of the modal state: the document input elements are temporarily disabled. The references to the elements with modified disabled property are kept in the object of the upper context, list, and are restored when the modal state is ending. This is how it is done:

```{lang=JavaScript}
const list = []; 

// ...

const disableAll = (list, exclusion, parent) => {
    modalPopupIsShowing = true;
    if (parent == exclusion) return;
    const objectSample = {};
    for (let index in parent.childNodes) {
        let child = parent.childNodes[index];
        disableAll(list, exclusion, child);
        if (typeof child == typeof objectSample && "disabled" in child && !child.disabled) {
            child.disabled = true;
            list.push({ element: child, accessKey: child.accessKey });
            child.accessKey = undefined; // this is a workaround for Mozilla
        } //if
    } //loop
} //disableAll

const modalClosing = (itself, list) => {
    // ...
    for (const index in list)
        list[index].disabled = false;
    // ...
} //modalClosing
```{lang=JavaScript}

The function disableAll is recursive; when called with the element document.body, it disables all elements on the page.

But this is not exactly the code presently found in "modal_popup.js"; below, I'll explain why.

### Workaround for Mozilla

After the fragment of code shown above was already prepared for publication, I noticed disappointing behavior of Mozilla browsers (based on Gecko): some access keys, which are activated, in Mozilla, via Alt+Shift+key, did not work in the modal state. Why only some? Quick check up immediately confirmed my guess: it happens because some matching access keys were defined for some elements on the main window before. When the page elements are disabled, those access keys, quite naturally, don't operate, but they also prevent operation of the access keys of the displayed, visible and enabled elements. Some additional testing revealed, that access keys block operation even if their elements are hidden via the style property visibility, no matter if it is set to "hidden" or "collapse", or via the style property display set to "none".

It looks totally illogical, because if access keys are cannot be used, they should not interfere with any operation on enabled element. This is the whole idea behind disabling or hiding of elements. There is nothing similar to this problem on the browsers based on WebKit layout engine (or Blink), Google Chrome, Chromium and Opera. Moreover, they demonstrate very convenient graceful degradation of functionality when two or more visible and enabled elements use identical access keys.

Of course, the workaround needs only couple of lines to be added/modified to both parts of the code, before and after modal state. In addition to disabling, all access keys of the elements should be temporarily unset and restored when the modal state has ended:

```{lang=JavaScript}
const list = []; 

// ...

const disableAll = (list, exclusion, parent) => {
    modalPopupIsShowing = true;
    if (parent == exclusion) return;
    var objectSample = {};
    for (let index in parent.childNodes) {
        var child = parent.childNodes[index];
        disableAll(list, exclusion, child);
        if (typeof child == typeof objectSample
            && "disabled" in child && !child.disabled) {
                child.disabled = true;
                list.push({ element: child, accessKey: child.accessKey });
                child.accessKey = undefined;
        } //if
    } //loop
} //disableAll

const modalClosing = (itself, list) => {
    // ...
    for (let index in list) {
        list[index].element.disabled = false;
        if (list[index].accessKey)
            list[index].element.accessKey = list[index].accessKey;
    } // loop
    // ...
} //modalClosing
```
The opposite adverse effect, disabling of some access keys on the main page because of presence of matching access keys on the popup element's messageWindow, is not manifested only because I put clean-up of its content in the handler called after the modal state has ended, modalClosed.

The isolation between two phases of going out of modal state modalClosing and modalClosed is done by some totally unrelated reasons, mostly for better readability of the code and to follow certain naming tradition. Between the calls to these two methods, the closing button action is performed, if one provided by the developer for the button pressed; and the handler called in the last phase, endModalStateHandler, can also be provided by the developer. Please see complete code for further detail.

Demonstration of the bug takes just few lines of code. I failed to find a bug report on this problem on Mozilla side, so I reported it to Mozilla: https://bugzilla.mozilla.org/show_bug.cgi?id=1230387.

### Dragging

I don't think dragging of the modal popup element is practically very important, especially when think dimming is applied (the level of opacity is optional though, so the content in background can be perfectly visible), but this is what the users are used to, so it would be not nice to neglect this kind of behavior. There is one delicate problem related to dragging: there is no mouse capture. If the mouse move event is handled on some DOM element, fast motion can easily move a mouse pointer outside of the element, which would break the dragging state. The known solution is to handle this event on the object window, which obviously entail the need of handling of the mouse up event. Another event added and removed the same way is resize, by apparent reasons — it moves the element messageWindow, to keep it in symmetric location relative to the window:

```{lang=JavaScript}
const modalClosing = (itself, list) => {
    window.removeEventListener("resize", windowResizeHandler)
    window.removeEventListener("mousemove", windowMouseMoveHandler);
    window.removeEventListener("mouseup", windowMouseUpHandler);
    for (let index in list)
    	list[index].disabled = false;
    hide(itself.messageWindow);
    hide(itself.dimmer);
    modalPopupIsShowing = false;
} //modalClosing

this.show = function (
    content,
    buttonDescriptors,
    styles,
    endModalStateHandler) {

    // ...

    if (allowDragging) {
        window.addEventListener("mouseup", windowMouseUpHandler);
	 window.addEventListener("mousemove", windowMouseMoveHandler);
    }

    // ...

    window.addEventListener("resize", windowResizeHandler);
 
} //this.show
```

There is one more window object event which is never removed: beforeunload; it is used to end the modal state, which is important if the user decides to reload the page without ending the modal state.

All other implementation detail are more or less trivial; please download the complete code to see how it all works.

## Modal Popup and Demo Code

All the modal popup functionality is put in a single file, "ModalPopup.js", it does not depend on any other files. The other three files supplied in a downloadable package are related exclusively to the demo code, "demo.html", which is itself is sophisticated enough and covers a good set of use cases.

As I promised above, I'm not going to explain all the usage cases and the usage techniques; self-explanatory character of the code samples helps to learn the usage and all the options in much easier way. This is how the demo UI looks:

demo application

The demo covers the layout options described above, different button descriptions and their properties, definition of button key description, behavior in escape key press, event handlers, disabled/enabled dragging, styling, and so on.

Two other JavaScript files used for the demo are "NamedCaller.js", "AutoAccessKey.js".

"NamedCaller.js" is used for the convenience of calling of functions with several arguments using named arguments technique I suggested in my other recent article on the "named arguments" topic, where this technique is explained in fine detail: Named Arguments for JavaScript Functions, Yet Another Approach.

As to the other JavaScript file, "AutoAccessKey.js", it is also used for convenience and is unrelated to the topic of the present article. This is just a little bonus.

## A Little Bonus

JavaScript constructor function AutoAccessKey provides a way to automatically convert a string representing the inner HTML of some input control, such as button, to an HTML string with an underlined access key; its member function next(value, forceIndex) returns a converted HTML string and an access key character. If all access keys on a Web page are chosen using this facility, it guarantees their uniqueness. First argument, value, should be a string without HTML markup, which is added in the returned object. The second, optional argument forceIndex, indicates the string index of the preferred access key, but this key is chosen only if it is possible (the index is valid and the choice is not breaking uniqueness). On top of this preference, the choice is performed in certain order: only letter characters are used, and capital letters are considered first.

There is one problem with this implementation. Unfortunately, native JavaScript functions lack such feature as classification of characters into letters and non-letters. My method of classification is based on the difference between lower-case and upper-case letters, but it only works for a narrow subset of languages, to best of my knowledge, those derived from Latin and Greek roots; for such languages, the functions toUpper or toLower return a different character only for Uthe characters representing low-case or upper-case letters, correspondingly. Those who need to cover some other languages without lower and upper-case letters, can modify my code to use with some particular culture. I'm sorry about it, but this code is suitable enough for my immediate purpose, the demo application.

7 Your User May Not Love It So Much
I realize that it's pretty unusual to provide some code and discourage its use at the same time, but this is exactly what I'm going to do; and I think this should be the most important part of the present article.

Modal behavior should not be overused. Your user may not love it so much. Yes, the similar features should be in a toolbox of each and every software developer, and that's why I provide this code, but it does not mean it should be used here and there. I would advise: first thing to do before using any kind of modal behavior or a dialog should be thinking about possible alternatives.

For example, it's a pretty bad idea to show exception information or some other kind of a problem report in a modal control element. Why would you interrupt the user activity in such cases? What do you expect from the user? If the application is fully recovered from the problem, the user may not need to pay too much attention for it. If the problem blocks further activity, some of the controls will be disabled. In all cases, it would be much better to explain the problem in some status line or some other similar non-modal element. The user will read this information only if it is interesting enough and helps to overcome some problem, or not, if the user decides to do something else.

In rare cases, it is important to bring to the user's attention to the situation when next step is not reversible. But first thing about this: may be implementing "undo" is possible; if so, prefer "undo". Please see, for example: http://alistapart.com/article/neveruseawarning.

And so on… For more ideas on use cases, possible problems and recommendations, please see:

Modal window… Use cases… Problems… Recommendations…

UI design and development of fine UI is not a simple thing. First thing it requires is the ability to play the role of the user and understand the user's field of activity.

## Versions

### 1.0.0

December 2, 2015, initial version.

### 2.0.0

September 28, 2017
Many important fixes.

### 2.1.0
September 30, 2017
Fixed a mouse handling bug reported by yuvalrs.

### 2.2.0
February 2, 2019
All code is re-written using more modern JavaScript. In particular, all var keywords are eliminated, suitable functions converted to arrow functions.

### 3.0.0
November, 2023


## Acknowledgments

Code Project user yuvalrs has found a bug in mouse handling.

This bug was fixed in v. 2.1.0.
