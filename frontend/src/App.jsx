import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import GalleryFolder from './components/galleryfolder/GalleryFolder';
import DisplayImage from './components/displayimage/DisplayImage';

function App() {
  return (
    <div style={{ backgroundColor: "#121212", height: "100vh" }}>
      <Router>
        <Routes>
          {/* <Route path='/folder' element={<GalleryFolder />} /> */}
          <Route path='/' element={<DisplayImage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
