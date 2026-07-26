import "./Card.css";

function Card({

    title,

    children,

    className = ""

}) {

    return (

        <div className={`iva-card ${className}`}>

            {title && (

                <div className="iva-card-header">

                    <h3>{title}</h3>

                </div>

            )}

            <div className="iva-card-body">

                {children}

            </div>

        </div>

    );

}

export default Card;