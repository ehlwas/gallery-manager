import IntroLogo from "./intrologo/IntroLogo"
import Camera from "./camera/Camera"

import { useState } from "react"
// import axios from 'axios'

function Booth() {
  // useEffect(() => {
  //   refresh()
  // }, [])

  // CAMERA AND PREVIEW COMPONENT FUNCTIONS



  // GALLERY COMPONENT FUNCTIONS
  // const [data, setData] = useState([]);
  const [isLogoExit, setIsLogoExit] = useState(false)
    
  // const deleteImage = async (id) => {
  //   await axios.delete(`https://gallery-manager.onrender.com/delete/${id}`)
  //     .then(response => {
  //       console.log(response)
  //       refresh()
  //     })
  // }

  // const refresh = () => {
  //   axios.get('https://gallery-manager.onrender.com/list')
  //     .then(response => {
  //       setData(response.data);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }

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
