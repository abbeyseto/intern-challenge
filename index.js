var currentpage = 1;

//***GET USERS DETAILS AND DISPLAY ON THE BROWSER IN A READABLE FORMAT***//

var url = 'https://intern-challenge.herokuapp.com/persons'; //URL that accepts the GET request
$.ajax({    // Begining of ajax query
    url: url,     // url defined in the request statement
    method: 'GET', // GET method to get data from the API
    contentType: 'application/x-www-form-urlencoded',
}).done(addPersons).fail(requestError); // if successful 'addPersons' is executed, else 'requestError' is returned

function addPersons(data) { //fuction that gets the the response as "data" 
    let htmlContent = ''; // variable to display the response in a readable UI/UX format is declared
    maxPage = data.pageCount;
    if (data.persons) { // checks if there is a node in the called "persons" in the json data response
        const person = data.persons; //response stored in constant 'person'.

        htmlContent = person.map(user => `<div id="userProfile"> <figure ><img class="imgThumb" src="${user.photo_thumb}" width="60px"></figure><span>${user.name}</span><br><div class="fullProfile" hidden> <br><label>Age:</label><span>${user.age}</span><br><label>ID code:</label><span>${user.id}</span><br><label>Description:</label><article>${user.description}</article><a class="editLink" href="#">[EDIT]</a><div id ='emptyDiv' hidden><input class="input" value=${user.id} hidden><br>New Description:<br><textarea placeholder='Enter text here' required></textarea><br><button class='editText'>Submit</button></div></div><button class="button" data-text-swap="Close Details"><span>View Details </span></button></div>`).join('');//data from the response is formatted in html with classes and ids that are styled using CSS.

    } else { // If there is no node called "persons" in the jason data response
        htmlContent = `<div class="error-no-articles">no users available</div>`;// variable htmlContent displays an error message on the screen.
    }

    $('#users').html(htmlContent);
    //$("#users").append(htmlContent);//formatted response stored in htmlContent is displayed in the element with id=user

    $('.paginInput').attr("value", "Page " + currentpage + " of " + maxPage);

    // $('a.previous').addClass('disabled');


    $('.button').on('click', function () {// When "view details" button is clicked from the displayed data
        $(this).prev().toggle();
        var el = $(this);
        if (el.text() == el.data("text-swap")) {
            el.text(el.data("text-original"));
            $(this).prev().find('a').show();//previous DOM element before the button element with a sibling of an anchored (link) tag with innerHTML 'EDIT' is shown
        } else {
            el.data("text-original", el.text());
            el.text(el.data("text-swap"));
        }
       /* $(this).prev().toggle(); //previous DOM element before the button element with class= fullProfile is toggled to show or hide
        
    */});

    $('.editLink').on("click", function (e) { // when EDIT link is clicked
        e.preventDefault(); // prevent normal behaviour of links and 
        $(this).next().show(); // show the element which is next to the element with class 'editLink', this is the div with id= emptyDiv 
        $(this).hide();// then hide the 'EDIT' link
    });


    //***UPDATE USER DESCRIPTION USING POST REQUEST***//


    $('.editText').on('click', function () { // when button with class=editText is clicked
        let idPerson = $(this).parent().find('input').val();// finds and store the input value of the particular user which is hidden by default  as idPerson
        let newDescription = $(this).parent().find('textarea').val();    // finds and store the New Description value of the particular user which is stored as newDescription
        var url2 = 'https://intern-challenge.herokuapp.com/persons/';//URL that POST request is sent to
        url2 += idPerson; // user id is added to the url2 to identify the specific use
        console.log(idPerson);
        if (newDescription === "") {
            alert("Your description cannot be empty");
            return 0;
        }
        var des = {
            "description": newDescription,
        } // new description is stored as a json object ready to be sent to the API
        let clicked = $(this);
        $.ajax({ // Begining of ajax query
            url: url2, // url defined in the request statement
            dataType: "json", // type of data to be sent via the POST method
            method: 'POST', // POST method to send data to the API
            data: des, // data to se sent to the API
        }).done(function (res) {
            console.log(clicked.parent().prev().prev());
            console.log(res.person.description);
            clicked.parent().prev().prev().html(`${res.person.description}`);// Changes to description is automatically displayed on the browser.
        }).fail(requestError);
        $(this).parent().hide();
    })// if successful 'updatePersons' is executed, else 'requestError' is returned    



    //***CREATE NEW USER USING POST REQUEST***//
    $('#submitUser').on('click', function (e) { // when button with class=editText is clicked
        e.preventDefault();
        let newDescription = $('#userDescription').val();    // finds and store the New Description value of the particular user which is stored as newDescription
        let newName = $('#userName').val();
        let newAge = $('#userAge').val();
        let newPhoto = $('#userPhoto').val();
        if (newAge === "" && newName === "" && newDescription === "") {
            $('.error').html("Only the photo field can be empty. Please fill the rest<br>");
        }else{
             var url3 = 'https://intern-challenge.herokuapp.com/persons/create';//URL that POST request is sent to 
        var addingNewUser = {
            "name": newName,
            "age": newAge,
            "description": newDescription,
            "photo": newPhoto,
            "photo_thumb": newPhoto
        }; // new description is stored as a json object ready to be sent to the API

        $.ajax({ // Begining of ajax query
            url: url3, // url defined in the request statement
            dataType: "json", // type of data to be sent via the POST method
            method: 'POST', // POST method to send data to the API
            data: addingNewUser, // data to se sent to the API
        }).done(function (resp) {
            //let htmlContentNew = `<div id="userProfile"> <figure ><img class="imgThumb"src="${resp.person.photo}"></figure><span>${resp.person.name}</span><br><div class="fullProfile" hidden> <br><label>Age:</label><span>${resp.person.age}</span><br><label>ID code:</label><span>${resp.person.id}</span><br><label>Description:</label><article>${resp.person.description}</article><a class="editLink" href="#">[EDIT]</a><div id ='emptyDiv' hidden><input class="input" value=${resp.person.id} hidden><br>New Description:<br><textarea placeholder='Enter text here' required></textarea><br><button class='editText'>Submit</button></div></div><button class="button" data-text-swap="Close Details"><span>View Details </span></button></div>`;//data from the response is formatted in html with classes and ids that are styled using CSS.
            //$('#page').append(htmlContentNew);
            alert("User has been created!");
            console.log(resp);
            $('form').toggle();
            // Changes to description is automatically displayed on the browser.
        }).fail(requestError);

        }
       
    })// if successful 'updatePersons' is executed, else 'requestError' is returned
}


function requestError(e, part) {
    console.log(e);
    part = " user";
    $("#users").html(`<p class="network-warning error-${part}">Oh no! There was an error getting ${part} profiles, please check your internet connection.</p>`);
}// if all GET and POST request fails, the requestError function is called to display the error that might have occured.

$('.addUser').on('click', function (e) {
    e.preventDefault();
    $('form').toggle();
});

$('a.previous').on('click', function (e) {
    e.preventDefault();
    var url = 'https://intern-challenge.herokuapp.com/persons?page=';//URL that accepts the GET request
    url += --currentpage;
    $.ajax({    // Begining of ajax query
        url: url,     // url defined in the request statement
        method: 'GET', // GET method to get data from the API
        contentType: 'application/x-www-form-urlencoded',
    }).done(addPersons).fail(requestError); // if successful 'addPersons' is executed, else 'requestError' is returned
    $('.paginInput').attr("value", "Page " + currentpage + " of " + maxPage);

    if (currentpage <= 1) {
        $(this).addClass('disabled');
        $('a.next').removeClass('disabled');
    }
});

$('a.next').on('click', function (e) {
    e.preventDefault();
    var url = 'https://intern-challenge.herokuapp.com/persons?page=';
    url += ++currentpage; //URL that accepts the GET request
    $.ajax({    // Begining of ajax query
        url: url,     // url defined in the request statement
        method: 'GET', // GET method to get data from the API
        contentType: 'application/x-www-form-urlencoded',
    }).done(addPersons).fail(requestError); // if successful 'addPersons' is executed, else 'requestError' is returned
    $('.paginInput').attr("value", "Page " + currentpage + " of " + maxPage);

    if (currentpage === maxPage) {
        $(this).addClass('disabled');
        $('a.previous').removeClass('disabled');
    }

});


$('a.last').on('click', function (e) {
    e.preventDefault();
    var url = 'https://intern-challenge.herokuapp.com/persons?page=';
    url += maxPage; //URL that accepts the GET request
    $.ajax({    // Begining of ajax query
        url: url,     // url defined in the request statement
        method: 'GET', // GET method to get data from the API
        contentType: 'application/x-www-form-urlencoded',
    }).done(addPersons).fail(requestError); // if successful 'addPersons' is executed, else 'requestError' is returned
    $('.paginInput').attr("value", "Page " + maxPage + " of " + maxPage);
});
