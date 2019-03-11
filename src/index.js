import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//this is a function component
function Square(props) {
	//it does not has a state/constructor, just a render()
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
//cada cuadrado tendrá un botón para poder cambiar el display de una X o un O

class Board extends React.Component {
	//board component, will be used on game component
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
//The class game has a constructor which's got a the state of the game
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    //this keeps track of the turns in game
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
    //this keeps track of the number of turn
      stepNumber: 0,
    //this keeps track of the next player
      xIsNext: true
    //X is the next player by default
    };
  }

  handleClick(i) {
  	//each time the game "hears" a click on the board does...
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    //flip the true boolean to change the turn
    squares[i] = this.state.xIsNext ? "X" : "O";
    //changing state depending on turn
    this.setState({
      history: history.concat([
        //history its got the array of turns
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
      //flip boolean state
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    //variables to keep track of history match, current turn and winner
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
       //buttons showed in the bottom to return to last turns
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
        //calls the change of turn
      );
    });
    //if the winner exists, then the game is over and its written, otherwise the next player follows
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    //what we can see on the site
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================
//Esto usualmente va en el archivo default index.js y en el app.js va el componente creado.
ReactDOM.render(<Game />, document.getElementById("root"));

//just a function which tells the winner by making position comparisons
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
