const BOARD_SIZE = 12

// Main running function for mediumBFS - BFS implementation
// Only looks at cells popped out of the queue that are not already
//  visited AND not a part of the current snake
function mediumBFS (snake, target, nodeBoard, snakeCells){
    let headCoordinate = findHeadRC(snake.head.value)
    let rowId = headCoordinate[0], colId = headCoordinate[1]
    let visited = new Array(Math.pow(BOARD_SIZE, 2)).fill(false)
    visited[snake.head.value] = true

    let queue = [], path = []
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
            if(!visited[neighbor.value] && !snakeCells.has(neighbor.value)){
                visited[neighbor.value] = true
                nodeBoard[neighbor.row][neighbor.col].previousNodePath = currentNode
                queue.push(neighbor)
            }
        })
    }
    return path
}

// Finds neighbors of a cell for BFS
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

export default mediumBFS