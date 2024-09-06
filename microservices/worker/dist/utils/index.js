"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceSolanaBody = exports.replaceEmailBody = void 0;
const replaceEmailBody = (action, metadata) => {
    //first i need to map thorugh actions. For each action search through the action.metadata and find the string starting and ending with {} braces. then replace that part with the corresponsing value in from metadata. We acn use a map to make this work.
    const replacePlaceholder = (text) => {
        return text.replace(/{(.*?)}/g, (match, key) => {
            return metadata[key] || match;
        });
    };
    const updatedMetadata = Object.assign(Object.assign({}, action.metadata), { to: replacePlaceholder(action.metadata.to), body: replacePlaceholder(action.metadata.body), subject: replacePlaceholder(action.metadata.subject) });
    return updatedMetadata;
};
exports.replaceEmailBody = replaceEmailBody;
const replaceSolanaBody = (action, metadata) => {
    const replacePlaceholder = (text) => {
        return text.replace(/{(.*?)}/g, (match, key) => {
            return metadata[key] || match;
        });
    };
    const updatedMetadata = Object.assign(Object.assign({}, action.metadata), { to: replacePlaceholder(action.metadata.to), amount: replacePlaceholder(action.metadata.amount) });
    return updatedMetadata;
};
exports.replaceSolanaBody = replaceSolanaBody;
