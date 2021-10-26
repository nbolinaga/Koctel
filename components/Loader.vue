<template>
    <div class="d-flex justify-center pt-12">
        <svg id="shaker" width="100%" height="100%" viewBox="0 0 959 1795" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><g><path d="M358.333,591.667c0,-0 -168.331,433.365 -168.75,687.5" style="fill:none;stroke:#FFFFFF;stroke-width:75px;"/><path d="M341.667,112.5c-0,0 -279.594,-20.066 -304.167,291.667" style="fill:none;stroke:#FFFFFF;stroke-width:75px;"/><path d="M489.318,1757.03c-0,-0 279.649,19.274 303.339,-292.528" style="fill:none;stroke:#FFFFFF;stroke-width:75px;"/><path d="M273.958,416.667c0,-0 -271.507,768.419 -215.625,958.333c128.639,52.267 416.667,162.5 416.667,162.5c-0,0 317.194,-376.303 445.833,-879.167c-306.908,-136.979 -646.875,-241.666 -646.875,-241.666Z" style="fill:#FD3737;stroke:#FFFFFF;stroke-width:75px;"/><path d="M273.958,416.667l234.375,-133.334l87.5,-245.833l304.167,120.833l-66.667,229.167l87.5,270.833" style="fill:none;stroke:#FFFFFF;stroke-width:75px;"/><path d="M512.5,275l312.5,116.667" style="fill:#FD3737;stroke:#FFFFFF;stroke-width:75px;"/></g></svg>
    </div>
</template>

<style lang="scss">

#shaker {
    width: 10vh;
    height: auto;
    z-index: 99; /* remove this, it is not doing anything useful. */ 
    animation: shake 1s infinite;
    filter: drop-shadow( 0px 4px 4px rgba(0, 0, 0, .5));
}
@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
</style>