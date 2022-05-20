

$(document).ready(function() {   // Load the function after DOM ready.
    // grab    
    console.log("A3wap is running");

    // grab transactions from the url search params
    var transactions = getUrlVars()["transactions"];

    // convert transactions from base64 to text
    const ASCIItransacitons = atob(transactions);

    console.log(ASCIItransacitons);

    //! this is scuffed, but it works
    // get the string in between the brakets of ASCII transactions string 
    var args = ASCIItransacitons.substring(ASCIItransacitons.indexOf("{\"t"), ASCIItransacitons.indexOf("\"}")+2);
    console.log(args);
    //parse args to json
    var json = JSON.parse(args);
    console.log(json);

    // search for ".near" strings in the ASCII transactions string
    var near = ASCIItransacitons.search(".near");
    
    // if .near is found go back until we find a space and save it for users in string array
    if (near > 0) {
        var users = ASCIItransacitons.substring(ASCIItransacitons.lastIndexOf(" ", near), near);
        console.log(users);
    }


});

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        // for every value convert the url to text
        value = decodeURIComponent(value);
        console.log(value)
        
        vars[key] = value;
    });
    return vars;
}