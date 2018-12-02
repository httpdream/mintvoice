jQuery(document).ready(function() {
    // Pie Charts
    'use strict';
    var pieChartClass = 'pieChart',
    pieChartLoadedClass = 'pie-chart-loaded';
    function initPieCharts() {
        var chart = $('.' + pieChartClass);
        var bodyID = $('body').attr('id');
        chart.each(function() {
            $(this).appear(function() {
                var $this = $(this),  
                    chartBarColor = ($this.data('bar-color')) ? $this.data('bar-color') : "#1dbdce",
                    chartBarWidth = ($this.data('bar-width')) ? ($this.data('bar-width')) : 150
                if( !$this.hasClass(pieChartLoadedClass) ) {
                    $this.easyPieChart({
                        animate: 2000,
                        size: chartBarWidth,
                        lineWidth: 6,
                        scaleColor: false,
                        trackColor: "#eeeeee",
                        barColor: chartBarColor,
                    }).addClass(pieChartLoadedClass);
                }
            });
        });
    }
    initPieCharts();
});

        $(document).ready(function() {
            'use strict';
            $('.funny-text').funnyText({
                speed: 700,
                activeColor: '#F6464A',
                color: '#fff',
                fontSize: '1em',
                borderColor: 'none'
            });
            
        });
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-46212898-1', 'naiknikunj.me');
  ga('send', 'pageview');
  