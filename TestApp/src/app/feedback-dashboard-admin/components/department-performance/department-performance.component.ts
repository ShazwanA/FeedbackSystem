import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-department-performance',
  templateUrl: './department-performance.component.html',
  styleUrls: ['./department-performance.component.css']
})
export class DepartmentPerformanceComponent implements OnInit {

  @Input() departmentPerformance: any[] = [];
  constructor() { }

  ngOnInit(): void { }

  chartData: any;

  chartOptions: any;

  ngOnChanges(): void {

    this.chartData = {

      labels: this.departmentPerformance.map(
        x => x.batch__department__department_name
      ),

      datasets: [

        {

          label: 'Average Rating',

          data: this.departmentPerformance.map(
            x => Number(x.average_rating).toFixed(2)
          ),

          backgroundColor: '#1976d2'

        }

      ]

    };

    this.chartOptions = {

      indexAxis:'y',

      responsive:true,

      maintainAspectRatio:false,

      plugins:{

        legend:{
          display:false
        }

      }

    };

  }

}
