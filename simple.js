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
	///////////////////////	
//		urgents: function(){
//			return Urgents.find({});
//		}
	});
  //listen to submit
	Template.body.events({
		"change .hide-completed input": function (event) {
			Session.set("hideCompleted", event.target.checked);
		}
	})
	Template.body.events({	
		"submit .new-task": function (event){ //make sure not blank
	
		var text = event.target.text.value;

	   //called when new form submitted
			if (text === "",text===" "){
			  alert("You didn't type anything!")
			}
			
		 
		  //check if urgent box is ticked
//			 if (this.checked===false){
//			  urgents.insert({ //urgent task
//				text:text,
//				createdAt:new Date()
//			  })
//		  }
		  else{ //////LOGIN USE	
			Meteor.call("addTask", text);
		  }
		  //clear form after use
		  event.target.text.value = "";
		  
		  //prevent default form submit
		  return false;
	}});
		  
	Template.task.events({
		"click .toggle-checked":function(){
			//set the checked property to the opposite of its current
			Meteor.call("setChecked", this._id, ! this.checked);
			console.log(this.checked);
		},
		"click .delete": function (){
			Meteor.call("deleteTask", this._id);
		}
	})
//	Template.body.events({
//		"click.toggle-checked":function(){
			//set check as opposite of current value
//			Urgents.update(this._id,{$set:{check:! this.checked}});
//		},
//		"click.delete": function (){
//			if(confirm("You sure you want to remove an urgent task?"==true)){
//				Urgents.remove(this._id);
//			}
//			else{}
//		}
//	})
	
	
	Template.body.events({ //clear button to delete all checked tasks
		'click button': function(){
			var recheck = confirm("Are you sure you want to delete all checked tasks?");
			console.log(recheck)
			if (recheck === true){ //check if true
				Tasks.remove({checked: {$ne: true}}); //not allowed? need to get _id
			}
			else{}
}})
	
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});
}

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
		deleteTask: function(taskId){
			Tasks.remove(taskId);
		},
		setChecked: function(TaskId,setChecked){
			Tasts.update(tastId,{$set:{checked: setChecked}});
		}
		
});
