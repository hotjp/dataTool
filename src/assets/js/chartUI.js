/*
 * @Author: hotjp 
 * @Date: 2017-11-07 11:38:29 
 * @Last Modified by: hotjp
 * @Last Modified time: 2017-11-09 08:30:33
 */
import Chart from './classes';

const styleBuilder = new Chart.StyleBuilder({
  get(){
    console.log(1);
  }
});

export default {
  styleBuilder
};