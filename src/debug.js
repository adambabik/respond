var __default = false,
	debugComponents = {};

function setMode(component, value) {
	return typeof value === 'undefined' ?
		(component in debugComponents ? debugComponents[component] : __default) :
		debugComponents[component] = value;
}

module.exports = function (component, value) {
	value = !!value;
	if (value) {
		setMode(component, !!value);
	}

	var fn = setMode.bind(null, component);
	fn.default = function (val) {
		return __default = val;
	};

	return fn;
};