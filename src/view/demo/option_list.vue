<template>
  <div class="echarts_options">
      <!-- <div v-for="item in series">
          <dl>
              <dt>{{item.properties.type.default}}</dt>
              <dd v-for="data in item.properties.data">
                  <li>{{data}}</li>
              </dd>
          </dl>
      </div> -->
      <div class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide">Slide 1</div>
            <div class="swiper-slide">Slide 2</div>
            <div class="swiper-slide">Slide 3</div>
            <div class="swiper-slide">Slide 4</div>
            <div class="swiper-slide">Slide 5</div>
            <div class="swiper-slide">Slide 6</div>
            <div class="swiper-slide">Slide 7</div>
            <div class="swiper-slide">Slide 8</div>
            <div class="swiper-slide">Slide 9</div>
            <div class="swiper-slide">Slide 10</div>
        </div>
    </div>
  </div>
</template>

<script type="text/babel">
import chartsOption from "../../chartsOption.json";
import Swiper from "swiper";
window.mySwiper = new Swiper('.swiper-container')
// let series = chartsOption.option.properties.series.items.anyOf;
// let series1 = compareSeries(chartsOption.option.properties.series.items.anyOf);

// function compareSeries(arr){
//   let names = [];
//   for(let i = 0; i < arr.length; i++){
//     let obj = arr[i].properties.data
//     if(obj){
//       console.log(obj.items.properties)
//     }else{
//       console.log(i)
//     }
//     // for (let key in obj) {
//     //   if (obj.hasOwnProperty(key)) {
//     //     let element = obj[key];
//     //     names.push(key)
//     //   }
//     // }
//   }
// }
export default {
  data: () => ({
    // series
  }),
  methods: {
    // filterTitle(htmlString) {
    //   return /<p.*?<\/p>/.exec(htmlString)[0] || "";
    // }
  }
};
</script>
