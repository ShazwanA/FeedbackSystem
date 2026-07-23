import { Component, Input, OnChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-feedback-trend',
  templateUrl: './feedback-trend.component.html',
  styleUrls: ['./feedback-trend.component.css']
})
export class FeedbackTrendComponent implements OnChanges {

  @Input() feedbackTrend: any[] = [];

  lineChartData: ChartConfiguration<'line'>['data'] = {

    labels: [],

    datasets: [
      {
        label: 'Feedback Submitted',

        data: [],

        fill: false,

        tension: 0.4,

        borderColor: '#1976d2',

        backgroundColor: '#1976d2',

        pointRadius: 5,

        pointHoverRadius: 7
      }
    ]
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {

        display: true

      }

    },

    scales: {

      y: {

        beginAtZero: true

      }

    }

  };

  ngOnChanges(): void {

    if (!this.feedbackTrend?.length) {
      return;
    }

    this.lineChartData = {

      labels: this.feedbackTrend.map(item => item.month),

      datasets: [

        {

          label: 'Feedback Submitted',

          data: this.feedbackTrend.map(item => item.count),

          fill: false,

          tension: 0.4,

          borderColor: '#1976d2',

          backgroundColor: '#1976d2',

          pointRadius: 5,

          pointHoverRadius: 7

        }

      ]

    };

  }

}