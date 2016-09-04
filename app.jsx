var PLAYERS = [
	{name : "Jeff James", score : 11},
	{name : "Chance Bobance", score : 10},
	{name : "Mica Moran", score : 15},
]

function Stats(props) {
	var totalPlayers = props.players.length;
	var totalPoints = props.players.reduce(function(total,player) {
		return total + player.score;
	}, 0)

	return (
		<table className="stats">
			<tbody>
				<tr>
					<td>Players</td>
					<td>{totalPlayers}</td>
				</tr>
				<tr>
					<td>Total Points</td>
					<td>{totalPoints}</td>
				</tr>				
			</tbody>
		</table>

		)
}

Stats.PropTypes = {
	total_players: React.PropTypes.string.isRequired,
	total_points: React.PropTypes.array.isRequired,
}



function Header(props) {
	return (
		  <div className="header">
		  	<Stats players={props.players} />
			<h1>{props.title}</h1>
		  </div>
		  );
}

Header.PropTypes = {
	title: React.PropTypes.string.isRequired,
	players: React.PropTypes.string.isRequired,
}



function Counter(props) {
	return (
		<div className="counter">
			<btn className="counter-action decrement" onClick={function() {props.myAction(-1);}}> - </btn>
			<div className="counter-score"> {props.score} </div>
			<btn className="counter-action increment" onClick={function() {props.myAction(1);}}> + </btn>
		</div>
		);	
}

Counter.propTypes = {
	score: React.PropTypes.number.isRequired,
	myAction: React.PropTypes.func.isRequired,
}


function Player(props) {
	return (
		<div className="player">
			<div className="player-name">
				{props.name}
			</div>
			<div className="player-score">
			 <Counter score={props.score} myAction={props.onScoreChange} />
			</div>
		</div>
		);
}

Player.PropTypes = {
	name: React.PropTypes.string.isRequired,
	score: React.PropTypes.number.isRequired,
	onScoreChange: React.PropTypes.func.isRequired,
};


var Application = React.createClass({

  propTypes: {
	title: React.PropTypes.string.isRequired,
	initial_players: React.PropTypes.arrayOf(React.PropTypes.shape({
		name: React.PropTypes.string.isRequired,
		score: React.PropTypes.number.isRequired,
	})).isRequired,	
  },

   onScoreChange: function(index, delta) {
   	console.log(index, delta);
   	this.state.players[index].score += delta;
   	this.setState(this.state);
   },

	render: function() {
	  return (
			<div className="scoreboard">
				<Header title={this.props.title} players={this.state.players}/>
					<div className="players">
						{this.state.players.map(function(player, id) {
						return (
						<Player
							onScoreChange={function(delta) {this.onScoreChange(id, delta)}.bind(this)} // heh?
							name={player.name}
							score={player.score}
							key={id}/>
							)
							}.bind(this))
						}
						</div>
					</div>
	 		 );		
	},

	getDefaultProps: function () {
    	return { title: "Custom Board" };
  	},

  	// Players should be state - add/remove and update their score
  	getInitialState: function () {
    	return { players: PLAYERS };  	
  	}


}); // end create application class


// Below we are passing props to the Application component via players={PLAYERS}
ReactDOM.render(<Application initial_players={PLAYERS}  />, document.getElementById('container'));