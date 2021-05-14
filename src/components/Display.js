/*
  Resources: 
  https://gsurma.medium.com/slitherin-solving-the-classic-game-of-snake-with-ai-part-1-domain-specific-solvers-d1f5a5ccd635

  EASY: BFS with basic self detection
    - Prevents snake from going backward on itself
    - If trapped (no currnent path to target) snake takes shortest path to end game

  MEDIUM: BFS with improved self detection 
    - Easy + 
    - Snake finds shortest path around its current self
    - Snake will not run into itself unless trapped (no path) by its body

  Hard: Continual BFS with optimized self detection 
    - Easy + Medium + 
    - If snake traps itself, find longest path to target and move 1
      then run medium BFS again, until it is no longer trapped or cannot move

  Impossible: Hamiltonian Cycle (Snake visits every node exactly once)
*/
import React, { useState, useEffect } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import easyBFS from '../algorithms/easyBFS'
import mediumBFS from '../algorithms/mediumBFS'
import hardBFS from '../algorithms/hardBFS'
import hamilton from '../algorithms/hamilton'

import './css/display.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const BOARD_SIZE = 12
const SNAKE_SPEED = 75
const STARTING_POS = 75

const Display = () => {
  const[board] = useState(createBoard(BOARD_SIZE))
  const[nodeBoard, setNodeBoard] = useState(
    board.map((row, rowIdx) => (
      row.map((cellVal, cellIdx) => (
        new Node(cellVal, rowIdx, cellIdx))))))
  const[snakeCells, setSnakeCells] = useState(new Set([STARTING_POS]))
  const[snake, setSnake] = useState(new LinkedList(STARTING_POS))
  const[target, setTarget] = useState(STARTING_POS+1)
  const[cellHover, setCellHover] = useState(-1)
  const[route, setRoute] = useState([STARTING_POS+1])
  const[hamiltonRoute, setHamiltonRoute] = useState([])
  const[exit, setExit] = useState(0)
  const[running, setRunning] = useState(false)
  const[algorithm, setAlgorithm] = useState("")

  // Handles setting the state of the highlighted cell
  const toggleHover = (cellVal) => {
    setCellHover(cellVal)
  }

  useEffect(() => {
    if(target>0 && exit===0) moveSnake()
    if(target===-1) setRunning(false)
  },[route])

  useEffect(() => {
    if(target>0 && exit===0) hamiltonSnakeToTarget()
    if(target===-1) setRunning(false)
  },[hamiltonRoute])

  // Handles win cases of the game
  const snakeWin = () => {
    console.log("Snake Wins!")
    setExit(1)
    setRunning(false)
  }

  const playerWin = () => {
    console.log("You Win!")      
    setExit(1)
    setRunning(false)
  }

  // Function called on click, triggers path finding and snake movement
  // If no optimal path is found by easyBFS, it will run the shortest path through itself to end game, 
  const setNextTarget = (target) => {
    if(!snakeCells.has(target) && algorithm && !running && exit===0) {
      setTarget(target)
      setTargetNodeInBoard(target)
      setRunning(true)
      let path = []
      if(algorithm==="Easy") path = easyBFS(snake, target, nodeBoard)
      else if(algorithm==="Medium") path = mediumBFS(snake, target, nodeBoard, snakeCells)
      else if(algorithm==="Hard") path = hardBFS(snake, target, nodeBoard, snakeCells)
      else if(algorithm==="Impossible") {
        if(hamiltonRoute.length===0) setHamiltonRoute(Array.from(hamilton()))
        else setHamiltonRoute(Array.from(hamiltonRoute))
      }
      if(algorithm!=="Impossible"){
        if(path.length===0) path = easyBFS(snake, target, nodeBoard, new Set())
        setRoute(Array.from(path))
      }
    }
  }

  // Find and set the target in nodeBoard
  const setTargetNodeInBoard = (cellVal) => {
    let rowId = Math.floor((cellVal-1)/BOARD_SIZE)
    let colId = cellVal%BOARD_SIZE===0 ? BOARD_SIZE-1 : cellVal%BOARD_SIZE-1
    nodeBoard[rowId][colId].isTarget = true
  }

  const hamiltonSnakeToTarget = () => {
    let path = Array.from(hamiltonRoute)
    let pathToAppend = path.splice(0, path.indexOf(snake.head.value)+1)
    path = path.concat(pathToAppend)
    while(path.length>1 && path[path.length-1]!==target){
      path.pop()
    }
    setRoute(Array.from(path))
  }

  // Responsible for moving the snake, and exiting if it runs into itself
  const moveSnake = () => {
    const nextSnakeHeadVal = route.shift()
    if(nextSnakeHeadVal===undefined) return
    const newHead = new LinkedListNode(nextSnakeHeadVal)
    const newSnakeCells = new Set(snakeCells)

    if(nextSnakeHeadVal===target){
      setTarget(-1)
    }
    else{
      newSnakeCells.delete(snake.tail.value)
      snake.tail = snake.tail.next
    }
    if(newSnakeCells.has(nextSnakeHeadVal)) playerWin()   
    else{
      const currentHead = snake.head
      snake.head = newHead
      currentHead.next = newHead
      newSnakeCells.add(nextSnakeHeadVal)
    }
    setSnakeCells(newSnakeCells)
    if(newSnakeCells.has(snake.head.value+1) && newSnakeCells.has(snake.head.value-1)
      && newSnakeCells.has(snake.head.value+BOARD_SIZE) && newSnakeCells.has(snake.head.value-BOARD_SIZE)){
        newSnakeCells.size===BOARD_SIZE*BOARD_SIZE ? snakeWin() : playerWin()
    }
    setTimeout(() => {
      setRoute(Array.from(route))      
    }, SNAKE_SPEED)
  }

  const handleReset = () => {
    setNodeBoard( board.map((row, rowIdx) => (
                   row.map((cellVal, cellIdx) => (
                     new Node(cellVal, rowIdx, cellIdx))))))
    setSnakeCells(new Set([STARTING_POS]))
    setSnake(new LinkedList(STARTING_POS))
    setTarget(STARTING_POS+1)
    setRoute([STARTING_POS+1])
    setExit(0)
  }

  const cursor = !running ? "pointer" : "auto"

  return (
    <div>
      <div>
        <div id="dropdown">
          <Dropdown as={ButtonGroup}>
            <Button variant="light">{algorithm ? algorithm : "Select Difficulty" }</Button>
              <Dropdown.Toggle split variant={algorithm ? "light" : "danger"} id="dropdown-split-basic" />

              <Dropdown.Menu>
                {algorithm  ? <Dropdown.Item onClick={() => setAlgorithm("")}>Select Difficulty</Dropdown.Item> : null }
                <Dropdown.Item onClick={() => setAlgorithm("Easy")}>Easy</Dropdown.Item>
                <Dropdown.Item onClick={() => setAlgorithm("Medium")}>Medium</Dropdown.Item>
                <Dropdown.Item onClick={() => setAlgorithm("Hard")}>Hard</Dropdown.Item>
                <Dropdown.Item onClick={() => setAlgorithm("Impossible")}>Impossible</Dropdown.Item>
              </Dropdown.Menu>
          </Dropdown>
        </div>
        <div
          id="seperate"
          style={{color: 'white'}}>
          |
        </div>
        <div
          id="generate"
          style={{cursor: cursor}}
          onClick={() => handleReset()}>
          Reset Game
        </div>
      </div>
      <div>
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className="row">
            {row.map((cellVal, cellIdx) => (
              <div 
                key={cellIdx}
                onMouseEnter={() => toggleHover(cellVal)} 
                onMouseLeave={() => toggleHover(-1)}
                onClick = {() => setNextTarget(cellVal)}
                className={`cell ${ cellVal===snake.head.value ? 'cell-snake-head'
                : snakeCells.has(cellVal) ? 'cell-snake'
                : cellVal===target ? 'cell-food'
                : cellVal===cellHover ? 'cell-hover'
                : route.includes(cellVal)? 'cell-path'
                : ''}`}
              >
            </div>
            ))}
          </div>
        ))}
      </div>
      <span>score: {snakeCells.size-2}</span>
    </div>
  )
}; 

class LinkedListNode {
  constructor(value) {
    this.value = value
    this.next = null
  }
}

class LinkedList{
  constructor(value) {
    const node = new LinkedListNode(value)
    this.head = node
    this.tail = node
  }
}

class Node{
  constructor(value, row, col){
    this.value = value
    this.row = row
    this.col = col
    this.isPath = false
    this.previousNodePath = null
  }
}

function createBoard(BOARD_SIZE) {
  let counter = 1
  const board = []
  for(let row=0; row<BOARD_SIZE; row++){
    const currRow = []
    for(let col=0; col<BOARD_SIZE; col++){
      currRow.push(counter++)
    }
    board.push(currRow)
  }
  return board
}

export default Display