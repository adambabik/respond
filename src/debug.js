var DEFAULT = false,
	debugComponents = {};

function setMode(component, value) {
	return typeof value === 'undefined' ?
		(component in debugComponents ? debugComponents[component] : DEFAULT) :
		debugComponents[component] = value;
}

module.exports = function (component, value) {
	value = !!value;
	if (value) {
		setMode(component, !!value);
	}
	return setMode.bind(null, component);
};