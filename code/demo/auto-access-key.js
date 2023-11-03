/*

Automatic generation of HTML with DOM element access key, underlined in content

Published with Modal Popup v.3.0
http://www.codeproject.com/Articles/1061121/ModalPopupFromScratch

Copyright (c) 2015, 2019, 2023 by Sergey A Kryukov
http://www.SAKryukov.org
http://www.codeproject.com/Members/SAKryukov

*/

// AutoAccessKey.next(value, forceIndex) expects value: element HTML, forceIndex (optional): preferred index of an access key character
// returns the object { value: value, accessKey: accessKey }
// where:
//    value is the modified HTML value, with underlined markup around access key character
//     accessKey is an access key character
// This function guarantees uniqueness of the set of access keys

function AutoAccessKey(reserved) {

    Object.defineProperty(this, "container", { value: [] })

    if (reserved != undefined)
        for (let index = 0; index < reserved.length; ++index)
            this.container[reserved.charAt(index).toUpperCase()] = 0;

    const isLetter = (char) => {
        return char.toLowerCase() != char.toUpperCase();
    } //isLetter

    const transformToAccessible = (value, index) => {
        if (index == undefined) return value;
        const accessLetter = value.charAt(index);
        const accessKey = accessLetter.toUpperCase();
        const before = value.slice(0, index);
        const after = value.slice(index + 1);
        value = before + "<u>" + accessLetter + "</u>" + after;
        return { value: value, accessKey: accessKey };
    } //transformToAccessible

    this.next = function (value, forceIndex) {
        const upperValue = value.toUpperCase();
        const lowerValue = value.toLowerCase();
        const searchByCase = function (container, compareUpper) {
            if (0 <= forceIndex && forceIndex < value.length) {
                const key = value.charAt(forceIndex).toUpperCase();
                if (!container.hasOwnProperty(key)) {
                    container[key] = 0;
                    return transformToAccessible(value, forceIndex);
                } //if can use it 
            } //force
            for (let index = 0; index < value.length; ++index) {
                const char = value.charAt(index);
                const lower = lowerValue.charAt(index);
                const upper = upperValue.charAt(index);
                if (lower == upper) continue;
                let compare;
                if (compareUpper)
                    compare = upper;
                else
                    compare = lower;
                if (char == compare) {
                    if (container.hasOwnProperty(upper)) continue;
                    container[upper] = 0;
                    return transformToAccessible(value, index);
                } //if
            } //loop
            return null;
        } //searchByCase
        let found = searchByCase(this.container, true);
        if (found) return found;
        found = searchByCase(this.container, false);
        if (found) return found; else return { value: value };
    } //this.next

} // function AutoAccessKey
