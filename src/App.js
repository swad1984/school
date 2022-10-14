import './App.css';
import {useEffect, useState} from "react";
import Draggable from 'react-draggable'

const selectItem = [
  'Иванов',
  'Петров',
  'Сидоров',
  'Карпов',
  'Федосов',
  'Романов',
  'Рюриков',
]

const rows = 8; // Количество рядов
const cols = 4; // Количество столбцов

const symbol = 'Z';
const pusto = ' ';

function App() {
  const blur = 100 / selectItem.length;
  const [selected, setSelected] = useState(false);
  const [pole, setPole] = useState([]);
  const [coords, setCoords] = useState([0, 0]);

  const [compute, setCompute] = useState(true);


  useEffect(() => {
    const area = pole;
    for (let row = 0; row < rows; row++) {
      area[row] = [];
      for (let col = 0; col < cols; col++) {
        area[row][col] = pusto;
      }
    }
    area[0][0] = symbol; // Расположить X в верхнем левом углу
    setPole([...area]);

    document.removeEventListener('keypress', clicker);
    document.addEventListener('keypress', clicker);

  }, []);

  function getFruit() {


    let variant = Math.random() * 100;

    let t = 3;
    setCompute(false);
    setSelected(4); // Для отображения счетчика
    let time = setInterval(() => {
      if (t > 0) {
        setSelected(t)
        t--;
      } else {
        setSelected(Math.round(variant / blur + 0.5) - 1);
        setCompute(true)
        clearInterval(time);
      }
    }, 1000)

  }

  const clicker = (e) => {
    move(e.code);
  }

  const move = (vector) => {
    const area = pole;
    const coordsThis = coords;
    console.log('in', vector)
    switch (vector) {
      case 'KeyW':
        if (coords[0] !== 0) {
          area[coords[0] - 1][coords[1]] = symbol;
          area[coords[0]][coords[1]] = pusto;
          coords[0] = coords[0] - 1;
        } else {
          console.log('Выше некуда')
        }
        break;
      case 'KeyS':
        if (coords[0] !== rows - 1) {
          area[coords[0] + 1][coords[1]] = symbol;
          area[coords[0]][coords[1]] = pusto;
          coords[0] = coords[0] + 1;
        } else {
          console.log('Ниже некуда')
        }
        break;
      case 'KeyA':
        if (coords[1] !== 0) {
          area[coords[0]][coords[1] - 1] = symbol;
          area[coords[0]][coords[1]] = pusto;
          coords[1] = coords[1] - 1;
        } else {
          console.log('Край слева')
        }
        break;
      case 'KeyD':
        if (coords[1] !== cols - 1) {
          area[coords[0]][coords[1] + 1] = symbol;
          area[coords[0]][coords[1]] = pusto;
          coords[1] = coords[1] + 1;
        } else {
          console.log('Край справа')
        }
    }
    setPole([...area]);
    setCoords([...coords]);

  }

  function movee(e) {
    e.preventDefault();
  }

  return (
    <div className="App">
      <button onClick={getFruit}>Кто пойдет к доске?</button>
      <br/>
      {selected > -1 && compute ? <span>{selectItem[selected]}</span> : selected}
      <hr/>
      Можно перемещать символ используя клавиши asdw на клавиатуре
      <table cellPadding={0} cellSpacing={0}>
        {pole.map(line => {
          return <tr>
            {line.map(col => {
              return <td>{col}</td>
            })}
          </tr>
        })}
      </table>
      <hr/>
      <Draggable handle={'#kot'} onDrag={movee}>
        <div id={'kot'}>
          <img alt={'кот'} src={'/img/kot.jpg'} width={150}/>
        </div>
      </Draggable>
    </div>
  );
}

export default App;
