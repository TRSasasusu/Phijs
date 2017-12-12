var IIT = function() {
    this.graph_conns = [
        "011",
        "101",
        "110",
       // [0, 1, 1],
       // [1, 0, 1],
       // [1, 1, 0],
    ];
    this.graph_kinds = [
        "OR", "AND", "XOR",
    ];
    this.current_on = "100";
    //this.current_on = [
    //    1, 0, 0,
    //];
};

IIT.prototype.calculate = function() {
    /*function isEqual(x, y) {
        for(var i = 0; i < x.length; ++i) {
            if(x[i] != y[i]) {
                return false;
            }
        }
        return true;
    }*/
    function calcNext(x) {
        //next = [].concat(x).map(function() { return 0; });
        var next = "";
        for(var i = 0; i < x.length; ++i) {
            var next_end = 0;
            if(this.graph_kinds[i] == "OR") {
                for(var j = 0; j < x.length; ++j) {
                    if(i == j) {
                        continue;
                    }
                    if(this.graph_conns[j][i] == 1 && x[j] == 1) {
                        next_end = 1;
                        break;
                    }
                }
            }
            else if(this.graph_kinds[i] == "AND") {
                for(var j = 0; j < x.length; ++j) {
                    if(i == j) {
                        continue;
                    }
                    if(this.graph_conns[j][i] == 1) {
                        if(x[j] == 1) {
                            next_end = 1;
                        }
                        else {
                            next_end = 0;
                            break;
                        }
                    }
                }
            }
            else if(this.graph_kinds[i] == "XOR") {
                var number_of_on = 0;
                for(var j = 0; j < x.length; ++j) {
                    if(i == j) {
                        continue;
                    }
                    if(this.graph_conns[j][i] == 1) {
                        if(x[j] == 1) {
                            ++number_of_on;
                        }
                    }
                }
                next_end = number_of_on % 2;
            }
            next += next_end;
        }
        return next;
    }
    //this.past_on = [].concat(this.current_on).map(function() { return 0; });
    this.cause_rep = {}
    max_number = parseInt(this.current_on.replace(/0/g, '1'), 2);
    //current_on_number = parseInt(this.current_on, 2);
    //while(!isEqual(this.past_on, this.current_on)) {
    for(var i = 0; i <= max_number; ++i) {
        past_on = i.toString(2);
        while(past_on.length < this.current_on.length) {
            past_on = '0' + past_on;
        }
        console.log(past_on);

        var next = calcNext.call(this, past_on);
        console.log("next: " + next);

        if(next == this.current_on) {
        //if(isEqual(next, this.current_on)) {
            this.cause_rep[past_on] = 1;
        }
        else {
            this.cause_rep[past_on] = 0;
        }
    }

    console.log(this.cause_rep);
};

/*setInterval(function() {

}, 2);*/
