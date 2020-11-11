var song_url, song_name, artist;

$(function () {
    var params = new URLSearchParams(window.location.search);
    song_url = decodeURIComponent(params.get("song_url"));
    song_name = decodeURIComponent(params.get("song_name"));
    artist = decodeURIComponent(params.get("artist"));
    if (params) {
        var songMessage = song_name + " by " + artist;
        document.getElementById("message").value = songMessage;
    }
});

var firebaseConfig = {
    apiKey: "AIzaSyByKyBuCchvZFJ2EVSSPz_plqO9si5ykjU",
    authDomain: "enlight-proj.firebaseapp.com",
    databaseURL: "https://enlight-proj.firebaseio.com",
    projectId: "enlight-proj",
    storageBucket: "enlight-proj.appspot.com",
    messagingSenderId: "681186756749",
    appId: "1:681186756749:web:4612f9f323c9f1ee8b3ac4",
    measurementId: "G-NFGN66CZZG"
};

firebase.initializeApp(firebaseConfig);
let database = firebase.database();

let name = document.getElementById("username");
let input = document.getElementById("message");

input.addEventListener('keypress', function (event) {
    var songMessage = "<a target='_blank' href='" + song_url;
    songMessage += "'>" + song_name + " by " + artist;
    songMessage += "</a>";
    if (event.key == "Enter") {
        database.ref("messages").push({
            name: name.value,
            message: songMessage
        });

        input.value = "";
    }
})

database.ref("messages").on('child_added', function (message) {

    let messages = document.getElementById("messages");
    let name = message.val().name;
    let value = message.val().message;

    let div = document.createElement("div");
    let span = document.createElement("span");
    span.innerHTML = "@" + name;
    let p = document.createElement("p");
    p.innerHTML = value;

    div.appendChild(span);
    div.appendChild(p);

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
})