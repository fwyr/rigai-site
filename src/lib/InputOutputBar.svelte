<script lang=ts>
    // import { diffuseColor } from "three/tsl";

    let response = $state("");
    let prompt = $state("");

    // function openTab(tabName:string) {       
        
    //     let tabCollection = Array.from(document.getElementsByClassName('mat-form-field-infix') as HTMLCollectionOf<HTMLElement>);
    //     tabCollection.forEach(element => {
    //         element.style.display = "none";
    //     });
    //     document.getElementById(tabName).style.display = "block";   
    // }
    // // i know switching between input & output tabs can be done purely with {#if}. this is to add compatibility and future-proofing


    function openInput(e:PointerEvent) {
        e.preventDefault();
        document.getElementById("input-container").style.display = "block";
        document.getElementById("output-container").style.display = "none";
    }

    function openOutput(e:PointerEvent) {
        e.preventDefault();
        document.getElementById("input-container").style.display = "none";
        document.getElementById("output-container").style.display = "block";
    }

    async function onsubmit(e:SubmitEvent) {
        const formData = new FormData(e.currentTarget as HTMLFormElement);

        // const data = {};
        // for (let field of formData) {
        //     const [key, value] = field;
        //     data[key] = value;
        // }
        const data: Record<string, FormDataEntryValue> = {};
        for (let [key, value] of formData) {
            data[key] = value;
        }

        console.log(data);
        prompt = String(data["prompt"]);
        response = prompt;

        alert(prompt);

        if (prompt) {
            // open the output container
            alert(prompt);
            document.getElementById("input-container").style.display = "none";
            document.getElementById("output-container").style.display = "block";

            // api magic
            try {
                const response = await fetch(
                    `https://rigai.onrender.com/recommend?message=${encodeURIComponent(prompt)}` // encode URI for URL
                );
                const result = await response.json();
                data["response"] = result;
                // debug
                alert(JSON.stringify(result, null, 2));
            } catch (error) {
                alert("Error fetching recommendation: " + error);
            }

        const form = document.getElementById("form") as HTMLFormElement;
        form.reset();
        
        // i dont really know why this works now but it works
    }}

</script>

<div id="main-container" class="">
    <div id="main-container-tabs">
        <button class="main-container-tab-button" onpointerdown={openInput}>Input</button>
        <button class="main-container-tab-button" onpointerdown={openOutput}>Output</button>
    </div>
    <div id="main-container-content">
        <div id="input-container" class="tab container-child">
            <h1 class="category-header">Input</h1>
        
            <!-- {#if dropdownShown} -->
        
                <form id="form" {onsubmit}>
                    <p><label for="prompt" id="whatPClabel">what PC would you like?</label></p>
                    <textarea id="prompt" name="prompt" rows="6" cols="50" placeholder="enter your prompt here..."></textarea>
                    <br>
                    <div style="display:flex; justify-content:center"><button type="submit" id="submit-input">Show me your wares!</button></div>
        
        
                </form>
            <!-- {/if} -->
        </div>
    
        <div id="output-container" class="tab container-child">
            <h1 class="category-header">Output</h1>
            <p class="response">
                <b>Input:</b> 
                <br />
                {response}
            </p>
            <br />
            <p id="output"></p>
        </div>   
    </div>
 
</div>


<style>
    .container-child {
        flex: 1;
        /* height: calc(100vh-3rem); */
        min-height: 0;
    }

    .category-header {
        font-size:xx-large;
        text-align: center;
        margin: 1rem;
    }

    #main-container {
        overflow: hidden;
        display: flex;
        /* max-width: calc(100vw * 1/3); */
        overflow-wrap: break-word;
    }


    button {
        padding: 0.5rem;
        font-size: large;
        /* border-radius: 0.7rem; */
    }

    .main-container-tab-button {
        /* flex-grow: 0;
        flex-shrink: 1; */
        /* border-radius: 1rem; */
        
        border-top-left-radius: 1rem;
        border-bottom-left-radius: 1rem;
        width: 2.5rem;
        writing-mode: sideways-lr;
    }

    #prompt {
        /* margin-top: 1rem; */
        /* margin-bottom: 1rem; */
    }

    #whatPClabel {
        font-size: x-large;
    }

    #main-container-tabs {
        display: flex;
        flex-direction: column;
        justify-content: top;
        padding-top: 2rem;
    }




    /* #submit-input {
        
    } */



    /* #dropdown-input {
        position: fixed;
        margin: 0;
        margin-left: 1rem;
        background-color: #ED6A5A;
        z-index: 1000;
        border-bottom-left-radius: 1.5rem;
        border-bottom-right-radius: 1.5rem;
        padding: 1rem;
        padding-bottom: 1rem;
        min-width: 1.5vw;
        height:fit-content;
        box-shadow: 1px 0 15px rgba(0,0,0,0.07);
        transition: height 200ms linear;
        color: black;
        } */

    .tab {
        background-color: #EDCB96;

        overflow: auto; 
        /* ^^this is to account for the case where output is very long */
        margin: 0;
        border-top-left-radius: 1.5rem;
        border-bottom-left-radius: 1.5rem;
        /* flex-shrink:  */
        padding: 1rem;

    }

    #input-container {
        display: block;
        /* box-shadow: 1px 0 15px rgba(0,0,0,0.07); */
        width: calc(100vw * 1/3 - 5rem);
        height: calc(100vh - 3rem);
        /* overflow: hidden; */
        padding: 1rem;
    }

    #output-container {
        display: none;
        /* box-shadow: 1px 0 15px rgba(0,0,0,0.07); */
        width: calc(100vw * 1/3 - 5rem);
        height: calc(100vh - 3rem);
        /* overflow: hidden; */
        padding: 1rem;
    }

    .response {
        padding: 1rem;
    }
</style>