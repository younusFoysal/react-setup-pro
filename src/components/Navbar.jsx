import React, {useEffect, useState} from 'react';
import "./loader.css"
import {Link, useLocation} from "react-router-dom";

const Navbar = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    console.log(location.pathname)

    useEffect(() => {
        fetch('/links.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="loader mt-8">Nav Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const handleDownloadClient = () => {

        const fileUrl = 'client.zip';
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', true);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadServer = () => {

        const fileUrl = 'server.zip';
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', true);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };




    return (
        <nav className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <button tabIndex={0} className="btn btn-ghost lg:hidden" aria-label="Menu">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </button>
                    <ul tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">


                        <li>
                            <details>
                                <summary>All AI</summary>
                                <ul className="p-2">
                                    {
                                        data.AllAI.map(link => <li key={link.url}>
                                            <a
                                                className="w-48"
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {link.title}
                                            </a>
                                        </li>)
                                    }
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary>Dev</summary>
                                <ul className="p-2">
                                    {
                                        data.Dev.map(link => <li key={link.url}>
                                            <a
                                                className="w-48"
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {link.title}
                                            </a>
                                        </li>)
                                    }
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary>Documentations</summary>
                                <ul className="p-2">
                                    {
                                        data.Documentations.map(link => <li key={link.url}>
                                            <a
                                                className="w-48"
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {link.title}
                                            </a>
                                        </li>)
                                    }
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary>Deploy</summary>
                                <ul className="p-2">
                                    {
                                        data.Deploy.map(link => <li key={link.url}>
                                            <a
                                                className="w-48"
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {link.title}
                                            </a>
                                        </li>)
                                    }
                                </ul>
                            </details>
                        </li>

                        <li>
                            <details>
                                <summary>CSS</summary>
                                <ul className="p-2">
                                    {
                                        data.CSS.map(link => <li key={link.url}>
                                            <a
                                                className="w-48"
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {link.title}
                                            </a>
                                        </li>)
                                    }
                                </ul>
                            </details>
                        </li>

                        <li>
                            <details>
                                <summary>Icons</summary>
                                <ul className="p-2">
                                    {
                                        data.Icons.map(link => <li key={link.url}>
                                            <a
                                                className="w-48"
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {link.title}
                                            </a>
                                        </li>)
                                    }
                                </ul>
                            </details>
                        </li>

                        <li>
                            <details>
                                <summary>APIs</summary>
                                <ul className="p-2">
                                    {
                                        data.APIs.map(link => <li key={link.url}>
                                            <a
                                                className="w-48"
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {link.title}
                                            </a>
                                        </li>)
                                    }
                                </ul>
                            </details>
                        </li>

                        <li>
                            <details>
                                <summary>Others</summary>
                                <ul className="p-2">
                                    {
                                        data.Others.map(link => <li key={link.url}>
                                            <a
                                                className="w-48"
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {link.title}
                                            </a>
                                        </li>)
                                    }
                                </ul>
                            </details>
                        </li>


                    </ul>
                </div>
                <a className="btn btn-ghost text-xl" href="/">React Setup Pro</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">


                    <li>
                        <details>
                            <summary>All AI</summary>
                            <ul className="p-2">
                                {
                                    data.AllAI.map(link => <li key={link.url}>
                                        <a
                                            className="w-48"
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {link.title}
                                        </a>
                                    </li>)
                                }
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary>Dev</summary>
                            <ul className="p-2">
                                {
                                    data.Dev.map(link => <li key={link.url}>
                                        <a
                                            className="w-48"
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {link.title}
                                        </a>
                                    </li>)
                                }
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary>Documentations</summary>
                            <ul className="p-2">
                                {
                                    data.Documentations.map(link => <li key={link.url}>
                                        <a
                                            className="w-48"
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {link.title}
                                        </a>
                                    </li>)
                                }
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary>Deploy</summary>
                            <ul className="p-2">
                                {
                                    data.Deploy.map(link => <li key={link.url}>
                                        <a
                                            className="w-48"
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {link.title}
                                        </a>
                                    </li>)
                                }
                            </ul>
                        </details>
                    </li>

                    <li>
                        <details>
                            <summary>CSS</summary>
                            <ul className="p-2">
                                {
                                    data.CSS.map(link => <li key={link.url}>
                                        <a
                                            className="w-48"
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {link.title}
                                        </a>
                                    </li>)
                                }
                            </ul>
                        </details>
                    </li>

                    <li>
                        <details>
                            <summary>Icons</summary>
                            <ul className="p-2">
                                {
                                    data.Icons.map(link => <li key={link.url}>
                                        <a
                                            className="w-48"
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {link.title}
                                        </a>
                                    </li>)
                                }
                            </ul>
                        </details>
                    </li>

                    <li>
                        <details>
                            <summary>APIs</summary>
                            <ul className="p-2">
                                {
                                    data.APIs.map(link => <li key={link.url}>
                                        <a
                                            className="w-48"
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {link.title}
                                        </a>
                                    </li>)
                                }
                            </ul>
                        </details>
                    </li>

                    <li>
                        <details>
                            <summary>Others</summary>
                            <ul className="p-2">
                                {
                                    data.Others.map(link => <li key={link.url}>
                                        <a
                                            className="w-48"
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                        {link.title}
                                        </a>
                                    </li>)
                                }
                            </ul>
                        </details>
                    </li>



                </ul>
            </div>
            <div className="navbar-end">

                    {
                        location.pathname === "/" ? <>
                                <div className="tooltip tooltip-bottom" data-tip="Use 7zip for Extract">
                                    <button
                                        onClick={handleDownloadServer}
                                        className="btn mr-2 btn-secondary text-white bg-cyan-900 border-0 hover:bg-green-600">
                                        Download Template Server
                                    </button>
                                </div>
                                <Link to="/server">
                                    <button
                                        className="btn btn-secondary text-white bg-cyan-900 border-0 hover:bg-orange-400 hover:text-black">
                                        Server
                                    </button>
                                </Link>

                            </>
                            :
                            <>
                                <div className="tooltip tooltip-bottom" data-tip="Use 7zip for Extract">
                                    <button
                                        onClick={handleDownloadClient}
                                        className="btn mr-2 btn-secondary text-white bg-cyan-900 border-0 hover:bg-green-600">
                                        Download Template Client
                                    </button>
                                </div>
                                <Link to="/">
                                    <button
                                        className="btn btn-secondary text-white bg-cyan-900 border-0 hover:bg-orange-400 hover:text-black">
                                        Client
                                    </button>
                                </Link>

                            </>

                    }
            </div>
        </nav>
    );
};

export default Navbar;
