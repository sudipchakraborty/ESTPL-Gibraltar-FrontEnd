import "./KPICard.css";

import Card
    from "../Card/Card";

function KPICard({

    title,

    value,

    color = "primary",

    unit = "",

    icon = null

}) {

    return (

        <Card className={`kpi-card ${color}`}>

            <div className="kpi-content">

                {icon && (

                    <div className="kpi-icon">

                        {icon}

                    </div>

                )}

                <div className="kpi-value">

                    {value}

                    {unit}

                </div>

                <div className="kpi-title">

                    {title}

                </div>

            </div>

        </Card>

    );

}

export default KPICard;