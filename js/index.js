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

function getRawRank(t, times,i) {
    //Check if best/worst
    if (t<times[0]) {
        return 1;
    }
    if (t>times[times.length-1]) {
        return times.length;
    }

    else {
        var rank = times.indexOf(Math.floor(t));
        if (rank==-1) {
            //Find closest higher rank; wow recursion!!!
            return getRawRank(Math.floor(t+1),times, i+1);
        }
        else {
            if (i==0) {
                //Check if tied; will only be tied if recursion doesn't occur, ie, i is never incremented
                return rank+1;
            }
            return rank+1;
        }
    }
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
                document.querySelector("#res-rank").innerText = getRank(Math.floor(inputT*100),times, 0);
                //var rank =  getRawRank(Math.floor(inputT*100),times, 0);
                //createResultsTable(Math.floor(inputT*100),rank,times,resJ.data);
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

function createResultsTable(cur, rank, time, people) {
    var table = document.querySelector("#res > table > tbody");
    console.log(rank);
    
    //next fastest
    //console.log(time[rank-2]);
    //console.log(people[rank-2]);
    var betterRow = document.createElement("tr");
    var betterRank = document.createElement("td");
    betterRank.innerText = rank-1;
    var betterTime = document.createElement("td");
    betterTime.innerText = time[rank-1];
   //var betterPerson = document.createAttribute("td");
   betterRow.appendChild(betterRank);
    betterRow.appendChild(betterTime);
   

    //same time
    var sameRow = document.createElement("tr");
    var sameRank = document.createElement("td");
    sameRank.innerText = rank;
    var sameTime = document.createElement("td");
    sameTime.innerText = cur;
    sameRow.appendChild(sameRank);
    sameRow.appendChild(sameTime);
    

    //next slowest/tied
   // console.log(time[rank-1]);
    //console.log(people[rank-1]);
    var worseRow = document.createElement("tr");
    var worseRank = document.createElement("td");
    worseRank.innerText = rank+1;
    var worseTime = document.createElement("td");
    worseTime.innerText = time[rank+1];
   //var worsePerson = document.createAttribute("td");
   worseRow.appendChild(worseRank);
    worseRow.appendChild(worseTime);
    
    table.appendChild(betterRow);
    table.appendChild(sameRow);
    table.appendChild(worseRow);
    
    document.querySelector("#res > table").style.display = "block";
}

document.addEventListener("DOMContentListener",addListeners());
document.addEventListener("DOMContentListener",lastUpdated());
