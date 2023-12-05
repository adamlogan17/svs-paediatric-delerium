import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

function getBarChartData(xValues: string[], yValues:number[]) : any {
    return {
        labels: xValues,
        datasets: [{
            backgroundColor: "rgba(255,255,255,0.5)",
            data: yValues
        }]
    }
}

async function getComplianceData(id:string):Promise<{entryDates:string[],complianceScore:number[]}>{
            const configuration = {
                    method: "get",
                    url: `${process.env.REACT_APP_API_URL}/chartData/singleSite/${id}`,
                    headers: { 'Authorization': "Bearer " + sessionStorage.getItem('TOKEN') }
                            };
                    try {
                            let response = await axios(configuration);
                            console.log(response);
                            return response.data;
                    } catch (err:any) {
                            console.log(err);
                            return{entryDates:[],complianceScore:[]}
                    }
}

function BarGraph(props:{ id:string|null }) {
    const [chartData, setChartData] = useState({
        entryDates: ['1970-01-01T00:00:00.000Z'], complianceScore:[0]
    });

    useEffect(() => {
    async function fetchData(id:string) {
        let data = await getComplianceData(id);
        setChartData(data);
    }
    console.log("prop", props.id);
    fetchData(props.id === null ? '0' : props.id);
}, []); 

    console.log(chartData);

    return (
        <div className="chart-container">
            <h2 style={{ textAlign: "center" }}>Compliance Score</h2>
            <Bar
                data={getBarChartData(chartData.entryDates.map((date:string) => new Date(date).toLocaleDateString("en-GB")), chartData.complianceScore)}
                options={{
                    scales: {
                        y: {
                            ticks: {
                                color:"#FFFFFF"
                            }
                        },
                        x: {
                            ticks: {
                                color:"#FFFFFF"
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: false,
                            text: "Compliance Scores",
                            color:"#FFFFFF"
                        },
                        legend: {
                            display: false
                        }
                    }

                }}
            />
        </div>
    );
}
export default BarGraph;