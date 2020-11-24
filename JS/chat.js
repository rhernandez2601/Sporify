var song_url, song_name, artist, album_image, userName;

$(function () {
    var params = new URLSearchParams(window.location.search);
    song_url = decodeURIComponent(params.get("song_url"));
    song_name = decodeURIComponent(params.get("song_name"));
    artist = decodeURIComponent(params.get("artist"));
    album_image = decodeURIComponent(params.get("album_image"));
    userName = decodeURIComponent(params.get("userName"));

    if (params) {
        let album_image_div = document.getElementById("album_image_div");

        let album_image_pic = document.createElement("img");
        album_image_pic.setAttribute("src", album_image);
        album_image_pic.setAttribute("style", "width:100%");
        album_image_div.appendChild(album_image_pic);

        let song_info_div = document.getElementById("song_info_div");

        let song_info = document.createElement("p");
        song_info.innerHTML = "Song: " + song_name;
        
        let artist_info = document.createElement("p");
        artist_info.innerHTML = "Artist: " + artist;
    
        song_info_div.appendChild(song_info);
        song_info_div.appendChild(artist_info);
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
            name: userName,
            song_name:song_name,
            artist: artist,
            album_image: album_image,
            song_url: song_url,
            message: input.value
        });

        input.value = "";
    }
})

database.ref("messages").on('child_added', function (message) {

    let messages = document.getElementById("messages");
    let userName = message.val().name;
    let song_url = message.val().song_url;
    let song_name = message.val().song_name;
    let artist = message.val().artist;
    let album_image = message.val().album_image;
    let user_message = message.val().message;

    let message_row = document.createElement("div");
    message_row.setAttribute("class", "row song_share_item");
    message_row.setAttribute("onclick", "window.open('" + song_url + "' , '_blank')");

    let username_row = document.createElement("div");
    username_row.setAttribute("class", "row");

    let username_col = document.createElement("div");
    username_col.setAttribute("class", "col-12");

    let username_p = document.createElement("p");
    username_p.innerHTML = userName;
    username_col.appendChild(username_p);
    username_row.appendChild(username_col);
    messages.appendChild(username_row);

    let album_image_col = document.createElement("div");
    album_image_col.setAttribute("class", "col-2");

    let album_image_pic = document.createElement("img");
    album_image_pic.setAttribute("src", album_image);
    album_image_pic.setAttribute("style", "width:100%");
    album_image_col.appendChild(album_image_pic);
    message_row.appendChild(album_image_col);

    let song_info_div = document.createElement("div");
    song_info_div.setAttribute("class", "col-10");

    let song_info = document.createElement("p");
    song_info.innerHTML = "Song: " + song_name;
    
    let artist_info = document.createElement("p");
    artist_info.innerHTML = "Artist: " + artist;

    song_info_div.appendChild(song_info);
    song_info_div.appendChild(artist_info);
    message_row.appendChild(song_info_div);

    let user_message_row = document.createElement("div");
    user_message_row.setAttribute("class", "row");

    let user_message_col = document.createElement("div");
    user_message_col.setAttribute("class", "col-12");

    let user_message_text = document.createElement("p");
    user_message_text.innerHTML = "-" + user_message;

    user_message_col.appendChild(user_message_text);
    user_message_row.appendChild(user_message_col);
    message_row.appendChild(user_message_row);

    // let div = document.createElement("div");
    // let span = document.createElement("span");
    // span.innerHTML = "@" + name;
    // let p = document.createElement("p");
    // p.innerHTML = value;

    // div.appendChild(span);
    // div.appendChild(p);

    // messages.appendChild(div);
    messages.appendChild(message_row);
    messages.scrollTop = messages.scrollHeight;
})
