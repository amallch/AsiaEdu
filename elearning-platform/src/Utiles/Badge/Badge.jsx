import "./Badge.css";

function Badge(props) {
    return (
        <div className={`Badge ${props.type || "primary"}`}>
            {props.icon && <i className={props.icon}></i>}
            {props.text}
        </div>
    );
}

export default Badge;