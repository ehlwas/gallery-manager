import { Link } from 'react-router-dom';
import { BsCameraFill, BsImages } from 'react-icons/bs'

import './menu.css'

const Menu = () => {

    return (
        <>
            <div className="container text-center">
                <div class="d-flex justify-content-around align-items-center vh-100">
                    <div class="col-4">
                        <Link to="/camera">
                            <BsCameraFill className='menu-icons' />
                            <h2>Photobooth</h2>
                        </Link>
                    </div>
                    <div class="col-4">
                        <Link to="/images">
                            <BsImages className='menu-icons' />
                            <h2>Gallery</h2>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Menu