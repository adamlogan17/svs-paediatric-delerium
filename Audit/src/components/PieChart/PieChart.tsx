import axios from "axios";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

function getPieChartData(labels: string[], data:number[]) : any {
    return {
        labels: labels,
        datasets: [{
            backgroundColor: "rgba(255,255,255,0.5)",
            data: data
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

function PieChart(props:{ id:string|null }) {
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
            <div style={{ width: '80%', height: '300px', margin: 'auto' }}>
                <Pie
                    data={getPieChartData(chartData.entryDates.map((date:string) => new Date(date).toLocaleDateString("en-GB")), chartData.complianceScore)}
                    options={{
                        plugins: {
                            title: {
                                display: false,
                                text: "Compliance Scores",
                                color:"#FFFFFF"
                            },
                            legend: {
                                display: false
                            }
                        },
                        maintainAspectRatio: false
                    }}
                />
            </div>
        </div>
    );
}
export default PieChart;