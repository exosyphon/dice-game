import { useState } from 'react';

export default function Home() {
    const numbers: number[] = [1, 6, 5, 2, 3, 4];
    const sides: string[] = ['front', 'back', 'right', 'left', 'top', 'bottom'];
    const customTextCss: string[] = ['', 'invert-text', '', '', '', 'rotated-text'];

    const [diceFront, setDiceFront] = useState<number>(0);
    const [diceState, setDiceState] = useState<any>([1, 3, 6, 4, 2, 5]);
    const [numberOfGuesses, setNumberOfGuesses] = useState<number>(0);

    class Dice {
        front: number;
        top: number;
        back: number;
        bottom: number;
        left: number;
        right: number;

        constructor(faces: number[]) {
            console.log('hello')
            this.front = faces[0];
            this.top = faces[1];
            this.back = faces[2];
            this.bottom = faces[3];
            this.left = faces[4];
            this.right = faces[5];
        }

        toArray(): any {
            return [this.front, this.top, this.back, this.bottom, this.left, this.right]
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

    const rightF = () => {
        dice.rotateRight(1);
        setDiceState(dice.toArray());
        setDiceFront(numbers.indexOf(dice.front));
    };

    const leftF = () => {
        dice.rotateLeft(1);
        setDiceState(dice.toArray());
        setDiceFront(numbers.indexOf(dice.front));
    };

    const topF = () => {
        dice.rotateTop(1);
        setDiceState(dice.toArray());
        setDiceFront(numbers.indexOf(dice.front));
    };

    const bottomF = () => {
        dice.rotateBottom(1);
        setDiceState(dice.toArray());
        setDiceFront(numbers.indexOf(dice.front));
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
                    <button onClick={topF} style={{
                        background: 'blue',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '.5rem',
                        marginBottom: '1rem',
                        height: '50px',
                        width: '100px'
                    }}>Top</button>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <button onClick={leftF} style={{
                            background: 'blue',
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
                        <button onClick={rightF} style={{
                            background: 'blue',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '.5rem',
                            marginBottom: '1rem',
                            height: '50px',
                            width: '100px'
                        }}>Right</button>
                    </div>
                    <button onClick={bottomF} style={{
                        background: 'blue',
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
