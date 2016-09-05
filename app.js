import React from 'react';
import ReactDOM from 'react-dom';


import './app.css';


var PLAYERS = [
	{name : "Jeff James", score : 11},
	{name : "Chance Bobance", score : 10},
	{name : "Mica Moran", score : 15},
	{name : "Mica Moran2", score : 15},
]

// Add a button to clear all scores - OK
/*
 Add a bonus point to all scores
 Define the button where the action can occurr in the UI
 using the onClick handler, pass it as a function
 In the component where the child is declared, pass in as a prop
 and call it the function you'd like

*/

/* Try to do:
  Reset a Player's Score: could add a form
  Reset stopwatch after a new player is added
  Crazy idea: give the old players the running time they had prior to the new player
*/

var nextId = 5;



var Stopwatch = React.createClass({
	getInitialState() {
	    return {
	        running: false,
	        elapsedTime: 0,
	        previousTime: 0,

	    };
	},

	componentDidMount: function() {
	      this.interval = setInterval(this.onTick, 100);
	},

	componentWillUnmount: function() {
	      clearInterval(this.interval);
	},

	onTick: function() {
		console.log("On Tick");
		if (this.state.running) {
			var now = Date.now();
			this.setState({
				previousTime: now,
				elapsedTime: this.state.elapsedTime + (now - this.state.previousTime)
			});
		}
	},

	onStart: function() {
		this.setState({
			running: true,
			previousTime: Date.now(),
		});
	},

	onStop: function() {
		this.setState({running: false});

	},

	onReset: function() {
		this.setState({
			//running: false,
			elapsedTime: 0,
			previousTime: Date.now(),
		});
	},
    render: function() {
    	var seconds = Math.floor(this.state.elapsedTime / 1000);
        return (
            <div className="stopwatch">
            	<h2>Stopwatch</h2>
            	<div className="stopwatch-time">{seconds}</div>
            		{/* ternary operator = statement so can be used in jsx */}
                   { this.state.running ? 
                   		<button onClick={this.onStop}>Stop</button> 
                   		: 
                   		<button onClick={this.onStart}>Start</button>
                   	}
            	<button onClick={this.onReset}>Reset</button>
            </div>
        );
    }
});

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
		  			<Stopwatch /> 

		  	<Stats players={props.players} bonus={props.bonus} />
			<h1>{props.title} </h1>
			<h3 className="clear-board" onClick={props.clearBoard}>Clear Board</h3>
			<h3 className="bonus-board" onClick={function() {props.bonus(3);}}>Bonus</h3>
		  </div>
		  );
}


Header.PropTypes = {
	title: React.PropTypes.string.isRequired,
	players: React.PropTypes.string.isRequired,
	clearBoard: React.PropTypes.func.isRequired,
	bonus: React.PropTypes.func.isRequired,
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

   clearTheBoard: function() {
   		this.state.players = [];
   		this.setState(this.state);
   },

   bonusBoard: function(x) {
   	this.state.players.map(function(player, idx) {
   		console.log(player['score']);
   		player.score += 1;
   	})
   	this.setState(this.state);
   },


	render: function() {
	  return (
			<div className="scoreboard">
				<Header title={this.props.title} players={this.state.players} 
						clearBoard={this.clearTheBoard} 
						bonus={function(bonusValue) {this.bonusBoard(bonusValue)}.bind(this)}
						/>

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