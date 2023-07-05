import { Link } from 'react-router-dom';
import { BsCameraFill, BsImages } from 'react-icons/bs'

import './menu.css'

const Menu = () => {

    return (
        <>
            <div className="container menu-container text-center">
                <div className="d-flex justify-content-around align-items-center vh-100">
                    <div className="col-4 menu-col">
                        <Link to="/camera" className='text-decoration-none menu-select'>
                            <BsCameraFill className='menu-icons' />
                            <h2 className='menu-title'>Photobooth</h2>
                        </Link>
                    </div>
                    <div className="col-4 menu-col">
                        <Link to="/images" className='text-decoration-none menu-select'>
                            <BsImages className='menu-icons' />
                            <h2 className='menu-title'>Gallery</h2>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Menu