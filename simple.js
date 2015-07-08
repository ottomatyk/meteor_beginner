// simple-todos.js
Tasks = new Mongo.Collection("tasks");
Urgents = new Mongo.Collection("urgents");

if (Meteor.isClient) {
  // This code only runs on the client
  
  //count
	Template.body.helpers({    
		incompleteCount: function () {
			return Tasks.find({checked: {$ne: true}}).count();
		},
	////////////////////////	
		tasks: function () {
			if (Session.get("hideCompleted")) {
  // If hide completed is checked, filter tasks
				return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
			} 
			else {
  // Otherwise, return all of the tasks
				return Tasks.find({}, {sort: {createdAt: -1}});
			}
		},
	///////////////////////
		hideCompleted: function () {
			return Session.get("hideCompleted");
		},		

		urgentbox: function(){
			return Session.get("urgentbox");
		},

		urgents: function(){
			if(Session.get("hideCompleted")){
				return Urgents.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
			}
			else {
				return Urgents.find({},{sort: {createdAt: -1}});
			}
		}

	});
	Template.body.events({
		"change .hide-completed input": function (event) {
			Session.set("hideCompleted", event.target.checked);
		}
	})
	Template.body.events({
		"change .urgent-marker input":function (event) {
			Session.set("urgentbox",event.target.checked)
		}
	})
	Template.body.events({	
		"submit .new-task": function (event){ 
		var text = event.target.text.value;

	   //called when new form submitted
			if (text === "",text===" "){
			  alert("You didn't type anything!")
			}
		  	else{ 
				if (Session.get("urgentbox")==true){
					Meteor.call("addUrgent", text);
					console.log("lol")
				}
				else {
				Meteor.call("addTask", text);
				}
		  	}

		  //clear form after use
		  event.target.text.value = "";
		  
		  //prevent default form submit
		  return false;
		}
	});
		  
	Template.task.events({
		"click .toggle-checked":function(){
			//set the checked property to the opposite of its current
			Meteor.call("setChecked", this._id, ! this.checked);
			//Tasks.update(this._id, {$set: {checked: ! this.checked}}
			console.log(this.checked);
		},
		"click .delete": function (){
			Meteor.call("deleteTask", this._id);
		}
	});
	Template.urgent.events({
		"click .toggle-checked":function(){
			//set the checked property to the opposite of its current
			Meteor.call("setChecked", this._id, ! this.checked);
			//Tasks.update(this._id, {$set: {checked: ! this.checked}}
			console.log(this.checked);
		},
		"click .urgedelete": function (){
			Meteor.call("deleteUrgent", this._id);
		}
	});
	Template.body.events({ //clear button to delete all checked tasks
		'click .clear': function(){
		var recheck = confirm("Are you sure you want to delete all checked tasks?");
		console.log(recheck)
			if (recheck === true){ //check if true // if task is checked
				Meteor.call("deleteChecked"); //if checked we delete it
			} 
			else{}
		}
	})			
	Template.body.events({
		'click .clearurgent': function(){
		var urgentcheck = confirm("Are you sure you want to delete all checked urgent tasks?");
			if (urgentcheck ===true){
				Meteor.call("deleteCheckedurgent");
			}
		}
	})	
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});
}



if (Meteor.isServer){
	
Meteor.methods({

	addTask: function (text){
		//make sure user is logged in before entering task
		if(! Meteor.userId()){
			throw new Meteor.Error("Not-Authorized");
		}
		
		Tasks.insert({
			text: text,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().username
		});
	},
	addUrgent: function (text){
		if(! Meteor.userId()){
				throw new Meteor.Error("Not-Authorized");
		}
		
		Urgents.insert({
			text: text,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().username
		});	
	},
	deleteTask: function(taskId){
		Tasks.remove(taskId);
	},
	deleteUrgent: function(UrgentId){
		Urgents.remove(UrgentId)
	},
	setChecked: function(taskId,setChecked){
		Tasks.update(taskId,{ $set: { checked: setChecked}});
		Urgents.update(taskId,{ $set: { checked: setChecked}});
	},
	deleteChecked: function(){
		console.log("delete")
		Tasks.remove({checked:true})
	},
	deleteCheckedurgent: function(){
		console.log("urgedelete")
		Urgents.remove({checked:true})
	}

});
};

