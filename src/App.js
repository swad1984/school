import './App.css';
import './css/bootstrap.css';
import {useEffect, useState} from "react";
import Draggable from 'react-draggable'
import {Modal, Button, Container, Row, Col, Form, InputGroup, Badge} from 'react-bootstrap';
import {StudentLine, EditLine} from "./editStudent";
//import {} from '@fortawesome/fontawesome-svg-core'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const selectItem = [
  'Иванов',
  'Петров',
  'Сидоров',
  'Карпов',
  'Федосов',
  'Романов',
  'Рюриков',
]

const rows = 7; // Количество рядов
const cols = 8; // Количество столбцов

const symbol = 'X';
const pusto = ' ';

function App() {
  const blur = 100 / selectItem.length;
  const [data, setData] = useState(/** @type {KlassListType} */{});
  const [selected, setSelected] = useState(-1);
  const [pole, setPole] = useState([]);
  const [coords, setCoords] = useState([0, 0]);

  const [compute, setCompute] = useState(true);
  const [open, setOpen] = useState(false);
  const [klassNames, setKlassNames] = useState(/** @type {string[]} */[])
  const [klassList, setKlassList] = useState(/** @type {StudentShowType[]} */[])
  const [selectKlass, setSelectKlass] = useState('')

  const [edit, setEdit] = useState('')
  const [addNewStudent, setAddNewStudent] = useState(false)

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
    const x = fetch('klass.json');
    x.then(async (res) => {
      //console.log('res', await res.json());
      return await res.json();
    }).then(/** @param {KlassListType} res */res => {
      setData(res);
      const klassName = [];
      const klassPerson = []
      for (let i in res) {
        klassName.push(i)
        /*for (let j in res[i]) {
          klassPerson.push(res[i][j]);
        }*/

      }
      setKlassNames(klassName);
    })
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

  useEffect(() => {
    console.log('EditChange', edit)
  }, [edit])

  /**
   *
   * @param {StudentShowType} a
   * @param {StudentShowType} b
   */
  const sortByName = (a,b) => {
    if (a.name > b.name) return 1
    if (a.name < b.name) return -1;
    return 0;
  }

  const getKlassList = (klass) => {
    const list = data[klass]
    const student = []
    for (let x in list) {
      student.push({
        name: x,
        count: list[x].count,
        place: list[x].place
      })
    }
    setKlassList(student.sort(sortByName))
    setSelectKlass(klass)
  }

  const changeSelectEdit = (e) => {
    /*console.log(e)
    console.log(e.currentTarget)
    console.log(e.currentTarget.value)*/
    if (data.hasOwnProperty(e.currentTarget.value)) {
      getKlassList(e.currentTarget.value);
    }
  }

  const saveEdit = (changeData) => {
    const editData = { ...data };
    /*
    key: data.student.name,
      nameChange: editData.name,
      countChange: editData.count
     */
    console.log('SAVE BRGIN', editData, changeData);
    delete editData[selectKlass][changeData.key];
    editData[selectKlass][changeData.nameChange] = {
      count: changeData.countChange,
      place: changeData.place
    }
    setData({ ...editData });
    setEdit('');
    getKlassList(selectKlass);

  }

  /** @param {string} name */
  const clickEdit = (name) => {
    console.log('clickEdit', name);
    setEdit(name);
  }

  const newStudetnLine = {
    student: {
      name: '',
      count: 0,
      place: [0, 0]
    },
    save: saveEdit
  }

  //console.log(selected)
  return (
    <div className="App">
      <button onClick={getFruit}>Кто пойдет к доске?</button>
      <span onClick={() => setOpen(o => !o)} className={'editList'}>Редактировать список</span>
      <br/>
      {selected > -1 ? compute ? <span>{selectItem[selected]}</span> : selected : 'Желающий'}
      <hr/>
      Можно перемещать символ используя клавиши asdw на клавиатуре
      <div className={'classRoom'}>
        <table data-name={'klass'} cellPadding={0} cellSpacing={0}>
          {pole.map((line, indLine) => {
            return <tr key={indLine}>
              {line.map( (col, indCol) => {
                return <td key={indCol}>{col}</td>
              })}
            </tr>
          })}
        </table>
      </div>
      <hr/>
      <Draggable handle={'#kot'} onDrag={movee}>
        <div id={'kot'}>
          <img alt={'кот'} src={'/img/kot.jpg'} width={150}/>
        </div>
      </Draggable>

      <Modal show={open} fullscreen={true} onHide={() => setOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{width: '100%'}}>
            <Container fluid>
              <Row>
                <Col lg={9} md={9} xs={9}>
                  <Form.Select id={'idClass'} value={selectKlass} defaultValue={''} onChange={changeSelectEdit}
                               placeholder={'Выберите класс'} style={{width: 400}}>
                    <option value={''} disabled selected>Выберите класс</option>
                    {klassNames.map((item, index) => <option key={item} value={item}>{item}</option>)}
                  </Form.Select>
                </Col>
                <Col lg={3} md={3} xs={3}>
                  <Button>Добавить</Button>
                </Col>
              </Row>
            </Container>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col lg={7}>
              <table cellPadding={0} cellSpacing={0} style={{width: '100%'}}>
                <tr key={'headerRed'}>
                  <td style={{width: 250}}>ФИО ученика</td>
                  <td style={{width: 60}}>Вызывали</td>
                  <td style={{width: 100}}>Действия</td>
                </tr>
                {klassList.map(student => {
                  return <StudentLine selected={edit} student={student} click={clickEdit} save={saveEdit} />
                })}
                <tr key={'addStud'}>
                  <td style={{textAlign: 'right', paddingRight: 30, margin: 3}} colSpan={3}>
                    <Button onClick={() => setAddNewStudent(true)} size={'sm'}>Добавить ученика</Button>
                  </td>
                </tr>
                {addNewStudent && <EditLine { ...newStudetnLine } />}
              </table>
            </Col>
            <Col lg={5}>
              <table data-name={'klass'} cellSpacing={0} cellPadding={0}>
                {pole.map((line, index) => {
                  return <tr key={index}>
                    {line.map( (col, indCol) => {
                      return <td key={indCol}>{col}</td>
                    })}
                  </tr>
                })}
              </table>
            </Col>
          </Row>

        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
