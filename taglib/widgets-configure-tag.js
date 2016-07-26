module.exports = function render(input, out) {
    out.global.__disableStateSerialization = input.serializeState === false;
};
