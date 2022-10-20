import './App.css';
import './css/bootstrap.css';
import React, {useEffect, useState} from "react";
import Draggable from 'react-draggable'
import {Modal, Button, Container, Row, Col, Form} from 'react-bootstrap';
import {StudentLine, EditLine} from "./editStudent";
import {ClassRoom} from './classRoom'
import {layer} from "@fortawesome/fontawesome-svg-core";

//import {} from '@fortawesome/fontawesome-svg-core'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const rows = 8; // Количество рядов
const cols = 6; // Количество столбцов

const symbol = 'X';
const pusto = '';

/** @param {StudentShowType} student
 * @param {string} klass
 * @return {number[][]}
 * */
function getPole(student, klass = '') {
  const places = [];
  console.warn('GET_POLE', student, klass);
  console.trace()
  //student.forEach(/** @param {StudentShowType} stud */(stud) => {
  for (let i in student) {
    const len = places.length;
    console.log('KEY', i, student[i])
    console.log('CHECK', student[i].place, student[i].place[0], places.length)
    // Если ряд больше, чем есть в массиве, добавляем ряды
    if (student[i].place[0] > len - 1) {
      console.log('DOINS', student[i].place[0] - len)
      for (let j = 0; j <= student[i].place[0] - len; j++) {
        console.log('BEG_INS', j, student[i].place[0] - len)
        places.push([pusto, pusto, pusto, pusto, pusto, pusto]);
      }
    }
    console.log('POLE_F', places)
    places[student[i].place[0]][student[i].place[1]] = i;
    console.log(`STUDENT ${i} SIT on ${student[i].place[0]} ${student[i].place[1]}`)
  }
  console.log('RETURNED POLE', places)
  return places;
}

function App() {
  const [blur, setBlur] = useState(0);
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

  const [addClk, setAddClk] = useState(false)
  const [klassNew, setKlassNew] = useState('')

  const [places, setPlaces] = useState([0, 0, 0, 0, 0, 0])

  const [partShow, setPartShow] = useState('');

  useEffect(() => {

    //document.removeEventListener('keypress', clicker);
    //document.addEventListener('keypress', clicker);
    let getData = {}
    let klass = '';
    try {
      getData = JSON.parse(localStorage.getItem('myClasses'));
      const key = Object.keys(getData);
      if (!key.length) {
        throw new Error('no data')
        //return new Error('no data')
      }
      klass = localStorage.getItem('className')
      if (!klass) {
        console.log('GET_CLASS', getData[0], getData)
        for (let i in getData) {
          klass = i;
          break;
        }
      }
      setData(getData);
      setSelectKlass(klass);
      setListClass(klass);
      console.log('DO_WORK_1', klass, getData);
      setPole(getPole(getData[klass]));
    } catch (e) {
      const x = fetch('klass.json');
      x.then(async (res) => {
        return await res.json();
      }).then(/** @param {KlassListType} res */res => {
        getData = res;
        setData(res);
        klass = localStorage.getItem('className');
        if (!klass) {
          console.log('GET_CLASS', getData[0], getData)
          for (let i in getData) {
            klass = i;
            break;
          }
        }
        setSelectKlass(klass);
        setListClass(klass)
        console.log('DO_WORK_2', klass, getData);
        setPole(getPole(getData[klass]));
      })
    }

    /*const area = pole;
    for (let row = 0; row < rows; row++) {
      area[row] = [];
      for (let col = 0; col < cols; col++) {
        area[row][col] = pusto;
      }
    }
    area[0][0] = symbol; // Расположить X в верхнем левом углу*/

    // хрень какая то

    /*if (klass && getData.hasOwnProperty(klass)) {
      setPole(getPole(getData[klass]));
    } else {
      setPole([pusto, pusto, pusto, pusto, pusto, pusto]);
    }*/
  }, []);

  useEffect(() => {
    const klassName = [];
    for (let i in data) {
      klassName.push(i)
    }
    setKlassNames(klassName);
    localStorage.setItem('myClasses', JSON.stringify(data));
  }, [data])

  /*function getFruit() {
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

  }*/

  const getRandomStudent = () => {
    if (blur) {
      console.log('blur', blur)
      let variant = Math.random() * 100 * Math.random();
      let rndInt;
      let rnd;
      rndInt = setInterval(() => {
        setTimeout(() => {
          rnd = Math.random() * 100 * Math.random();
        }, Math.random() * 100 * Math.random());

      }, Math.random() * 100 * Math.random())

      let t = 2;
      setCompute(false);
      setSelected(3); // Для отображения счетчика
      let time = setInterval(() => {
        if (t > 0) {
          setSelected(t)
          t--;
        } else {
          const x = Math.round((variant/blur + rnd/blur)/2 + 0.5 - 1);
          setSelected(x);
          setCompute(true)

          console.log('RND_RESULT', x, variant, rnd, blur)
          console.log('RND_RESULT 1',
            variant/blur,
            rnd/blur,
            variant/blur * rnd/blur,
          (variant/blur * rnd/blur) / 2,
            ((variant/blur * rnd/blur) / 2) + 0.4
        )
          clearInterval(time);
          clearInterval(rndInt)
        }
      }, 1000)
    } else {
      setSelected('В классе нет учеников')
    }

  }

  const clicker = (e) => {
    //move(e.code);
  }

  const move = (vector) => {
    const area = pole;
    const coordsThis = coords;
    //console.log('in', vector)
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

  /*useEffect(() => {
    console.log('EditChange', edit)
  }, [edit])*/

  /**
   *
   * @param {StudentShowType} a
   * @param {StudentShowType} b
   */
  const sortByName = (a, b) => {
    if (a.name > b.name) return 1
    if (a.name < b.name) return -1;
    return 0;
  }

  const setBlurs = (n) => {
    if (n) {
      setBlur(100 / n);
    } else {
      if (klassList.length) {
        setBlur(100 / klassList.length);
      } else {
        setBlur(0);
      }
    }

  }

  useEffect(() => {
    console.log('selected', selectKlass, klassList)
    setListClass(selectKlass)

  }, [selectKlass])

  useEffect(() => {
    console.log('klasssss', klassList)
    setBlurs(klassList.length);
  }, [klassList])

  const setListClass = (klass) => {
    console.log('setList', klass)
    const list = data[klass]
    const student = [];
    for (let x in list) {
      student.push({
        name: x,
        count: list[x].count,
        place: list[x].place
      })
    }
    console.log('UPD_CLASS', list, klass)
    setPole(getPole({...list}))

    setKlassList(student.sort(sortByName));
    setBlurs(student.length);
  }

  const getKlassList = (klass) => {
    console.log('2', klass)
    let cl = klass + '';
    setSelectKlass('');
    setSelectKlass(cl);
  }

  const changeSelectEdit = (e) => {
    if (data.hasOwnProperty(e.currentTarget.value)) {
      getKlassList(e.currentTarget.value);
      setSelected(-1);
      setCompute(false)
      localStorage.setItem('className', e.currentTarget.value);
    }
  }

  const saveEdit = (changeData) => {
    console.log(selectKlass, changeData);
    if (selectKlass) {
      const editData = {...data};
      delete editData[selectKlass][changeData.key];
      console.log('SAVE', changeData);
      editData[selectKlass][changeData.nameChange] = {
        count: changeData.countChange,
        place: changeData.placeChange
      }
      setData({...editData});
      setEdit('');
      getKlassList(selectKlass);
      setListClass(selectKlass);
      setAddNewStudent(false);
    }
  }

  const cancelBtn = (type) => {
    if (type === 'stud') {
      setEdit('');
    } else {
      setAddNewStudent(false)
    }

  }

  /** @param {string} name */
  const clickEdit = (name) => {
    //console.log('clickEdit', name);
    setEdit(name);
  }

  const delStudent = (name) => {
    if (selectKlass) {
      const editData = {...data};
      delete editData[selectKlass][name];
      setData({...editData});
      getKlassList(selectKlass);
    }
  }

  function studentTemplate() {
    return {
      student: {
        name: '',
        count: 0,
        place: [0, 0]
      },
      save: saveEdit,
      cancel: cancelBtn
    }
  }

  const chNewClass = (e) => {
    setKlassNew(e.currentTarget.value);
  }
  //console.log(selected)

  const onOverPart = (name) => {
    setPartShow(name)
  }

  const onOverPartEnd = () => {
    setPartShow('')
  }
  return (
    <div className="App">
      <Row style={{padding: 5}}>
        <Col lg={2} md={2} xs={2} sm={2}>
          <Form.Select id={'idClass'} value={selectKlass} defaultValue={''} onChange={changeSelectEdit}
                       placeholder={'Выберите класс'} style={{width: 70}}>
            {klassNames.map((item, index) => <option key={item} value={item}>{item}</option>)}
          </Form.Select>
        </Col>
        <Col lg={8} md={8} xs={8} sm={8}>
          <button onClick={getRandomStudent}>Кто пойдет к доске?</button>
          <span onClick={() => setOpen(o => !o)} className={'editList'}>Изменить</span>
          <br/>
          {partShow ? <span style={{fontSize: '2em'}}>{partShow}</span> : selected > -1 ? compute ?
            <span style={{fontSize: '2em'}}>{klassList[selected].name}</span> :
            <span style={{fontSize: '2em'}}>{selected}</span> : <span style={{fontSize: '2em'}}>Желающий</span>}
        </Col>
        <Col lg={2} md={2} xs={2} sm={2}/>
      </Row>

      <hr/>

      <ClassRoom pole={pole} pusto={pusto} places={places} select={compute ? klassList[selected] : null} over={onOverPart} out={onOverPartEnd}/>

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
                  {!addClk ? <Button onClick={() => setAddClk(true)}>Добавить</Button> :
                    <div><input style={{width: 50}} value={klassNew} onChange={chNewClass}/>
                      <Button onClick={() => {
                        const list = {...data};
                        if (!data.hasOwnProperty(klassNew) && klassNew) {
                          list[klassNew] = {};
                        }
                        setData({...list});
                        setAddClk(false)
                        setSelectKlass(klassNew);
                        setKlassNew('');
                      }
                      }>Сохранить</Button></div>}
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
                  <td style={{width: 100}}>Место</td>
                  <td style={{width: 100}}>Действия</td>
                </tr>
                {klassList.map(student => {
                  return <StudentLine selected={edit} student={student} click={clickEdit} save={saveEdit}
                                      cancel={cancelBtn} delete={delStudent}/>
                })}
                <tr key={'addStud'}>
                  <td style={{textAlign: 'right', paddingRight: 30, margin: 3, padding: 4}} colSpan={4}>
                    <Button onClick={() => setAddNewStudent(true)} size={'sm'}>Добавить ученика</Button>
                  </td>
                </tr>
                {addNewStudent && <EditLine {...studentTemplate()} />}
              </table>
            </Col>
            <Col lg={5}><br/>
              <ClassRoom pole={pole} pusto={pusto} places={places}/>
            </Col>
          </Row>

        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
