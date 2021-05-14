const BOARD_SIZE = 12

function easyBFS (snake, target, nodeBoard){
    let headCoordinate = findHeadRC(snake.head.value)
    let rowId = headCoordinate[0], colId = headCoordinate[1]

    let visited = new Array(Math.pow(BOARD_SIZE, 2)).fill(false)
    visited[snake.head.value] = true

    let queue = [], path = []
    queue.push(nodeBoard[rowId][colId])

    preventReverse(snake, visited)
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
                visited[neighbor.value] = true
                nodeBoard[neighbor.row][neighbor.col].previousNodePath = currentNode
                queue.push(neighbor)
            }
        })
    }
    return path
}

function preventReverse(snake, visited){
    let temp = snake.tail
    let revSnake = []

    while(temp){
        revSnake.unshift(temp.value)
        temp = temp.next
    }
    let diff = revSnake[1] - revSnake[0]
    visited[revSnake[0]] = true
    visited[revSnake[1]] = true
    for(let i=1; i<revSnake.length-1; i++){
        if(revSnake[i+1] - revSnake[i] === diff) visited[revSnake[i+1]]=true
        else break
    }
}

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


function findHeadRC(cellVal){
    let rowId = Math.floor((cellVal-1)/BOARD_SIZE)
    let colId = cellVal%BOARD_SIZE===0 ? BOARD_SIZE-1 : cellVal%BOARD_SIZE-1
    return [rowId, colId]
}


export default easyBFS