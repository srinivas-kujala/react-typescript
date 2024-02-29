import { Link } from 'react-router-dom'
import Logo from '../../assets/images/react.svg'

function NavBar() {

    const contents =
        <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
            <div className="container-fluid">
                <div className="navbar-brand">
                    <img src={Logo} alt="..." height={50} />
                    <Link to={'/'} className="nav-link text-dark"></Link>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                    <ul className="navbar-nav flex-grow-1">
                        <li className="nav-item">
                            <Link to={'/'} className="nav-link text-dark">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/Weather'} className="nav-link text-dark">Weather</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/Privacy'} className="nav-link text-dark">Privacy</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>;

    return (
        <header>
            {contents}
        </header>
    );
}

export default NavBar;