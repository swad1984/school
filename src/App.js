import './App.css';
import './css/bootstrap.css';
import React, {useEffect, useState} from "react";
import Draggable from 'react-draggable'
import {Modal, Button, Container, Row, Col, Form, InputGroup} from 'react-bootstrap';
import {StudentLine, EditLine} from "./editStudent";
import {ClassRoom} from './classRoom'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUserPlus,
  faUserCheck,
  faCirclePlus,
  faPersonPraying,
  faCircleMinus,
  faFloppyDisk, faBan,
  faRectangleList
} from '@fortawesome/free-solid-svg-icons'

const pusto = '';
const placeholderText = `Введите сюда список учеников.
Примеры строк:
Иванов Дима,
Сидорова Маша:1.4,

`;
/** @param {StudentShowType} student
 * @param {string} klass
 * @return {number[][]}
 * */
function getPole(student, klass = '') {
  const places = [];
  for (let i in student) {
    const len = places.length;
    // Если ряд больше, чем есть в массиве, добавляем ряды
    if (student[i].place[0] > len - 1) {
      for (let j = 0; j <= student[i].place[0] - len; j++) {
        places.push([pusto, pusto, pusto, pusto, pusto, pusto]);
      }
    }
    places[student[i].place[0]][student[i].place[1]] = i;
  }
  return places;
}

/** @param {string} list */
function parseList(list) {
  let str;
  list.trim();
  str = list.replace(/[^а-яА-Яa-zA-z\d\s,:.]+/g, '');
  console.log(str);
  const parse = list.split(',').map((item) => {
    const stud = item.replace(/\n/g, '').split(':')
    return stud;
  });
  console.log(parse);
  return str;
}

function App() {
  const [blur, setBlur] = useState(0);
  const [data, setData] = useState(/** @type {KlassListType} */{});
  const [selected, setSelected] = useState(-1);
  const [pole, setPole] = useState([]);
  //const [coords, setCoords] = useState([0, 0]);

  const [compute, setCompute] = useState(true);
  const [open, setOpen] = useState(false);
  const [klassNames, setKlassNames] = useState(/** @type {string[]} */[])
  const [klassList, setKlassList] = useState(/** @type {StudentShowType[]} */[])
  const [klassListPlaces, setKlassListPlaces] = useState(/** @type {string[]} */[])
  const [selectKlass, setSelectKlass] = useState('')

  const [edit, setEdit] = useState('')
  const [addNewStudent, setAddNewStudent] = useState(false)

  const [addClk, setAddClk] = useState(false)
  const [klassNew, setKlassNew] = useState('')

  const [places, setPlaces] = useState([0, 0, 0, 0, 0, 0])

  const [partShow, setPartShow] = useState('');

  const [board, setBoard] = useState(/** @type {string[]} */[]);
  const [uniqOnly, setUniqOnly] = useState(true);
  const [label, setLabel] = useState('Желающий')
  const [comments, setComments] = useState('');

  const [addListEnable, setAddListEnable] = useState(false);
  const [addList, setAddList] = useState('')

  useEffect(() => {
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
          for (let i in getData) {
            klass = i;
            break;
          }
        }
        setSelectKlass(klass);
        setListClass(klass)
        setPole(getPole(getData[klass]));
      })
    }
  }, []);

  useEffect(() => {
    const klassName = [];
    for (let i in data) {
      klassName.push(i)
    }
    setKlassNames([ ...klassName ])
    if (selectKlass) {
      setListClass(selectKlass);
    }
    localStorage.setItem('myClasses', JSON.stringify(data));
  }, [data])

  function getRndNum(max) {
    return Math.floor(Math.random() * (max))
  }

  function getRandomNumber() {
    if (klassList.length) {
      if (klassList.length !== board.length) {
        if (uniqOnly) {
          const stud = [];
          const studIdx = [];
          klassList.forEach((item, index) => {
            if (!board.includes(item.name)) {
              stud.push(item.name);
              studIdx.push(index);
            }
          })
          const rnd = getRndNum(stud.length)
          board.push(stud[rnd]);
          return studIdx[rnd];
        } else {
          return getRndNum(klassList.length)
        }
      } else {
        setLabel('Учитель! Всех учеников вызвали!')
        return -2; // Все ученики вызваны
      }
    }
    setLabel('В классе никого нет!')
    return -3;// В классе нет учеников
  }

  const getRandomStudent = () => {
    if (blur) {
      let t = 2;
      setCompute(false);
      setSelected(3); // Для отображения счетчика
      let time = setInterval(() => {
        if (t > 0) {
          setSelected(t)
          t--;
        } else {
          const x = getRandomNumber();
          setSelected(x);
          setCompute(true)
          clearInterval(time);
        }
      }, 1000)
    } else {
      setSelected('В классе нет учеников')
      setLabel('Учитель единственный в классе!')
    }
  }

  function movee(e) {
    e.preventDefault();
  }

  /**
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
    setListClass(selectKlass)
  }, [selectKlass])

  useEffect(() => {
    setBlurs(klassList.length);
  }, [klassList])

  useEffect(() => {
    if (selected > -1 && compute) {
      const countChange = { ...data }
      countChange[selectKlass][klassList[selected].name].count++;
      setData( { ...countChange })
    }
  }, [selected])

  const setListClass = (klass) => {
    /**
     * @type {Object<string, StudentType>}
     */
    const list = data[klass]
    /**
     * @type {StudentShowType[]}
     */
    const student = [];
    for (let x in list) {
      student.push({
        name: x,
        count: list[x].count,
        place: list[x].place
      })
    }
    setPole(getPole({...list}))

    setKlassList(student.sort(sortByName));
    const placesList = [];
    student.forEach((item) => {
      placesList.push(item.place.toString());
    })
    setKlassListPlaces([ ...placesList ]);
    setBlurs(student.length);
  }

  const getKlassList = (klass) => {
    let cl = klass + '';
    setSelectKlass('');
    setSelectKlass(cl);
  }

  const changeSelectEdit = (e) => {
    if (data.hasOwnProperty(e.currentTarget.value)) {
      getKlassList(e.currentTarget.value);
      setSelected(-1);
      setCompute(true)
      setLabel('Желающий');
      setBoard([])
      localStorage.setItem('className', e.currentTarget.value);
    }
  }

  const saveEdit = (changeData) => {
    if (selectKlass) {
      const editData = {...data};
      delete editData[selectKlass][changeData.key];
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
    setEdit(name);
  }

  const delStudent = (name) => {
    if (selectKlass) {
      const editData = {...data};
      delete editData[selectKlass][name];
      setData({...editData});
      setListClass(selectKlass);
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

  const onOverPart = (name) => {
    setPartShow(name)
  }

  const onOverPartEnd = () => {
    setPartShow('')
  }

  const clickParta = /** @param {string} name */(name) => {
    if (name) {
      board.push(name);
      for (let i = 0; i <= klassList.length; i++) {
        if (klassList[i].name === name) {
          setSelected(i);
          break;
        }
      }
    }
  }

  const editStudent = () => {
    //console.log(3)
  }

  return (
    <div className="App">
      <Container fluid>
      <Row>
        <Col lg={11} sm={11} md={11} xl={11}>
          <div className={'otstup'}>
          <InputGroup className={'mb-3'}>
            <Form.Select onChange={() => setUniqOnly(e => !e)}>
              <option key={'unique'} value={'unique'} selected >Не вызывать повторно</option>
              <option key={'all'} value={'all'} >Вызывать повторно</option>
            </Form.Select>
            <Button
              variant={board.length ? 'info' : 'secondary'}
              onClick={() => setBoard([])}
              disabled={!board.length}
            >Сбросить список вызванных</Button>
          </InputGroup>

          </div>

        </Col>
        <Col style={{textAlign: 'end'}} lg={1} sm={1} md={1} xl={1}>
          <FontAwesomeIcon onClick={() => setOpen(o => !o)}  style={{color: '#565656', paddingTop: 13, cursor: 'pointer'}} icon={faGear} size={'lg'} />
        </Col>
      </Row>
      <Row style={{padding: 5}}>
        <Col lg={2} md={2} xs={2} sm={2}>
          <Form.Select id={'idClass'} value={selectKlass} defaultValue={''} onChange={changeSelectEdit}
                       placeholder={'Выберите класс'} style={{width: 70}}>
            {klassNames.map((item, index) => <option key={item} value={item}>{item}</option>)}
          </Form.Select>
        </Col>
        <Col lg={8} md={8} xs={8} sm={8}>
          <Button onClick={getRandomStudent} disabled={!compute} >
            <FontAwesomeIcon icon={faPersonPraying} style={{color: '#FFFFFF'}} />
            {' '}
            Кто пойдет к доске?
          </Button>
          <br/>
          {partShow ? <span style={{fontSize: '2em'}}>{partShow}</span> : selected > -1 ? compute ?
            <span style={{fontSize: '2em'}}>{klassList[selected].name}</span> :
            <span style={{fontSize: '2em'}}>{selected}</span> : <span style={{fontSize: '2em'}}>{label}</span>}
        </Col>
        <Col lg={2} md={2} xs={2} sm={2}>

        </Col>
      </Row>

      <hr/>

      <ClassRoom
        pole={pole}
        pusto={pusto}
        places={places}
        select={compute ? klassList[selected] : null}
        over={onOverPart}
        out={onOverPartEnd}
        boarder={board}
        click={clickParta}
      />

      <hr/>
      <Button
        variant="success"
        disabled={selected === -1}
        onClick={() => {
        setSelected(-1);
        setLabel('Желающий')
      }}>
        <FontAwesomeIcon icon={faUserCheck} style={{color: '#FFFFFF'}} />
        {' '}
        Ученик ответил у доски
      </Button>
      <Draggable handle={'#kot'} onDrag={movee} >
        <div id={'kot'} style={{position: "absolute"}}>
          <img alt={'кот'} src={'/img/kot.jpg'} width={150} style={{position: "absolute"}}/>
        </div>
      </Draggable>

      <Modal show={open} fullscreen={true} onHide={() => setOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{width: '100%'}}>
            <Container fluid>
              <Row>
                <Col lg={5} md={5} xs={5}>
                  <Form.Select
                    id={'idClass'}
                    value={selectKlass}
                    defaultValue={''}
                    onChange={changeSelectEdit}
                    placeholder={'Выберите класс'}
                    style={{width: 400, marginTop: 0}}>
                    <option value={''} disabled selected>Выберите класс</option>
                    {klassNames.map((item, index) => <option key={item} value={item}>{item}</option>)}
                  </Form.Select>
                </Col>
                <Col lg={7} md={7} xs={7}>
                  {!addClk ? <>
                    <div style={{display: 'flex', alignItems: 'center', height: 38}}>
                      <FontAwesomeIcon
                        icon={faCirclePlus}
                        style={{color: '#198754', width: 30, paddingLeft: 25, cursor: 'pointer'}}
                        onClick={() => {
                          setAddClk(true);
                          setComments('')
                        }}
                        onMouseOver={() => setComments('Добавить новый класс')}
                        onMouseLeave={() => setComments('')}
                      />
                      <FontAwesomeIcon
                        icon={faCircleMinus}
                        style={{color: '#ff3f3f', width: 30, paddingLeft: 25, cursor: 'pointer'}}
                        onMouseOver={() => setComments('Удалить этот класс')}
                        onMouseLeave={() => setComments('')}
                        onClick={() => {
                          if (window.confirm(`Вы уверены, что хотите удалить класс "${selectKlass}"`)) {
                            const list = { ...data };
                            delete list[selectKlass];

                            setData({ ...list});
                            let flg = true;
                            for (let i in list) {
                              setSelectKlass(i);
                              flg = false;
                              break;
                            }
                            if (flg) setSelectKlass('');
                          }
                          setComments('');

                        }}
                      />
                      <div style={{paddingLeft: 25, fontSize: '0.75em', color: '#535353'}}>{comments}</div>
                    </div>
                    </>
                    :
                    <div style={{display: 'flex', alignItems: 'center', height: 38}}>
                      <label htmlFor={'addNewClass'} style={{paddingLeft: 10, fontSize: '0.75em'}}>Новый класс:</label>
                      <input id={'addNewClass'} style={{width: 55, marginLeft: 4}} value={klassNew} onChange={chNewClass}/>

                      <FontAwesomeIcon
                        icon={faFloppyDisk}
                        style={{color: '#198754', marginLeft: 20, paddingRight: 10, cursor: 'pointer'}}
                        onClick={() => {
                          if (klassNew) {
                            const list = {...data};
                            if (!data.hasOwnProperty(klassNew)) {
                              list[klassNew] = {};
                            }
                            setData({...list});
                            setAddClk(false)
                            setSelectKlass(klassNew);
                            setKlassNew('');
                            setComments('');
                          }
                        }}
                        title={'Сохранить'}
                      />
                      {' '}
                      <FontAwesomeIcon
                        icon={faBan}
                        style={{color: '#ff3f3f', marginLeft: 10, cursor: 'pointer'}}
                        onClick={() => {
                          setAddClk(false);
                          setKlassNew('');
                          setComments('');
                        }}
                        title={'Отмена'}
                      />

                      <Button disabled style={{display: 'none'}}>Загрузить список</Button></div>}
                </Col>
              </Row>
            </Container>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col lg={6}>
              <table id={'stEdit'} cellPadding={0} cellSpacing={0} style={{width: 500}}>
                <tr key={'headerRed'}>
                  <td style={{width: 200, textAlign: 'left'}}>ФИО ученика</td>
                  <td style={{width: 75}}>Вызывали</td>
                  <td style={{width: 125}}>Место</td>
                  <td style={{width: 100}}>Действия</td>
                </tr>
                {klassList.map((student, index) => {
                  return <StudentLine key={index} selected={edit} student={student} click={clickEdit} save={saveEdit}
                                      cancel={cancelBtn} delete={delStudent} over={partShow} places={klassListPlaces}/>
                })}
                <tr key={'addStud'}>
                  <td style={{textAlign: 'right', paddingRight: 30, margin: 3, padding: 4}} colSpan={4}>
                    <Button size={'sm'} style={{marginRight: 25, display: !addListEnable ? 'inline-block' : 'none'}} onClick={() => setAddListEnable('true')}>
                      <FontAwesomeIcon icon={faRectangleList} style={{color: '#c2ffe0'}}/>
                      {' '}Добавить список учеников
                    </Button>
                    <Button style={{display: !addListEnable ? 'inline-block' : 'none'}} onClick={() => setAddNewStudent(true)} size={'sm'}>
                      <FontAwesomeIcon icon={faUserPlus} style={{color: '#c2ffe0'}} />
                      {' '}Добавить ученика
                    </Button>
                    {addListEnable && <>
                      <div style={{display: 'flex', width: '100%'}}>
                        <textarea
                          style={{width: '100%', height: 200, margin: 10}}
                          placeholder={placeholderText}
                          value={addList}
                          onChange={(e) => {
                            console.log(addList)
                            setAddList(e.currentTarget.value);
                          }}
                        /><br/>


                      </div>
                      <div style={{width: '100%', textAlign: 'left', fontSize: '0.85em', margin: 10}}>
                        Формат строки: <br />
                        Фамилия Имя[Отчество], - <i>Отчетсво опционально</i> <br/>
                        Фамилия Имя[Отчество]:ряд.место, - <i>Можно задать ученику сразу номер ряда и место</i><br/>
                        Список без спрец символов. Разделитель запятая. Если копируете из Word, пожалуйста, сначала вставьте скопированный текст в обычный блокнот, далее копируете текст из блокнота и вставляете сюда(это поможет убрать множество лишних служебных символов)
                      </div><br/>
                      <Button onClick={() => {
                        //setAddListEnable(false)
                        console.log('RET', parseList(addList));
                      }} size={'sm'}>Загрузить</Button>{' '}
                      <Button onClick={() => {
                        setAddListEnable(false);
                        setAddList('');
                      }} size={'sm'}>Отмена</Button>
                    </>
                    }
                  </td>
                </tr>
                {addNewStudent && <EditLine {...studentTemplate()} />}
              </table>
            </Col>
            <Col lg={6}><br/>
              <ClassRoom pole={pole} pusto={pusto} places={places} edit={editStudent} over={onOverPart} out={onOverPartEnd}/>
            </Col>
          </Row>

        </Modal.Body>
      </Modal>
      </Container>
    </div>
  );
}

export default App;
