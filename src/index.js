import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props){
  return (
    <button className="square" onClick=
    {props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
      value = {this.props.squares[i]}
      onClick = {() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let rows = [];
    for (let i = 0; i <= 2; i++) {
     let children = []
     for (let j = i * 3; j <= i * 3 + 2; j++) {
        children.push(this.renderSquare(j))
      }
      rows.push(
        <div key={i} className="board-row">
          {children}
        </div>
      )
   }

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        pos: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const  squares =
    current.squares.slice();
    if(calculateWinner(squares) || squares[i]){ //ignore if we have winner or field already filled
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        pos: i,
      }]),

      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step%2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move # ' + move :
        'Got to game start';
      var coord = "" ;

      if(step.pos != null){
        var x = (Math.floor(step.pos / 3)) + 1;
        var y = (step.pos % 3) + 1;

        coord = "row: " + x.toString() + ", col: " + y.toString();
      }

      return (
        <li key = {move}>
          <button onClick= {()=> this.jumpTo(move)}>
          {desc}
          </button>

          <label>
          {coord}
          </label>
        </li>

      );
    });

    let status;
    if(winner){ //if winner exists
      status = 'Winner: ' + winner
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }


    return (
      <div className="game">
        <div className="game-board">
          <Board
           squares={current.squares}
           onClick={(i) => this.handleClick(i)}
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

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
