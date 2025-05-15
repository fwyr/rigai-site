<script>
    import { Canvas } from '@threlte/core'
    import Scene from '$lib/Scene.svelte'

    let response = $state("");

    function onSubmit(e) {
        const formData = new FormData(e.target);
        e.target.reset();

        const data = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }

        console.log(data);
        response = data["prompt"];

    }
</script>


<main style="width: 100vw; height: 100vh; margin: 0; padding: 0; overflow: hidden;">
    <div class="dual-container">
        <div class="container-child">
            <h1>hello ! the input</h1>
            <form on:submit|preventDefault={onSubmit}>
                <p><label for="prompt">what PC would you like?</label></p>
                <textarea id="prompt" name="prompt" rows="4" cols="50" placeholder="enter your prompt here..."></textarea>
                <br>
                <button type="submit">Submit</button>
            </form>
        </div>
    
        <div class="container-child">
            <h1> the res ponse</h1>
            <p class="response">
                {response}
            </p>
        </div>
    </div>
    

    <Canvas>
        <Scene />
    </Canvas>
</main>

<style>
    .dual-container {
        display: flex;
    }

    .container-child {
        flex: 1;
    }

</style>