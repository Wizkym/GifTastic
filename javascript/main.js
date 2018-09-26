// Define theme array
let topics = ['soccer', 'football', 'basketball', 'hockey', 'ping pong', 'tennis', 'rugby', 'formula 1', 'skating', 'formula drift', 'cricket', 'volleyball'];
// Define default search params
const apiKey = '1loVfAxwBi0t2FP96Nsgh8JVUzZLWHxE';
let q = 'football';
let limit = 10;
let response;

let list = JSON.parse(localStorage.getItem("favlist"));     // set list from localstorage if it is available
if (!Array.isArray(list)) {
    list = [];          // initialize the list array if the list is not available in localstorage
}
renderFavs(list);       // call the function to display the favorites list

$('document').ready(function () {
    displayBtns();      // displays the topics buttons
    getData();          // call the getData function to get the gifs
});

let getData = () => {
    let url = `https://api.giphy.com/v1/gifs/search?q=${q}&api_key=${apiKey}&limit=${limit}`;

    let xhr = $.get(url);
    xhr.done(function(data) {
        showGifs(data.data);        // call the showGifs function to display the gifs
        response = data.data;
    });
};

function displayBtns () {
    $('.buttons').empty();      // empty the buttons div

    for( let topic of topics) {         // for each item in the array
        let newBtn = $('<button>', {    // create a new button element
            text: topic,                // set the text to the current item in the array
            class: 'btn btn-success',   // add the bootstrap class
            id: 'buttons',              // set the id for reference
            data_value: topic           // set the data value to reference the index of the item
        });
        $('.buttons').append(newBtn);   // add the button inside the buttons div
    }
}

var showGifs = (data) => {              // displays the gifs in the browser
    console.log(data);
    $('#my-gifs').empty();

    for (let x in data) {           // iterate the data parameter and create a div with gif for each item
        let gif = $(`<div class='gifDiv'>
            <img id="gif" data-index = ${x} src=${data[x].images.fixed_height_still.url} data-state = 'still' width="250px" height="200px"><br>
            <span id="badge" class="badge badge-warning">Rated: ${data[x].rating}</span><br>
            <a href=${data[x].images.fixed_height.url} download=${data[x].title}>Download</a></div>`);
        $('#my-gifs').append(gif);
    }
};

$('.row').on('click', 'img#gif', function () {
    let state = $(this).attr('data-state');     // get the current state of the gif
    let index = $(this).attr('data-index');     // get the index value

    if (state === 'still') {                // if image is not animated
        $(this).attr('src', `${response[index].images.fixed_height.url}`);
        $(this).attr('data-state', 'animated');
    } else {                                // if image is animated
        $(this).attr('src', `${response[index].images.fixed_height_still.url}`);
        $(this).attr('data-state', 'still');
    }
});

$('#add').on('click', function () {
    event.preventDefault();

    let newKey = $('#newKey').val().trim().toLowerCase();   // get the new topic
    if (newKey === '') {                                    // validate input
        alert('please enter a search item');
    } else {
        topics.push(newKey);                                // add it to the topics array
        displayBtns();                                      // call displayBtns to display the buttons including the added one
    }
});

$('.buttons').on('click', '#buttons', function () {
    limit = 10;                                             // reset the limit value
    let newkey = $(this).attr('data_value');                // grab the search param from the button
    console.log(newkey);
    q = newkey;                                             // set newkey as the new query
    getData();                                              // get the gifs
});

$('#more').on('click', function () {    // requests 10 more gifs from the API
    limit += 10;                        // add 10 to the limit value
    getData();                          // call the function to get the gifs
});

$('#favsBtn').on('click', function () {         // adds to the favorite list
    event.preventDefault();

    let newFav = $('#newKey').val().trim().toLowerCase();      // grabs the new favorite item
    console.log(newFav);
    if (newFav === '') {            // validate the input
        alert('please enter a new favorite item');
    } else {
        list.push(newFav);          // add the item to the list array
        renderFavs(list);           // call the renderFavs function to display favorites
        localStorage.setItem("favlist", JSON.stringify(list));  // save the list inside localstorage
    }
});

function renderFavs (list) {        // lists favorites
    $('.favCard').empty();          // empty the favCard div

    for (let fav in list) {         // iterate the list array and create
        let newFav = $('<li>');     // list elements for each item
        newFav.text(list[fav]);     // set the text to the current item in the list array
        newFav.addClass("list-group-item");     // add the bootstrap class for lists
        newFav.attr("data-to-do", fav);         // set the attribute data-to-do as the index for later

        $('.favCard').append(newFav);
    }
}

$('.favCard').on('click', 'li', function () {       // When the user clicks any favorites item
     let index = $(this).attr('data-to-do');        // get the index from the data-to-do attribute
     q = list[index];                       // set the new query param as the list array item with the index from the line above
     getData();                     // call getData to get the gifs from the API
});

$('#favsClear').on('click', function () {       // Clears the favorites list & localstorage
    localStorage.clear();
    list.length = 0;
    $('.favCard').empty();
});



