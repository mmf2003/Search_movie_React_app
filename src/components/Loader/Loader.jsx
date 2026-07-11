import "./Loader.css";

function Loader() {
    return (
        <div className="loader-wrapper">
            <div className="loader"></div>
            <p className="loader__text">Loading movies...</p>
        </div>
    );
}

export default Loader;
