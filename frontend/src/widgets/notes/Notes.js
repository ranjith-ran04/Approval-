import './notes.css'

function Notes ({handleClick}) {
    return (
        <div id='notes-container' onClick ={() => {handleClick(false)}}>
        <div id='content'>
        <button id="close-button" onClick={() => {handleClick(false)}}>×</button>
        <div id='para'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...</div>
        </div>
        </div>
    )
}

export default Notes;