import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Index = () => {
  const [location, setLocation] = useState({
    x: 4,
    y: 9
  });
  const [destination, setDestination] = useState({
    x: 1, y: 1
  })
  const area = { x: 23, y: 11 };
  const [areaGrid, setAreaGrid] = useState([]);

  useEffect(() => {
    function createGrid() {
      let tempAreaGrid = [];
      for (let i = 0; i < area.y; i++) {
        const currRow = [];
        for (let j = 0; j < area.x; j++) {
          currRow.push({
            x: i,
            y: j,
            isStart: i === location.x && j === location.y,
            isEnd: i === destination.x && j === destination.y,
            isWall: false,
            isPath: false,
            distance: Infinity,
            visited: false,
            previousNode: null,
          });
        }
        tempAreaGrid.push(currRow);
      }
      setAreaGrid(tempAreaGrid);
    }

    createGrid();
  }, [area.x, area.y, location.x, location.y, destination.x, destination.y]);

  const toggleWall = (x, y) => {
    if(x==destination.x && y==destination.y || x==location.x && y==location.y) return toast.error("Couldn't wall the Node");
    // let newGrid = areaGrid;
    // newGrid[x][y].isWall = !newGrid[x][y].isWall;
    setAreaGrid(prevGrid => {
      const newGrid = [...prevGrid];
      const newRow = [...newGrid[x]];
      newRow[y] = {...newRow[y], isWall : !newRow[y].isWall}
      newGrid[x] = newRow;
      return newGrid;
    })
    console.log(areaGrid)
  }

  const visualizeBFS = () => {
    const gridCopy = JSON.parse(JSON.stringify(areaGrid));
    const queue = [];
    queue.push(gridCopy[location.x][location.y]);
    gridCopy[location.x][location.y].visited = true;
    let destinationReached = false;
  
    // Perform BFS
    while (queue.length > 0 && !destinationReached) {
      const currentNode = queue.shift();
  
      const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];
  
      for (const dir of directions) {
        const newRow = currentNode.x + dir[0];
        const newCol = currentNode.y + dir[1];
  
        // Check if the new position is within bounds
        if (
          newRow >= 0 &&
          newRow < area.y &&
          newCol >= 0 &&
          newCol < area.x &&
          !gridCopy[newRow][newCol].visited &&
          !gridCopy[newRow][newCol].isWall
        ) {
          queue.push(gridCopy[newRow][newCol]);
          gridCopy[newRow][newCol].visited = true;
          gridCopy[newRow][newCol].previousNode = currentNode;
  
          // Check if the destination is reached
          if (newRow === destination.x && newCol === destination.y) {
            destinationReached = true;
            break;
          }
        }
      }
    }
  
    // path hightlighting here
    if (destinationReached) {
      let current = gridCopy[destination.x][destination.y];
      while (current !== null) {
        const { x, y } = current;
        gridCopy[x][y].isPath = true;
        current = current.previousNode;
      }
    } else {
      toast.error('Destination is unreachable!');
    }
    setAreaGrid(gridCopy);
  };
  

  return (
    <div className='py-10'>
      <button onClick={visualizeBFS} className='absolute top-10 left-10 bg-indigo-400 px-3 py-2 text-white rounded font-bold'>Find path</button>
      <div className='grid-itemself flex flex-col gap-1 justify-center items-center overflow-y-auto'>
        {areaGrid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((col) => {
              return <div key={`${col.x}-${col.y}`} 
                className={`node hover:bg-gray-100 border-2 border-gray-300 rounded-md p-1 w-12 h-12 text-xs cursor-pointer flex justify-end items-end  
                  ${col.isWall ? 'bg-red-800 hover:bg-red-700 text-white' : ''}
                  ${col.visited ? 'bg-yellow-400 hover:bg-yellow-300' : ''}
                  ${col.isPath ? 'bg-green-100': ''}
                  ${location.x === col.x && location.y === col.y ? 'bg-blue-300 hover:bg-blue-400' : ''}
                  ${destination.x === col.x && destination.y === col.y ? 'bg-green-300 hover:bg-green-400' : ''}`}
                onClick={()=>toggleWall(col.x, col.y)} 
                >
                ({col.x},{col.y})
              </div>
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
