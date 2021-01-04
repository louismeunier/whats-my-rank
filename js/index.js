function ordinal_suffix_of(i) {
    //copied from https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

function getRank(t, times,i) {
    //Check if best/worst
    if (t<times[0]) {
        return `1st, ${(times[0]-t)/100} seconds faster than current.`;
    }
    if (t>times[times.length-1]) {
        return `${ordinal_suffix_of(times.length)}, ${(times[times.length-1])/100} seconds slower than current 🤮`;
    }

    else {
        var rank = times.indexOf(t);
        if (rank==-1) {
            //Find closest higher rank; wow recursion!!!
            return getRank(Math.floor(t+1),times, i+1);
        }
        else {
            if (i==0) {
                //Check if tied; will only be tied if recursion doesn't occur, ie, i is never incremented
                return `Tied for ${ordinal_suffix_of(rank+1)}`;
            }
            return `${ordinal_suffix_of(rank+1)}, ${i/100} seconds faster than current.`;
        }
    }
}

function addListeners() {
    var form = document.querySelector('#rank-form');
    var time = document.querySelector("#time-input");
    var eventType = document.querySelector("#event-select");
    var typeSelect = document.querySelector("#type-select");
    var inputT;
    var eventT = eventType.value;
    var type = typeSelect.value;
    time.addEventListener("input", event=> {
        inputT = parseFloat(time.value);
    })
    eventType.addEventListener("input", event=> {
        eventT = eventType.value;
    })
    typeSelect.addEventListener("input", event=> {
        type = typeSelect.value;
    })
    form.addEventListener('submit', event => {
        var url = `https://louismeunier.github.io/wca-stats-helper/rank/${type}/${eventT}.json`
        fetch(url)
            .then(res=>res.json())
            .then(resJ=>{
                var times = resJ.data.map((x) => x.best);
                document.querySelector("#res-rank").innerText = getRank(inputT*100,times, 0);
                //console.log(getRank(inputT*100,times, 0))
            });
        event.preventDefault()
    })
}

function lastUpdated() {
    fetch("https://louismeunier.github.io/wca-stats-helper/metadata.json")
        .then(res=>res.json())
        .then(resJ=> {
            var uDate = new Date(resJ.export_date);
            //date should be in ISO format
            console.log(uDate);
            document.querySelector("#updated").innerText= uDate.toString();
        });
}
document.addEventListener("DOMContentListener",addListeners());
document.addEventListener("DOMContentListener",lastUpdated());
