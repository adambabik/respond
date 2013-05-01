var __default = false,
	debugComponents = {};

function setMode(component, value) {
	return typeof value === 'undefined' ?
		(component in debugComponents ? debugComponents[component] : __default) :
		debugComponents[component] = value;
}

function setDefault(value) {
	__default = !!value;
}

module.exports = function (component, value) {
	value = !!value;

	if (value) {
		setMode(component, value);
	}

	var fn = setMode.bind(null, component);
	fn.default = setDefault;

	return fn;
};