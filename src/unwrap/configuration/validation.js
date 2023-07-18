module.exports = {
    validate: (input) => {
        if (input == "") {
            // Pass the return value in the done callback
            console.log("You need to enter a valid answer");
            return false;
        }
        return true;
    },
        
    validateNotJMB: (input) => {
        if (input.includes("jamesmiller.blog") || input.includes("jamesmillerblog")) {
            // Pass the return value in the done callback
            console.log(
            `You can't use the example of ${input}, this was just to help you understand how to enter your own configuration`
            );
            return false;
        }
        return true;
    }
}