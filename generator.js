function build() {
    var i, j;
    var placeholder = $("#table-placeholder");
    var text = $("#expression").val().toUpperCase();

    if (text == "") {
        placeholder.replaceWith("<div id='table-placeholder'></div>");
        return;
    }

    if (text.match(/[^ABCDEFGHabcdefgh0123456789+*'() ]/g) != null) {
        placeholder.replaceWith("<p id='table-placeholder'>Please enter a valid input.</p>");
        return;
    }

    text = format(text);

    var variables = [];
    for (i = 0; i < text.length; i++)
        if ((text[i] >= 'A' && text[i] <= 'Z'))
            if (text.indexOf(text[i]) == i)
                variables.push(text[i]);
    variables.sort();

    var string = "";
    string += "<tr>";
    for (i = 0; i < variables.length; i++)
        string += "<th>" + variables[i] + "</th>";
    string += "<th>" + text + "</th></tr>";
    for (i = 0; i < Math.pow(2, variables.length); i++) {
        string += "<tr>";
        var data = [];
        for (j = 0; j < variables.length; j++) {
            data[j] = 1 - Math.floor(i / Math.pow(2, variables.length - j - 1)) % 2;
            string += "<td>" + data[j] + "</td>";
        }
        var equation = text;
        for (j = 0; j < variables.length; j++)
            equation = equation.replace(new RegExp(variables[j], 'g'), data[j]);
        // string += "<td>" + '-' + "</td>";
        string += "<td>" + solve(equation) + "</td></tr>";
    }

    string = "<table align='center' id='table-placeholder'>" + string + "</table>";
    placeholder.replaceWith(string);

    function format(text) {
        while (numOf(text, '(') > numOf(text, ')'))
            text += ")";
        return text;
    }

    function numOf(text, search) {
        var count = 0;
        for (var i = 0; i < text.length; i++)
            for (var j = i; j < text.length; j++)
                if (text[i] == search)
                    count++;
        return count;
    }

    function solve(equation) {
        var start = equation.lastIndexOf("(");
        var end = equation.indexOf(")", start);
        if (start != -1)
            equation = equation.substring(0, start)
                + solve(equation.substring(start + 1, end))
                + equation.substring(end + 1);
        try {
            var safeEval = eval;
            return safeEval(equation); // return (eval(equation) == 0) ? 0 : 1;
        } catch (Exception) {
            return -1;
        }
    }
}

/*
 TEST CASES
 A*((B+C)*(A+C))
 A*((B+C')*(A+C))
 A((B+C')(A+C))
 */