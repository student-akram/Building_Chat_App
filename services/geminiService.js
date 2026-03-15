// Temporary AI simulation for suggestions

async function getSuggestions(text) {

return [
"text me when you arrive",
"tomorrow at 5 pm",
"the office lobby"
];

}

async function getSmartReplies(message) {

return [
"Yes I'll be there",
"Running a bit late",
"Can we reschedule?"
];

}

module.exports = {
getSuggestions,
getSmartReplies
};