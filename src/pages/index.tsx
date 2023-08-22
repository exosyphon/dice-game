import { useState } from 'react';

export default function Home() {
    const numbers: number[] = [1, 6, 5, 2, 3, 4];
    const sides: string[] = ['front', 'back', 'right', 'left', 'top', 'bottom'];
    const customTextCss: string[] = ['', 'invert-text', '', '', '', 'rotated-text'];

    const solutions = [
        [1, 3, 2, 5, 4, 6],
        [1, 3, 5, 2, 4, 6],
        [1, 3, 4, 6, 2, 5],
        [1, 3, 4, 6, 5, 2],
        [1, 3, 6, 4, 2, 5],
        [1, 3, 6, 4, 5, 2],
        [1, 3, 2, 5, 6, 4],
        [1, 3, 5, 2, 6, 4],
        [1, 2, 3, 5, 6, 4],
    ]
    const initialState = solutions[0];
    const [diceFront, setDiceFront] = useState<number>(0);
    const [diceState, setDiceState] = useState<number[]>(initialState);
    const [numberOfGuesses, setNumberOfGuesses] = useState<number>(1);
    const [nextNumber, setNextNumber] = useState<number>(2);
    const [displayX, setDisplayX] = useState<boolean>(false);
    const [displaySuccess, setDisplaySuccess] = useState<boolean>(false);

    const allCombinations = [
        ['R', 'R', 'U', 'R', 'R' ],
        ['L', 'L', 'U', 'L', 'L' ],
        ['U', 'U', 'R', 'U', 'U' ],
        ['D', 'D', 'R', 'D', 'D' ],
        ['U', 'U', 'L', 'U', 'U' ],
        ['D', 'D', 'L', 'D', 'D' ],
        ['R', 'R', 'D', 'R', 'R' ],
        ['L', 'L', 'D', 'L', 'L' ],
    ]

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
            return [this.front, this.back, this.right, this.left, this.top, this.bottom]
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
    }

    const guessesExceeded = () => {
        return false;
        // return numberOfGuesses > 3;
    }

    const restartGame = () => {
        resetDie();
        setDisplaySuccess(false);
        setDisplayX(false);
        setNumberOfGuesses(1);
    }

    const resetDie = () => {
        setDiceState(initialState);
        setDiceFront(numbers.indexOf(1));
        setNextNumber(2);
    }

    const handleFailure = () => {
        resetDie();
        setNumberOfGuesses(numberOfGuesses + 1);
        setDisplayX(true);
        setTimeout(() => {
            setDisplayX(false);
        }, 3000);
    }

    const checkConditions = () => {
        if (!checkContinueGuess(dice.front)) {
            handleFailure();
        } else if (dice.front == 6) {
            setDisplaySuccess(true);
        } else {
            setNextNumber(dice.front + 1);
        }
    }

    const rightF = () => {
        dice.rotateRight(1);
        setDiceState(dice.toArray());
        setDiceFront(numbers.indexOf(dice.front));
        checkConditions();
    };

    const leftF = () => {
        dice.rotateLeft(1);
        setDiceState(dice.toArray());
        setDiceFront(numbers.indexOf(dice.front));
        checkConditions();
    };

    const topF = () => {
        dice.rotateTop(1);
        setDiceState(dice.toArray());
        setDiceFront(numbers.indexOf(dice.front));
        checkConditions();
    };

    const bottomF = () => {
        dice.rotateBottom(1);
        setDiceState(dice.toArray());
        setDiceFront(numbers.indexOf(dice.front));
        checkConditions();
    };

    return (
        <>
            <div style={{ display: 'flex' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        height: '100vh',
                        width: '100%',
                    }}
                >
                    <div
                        className={'mb-8'}
                        style={{
                            fontSize: '44px',
                            fontWeight: 'bold',
                        }}
                    >
                        Dice Game
                    </div>
                    <div>Front: {diceFront}</div>
                    <div>State: {diceState.join(', ')}</div>
                    {displayX && <div style={{ color: 'red' }}>❌❌ Incorrect Guess ❌❌</div>}
                    {displaySuccess && <div style={{ color: 'green' }}>✅✅ You Win!!! ✅✅</div>}
                    {guessesExceeded() && <div style={{ color: 'red' }}>Better Luck Next Time</div>}
                    {(guessesExceeded() || displaySuccess) && <button onClick={restartGame} style={{
                        background: 'blue',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '.5rem',
                        marginBottom: '1rem',
                        height: '50px',
                        width: '100px'
                    }}>Reset</button>}
                    <div className='mb-8'>
                        Number of Guesses: {numberOfGuesses} out of 3.
                    </div>
                    <button onClick={topF} disabled={guessesExceeded()} style={{
                        background: guessesExceeded() ? 'gray' : 'blue',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '.5rem',
                        marginBottom: '1rem',
                        height: '50px',
                        width: '100px'
                    }}>Top</button>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <button onClick={leftF} disabled={guessesExceeded()} style={{
                            background: guessesExceeded() ? 'gray' : 'blue',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '.5rem',
                            marginBottom: '1rem',
                            height: '50px',
                            width: '100px',
                        }}>Left</button>
                        <div className={`dice rolled-${sides[diceFront]} m-6`}>
                            {numbers?.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`side ${sides[index]}`}
                                        style={{
                                            outline: `1px solid black`,
                                        }}
                                    >
                                        <div className={customTextCss[index]}>{item}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <button onClick={rightF} disabled={guessesExceeded()} style={{
                            background: guessesExceeded() ? 'gray' : 'blue',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '.5rem',
                            marginBottom: '1rem',
                            height: '50px',
                            width: '100px'
                        }}>Right</button>
                    </div>
                    <button onClick={bottomF} disabled={guessesExceeded()} style={{
                        background: guessesExceeded() ? 'gray' : 'blue',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '.5rem',
                        marginBottom: '1rem',
                        height: '50px',
                        width: '100px'
                    }}>Down</button>
                </div>
            </div>
        </>
    );
}
