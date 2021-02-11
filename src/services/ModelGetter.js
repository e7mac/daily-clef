export default class ModelGetter {
	constructor(api, path, searchParams = {}) {
		this.url = `${api.baseUrl}${path}`
		this.itemsPromise = null
		this.hasMore = true
		this.items = []
		this.api = api
		this.searchParams = searchParams
	}

	loadItems() {
		if (this.url !== null) {
			if (this.itemsPromise === null) {
				this.makeApiCall()
			}
		}
		return this.itemsPromise
	}

	loadMoreItems() {
		if (this.url !== null && this.hasMore) {
			this.makeApiCall()
		}
		return this.itemsPromise
	}

	makeApiCall() {
		this.itemsPromise = this.api.apiCall(this.url, {
			method: 'GET'
		}, this.searchParams)
			.then((response) => {
				this.items = this.items.concat(response.results);

				this.hasMore = (response.next !== null)
				// const url = new URL(response.next)
				// this.url = `${this.api.baseUrl}${url.pathname}${url.search}`
				this.url = response.next
				return this.items
			})
			.catch(error => console.log("error: " + error));
	}
}
