/**
 * Disorder the array
 *
 * @param {bool} preserve Returns a copy without modifying the original
 * @return {array} The disordered array
 */
Array.prototype.disorder = function (preserve) {
	var array = preserve ? this.slice() : this;
	var disordered = [];

	while(array.length > 0) {
		var index = Math.round(Math.random()*(array.length-1));
		disordered.push(array[index]);
		array.splice(index, 1);
	}

	if(!preserve) {
		Array.prototype.push.apply(this, disordered);
	}

	return disordered;
};
