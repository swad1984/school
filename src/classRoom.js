import {Col, Container, Row} from "react-bootstrap";
import React from "react";

const ClassRoom = ({pole, pusto, over, out, select, boarder, click, edit}) => {

  return <Container fluid>
    {pole.map((line, indLine) => {
      let npart = 0;
      return <Row key={indLine + 'L'}><Col className={'cl'} lg={12} xs={12} md={12} xl={12}>
        <div className={'partRazmer prohod'} key={indLine + 'b'}>{pusto}</div>
        {line.map((col, indCol) => {
          let checked = ''
          if (!col) {
            checked = ' partaNikogo'
          } else {
            if (boarder && boarder.includes(col)) {
              checked = ' partaBorder';
            }
          }

          let plLine = null;
          let plCol = null;

          if (select && select.place && select.place.length) {
            plLine = select.place[0];
            plCol = select.place[1];
            if (plLine === indLine && plCol === indCol) {
              checked += ' studentSelect'
            }
          }

          if (!npart) {
            npart++;
            return <div key={indCol} title={col} className={'partRazmer partaPusto' + checked} key={indCol}
                        onMouseOver={() => (over && col) ? over(col) : null} onMouseLeave={() => out ? out() : null}
            onClick={() => edit ? edit(indLine, indCol) : click ? click(col) : null}>
              <span className={'notShow'}>{col}</span></div>
          } else {
            npart = 0;
            return <>
              <div key={indCol} title={col} className={'partRazmer partaPusto' + checked} key={indCol}
                   onMouseOver={() => (over && col) ? over(col) : null} onMouseLeave={() => out ? out() : null}
                   onClick={() => edit ? edit(indLine, indCol) : click ? click(col) : null}
              >
                <span
                className={'notShow'}>{col}</span></div>
              {indCol < 5 && <div className={'partRazmer prohod'} key={indCol + 'p'}>{pusto}</div>}
            </>
          }
        })}
        <div className={'partRazmer prohod'} key={indLine + 'e'}>{pusto}</div>

      </Col></Row>
    })}
  </Container>
}

export {ClassRoom}