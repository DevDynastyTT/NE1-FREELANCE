import { Chart } from "chart.js/auto";
import { useEffect } from "react";


export default function BarCharts({barChartData, invoiceDates}){
  console.log(barChartData)
  function createBarChart() {
    const ctx = document.getElementById("jobChart").getContext("2d");
    try {
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: barChartData.categories,
          datasets: [
            {
              label: "Number of Jobs",
              data: barChartData.counts,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
      console.log("Chart created successfully.");
    } catch (error) {
      console.log("Error creating chart:", error);
    }
  }
  
  
  function createLineChart() {
    const ctx = document.getElementById("invoiceChart");
  
    if (ctx) {
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }
      new Chart(ctx, {
        type: "line",
        data: {
          labels: invoiceDates.map((count) => count.date),
          datasets: [
            {
              label: "Number of Invoices",
              data: invoiceDates.map((count) => count.count),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }

  useEffect(()=>{
    createBarChart()
    createLineChart()
  }, [barChartData, invoiceDates])

  return(
    <div className="chart-items">
        <canvas id="jobChart"></canvas>
        <br/>
        <canvas id="invoiceChart"></canvas>
    </div>
  )
}