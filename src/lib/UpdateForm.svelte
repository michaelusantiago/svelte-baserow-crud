<script lang="ts">
    export let client_id: string
    import ModalWindow from "./ModalWindow.svelte"
    import { createEventDispatcher, onMount } from "svelte"
    import { type Client, clients, updateClient } from "../store";
    import { Circle } from "svelte-loading-spinners"

    let fileInput: string
    let company_logo = null
    let save_ok = false
    let updating = false
    
    // Input fields
    let full_name: HTMLInputElement
    let company_name: HTMLInputElement
    let industry: HTMLSelectElement
    let fb_page: HTMLInputElement
    let email: HTMLInputElement
    let company_website: HTMLInputElement
    let phone_number: HTMLInputElement 
    let com_log: HTMLInputElement

    let tp_number_pattern = /^[\+]?[(]?[0-9]{2,3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    let cp_number_pattern = /^[\+]?[(]?[0-9]{2,3}[)]?[-\s\.]?[0-9]{3}?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/
    let email_pattern = /[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+/
    let url_pattern1 = /https?\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}/
    let url_pattern2 = /https?\:\/\/(www\.)?youtu(\.)?be(\.com)?\/.*(\?v=|\/v\/)?[a-zA-Z0-9_\-]+/
    let field_error = { found: false, err_msg: null }

    const dispatch = createEventDispatcher()

    const onClickClose = async () => dispatch("close")

    const onClickSave = async () => {
        let tp = phone_number.value.match(tp_number_pattern)
        let cp = phone_number.value.match(cp_number_pattern)

        field_error.found = false

        // Validate URL
        // Facebook page
        if (!(fb_page.value.match(url_pattern1) || fb_page.value.match(url_pattern2)) && fb_page.value) {
            field_error.err_msg = "URL is not valid. Please check the format"
            field_error.found = true
            fb_page.focus()
            return
        }

        // Validate Email
        if (!email.value.match(email_pattern) && email.value) {
            field_error.err_msg = "Email is invalid. Please check the format."
            field_error.found = true
            email.focus()
            return
        }

        // Validate URL
        // Company's Website
        if (!(company_website.value.match(url_pattern1) || company_website.value.match(url_pattern2)) && company_website.value) {
            field_error.err_msg = "URL is not valid. Please check the format"
            field_error.found = true
            company_website.focus()
            return
        }

        // Validate Phone Number
        // if (!(tp || cp) && phone_number.value)) {
        if (tp || cp) {
            field_error.found = true
            field_error.err_msg = "Phone number is invalid. Please follow given phone format."
            phone_number.focus()
            return
        }

        // Proceed saving data
        const result = await updateClient(parseInt(client_id), {
            fld_company_name: company_name.value,
            fld_company_url: company_website.value,
            fld_email: email.value,
            fld_fb_page: fb_page.value,
            fld_fullname: full_name.value,
            fld_industry: industry.value,
            fld_logo: com_log.files[0],
            fld_phone: phone_number.value,
        })

        if (result) alert("Something went wrong: " + result.detail)

        onClickClose()
    }

    const onInputChange = (e) => {
        save_ok = Boolean(full_name?.value && company_name?.value && industry?.value)
    }

    onMount ( async () => {
        // find the id of the client
        $clients.fil
        let _clients =  new Array(...$clients) 

        const client = _clients.find(client => client.id === parseInt(client_id)) as Client

        company_name.value = client.fld_company_name
        company_website.value = client.fld_company_url
        email.value = client.fld_email
        fb_page.value =client.fld_fb_page
        full_name.value = client.fld_fullname
        industry.value = client.fld_industry
        phone_number.value = client.fld_phone
        company_logo = client.fld_logo

        full_name.focus()
    })

    const onFileSelected = (e)  => {
        let reader = new FileReader()
        let image = e.target.files[0]
        reader.readAsDataURL(image)
        reader.onload = e => company_logo = e.target.result
    }

    $: {
        if (!company_logo) {
             company_logo = "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"
        }

        save_ok = Boolean(full_name?.value && company_name?.value && industry?.value)
    }
</script>

<ModalWindow
    on:close={onClickClose}
    --mw-height="550px"
    --mw-width="900px"
>
    <form on:submit|preventDefault class="form-add-client">
        <h2 class="form-title">Update Client Record #{client_id}</h2>
        <div class="container-two-col">
            <div class="col-one">
                <div class="input-wrapper">
                    <label for="full-name">Full Name</label>
                    <input
                        bind:this={full_name}
                        on:change={onInputChange}
                        name="full-name"
                        type="text"
                        placeholder="Everr Green"
                    />
                </div>
                <div class="input-wrapper">
                    <label for="company-name">Company Name</label>
                    <input
                        bind:this={company_name}
                        on:change={onInputChange}
                        name="company-name"
                        type="text"
                        placeholder="Legend Hotel"
                    />
                </div>
                <div class="input-wrapper">
                    <label for="industry">Industry</label>
                    <select
                        bind:this={industry}
                        on:change={onInputChange}
                        name="industry"
                    >
                        <option value="" disabled selected>What's your industry?</option>
                        <option value="Carpet / Uphostery Cleaner">Carpet / Upholstery Cleaner</option>
                        <option value="House / Residential">House / Residential</option>
                        <option value="Office / Commercial">Office / Commercial</option>
                        <option value="Airbnb / Hotel">Airbnb / Hotel</option>
                    </select>
                </div>
                <div class="input-wrapper">
                    <label for="facebook-page">Facebook Page</label>
                    <input
                        bind:this={fb_page}
                        name="facebook-page"
                        type="url"
                        placeholder="https://wwww.facebook.com"
                    />
                </div>
            </div>
            <div class="col-two">
                <div class="input-wrapper">
                    <label for="facebook-page">Email</label>
                    <input
                        bind:this={email}
                        name="email"
                        type="email"
                        placeholder="contact@company.com"
                    />
                </div>
                <div class="input-wrapper">
                    <label for="company-website">Company Website</label>
                    <input
                        bind:this={company_website}
                        name="company-website"
                        type="url"
                        placeholder="https://www.company.com"
                    />
                </div>
                <div class="input-wrapper">
                    <label for="phone">Phone</label>
                    <input
                        bind:this={phone_number}
                        name="phone"
                        type="text"
                        placeholder="+(63) 123 123 1233 or +(048) 433 4324"
                    />
                </div>
            </div>
            <!-- Company Logo -->
            <div class="input-wrapper">
                <label for="company-logo">Company Logo</label>
                <input
                    bind:this={com_log}
                    bind:value={fileInput}
                    name="company-logo"
                    id="company-logo"
                    type="file"
                    accept="image/png, image/jpeg"
                    on:change={(e) => onFileSelected(e)}
                />
                <div class="img-wrapper">
                    <img
                        src="{company_logo}"
                        alt="company logo"
                    />
                </div>
            </div>
        </div>
        <div class="footer-wrapper">
            {#if field_error.found}
                <div class="field-error">
                    <i class="ri-error-warning-fill"></i>
                    <p>{field_error.err_msg}</p>
                </div>
            {/if}
            <div class="footer-button-wrapper">
                <button
                    id="close-btn"
                    class="btn"
                    on:click={onClickClose}
                >
                    Close
                </button>
                <button
                    disabled={!save_ok}
                    id="save-btn"
                    class="btn"
                    on:click={async () => {
                            updating = true
                            await onClickSave()
                            updating = false
                        }
                    }>
                    {#if updating}
                        <span>
                            Updating <Circle size="15" color="#FF3E00" unit="px" duration="1s"/>
                        </span>
                    {:else}
                        <span>Update</span>
                    {/if}
                </button>
            </div>
        </div>
    </form>
</ModalWindow>

<style lang="postcss">
    .form-add-client {
        padding: 0 10px;
        .form-title {
            padding: 0 10px;
            text-align: left;
        }
    }

    .container-two-col {
        display: flex;
        .col-one, .col-two { flex: 1; }
    }

    .input-wrapper {
        display: flex;
        flex-direction: column;
        padding: 10px;
        text-align: left;
        input, select {
            padding: 10px 10px;
        }
    }

    .img-wrapper {
        img {
            object-fit: contain;
            width: 300px;
            height: 250px;
        }
        place-content: center;
        max-width: 300px;
        max-height: 250px;
        width: 300px;
        height: 250px;
    }

    .footer-wrapper {
        display: flex;
        align-items: center;
        height: 70px;
        max-height: 70px;
        .field-error {
            i {
                font-size: 1.5rem;
                padding: 2px;
            }
            padding: 0 5px;
            display: flex;
            align-items: center;
            background-color: rgba(200, 250, 50, 1);
            color: red;
            flex: 2;
            border-left: solid 4px green;
            text-align: left;
        }
        .footer-button-wrapper {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 5px;
        }

        .footer-button-wrapper {
            padding: 20px;
            button {
                span {
                    display: flex;
                    gap: 7px;
                }
                display: flex;
                align-items: center;
                border-radius: 0;
                padding: 10px 25px;
            }
            button:disabled {
                background-color: darkgray;
                opacity: 0.5;
                cursor: arrow;
            }
        }
    }
</style>