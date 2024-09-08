import React, { useState, useEffect } from "react";

const App = () => {
  const [binaryNumber, setBinaryNumber] = useState("");
  const [userInput, setUserInput] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0); 
  const [isSigned, setIsSigned] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [bitSize, setBitSize] = useState(4); 
  const [timeLeft, setTimeLeft] = useState(15); 
  const [timeLimit, setTimeLimit] = useState(15); 

  const generateBinaryNumber = () => {
    let number = "";
    for (let i = 0; i < bitSize; i++) {
      number += Math.random() < 0.5 ? "0" : "1";
    }
    const signFlag = Math.random() < 0.5;
    setIsSigned(signFlag);
    setBinaryNumber(number);
    setUserInput("");
    setMessage("");
    setSubmitted(false);
    setTimeLeft(timeLimit);
  };

  const binaryToDecimal = (binary, isSigned) => {
    let decimalValue;
    if (isSigned && binary[0] === "1") {
      const invertedBinary = binary
        .split("")
        .map((bit) => (bit === "0" ? "1" : "0"))
        .join("");
      const twoComplement = (parseInt(invertedBinary, 2) + 1) * -1;
      decimalValue = twoComplement;
    } else {
      decimalValue = parseInt(binary, 2);
    }
    return decimalValue;
  };

  const checkAnswer = () => {
    const answer = binaryToDecimal(binaryNumber, isSigned);
    setCorrectAnswer(answer);
    if (parseInt(userInput) === answer) {
      setMessage({
        text: "Correct! Great job!",
        color: "text-green-500",
      });
      setScore(score + 1);
    } else {
      setMessage({
        text: `Incorrect! The correct answer was ${answer}`,
        color: "text-red-500",
      });
      if (score > maxScore) {
        setMaxScore(score);  
      }
      setScore(0);  
    }
    setSubmitted(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!submitted) {
        checkAnswer();  // Submit the answer if not yet submitted
      } else {
        generateBinaryNumber();  // Move to the next question if already submitted
      }
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !submitted) {
      checkAnswer();
    }
  }, [timeLeft, submitted]);

  useEffect(() => {
    generateBinaryNumber();
  }, [bitSize, timeLimit]);

  return (
    <div className="flex flex-col h-full py-10 items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Binary to Decimal Quiz</h1>
      <div className="flex gap-5">

      <div className="mb-4">
        <label className="mr-2">Bit Size:</label>
        <input
          type="number"
          min="2"
          max="10"
          value={bitSize}
          onChange={(e) => setBitSize(parseInt(e.target.value))}
          className="border p-2 text-center w-16 rounded border-black focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="mr-2">Time Limit:</label>
        <select
          value={timeLimit}
          onChange={(e) => setTimeLimit(parseInt(e.target.value))}
          className="border p-2 rounded border-black focus:outline-none"
        >
          <option value={10}>10 seconds</option>
          <option value={15}>15 seconds</option>
          <option value={30}>30 seconds</option>
          <option value={60}>60 seconds</option>
        </select>
      </div>
      </div>

      <p className="mb-2 text-xl">Binary Number: {binaryNumber}</p>
      <p className="mb-4">
        This is a {isSigned ? "signed" : "unsigned"} binary number.
      </p>

      <p className="text-xl mb-4">Time Left: {timeLeft}s</p>

      {!submitted ? (
        <>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter decimal value"
            onKeyDown={handleKeyDown} 
            className="border p-2 mb-4 text-center w-48 rounded border-black focus:outline-none"
          />
          <button
            onClick={checkAnswer}
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Submit
          </button>
        </>
      ) : (
        <>
          <p className={`mt-4 text-lg ${message.color}`}>{message.text}</p>
          <button
            onClick={generateBinaryNumber}
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Next
          </button>
        </>
      )}

      <p className="mt-4 text-lg font-semibold">Score: {score}</p>
      <p className="text-lg font-semibold">High Score: {maxScore}</p>

      <div className="mt-6 p-4 border rounded bg-white">
        <h2 className="text-xl font-semibold mb-2">Binary to Decimal Rules</h2>
        <p className="mb-2">
          <strong>Unsigned:</strong> Directly convert the binary number to decimal.
        </p>
        <p className="mb-2">
          <strong>Signed (Two's Complement):</strong>
        </p>
        <ol className="list-decimal pl-6">
          <li>If the first bit is 1 (negative), invert all bits.</li>
          <li>Add 1 to the inverted bits.</li>
          <li>Convert the result to decimal and apply a negative sign.</li>
        </ol>
        <p className="mt-4 italic text-sm">Example:</p>
        <p className="text-sm">
          <strong>Binary:</strong> 1001 (signed)<br />
          <strong>Step 1:</strong> Invert bits → 0110<br />
          <strong>Step 2:</strong> Add 1 → 0111<br />
          <strong>Step 3:</strong> Convert to decimal → 7, apply negative sign → -7
        </p>
      </div>
    </div>
  );
};

export default App;
