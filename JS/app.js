var userName;
var access_token;
var song_name, artist, song_url, artist_url, album_image;

$(function () {
    $("#shareSong").on("click", function () {
        var url = "http://" + window.location.host + "/chat";
        url += '?album_image=' + encodeURIComponent(album_image);
        url += '&userName=' + encodeURIComponent(userName);
        url += '&song_name=' + encodeURIComponent(song_name);
        url += '&artist=' + encodeURIComponent(artist);
        url += '&song_url=' + encodeURIComponent(song_url);

        window.location.href = url;
    });
    $("#log-in-btn").on("click", function () {
        var client_id = '37eaba6e04e343259fc399757e7e2e75'; // Your client id
        var redirect_uri = 'http://localhost:8080/'; // Your redirect uri

        var scope = 'user-read-private user-read-email';

        var url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(client_id);
        url += '&scope=' + encodeURIComponent(scope);
        url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

        window.location = url;
    });

    var params = getHashParams();

    access_token = params.access_token;

    if (access_token) {
        $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function (response) {
                userName = response.display_name;

                $('#not-logged-in').hide();
                $('#logged-in').show();

                getCurrentOrRecentTrack();
            }
        });
    } else {
        $('#not-logged-in').show();
        $('#logged-in').hide();
    }
});

function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

function getCurrentOrRecentTrack() {
    $.ajax({
        url: 'https://api.spotify.com/v1/me/player/currently-playing?',
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function (response, textStatus, xhr) {
            if (xhr.status == 204) {
                $.ajax({
                    url: 'https://api.spotify.com/v1/me/player/recently-played?type=track&limit=1',
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function (response2, textStatus2, xhr2) {
                        var body_text = response2;
                        var track = body_text.items[0].track;
                        song_name = track.name;
                        artist = track.artists[0].name;
                        song_url = track.external_urls.spotify;
                        artist_url = track.album.artists[0].external_urls.spotify;
                        album_image = track.album.images[0].url;

                        document.getElementById("song_title").innerHTML = song_name;
                        document.getElementById("artist").innerHTML = artist;
                        document.getElementById("artist").setAttribute("href", artist_url);
                        document.getElementById("song_title").setAttribute("href", song_url);
                        document.getElementById("album_image")
                            .setAttribute("style",
                                "background-image: url('" + album_image + "'); background-repeat:no-repeat; background-position:center; opacity: 50%");
                    }
                });
            }
            else {
                var body_text = response;
                song_name = body_text.item.name;
                artist = body_text.item.artists[0].name;
                song_url = body_text.item.external_urls.spotify;
                artist_url = body_text.item.artists[0].external_urls.spotify;
                album_image = body_text.item.album.images[0].url;

                document.getElementById("song_title").innerHTML = song_name;
                document.getElementById("artist").innerHTML = artist;
                document.getElementById("artist").setAttribute("href", artist_url);
                document.getElementById("song_title").setAttribute("href", song_url);
                document.getElementById("album_image")
                    .setAttribute("style",
                        "background-image: url('" + album_image + "'); background-repeat:no-repeat; background-position:center; opacity: 50%");
            }
        }
    });
}
