import {Badge} from "react-bootstrap";
import {useEffect, useState} from "react";

/** @param {RenderLineTypeInEdit} data */
const ConstLine = (data) => {
  //console.log('dataConst', data)
  return <tr key={data.student.name}>
    <td>{data.student.name}</td>
    <td>{data.student.count}</td>
    <td>Р:{data.student.place[0] + 1} М:{data.student.place[1] + 1}</td>
    <td><span style={{color: data.selected ? 'grey' : 'black'}}
              onClick={() => {
                data.click(data.student.name)
              }}>Edit</span>{' '}
      <span onClick={() => {

        if (window.confirm(`Вы уверены в удалении ученика ${data.student.name}`)) {
          data.delete(data.student.name);
        }
      }
      }>Del</span></td>
  </tr>
}

/** @param {RenderLineTypeInEdit} data */
const EditLine = (data) => {
  const [editData, setEditData] = useState({ ...data.student })
  //console.log('EditLine', data)
  /**
   *
   * @param {React.MouseEvent} e
   */
  const change = (e) => {
    const edited = editData;
    console.log(e)
    console.log(e.currentTarget.getAttribute('data-idx'));
    if (e.currentTarget.getAttribute('data-idx') !== null) {
      console.log('type', typeof e.currentTarget.getAttribute('data-idx'), e.currentTarget.value)
      edited.place[Number(e.currentTarget.getAttribute('data-idx'))] = Number(e.currentTarget.value) - 1;
      console.log('ITOG', edited.place);
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
    <tr key={data.student.name}>
      <td><input name={'name'} style={{width: '100%', margin: 0}} type={'text'} value={editData.name} onChange={change}/></td>
      <td><input name={'count'} style={{width: 50, margin: 0}} type={'number'} value={editData.count} onChange={change}/></td>
      <td>
        Р:<input style={{width: 40, margin: 0}} name={'place'} data-idx={0} type={"number"} max={15} min={1} step={1} value={Number(editData.place[0]) + 1} onChange={change} />{' '}
        М:<input style={{width: 40, margin: 0}} name={'place'} data-idx={1} type={"number"} max={6} min={1} step={1} value={Number(editData.place[1]) + 1} onChange={change} />
      </td>
      <td>
        <Badge onClick={() => {
          if (editData.name.length) {
            click()
          }
        }}>Да</Badge>{' '}
        <Badge onClick={() => data.cancel(data.student.name ? 'stud': 'add')}>Нет</Badge>
      </td>
    </tr>
  )
}

const StudentLine = (props) => {
  const [data, setData] = useState(props);
  //console.log('StudentLine props', props)
  //console.log('check', props.selected !== props.student.name)
  useEffect(() => {
    setData({ ...props });
  }, [props]);

  /*useEffect(() => {
    console.log('DATAINStudent', data);
  }, [data])*/

  return (
    <>
      {props.selected !== props.student.name ? <ConstLine {...data} /> : <EditLine {...data} />}
    </>
  )
}

export {StudentLine, EditLine}