$(document).ready(function () {
    //what kind of interface we want at the start 
    const APIKEY = "63b429ec969f06502871a8e8";
    getContacts();
    $("#update-contact-container").hide();
    $("#add-update-msg").hide();
  
    //[STEP 1]: Create our submit form listener
    $("#contact-submit").on("click", function (e) {
      //prevent default action of the button 
      e.preventDefault();
  
      //[STEP 2]: let's retrieve form data
      //for now we assume all information is valid
      //you are to do your own data validation
      let contactName = $("#contact-name").val();
      let contactID = $("#contact-ID").val();
      let contactmentor = $("#contact-mentor").val();
      let contactclass = $("#contact-classroom").val();
      let contactcourse = $("#contact-course").val();
      let contactmodule = $("#contact-module").val();
  
      //[STEP 3]: get form values when user clicks on send
      //Adapted from restdb api
      let jsondata = {
        "name": contactName,
        "Student_ID": contactID,
        "Student_Mentor": contactmentor,
        "Student_Class": contactclass,
        "Course" : contactcourse,
        "Module" : contactmodule
      };
  
      //[STEP 4]: Create our AJAX settings. Take note of API key
      let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://interactivedev-2483.restdb.io/rest/information",
        "method": "POST", //[cher] we will use post to send info
        "headers": {
          "content-type": "application/json",
          "x-apikey": APIKEY,
          "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata),
        "beforeSend": function(){
          //@TODO use loading bar instead
          //disable our button or show loading bar
          $("#contact-submit").prop( "disabled", true);
          //clear our form using the form id and triggering it's reset feature
          $("#add-contact-form").trigger("reset");
        }
      }
  
      //[STEP 5]: Send our ajax request over to the DB and print response of the RESTDB storage to console.
      $.ajax(settings).done(function (response) {
        console.log(response);
        
        $("#contact-submit").prop( "disabled", false);
        
        //@TODO update frontend UI 
        $("#add-update-msg").show().fadeOut(3000);
  
        //update our table 
        getContacts();
      });
    });//end click 
  
  
    //[STEP] 6
    //let's create a function to allow you to retrieve all the information in your contacts
    //by default we only retrieve 10 results
    function getContacts(limit = 10, all = true) {
  
      //[STEP 7]: Create our AJAX settings
      let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://interactivedev-2483.restdb.io/rest/information",
        "method": "GET", //[cher] we will use GET to retrieve info
        "headers": {
          "content-type": "application/json",
          "x-apikey": APIKEY,
          "cache-control": "no-cache"
        },
      }
  
      //[STEP 8]: Make our AJAX calls
      //Once we get the response, we modify our table content by creating the content internally. We run a loop to continously add on data
      //RESTDb/NoSql always adds in a unique id for each data, we tap on it to have our data and place it into our links 
      $.ajax(settings).done(function (response) {
        
        let content = "";
  
        for (var i = 0; i < response.length && i < limit; i++) {
          //console.log(response[i]);
          //[METHOD 1]
          //let's run our loop and slowly append content
          //we can use the normal string append += method
          /*
          content += "<tr><td>" + response[i].name + "</td>" +
            "<td>" + response[i].email + "</td>" +
            "<td>" + response[i].message + "</td>
            "<td>Del</td><td>Update</td</tr>";
          */
  
          //[METHOD 2]
          //using our template literal method using backticks
          //take note that we can't use += for template literal strings
          //we use ${content} because -> content += content 
          //we want to add on previous content at the same time
          content = `${content}<tr id='${response[i]._id}'><td>${response[i].name}</td>
          <td>${response[i].Student_ID}</td>
          <td>${response[i].Student_Mentor}</td>
          <td>${response[i].Student_Class}</td>
          <td>${response[i].Course}</td>
          <td>${response[i].Module}</td>
          <td><a href='#' class='delete' data-id='${response[i]._id}'>Del</a></td><td><a href='#update-contact-container' class='update' data-id='${response[i]._id}' data-name='${response[i].name}' data-ID='${response[i].Student_ID}' data-mentor='${response[i].Student_Mentor}' 
          data-class='${response[i].Student_Class}' data-course='${response[i].Course}' data-module='${response[i].Module}'>Update</a></td></tr>`;
  
        }
  
        //[STEP 9]: Update our HTML content
        //let's dump the content into our table body
        $("#contact-list tbody").html(content);
  
        $("#total-contacts").html(response.length);
      });
  
  
    }
  
    //[STEP 10]: Create our update listener
    //here we tap onto our previous table when we click on update
    //this is a delegation feature of jquery
    //because our content is dynamic in nature, we listen in on the main container which is "#contact-list". For each row we have a class .update to help us
    $("#contact-list").on("click", ".update", function (e) {
      e.preventDefault();
      //update our update form values
      let contactname = $(this).data("name");
      let contactID = $(this).data("contact-ID");
      let contactmentor = $(this).data("mentor");
      let contactclass = $(this).data("class");
      let contactcourse = $(this).data("course");
      let contactmodule = $(this).data("module");
      let contactid = $(this).data("id");
   
  
      //[STEP 11]: Load in our data from the selected row and add it to our update contact form 
      $("#update-contact-name").val(contactname);
      $("#update-contact-ID").val(contactID);
      $("#update-contact-mentor").val(contactmentor);
      $("#update-contact-class").val(contactclass);
      $("#update-contact-course").val(contactcourse);
      $("#update-contact-module").val(contactmodule);
      $("#update-contact-id").val(contactid);
      $("#update-contact-container").show();
  
    });//end contact-list listener for update function
  
    //[STEP 12]: Here we load in our contact form data
    //Update form listener
    $("#update-contact-submit").on("click", function (e) {
      e.preventDefault();
      //retrieve all my update form values
      let contactname = $("#update-contact-name").val();
      let contactID = $("#update-contact-ID").val();
      let contactmentor = $("#update-contact-mentor").val();
      let contactclass = $("#update-contact-class").val();
      let contactcourse = $("#update-contact-course").val();
      let contactmodule = $("#update-contact-module").val();
      let contactmsg = $("#update-contact-msg").val();
      let ID = $("#update-contact-id").val();
   
      //[STEP 12a]: We call our update form function which makes an AJAX call to our RESTDB to update the selected information
      updateForm(ID, contactID, contactname, contactID, contactmentor, contactclass, contactcourse, contactmodule);
    });//end updatecontactform listener
  
    //[STEP 13]: function that makes an AJAX call and process it 
    //UPDATE Based on the ID chosen
    function updateForm(id, contactID, contactName, contactmentor, contactclass, contactcourse, contactmodule) {
      //@TODO create validation methods for id etc. 
  
      var jsondata = { "name": contactName, "Student_ID": contactID, "Student_Mentor": contactmentor, "Student_Class":contactclass, "Course":contactcourse, "Module":contactmodule};
      var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://interactivedev-2483.restdb.io/rest/information/${id}`,//update based on the ID
        "method": "PUT",
        "headers": {
          "content-type": "application/json",
          "x-apikey": APIKEY,
          "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(jsondata)
      }
  
      //[STEP 13a]: send our AJAX request and hide the update contact form
      $.ajax(settings).done(function (response) {
        console.log(response);
        
        $("#update-contact-container").fadeOut(2000);
        //update our contacts table
        getContacts();
      });
    }//end updateform function

    $("#contact-list").on("click",".delete", function(e){
      e.preventDefault();

      let id = $(this).data("id");
      

      var setting = {
        "async": true,
        "crossDomain": true,
        "url": `https://interactivedev-2483.restdb.io/rest/information/${id}`,//update based on the ID
        "method": "delete",
        "headers": {
          "content-type": "application/json",
          "x-apikey": APIKEY,
          "cache-control": "no-cache"

      } 
    }

    $.ajax(setting).done(function(res){
      console.log(res);
      getContacts();
      });
  
    });



  })