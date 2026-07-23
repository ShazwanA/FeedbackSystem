import { Component, Input, OnChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-feedback-distribution',
  templateUrl: './feedback-distribution.component.html',
  styleUrls: ['./feedback-distribution.component.css']
})
export class FeedbackDistributionComponent implements OnChanges {

  @Input() feedbackDistributionData:any[]=[];

  doughnutChartData:ChartConfiguration<'doughnut'>['data']={

    labels:[],

    datasets:[

      {

        data:[],

        backgroundColor:[
          '#4CAF50',
          '#2196F3',
          '#FFC107',
          '#FF9800',
          '#F44336'
        ]

      }

    ]

  };

  ngOnChanges(): void {

    if(!this.feedbackDistributionData.length){
      return;
    }

    this.doughnutChartData={

      labels:this.feedbackDistributionData.map(x=>x.label),

      datasets:[

        {

          data:this.feedbackDistributionData.map(x=>x.count),

          backgroundColor:[
            '#4CAF50',
            '#2196F3',
            '#FFC107',
            '#FF9800',
            '#F44336'
          ]

        }

      ]

    };

  }

}