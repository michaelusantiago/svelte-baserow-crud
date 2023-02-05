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
			const tabbable = Array.from(nodes).filter((n: HTMLElement) => {
                // If element is button and disabled, skip that specifict element (button)
                // This is to resolve freezing issue when the element is reached by tab but the element is disabled
                const disabled_element = (n as HTMLButtonElement)
                disabled_element.disabled
                return (n.tabIndex >= 0 && (!disabled_element.disabled))
            });

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

<svelte:window on:keydown={handle_keydown}/>

<div class="modal-window-wrapper" on:click|self={onClickClose} on:keydown={() => {}}>
    <div role="dialog" class="modal-window" aria-modal="true" bind:this={modal}>
        <!-- <button on:click={onClickClose} class="close-btn">&#x26CC;</button> -->
        <div class="content"><slot>no content</slot></div>
    </div>
</div>

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
    }

    /* .close-btn {
        align-self: flex-end;
        border-radius: 50px;
        padding: 3px 7px;
        margin-top: 5px ;
        margin-right: 5px ;
        font-weight: bold;
        color: black;
        transition: color .5s;
    } 
    .close-btn:hover { color: white; }
    */

    .content {
        height: 100%;
        margin: 2px 5px 5px 5px;
        padding: 2px 5px;
    }
</style>
