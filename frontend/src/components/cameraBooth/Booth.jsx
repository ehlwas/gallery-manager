import IntroLogo from "./intrologo/IntroLogo"
import Camera from "./camera/Camera"

import { useState, useEffect } from "react"
import axios from 'axios'

function Booth() {
  useEffect(() => {
    refresh()
  }, [])

  // CAMERA AND PREVIEW COMPONENT FUNCTIONS



  // GALLERY COMPONENT FUNCTIONS
  const [data, setData] = useState([]);
  const [isLogoExit, setIsLogoExit] = useState(false)
    
  const deleteImage = async (id) => {
    await axios.delete(`http://localhost:8080/delete/${id}`)
      .then(response => {
        console.log(response)
        refresh()
      })
  }

  const refresh = () => {
    axios.get('http://localhost:8080/list')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <>
      <div>
        <IntroLogo isLogoExit={isLogoExit} setIsLogoExit={setIsLogoExit} />
        <Camera isLogoExit={isLogoExit} />
        {/* <Gallery data={data} deleteImage={deleteImage} /> */}
      </div>
    </>
  )
}

export default Booth;
