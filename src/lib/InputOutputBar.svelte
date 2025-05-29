<script lang=ts>
    import { browser } from '$app/environment';
    import { isAwaitingResponse, isFirstPrompt, submissions } from '$lib/stores';
    import CoolerDisplay from './CoolerDisplay.svelte';
    import CpuDisplay from './CpuDisplay.svelte';
    import MemoryDisplay from './MemoryDisplay.svelte';
    import MotherboardDisplay from './MotherboardDisplay.svelte';
    import StorageDisplay from './StorageDisplay.svelte';
    // import { diffuseColor } from "three/tsl";

    // import PcRecOutput from './PCRecOutput.svelte';

    if (browser) {
        console.log("DOM fully loaded and parsed");
        document.getElementById("input-button").addEventListener("pointerdown", (e) => {
            openTab("input");
        })
        document.getElementById("output-button").addEventListener("pointerdown", (e) => {
            openTab("output");
        })
        document.getElementById("cpu-button").addEventListener("pointerdown", (e) => {
            openTab("cpu");
        })
        document.getElementById("cooler-button").addEventListener("pointerdown", (e) => {
            openTab("cooler");
        })
        document.getElementById("storage-button").addEventListener("pointerdown", (e) => {
            openTab("storage");
        })
        document.getElementById("memory-button").addEventListener("pointerdown", (e) => {
            openTab("memory");
        })
        document.getElementById("motherboard-button").addEventListener("pointerdown", (e) => {
            openTab("motherboard");
        })

        function openTab(tabName:string) {       
            let tabCollection = Array.from(document.getElementsByClassName('tab') as HTMLCollectionOf<HTMLElement>);
            tabCollection.forEach(element => {
                element.style.display = "none";
            });
            document.getElementById(`${tabName}-container`).style.display = "block";   
            console.log(`setting ${tabName} to show`)
        }
    };

    let response = $state("");
    let prompt = $state("");


    // i know switching between input & output tabs can be done purely with {#if}. this is to add compatibility and future-proofing


    // function openInput(e:PointerEvent) {
    //     e.preventDefault();
    //     document.getElementById("input-container").style.display = "block";
    //     document.getElementById("output-container").style.display = "none";
    // }

    // function openOutput(e:PointerEvent) {
    //     e.preventDefault();
    //     document.getElementById("input-container").style.display = "none";
    //     document.getElementById("output-container").style.display = "block";
    // }


    async function onsubmit(e:SubmitEvent) {
        e.preventDefault(); 
        const formData = new FormData(e.currentTarget as HTMLFormElement);

        // if first prompt, remove the text
        if (isFirstPrompt) {
            isFirstPrompt.set(false);

        }

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
            // alert(prompt);
            document.getElementById("input-container").style.display = "none";
            document.getElementById("output-container").style.display = "block";
            // document.getElementById("loading-indicator").style.display = "block"; // loading
            isAwaitingResponse.set(true);

            // api magic
            try {
                const response = await fetch(
                    `https://rigai.onrender.com/recommend?message=${encodeURIComponent(prompt)}` // encode URI for URL
                );
                const result = await response.json();
                data["response"] = result;

                // debug
                alert(JSON.stringify(result, null, 2));

                // ^^^STORE THE ENTIRE DATA OBJECT AS AN OBJECT SO WE CAN SPLIT IT UP AND DISPLAY SEPARATELY IN CONTAINERS
                submissions.update(list => [...list, data]);

            } catch (error) {
                alert("Error fetching recommendation: " + error);
            } finally {
                // hide loading indicator
            isAwaitingResponse.set(false);
        }

        const form = document.getElementById("form") as HTMLFormElement;
        form.reset();
        
        // i dont really know why this works now but it works
    }}

    function onpointerdown(e:PointerEvent) {
        e.preventDefault();
        alert(JSON.stringify($submissions, null, 2));
        // alert("attempt 1: " + $submissions[0]); // [object Object]
        // alert("attempt 2: " + $submissions[0].cpu); // undefined
        alert("data:\n"+ JSON.stringify($submissions[0], null, 2)) // returns the full object
        // alert("attempt 4: " + JSON.stringify($submissions, null, 2)[0]); // [
        // alert("attempt 5: " + JSON.stringify($submissions[0].response.cpu, null, 2)) // returns the full object

    }


</script>

<div id="main-container" class="">
    <!-- DEBUG -->
    <!-- <button {onpointerdown}>debug</button> -->
    <!-- DEBUG -->
    <div id="main-container-tabs">
        <button id="input-button" class="main-container-tab-button major-tab-button">Input</button>
        <button id="output-button" class="main-container-tab-button major-tab-button">Output</button>
        <button id="cpu-button" class="main-container-tab-button" style="background-color: #f9c2e0;">CPU</button>
        <button id="cooler-button" class="main-container-tab-button" style="background-color: #FCF6BD;">Cooler</button>
        <button id="storage-button" class="main-container-tab-button" style="background-color: #D0F4DE;">Storage</button>
        <button id="memory-button" class="main-container-tab-button" style="background-color: #A9DEF9;">Memory</button>
        <button id="motherboard-button" class="main-container-tab-button" style="background-color: #E4C1F9;">Motherboard</button>
    </div>
    <div id="main-container-content">
        <div id="input-container" class="tab container-child" style="display:block">
            <h1 class="category-header">Input</h1>
            <!-- {#if dropdownShown} -->
                <form id="form" {onsubmit}>
                    <p><label for="prompt" id="whatPClabel">What PC would you like?</label></p>
                    <textarea id="prompt" name="prompt" rows="6" cols="50" placeholder="enter your prompt here..."></textarea>
                    <br />
                    <div style="display:flex; justify-content:center"><button type="submit" id="submit-input">Show me your wares!</button></div>
                </form>
            <!-- {/if} -->
        </div>
    
        <div id="output-container" class="tab container-child" style="display:none">
            <h1 class="category-header">Output</h1>
            <!-- <div id="loading-indicator" style="display: none;">Loading...</div> -->

            <div class="response">


                {#if $submissions.length !== 0}
                <b>Input:</b>
                <br />
                {response}
                <br />
                <b>Output:</b>
                <CpuDisplay selectedCPU={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.cpu : null} />
                <CoolerDisplay selectedCooler={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.cooler : null} />
                <StorageDisplay selectedStorage={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.storage : null} />
                <MemoryDisplay selectedMemory={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.memory : null} />
                <MotherboardDisplay selectedMotherboard={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.motherboard : null} />
                {:else}
                <p>Please input your PC requirements in the Input tab first!</p>
                {/if}
            </div>
                <!-- <PcRecOutput /> -->
            
            <br />
            <!-- <p id="output"></p> -->
        </div>   
        <div id="cpu-container" class="tab container-child" style="background-color: #f9c2e0; display:none">
            <h1 class="category-header">CPU</h1>
            <!-- 1. GENERATE TABLE -->
            <!-- 2. SHIFT THE AI RECOMMENDATION TO THE TOP OF THE TABLE -->
            <CpuDisplay selectedCPU={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.cpu : null} />
            
        </div>
        <div id="cooler-container" class="tab container-child" style="background-color: #FCF6BD; display:none">
            <h1 class="category-header">Cooler</h1>
            <CoolerDisplay selectedCooler={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.cooler : null} />
        </div>
        <div id="storage-container" class="tab container-child" style="background-color: #D0F4DE; display:none">
            <h1 class="category-header">Storage</h1>
            <StorageDisplay selectedStorage={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.storage : null} />
        </div>
        <div id="memory-container" class="tab container-child" style="background-color: #A9DEF9; display:none">
            <h1 class="category-header">Memory</h1>
            <MemoryDisplay selectedMemory={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.memory : null} />
        </div>
        <div id="motherboard-container" class="tab container-child" style="background-color: #E4C1F9; display:none">
            <h1 class="category-header">Motherboard</h1>
            <MotherboardDisplay selectedMotherboard={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.motherboard : null} />
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

    #main-container-tabs {
        display: flex;
        flex-direction: column;
        align-items:flex-end;
        justify-content: top;
        padding-top: 2rem;
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

    .major-tab-button {
        width: 3.5rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
    }

    #prompt {
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    #whatPClabel {
        font-size: x-large;
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
        padding: 1rem;
        width: calc(100vw * 1/3 - 5rem);
        height: calc(100vh - 3rem);
    }

    .response {
        padding: 1rem;
    }

    /* .loader {
    width: 150px;
    height: 150px;
    background-color: #ff3d00;
    border-radius: 50%;
    position: relative;
    box-shadow: 0 0 30px 4px rgba(0, 0, 0, 0.5) inset,
      0 5px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
  }
  .loader:before,
  .loader:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 45%;
    top: -40%;
    background-color: #fff;
    animation: wave 5s linear infinite;
  }
  .loader:before {
    border-radius: 30%;
    background: rgba(255, 255, 255, 0.4);
    animation: wave 5s linear infinite;
  }
  @keyframes wave {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  } */


   

</style>