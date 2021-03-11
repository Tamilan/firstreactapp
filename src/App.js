import 'bootstrap/dist/css/bootstrap.min.css';

import Menu from './components/Menu.js';

import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_CENTER,
  timeout: 3000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}

require('dotenv').config();

function App() {
  return (
    <AlertProvider template={AlertTemplate} {...options}>
    <div className="App">
      <div className="container-fluid">
        {/* <Row>
          <Col>1 of 1</Col>
        </Row> */}
      </div>
      <Menu />
           
      

    </div>
    </AlertProvider>
  );
}

export default App;
