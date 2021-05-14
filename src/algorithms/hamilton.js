/*
 * Finds the Hamilton Path using DFS and backtracking, which is usually a O(n!)
 * operation. It would not work for grid larger than 6x6, when
 * I set the adjacency list so each node points to every neighbor node. 
 * 
 * I then set out to implement it with Dynamic Programming and Bitmasking, 
 *  as can be seen in the function HAMILTONSOLVERDP. This algorithm is much faster,
 *  but I am not very competant with Bitwise operations, so I could only use 
 *  this algorithm to find if a path existed, but could not get the 
 *  function to return the path.
 * 
 *  So I returned to the DFS and backtracking solution, but made some 
 *  changes to my adjacency list. Since the Hamilton Path will follow 
 *  the same pattern for even side-length grids, I changed each node to only 
 *  be adjacent to the nodes which follow this Hamilton pattern,
 *  although there are other valid Hamilton patterns / paths. This forced DFS to explore
 *  far fewer permutations, and therefore run significantly faster.
 * 
 * Algorithms sourced from:
 * DFS/Backtracking: https://www.geeksforgeeks.org/hamiltonian-cycle-backtracking-6/
 * DP: https://www.geeksforgeeks.org/hamiltonian-path-using-dynamic-programming/
*/

const BOARD_SIZE = 12
const NUMBER_VERTICES = Math.pow(BOARD_SIZE, 2)

function hamilton (){
    let hamiltonGraph = setHamiltonAdjacencyList()
    let path = new Array(BOARD_SIZE).fill(-1)
    path[0] = 0
    let included = new Set()
    included.add(0)
    if(hamiltonSolverDFS(hamiltonGraph, path, 1, included)===false) return []
    path = path.map(val => val+1)
    return path
}

function hamiltonSolverDFS(graph, path, pos, included){
    if(pos===NUMBER_VERTICES){
        if(graph[path[pos-1]][path[0]]===1) return true
        else return false
    }
    for(let v=1; v<NUMBER_VERTICES; v++){
        if(isSafe(v, graph, path, pos, included)){
            path[pos] = v
            included.add(v)
            if(hamiltonSolverDFS(graph, path, pos+1, included)===true) return true
            path[pos] = -1
            included.delete(v)
        }
    }
    return false
}

function isSafe(v, graph, path, pos, included){
    if(graph[path[pos-1]][v]===0) return false
    if(included.has(v)) return false
    return true
}

function setHamiltonAdjacencyList(){
    let hamiltonGraph = []
    for(let i=0; i<NUMBER_VERTICES; i++){
        let nodeAdjacency = new Array(NUMBER_VERTICES).fill(0)
        let valueRow = Math.floor(i/BOARD_SIZE)
        let valueCol = i%BOARD_SIZE

        if(valueRow===0){
            if(valueCol===0){
                nodeAdjacency[i+1] = 1
                nodeAdjacency[i+BOARD_SIZE] = 1
            }
            else if(valueCol===BOARD_SIZE-1){
                nodeAdjacency[i-1] = 1
                nodeAdjacency[i+BOARD_SIZE] = 1
            }
            else{
                nodeAdjacency[i+1] = 1
                nodeAdjacency[i-1] = 1
            }
        }
        else if(valueRow===BOARD_SIZE-1){
            if(valueCol===0){
                nodeAdjacency[i+1] = 1
                nodeAdjacency[i-BOARD_SIZE] = 1
            }
            else if(valueCol===BOARD_SIZE-1){
                nodeAdjacency[i-1] = 1
                nodeAdjacency[i-BOARD_SIZE] = 1
            }
            else{
                nodeAdjacency[i+1] = 1
                nodeAdjacency[i-1] = 1
            }
        }
        else{
            if(valueCol===0){
                nodeAdjacency[i+BOARD_SIZE] = 1
                nodeAdjacency[i-BOARD_SIZE] = 1
            }
            else if(valueCol===1){
                nodeAdjacency[i+1] = 1
                nodeAdjacency[i+BOARD_SIZE] = 1
            }
            else if(valueCol===BOARD_SIZE-1){
                nodeAdjacency[i-1] = 1
                nodeAdjacency[i+BOARD_SIZE] = 1
                nodeAdjacency[i-BOARD_SIZE] = 1            
            }
            else{
                nodeAdjacency[i+1] = 1
                nodeAdjacency[i-1] = 1          
            }
        }
        hamiltonGraph.push(nodeAdjacency)
    }
    return hamiltonGraph
}

// function hamiltonSolverDP(graph, path){
//     let N = graph.length

//     let dp = new Array(N).fill(new Array(1 << N))
//     for(let i=0; i<N; i++){
//         dp[i][1<<i] = true
//     }

//     for(let i=0; i < (1<<N); i++){
//         for(let j=0; j<N; j++){
//             if((i & (1<<j)) !== 0){
//                 for(let k=0; k<N; k++){
//                     if((i & (1<<k)) !== 0 && 
//                         graph[k][j]===1 && j!==k &&
//                         dp[k][i ^ (1<<j)]){
//                             console.log(graph[k][j])
//                             dp[j][i] = true
//                             break
//                         }
//                 }
//             }
//         }
//     }
//     for(let i=0; i<N; i++){
//         if(dp[i][(1<<N)-1]) return true
//     }
//     return false
// }

    
export default hamilton