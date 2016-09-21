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
var totalNumberOfComments = $(".total-number-of-comments");
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
var chatSidebarAlreadyLoaded = [];
var globalStageNumberPrev;
var commentList;
var commentKeyList;
var commentInputValue;

function hideProjectDetail() {
	frontPageRight.hide();
	addProjectDetails.hide();
	frontPageLeft.css("width", "100%");
	frontPageLeft.css("display", "inline");
	addProjectButton.css("display", "inline");
	// projectLists.empty();
	frontPageDetail.empty();
	frontPageRight.hide();
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
	frontPageDetail.empty();
	frontPageRight.hide();
	frontPageDetail.hide();

	addProjectDetails.css("display", "inline");
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
					<div class="substageGoalSecondInput" id="substageGoalSecondInput-${globalStageNumber}-${globalGoalNumber}"></div>
					<div class="substageGoalThirdInput" id="substageGoalThirdInput-${globalStageNumber}-${globalGoalNumber}">
						<div class="substageGoalThirdInputProgressPercentage">
							<label>Progress Percentage</label>
							<input type="text" class="substageProgressPercentage" id="substageGoalThirdInput-value-${globalStageNumber}-${globalGoalNumber}" value="0%" ></input>
						</div>
						<div class="substageGoalFourthInputDueDate">
							<label>Due Date</label>
							<input type="date" class="substageDueDate" id="substageGoalFourthInput-value-${globalStageNumber}-${globalGoalNumber}"></input>
						</div>
						<div class="substageGoalFourthInputOverallStatus">	
							<label>Overall Status</label>
							<select class="substageOverallStatus" id="substageGoalFifthInput-value-${globalStageNumber}-${globalGoalNumber}">
								<option value="In Progress">In Progress</option>
								<option value="Completed">Completed</option>
								<option value="To be Determined">To be Determined</option>
							</select>
						</div>
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

	var stageNumberToUniqueQuery = `addTargetInputFields-${stageNumber}`
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
			<div class="substageGoalThirdInput" id="substageGoalThirdInput-${stageNumber}-${localGoalNumber}">
				<div class="substageGoalThirdInputProgressPercentage">
					<label>Progress Percentage</label>
					<input type="text" class="substageProgressPercentage" id="substageGoalThirdInput-value-${stageNumber}-${localGoalNumber}" value="0%" ></input>
				</div>
				<div class="substageGoalFourthInputDueDate">
					<label>Due Date</label>
					<input type="date" class="substageDueDate" id="substageGoalFourthInput-value-${stageNumber}-${localGoalNumber}"></input>
				</div>
				<div class="substageGoalFourthInputOverallStatus">	
					<label>Overall Status</label>
					<select class="substageOverallStatus" id="substageGoalFifthInput-value-${stageNumber}-${localGoalNumber}">
						<option value="In Progress">In Progress</option>
						<option value="Completed">Completed</option>
						<option value="To be Determined">To be Determined</option>
					</select>
				</div>
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

	var commentsToDB = {
		commentExampleKey: {commentDictKey: ["what the hell are we talking about--1?", "wjh261@stern.nyu.edu"]}
	}

	list.forEach(function(stageNumber) {
		var singleStageGoesToAssignmentToDBAbove = {};
		stageNumberTopicjQuery = '#'+'addStageInputFields-substage-input-'+stageNumber;
		var stageTopic = $(stageNumberTopicjQuery).val();
		// var stageDescription = ;


		singleStageGoesToAssignmentToDBAbove["stageTopic"] = stageTopic;

		var localGoalNumber = globalGoalNumberArray[stageNumber];
		
		var goalList = [];
		for (var i = 0; i < localGoalNumber; i++) {
			goalList.push(i);
		}

		singleStageGoesToAssignmentToDBAbove["stageMission"] = projectDescriptionToDB;

		goalList.forEach(function(goalNumber) {
			//for goalTopic
			stageNumberjQuery = `#substageGoalFirstInput-value-${stageNumber}-${goalNumber}`;
			var stageTopic = $(stageNumberjQuery).val();
			var dictKeyName = "stageGoal" + goalNumber;
			singleStageGoesToAssignmentToDBAbove[dictKeyName] = stageTopic;

			//for staff allocation
			goaljQueryContent = $(`.checkbox-element-left-extract-value-${stageNumber}-${goalNumber}`);
			var projectStaffListIterator = [];
			for (var i = 0; i < projectStaffList.length; i++) {
				projectStaffListIterator.push(i);
			}
			var projectStaffListIteratorEmailList = [];
			projectStaffListIterator.forEach(function(email) {
				if (typeof goaljQueryContent[email] !== "undefined") {
					if ( goaljQueryContent[email].checked ) {
						projectStaffListIteratorEmailList.push(goaljQueryContent[email].value);
					}
				}
			})
			var dictKeyName2 = "stageGoal" + goalNumber + "allocationList";
			singleStageGoesToAssignmentToDBAbove[dictKeyName2] = projectStaffListIteratorEmailList;

			//for goal progress percentage

			var goalProgressPercentageContent = $(`#substageGoalThirdInput-value-${stageNumber}-${goalNumber}`).val();

			var dictKeyName3 = "stageGoal" + goalNumber + "ProgressPercentage";

			if (typeof goalProgressPercentageContent !== undefined) {
				singleStageGoesToAssignmentToDBAbove[dictKeyName3] = goalProgressPercentageContent;
			}

			//for goal duedate

			var goalDuedate = $(`#substageGoalFourthInput-value-${stageNumber}-${goalNumber}`).val();

			var dictKeyName4 = "stageGoal" + goalNumber + "DueDate";

			if (typeof goalDuedate !== undefined) {
				singleStageGoesToAssignmentToDBAbove[dictKeyName4] = goalDuedate;
			}

			//for overall status

			var goalOverallStatus = $(`#substageGoalFifthInput-value-${stageNumber}-${goalNumber}`).val();

			console.log(goalOverallStatus)

			var dictKeyName5 = "stageGoal" + goalNumber + "goalOverallStatus";

			if (typeof goalOverallStatus !== undefined) {
				singleStageGoesToAssignmentToDBAbove[dictKeyName5] = goalOverallStatus;
			}

		});
		
		assignmentToDB.push(singleStageGoesToAssignmentToDBAbove);

		console.log(assignmentToDB);
	});

	firebaseProjectDB.push({
		creatorEmail: projectCreatorEmailToDB,
		creatorName: projectCreatorToDB,
		projectTopic: projectTitleToDB,
		status: projectProgressToDB,
		dueDate: projectDueDateToDB,
		description: projectDescriptionToDB,
		permission: projectStaffList,
		assignment: assignmentToDB,
		comments: commentsToDB
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
	    if ($.inArray(el, chatTargetListUnique) === -1) chatTargetListUnique.push(el);
	});

	chatTargetListUnique.forEach(function(chatTarget) {
		userKeys.forEach(function(userKey) {
			if (userList[userKey].userEmail === chatTarget &&
				userList[userKey].userEmail !== currentUserEmail &&
				$.inArray(userList[userKey].userEmail, chatSidebarAlreadyLoaded) === -1) 
				{	
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
					chatSidebarAlreadyLoaded.push(userList[userKey].userEmail);	
				}
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

	var showProjectAssignment = projectList[projectKey].assignment;
	var stageNumber = 1;

	showProjectAssignment.forEach(function(eachStage) {

		$(".stages").append(
			`
			<div class="frontPageDetail-stage${stageNumber}">
	            <h4>Step ${stageNumber}: ${eachStage.stageTopic}</h4>
	            <h6>Deadline: ${eachStage.dueDate} | Finished: Delayed by Four days</h6>
	            <p class="stage-stageGoal-${stageNumber}">
	            </p>
			</div>
			`
		);

		frontPageDetail.append(
			`
			<div class="stage-detail">
				Task:</br>
				<table class="frontPageDetailTable-stage${stageNumber}">
					<tr class="stage-detail-heading-brief">
					Step ${stageNumber}: ${eachStage.stageTopic} | Assignments 14/16 | Comments 20 | Todos 14 | Status 60%
					</tr>
				</table>
			</div>
			`
		)

		var stageGoalObjectKeyArray = Object.keys(eachStage).slice(0, -2);

		var eachStageGoalIndex = 1;

		stageGoalObjectKeyArray.forEach(function(eachStageGoal) {

			if (eachStageGoal.slice(-14) !== "allocationList") {
				$(`.stage-stageGoal-${stageNumber}`).append(
					`
					<li>${eachStage[eachStageGoal]}</li>
					`
				);

				$(`.frontPageDetailTable-stage${stageNumber}`).append(
					`
					<tr class="stage-detail-substeps">
						<td class="stage-detail-substeps-index">Step ${eachStageGoalIndex}:</td>
						<td class="stage-detail-substeps-task">${eachStage[eachStageGoal]}</td>
						<td class="stage-detail-substeps-staff-${stageNumber}-${eachStageGoal}"></td>
						<td class="stage-detail-substeps-staffFinished">In Progress</td>
						<td class="stage-detail-substeps-reviewer">Roland Cassirer</td>
						<td class="stage-detail-substeps-status">Reviewed and Approved</td>
						<td class="stage-detail-substeps-duedate">by August 15, 2016</td>
						<td class="stage-detail-substeps-dudedateChange">ON TARGET</td>
					</tr>
					`
				);

				eachStageGoalIndex += 1;

				var stageAllocationList = eachStage[eachStageGoal + "allocationList"];

				if (stageAllocationList.length > 0) {

					stageAllocationList.forEach(function(allocatedTo) {
						if (chatTargetBrowserDB[allocatedTo] === undefined) {
							$(`.stage-detail-substeps-staff-${stageNumber}-${eachStageGoal}`).append(
							`${allocatedTo}</br>`
						);
						} else {
							$(`.stage-detail-substeps-staff-${stageNumber}-${eachStageGoal}`).append(
							`${chatTargetBrowserDB[allocatedTo][0]}</br>`	
						);					
						}
					});
				};
			};

		});

		stageNumber += 1;

	});
}

function enterComment(key) {
	commentInputValue = $(".comments-cover-input-form").val();
	commentInputValueArray = [commentInputValue, currentUserEmail, "Not Answered", "Not Highlighted"];
	var commentFirebaseDB = new Firebase(`https://wonjunhong-test.firebaseio.com/projectDB/${key}/comments`);
	var commentFirebaseDBInfo = commentFirebaseDB.push();
	 	commentFirebaseDBInfo.set({commentDictKey: commentInputValueArray});
	$(".comments-cover-input-form").val("");
	

	
	setTimeout(function() {
		commentList = projectList[key].comments;
		commentKeyList = Object.keys(commentList);
		justEnteredCommentKey = commentKeyList.splice(-2)[0];
		justEnteredComment = commentList[justEnteredCommentKey]["commentDictKey"][0];
		console.log(justEnteredComment);
		$(`#comments-cover-content-${key}`).append(
			`
	        <div class="comments-by-user">
	        	<p class="comments-by-user-content">${justEnteredComment}</p>
	        	<p class="comments-by-user-writer">written by me</p>
	        </div>
			`
		);	
	}, 1000);
}

function loadProjects(projectsInFirebase, currentUserEmail) {
	projectsInFirebase.on("value", function(projects) {
		projectList = projects.val();
		projectsInFirebaseKeys = Object.keys(projectList);

		var randomColorChoser = 0;

		projectsInFirebaseKeys.forEach(function(projectKey) {

			var projectKeyForEnteringComment = projectKey.toString()

			var projectPermissionNumber = 1;

			if (typeof projectList[projectKey].permission !== "undefined") {
				projectPermissionNumber = projectList[projectKey].permission.length + 1;
			};

			var assignments = projectList[projectKey].assignment;
			var numberOfAssignments = projectList[projectKey].assignment.length;
			
			var numberOfComments = 0;
			var totalCommentsNumber = 0;

			var iteratorRunPrep = projectList[projectKey].assignment;

			iteratorRunPrep.forEach(function(eachAssignment) {
				if (typeof eachAssignment.comments !== "undefined") {
					numberOfComments = numberOfComments + eachAssignment.comments.length;
					totalCommentsNumber += numberOfComments;
				};
			});

			totalNumberOfComments.empty();
			totalNumberOfComments.append(totalCommentsNumber);

			projectPreview = $(
				`
				<ul class="project-preview">
					<div class="project-preview-project-left">
						${projectList[projectKey].projectTopic.substring(0,250)}
					</div>	
					<div class="project-preview-project-middle">
						10 Assignments </br></br>
						${totalNumberOfComments.length} Comments
					</div>
					<div class="project-preview-project-right">
						Led By ${projectList[projectKey].creatorName}</br></br>
						Finish by ${projectList[projectKey].dueDate}
					</div>
				</ul>
				`
			);

			projectPreview.on('click', function(event) {

				frontPageRight.css("display", "inline");
				projectLists.empty();
				projectLists.append(
				`
				<div class="project-key-information">
					<p class="projectTopic">${projectList[projectKey].projectTopic}</p>
					<div class="projectDetailViewStatusBar">
						<a href="mailto:${projectList[projectKey].creatorEmail}" class="projectCreatorName">Led by ${projectList[projectKey].creatorName}</a>
						<p class="projectDueDate">Finish by ${projectList[projectKey].dueDate}</p>
						<p class="projectStatus">${projectList[projectKey].status} Complete</p>
					</div>
					<p class="projectMember">${projectList[projectKey].permission}</p>
					<p class="projectDescription">${projectList[projectKey].description}</p>
				</div>
				<div class="projectDetailView">
				</div>
				<div class="comments-cover">
					<div class="comments-cover-content" id="comments-cover-content-${projectKey}">
					</div>
					<div class="comments-cover-input">
						<form id="enter-comment-form">
							<label>Ask or answer questions here</label>
							<textarea 
								class="comments-cover-input-form" 
								placeholder="...please ask or answer questions here..."
								onkeydown="if (event.keyCode == 13) { enterComment('${projectKey}') }"
							>
							</textarea>
						</form>
					</div>
				</div>
				`
				);

		    	commentList = projectList[projectKey].comments;

		    	commentKeyList = Object.keys(commentList);

		    	commentKeyList.forEach(function(commentDictKey) {
		    		if (typeof(commentList[commentDictKey]) !== undefined && commentDictKey !== "commentExampleKey") {
			    		if (`${commentList[commentDictKey]["commentDictKey"][1]}` === currentUserEmail) {
							$(".comments-cover-content").append(
						        `
						        <div class="comments-by-user">
						        	<div class="comments-by-user-content">
						        		<div class="comments-by-user-content-message">${commentList[commentDictKey]["commentDictKey"][0]}</div>
						        	</div>
					     			<div class="comments-by-user-content-one-line">
						        		<div class="comments-by-user-content-message-unanswered" onclick="markAnswered('${commentDictKey}')">unanswered</div>
						        		<div class="comments-by-user-content-message-edit">edit</div>
						        		<div class="comments-by-user-content-message-delete">delete</div>
						        	</div>
						        	<p class="comments-by-user-writer">me</p>
						        </div>
						        `
					    	);			
			    		} else {
							$(".comments-cover-content").append(
						        `
						        <div class="comments-by-others">
						        	<p class="comments-by-others-content">${commentList[commentDictKey]["commentDictKey"][0]}</p>
						        	<p class="comments-by-others-writer">written by ${commentList[commentDictKey]["commentDictKey"][1]}</p>
						        </div>
						        `
					    	);		
			    		};
			    	};
		    	})

		    	$(".comments-by-user-content-message-unanswered").hover(
		    		function() {
		    			var $this = $(this); 
		    			$this.data('unanswered', $this.text());
		    			$this.text('answered');
		    		}, 
		    		function() {
		    			var $this = $(this);
		    			$this.text($this.data('unanswered'));
		    		}
		    	);

				assignments.forEach(function(assignment) {
					var goalLength = Object.keys(assignment);
					goalLength = (goalLength.length - 2) / 5;

					var goalLengthList = [];

					for (var i = 0; i < goalLength; i++) {
						goalLengthList.push(i);
					}

					$(".projectDetailView").append(
				        `
				        <div class="assignmentOverview">
					        <p class="assignmentOverviewTitle">Assignment Overview</p></br>
					        <p class="assignmentOverviewTitleStageTopic">${assignment.stageTopic}</p>
					        <p class="assignmentOverviewTitleStageMission">${assignment.stageMission}</p>
					    </div>
				        `
				    );

					goalLengthList.forEach(function(eachGoal) {
						var dictKeyGoalTopic = "stageGoal" + eachGoal;
						var dictKeyGoalDueDate = "stageGoal" + eachGoal + "DueDate";
						var dictKeyGoalProgressPercentage = "stageGoal" + eachGoal + "ProgressPercentage";
						var dictKeyGoalAllocationList = "stageGoal" + eachGoal + "allocationList";
						var dictKeyGoalOverallStatus = "stageGoal" + eachGoal + "goalOverallStatus";

						$(".projectDetailView").append(
					        `
					        <div class="assignmentGoal">
						        <p class="assignmentGoalNumber">Goal ${eachGoal + 1}</p>
						        <p class="assignmentGoalAssignmentGoalTopic">${assignment[dictKeyGoalTopic]}</p>
						    </div>
					        `
					    );

						var allocatedList = assignment[dictKeyGoalAllocationList];
						allocatedList.forEach(function(allocatedIndividualEach) {
							$(".projectDetailView").append(
						        `
						        <div class="assignmentAllocatedIndividual">
							        <p>${allocatedIndividualEach}</p>
						        </div>
						        `
					    	);		
				    	});
					});
				});
			});

			if (projectList[projectKey].creatorEmail === currentUserEmail) {
				frontPageLeftPreview.append(projectPreview);
				projectList[projectKey].permission.forEach(function (perm) {
					chatTargetList.push(perm);
				});
			};

			var permission = projectList[projectKey].permission;
			permission.forEach(function (perm) {
				if (perm === currentUserEmail) {
					frontPageLeftPreview.append(projectPreview);
					projectList[projectKey].permission.forEach(function(perm2) {
						chatTargetList.push(perm2);
					});
					chatTargetList.push(projectList[projectKey].creatorEmail);
				};
			});

		});

	})
	addChatTargetList();
};

function markAnswered(key) {
	console.log(key);
}

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



