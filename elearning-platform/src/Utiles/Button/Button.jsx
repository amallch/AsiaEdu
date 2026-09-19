import "./Button.css";

function Button(props) {
    return (
        <div
            className={`Button ${props.type || "primary"}`}
            onClick={props.onClick}
        >
            {props.text}
        </div>
    );
}

export default Button;