 //Google API Key BEGINNING
var config = {
  apiKey: "AIzaSyCEEGy7Gh8x4iZZjILg66WA7nTXj34Gs5s",
  authDomain: "wonjunhong-test.firebaseapp.com",
  databaseURL: "https://wonjunhong-test.firebaseio.com",
  storageBucket: ""
};
//Google API Key ENDING

//Global Scope Variables BEGINNING
var frontPageLeft = $(".front-page-left");
var frontPageLeftPreview = $(".front-page-left-project-preview");
var frontPageRight = $(".front-page-right");
var addProjectButton = $("#addProjectButton");
var hideProjectDetailButton = $("#hideProjectDetailButton");
var addProjectDetails = $(".addProjectFields");
var projectLists = $(".projectList");
var teamList = $("#front-page-team-member-list-for-chat");
var chatWindow = $(".chat-window");
var chatSidebar = $(".chat-sidebar")
var currentUser;
var currentUserName;
var currentUserEmail;
var currentUserPhoto;
var firebaseDB;
var projectsInFirebase;
var chatsInFirebase;
var userinfoInFirebase;
//chatTargetList fetches the list of members that I will be talking to
var chatTargetList = ["abc@abc.com", "won.j.hong@gmail.com"];
var chatTargetListServer = [];
//chatList fetches chat content
var currentUserIsRegistered = "No";
var chatList;
var chatKeys;
var chatBrowserLoadedKeys;
var projectList;
var projectKeys;
var projectBrowserLoadedKeys;
var userList;
var userKeys;
// var userBrowserLoadedKeys;
var projectBrowserLoaded = 
	{"-KNNBaEJu_mZrnOso3FQ": 
		{
			creatorEmail: "wjh261@stern.nyu.edu",
			projectTopic: "Doctors Without Borders Mali Project",
			message: "This needs to be done asap",
			permission: "w.richard.hong@gmail.com"
		}
	};
var chatBrowserLoaded = 
	{"-KNNEj8ilJ4h_EzHLUQ-":
		{
			senderEmail: "wjh261@stern.nyu.edu",
			receiverEmail: "w.richard.hong@gmail.com",
			message: "hello, this is test-1",
			timestamp: "Jul 23 12:12"
		}
	};
// var userBrowserLoaded =
// 	{"-KNXXj8ilJ4h_EzHLUQ-":
// 		{
// 			userEmail: "wjh261@stern.edu",
// 			userName: "Won Jun Hong",
// 			userPhoto: "https://lh3.googleusercontent.com/-LplyWRwF4Sw/AAAAAAAAAAI/AAAAAAAABI4/b5ocqzKtpUg/s96-c/photo.jpg"
// 		}
// 	};

//Global Scope Variables ENDING
function loadServerInfoToBrowser(currentUserEmail, projectsInFirebase, chatsInFirebase, userinfoInFirebase) {
	projectsInFirebase.on("value", function(projects) {
		projectList = projects.val();
		projectKeys = Object.keys(projectList);
		projectBrowserLoadedKeys = Object.keys(projectBrowserLoaded);
		projectKeys.forEach(function(projectKey) {
			projectList[projectKey].permission.forEach(function(email){
				chatTargetListServer.push(email);
			});
			chatTargetListServer = [ ...new Set(chatTargetListServer)]
			var diff = $(chatTargetListServer).not(chatTargetList).get();
			diff.forEach(function(diff) {
				chatTargetList.push(diff);
			});
			chatTargetList = chatTargetList.filter(l => l!= "");
			projectBrowserLoadedKeys.forEach(function(projectBrowserLoadedKey) {
				if (projectKey !== projectBrowserLoadedKey) {
					if (projectList[projectKey].creatorEmail === currentUserEmail) {
						projectBrowserLoaded[projectKey] = projectList[projectKey];
					}
					projectList[projectKey].permission.forEach(function(permittedEmail) {
						if (permittedEmail === currentUserEmail) {
							projectBrowserLoaded[projectKey] = projectList[projectKey];
						}
					})
				}
			})
		})
	})
///Next step---add this to chat function
	if (chatWindow !== null) {
		window.setInterval(function() {
			chatsInFirebase.on("value", function(chats) {
				chatList = chats.val();
				chatKeys = Object.keys(chatList);
				chatBrowserLoadedKeys = Object.keys(chatBrowserLoaded);
				chatKeys.forEach(function(chatKey) {
					chatBrowserLoadedKeys.forEach(function(chatBrowserLoadedKey) {
						if (chatKey !== chatBrowserLoadedKey) {
							if (chatList[chatKey].senderEmail === currentUserEmail) {
								chatBrowserLoaded[chatKey] = chatList[chatKey];
							}
							if (chatList[chatKey].receiverEmail === currentUserEmail) {
								chatBrowserLoaded[chatKey] = chatList[chatKey];
							}
							//This Function Will be Deployed later when we adopt one-to-many chat model
							// chatList[chatKey].receiverEmail.forEach(function(email) {
							// 	if (email === currentUserEmail) {
							// 		chatBrowserLoaded[chatKey] = chatList[chatKey];
							// 	}
							// })
						}
					})
				})
			})
		}, 100);
	}
}

function currentUserIdentification(result) {
	var currentUser = result.user;
	if (currentUser.displayName === null) {
		// window.alert("you don't have a name doug!");
		var index = currentUser.email.indexOf("@");
		var emailIdString = currentUser.email.substring(0,index);
		currentUserName = emailIdString;
	} else {
		currentUserName = currentUser.displayName;
	}
	currentUserEmail = currentUser.email;
	currentUserPhoto = currentUser.photoURL;
};

function loadProjectsOnDashboard() {
	setTimeout(function() {
		// newUserDBRegisteration(userinfoInFirebase);
		// frontPageLeftPreview.replaceWith();
		projectKeys.forEach(function(projectKey) {
			projectPreview = $(`<ul>${projectList[projectKey].projectTopic}</br>${projectList[projectKey].creatorEmail}</ul>`);
			projectPreview.on('click', function(event) {
				projectLists.append(`</br></br>${projectList[projectKey].projectTopic}</br>${projectList[projectKey].projectTopic}</br>${projectList[projectKey].projectTopic}`);
				frontPageLeft.css("width", "43%");
				frontPageRight.css("display", "inline");
			});
			frontPageLeftPreview.append(projectPreview);
		});
		newUserDBRegisteration(userinfoInFirebase);
	}, 8000)
};

function addProject(){
	addProjectButton.hide();
	addProjectDetails.empty();
	frontPageLeft.css("width", "43%");
	frontPageRight.css("display", "inline");
	addProjectDetails.append(
		`	
	 	<form id="project-form">
	 		<label>Project Manager:</label>
	 		<textarea id="project-creator" type="text" class="form-control">${currentUserName}</textarea>
			
			<label>Project Title:</label>
			<textarea id="project-title" type="text" class="form-control" placeholder="i.e. Let's conquer the Mars by Christmas"></textarea></br>
			
			<label>Progress Percentage:</label>
			<textarea id="project-progress" type="text" class="form-control">0%</textarea></br>

			<label>Description:</label>
			<textarea id="project-description" type="text" class="form-control"></textarea></br>
			
			<label>Due Date</label>
			<textarea id="project-duedate" type="text" class="form-control"></textarea></br>

			<label>Project Members</label>
			<textarea id="project-staff" type="text" class="form-control" placeholder="Project staff emails separated by comma: i.e. abc@abc.com, bbc@bbc.com"></textarea></br>
		</form>
		<button id="submitProjectButton" onclick="submitProject()"> Submit</button>
		<button id="closeAddProjectButton" onclick="closeAddProject()">Close</button>
		`
	);
};

// function addChatTargetList() {
// 	setTimeout(function() {
// 		console.log(chatTargetList);
// 		console.log(userKeys);
// 		chatTargetList.forEach(function(chatTarget) {
// 			userKeys.forEach(function(userKey) {
// 				if (userList[userKey].userEmail === chatTarget && userList[userKey].userEmail!== currentUserEmail) {
// 					chatSidebar.append(
// 						`
// 			           	<div class="sidebar-name">
// 			                <a href="javascript:register_popup('${userList[userKey].userEmail}', '${userList[userKey].userName}');">
// 			                    <img width="30" height="30" src=${userList[userKey].userPhoto} />
// 			                    <span>${userList[userKey].userName}</span>
// 			                </a>
// 			            </div>
// 					    `
// 					)
// 				}
// 			})
// 		});
// 	}, 5000);
// }

// function changeScene() {
// 	$('.front-page-cover').css('display', 'inline');
// 	$('.welcome-login').css('display', 'none');
// };

// function hideProjectDetail() {
// 	frontPageRight.hide();
// 	frontPageLeft.css("width", "86%");
// 	addProjectButton.css("display", "inline");
// 	projectLists.empty();
// };

// function closeAddProject() {
// 	frontPageRight.hide();
// 	addProjectButton.hide();
// 	frontPageLeft.css("width", "86%");
// 	addProjectButton.css("display", "inline");
// 	addProjectDetails.empty();
// };

function submitProject() {
	var projectCreatorEmailToDB = currentUserEmail;
	var projectCreatorToDB = $('#project-creator').val();
	var projectTitleToDB = $('#project-title').val();
	var projectProgressToDB = $('#project-progress').val();
	var projectDescriptionToDB = $('#project-description').val();
	var projectDueDateToDB = $('#project-duedate').val();
	var projectStaffToDB = $('#project-staff').val();
	projectStaffToDB = projectStaffToDB.split(", ");
	var firebaseProjectDB = firebaseDB.ref("projectDB");
	firebaseProjectDB.push({
		creatorEmail: projectCreatorEmailToDB,
		creatorName: projectCreatorToDB,
		projectTopic: projectTitleToDB,
		status: projectProgressToDB,
		dueDate: projectDueDateToDB,
		description: projectDescriptionToDB,
		permission: projectStaffToDB
	});
	frontPageLeftPreview.empty();
	loadProjectsOnDashboard();
	$('#project-creator').val("");
	$('#project-title').val("");
	$('#project-progress').val("");
	$('#project-description').val("");
	$('#project-duedate').val("");
	$('#project-staff').val("");
}

//The structure of this is, you submit your chat directly to the Firebase server, 
//but load the chat from browserloaded.

var scrolled = false;

function scrollToBottom(divId) {
	var divIdModified = divId.replace(/[@&\/\\#,+()$~%.'":*?<>{}]/g,'-');
	var divIdModified = divIdModified+"chatContentBox";
	var divIdModifiedjQuery = "#"+divIdModified;
	console.log(divIdModifiedjQuery);
	$(divIdModifiedjQuery).on('scroll', function(){
    	scrolled = true;
	});
	if(!scrolled) {
		var elem = document.getElementById(divIdModified);
		elem.scrollTop = elem.scrollHeight;
	}    
}

function submitChat(id, idSpecialCharacterRemoved) {
	idSpecialCharacterRemoved = "#"+idSpecialCharacterRemoved+"chatInputBox";
	chatContent = $(idSpecialCharacterRemoved).val();
	var timestamp = new Date().toString();
	$(idSpecialCharacterRemoved).val("");
	chatsInFirebase.push(
		{
			message: chatContent,
			receiverEmail: id,
			senderEmail: currentUserEmail,
			timestamp: timestamp
		}
	);
	loadServerInfoToBrowser(currentUserEmail, projectsInFirebase, chatsInFirebase, userinfoInFirebase);
	scrollToBottom(id);
}

function displayChatContent(targetId, targetIdSpecialCharacterRemoved) {
	window.setInterval(function() {
		chatWindow = $(targetIdSpecialCharacterRemoved).val("");
		chatWindow.empty();
		chatBrowserLoadedKeys.forEach(function(chatBrowserLoadedKey) {
			chatInfo = chatBrowserLoaded[chatBrowserLoadedKey]
			if (chatInfo.senderEmail === currentUserEmail) {
				chatWindow.append(
					`
					I said,</br>
					${chatInfo.message}</br></br>
					`
				);
				scrollToBottom(targetId);
			} else if (chatInfo.receiverEmail === currentUserEmail) {
				chatWindow.append(
					`
					${chatInfo.senderEmail} says,</br>
					${chatInfo.message}</br></br>
					`
				);
				scrollToBottom(targetId);
			}
		})
	}, 1000);
}

// function newUserDBRegisteration(userinfoInFirebase) {
// 	userinfoInFirebase.on("value", function(users) {
// 		userList = users.val();
// 		userKeys = Object.keys(userList);
// 		currentUserIsRegistered = "No";
// 		userKeys.forEach(function(userKey) {
// 			if (userList[userKey].userEmail === currentUserEmail) {
// 				currentUserIsRegistered = "Yes";
// 			}
// 		})
// 	})
// 	setTimeout(function() {
// 		if (currentUserIsRegistered === "No") {
// 			userinfoInFirebase.push({
// 				userEmail: currentUserEmail,
// 				userName: currentUserName,
// 				userPhoto: currentUserPhoto
// 			});
// 		}
// 	addChatTargetList();
// 	}, 1000);
// }

// function login() {
// 	event.preventDefault();
// 	firebase.initializeApp(config);
// 	firebaseDB = firebase.database();
// 	var firebaseAuth = firebase.auth();
// 	var provider = new firebase.auth.GoogleAuthProvider();
// 	firebaseAuth.signInWithPopup(provider).then(function(result) {
// 		var currentUser = result.user;
// 		currentUserIdentification(result);
// 	}).then(function() {
// 		changeScene();
// 		projectsInFirebase = firebaseDB.ref("projectDB");
// 		chatsInFirebase = firebaseDB.ref("chatDB");
// 		userinfoInFirebase = firebaseDB.ref("userinfoDB");
// 		loadServerInfoToBrowser(currentUserEmail, projectsInFirebase, chatsInFirebase, userinfoInFirebase);
// 	})
// 	loadProjectsOnDashboard();
// }

////CHATBOARD
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
function close_popup(id) {
    for(var iii = 0; iii < popups.length; iii++) {
        if(id == popups[iii]) {
            Array.remove(popups, iii);
            document.getElementById(id).style.display = "none";
            calculate_popups();
            return;
        }
    }   
}

//displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
function display_popups() {
    var right = 220;  
    var iii = 0;
    for(iii; iii < total_popups; iii++) {
        if(popups[iii] != undefined) {
            var element = document.getElementById(popups[iii]);
            element.style.right = right + "px";
            right = right + 320;
            element.style.display = "block";
        }
    }
    for(var jjj = iii; jjj < popups.length; jjj++) {
        var element = document.getElementById(popups[jjj]);
        element.style.display = "none";
    }
}

//creates markup for a new popup. Adds the id to popups array.
function register_popup(id, name) {   
    for(var iii = 0; iii < popups.length; iii++) {   
        //already registered. Bring it to front.
        if(id == popups[iii]) {
            Array.remove(popups, iii);
            popups.unshift(id);
            calculate_popups();
            return;
        }
    }
    var idSpecialCharacterRemoved = id.replace(/[@&\/\\#,+()$~%.'":*?<>{}]/g,'-');
	var targetIdSpecialCharacterRemoved = "#"+idSpecialCharacterRemoved+"chatContentBox";    
    var element = '<div class="popup-box chat-popup" id="'+ id +'">';
    element = element + '<div class="popup-head">';
    element = element + '<div class="popup-head-left">'+ name +'</div>';
    element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\''+ id+'\');">&#10005;</a></div>';
    element = element + 
    `
    <div style="clear: both"></div></div>
    <div class="popup-messages">
    	<div class=chatContentBox id=${idSpecialCharacterRemoved}chatContentBox></div>
    	<input class=chatInputBox id=${idSpecialCharacterRemoved}chatInputBox placeholder="Press enter to message ${name}" onkeydown="if (event.keyCode == 13) { submitChat('${id}', '${idSpecialCharacterRemoved}') }"></input>
    </div>
    </div>
    `
    displayChatContent(id, targetIdSpecialCharacterRemoved);
    document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + element;  
    popups.unshift(id);           
    calculate_popups();   
}

//calculate the total number of popups suitable and then populate the toatal_popups variable.
function calculate_popups() {
    var width = window.innerWidth;
    if(width < 540) {
        total_popups = 0;
    } else {
        width = width - 200;
        //320 is width of a single popup box
        total_popups = parseInt(width/320);
    }
    display_popups();    
}

//recalculate when window is loaded and also when window is resized.
window.addEventListener("resize", calculate_popups);
window.addEventListener("load", calculate_popups);




