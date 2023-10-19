import { useEffect, useState } from 'react';
import Script from 'next/script';

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
    const [guesses, setGuesses] = useState<string[][]>([[]]);
    const [nextNumber, setNextNumber] = useState<number>(2);
    const [displayX, setDisplayX] = useState<boolean>(false);
    const [displaySuccess, setDisplaySuccess] = useState<boolean>(false);

    type Solution = {
        solution: string;
    }

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
                setCurrentDiceHtml((
                    <div className={`dice m-6 gimbal`}>
                        {[mySolution[0], mySolution[1], mySolution[3], mySolution[2], mySolution[5], mySolution[4]]?.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`side ${sides[index]}`}
                                    style={{
                                        outline: `1px solid black`,
                                    }}
                                >
                                    {Array(item).fill(1).map((_num, numIndex) => {
                                        return (<span key={numIndex + 1} className={`dot dot${item}-${numIndex + 1}`}></span>)
                                    })}
                                </div>
                            );
                        })}
                    </div>
                ));
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
        return guesses.length >= 6;
    }

    const restartGame = () => {
        resetDie();
        setDisplaySuccess(false);
        setDisplayX(false);
        setGuesses([[]]);
    }

    const resetDie = () => {
        setCurrentDiceHtml((
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
                                {Array(item).fill(1).map((_num, numIndex) => {
                                    return (<span key={numIndex + 1} className={`dot dot${item}-${numIndex + 1}`}></span>)
                                })}
                            </div>
                        </div>
                    );
                })
                }
            </div >
        ));

        setDiceState(initialState);
        setDiceFront(numbers.indexOf(1));
        setNextNumber(2);
    }

    const handleFailure = () => {
        guesses.push([]);
        setDisplayX(true);
        setGuesses(guesses);
        setTimeout(() => {
            setDisplayX(false);
            resetDie();
        }, 2000);
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
        doAnotherRotate('Y', -90);
        dice.rotateRight(1);
        setDiceState(dice.toArray());
        setDiceFront(numbers.indexOf(dice.front));
        guesses[guesses.length - 1].push("→");
        setGuesses(guesses);
        checkConditions();
    };

    const leftF = () => {
        doAnotherRotate('Y', 90);
        dice.rotateLeft(1);
        setDiceState(dice.toArray());
        setDiceFront(numbers.indexOf(dice.front));
        guesses[guesses.length - 1].push("←");
        setGuesses(guesses);
        checkConditions();
    };

    const topF = () => {
        doAnotherRotate('X', -90);
        dice.rotateTop(1);
        setDiceState(dice.toArray());
        setDiceFront(numbers.indexOf(dice.front));
        guesses[guesses.length - 1].push("↑");
        setGuesses(guesses);
        checkConditions();
    };

    const bottomF = () => {
        doAnotherRotate('X', 90);
        dice.rotateBottom(1);
        setDiceState(dice.toArray());
        setDiceFront(numbers.indexOf(dice.front));
        guesses[guesses.length - 1].push("↓");
        setGuesses(guesses);
        checkConditions();
    };

    const doAnotherRotate = (axis: string, degrees: number) => {
        setCurrentDiceHtml(
            <div className='gimbal' style={{ width: 0, height: 0, transform: `rotate${axis}(${degrees}deg)` }}>
                {currentDiceHtml}
            </div>
        );
    };

    const disableButtons = () => {
        return guessesExceeded() || displayX || displaySuccess;
    }


    return (
        <>
            <Script
                strategy="lazyOnload"
                src={`https://www.googletagmanager.com/gtag/js?id=G-PMNS5L31T2}`}
            />
            <Script id='google-analytics' strategy="lazyOnload">
                {`
                     window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());

                      gtag('config', 'G-PMNS5L31T2');
                `}
            </Script>
            <div className={'grid grid-rows-1 lg:grid-rows-2 grid-cols-1 lg:grid-cols-2 flex-wrap'}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                    className='mt-8'
                >
                    <div className='font-bold'>
                        <div>
                            Number of Guesses: {guesses.length - 1} out of 5.
                        </div>
                        <div>
                            Guesses:
                            {guesses.map((guess, guessIndex) => {
                                return (
                                    <div key={guessIndex}>
                                        {guess.map((guessInternal, index) => {
                                            return (<span key={index} style={{}} > {guessInternal} </span>);
                                        })}
                                    </div>
                                )
                            })
                            }
                        </div>
                        <div className='h-10 lg:h-80'></div>
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                    className='mt-0 ml-0 mr-0 mb-20 justify-center lg:mt-32'
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                        className='lg:ml-32 lg:mb-32 lg:mr-48'
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
                            className='mb-8 justify-center'
                            style={{
                                fontSize: '30px',
                            }}
                        >
                            Rotate the dice in the correct order (1-6)
                        </div>
                        {debug &&
                            <div>
                                <div>Front: {diceFront}</div>
                                <div>State: {diceState.join(', ')}</div>
                            </div>
                        }
                        {!displayX && !displaySuccess && !guessesExceeded() && <div className='h-8'></div>}
                        {displayX && <div style={{ color: 'red' }} className='h-8'>❌❌ Incorrect Guess ❌❌</div>}
                        {displaySuccess && <div style={{ color: 'green' }} className='h-8'>✅✅ You Win!!! ✅✅</div>}
                        {guessesExceeded() && <div style={{ color: 'red' }} className='h-8'>Better Luck Next Time</div>}
                        {(guessesExceeded() || displaySuccess) && <button onClick={restartGame} style={{
                            background: 'blue',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '.5rem',
                            marginBottom: '1rem',
                        }}>Reset</button>}
                        <button onClick={topF} disabled={disableButtons()} className='h-14 w-14' style={{
                            background: disableButtons() ? 'gray' : 'blue',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '.5rem',
                            marginBottom: '1rem',
                        }}>↑</button>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <button onClick={leftF} disabled={disableButtons()} className='h-14 w-14' style={{
                                background: disableButtons() ? 'gray' : 'blue',
                                color: 'white',
                                padding: '1rem',
                                borderRadius: '.5rem',
                                marginBottom: '1rem',
                                marginRight: '1rem',
                            }}>←</button>
                            <div className='container'>
                                {currentDiceHtml}
                            </div>
                            <button onClick={rightF} disabled={disableButtons()} className='h-14 w-14' style={{
                                background: disableButtons() ? 'gray' : 'blue',
                                color: 'white',
                                padding: '1rem',
                                borderRadius: '.5rem',
                                marginBottom: '1rem',
                                marginLeft: '1rem',
                            }}>→</button>
                        </div>
                        <button onClick={bottomF} disabled={disableButtons()} className='h-14 w-14' style={{
                            background: disableButtons() ? 'gray' : 'blue',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '.5rem',
                            marginBottom: '1rem',
                        }}>↓</button>
                    </div>
                </div>
            </div>
        </>
    );
}
