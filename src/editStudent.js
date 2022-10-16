import {Badge} from "react-bootstrap";
import {useEffect, useState} from "react";

/** @param {RenderLineTypeInEdit} data */
const ConstLine = (data) => {
  console.log('dataConst', data)
  return <tr key={data.student.name}>
    <td>{data.student.name}</td>
    <td>{data.student.count}</td>
    <td><span style={{color: data.selected ? 'grey' : 'black'}}
              onClick={() => {
                console.log('click', data.selected);
                /*if (data.selected === '') {
                  console.log('INCLICK', data.student.name)
                  data.click(data.student.name)
                }*/
                data.click(data.student.name)
              }}>Edit</span>{' '}
      <span>Del</span></td>
  </tr>
}

/** @param {RenderLineTypeInEdit} data */
const EditLine = (data) => {
  const [editData, setEditData] = useState({ ...data.student })
  console.log('EditLine', data)

  const change = (e) => {
    const edited = editData;
    edited[e.currentTarget.name] = e.currentTarget.value;
    console.log('EDITED', edited, e.currentTarget.name, e.currentTarget.value)
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
      <td><input name={'count'} style={{width: 50, margin: 0}} width={50} type={'number'} value={editData.count} onChange={change}/></td>
      <td>
        <Badge onClick={click}>Да</Badge>{' '}
        <Badge onClick={() => data.click('')}>Нет</Badge>
      </td>
    </tr>
  )
}

const StudentLine = (props) => {
  const [data, setData] = useState(props);
  console.log('StudentLine props', props)
  console.log('check', props.selected !== props.student.name)
  useEffect(() => {
    setData({ ...props });
  }, [props]);

  useEffect(() => {
    console.log('DATAINStudent', data);
  }, [data])

  return (
    <>
      {props.selected !== props.student.name ? <ConstLine {...data} /> : <EditLine {...data} />}
    </>
  )
}

export {StudentLine, EditLine}