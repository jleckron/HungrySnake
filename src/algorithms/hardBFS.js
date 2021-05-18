 /*
    *  If there is no direct path to the target, hardBFS will look at 
    *  all of the snakeCells that it encounters, and will go to that encountered
    *  cell which is closest to the tail of the snake. I will call this cell X.
    * 
    *  If X is the tail of the snake, the head of the snake will follow the tail through
    *  the "wall", until it can reach the target.
    * 
    *  If X is not the tail: 
    *    If the distance along the BFS path from the head of the snake to X is less 
    *    than the distance from X to the tail of the snake along the snake, then after 
    *    however many moves it takes the head of the snake to get to X, the tail of 
    *    the snake will have moved on and the path will be clear.
    * 
    *    If that distance is greater, the snake will find a path with a length at least 1 
    *    greater than the distance from X to the tail of the snake. If no path found, player wins.
    */

import mediumBFS from '../algorithms/mediumBFS'

const BOARD_SIZE = 12

// Main running function for hardBFS
// Much more case handling if no direct path is found
function hardBFS (snake, target, nodeBoard, snakeCells){
    let headCoordinate = findHeadRC(snake.head.value)
    let rowId = headCoordinate[0], colId = headCoordinate[1]

    let visited = new Array(Math.pow(BOARD_SIZE, 2)).fill(false)
    visited[snake.head.value] = true

    let queue = [], path = [], encounteredSnakeCells = []
    queue.push(nodeBoard[rowId][colId])

    while(queue.length){
        let currentNode = queue.shift()
        visited[currentNode.value] = true
        if(currentNode.value===target) {
            let tempNode = currentNode
            while(tempNode.value!==snake.head.value){
                tempNode.previousNodePath.isPath = true
                path.unshift(tempNode.value)
                tempNode = tempNode.previousNodePath
             }
            return path
        }
        let currentNeighbors = findNeighbors(currentNode, nodeBoard)
        currentNeighbors.forEach(neighbor => {
            if(!visited[neighbor.value]){
                if(!snakeCells.has(neighbor.value)){
                    visited[neighbor.value] = true
                    nodeBoard[neighbor.row][neighbor.col].previousNodePath = currentNode
                    queue.push(neighbor)
                }
                else encounteredSnakeCells.push(neighbor.value)
            }
        })
    }
    if(path.length===0) {
        // Find the cell closest to the tail with a direct path to target
        let newSnakeCells = new Set(snakeCells)
        let temp = snake.tail
        let pathBreakthroughToTarget = [], breakThroughCell = -1
        while(!pathBreakthroughToTarget.length && temp.next){
            breakThroughCell = temp.value
            let snakeCopy = Object.create(snake)
            snakeCopy.head = Object.create(temp)
            snakeCopy.head.value = breakThroughCell

            pathBreakthroughToTarget = mediumBFS(snakeCopy, target, nodeBoard, snakeCells)
            temp = temp.next
        }
        let returnPair = findCellClosestTail(snake, encounteredSnakeCells)
        let encCellClosestTail = returnPair[0], distFromTail = returnPair[1]

        // If head can reach the tail, head will follow tail until it can reach target
        if(encCellClosestTail===snake.tail.value){
            newSnakeCells.delete(encCellClosestTail)
            let pathToTail = mediumBFS(snake, encCellClosestTail, nodeBoard, newSnakeCells)
            let temp = snake.tail.next
            while(temp.next && newSnakeCells.has(breakThroughCell)){
                pathToTail.push(temp.value)
                newSnakeCells.delete(temp.value)
                temp = temp.next
            }
            return pathToTail.concat(pathBreakthroughToTarget)
        }
        // If head must wait for the tail to pass (cannot follow)
        else{
            newSnakeCells.delete(encCellClosestTail)
            let pathToEncountered = mediumBFS(snake, encCellClosestTail, nodeBoard, newSnakeCells)
            // If the tail will be clear after y moves it takes the head to arrive, path to target is clear
            if(distFromTail+1<pathToEncountered.length){
                let temp = snake.tail
                while(temp.next && newSnakeCells.has(temp.value)){
                    newSnakeCells.delete(temp.value)
                    temp = temp.next
                }
                let snakeCopy = Object.create(snake)
                snakeCopy.head = Object.create(temp)
                snakeCopy.head.value = encCellClosestTail
                return pathToEncountered.concat(mediumBFS(snakeCopy, target, nodeBoard, newSnakeCells))
            }
            // Otherwise head must "wait" by moving along a longer path until the tail will be clear after y
            // moves it takes the head to arrive
            else{
                let exit = 0
                let dfsPath = []
                //DFS function to find path with length at least 1 more than dist from breakthrough to tail
                var dfs = function(cell, currentLength, locPath){
                    if(currentLength>=distFromTail+1 && cell.value===encCellClosestTail){
                        exit = 1
                        return locPath
                    }
                    if(currentLength>distFromTail+4) return
                    let currentNeighbors = findNeighbors(cell, nodeBoard)
                    currentNeighbors.forEach(neighbor => {
                        if(exit===0 && !locPath.includes(neighbor.value) && !newSnakeCells.has(neighbor.value)){
                            locPath.push(neighbor.value)
                            dfs(neighbor, currentLength+1, locPath)
                            if(exit===0) locPath.pop()
                        }
                    })
                }
                let headCoordinate = findHeadRC(snake.head.value)
                let rowId = headCoordinate[0], colId = headCoordinate[1]
                dfs(nodeBoard[rowId][colId], 0, dfsPath)
                let toTar = []
                if(dfsPath.length){
                    let temp = snake.tail
                    newSnakeCells.add(encCellClosestTail)
                    while(temp.next && newSnakeCells.has(encCellClosestTail)){
                        newSnakeCells.delete(temp.value)
                        temp = temp.next
                    }
                    let snakeCopy = Object.create(snake)
                    snakeCopy.head = Object.create(temp)
                    snakeCopy.head.value = encCellClosestTail
                    toTar = mediumBFS(snakeCopy, target, nodeBoard, newSnakeCells)
                }
                return dfsPath.concat(toTar)
            }
        }
    }
    return path
}


// Helper function that finds the cell in encounteredCells which is
// closest to the tail of the snake. 
function findCellClosestTail(snake, encounteredSnakeCells){
    let temp = snake.tail
    let endTarget = -1
    let counter = 0
    while(temp.next){
        if(encounteredSnakeCells.includes(temp.value)){
            endTarget = temp.value
            break
        }
        temp = temp.next
        counter++
    }
    return [endTarget, counter]
}

// Finds the neighbors of a cell for BFS
function findNeighbors(node, nodeBoard){
    let neighbors = []
    let potentialNeighbor
    if(nodeBoard[node.row-1] && nodeBoard[node.row-1][node.col]){
        potentialNeighbor = nodeBoard[node.row-1][node.col]
        neighbors.push(potentialNeighbor)
    }
    if(nodeBoard[node.row+1] && nodeBoard[node.row+1][node.col]){
        potentialNeighbor = nodeBoard[node.row+1][node.col]
        neighbors.push(potentialNeighbor)
    }
    if(nodeBoard[node.row][node.col-1] && nodeBoard[node.row][node.col-1]){
        potentialNeighbor = nodeBoard[node.row][node.col-1]
        neighbors.push(potentialNeighbor)
    }
    if(nodeBoard[node.row][node.col+1] && nodeBoard[node.row][node.col+1]){
        potentialNeighbor = nodeBoard[node.row][node.col+1]
        neighbors.push(potentialNeighbor)
    }
    return neighbors
}

// Find the row and column of a given cell, so its place can be determined
// in the nodeBoard
function findHeadRC(cellVal){
    let rowId = Math.floor((cellVal-1)/BOARD_SIZE)
    let colId = cellVal%BOARD_SIZE===0 ? BOARD_SIZE-1 : cellVal%BOARD_SIZE-1
    return [rowId, colId]
}

export default hardBFS