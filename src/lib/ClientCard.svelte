<script lang="ts">
    import type { Client } from "../store"
    import UpdateForm from "./UpdateForm.svelte"
    import DeleteClientNessageBox from "./DeleteClientNessageBox.svelte"
    export let client: Client 
    let show_edit = false
    let show_delete = false
    let client_id = null
    let temp_company_logo = "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"

    const onClickEdit = async (e: Event) => {
        const i_element = e.target as HTMLElement
        const parent = i_element.closest("div")
        client_id = parent.id
        show_edit = true
    }

    const onClickDelete = async (e: Event) => {
        const i_element = e.target as HTMLElement
        const parent = i_element.closest("div")
        client_id = parseInt(parent.id)
        show_delete = true
    }
</script>

<main>
    <!-- display a confirmation window here -->
    {#if show_delete}
        <DeleteClientNessageBox
            on:close={() => show_delete = false}
            {client_id}
        />
    {/if}

    {#if show_edit}
        <UpdateForm
            on:close={() => show_edit = false}
            {client_id}
        />
    {/if}
    <div class="client-account-wrapper">
        <!-- Head -->
        <div class="header-wrapper">
            <img
                class="img-company-logo"
                src={client.fld_logo || temp_company_logo}
                alt="company logo"
                width="100"
            />
            <h1>{client.fld_company_name}</h1>
            <div id={client.id.toString()} class="edit-delete-wrapper">
                <i
                    on:click={onClickEdit}
                    on:keydown={() => {}}
                    class="ri-pencil-line"
                />
                <i 
                    on:click={onClickDelete}
                    on:keydown={() => {}}
                    class="ri-delete-bin-line"
                />
            </div>
        </div>

        <!-- Body / Details -->
        <div class="company-details-wrapper">
            <div class="col1">
                <div class="field-wrapper">
                    <div class="label">Full Name</div>
                    <div class="data">{client.fld_fullname}</div>
                </div>
                <div class="field-wrapper">
                    <div class="label">Industry</div>
                    <div class="data">{client.fld_industry}</div>
                </div>
                <div class="field-wrapper">
                    <div class="label">Company Website</div>
                    <div class="data">{client.fld_company_url}</div>
                </div>
            </div>
            <div class="col2">
                <div class="field-wrapper">
                    <div class="label">Facebook Page</div>
                    <div class="data">{client.fld_fb_page}</div>
                </div>
                <div class="field-wrapper">
                    <div class="label">Email</div>
                    <div class="data">{client.fld_email}</div>
                </div>
                <div class="field-wrapper">
                    <div class="label">Phone Number</div>
                    <div class="data">{client.fld_phone}</div>
                </div>
            </div>
        </div>
    </div>
</main>

<style lang="postcss">
    .client-account-wrapper {
        display: flex;
        flex-direction: column;
        border: solid 1px black;
        padding: 20px;

        /* Head */
        .header-wrapper {
            display: flex;
            width: 100%;
            img {
                flex: 1;
                border: solid 1px black;
            }
            h1 {
                flex: 3;
                font-weight: bold;
                padding: 0 20px;
                text-align: left;
            }
            .edit-delete-wrapper {
                display: flex;
                justify-content: flex-end;
                align-items: flex-start;
                height: 100%;
                padding: 0 10px;
                gap: 10px;
                font-size: 1.5rem;
                i {
                    padding: 4px 5px;
                    text-align: center;
                }
                i:hover {
                    background-color: lightgray;
                    border-radius: 50px;
                }
            }
        }

        /* Body / Details */
        .company-details-wrapper {
            display: flex;
            padding: 10px;
            .col1, .col2 {
                flex: 1;
                .field-wrapper {
                    display: flex;
                    justify-content: flex-start;
                    text-align: left;
                    flex-direction: column;
                    padding: 3px 0;
                   .label { font-weight: bold; } 
                   .data {
                        font-size: 1.3rem;
                        font-weight: 400;
                    }
                }
            }
        }
    }
</style>