app.controller('tennisCtrl', function($scope, $http) {
    
    $scope.players = [
    	{name: "Satender Kumar", score: 0, advantage: false, games: 0, sets: 0, pic: ''},
    	{name: "Player 2", score: 0, advantage: false, games: 0, sets: 0, pic: ''}
    ];

    $scope.deuce = false;
    $scope.totalsets = 3;

    $scope.sets = [];
    $scope.sets[0] = [0,0];
    $scope.currentset = 0;

    $scope.started = false;
    $scope.finished = false;

    $scope.tiebreak = false;

    $scope.startGame = function(){
    	$scope.started = true;

    	
		$http({
		  method: 'GET',
		  url: ''
		}).then(function successCallback(response) {
			$scope.players[0].pic = response.data.results[0].picture.medium;
			$scope.players[1].pic = response.data.results[1].picture.medium;   	
		}, function errorCallback(response) {
		    alert("ERROR!");
		});
    }

    $scope.scorePoint = function(player){
    	var opponent = (player ? 0:1);

    	if($scope.tiebreak){
    		$scope.players[player].score++;
    		if($scope.players[player].score >= 7 && $scope.players[player].score >= $scope.players[opponent].score+2){
    			$scope.winGame(player);
    		}
    	}
    	else{
    		if($scope.players[player].score < 30){
    			$scope.players[player].score += 15;
	    	}
	    	else if($scope.players[player].score == 30){
	    		$scope.players[player].score = 40;
	    		if($scope.players[opponent].score == 40){
	    			$scope.deuce = true;
	    		}
	    	}
	    	else if($scope.players[opponent].advantage){
	    		$scope.players[opponent].advantage = false;
	    		$scope.players[player].advantage = false;
	    		$scope.deuce = true;
	    	}
	    	else if($scope.deuce){
	    		$scope.players[player].advantage = true;
	    		$scope.deuce = false;
	    	}
	    	else{
	    		$scope.winGame(player);
	    	}
    	}

    	
    }

    $scope.winGame = function(player){
    	
    	$scope.players[player].games++;
    	$scope.sets[$scope.currentset][player]++;

    	var opponent = (player ? 0:1);

    	if($scope.players[player].games >= 6 && $scope.players[player].games >= $scope.players[opponent].games+2 ){
    		$scope.winSet(player);
    	}

    	if($scope.tiebreak){
    		$scope.tiebreak = false;
    		$scope.winSet(player);
    	}else if($scope.players[player].games == 6 && $scope.players[opponent].games == 6){
    		$scope.tiebreak = true;
    	}

    	$scope.resetGame();
    }

    $scope.resetGame = function(){
    	angular.forEach($scope.players, function (player, index) {
		    player.score = 0;
		    player.advantage = false;
		});
    }

    $scope.winSet = function(player){
    	$scope.players[player].sets++;

    	if(Math.ceil($scope.totalsets / 2) == $scope.players[player].sets){
    		
    		$scope.winner = $scope.players[player];
    		$scope.finished = true;
    	}
    	else{
    		$scope.currentset++;
    		$scope.sets[$scope.currentset] = [0,0];
    		$scope.resetSet();
    	}
    }

    $scope.resetSet = function(){
    	angular.forEach($scope.players, function (player, index) {
		    player.games = 0;
		});
    }
});