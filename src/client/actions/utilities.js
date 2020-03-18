export function validateUsername(string) {
    let re = /^[\w.@+-]+$/;
    return re.test(string);
}

export function validateAddress(string) {
    let re = /^\d+\w*\s*(?:(?:[\-\/]?\s*)?\d*(?:\s*\d+\/\s*)?\d+)?\s+/;
    return re.test(string);
}