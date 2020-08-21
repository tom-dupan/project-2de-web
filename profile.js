'use strict';

//All items that need to be filled in
let klantennummer = 0;
let name = "";

//Bag
let X_ATTACK_amount = 0;


window.onload = () => {
    klantennummer = sessionStorage.getItem('klantennummer');

    getAllFromDB();
}

//Getting all data from database
function getAllFromDB() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", `/getcompleteGebruiker?klantennummer=${klantennummer}`);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                let result = JSON.parse(xmlhttp.responseText); // Parse result to JSON

                naam = result[0][0].naam;
                account_created = result[0][0].account_created;
               
               

               
        }
    };
    }
//Adding to html
async function addingtohtml() {
    document.getElementById("p-name").innerText = name;

    //Stats
    document.getElementById("p-playtime").innerHTML = naam;
    document.getElementById("p-money").innerHTML = bestelling;
    

}
}