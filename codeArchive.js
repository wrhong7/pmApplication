var firebaseDB = "";
var browserLoadedProjects = [];
var a = "";
var testTeam = ["donald.j.trump@gmail.com","wjh261@stern.nyu.edu", "w.richard.hong@gmail.com"];
var chatList = [];

function login() {
	firebaseAuth.signInWithPopup(provider).then(function(result) {
		// token = result.credential.idToken;




	})
}

// Beginning of the Chatbox Javascript

//this function can remove a array element.
Array.remove = function(array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    return array.push.apply(array, rest);
};

//this variable represents the total number of popups can be displayed according to the viewport width
var total_popups = 0;

//arrays of popups ids
var popups = [];

//this is used to close a popup
function close_popup(id)
{
    for(var iii = 0; iii < popups.length; iii++)
    {
        if(id == popups[iii])
        {
            Array.remove(popups, iii);
            
            document.getElementById(id).style.display = "none";
            
            calculate_popups();
            
            return;
        }
    }   
}

//displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
function display_popups()
{
    var right = 220;
    
    var iii = 0;
    for(iii; iii < total_popups; iii++)
    {
        if(popups[iii] != undefined)
        {
            var element = document.getElementById(popups[iii]);
            element.style.right = right + "px";
            right = right + 320;
            element.style.display = "block";
        }
    }
    
    for(var jjj = iii; jjj < popups.length; jjj++)
    {
        var element = document.getElementById(popups[jjj]);
        element.style.display = "none";
    }
}

//creates markup for a new popup. Adds the id to popups array.
function register_popup(id, name)
{
  
  for(var iii = 0; iii < popups.length; iii++)

  {   
      //already registered. Bring it to front.
      if(id == popups[iii])
      {
          Array.remove(popups, iii);
      
          popups.unshift(id);
          
          calculate_popups();
          
          return;
      }
  }               
  
  var element = '<div class="popup-box chat-popup" id="'+ id +'">';
  var target = id;
  element = element + '<div class="popup-head">';
  element = element + '<div class="popup-head-left">'+ name +'</div>';
  element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\''+ id +'\');">&#10005;</a></div>';
  element = element + `<div style="clear: both"></div></div><div class="popup-messages"><div class="chat-content" id="${id+id}"></div><input onkeydown="if (event.keyCode == 13) { submitChat(${target}); }" class="chat-message-input-box" placeholder="Press Enter to Message ${name}"></input></div></div>`;

  // element = element + '<input class="chat-enter-box"></input>';
  
  document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + element;  

  popups.unshift(id);
          
  calculate_popups();

}

function submitChat(target) {

	var chatContent = $(".chat-message-input-box").val();

	// chatContent = chatContent.val();

	var index = currentUserEmail.indexOf("@");
	var emailIdString = currentUserEmail.substring(0,index);

	var databaseEntry = emailIdString+'-'+target.id;

	var timestamp = new Date();

	

	var firebaseProjectDB = firebaseDB.ref("chatDB");
	firebaseProjectDB.push(
		{
			Creator: emailIdString,
			Receiver: target.id,
			Timestamp: timestamp, 
			Message: chatContent
		}
	)


	firebaseProjectDB.on("value", function(projects) {

		var projectList = projects.val();
		var projectIds = Object.keys(projectList);

		projectIds.forEach(function(projectId){
			if (projectList[projectId].Creator === emailIdString && projectList[projectId].Receiver === target.id) {
				// console.log(projectList[projectId].Message)
				var uniqueId = target.id+target.id;

				var chatWindow = $(`#${uniqueId}`);

				console.log(projectList[projectId].Message);

				chatWindow.append(`</br>${projectList[projectId].Message}`);
			}
		})
	})
};


//calculate the total number of popups suitable and then populate the toatal_popups variable.
function calculate_popups()
{
    var width = window.innerWidth;
    if(width < 540)
    {
        total_popups = 0;
    }
    else
    {
        width = width - 200;
        //320 is width of a single popup box
        total_popups = parseInt(width/320);
    }
    
    display_popups();
    
}

//recalculate when window is loaded and also when window is resized.
window.addEventListener("resize", calculate_popups);
window.addEventListener("load", calculate_popups);

// End of the Chatbox

// Beginning of the appliation listing and adding project fields





	// console.log("this is rendered-1")

	// userEmailListInFirebase.on("value", function(emails) {	
	// 	var userEmailList = emails.val();

	// 	console.log("this is rendered-2")

	// 	var userEmailListKey = Object.keys(userEmailList);

	// 	userEmailListKey.forEach(function(userEmailListId) {
	// 		if (currentUserEmail === userEmailList[userEmailListId].Email) {

	// 			var loadDataFromFirebase = new Firebase(`https://wonjunhong-test.firebaseio.com/project/wonjunhong-test/database/data/userEmailList/${userEmailListId}/ColleagueEmails`);
	// 			// console.log(`https://wonjunhong-test.firebaseio.com/project/wonjunhong-test/database/data/userEmailList/${userEmailListId}/ColleagueEmails`)
	// 			// loadDataFromFirebase.remove();
	// 			// loadDataFromFirebase.on('value', function(email) {
	// 			// 	email.set(colleagueEmailList);
	// 			// })

	// 			loadDataFromFirebase.set(colleagueEmailList);

	// 		} 
	// 	});
	// });
// TRY THE FIREBASE UPDATE

}

// var frontPageLeft = $(".front-page-left");
// var frontPageRight = $(".front-page-right");
// var addProjectButton = $("#addProjectButton");
// var addProjectDetails = $(".addProjectFields");
// var projectLists = $(".projectList");
// var firebaseDB = "";
// var browserLoadedProjects = [];
// var colleagueEmailList = [];
// var a = "";

// var testTeam = ["donald.j.trump@gmail.com","wjh261@stern.nyu.edu", "w.richard.hong@gmail.com"];

// var teamList = $("#front-page-team-member-list-for-chat");
// var currentUserName = "";
// var currentUserEmail = "";
// var currentUserPhoto = "";
// var chatList = [];

// function login() {

// 	event.preventDefault();
// 	$('.front-page-cover').css('display', 'inline');
// 	$('.welcome-login').css('display', 'none');

// 	var config = {
// 	  apiKey: "AIzaSyCEEGy7Gh8x4iZZjILg66WA7nTXj34Gs5s",
// 	  authDomain: "wonjunhong-test.firebaseapp.com",
// 	  databaseURL: "https://wonjunhong-test.firebaseio.com",
// 	  storageBucket: ""
// 	};

// 	firebase.initializeApp(config);

// 	var firebaseDB = firebase.database();
// 	var firebaseAuth = firebase.auth();
// 	var provider = new firebase.auth.GoogleAuthProvider();
// 	var token;
// 	var user;

// 	firebaseAuth.signInWithPopup(provider).then(function(result) {
// 		token = result.credential.idToken;
// 		// console.log(result);
// 		// console.log(result.user.displayName);
// 		var currentUser = result.user;

// 		if (currentUser.displayName === null) {
// 			// window.alert("you don't have a name doug!");
// 			var index = currentUser.email.indexOf("@");
// 			var emailIdString = currentUser.email.substring(0,index);
// 			currentUserName = emailIdString;
// 		} else {
// 			currentUserName = currentUser.displayName;
// 		}

// 		currentUserEmail = currentUser.email;
// 		currentUserPhoto = currentUser.photoURL;

// 		userEmailListInFirebase = firebaseDB.ref("userEmailList")
// 		// userEmailListInFirebase.push({Email: "donald@trump.com", Name: "Donald J Trump", Photo: "http://media3.s-nbcnews.com/j/newscms/2015_50/1312506/151122-donald-trump-smiling-956a_6d624dc0061bbd1233cc33461649ea73.nbcnews-fp-1200-800.jpg"});
// 		userEmailListInFirebase.on("value", function(emails) {
// 			var isUserRegistered = "No";
			
// 			var userEmailList = emails.val();

// 			var userEmailListKey = Object.keys(userEmailList);
// 			userEmailListKey.forEach(function(userEmailListId) {
// 				if (currentUserEmail === userEmailList[userEmailListId].Email) {
// 					isUserRegistered = "Yes";
// 				} 
// 			});

// 			if (isUserRegistered === "No") {
// 				userEmailListInFirebase.push({Email: currentUserEmail, Name: currentUserName, Photo: currentUserPhoto, ColleagueEmails: colleagueEmailList});
// 			}
// 		});

// 		projectsInFirebase = firebaseDB.ref("projectDB");
// 		projectsInFirebase.on("value", function(projects) {

// 			var projectList = projects.val();
// 			var projectIds = Object.keys(projectList);

// 			projectIds.forEach(function(ProjectId) {
// 				var accessAllowedEmailList = [];
// 				var staffMembers = projectList[ProjectId].projectStaffToDB

// 				accessAllowedEmailList.push(projectList[ProjectId].projectCreatorEmailToDB);
// 				staffMembers.forEach(function(staffMember) {
// 					accessAllowedEmailList.push(staffMember);
// 					chatList.push(staffMember);
// 				})

// 				browserLoadedProjects.push({
// 					projectCreatorEmailToDB: projectList[ProjectId].projectCreatorEmailToDB,
// 					projectCreatorToDB: projectList[ProjectId].projectCreatorToDB,
// 					projectTitleToDB: projectList[ProjectId].projectTitleToDB,
// 					projectProgressToDB: projectList[ProjectId].projectProgressToDB,
// 					projectDueDateToDB: projectList[ProjectId].projectDueDateToDB,
// 					projectDescriptionToDB: projectList[ProjectId].projectDescriptionToDB,
// 					projectStaffToDB: accessAllowedEmailList
// 				});
// 			});
// 			var chatListRemoveDuplicate = [];
// 			$.each(chatList, function(i, el){
// 			    if($.inArray(el, chatListRemoveDuplicate) === -1) chatListRemoveDuplicate.push(el);
// 			});

// 			chatListRemoveDuplicate.forEach(function(chatPerson) {

// 				var index = chatPerson.indexOf("@");
// 				console.log(index);
// 				var emailIdString = chatPerson.substring(0,index);
// 				console.log(emailIdString);
// 				$(".chat-sidebar").append(
// 				    `
// 				    <div class="sidebar-name">
// 				        <a href="javascript:register_popup('${emailIdString}', '${emailIdString}');">
// 				            <img width="30" height="30" src="http://media3.s-nbcnews.com/j/newscms/2015_50/1312506/151122-donald-trump-smiling-956a_6d624dc0061bbd1233cc33461649ea73.nbcnews-fp-1200-800.jpg" />
// 				            <span>${chatPerson}</span>
// 				        </a>
// 				    </div>
// 				    `
// 				);
// 			});
// 		// console.log("pushed")
// 		loadProjects();
// 		})

// 		function loadProjects() {

// 			browserLoadedProjects.forEach(function(project) {
// 				project.projectStaffToDB.forEach(function(userEmail) {
// 					if (userEmail === currentUserEmail) {
// 						var loadedProject = $(`<ul>${project.projectTitleToDB}</br>${project.projectDueDateToDB}</ul>`);

// 						loadedProject.on('click', function(event) {
// 							projectLists.append(`</br></br>${project.projectCreatorToDB}</br>${project.projectTitleToDB}</br>${project.projectDescriptionToDB}`);
// 							frontPageLeft.css("width", "43%");
// 							frontPageRight.css("display", "inline");
// 						});

// 						frontPageLeft.append(loadedProject);					
// 					}
// 				})
// 			})
// 		}
// 	})
// }

// // Beginning of the Chatbox Javascript

// //this function can remove a array element.
// Array.remove = function(array, from, to) {
//     var rest = array.slice((to || from) + 1 || array.length);
//     array.length = from < 0 ? array.length + from : from;
//     return array.push.apply(array, rest);
// };

// //this variable represents the total number of popups can be displayed according to the viewport width
// var total_popups = 0;

// //arrays of popups ids
// var popups = [];

// //this is used to close a popup
// function close_popup(id)
// {
//     for(var iii = 0; iii < popups.length; iii++)
//     {
//         if(id == popups[iii])
//         {
//             Array.remove(popups, iii);
            
//             document.getElementById(id).style.display = "none";
            
//             calculate_popups();
            
//             return;
//         }
//     }   
// }

// //displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
// function display_popups()
// {
//     var right = 220;
    
//     var iii = 0;
//     for(iii; iii < total_popups; iii++)
//     {
//         if(popups[iii] != undefined)
//         {
//             var element = document.getElementById(popups[iii]);
//             element.style.right = right + "px";
//             right = right + 320;
//             element.style.display = "block";
//         }
//     }
    
//     for(var jjj = iii; jjj < popups.length; jjj++)
//     {
//         var element = document.getElementById(popups[jjj]);
//         element.style.display = "none";
//     }
// }

// //creates markup for a new popup. Adds the id to popups array.
// function register_popup(id, name)
// {
  
//   for(var iii = 0; iii < popups.length; iii++)

//   {   
//       //already registered. Bring it to front.
//       if(id == popups[iii])
//       {
//           Array.remove(popups, iii);
      
//           popups.unshift(id);
          
//           calculate_popups();
          
//           return;
//       }
//   }               
  
//   var element = '<div class="popup-box chat-popup" id="'+ id +'">';
//   var target = id;
//   element = element + '<div class="popup-head">';
//   element = element + '<div class="popup-head-left">'+ name +'</div>';
//   element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\''+ id +'\');">&#10005;</a></div>';
//   element = element + `<div style="clear: both"></div></div><div class="popup-messages"><div class="chat-content" id="${id+id}"></div><input onkeydown="if (event.keyCode == 13) { submitChat(${target}); }" class="chat-message-input-box" placeholder="Press Enter to Message ${name}"></input></div></div>`;

//   // element = element + '<input class="chat-enter-box"></input>';
  
//   document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + element;  

//   popups.unshift(id);
          
//   calculate_popups();

// }

// function submitChat(target) {

// 	var chatContent = $(".chat-message-input-box").val();

// 	// chatContent = chatContent.val();

// 	var index = currentUserEmail.indexOf("@");
// 	var emailIdString = currentUserEmail.substring(0,index);

// 	var databaseEntry = emailIdString+'-'+target.id;

// 	var timestamp = new Date();

// 	var firebaseDB = firebase.database();

// 	var firebaseProjectDB = firebaseDB.ref("chatDB");
// 	firebaseProjectDB.push(
// 		{
// 			Creator: emailIdString,
// 			Receiver: target.id,
// 			Timestamp: timestamp, 
// 			Message: chatContent
// 		}
// 	)


// 	firebaseProjectDB.on("value", function(projects) {

// 		var projectList = projects.val();
// 		var projectIds = Object.keys(projectList);

// 		projectIds.forEach(function(projectId){
// 			if (projectList[projectId].Creator === emailIdString && projectList[projectId].Receiver === target.id) {
// 				// console.log(projectList[projectId].Message)
// 				var uniqueId = target.id+target.id;

// 				var chatWindow = $(`#${uniqueId}`);

// 				console.log(projectList[projectId].Message);

// 				chatWindow.append(`</br>${projectList[projectId].Message}`);
// 			}
// 		})
// 	})
// };


// //calculate the total number of popups suitable and then populate the toatal_popups variable.
// function calculate_popups()
// {
//     var width = window.innerWidth;
//     if(width < 540)
//     {
//         total_popups = 0;
//     }
//     else
//     {
//         width = width - 200;
//         //320 is width of a single popup box
//         total_popups = parseInt(width/320);
//     }
    
//     display_popups();
    
// }

// //recalculate when window is loaded and also when window is resized.
// window.addEventListener("resize", calculate_popups);
// window.addEventListener("load", calculate_popups);

// // End of the Chatbox

// // Beginning of the appliation listing and adding project fields

// function addProject() {
// 	addProjectButton.hide();
// 	frontPageLeft.css("width", "43%");
// 	frontPageRight.css("display", "inline");
// 	addProjectDetails.append(
// 		`	
// 	 	<form id="project-form">
// 	 		<label>Project Manager:</label>
// 	 		<textarea id="project-creator" type="text" class="form-control">${currentUserName}</textarea>
			
// 			<label>Project Title:</label>
// 			<textarea id="project-title" type="text" class="form-control" placeholder="i.e. Let's conquer the Mars by Christmas"></textarea></br>
			
// 			<label>Progress Percentage:</label>
// 			<textarea id="project-progress" type="text" class="form-control">0%</textarea></br>

// 			<label>Description:</label>
// 			<textarea id="project-description" type="text" class="form-control"></textarea></br>
			
// 			<label>Due Date</label>
// 			<textarea id="project-duedate" type="text" class="form-control"></textarea></br>

// 			<label>Project Members</label>
// 			<textarea id="project-staff" type="text" class="form-control" placeholder="Project staff emails separated by comma: i.e. abc@abc.com, bbc@bbc.com"></textarea></br>

// 		</form>
// 		<button id="submitProjectButton" onclick="submitProject()"> Submit</button>
// 		<button id="closeAddProjectButton" onclick="closeAddProject()">Close</button>
// 		`
// 	);
// }

// function submitProject() {
// 	var projectCreatorEmailToDB = currentUserEmail;
// 	var projectCreatorToDB = $('#project-creator').val();
// 	var projectTitleToDB = $('#project-title').val();
// 	var projectProgressToDB = $('#project-progress').val();
// 	var projectDescriptionToDB = $('#project-description').val();
// 	var projectDueDateToDB = $('#project-duedate').val();
// 	var projectStaffToDB = $('#project-staff').val();
// 	var firebaseDB = firebase.database();
// 	projectStaffToDB = projectStaffToDB.split(", ");
// 	var firebaseProjectDB = firebaseDB.ref("projectDB");
// 	firebaseProjectDB.push({
// 		projectCreatorEmailToDB: projectCreatorEmailToDB,
// 		projectCreatorToDB: projectCreatorToDB,
// 		projectTitleToDB: projectTitleToDB,
// 		projectProgressToDB: projectProgressToDB,
// 		projectDueDateToDB: projectDueDateToDB,
// 		projectDescriptionToDB: projectDescriptionToDB,
// 		projectStaffToDB: projectStaffToDB
// 	})

// 	addingColleagues(colleagueEmailList, projectStaffToDB);

// 	// console.log("this is new Colleague Email List");
// 	// console.log(colleagueEmailList);

// 	var index = colleagueEmailList.indexOf("test@test.com");
// 	if (index >= 0) {
// 	  colleagueEmailList.splice( index, 1 );
// 	}

// 	userEmailListInFirebase = firebaseDB.ref("userEmailList")

// 	// console.log("this is rendered-1")

// 	// userEmailListInFirebase.on("value", function(emails) {	
// 	// 	var userEmailList = emails.val();

// 	// 	console.log("this is rendered-2")

// 	// 	var userEmailListKey = Object.keys(userEmailList);

// 	// 	userEmailListKey.forEach(function(userEmailListId) {
// 	// 		if (currentUserEmail === userEmailList[userEmailListId].Email) {

// 	// 			var loadDataFromFirebase = new Firebase(`https://wonjunhong-test.firebaseio.com/project/wonjunhong-test/database/data/userEmailList/${userEmailListId}/ColleagueEmails`);
// 	// 			// console.log(`https://wonjunhong-test.firebaseio.com/project/wonjunhong-test/database/data/userEmailList/${userEmailListId}/ColleagueEmails`)
// 	// 			// loadDataFromFirebase.remove();
// 	// 			// loadDataFromFirebase.on('value', function(email) {
// 	// 			// 	email.set(colleagueEmailList);
// 	// 			// })

// 	// 			loadDataFromFirebase.set(colleagueEmailList);

// 	// 		} 
// 	// 	});
// 	// });
// // TRY THE FIREBASE UPDATE

// }

// function closeAddProject() {
// 	frontPageRight.hide();
// 	addProjectButton.hide();
// 	frontPageLeft.css("width", "86%");
// 	addProjectButton.css("display", "inline");
// }

// function addingColleagues(existingList, newList) {
// 	newList.forEach(function(newListElement) {
// 		var isItNewColleague = "Yes";
// 		existingList.forEach(function(existingListElement) {
// 			if (newListElement === existingListElement) {
// 				isItNewColleague = "No";
// 			};
// 		});
// 		if (isItNewColleague === "Yes") {
// 			existingList.push(newListElement);
// 			return existingList;
// 		};
// 	});
// }

