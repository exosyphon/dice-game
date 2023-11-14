import { useEffect, useState } from 'react';

export default function Home() {
  const debug = false;
  const [numbers, setNumbers] = useState<number[]>([]);
  const [currentDiceHtml, setCurrentDiceHtml] = useState<any>(null);
  const sides: string[] = ['front', 'back', 'right', 'left', 'top', 'bottom'];

  const [solutions, _setSolutions] = useState<number[][]>([
    [1, 3, 2, 5, 4, 6],
    [1, 3, 5, 2, 4, 6],
    [1, 3, 4, 6, 2, 5],
    [1, 3, 4, 6, 5, 2],
    [1, 3, 6, 4, 2, 5],
    [1, 3, 6, 4, 5, 2],
    [1, 3, 2, 5, 6, 4],
    [1, 3, 5, 2, 6, 4],
    [1, 4, 5, 3, 6, 2],
    [1, 4, 6, 3, 5, 2],
    [1, 5, 6, 3, 4, 2],
    [1, 4, 3, 5, 6, 2],
    [1, 5, 6, 3, 4, 2],
    [1, 5, 3, 6, 2, 4],
    [1, 4, 6, 2, 3, 5],
    [1, 5, 3, 6, 4, 2],
    [1, 4, 2, 6, 5, 3],
    [1, 5, 4, 2, 6, 3],
    [1, 5, 6, 3, 2, 4],
    [1, 4, 2, 6, 3, 5],
  ]);
  const [initialState, setInitialState] = useState<number[]>([]);
  const [diceFront, setDiceFront] = useState<number>(0);
  const [diceState, setDiceState] = useState<number[]>([]);
  const [guesses, setGuesses] = useState<Guess[][]>([[]]);
  const [nextNumber, setNextNumber] = useState<number>(2);
  const [displayX, setDisplayX] = useState<boolean>(false);
  const [displaySuccess, setDisplaySuccess] = useState<boolean>(false);

  type Guess = {
    direction: string;
    correct: boolean;
  };

  type Solution = {
    solution: string;
  };

  useEffect(() => {
    fetch('/api/solutions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data: Solution) => {
        if (!data || !data['solution']) {
          return;
        }

        const mySolution = solutions[Number(data['solution'])];
        setInitialState(mySolution);
        setNumbers([mySolution[0], mySolution[1], mySolution[3], mySolution[2], mySolution[5], mySolution[4]]);
        setDiceState(mySolution);
        setCurrentDiceHtml(
          <div className={`dice m-6 gimbal`}>
            {[mySolution[0], mySolution[1], mySolution[3], mySolution[2], mySolution[5], mySolution[4]]?.map(
              (item, index) => {
                return (
                  <div
                    key={index}
                    className={`side ${sides[index]}`}
                    style={{
                      outline: `1px solid black`,
                    }}
                  >
                    {Array(item)
                      .fill(1)
                      .map((_num, numIndex) => {
                        return <span key={numIndex + 1} className={`dot dot${item}-${numIndex + 1}`}></span>;
                      })}
                  </div>
                );
              }
            )}
          </div>
        );
      });
  }, [solutions]);

  class Dice {
    front: number;
    top: number;
    back: number;
    bottom: number;
    left: number;
    right: number;

    constructor(faces: number[]) {
      this.front = faces[0];
      this.back = faces[1];
      this.right = faces[2];
      this.left = faces[3];
      this.top = faces[4];
      this.bottom = faces[5];
    }

    toArray(): number[] {
      return [this.front, this.back, this.right, this.left, this.top, this.bottom];
    }

    rotateBottom(n: number): void {
      for (let _ = 0; _ < n % 4; _++) {
        this._rotateBottom();
      }
    }

    private _rotateBottom(): void {
      [this.front, this.top, this.back, this.bottom] = [this.top, this.back, this.bottom, this.front];
    }

    rotateTop(n: number): void {
      for (let _ = 0; _ < n % 4; _++) {
        this._rotateTop();
      }
    }

    private _rotateTop(): void {
      [this.front, this.top, this.back, this.bottom] = [this.bottom, this.front, this.top, this.back];
    }

    rotateRight(n: number): void {
      for (let _ = 0; _ < n % 4; _++) {
        this._rotateRight();
      }
    }

    private _rotateRight(): void {
      [this.front, this.right, this.back, this.left] = [this.left, this.front, this.right, this.back];
    }

    rotateLeft(n: number): void {
      for (let _ = 0; _ < n % 4; _++) {
        this._rotateLeft();
      }
    }

    private _rotateLeft(): void {
      [this.front, this.right, this.back, this.left] = [this.right, this.back, this.left, this.front];
    }

    toString(): string {
      return `Front: ${this.front}, Top: ${this.top}, Back: ${this.back}, Bottom: ${this.bottom}, Left: ${this.left}, Right: ${this.right}`;
    }
  }

  const dice = new Dice(diceState);

  const checkContinueGuess = (diceFront: number) => {
    return nextNumber === diceFront;
  };

  const guessesExceeded = () => {
    return guesses.length >= 6;
  };

  const restartGame = () => {
    resetDie();
    setDisplaySuccess(false);
    setDisplayX(false);
    setGuesses([[]]);
  };

  const resetDie = () => {
    setCurrentDiceHtml(
      <div className={`dice m-6 gimbal`}>
        {numbers?.map((item: number, index) => {
          return (
            <div
              key={index}
              className={`side ${sides[index]}`}
              style={{
                outline: `1px solid black`,
              }}
            >
              <div>
                {Array(item)
                  .fill(1)
                  .map((_num, numIndex) => {
                    return <span key={numIndex + 1} className={`dot dot${item}-${numIndex + 1}`}></span>;
                  })}
              </div>
            </div>
          );
        })}
      </div>
    );

    setDiceState(initialState);
    setDiceFront(numbers.indexOf(1));
    setNextNumber(2);
  };

  const handleFailure = () => {
    const guessBlock = guesses[guesses.length - 1];
    guessBlock[guessBlock.length - 1].correct = false;
    guesses.push([]);
    setDisplayX(true);
    setGuesses(guesses);
    setTimeout(() => {
      setDisplayX(false);
      resetDie();
    }, 2000);
  };

  const checkConditions = () => {
    if (!checkContinueGuess(dice.front)) {
      handleFailure();
    } else if (dice.front == 6) {
      setDisplaySuccess(true);
      guesses.push([]);
      setGuesses(guesses);
    } else {
      setNextNumber(dice.front + 1);
    }
  };

  const rightF = () => {
    doAnotherRotate('Y', -90);
    dice.rotateRight(1);
    setDiceState(dice.toArray());
    setDiceFront(numbers.indexOf(dice.front));
    guesses[guesses.length - 1].push({ direction: '→', correct: true });
    setGuesses(guesses);
    checkConditions();
  };

  const leftF = () => {
    doAnotherRotate('Y', 90);
    dice.rotateLeft(1);
    setDiceState(dice.toArray());
    setDiceFront(numbers.indexOf(dice.front));
    guesses[guesses.length - 1].push({ direction: '←', correct: true });
    setGuesses(guesses);
    checkConditions();
  };

  const topF = () => {
    doAnotherRotate('X', -90);
    dice.rotateTop(1);
    setDiceState(dice.toArray());
    setDiceFront(numbers.indexOf(dice.front));
    guesses[guesses.length - 1].push({ direction: '↑', correct: true });
    setGuesses(guesses);
    checkConditions();
  };

  const bottomF = () => {
    doAnotherRotate('X', 90);
    dice.rotateBottom(1);
    setDiceState(dice.toArray());
    setDiceFront(numbers.indexOf(dice.front));
    guesses[guesses.length - 1].push({ direction: '↓', correct: true });
    setGuesses(guesses);
    checkConditions();
  };

  const doAnotherRotate = (axis: string, degrees: number) => {
    setCurrentDiceHtml(
      <div className="gimbal" style={{ width: 0, height: 0, transform: `rotate${axis}(${degrees}deg)` }}>
        {currentDiceHtml}
      </div>
    );
  };

  const disableButtons = () => {
    return guessesExceeded() || displayX || displaySuccess;
  };

  const copyGuesses = () => {
    let text = `Dice Game ${guesses.length - 1}/5\n`
    guesses.forEach((guessBlock) => {
      switch (guessBlock.length) {
        case 5:
          if (guessBlock[guessBlock.length - 1].correct) {
            text += "🟩🟩🟩🟩🟩"
          } else {
            text += "🟩🟩🟩🟩🟥"
          }
          break;
        case 4:
          text += "🟩🟩🟩🟥"
          break;
        case 3:
          text += "🟩🟩🟥"
          break;
        case 2:
          text += "🟩🟥"
          break;
        case 1:
          text += "🟥"
          break;
        default:
          text += ""
          break;
      }
      text += "\n"
    })
    navigator.clipboard.writeText(text).then(function() {
      alert("Results Copied To Clipboard!")
    }).catch(function(err) {
      console.error('Failed to copy guesses: ', err);
    });
  };

  return (
    <>
      <div className={'grid grid-rows-1 lg:grid-rows-2 grid-cols-1 lg:grid-cols-2 flex-wrap'}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
          className="mt-8"
        >
          <div className="font-bold">
            <button
              onClick={copyGuesses}
              style={{
                background: 'green',
                color: 'white',
                padding: '1rem',
                borderRadius: '.5rem',
                marginBottom: '1rem',
              }}
            >
              <span>Share</span>
              <svg style={{ display: 'inline-block', marginLeft: "8px" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path fill="var(--white)" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path></svg>
            </button>
            <div>Number of Guesses: {guesses.length - 1} out of 5.</div>
            <div>
              Guesses:
              {guesses.map((guess, guessIndex) => {
                return (
                  <div key={guessIndex}>
                    {guess.map((guessInternal, index) => {
                      return (
                        <span key={index} style={{}}>
                          {' '}
                          {guessInternal.direction}{' '}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div className="h-10 lg:h-80"></div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
          className="mt-0 ml-0 mr-0 mb-20 justify-center lg:mt-32"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
            className="lg:ml-32 lg:mb-32 lg:mr-48"
          >
            <div
              style={{
                fontSize: '44px',
                fontWeight: 'bold',
              }}
            >
              Dice Game
            </div>
            <div
              className="text-center"
              style={{
                fontSize: '30px',
              }}
            >
              Rotate dice in the correct order
            </div>
            <div
              style={{
                fontSize: '15px',
              }}
            >
              (1-6)
            </div>
            <div
              className="mb-8"
              style={{
                fontSize: '15px',
              }}
            >
              New Puzzle Each Day
            </div>
            {debug && (
              <div>
                <div>Front: {diceFront}</div>
                <div>State: {diceState.join(', ')}</div>
              </div>
            )}
            {!displayX && !displaySuccess && !guessesExceeded() && <div className="h-8"></div>}
            {displayX && (
              <div style={{ color: 'red' }} className="h-8">
                ❌❌ Incorrect Guess ❌❌
              </div>
            )}
            {displaySuccess && (
              <div style={{ color: 'green' }} className="h-8">
                ✅✅ You Win!!! ✅✅
              </div>
            )}
            {guessesExceeded() && (
              <div style={{ color: 'red' }} className="h-8">
                Better Luck Next Time
              </div>
            )}
            {(guessesExceeded() || displaySuccess) && (
              <button
                onClick={restartGame}
                style={{
                  background: 'blue',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '.5rem',
                  marginBottom: '1rem',
                }}
              >
                Reset
              </button>
            )}
            <button
              onClick={topF}
              disabled={disableButtons()}
              className="h-14 w-14 text-2xl font-bold"
              style={{
                background: disableButtons() ? 'gray' : 'blue',
                color: 'white',
                borderRadius: '.5rem',
                marginBottom: '1rem',
              }}
            >
              ↑
            </button>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <button
                onClick={leftF}
                disabled={disableButtons()}
                className="h-14 w-14 text-2xl font-bold"
                style={{
                  background: disableButtons() ? 'gray' : 'blue',
                  color: 'white',
                  borderRadius: '.5rem',
                  marginBottom: '1rem',
                  marginRight: '1rem',
                }}
              >
                ←
              </button>
              <div className="container">{currentDiceHtml}</div>
              <button
                onClick={rightF}
                disabled={disableButtons()}
                className="h-14 w-14 text-2xl font-bold"
                style={{
                  background: disableButtons() ? 'gray' : 'blue',
                  color: 'white',
                  borderRadius: '.5rem',
                  marginBottom: '1rem',
                  marginLeft: '1rem',
                }}
              >
                →
              </button>
            </div>
            <button
              onClick={bottomF}
              disabled={disableButtons()}
              className="h-14 w-14 text-2xl font-bold"
              style={{
                background: disableButtons() ? 'gray' : 'blue',
                color: 'white',
                borderRadius: '.5rem',
                marginBottom: '1rem',
              }}
            >
              ↓
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
