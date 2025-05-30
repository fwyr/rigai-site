<script lang=ts>
    import { Canvas } from '@threlte/core'
    import Scene from '$lib/Scene.svelte'
    import InputOutputBar from '$lib/InputOutputBar.svelte';
    import { isAwaitingResponse, noExistingPrompt } from '$lib/stores';
    // const awaiting = $derived(() => $isAwaitingResponse);
    // let response = $state("");
</script>


<main style="width: 100vw; height: calc(100vh -     3rem);; margin: 0; padding: 0; overflow: hidden; display: flex; flex-direction: column;">

    <div class="dual-container">
        <div id="render-container">
            <!-- <p>isAwaitingResponse: {$isAwaitingResponse}</p> -->

            {#if !$noExistingPrompt}
              {#if $isAwaitingResponse} <!-- debug -->
                <span id="loading-indicator" class="loader"></span>
              {:else}
                <Canvas>
                  <Scene />
                </Canvas>
              {/if}
            {:else}
              <p style="text-align:center; font-size: x-large;">Input a prompt to begin.</p>
            {/if}




        </div>
        <InputOutputBar />

        
    </div>
</main>

<style>
    :global(*) {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        /* height: calc(100vh - 3rem); */

        /* DEBUG */
        /* outline: red solid 2px; */
    }

    html, body, main {
        height: calc(100vh - 3rem);
        width: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color:#ffdbcc;
    }

    .dual-container {
        display: flex;
        flex: 1;
        margin: 0;
        padding: 0;
        width: 100%;
        /* height: calc(100% - 60px);  */
    }

    #render-container {
        flex: 2;
        height: calc(100vh - 3rem);
        display: flex;
        justify-content: center;
        align-items: center;
        /* max-width: calc(100vw*2/3); */
    }

    .loader {
    scale:3; 
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    border: 3px solid;
    border-color: #5654f7 #5654f7 transparent transparent;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    }
    .loader::after,
    .loader::before {
    content: '';  
    box-sizing: border-box;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    border: 3px solid;
    border-color: transparent transparent #fcf683 #fcf683;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-sizing: border-box;
    animation: rotationBack 0.5s linear infinite;
    transform-origin: center center;
    }
    .loader::before {
    width: 32px;
    height: 32px; 
    border-color: #ED6A5A #ED6A5A transparent transparent;
    animation: rotation 1.5s linear infinite;
    }
        
    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
    } 
    @keyframes rotationBack {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(-360deg);
    }
    }
    

    /* .loader {
        transform: rotateZ(45deg);
        perspective: 1000px;
        border-radius: 50%;
        width: 10rem;
        height: 10rem;
        color: #fff;
      }
        .loader:before,
        .loader:after {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: inherit;
          height: inherit;
          border-radius: 50%;
          transform: rotateX(70deg);
          animation: 1s spin linear infinite;
        }
        .loader:after {
          color: #519E8A;
          transform: rotateY(70deg);
          animation-delay: .4s;
        }

      @keyframes rotate {
        0% {
          transform: translate(-50%, -50%) rotateZ(0deg);
        }
        100% {
          transform: translate(-50%, -50%) rotateZ(360deg);
        }
      }

      @keyframes rotateccw {
        0% {
          transform: translate(-50%, -50%) rotate(0deg);
        }
        100% {
          transform: translate(-50%, -50%) rotate(-360deg);
        }
      }

      @keyframes spin {
        0%,
        100% {
          box-shadow: .2em 0px 0 0px currentcolor;
        }
        12% {
          box-shadow: .2em .2em 0 0 currentcolor;
        }
        25% {
          box-shadow: 0 .2em 0 0px currentcolor;
        }
        37% {
          box-shadow: -.2em .2em 0 0 currentcolor;
        }
        50% {
          box-shadow: -.2em 0 0 0 currentcolor;
        }
        62% {
          box-shadow: -.2em -.2em 0 0 currentcolor;
        }
        75% {
          box-shadow: 0px -.2em 0 0 currentcolor;
        }
        87% {
          box-shadow: .2em -.2em 0 0 currentcolor;
        }
      } */
</style>