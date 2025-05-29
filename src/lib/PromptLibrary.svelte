<script lang=ts>
    import ParsedPromptResponse from "./ParsedPromptResponse.svelte";
    import { submissions } from "./stores";
</script>

<div>
{#if $submissions.length !== 0}
    {#each $submissions as submission, i }
    <hr>
    <br>
    <div class="library-prompt-each">
        <h2 class="library-prompt-subheading">Prompt {i+1}</h2>
        <br>
        <ParsedPromptResponse {submission} />
    </div>
    <br>

    {/each}
{:else}
    <p>No previous prompt...</p>
{/if}

</div>