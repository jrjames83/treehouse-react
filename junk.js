<div className="players">
		{this.state.players.map(function(player, id) {
		return (

		<Player
			onScoreChange={function(delta) {
				
					this.onScoreChange(id, delta)}.bind(this)
			} 

			name={player.name}
			score={player.score}
			key={id}/>
			)
			}.bind(this))
		}
		</div>
	</div>