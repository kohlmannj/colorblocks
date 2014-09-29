var MessageBox = function(options) {
	var settings = {
        title: "Message",
        content: "Place your message here.",
        buttons: [],
		textAlign: "center",
		okayLabel: "Dismiss"
    };    
    jQuery.extend(settings, options);
	
	return function() {
		theElement = $(".message");
	
		// Hide it!
		$(theElement).hide();
	
		// var theElement = $('<div class="message"><h1>Message</h1><div class="messageContentWrapper"><div class="messageContent"></div></div><div class="messageButtons"><a class="okayButton" href="#">OK</a></div></div>');
	
		$("h1", theElement).html(settings.title);
		$(".messageContent", theElement).html(settings.content).css("text-align", settings.textAlign);
		$(".customButtons", theElement).html("");
		
		$.each(settings.buttons, function() {
			var theButton = $("<a>" + this.name + "</a>");
			var theButtonID = this.name.toLowerCase() + "Button";
			$(theButton).attr("id", theButtonID);
			$(theButton).attr("href", "#" + theButtonID);
			$(theButton).attr("title", this.title);
			$(".customButtons", theElement).append(theButton);
			$(theButton).click(this.action);
		});
	
		$("a.okayButton", theElement).text(settings.okayLabel).click(function() {
			$(theElement).fadeOut();
		});
	
		$(theElement).show();
	}
}
