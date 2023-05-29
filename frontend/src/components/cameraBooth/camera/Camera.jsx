import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import Webcam from 'react-webcam'
import { AiOutlineCamera } from 'react-icons/ai'
import { BsHandThumbsDown, BsHandThumbsUp } from 'react-icons/bs'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import './camera.css'

const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
);
  

const Camera = (props) => {
    const webRef = useRef(null)
    const { isLogoExit } = props

    const MySwal = withReactContent(Swal)

    const [imgCon, setImgCon] = useState('')
    const [displayCount, setDisplayCount] = useState(false)
    const [countdown, setCountdown] = useState(5)

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user",
    };

    const countdownFunction = async () => {
        let count = 5
        while (count > 0) {
            await delay(1000)
            setCountdown(e => e - 1)
            count--
            console.log(count)
        }
    }

    const captureImg = async () => {
        setDisplayCount(true)
        await countdownFunction()

        setImgCon(webRef.current.getScreenshot({width: 1280, height: 720}));

        await delay(1000)
        setCountdown(5)
        setDisplayCount(false)
    }



    const [selectedCamera, setSelectedCamera] = useState('');

    const handleCameraChange = (event) => {
        const deviceId = event.target.value;
        setSelectedCamera(deviceId);
    };

    const getVideoInputDevices = async () => {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputDevices = devices.filter(device => device.kind === 'videoinput');
          return videoInputDevices;
        } catch (error) {
          console.error('Error enumerating video input devices:', error);
          return [];
        }
    };

    const [videoInputDevices, setVideoInputDevices] = useState([]);

    useEffect(() => {
    getVideoInputDevices().then(devices => {
        setVideoInputDevices(devices);
        setSelectedCamera(devices[0]?.deviceId || ''); // Set the first camera as the default selected camera
    });
    }, []);

    const base64ToBlob = (base64String) => {
        const byteCharacters = atob(base64String.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: "image/png" }); 
    };
  
    const imageSubmit = async () => {
        MySwal.showLoading()

        const base64String = imgCon;
        const blob = await base64ToBlob(base64String);
    
        const formData = new FormData();
        formData.append("file", blob, "image.png");
    
        await axios.post('http://localhost:8080/upload', formData)
        .then(response => {
            console.log(response);
            setImgCon(null)
        })

        MySwal.fire({
            title: 'Success',
            // text: 'Do you want to continue',
            icon: 'success',
            confirmButtonText: 'OK'
        })
    }

    return (
        <>
            <div className='camera-container'>
                <div className="camera">
                <Link to="/" className='btn btn-primary'>Menu</Link>
                {/* <select onChange={handleCameraChange} value={selectedCamera}>
                    {videoInputDevices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                        {device.label}
                        </option>
                    ))}
                </select> */}

                    {imgCon ? 
                    <>
                        <div className='text-center'>
                            <img className='webcam' name="Files" src={imgCon} alt='prev-img' />
                            <div>
                                <button className='btn btn-secondary mx-1 mt-3' onClick={() => setImgCon(null)}><BsHandThumbsDown /></button>
                                <button className='btn btn-primary mx-1 mt-3' onClick={() => imageSubmit()}><BsHandThumbsUp /></button>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        {isLogoExit && 
                        <div className='text-center'>
                            {displayCount && <h2 className='countdown-text'>{countdown}</h2>}
                            <Webcam
                                className='webcam'
                                ref={webRef}
                                videoSource={selectedCamera}
                                // videoConstraints={videoConstraints}
                                height={720}
                                width={1280}
                            />
                            <div>
                                <button className='btn btn-primary mt-3' onClick={() => captureImg()}><AiOutlineCamera /></button>
                            </div>
                        </div>
                        }
                    </>}
                </div>
            </div>
        </>
    )
}

export default Camera;