export function isValidEmail(email) {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

export function isValidPassword(password) {
	const regExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\-/@#$%{}^&_+=()!,<>?:;*]).{6,}$/
	//	const regExp = /^(?=.*[\\d])(?=.*[A-Z])[\\w!@#$%^&*-:;<>.,]{8,}$/
	return regExp.test(password)
}

export function isValidText(text, requiredTrim = false) {
	return (text && (requiredTrim ? (text.trim() !== "") : (text !== "")))
}