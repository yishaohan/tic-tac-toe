import {useState} from 'react';

function Square({ value, onSquareClick, highlight=false}) {
    if (highlight) {
        return (
            <button
                className="square highlight"
                onClick={onSquareClick}
            >
                {value}
            </button>
        );
    }
    return (
        <button
            className="square"
            onClick={onSquareClick}
        >
        {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) return;

        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }

    function checkWinner(winner, id) {
        if (winner) {
            return winner[0] === id || winner[1] === id || winner[2] === id;
        }
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + squares[winner[0]];
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }
    const rows = [];
    for (let i = 0; i < 3; i++) {
        const row = [];
        for (let j = 0; j < 3; j++) {
            const id = i * 3 + j;
            let sq = <Square value={squares[id]} onSquareClick={() => handleClick(id)}/>;
            if (checkWinner(winner, id)) sq = <Square value={squares[id]} onSquareClick={() => handleClick(id)} highlight={true}/>;
            row.push(sq);
        }
        rows.push(<div className="board-row">{row}</div>);
    }
    return (
        <>
            <div className="status">{status}</div>
            {rows}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];
    const [toggle, setToggle] = useState(false);

    function handlePlay(nextSquares) {
        const nextHistory = [...history.splice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    function doToggle() {
        setToggle(!toggle);
    }

    const moves = history.map((squares, move) => {
        let description;
        if (move === currentMove) {
            description = 'You are at move #' + move;
        } else if (move > 0) {
            description = 'Go to move #' + move;
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)} className={"history-button"}>{description}</button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className="game-info">
                <ol>{toggle?moves.reverse():moves}</ol>
            </div>
            {/*<button onClick={doToggle}>toggle</button>*/}
        </div>
    );
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
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [a, b, c];
        }
    }
    return null;
}