<!-- <script lang=ts>
import { type ComponentSelection } from "./stores";

let submission = $props();
    
// object to string
const parse = (string:any):string => JSON.stringify(string, null, 2).replace(/['"]+/g, ''); 

const parseComponentToHTML = (component:ComponentSelection):string => `${parse(component.name)} ($${component.price})`

// alert()
</script>

{#if JSON.stringify(submission) != ""}
    <b>Prompt:</b> 
    <br>
    {parse(submission.prompt)}
    <br>
    <br>
    <b>Recommendation:</b>
    <br>
    <b>CPU</b>: {parseComponentToHTML(submission.response.cpu)}
    <br>
    <b>Cooler</b>: {parseComponentToHTML(submission.response.cooler)}
    <br>
    <b>Storage</b>: {parseComponentToHTML(submission.response.storage)}
    <br>
    <b>Memory</b>: {parseComponentToHTML(submission.response.memory)}
    <br>
    <b>Motherboard</b>: {parseComponentToHTML(submission.response.motherboard)}
{/if} -->

<script lang="ts">
import { type ComponentSelection } from "./stores";

    export let submission: any
    // ^TEMP FIX. GIVE TYPE OF SUBMISSION FROM DATA

    // safe parse function
    const parse = (input: unknown): string =>
      input ? JSON.stringify(input, null, 2).replace(/['"]+/g, "") : "";
  
    const parseComponentToHTML = (component?: ComponentSelection): string =>
      component ? `${parse(component.name)} ($${component.price})` : "";
  </script>
  
  {#if submission && submission.response}
    <b>Prompt:</b>
    <br />
    {parse(submission.prompt)}
    <br /><br />
    <b>Recommendation:</b>
    <br />
    <b>CPU</b>: {parseComponentToHTML(submission.response.cpu)}
    <br />
    <b>Cooler</b>: {parseComponentToHTML(submission.response.cooler)}
    <br />
    <b>Storage</b>: {parseComponentToHTML(submission.response.storage)}
    <br />
    <b>Memory</b>: {parseComponentToHTML(submission.response.memory)}
    <br />
    <b>Motherboard</b>: {parseComponentToHTML(submission.response.motherboard)}
  {:else}
    <p>Loading submission data...</p>
  {/if}
  