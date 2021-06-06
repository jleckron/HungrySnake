# Hungry Snake
Place food on the grid for the snake to try and eat.
Aim for as low a score as possible!

## Settings:
### Easy:
- Snake uses BFS with no self detection to find a path to the food.

### Medium:
- Snake uses BFS while regarding its body as a "wall" to find a path to the food when a direct path exists.

### Hard:
- If there is no direct BFS path to the food, Snake will follow its tail until it can reach the food or uses DFS to find a path where its tail will be clear by the time the head arrives.

### Impossible:
- Snake will cyclically follow a Hamiltonian Path around the grid, visiting every grid cell only once on each cycle. Snake will always be able to reach food.

Built with React
