import "./ReadMore.css";


function ReadMore({ text = "Read More", icon = "fa-solid fa-arrow-right", onClick }) {

    return (

        <button
            className="ReadMore"
            onClick={onClick}
        >

            <span>
                {text}
            </span>

            <i className={icon}></i>

        </button>

    );

}


export default ReadMore;