<script lang="ts">
    export let client_id
    import ModalWindow from "./ModalWindow.svelte";
    import { createEventDispatcher, onMount } from "svelte"
    import { deleteClient } from "../store";
    import { Circle } from "svelte-loading-spinners"

    let deleting = false

    const onClickClose = async () => dispatch("close")

    const dispatch = createEventDispatcher()

    const onClickYes = async () => {
        deleting = true
        const result = await deleteClient(client_id)
        deleting = false

        // it means there is error
        if (result) alert("Something went wrong: " + result.detail)

        onClickClose()
    }

    onMount( () => { })
</script>

<ModalWindow
    on:close={onClickClose}
    --mw-height="220px"
    --mw-width="420px">
    <div class="messagebox-wrapper">
        <i class="ri-file-info-line"></i>
        {#if !deleting}
            <h3>Are you sure you want to delete record #{client_id}?</h3>
        {:else}
            <h3><span>Deleting record #{client_id}</span> <Circle size="15" color="#FF3E00" unit="px" duration="1s"/></h3>
        {/if}
        <div class="buttons-wrapper">
            <button on:click={onClickClose}>Cancel</button>
            <button on:click={onClickYes}>Yes</button>
        </div>
    </div>
</ModalWindow>

<style lang="postcss">
    .messagebox-wrapper {
        display: flex;
        place-content: center;
        flex-direction: column;
        align-items: center;
        height: 100%;
    }

    .buttons-wrapper {
        padding: 20px;
        button { padding: 10px 25px; }
    }

    h3 {
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;
    }

    i {
        color: blue;
        font-size: 2.3rem;
        padding: 0 12px;
    }
</style>
