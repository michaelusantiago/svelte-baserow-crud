import { writable } from "svelte/store"
import axios from "axios"

export interface Client {
    fld_company_name: string
    fld_company_url: string
    fld_email: string
    fld_fb_page: string
    fld_fullname: string
    fld_industry: string
    fld_logo: any
    fld_phone: string
    id?: number
    order?: number
}

export const clients = writable(null)
export const isLoading = writable(false)

const API_URL = import.meta.env.VITE_API_URL
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN
const UPLOAD_FILE_URL = import.meta.env.VITE_UPLOAD_FILE_URL

export const getClients = async (query: string = null) => {
    isLoading.set(true)
    let params = "?user_field_names=true"
    if (query) params = params + "&search=" + query

    const result = await fetch(API_URL + params,
    {
        method: "GET",
        headers: {
            Authorization: "Token " + BEARER_TOKEN
        }
    })

    const data = await result.json()
    isLoading.set(false)
    clients.set(data.results)

    console.log(data.results)
}

export const addNewClient = async (client: Client) => {
    if (client.fld_logo) {
        const formData = new FormData()
        formData.append("file", client.fld_logo)

        try {
            const upload_result = await fetch(UPLOAD_FILE_URL,
            {
                method: "POST",
                headers: {
                    Authorization: "Token " + BEARER_TOKEN,
                },
                body: formData
            })

            const data = await upload_result.json()
            client.fld_logo = data.url
        } catch (err: any) { console.log(err) }
    }

    // then save Client
    const result = await fetch(API_URL + "?user_field_names=true",
    {
        method: "POST",
        headers: {
            Authorization: "Token " + BEARER_TOKEN,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(client)
    })

    await getClients()
}

export const updateClient = async (client_id: number, client: Client): Promise<any> => {
    // Delete uncessary fields
    delete client.id
    delete client.order
    
    if (client.fld_logo) {
        const formData = new FormData()
        formData.append("file", client.fld_logo)

        try {
            const upload_result = await fetch(UPLOAD_FILE_URL,
            {
                method: "POST",
                headers: {
                    Authorization: "Token " + BEARER_TOKEN,
                },
                body: formData
            })

            const data = await upload_result.json()
            client.fld_logo = data.url
        } catch (err: any) { console.log(err) }
    }

    // Update client
    const result = await fetch(API_URL + client_id + "/?user_field_names=true",
    {
        method: "PATCH",
        headers: {
            Authorization: "Token " + BEARER_TOKEN,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(client)
    })

    const _client = await result.json() as (Client | any)

    if (_client.error) return _client
    else
        // Update only the record affected by update call and not re-reading the entire collection
        clients.update(cs => {
            const client_to_update = cs.find((c: Client) => c.id === _client.id) as Client
            client_to_update.fld_company_name = _client.fld_company_name
            client_to_update.fld_fullname = _client.fld_fullname
            client_to_update.fld_industry = _client.fld_industry
            client_to_update.fld_fb_page = _client.fld_fb_page
            client_to_update.fld_email = _client.fld_email
            client_to_update.fld_company_url = _client.fld_company_url
            client_to_update.fld_phone = _client.fld_phone
            client_to_update.fld_logo = _client.fld_logo

            return cs
        }) 
}

export const deleteClient = async (client_id: number): Promise<any> => {
    //https://api.baserow.io/api/database/rows/table/131590/{row_id}/
    const result = await fetch(API_URL + client_id + "/", {
        method: "DELETE",
        headers: {
            'Authorization': 'Token xg60L33r7cgNZEA3WvZxOjC7PYkxoTYf'
        }
    })

    const _delete_result = await result.json()
    if (_delete_result.error) return _delete_result
    else clients.update(cs => cs.filter((c: Client) => c.id !== client_id))
}

// For uploading image
// const ur = await axios({
//     method: "POST",
//     url: "https://api.baserow.io/api/user-files/upload-file/",
//     headers: {
//         Authorization: "Token " + BEARER_TOKEN,
//         "Content-Type": "multipart/form-data"
//     },
//     data: formData
// })
//  console.log(ur)