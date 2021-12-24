import {styled} from 'twin.macro'
import {KEY_COLORS} from "../configs/color";

export const BackgroundGradientFrom = styled.div(({color}) => [
  `position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background: linear-gradient(
     45deg, 
     rgba(${color || KEY_COLORS[0].primary},0.1) 10%,
     rgba(${color || KEY_COLORS[0].primary},1.0) 25%,
     rgba(${color || KEY_COLORS[0].primary},0.1) 40%,
     rgba(${color || KEY_COLORS[0].primary},0.1) 60%,
     rgba(${color || KEY_COLORS[0].primary},1.0) 75%,
     rgba(${color || KEY_COLORS[0].primary},0.1) 90%
   );
   background-size: 400% 400%;
   background-position: 0% 100%;
   animation: gradient 30s ease infinite;`
])

export const BackgroundGradientTo = styled.div(({color}) => [
  `position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg, 
    rgba(${color || KEY_COLORS[0].secondary},1.0) 0%,
    rgba(${color || KEY_COLORS[0].secondary},0.1) 15%,
    rgba(${color || KEY_COLORS[0].secondary},0.1) 35%,
    rgba(${color || KEY_COLORS[0].secondary},1.0) 50%,
    rgba(${color || KEY_COLORS[0].secondary},0.1) 67%,
    rgba(${color || KEY_COLORS[0].secondary},0.1) 83%,
    rgba(${color || KEY_COLORS[0].secondary},1.0) 100%
  );
  background-size: 400% 400%;
  background-position: 0% 100%;
  animation: gradient 30s ease infinite;`
])
