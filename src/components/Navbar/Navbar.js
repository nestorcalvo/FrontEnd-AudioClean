import { useContext, useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'

import { input, contact } from '../../portfolio'
import './Navbar.css'

const Navbar = () => {
  // const [{ themeName, toggleTheme }] = useContext(ThemeContext)
  const [showNavList, setShowNavList] = useState(false)

  const toggleNavList = () => setShowNavList(!showNavList)

  return (
    <nav className='center nav'>
      <ul
        style={{ display: showNavList ? 'flex' : null }}
        className='nav__list'
      >
        {input.length ? (
          <li className='nav__list-item'>
            <Link
              to='/'
              className='link link--nav'
              onClick={toggleNavList}
              style={{ textDecoration: 'none' }}
            >
              Home
            </Link>
          </li>
        ) : null}

        <li className='nav__list-item'>
          <Link
            to='/denoise'
            className='link link--nav'
            onClick={toggleNavList}
            style={{ textDecoration: 'none' }}
          >
            Denoise
          </Link>
        </li>

        {contact.email ? (
          <li className='nav__list-item'>
            <Link
              to='/'
              onClick={toggleNavList}
              className='link link--nav'
              style={{ textDecoration: 'none' }}
            >
              Contact
            </Link>
          </li>
        ) : null}
      </ul>

      {/* <button
        type='button'
        onClick={toggleTheme}
        className='btn btn--icon nav__theme'
        aria-label='toggle theme'
      >
        {themeName === 'dark' ? <WbSunnyRoundedIcon /> : <Brightness2Icon />}
      </button> */}

      <button
        type='button'
        onClick={toggleNavList}
        className='btn btn--icon nav__hamburger'
        aria-label='toggle navigation'
      >
        {showNavList ? <CloseIcon /> : <MenuIcon />}
      </button>
    </nav>
  )
}

export default Navbar
