import Card from "../Card/Card";

function ChartCard({

    title,

    toolbar,

    children,

    className=""

}){

    return(

        <Card
            className={className}
        >

            <div className="chart-card">

                <div className="chart-header">

                    <h3>

                        {title}

                    </h3>

                    {toolbar}

                </div>

                <div className="chart-body">

                    {children}

                </div>

            </div>

        </Card>

    );

}

export default ChartCard;