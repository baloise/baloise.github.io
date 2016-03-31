requirejs([ "d3", "c3", "jquery" ], function(d3, c3, $) {
	
	Graph = function (bindto) {
		this.months = d3.set();
		this.commitsPerAuthor = d3.map();
		console.log(this.bindto ,bindto)
		this.bindto = bindto;
		console.log(this.bindto ,bindto)
	}

	Graph.prototype.addCommit = function(author, date){
		this.months.add(date);
		var cpa = this.commitsPerAuthor.get(author);
		if (cpa == null) {
			cpa = d3.map()
			this.commitsPerAuthor.set(author, cpa);
		}
		commitCount = cpa.get(date);
		commitCount = commitCount == null ? 1 : commitCount + 1;
		cpa.set(date, commitCount)
	}
	
	Graph.prototype.refreshChart = function(){
		var sortedMonths = this.months.values().sort();
		var options = {
			bindto : this.bindto,
			data : {
				columns : [],
				types : {},
				groups : [ this.commitsPerAuthor.keys() ]
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

		this.commitsPerAuthor.forEach(function(author, commits) {
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

	
	function load(forWhat) {
		var byAuthor = new Graph("#byAuthor");
		var byRepo = new Graph("#byRepo");
		
		function loadRepo(commitUrl, repoName) {
			$.getJSON(commitUrl, function(commits) {
				var format = d3.time.format("%Y-%m");
				$.each(commits, function(key, commit) {
					var date = format(new Date(commit.commit.author.date));
					// var author = commit.commit.author.name;
					var author = "unknown"
						try {
							if(commit.author != null)author = commit.author.login;
						} catch (e) {
							console.log(e)
						}
						author = author.replace(/\s+/g, " ");
						byAuthor.addCommit(author, date);
						byRepo.addCommit(repoName, date);
				});
				byAuthor.refreshChart();
				byRepo.refreshChart();
			});
		}
		
		$.getJSON("https://api.github.com/"+forWhat+"/repos", function(repos) {
			$.each(repos, function(key, repo) {
				loadRepo(repo.url + "/commits", repo.name)
			});
		});
	}
	
	$("#forWhat").change(function() {
		load($(this).val());
	});
	
	$("#forWhat").change();
	
	
});
