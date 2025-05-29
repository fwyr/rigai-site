<script lang=ts>
    import { browser } from '$app/environment';
    import { currentDisplayingSubmissionID, isAwaitingResponse, noExistingPrompt, submissions } from '$lib/stores';
    import CoolerDisplay from './CoolerDisplay.svelte';
    import CpuDisplay from './CpuDisplay.svelte';
    import MemoryDisplay from './MemoryDisplay.svelte';
    import MotherboardDisplay from './MotherboardDisplay.svelte';
    import ParsedPromptResponse from './ParsedPromptResponse.svelte';
    import PromptLibrary from './PromptLibrary.svelte';
    import StorageDisplay from './StorageDisplay.svelte';

    // import result from './data/testfile.json';

    if (browser) {
        console.log("DOM fully loaded and parsed");

        const tabNames:string[] = [
            "input",
            "output",
            "library",
            "cpu",
            "cooler",
            "storage",
            "memory",
            "motherboard",
        ]

        tabNames.forEach(tabName => {
            document.getElementById(`${tabName}-button`).addEventListener("pointerdown", (e) => {
            openTab(tabName);
        })
        });

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


    function playDing() {
        const audio = new Audio('/ding.mp3');
        audio.play();
    }


    let submissionTimestamps: number[] = [];

    async function onsubmit(e:SubmitEvent) {
        e.preventDefault(); 
        const formData = new FormData(e.currentTarget as HTMLFormElement);


        const now = Date.now();
        submissionTimestamps = submissionTimestamps.filter(ts => now - ts < 60_000);
        if (submissionTimestamps.length >= 4) {
            alert("Rate limit exceeded: Please wait before submitting again.");
            return;
        }

        submissionTimestamps.push(now);
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

        // alert(prompt);

        if (prompt) {
            // open the output container
            // alert(prompt);
            document.getElementById("input-container").style.display = "none";
            document.getElementById("output-container").style.display = "block";
            // document.getElementById("loading-indicator").style.display = "block"; // loading
            isAwaitingResponse.set(true);

            // if first prompt, remove the text
            if ($noExistingPrompt) {
            noExistingPrompt.set(false);

            }

            // api magic
            try {




                // I AM AT MY RATE LIMIT

                const response = await fetch(
                    `https://rigai.onrender.com/recommend?message=${encodeURIComponent(prompt)}&model=llama-3.1-8b-instant` // encode URI for URL
                );
                const result = await response.json();
                
                // =============================================
                // TEMP
                // =============================================
                data["response"] = result;


                // debug
                // alert(JSON.stringify(result, null, 2));
                // alert(data["response"])

                // ^^^STORE THE ENTIRE DATA OBJECT AS AN OBJECT SO WE CAN SPLIT IT UP AND DISPLAY SEPARATELY IN CONTAINERS
                submissions.update(list => [...list, data]);

                currentDisplayingSubmissionID.set($submissions.length-1) // set displaying prompt to latest id

                document.getElementById("cpu-button").style.display = "block";
                document.getElementById("cooler-button").style.display = "block";
                document.getElementById("storage-button").style.display = "block";
                document.getElementById("memory-button").style.display = "block";
                document.getElementById("motherboard-button").style.display = "block";


            } catch (error) {
                alert("Error fetching recommendation: " + error);

                // re-add 
            
                noExistingPrompt.set(true);
                document.getElementById("cpu-button").style.display = "none";
                document.getElementById("cooler-button").style.display = "none";
                document.getElementById("storage-button").style.display = "none";
                document.getElementById("memory-button").style.display = "none";
                document.getElementById("motherboard-button").style.display = "none";
            } finally {
                // hide loading indicator
                playDing();
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
        // alert("data:\n"+ JSON.stringify($submissions[0], null, 2)) // returns the full object
        // alert("attempt 4: " + JSON.stringify($submissions, null, 2)[0]); // [
        // alert("attempt 5: " + JSON.stringify($submissions[0].response.cpu, null, 2)) // returns the full object
        // alert("toggling noExistingPrompt...");
        // noExistingPrompt.set(!$noExistingPrompt);


    }


</script>

<div id="main-container" class="">
    <!-- DEBUG -->
    <!-- <button {onpointerdown} style="height:3rem">debug</button>
     <div style="font-size:xx-large">
        <p>noExistingPrompt: {$noExistingPrompt}</p>
           
        <p>submissions length: {$submissions.length}</p>
        <p>currentDisplayingSubmissionID: {$currentDisplayingSubmissionID}</p>
     </div> -->
    <!-- DEBUG -->



    <div id="main-container-tabs">
        <button id="input-button" class="main-container-tab-button major-tab-button">Input</button>
        <button id="output-button" class="main-container-tab-button major-tab-button">Output</button>
        <button id="library-button" class="main-container-tab-button major-tab-button">Library</button>
        <!-- {#if !$noExistingPrompt} -->
        <button id="cpu-button" class="main-container-tab-button" style="background-color: #f9c2e0; display:none">CPU</button>
        <button id="cooler-button" class="main-container-tab-button" style="background-color: #FCF6BD; display:none">Cooler</button>
        <button id="storage-button" class="main-container-tab-button" style="background-color: #D0F4DE; display:none">Storage</button>
        <button id="memory-button" class="main-container-tab-button" style="background-color: #A9DEF9; display:none">Memory</button>
        <button id="motherboard-button" class="main-container-tab-button" style="background-color: #E4C1F9; display:none">Motherboard</button>
        <!-- {/if} -->
    </div>
    <div id="main-container-content">
        <div id="input-container" class="tab container-child" style="display:block">
            <h1 class="category-header">Input</h1>
            <hr>
            <br />
                <form id="form" {onsubmit}>
                    <p><label for="prompt" id="whatPClabel">What PC would you like?</label></p>
                    <textarea id="prompt" name="prompt" rows="6" cols="50" placeholder="enter your prompt here..."></textarea>
                    <br />
                    <div style="display:flex; justify-content:center"><button type="submit" id="submit-input">Show me your wares!</button></div>
                </form>
        </div>
    
        <div id="output-container" class="tab container-child" style="display:none">
            <h1 class="category-header">Output</h1>
            <!-- <h2 class="category-subheader">output container desc</h2> -->
            <!-- <br /> -->
            <hr>
            <!-- <div id="loading-indicator" style="display: none;">Loading...</div> -->

            <div class="response">

                <!-- {#if $isAwaitingResponse}

                {/if} -->

                {#if $isAwaitingResponse}
                <p>Loading...</p> 
                <!-- CAN MAKE BETTER LOADING SCREEN -->
                
                {:else if $submissions.length !== 0}
                <!-- <b>Input:</b>
                <br />
                {$submissions.length !== 0 ? $submissions[$submissions.length-1].prompt : null}
                <br />
                <b>Output (Price in USD):</b> -->
                <ParsedPromptResponse submission={$submissions[$submissions.length-1]} />

                <!-- <CpuDisplay selectedCPU={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.cpu : null} />
                <CoolerDisplay selectedCooler={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.cooler : null} />
                <StorageDisplay selectedStorage={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.storage : null} />
                <MemoryDisplay selectedMemory={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.memory : null} />
                <MotherboardDisplay selectedMotherboard={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.motherboard : null} /> -->
                {:else}
                <h2 class="category-subheader">Please input your PC requirements in the Input tab first!</h2>
                {/if}
            </div>
                <!-- <PcRecOutput /> -->
            
            <br />
            <!-- <p id="output"></p> -->
        </div>   

        <div id="library-container" class="tab container-child" style="display:none">
            <h1 class="category-header">Library</h1>
            <hr>
            <br />
            <h2 class="category-subheader">A collection of previous prompts.</h2>
            <br />
            <PromptLibrary />
        </div>

        {#if !$noExistingPrompt}
        <div id="cpu-container" class="tab container-child" style="background-color: #f9c2e0; display:none">
            <h1 class="category-header">CPU</h1>
            <hr>
            <br />
            <!-- 1. GENERATE TABLE -->
            <!-- 2. SHIFT THE AI RECOMMENDATION TO THE TOP OF THE TABLE -->
            <CpuDisplay selectedCPU={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.cpu : null} />
            
        </div>
        <div id="cooler-container" class="tab container-child" style="background-color: #FCF6BD; display:none">
            <h1 class="category-header">Cooler</h1>
            <hr>
            <br />
            <CoolerDisplay selectedCooler={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.cooler : null} />
        </div>
        <div id="storage-container" class="tab container-child" style="background-color: #D0F4DE; display:none">
            <h1 class="category-header">Storage</h1>
            <hr>
            <br />
            <StorageDisplay selectedStorage={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.storage : null} />
        </div>
        <div id="memory-container" class="tab container-child" style="background-color: #A9DEF9; display:none">
            <h1 class="category-header">Memory</h1>
            <hr>
            <br />
            <MemoryDisplay selectedMemory={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.memory : null} />
        </div>
        <div id="motherboard-container" class="tab container-child" style="background-color: #E4C1F9; display:none">
            <h1 class="category-header">Motherboard</h1>
            <hr>
            <br />
            <MotherboardDisplay selectedMotherboard={$submissions.length !== 0 ? $submissions[$submissions.length-1].response.motherboard : null} />
        </div>
        {/if}
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

    .category-subheader {
        font-size: medium;
        text-align: center;
        margin: 0.5rem;
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