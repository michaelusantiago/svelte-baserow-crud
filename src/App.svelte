<script lang="ts">
  import { onMount } from "svelte";
  import AddForm from "./lib/AddForm.svelte";
  import ClientCard from "./lib/ClientCard.svelte";
  let show_add_form = false;
  import { clients, getClients, isLoading } from "./store"
  import { Circle } from "svelte-loading-spinners"

  let searchInput: HTMLInputElement
  let total_clients: number = 0

  const onSearch = async (e: Event) => {
    const key_pressed = e as KeyboardEvent
    if (key_pressed.key == "Enter")
      await getClients(searchInput.value)
  }

  const onClickClearSearch = async () => {
    if (searchInput.value) {
      await getClients()
      searchInput.value = ""
    }

    searchInput.focus()
  }

  onMount(async () => { await getClients() })
  $: {
    if ($clients) total_clients = new Array(...$clients).length
  }
</script>

<main>
  {#if show_add_form}
    <AddForm on:close={() => show_add_form = false}/>
  {/if}
  <h1>Everneat Client's Record</h1>
  <div class="search-wrapper">
    <label for="search">Search</label>
    <div class="input-wrapper">
      <i class="ri-search-line"></i>
      <input
        on:keypress={onSearch}
        on:input={async () => { if (!searchInput.value) await getClients() }}
        bind:this={searchInput}
        id="search"
        type="text"
        placeholder="search..."
      />
      <button on:click={onClickClearSearch}><i class="ri-close-line"></i></button>
    </div>
  </div>
  <div class="actions-buttons-wrapper">
    <div class="total-clients">{total_clients} clients in total</div>
    <button
      class="button-add"
      on:click={() => show_add_form = true}>
      <i class="ri-add-fill"></i> Add 
    </button>
    <button
      class="button-refresh"
      on:click={() => getClients() }>
      <i class="ri-refresh-line"></i>Refresh
    </button>
  </div>
  <div class="clients-list-container">
    {#if $isLoading}
      <span>
        Loading data, please wait <Circle size="25" color="#3EFF22" unit="px" duration="1s"/>
      </span>
    {:else}
      {#if $clients}
        {#each $clients as client}
          <ClientCard {client}/>
        {/each}
      {:else}
        <p>No record found</p>
      {/if}
    {/if}
  </div>
  <footer>
      Crafted by <a href="https://michaelusantiago.github.io" target="_blank" rel="noreferrer">Michael Santiago</a> &copy; 2023
  </footer>
</main>

<style lang="postcss">
  main {
    background-color: white;
    /* max-width: 800px; */
    width: 100%;
    /* padding: 50px; */
  }

  .input-wrapper {
    display: flex;
    border-radius: 7px;
    width: 100%;
    padding: 2px 10px;
    background-color: white;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    i { padding: 5px; }
    i.ri-search-line { }
    button {
      i { font-size: 1.2rem; }
      border-radius: 50px;
      padding: 3px;
      border: solid 1px transparent;
      outline: none; 
      background-color: transparent;
      display: flex;
      align-items: center;
    }
    button:hover, button:focus { background-color: lightgray; }
    input { width: 100%; }
  }

  h1 {
    color: #222;
    padding: 50px;
    background-color: lightgray;
    text-transform: uppercase;
    font-family: Geneva, Tahoma, sans-serif;
    margin: 0;
    /* border-bottom: 2px whitesmoke solid; */
  }

  .search-wrapper {
    display: flex;
    align-items: center;
    border-bottom: 1px darkgray solid;
    border-top: 1px darkgray solid;
    background-color: lightgray;
    color: #28282e;
    padding: 20px;
    label { padding: 0px 15px; }
    input {
      padding: 10px 15px;
      border-radius: 4px;
      flex: 1;
      border: none;
      outline: none;
      font-size: 1.2rem;
    }
  }

  .actions-buttons-wrapper {
    display: flex;
    background-color: lightgray;
    justify-content: flex-end;
    padding: 10px;
    gap: 5px;
    .total-clients {
      display: flex;
      align-items: center;
      width: 100%;
    }
    button {
      i {
        margin-right: 5px;
        font-size: 1.3rem;
      }
      display: flex;
      align-items: center;
      border-radius: 0;
    }
  }

  .clients-list-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    span {
      display: flex;
      gap: 7px;
      justify-content: center;
      padding: 20px;
    }
  }

  footer {
    background-color: lightgrey;
    color: darkblue;
    font-weight: 100;
    font-size: 0.99rem;
    padding: 10px 0;
    font-family: monospace;
    text-align: left;
    padding-left: 22px;
  }
</style>