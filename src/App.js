import logo from './logo.svg';
import './App.css';
import {useState} from "react";

const selectItem = [
  'Банан',
  'Груша',
  'Ананас',
  'Киви',
  'Маракуя',
  'Мандарин',
  'Манго',
]

function App() {
  const blur = 100 / selectItem.length;
  const [selected, setSelected] = useState(false);

  function getFruit() {


    let variant = Math.random() * 100;

    setSelected(Math.round(variant / blur + 0.5) - 1);

  }

  return (
    <div className="App">
<button onClick={getFruit}>Выбери фрукт</button><br/>
      {selected > -1 && <span>{selectItem[selected]}</span>}
    </div>
  );
}

export default App;
