<script lang="ts">
    import { createEventDispatcher, onDestroy } from "svelte"

    const dispatch = createEventDispatcher()

    const onClickClose = () => { dispatch("close") }

	let modal: HTMLDivElement

	const handle_keydown = (e: any) => {
		if (e.key === 'Escape') {
			onClickClose();
			return;
		}

		if (e.key === 'Tab') {
			// trap focus
			const nodes = modal.querySelectorAll('*');
			const tabbable = Array.from(nodes).filter((n:HTMLElement) =>  n.tabIndex >= 0);

			let index = tabbable.indexOf(document.activeElement);
			if (index === -1 && e.shiftKey) index = 0;

			index += tabbable.length + (e.shiftKey ? -1 : 1);
			index %= tabbable.length;

			(tabbable[index] as HTMLElement).focus();
			e.preventDefault();
		}
	}

    const previously_focused = typeof document !== 'undefined' && document.activeElement;

	if (previously_focused) {
		onDestroy(() => {
			(previously_focused as HTMLElement).focus();
		});
	}
</script>

<style>
    :root {
        --mw-height: 300px;
        --mw-width: 400px;
    }
    .modal-window-wrapper {
        display: grid;
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 10;
        place-content: center;
    }

    .modal-window {
        display: flex;
        flex-direction: column;
        height: var(--mw-height);
        width: var(--mw-width);
        border: solid 1px darkgray;
        background-color: white;
        border-radius: 5px;
        box-sizing: border-box;
        /* padding: 0 5px 5px 5px; */
    }

    .close-btn {
        background-color: green;
        align-self: flex-end;
        border-radius: 50px;
        padding: 3px 7px;
        margin-top: 5px ;
        margin-right: 5px ;
        font-weight: bold;
        color: rgb(142, 178, 209);
        transition: color .5s;
        visibility: hidden;
    }

    .close-btn:hover { color: white; }

    .content {
        /* background-color: rgba(255, 255, 255, 1); */
        height: 100%;
        margin: 2px 5px 5px 5px;
        padding: 2px 5px;
    }
</style>

<svelte:window on:keydown={handle_keydown}/>

<div class="modal-window-wrapper" on:click|self={onClickClose} on:keydown={() => {}}>
    <div role="dialog" class="modal-window" aria-modal="true" bind:this={modal}>
        <button on:click={onClickClose} class="close-btn">&#x26CC;</button>
        <div class="content"><slot>no content</slot></div>
    </div>
</div>