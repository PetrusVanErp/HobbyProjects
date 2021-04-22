/////////////////////////////////////
//                                 //
//      The validator library      //
//                                 //
/////////////////////////////////////


// makeFormValidator is a function that returns an event handler (a function).
// The returned event handler will use the checkerFunctions as a set of functions to
// validate form fields, and the submitHandler to call if everything is valid.
function makeFormValidator(checkerFunctions, submitHandler, errorReporter) {
    // This function below is the actual form-validator that becomes an event handler
    // for form submissions.
    return function validator(event) {
        // This prevents the browser from sending the form-data to the server and
        // loading the server response as a new HTML page (replacing this one).
        event.preventDefault();

        const theForm = event.target;
        const theErrorReport = document.getElementById("error-report");
        // Like querySelectorAll() and getElementsByClassName(), getElementsByTagName()
        // does not return a proper Array, but something called an HTMLCollection.
        // We can't call forEach, map, filter etc. directly on an HTMLCollection,
        // but after we convert it to a normal array using the Array.from() function,
        // we can call all the cool higher-order functions that are methods of arrays.
        const fieldsCollection = theForm.getElementsByTagName(`input`);
        const fieldsArray = Array.from(fieldsCollection);

        console.log("---");

        const filledInFields = fieldsArray.filter(inputElement => {
            return checkerFunctions[inputElement.name] !== undefined;
        });
        const checkedFields = filledInFields.map(inputElement => {
            const fieldName = inputElement.name
            const checker = checkerFunctions[inputElement.name];
            const checkResult = checker(inputElement.value)
            return [fieldName, checkResult];
        });
        const invalidFields = checkedFields.filter(([fName,result]) => result !== true);

        if (invalidFields.length === 0) {
            submitHandler(); // Everything checked out OK, call success-callback.
        } else {
            errorReporter( invalidFields );
        }
    };
}

// A checker function that simply checks if there is any input in the field.
function isRequired(value) {
    const result = value.trim() != "";
    return result || "Dit veld moet ingevuld worden";
}

const optional = (checker) => (value) => checker(value) || value.trim() === "";

const hasMaxLength = (maxLength) => (value) => value.length < maxLength
const hasMinLength = (minLength) => (value) => value.length > minLength

const checkBoth = (check1, check2) => (value) => check1(value) && check2(value)

const checkAll = (...checkers) => (value) =>
    Array.from(checkers).every((check) => check(value))

const message = (checker, errorMessage) => (value) => checker(value) || errorMessage
