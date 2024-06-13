import React from 'react';

const Navbar = () => {
    return (
        <nav className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <button tabIndex={0} className="btn btn-ghost lg:hidden" aria-label="Menu">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </button>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a href="#item1">Item 1</a></li>
                        <li>
                            <a>All AI</a>
                            <ul className="p-2">
                                <li><a href="https://sapling.ai/ai-content-detector" target="_blank" rel="noopener noreferrer">AI Content Detector</a></li>
                                <li><a href="https://www.zerogpt.com/" target="_blank" rel="noopener noreferrer">ZeroGPT</a></li>
                                <li><a href="https://bard.google.com/" target="_blank" rel="noopener noreferrer">Bard</a></li>
                                <li><a href="https://chat.openai.com/" target="_blank" rel="noopener noreferrer">Chat GPT</a></li>
                                <li><a href="https://www.bing.com/search?q=Bing+AI&showconv=1&FORM=hpcodx" target="_blank" rel="noopener noreferrer">Bing Chat</a></li>
                                <li><a href="https://app.pebblely.com/" target="_blank" rel="noopener noreferrer">Pebblely</a></li>
                                <li><a href="https://magicstudio.com/canvas/" target="_blank" rel="noopener noreferrer">Canvas</a></li>
                                <li><a href="https://app.rytr.me/create/file/65119d8596cd6156f3b67927" target="_blank" rel="noopener noreferrer">Rytr</a></li>
                                <li><a href="https://app.steve.ai/dashboard" target="_blank" rel="noopener noreferrer">Steve AI</a></li>
                            </ul>
                        </li>
                        <li><a href="#item3">Item 3</a></li>
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl" href="/">React Setup Pro</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a href="#item1">Item 1</a></li>
                    <li>
                        <details>
                            <summary>All AI</summary>
                            <ul className="p-2">
                                <li><a className="w-60" href="https://sapling.ai/ai-content-detector" target="_blank" rel="noopener noreferrer">AI Content Detector</a></li>
                                <li><a href="https://www.zerogpt.com/" target="_blank" rel="noopener noreferrer">ZeroGPT</a></li>
                                <li><a href="https://bard.google.com/" target="_blank" rel="noopener noreferrer">Bard</a></li>
                                <li><a href="https://chat.openai.com/" target="_blank" rel="noopener noreferrer">Chat GPT</a></li>
                                <li><a href="https://www.bing.com/search?q=Bing+AI&showconv=1&FORM=hpcodx" target="_blank" rel="noopener noreferrer">Bing Chat</a></li>
                                <li><a href="https://app.pebblely.com/" target="_blank" rel="noopener noreferrer">Pebblely</a></li>
                                <li><a href="https://magicstudio.com/canvas/" target="_blank" rel="noopener noreferrer">Canvas</a></li>
                                <li><a href="https://app.rytr.me/create/file/65119d8596cd6156f3b67927" target="_blank" rel="noopener noreferrer">Rytr</a></li>
                                <li><a href="https://app.steve.ai/dashboard" target="_blank" rel="noopener noreferrer">Steve AI</a></li>
                            </ul>
                        </details>
                    </li>
                    <li><a href="#item3">Item 3</a></li>
                </ul>
            </div>
            <div className="navbar-end">
                <a className="btn" href="#button">Button</a>
            </div>
        </nav>
    );
};

export default Navbar;
