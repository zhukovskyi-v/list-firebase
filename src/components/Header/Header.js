import React from 'react'
import {ModalForm} from '../ModalForm/ModalForm'
import {NavLink} from "react-router-dom";
import './header.css'

export const Header = () => {
    return (
        <header className="header">
            <NavLink className='header-link' to={'/'}>Product List</NavLink>
            <ModalForm/>
        </header>
    )
}
