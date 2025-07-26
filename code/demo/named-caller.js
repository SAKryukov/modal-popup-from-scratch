/*

namedCaller: passing JavaScript function arguments by name

v.4.0

Copyright (c) 2015, 2019 by Sergey A Kryukov
http://www.SAKryukov.org
http://SAKryukov.org/freeware/calculator
http://www.codeproject.com/Members/SAKryukov

Published: http://www.codeproject.com/Articles/1045966/Named-Arguments-for-JavaScript-Functions-Yet-Anoth

*/
"use strict";

function namedCaller(targetFunction, defaults, targetFunctionPropertyName) {

    if (!targetFunctionPropertyName) targetFunctionPropertyName = "targetFunction";

    const initialize = (self, defaults) => {
        for (let index = 0; index < argumentNames.length; ++index)
            self[argumentNames[index]] = undefined;
        if (!defaults) return;
        for (let index in defaults)
            self[index] = defaults[index];
    } //initialize

    const wrapper = (function createWrapperFunction() {
        const prepareArguments = (self) => {
            const argumentValues = [];
            for (let index = 0; index < argumentNames.length; ++index)
                argumentValues[index] = self[argumentNames[index]];
            return argumentValues;
        } //prepareArguments
        return function () {
            if (!targetFunction) return;
            const argumentValues = prepareArguments(wrapper);
            initialize(wrapper, defaults);
            return targetFunction.apply(this, argumentValues);
        } //wrapper
    })(); //createWrapperFunction

    const argumentNames = (function parseArguments(self) {
        if (!targetFunction) return;
        let argumentNames = targetFunction.toString().match(/function[^(]*\(([^)]*)\)/)[1].split(/,\s*/);
        if (!argumentNames || !argumentNames[0]) // case of "function () {...}"
            argumentNames = [];
        for (let index = 0; index < argumentNames.length; ++index)
            self[argumentNames[index]] = undefined;
        return argumentNames;
    })(wrapper); //parseArguments

    Object.defineProperty(wrapper, targetFunctionPropertyName, { enumerable: true, value: targetFunction });

    (function sealAndCheckUpDefaults(defaults, wrapper){
        Object.seal(wrapper);
        if (!defaults) return;
        initialize(wrapper, defaults);
    })(defaults, wrapper); //sealAndCheckUpDefaults

    return wrapper;

}; //namedCaller
