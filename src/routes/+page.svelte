<script lang=ts>
    import { Canvas } from '@threlte/core'
    import Scene from '$lib/Scene.svelte'
    import InputOutputBar from '$lib/InputOutputBar.svelte';

    let response = $state("");
</script>


<main style="width: 100vw; height: calc(100vh -     3rem);; margin: 0; padding: 0; overflow: hidden; display: flex; flex-direction: column;">

    <div class="dual-container">
        <div id="render-container">
            <Canvas>
                <Scene />
            </Canvas>
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
        /* max-width: calc(100vw*2/3); */
    }


</style>