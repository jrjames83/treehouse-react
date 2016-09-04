var PLAYERS = [
	{name : "Jeff James", score : 11},
	{name : "Chance Bobance", score : 10},
	{name : "Mica Moran", score : 15},
]

var nextId = 4;

var AddPlayerForm = React.createClass({
	propTypes : {
		onAdd: React.PropTypes.func.isRequired,
	},

	getInitialState() {
	    return {
	        name: "",  
	    };
	},

	onSubmit: function(e) {
		e.preventDefault();
		this.props.onAdd(this.state.name);
		this.setState({name: ""}) // clear state
	},

	onNameChange: function(e) {
		console.log("On Name Change", e.target.value);
		this.setState({name: e.target.value});
	},

	render: function() {
		return (
				<div className="add-player-form">
				 <form onSubmit={this.onSubmit}> 
				  <input type="text" value={this.state.name} onChange={this.onNameChange}/>
				  <input type="submit" value="Add Player"/>
				 </form>
				</div>
			)
	}
})

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
		  	<Stats players = {props.players} />
			<h1>{props.title} </h1>
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
			<btn className="counter-action decrement" onClick={function() {props.myAction(-1); props.myAction2(-1);}}> - </btn>
			<div className="counter-score"> {props.score} </div>
			<btn className="counter-action increment" onClick={function() {props.myAction(1);}}> + </btn>
		</div>
		);	
}

Counter.propTypes = {
	score: React.PropTypes.number.isRequired,
	myAction: React.PropTypes.func.isRequired,
	myAction2: React.PropTypes.func.isRequired,
}


function Player(props) {
	return (
		<div className="player">
			<div className="player-name">
			<a className="remove-player" onClick={props.onRemove}>remove</a>
				{props.name}
			</div>
			<div className="player-score">
			{/*The counter's score is passed to it by the parents
			myAction is being passed as a prop and it gets relayed up through the app */}
			 <Counter score={props.score} myAction={props.onScoreChange} myAction2={props.onTestChange} />
			</div>
		</div>
		);
}

Player.PropTypes = {
	name: React.PropTypes.string.isRequired,
	score: React.PropTypes.number.isRequired,
	onScoreChange: React.PropTypes.func.isRequired,
	onTestChange: React.PropTypes.func.isRequired,
	onRemove: React.PropTypes.func.isRequired,
};


var Application = React.createClass({

  propTypes: {
	title: React.PropTypes.string.isRequired,
	init_players: React.PropTypes.arrayOf(React.PropTypes.shape({
		name: React.PropTypes.string.isRequired,
		score: React.PropTypes.number.isRequired,
	})).isRequired,	
  },

   onScoreChange: function(index, delta) {
   	console.log(index, delta);
   	this.state.players[index].score += delta;
   	this.setState(this.state);
   },

   onTestChange: function(delta) {
   	console.log(delta, " This is just a test"); // this will call myAction2 with the delta
   },

   onPlayerAdd: function(name) {
   	console.log('Player Added: ', name);
   	this.state.players.push({
   		name: name,
   		score: 0,
   		id: nextId,
   	});
   	this.setState(this.state);
   	nextId +=1;
   },

   removePlayer: function(index) {
   	// delete the player
   	this.state.players.splice(index, 1);
   	this.setState(this.state); // rerender
   },



	render: function() {
	  return (
			<div className="scoreboard">
				<Header title={this.props.title} players={this.state.players}/>
					<div className="players">
						{this.state.players.map(function(player, id) {
						return (
						<Player
						    onRemove={function() {this.removePlayer(id)}.bind(this)}
						    onTestChange={this.onTestChange}
							onScoreChange={function(delta) {this.onScoreChange(id, delta)}.bind(this)}
							name={player.name}
							score={player.score}
							key={id}/>
						)}.bind(this))
						}
						</div>
						<AddPlayerForm onAdd={this.onPlayerAdd} />
					</div>
	 		 );		
	},

	getDefaultProps: function () {
    	return { title: "Custom Board" };
  	},

  	// Players should be state - add/remove and update their score
  	getInitialState: function () {
  		console.log("I am get state")
  		console.log(this.props.init_players)
  		return {players: this.props.init_players}
    	//return { players: PLAYERS }; 

  	}


}); // end create application class


// Below we are passing props to the Application component via players={PLAYERS}
ReactDOM.render(<Application init_players={PLAYERS}  />, document.getElementById('container'));