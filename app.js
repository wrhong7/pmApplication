//Google API Key BEGINNING
var config = {
  apiKey: "AIzaSyCEEGy7Gh8x4iZZjILg66WA7nTXj34Gs5s",
  authDomain: "wonjunhong-test.firebaseapp.com",
  databaseURL: "https://wonjunhong-test.firebaseio.com",
  storageBucket: ""
};
//Google API Key ENDING
var projectsInFirebase;
var chatsInFirebase;
var userinfoInFirebase;
var projectsInFirebaseKeys;
var chatsInFirebaseKeys;
var userinfoInFirebaseKeys;
var userinfoInFirebaseCurrentUserKey;
var currentUserDBInfoURL;
//Global Scope Variables BEGINNING
var frontPageLeft = $(".front-page-left");
var frontPageLeftPreview = $(".front-page-left-project-preview");
var frontPageRight = $(".front-page-right");
var frontPageDetail = $(".front-page-detail");
var addProjectButton = $("#addProjectButton");
var hideProjectDetailButton = $("#hideProjectDetailButton");
var addProjectDetails = $(".addProjectFields");
var projectLists = $(".projectList");
var teamList = $("#front-page-team-member-list-for-chat");
var chatWindow = $(".chat-window");
var chatSidebar = $(".chat-sidebar");
var userProfilePreviewPhoto = $(".front-page-user-profile-info-left");
var userProfilePreview = $(".front-page-user-profile-info-right");
var addStageInputFields = $(".add-Stage-Input-Fields");
var projectStaffList = [];
var stages = [];
var currentUser;
var currentUserName;
var currentUserEmail;
var currentUserPhoto;
var firebaseDB;
var projectsInFirebase;
var chatsInFirebase;
var userinfoInFirebase;
var chatTargetList = [];
var chatTargetBrowserDB = {};
var currentUserIsRegistered = "No";
var chatList;
var chatKeys;
var chatBrowserLoadedKeys;
var projectList;
var projectKeys;
var projectBrowserLoadedKeys;
var userList;
var userKeys;
var addTargetButton;
var globalStageNumber;
var globalGoalNumberArray = [];
var projectAllocationArray = [];
var globalStageNumberPrev;
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
function hideProjectDetail() {
	frontPageRight.hide();
	frontPageLeft.css("width", "100%");
	addProjectButton.css("display", "inline");
	projectLists.empty();
};
function closeAddProject() {
	frontPageRight.hide();
	addProjectButton.hide();
	frontPageLeft.css("width", "100%");
	frontPageLeft.css("display", "inline");
	addProjectButton.css("display", "inline");
	addProjectDetails.empty();
};
function changeScene() {
	$('.front-page-cover').css('display', 'inline');
	$('.welcome-login-wrapper').css('display', 'none');
};
function removingEmailListElement(element) {
	jQueryElement = "#"+element;
	jQueryElement = `${jQueryElement}`;
	projectStaffListElementDiv = $(jQueryElement);
	projectStaffListElementDiv.remove();
	var indexForRemoval = projectStaffList.indexOf(element);
	projectStaffList.splice(indexForRemoval, 1);
};

function addStaffToProject() {
	projectStaffListElement = $('#project-staff').val();
	emailEnteredDiv = $(".email-entered");
	emailEnteringDiv = $(".email-entering");
	projectStaffListElementSpecialCharRemoved = projectStaffListElement.replace(/[@&\/\\#,+()$~%.'":*?<>{}]/g,'-');
	if (chatTargetBrowserDB[projectStaffListElement] !== undefined) {
		emailEnteredDiv.append(
			`
			<div id="${projectStaffListElementSpecialCharRemoved}" class="email-list-added">
				<div class="email-list-element"> <img src="${chatTargetBrowserDB[projectStaffListElement][1]}" height="15px" width="15px" /> ${chatTargetBrowserDB[projectStaffListElement][0]} (${projectStaffListElement})</div>
				<div class="email-list-x-button" onclick="removingEmailListElement('${projectStaffListElementSpecialCharRemoved}')">x</div>
			</div>
			`
		);			
	} else {
		emailEnteredDiv.append(
			`
			<div id="${projectStaffListElementSpecialCharRemoved}" class="email-list-added">
				<div class="email-list-element">${projectStaffListElement}</div>
				<div class="email-list-x-button" onclick="removingEmailListElement('${projectStaffListElementSpecialCharRemoved}')">x</div>
			</div>
			`
		);	
	}
	projectStaffList.push(projectStaffListElement);
	setTimeout(function() {
		$("#project-staff").val("");
	}, 50);
};

function addProject() {
	projectStaffList = [];
	addProjectButton.hide();
	addProjectDetails.empty();
	frontPageLeft.hide();
	frontPageRight.empty();
	frontPageDetail.empty();
	frontPageRight.hide();
	frontPageDetail.hide();
	addProjectDetails.append(
		`	
	 	<form id="project-form">
	 		<div class="two-entry-fields">
			 	<div class="row">
			 		<div class="four columns">
				 		<label>Project Manager</label>
				 		<input id="project-creator" type="text" class="form-control" value=${currentUserName}></input>
			 		</div>
			 		<div class="four columns">
						<label>Due Date</label>
						<input type="date" id="project-duedate" class="form-control"></input>
			 		</div>
			 		<div class="four columns">
						<label>Current Completion Percentage</label>
						<input id="project-progress" placeholder="i.e. 0% (must be in %)" type="text" class="form-control" value="0%"></input>
			 		</div>
			 	</div>
			</div>
		 	<div class="row">
		 		<div class="twelve columns">
		 			<label>Project Title</label>
					<textarea id="project-title" type="text" class="form-control" placeholder="i.e. Let's conquer the Mars by Christmas"></textarea>
		 		</div>
		 	</div>
		 	<div class="row">
		 		<div class="twelve columns">
					<label>Description:</label>
					<textarea id="project-description" type="text" class="form-control"></textarea>
		 		</div>
		 	</div>
		 	<div class="twelve columns">
				<label>Project Members</label>
				<div class="email-entered-entering">
					<div class="email-entered">
					</div>
					<div class="email-entering">
						<input 
							id="project-staff"
							class="form-control"  
							type="text"
							onkeydown="if (event.keyCode === 186 || event.keyCode === 13 || event.keyCode === 188 || event.keyCode === 9) { addStaffToProject() }"						
							placeholder="Email or Name"
						></input>
					</div>
	 			</div>
		 	</div>		
		</form>

		<div class="addStage-button-group">
			<button id="addStageButton" class="button-primary">Add Stage</button>
		</div>

		<div class="add-Stage-Input-Fields">
		</div>

		<div class="submit-button-group">
			<button id="submitProjectButton" class="button-primary" onclick="submitProject()">Submit</button>
			<button id="closeAddProjectButton" onclick="closeAddProject()">Close</button>
		</div>
		`
	);

	var addStageButton = $("#addStageButton");
	globalStageNumber = 0;

	addStageButton.on('click', function(event) {
		event.preventDefault();
		globalGoalNumberArray.push(0);
		projectAllocationArray.push([]);
		globalGoalNumber = globalGoalNumberArray[globalStageNumber];

		addProjectDetails.append(
			`
			<form id="stage-form">
				<div class="addStageInputFields-substage" id="addStageInputFields-substage-${globalStageNumber}">
					<label>Stage <b>${globalStageNumber + 1}</b> Subject</label>
					<input class="substage-topic" id="addStageInputFields-substage-input-${globalStageNumber}" placeholder="i.e. Building the foundation for lasting client relationship." type="text"></input>
				</div>
				<div id="addTargetInputFields-${globalStageNumber}" class="addTargetInputFields">
					<label>Goals to Attain</label>
					<div class="substageGoalFirstInput" id="substageGoalFirstInput-${globalStageNumber}-${globalGoalNumber}">
						<input class="substage-goal" id="substageGoalFirstInput-value-${globalStageNumber}-${globalGoalNumber}" placeholder="i.e. Assistant PM will finish market research" type="text"></input>
						<button class="allocateGoalButton button-primary" onclick="allocateGoal(${globalStageNumber}, ${globalGoalNumber})">Allocate</button>
					</div>
					<div class="substageGoalSecondInput" id="substageGoalSecondInput-${globalStageNumber}-${globalGoalNumber}">
					</div>
				</div>
				<div class="addTarget-button-group">
					<button id="addTargetButton" class="button-primary" onclick="addTarget(${globalStageNumber})">Add Goals</button>
				</div>
			</form>
			`
		);

		globalGoalNumberArray[globalStageNumber] += 1;
		globalStageNumber += 1;
	});
};

function allocateGoal(stageNumber, goalNumber) {
	event.preventDefault();
	var stageNumberToUniqueQuerySecond = "substageGoalSecondInput-" + stageNumber + "-" + goalNumber;
	var checkboxElementLeftExtractValue = "checkbox-element-left-extract-value-" + stageNumber + "-" + goalNumber;
	var addTargetDestinationSecond = $(`#${stageNumberToUniqueQuerySecond}`);
	addTargetDestinationSecond.empty();
	globalGoalNumber += 1;

	projectStaffList.forEach(function(staff) {
		addTargetDestinationSecond.append(
		`
        <div class="funkyradio-primary checkbox-element">
            <input class="checkbox-element-left ${checkboxElementLeftExtractValue}" type="checkbox" name="allocation-dict-key-name" value="${staff}" unchecked></input>
            <label class="checkbox-element-right" for="checkbox">${staff}</label>
        </div>
		`
		);
	});
	addTargetDestinationSecond.css("display", "inline");
};

function addTarget(stageNumber) {
	event.preventDefault();
	localGoalNumber = globalGoalNumberArray[stageNumber];
	localGoalNumberDictKey = "goal"+localGoalNumber;

	projectAllocationArray[stageNumber].push(
		{
			goalKey: localGoalNumberDictKey,
			goalTopic: "get to the moon by tomorrow"
		}
	);

	var stageNumberToUniqueQuery = "addTargetInputFields-"+stageNumber;
	var addTargetDestination = $(`#${stageNumberToUniqueQuery}`);
	addTargetDestination.append(
		`
		<div class="goal-Container">
			<label>Goals to Attain</label>
			<div class="substageGoalFirstInput" id="substageGoalFirstInput-${stageNumber}-${localGoalNumber}">
				<input class="substage-goal" id="substageGoalFirstInput-value-${stageNumber}-${localGoalNumber}" placeholder="i.e. Assistant PM will finish market research" type="text"></input>
				<button class="allocateGoalButton button-primary" onclick="allocateGoal(${stageNumber}, ${localGoalNumber})">Allocate</button>
			</div>
			<div class="substageGoalSecondInput" id="substageGoalSecondInput-${stageNumber}-${localGoalNumber}">
			</div>
		</div>
		`
	);
	globalGoalNumberArray[stageNumber] += 1;
};

function submitProject() {
	var projectCreatorEmailToDB = currentUserEmail;
	var projectCreatorToDB = $('#project-creator').val();
	var projectTitleToDB = $('#project-title').val();
	var projectProgressToDB = $('#project-progress').val();
	var isPercentageSignThere = projectProgressToDB.search("%");
	if (isPercentageSignThere === -1 ) {
		projectProgressToDB = projectProgressToDB+"%";
	};
	var projectDescriptionToDB = $('#project-description').val();
	var projectDueDateToDB = $('#project-duedate').val();
	var projectStaffToDB = $('#project-staff').val();
	projectStaffToDB = projectStaffToDB.split("; ");
	var firebaseProjectDB = firebaseDB.ref("projectDB");

	var list = [];
	for (var i = 0; i < globalStageNumber; i++) {
		list.push(i);
	};

	var assignmentToDB = [];

	list.forEach(function(stageNumber) {
		var singleStageGoesToAssignmentToDBAbove = {};
		stageNumberjQuery = '#'+'addStageInputFields-substage-input-'+stageNumber;
		var stageTopic = $(stageNumberjQuery).val();
		singleStageGoesToAssignmentToDBAbove["stageTopic"] = stageTopic;

		var localGoalNumber = globalGoalNumberArray[stageNumber];
		
		var goalList = [];
		for (var i = 0; i < localGoalNumber; i++) {
			goalList.push(i);
		}

		singleStageGoesToAssignmentToDBAbove["stageMission"] = stageTopic;

		goalList.forEach(function(goalNumber) {
			stageNumberjQuery = `#substageGoalFirstInput-value-${stageNumber}-${goalNumber}`;
			var stageTopic = $(stageNumberjQuery).val();
			var dictKeyName = "stageGoal" + goalNumber;
			singleStageGoesToAssignmentToDBAbove[dictKeyName] = stageTopic;
			goaljQueryContent = $(`.checkbox-element-left-extract-value-${stageNumber}-${goalNumber}`);
			var projectStaffListIterator = [];
			for (var i = 0; i < projectStaffList.length; i++) {
				projectStaffListIterator.push(i);
			}

			var projectStaffListIteratorEmailList = [];

			projectStaffListIterator.forEach(function(email) {
				if ( goaljQueryContent[email].checked ) {
					projectStaffListIteratorEmailList.push(goaljQueryContent[email].value)
				}	
			})
			
			var dictKeyName2 = "stageGoal" + goalNumber + "allocationList";
			singleStageGoesToAssignmentToDBAbove[dictKeyName2] = projectStaffListIteratorEmailList;
		
		});
		
		assignmentToDB.push(singleStageGoesToAssignmentToDBAbove);
	});

	firebaseProjectDB.push({
		creatorEmail: projectCreatorEmailToDB,
		creatorName: projectCreatorToDB,
		projectTopic: projectTitleToDB,
		status: projectProgressToDB,
		dueDate: projectDueDateToDB,
		description: projectDescriptionToDB,
		permission: projectStaffList,
		assignment: assignmentToDB
	});

	frontPageLeftPreview.empty();
	$('#project-creator').val("");
	$('#project-title').val("");
	$('#project-progress').val("");
	$('#project-description').val("");
	$('#project-duedate').val("");
	$('#project-staff').val("");
	loadProjects(projectsInFirebase, currentUserEmail);
}

function addChatTargetList() {
	chatTargetList = chatTargetList.filter(l => l!= "");
	chatTargetListUnique = [];
	$.each(chatTargetList, function(i, el){
	    if($.inArray(el, chatTargetListUnique) === -1) chatTargetListUnique.push(el);
	});
	chatTargetListUnique.forEach(function(chatTarget) {
		userKeys.forEach(function(userKey) {
			if (userList[userKey].userEmail === chatTarget && userList[userKey].userEmail !== currentUserEmail) {
				chatSidebar.append(
					`
		           	<div class="sidebar-name">
		                <a href="javascript:register_popup('${userList[userKey].userEmail}', '${userList[userKey].userName}');">
		                    <img width="30" height="30" src=${userList[userKey].userPhoto} />
		                    <span>${userList[userKey].userName}</span>
		                </a>
		            </div>
				    `
				);
			};
			chatTargetBrowserDB[userList[userKey].userEmail] = [userList[userKey].userName, userList[userKey].userPhoto];
		});
	});
};

function startChat() {
	chatsInFirebase.on("value", function(chats) {
		chatList = chats.val();
		chatKeys = Object.keys(chatList);

		popups.forEach(function(popup) {
			var didIdSpecCharRemoved = popup.replace(/[@&\/\\#,+()$~%.'":*?<>{}]/g,'-');
			var divIdModified = didIdSpecCharRemoved+"chatContentBox";
			var targetIdSpecialCharacterRemoved = "#"+didIdSpecCharRemoved+"chatContentBox";
			var elem = document.getElementById(divIdModified);
			chatWindow = $(targetIdSpecialCharacterRemoved).val("");
			chatWindow.empty();
			chatKeys.forEach(function(chatKey) {
				if (chatList[chatKey].senderEmail === currentUserEmail && chatList[chatKey].receiverEmail === popup) {
					chatWindow.append(
						`
						<div class="sender-wrap">
							<div class="sender">
								<p>${chatList[chatKey].message}</br></p>
							</div>
						</div>
						`
					);
					elem.scrollTop = elem.scrollHeight;
				}
				if (chatList[chatKey].receiverEmail === currentUserEmail && chatList[chatKey].senderEmail === popup) {
					receiverInfo = chatTargetBrowserDB[chatList[chatKey].senderEmail];
					chatWindow.append(
						`
						<div class="receiver-wrap">
							<div class="receiver">
								<img width="30" height="30" src=${receiverInfo[1]} />
								<p>${chatList[chatKey].message}</br></p>
							</div>
						</div>
						`
					);
					elem.scrollTop = elem.scrollHeight;
				};
			});
		});
	});
};

function submitChat(id, idSpecialCharacterRemoved) {
	idSpecialCharacterRemoved = "#"+idSpecialCharacterRemoved+"chatInputBox";
	chatContent = $(idSpecialCharacterRemoved).val();
	if (chatContent !== "" || chatContent !== "") {
		var divIdModified = id.replace(/[@&\/\\#,+()$~%.'":*?<>{}]/g,'-');
		var divIdModified = divIdModified+"chatContentBox";
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
		var elem = document.getElementById(divIdModified);
		elem.scrollTop = elem.scrollHeight;
	};
}

function newUserDBRegisteration(userinfoInFirebase) {
	userinfoInFirebase.on("value", function(users) {
		userList = users.val();
		userKeys = Object.keys(userList);
		currentUserIsRegistered = "No";
		userKeys.forEach(function(userKey) {
			if (userList[userKey].userEmail === currentUserEmail) {
				currentUserIsRegistered = "Yes";
			};
		});
	});
	setTimeout(function() {
		if (currentUserIsRegistered === "No") {
			userinfoInFirebase.push({
				userEmail: currentUserEmail,
				userName: currentUserName,
				userPhoto: currentUserPhoto
			});
		};
	addChatTargetList();
	}, 1000);
}

function expandInfo(projectKey) {
	frontPageLeft.hide()
	frontPageRight.hide()
	frontPageDetail.css("display", "inline");
	frontPageDetail.append(
		`
		<div class="stages">
			<div class="frontPageDetail-stage1">
	            <h4>Step 1: Setting Up</h4>
	            <h6>Deadline: July 1, 2016 | Finished: Delayed by Four days</h6>
	            <p>
	            a. Finish the software backbone </br>
	            b. Determine the scope of the software </br>
	            c. Assess the product appeal </br>
	            </p>
			</div>

			<div class="frontPageDetail-stage2">
	            <h4>Step 2: Setting Up</h4>
	            <h6>Deadline: July 1, 2016 | Finished: Delayed by Four days</h6>
	            <p>
	            a. Finish the software backbone </br>
	            b. Determine the scope of the software </br>
	            c. Assess the product appeal </br>
	            </p>
			</div>

			<div class="frontPageDetail-stage3">
	            <h4>Step 3: Setting Up</h4>
	            <h6>Deadline: July 1, 2016 | Finished: Delayed by Four days</h6>
	            <p>
	            a. Finish the software backbone </br>
	            b. Determine the scope of the software </br>
	            c. Assess the product appeal </br>
	            </p>
			</div>

			<div class="frontPageDetail-stage4">
	            <h4>Step 4: Setting Up</h4>
	            <h6>Deadline: July 1, 2016 | Finished: Delayed by Four days</h6>
	            <p>
	            a. Finish the software backbone </br>
	            b. Determine the scope of the software </br>
	            c. Assess the product appeal </br>
	            </p>
			</div>
		</div>

		<div class="stage-detail">
			Task:</br>
			<table>
				<tr class="stage-detail-heading-brief">
				a. Finish the software backbone | Assignments 14/16 | Comments 20 | Todos 14 | Status 60%
				</tr>
				<tr class="stage-detail-substeps">
					<td class="stage-detail-substeps-index">a-1</td>
					<td class="stage-detail-substeps-task">Finish QA Testing</td>
					<td class="stage-detail-substeps-staff">Won Jun Hong</td>
					<td class="stage-detail-substeps-staffFinished">X</td>
					<td class="stage-detail-substeps-reviewer">Roland Cassirer</td>
					<td class="stage-detail-substeps-status">Reviewed and Approved</td>
					<td class="stage-detail-substeps-duedate">by August 15, 2016</td>
					<td class="stage-detail-substeps-dudedateChange">ON TARGET</td>
				</tr>
				<tr>
					<td>a-2</td>
					<td>Finish Design Implementation</td>
					<td>Won Jun Hong</td>
					<td>Work In Progress</td>
					<td>Ilana Gonzva</td>
					<td>Waiting for Completion</td>
					<td>by August 12, 2016</td>
					<td>DELAYED to August 18, 2016</td>
				</tr>
				<tr>
					<td>a-3</td>
					<td>Finish Design Implementation</td>
					<td>Won Jun Hong</td>
					<td>Work In Progress</td>
					<td>Ilana Gonzva</td>
					<td>Waiting for Completion</td>
					<td>by August 12, 2016</td>
					<td>DELAYED to August 18, 2016</td>
				</tr>
				<tr>
					<td>a-4</td>
					<td>Finish Design Implementation</td>
					<td>Won Jun Hong</td>
					<td>Work In Progress</td>
					<td>Ilana Gonzva</td>
					<td>Waiting for Completion</td>
					<td>by August 12, 2016</td>
					<td>DELAYED to August 18, 2016</td>
				</tr>
			</table>

			<table>
				<tr>
				b. Finish the software backbone | Assignments 14/16 | Comments 20 | Todos 14 | Status 60%
				</tr>
				<tr>
					<td>b-1</td>
					<td>Finish QA Testing</td>
					<td>Won Jun Hong</td>
					<td>X</td>
					<td>Roland Cassirer</td>
					<td>Reviewed and Approved</td>
					<td>by August 15, 2016</td>
					<td>ON TARGET</td>
				</tr>
				<tr>
					<td>b-2</td>
					<td>Finish Design Implementation</td>
					<td>Won Jun Hong</td>
					<td>Work In Progress</td>
					<td>Ilana Gonzva</td>
					<td>Waiting for Completion</td>
					<td>by August 12, 2016</td>
					<td>DELAYED to August 18, 2016</td>
				</tr>
				<tr>
					<td>b-3</td>
					<td>Finish Design Implementation</td>
					<td>Won Jun Hong</td>
					<td>Work In Progress</td>
					<td>Ilana Gonzva</td>
					<td>Waiting for Completion</td>
					<td>by August 12, 2016</td>
					<td>DELAYED to August 18, 2016</td>
				</tr>
			</table>

			<table>
				<tr>
				c. Finish the software backbone | Assignments 14/16 | Comments 20 | Todos 14 | Status 60%
				</tr>
				<tr>
					<td>c-1</td>
					<td>Finish QA Testing</td>
					<td>Won Jun Hong</td>
					<td>X</td>
					<td>Roland Cassirer</td>
					<td>Reviewed and Approved</td>
					<td>by August 15, 2016</td>
					<td>ON TARGET</td>
				</tr>
				<tr>
					<td>c-2</td>
					<td>Finish Design Implementation</td>
					<td>Won Jun Hong</td>
					<td>Work In Progress</td>
					<td>Ilana Gonzva</td>
					<td>Waiting for Completion</td>
					<td>by August 12, 2016</td>
					<td>DELAYED to August 18, 2016</td>
				</tr>
				<tr>
					<td>c-3</td>
					<td>Finish Design Implementation</td>
					<td>Won Jun Hong</td>
					<td>Work In Progress</td>
					<td>Ilana Gonzva</td>
					<td>Waiting for Completion</td>
					<td>by August 12, 2016</td>
					<td>DELAYED to August 18, 2016</td>
				</tr>
				<tr>
					<td>c-4</td>
					<td>Finish Design Implementation</td>
					<td>Won Jun Hong</td>
					<td>Work In Progress</td>
					<td>Ilana Gonzva</td>
					<td>Waiting for Completion</td>
					<td>by August 12, 2016</td>
					<td>DELAYED to August 18, 2016</td>
				</tr>
			</table>

		</div>

		<div class="Team Announcements">
			This section is reserved for the team announcements.
		</div>

		<div class="Popular Comments">
			This section is reserved for popular comments.
		</div>
		`
	)
}

function loadProjects(projectsInFirebase, currentUserEmail) {
	projectsInFirebase.on("value", function(projects) {
		projectList = projects.val();
		projectsInFirebaseKeys = Object.keys(projectList);

		var i = 0;

		projectsInFirebaseKeys.forEach(function(projectKey) {

			var projectPermissionNumber = 1;

			if (typeof projectList[projectKey].permission !== "undefined") {
				projectPermissionNumber = projectList[projectKey].permission.length+1;
			};

			projectPreview = $(
				`
				<ul class="project-preview">
					<div class="project-preview-project-topic">
						${projectList[projectKey].projectTopic}
					</div>	
					<div class="project-preview-project-creator">
						Deadline ${projectList[projectKey].dueDate} |
						Led by <a href=${projectList[projectKey].creatorEmail}>${projectList[projectKey].creatorName}</a> |
						${projectPermissionNumber} Members
					</div>
				    <div class="progress">
			            <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="${projectList[projectKey].status}">
			                <span class="sr-only">${projectList[projectKey].status} Completed</span>
			            </div>
			        </div>
			        <div class="status-dashboard">
			        	Progress: ${projectList[projectKey].status} <b>|</b>
			        	Questions: 2 <b>|</b>
			        	Assignments: 4 <b>|</b>
			        	Action Items: 2 <b>|</b>
			        	Comments: 34			        	
			        </div>
			        <div class="project-preview-descriptions">
			        	${projectList[projectKey].description}
			        </div>
				</ul>
				`);
			$('.progress .progress-bar').css("width",
			        function() {
			            return $(this).attr("aria-valuenow");
			        }
			)

			i += 1;
			var iterator;
			if (i < 7) {
				iterator = i;
			}
			else if (i >= 7) {
				iterator = i % 7;
			}

			var colorArray = ["#0073b7", "#00a65a", "#ba79cb", "#f56954",  "#ec3b83", "#00c0ef",  "#00b29e"];
			// var color = colorArray[Math.floor(Math.random() * colorArray.length)]; 
			var color = colorArray[iterator];

			projectPreview.css("backgroundColor", color);
			
			projectPreview.on('click', function(event) {
				projectLists.css("backgroundColor", color);
				projectLists.append(
				`
				<div class="container">
					<div class="row">
				        <div class="timeline-centered">
				        <article class="timeline-entry">
				            <div class="timeline-entry-inner">
				                <div class="timeline-icon bg-success">
				                    <i class="entypo-feather"></i>
				                </div>
				                <div class="timeline-label">
				                    <h4>Step 1: Setting Up</h4>
				                    <h6>Deadline: July 1, 2016 | Finished: Delayed by Four days</h6>
				                    <p>
				                    1. Finish the software backbone </br>
				                    2. Determine the scope of the software </br>
				                    3. Assess the product appeal </br>
				                    </p>
				                </div>
				            </div>
				        </article>
				        <article class="timeline-entry">
				            <div class="timeline-entry-inner">
				                <div class="timeline-icon bg-secondary">
				                    <i class="entypo-suitcase"></i>
				                </div>
				                <div class="timeline-label">
				                    <h4>Step 2: Chatting Application</h4>
				                    <h6>Deadline: July 15, 2016 | Finished: Ahead by Four days</h6>
				                    <p>
				                    1. Finish the chatting application </br>
				                    2. Wrap the the QA control and testing </br>
				                    3. Finish the design piece--the chatting applciation will not be touched from this moment on. </br>
				                    </p>
				                </div>
				            </div>
				        </article>
				        <article class="timeline-entry">
				            <div class="timeline-entry-inner">
				                <div class="timeline-icon bg-info">
				                    <i class="entypo-location"></i>
				                </div>
				                <div class="timeline-label">
				                    <h4>Step 3: Project Expansion Piece and Front-end Design</h4>
				                    <h6>Deadline: August 15, 2016 | In Progress</h6>
				                    <p>
				                    1. Finish the expansion piece </br>
				                    2. Wrap up the design </br>
				                    3. Final QA </br>
				                    </p>					               
				                </div>
				            </div>
				        </article>
				        <article class="timeline-entry">
				            <div class="timeline-entry-inner">
				                <div class="timeline-icon bg-warning">
				                    <i class="entypo-camera"></i>
				                </div>
				                <div class="timeline-label">
				                    <h4>Step 4: Domain Purhcase and Deployment</h4>
				                    <h6>Deadline: August 20, 2016 | Scheduled</h6>
				                    <p>
				                    1. Resolve Final Glitches </br>
				                    2. Purchasing and Rerouting of Domain </br>
				                    3. Final Deployment
				                    </p>
				                </div>
				            </div>
				        </article>
				        <article class="timeline-entry begin">
				            <div class="timeline-entry-inner">
				                <div class="timeline-icon" style="-webkit-transform: rotate(-90deg); -moz-transform: rotate(-90deg);">
				                    <i class="entypo-flight"></i>
				                </div>
				                <div class="fullInfoExpansion">
				                	<p class="expandInfoButton" onClick="expandInfo('${projectKey}')">Click Here to See the Full Information</p>
				                </div>
				            </div>
				        </article>
				    </div>					    
					</div>
				</div>
				`
				);
				frontPageLeft.css("width", "50%");
				frontPageRight.css("display", "inline");
			});
			if (projectList[projectKey].creatorEmail === currentUserEmail) {
				frontPageLeftPreview.append(projectPreview);
				projectList[projectKey].permission.forEach(function (perm) {
					chatTargetList.push(perm)
				})
			}
			var permission = projectList[projectKey].permission;
			permission.forEach(function (perm) {
				if (perm === currentUserEmail) {
					frontPageLeftPreview.append(projectPreview);
					projectList[projectKey].permission.forEach(function(perm2) {
						chatTargetList.push(perm2);
					});
					chatTargetList.push(projectList[projectKey].creatorEmail);
				}
			})
		});

	})
	addChatTargetList();
};

function updateName() {
	currentUserDBInfoURL = "https://wonjunhong-test.firebaseio.com/userinfoDB/"+userinfoInFirebaseCurrentUserKey;
	var updateUserDBInfo = new Firebase(currentUserDBInfoURL);
	updateUserDBInfo.update({ userName: $('.nameChange').val()});
	userProfilePreview.empty();
}

function editProfileInfo() {
	userProfilePreview.empty();
	userProfilePreview.append(
		`
		<div class="displayName">
			New Display Name
		</div>
		<input 
			class="nameChange"
			placeholder="Enter to Submit" 
			onkeydown="if (event.keyCode == 13) { updateName(); }"
		></input>
		`
	);
}

function login() {
	event.preventDefault();
	firebase.initializeApp(config);
	firebaseDB = firebase.database();
	var firebaseAuth = firebase.auth();
	var provider = new firebase.auth.GoogleAuthProvider();
	frontPageDetail.hide();
	firebaseAuth.signInWithPopup(provider).then(function(result) {
		currentUser = result.user;
		currentUserName = currentUser.displayName;
		// if (currentUserName === null) {
		// 	currentUserName = currentUser.email;
		// }
		currentUserEmail = currentUser.email;
		currentUserPhoto = currentUser.photoURL;

		changeScene();
		projectsInFirebase = firebaseDB.ref("projectDB");
		chatsInFirebase = firebaseDB.ref("chatDB");
		userinfoInFirebase = firebaseDB.ref("userinfoDB");

		newUserDBRegisteration(userinfoInFirebase);
		loadProjects(projectsInFirebase, currentUserEmail);

		userProfilePreviewPhoto.append(`<img src="${currentUserPhoto}" />`);

		userinfoInFirebase.on("value", function(users) {
			userList = users.val();
			userKeys = Object.keys(userList);
			userKeys.forEach(function(userKey) {
				if (userList[userKey].userEmail === currentUserEmail) {
					currentUserName = userList[userKey].userName;
					userinfoInFirebaseCurrentUserKey = userKey;
					userProfilePreview.append(`<p>${currentUserName}</br>${currentUserEmail}</br><span class="edit-profile" onClick="editProfileInfo()">edit profile</span></p>`);
				}
			});
		});

		chatsInFirebase.on("value", function(chats) {
			chatList = chats.val();
			chatKeys = Object.keys(chatList);

			popups.forEach(function(popup) {
				var didIdSpecCharRemoved = popup.replace(/[@&\/\\#,+()$~%.'":*?<>{}]/g,'-');
				var divIdModified = didIdSpecCharRemoved+"chatContentBox";
				var targetIdSpecialCharacterRemoved = "#"+didIdSpecCharRemoved+"chatContentBox";
				var elem = document.getElementById(divIdModified);
				chatWindow = $(targetIdSpecialCharacterRemoved).val("");
				chatWindow.empty();
				chatKeys.forEach(function(chatKey) {
					if (chatList[chatKey].senderEmail === currentUserEmail && chatList[chatKey].receiverEmail === popup) {
						chatWindow.append(
							`
							<div class="sender-wrap">
								<div class="sender">
									<p>${chatList[chatKey].message}</br></p>
								</div>
							</div>
							`
						);
						elem.scrollTop = elem.scrollHeight;
					}
					if (chatList[chatKey].receiverEmail === currentUserEmail && chatList[chatKey].senderEmail === popup) {
						receiverInfo = chatTargetBrowserDB[chatList[chatKey].senderEmail];
						chatWindow.append(
							`
							<div class="receiver-wrap">
								<div class="receiver">
									<img width="30" height="30" src=${receiverInfo[1]} />
									<p>${chatList[chatKey].message}</br></p>
								</div>
							</div>
							`
						);
						elem.scrollTop = elem.scrollHeight;
					};
				});
			});
		});
	});
};

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
    	<textarea 
    		class="chatInputBox" 
    		id="${idSpecialCharacterRemoved}chatInputBox"
    		placeholder="Press enter to message ${name}.\n\nDouble click bubbles to edit sent messages." 
    		rows="1" 
    		onkeydown="if (event.keyCode == 13) { submitChat('${id}', '${idSpecialCharacterRemoved}') }"
    	></textarea>
    </div>
    </div>
    `
    // displayChatContent(id, targetIdSpecialCharacterRemoved);
    document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + element;  
    popups.unshift(id);           
    calculate_popups();
    startChat();
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



