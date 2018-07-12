var url = 'https://intern-challenge.herokuapp.com/persons';//URL that accepts the GET request

$.ajax({    // Begining of ajax query
    url: url,     // url defined in the request statement
    method: 'GET', // GET method to get data from the API
    async: false,
}).done(addPersons).fail(requestError); // if successful 'addPersons' is executed, else 'requestError' is returned

function addPersons(data) { //fuction that gets the the response as "data" 
    let htmlContent = ''; // variable to display the response in a readable UI/UX format is declared

    if (data.persons) { // checks if there is a node in the called "persons" in the json data response
        const person = data.persons; //response stored in constant 'person'.

        htmlContent = person.map(user => `<div id="userProfile"> <figure ><img class="imgThumb"src="${user.photo_thumb}"></figure><span>${user.name}</span><br><div class="fullProfile" hidden> <br><label>Age:</label><span>${user.age}</span><br><label>ID code:</label><span>${user.id}</span><br><label>Description:</label><article>${user.description}</article><a class="editLink" href="#">[EDIT]</a><div id ='emptyDiv' hidden><input value=${user.id} hidden><br>New Description:<br><textarea placeholder='Enter text here' required></textarea><br><button class='editText'>Submit</button></div></div><button class="button" data-text-swap="Close Details"><span>View Details </span></button></div>`).join('');//data from the response is formatted in html with classes and ids that are styled using CSS.
    
    } else { // If there is no node called "persons" in the jason data response
        htmlContent = `<div class="error-no-articles">no users available</div>`;// variable htmlContent displays an error message on the screen.
    }
   
   $('#users').html(htmlContent);
 //$("#users").append(htmlContent);//formatted response stored in htmlContent is displayed in the element with id=user
 

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
        
    */})

    $('.editLink').on("click", function (e) { // when EDIT link is clicked
        e.preventDefault(); // prevent normal behaviour of links and 
        $(this).next().show(); // show the element which is next to the element with class 'editLink', this is the div with id= emptyDiv 
        $(this).hide();// then hide the 'EDIT' link
    });


    
    $('.editText').on('click', function () { // when button with class=editText is clicked
        let idPerson = $(this).parent().find('input').val();// finds and store the input value of the particular user which is hidden by default  as idPerson
        let newDescription = $(this).parent().find('textarea').val();    // finds and store the New Description value of the particular user which is stored as newDescription
        var url2 = 'https://intern-challenge.herokuapp.com/persons/';//URL that POST request is sent to
        url2 += idPerson; // user id is added to the url2 to identify the specific use
        if (newDescription === ""){
            alert("Your description cannot be empty");
            return 0;
        }
        var des = {
            "description": newDescription,
        } // new description is stored as a json object ready to be sent to the API
     
        $.ajax({ // Begining of ajax query
            url: url2, // url defined in the request statement
            dataType: "json", // type of data to be sent via the POST method
            method: 'POST', // POST method to send data to the API
            data: des, // data to se sent to the API
            async: false,
        }).done(function updatePersons(data) {
             if (data.persons) { // checks if there is a node in the called "persons" in the json data response
        const person = data.persons; //response stored in constant 'person'.

        $('article').append(person.map(user => `${user.description}`));
            alert("Description has been updated!");
        }}).fail(requestError);
        $(this).parent().hide();
})// if successful 'updatePersons' is executed, else 'requestError' is returned

}


function requestError(e, part) {
    console.log(e);
    part = " user";
    $("#users").html(`<p class="network-warning error-${part}">Oh no! There was an error getting ${part} profiles, please check your internet connection.</p>`);
}// if all GET and POST request fails, the requestError function is called to display the error that might have occured.