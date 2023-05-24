import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import emailjs from '@emailjs/browser';
// import ReactWhatsapp from 'react-whatsapp';
import QRCode from 'qrcode'
import { HiOutlineMail } from 'react-icons/hi';
import { BsQrCode, BsWhatsapp } from 'react-icons/bs';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import './displayimageTest.css'

const DisplayImage = () => {
    const [imageList, setImageList] = useState([])

    const [imgId, setImgId] = useState('')
    
    // const [nextBtn, setNextBtn] = useState(true);

    const [nextPageToken, setNextPageToken] = useState('blank')
    
    const MySwal = withReactContent(Swal)

    useEffect(() => {
        axios.get(`https://gallery-manager.onrender.com/list/`)
        .then(response => {
            setImageList(response.data.files);
            setNextPageToken(response.data.nextPageToken)
        })
        .catch(error => {
            console.error(error);
        });
    }, [])

    const refresh = async () => {
        await axios.get(`https://gallery-manager.onrender.com/list/${nextPageToken}`)
        .then(response => {
            // if (response.data.files.length >= 0 || response.data.files.length === 10) {
            //     setNextBtn(false)
            //     return
            // }
            setNextPageToken(response.data.nextPageToken)
            
            const newFiles = [...imageList, ...response.data.files];
            setImageList(newFiles);
            setNextPageToken(response.data.nextPageToken)
            // setNextBtn(true)
        })
        .catch(error => {
            console.error(error);
        });
    }

    const zoomImg = (id) => {
        if (imgId) {
            setImgId('')
        } else {
            setImgId(id)
            setUrl(`https://drive.google.com/uc?export=view&id=${id}`)
        }
    }

    const hidePreview = () => {
        setImgId(null)
        setShowForm(null)
    }

    const uploadImg = async (e) => {
        e.preventDefault();
        
        const formElem = document.querySelector('form');

        const formData = new FormData(formElem);

        await axios.post('https://gallery-manager.onrender.com/upload', formData)
        .then(response => {
            console.log(response.data);

            const newFiles = [...response.data, ...imageList]

            setImageList(newFiles)
        })
    }

    const deleteImage = async (id) => {
        await axios.delete(`https://gallery-manager.onrender.com/delete/${id}`)
            .then(response => {
                console.log(response)
                const newFiles = imageList.filter(item => item.id !== id)

                setImageList(newFiles)
            })
    }

    const form = useRef()
    const [number, setNumber] = useState();

    const emailSend = async (e) => {
        e.preventDefault();
        MySwal.showLoading()
        
        await emailjs.sendForm('service_z1x7ecq', 'template_gghlu6c', form.current, 'WB95anGtkzl8T5qGY')

        MySwal.fire({
            title: 'Success',
            // text: 'Do you want to continue',
            icon: 'success',
            confirmButtonText: 'OK'
        })
    }

    const [showForm, setShowForm] = useState()

    const showFormBtn = (e, formType) => {
        e.stopPropagation()

        if (formType === 'gmail') {
            setShowForm(formType)
        } else if (formType === 'qr-code') {
            setUrl(`https://drive.google.com/uc?export=view&id=${imgId}`)
            setShowForm(formType)
            GenerateQRCode()
        }
        else if (formType === 'number') {
            setShowForm(formType)
        }
    }

    const formDisplay = () => {
        if (showForm === 'gmail') {
            return (
                <form ref={form} onSubmit={emailSend} className='image-preview-form' onClick={(e) => e.stopPropagation()}>
                    <input type="hidden" name='message' value={url}/>
                    <input className='form-control' type="email" name='email' placeholder='Your Email' required />
                    <button className='btn btn-primary' type='submit'>Send</button>
                </form>
            )
        }
        else if (showForm === 'qr-code') {
            return (
                <>
                    {qr && <img src={qr} alt='qrcode' width="250px" />}
                    {/* <a href={qr} download="qrcode.png">Download</a> */}
                </>
            )
        }
        else if (showForm === 'number') {
            return (
                <div className='image-preview-form' onClick={(e) => e.stopPropagation()}>
                    <input className='form-control' type="number" name='number' placeholder='Your Number' onChange={(e) => setNumber(e.target.value)} required />
                    <button className='btn btn-primary' onClick={() => textSample()}>Send Text</button>
                </div>
            )
        }
    }

    const [url, setUrl] = useState('')
	const [qr, setQr] = useState('')

	const GenerateQRCode = () => {
		QRCode.toDataURL(url, {
			width: 800,
			margin: 2,
			color: {
				dark: '#000000',
				light: '#ffffff'
			}
		}, (err, url) => {
			if (err) return console.error(err)

			console.log(url)
			setQr(url)
		})
	}

    const textSample = () => {
        // const phoneNumber = '971582813404'; // Replace with recipient's phone number
        const message = `Here's your image: ${url}`; // Replace with your message

        const urlHandle = `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`;
        window.open(urlHandle);

        // const config = {
        //     headers: {
        //         'Authorization': 'Bearer EAACVQQ36pvkBAP5Vk68yHQflR8KnNjbmghKNhKVQ2iaixqCvN93PYXuSYD32i7b4ZBwOI09JbjWGtBdFOVlmIdPnFugNQde17dUP8SKqno1derqvPmF2nOZAyq5asCsGTvxquAnODpP4gW092qkK4ZCZBt9uj5AF2ZBZBtvPmY1urwJg4HMYuoRJYyZCVXzUgLETz2tw6fHHQZDZD',
        //         'Content-Type': 'application/json'
        //     }
        // }

        // const data = {
        //     "messaging_product": "whatsapp",
        //     "to": "971582813404",
        //     "type": "text",
        //     "text": {
        //         "body": "your-text-message-content"
        //     }
        // }

        // const url = 'https://graph.facebook.com/v16.0/103359856108317/messages'

        // axios.post(url, data, config)
        //     .then(response => {
        //         console.log(response)
        //     })
        //     .catch(err => console.log(err))
    }

    const [isThereFile, setIsThereFile] = useState(false)

    const uploadFile = () => {
        const inputFile = document.getElementById('input-file')

        if (inputFile.files.length <= 0)
            setIsThereFile(false)
        else
            setIsThereFile(true)
    }

    const [lockScreen, setLockScreen] = useState(false)

    // const lockScreenFunction = () => {
    //     setLockScreen
    // }

    return (
        <div className='display-image-container'>
            {lockScreen && <div className='full-preview position-fixed lock-screen' onClick={() => setLockScreen(prev => !prev)}>
                <div className='text-center'>
                    <img src={'https://drive.google.com/uc?export=view&id=1H2cVnBthwZD5ZsFZ4U8qzDAe8PWCG-VH'} alt={imgId} className='image-preview'/>
                </div>
            </div>}
            {imgId && <div className='full-preview position-fixed' onClick={() => hidePreview('')}>
                <div className='text-center my-5'>
                    <img src={'https://drive.google.com/uc?export=view&id='+imgId} alt={imgId} className='image-preview' width='800px'/>
                    <div className='send-option-icons my-3'>
                        <button className='btn btn-info' onClick={(e) => showFormBtn(e, 'gmail')}><HiOutlineMail /></button>
                        <button className='btn btn-info mx-3' onClick={(e) => showFormBtn(e, 'qr-code')}><BsQrCode /></button>
                        <button className='btn btn-info' onClick={(e) => showFormBtn(e, 'number')}><BsWhatsapp /></button>
                    </div>
                    {showForm && formDisplay()}
                </div>
            </div>}
            <form onSubmit={uploadImg}>
                <input className='input-file' id='input-file' type="file" name="Files" onChange={uploadFile} required multiple />
                {isThereFile && <button className='btn btn-sm btn-primary' type="submit" disabled={!isThereFile}>Submit</button>}
            </form>
            <button className='btn btn-info position-absolute end-0' onClick={() => setLockScreen(prev => !prev)}>Lock</button>
            <div className='col d-flex justify-content-center align-items-center flex-wrap image-card-container'>
                {imageList.map(item => (
                    <p key={item.id} className='position-relative mx-3 image-card'>
                        <button className='btn btn-info btn-sm position-absolute end-0' onClick={() => deleteImage(item.id)}>X</button>
                        <img src={'https://drive.google.com/uc?export=view&id='+item.id} alt={item.name} onClick={() => zoomImg(item.id)} width='230px'/>
                    </p>
                ))}
            </div>
            <div className='text-center'>
                <button className='btn btn-primary' onClick={() => refresh()}>Load More...</button>
            </div>
        </div>
    )
}

export default DisplayImage