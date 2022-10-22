import {Badge} from "react-bootstrap";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faTrashCan, faFloppyDisk, faBan} from '@fortawesome/free-solid-svg-icons'

/** @param {RenderLineTypeInEdit} data */
const ConstLine = (data) => {
  const check = data.places.filter((item) => item === data.student.place.toString());
  return <tr key={data.student.name} className={check.length > 1 ? 'lineError' : data.over === data.student.name ? 'hoveredEdit' : null}>
    <td style={{textAlign: 'left', }}>{data.student.name}</td>
    <td>{data.student.count}</td>
    <td>Р:{data.student.place[0] + 1} М:{data.student.place[1] + 1}</td>
    <td>
      <FontAwesomeIcon
        title={'Редактировать'}
        icon={faPenToSquare}
        style={{color: data.selected ? '#c0c0c0' : '#1F1AB2', paddingRight: 10, cursor: 'pointer'}}
        onClick={() => data.click(data.student.name)}
      />
      {' '}
      <FontAwesomeIcon
        title={'Удалить'}
        icon={faTrashCan}
        style={{color: '#ff3f3f', cursor: 'pointer'}}
        onClick={() => {
          if (window.confirm(`Вы уверены в удалении ученика ${data.student.name}`)) {
            data.delete(data.student.name);
          }
        }}
      />
    </td>
  </tr>
}

/** @param {RenderLineTypeInEdit} data */
const EditLine = (data) => {
  const [editData, setEditData] = useState({ ...data.student })
  /**
   * @param {React.MouseEvent} e
   */
  const change = (e) => {
    const edited = editData;
    if (e.currentTarget.getAttribute('data-idx') !== null) {
      edited.place[Number(e.currentTarget.getAttribute('data-idx'))] = Number(e.currentTarget.value) - 1;
    } else {
      edited[e.currentTarget.name] = e.currentTarget.value;
    }
    setEditData({ ...edited })
  }

  const click = () => {
    data.save({
      key: data.student.name,
      nameChange: editData.name,
      countChange: editData.count,
      placeChange: editData.place
    })
  }

  return (
    <tr key={data.student.name} className={data.over === data.student.name ? 'hoveredEdit' : null}>
      <td><input name={'name'} style={{width: '100%', margin: 0, paddingLeft: 7}} type={'text'} value={editData.name} onChange={change}/></td>
      <td><input name={'count'} style={{width: 50, margin: 0, paddingLeft: 5}} type={'number'} value={editData.count} onChange={change}/></td>
      <td>
        Р:<input style={{width: 40, margin: 0, paddingLeft: 3}} name={'place'} data-idx={0} type={"number"} max={15} min={1} step={1} value={Number(editData.place[0]) + 1} onChange={change} />{' '}
        М:<input style={{width: 40, margin: 0, paddingLeft: 3}} name={'place'} data-idx={1} type={"number"} max={6} min={1} step={1} value={Number(editData.place[1]) + 1} onChange={change} />
      </td>
      <td>
        <FontAwesomeIcon
          icon={faFloppyDisk}
          style={{color: '#198754', paddingRight: 10, cursor: 'pointer'}}
          onClick={() => {
            if (editData.name.length) {
              click()
            }
          }}
          title={'Сохранить'}
        />
            {' '}
            <FontAwesomeIcon
              icon={faBan}
              style={{color: '#ff3f3f', cursor: 'pointer'}}
              onClick={() => data.cancel(data.student.name ? 'stud': 'add')}
              title={'Отмена'}
            />
        {/*<Badge onClick={() => data.cancel(data.student.name ? 'stud': 'add')}>Нет</Badge>*/}
      </td>
    </tr>
  )
}

const StudentLine = (props) => {
  const [data, setData] = useState(props);
  useEffect(() => {
    setData({ ...props });
  }, [props]);

  return (
    <>
      {props.selected !== props.student.name ? <ConstLine {...data} /> : <EditLine {...data} />}
    </>
  )
}

export {StudentLine, EditLine}