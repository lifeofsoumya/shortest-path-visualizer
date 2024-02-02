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

  const visualizeDijkstra = () => {
    // Implement Dijkstra's algorithm here
    // You need to update the state to visualize the changes
    // You can use the state variable 'areaGrid' to represent the grid
    // Update the 'distance', 'visited', and 'previousNode' properties in the grid cells
  };

  return (
    <div className='py-10'>
      <div className='grid-itemself flex flex-col gap-1 justify-center items-center overflow-y-auto'>
        {areaGrid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((col) => {
              return <div key={`${col.x}-${col.y}`} 
                className={`node hover:bg-gray-100 border-2 border-gray-300 rounded-md p-1 w-12 h-12 text-xs cursor-pointer flex justify-end items-end  
                  ${col.isWall ? 'bg-red-800 hover:bg-red-700 text-white' : ''}
                  ${col.visited ? 'bg-yellow-400 hover:bg-yellow-300' : ''}
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
