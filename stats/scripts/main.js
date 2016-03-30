requirejs([ "d3", "c3", "jquery" ], function(d3, c3, $) {
	var months = d3.set()
	var commitsPerAuthor = d3.map()
	function addCommit(author, date) {
		months.add(date);
		var cpa = commitsPerAuthor.get(author);
		if (cpa == null) {
			cpa = d3.map()
			commitsPerAuthor.set(author, cpa);
		}
		commitCount = cpa.get(date);
		commitCount = commitCount == null ? 1 : commitCount + 1;
		cpa.set(date, commitCount)
	}

	function refreshChart() {
		var sortedMonths = months.values().sort();
		var options = {
			bindto : '#chart',
			data : {
				columns : [],
				types : {},
				groups : [ commitsPerAuthor.keys() ]
			},
			axis : {
				x : {
					type : 'category',
					categories : sortedMonths,
					tick : {
						rotate : -75,
						multiline : false
					},
					height : 100
				}
			}
		}

		commitsPerAuthor.forEach(function(author, commits) {
			options.data.types[author] = 'area';
			var column = [ author ];
			var countSum = 0;
			$.each(sortedMonths, function(index, date) {
				var count = commits.get(date);
				if (count == null)
					count = 0;
				countSum += count;
				column.push(countSum);
			});
			options.data.columns.push(column);
		});

		c3.generate(options);
	}

	function load(commitUrl, repoName) {
		$.getJSON(commitUrl, function(commits) {
			var format = d3.time.format("%Y-%m");
			$.each(commits, function(key, commit) {
				var date = format(new Date(commit.commit.author.date));
				// var author = commit.commit.author.name;
				var author = "unknown"
				try {
					author = commit.author.login;
				} catch (e) {
					console.log(e)
				}
//				author = repoName;
				author = author.replace(/\s+/g, " ");
				addCommit(author, date);
			});
			refreshChart();
		});
	}
	
	$.getJSON("https://api.github.com/orgs/baloise/repos", function(repos) {
		$.each(repos, function(key, repo) {
			load(repo.url + "/commits", repo.name)
		});
	});
});
