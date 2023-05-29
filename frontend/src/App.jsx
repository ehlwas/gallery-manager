import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import DisplayImage from './components/displayimage/DisplayImage';
import Menu from './components/menu/Menu';
import Booth from './components/cameraBooth/Booth';

function App() {
  return (
    <div style={{ backgroundColor: "#121212", height: "100vh" }}>

      <Router>
        <Routes>
          <Route path='/' element={<Menu />} />
          <Route path='/camera' element={<Booth />} />
          <Route path='/images' element={<DisplayImage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
