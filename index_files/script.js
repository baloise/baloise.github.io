function loadRepos(data) {
	if(data == null) {
		return $.getJSON('https://api.github.com/orgs/baloise/repos?type=all', function(data) {loadRepos(data)}) 
	}
	data.sort(function(item1, item2) {
		return item1.name.localeCompare(item2.name);
	})
	var items = []
	
	$.each(data, function(index, repo) {
		if (repo.name != 'baloise.github.io') {
			items.push("<li class='repo'><a href='" + repo.html_url + "'><div class='repo-name'><h3 class='no-toc'>"
					+ repo.name + "</h3><div class='repo-desc'>" + repo.description + "</div></div>"
					+ '</a></li>')
		}
	});
	
	$('<ul/>', {
		'class' : 'repos',
		html : items.join('')
	}).appendTo('#repos')
}

function loadMembers(data) {
	if(data == null) {
		return $.getJSON('https://api.github.com/orgs/baloise/public_members', function(data) {loadMembers(data)}) 
	}
	 data.sort(function(item1, item2) {
		return item1.login.localeCompare(item2.login);
	})

	var items = []
	$.each(data, function(index, member) {
		var avatar = member.avatar_url.split("?")[0]
				+ '?d=http://baloise.github.io/nobody.jpg'
		items.push("<li class='contributor'><a href='" + member.html_url
				+ "'><img src='" + avatar
				+ "'/><span class='contributor-name'>" + member.login
				+ "</span></a></li>")
	})
	$('<ul/>', {
		'class' : 'repos',
		html : items.join('')
	}).appendTo('#members')
}

function getParameterByName(name, url) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[#?&]" + name + "=([^&#]*)");
    var results = regex.exec(url);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

window.onpopstate = function(e){
	doNavigation(location.href, false);
};

function doNavigation(url, pushHistory) {
	if(pushHistory == null) {
		pushHistory = true;
	}
	var navigationTarget = getParameterByName("navigationTarget", url);
	
	if (navigationTarget == "") {
		navigationTarget = "mission";
	} 
	
	
	$.each($('.navSelector a'), function (index , member) {
		if ($(member).attr('navigationTarget') != null && $(member).attr('navigationTarget') == navigationTarget) {
			$('.navSelector').children().removeClass('MenuSelected');
			$(member).addClass('MenuSelected'); 
			$('.menuContent').hide();
			$('#menu_' + $(member).parent().attr('value')).show();
			if (pushHistory) {
				window.history.pushState("","", location.pathname + "?navigationTarget=" + navigationTarget);
			}
		}
	});
}

function initNavigation() {
	$('#menu_0').show();
	$(".navSelector").bind('click', function(e) {	
		var navigationTarget = $(this).children().first().attr('navigationTarget');
		doNavigation(location.host + location.pathname + "?navigationTarget=" + navigationTarget);
	});
	loadRepos();
	loadMembers();
	doNavigation(location.href);
}
